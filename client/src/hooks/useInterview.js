import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * useInterview — manages interview flow state for a given sessionId.
 * Fetches questions from /api/sessions/:id and tracks responses.
 */
export default function useInterview(sessionId) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch session questions ───────────────────────────
  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load session');
        
        setQuestions(data.session.questions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const currentQuestion = questions[currentIndex] || '';
  const totalQuestions = questions.length;

  const nextQuestion = useCallback(
    (answer = '') => {
      setAnswers((prev) => [...prev, answer]);

      if (currentIndex + 1 >= totalQuestions) {
        setIsComplete(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, totalQuestions]
  );

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setIsComplete(false);
  }, []);

  return {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    isComplete,
    loading,
    error,
    nextQuestion,
    reset,
  };
}
