import { SYSTEM_PROMPT } from '../prompts/system-prompt.js';

const FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const FLASH_LITE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

export class GeminiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'GeminiError';
    this.status = status;
  }
}

async function callGemini(url, body, apiKey) {
  const response = await fetch(`${url}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let detail = '';
    try { detail = (await response.json()).error?.message ?? ''; } catch {}
    throw new GeminiError(detail || `Gemini API error: ${response.status}`, response.status);
  }
  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}

async function withRetry(fn, delays) {
  for (let i = 0; i <= delays.length; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof GeminiError && err.status === 503 && i < delays.length) {
        await new Promise(r => setTimeout(r, delays[i]));
      } else {
        throw err;
      }
    }
  }
}

export async function enhance(userIdea, apiKey) {
  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: 'user', parts: [{ text: userIdea }] }],
    generationConfig: { temperature: 0.7 },
  };
  try {
    return await withRetry(() => callGemini(FLASH_URL, body, apiKey), [1000, 2000, 4000]);
  } catch (err) {
    if (err instanceof GeminiError && err.status === 503) {
      return await callGemini(FLASH_LITE_URL, body, apiKey);
    }
    throw err;
  }
}
