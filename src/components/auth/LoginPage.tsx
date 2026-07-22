import React, { useState } from 'react';
import { AuthService } from './AuthService';
import { ArrowLeft, Lock, User, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin đăng nhập.');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      const success = await AuthService.login(username, password);
      if (success) {
        onLoginSuccess();
      } else {
        setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setErrorMsg('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-left">
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Quay lại</span>
        </button>
        <span className="text-[10px] bg-red-50 text-red-600 font-extrabold px-2.5 py-0.5 rounded-full border border-red-100">
          ĐĂNG NHẬP
        </span>
      </div>

      <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-6 w-full text-center sm:text-left">
        Đăng nhập tài khoản
      </h2>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Username */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
            Tên đăng nhập
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập của con..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-[10px] font-bold text-center">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
        >
          {isLoading ? 'Đang kết nối...' : 'Đăng nhập'}
        </button>
      </form>

      {/* Info Footers */}
      <div className="w-full text-center mt-6 pt-6 border-t border-slate-100 space-y-1">
        <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
          Đăng nhập bằng tài khoản do trung tâm cung cấp
        </p>
        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">
          Phiên bản thử nghiệm
        </p>
      </div>
    </div>
  );
}

