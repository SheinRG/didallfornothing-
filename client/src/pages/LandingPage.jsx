import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { BarChart, Activity, BrainCircuit, Mic } from 'lucide-react';

import image1 from '../assets/image_1.jpg';
import image2 from '../assets/image_2.png';
import image3 from '../assets/image_3.jpg';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-orion-dark text-white font-sans overflow-x-hidden selection:bg-orion-red/30">
      <Navbar />

      <main className="relative z-10 pt-28 pb-24">

        {/* ═══════════════════════════════════════════════════
            HERO — contained card with image_1 behind text
        ═══════════════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-6 mt-6">
          <div className="relative rounded-3xl overflow-hidden min-h-[85vh] flex items-center">
            
            {/* Background image — sits behind hero text like a card */}
            <div className="absolute inset-0 z-0">
              <img
                src={image1}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orion-dark via-orion-dark/95 to-orion-dark/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-orion-dark via-transparent to-orion-dark/40" />
            </div>

            {/* Hero content grid */}
            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12 lg:p-16">

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
                  className="flex items-center gap-2.5 mb-12 border border-[#2a2a2a] bg-[#111]/80 backdrop-blur-sm w-max px-4 py-2 rounded-full"
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
                  className="text-7xl sm:text-8xl lg:text-[96px] font-[800] tracking-tight leading-[0.9] mb-10"
                  style={{ textShadow: '0 8px 40px rgba(0,0,0,0.9), 0 4px 10px rgba(0,0,0,0.8)' }}
                >
                  Ace your next<br />
                  interview<br />
                  with <span className="text-[#E8563B]">ORION</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-[17px] text-[#999] max-w-md mb-12 leading-relaxed"
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
                      className="px-8 py-5 bg-gradient-to-b from-[#E8563B] to-[#C23C23] text-white font-bold tracking-widest text-[15px] rounded-full transition-all"
                    >
                      GET STARTED
                    </motion.button>
                  </Link>
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-10 py-5 bg-[#1C1C1C] text-white font-bold tracking-[0.12em] text-[15px] rounded-full border border-[#333] transition-all"
                    >
                      TRY DEMO
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right — Floating cards */}
              <div className="hidden lg:flex items-center justify-center relative">

                {/* Ambient image_2 behind cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img
                    src={image2}
                    alt=""
                    className="w-[90%] h-[90%] object-contain opacity-30"
                  />
                </motion.div>

                {/* Code snippet card */}
                <motion.div
                  initial={{ opacity: 0, y: 30, rotate: 2 }}
                  animate={{ opacity: 1, y: 0, rotate: 2 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  whileHover={{ y: -8, rotate: 0, scale: 1.03 }}
                  className="absolute top-8 right-4 z-20 w-[320px] bg-[#141414]/90 backdrop-blur-md border border-[#2a2a2a] rounded-2xl p-5 shadow-2xl cursor-default"
                >
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                  </div>
                  <pre className="text-[13px] font-mono leading-relaxed text-[#ccc] overflow-hidden">
<span className="text-blue-400">fn</span> <span className="text-emerald-400">execute_briefing</span>() {'{'}{'\n'}
{'  '}<span className="text-blue-400">let</span> structure = <span className="text-yellow-300">Logic</span>::init();{'\n'}
{'  '}<span className="text-blue-400">let</span> result = structure.parse({'\n'}
{'    '}<span className="text-green-400">"executive_intent"</span>{'\n'}
{'  '});{'\n'}
{'\n'}
{'  '}<span className="text-blue-400">return</span> result.optimize();{'\n'}
{'}'}
                  </pre>
                </motion.div>

                {/* Active leader card */}
                <motion.div
                  initial={{ opacity: 0, y: 30, rotate: -1 }}
                  animate={{ opacity: 1, y: 0, rotate: -1 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                  whileHover={{ y: -6, rotate: 0, scale: 1.04 }}
                  className="absolute bottom-12 right-0 z-30 w-[280px] bg-[#1c1c1c]/90 backdrop-blur-md border border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4 shadow-2xl cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#333]">
                    <img src={image3} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.2em] text-emerald-400 font-bold mb-1">DASHBOARD</div>
                    <div className="text-sm font-bold text-white">MARCUS VANCE</div>
                  </div>
                  <div className="ml-auto w-3 h-3 rounded-full bg-emerald-500" />
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
            </div>
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
            className="lg:col-span-2 border border-[#222] bg-[#111]/80 backdrop-blur-sm p-10 rounded-3xl relative overflow-hidden group cursor-default"
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
              <BrainCircuit size={180} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <Mic className="text-orion-red" size={22} />
              <h2 className="text-xl font-bold tracking-tight">INTERVIEW PRACTICE</h2>
            </div>
            <p className="text-[#888] text-base max-w-md mb-12 leading-relaxed">
              Practise with realistic questions tailored to your target role. 
              Get immediate feedback on your answers and track your progress 
              over time.
            </p>
            <div className="flex gap-16">
              <div>
                <div className="text-[11px] font-bold tracking-[0.2em] text-emerald-400 mb-2">LATENCY</div>
                <div className="text-4xl font-black">42ms</div>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-[0.2em] text-orion-red mb-2">ACCURACY</div>
                <div className="text-4xl font-black">99.8%</div>
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
            className="border border-[#222] bg-[#111]/80 backdrop-blur-sm p-10 rounded-3xl relative cursor-default"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart className="text-orion-red" size={22} />
              <h2 className="text-lg font-bold tracking-tight">AI-DRIVEN FEEDBACK</h2>
            </div>
            <p className="text-[#888] mb-8 leading-relaxed text-sm">
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
                  className="flex-1 bg-orion-red/70 rounded-md"
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════
            EXECUTIVE WORKBENCH
        ═══════════════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-6 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">
                YOUR<br />DASHBOARD
              </h2>
              <p className="text-lg text-[#888] mb-10 leading-relaxed max-w-md">
                The ultimate preparation environment. Track your interview 
                history, upload your resume for tailored questions, and see 
                your growth over time.
              </p>

              <ul className="space-y-5">
                {[
                  'Context-aware scenario builder',
                  'Historical logic archiving',
                  'Collaborative stakeholder reviews',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="flex items-center gap-4 text-[#999]"
                  >
                    <div className="w-2 h-2 rounded-full bg-orion-red flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -6 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="relative rounded-3xl overflow-hidden border border-[#222] bg-[#111] p-3 cursor-default"
            >
              <img
                src={image3}
                alt="Executive Workbench"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            CTA
        ═══════════════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-orion-red to-[#B91C1C] rounded-3xl py-24 px-8 text-center"
          >
            <Activity className="text-white/80 mx-auto mb-6" size={44} />
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-10 max-w-2xl mx-auto">
              READY TO ACE IT?
            </h2>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-white text-orion-dark font-bold tracking-[0.15em] text-sm rounded-full transition-all hover:bg-gray-100"
              >
                SIGN UP NOW
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
