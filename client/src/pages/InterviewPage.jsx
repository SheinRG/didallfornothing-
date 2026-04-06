import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Button from '../components/ui/Button';

export default function InterviewPage() {
  // TODO: replace with useInterview() and useSpeech() hooks
  const currentQuestion = 'Tell me about a time you led a team through a difficult project.';
  const currentIndex = 0;
  const totalQuestions = 6;
  const isListening = false;

  return (
    <PageWrapper className="flex flex-col min-h-screen">
      {/* ── Top bar ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-primary-200/20 dark:border-primary-200/10">
        <span className="text-sm font-medium text-surface-400 dark:text-surface-200">
          Q {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-surface-400 tabular-nums dark:text-surface-200">
          00:00
        </span>
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-10 max-w-2xl mx-auto w-full">
        {/* Question */}
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-xl font-medium text-surface-900 dark:text-surface-50 text-center leading-relaxed"
        >
          {currentQuestion}
        </motion.p>

        {/* Mic button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
            isListening
              ? 'bg-danger-400 text-white'
              : 'bg-primary-600 text-white hover:bg-primary-800'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
            />
          </svg>
        </motion.button>

        {/* Transcript area */}
        <div className="w-full">
          <label className="text-xs font-medium text-surface-400 dark:text-surface-200 mb-2 block">
            Your answer
          </label>
          <textarea
            readOnly
            placeholder="Your spoken answer will appear here..."
            className="w-full h-32 rounded-lg border border-primary-200/30 bg-surface-50 px-4 py-3 text-sm text-surface-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400/20 dark:bg-surface-800 dark:text-surface-50 dark:border-primary-200/20 dark:placeholder:text-surface-400"
          />
        </div>

        {/* Next / Submit */}
        <Button variant="primary">
          {currentIndex + 1 < totalQuestions ? 'Next Question →' : 'Submit Interview'}
        </Button>
      </div>
    </PageWrapper>
  );
}

// Ready for: useInterview() + useSpeech() hooks, live mic logic, and timer
