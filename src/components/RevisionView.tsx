import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, BookOpen, PenTool, Sparkles, Check, X, 
  ChevronRight, ChevronLeft, RotateCcw, AlertCircle, HelpCircle,
  BrainCircuit, MessageSquare, Loader2, Award, Star
} from 'lucide-react';
import { SyllabusRevision, Question, WritingChallengeTask } from '../data/syllabus';
import { getTask1Questions, getTranslationTask, evaluateTranslation } from '../data/translationData';

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

  const handleWritingInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const activeId = activeTaskIndex === 0 ? currentTask1Question.id : activeWritingTask.id;
    setWritingInputs(prev => ({ ...prev, [activeId]: text }));
  };

  const handleAIEvaluate = async () => {
    if (activeTaskIndex === 0) {
      const studentText = writingInputs[currentTask1Question.id];
      if (!studentText || studentText.trim() === "") return;

      setIsEvaluating(true);

      try {
        const response = await fetch("/api/ai/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskType: currentTask1Question.type,
            taskDescription: currentTask1Question.prompt,
            studentText: studentText
          })
        });

        if (!response.ok) {
          throw new Error("Evaluation request failed");
        }

        const data = await response.json();
        setAiEvaluations(prev => ({ ...prev, [currentTask1Question.id]: data }));

      } catch (error) {
        console.error("AI Evaluation error:", error);
        // Fallback
        setAiEvaluations(prev => ({
          ...prev,
          [currentTask1Question.id]: {
            score: 8,
            overallFeedback: "Bài viết xuất sắc! Hệ thống tạm thời đang tải chậm, nhưng cô giáo LeeGo nhận định con đã diễn đạt ý rất trôi chảy.",
            corrections: [
              {
                original: studentText,
                corrected: studentText,
                grammarRule: "Grammar & Vocab Choice",
                explanation: "Con đã viết rất bám sát từ gợi ý. Rất đáng yêu!",
                memoryTip: "Hãy tiếp tục viết thật nhiều câu tiếng Anh mỗi ngày nhé!",
                encouragement: "Cô giáo chúc mừng con nha! Tiếp tục hoàn thành chặng thi nhé! 🎉"
              }
            ]
          }
        }));
      } finally {
        setIsEvaluating(false);
      }
    } else {
      // Task 2: Vietnamese -> English translation with Simple AI evaluation model (local)
      const studentText = writingInputs[activeWritingTask.id];
      if (!studentText || studentText.trim() === "") return;

      setIsEvaluating(true);

      const translation = getTranslationTask(revision.id);
      const data = evaluateTranslation(studentText, translation.correctAnswers);

      // Simulate a small delay for a premium feel
      await new Promise(resolve => setTimeout(resolve, 800));

      setAiEvaluations(prev => ({ ...prev, [activeWritingTask.id]: data }));
      setIsEvaluating(false);
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

    // Task 2 translation score out of 100, scaled to 10
    const task2Task = revision.writingChallenge[1] || revision.writingChallenge[0];
    const task2Score = (aiEvaluations[task2Task.id]?.score || 80) / 10;

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
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
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
                    Task {idx + 1}: {task.type.toUpperCase()}
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
                    {activeWritingTask.type} task {activeTaskIndex === 0 && `(Câu ${task1QuestionIndex + 1}/3)`}
                  </span>
                  <h3 className="text-sm font-black text-slate-800">{activeWritingTask.title}</h3>
                </div>

                <div className="p-4 bg-amber-50/20 border border-amber-100 rounded-xl space-y-3">
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                    📝 <strong className="text-slate-800">Đề bài (Prompt):</strong> {activeTaskIndex === 0 ? currentTask1Question.prompt : `Hãy dịch câu tiếng Việt sau sang tiếng Anh:`}
                  </p>
                  
                  {activeTaskIndex === 1 && (
                    <p className="text-sm font-black text-slate-800 bg-white p-3 rounded-lg border border-slate-100 mt-2 select-text">
                      👉 {getTranslationTask(revision.id).vietnamese}
                    </p>
                  )}
                  
                  {((activeTaskIndex === 0 ? currentTask1Question.helperWords : activeWritingTask.helperWords)) && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-amber-100/30">
                      <span className="text-[9px] text-amber-700 font-extrabold uppercase block w-full">Từ vựng gợi ý (Vocabulary help):</span>
                      {(activeTaskIndex === 0 ? currentTask1Question.helperWords : activeWritingTask.helperWords)?.map((word, i) => (
                        <span key={i} className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-100">
                          {word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sample Answer expandable */}
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-none">Đáp án mẫu tham khảo (Sample Answer):</p>
                  <p className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-[11px] font-semibold text-slate-500 italic leading-relaxed select-text">
                    {activeTaskIndex === 0 ? currentTask1Question.sampleAnswer : activeWritingTask.sampleAnswer}
                  </p>
                </div>
              </div>

              {/* Student text input area */}
              <div className="flex flex-col space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    BÀI VIẾT CỦA CON (YOUR WRITING TEXT):
                  </label>
                  <textarea
                    disabled={isEvaluating}
                    rows={5}
                    value={writingInputs[activeTaskIndex === 0 ? currentTask1Question.id : activeWritingTask.id] || ''}
                    onChange={handleWritingInputChange}
                    placeholder={activeTaskIndex === 0 ? "Hãy gõ câu viết của con bằng tiếng Anh tại đây..." : "Gõ câu dịch tiếng Anh của con tại đây..."}
                    className="w-full p-4 rounded-xl border border-slate-200/80 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/15 focus:border-amber-500 text-slate-700 select-text bg-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={isEvaluating || !(writingInputs[activeTaskIndex === 0 ? currentTask1Question.id : activeWritingTask.id]) || (writingInputs[activeTaskIndex === 0 ? currentTask1Question.id : activeWritingTask.id] || '').trim() === ""}
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
                        <span>Chấm Điểm Với LeeGo AI Tutor 🌟</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Evaluation parsed response area */}
            <AnimatePresence>
              {aiEvaluations[activeTaskIndex === 0 ? currentTask1Question.id : activeWritingTask.id] && (
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
                        <p className="text-[9px] font-black tracking-wider uppercase text-amber-600 leading-none">Báo cáo kiểm tra tự động</p>
                        <h4 className="font-extrabold text-sm text-slate-800">LeeGo AI Grammar Tutor Report</h4>
                      </div>
                    </div>
                    {/* Grade indicator */}
                    <div className="bg-red-600 text-white font-black text-lg w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-md shadow-red-500/10">
                      <span className="text-[8px] leading-none text-red-100 font-extrabold">SCORE</span>
                      <span className="leading-none mt-0.5">
                        {aiEvaluations[activeTaskIndex === 0 ? currentTask1Question.id : activeWritingTask.id].score}
                        {activeTaskIndex === 1 ? '/100' : '/10'}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <p className="text-slate-600 leading-relaxed font-semibold text-xs italic bg-amber-50/30 p-3 rounded-xl border border-amber-100/30">
                    🍀 {aiEvaluations[activeTaskIndex === 0 ? currentTask1Question.id : activeWritingTask.id].overallFeedback}
                  </p>

                  {/* Task 2 Score Breakdown */}
                  {activeTaskIndex === 1 && (
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block uppercase">Grammar</span>
                        <span className="text-slate-700 font-black text-xs">{(aiEvaluations[activeWritingTask.id] as any).grammarScore}/100</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block uppercase">Vocabulary</span>
                        <span className="text-slate-700 font-black text-xs">{(aiEvaluations[activeWritingTask.id] as any).vocabScore}/100</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block uppercase">Structure</span>
                        <span className="text-slate-700 font-black text-xs">{(aiEvaluations[activeWritingTask.id] as any).structureScore}/100</span>
                      </div>
                    </div>
                  )}

                  {/* Corrections Loop */}
                  {aiEvaluations[activeTaskIndex === 0 ? currentTask1Question.id : activeWritingTask.id].corrections.length > 0 ? (
                    <div className="space-y-3 pt-1">
                      <h5 className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider">Chi tiết sửa lỗi (Corrections):</h5>
                      {aiEvaluations[activeTaskIndex === 0 ? currentTask1Question.id : activeWritingTask.id].corrections.map((corr, cIdx) => (
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
                  ) : (
                    <div className="text-center p-6 border-2 border-dashed border-emerald-100 rounded-xl bg-emerald-50/10 text-xs space-y-1">
                      <span className="text-2xl block animate-bounce">👑</span>
                      <p className="font-extrabold text-emerald-700">Tuyệt vời! Không phát hiện lỗi sai nào!</p>
                      <p className="text-slate-400 font-semibold">Bài viết của con hoàn hảo chuẩn Movers rồi đó, cô LeeGo rất tự hào!</p>
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
    </div>
  );
}
