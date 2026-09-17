import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Upload,
  Camera,
  Sparkles,
  Loader2,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { TeacherSolutionCard } from '../components/TeacherSolutionCard';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { logSolvedQuestion } from '../services/firebase';

interface RewriteViewProps {
  userId?: string;
  onQuestionSolved?: () => void;
  onSaveBookmark?: (title: string, content: string) => void;
}

export const RewriteView: React.FC<RewriteViewProps> = ({
  userId = 'guest',
  onQuestionSolved,
  onSaveBookmark,
}) => {
  const [originalSentence, setOriginalSentence] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const presets = [
    {
      sentence: 'He didn\'t attend the meeting because he was extremely ill.',
      word: 'Owing to',
      rule: 'Cause & Reason (Owing to + Noun/V-ing)',
    },
    {
      sentence: 'If you don\'t study with perseverance, you will never get 99%.',
      word: 'Unless',
      rule: 'Conditionals (Unless = If not)',
    },
    {
      sentence: 'The mechanic repaired Mr. Tarek\'s car yesterday.',
      word: 'had',
      rule: 'Causative (Have something done)',
    },
    {
      sentence: 'I haven\'t tasted such delicious Egyptian food for years.',
      word: 'since',
      rule: 'Present Perfect & Time expressions',
    },
    {
      sentence: 'As soon as he had arrived at the station, the train left.',
      word: 'Hardly',
      rule: 'Inversion (Hardly had he arrived...)',
    },
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

  const handleSolve = async () => {
    if (!originalSentence.trim() && !selectedImage) return;

    setIsLoading(true);
    setSolution(null);

    const promptText = `
سؤال Rewrite / Sentence Transformation:
الجملة الأصلية: "${originalSentence}"
الكلمة الإلزامية المطلوب استخدامها بين القوسين: "${keyword || 'بدون كلمة محددة (إعادة صياغة)'}"

المطلوب بدقة:
1. Rule: شرح القاعدة بالعربي المبسط.
2. Change: توضيح التغيير الذي حدث خطوة بخطوة ولماذا.
3. Answer: الجملة النهائية المطلوبة للامتحان.
4. Exam Note: الأخطاء الشائعة والأفخاخ التي يقع فيها طلاب الثانوية العامة في هذا السؤال.
    `;

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'rewrite',
          prompt: promptText,
          image: selectedImage,
        }),
      });

      const data = await response.json().catch(() => ({}));
      const answer = data.text || (data.error ? `⚠️ ${data.error}` : 'تعذر تحليل السؤال، حاول ثانية.');
      setSolution(answer);

      if (userId) {
        logSolvedQuestion({
          userId,
          category: 'rewrite',
          prompt: `${originalSentence} (${keyword})`,
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
      setSolution(`عذراً، حدث خطأ أثناء حل التحويل: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              قسم التحويل وإعادة الصياغة (Rewrite Assistant)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              تحليل القواعد النحوية، خطوات التحويل، وضمان سلامة المعنى 100%
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300">
              الجملة الأصلية (Original Sentence):
            </label>
            <textarea
              value={originalSentence}
              onChange={(e) => setOriginalSentence(e.target.value)}
              rows={3}
              placeholder="اكتب الجملة المراد تحويلها، مثال: He didn't attend because he was ill..."
              className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">
              الكلمة المطلوبة بين القوسين (Keyword):
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="مثال: (Unless / Owing to / Had)"
              className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
            />
            <p className="text-[11px] text-slate-500">
              يمكنك تركها فارغة لتحويل الجملة وصياغتها بأكثر من شكل امتحاني.
            </p>
          </div>
        </div>

        {/* Media Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>ارفع صورة من الكتاب</span>
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>التقط بكاميرا الموبايل</span>
            </button>
          </div>

          <button
            onClick={handleSolve}
            disabled={isLoading || (!originalSentence.trim() && !selectedImage)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:pointer-events-none transition transform active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تحليل التحويل...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>حل جملة الـ Rewrite</span>
              </>
            )}
          </button>
        </div>

        {/* Uploaded Image preview */}
        {selectedImage && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-amber-500/30">
            <div className="flex items-center gap-3">
              <img
                src={selectedImage}
                alt="Rewrite Preview"
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="text-xs font-bold text-amber-300">
                صورة السؤال جاهزة للقراءة
              </span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-xs text-rose-400 hover:underline font-bold"
            >
              حذف
            </button>
          </div>
        )}

        {/* Quick presets */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-400">
            أشهر جمل التحويل في امتحانات الثانوية العامة:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setOriginalSentence(p.sentence);
                  setKeyword(p.word);
                }}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-right transition flex items-center justify-between text-xs"
              >
                <div className="truncate max-w-[280px]">
                  <p className="font-semibold text-slate-200 truncate">{p.sentence}</p>
                  <p className="text-[11px] text-amber-400 font-medium">({p.word}) - {p.rule}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Solution Display */}
      {solution && (
        <TeacherSolutionCard
          rawText={solution}
          categoryTitle="تحليل التحويل (Rule - Change - Answer - Exam Note)"
          onSaveBookmark={onSaveBookmark}
        />
      )}

      {/* Live Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setSelectedImage(img)}
      />
    </div>
  );
};
