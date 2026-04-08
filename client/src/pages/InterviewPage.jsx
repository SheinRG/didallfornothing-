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
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#222] bg-[#111]/90 backdrop-blur-md">
        <div className="flex items-center gap-2 border border-[#333] px-3 py-1.5 rounded-full bg-[#1A1A1A]">
          <div className="w-2 h-2 rounded-full bg-[#E8563B] animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#aaa]">
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </span>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-12 max-w-3xl mx-auto w-full">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-extrabold text-white text-center leading-tight tracking-tight px-4"
        >
          "{currentQuestion}"
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMicClick}
          className={`w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-2xl ${
            isListening
              ? 'bg-[#E8563B] text-white shadow-[0_0_40px_rgba(232,86,59,0.5)] scale-110'
              : 'bg-[#1a1a1a] border border-[#333] text-[#888] hover:border-[#E8563B] hover:text-[#E8563B]'
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

        <div className="w-full bg-[#111] p-6 rounded-3xl border border-[#222]">
          <div className="flex items-center justify-between mb-4">
             <label className="text-[11px] font-bold tracking-[0.2em] text-[#888]">
               {isListening ? 'RECORDING TELEMETRY...' : 'TRANSCRIPT LOG'}
             </label>
             {isListening && <div className="text-[10px] text-[#E8563B] animate-pulse uppercase font-mono tracking-widest">Active</div>}
          </div>
          <textarea
            readOnly
            value={transcript}
            placeholder="Awaiting audio input..."
            className="w-full h-32 bg-transparent text-[15px] font-medium text-white placeholder:text-[#444] resize-none focus:outline-none leading-relaxed"
          />
        </div>

        <Button variant="primary" onClick={handleNext} disabled={submitting}>
          {submitting ? 'GENERATING ANALYSIS...' : currentIndex + 1 < totalQuestions ? 'NEXT QUESTION' : 'SUBMIT SIMULATION'}
        </Button>
      </div>
    </PageWrapper>
  );
}
