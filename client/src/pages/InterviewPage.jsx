import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/ui/PageWrapper';
import Button from '../components/ui/Button';
import useInterview from '../hooks/useInterview';
import useSpeech from '../hooks/useSpeech';
import useTTS from '../hooks/useTTS';

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = location.state?.sessionId;
  const transcriptEndRef = useRef(null);

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    nextQuestion,
    insertNextQuestion,
    loading: sessionLoading,
    answers,
    isAiGenerated,
    isResumeTailored,
    conversationHistory,
  } = useInterview(sessionId);

  const { transcript, isListening, start, stop } = useSpeech();
  const { speak, stopSpeaking, isSpeaking } = useTTS();
  const [submitting, setSubmitting] = useState(false);
  
  const [hint, setHint] = useState('');
  const [hintLoading, setHintLoading] = useState(false);

  // Redirect if no session ID exists
  useEffect(() => {
    if (!sessionId) {
      navigate('/onboarding');
    }
  }, [sessionId, navigate]);

  // Auto-speak the question whenever a new one appears
  useEffect(() => {
    if (currentQuestion) {
      speak(currentQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  // Scroll transcript panel to bottom whenever conversation updates
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, transcript]);

  const handleMicClick = () => {
    if (isSpeaking) stopSpeaking(); // Stop AI voice if it's still talking
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  const handleReplay = () => {
    if (currentQuestion) {
      speak(currentQuestion);
    }
  };

  const handleHint = async () => {
    if (!currentQuestion) return;
    setHintLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question: currentQuestion }),
      });
      const data = await response.json();
      if (response.ok) {
        setHint(data.hint);
      }
    } catch (err) {
      console.error('Hint error:', err);
    } finally {
      setHintLoading(false);
    }
  };

  const handleNext = async () => {
    stop(); // Ensure mic is off
    stopSpeaking(); // Stop TTS if playing
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
      setHint(''); // Clear hint for next question

      // Optional logic to dynamically insert a follow-up question
      // Do it 50% of the time, and stop if we exceed 8 questions total so it doesn't drag on.
      if (transcript && transcript.length > 20 && totalQuestions < 8 && Math.random() > 0.5) {
        setSubmitting(true);
        try {
          const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}/followup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ question: currentQuestion, answer: transcript }),
          });
          const data = await response.json();
          if (response.ok && data.followup) {
            insertNextQuestion(data.followup); // inject the follow-up
          }
        } catch (err) {
          console.error(err);
        } finally {
          setSubmitting(false);
          nextQuestion(transcript); // advance index to the newly inserted follow up
        }
      } else {
        nextQuestion(transcript); // standard progression
      }
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
        <div className="flex items-center gap-3">
          {/* Speaking indicator */}
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 border border-[#2a3a2a] px-3 py-1.5 rounded-full bg-[#1a2a1a]"
            >
              <div className="flex items-center gap-0.5">
                <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-green-400">
                COACH SPEAKING
              </span>
            </motion.div>
          )}
          <div className="flex items-center gap-2 border border-[#333] px-3 py-1.5 rounded-full bg-[#1A1A1A]">
            <span className={`text-[10px] font-bold tracking-[0.2em] ${
              isResumeTailored ? 'text-purple-400' : isAiGenerated ? 'text-green-400' : 'text-blue-400'
            }`}>
              {isResumeTailored ? '📄 RESUME-TAILORED' : isAiGenerated ? '✨ AI GENERATED' : '🛠️ DEMO QUESTIONS'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content — two-panel layout ──────────── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-6 py-8 max-w-6xl mx-auto w-full overflow-hidden">

        {/* ── Left: Live Stage ──────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight px-4">
              "{currentQuestion}"
            </p>

            {/* Replay button */}
            <button
              onClick={handleReplay}
              disabled={isSpeaking}
              className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] text-[#888] hover:text-[#E8563B] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
              REPLAY QUESTION
            </button>
            <button
              onClick={handleHint}
              disabled={hintLoading || !!hint}
              className="mt-4 ml-4 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] text-[#888] hover:text-[#E8563B] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.829 1.508-2.311a5.112 5.112 0 002.13-2.186 5.333 5.333 0 00-3.321-7.234 5.352 5.352 0 00-4.004.148 5.333 5.333 0 00-3.321 7.234c.732 1.488 2.13 2.186 2.13 2.186v.192c0 1.25.962 2.348 2.213 2.45h2.124A2.49 2.49 0 0014.25 18z" />
              </svg>
              {hintLoading ? 'THINKING...' : 'NEED A HINT?'}
            </button>
          </motion.div>

          {/* Hint Display */}
          {hint && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-md bg-[#E8563B]/10 border border-[#E8563B]/30 rounded-xl p-4"
            >
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#E8563B] mb-2">COACH'S HINT</div>
              <p className="text-sm font-medium text-white/90 leading-relaxed whitespace-pre-wrap">{hint}</p>
            </motion.div>
          )}

          {/* Microphone button */}
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

          {/* Live transcript of current speech */}
          {isListening && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-[#111] p-4 rounded-2xl border border-[#E8563B]/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E8563B] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#E8563B]">LIVE RECORDING</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{transcript}</p>
            </motion.div>
          )}

          <Button variant="primary" onClick={handleNext} disabled={submitting}>
            {submitting ? 'GENERATING ANALYSIS...' : currentIndex + 1 < totalQuestions ? 'NEXT QUESTION' : 'SUBMIT SIMULATION'}
          </Button>
        </div>

        {/* ── Right: Conversation Transcript ─────────── */}
        <div className="w-full lg:w-[380px] flex flex-col bg-[#111] rounded-3xl border border-[#222] overflow-hidden">
          {/* Transcript header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#888]">
                CONVERSATION LOG
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#555]">
              {conversationHistory.length} messages
            </span>
          </div>

          {/* Transcript messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-[50vh] lg:max-h-none scrollbar-thin">
            <AnimatePresence>
              {conversationHistory.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      msg.role === 'coach'
                        ? 'bg-gradient-to-br from-[#E8563B] to-[#C4412A] text-white'
                        : 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white'
                    }`}
                  >
                    {msg.role === 'coach' ? 'AI' : 'U'}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'coach'
                        ? 'bg-[#1a1a1a] border border-[#2a2a2a] text-white/90 rounded-tl-sm'
                        : 'bg-[#1a2a4a] border border-[#2a3a5a] text-blue-100 rounded-tr-sm'
                    }`}
                  >
                    <div className="text-[9px] font-bold tracking-[0.2em] text-[#666] mb-1.5">
                      {msg.role === 'coach' ? '🤖 AI COACH' : '👤 YOU'}
                    </div>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Show live typing if user is recording */}
            {isListening && transcript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 flex-row-reverse"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white">
                  U
                </div>
                <div className="max-w-[85%] p-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed bg-[#1a2a4a]/60 border border-[#2a3a5a]/50 text-blue-200/70">
                  <div className="text-[9px] font-bold tracking-[0.2em] text-[#666] mb-1.5 flex items-center gap-1.5">
                    👤 YOU
                    <span className="text-[#E8563B] animate-pulse">● RECORDING</span>
                  </div>
                  {transcript}
                </div>
              </motion.div>
            )}

            <div ref={transcriptEndRef} />
          </div>
        </div>
      </div>

      {/* ── ElevenLabs Attribution (required by free tier) ── */}
      <div className="flex items-center justify-center py-3 border-t border-[#222] bg-[#111]/80">
        <a
          href="https://elevenlabs.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-[#555] hover:text-[#888] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
          Voiced by ElevenLabs
        </a>
      </div>
    </PageWrapper>
  );
}
