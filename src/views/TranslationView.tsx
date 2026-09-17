import React, { useState, useRef } from 'react';
import {
  Languages,
  Upload,
  Camera,
  ArrowRightLeft,
  Sparkles,
  Loader2,
  FileText,
  Copy,
  Check,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { TeacherSolutionCard } from '../components/TeacherSolutionCard';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { logSolvedQuestion } from '../services/firebase';

interface TranslationViewProps {
  userId?: string;
  onQuestionSolved?: () => void;
  onSaveBookmark?: (title: string, content: string) => void;
}

export const TranslationView: React.FC<TranslationViewProps> = ({
  userId = 'guest',
  onQuestionSolved,
  onSaveBookmark,
}) => {
  const [activeMode, setActiveMode] = useState<'ar_to_en' | 'en_to_ar' | 'image'>('ar_to_en');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const presetsArToEn = [
    'تسعى الحكومة المصرية جاهدة لتطوير البنية التحتية وإنشاء مدن ذكية مستدامة.',
    'إن بناء الإنسان المصري هو الركيزة الأساسية لتحقيق النهضة الاقتصادية الشاملة.',
    'يجب علينا ترشيد استهلاك المياه والكهرباء من أجل الحفاظ على الموارد للأجيال القادمة.',
  ];

  const presetsEnToAr = [
    'Youth empowerment and digital literacy are key drivers for national prosperity.',
    'Patience and continuous learning pave the way for extraordinary achievements.',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setActiveMode('image');
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!inputText.trim() && !selectedImage) return;

    setIsLoading(true);
    setSolution(null);

    const modeDescription =
      activeMode === 'ar_to_en'
        ? 'ترجمة من العربية إلى الإنجليزية (مع بدائل مقبولة وبنك مفردات وملاحظات قواعدية)'
        : activeMode === 'en_to_ar'
        ? 'ترجمة من الإنجليزية إلى العربية (مع شرح المعاني الدقيقة والسياق)'
        : 'قراءة صورة سؤال الترجمة وحلها مع البدائل';

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'translation',
          prompt: inputText,
          image: selectedImage,
          mode: modeDescription,
        }),
      });

      const data = await response.json().catch(() => ({}));
      const answer = data.text || (data.error ? `⚠️ ${data.error}` : 'تعذر استخراج الترجمة، حاول ثانية.');
      setSolution(answer);

      if (userId) {
        logSolvedQuestion({
          userId,
          category: 'translation',
          prompt: inputText || 'سؤال ترجمة عبر صورة',
          imageThumbnail: selectedImage ? selectedImage.slice(0, 100) : undefined,
          solution: answer,
          createdAt: new Date().toISOString(),
        });
      }

      if (onQuestionSolved) {
        onQuestionSolved();
      }
    } catch (err: any) {
      console.error(err);
      setSolution(`عذراً، حدث خطأ: ${err.message || 'خطأ أثناء الترجمة'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              مساحة الترجمة المتخصصة (Translation Workspace)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              ترجمة امتحان الثانوية العامة مع المفردات الصعبة والبدائل المقبولة
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveMode('ar_to_en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeMode === 'ar_to_en'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            عربي ⬅ إنجليزي
          </button>
          <button
            onClick={() => setActiveMode('en_to_ar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeMode === 'en_to_ar'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            إنجليزي ⬅ عربي
          </button>
          <button
            onClick={() => setActiveMode('image')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeMode === 'image'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            صورة OCR
          </button>
        </div>
      </div>

      {/* Main Translation Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Buttons Row: اكتب السؤال | ارفع صورة | التقط صورة | حل السؤال */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedImage(null);
                setInputText('');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>اكتب السؤال</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>ارفع صورة</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>التقط صورة</span>
            </button>
          </div>

          <button
            onClick={handleSolve}
            disabled={isLoading || (!inputText.trim() && !selectedImage)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:pointer-events-none transition transform active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري حل الترجمة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>حل السؤال</span>
              </>
            )}
          </button>
        </div>

        {/* Uploaded image banner if any */}
        {selectedImage && (
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-black/40 p-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedImage}
                alt="Uploaded translation question"
                className="w-16 h-16 object-contain rounded-lg bg-black"
              />
              <div>
                <p className="text-xs font-bold text-amber-300">
                  تم إرفاق صورة السؤال بنجاح
                </p>
                <p className="text-[11px] text-slate-400">
                  سيقوم الذكاء الاصطناعي بقراءة النص تلقائياً وترجمته
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 font-bold"
            >
              إزالة الصورة
            </button>
          </div>
        )}

        {/* Text input area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>
              {activeMode === 'ar_to_en'
                ? 'الجملة أو الفقرة باللغة العربية:'
                : activeMode === 'en_to_ar'
                ? 'Sentence or paragraph in English:'
                : 'أو اكتب نص السؤال مع الصورة (اختياري):'}
            </span>
            <span className="text-[11px] text-slate-500">
              {inputText.length} حرف
            </span>
          </label>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder={
              activeMode === 'ar_to_en'
                ? 'اكتب الجملة العربية هنا، مثال: يجب على الشباب استغلال أوقات فراغهم في اكتساب مهارات جديدة...'
                : activeMode === 'en_to_ar'
                ? 'Type the English sentence here, e.g., Youth must invest their leisure time in acquiring new skills...'
                : 'اكتب أي ملاحظة أو دع الذكاء الاصطناعي يستخرج النص من الصورة المرفقة مباشرة...'
            }
            className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-2xl p-4 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none transition leading-relaxed"
          />
        </div>

        {/* Preset suggestions */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-400">
            نماذج من امتحانات الأعوام السابقة للتجربة السريعة:
          </span>
          <div className="flex flex-wrap gap-2">
            {(activeMode === 'ar_to_en' ? presetsArToEn : presetsEnToAr).map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(preset)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition text-right max-w-sm truncate"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Solution Display */}
      {solution && (
        <TeacherSolutionCard
          rawText={solution}
          categoryTitle="حل وافي لسؤال الترجمة وبنك المفردات"
          onSaveBookmark={onSaveBookmark}
        />
      )}

      {/* Live Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => {
          setSelectedImage(img);
          setActiveMode('image');
        }}
      />
    </div>
  );
};
