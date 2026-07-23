import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, Sparkles, BookOpen, PenTool, Flame, 
  ChevronRight, Award, CircleCheck, Star, Zap, History
} from 'lucide-react';
import { StudentProgress } from '../types';

interface DashboardProps {
  progress: StudentProgress;
  onSelectUnit: (id: number) => void;
  onSelectRevision: (id: string) => void;
  unlockedUnitCount: number;
}

export default function Dashboard({
  progress,
  onSelectUnit,
  onSelectRevision,
  unlockedUnitCount
}: DashboardProps) {
  // Calculators
  const totalUnits = 28;
  const totalRevisions = 10; // 7 Revisions, 2 Mini, 1 Final? Wait, 2 Mini, 8 Revisions, and 1 Final! Let's check syllabus list length.
  
  const completedUnitCount = progress.completedUnits.length;
  const completedRevisionCount = progress.completedRevisions.length;
  
  const unitPercentage = progress.grammarMastery !== undefined
    ? progress.grammarMastery
    : Math.round((completedUnitCount / totalUnits) * 100);
    
  const revisionPercentage = Math.round((completedRevisionCount / totalRevisions) * 100);
  
  const overallPercentage = progress.syllabusProgress !== undefined
    ? progress.syllabusProgress
    : Math.round(
        ((completedUnitCount + completedRevisionCount) / (totalUnits + totalRevisions)) * 100
      );

  // Calculate average score
  const scoreKeys = Object.keys(progress.scores);
  const calculatedAverage = scoreKeys.length > 0
    ? Math.round(scoreKeys.reduce((acc, key) => acc + progress.scores[key], 0) / scoreKeys.length * 10) / 10
    : 0;
  const averageScore = progress.averageScore !== undefined
    ? progress.averageScore
    : calculatedAverage;

  // Predefined achievements
  const achievements = [
    { id: 'start', title: 'Thám hiểm bắt đầu', desc: 'Tham gia học viên Anh ngữ LeeGo', unlocked: true, icon: Zap, color: 'text-orange-500 bg-orange-100' },
    { id: 'first_unit', title: 'Nhà thông thái trẻ', desc: 'Hoàn thành Unit học đầu tiên', unlocked: completedUnitCount > 0, icon: BookOpen, color: 'text-red-500 bg-red-100' },
    { id: 'streak_5', title: 'Lửa vàng học tập', desc: 'Duy trì học tập liên tục 5 ngày', unlocked: progress.streak >= 5, icon: Flame, color: 'text-amber-500 bg-amber-100' },
    { id: 'first_revision', title: 'Vượt ải xuất sắc', desc: 'Vượt qua kỳ kiểm tra Mini Revision', unlocked: completedRevisionCount > 0, icon: Trophy, color: 'text-purple-500 bg-purple-100' },
    { id: 'perfect_score', title: 'Chiến Thần Ngữ Pháp', desc: 'Đạt điểm tuyệt đối trong trò chơi', unlocked: scoreKeys.some(k => progress.scores[k] === 10), icon: Star, color: 'text-yellow-500 bg-yellow-100' },
  ];

  return (
    <div id="dashboard-view" className="space-y-8 select-none">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-lg shadow-red-500/10"
      >
        <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none hidden md:block">
          {/* Cute abstract shapes */}
          <div className="w-64 h-64 bg-white rounded-full translate-x-20 translate-y-20 blur-2xl" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            <Sparkles size={12} className="animate-pulse" />
            <span>XIN CHÀO EXPLORER CHĂM CHỈ!</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Chào mừng {progress.name} đến với Anh ngữ LeeGo!
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl font-medium">
            Hãy tiếp tục hành trình thám hiểm để chinh phục các huy hiệu lấp lánh, tích Stars và leo hạng bảng điểm vàng nhé! ✨
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => onSelectUnit(1)} 
              className="bg-white text-red-600 hover:bg-orange-50 transition-colors font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <span>Vào Học Ngay</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid: 3 Column Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Stats Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Thành Tích Học Tập</span>
              <Award className="text-red-500" size={18} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-0.5">
                <span className="text-lg sm:text-xl font-black text-slate-800">{progress.xp}</span>
                <p className="text-xs font-semibold text-slate-400">Tổng điểm XP</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-lg sm:text-xl font-black text-slate-800">{progress.stars} ⭐</span>
                <p className="text-xs font-semibold text-slate-400">Ngôi sao tích lũy</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-lg sm:text-xl font-black text-slate-800">{progress.streak} ngày</span>
                <p className="text-xs font-semibold text-slate-400">Chuỗi học liên tục</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-lg sm:text-xl font-black text-slate-800">{averageScore}/10</span>
                <p className="text-xs font-semibold text-slate-400">Điểm trung bình</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Completion Progress */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Tiến Độ Giáo Trình</span>
            <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              {overallPercentage}% Hoàn Thành
            </span>
          </div>

          <div className="space-y-3">
            {/* Units Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Bài Học Normal (Unit)</span>
                <span className="text-slate-500">{completedUnitCount} / {totalUnits}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${unitPercentage}%` }}
                  className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full"
                />
              </div>
            </div>

            {/* Revisions Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Bài Ôn Tập (Revision)</span>
                <span className="text-slate-500">{completedRevisionCount} / {totalRevisions}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${revisionPercentage}%` }}
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skill Mastery Gauges */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Kỹ Năng Ngôn Ngữ</span>
          
          <div className="space-y-3">
            {/* Grammar Mastery */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <BookOpen size={14} className="text-red-500" /> Grammar Mastery
                </span>
                <span className="text-red-600">{unitPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${unitPercentage}%` }} />
              </div>
            </div>

            {/* Reading Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <BookOpen size={14} className="text-orange-500" /> Reading Progress (Movers)
                </span>
                <span className="text-orange-600">{progress.readingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${progress.readingProgress}%` }} />
              </div>
            </div>

            {/* Writing Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <PenTool size={14} className="text-amber-500" /> Writing Progress (Movers)
                </span>
                <span className="text-amber-600">{progress.writingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${progress.writingProgress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Achievements & Active Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unlocked Achievements list */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-1 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Award className="text-red-500" size={18} />
            <span className="font-extrabold text-sm text-slate-800">Cúp & Huy Hiệu Đạt Được</span>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {achievements.map((ach) => {
              const Icon = ach.icon;
              return (
                <div 
                  key={ach.id} 
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    ach.unlocked 
                      ? 'bg-slate-50/50 border-slate-100 opacity-100' 
                      : 'bg-slate-50/20 border-slate-50/50 opacity-40'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${ach.unlocked ? ach.color : 'bg-slate-100 text-slate-400'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-extrabold truncate ${ach.unlocked ? 'text-slate-700' : 'text-slate-400'}`}>
                      {ach.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">
                      {ach.desc}
                    </p>
                  </div>
                  {ach.unlocked && (
                    <CircleCheck size={16} className="text-emerald-500 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Path: Next Recommended Lesson */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Zap className="text-orange-500 fill-orange-500" size={18} />
            <span className="font-extrabold text-sm text-slate-800">Khám Phá Giáo Trình Theo Thứ Tự</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-100 rounded-xl p-4 bg-red-50/20 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] text-red-600 font-extrabold tracking-wider uppercase block">Unit Kế Tiếp</span>
                <h3 className="font-black text-slate-800 text-sm mt-1">Unit {unlockedUnitCount}: Học phần {unlockedUnitCount <= 28 ? `Ngữ Pháp` : `Hoàn Tất`}</h3>
                <p className="text-xs text-slate-500 mt-1">Tìm hiểu các quy tắc vàng, ghi nhớ Snapshot và nhận 100 XP + Stars bằng bài luyện tập gamified!</p>
              </div>
              <button
                onClick={() => onSelectUnit(unlockedUnitCount <= 28 ? unlockedUnitCount : 28)}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2 px-4 rounded-lg w-full flex items-center justify-center gap-1 transition-colors self-end"
              >
                <span>Học Ngay Unit {unlockedUnitCount <= 28 ? unlockedUnitCount : 28}</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="border border-slate-100 rounded-xl p-4 bg-orange-50/20 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] text-orange-600 font-extrabold tracking-wider uppercase block">Ôn Tập Gần Nhất</span>
                <h3 className="font-black text-slate-800 text-sm mt-1">Movers Revision Challenges</h3>
                <p className="text-xs text-slate-500 mt-1">Ôn tập 20 câu hỏi ngữ pháp hỗn hợp, thử sức với Bài đọc Movers và tập viết tiếng Anh cùng cô trợ lý trí tuệ nhân tạo (AI Tutor)!</p>
              </div>
              <button
                onClick={() => onSelectRevision('mini-1-3')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-2 px-4 rounded-lg w-full flex items-center justify-center gap-1 transition-colors self-end"
              >
                <span>Vào Làm Bài Ôn Tập</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
