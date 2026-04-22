import { GEMINI_API_KEY } from '../config.js';
import { setApiKey, getApiKey } from '../lib/storage.js';
import { enhance, GeminiError } from '../lib/gemini.js';

browser.runtime.onInstalled.addListener(async () => {
  if (GEMINI_API_KEY && !(await getApiKey())) {
    await setApiKey(GEMINI_API_KEY);
  }
});

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'enhance') {
    return handleEnhance(message.idea);
  }
  if (message.type === 'open-options') {
    browser.runtime.openOptionsPage();
  }
});

async function handleEnhance(idea) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    return { error: 'NO_KEY' };
  }
  try {
    const result = await enhance(idea, apiKey);
    return { result };
  } catch (err) {
    if (err instanceof GeminiError && err.status === 429) {
      const daily = /daily|per.?day|quota/i.test(err.message);
      return { error: daily
        ? "You've hit the daily Gemini quota (250 requests/day on the free tier). Try again tomorrow or upgrade your key at aistudio.google.com."
        : "You're going fast — wait a minute and try again." };
    }
    if (err instanceof GeminiError && err.status === 503) {
      return { error: "Gemini is temporarily unavailable — try again in a few minutes." };
    }
    return { error: err.message ?? 'Something went wrong. Check the browser console.' };
  }
}
