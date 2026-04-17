import { SYSTEM_PROMPT } from '../prompts/system-prompt.js';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export class GeminiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'GeminiError';
    this.status = status;
  }
}

export async function enhance(userIdea, apiKey) {
  const response = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userIdea }] }],
      generationConfig: { temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    throw new GeminiError(`Gemini API error: ${response.status}`, response.status);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}
