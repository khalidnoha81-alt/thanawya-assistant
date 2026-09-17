import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  FileCheck,
  Copy
} from 'lucide-react';
import { TeacherSolutionCard } from '../components/TeacherSolutionCard';
import { logSolvedQuestion } from '../services/firebase';

interface WritingViewProps {
  userId?: string;
  onQuestionSolved?: () => void;
  onSaveBookmark?: (title: string, content: string) => void;
}

export const WritingView: React.FC<WritingViewProps> = ({
  userId = 'guest',
  onQuestionSolved,
  onSaveBookmark,
}) => {
  const [essayText, setEssayText] = useState('');
  const [topicPrompt, setTopicPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);

  const sampleTopics = [
    {
      topic: 'The role of modern technology and AI in reforming education in Egypt.',
      prompt: 'Write an essay of about 150-200 words discussing how technological innovations empower students.',
    },
    {
      topic: 'Time management and perseverance as the secrets to Thanaweya Amma excellence.',
      prompt: 'Write about personal discipline, setting daily targets, and overcoming procrastination.',
    },
    {
      topic: 'Sustainable energy projects in Egypt (e.g., Benban Solar Park).',
      prompt: 'Discuss how renewable energy ensures a sustainable future for forthcoming generations.',
    },
  ];

  const linkingWordsCheatSheet = [
    { type: 'إضافة فكرة (Addition)', words: 'Furthermore, Moreover, In addition to, Not only... but also' },
    { type: 'تناقض وتعارض (Contrast)', words: 'However, On the other hand, In contrast, Despite (+ v-ing/noun)' },
    { type: 'سبب وعلة (Cause & Reason)', words: 'Because of, Owing to, Due to, Since, As a consequence of' },
    { type: 'نتيجة وخاتمة (Result & Conclusion)', words: 'Therefore, Consequently, As a result, To sum up, In a nutshell' },
  ];

  const handleEvaluateEssay = async () => {
    if (!essayText.trim()) return;

    setIsLoading(true);
    setSolution(null);

    const promptText = `
تصحيح وتقييم مقال إنجليزي لطلاب الثانوية العامة (Thanaweya Amma Writing Rubric):
الموضوع المطلوب: "${topicPrompt || 'مقال عام للمرحلة الثانوية'}"
نص المقال المكتوب من الطالب:
"""
${essayText}
"""

المطلوب بدقة وفقاً لمعايير تصحيح وزارة التربية والتعليم:
1. تقدير الدرجة (Estimated Score): تقييم من 6 درجات (مثال 5/6 أو 6/6) مع تفصيل درجات الأفكار (Content)، والجرامر (Grammar & Structure)، والكلمات (Vocabulary)، والترقيم والتهجئة (Punctuation & Spelling).
2. تصحيح الأخطاء المباشر (Grammar & Punctuation Errors): جدول أو نقاط توضح الخطأ والتصحيح والسبب بالعربي.
3. مقترحات تحسين الجمل (Sentence Improvement Suggestions): صياغة جمل أقوى بالأسلوب الأكاديمي.
4. كلمات الربط الموصى بها (Linking Words Recommendations) لجعل المقال مترابطاً كالمحترفين.
5. نموذج الفقرة المحسنة المعاد كتابتها بالكامل ليحفظها الطالب كمرجع.
    `;

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'writing',
          prompt: promptText,
        }),
      });

      const data = await response.json().catch(() => ({}));
      const answer = data.text || (data.error ? `⚠️ ${data.error}` : 'تعذر تقييم المقال، يرجى المحاولة ثانية.');
      setSolution(answer);

      if (userId) {
        logSolvedQuestion({
          userId,
          category: 'writing',
          prompt: topicPrompt || 'تقييم مقال',
          solution: answer,
          createdAt: new Date().toISOString(),
        });
      }

      if (onQuestionSolved) {
        onQuestionSolved();
      }
    } catch (err: any) {
      console.error(err);
      setSolution(`عذراً، حدث خطأ أثناء التقييم: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              مصحح ومعمل المقال (Writing Skills & Essay Evaluator)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              تصحيح الأخطاء، تدقيق علامات الترقيم، ترقية الجمل، وتقدير الدرجة من 6
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300 self-start sm:self-center">
          <Award className="w-4 h-4 text-amber-400" />
          <span>مطابق لـ Rubric درجات الوزارة الرسمية</span>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">
            عنوان أو رأس موضوع المقال (Essay Prompt):
          </label>
          <input
            type="text"
            value={topicPrompt}
            onChange={(e) => setTopicPrompt(e.target.value)}
            placeholder="مثال: Write an essay about the importance of sustainable development in Egypt..."
            className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">
              نص المقال الخاص بك (My Draft Essay):
            </label>
            <span className="text-xs text-slate-400 font-mono">
              عدد الكلمات: {essayText.trim() ? essayText.trim().split(/\s+/).length : 0} كلمة
            </span>
          </div>
          <textarea
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            rows={8}
            placeholder="Write your paragraphs here... (Introduction, Body Paragraphs, Conclusion)"
            className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition leading-relaxed font-sans"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400">
            ينصح بكتابة 150 إلى 200 كلمة وفق مواصفات امتحان الثانوية.
          </div>

          <button
            onClick={handleEvaluateEssay}
            disabled={isLoading || !essayText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:pointer-events-none transition transform active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تصحيح وتقييم المقال...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                <span>تصحيح وتقدير درجة المقال</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Sample Topics */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-400">
            موضوعات متوقعة في امتحانات الثانوية العامة للتجربة:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sampleTopics.map((st, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopicPrompt(st.topic);
                  setEssayText(`It is universally acknowledged that ${st.topic.toLowerCase().replace('.', '')} is one of the most paramount issues in modern times.\n\nFirst and foremost, it equips individuals with pivotal tools for success. Furthermore, national development heavily relies on such awareness.\n\nTo sum up, we must join hands to achieve our aspirations and secure a prosperous future.`);
                }}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-right transition"
              >
                <p className="text-xs font-bold text-amber-400 truncate">{st.topic}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{st.prompt}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Solution Display */}
      {solution && (
        <TeacherSolutionCard
          rawText={solution}
          categoryTitle="تقرير تصحيح المقال وتقدير الدرجة الرسمي"
          onSaveBookmark={onSaveBookmark}
        />
      )}

      {/* Linking Words Cheat Sheet */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>جدول روابط التماسك (Linking Words) الذهبي لضمان الدرجة النهائية:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {linkingWordsCheatSheet.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-amber-300">{item.type}</span>
              <p className="text-xs font-mono text-slate-200">{item.words}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
