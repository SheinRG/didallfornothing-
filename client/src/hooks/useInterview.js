import { useState, useCallback } from 'react';

const MOCK_QUESTIONS = [
  'Tell me about a time you led a team through a difficult project.',
  'How do you prioritise tasks when everything feels urgent?',
  'Describe a situation where you had to learn something quickly.',
  'Walk me through how you would design a notification system.',
  'Give an example of a time you received tough feedback and how you handled it.',
  'What is your approach to making decisions with incomplete information?',
];

/**
 * useInterview — manages interview flow state.
 * Tracks current question index, collected answers, and completion.
 */
export default function useInterview() {
  const [questions] = useState(MOCK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

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
    nextQuestion,
    reset,
  };
}

// Ready for: real questions from Claude API via /api/sessions
