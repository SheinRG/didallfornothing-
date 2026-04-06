import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import ScoreRing from '../components/ui/ScoreRing';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Mock feedback data
const mockFeedback = {
  scores: { clarity: 7, relevance: 8, structure: 6, confidence: 7 },
  overallScore: 7,
  fillerWordCount: 4,
  feedback:
    'Your answer demonstrated good understanding of the topic and provided a relevant example. Consider structuring your response using the STAR method (Situation, Task, Action, Result) for more clarity.',
  modelAnswer:
    'In my previous role as a software engineer at Acme Corp, we faced a critical production outage affecting 50,000 users (Situation). I was tasked with leading the incident response team of four engineers (Task). I immediately set up a war room, delegated log analysis across services, and identified a cascading failure in our payment microservice within 30 minutes (Action). We deployed a hotfix that restored service, and I later led a blameless post-mortem that resulted in three new monitoring alerts preventing future incidents (Result).',
};

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
  const [modelOpen, setModelOpen] = useState(false);
  const { scores, overallScore, fillerWordCount, feedback, modelAnswer } = mockFeedback;

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
