import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Play, Check, X, ShieldAlert, Sparkles, 
  ChevronRight, Trophy, RotateCcw, AlertCircle, HelpCircle,
  Coins, Star, ShieldCheck, Swords, Anchor, Ship, Navigation, 
  Rocket, DoorOpen, Footprints, Flame
} from 'lucide-react';
import { SyllabusUnit, Question } from '../data/syllabus';
import { 
  playSelectionSound as playSelectionCentral, 
  playCorrectSound as playCorrectCentral, 
  playIncorrectSound as playIncorrectCentral 
} from '../utils/audioManager';

interface NormalUnitViewProps {
  unit: SyllabusUnit;
  onComplete: (score: number, xp: number, stars: number) => void;
  soundEnabled: boolean;
}

export default function NormalUnitView({
  unit,
  onComplete,
  soundEnabled
}: NormalUnitViewProps) {
  // State
  const [activeTab, setActiveTab] = useState<'snapshot' | 'practice'>('snapshot');
  
  // Game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [feedbackAnimation, setFeedbackAnimation] = useState<{ type: 'correct' | 'incorrect'; text: string; id: number } | null>(null);
  
  // Track previous questions results
  const [results, setResults] = useState<{ id: number; question: string; isCorrect: boolean; selected: string; correct: string }[]>([]);

  // Get current question
  const currentQuestion: Question = unit.questions[currentQuestionIndex] || unit.questions[0];

  // Reset quiz states when unit changes
  useEffect(() => {
    setActiveTab('snapshot');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setAnsweredCount(0);
    setShowExplanation(false);
    setGameFinished(false);
    setResults([]);
    setFeedbackAnimation(null);
  }, [unit.id]);

  const playSelectionSound = () => {
    if (!soundEnabled) return;
    playSelectionCentral();
  };

  const playCorrectSound = () => {
    if (!soundEnabled) return;
    playCorrectCentral();
  };

  const playIncorrectSound = () => {
    if (!soundEnabled) return;
    playIncorrectCentral();
  };

  const handleNextQuestion = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameFinished(true);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    playSelectionSound();
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (isSubmitted || !selectedOption) return;

    const correct = selectedOption === currentQuestion.answer;
    
    setIsSubmitted(true);
    setAnsweredCount(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
      playCorrectSound();
      const praises = ["Excellent!", "Perfect!", "Great Job!"];
      const text = Math.random() < 0.5 ? "+10 XP" : (Math.random() < 0.5 ? "+5 Stars" : praises[Math.floor(Math.random() * praises.length)]);
      setFeedbackAnimation({ type: 'correct', text, id: Date.now() });
      setTimeout(() => {
        setFeedbackAnimation(null);
        handleNextQuestion();
      }, 1500);
    } else {
      playIncorrectSound();
      const encouragements = ["Try Again", "Keep Going", "Not Quite"];
      const text = encouragements[Math.floor(Math.random() * encouragements.length)];
      setFeedbackAnimation({ type: 'incorrect', text, id: Date.now() });
      setShowExplanation(true);
      setTimeout(() => {
        setFeedbackAnimation(null);
      }, 1500);
    }
    
    setResults(prev => [
      ...prev,
      {
        id: currentQuestion.id,
        question: currentQuestion.question,
        isCorrect: correct,
        selected: selectedOption,
        correct: currentQuestion.answer
      }
    ]);
  };

  const handleResetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setAnsweredCount(0);
    setShowExplanation(false);
    setGameFinished(false);
    setResults([]);
  };

  const handleFinishAndSubmit = () => {
    // Reward calculation: 10 XP per correct answer, 2 Stars per correct answer. 50 bonus XP on perfect 10/10!
    const baseXP = score * 10;
    const bonusXP = score === 10 ? 50 : 0;
    const earnedXp = baseXP + bonusXP;
    const earnedStars = score >= 5 ? Math.ceil(score / 2) : 1;

    onComplete(score, earnedXp, earnedStars);
  };

  // Rendering Game Scene Visualizer
  const renderGameVisualizer = () => {
    const progressPercent = ((currentQuestionIndex + (isSubmitted ? 1 : 0)) / 10) * 100;
    
    switch (unit.gameType) {
      case 'battle':
        // Monster Battle Game Scene
        const monsterHp = 100 - (score * 10);
        return (
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-4 border border-red-100 flex flex-col items-center justify-center relative overflow-hidden select-none">
            <span className="absolute top-2 left-3 text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
              {unit.gameName}
            </span>
            <div className="flex justify-around items-center w-full max-w-sm mt-4">
              {/* Student character */}
              <div className="flex flex-col items-center space-y-1">
                <div className="w-12 h-12 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                  <span className="text-white font-extrabold text-sm">You</span>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase">Hero Knight</span>
              </div>

              {/* Battle Versus Indicator */}
              <div className="flex flex-col items-center shrink-0">
                <Swords size={20} className="text-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400">VS</span>
              </div>

              {/* Cute Monster */}
              <div className="flex flex-col items-center space-y-1">
                <motion.div 
                  animate={isSubmitted && selectedOption === currentQuestion.answer ? { x: [0, -10, 10, -10, 0], scale: [1, 0.9, 1.1, 1] } : {}}
                  className="w-12 h-12 bg-red-600 rounded-full border-2 border-white flex items-center justify-center shadow-md relative"
                >
                  <span className="text-white font-bold text-sm">👾</span>
                </motion.div>
                <div className="w-20 space-y-0.5">
                  <div className="flex justify-between text-[8px] font-black text-slate-400">
                    <span>MONSTER HP</span>
                    <span>{monsterHp}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${monsterHp}%` }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Health indicators */}
            <p className="text-slate-400 text-[10px] mt-4 font-bold text-center">
              Mỗi câu trả lời đúng sẽ trừ 10 HP của quái vật! Đánh bại nó để lấy vàng! ⚔️
            </p>
          </div>
        );

      case 'treasure':
        // Pirate Treasure Hunt Scene
        return (
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl p-4 border border-orange-100 flex flex-col items-center relative overflow-hidden select-none">
            <span className="absolute top-2 left-3 text-[10px] bg-orange-600 text-white font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
              {unit.gameName}
            </span>
            <div className="w-full mt-4 max-w-md relative flex items-center h-14">
              {/* Path line */}
              <div className="absolute left-6 right-6 h-1 bg-slate-200/60 top-1/2 -translate-y-1/2 z-0 rounded-full" />
              <div className="absolute left-6 h-1 bg-orange-500 top-1/2 -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              
              {/* Ship start */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <Anchor size={12} className="text-slate-400" />
              </div>

              {/* Pirate avatar moving */}
              <motion.div 
                animate={{ left: `calc(${progressPercent}% - 12px)` }}
                className="absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                style={{ left: '0%' }}
              >
                <Ship size={14} className="text-white" />
              </motion.div>

              {/* Treasure Chest end */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center border border-amber-200 shadow-sm shadow-amber-500/5">
                <span className="text-sm">🪙</span>
              </div>
            </div>
            <p className="text-slate-400 text-[10px] mt-2 font-bold text-center">
              Lái tàu buồm vượt đại dương đến Rương Kho Báu! Điểm đến: {progressPercent}% 🗺️
            </p>
          </div>
        );

      case 'space':
        // Galaxy Space Mission Scene
        return (
          <div className="bg-gradient-to-r from-blue-900/10 to-indigo-950/10 rounded-2xl p-4 border border-indigo-100 flex flex-col items-center relative overflow-hidden select-none">
            <span className="absolute top-2 left-3 text-[10px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
              {unit.gameName}
            </span>
            <div className="w-full mt-4 max-w-md relative flex items-center h-14">
              {/* Path */}
              <div className="absolute left-6 right-6 h-1 bg-slate-100 top-1/2 -translate-y-1/2 z-0 rounded-full" />
              <div className="absolute left-6 h-1 bg-indigo-500 top-1/2 -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />

              {/* Rocket Icon */}
              <motion.div 
                animate={{ left: `calc(${progressPercent}% - 12px)`, rotate: [0, -5, 5, 0] }}
                className="absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                style={{ left: '0%' }}
              >
                <Rocket size={14} className="text-white" />
              </motion.div>

              {/* Destination Planet */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200">
                <span className="text-sm">🪐</span>
              </div>
            </div>
            <p className="text-slate-400 text-[10px] mt-2 font-bold text-center">
              Cất cánh tên lửa khám phá giải thiên hà LeeGo! Nhiệm vụ đạt: {progressPercent}% 🚀
            </p>
          </div>
        );

      case 'escape':
        // Castle Escape Staircase Visualizer
        return (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-100 flex flex-col items-center justify-center relative overflow-hidden select-none">
            <span className="absolute top-2 left-3 text-[10px] bg-purple-600 text-white font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
              {unit.gameName}
            </span>
            <div className="flex gap-1 items-end h-10 w-full max-w-sm mt-4 justify-between">
              {[...Array(10)].map((_, i) => {
                const isActive = currentQuestionIndex === i;
                const isPassed = currentQuestionIndex > i;
                return (
                  <div 
                    key={i} 
                    className="flex-1 rounded-t-md transition-all duration-500 flex flex-col items-center"
                    style={{ 
                      height: `${(i + 1) * 10}%`,
                      backgroundColor: isActive ? '#c084fc' : isPassed ? '#a855f7' : '#f1f5f9'
                    }}
                  >
                    {isActive && <span className="text-[8px] -mt-4 text-purple-600 font-extrabold animate-bounce">🏃</span>}
                  </div>
                );
              })}
              <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center shadow-sm">
                <DoorOpen size={12} className="text-purple-600" />
              </div>
            </div>
            <p className="text-slate-400 text-[10px] mt-3 font-bold text-center">
              Leo hết 10 bậc thang để mở cổng Lâu Đài cổ xưa! Bậc hiện tại: {currentQuestionIndex + 1}/10 🏰
            </p>
          </div>
        );

      default:
        // Labyrinth/Maze Visualizer
        return (
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-4 border border-emerald-100 flex flex-col items-center justify-center relative overflow-hidden select-none">
            <span className="absolute top-2 left-3 text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
              {unit.gameName}
            </span>
            <div className="flex items-center gap-1 mt-4 w-full max-w-sm justify-between">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[10px]">🏠</div>
              <div className="flex-1 h-2 bg-slate-100 rounded-full mx-2 overflow-hidden relative">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                <motion.div 
                  animate={{ left: `calc(${progressPercent}% - 8px)` }}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center border border-white"
                  style={{ left: '0%' }}
                >
                  <Footprints size={10} className="text-white" />
                </motion.div>
              </div>
              <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[10px]">🔑</div>
            </div>
            <p className="text-slate-400 text-[10px] mt-3 font-bold text-center">
              Vượt qua mê cung bằng các ngã rẽ ngữ pháp chính xác để tìm chìa khóa! 🔑
            </p>
          </div>
        );
    }
  };

  return (
    <div id={`unit-view-${unit.id}`} className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-xs border border-slate-200/50 select-none">
        <button
          onClick={() => setActiveTab('snapshot')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'snapshot'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          1️⃣ Grammar Snapshot
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === 'practice'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          2️⃣ Gamified Practice
        </button>
      </div>

      {/* TAB 1: GRAMMAR SNAPSHOT */}
      {activeTab === 'snapshot' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-xl text-red-600">
                <BookOpen size={18} />
              </div>
              <h2 className="text-lg font-black text-slate-800">Cấu trúc cốt lõi • Core Formula</h2>
            </div>
            {/* Visual Formula box */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 rounded-xl text-center shadow-inner relative overflow-hidden">
              <span className="text-white/80 font-black tracking-widest text-[10px] uppercase block mb-1">CÔNG THỨC VÀNG</span>
              <span className="text-white text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm font-mono">
                {unit.snapshot.formula}
              </span>
            </div>
            <p className="text-sm text-slate-600 font-medium pt-2 border-t border-slate-50 leading-relaxed">
              {unit.snapshot.explanation}
            </p>
          </div>

          {/* Grammar Snapshot Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-800">Bảng tóm tắt ngữ pháp / Quick Reference</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {unit.snapshot.tableHeaders.map((head, i) => (
                      <th key={i} className="px-6 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {unit.snapshot.tableRows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-slate-800">{row.col1}</td>
                      <td className="px-6 py-3.5 font-semibold text-orange-600 bg-orange-50/20">{row.col2}</td>
                      {row.col3 && (
                        <td className="px-6 py-3.5 font-medium text-slate-600 italic">{row.col3}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Guidelines and Bullets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rule bullets */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                <ShieldCheck size={16} className="text-red-500" /> Quy tắc cần ghi nhớ (Rules)
              </h4>
              <ul className="space-y-3">
                {unit.snapshot.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-xs text-slate-600 font-medium leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] font-black shrink-0 flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Examples list */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                <Sparkles size={16} className="text-orange-500" /> Ví dụ sinh động (Examples)
              </h4>
              <div className="space-y-3">
                {unit.snapshot.examples.map((example, i) => (
                  <div key={i} className="bg-orange-50/30 border border-orange-100/50 rounded-xl p-3 text-xs font-semibold text-slate-700 flex gap-2.5 items-center">
                    <span className="text-lg">⭐</span>
                    <span className="leading-relaxed">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action button to switch tab */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('practice')}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg shadow-red-600/10 flex items-center gap-1.5 transition-colors"
            >
              <span>Vào Chơi Game Luyện Tập</span>
              <Play size={14} className="fill-white" />
            </button>
          </div>
        </motion.div>
      )}

      {/* TAB 2: GAMIFIED PRACTICE */}
      {activeTab === 'practice' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Game Visualizer Section */}
          {!gameFinished && renderGameVisualizer()}

          {/* Active Quiz Area */}
          {!gameFinished ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
              {/* Question Header */}
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <span className="text-[10px] text-slate-400 font-extrabold tracking-widest uppercase">
                  Câu hỏi {currentQuestionIndex + 1} trên 10
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Correct: {score}
                  </span>
                </div>
              </div>

              {/* Question text */}
              <h3 className="text-sm sm:text-base font-black text-slate-800 leading-snug">
                {currentQuestion.question}
              </h3>

              {/* Multiple choice options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 select-none">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === option;
                  const isCorrectAns = option === currentQuestion.answer;
                  
                  let optStyle = 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300';
                  
                  if (isSelected && !isSubmitted) {
                    optStyle = 'border-red-600 bg-red-50 text-red-700 ring-2 ring-red-500/10';
                  } else if (isSubmitted) {
                    if (isCorrectAns) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-black';
                    } else if (isSelected) {
                      optStyle = 'border-red-500 bg-red-50 text-red-800 font-black';
                    } else {
                      optStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={isSubmitted}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full p-3.5 rounded-xl text-xs font-extrabold text-left transition-all border flex justify-between items-center ${optStyle}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && isCorrectAns && (
                        <Check size={16} className="text-emerald-500" />
                      )}
                      {isSubmitted && isSelected && !isCorrectAns && (
                        <X size={16} className="text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submission panel / Submit / Next buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <HelpCircle size={15} />
                  <span className="text-[10px] font-bold">Chọn câu trả lời và nhấn Submit!</span>
                </div>

                {!isSubmitted ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleSubmitAnswer}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    Nộp bài (Submit)
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1"
                  >
                    <span>{currentQuestionIndex < 9 ? 'Câu Kế Tiếp' : 'Hoàn Thành (Finish)'}</span>
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {/* STRICT FEEDBACK EXPLANATION PANEL */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-100 space-y-3.5 mt-4"
                  >
                    <div className="flex items-center gap-2">
                      {selectedOption === currentQuestion.answer ? (
                        <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <Check size={12} />
                          <span>CHÍNH XÁC! EXCELLENT!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-red-100 text-red-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-red-200">
                          <X size={12} />
                          <span>CHƯA ĐÚNG RỒI! TRY AGAIN NEXT TIME!</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                      {/* Left: Grammar Breakdown */}
                      <div className="space-y-1.5">
                        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider leading-none">Đáp án đúng / Correct Answer</p>
                        <p className="text-slate-800 font-extrabold text-xs">👉 {currentQuestion.answer}</p>
                        
                        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider leading-none mt-2">Quy tắc ngữ pháp / Grammar Rule</p>
                        <p className="text-red-600 font-black text-xs">🛡️ {unit.title}</p>
                      </div>

                      {/* Right: Explanations */}
                      <div className="space-y-1.5">
                        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider leading-none">Lý do giải thích / Reason</p>
                        <p className="text-slate-600 leading-relaxed font-medium">{currentQuestion.hint}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/50 pt-2.5 space-y-2 text-[11px]">
                      {/* Memory Tip */}
                      <div className="bg-orange-50/50 border border-orange-100/50 rounded-lg p-2.5 font-bold text-slate-700 flex gap-2 items-start">
                        <span className="text-sm">💡</span>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-black tracking-wider uppercase text-orange-600 leading-none">Mẹo Nhớ Nhanh (Memory Tip)</p>
                          <p className="font-semibold text-slate-600 leading-relaxed">Ta chỉ cần nhớ: {unit.snapshot.formula}. Rất dễ đúng không nào?</p>
                        </div>
                      </div>

                      {/* Motivation */}
                      <p className="text-slate-500 italic font-bold">
                        ☘️ {selectedOption === currentQuestion.answer 
                          ? "Quá tuyệt vời! Thầy cô Anh ngữ LeeGo rất tự hào về con. Tiếp tục phát huy nhé!" 
                          : "Không sao cả đâu con yêu! Lỗi sai chính là người bạn tốt giúp con học nhanh hơn. Cố gắng ở câu tiếp theo nha!"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Centered Floating Feedback Animation overlay */}
              <AnimatePresence>
                {feedbackAnimation && (
                  <motion.div
                    key={feedbackAnimation.id}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1.2, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className={`absolute inset-0 z-50 flex flex-col items-center justify-center ${
                      feedbackAnimation.type === 'correct' 
                        ? 'bg-emerald-500/95 text-white' 
                        : 'bg-rose-500/95 text-white'
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-center p-6 rounded-2xl flex flex-col items-center gap-2"
                    >
                      {feedbackAnimation.type === 'correct' ? (
                        <>
                          <span className="text-4xl">🎉</span>
                          <span className="text-2xl font-black tracking-wider uppercase">{feedbackAnimation.text}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl">💪</span>
                          <span className="text-2xl font-black tracking-wider uppercase">{feedbackAnimation.text}</span>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* GAME FINISHED SUMMARIZATION CARD */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm text-center space-y-6 select-none"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center animate-bounce shadow-md">
                  <Trophy size={36} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                  {score === 10 ? '👑 Điểm 10 Tuyệt Đối!' : score >= 8 ? '🌟 Quá Xuất Sắc!' : score >= 5 ? '🎉 Hoàn Thành Tốt!' : '💪 Đã Hoàn Thành!'}
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-sm">
                  Con đã xuất sắc chiến đấu trong {unit.gameName} và hoàn thành trọn vẹn 10 thử thách!
                </p>
              </div>

              {/* Stats dashboard inside completion */}
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-lg font-black text-slate-800 block">{score}/10</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Đúng</span>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-amber-700">
                  <span className="text-lg font-black block">+{score * 10 + (score === 10 ? 50 : 0)}</span>
                  <span className="text-[10px] text-amber-500 font-bold uppercase">XP</span>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100 text-yellow-700">
                  <span className="text-lg font-black block">+{score >= 5 ? Math.ceil(score / 2) : 1} ⭐</span>
                  <span className="text-[10px] text-yellow-500 font-bold uppercase">Stars</span>
                </div>
              </div>

              {/* List of correct/incorrect questions */}
              <div className="max-w-md mx-auto text-left space-y-2 border-t border-slate-50 pt-4">
                <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Báo cáo tóm tắt câu trả lời:</h4>
                <div className="grid grid-cols-5 gap-1.5">
                  {results.map((res, i) => (
                    <div 
                      key={i} 
                      className={`text-center py-1 rounded-md text-xs font-black border ${
                        res.isCorrect 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                          : 'bg-red-50 border-red-100 text-red-600'
                      }`}
                      title={res.question}
                    >
                      Q{i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={handleResetGame}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Chơi Lại Trò Chơi</span>
                </button>
                <button
                  onClick={handleFinishAndSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg shadow-red-600/10 transition-all flex items-center justify-center gap-1"
                >
                  <span>Hoàn Thành & Nhận Điểm</span>
                  <Check size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
