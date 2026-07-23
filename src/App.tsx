import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Sparkles, Trophy, Award, BookOpen, 
  ChevronRight, Compass, ArrowRight, Star, Flame
} from 'lucide-react';

import { dynamicSyllabus, SyllabusUnit, SyllabusRevision } from './data/syllabus';
import { StudentProgress, ActiveTab, SoundSettings } from './types';
import { playSuccessSound as playSuccessCentral, playVictorySound as playVictoryCentral, initAudio } from './utils/audioManager';
import { AuthService } from './components/auth/AuthService';

// Component Imports
import WelcomeScreen from './components/WelcomeScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NormalUnitView from './components/NormalUnitView';
import RevisionView from './components/RevisionView';
import SettingsModal from './components/SettingsModal';

// Storage Key Constants
const PROGRESS_STORAGE_KEY = 'leego_grammar_explorer_progress_v1';
const AUDIO_STORAGE_KEY = 'leego_grammar_explorer_audio_v1';

const DEFAULT_PROGRESS: StudentProgress = {
  name: "LeeGo Student",
  xp: 120,
  stars: 12,
  coins: 50,
  streak: 5,
  badge: "Grammar Explorer",
  completedUnits: [1], // Pre-complete Unit 1 to make dashboard active and exciting!
  completedRevisions: [],
  scores: { 'unit-1': 10 },
  readingProgress: 10,
  writingProgress: 5,
  lastStudyDate: null
};

const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  soundEnabled: true,
  congratulationAlert: true
};

// Sound Synthesizers using Web Audio API to prevent 404 / media loading errors
const playSuccessSound = () => {
  playSuccessCentral();
};

const playVictorySound = () => {
  playVictoryCentral();
};

