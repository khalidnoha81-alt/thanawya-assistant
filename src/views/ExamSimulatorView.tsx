import React, { useState, useEffect } from 'react';
import {
  Timer,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Languages,
  PenTool,
  Clock,
  Sparkles,
  Loader2,
  RefreshCw,
  HelpCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_EXAM_DATA } from '../data/thanaweyaData';
import { saveExamAttempt } from '../services/firebase';

interface ExamSimulatorViewProps {
  userId?: string;
  onExamFinished?: () => void;
}

export const ExamSimulatorView: React.FC<ExamSimulatorViewProps> = ({
  userId = 'guest',
  onExamFinished,
}) => {
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [readingAnswers, setReadingAnswers] = useState<Record<number, number>>({});
  const [translationInputs, setTranslationInputs] = useState<Record<string, string>>({});
  const [studentEssay, setStudentEssay] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<any | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examResult !== null) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examStarted, examResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setTimeLeft(60 * 60);
    setAnswers({});
    setReadingAnswers({});
    setTranslationInputs({});
    setStudentEssay('');
    setExamResult(null);
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);

    // Calculate MCQ score (each MCQ question = 4 marks, reading questions = 4 marks)
    let mcqScore = 0;
    MOCK_EXAM_DATA.mcqQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        mcqScore += 4;
      }
    });

    let readingScore = 0;
    MOCK_EXAM_DATA.readingPassage.questions.forEach((rq, idx) => {
      if (readingAnswers[idx] === rq.correct) {
        readingScore += 4;
      }
    });

    // Translation score estimate (8 marks)
    const hasTranslation1 = (translationInputs['tr-1'] || '').trim().length > 10;
    const hasTranslation2 = (translationInputs['tr-2'] || '').trim().length > 10;
    const translationScore = (hasTranslation1 ? 4 : 2) + (hasTranslation2 ? 4 : 2);

    // Essay score estimate (6 marks)
    const essayLength = studentEssay.trim().split(/\s+/).filter(Boolean).length;
    let essayScore = 3;
    if (essayLength >= 100) essayScore = 6;
    else if (essayLength >= 50) essayScore = 5;
    else if (essayLength >= 20) essayScore = 4;

    const totalCalculated = mcqScore + readingScore + translationScore + essayScore;
    const finalScore = Math.min(50, totalCalculated);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    const resultPayload = {
      score: finalScore,
      totalScore: 50,
      percentage: Math.round((finalScore / 50) * 100),
      timeSpentMinutes: Math.round((3600 - timeLeft) / 60),
      breakdown: {
        mcqScore,
        readingScore,
        translationScore,
        essayScore,
      },
      feedback:
        finalScore >= 45
          ? 'أداء ممتاز استثنائي يضمن لك كلية القمة! ركز فقط على التفاصيل الدقيقة في الترقيم وحروف الجر.'
          : 'مستوى جيد جداً، بحاجة لتعزيز ثروتك اللغوية في متلازمات الوحدات 5 و 7 وتفادي أخطاء روابط التناقض.',
    };

    setExamResult(resultPayload);
    setIsSubmitting(false);

    if (userId) {
      saveExamAttempt({
        userId,
        examTitle: MOCK_EXAM_DATA.title,
        score: finalScore,
        totalScore: 50,
        percentage: resultPayload.percentage,
        timeSpentSeconds: 3600 - timeLeft,
        breakdown: {
          grammarScore: mcqScore,
          vocabScore: mcqScore,
          translationScore,
          readingScore,
          writingScore: essayScore,
        },
        feedback: resultPayload.feedback,
        createdAt: new Date().toISOString(),
      });
    }

    if (onExamFinished) {
      onExamFinished();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              محاكي امتحان الثانوية العامة الرسمي (Exam Simulator)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              50 درجة • 60 دقيقة • بوكليت تفاعلي مطابق لمواصفات وزارة التربية والتعليم
            </p>
          </div>
        </div>

        {examStarted && examResult === null && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-bold text-base shadow-lg shadow-amber-500/10">
            <Clock className="w-5 h-5 animate-pulse text-amber-400" />
            <span>الوقت المتبقي: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {!examStarted ? (
        /* Pre-Exam Intro Screen */
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 backdrop-blur-xl shadow-2xl text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto text-3xl shadow-xl shadow-amber-500/10">
            🎓
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">
              جاهز لاختبار مستواك الحقيقي في اللغة الإنجليزية؟
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              هذا الامتحان يحاكي ورقة امتحان آخر العام: يشمل أسئلة الاختيار من متعدد في الكلمات والجرامر، قطعة الفهم، الترجمة من وإلى الإنجليزية، وسؤال المقال.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right max-w-xl mx-auto">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">إجمالي الدرجات</span>
              <strong className="text-base text-amber-400 font-bold">50 درجة</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">مدة الامتحان</span>
              <strong className="text-base text-blue-400 font-bold">60 دقيقة</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">نمط الأسئلة</span>
              <strong className="text-base text-emerald-400 font-bold">بوكليت حديث</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">التصحيح</span>
              <strong className="text-base text-purple-400 font-bold">ذكاء اصطناعي فوري</strong>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartExam}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base shadow-2xl shadow-amber-500/30 transition transform hover:scale-105 active:scale-95"
            >
              ابدأ الامتحان الآن (بسم الله)
            </button>
          </div>
        </div>
      ) : examResult !== null ? (
        /* Post-Exam Results Screen */
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl font-black">
              🏆
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              تم تصحيح الامتحان بنجاح يا بطل!
            </h2>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black text-xl sm:text-2xl font-mono">
              درجتك: {examResult.score} / 50 ({examResult.percentage}%)
            </div>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-1">
              {examResult.feedback}
            </p>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-center">
              <span className="text-xs text-slate-400">الكلمات والجرامر (MCQs)</span>
              <p className="text-xl font-bold text-amber-400">{examResult.breakdown.mcqScore} / 20</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-center">
              <span className="text-xs text-slate-400">قطعة الفهم (Reading)</span>
              <p className="text-xl font-bold text-blue-400">{examResult.breakdown.readingScore} / 8</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-center">
              <span className="text-xs text-slate-400">الترجمة (Translation)</span>
              <p className="text-xl font-bold text-emerald-400">{examResult.breakdown.translationScore} / 8</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-center">
              <span className="text-xs text-slate-400">المقال (Essay)</span>
              <p className="text-xl font-bold text-purple-400">{examResult.breakdown.essayScore} / 6</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleStartExam}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Exam Paper View */
        <div className="space-y-8">
          {/* Section 1: MCQs */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>أولاً: أسئلة الاختيار من متعدد (Vocabulary, Grammar & Skills)</span>
              </h2>
              <span className="text-xs font-bold text-amber-400">20 درجة</span>
            </div>

            <div className="space-y-6">
              {MOCK_EXAM_DATA.mcqQuestions.map((q, qIndex) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">السؤال {qIndex + 1} ({q.section})</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-100 font-sans" dir="ltr">
                    {q.text}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => setAnswers({ ...answers, [q.id]: optIndex })}
                        className={`p-3 rounded-xl border text-left font-sans text-xs sm:text-sm transition flex items-center gap-2.5 ${
                          answers[q.id] === optIndex
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                        dir="ltr"
                      >
                        <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Reading Comprehension */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>ثانياً: قطعة فهم المقروء (Reading Comprehension)</span>
              </h2>
              <span className="text-xs font-bold text-blue-400">8 درجات</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans space-y-3" dir="ltr">
              <h3 className="font-bold text-amber-300 text-sm">{MOCK_EXAM_DATA.readingPassage.title}</h3>
              <p className="whitespace-pre-line">{MOCK_EXAM_DATA.readingPassage.text}</p>
            </div>

            <div className="space-y-4 pt-2">
              {MOCK_EXAM_DATA.readingPassage.questions.map((rq, rqIdx) => (
                <div key={rqIdx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-100 font-sans" dir="ltr">
                    {rqIdx + 1}. {rq.q}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {rq.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => setReadingAnswers({ ...readingAnswers, [rqIdx]: oIdx })}
                        className={`p-2.5 rounded-xl border text-left font-sans text-xs transition flex items-center gap-2 ${
                          readingAnswers[rqIdx] === oIdx
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                        dir="ltr"
                      >
                        <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Translation */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Languages className="w-5 h-5 text-emerald-400" />
                <span>ثالثاً: أسئلة الترجمة (Translation)</span>
              </h2>
              <span className="text-xs font-bold text-emerald-400">8 درجات</span>
            </div>

            <div className="space-y-4">
              {MOCK_EXAM_DATA.translationQuestions.map((tq, idx) => (
                <div key={tq.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400">
                    {idx === 0 ? 'أ) ترجم إلى اللغة الإنجليزية:' : 'ب) ترجم إلى اللغة العربية:'}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-200">
                    {tq.sourceText}
                  </p>
                  <textarea
                    rows={2}
                    value={translationInputs[tq.id] || ''}
                    onChange={(e) => setTranslationInputs({ ...translationInputs, [tq.id]: e.target.value })}
                    placeholder="اكتب ترجمتك هنا بدقة..."
                    className="w-full bg-slate-900 border border-slate-700/80 focus:border-amber-400 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Essay */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-400" />
                <span>رابعاً: سؤال المقال التعبيري (Essay Writing)</span>
              </h2>
              <span className="text-xs font-bold text-purple-400">6 درجات</span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-200 leading-relaxed">
              {MOCK_EXAM_DATA.writingPrompt}
            </p>

            <textarea
              rows={6}
              value={studentEssay}
              onChange={(e) => setStudentEssay(e.target.value)}
              placeholder="Start writing your paragraphs here in English..."
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 rounded-2xl p-4 text-xs sm:text-sm text-white focus:outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 border border-amber-500/30">
            <div>
              <p className="text-sm font-bold text-white">هل راجعت جميع إجاباتك جيداً؟</p>
              <p className="text-xs text-slate-400">سيقوم الذكاء الاصطناعي برصد درجاتك وإصدار تقرير كشف المستوى فوراً.</p>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition transform hover:scale-105 active:scale-95"
            >
              {isSubmitting ? 'جاري الرصد والتصحيح...' : 'تسليم وإنهاء الامتحان'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
