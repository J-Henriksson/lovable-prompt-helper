const ideaEl = document.getElementById('idea');
const enhanceBtn = document.getElementById('enhance');
const outputArea = document.getElementById('output-area');
const resultEl = document.getElementById('result');
const copyBtn = document.getElementById('copy');
const copyStatus = document.getElementById('copy-status');
const errorEl = document.getElementById('error');
const settingsBtn = document.getElementById('open-settings');

settingsBtn.addEventListener('click', () => {
  browser.runtime.openOptionsPage();
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
    resultEl.value = response.result;
    outputArea.hidden = false;
    copyStatus.textContent = '';
  }
});

copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultEl.value);
  copyStatus.textContent = 'Copied!';
  setTimeout(() => { copyStatus.textContent = ''; }, 2000);
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
  errorEl.textContent = '';
}
