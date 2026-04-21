// Force Firefox to repaint the popup — without this, dark-background popups
// sometimes render transparent on first open due to a Firefox compositor bug.
document.body.style.display = 'none';
void document.body.offsetHeight;
document.body.style.display = '';

document.getElementById('open-settings').addEventListener('click', () => browser.runtime.openOptionsPage());
document.getElementById('open-lovable').addEventListener('click', () => {
  browser.tabs.create({ url: 'https://lovable.dev' });
  window.close();
});
