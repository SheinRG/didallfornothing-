import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

anthropic.messages.create({
  model: 'claude-3-5-sonnet-20240620',
  max_tokens: 1024,
  system: 'You are an elite interview coach. Given a role, level, and interview type, generate 6 specific and challenging interview questions. Return ONLY a JSON object with a "questions" array of strings.',
  messages: [{ role: 'user', content: 'Generate 6 technical questions for a senior level swe role.' }]
}).then(res => console.log(JSON.stringify(res.content[0].text)))
  .catch(console.error);
