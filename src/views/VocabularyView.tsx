import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Volume2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Award,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { THANAWEYA_VOCAB_CARDS } from '../data/thanaweyaData';
import { TeacherSolutionCard } from '../components/TeacherSolutionCard';
import { Flashcard } from '../types';

interface VocabularyViewProps {
  userId?: string;
  onSaveBookmark?: (title: string, content: string) => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  userId = 'guest',
  onSaveBookmark,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [customWordAnalysis, setCustomWordAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confusablePairs = [
    { title: 'Gain vs Earn vs Win vs Beat', desc: 'Gain (خبرة/وزن/معرفة) - Earn (يكسب مالاً بعرق جبينه) - Win (يفوز بمباراة/جائزة) - Beat (يهزم منافساً أو فريقاً)' },
    { title: 'Rob vs Steal', desc: 'Steal + الشيء المسروق (stole money) - Rob + الشخص أو المكان (robbed the bank)' },
    { title: 'Affect vs Effect', desc: 'Affect (فعل: يؤثر على بدون حرف جر) - Effect (اسم: تأثير ويأتي مع have an effect on)' },
    { title: 'Special vs Private', desc: 'Special (مميز أو خاص لغرض معين) - Private (ملكية شخصية خاصة وليست عامة)' },
  ];

  const currentCard: Flashcard = THANAWEYA_VOCAB_CARDS[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % THANAWEYA_VOCAB_CARDS.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + THANAWEYA_VOCAB_CARDS.length) % THANAWEYA_VOCAB_CARDS.length);
  };

  const handleSpeakWord = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleAnalyzeWord = async (wordToAnalyze: string) => {
    const word = wordToAnalyze.trim();
    if (!word) return;
    setIsLoading(true);
    setCustomWordAnalysis(null);

    const prompt = `
تحليل مفردات لغة إنجليزية لمنهج الثانوية العامة المصرية:
الكلمة: "${word}"

المطلوب إخراجه بدقة بالغة:
1. المعنى بالعربي الدقيق وسياق ورقة الامتحان.
2. English Definition (تعريف مبسط وسهل الحفظ).
3. Synonyms & Antonyms (مرادفات ومتضادات مقررة في المنهج).
4. Collocations & Prepositions (أهم المتلازمات وحروف الجر التي تأتي مع الكلمة).
5. Confusable words (الكلمات المشابهة والفرق بينها لتجنب الأفخاخ).
6. جملة توضيحية من سياق امتحانات الوزارة السابقة.
    `;

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'vocabulary', prompt }),
      });
      const data = await res.json();
      setCustomWordAnalysis(data.text || 'تعذر تحليل الكلمة.');
    } catch (err: any) {
      setCustomWordAnalysis('حدث خطأ أثناء تحليل الكلمة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              مدرب الكلمات والمتلازمات (Vocabulary Trainer)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              مشتقات، متلازمات، بطاقات فلاش للحفظ، وكشف الكلمات المربكة في الامتحان
            </p>
          </div>
        </div>

        {/* Daily Word Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>كلمة اليوم: <strong>Perseverance</strong> (المثابرة)</span>
        </div>
      </div>

      {/* Word Search / Analyzer Input */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <label className="text-xs font-bold text-slate-300">
          ابحث عن أي كلمة بالمنهج أو اكتب كلمتين للتمييز بينهما (Confusable Words):
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeWord(searchTerm)}
              placeholder="اكتب كلمة مثلاً: Sustainable أو التفرقة بين Win و Gain..."
              className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition pr-10"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
          </div>

          <button
            onClick={() => handleAnalyzeWord(searchTerm)}
            disabled={isLoading || !searchTerm.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 disabled:opacity-40 transition shrink-0 flex items-center gap-1.5"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>تحليل الكلمة</span>
          </button>
        </div>

        {/* Confusable Words Quick Chips */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-400 block mb-2">
            أشهر الثنائيات المتشابهة في الامتحان (اضغط للتحليل الفوري):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {confusablePairs.map((pair, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchTerm(pair.title);
                  handleAnalyzeWord(pair.title);
                }}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-right transition"
              >
                <p className="text-xs font-bold text-amber-400">{pair.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{pair.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom AI Word Analysis Display */}
      {customWordAnalysis && (
        <TeacherSolutionCard
          rawText={customWordAnalysis}
          categoryTitle="تحليل المفردات والمتلازمات بالأسلوب الامتحاني"
          onSaveBookmark={onSaveBookmark}
        />
      )}

      {/* Interactive 3D Flip Flashcard Component */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>بطاقات الحفظ السريع التفاعلية (Flashcards)</span>
          </h2>
          <span className="text-xs text-slate-400">
            البطاقة {currentCardIndex + 1} من {THANAWEYA_VOCAB_CARDS.length}
          </span>
        </div>

        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer relative min-h-[300px] rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 shadow-2xl transition-all duration-300 hover:border-amber-400/60 flex flex-col justify-between select-none"
        >
          {/* Top card bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
              {currentCard.unit}
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              انقر لقلب البطاقة
            </span>
          </div>

          {!isFlipped ? (
            /* Front of card */
            <div className="my-auto text-center space-y-3">
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
                {currentCard.word}
              </h3>
              <p className="text-sm font-mono text-amber-400/80">
                {currentCard.phonetic} • {currentCard.partOfSpeech}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeakWord(currentCard.word);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استمع للنطق الإنجليزي</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 pt-2">
                انقر لرؤية المعنى بالعربي، المتلازمات، وتريكة الامتحان
              </p>
            </div>
          ) : (
            /* Back of card */
            <div className="my-auto space-y-4 text-right">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xl font-black text-amber-300">
                  {currentCard.arabicMeaning}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentCard.word}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong>التعريف:</strong> {currentCard.definition}
              </p>

              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <strong>مثال:</strong> {currentCard.example}
              </p>

              <div className="space-y-1 text-xs text-slate-300">
                <p>
                  <strong className="text-amber-400">متلازمات Collocations:</strong>{' '}
                  {currentCard.collocations.join(' • ')}
                </p>
                <p>
                  <strong className="text-emerald-400">تريكة الامتحان:</strong>{' '}
                  {currentCard.examNote}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Card Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevCard();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextCard();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition"
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
