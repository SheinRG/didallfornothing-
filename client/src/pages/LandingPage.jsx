import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  {
    icon: '🎙️',
    title: 'Voice Powered',
    description: 'Answer questions naturally using your microphone — no typing required.',
  },
  {
    icon: '🤖',
    title: 'AI Feedback',
    description: 'Get instant, personalised feedback on clarity, structure, and relevance.',
  },
  {
    icon: '📈',
    title: 'Track Progress',
    description: 'Review past sessions and watch your interview skills improve over time.',
  },
];

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center px-6">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center pt-24 pb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="inline-block rounded-full border border-primary-200/30 bg-primary-50 px-4 py-1.5 text-xs font-medium text-primary-600 mb-6 dark:bg-primary-900/30 dark:text-primary-200 dark:border-primary-200/20">
              AI-Powered Interview Practice
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-medium text-surface-900 leading-tight dark:text-surface-50"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            Ace your next interview with{' '}
            <span className="text-primary-600 dark:text-primary-400">AI coaching</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-surface-400 max-w-xl dark:text-surface-200"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            Practice with realistic questions, get real-time voice analysis,
            and receive detailed AI feedback — all in your browser.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 mt-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          >
            <Link to="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">See Demo</Button>
            </Link>
          </motion.div>
        </section>

        {/* ── Features ────────────────────────────────────── */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full pb-24"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="flex flex-col items-start gap-4 h-full">
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="text-base font-medium text-surface-900 dark:text-surface-50">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-400 dark:text-surface-200">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </PageWrapper>
  );
}

// Ready for: no further connections needed
