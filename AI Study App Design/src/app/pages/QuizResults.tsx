import { useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { motion } from "motion/react";
import {
  Trophy, RotateCcw, Home, Share2, Zap, Star, CheckCircle, XCircle, ArrowRight, BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";
import { categories } from "../data/quizData";

interface LocationState {
  score: number;
  total: number;
  answers: { correct: boolean; selected: number | null; timeTaken: number }[];
  xpGained: number;
  categoryTitle: string;
  questions?: { id: number; question: string; options: string[]; correct: number; explanation: string }[];
}

function getGrade(pct: number) {
  if (pct >= 90) return { grade: "A+", label: "Outstanding!", color: "text-emerald-400", bg: "from-emerald-500 to-teal-500" };
  if (pct >= 80) return { grade: "A", label: "Excellent!", color: "text-green-400", bg: "from-green-500 to-emerald-500" };
  if (pct >= 70) return { grade: "B", label: "Great Job!", color: "text-blue-400", bg: "from-blue-500 to-cyan-500" };
  if (pct >= 60) return { grade: "C", label: "Good Work!", color: "text-amber-400", bg: "from-amber-500 to-yellow-500" };
  if (pct >= 50) return { grade: "D", label: "Keep Trying!", color: "text-orange-400", bg: "from-orange-500 to-amber-500" };
  return { grade: "F", label: "Study More!", color: "text-rose-400", bg: "from-rose-500 to-red-500" };
}

// ... (imports and getGrade function stay the same)

export default function QuizResults() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hasConfetti = useRef(false);
  const hasSaved = useRef(false); // Add this to prevent double-saving in Strict Mode

  const state = location.state as LocationState | null;
  const category = categories.find((c) => c.id === categoryId);

  const score = state?.score ?? 0;
  const total = state?.total ?? 10;
  const answers = state?.answers ?? [];
  const xpGained = state?.xpGained ?? 0;
  const pct = Math.round((score / total) * 100);
  const { grade, label, color, bg } = getGrade(pct);

  // COMBINED EFFECT: Confetti AND Database Save
  useEffect(() => {
    // 1. Confetti Logic
    if (pct >= 70 && !hasConfetti.current) {
      hasConfetti.current = true;
      const count = pct >= 90 ? 300 : 150;
      const fire = (opts: confetti.Options) => {
        confetti({ ...opts, disableForReducedMotion: true });
      };
      setTimeout(() => {
        fire({
          particleCount: count,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#8B5CF6", "#6366F1", "#A78BFA", "#C4B5FD", "#F9A8D4"],
        });
      }, 300);
    }

    // 2. Database Save Logic
    const saveToDb = async () => {
      if (hasSaved.current) return; // Prevent double trigger
      hasSaved.current = true;

      const userId = localStorage.getItem("userId"); 
      try {
        const response = await fetch("http://localhost:8080/api/quizzes/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId ? parseInt(userId) : 1,
            score: score,
            totalQuestions: total,
            xpEarned: xpGained
          }),
        });
        if (response.ok) console.log("✅ Saved to MySQL!");
      } catch (err) {
        console.error("❌ Save failed:", err);
      }
    };

    saveToDb();
  }, [pct, score, total, xpGained]); 

  const questions = state?.questions || category?.questions.slice(0, total) || [];

  return (
    <div className="min-h-screen bg-[#080618] relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b ${bg} opacity-5`} />
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute bottom-0 right-[10%] w-[30vw] h-[30vw] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-slate-400 text-sm mb-1">{category?.title || state?.categoryTitle}</div>
          <h1 className="text-white" style={{ fontSize: "1.8rem", fontWeight: 800 }}>Quiz Complete! 🎉</h1>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
          className={`bg-gradient-to-br ${bg} p-[1px] rounded-3xl mb-6 shadow-2xl`}
        >
          <div className="bg-[#0d0b1e] rounded-3xl p-8 text-center">
            {/* Grade */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${bg} mb-4 shadow-xl`}
            >
              <span className="text-white" style={{ fontSize: "2.5rem", fontWeight: 900 }}>{grade}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className={`text-4xl mb-1 ${color}`} style={{ fontWeight: 900 }}>
                {score}/{total}
              </div>
              <div className="text-slate-400 text-sm mb-4">{pct}% accuracy</div>
              <div className={`text-xl ${color}`} style={{ fontWeight: 700 }}>{label}</div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10"
            >
              <div>
                <div className="text-white" style={{ fontWeight: 700, fontSize: "1.3rem" }}>+{xpGained}</div>
                <div className="text-slate-500 text-xs">XP Earned</div>
              </div>
              <div>
                <div className="text-white" style={{ fontWeight: 700, fontSize: "1.3rem" }}>
                  {answers.filter((a) => a.correct).length}
                </div>
                <div className="text-slate-500 text-xs">Correct</div>
              </div>
              <div>
                <div className="text-white" style={{ fontWeight: 700, fontSize: "1.3rem" }}>
                  {answers.filter((a) => !a.correct).length}
                </div>
                <div className="text-slate-500 text-xs">Incorrect</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Star Rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-2 mb-8"
        >
          {[1, 2, 3].map((star) => {
            const filled = pct >= star * 33;
            return (
              <motion.div
                key={star}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + star * 0.1, type: "spring", stiffness: 300 }}
              >
                <Star
                  className={`w-8 h-8 ${filled ? "text-amber-400 fill-amber-400" : "text-slate-700"}`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <button
            onClick={() => navigate(`/quiz/${categoryId}`)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
            style={{ fontWeight: 600 }}
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
            style={{ fontWeight: 600 }}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
          <button
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all col-span-2"
            style={{ fontWeight: 600 }}
          >
            <Share2 className="w-4 h-4" />
            Share Result
          </button>
        </motion.div>

        {/* Question Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <h3 className="text-white" style={{ fontWeight: 700 }}>Question Breakdown</h3>
          </div>

          <div className="space-y-3">
            {answers.map((answer, i) => {
              const q = questions[i];
              if (!q) return null;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.04 }}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    answer.correct
                      ? "bg-emerald-500/8 border-emerald-500/20"
                      : "bg-rose-500/8 border-rose-500/20"
                  }`}
                >
                  <div className={`flex-shrink-0 mt-0.5 ${answer.correct ? "text-emerald-400" : "text-rose-400"}`}>
                    {answer.correct ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-300 text-xs mb-1" style={{ fontWeight: 500 }}>
                      Q{i + 1}: {q.question}
                    </div>
                    {!answer.correct && (
                      <div className="text-emerald-400 text-xs">
                        ✓ {q.options[q.correct]}
                      </div>
                    )}
                    {!answer.correct && answer.selected !== null && (
                      <div className="text-rose-400 text-xs">
                        ✗ Your answer: {q.options[answer.selected]}
                      </div>
                    )}
                    {!answer.correct && answer.selected === null && (
                      <div className="text-amber-400 text-xs">⏰ Timed out</div>
                    )}
                  </div>
                  <div className="text-slate-600 text-xs flex-shrink-0">{answer.timeTaken}s</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Explore More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-slate-500 text-sm mb-3">Explore other subjects</p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories
              .filter((c) => c.id !== categoryId)
              .slice(0, 4)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/quiz/${cat.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs hover:bg-white/10 transition-all"
                >
                  <span>{cat.emoji}</span>
                  {cat.title}
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
          </div>
        </motion.div>

        <div className="h-8" />
      </div>
    </div>
  );
}