export default function App() {
  // Splash & Loading States
  const [showSplash, setShowSplash] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core App Progress States
  const [progress, setProgress] = useState<StudentProgress>(DEFAULT_PROGRESS);
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(DEFAULT_SOUND_SETTINGS);

  // Navigation State
  const [activeView, setActiveView] = useState<{ type: ActiveTab; id: string | number }>({
    type: 'dashboard',
    id: 'dashboard'
  });

  // Level Up / Rewards Popup Overlay
  const [rewardPopup, setRewardPopup] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    xpEarned: number;
    starsEarned: number;
  } | null>(null);

  // Load progress helper from Google Sheets
  const loadStudentProgress = async (username: string) => {
    try {
      const data = await AuthService.getProgress(username);
      if (data && data.success) {
        setProgress(prev => {
          const nextProgress = {
            ...prev,
            name: data.studentName || prev.name,
            stars: data.stars !== undefined ? data.stars : prev.stars,
            readingProgress: data.reading !== undefined ? data.reading : prev.readingProgress,
            writingProgress: data.writing !== undefined ? data.writing : prev.writingProgress,
            studentClass: data.studentClass || prev.studentClass,
            averageScore: data.average !== undefined ? data.average : prev.averageScore,
            syllabusProgress: data.syllabus !== undefined ? data.syllabus : prev.syllabusProgress,
            grammarMastery: data.grammar !== undefined ? data.grammar : prev.grammarMastery,
          };
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress));
          return nextProgress;
        });
      }
    } catch (e) {
      console.warn("Failed to load student progress from server", e);
    }
  };

  // Load progress on start
  useEffect(() => {
    initAudio();

    // Check for auto login session
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setShowSplash(false);
      loadStudentProgress(savedUsername);
    }

    // 1. Load progress
    const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    let currentProgress = DEFAULT_PROGRESS;
    
    if (storedProgress) {
      try {
        currentProgress = JSON.parse(storedProgress);
      } catch (e) {
        console.error("Failed to parse progress, using default", e);
      }
    }

    // 2. Load sound
    const storedSound = localStorage.getItem(AUDIO_STORAGE_KEY);
    if (storedSound) {
      try {
        setSoundSettings(JSON.parse(storedSound));
      } catch (e) {
        console.error("Failed to parse audio settings", e);
      }
    }

    // 3. Update study streak
    const todayStr = new Date().toDateString();
    if (currentProgress.lastStudyDate && currentProgress.lastStudyDate !== todayStr) {
      const lastDate = new Date(currentProgress.lastStudyDate);
      const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentProgress.streak += 1;
      } else if (diffDays > 1) {
        currentProgress.streak = 1; // reset streak if gap is too long
      }
    }
    currentProgress.lastStudyDate = todayStr;

    // Save initial update
    setProgress(currentProgress);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(currentProgress));
  }, []);

  // Sync state helpers
  const saveProgressState = (updated: Partial<StudentProgress>) => {
    const nextProgress = { ...progress, ...updated };
    setProgress(nextProgress);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress));

    const username = localStorage.getItem('username');
    const studentName = localStorage.getItem('studentName') || nextProgress.name;
    const studentClass = localStorage.getItem('studentClass') || '';

    if (username) {
      const scoreKeys = Object.keys(nextProgress.scores);
      const average = scoreKeys.length > 0
        ? Math.round(scoreKeys.reduce((acc, key) => acc + nextProgress.scores[key], 0) / scoreKeys.length * 10) / 10
        : 0;
      const grammar = Math.round((nextProgress.completedUnits.length / 28) * 100);
      const syllabus = Math.round(
        ((nextProgress.completedUnits.length + nextProgress.completedRevisions.length) / (28 + 10)) * 100
      );

      AuthService.saveProgress({
        username,
        studentName,
        studentClass,
        stars: nextProgress.stars,
        average,
        syllabus,
        grammar,
        reading: nextProgress.readingProgress,
        writing: nextProgress.writingProgress
      });
    }
  };

  const saveSoundSettingsState = (updated: SoundSettings) => {
    setSoundSettings(updated);
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(updated));
  };

  // Reset Progress Flow
  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
    setActiveView({ type: 'dashboard', id: 'dashboard' });
  };

  // Syllabus Lookup Utilities
  const getUnitById = (id: number): SyllabusUnit | undefined => {
    for (const mission of dynamicSyllabus) {
      for (const item of mission.items) {
        if (item.type === 'unit' && item.id === id) {
          return item as SyllabusUnit;
        }
      }
    }
    return undefined;
  };

  const getRevisionById = (id: string): SyllabusRevision | undefined => {
    for (const mission of dynamicSyllabus) {
      for (const item of mission.items) {
        if ((item.type === 'revision' || item.type === 'mini_revision' || item.type === 'final_revision') && item.id === id) {
          return item as SyllabusRevision;
        }
      }
    }
    return undefined;
  };

  // Unlocked units helper for sequential roadmap locking
  // We unlock up to: completedUnits.length + 1
  const unlockedUnitCount = Math.min(28, progress.completedUnits.length + 1);

  // Badge upgrade math helper
  const calculateBadge = (completedCount: number): string => {
    if (completedCount >= 18) return "Grammar Champion";
    if (completedCount >= 9) return "Grammar Master";
    if (completedCount >= 3) return "Grammar Knight";
    return "Grammar Explorer";
  };

  // Handle lesson completion
  const handleUnitComplete = (score: number, xpEarned: number, starsEarned: number) => {
    if (activeView.type !== 'unit') return;
    const unitId = activeView.id as number;

    const isNewCompletion = !progress.completedUnits.includes(unitId);
    let nextCompletedUnits = [...progress.completedUnits];
    
    if (isNewCompletion) {
      nextCompletedUnits.push(unitId);
    }

    const nextBadge = calculateBadge(nextCompletedUnits.length);
    const nextScores = { ...progress.scores, [`unit-${unitId}`]: score };
    
    // Skill mastery boosts
    const baseProgress = Math.round((nextCompletedUnits.length / 28) * 100);
    const nextReadingProgress = Math.min(100, Math.max(progress.readingProgress, baseProgress + 5));
    const nextWritingProgress = Math.min(100, Math.max(progress.writingProgress, baseProgress + 3));

    // Sound alert
    if (soundSettings.soundEnabled) {
      playSuccessSound();
    }

    // Trigger Popup
    setRewardPopup({
      isOpen: true,
      title: `CHÚC MỪNG CON!`,
      subtitle: `Con đã xuất sắc vượt qua bài học Unit ${unitId}!`,
      xpEarned,
      starsEarned
    });

    // Save everything
    saveProgressState({
      completedUnits: nextCompletedUnits,
      badge: nextBadge,
      xp: progress.xp + xpEarned,
      stars: progress.stars + starsEarned,
      scores: nextScores,
      readingProgress: nextReadingProgress,
      writingProgress: nextWritingProgress
    });
  };

  // Handle Revision Completion
  const handleRevisionComplete = (score: number, xpEarned: number, starsEarned: number) => {
    if (activeView.type !== 'revision') return;
    const revId = activeView.id as string;

    const isNewCompletion = !progress.completedRevisions.includes(revId);
    let nextCompletedRevisions = [...progress.completedRevisions];
    if (isNewCompletion) {
      nextCompletedRevisions.push(revId);
    }

    const nextScores = { ...progress.scores, [`rev-${revId}`]: score };

    const baseProgress = Math.round((progress.completedUnits.length / 28) * 100);
    const nextReadingProgress = Math.min(100, progress.readingProgress + 15);
    const nextWritingProgress = Math.min(100, progress.writingProgress + 12);

    if (soundSettings.soundEnabled) {
      playVictorySound();
    }

    // Trigger Reward popup
    setRewardPopup({
      isOpen: true,
      title: `VƯỢT ẢI XUẤT SẮC!`,
      subtitle: `Con đã chinh phục bài ôn tập nâng cao ${revId.toUpperCase()}!`,
      xpEarned,
      starsEarned
    });

    // Save everything
    saveProgressState({
      completedRevisions: nextCompletedRevisions,
      xp: progress.xp + xpEarned,
      stars: progress.stars + starsEarned,
      scores: nextScores,
      readingProgress: nextReadingProgress,
      writingProgress: nextWritingProgress
    });
  };

  // Retrieve current active view info for Header displaying
  const getCurrentViewInfo = () => {
    if (activeView.type === 'unit') {
      const u = getUnitById(activeView.id as number);
      return {
        missionTitle: `MISSION CHẶNG ${Math.ceil((u?.id || 1) / 3)}`,
        itemTitle: u?.title || `Unit ${activeView.id}`
      };
    } else if (activeView.type === 'revision') {
      const r = getRevisionById(activeView.id as string);
      return {
        missionTitle: `ÔN TẬP TỔNG HỢP`,
        itemTitle: r?.title || `Revision`
      };
    }
    return { missionTitle: '', itemTitle: '' };
  };

  const activeInfo = getCurrentViewInfo();

  const handleLoginSuccess = () => {
    setShowSplash(false);
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      loadStudentProgress(savedUsername);
    }
  };

  return (
    <div id="leego-app-root" className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800">
      {/* 1. Welcome Screen Splash */}
      <AnimatePresence>
        {showSplash && (
          <WelcomeScreen onComplete={handleLoginSuccess} />
        )}
      </AnimatePresence>

      {/* 2. Standard Application Frame */}
      {!showSplash && (
        <div className="flex flex-col flex-1 relative pt-16">
          {/* Header */}
          <Header
            progress={progress}
            activeView={activeView}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onGoHome={() => setActiveView({ type: 'dashboard', id: 'dashboard' })}
            currentInfo={activeInfo}
          />

          {/* Core Content Body (Sidebar + View Panel) */}
          <div className="flex flex-1 relative w-full max-w-7xl mx-auto">
            {/* Sidebar Desktop */}
            <div className="hidden md:block">
              <Sidebar
                missions={dynamicSyllabus}
                completedUnits={progress.completedUnits}
                completedRevisions={progress.completedRevisions}
                activeItem={activeView}
                onSelectItem={(item) => setActiveView(item)}
                unlockedUnitCount={unlockedUnitCount}
              />
            </div>

            {/* Sidebar Mobile Sliding Drawer */}
            <AnimatePresence>
              {mobileSidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden flex select-none">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-xs"
                  />
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="relative w-80 bg-white h-full shadow-2xl z-50 pt-16"
                  >
                    {/* Close mobile drawer */}
                    <button
                      onClick={() => setMobileSidebarOpen(false)}
                      className="absolute top-4 right-4 p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 text-slate-500"
                    >
                      <X size={16} />
                    </button>

                    <Sidebar
                      missions={dynamicSyllabus}
                      completedUnits={progress.completedUnits}
                      completedRevisions={progress.completedRevisions}
                      activeItem={activeView}
                      onSelectItem={(item) => {
                        setActiveView(item);
                        setMobileSidebarOpen(false);
                      }}
                      unlockedUnitCount={unlockedUnitCount}
                    />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Main Application Study Content View */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-x-hidden">
              {/* Mobile hamburger Roadmap toggle */}
              <div className="flex md:hidden items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm select-none">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="flex items-center gap-2 text-xs font-black text-red-600 bg-red-50/50 px-4 py-2 rounded-xl border border-red-100"
                >
                  <Menu size={16} />
                  <span>Bản Đồ Thám Hiểm (Syllabus)</span>
                </button>
                <div className="text-[10px] text-slate-400 font-bold">
                  Chặng học: Unit {unlockedUnitCount}/28
                </div>
              </div>

              {/* ACTIVE ROUTING SWITCH PANEL */}
              <div className="flex-1">
                {activeView.type === 'dashboard' && (
                  <Dashboard
                    progress={progress}
                    unlockedUnitCount={unlockedUnitCount}
                    onSelectUnit={(id) => setActiveView({ type: 'unit', id })}
                    onSelectRevision={(id) => setActiveView({ type: 'revision', id })}
                  />
                )}

                {activeView.type === 'unit' && (() => {
                  const unit = getUnitById(activeView.id as number);
                  if (!unit) return <div className="text-center py-10 font-bold text-slate-400">Loading Unit Data...</div>;
                  return (
                    <NormalUnitView
                      unit={unit}
                      onComplete={handleUnitComplete}
                      soundEnabled={soundSettings.soundEnabled}
                    />
                  );
                })()}

                {activeView.type === 'revision' && (() => {
                  const rev = getRevisionById(activeView.id as string);
                  if (!rev) return <div className="text-center py-10 font-bold text-slate-400">Loading Revision Data...</div>;
                  return (
                    <RevisionView
                      revision={rev}
                      onComplete={handleRevisionComplete}
                      soundEnabled={soundSettings.soundEnabled}
                    />
                  );
                })()}
              </div>

              {/* Branding Footer */}
              <Footer />
            </main>
          </div>

          {/* 3. Settings Modal */}
          <AnimatePresence>
            {isSettingsOpen && (
              <SettingsModal
                progress={progress}
                onSaveProgress={saveProgressState}
                soundSettings={soundSettings}
                onSaveSoundSettings={saveSoundSettingsState}
                onResetProgress={handleResetProgress}
                onClose={() => setIsSettingsOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* 4. Level Up / Rewards Popup Celebrations Overlay */}
          <AnimatePresence>
            {rewardPopup?.isOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 30 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 relative text-center"
                >
                  {/* Top celebration background */}
                  <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-8 flex flex-col items-center justify-center relative overflow-hidden text-white">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                      className="absolute w-48 h-48 bg-white/5 rounded-full border-2 border-dashed border-white/10"
                    />
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md text-yellow-300 rounded-3xl flex items-center justify-center shadow-lg border border-white/20 relative z-10 animate-bounce">
                      <Award size={36} />
                    </div>
                    <h3 className="text-xl font-black mt-4 relative z-10 tracking-tight">
                      {rewardPopup.title}
                    </h3>
                    <p className="text-xs text-white/80 font-medium mt-1 relative z-10">
                      {rewardPopup.subtitle}
                    </p>
                  </div>

                  {/* Body with rewards breakdown */}
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex flex-col items-center justify-center">
                        <Flame className="text-amber-500 fill-amber-500 mb-1" size={24} />
                        <span className="text-lg font-black text-slate-800">+{rewardPopup.xpEarned}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Điểm XP</span>
                      </div>

                      <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl p-4 flex flex-col items-center justify-center">
                        <Star className="text-yellow-500 fill-yellow-500 mb-1" size={24} />
                        <span className="text-lg font-black text-slate-800">+{rewardPopup.starsEarned}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ngôi Sao</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 italic font-semibold">
                      ☘️ "Lửa vàng học tập rực cháy! Chúc mừng con đã tiếp tục tích lũy thêm thành tựu và huy hiệu mới cùng Anh Ngữ LeeGo!"
                    </p>

                    <button
                      onClick={() => {
                        setRewardPopup(null);
                        // Navigate back to Dashboard to review new stats
                        setActiveView({ type: 'dashboard', id: 'dashboard' });
                      }}
                      className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg shadow-red-600/15 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Vào Dashboard Xem Điểm Vàng</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
