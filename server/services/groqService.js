import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

/**
 * analyzeResume(resumeText)
 * Parses raw resume text and returns structured data.
 */
export async function analyzeResume(resumeText) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const prompt = `You are an expert resume parser. Analyze the following resume text and extract key information.
Return ONLY a valid JSON object with these fields:
- "name" (string): the candidate's full name
- "detectedRole" (string): the most likely job role (e.g. "Software Engineer", "Product Manager", "Designer", "Marketing")
- "skills" (array of strings): top 8 technical and soft skills
- "experienceLevel" (string): one of "intern", "junior", "mid", "senior" based on years/depth of experience
- "projects" (array of strings): up to 5 notable projects or achievements mentioned
- "summary" (string): a 2-3 sentence professional summary

Resume Text:
${resumeText.slice(0, 4000)}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-8b-instant',
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  let content = completion.choices[0]?.message?.content || '';
  if (content.startsWith('```json')) {
    content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (content.startsWith('```')) {
    content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(content);
}

/**
 * extractTextFromImage(base64Image, mimeType)
 * Uses Groq vision model to OCR a resume image.
 */
export async function extractTextFromImage(base64Image, mimeType) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract ALL text from this resume image. Return the complete text content exactly as it appears, preserving the structure. Do not summarize or skip any section.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    model: 'llama-3.2-11b-vision-preview',
    temperature: 0.1,
    max_tokens: 4000,
  });

  return completion.choices[0]?.message?.content || '';
}

/**
 * generateQuestions(role, level, interviewType, resumeContext)
 * If resumeContext is provided, generates personalized questions.
 */
export async function generateQuestions(role, level, interviewType, resumeContext = null, jobDescription = '') {
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️ GROQ_API_KEY missing - using fallback mock questions');
    return {
      isAiGenerated: false,
      isResumeTailored: false,
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
    let prompt;

    if (resumeContext) {
      let jdContext = jobDescription ? `\n\nJOB DESCRIPTION (TARGET): \n${jobDescription}\n` : '';
      prompt = `You are an elite interview coach. Based on the candidate's resume, generate interview questions that are highly personalized.${jdContext}

CANDIDATE RESUME CONTEXT:
- Name: ${resumeContext.name || 'Unknown'}
- Detected Role: ${resumeContext.detectedRole || role}
- Skills: ${(resumeContext.skills || []).join(', ')}
- Experience Level: ${resumeContext.experienceLevel || level}
- Projects: ${(resumeContext.projects || []).join(', ')}
- Summary: ${resumeContext.summary || 'N/A'}

Generate 4 questions specifically tailored to this candidate's resume (referencing their actual projects, skills, and experience), plus 2 standard ${interviewType} questions for a ${level} level ${role} role. ${jobDescription ? 'Ensure the questions specifically test the requirements mentioned in the Job Description.' : ''}

Return ONLY a JSON object with a "questions" array of 6 strings. The first 4 should reference specific items from the resume.`;
    } else {
      let jdContext = jobDescription ? `\n\nJOB DESCRIPTION (TARGET):\n${jobDescription}\n Ensure questions directly address these specific job requirements.` : '';
      prompt = `You are an elite interview coach. Given a role, level, and interview type, generate 6 specific and challenging interview questions. Return ONLY a JSON object with a "questions" array of strings.\n\nGenerate 6 ${interviewType} questions for a ${level} level ${role} role.${jdContext}`;
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    let content = completion.choices[0]?.message?.content || '';

    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    const parsed = JSON.parse(content);
    return { ...parsed, isAiGenerated: true, isResumeTailored: !!resumeContext };
  } catch (error) {
    console.warn('⚠️ AI question generation error. Gracefully degrading to random fallback questions.', error.message);

    const fallbackPools = {
      swe: [
        'How would you scale a web application to handle 1 million concurrent users?',
        'Describe a time you had to optimize a very slow database query.',
        'What is your approach to testing a critical payment processing service?',
        'Walk me through the architecture of a real-time chat application.',
        'Explain event loop mechanics and how you avoid blocking the main thread.',
        'How do you handle breaking changes in an API that is actively consumed by clients?',
        'Describe the trade-offs between monolithic and microservice architectures.',
      ],
      pm: [
        'How do you prioritize features when engineering and sales disagree?',
        'Walk me through your process for launching a feature that failed.',
        'Describe an instance where you relied heavily on data to pivot a product strategy.',
        'How would you define the minimum viable product for a new grocery delivery app?',
        'What metrics would you use to measure the success of a new onboarding flow?',
        'How do you handle a critical launch delay due to technical debt?',
      ],
      default: [
        'Tell me about a time you led a team through a difficult project.',
        'How do you prioritise tasks when everything feels urgent?',
        'Describe a situation where you had to learn something quickly.',
        'Give an example of a time you received tough feedback and how you handled it.',
        'What is your approach to making decisions with incomplete information?',
        'Describe a time when you strongly disagreed with a manager and how you resolved it.',
        'What are your primary strategies for resolving team conflicts?',
        'Tell me about your proudest professional achievement.',
      ],
    };

    const pool = fallbackPools[role] || fallbackPools.default;
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);

    return { questions: selected, isAiGenerated: false, isResumeTailored: false };
  }
}

