import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // 2.5 seconds total for smooth reading & automatic transition
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div id="welcome-screen" className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col items-center justify-center z-50 overflow-hidden select-none">
      {/* Decorative Background Elements */}
      <motion.div
        className="absolute -top-10 -right-10 w-48 h-48 bg-orange-200/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-10 -left-10 w-56 h-56 bg-red-200/40 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center max-w-md px-6 text-center">
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
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-extrabold text-slate-800 tracking-tight leading-tight font-sans mb-1"
        >
          Grammar Explorer
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-orange-600 font-semibold tracking-wider uppercase text-sm mb-8"
        >
          AI Grammar Tutor
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "80px" }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="h-1 bg-gradient-to-r from-red-500 to-orange-400 rounded-full mb-8"
        />

        {/* Powered by */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs text-slate-400 font-medium tracking-widest uppercase mb-1">
            Powered by
          </span>
          <span className="text-lg font-bold text-red-600 tracking-wide">
            ANH NGỮ LEEGO
          </span>
          <span className="text-xs text-slate-500 font-semibold">
            Hải Phòng, Việt Nam
          </span>
        </motion.div>
      </div>

      {/* Modern, friendly progress dot indicators */}
      <div className="absolute bottom-10 flex gap-2">
        {[0, 1, 2].map((idx) => (
          <motion.div
            key={idx}
            className="w-3 h-3 rounded-full bg-red-600"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: idx * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
