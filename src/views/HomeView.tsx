import React from 'react';
import { AppPage } from '../types';
import {
  Sparkles,
  Bot,
  Languages,
  RotateCcw,
  BookOpen,
  FileText,
  Timer,
  CheckCircle,
  ArrowLeft,
  GraduationCap,
  Award,
  Zap,
  HelpCircle,
  Camera
} from 'lucide-react';
import { StudentProfile } from '../services/firebase';

interface HomeViewProps {
  onNavigate: (page: AppPage) => void;
  profile: StudentProfile | null;
  onOpenQuickQuestion: (category: AppPage) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  profile,
}) => {
  const quickPillars = [
    {
      id: 'assistant' as AppPage,
      title: 'المساعد الذكي الفوري',
      desc: 'اسأل أي سؤال في المنهج نصاً أو صورة أو صوت مع شرح خطوة بخطوة',
      icon: Bot,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
      badge: 'الذكاء الاصطناعي الأقوى',
    },
    {
      id: 'translation' as AppPage,
      title: 'مساحة الترجمة والبدائل',
      desc: 'ترجمة احترافية متوافقة مع نموذج الإجابة وبنك مفردات وبدائل مقبولة',
      icon: Languages,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
      badge: 'ترجمة امتحانية',
    },
    {
      id: 'rewrite' as AppPage,
      title: 'معمل التحويل (Rewrite)',
      desc: 'تحويل الجمل مع توضيح القاعدة والتغيير وتفادي الأخطاء الشائعة',
      icon: RotateCcw,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
      badge: 'إتقان القواعد',
    },
    {
      id: 'exam' as AppPage,
      title: 'محاكي امتحان الثانوية',
      desc: 'بوكليت امتحان كامل 50 درجة بوقت حقيقي وتصحيح تفصيلي فوري',
      icon: Timer,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
      badge: '50/50 الهدف',
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-amber-500/20 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>المنصة الأولى المتخصصة لطلاب تالتة ثانوي في مادة الإنجليزي</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2]">
            مساعد <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">الثانوية العامة</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            ليس مجرد شات بوت، بل مستر لغة إنجليزية خبير في جيبك. يحلل السؤال، يوضح فكرة واضع الامتحان، يشرح القاعدة ببساطة باللغة العربية، ويمنحك الإجابة النموذجية مع تريكات الامتحان لضمان الـ <strong>50/50</strong>.
          </p>

          {/* Quick Action CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('assistant')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Bot className="w-5 h-5" />
              <span>ابدأ سؤال المستر الذكي الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('exam')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm sm:text-base transition hover:-translate-y-0.5"
            >
              <Timer className="w-5 h-5 text-amber-400" />
              <span>محاكي الامتحان الشامل</span>
            </button>
          </div>

          {/* Creator tag */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">
              إشراف وتطوير المنصة: <strong className="text-amber-400">محمد خالد</strong>
            </span>
            <span className="hidden sm:inline-block text-slate-500">
              متوافق مع أحدث مواصفات ورقة امتحان الثانوية العامة 2026
            </span>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              الأقسام التخصصية للمنهج
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              أدوات تفاعلية مخصصة لكل جزء في ورقة الامتحان
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => onNavigate(pillar.id)}
                className={`cursor-pointer group relative rounded-2xl bg-gradient-to-b ${pillar.color} p-5 border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/60 text-slate-300 border border-white/5">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-slate-300/80 mt-2 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white">
                  <span>فتح القسم</span>
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Egyptian Teacher 5-Step Methodology Showcase */}
      <section className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 tracking-wide uppercase">
              منهجية الحل التربوية المعتمدة
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              كيف يجاوب الذكاء الاصطناعي على سؤالك؟
            </h3>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 self-start sm:self-center">
            هيكل 5 خطوات متطابق مع نموذج الوزارة
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { step: '1', title: 'فهم السؤال والتحليل', desc: 'تحديد نوع السؤال والقاعدة والوحدة في المنهج.' },
            { step: '2', title: 'شرح القاعدة ببساطة', desc: 'شرح القاعدة الإنجليزية بالعربي المبسط الواضح.' },
            { step: '3', title: 'طريقة الحل خطوة بخطوة', desc: 'استبعاد الاختيارات الخاطئة وتوضيح سبب الاختيار الصحيح.' },
            { step: '4', title: 'الإجابة النهائية المعتمدة', desc: 'الحل النهائي المعتمد بنموذج الامتحان بوضوح.' },
            { step: '5', title: 'تريكات وملاحظات هامة', desc: 'تحذير من الأفخاخ الشائعة التي يقع فيها الطلاب.' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs font-black">
                {item.step}
              </div>
              <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full Curriculum Modules Quick Directory */}
      <section className="space-y-4">
        <h3 className="text-xl font-extrabold text-white">باقي خدمات المنهج المتكاملة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'grammar', name: 'قواعد الوحدات (Grammar)', count: '12 وحدة كاملة' },
            { id: 'vocabulary', name: 'بنك الكلمات والمتلازمات', count: 'بطاقات فلاش تفاعلية' },
            { id: 'reading', name: 'مهارات القطعة والفهم', count: 'تحليل نصوص واستنتاج' },
            { id: 'writing', name: 'مهارات كتابة المقال', count: 'Rubrics وعلامات ترقيم' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id as AppPage)}
              className="cursor-pointer p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/30 transition p-4 space-y-1 group"
            >
              <h4 className="text-sm font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-slate-500">{item.count}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
