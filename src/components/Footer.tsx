import React from 'react';
import { Phone, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="app-footer" className="w-full bg-slate-50 border-t border-slate-100 py-6 px-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium select-none">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <GraduationCap size={16} className="text-red-500" />
          <span>© 2026 Anh ngữ LeeGo</span>
        </div>
        <span className="hidden sm:inline text-slate-300">|</span>
        <span className="text-slate-400">Oxford Grammar 2</span>
      </div>

      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm shrink-0 whitespace-nowrap">
        <Phone size={12} className="text-orange-500 fill-orange-500 animate-pulse" />
        <span className="text-slate-400">Hotline:</span>
        <a 
          href="tel:0988526585" 
          style={{ whiteSpace: 'nowrap' }}
          className="font-bold text-slate-700 hover:text-red-600 transition-colors whitespace-nowrap"
        >
          0988 526 585
        </a>
      </div>
    </footer>
  );
}
