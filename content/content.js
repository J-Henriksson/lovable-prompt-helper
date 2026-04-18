const INJECTED_ATTR = 'data-lph-injected';
let observer = null;
let lastUrl = location.href;
let debounceTimer = null;

function findPromptInput() {
  // 1. Walk up from the stable send button ID
  const sendBtn = document.querySelector('#chatinput-send-message-button');
  if (sendBtn) {
    let el = sendBtn.parentElement;
    while (el && el !== document.body) {
      const found = el.querySelector('[contenteditable="true"]');
      if (found) return found;
      el = el.parentElement;
    }
  }
  // 2. role=textbox fallback
  const textbox = document.querySelector('[role="textbox"][contenteditable="true"]');
  if (textbox) return textbox;
  // 3. Sibling of the placeholder span
  const placeholder = document.querySelector('span.pointer-events-none');
  return placeholder?.closest('div')?.querySelector('[contenteditable]') ?? null;
}

function findButtonRow() {
  return document.querySelector('[data-testid="create-form-plus-menu-trigger"]')?.parentElement ?? null;
}

function injectEnhanceButton() {
  if (document.querySelector(`[${INJECTED_ATTR}]`)) return;

  const input = findPromptInput();
  const buttonRow = findButtonRow();
  if (!input || !buttonRow) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'lph-enhance-btn';
  btn.setAttribute(INJECTED_ATTR, 'true');
  btn.setAttribute('aria-label', 'Enhance prompt with AI');
  btn.textContent = 'Enhance';
  btn.addEventListener('click', () => openPanel(input));

  const plusBtn = buttonRow.querySelector('[data-testid="create-form-plus-menu-trigger"]');
  if (plusBtn?.nextSibling) {
    buttonRow.insertBefore(btn, plusBtn.nextSibling);
  } else {
    buttonRow.appendChild(btn);
  }
}

function tryInject() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(injectEnhanceButton, 200);
}

function setupObserver() {
  observer?.disconnect();
  observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      document.querySelector(`[${INJECTED_ATTR}]`)?.remove();
    }
    if (!document.querySelector(`[${INJECTED_ATTR}]`)) {
      tryInject();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

tryInject();
setupObserver();
