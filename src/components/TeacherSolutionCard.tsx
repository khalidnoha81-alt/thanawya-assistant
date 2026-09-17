import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Copy,
  Check,
  Bookmark,
  Volume2,
  VolumeX,
  GraduationCap
} from 'lucide-react';

interface TeacherSolutionCardProps {
  rawText: string;
  categoryTitle?: string;
  onSaveBookmark?: (title: string, content: string) => void;
}

export const TeacherSolutionCard: React.FC<TeacherSolutionCardProps> = ({
  rawText,
  categoryTitle = 'إجابة المستر النموذجية',
  onSaveBookmark,
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    if (onSaveBookmark) {
      onSaveBookmark(categoryTitle, rawText);
      setBookmarked(true);
      setTimeout(() => setBookmarked(false), 2500);
    }
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(rawText.replace(/[#*`_]/g, ''));
    utterance.lang = 'ar-EG';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 p-5 md:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* Decorative luxury gradient bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-blue-500" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>{categoryTitle}</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/20">
                منهج الثانوية العامة
              </span>
            </h4>
            <p className="text-xs text-slate-400">تحليل خطوة بخطوة بالأسلوب الامتحاني الأحدث</p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSpeech}
            title={speaking ? 'إيقاف القراءة' : 'استمع للإجابة بالصوت'}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              speaking
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{speaking ? 'إيقاف' : 'استماع'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="نسخ الإجابة"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 text-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>

          {onSaveBookmark && (
            <button
              onClick={handleBookmark}
              title="حفظ في كشكول الملاحظات"
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition flex items-center gap-1 text-xs"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span className="hidden sm:inline">{bookmarked ? 'تم الحفظ!' : 'حفظ'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Solution Content with styled typography */}
      <div className="text-slate-200 text-sm md:text-base leading-relaxed space-y-4">
        {rawText.split('\n\n').map((block, idx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Detect Egyptian Teacher 5-part structure headings
          if (trimmed.includes('فهم السؤال') || trimmed.includes('Understand')) {
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 flex gap-3 items-start">
                <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 whitespace-pre-line">{trimmed}</div>
              </div>
            );
          }

          if (trimmed.includes('شرح القاعدة') || trimmed.includes('Explain')) {
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex gap-3 items-start">
                <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 whitespace-pre-line">{trimmed}</div>
              </div>
            );
          }

          if (trimmed.includes('طريقة الحل') || trimmed.includes('خطوة بخطوة') || trimmed.includes('Solving')) {
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/25 flex gap-3 items-start">
                <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="flex-1 whitespace-pre-line font-medium text-amber-100">{trimmed}</div>
              </div>
            );
          }

          if (trimmed.includes('الإجابة النهائية') || trimmed.includes('Final answer')) {
            return (
              <div key={idx} className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex gap-3 items-start shadow-inner">
                <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 whitespace-pre-line font-bold text-emerald-300 text-base md:text-lg">
                  {trimmed}
                </div>
              </div>
            );
          }

          if (trimmed.includes('تريكات') || trimmed.includes('ملاحظات') || trimmed.includes('Exam notes') || trimmed.includes('تحذير')) {
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex gap-3 items-start">
                <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 whitespace-pre-line text-rose-200">{trimmed}</div>
              </div>
            );
          }

          return (
            <p key={idx} className="whitespace-pre-line text-slate-300">
              {trimmed}
            </p>
          );
        })}
      </div>

      {/* Footer attribution */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          تمت المعالجة بواسطة الذكاء الاصطناعي التربوي
        </span>
        <span className="text-amber-400/80 font-semibold">
          مساعد الثانوية العامة | بواسطة محمد خالد
        </span>
      </div>
    </div>
  );
};
