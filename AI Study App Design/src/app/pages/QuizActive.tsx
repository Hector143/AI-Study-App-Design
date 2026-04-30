import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Clock, Zap, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { categories } from "../data/quizData";
import { useApp } from "../context/AppContext";

export default function QuizActive() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { activeQuiz, addQuizResult } = useApp();

  const category = categories.find((c) => c.id === categoryId);

  const questionCount = activeQuiz?.questionCount || 10;
  const timeLimit = 30; // default seconds per question (stored from setup would require passing through state)

  const [questions, setQuestions] = useState(() => {
    if (!category) return [];
    const shuffled = [...category.questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(questionCount, shuffled.length));
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; selected: number | null; timeTaken: number }[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [streak, setStreak] = useState(0);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    setSelectedOption(null);
    setAnswers((prev) => [...prev, { correct: false, selected: null, timeTaken: 30 }]);
    setStreak(0);
  }, [answered]);

  useEffect(() => {
    if (answered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, answered, handleTimeout]);

  const handleAnswer = (optionIndex: number) => {
    if (answered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTaken = 30 - timeLeft;
    setSelectedOption(optionIndex);
    setAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correct;
    const newStreak = isCorrect ? streak + 1 : 0;
    const xp = isCorrect ? (newStreak >= 3 ? 20 : 10) : 0;

    setStreak(newStreak);
    setXpGained((x) => x + xp);

    if (newStreak === 3) {
      setShowStreakBonus(true);
      setTimeout(() => setShowStreakBonus(false), 2000);
    }

    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { correct: isCorrect, selected: optionIndex, timeTaken }]);
  };

  const handleNext = () => {
    if (isLast) {
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      addQuizResult({
        categoryId: category?.id || "",
        categoryTitle: category?.title || "",
        score,
        total: questions.length,
        date: new Date().toISOString().split("T")[0],
        timeTaken: totalTime,
      });
      navigate(`/quiz/${categoryId}/results`, {
        state: { score, total: questions.length, answers, xpGained, categoryTitle: category?.title, questions },
      });
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
      setShowExplanation(false);
      setTimeLeft(30);
    }
  };

  if (!category || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[#080618] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="mb-4">Something went wrong. Please go back.</p>
          <button onClick={() => navigate("/dashboard")} className="text-violet-400 underline">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100;
  const timerPct = (timeLeft / 30) * 100;
  const timerColor = timeLeft > 15 ? "#8B5CF6" : timeLeft > 7 ? "#F59E0B" : "#EF4444";

  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-[#080618] flex flex-col relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b ${category.gradient} opacity-5`} />
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-indigo-600/8 blur-[80px]" />
      </div>

      {/* Streak Bonus Toast */}
      <AnimatePresence>
        {showStreakBonus && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
            style={{ fontWeight: 700 }}
          >
            <Zap className="w-5 h-5" />
            🔥 3x Streak! Double XP!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 pt-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/quiz/${categoryId}`)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div>
                <div className="text-white text-sm" style={{ fontWeight: 700 }}>{category.title}</div>
                <div className="text-slate-500 text-xs">
                  Question {currentIndex + 1} of {questions.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Streak */}
              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30"
                >
                  <span className="text-orange-400 text-xs" style={{ fontWeight: 700 }}>🔥 {streak}</span>
                </motion.div>
              )}
              {/* Score */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/15 border border-violet-500/30">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-violet-300 text-xs" style={{ fontWeight: 700 }}>{score * 10 + xpGained} XP</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Question dots */}
          <div className="flex items-center gap-1 mb-6">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i < currentIndex
                    ? answers[i]?.correct
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                    : i === currentIndex
                    ? "bg-violet-400 flex-1"
                    : "bg-white/10"
                }`}
                style={{ width: i === currentIndex ? undefined : "12px" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 relative z-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Timer */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Time remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: timerColor }}
                  animate={{ width: `${timerPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span
                className="text-sm w-6 text-right"
                style={{
                  fontWeight: 700,
                  color: timerColor,
                }}
              >
                {timeLeft}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question Card */}
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/10 to-transparent blur-2xl" />
                <div className="text-slate-500 text-xs mb-3" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Question {currentIndex + 1}
                </div>
                <h2 className="text-white relative z-10" style={{ fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.4 }}>
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === currentQuestion.correct;
                  const showResult = answered;

                  let optionStyle = "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/8 hover:border-white/20";

                  if (showResult) {
                    if (isCorrect) {
                      optionStyle = "bg-emerald-500/15 border-emerald-500/50 text-emerald-300";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "bg-rose-500/15 border-rose-500/50 text-rose-300";
                    } else {
                      optionStyle = "bg-white/[0.02] border-white/5 text-slate-500";
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={answered}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={!answered ? { scale: 1.01 } : {}}
                      whileTap={!answered ? { scale: 0.99 } : {}}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${optionStyle} disabled:cursor-default`}
                    >
                      {/* Letter badge */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition-all ${
                          showResult && isCorrect
                            ? "bg-emerald-500 text-white"
                            : showResult && isSelected && !isCorrect
                            ? "bg-rose-500 text-white"
                            : "bg-white/10 text-slate-400"
                        }`}
                        style={{ fontWeight: 700 }}
                      >
                        {optionLetters[i]}
                      </div>

                      <span className="flex-1" style={{ fontWeight: 500 }}>{option}</span>

                      {/* Result icon */}
                      {showResult && (isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      ) : null)}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="flex items-center gap-2 text-violet-400 text-sm mb-3 hover:text-violet-300 transition-colors"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showExplanation ? "Hide" : "Show"} Explanation
                    </button>
                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-4"
                        >
                          <p className="text-violet-200 text-sm" style={{ lineHeight: 1.6 }}>
                            {currentQuestion.explanation}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Feedback Banner */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex items-center justify-between p-4 rounded-xl mb-4 ${
                      selectedOption === currentQuestion.correct
                        ? "bg-emerald-500/15 border border-emerald-500/30"
                        : selectedOption === null
                        ? "bg-amber-500/15 border border-amber-500/30"
                        : "bg-rose-500/15 border border-rose-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedOption === currentQuestion.correct ? (
                        <>
                          <span className="text-2xl">🎉</span>
                          <div>
                            <div className="text-emerald-300 text-sm" style={{ fontWeight: 700 }}>
                              Correct! {streak >= 3 ? "🔥 Streak Bonus!" : ""}
                            </div>
                            <div className="text-emerald-400/70 text-xs">+{streak >= 3 ? 20 : 10} XP earned</div>
                          </div>
                        </>
                      ) : selectedOption === null ? (
                        <>
                          <span className="text-2xl">⏰</span>
                          <div className="text-amber-300 text-sm" style={{ fontWeight: 700 }}>Time's up!</div>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">❌</span>
                          <div>
                            <div className="text-rose-300 text-sm" style={{ fontWeight: 700 }}>Incorrect</div>
                            <div className="text-rose-400/70 text-xs">The correct answer was highlighted</div>
                          </div>
                        </>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm shadow-lg shadow-violet-500/25"
                      style={{ fontWeight: 600 }}
                    >
                      {isLast ? "See Results" : "Next"}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-8" />
    </div>
  );
}