import React from 'react';
import { motion } from 'motion/react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div id="auth-layout" className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col items-center justify-center z-50 overflow-hidden select-none">
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

      <div className="flex flex-col items-center w-full max-w-md px-6 text-center z-10">
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-8 border border-slate-100/80 shadow-2xl shadow-slate-500/10 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

