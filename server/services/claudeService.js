/**
 * Claude AI Service
 * Uses Anthropic Claude API (claude-sonnet-4-20250514) for interview question
 * generation and answer analysis.
 *
 * All functions currently return MOCK data so the frontend can be built
 * without a live API key.
 */

/**
 * generateQuestions(role, level, interviewType)
 *
 * Generates a set of 6 interview questions tailored to the given role,
 * experience level, and interview type.
 *
 * @param {string} role           – 'swe' | 'pm' | 'design' | 'marketing'
 * @param {string} level          – 'intern' | 'junior' | 'mid' | 'senior'
 * @param {string} interviewType  – 'behavioral' | 'technical' | 'case-study'
 * @returns {Promise<{ questions: string[] }>}
 *
 * Expected JSON shape returned from Claude:
 * {
 *   questions: [
 *     "Tell me about a time you had to debug a complex production issue.",
 *     "How would you design a URL shortener?",
 *     ...
 *   ]
 * }
 */
export async function generateQuestions(role, level, interviewType) {
  // TODO: Replace mock data with real Anthropic Claude API call.
  // Use claude-sonnet-4-20250514, system prompt from /prompts/questionGen.md,
  // and return parsed JSON.

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

/**
 * analyseAnswer(question, transcript)
 *
 * Sends the original question and the user's spoken transcript to Claude
 * for detailed scoring and feedback.
 *
 * @param {string} question    – The interview question that was asked
 * @param {string} transcript  – The user's spoken answer (from Web Speech API)
 * @returns {Promise<{
 *   clarity:      number,   // 0-10
 *   relevance:    number,   // 0-10
 *   structure:    number,   // 0-10
 *   confidence:   number,   // 0-10
 *   fillerWords:  number,   // count of filler words detected
 *   overallScore: number,   // 0-10
 *   feedback:     string,   // written paragraph of feedback
 *   modelAnswer:  string,   // an ideal answer for comparison
 * }>}
 */
export async function analyseAnswer(question, transcript) {
  // TODO: Replace mock data with real Anthropic Claude API call.
  // Use claude-sonnet-4-20250514, system prompt from /prompts/answerAnalysis.md,
  // send { question, transcript } as user message, and parse JSON response.

  return {
    clarity: 7,
    relevance: 8,
    structure: 6,
    confidence: 7,
    fillerWords: 4,
    overallScore: 7,
    feedback:
      'Your answer demonstrated good understanding of the topic and provided a relevant example. Consider structuring your response using the STAR method (Situation, Task, Action, Result) for more clarity. You used a few filler words ("um", "like") that could be reduced with practice.',
    modelAnswer:
      'In my previous role as a software engineer at Acme Corp, we faced a critical production outage affecting 50,000 users (Situation). I was tasked with leading the incident response team of four engineers (Task). I immediately set up a war room, delegated log analysis across services, and identified a cascading failure in our payment microservice within 30 minutes (Action). We deployed a hotfix that restored service, and I later led a blameless post-mortem that resulted in three new monitoring alerts preventing future incidents (Result).',
  };
}

// Ready for: real Anthropic API key and fetch calls
