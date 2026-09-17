import React, { useState, useRef } from 'react';
import {
  Send,
  Upload,
  Camera,
  Bot,
  User,
  Sparkles,
  Loader2,
  Trash2,
  Image as ImageIcon,
  BookOpen,
  HelpCircle,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { TeacherSolutionCard } from '../components/TeacherSolutionCard';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { SolvedQuestion, logSolvedQuestion } from '../services/firebase';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  image?: string;
  timestamp: string;
}

interface AssistantViewProps {
  userId?: string;
  onQuestionSolved?: () => void;
  onSaveBookmark?: (title: string, content: string) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  userId = 'guest',
  onQuestionSolved,
  onSaveBookmark,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `أهلاً بك يا بطل الثانوية العامة! 🎓
أنا "مساعد الثانوية العامة" - معلمك الذكي لمادة اللغة الإنجليزية المطور بواسطة محمد خالد.

يمكنك أن:
1. تكتب أي سؤال في القواعد أو الكلمات أو الترجمة أو القصة.
2. ترفع صورة من كتاب المعاصر أو جيم أو نماذج الوزارة.
3. تلتقط صورة فورية لورقة الامتحان أو كشكولك عبر الكاميرا.

سأشرح لك السؤال بالخطوات الخمسة المعتمدة ونكشف تريكات واضع الامتحان معاً! تفضل بطرح سؤالك الآن 👇`,
      timestamp: 'الآن',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const sampleQuestions = [
    'Unit 1: الفرق بين past simple و past continuous مع while و as و just as؟',
    'Translate into English: تسعى مصر جاهدة لجذب الاستثمارات الأجنبية وتنفيذ مشروعات الطاقة الخضراء.',
    'Rewrite: If he hadn\'t helped me, I would have failed. (Without)',
    'Vocabulary: الفرق في الامتحان بين win و gain و earn و beat؟',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputPrompt;
    if (!textToSend.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      image: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    const imagePayload = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'assistant',
          prompt: textToSend,
          image: imagePayload,
        }),
      });

      let assistantText = '';

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        assistantText =
          errorData.text ||
          errorData.error ||
          '⚠️ واجه الخادم ضغطاً مؤقتاً، يرجى الانتظار بضع ثوانٍ وإعادة المحاولة.';
      } else {
        const data = await response.json();
        assistantText = data.text || 'لم أتمكن من الحصول على إجابة، يرجى المحاولة ثانية.';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Log to Firebase history
      if (userId) {
        logSolvedQuestion({
          userId,
          category: 'assistant',
          prompt: textToSend || 'سؤال عبر صورة OCR',
          imageThumbnail: imagePayload ? imagePayload.slice(0, 100) : undefined,
          solution: assistantText,
          createdAt: new Date().toISOString(),
        });
      }

      if (onQuestionSolved) {
        onQuestionSolved();
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `⚠️ عذراً يا بطل، حدث خطأ أثناء معالجة السؤال: ${err.message || 'خطأ غير معروف'}. يرجى التأكد من اتصال الإنترنت وإعادة المحاولة.`,
          timestamp: 'الآن',
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('هل تريد مسح المحادثة الحالية والبدء من جديد؟')) {
      setMessages([
        {
          id: 'welcome-new',
          sender: 'assistant',
          text: 'تم بدء محادثة تعليمية جديدة. تفضل بطرح سؤالك الآن!',
          timestamp: 'الآن',
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-2xl mb-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>المساعد الذكي العام (ChatGPT-Style)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                متصل وجاهز
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              يدعم النصوص والصور الملتقطة بالكاميرا ووثائق الامتحانات
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title="مسح المحادثة"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition text-xs flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">محادثة جديدة</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                  isUser
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-amber-400 border border-amber-500/30'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2 flex-1 min-w-0">
                {msg.image && (
                  <div className="rounded-xl overflow-hidden border border-slate-700/80 max-w-sm">
                    <img
                      src={msg.image}
                      alt="Uploaded Question"
                      className="w-full max-h-60 object-contain bg-black/40"
                    />
                  </div>
                )}

                {isUser ? (
                  <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-100 font-medium text-sm sm:text-base leading-relaxed">
                    {msg.text}
                  </div>
                ) : msg.id.startsWith('welcome') ? (
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line shadow-xl">
                    {msg.text}
                  </div>
                ) : (
                  <TeacherSolutionCard
                    rawText={msg.text}
                    categoryTitle="إجابة المستر المعتمدة"
                    onSaveBookmark={onSaveBookmark}
                  />
                )}

                <span className="block text-[10px] text-slate-500 text-left px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-2xl ml-auto animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 text-sm text-slate-300">
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
              <span>المستر يقرأ السؤال الآن ويحلل تريكات واضع الامتحان...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Preset sample questions */}
      {messages.length <= 2 && (
        <div className="px-2 py-2 flex flex-wrap gap-2 mb-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition hover:border-amber-500/40 text-right truncate max-w-xs"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Tray */}
      <div className="relative p-3 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl">
        {/* Selected image preview chip */}
        {selectedImage && (
          <div className="flex items-center gap-2 p-2 mb-2 rounded-xl bg-slate-950 border border-amber-500/30 max-w-fit">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-lg"
            />
            <span className="text-xs font-semibold text-amber-300">
              تم إرفاق صورة السؤال (جاهزة للـ OCR)
            </span>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-1 text-slate-400 hover:text-rose-400 text-xs"
            >
              إلغاء
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Action buttons (Camera, Upload) */}
          <div className="flex items-center gap-1 shrink-0 pb-1">
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              title="التقط صورة بالكاميرا"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
            >
              <Camera className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="ارفع صورة أو ملف"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <Upload className="w-5 h-5" />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Textarea */}
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="اكتب سؤالك هنا أو ارفع صورة ورقة الامتحان..."
            rows={2}
            className="flex-1 bg-slate-950/80 border border-slate-700/80 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 resize-none focus:outline-none transition"
          />

          {/* Submit button */}
          <button
            onClick={() => handleSend()}
            disabled={isLoading || (!inputPrompt.trim() && !selectedImage)}
            className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:pointer-events-none transition transform active:scale-95 shrink-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Live Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setSelectedImage(img)}
      />
    </div>
  );
};
