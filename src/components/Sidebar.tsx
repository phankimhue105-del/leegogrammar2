import React from 'react';
import { 
  Trophy, BookOpen, Lock, CheckCircle2, 
  Compass, ChevronDown, ChevronUp, Star, Home
} from 'lucide-react';
import { Mission, SyllabusItem, SyllabusUnit, SyllabusRevision } from '../data/syllabus';

interface SidebarProps {
  missions: Mission[];
  completedUnits: number[];
  completedRevisions: string[];
  activeItem: { type: 'dashboard' | 'unit' | 'revision'; id: string | number };
  onSelectItem: (item: { type: 'dashboard' | 'unit' | 'revision'; id: string | number }) => void;
  unlockedUnitCount: number;
}

export default function Sidebar({
  missions,
  completedUnits,
  completedRevisions,
  activeItem,
  onSelectItem,
  unlockedUnitCount
}: SidebarProps) {
  // Check if a unit is unlocked (sequentially)
  const isUnitUnlocked = (unitId: number) => {
    return true;
  };

  // Check if a revision is unlocked
  const isRevisionUnlocked = (rev: SyllabusRevision) => {
    return true;
  };

  return (
    <aside id="app-sidebar" className="w-80 bg-white border-r border-slate-100 flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-hidden select-none shrink-0">
      {/* Home / Dashboard link */}
      <div className="p-4 border-b border-slate-50">
        <button
          onClick={() => onSelectItem({ type: 'dashboard', id: 'dashboard' })}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold text-sm transition-all ${
            activeItem.type === 'dashboard'
              ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm shadow-red-500/5'
              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Home size={18} className={activeItem.type === 'dashboard' ? 'text-red-500' : 'text-slate-400'} />
          <span>Dashboard Học Tập</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {missions.map((mission) => (
          <div key={mission.id} className="space-y-2">
            {/* Mission Title Header */}
            <div className="px-2 py-1">
              <span className="text-[10px] text-orange-600 font-black tracking-widest uppercase block leading-none">
                Mission {mission.id}
              </span>
              <h3 className="text-[11px] font-extrabold text-slate-700 mt-1 uppercase tracking-tight">
                {mission.title.replace(/^Mission \d+:\s*/, '')}
              </h3>
            </div>

            {/* Mission Units & Revisions */}
            <div className="space-y-1">
              {mission.items.map((item) => {
                const isUnit = item.type === 'unit';
                
                if (isUnit) {
                  const unit = item as SyllabusUnit;
                  const unlocked = isUnitUnlocked(unit.id);
                  const completed = completedUnits.includes(unit.id);
                  const isActive = activeItem.type === 'unit' && activeItem.id === unit.id;

                  return (
                    <button
                      key={`unit-${unit.id}`}
                      disabled={!unlocked}
                      onClick={() => onSelectItem({ type: 'unit', id: unit.id })}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                        isActive
                          ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/10'
                          : unlocked
                          ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-200'
                          : 'bg-slate-50/50 text-slate-400 border-slate-50/20 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {completed ? (
                          <CheckCircle2 size={15} className={isActive ? 'text-white' : 'text-emerald-500'} />
                        ) : unlocked ? (
                          <BookOpen size={15} className={isActive ? 'text-white animate-pulse' : 'text-red-500'} />
                        ) : (
                          <Lock size={14} className="text-slate-400" />
                        )}
                        <span className="truncate">Unit {unit.id}: {unit.title.replace(/^Unit \d+:\s*/, '')}</span>
                      </div>

                      {unlocked && !completed && !isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                      )}
                    </button>
                  );
                } else {
                  // Revisions
                  const rev = item as SyllabusRevision;
                  const unlocked = isRevisionUnlocked(rev);
                  const completed = completedRevisions.includes(rev.id);
                  const isActive = activeItem.type === 'revision' && activeItem.id === rev.id;

                  const isMini = rev.type === 'mini_revision';

                  return (
                    <button
                      key={`rev-${rev.id}`}
                      disabled={!unlocked}
                      onClick={() => onSelectItem({ type: 'revision', id: rev.id })}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                        isActive
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                          : unlocked
                          ? isMini
                            ? 'bg-orange-50/40 hover:bg-orange-50/80 text-orange-700 border-orange-100'
                            : 'bg-amber-50 hover:bg-amber-100/70 text-amber-800 border-amber-200'
                          : 'bg-slate-50/50 text-slate-400 border-slate-50/20 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {completed ? (
                          <CheckCircle2 size={15} className={isActive ? 'text-white' : 'text-emerald-500'} />
                        ) : unlocked ? (
                          <Trophy size={14} className={isActive ? 'text-white' : isMini ? 'text-orange-500' : 'text-amber-500'} />
                        ) : (
                          <Lock size={14} className="text-slate-400" />
                        )}
                        <span className="truncate">
                          {isMini ? 'Mini Rev' : 'Revision'}: {rev.title.replace(/^(Mini )?Revision( \d+)?:\s*/, '')}
                        </span>
                      </div>
                    </button>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
