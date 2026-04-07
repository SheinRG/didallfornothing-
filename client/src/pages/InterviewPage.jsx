import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Button from '../components/ui/Button';
import useInterview from '../hooks/useInterview';
import useSpeech from '../hooks/useSpeech';

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = location.state?.sessionId;

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    nextQuestion,
    loading: sessionLoading,
    answers,
  } = useInterview(sessionId);

  const { transcript, isListening, start, stop } = useSpeech();
  const [submitting, setSubmitting] = useState(false);

  // Redirect if no session ID exists
  useEffect(() => {
    if (!sessionId) {
      navigate('/onboarding');
    }
  }, [sessionId, navigate]);

  const handleMicClick = () => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  const handleNext = async () => {
    stop(); // Ensure mic is off
    const isLast = currentIndex + 1 >= totalQuestions;

    if (isLast) {
      setSubmitting(true);
      try {
        const fullAnswers = [...answers, transcript];
        const response = await fetch('http://localhost:5000/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId, answers: fullAnswers }),
        });

        if (!response.ok) throw new Error('Failed to generate feedback');
        navigate(`/feedback/${sessionId}`);
      } catch (err) {
        alert('Error submitting interview: ' + err.message);
      } finally {
        setSubmitting(false);
      }
    } else {
      nextQuestion(transcript);
    }
  };

  if (sessionLoading) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <p className="text-surface-400">Loading interview questions...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="flex flex-col min-h-screen">
      {/* ── Top bar ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-primary-200/20 dark:border-primary-200/10">
        <span className="text-sm font-medium text-surface-400 dark:text-surface-200">
          Q {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-10 max-w-2xl mx-auto w-full">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-medium text-surface-900 dark:text-surface-50 text-center leading-relaxed"
        >
          {currentQuestion}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMicClick}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors shadow-lg ${
            isListening
              ? 'bg-red-500 scale-110 shadow-red-200/50'
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

        <div className="w-full">
          <label className="text-xs font-medium text-surface-400 dark:text-surface-200 mb-2 block uppercase tracking-wider">
            {isListening ? 'Listening...' : 'Your answer'}
          </label>
          <textarea
            readOnly
            value={transcript}
            placeholder="Click the microphone and start speaking..."
            className="w-full h-32 rounded-lg border border-primary-200/30 bg-surface-50 px-4 py-3 text-sm text-surface-900 resize-none focus:outline-none dark:bg-surface-800 dark:text-surface-50 dark:border-primary-200/20"
          />
        </div>

        <Button variant="primary" onClick={handleNext} disabled={submitting}>
          {submitting ? 'Generating Feedback...' : currentIndex + 1 < totalQuestions ? 'Next Question →' : 'Submit Interview'}
        </Button>
      </div>
    </PageWrapper>
  );
}
