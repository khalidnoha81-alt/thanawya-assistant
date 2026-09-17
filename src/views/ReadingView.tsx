import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Camera,
  Sparkles,
  Loader2,
  BookOpen,
  Search,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { TeacherSolutionCard } from '../components/TeacherSolutionCard';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { MOCK_EXAM_DATA } from '../data/thanaweyaData';
import { logSolvedQuestion } from '../services/firebase';

interface ReadingViewProps {
  userId?: string;
  onQuestionSolved?: () => void;
  onSaveBookmark?: (title: string, content: string) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({
  userId = 'guest',
  onQuestionSolved,
  onSaveBookmark,
}) => {
  const [passageText, setPassageText] = useState('');
  const [readingQuestion, setReadingQuestion] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSamplePassage = () => {
    setPassageText(MOCK_EXAM_DATA.readingPassage.text);
    setReadingQuestion('1. ما الفكرة الرئيسية للقطعة؟\n2. استخرج الكلمات الصعبة مع ترجمتها.\n3. ما الدليل من النص على أهمية التكنولوجيا في التعليم؟');
  };

  const handleAnalyzePassage = async () => {
    if (!passageText.trim() && !selectedImage) return;

    setIsLoading(true);
    setSolution(null);

    const promptText = `
تحليل قطعة فهم قراءة (Reading Comprehension) لامتحان الثانوية العامة:
نص القطعة:
"""
${passageText}
"""

السؤال / المطلوب من الطالب:
"${readingQuestion || 'تحليل شامل للقطعة: الفكرة الرئيسية، استخراج الكلمات الصعبة، ملخص، ونبرة الكاتب (Tone)'}"

المطلوب إخراجه بدقة بالغة:
1. الفكرة الرئيسية للقطعة (Main Idea) وتلخيص مركز في 3 أسطر.
2. استخراج الكلمات والمصطلحات الصعبة بالقطعة مع ترجمتها وسياقها في الامتحان.
3. الإجابة على أسئلة الطالب مع تحديد **الدليل القاطع من سطور النص (Proof from text)**.
4. نبرة الكاتب وموقفه (Author's Tone & Attitude - e.g. objective, optimistic, critical).
5. تريكات أسئلة الاستنتاج (Inference questions) التي تتكرر في امتحانات الثانوية.
    `;

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'reading',
          prompt: promptText,
          image: selectedImage,
        }),
      });

      const data = await response.json().catch(() => ({}));
      const answer = data.text || (data.error ? `⚠️ ${data.error}` : 'تعذر تحليل القطعة.');
      setSolution(answer);

      if (userId) {
        logSolvedQuestion({
          userId,
          category: 'reading',
          prompt: readingQuestion || 'تحليل قطعة فهم',
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
      setSolution(`عذراً، حدث خطأ أثناء تحليل القطعة: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              محلل قطع القراءة والفهم (Reading Comprehension)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              استخراج الكلمات الصعبة، حل الأسئلة مع الدليل، وتحليل الفكرة والنبرة
            </p>
          </div>
        </div>

        <button
          onClick={handleLoadSamplePassage}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 transition"
        >
          تحميل قطعة ثانوية عامة نموذجية للتجربة
        </button>
      </div>

      {/* Main Form */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">
            الصق نص القطعة الإنجليزية (أو ارفع صورتها):
          </label>
          <textarea
            value={passageText}
            onChange={(e) => setPassageText(e.target.value)}
            rows={6}
            placeholder="Paste the reading passage text here..."
            className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition leading-relaxed font-sans"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">
            سؤال محدد عن القطعة تريد الإجابة عليه واستخراج دليله (اختياري):
          </label>
          <input
            type="text"
            value={readingQuestion}
            onChange={(e) => setReadingQuestion(e.target.value)}
            placeholder="مثال: What does the underlined pronoun 'they' refer to? أو ما الفكرة الرئيسية؟"
            className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
          />
        </div>

        {/* Media & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>ارفع صورة القطعة</span>
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
              <span>التقط بالكاميرا</span>
            </button>
          </div>

          <button
            onClick={handleAnalyzePassage}
            disabled={isLoading || (!passageText.trim() && !selectedImage)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:pointer-events-none transition transform active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تحليل القطعة واستخراج الأدلة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>تحليل القطعة والإجابة بالدليل</span>
              </>
            )}
          </button>
        </div>

        {/* Selected Image */}
        {selectedImage && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-amber-500/30">
            <div className="flex items-center gap-3">
              <img
                src={selectedImage}
                alt="Reading Preview"
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="text-xs font-bold text-amber-300">
                صورة القطعة جاهزة للـ OCR
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
      </div>

      {/* Solution */}
      {solution && (
        <TeacherSolutionCard
          rawText={solution}
          categoryTitle="تحليل قطعة الفهم واستخراج الأدلة والكلمات"
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
