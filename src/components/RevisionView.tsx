import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, BookOpen, PenTool, Sparkles, Check, X, 
  ChevronRight, ChevronLeft, RotateCcw, AlertCircle, HelpCircle,
  BrainCircuit, MessageSquare, Loader2, Award, Star
} from 'lucide-react';
import { SyllabusRevision, Question, WritingChallengeTask } from '../data/syllabus';
import { getTask1Questions, getTask2Questions, evaluateTranslation } from '../data/translationData';

interface RevisionViewProps {
  revision: SyllabusRevision;
  onComplete: (score: number, xp: number, stars: number) => void;
  soundEnabled: boolean;
}

export default function RevisionView({
  revision,
  onComplete,
  soundEnabled
}: RevisionViewProps) {
  // Navigation tabs for the 3 stages
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);

  // Stage 1: Grammar Challenge state
  const [stage1Index, setStage1Index] = useState(0);
  const [stage1Selected, setStage1Selected] = useState<string | null>(null);
  const [stage1Submitted, setStage1Submitted] = useState(false);
  const [stage1Score, setStage1Score] = useState(0);
  const [stage1Answers, setStage1Answers] = useState<Record<number, string>>({});
  const [stage1Explanations, setStage1Explanations] = useState<boolean>(false);

  // Stage 2: Reading Challenge state
  const [stage2Answers, setStage2Answers] = useState<Record<number, string>>({});
  const [stage2Score, setStage2Score] = useState(0);
  const [stage2Submitted, setStage2Submitted] = useState(false);

  // Stage 3: Writing Challenge state
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [writingInputs, setWritingInputs] = useState<Record<number, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiEvaluations, setAiEvaluations] = useState<Record<number, {
    score: number;
    overallFeedback: string;
    corrections: Array<{
      original: string;
      corrected: string;
      grammarRule: string;
      explanation: string;
      memoryTip: string;
      encouragement: string;
    }>;
  }>>({});

  // --- Task 1 Multi-Sentence Workflow State ---
  const [task1QuestionIndex, setTask1QuestionIndex] = useState(0);
  const [task2QuestionIndex, setTask2QuestionIndex] = useState(0);

  // --- Sentence Ordering State variables ---
  const [sentenceWords, setSentenceWords] = useState<Array<{ id: string; text: string }>>([]);
  const [placedSentenceWords, setPlacedSentenceWords] = useState<Array<{ id: string; text: string } | null>>([]);
  const [dragState, setDragState] = useState<{
    word: { id: string; text: string };
    source: 'bank' | 'slot';
    sourceIndex?: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isDragging: boolean;
  } | null>(null);

  // --- Sound & Reward Animation States ---
  const [rewardAnimation, setRewardAnimation] = useState<{ type: 'xp' | 'star' | 'great'; text: string; id: number } | null>(null);

  useEffect(() => {
    if (rewardAnimation) {
      const timer = setTimeout(() => {
        setRewardAnimation(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rewardAnimation]);

  const playCorrectSound = () => {
    if (!soundEnabled) return;
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      playNote(587.33, now, 0.25);
      playNote(880.00, now + 0.08, 0.35);
    } catch (e) {
      console.warn("Web Audio API blocked or not supported", e);
    }
  };

  const playIncorrectSound = () => {
    if (!soundEnabled) return;
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.4);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn("Web Audio API blocked or not supported", e);
    }
  };

  // Initialize Sentence Ordering words
  useEffect(() => {
    if (activeStage === 3 && activeTaskIndex === 0 && currentTask1Question) {
      const targetSentence = currentTask1Question.sampleAnswer.trim();
      const words = targetSentence.split(/\s+/).filter(Boolean).map((word, idx) => ({
        id: `${word}-${idx}-${task1QuestionIndex}`,
        text: word
      }));
      
      let shuffled = [...words];
      let attempt = 0;
      while (attempt < 10) {
        shuffled.sort(() => Math.random() - 0.5);
        if (shuffled.map(w => w.text).join(' ') !== targetSentence && words.length > 1) {
          break;
        }
        attempt++;
      }
      
      setSentenceWords(shuffled);
      setPlacedSentenceWords(Array(words.length).fill(null));
    }
  }, [revision.id, task1QuestionIndex, activeTaskIndex, activeStage]);

  const handlePointerDown = (e: React.PointerEvent, word: { id: string; text: string }, source: 'bank' | 'slot', sourceIndex?: number) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragState({
      word,
      source,
      sourceIndex,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging: false
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragState(prev => {
        if (!prev) return null;
        const dist = Math.hypot(e.clientX - prev.startX, e.clientY - prev.startY);
        const isDragging = prev.isDragging || dist > 5;
        return {
          ...prev,
          currentX: e.clientX,
          currentY: e.clientY,
          isDragging
        };
      });
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragState) return;
      
      const isDrag = dragState.isDragging;
      const word = dragState.word;
      const source = dragState.source;
      const sourceIdx = dragState.sourceIndex;

      setDragState(null);

      // Tap behavior
      if (!isDrag) {
        if (source === 'bank') {
          setPlacedSentenceWords(prev => {
            const next = [...prev];
            const firstEmpty = next.indexOf(null);
            if (firstEmpty !== -1) {
              next[firstEmpty] = word;
              setSentenceWords(bank => bank.filter(w => w.id !== word.id));
            }
            return next;
          });
        } else if (source === 'slot' && sourceIdx !== undefined) {
          setPlacedSentenceWords(prev => {
            const next = [...prev];
            next[sourceIdx] = null;
            return next;
          });
          setSentenceWords(bank => [...bank, word]);
        }
        return;
      }

      // Drag drop behavior
      const element = document.elementFromPoint(e.clientX, e.clientY);
      let dropzoneSlotStr: string | null = null;
      let isBankDropzone = false;

      let curr: Element | null = element;
      while (curr) {
        if (curr.getAttribute('data-slot-index')) {
          dropzoneSlotStr = curr.getAttribute('data-slot-index');
          break;
        }
        if (curr.getAttribute('data-dropzone-bank')) {
          isBankDropzone = true;
          break;
        }
        curr = curr.parentElement;
      }

      if (dropzoneSlotStr !== null) {
        const targetIdx = parseInt(dropzoneSlotStr, 10);
        setPlacedSentenceWords(prev => {
          const next = [...prev];
          const existingWordAtTarget = next[targetIdx];

          if (source === 'bank') {
            next[targetIdx] = word;
            if (existingWordAtTarget) {
              setSentenceWords(bank => [...bank.filter(w => w.id !== word.id), existingWordAtTarget]);
            } else {
              setSentenceWords(bank => bank.filter(w => w.id !== word.id));
            }
          } else if (source === 'slot' && sourceIdx !== undefined) {
            next[sourceIdx] = existingWordAtTarget;
            next[targetIdx] = word;
          }
          return next;
        });
      } else if (isBankDropzone || source === 'slot') {
        if (source === 'slot' && sourceIdx !== undefined) {
          setPlacedSentenceWords(prev => {
            const next = [...prev];
            next[sourceIdx] = null;
            return next;
          });
          setSentenceWords(bank => {
            if (bank.some(w => w.id === word.id)) return bank;
            return [...bank, word];
          });
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState]);

  // Reset all states when active revision changes
  useEffect(() => {
    setActiveStage(1);
    
    // Stage 1 resets
    setStage1Index(0);
    setStage1Selected(null);
    setStage1Submitted(false);
    setStage1Score(0);
    setStage1Answers({});
    setStage1Explanations(false);

    // Stage 2 resets
    setStage2Answers({});
    setStage2Score(0);
    setStage2Submitted(false);

    // Stage 3 resets
    setActiveTaskIndex(0);
    setTask1QuestionIndex(0);
    setTask2QuestionIndex(0);
    setWritingInputs({});
    setIsEvaluating(false);
    setAiEvaluations({});
  }, [revision.id]);

  // Handle Stage 1 logic
  const currentGrammarQ = revision.grammarQuestions[stage1Index];

  const handleStage1Select = (option: string) => {
    if (stage1Submitted) return;
    setStage1Selected(option);
  };

  const handleStage1Submit = () => {
    if (!stage1Selected || stage1Submitted) return;

    const isCorrect = stage1Selected === currentGrammarQ.answer;
    setStage1Submitted(true);
    setStage1Answers(prev => ({ ...prev, [stage1Index]: stage1Selected }));
    
    if (isCorrect) {
      setStage1Score(prev => prev + 1);
    }
    setStage1Explanations(true);
  };

  const handleStage1Next = () => {
    setStage1Submitted(false);
    setStage1Selected(null);
    setStage1Explanations(false);

    if (stage1Index < revision.grammarQuestions.length - 1) {
      setStage1Index(prev => prev + 1);
    } else {
      // Completed Stage 1, automatically prompt to move to Stage 2
      setActiveStage(2);
    }
  };

  // Handle Stage 2 logic
  const handleStage2Select = (qId: number, option: string) => {
    if (stage2Submitted) return;
    setStage2Answers(prev => ({ ...prev, [qId]: option }));
  };

  const handleStage2Submit = () => {
    if (stage2Submitted) return;

    let correctCount = 0;
    revision.readingChallenge.questions.forEach(q => {
      if (stage2Answers[q.id] === q.answer) {
        correctCount += 1;
      }
    });

    setStage2Score(correctCount);
    setStage2Submitted(true);
  };

  const handleStage2Next = () => {
    setActiveStage(3);
  };

  // Handle Stage 3 logic (AI Writing Evaluation)
  const activeWritingTask = revision.writingChallenge[activeTaskIndex] || revision.writingChallenge[0];
  const task1Questions = getTask1Questions(revision.id, revision.writingChallenge[0]);
  const currentTask1Question = task1Questions[task1QuestionIndex];
  const task2Questions = getTask2Questions(revision.id);
  const currentTask2Question = task2Questions[task2QuestionIndex];

  const handleWritingInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const activeId = activeTaskIndex === 0 ? currentTask1Question.id : currentTask2Question.id;
    setWritingInputs(prev => ({ ...prev, [activeId]: text }));
  };

  const handleAIEvaluate = async () => {
    if (activeTaskIndex === 0) {
      // Task 1 Sentence Ordering Checking
      const targetSentence = currentTask1Question.sampleAnswer.trim();
      const currentSentence = placedSentenceWords
        .map(w => w?.text || '')
        .join(' ')
        .trim();
      
      const normalize = (str: string) => str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim();
      const isCorrect = normalize(currentSentence) === normalize(targetSentence);

      setIsEvaluating(true);
      // Simulate a small delay for a premium feel
      await new Promise(resolve => setTimeout(resolve, 600));

      if (isCorrect) {
        playCorrectSound();
        setRewardAnimation({
          type: Math.random() > 0.5 ? 'xp' : 'star',
          text: ['+10 XP', '+5 Stars', 'Excellent!', 'Perfect!', 'Great!'][Math.floor(Math.random() * 5)],
          id: Date.now()
        });
        setAiEvaluations(prev => ({
          ...prev,
          [currentTask1Question.id]: {
            score: 10,
            overallFeedback: "Tuyệt vời! Con đã sắp xếp câu chính xác hoàn toàn.",
            corrections: []
          }
        }));
      } else {
        playIncorrectSound();
        setAiEvaluations(prev => ({
          ...prev,
          [currentTask1Question.id]: {
            score: 0,
            overallFeedback: "Chưa chính xác. Con hãy kiểm tra lại trật tự từ hoặc bấm nút Làm lại để thử lại nhé!",
            corrections: []
          }
        }));
      }
      setIsEvaluating(false);
    } else {
      // Task 2 Sentence Writing (Translation) Checking
      const studentText = writingInputs[currentTask2Question.id];
      if (!studentText || studentText.trim() === "") return;

      setIsEvaluating(true);

      const data = evaluateTranslation(studentText, currentTask2Question.correctAnswers);

      // Simulate a small delay for a premium feel
      await new Promise(resolve => setTimeout(resolve, 800));

      setAiEvaluations(prev => ({ ...prev, [currentTask2Question.id]: data }));
      setIsEvaluating(false);

      if (data.score >= 90 || data.isCorrect) {
        playCorrectSound();
        setRewardAnimation({
          type: Math.random() > 0.5 ? 'xp' : 'star',
          text: ['+10 XP', '+5 Stars', 'Excellent!', 'Perfect!', 'Great!'][Math.floor(Math.random() * 5)],
          id: Date.now()
        });
      } else {
        playIncorrectSound();
      }
    }
  };

  // Complete entire Revision and earn rewards!
  const handleFinishRevision = () => {
    const grammarPoints = stage1Score;
    const readingPoints = stage2Score;

    // Task 1 (Q1, Q2, Q3) average score out of 10
    const q1 = aiEvaluations[task1Questions[0].id]?.score || 8;
    const q2 = aiEvaluations[task1Questions[1].id]?.score || 8;
    const q3 = aiEvaluations[task1Questions[2].id]?.score || 8;
    const task1Score = (q1 + q2 + q3) / 3;

    // Task 2 (Q1, Q2) average score out of 100, scaled to 10
    const t2q1 = aiEvaluations[task2Questions[0].id]?.score || 80;
    const t2q2 = aiEvaluations[task2Questions[1].id]?.score || 80;
    const task2Score = ((t2q1 + t2q2) / 2) / 10;

    // Final stage 3 points (average out of 10)
    const writingPoints = (task1Score + task2Score) / 2;

    const totalScore = Math.round(((grammarPoints + readingPoints + writingPoints) / 38) * 10);

    // Reward: 200 XP for completing a revision challenge, plus stars
    const earnedXp = 150 + totalScore * 10;
    const earnedStars = totalScore >= 8 ? 10 : 5;

    onComplete(totalScore, earnedXp, earnedStars);
  };

  return (
    <div id={`revision-view-${revision.id}`} className="space-y-6">
      {/* Stage Headers Wizard Nav */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl select-none text-center">
        <button
          disabled={isEvaluating}
          onClick={() => setActiveStage(1)}
          className={`py-3 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all ${
            activeStage === 1
              ? 'bg-red-600 text-white shadow-md shadow-red-600/10'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          1️⃣ Grammar Challenge
        </button>
        <button
          disabled={isEvaluating}
          onClick={() => setActiveStage(2)}
          className={`py-3 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all ${
            activeStage === 2
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          2️⃣ Reading Challenge
        </button>
        <button
          disabled={isEvaluating}
          onClick={() => setActiveStage(3)}
          className={`py-3 px-2 rounded-xl text-[10px] sm:text-xs font-black transition-all ${
            activeStage === 3
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          3️⃣ Writing Challenge
        </button>
      </div>

      {/* STAGE 1: GAMIFIED GRAMMAR CHALLENGE */}
      {activeStage === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-wider block">CHALLENGE 1: GRAMMAR SPEEDRUN</span>
                <span className="text-xs font-black text-slate-700">Câu hỏi {stage1Index + 1} / {revision.grammarQuestions.length}</span>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Đúng: {stage1Score}
              </span>
            </div>

            {/* Questions tracker dots */}
            <div className="flex flex-wrap gap-1">
              {revision.grammarQuestions.map((q, idx) => {
                const ans = stage1Answers[idx];
                const isCurrent = stage1Index === idx;
                const isCorrect = ans ? ans === q.answer : null;

                let dotColor = 'bg-slate-100 border-slate-100';
                if (isCurrent) dotColor = 'bg-red-500 border-red-500 scale-110';
                else if (isCorrect === true) dotColor = 'bg-emerald-500 border-emerald-500';
                else if (isCorrect === false) dotColor = 'bg-red-400 border-red-400';

                return (
                  <div 
                    key={idx} 
                    className={`w-3.5 h-3.5 rounded-full border text-[7px] font-black text-white flex items-center justify-center transition-all ${dotColor}`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>

            {/* Active question */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm sm:text-base font-black text-slate-800 leading-snug">
                {currentGrammarQ.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentGrammarQ.options.map((option, idx) => {
                  const isSel = stage1Selected === option;
                  const isAnsCorrect = option === currentGrammarQ.answer;

                  let btnStyle = 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50';
                  if (isSel && !stage1Submitted) {
                    btnStyle = 'border-red-600 bg-red-50 text-red-700 ring-2 ring-red-500/10';
                  } else if (stage1Submitted) {
                    if (isAnsCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                    } else if (isSel) {
                      btnStyle = 'border-red-500 bg-red-50 text-red-800 font-bold';
                    } else {
                      btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={stage1Submitted}
                      onClick={() => handleStage1Select(option)}
                      className={`w-full p-3.5 rounded-xl text-xs font-extrabold text-left transition-all border flex justify-between items-center ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {stage1Submitted && isAnsCorrect && <Check size={16} className="text-emerald-500" />}
                      {stage1Submitted && isSel && !isAnsCorrect && <X size={16} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage 1 actions footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <div className="text-[10px] text-slate-400 font-bold">
                Mỗi câu trả lời đúng đóng góp 10 XP vào kết quả thám hiểm!
              </div>

              {!stage1Submitted ? (
                <button
                  disabled={!stage1Selected}
                  onClick={handleStage1Submit}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Nộp câu trả lời
                </button>
              ) : (
                <button
                  onClick={handleStage1Next}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>{stage1Index < revision.grammarQuestions.length - 1 ? 'Câu Tiếp Theo' : 'Tiếp Tục ➔ 2️⃣ Reading'}</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>

            {/* Stage 1 explanations explanation */}
            <AnimatePresence>
              {stage1Explanations && stage1Submitted && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-4 text-xs font-semibold space-y-2.5"
                >
                  <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider leading-none">Đáp án đúng (Correct Answer)</p>
                  <p className="text-slate-800 font-black">👉 {currentGrammarQ.answer}</p>
                  <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider leading-none">Giải thích học thuật (Explanation)</p>
                  <p className="text-slate-600 leading-relaxed font-medium">{currentGrammarQ.hint}</p>
                  <p className="text-[11px] text-slate-500 italic">
                    ☘️ {stage1Selected === currentGrammarQ.answer 
                      ? "Chúc mừng con! Giỏi lắm nha!" 
                      : "Sai một câu không sao đâu con, chúng mình cùng ghi nhớ để làm tốt hơn nha!"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* STAGE 2: READING CHALLENGE */}
      {activeStage === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left column: Movers passage card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 h-fit">
            <span className="text-[10px] text-orange-600 font-extrabold tracking-wider uppercase block">STAGE 2: CAMBRIDGE MOVERS READING PASSAGE</span>
            <h2 className="text-lg font-black text-slate-800 leading-tight">
              📖 {revision.readingChallenge.title}
            </h2>
            <div className="bg-orange-50/20 rounded-xl p-4 sm:p-5 border border-orange-100/50 leading-relaxed text-xs sm:text-sm font-semibold text-slate-700 whitespace-pre-wrap select-text">
              {revision.readingChallenge.passage}
            </div>
            <p className="text-[10px] text-slate-400 font-bold italic">
              * Movers Reading tips: Đọc thật kỹ câu chuyện để tìm các từ và chi tiết ngữ pháp chính xác ứng với từng câu hỏi.
            </p>
          </div>

          {/* Right column: Questions list */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">Thử thách đọc hiểu</span>
                {stage2Submitted && (
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 rounded-full">
                    Kết quả: {stage2Score} / {revision.readingChallenge.questions.length} đúng
                  </span>
                )}
              </div>

              {/* Reading Questions render */}
              <div className="space-y-5 max-h-[350px] overflow-y-auto pr-1">
                {revision.readingChallenge.questions.map((q, idx) => {
                  const selected = stage2Answers[q.id];
                  
                  return (
                    <div key={q.id} className="space-y-2 border-b border-slate-50 pb-4">
                      <h4 className="text-xs font-black text-slate-800">
                        {idx + 1}. {q.question}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((option, oIdx) => {
                          const isSel = selected === option;
                          const isCorrect = option === q.answer;

                          let bStyle = 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50';
                          if (isSel && !stage2Submitted) {
                            bStyle = 'border-orange-500 bg-orange-50 text-orange-700';
                          } else if (stage2Submitted) {
                            if (isCorrect) {
                              bStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                            } else if (isSel) {
                              bStyle = 'border-red-500 bg-red-50 text-red-800 font-bold';
                            } else {
                              bStyle = 'border-slate-50 bg-slate-50 text-slate-400 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={stage2Submitted}
                              onClick={() => handleStage2Select(q.id, option)}
                              className={`p-2.5 rounded-xl text-[11px] font-extrabold text-left border transition-all ${bStyle}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reading submit actions */}
            <div className="flex justify-end pt-4 border-t border-slate-50">
              {!stage2Submitted ? (
                <button
                  disabled={Object.keys(stage2Answers).length < revision.readingChallenge.questions.length}
                  onClick={handleStage2Submit}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Nộp bài đọc (Submit)
                </button>
              ) : (
                <button
                  onClick={handleStage2Next}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>Tiếp Tục ➔ 3️⃣ Writing</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* STAGE 3: WRITING CHALLENGE */}
      {activeStage === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Tab selectors for sub-writing-tasks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6 relative">
            
            {/* Centered Floating Reward Animation overlay */}
            <AnimatePresence>
              {rewardAnimation && (
                <motion.div
                  key={rewardAnimation.id}
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1.3, y: -45 }}
                  exit={{ opacity: 0, y: -90 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute pointer-events-none z-50 flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 border border-emerald-400 text-white rounded-full font-black text-xs shadow-lg shadow-emerald-500/20 left-1/2 -translate-x-1/2 top-1/3"
                >
                  {rewardAnimation.type === 'xp' && <span className="text-amber-300">⚡</span>}
                  {rewardAnimation.type === 'star' && <span className="text-amber-300">⭐</span>}
                  <span>{rewardAnimation.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider block">STAGE 3: CAMBRIDGE MOVERS AI WRITING CHALLENGE</span>
                <span className="text-xs font-black text-slate-700">Hãy chọn một đề tài và tập viết nhé!</span>
              </div>
              <div className="flex gap-1.5">
                {revision.writingChallenge.map((task, idx) => (
                  <button
                    key={task.id}
                    onClick={() => setActiveTaskIndex(idx)}
                    className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg border transition-all ${
                      activeTaskIndex === idx
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-100'
                    }`}
                  >
                    Task {idx + 1}: {idx === 0 ? "SẮP XẾP CÂU" : "DỊCH CÂU"}
                  </button>
                ))}
              </div>
            </div>

            {/* Active writing task layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Task Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
                    {activeTaskIndex === 0 ? "Task 1: Sắp xếp" : "Task 2: Luyện viết"} {activeTaskIndex === 0 ? `(Câu ${task1QuestionIndex + 1}/3)` : `(Câu ${task2QuestionIndex + 1}/2)`}
                  </span>
                  <h3 className="text-sm font-black text-slate-800">
                    {activeTaskIndex === 0 ? "Sắp xếp từ thành câu đúng" : "Dịch câu sang tiếng Anh"}
                  </h3>
                </div>

                <div className="p-4 bg-amber-50/20 border border-amber-100 rounded-xl space-y-3">
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                    📝 <strong className="text-slate-800">Đề bài (Prompt):</strong> {activeTaskIndex === 0 ? currentTask1Question.prompt : `Dịch câu tiếng Việt dưới đây sang tiếng Anh:`}
                  </p>
                  
                  {activeTaskIndex === 1 && (
                    <p className="text-sm font-black text-slate-800 bg-white p-3 rounded-lg border border-slate-100 mt-2 select-text">
                      👉 {currentTask2Question.vietnamese}
                    </p>
                  )}
                  
                  {activeTaskIndex === 0 && currentTask1Question.helperWords && currentTask1Question.helperWords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-amber-100/30">
                      <span className="text-[9px] text-amber-700 font-extrabold uppercase block w-full">Từ vựng gợi ý (Vocabulary help):</span>
                      {currentTask1Question.helperWords.map((word, i) => (
                        <span key={i} className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-100">
                          {word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Display Correct Answer after grading */}
                {(activeTaskIndex === 0 ? aiEvaluations[currentTask1Question.id] : aiEvaluations[currentTask2Question.id]) && (
                  <div className="space-y-1 bg-emerald-50/30 border border-emerald-100/30 p-3.5 rounded-xl">
                    <p className="text-[10px] text-emerald-800 font-bold uppercase leading-none">Đáp án mẫu chuẩn (Correct Answer):</p>
                    <p className="text-xs font-black text-emerald-700 leading-relaxed pt-1.5 select-text">
                      👉 {activeTaskIndex === 0 ? currentTask1Question.sampleAnswer : currentTask2Question.correctAnswers[0]}
                    </p>
                  </div>
                )}
              </div>

              {/* Student Workspace Column */}
              {activeTaskIndex === 0 ? (
                /* Sentence Ordering Drag & Drop Workspace (Task 1) */
                <div className="flex flex-col space-y-4 select-none relative">
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                      Sắp xếp các từ thành câu đúng (Kéo thả hoặc chạm vào các từ):
                    </label>
                    
                    {/* Target Slots */}
                    <div className="min-h-[96px] p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center content-center relative">
                      {placedSentenceWords.map((word, idx) => (
                        <div
                          key={`slot-${idx}`}
                          data-slot-index={idx}
                          className={`min-w-[60px] h-[36px] rounded-xl flex items-center justify-center transition-all ${
                            word 
                              ? 'bg-amber-100 border border-amber-300 text-slate-800 font-bold text-xs px-3 shadow-sm cursor-grab active:cursor-grabbing'
                              : 'bg-slate-100/50 border border-dashed border-slate-200 text-slate-300'
                          } ${
                            dragState?.source === 'slot' && dragState?.sourceIndex === idx && dragState.isDragging ? 'opacity-30' : ''
                          }`}
                          style={{ touchAction: 'none' }}
                          onPointerDown={(e) => word && !aiEvaluations[currentTask1Question.id] && handlePointerDown(e, word, 'slot', idx)}
                        >
                          {word ? word.text : ''}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Word Bank */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                      Kho từ vựng (Word Bank):
                    </label>
                    <div
                      data-dropzone-bank="true"
                      className="min-h-[80px] p-4 bg-white border border-slate-100 rounded-2xl flex flex-wrap gap-2 items-center justify-center content-center"
                    >
                      {sentenceWords.map((word) => {
                        const isBeingDragged = dragState?.word.id === word.id && dragState.isDragging;
                        return (
                          <div
                            key={word.id}
                            className={`bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl shadow-xs cursor-grab active:cursor-grabbing transition-all select-none ${
                              isBeingDragged ? 'opacity-30' : ''
                            }`}
                            style={{ touchAction: 'none' }}
                            onPointerDown={(e) => !aiEvaluations[currentTask1Question.id] && handlePointerDown(e, word, 'bank')}
                          >
                            {word.text}
                          </div>
                        );
                      })}
                      {sentenceWords.length === 0 && placedSentenceWords.filter(Boolean).length === 0 && (
                        <span className="text-slate-300 text-xs italic">Không có từ nào</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons for Task 1 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (currentTask1Question) {
                          const words = currentTask1Question.sampleAnswer.trim().split(/\s+/).filter(Boolean).map((word, idx) => ({
                            id: `${word}-${idx}-${task1QuestionIndex}`,
                            text: word
                          }));
                          let shuffled = [...words];
                          shuffled.sort(() => Math.random() - 0.5);
                          setSentenceWords(shuffled);
                          setPlacedSentenceWords(Array(words.length).fill(null));
                          setAiEvaluations(prev => {
                            const next = { ...prev };
                            delete next[currentTask1Question.id];
                            return next;
                          });
                        }
                      }}
                      disabled={isEvaluating}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      <span>Làm lại (Reset)</span>
                    </button>

                    <button
                      onClick={handleAIEvaluate}
                      disabled={isEvaluating || placedSentenceWords.includes(null) || !!aiEvaluations[currentTask1Question.id]}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Đang kiểm tra...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Kiểm tra (Check)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Sentence Writing Textarea Workspace (Task 2) */
                <div className="flex flex-col space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                      BÀI VIẾT CỦA CON (YOUR WRITING TEXT):
                    </label>
                    <textarea
                      disabled={isEvaluating || !!aiEvaluations[currentTask2Question.id]}
                      rows={5}
                      value={writingInputs[currentTask2Question.id] || ''}
                      onChange={handleWritingInputChange}
                      placeholder="Gõ câu dịch tiếng Anh của con tại đây..."
                      className="w-full p-4 rounded-xl border border-slate-200/80 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-amber-500 text-slate-700 select-text bg-white disabled:bg-slate-50"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={isEvaluating || !(writingInputs[currentTask2Question.id]) || (writingInputs[currentTask2Question.id] || '').trim() === "" || !!aiEvaluations[currentTask2Question.id]}
                      onClick={handleAIEvaluate}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>LeeGo AI Tutor đang chấm...</span>
                        </>
                      ) : (
                        <>
                          <BrainCircuit size={16} />
                          <span>Chấm bài (Submit)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Evaluation parsed response area */}
            <AnimatePresence>
              {(activeTaskIndex === 0 ? aiEvaluations[currentTask1Question.id] : aiEvaluations[currentTask2Question.id]) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gradient-to-br from-amber-50/20 via-white to-orange-50/20 rounded-xl p-5 border border-amber-100/70 space-y-4 mt-6 text-xs font-semibold select-text"
                >
                  <div className="flex items-center justify-between border-b border-amber-100/30 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                        <MessageSquare size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black tracking-wider uppercase text-amber-600 leading-none">Báo cáo kết quả bài làm</p>
                        <h4 className="font-extrabold text-sm text-slate-800">LeeGo AI Grammar Tutor Report</h4>
                      </div>
                    </div>
                    {/* Grade indicator */}
                    <div className="bg-red-600 text-white font-black text-lg w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-md shadow-red-500/10">
                      <span className="text-[8px] leading-none text-red-100 font-extrabold">SCORE</span>
                      <span className="leading-none mt-0.5">
                        {activeTaskIndex === 0 
                          ? `${aiEvaluations[currentTask1Question.id].score}/10` 
                          : `${aiEvaluations[currentTask2Question.id].score}/100`}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <p className="text-slate-600 leading-relaxed font-semibold text-xs italic bg-amber-50/30 p-3 rounded-xl border border-amber-100/30">
                    🍀 {activeTaskIndex === 0 
                      ? aiEvaluations[currentTask1Question.id].overallFeedback 
                      : aiEvaluations[currentTask2Question.id].overallFeedback}
                  </p>

                  {/* Task 2 Score Breakdown */}
                  {activeTaskIndex === 1 && (
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block uppercase">Grammar</span>
                        <span className="text-slate-700 font-black text-xs">{(aiEvaluations[currentTask2Question.id] as any).grammarScore}/100</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block uppercase">Vocabulary</span>
                        <span className="text-slate-700 font-black text-xs">{(aiEvaluations[currentTask2Question.id] as any).vocabScore}/100</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block uppercase">Structure</span>
                        <span className="text-slate-700 font-black text-xs">{(aiEvaluations[currentTask2Question.id] as any).structureScore}/100</span>
                      </div>
                    </div>
                  )}

                  {/* Corrections Loop for Task 2 */}
                  {activeTaskIndex === 1 && aiEvaluations[currentTask2Question.id].corrections && aiEvaluations[currentTask2Question.id].corrections.length > 0 && (
                    <div className="space-y-3 pt-1">
                      <h5 className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider">Chi tiết sửa lỗi (Corrections):</h5>
                      {aiEvaluations[currentTask2Question.id].corrections.map((corr, cIdx) => (
                        <div key={cIdx} className="bg-white rounded-xl p-4 border border-slate-100 space-y-3 shadow-sm shadow-slate-100/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <div className="space-y-1 bg-red-50/20 border border-red-100/30 p-2.5 rounded-lg">
                              <p className="text-[8px] text-red-500 font-black uppercase">Đoạn nguyên bản (Original):</p>
                              <p className="text-red-700 text-xs font-bold font-mono line-through select-text">{corr.original}</p>
                            </div>
                            <div className="space-y-1 bg-emerald-50/20 border border-emerald-100/30 p-2.5 rounded-lg">
                              <p className="text-[8px] text-emerald-500 font-black uppercase">LeeGo gợi ý (Corrected):</p>
                              <p className="text-emerald-700 text-xs font-bold font-mono select-text">{corr.corrected}</p>
                            </div>
                          </div>

                          <div className="space-y-1 text-[11px] leading-relaxed">
                            <p className="text-slate-400 text-[9px] font-black uppercase leading-none">Chủ điểm áp dụng / Grammar Rule</p>
                            <p className="text-slate-700 font-black">🛡️ {corr.grammarRule}</p>
                            
                            <p className="text-slate-400 text-[9px] font-black uppercase leading-none mt-2">Phân tích lỗi sai / Explanation</p>
                            <p className="text-slate-600 leading-relaxed font-medium">{corr.explanation}</p>

                            <div className="bg-orange-50/40 rounded-lg p-2.5 border border-orange-100/30 text-xs font-semibold mt-2.5 flex gap-1.5 items-start">
                              <span className="text-sm">💡</span>
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-orange-600 block leading-none mb-0.5">Mẹo nhớ của cô giáo (Memory Tip)</span>
                                <p className="text-slate-600 font-semibold">{corr.memoryTip}</p>
                              </div>
                            </div>
                          </div>

                          <p className="text-slate-500 italic text-[11px]">
                            🏆 {corr.encouragement}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Task 1 Sequential buttons inside evaluation card */}
                  {activeTaskIndex === 0 && (
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      {task1QuestionIndex < 2 ? (
                        <button
                          onClick={() => setTask1QuestionIndex(prev => prev + 1)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <span>Câu tiếp theo</span>
                          <ChevronRight size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTaskIndex(1)}
                          className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <span>Hoàn thành Task 1</span>
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Task 2 Sequential buttons inside evaluation card */}
                  {activeTaskIndex === 1 && (
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      {task2QuestionIndex < 1 ? (
                        <button
                          onClick={() => setTask2QuestionIndex(prev => prev + 1)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <span>Câu tiếp theo</span>
                          <ChevronRight size={14} />
                        </button>
                      ) : (
                        <div className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <span>🎉 Con đã hoàn tất 2 câu dịch! Hãy nộp kết quả bên dưới.</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FINAL REVISION SUBMISSION CARD BLOCK */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left select-none">
            <div className="space-y-1">
              <h3 className="font-black text-slate-800 text-sm">Nộp kết quả kỳ thám hiểm Revision</h3>
              <p className="text-xs text-slate-400 font-semibold">Sau khi hoàn thành 3 chặng, con đã sẵn sàng nhận thưởng lớn gồm XP và Stars chưa?</p>
            </div>
            <button
              onClick={handleFinishRevision}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-8 py-3 rounded-xl shadow-lg shadow-red-600/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Nộp Kết Quả & Hoàn Thành</span>
              <Award size={15} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Custom drag ghost clone overlay */}
      {dragState && dragState.isDragging && (
        <div
          style={{
            position: 'fixed',
            left: dragState.currentX,
            top: dragState.currentY,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className="bg-amber-100 border border-amber-300 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl whitespace-nowrap"
        >
          {dragState.word.text}
        </div>
      )}
    </div>
  );
}
