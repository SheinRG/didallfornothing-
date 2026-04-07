import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * generateQuestions(role, level, interviewType)
 */
export async function generateQuestions(role, level, interviewType) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️ ANTHROPIC_API_KEY missing - using fallback mock questions');
    return {
      questions: [
        'Tell me about a time you led a team through a difficult project.',
        'How do you prioritise tasks when everything feels urgent?',
        'Describe a situation where you had to learn something quickly.',
        'Walk me through how you would design a notification system.',
        'Give an example of a time you received tough feedback and how you handled it.',
        'What is your approach to making decisions with incomplete information?',
      ],
    };
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: 'You are an elite interview coach. Given a role, level, and interview type, generate 6 specific and challenging interview questions. Return ONLY a JSON object with a "questions" array of strings.',
      messages: [
        {
          role: 'user',
          content: `Generate 6 ${interviewType} questions for a ${level} level ${role} role.`,
        },
      ],
    });

    const content = response.content[0].text;
    return JSON.parse(content);
  } catch (error) {
    console.error('AI question generation error:', error);
    throw error;
  }
}

/**
 * analyseAnswer(question, transcript)
 */
export async function analyseAnswer(question, transcript) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      clarity: 7,
      relevance: 8,
      overallScore: 7,
      feedback: 'Mock feedback: Good answer, but could be more detailed.',
      modelAnswer: 'This would be a sample ideal answer.',
    };
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: 'Analyze the interview answer and provide feedback. Return JSON object with scores (0-10) for clarity, relevance, structure, confidence, and a feedback paragraph plus a modelAnswer.',
      messages: [
        {
          role: 'user',
          content: `Question: ${question}\nUser Answer: ${transcript}`,
        },
      ],
    });

    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error('AI answer analysis error:', error);
    throw error;
  }
}
