import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

export function getGeminiChat(history?: { role: string; parts: { text: string }[] }[]) {
  const model = getGeminiModel();
  return model.startChat({
    history: history || [],
  });
}
