import React from 'react';
import {
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  BookOpen,
  Languages,
  PenTool,
  RotateCcw,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';
import { StudentProfile } from '../services/firebase';

interface ProgressViewProps {
  profile: StudentProfile | null;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ profile }) => {
  const skillBreakdown = [
    { name: 'قواعد المنهج (Grammar Mastery)', score: 92, target: 100, icon: BookOpen, color: 'from-amber-500 to-amber-600', textCol: 'text-amber-400' },
    { name: 'بنك الكلمات والمتلازمات (Vocabulary Level)', score: 88, target: 100, icon: Sparkles, color: 'from-blue-500 to-blue-600', textCol: 'text-blue-400' },
    { name: 'دقة الترجمة (Translation Accuracy)', score: 85, target: 100, icon: Languages, color: 'from-emerald-500 to-emerald-600', textCol: 'text-emerald-400' },
    { name: 'مهارة فهم المقروء (Reading Score)', score: 82, target: 100, icon: Award, color: 'from-purple-500 to-purple-600', textCol: 'text-purple-400' },
    { name: 'جودة وتماسك المقال (Writing Score)', score: 90, target: 100, icon: PenTool, color: 'from-rose-500 to-rose-600', textCol: 'text-rose-400' },
  ];

  const badges = [
    { title: 'بطل الجرامر', desc: 'أتقن قواعد الأزمنة والمبني للمجهول', earned: true },
    { title: 'مترجم بارع', desc: 'أنجز 20 ترجمة مطابقة لنموذج الإجابة', earned: true },
    { title: 'ملك الفلاش كاردز', desc: 'راجع 50 كلمة مع متلازماتها', earned: true },
    { title: 'إصرار الثانوية', desc: 'مواظبة على الاستذكار لأكثر من 5 أيام', earned: false },
    { title: 'الـ 50 الكاملة', desc: 'حصل على الدرجة النهائية في محاكي الامتحان', earned: false },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              معدل التقدم ومستوى الإتقان (Progress Tracking)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              متابعة دقيقة لكل فرع من فروع اللغة الإنجليزية للوصول للدرجة النهائية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-300 font-bold text-xs">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>المعدل العام للإتقان: <strong>89.4%</strong></span>
        </div>
      </div>

      {/* Detailed Skill Bars */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>مستوى الجاهزية في فروع الامتحان:</span>
        </h2>

        <div className="space-y-5">
          {skillBreakdown.map((skill, idx) => {
            const Icon = skill.icon;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Icon className={`w-4 h-4 ${skill.textCol}`} />
                    <span>{skill.name}</span>
                  </div>
                  <span className={`font-mono font-bold ${skill.textCol}`}>
                    {skill.score}%
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thanaweya Badges */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span>أوسمة الإنجاز والتميز الأكاديمي:</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center space-y-2 transition ${
                b.earned
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center text-sm font-black ${
                  b.earned
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-600'
                }`}
              >
                {b.earned ? '🎖️' : '🔒'}
              </div>
              <h4 className="text-xs font-bold text-slate-200">{b.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
