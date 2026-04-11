import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import RepracticeModal from '../components/interview/RepracticeModal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const metricMeta = [
  { key: 'clarity',    label: 'Clarity',    icon: 'settings_voice', desc: 'Precision of technical terminology and enunciation.' },
  { key: 'relevance',  label: 'Relevance',  icon: 'target',         desc: 'Alignment with organizational objectives.' },
  { key: 'structure',  label: 'Structure',  icon: 'account_tree',   desc: 'Logical flow of narrative and problem solving.' },
  { key: 'confidence', label: 'Confidence', icon: 'electric_bolt',  desc: 'Stability in vocal tone and presence.' },
];

/* ── colour helper: picks accent based on value ─── */
function metricColor(value) {
  if (value >= 70) return { text: 'text-tertiary', bg: 'bg-tertiary', barBg: 'bg-tertiary' };
  if (value >= 40) return { text: 'text-primary-container', bg: 'bg-primary-container', barBg: 'bg-primary-container' };
  return { text: 'text-white/50', bg: 'bg-white/20', barBg: 'bg-white/20' };
}

/* ── SVG radial gauge ─────────────────────────── */
function RadialGauge({ score = 0, max = 10 }) {
  const pct = Math.min(score / max, 1);
  const r = 45;
  const C = 2 * Math.PI * r;
  const offset = C * (1 - pct);

  return (
    <div className="relative w-72 h-72 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8"
          className="text-surface-container-highest" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke="#ff5543" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-8xl font-black text-white tracking-tighter">
          {score}<span className="text-3xl text-neutral-500">/10</span>
        </span>
        <span className="text-neutral-500 font-semibold text-xs tracking-widest uppercase mt-1">
          {score >= 7 ? 'Strong' : score >= 4 ? 'Developing' : 'Critical'} Grade
        </span>
      </div>
    </div>
  );
}

