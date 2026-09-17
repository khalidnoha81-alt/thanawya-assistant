import React from 'react';
import { AppPage } from '../types';
import {
  Home,
  Bot,
  Languages,
  RotateCcw,
  BookOpen,
  Sparkles,
  FileText,
  PenTool,
  LayoutDashboard,
  TrendingUp,
  Timer,
  Settings,
  X,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: AppPage;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: string;
  isSpecial?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'الرئيسية',
      sublabel: 'لوحة الترحيب ومصادر المنهج',
      icon: Home,
    },
    {
      id: 'assistant',
      label: 'المساعد الذكي العام',
      sublabel: 'مستر إنجليزي فوري بالصور والصوت',
      icon: Bot,
      badge: 'ChatGPT-Style',
      isSpecial: true,
    },
    {
      id: 'translation',
      label: 'مساحة الترجمة الذكية',
      sublabel: 'عربي ↔ إنجليزي مع بدائل وبنك كلمات',
      icon: Languages,
    },
    {
      id: 'rewrite',
      label: 'قسم التحويل (Rewrite)',
      sublabel: 'شرح القاعدة والتغيير وتريكات الامتحان',
      icon: RotateCcw,
    },
    {
      id: 'grammar',
      label: 'قواعد المنهج (Grammar)',
      sublabel: 'حل التمارين وكشف الاختيارات المضللة',
      icon: BookOpen,
    },
    {
      id: 'vocabulary',
      label: 'مدرب الكلمات (Vocabulary)',
      sublabel: 'مشتقات ومتلازمات وبطاقات تفاعلية',
      icon: Sparkles,
    },
    {
      id: 'reading',
      label: 'فهم المقروء (Comprehension)',
      sublabel: 'تحليل القطع واستخراج الدليل والكلمات',
      icon: FileText,
    },
    {
      id: 'writing',
      label: 'مهارات المقال (Writing)',
      sublabel: 'Essay, Punctuation, Linking Words',
      icon: PenTool,
    },
    {
      id: 'dashboard',
      label: 'لوحة إنجاز الطالب',
      sublabel: 'الأسئلة المحلولة ونقاط القوة والضعف',
      icon: LayoutDashboard,
    },
    {
      id: 'progress',
      label: 'معدل التقدم والمستوى',
      sublabel: 'إحصائيات المهارات وخطة التميز',
      icon: TrendingUp,
    },
    {
      id: 'exam',
      label: 'محاكي امتحان الثانوية',
      sublabel: 'امتحان بوكليت واقعي بوقت وتصحيح ذكي',
      icon: Timer,
      badge: '50 درجة',
    },
    {
      id: 'profile',
      label: 'إعدادات الحساب والشعبة',
      sublabel: 'البيانات الشخصية والكلية المستهدفة',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Aside Container */}
      <aside
        className={`fixed top-18 bottom-0 right-0 z-40 w-72 bg-slate-950/95 lg:bg-slate-950/70 border-l border-slate-800/80 backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile close button header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <span className="text-sm font-bold text-slate-300">أقسام المنصة التعليمية</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full text-right flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 text-amber-300 font-bold shadow-lg shadow-amber-500/5'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'bg-slate-900 text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm truncate font-bold">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer attribution */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/90 text-center">
          <p className="text-[11px] font-semibold text-slate-400">
            مساعد الثانوية العامة
          </p>
          <p className="text-[10px] text-amber-400/90 font-medium mt-0.5">
            بواسطة محمد خالد
          </p>
        </div>
      </aside>
    </>
  );
};
