import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import ScoreRing from '../components/ui/ScoreRing';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const scoreLabels = ['Clarity', 'Relevance', 'Structure', 'Confidence'];
const scoreKeys = ['clarity', 'relevance', 'structure', 'confidence'];

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function FeedbackPage() {
  const { sessionId } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modelOpen, setModelOpen] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchFeedback = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/feedback/${sessionId}`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setFeedbackData(data.feedback);
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [sessionId]);

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <p className="text-surface-400">Analyzing your performance...</p>
      </PageWrapper>
    );
  }

  if (!feedbackData) {
    return (
      <PageWrapper className="flex flex-col items-center justify-center py-20">
        <span className="text-5xl mb-4">📝</span>
        <h2 className="text-xl font-medium text-surface-900 dark:text-surface-50 mb-2">No feedback yet</h2>
        <p className="text-sm text-surface-400 dark:text-surface-200 mb-6 text-center max-w-sm">
          Complete an interview session to see your AI-generated performance analysis here.
        </p>
        <Link to="/onboarding">
          <Button variant="primary">Start Practicing</Button>
        </Link>
      </PageWrapper>
    );
  }

  const { scores, overallScore, fillerWordCount, feedback, modelAnswer } = feedbackData;

  return (
    <PageWrapper className="flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 text-center uppercase">
          PERFORMANCE TELEMETRY
        </h1>
        <p className="text-[#888] leading-relaxed mb-12 text-center border-b border-[#222] pb-8">
          Review the structural and tonal analysis of your latest scenario.
        </p>

        {/* ── Overall score ────────────────────────────── */}
        <div className="flex flex-col items-center mb-16">
          <ScoreRing score={overallScore} label="Overall" size={140} />
          <Badge variant="warning" className="mt-6">
            {fillerWordCount} FILLER WORDS DETECTED
          </Badge>
        </div>

        {/* ── Score grid ───────────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {scoreKeys.map((key, i) => (
            <motion.div key={key} variants={itemVariants} className="flex justify-center">
              <ScoreRing score={scores[key]} label={scoreLabels[i]} size={100} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Written feedback ─────────────────────────── */}
        <Card className="mb-8">
          <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#888] mb-4">
            STRUCTURAL FEEDBACK
          </h3>
          <p className="text-[15px] text-white leading-relaxed">
            {feedback}
          </p>
        </Card>

        {/* ── Model answer accordion ───────────────────── */}
        <Card className="mb-12">
          <button
            onClick={() => setModelOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-left focus:outline-none"
          >
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#888]">
              OPTIMAL EXECUTION LOGIC
            </h3>
            <motion.span
              animate={{ rotate: modelOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-[#E8563B] font-bold"
            >
              ▼
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
                <p className="text-[15px] font-mono text-[#ccc] leading-relaxed mt-6 pt-6 border-t border-[#333]">
                  {modelAnswer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* ── Actions ──────────────────────────────────── */}
        <div className="flex justify-center gap-6">
          <Link to="/onboarding">
            <Button variant="primary">INITIALIZE NEW SCENARIO</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">RETURN TO DASHBOARD</Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}

// Ready for: real feedback data from /api/feedback/:sessionId
