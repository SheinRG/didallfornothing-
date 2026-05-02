import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { BarChart, Activity, BrainCircuit, Mic } from 'lucide-react';
import { Cover } from '../components/ui/cover';
import { BackgroundLines } from '../components/ui/background-lines';
import { CometCard } from '../components/ui/comet-card';

import image3 from '../assets/image_3.jpg';

export default function LandingPage() {
  const controls = useAnimation();
  const isDraggingRef = useRef(false);

  useEffect(() => {
    // Initial entrance — settle from random offsets
    controls.start({
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 1.3,
        ease: "easeOut",
        delay: 0.4 
      }
    });
  }, [controls]);

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
            <BackgroundLines className="opacity-60" />
            <div
              className="absolute inset-x-0 top-0 h-[600px]"
              style={{
                background:
                  'radial-gradient(ellipse 60% 50% at 75% 30%, rgba(232,86,59,0.08) 0%, transparent 70%)',
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
                with <Cover className="text-[#E8563B]">ORION</Cover>
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
                    className="px-8 py-[18px] bg-[#E8563B] text-white font-bold tracking-widest text-[15px] rounded-full transition-all shadow-xl shadow-[#E8563B]/20"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="hidden lg:block relative z-10 w-[540px] aspect-square ml-auto bg-white/[0.03] border border-white/10 theme-light:bg-zinc-100/60 theme-light:border-zinc-200/60 backdrop-blur-3xl rounded-[2rem] p-4 shadow-2xl"
            >
              <div className="grid grid-cols-12 grid-rows-4 gap-3 h-full">

                <motion.div
                  initial={{ x: 600, y: -400, rotate: 45, opacity: 0 }}
                  animate={controls}
                  drag
                  whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.02 }}
                  className="col-span-8 bg-surface-container-high border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-center theme-light:bg-white theme-light:border-black/5"
                >
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


                <motion.div
                  initial={{ x: -600, y: -300, rotate: -45, opacity: 0 }}
                  animate={controls}
                  drag
                  whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.02 }}
                  className="col-span-4 bg-surface-container-high border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center theme-light:bg-white theme-light:border-black/5"
                >
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
                <motion.div
                  initial={{ x: 700, y: 300, rotate: 30, opacity: 0 }}
                  animate={controls}
                  drag
                  whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.02 }}
                  className="col-span-6 bg-surface-container-high border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-center theme-light:bg-white theme-light:border-black/5"
                >
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

                <motion.div
                  initial={{ x: -700, y: 400, rotate: -30, opacity: 0 }}
                  animate={controls}
                  drag
                  whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.02 }}
                  className="col-span-6 bg-surface-container-high border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-center theme-light:bg-white theme-light:border-black/5"
                >
                  <div className="text-[10px] font-bold text-emerald-400 theme-light:text-emerald-700 uppercase tracking-[0.2em] mb-1">Target Path</div>
                  <div className="text-[15px] font-bold text-white theme-light:text-zinc-900">Senior Software Engineer</div>
                </motion.div>



                {/* ROW 3 */}
                <motion.div
                  initial={{ x: 500, y: 600, rotate: -15, opacity: 0 }}
                  animate={controls}
                  drag
                  whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.02 }}
                  className="col-span-7 bg-surface-container-high border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-lg theme-light:bg-white theme-light:border-black/5"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#333]">
                    <img src={image3} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[9px] tracking-[0.2em] text-emerald-400 theme-light:text-emerald-700 font-bold mb-0.5 uppercase">Coach</div>
                    <div className="text-[14px] font-bold text-white theme-light:text-zinc-900">RAGHAV</div>
                  </div>
                  <div className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] mr-2" />
                </motion.div>

                <motion.div
                  initial={{ x: -800, y: 500, rotate: 25, opacity: 0 }}
                  animate={controls}
                  drag
                  onDragStart={() => { isDraggingRef.current = true; }}
                  onDragEnd={() => { setTimeout(() => { isDraggingRef.current = false; }, 100); }}
                  whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onTap={() => {
                    if (!isDraggingRef.current) toggleTheme();
                  }}
                  className="col-span-5 bg-surface-container-high border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-4 shadow-lg cursor-pointer transition-colors hover:border-[#E8563B] theme-light:bg-white theme-light:border-black/5"
                >
                  <div className="w-11 h-11 rounded-full bg-[#E8563B] flex items-center justify-center text-white flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">light_mode</span>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-[#888] uppercase tracking-widest mb-0.5">Interface</div>
                    <div className="text-[12px] font-bold text-white theme-light:text-zinc-900 leading-tight">Adaptive UI</div>
                  </div>
                </motion.div>


                {/* ROW 4 */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => controls.start({ x: 0, y: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } })}
                  className="col-span-4 bg-surface-container-high border border-white/10 rounded-2xl p-5 shadow-[0_0_20px_rgba(232,86,59,0.2)] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors hover:border-[#E8563B] theme-light:bg-white theme-light:border-black/5 z-50 relative"
                >
                  <BrainCircuit className="text-[#E8563B]" size={22} />
                  <div className="text-center">
                    <div className="text-[10px] tracking-[0.2em] font-bold text-[#E8563B] uppercase mb-0.5">Push</div>
                    <div className="text-[12px] font-bold text-white theme-light:text-zinc-900">Assemble</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: 300, y: 700, rotate: 10, opacity: 0 }}
                  animate={controls}
                  drag
                  whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.02 }}
                  className="col-span-5 bg-surface-container-high border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-lg theme-light:bg-white theme-light:border-black/5"
                >
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] mb-1" />
                  <span className="text-[11px] font-bold tracking-[0.15em] text-white theme-light:text-zinc-900 uppercase">Input Active</span>
                </motion.div>


                <motion.div
                  initial={{ x: -400, y: 800, rotate: -20, opacity: 0 }}
                  animate={controls}
                  drag
                  whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.02 }}
                  className="col-span-3 bg-surface-container-high border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg theme-light:bg-white theme-light:border-black/5"
                >
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

        <section className="max-w-[1400px] mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-white theme-light:text-zinc-900">
              PLATFORM FEATURES
            </h2>
            <p className="text-lg text-[#888] theme-light:text-zinc-500 max-w-2xl mx-auto">
              Everything you need to transform your interview performance from average to executive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Real-time Simulation',
                desc: 'Practice with realistic AI avatars tailored to your role.',
                id: '#001',
                img: '/dual_interview_sim_1775855202541.png'
              },
              {
                title: 'Granular Feedback',
                desc: 'Get instant structural analysis for every response.',
                id: '#002',
                img: '/dual_feedback_1775855216447.png'
              },
              {
                title: 'Performance History',
                desc: 'Review your growth with historical session archives.',
                id: '#003',
                img: '/dual_history_1775855229702.png'
              },
              {
                title: 'Behavioral Prep',
                desc: 'Master the STAR method with AI-guided frameworks.',
                id: '#004',
                img: '/dual_behavioral_1775855247551.png'
              }
            ].map((f, i) => (
              <CometCard key={i}>
                <div className="flex w-full flex-col items-stretch rounded-[24px] border border-white/10 theme-light:border-zinc-300 bg-[#0a0a0a] theme-light:bg-zinc-100 p-3 shadow-lg transition-all hover:border-[#E8563B]/50">
                  <div className="px-1 flex-1">
                    <div className="relative mt-1 aspect-[4/5] w-full group overflow-hidden rounded-[18px]">
                      <img
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={f.title}
                        src={f.img}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 theme-light:from-zinc-100/40 via-transparent to-transparent opacity-30" />
                    </div>
                  </div>
                  <div className="mt-4 p-3 pr-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-black text-white theme-light:text-zinc-800 uppercase tracking-wider">{f.title}</h3>
                      <span className="text-[10px] font-mono text-[#E8563B] font-bold">{f.id}</span>
                    </div>
                    <p className="text-[11px] text-[#888] theme-light:text-zinc-600 leading-relaxed font-medium">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </CometCard>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            CAPABILITIES — rounded, hover-interactive cards
        ═══════════════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/5">
          {/* Interview Simulation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="lg:col-span-2 border border-[#222] theme-light:border-zinc-300 bg-[#111]/80 theme-light:bg-zinc-100 backdrop-blur-sm p-10 rounded-3xl relative overflow-hidden group cursor-default shadow-lg"
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
            className="border border-[#222] theme-light:border-zinc-300 bg-[#111]/80 theme-light:bg-zinc-100 backdrop-blur-sm p-10 rounded-3xl relative cursor-default shadow-lg"
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
