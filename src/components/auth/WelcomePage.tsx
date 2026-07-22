import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass } from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
}

export default function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Animated Main Logo Container */}
      <motion.div
        initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 100, duration: 1 }}
        className="relative mb-6"
      >
        {/* Logo Icon Backdrop */}
        <div className="w-28 h-28 bg-red-600 rounded-3xl flex items-center justify-center shadow-xl shadow-red-500/20 relative overflow-hidden border-4 border-white">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-700 to-orange-500 opacity-50" />
          <span className="text-white text-5xl font-black tracking-wider z-10 font-sans">LG</span>
        </div>
        {/* Outer floating sparkles */}
        <motion.div
          className="absolute -top-3 -right-3 text-orange-500"
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles size={28} />
        </motion.div>
        <motion.div
          className="absolute -bottom-2 -left-2 text-red-500"
          animate={{ scale: [1.3, 1, 1.3], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Compass size={24} className="animate-spin" style={{ animationDuration: '8s' }} />
        </motion.div>
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight font-sans mb-1">
        Grammar Explorer
      </h1>

      {/* Tagline */}
      <p className="text-orange-600 font-semibold tracking-wider uppercase text-xs mb-4">
        AI Grammar Tutor
      </p>

      <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
        Chào mừng con đến với ứng dụng học tiếng Anh thám hiểm! Hãy bắt đầu hành trình chinh phục ngữ pháp ngay hôm nay.
      </p>

      {/* Large button Bắt đầu */}
      <button
        onClick={onStart}
        className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>Bắt đầu</span>
      </button>

      {/* Powered by */}
      <div className="flex flex-col items-center mt-6 pt-6 border-t border-slate-100 w-full text-[11px]">
        <span className="text-slate-400 font-medium tracking-widest uppercase mb-0.5">
          Powered by
        </span>
        <span className="text-red-600 font-bold tracking-wide">
          ANH NGỮ LEEGO
        </span>
      </div>
    </div>
  );
}

