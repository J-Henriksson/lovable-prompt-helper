document.getElementById('open-settings').addEventListener('click', () => browser.runtime.openOptionsPage());
document.getElementById('open-lovable').addEventListener('click', () => {
  browser.tabs.create({ url: 'https://lovable.dev' });
  window.close();
});
