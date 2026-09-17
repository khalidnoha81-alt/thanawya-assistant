import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Sparkles,
  Upload,
  Camera,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { TeacherSolutionCard } from '../components/TeacherSolutionCard';
import { CameraCaptureModal } from '../components/CameraCaptureModal';
import { THANAWEYA_GRAMMAR_QUIZ } from '../data/thanaweyaData';
import { logSolvedQuestion } from '../services/firebase';

interface GrammarViewProps {
  userId?: string;
  onQuestionSolved?: () => void;
  onSaveBookmark?: (title: string, content: string) => void;
}

export const GrammarView: React.FC<GrammarViewProps> = ({
  userId = 'guest',
  onQuestionSolved,
  onSaveBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'ask' | 'quiz'>('ask');
  const [grammarQuery, setGrammarQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const units = [
    'Unit 1: Past Simple, Past Continuous & Past Perfect',
    'Unit 2: Present Perfect Simple & Continuous',
    'Unit 3: Future Forms (will, going to, present cont, present simple)',
    'Unit 4: Relative Clauses & Pronouns (who, which, whose, where)',
    'Unit 5: Phrasal Verbs & Prepositions',
    'Unit 6: Passive Voice & Causative Verbs',
    'Unit 7: Modals of Deduction & Necessity',
    'Unit 8: Conditionals (Zero, 1st, 2nd, 3rd & Alternatives)',
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

  const handleSolveGrammar = async () => {
    if (!grammarQuery.trim() && !selectedImage) return;

    setIsLoading(true);
    setSolution(null);

    const promptText = `
سؤال جرامر وقواعد منهج اللغة الإنجليزية للثانوية العامة:
السؤال / الجملة / القاعدة: "${grammarQuery}"

المطلوب بدقة:
1. Explain rule in simple Arabic (شرح القاعدة بالعربي بأسلوب مبسط جداً).
2. Show clear examples (أمثلة توضيحية من سياق المنهج).
3. Why other options are wrong (لو كان السؤال اختيار من متعدد، شرح سبب استبعاد كل اختيار خاطئ بالتفصيل).
4. Exam Tips & Traps (أهم الأفخاخ الامتحانية التي يضعها مستشار اللغة الإنجليزية في هذا الدرس).
    `;

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'grammar',
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
          category: 'grammar',
          prompt: grammarQuery || 'سؤال قواعد عبر صورة',
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
      setSolution(`عذراً، حدث خطأ أثناء شرح القواعد: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQ = THANAWEYA_GRAMMAR_QUIZ[currentQuizIndex];

  const handleOptionClick = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentQuizIndex < THANAWEYA_GRAMMAR_QUIZ.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      alert(`عاش يا بطل! أنهيت اختبار القواعد بنتيجة ${quizScore + (selectedOption === currentQ.correctIndex ? 1 : 0)} من ${THANAWEYA_GRAMMAR_QUIZ.length}`);
      setCurrentQuizIndex(0);
      setQuizScore(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              قسم قواعد المنهج (Grammar Master)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              شرح القواعد بالعربي، استبعاد المشتتات، وحل التمارين التفاعلية
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('ask')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ask'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            اسأل في أي قاعدة / MCQ
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            اختبار تفاعلي على الوحدات
          </button>
        </div>
      </div>

      {activeTab === 'ask' ? (
        <>
          {/* Ask Grammar Form */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                اكتب سؤالك في القواعد أو جملة الاختيارات (MCQ):
              </label>
              <textarea
                value={grammarQuery}
                onChange={(e) => setGrammarQuery(e.target.value)}
                rows={4}
                placeholder="اكتب الجملة هنا مع الاختيارات إن وجدت... مثال: While I ________ yesterday, the lights went out. (was doing / did / had done)"
                className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-2xl p-4 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none transition leading-relaxed"
              />
            </div>

            {/* Media & Action buttons */}
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
                  <span>التقط بالكاميرا</span>
                </button>
              </div>

              <button
                onClick={handleSolveGrammar}
                disabled={isLoading || (!grammarQuery.trim() && !selectedImage)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:pointer-events-none transition transform active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تحليل القاعدة والخيارات...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>اشرح وحل السؤال</span>
                  </>
                )}
              </button>
            </div>

            {/* Uploaded Image Preview */}
            {selectedImage && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-amber-500/30">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedImage}
                    alt="Grammar Question Preview"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <span className="text-xs font-bold text-amber-300">
                    تم إرفاق صورة السؤال
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-xs text-rose-400 hover:underline font-bold"
                >
                  حذف الصورة
                </button>
              </div>
            )}

            {/* Curriculum Units list */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400">
                وحدات الجرامر المقررة (New Hello 3rd Secondary):
              </span>
              <div className="flex flex-wrap gap-2">
                {units.map((unit, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGrammarQuery(`اشرح لي أهم تريكات وقواعد ${unit} بأسلوب مبسط وامتحاني.`)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition text-right truncate max-w-xs"
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Solution Display */}
          {solution && (
            <TeacherSolutionCard
              rawText={solution}
              categoryTitle="شرح الجرامر وكشف الاختيارات الخاطئة"
              onSaveBookmark={onSaveBookmark}
            />
          )}
        </>
      ) : (
        /* Interactive Quiz Mode */
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-400">
              السؤال {currentQuizIndex + 1} من {THANAWEYA_GRAMMAR_QUIZ.length}
            </span>
            <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              درجاتك الحالية: {quizScore}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>{currentQ.unit}</span>
              <span>•</span>
              <span className="text-amber-300">{currentQ.category}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-600';
                if (selectedOption === idx) {
                  btnStyle = 'bg-amber-500/15 border-amber-500 text-amber-200 font-bold';
                }
                if (isSubmitted) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                  } else if (selectedOption === idx) {
                    btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full p-4 rounded-xl border text-right transition flex items-center justify-between text-sm ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSubmitted && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {isSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Box when submitted */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <HelpCircle className="w-4 h-4" />
                <span>شرح المستر وتوضيح القاعدة:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-500">
              أسئلة تحاكي نظام التابلت والبوكليت
            </span>

            {!isSubmitted ? (
              <button
                onClick={handleSubmitQuizAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-40 transition"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuizQuestion}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
              >
                السؤال التالي
              </button>
            )}
          </div>
        </div>
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
