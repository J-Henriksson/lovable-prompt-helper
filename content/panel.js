let panelEl = null;
let targetInput = null;

function openPanel(inputEl) {
  if (panelEl) closePanel();
  targetInput = inputEl;

  const currentText = inputEl.textContent?.trim() ?? '';

  panelEl = document.createElement('div');
  panelEl.className = 'lph-panel';
  panelEl.innerHTML = `
    <div class="lph-header">
      <span class="lph-title">Lovable Prompt Helper</span>
      <button class="lph-close" aria-label="Close">&#x2715;</button>
    </div>
    <div class="lph-body">
      <textarea class="lph-idea" placeholder="What would you like to build…" rows="3"></textarea>
      <button class="lph-btn-enhance" type="button">Get Prompt</button>
      <div class="lph-loading" hidden><div class="lph-loading-bar"></div></div>
      <div class="lph-result-wrap" hidden>
        <div class="lph-result-label">Refined prompt</div>
        <div class="lph-result"></div>
        <div class="lph-actions">
          <button class="lph-btn-accept" type="button">Accept</button>
          <button class="lph-btn-cancel" type="button">Cancel</button>
        </div>
      </div>
      <p class="lph-error" hidden></p>
    </div>
  `;

  document.body.appendChild(panelEl);

  const ideaEl     = panelEl.querySelector('.lph-idea');
  const enhanceBtn = panelEl.querySelector('.lph-btn-enhance');
  const resultWrap = panelEl.querySelector('.lph-result-wrap');
  const resultEl   = panelEl.querySelector('.lph-result');
  const errorEl    = panelEl.querySelector('.lph-error');
  const loadingEl  = panelEl.querySelector('.lph-loading');
  const acceptBtn  = panelEl.querySelector('.lph-btn-accept');

  ideaEl.value = currentText;

  panelEl.querySelector('.lph-close').addEventListener('click', closePanel);
  panelEl.querySelector('.lph-btn-cancel').addEventListener('click', closePanel);

  enhanceBtn.addEventListener('click', async () => {
    const idea = ideaEl.value.trim();
    if (!idea) return;

    enhanceBtn.disabled = true;
    enhanceBtn.textContent = 'Generating…';
    resultWrap.hidden = true;
    errorEl.hidden = true;
    loadingEl.hidden = false;

    const response = await browser.runtime.sendMessage({ type: 'enhance', idea });

    loadingEl.hidden = true;
    enhanceBtn.disabled = false;
    enhanceBtn.textContent = 'Get Prompt';

    if (response.error) {
      errorEl.textContent = response.error;
      errorEl.hidden = false;
    } else {
      resultEl.textContent = response.result;
      resultWrap.hidden = false;
    }
  });

  acceptBtn.addEventListener('click', () => {
    writeToEditor(targetInput, resultEl.textContent);
    closePanel();
  });

  ideaEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enhanceBtn.click();
    }
  });

  ideaEl.focus();
  ideaEl.setSelectionRange(ideaEl.value.length, ideaEl.value.length);
}

function closePanel() {
  panelEl?.remove();
  panelEl = null;
  targetInput = null;
}

function writeToEditor(el, text) {
  el.focus();
  document.execCommand('selectAll');
  document.execCommand('insertText', false, text);
}
