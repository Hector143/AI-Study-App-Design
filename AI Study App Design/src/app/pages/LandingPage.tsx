import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, Brain, Zap, Trophy, Eye, EyeOff, ArrowRight, Star } from "lucide-react";
import { useApp } from "../context/AppContext";

const floatingCards = [
  { emoji: "🔬", label: "Science", color: "from-cyan-500/20 to-blue-500/20", delay: 0 },
  { emoji: "📐", label: "Math", color: "from-rose-500/20 to-pink-500/20", delay: 0.3 },
  { emoji: "🌍", label: "History", color: "from-amber-500/20 to-orange-500/20", delay: 0.6 },
  { emoji: "💻", label: "Coding", color: "from-green-500/20 to-emerald-500/20", delay: 0.9 },
  { emoji: "📚", label: "English", color: "from-violet-500/20 to-purple-500/20", delay: 1.2 },
  { emoji: "🗺️", label: "Geo", color: "from-teal-500/20 to-cyan-500/20", delay: 1.5 },
];

const features = [
  { icon: Brain, label: "AI-Powered Quizzes", desc: "Smart questions tailored to your level" },
  { icon: Zap, label: "Instant Feedback", desc: "Learn from every answer in real time" },
  { icon: Trophy, label: "Track Progress", desc: "See your growth with detailed stats" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  const path = isLogin ? "/api/users/login" : "/api/users/signup";
  
  try {
    const response = await fetch(`http://localhost:8080${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: name,
        email: email,
        password_hash: password
      }),
    });

    if (response.ok) {
      login(name || email.split("@")[0], email);
      navigate("/dashboard");
    } else {
      setError("Invalid credentials or server error.");
    }
  } catch (err) {
    setError("Backend is not running.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#080618] overflow-hidden relative flex">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-violet-500/5 blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Left Panel - Hero */}
      <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xl" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Quizora<span className="text-violet-400">AI</span>
          </span>
        </div>

        {/* Hero Content */}
        <div className="max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Study Platform</span>
            </div>
            <h1 className="text-white mb-6" style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              Learn Smarter,{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                Not Harder
              </span>
            </h1>
            <p className="text-slate-400 text-lg mb-10" style={{ lineHeight: 1.6 }}>
              Master any subject with AI-generated quizzes, instant feedback, and adaptive learning that grows with you.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm" style={{ fontWeight: 600 }}>{f.label}</div>
                    <div className="text-slate-500 text-xs">{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating subject cards */}
        <div className="relative h-32">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              className={`absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${card.color} border border-white/10 backdrop-blur-sm`}
              style={{ left: `${(i % 3) * 33}%`, top: i < 3 ? 0 : "50%" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: card.delay, duration: 0.5 },
                y: { delay: card.delay, duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <span className="text-lg">{card.emoji}</span>
              <span className="text-white text-xs" style={{ fontWeight: 500 }}>{card.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-8"
        >
          {[
            { value: "50K+", label: "Active Learners" },
            { value: "200+", label: "Quiz Topics" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
          <div className="flex items-center gap-1 ml-auto">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-slate-400 text-sm ml-2">4.9/5 rating</span>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-shrink-0 w-full lg:w-[460px] flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl" style={{ fontWeight: 700 }}>
              Quizora<span className="text-violet-400">AI</span>
            </span>
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
            {/* Tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-8">
              {["Login", "Sign Up"].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => { setIsLogin(i === 0); setError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
                    (i === 0) === isLogin
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-white mb-1" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                  {isLogin ? "Welcome back 👋" : "Create account ✨"}
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  {isLogin
                    ? "Sign in to continue your learning journey"
                    : "Join thousands of learners today"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="text-slate-300 text-xs mb-1.5 block" style={{ fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-slate-300 text-xs mb-1.5 block" style={{ fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1.5 block" style={{ fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 text-sm outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isLogin && (
                    <div className="text-right">
                      <button type="button" className="text-violet-400 text-xs hover:text-violet-300 transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition-all mt-2 disabled:opacity-70"
                    style={{ fontWeight: 600 }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Create Account"}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-slate-500 text-xs">or continue with</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {["Google", "GitHub"].map((provider) => (
                    <motion.button
                      key={provider}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        login(provider + " User", provider.toLowerCase() + "@example.com");
                        navigate("/dashboard");
                      }}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all"
                      style={{ fontWeight: 500 }}
                    >
                      {provider === "Google" ? "🌐" : "🐙"}
                      {provider}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            By continuing, you agree to our{" "}
            <span className="text-violet-400 cursor-pointer hover:underline">Terms</span> &{" "}
            <span className="text-violet-400 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
