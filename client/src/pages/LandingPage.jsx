import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { BarChart, Activity, BrainCircuit, Mic } from 'lucide-react';

import image3 from '../assets/image_3.jpg';

export default function LandingPage() {
  const toggleTheme = () => {
    const isLight = document.documentElement.classList.contains('theme-light');
    if (!isLight) {
      document.documentElement.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('theme-light');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans overflow-x-hidden selection:bg-[#ff5543]/30">
      <Navbar />

      <main className="relative z-10 pt-14 pb-24">

        {/* ═══════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════ */}
        <section className="relative max-w-[1400px] mx-auto px-6 pt-16 lg:pt-24 pb-32">
          {/* Background decoration moved here */}
          <div className="absolute inset-0 z-0 transition-opacity duration-1000">
            <div
              className="absolute inset-x-0 top-0 h-[600px]"
              style={{
                background:
                  'radial-gradient(ellipse 60% 50% at 25% 30%, rgba(232,86,59,0.06) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Hero content grid */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-2.5 mb-8 border border-[#2a2a2a] bg-[#111]/80 backdrop-blur-sm w-max px-4 py-2 rounded-full"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] tracking-[0.2em] text-[#aaa] font-semibold uppercase">
                  READY TO START
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-7xl sm:text-8xl lg:text-[104px] font-[800] tracking-tight leading-[0.85] mb-8 text-white theme-light:text-zinc-900"
              >
                Ace your next<br />
                interview<br />
                with <span className="text-[#E8563B]">ORION</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-[17px] text-[#999] max-w-md mb-10 leading-relaxed"
              >
                Practise with realistic questions, get real-time voice
                analysis, and recieve detailed AI feedback — all in your
                browser.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="flex flex-wrap gap-5"
              >
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-8 py-5 bg-[#E8563B] text-white font-bold tracking-widest text-[15px] rounded-full transition-all shadow-xl shadow-[#E8563B]/20"
                  >
                    GET STARTED
                  </motion.button>
                </Link>
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-10 py-5 bg-[#1C1C1C] theme-light:bg-zinc-100 text-white theme-light:text-zinc-900 font-bold tracking-[0.12em] text-[15px] rounded-full border border-[#333] theme-light:border-zinc-200 transition-all shadow-xl"
                  >
                    TRY DEMO
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — Bento Preview Container */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block relative z-10 w-[540px] aspect-square ml-auto bg-white/[0.03] border border-white/10 theme-light:bg-zinc-100/60 theme-light:border-zinc-200/60 backdrop-blur-3xl rounded-[2rem] p-4 shadow-2xl overflow-hidden"
            >
              <div className="grid grid-cols-12 grid-rows-4 gap-3 h-full">

                {/* ROW 1 */}
                <motion.div whileHover={{ scale: 1.02 }} className="col-span-8 bg-surface-container-high border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-center theme-light:bg-white theme-light:border-black/5">
                  <div className="flex gap-1.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  </div>
                  <pre className="text-[13px] font-mono leading-relaxed text-[#ccc] theme-light:text-zinc-700 overflow-hidden">
                    <span className="text-blue-400 theme-light:text-blue-700">fn</span> <span className="text-emerald-400 theme-light:text-emerald-700">parse</span>() {'{'}{'\n'}
                    {'  '}<span className="text-blue-400 theme-light:text-blue-700">let</span> r = <span className="text-yellow-300 theme-light:text-yellow-700">Intent</span>::new();{'\n'}
                    {'  '}r.optimize(){'\n'}
                    {'}'}
                  </pre>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="col-span-4 bg-surface-container-high border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center theme-light:bg-white theme-light:border-black/5">
                  <div className="relative w-14 h-14 flex items-center justify-center mb-2">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" className="text-white/5 theme-light:text-zinc-100" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#4edea3" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="60" strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[12px] font-bold text-white theme-light:text-zinc-900">75%</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#888] theme-light:text-zinc-500 uppercase tracking-widest text-center mt-1">Stability</span>
                </motion.div>

                {/* ROW 2 */}
                <motion.div whileHover={{ scale: 1.02 }} className="col-span-6 bg-surface-container-high border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-center theme-light:bg-white theme-light:border-black/5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-5 bg-[#E8563B] rounded-full" />
                    <span className="text-[11px] tracking-[0.2em] font-bold text-[#888] theme-light:text-zinc-500 uppercase">Analysis</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-white theme-light:text-zinc-900">Clarity</span>
                        <span className="text-[11px] font-mono font-bold text-emerald-400 theme-light:text-emerald-700">88%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden theme-light:bg-zinc-100"><div className="h-full bg-emerald-400 w-[88%]" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-white theme-light:text-zinc-900">Confidence</span>
                        <span className="text-[11px] font-mono font-bold text-[#E8563B] theme-light:text-[#C23C23]">92%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden theme-light:bg-zinc-100"><div className="h-full bg-[#E8563B] w-[92%]" /></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="col-span-6 bg-surface-container-high border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-center theme-light:bg-white theme-light:border-black/5">
                  <div className="text-[10px] font-bold text-emerald-400 theme-light:text-emerald-700 uppercase tracking-[0.2em] mb-1">Target Path</div>
                  <div className="text-[15px] font-bold text-white theme-light:text-zinc-900">Senior Software Engineer</div>
                </motion.div>

                {/* ROW 3 */}
                <motion.div whileHover={{ scale: 1.02 }} className="col-span-7 bg-surface-container-high border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-lg theme-light:bg-white theme-light:border-black/5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#333]">
                    <img src={image3} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[9px] tracking-[0.2em] text-emerald-400 theme-light:text-emerald-700 font-bold mb-0.5 uppercase">Coach</div>
                    <div className="text-[14px] font-bold text-white theme-light:text-zinc-900">RAGHAV</div>
                  </div>
                  <div className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] mr-2" />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={toggleTheme} className="col-span-5 bg-surface-container-high border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-4 shadow-lg cursor-pointer transition-colors hover:border-[#E8563B] theme-light:bg-white theme-light:border-black/5">
                  <div className="w-11 h-11 rounded-full bg-[#E8563B] flex items-center justify-center text-white flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">light_mode</span>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest mb-0.5">Interface</div>
                    <div className="text-[12px] font-bold text-white theme-light:text-zinc-900 leading-tight">Adaptive UI</div>
                  </div>
                </motion.div>

                {/* ROW 4 */}
                <motion.div whileHover={{ scale: 1.02 }} className="col-span-4 bg-surface-container-high border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center gap-2 theme-light:bg-white theme-light:border-black/5">
                  <BrainCircuit className="text-[#E8563B]" size={22} />
                  <div className="text-center">
                    <div className="text-[9px] tracking-[0.2em] font-bold text-[#888] theme-light:text-zinc-500 uppercase mb-0.5">Intent</div>
                    <div className="text-[12px] font-bold text-white theme-light:text-zinc-900">Relevant</div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="col-span-5 bg-surface-container-high border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-lg theme-light:bg-white theme-light:border-black/5">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)] mb-1" />
                  <span className="text-[11px] font-bold tracking-[0.15em] text-white theme-light:text-zinc-900 uppercase">Input Active</span>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="col-span-3 bg-surface-container-high border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg theme-light:bg-white theme-light:border-black/5">
                  <div className="text-[8px] font-bold text-[#888] theme-light:text-zinc-500 tracking-[0.25em] uppercase mb-2">Voice</div>
                  <div className="flex gap-[3px] items-center h-4">
                    {[1, 0.6, 1.4, 0.8, 1.2, 0.5, 0.9].map((s, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [6, 14, 6] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                        className="w-[3px] bg-[#E8563B] rounded-full"
                        style={{ height: `${s * 10}px` }}
                      />
                    ))}
                  </div>
                </motion.div>

              </div>
            </motion.div>

            {/* Dot grid decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-24 left-8 grid grid-cols-6 gap-3"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60" />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            CAPABILITIES — rounded, hover-interactive cards
        ═══════════════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Interview Simulation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="lg:col-span-2 border border-[#222] theme-light:border-zinc-200 bg-[#111]/80 theme-light:bg-white backdrop-blur-sm p-10 rounded-3xl relative overflow-hidden group cursor-default shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 text-white theme-light:text-black">
              <BrainCircuit size={180} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <Mic className="text-[#ff5543]" size={22} />
              <h2 className="text-xl font-bold tracking-tight text-white theme-light:text-zinc-900">INTERVIEW PRACTICE</h2>
            </div>
            <p className="text-[#888] theme-light:text-zinc-500 text-base max-w-md mb-12 leading-relaxed">
              Practise with realistic questions tailored to your target role.
              Get immediate feedback on your answers and track your progress
              over time.
            </p>
            <div className="flex gap-16">
              <div>
                <div className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 mb-2">LATENCY</div>
                <div className="text-4xl font-black text-white theme-light:text-zinc-900">42ms</div>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-[0.2em] text-[#ff5543] mb-2">ACCURACY</div>
                <div className="text-4xl font-black text-white theme-light:text-zinc-900">99.8%</div>
              </div>
            </div>
          </motion.div>

          {/* AI-Driven Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            className="border border-[#222] theme-light:border-zinc-200 bg-[#111]/80 theme-light:bg-white backdrop-blur-sm p-10 rounded-3xl relative cursor-default shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart className="text-[#ff5543]" size={22} />
              <h2 className="text-lg font-bold tracking-tight text-white theme-light:text-zinc-900">AI-DRIVEN FEEDBACK</h2>
            </div>
            <p className="text-[#888] theme-light:text-zinc-500 mb-8 leading-relaxed text-sm">
              We analyze your responses for clarity, relevance, and structure.
              Get actionable feedback to help you refine your communication style.
            </p>
            <div className="flex items-end gap-2 h-24 mt-auto">
              {[40, 70, 45, 90, 60, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex-1 bg-[#ff5543]/70 rounded-md"
                />
              ))}
            </div>
          </motion.div>
        </section>

        <section className="max-w-[1400px] mx-auto px-6 py-32 border-t border-white/5">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-white theme-light:text-zinc-900">
              PLATFORM FEATURES
            </h2>
            <p className="text-lg text-[#888] theme-light:text-zinc-500 max-w-2xl mx-auto">
              Everything you need to transform your interview performance from average to executive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Tailored Scenarios', desc: 'AI generates questions based on your specific target job description.', icon: 'target' },
              { title: 'Deep AI Analysis', desc: 'Get granular scores on clarity, relevance, and structural integrity.', icon: 'analytics' },
              { title: 'Historical Archives', desc: 'Securely store and review every past session to track growth.', icon: 'folder_open' },
              { title: 'Real-time Hints', desc: 'Get subtle AI nudges when you need help structuring an answer.', icon: 'lightbulb' }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-container-high border border-white/10 theme-light:bg-white theme-light:border-black/5 rounded-3xl p-8 shadow-xl hover:translate-y-[-4px] transition-all cursor-default"
              >
                <span className="material-symbols-outlined text-[#ff5543] mb-6 text-3xl">
                  {f.icon}
                </span>
                <h3 className="text-lg font-bold text-white theme-light:text-zinc-900 mb-3">{f.title}</h3>
                <p className="text-sm text-[#888] theme-light:text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FINAL SIGN UP CTA */}
        <section className="max-w-4xl mx-auto px-6 py-32 text-center">
          <h2 className="text-5xl font-black tracking-tighter mb-8 text-white theme-light:text-zinc-900 uppercase">
            Start Your Journey
          </h2>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-16 py-6 bg-[#ff5543] text-white font-black tracking-[0.2em] text-lg rounded-full shadow-[0_20px_40px_rgba(255,85,67,0.3)] hover:shadow-[0_25px_50px_rgba(255,85,67,0.4)] transition-all"
            >
              GET STARTED NOW
            </motion.button>
          </Link>
        </section>
      </main>
    </div>
  );
}
