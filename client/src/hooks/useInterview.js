import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * useInterview — manages interview flow state for a given sessionId.
 * Fetches questions from /api/sessions/:id, tracks responses,
 * and maintains a full conversation history for the transcript panel.
 */
export default function useInterview(sessionId) {
  const [questions, setQuestions] = useState([]);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [isResumeTailored, setIsResumeTailored] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Conversation history: array of { role: 'coach' | 'user', text: string }
  const [conversationHistory, setConversationHistory] = useState([]);

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
        
        const fetchedQuestions = data.session.questions || [];
        setQuestions(fetchedQuestions);
        setIsAiGenerated(data.session.isAiGenerated || false);
        setIsResumeTailored(data.session.isResumeTailored || false);

        // Seed the conversation with the first question
        if (fetchedQuestions.length > 0) {
          setConversationHistory([
            { role: 'coach', text: fetchedQuestions[0] },
          ]);
        }
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
      // Push the user's answer into conversation history
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', text: answer || '(no response)' },
      ]);

      setAnswers((prev) => [...prev, answer]);

      if (currentIndex + 1 >= totalQuestions) {
        setIsComplete(true);
      } else {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);

        // Push the next AI question into conversation history
        setConversationHistory((prev) => [
          ...prev,
          { role: 'coach', text: questions[nextIdx] },
        ]);
      }
    },
    [currentIndex, totalQuestions, questions]
  );

  const insertNextQuestion = useCallback((newQuestion) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy.splice(currentIndex + 1, 0, newQuestion);
      return copy;
    });
  }, [currentIndex]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setAnswers([]);
    setIsComplete(false);
    setConversationHistory(
      questions.length > 0 ? [{ role: 'coach', text: questions[0] }] : []
    );
  }, [questions]);

  return {
    questions,
    isAiGenerated,
    isResumeTailored,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    isComplete,
    loading,
    error,
    conversationHistory,
    nextQuestion,
    insertNextQuestion,
    reset,
  };
}