/* ── Metric card ──────────────────────────────── */
function MetricCard({ icon, label, description, value }) {
  const pct = Math.round((value / 10) * 100);
  const c = metricColor(pct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-low p-8 border border-white/5 hover:bg-surface-container transition-all rounded-[2.5rem] flex flex-col justify-between card-pop
                 theme-light-card"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`material-symbols-outlined text-3xl ${c.text}`}>{icon}</span>
          <span className={`text-sm font-semibold tracking-widest ${c.text}`}>{pct}%</span>
        </div>
        <h3 className="text-white font-bold text-xl mb-2">{label}</h3>
        <p className="text-on-surface-variant text-xs leading-snug">{description}</p>
      </div>
      <div className="mt-6 w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
        <motion.div
          className={`${c.barBg} h-full`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════ */
export default function FeedbackPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modelOpen, setModelOpen] = useState(false);
  const [showFillerWords, setShowFillerWords] = useState(false);
  const [isThemeLight, setIsThemeLight] = useState(false);
  
  const [activePracticeQ, setActivePracticeQ] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  // Sync theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsThemeLight(true);
      document.documentElement.classList.add('theme-light');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isThemeLight;
    setIsThemeLight(next);
    if (next) {
      document.documentElement.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('theme-light');
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }

    const fetchAll = async () => {
      try {
        const [fbRes, sessRes] = await Promise.all([
          fetch(`${API}/feedback/${sessionId}`, { credentials: 'include' }),
          fetch(`${API}/sessions/${sessionId}`, { credentials: 'include' }),
        ]);
        const fbData = await fbRes.json();
        if (fbRes.ok) setFeedbackData(fbData.feedback);

        const sessData = await sessRes.json();
        if (sessRes.ok) setSession(sessData.session);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [sessionId]);

  const handleDownloadPDF = () => {
    if (!feedbackData || !session) return;
    const doc = new jsPDF();
    
    // Colors & Branding
    const brandColor = [232, 86, 59];
    
    doc.setFontSize(22);
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.text("ORION AI - Interview Report", 14, 22);
    
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.text(`Role: ${session.role.toUpperCase()}`, 14, 32);
    doc.text(`Level: ${session.level.toUpperCase()}`, 14, 38);
    doc.text(`Overall Score: ${Math.round(feedbackData.overallScore)}/10`, 14, 44);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Executive Summary", 14, 58);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const splitFeedback = doc.splitTextToSize(feedbackData.feedback || '', 180);
    doc.text(splitFeedback, 14, 66);

    let startY = 66 + (splitFeedback.length * 5) + 12;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Question Breakdown", 14, startY);
    
    const tableData = session.questions.map((q, i) => [
      `Q${i+1}`, 
      q, 
      session.answers[i] || 'No response recorded'
    ]);

    autoTable(doc, {
      startY: startY + 6,
      head: [['#', 'Question', 'Your Response']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: brandColor },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 70 },
        2: { cellWidth: 100 }
      }
    });

    doc.save(`Orion_Report_${sessionId.slice(-4)}.pdf`);
  };

  const [retryLoading, setRetryLoading] = useState(false);

  const handleRetry = async () => {
    if (!session) return;
    setRetryLoading(true);
    try {
      const response = await fetch(`${API}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          role: session.role,
          level: session.level,
          interviewType: session.interviewType,
          difficulty: session.difficulty || 'medium',
          jobDescription: session.jobDescription || '',
          existingQuestions: session.questions, // PASS EXISTING QUESTIONS
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create retry session');
      
      navigate(`/interview`, { state: { sessionId: data.session._id } });
    } catch (err) {
      alert('Error starting retry: ' + err.message);
    } finally {
      setRetryLoading(false);
    }
  };

  /* ── Loading ───────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-on-surface-variant animate-pulse font-semibold tracking-widest uppercase text-xs">
          Analyzing your performance...
        </p>
      </div>
    );
  }

  /* ── No data ───────────────────────────────── */
  if (!feedbackData) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-6xl text-primary-container">description</span>
        <h2 className="text-xl font-bold text-white">No feedback yet</h2>
        <p className="text-sm text-on-surface-variant max-w-sm text-center">
          Complete an interview session to see your AI-generated performance analysis here.
        </p>
        <Link
          to="/onboarding"
          className="mt-4 px-8 py-3.5 bg-primary-container text-white rounded-xl font-semibold text-sm tracking-widest uppercase hover:brightness-110 transition-all"
        >
          Start Practicing
        </Link>
      </div>
    );
  }

  const { scores, overallScore, fillerWordCount, fillerWordsList, feedback, starFeedback, modelAnswer } = feedbackData;

  /* derive title from session data */
  const roleLabels = { swe: 'SWE', pm: 'PM', design: 'Design', marketing: 'Marketing' };
  const levelLabels = { intern: 'Intern', junior: 'Junior', mid: 'Mid', senior: 'Senior' };
  const titleText = session
    ? `${levelLabels[session.level] || ''} ${roleLabels[session.role] || ''} Interview`.trim()
    : 'Interview Analysis';

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary-container/30">

      {/* ── Nav ─────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/70 backdrop-blur-xl border-b border-white/5
                       theme-light-nav">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
          <Link to="/dashboard" className="text-2xl font-black tracking-tighter text-[#F03E2F] uppercase">
            ORION
          </Link>

          <div className="hidden md:flex items-center space-x-10 font-semibold">
            <Link to="/dashboard" className="text-neutral-400 hover:text-white transition-colors">Dashboard</Link>
            <span className="text-[#F03E2F] border-b-2 border-[#F03E2F] pb-1">Interviews</span>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={toggleTheme} className="material-symbols-outlined text-neutral-400 hover:text-white transition-colors">
              {isThemeLight ? 'light_mode' : 'dark_mode'}
            </button>

            <Link
              to="/dashboard"
              className="w-10 h-10 rounded-full border border-white/10 overflow-hidden flex items-center justify-center bg-primary-container/20"
            >
              <span className="material-symbols-outlined text-primary-container">person</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Main Content ───────────────────────── */}
      <main className="pt-32 pb-12 px-6 md:px-8 max-w-screen-2xl mx-auto relative min-h-[calc(100vh-80px)]">

        {/* Dot grid background texture */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-100"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Breadcrumb / Meta */}
        <div className="relative z-10 mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-primary-container font-semibold text-sm tracking-widest uppercase">Analysis Report</span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mt-2 text-white">
              {titleText}
            </h1>
            <p className="text-on-surface-variant mt-3 max-w-lg text-lg">
              Executive feedback and technical communication metrics
              {sessionId && <> for Session #{sessionId.slice(-4).toUpperCase()}.</>}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-3 bg-surface-container-high rounded-xl font-semibold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-2 border border-white/5 text-white"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span> PDF
              </button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/onboarding"
                className="px-6 py-3 bg-primary-container rounded-xl font-semibold text-sm hover:brightness-110 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">replay</span> NEW SESSION
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Layout Grid ────────────────────────── */}
        <div className="relative z-10 grid grid-cols-12 gap-8">

          {/* Hero: Overall Score */}
          <div className="col-span-12 lg:col-span-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-surface-container-low p-10 md:p-12 h-full border border-white/5 relative rounded-[2.5rem] card-pop theme-light-card"
            >
              {/* Subtle Glow container */}
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-container/10 blur-[120px]" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
                    Overall Performance
                  </h2>
                  <p className="text-on-surface-variant leading-relaxed text-lg md:text-xl mb-10">
                    {feedback || 'Your delivery exhibited high technical proficiency. Review the detailed metrics for specific areas of improvement.'}
                  </p>

                  {/* Filler Words Badge */}
                  {fillerWordCount > 0 && (
                    <div className="relative inline-block">
                      <button 
                        onClick={() => setShowFillerWords(!showFillerWords)}
                        className="inline-flex items-center gap-4 px-6 py-4 bg-primary-container/10 border border-primary-container/20 rounded-full shadow-[0_0_30px_rgba(255,85,67,0.1)] hover:bg-primary-container/20 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: '"FILL" 1' }}>warning</span>
                        <span className="text-primary-container font-semibold text-sm tracking-wide">
                          {fillerWordCount} FILLER WORDS
                        </span>
                        <span className="material-symbols-outlined text-primary-container text-sm">
                          {showFillerWords ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                      
                      <AnimatePresence>
                        {showFillerWords && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-full mt-3 left-0 w-[240px] bg-[#1a1a1a] border border-[#333] rounded-2xl p-4 shadow-2xl z-50"
                          >
                            <p className="text-xs font-bold tracking-[0.1em] text-[#888] mb-3 uppercase">Words Detected:</p>
                            {fillerWordsList && fillerWordsList.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {fillerWordsList.map((word, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-[#222] border border-[#444] text-[#E8563B] rounded-lg text-sm font-medium">
                                    "{word}"
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-neutral-400">Filler words were detected in your audio, but the specifics were not logged in this session.</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <RadialGauge score={Math.round(overallScore || 0)} max={10} />
              </div>
            </motion.div>
          </div>

          {/* Metrics Column */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-6">
            {metricMeta.map((m, i) => (
              <MetricCard
                key={m.key}
                icon={m.icon}
                label={m.label}
                description={m.desc}
                value={scores?.[m.key] ?? 0}
              />
            ))}
          </div>

          {/* Critical Insights */}
          <div className="col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-surface-container-low rounded-[2.5rem] border border-white/5 p-10 theme-light-card card-pop"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-2.5 h-10 bg-primary-container rounded-full" />
                <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Critical Insights</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Weakness */}
                <div className="flex gap-6 items-start">
                  <div className="bg-primary-container/10 p-4 rounded-3xl shrink-0">
                    <span className="material-symbols-outlined text-primary-container text-4xl">error_outline</span>
                  </div>
                  <div>
                    <span className="block text-white font-semibold text-lg mb-2 uppercase tracking-wider">
                      Areas for Improvement
                    </span>
                    <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                      {starFeedback || 'Focus on structuring your responses using the STAR method. Reduce filler words and practice authoritative pausing between key points.'}
                    </p>
                  </div>
                </div>

                {/* Strength */}
                <div className="flex gap-6 items-start">
                  <div className="bg-tertiary/10 p-4 rounded-3xl shrink-0">
                    <span className="material-symbols-outlined text-tertiary text-4xl">check_circle</span>
                  </div>
                  <div>
                    <span className="block text-white font-semibold text-lg mb-2 uppercase tracking-wider">
                      Key Strengths
                    </span>
                    <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                      {scores && scores.relevance >= 7
                        ? 'Strong alignment with role requirements and excellent use of domain terminology throughout the dialogue.'
                        : scores && scores.confidence >= 7
                        ? 'Confident vocal tone and steady delivery. Your presence during responses is a strong suit.'
                        : 'Keep building on your foundational knowledge. Consistent practice will strengthen your interview performance.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Model Answer Accordion */}
          {modelAnswer && (
            <div className="col-span-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-surface-container-low rounded-[2.5rem] border border-white/5 p-10 theme-light-card card-pop"
              >
                <button
                  onClick={() => setModelOpen(prev => !prev)}
                  className="w-full flex items-center justify-between text-left focus:outline-none group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-10 bg-tertiary rounded-full" />
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      Sample Answer
                    </h3>
                  </div>
                  <motion.span
                    animate={{ rotate: modelOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="material-symbols-outlined text-primary-container text-2xl group-hover:text-white transition-colors"
                  >
                    expand_more
                  </motion.span>
                </button>

                <AnimatePresence>
                  {modelOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-base font-mono text-on-surface-variant leading-relaxed mt-8 pt-8 border-t border-white/5">
                        {modelAnswer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {/* Question-by-Question Breakdown & Re-Practice */}
          <div className="col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-surface-container-low rounded-[2.5rem] border border-white/5 p-10 theme-light-card card-pop mt-4"
            >
              <button
                onClick={() => setReviewOpen(prev => !prev)}
                className="w-full flex flex-col md:flex-row md:items-center justify-between text-left focus:outline-none group mb-2 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-12 bg-[#E8563B] rounded-full shrink-0" />
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Answer Review & Re-practice</h3>
                    <p className="text-on-surface-variant text-base mt-2">Review your specific answers below. Click Re-practice for targeted feedback.</p>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: reviewOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="material-symbols-outlined text-[#E8563B] text-3xl group-hover:text-white transition-colors self-end md:self-auto"
                >
                  expand_more
                </motion.span>
              </button>

              <AnimatePresence>
                {reviewOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-6 pt-8 mt-4 border-t border-white/5">
                      {session?.questions?.map((q, idx) => (
                        <div key={idx} className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 transition-all hover:border-[#444]">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex-1 space-y-4">
                              <div>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E8563B] uppercase mb-1 block">Question {idx + 1}</span>
                                <h4 className="text-white font-semibold text-lg leading-snug">{q}</h4>
                              </div>
                              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <p className="text-zinc-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                  {session.answers[idx] || <span className="italic text-zinc-600">No response recorded.</span>}
                                </p>
                              </div>
                            </div>
                            <div className="shrink-0 pt-2">
                              <button
                                onClick={() => setActivePracticeQ(q)}
                                className="w-full md:w-auto px-6 py-3 bg-[#E8563B]/10 text-[#E8563B] border border-[#E8563B]/30 hover:bg-[#E8563B] hover:text-white rounded-xl font-bold text-xs tracking-widest uppercase transition-colors"
                              >
                                Re-practice
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* ── Actions ──────────────────────────────── */}
        <div className="relative z-10 flex justify-center gap-6 mt-16 flex-wrap">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={handleRetry}
              disabled={retryLoading}
              className={`px-10 py-4 bg-[#E8563B] text-white rounded-xl font-semibold text-sm tracking-widest uppercase hover:brightness-110 transition-all flex items-center justify-center min-w-[240px] ${retryLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {retryLoading ? 'PREPARING...' : 'RETRY SAME INTERVIEW'}
            </button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/onboarding"
              className="px-10 py-4 bg-primary-container text-white rounded-xl font-semibold text-sm tracking-widest uppercase hover:brightness-110 transition-all flex h-full items-center"
            >
              Start New Interview
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/dashboard"
              className="px-10 py-4 bg-surface-container-high text-white rounded-xl font-semibold text-sm tracking-widest uppercase border border-white/5 hover:bg-surface-container-highest transition-all flex h-full items-center"
            >
              Back to Dashboard
            </Link>
          </motion.div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="w-full py-12 px-8 border-t border-white/5 bg-surface-container-lowest">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-screen-2xl mx-auto">
          <div className="font-semibold text-neutral-200 text-lg tracking-tighter">
            ORION <span className="text-[#F03E2F]">AI</span>
          </div>
          <div className="flex gap-8 text-sm tracking-wide text-neutral-500">
            <a className="hover:text-[#F03E2F] transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-[#F03E2F] transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-[#F03E2F] transition-colors" href="#">Executive Support</a>
          </div>
          <p className="text-sm tracking-wide text-neutral-500 opacity-80">
            © 2024 ORION AI. Built for the Structural Architect.
          </p>
        </div>
      </footer>

      {/* Re-practice Modal Overlay */}
      <RepracticeModal 
        isOpen={!!activePracticeQ}
        onClose={() => setActivePracticeQ(null)}
        question={activePracticeQ}
        session={session}
      />
    </div>
  );
}
