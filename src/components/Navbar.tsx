import React from 'react';
import { AppPage } from '../types';
import {
  Sparkles,
  Flame,
  User,
  LogIn,
  LogOut,
  Menu,
  GraduationCap,
  Award
} from 'lucide-react';
import { StudentProfile } from '../services/firebase';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  profile: StudentProfile | null;
  onSignInGoogle: () => void;
  onSignOut: () => void;
  onToggleSidebar: () => void;
  solvedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  profile,
  onSignInGoogle,
  onSignOut,
  onToggleSidebar,
  solvedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left / Brand Area */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 lg:hidden transition"
            aria-label="القائمة"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-blue-600 p-[1.5px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-amber-400">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>مساعد الثانوية العامة</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  AI English
                </span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                بواسطة محمد خالد
              </span>
            </div>
          </div>
        </div>

        {/* Center / Quick Highlights */}
        <div className="hidden md:flex items-center gap-3">
          {/* Target Score Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>الهدف: <strong>50/50</strong> في اللغة الإنجليزية</span>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{profile?.streakDays || 1} أيام حماس متتالية</span>
          </div>
        </div>

        {/* Right / Auth & Actions */}
        <div className="flex items-center gap-2.5">
          {profile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                  ) : (
                    profile.displayName.charAt(0) || 'ط'
                  )}
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-200 leading-tight max-w-[110px] truncate">
                    {profile.displayName}
                  </p>
                  <p className="text-[10px] text-amber-400 font-medium">
                    {profile.studySection || 'علمي'}
                  </p>
                </div>
              </button>

              <button
                onClick={onSignOut}
                title="تسجيل الخروج"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInGoogle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition transform active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل دخول بحساب Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