/**
 * analyseAnswer(transcript)
 * Analyzes the full interview transcript.
 */
export async function analyseAnswer(transcript) {
  if (!process.env.GROQ_API_KEY) {
    return {
      clarity: 7,
      relevance: 8,
      overallScore: 7,
      feedback: 'Good overall, but you missed some STAR method structures.',
      starFeedback: 'You did well on Situation and Task, but missed detailing the specific Action you took and measurable Results.',
      modelAnswer: 'A good approach uses the STAR method...',
    };
  }

  try {
    const prompt = `Analyze the following interview transcript. Provide feedback on their performance.
Focus on if they used the STAR method (Situation, Task, Action, Result) in their behavioral answers.
Return ONLY a valid JSON object with:
- scores: integers 0-10 for clarity, relevance, structure, confidence
- overallScore: integer 0-10
- fillerWordCount: estimated integer count of ums/ahs
- feedback: a string paragraph of general structural feedback
- starFeedback: a string paragraph specifically grading how well they used the STAR method across their answers
- modelAnswer: a string paragraph showing an ideal response strategy for the hardest question they faced

Transcript:
${transcript}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    let content = completion.choices[0]?.message?.content || '';

    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(content);
  } catch (error) {
    console.warn('⚠️ AI answer analysis error. Gracefully degrading to fallback feedback.', error.message);
    return {
      clarity: 7,
      relevance: 8,
      structure: 6,
      confidence: 9,
      overallScore: 7,
      fillerWordCount: 2,
      feedback: 'Mock feedback generated due to API error: Your answers hit the major points, but lacked specific examples and could have been structured better.',
      starFeedback: 'Mock STAR feedback: Try to dedicate more time to the "Result" portion of your answers with quantifiable metrics.',
      modelAnswer: 'A sample ideal answer would follow the STAR method strictly and include verifiable metrics.',
    };
  }
}

/**
 * generateHint(question)
 * Provides a short bulleted hint for a given question.
 */
export async function generateHint(question) {
  if (!process.env.GROQ_API_KEY) {
    return "Think about the STAR method: Situation, Task, Action, Result. Focus on your specific contribution.";
  }

  try {
    const prompt = `You are a supportive interview coach. The user is stuck on this question: "${question}"
Provide a very brief 1-2 sentence hint or 2 short bullet points on what they should cover in their answer to succeed. Do NOT write the answer for them, just give a strategic hint.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content?.trim() || "Think about the STAR method: Situation, Task, Action, Result.";
  } catch (err) {
    console.error('Hint generation error:', err.message);
    return "Think about the STAR method: Situation, Task, Action, Result. Focus on your specific contribution.";
  }
}

/**
 * generateFollowUp(question, answer)
 * Generates a follow-up question based on the user's answer.
 */
export async function generateFollowUp(question, answer) {
  if (!process.env.GROQ_API_KEY) {
    return "That's interesting. Can you tell me more about the specific challenges you faced?";
  }

  try {
    const prompt = `You are a tough but fair interview coach. 
The user was asked: "${question}"
Their answer was: "${answer}"

Generate ONE challenging follow-up question that digs deeper into their answer. Probe for specifics, results, or alternative approaches. 
Keep the question under 2 sentences. Do NOT praise them, just ask the follow-up directly.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content?.trim() || "Can you elaborate more on that?";
  } catch (err) {
    console.error('Follow-up generation error:', err.message);
    return "Can you elaborate more on your thought process there?";
  }
}
