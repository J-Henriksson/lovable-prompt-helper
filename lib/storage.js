const KEY = 'geminiApiKey';

export async function getApiKey() {
  const result = await browser.storage.local.get(KEY);
  return result[KEY] ?? null;
}

export async function setApiKey(key) {
  await browser.storage.local.set({ [KEY]: key });
}
