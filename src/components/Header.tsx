import React from 'react';
import { Sparkles, Trophy, Settings, Flame } from 'lucide-react';
import { StudentProgress } from '../types';

interface HeaderProps {
  progress: StudentProgress;
  activeView: { type: 'dashboard' | 'unit' | 'revision'; id: string | number };
  onOpenSettings: () => void;
  onGoHome: () => void;
  currentInfo: { missionTitle: string; itemTitle: string };
}

export default function Header({
  progress,
  activeView,
  onOpenSettings,
  onGoHome,
  currentInfo
}: HeaderProps) {
  // Determine badge background styling based on active progress
  const getBadgeBg = (badge: string) => {
    switch (badge) {
      case 'Grammar Champion':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Grammar Master':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Grammar Knight':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <header id="app-header" className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-40 flex items-center justify-between px-6 shadow-sm shadow-slate-100/40 select-none">
      {/* LEFT: Branding */}
      <div 
        onClick={onGoHome} 
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-sans font-black text-white text-lg tracking-wider shadow-md shadow-red-500/10">
          LG
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-slate-800 tracking-tight leading-none">
            Grammar Explorer
          </span>
          <span className="text-[10px] text-orange-600 font-bold tracking-wider uppercase">
            Anh Ngữ LeeGo
          </span>
        </div>
      </div>

      {/* CENTER: Dynamic Learning Context */}
      <div className="hidden md:flex flex-col items-center max-w-xl text-center px-4">
        {activeView.type === 'dashboard' ? (
          <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
            <Sparkles size={14} className="animate-pulse" />
            <span>STUDY DASHBOARD • HỌC VIỆN LEEGO</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase leading-none mb-0.5">
              {currentInfo.missionTitle}
            </span>
            <span className="text-xs font-extrabold text-red-600 truncate max-w-sm">
              {currentInfo.itemTitle}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT: Gamified Student Metrics */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* XP */}
        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-black border border-amber-100">
          <Flame size={14} className="text-amber-500 fill-amber-500" />
          <span>{progress.xp} XP</span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-black border border-yellow-100">
          <Sparkles size={14} className="text-yellow-500 fill-yellow-500" />
          <span>{progress.stars} ⭐</span>
        </div>

        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-black border border-red-100">
          <Trophy size={14} className="text-red-500" />
          <span>{progress.streak} ngày</span>
        </div>

        {/* Badge */}
        <div className={`hidden lg:block text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${getBadgeBg(progress.badge)}`}>
          {progress.badge}
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px bg-slate-200" />

        {/* Student Name */}
        <span className="hidden sm:block text-xs font-bold text-slate-700 max-w-[100px] truncate">
          {progress.name}
        </span>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors border border-transparent hover:border-slate-100"
          title="Cài đặt học tập"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
