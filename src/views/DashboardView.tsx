import React, { useState, useEffect } from 'react';
import { AppPage } from '../types';
import {
  LayoutDashboard,
  Award,
  Flame,
  CheckCircle2,
  AlertCircle,
  Clock,
  Bookmark,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import {
  StudentProfile,
  SavedItem,
  auth,
  db,
  handleFirestoreError,
  OperationType
} from '../services/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

interface DashboardViewProps {
  onNavigate: (page: AppPage) => void;
  profile: StudentProfile | null;
  savedItems: SavedItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  profile,
  savedItems,
}) => {
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    async function loadLogs() {
      if (!auth.currentUser) return;
      setLoadingLogs(true);
      try {
        const path = `users/${auth.currentUser.uid}/history`;
        const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(5));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRecentLogs(list);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, `users/${auth.currentUser?.uid}/history`);
      } finally {
        setLoadingLogs(false);
      }
    }
    loadLogs();
  }, [profile]);

  const weakAreas = [
    { title: 'Inversion & Negative Adverbs', status: 'يحتاج مراجعة سريعة', hint: 'انتبه لتقديم Had / Did قبل الفاعل' },
    { title: 'Confusable Words (Gain vs Earn vs Win)', status: 'تم التثبيت بنجاح', hint: 'راجعت بطاقات Flashcards' },
    { title: 'Punctuation in Compound Sentences', status: 'متوسط 75%', hint: 'ركز على استخدام الفواصل والفاصلة المنقوطة' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-xs font-bold text-amber-300">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>أيام الإصرار: {profile?.streakDays || 1} أيام متتالية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              مرحباً بك يا {profile?.displayName || 'بطل الثانوية العامة'} 🎯
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              الهدف الأكاديمي: <strong className="text-amber-400">{profile?.targetCollege || 'كلية الطب البشري'}</strong> • الشعبة: {profile?.studySection || 'علمي علوم'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('exam')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition self-start sm:self-center"
          >
            بدء محاكي الامتحان (50 درجة)
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'إجمالي الأسئلة المحلولة',
            value: (profile?.totalQuestionsSolved || 0) + recentLogs.length,
            unit: 'سؤال وتمرين',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20',
          },
          {
            title: 'معدل الدقة المتوقع',
            value: `${profile?.accuracyRate || 94}%`,
            unit: 'مستوى متقدم ممتاز',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
          },
          {
            title: 'الدرجة المستهدفة',
            value: '50 / 50',
            unit: 'الدرجة النهائية بإذن الله',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20',
          },
          {
            title: 'الملاحظات المحفوظة',
            value: savedItems.length,
            unit: 'عنصر في الكشكول',
            color: 'text-purple-400',
            bg: 'bg-purple-500/10 border-purple-500/20',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${stat.bg} backdrop-blur-md space-y-2`}
          >
            <span className="text-xs font-bold text-slate-400 block">{stat.title}</span>
            <div className={`text-2xl sm:text-3xl font-black ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-[11px] text-slate-500">{stat.unit}</p>
          </div>
        ))}
      </div>

      {/* Weak Areas & AI Study Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Areas Diagnosis */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>تشخيص الذكاء الاصطناعي للنقاط الدقيقة:</span>
            </h3>
            <span className="text-[11px] text-slate-400">محدث تلقائياً</span>
          </div>

          <div className="space-y-2.5">
            {weakAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{area.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{area.hint}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300">
                  {area.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Items Notebook */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <span>كشكول الملاحظات والتريكات المحفوظة:</span>
            </h3>
            <span className="text-xs text-amber-400 font-bold">{savedItems.length} عنصر</span>
          </div>

          {savedItems.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 space-y-2">
              <FolderOpen className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">
                لم تقم بحفظ أي سؤال بعد! اضغط على أيقونة (حفظ) في أي إجابة للمستر ليتم تخزينها هنا.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {savedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-right space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">{item.title}</span>
                    <span className="text-[10px] text-slate-500">{item.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Jump Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-purple-950/40 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <h4 className="text-sm font-extrabold text-white">
            جاهز لحل نموذج كامل بالوقت والمواصفات الرسمية؟
          </h4>
          <p className="text-xs text-slate-400">
            امتحان الـ 50 درجة متوفر الآن مع محاكي البوكليت والتقييم الفوري.
          </p>
        </div>
        <button
          onClick={() => onNavigate('exam')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition whitespace-nowrap"
        >
          دخول المحاكي
        </button>
      </div>
    </div>
  );
};
