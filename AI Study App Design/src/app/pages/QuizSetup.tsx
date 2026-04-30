import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft, Play, BookOpen, Clock, Target, Zap, Brain, ChevronRight, Star
} from "lucide-react";
import { categories, difficultyColors } from "../data/quizData";
import { useApp } from "../context/AppContext";

const questionCounts = [5, 7, 10];
const timeLimits = [
  { label: "15 sec", value: 15 },
  { label: "30 sec", value: 30 },
  { label: "60 sec", value: 60 },
  { label: "No limit", value: 0 },
];
const modes = [
  { id: "multiple-choice", label: "Multiple Choice", icon: "🎯", desc: "4 answer options per question" },
  { id: "true-false", label: "True / False", icon: "✅", desc: "Quick yes or no answers" },
  { id: "mixed", label: "Mixed Mode", icon: "🔀", desc: "Variety of question types" },
];

export default function QuizSetup() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { setActiveQuiz } = useApp();

  const category = categories.find((c) => c.id === categoryId);

  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);
  const [mode, setMode] = useState<"multiple-choice" | "true-false" | "mixed">("multiple-choice");

  if (!category) {
    return (
      <div className="min-h-screen bg-[#080618] flex items-center justify-center text-white">
        Category not found.{" "}
        <button onClick={() => navigate("/dashboard")} className="underline ml-2">Go back</button>
      </div>
    );
  }

  const handleStart = () => {
    setActiveQuiz({ categoryId: category.id, questionCount, difficulty: category.difficulty, mode });
    navigate(`/quiz/${category.id}/play`);
  };

  return (
    <div className="min-h-screen bg-[#080618] relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[50vw] h-[50vw] rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Dashboard</span>
        </motion.button>

        {/* Category Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${category.gradient} p-[1px] rounded-2xl mb-6 shadow-2xl ${category.bgGlow}`}
        >
          <div className="bg-[#0d0b1e] rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-3xl shadow-xl`}>
                {category.emoji}
              </div>
              <div>
                <div className={`text-xs px-2 py-1 rounded-full border inline-block mb-2 ${difficultyColors[category.difficulty]}`} style={{ fontWeight: 600 }}>
                  {category.difficulty}
                </div>
                <h1 className="text-white" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{category.title}</h1>
                <p className="text-slate-400 text-sm">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10">
              <div className="text-center">
                <div className="text-white" style={{ fontWeight: 700, fontSize: "1.2rem" }}>{category.questions.length}</div>
                <div className="text-slate-500 text-xs">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-white" style={{ fontWeight: 700, fontSize: "1.2rem" }}>{category.difficulty}</div>
                <div className="text-slate-500 text-xs">Difficulty</div>
              </div>
              <div className="text-center">
                <div className="text-white" style={{ fontWeight: 700, fontSize: "1.2rem" }}>+{questionCount * 10}</div>
                <div className="text-slate-500 text-xs">XP to Earn</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <div className="space-y-5">
          {/* Question Count */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <h2 className="text-white" style={{ fontWeight: 700 }}>Number of Questions</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-3 rounded-xl text-sm transition-all ${
                    questionCount === count
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                      : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </motion.div>

          {/* Time Limit */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-violet-400" />
              <h2 className="text-white" style={{ fontWeight: 700 }}>Time per Question</h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {timeLimits.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTimeLimit(t.value)}
                  className={`py-3 rounded-xl text-sm transition-all ${
                    timeLimit === t.value
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                      : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quiz Mode */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-violet-400" />
              <h2 className="text-white" style={{ fontWeight: 700 }}>Quiz Mode</h2>
            </div>
            <div className="space-y-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as typeof mode)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    mode === m.id
                      ? "bg-violet-600/20 border border-violet-500/40"
                      : "bg-white/5 border border-white/10 hover:bg-white/8"
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <div className={`text-sm ${mode === m.id ? "text-violet-200" : "text-white"}`} style={{ fontWeight: 600 }}>
                      {m.label}
                    </div>
                    <div className="text-slate-500 text-xs">{m.desc}</div>
                  </div>
                  {mode === m.id && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20 rounded-2xl p-5"
          >
            <h3 className="text-white text-sm mb-3" style={{ fontWeight: 700 }}>Quiz Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "📝", label: "Questions", value: questionCount },
                { icon: "⏱️", label: "Time/Q", value: timeLimit ? `${timeLimit}s` : "Unlimited" },
                { icon: "🎮", label: "Mode", value: modes.find((m2) => m2.id === mode)?.label },
                { icon: "⚡", label: "XP Reward", value: `+${questionCount * 10} XP` },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <div>
                    <div className="text-slate-500 text-xs">{item.label}</div>
                    <div className="text-white text-sm" style={{ fontWeight: 600 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Start Button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl py-4 flex items-center justify-center gap-3 shadow-2xl shadow-violet-500/30 mt-2"
            style={{ fontWeight: 700, fontSize: "1rem" }}
          >
            <Play className="w-5 h-5" />
            Start Quiz
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
