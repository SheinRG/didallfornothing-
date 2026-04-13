import { useState, useCallback, useEffect } from 'react';
import { authFetch } from '../utils/authFetch';

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
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await authFetch(`${API_BASE_URL}/sessions/${sessionId}`);
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
    (answer = '', nextQuestionText = null) => {
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

        // Push the next AI question into conversation history.
        // Use the explicitly passed text if available (handles async question mutations),
        // otherwise read from the current questions array.
        setConversationHistory((prev) => [
          ...prev,
          { role: 'coach', text: nextQuestionText || questions[nextIdx] },
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

  const modifyNextQuestion = useCallback((prefix) => {
    setQuestions((prev) => {
      const copy = [...prev];
      if (copy[currentIndex + 1]) {
        copy[currentIndex + 1] = prefix + ' ' + copy[currentIndex + 1];
      }
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
    modifyNextQuestion,
    reset,
  };
}
