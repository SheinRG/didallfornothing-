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
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-medium text-surface-900 dark:text-surface-50 mb-2">
          Interview Feedback
        </h1>
        <p className="text-sm text-surface-400 dark:text-surface-200 mb-10">
          Here's how you performed — review each dimension below.
        </p>

        {/* ── Overall score ────────────────────────────── */}
        <div className="flex flex-col items-center mb-12">
          <ScoreRing score={overallScore} label="Overall" size={120} />
          <Badge variant="warning" className="mt-4">
            {fillerWordCount} filler words
          </Badge>
        </div>

        {/* ── Score grid ───────────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {scoreKeys.map((key, i) => (
            <motion.div key={key} variants={itemVariants} className="flex justify-center">
              <ScoreRing score={scores[key]} label={scoreLabels[i]} size={90} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Written feedback ─────────────────────────── */}
        <Card className="mb-6">
          <h3 className="text-sm font-medium text-surface-900 dark:text-surface-50 mb-3">
            Feedback
          </h3>
          <p className="text-sm text-surface-400 dark:text-surface-200 leading-relaxed">
            {feedback}
          </p>
        </Card>

        {/* ── Model answer accordion ───────────────────── */}
        <Card className="mb-10">
          <button
            onClick={() => setModelOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-sm font-medium text-surface-900 dark:text-surface-50">
              Model Answer
            </h3>
            <motion.span
              animate={{ rotate: modelOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-surface-400 dark:text-surface-200"
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
                <p className="text-sm text-surface-400 dark:text-surface-200 leading-relaxed mt-4 pt-4 border-t border-primary-200/20 dark:border-primary-200/10">
                  {modelAnswer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* ── Actions ──────────────────────────────────── */}
        <div className="flex gap-4">
          <Link to="/onboarding">
            <Button variant="primary">Practice Again</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">Dashboard</Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}

// Ready for: real feedback data from /api/feedback/:sessionId
