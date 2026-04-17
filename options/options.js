import { getApiKey, setApiKey } from '../lib/storage.js';

const input = document.getElementById('api-key');
const saveBtn = document.getElementById('save');
const toggleBtn = document.getElementById('toggle-visibility');
const status = document.getElementById('status');

getApiKey().then(key => {
  if (key) input.value = key;
});

toggleBtn.addEventListener('click', () => {
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  toggleBtn.textContent = isHidden ? 'Hide' : 'Show';
});

saveBtn.addEventListener('click', async () => {
  const key = input.value.trim();
  if (!key) {
    showStatus('Enter a key before saving.', 'error');
    return;
  }
  await setApiKey(key);
  showStatus('Saved ✓', 'success');
});

function showStatus(msg, type) {
  status.textContent = msg;
  status.className = type;
  setTimeout(() => {
    status.textContent = '';
    status.className = '';
  }, 3000);
}
