import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/env';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const generateInsight = async (summary: string) => {
  const prompt = `Gere um insight com base nesses dados: ${summary}`;
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    // model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content;
};
