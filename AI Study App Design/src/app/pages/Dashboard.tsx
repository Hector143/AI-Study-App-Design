import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  BookOpen, Flame, Trophy, Target, ChevronRight, Search,
  Zap, LogOut, Bell, BarChart3, Clock, Star, Play, TrendingUp
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { categories, difficultyColors } from "../data/quizData";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, quizHistory } = useApp();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Easy", "Medium", "Hard"];

  const filtered = categories.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || c.difficulty === activeFilter;
    return matchSearch && matchFilter;
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const statCards = [
    { icon: Flame, label: "Day Streak", value: user?.streak || 0, suffix: "🔥", color: "from-orange-500 to-rose-500", glow: "shadow-orange-500/20" },
    { icon: Trophy, label: "Total XP", value: user?.xp || 0, suffix: "⚡", color: "from-amber-500 to-yellow-500", glow: "shadow-amber-500/20" },
    { icon: Target, label: "Accuracy", value: `${user?.accuracy || 0}%`, suffix: "🎯", color: "from-green-500 to-emerald-500", glow: "shadow-green-500/20" },
    { icon: BarChart3, label: "Quizzes", value: user?.totalQuizzes || 0, suffix: "📊", color: "from-violet-500 to-purple-500", glow: "shadow-violet-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#080618]">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[30vw] h-[30vw] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080618]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-white" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Quizora<span className="text-violet-400">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm" style={{ fontWeight: 700 }}>
                {user?.avatar}
              </div>
              <div className="hidden sm:block">
                <div className="text-white text-sm" style={{ fontWeight: 600 }}>{user?.name}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-violet-400 text-sm mb-2">
            <Zap className="w-4 h-4" />
            <span>Ready to learn?</span>
          </div>
          <h1 className="text-white" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Welcome back, <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">You're on a {user?.streak}-day streak — keep it up!</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white/[0.03] border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all group shadow-lg ${stat.glow}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg">{stat.suffix}</span>
              </div>
              <div className="text-white" style={{ fontSize: "1.6rem", fontWeight: 800 }}>{stat.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Categories Section */}
          <div className="lg:col-span-2">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
              <div className="flex gap-2">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      activeFilter === f
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                        : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/quiz/${cat.id}`)}
                  className="group bg-white/[0.03] border border-white/8 rounded-2xl p-5 cursor-pointer hover:border-white/20 hover:bg-white/[0.06] transition-all relative overflow-hidden"
                >
                  {/* Glow */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${cat.gradient}`} style={{ opacity: 0.04 }} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                        {cat.emoji}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[cat.difficulty]}`} style={{ fontWeight: 600 }}>
                        {cat.difficulty}
                      </div>
                    </div>

                    <h3 className="text-white mb-1" style={{ fontWeight: 700, fontSize: "1rem" }}>{cat.title}</h3>
                    <p className="text-slate-500 text-xs mb-4">{cat.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <BookOpen className="w-3 h-3" />
                          <span>{cat.questions.length} questions</span>
                        </div>
                        <div className="flex gap-1">
                          {cat.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all`}>
                        <Play className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No subjects found for "{search}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard / Quick Play */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <h3 className="text-white" style={{ fontWeight: 700 }}>Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {quizHistory.slice(0, 4).map((result, i) => {
                  const pct = Math.round((result.score / result.total) * 100);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                        {categories.find((c) => c.id === result.categoryId)?.emoji || "📝"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs" style={{ fontWeight: 600 }}>{result.categoryTitle}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-slate-400 text-xs">{pct}%</span>
                        </div>
                      </div>
                      <div className={`text-xs ${pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-rose-400"}`} style={{ fontWeight: 700 }}>
                        {result.score}/{result.total}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Daily Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 rounded-2xl p-5 relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 text-2xl">🏆</div>
              <div className="relative z-10">
                <div className="text-violet-400 text-xs mb-1" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Daily Challenge
                </div>
                <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>Speed Round!</h3>
                <p className="text-slate-400 text-xs mb-4">
                  Answer 5 mixed questions in 60 seconds. Beat your best score!
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 text-xs" style={{ fontWeight: 600 }}>+50 XP Bonus</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/quiz/science")}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
                  style={{ fontWeight: 600 }}
                >
                  <Zap className="w-4 h-4" />
                  Start Challenge
                </motion.button>
              </div>
            </motion.div>

            {/* Upcoming / Tips */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-slate-400" />
                <h3 className="text-white text-sm" style={{ fontWeight: 700 }}>Study Tips 💡</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Review mistakes before starting a new quiz",
                  "Short daily sessions beat marathon cramming",
                  "Teach concepts out loud to reinforce memory",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-violet-400 text-xs">{i + 1}</span>
                    </div>
                    <p className="text-slate-400 text-xs">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Subjects */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <h3 className="text-white text-sm" style={{ fontWeight: 700 }}>Top Subjects</h3>
                </div>
                <button className="text-violet-400 text-xs hover:text-violet-300">View all</button>
              </div>
              <div className="space-y-2">
                {categories.slice(0, 3).map((cat, i) => (
                  <div
                    key={cat.id}
                    onClick={() => navigate(`/quiz/${cat.id}`)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
                  >
                    <div className="text-lg">{cat.emoji}</div>
                    <div className="flex-1">
                      <div className="text-white text-xs" style={{ fontWeight: 600 }}>{cat.title}</div>
                      <div className="text-slate-500 text-xs">{cat.questions.length} questions</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
