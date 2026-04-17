const ideaEl = document.getElementById('idea');
const enhanceBtn = document.getElementById('enhance');
const outputArea = document.getElementById('output-area');
const resultEl = document.getElementById('result');
const copyBtn = document.getElementById('copy');
const copyText = document.getElementById('copy-text');
const copyStatus = document.getElementById('copy-status');
const errorEl = document.getElementById('error');
const settingsBtn = document.getElementById('open-settings');

settingsBtn.addEventListener('click', () => browser.runtime.openOptionsPage());

// Auto-grow textarea
ideaEl.addEventListener('input', () => {
  ideaEl.style.height = 'auto';
  ideaEl.style.height = ideaEl.scrollHeight + 'px';
});

enhanceBtn.addEventListener('click', async () => {
  const idea = ideaEl.value.trim();
  if (!idea) return;

  setLoading(true);
  hideError();
  outputArea.hidden = true;

  const response = await browser.runtime.sendMessage({ type: 'enhance', idea });

  setLoading(false);

  if (response.error) {
    showError(response.error);
  } else {
    resultEl.textContent = response.result;
    outputArea.hidden = false;
  }
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultEl.textContent);
  copyText.textContent = '✓ Copied';
  setTimeout(() => { copyText.textContent = 'Copy'; }, 2000);
});

function setLoading(on) {
  enhanceBtn.disabled = on;
  enhanceBtn.textContent = on ? 'Enhancing…' : '✨ Enhance';
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}

function hideError() {
  errorEl.hidden = true;
}
