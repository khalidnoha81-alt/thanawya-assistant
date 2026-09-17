import React, { useState } from 'react';
import {
  Settings,
  User,
  Mail,
  GraduationCap,
  Award,
  Save,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
  LogOut,
  Sparkles
} from 'lucide-react';
import { StudentProfile, db, auth, handleFirestoreError, OperationType } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ProfileSettingsViewProps {
  profile: StudentProfile | null;
  onProfileUpdated: (newProfile: StudentProfile) => void;
  onSignOut: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  profile,
  onProfileUpdated,
  onSignOut,
}) => {
  const [displayName, setDisplayName] = useState(profile?.displayName || 'طالب ثانوية عامة متميز');
  const [studySection, setStudySection] = useState<'علمي علوم' | 'علمي رياضة' | 'أدبي'>(
    profile?.studySection || 'علمي علوم'
  );
  const [targetCollege, setTargetCollege] = useState(profile?.targetCollege || 'كلية الطب البشري');
  const [targetScore, setTargetScore] = useState(profile?.targetEnglishScore || 50);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(false);

    const updated: StudentProfile = {
      uid: profile?.uid || auth.currentUser?.uid || 'guest-1',
      email: profile?.email || auth.currentUser?.email || 'student@thanaweya.edu',
      displayName,
      studySection,
      targetCollege,
      targetEnglishScore: targetScore,
      joinedAt: profile?.joinedAt || new Date().toLocaleDateString('ar-EG'),
      totalQuestionsSolved: profile?.totalQuestionsSolved || 0,
      streakDays: profile?.streakDays || 1,
      accuracyRate: profile?.accuracyRate || 94,
      photoURL: profile?.photoURL,
    };

    try {
      if (auth.currentUser) {
        const path = `users/${auth.currentUser.uid}`;
        await setDoc(doc(db, path), updated, { merge: true });
      }
      onProfileUpdated(updated);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser?.uid}`);
      // update local state anyway
      onProfileUpdated(updated);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              الملف الشخصي وإعدادات الشعبة (Profile & Stream Settings)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              تخصيص مسار دراستك، شعبتك في الثانوية العامة، والكلية المستهدفة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold self-start sm:self-center">
          <Database className="w-3.5 h-3.5" />
          <span>قاعدة بيانات سحابية متزامنة</span>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" />
                <span>اسم الطالب / الطالبة:</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-xl p-3.5 text-sm text-white focus:outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>البريد الإلكتروني المرتبط:</span>
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || 'student@thanaweya.edu'}
                className="w-full bg-slate-950/40 border border-slate-800 text-slate-400 rounded-xl p-3.5 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Academic Stream & Target College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>الشعبة الأكاديمية بالثانوية:</span>
              </label>
              <select
                value={studySection}
                onChange={(e) => setStudySection(e.target.value as any)}
                className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-xl p-3.5 text-sm text-white focus:outline-none transition"
              >
                <option value="علمي علوم">علمي علوم (Biology & Geology)</option>
                <option value="علمي رياضة">علمي رياضة (Pure & Applied Math)</option>
                <option value="أدبي">أدبي (Literature & Humanities)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>الكلية أو الحلم المستهدف:</span>
              </label>
              <input
                type="text"
                value={targetCollege}
                onChange={(e) => setTargetCollege(e.target.value)}
                placeholder="مثال: كلية الطب، كلية الهندسة، كلية الألسن..."
                className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-xl p-3.5 text-sm text-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* Target English Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>الدرجة المستهدفة في امتحان الإنجليزي:</span>
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {targetScore} من 50
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={50}
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>40 (جيد جداً)</span>
              <span>45 (ممتاز)</span>
              <span className="text-amber-400 font-bold">50 (الدرجة النهائية - الهدف الأسمى)</span>
            </div>
          </div>

          {/* Success feedback */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ الإعدادات وتحديث بيانات الطالب بنجاح!</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onSignOut}
              className="px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition transform active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Platform Info Card */}
      <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
        <h3 className="text-sm font-bold text-slate-300">
          منصة مساعد الثانوية العامة
        </h3>
        <p className="text-xs text-amber-400 font-semibold">
          بواسطة محمد خالد
        </p>
        <p className="text-[11px] text-slate-500 max-w-md mx-auto">
          تم تصميم وبناء هذا المساعد الذكي لدعم طلاب الثانوية العامة في مصر وتأهيلهم للتفوق في اللغة الإنجليزية وفق أحدث النظم التقنية والتربوية.
        </p>
      </div>
    </div>
  );
};
