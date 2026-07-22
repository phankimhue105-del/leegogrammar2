import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, RotateCcw, Volume2, VolumeX, User, Info, GraduationCap } from 'lucide-react';
import { StudentProgress, SoundSettings } from '../types';

interface SettingsModalProps {
  progress: StudentProgress;
  onSaveProgress: (updated: Partial<StudentProgress>) => void;
  soundSettings: SoundSettings;
  onSaveSoundSettings: (updated: SoundSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  progress,
  onSaveProgress,
  soundSettings,
  onSaveSoundSettings,
  onResetProgress,
  onClose
}: SettingsModalProps) {
  // Local state
  const [name, setName] = useState(progress.name);
  const [soundEnabled, setSoundEnabled] = useState(soundSettings.soundEnabled);
  const [congratulationAlert, setCongratulationAlert] = useState(soundSettings.congratulationAlert);

  const handleSave = () => {
    onSaveProgress({ name });
    onSaveSoundSettings({ soundEnabled, congratulationAlert });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-slate-100 shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
              <GraduationCap size={18} />
            </div>
            <span className="font-extrabold text-sm text-slate-800">Cài đặt học tập (Settings)</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[400px]">
          {/* Section 1: Profile Name */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Tên Học Viên (Student Name)</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                placeholder="Nhập tên tiếng Anh của con..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/15 focus:border-red-500 text-slate-700 bg-white"
              />
            </div>
          </div>

          {/* Section 2: Audio Preferences */}
          <div className="space-y-3.5">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Âm thanh & Hiệu ứng (Audio Toggles)</span>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white text-slate-600 rounded-lg border border-slate-100 shadow-sm">
                  {soundEnabled ? <Volume2 size={16} className="text-orange-500" /> : <VolumeX size={16} />}
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block">Kích hoạt âm thanh</span>
                  <span className="text-[10px] text-slate-400 font-medium">Bật/tắt âm thanh hiệu ứng chúc mừng</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white text-slate-600 rounded-lg border border-slate-100 shadow-sm">
                  <Volume2 size={16} className="text-red-500" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block">Thông báo chúc mừng</span>
                  <span className="text-[10px] text-slate-400 font-medium">Hiển thị thông báo khi hoàn thành bài học</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={congratulationAlert}
                onChange={(e) => setCongratulationAlert(e.target.checked)}
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
              />
            </div>
          </div>

          {/* Section 3: Reset Data (Danger Area) */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <span className="text-[10px] text-red-600 font-black uppercase tracking-widest block">KHU VỰC THỬ NGHIỆM (DANGER ZONE)</span>
            <div className="p-3 bg-red-50/20 border border-red-100/50 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-red-800 block">Xóa tiến độ & Bắt đầu lại</span>
                <span className="text-[10px] text-slate-400 font-semibold leading-relaxed block">Reset điểm số XP, Stars và chuỗi học tập để quay lại bài 1.</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Con có chắc chắn muốn xóa hết tiến độ và học lại từ Unit 1 không?')) {
                    onResetProgress();
                    onClose();
                  }
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-[10px] py-2 px-3 rounded-lg flex items-center gap-1 transition-all shrink-0"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-2 items-start text-[10px] leading-relaxed text-slate-400 font-semibold">
            <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <p>
              Tài khoản được bảo mật tại chỗ trên trình duyệt của con qua Hệ thống LocalStorage. Con có thể tắt trình duyệt và mở lại bất cứ lúc nào để tiếp tục học!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-50 flex gap-2.5 justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all"
          >
            Hủy bỏ (Cancel)
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-red-600 text-white hover:bg-red-700 font-black text-xs rounded-xl transition-all shadow-md shadow-red-600/10 flex items-center gap-1"
          >
            <Save size={14} />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
