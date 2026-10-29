const form = document.querySelector('#decoder-form');
const input = document.querySelector('#error-input');
const cards = [...document.querySelectorAll('.result-card')];
const status = document.querySelector('#decode-status');
const noResults = document.querySelector('#no-results');

function decode() {
  const query = input.value.trim().toUpperCase();
  if (!query) {
    cards.forEach((card) => { card.hidden = false; });
    noResults.hidden = true;
    status.textContent = 'Choose a code below or paste an ADB result.';
    return;
  }

  const code = query.match(/INSTALL_FAILED_[A-Z0-9_]+/)?.[0];
  let matches = 0;
  cards.forEach((card) => {
    const knownCode = card.dataset.code;
    const exact = code ? code === knownCode : false;
    const keywords = `${knownCode} ${card.dataset.keywords} ${card.querySelector('h3').textContent}`.toUpperCase();
    const match = code ? exact : keywords.includes(query);
    card.hidden = !match;
    if (match) matches += 1;
  });
  noResults.hidden = matches !== 0;
  status.textContent = matches === 1 ? 'One matching result found below.' : matches > 1 ? `${matches} matching results found below.` : 'No listed code matched. Use the general checks below.';
  document.querySelector('#results').scrollIntoView({ block: 'start' });
}

form.addEventListener('submit', (event) => { event.preventDefault(); decode(); });
document.querySelector('#clear-input').addEventListener('click', () => {
  input.value = '';
  decode();
  input.focus();
});
document.querySelector('#copy-checklist').addEventListener('click', async () => {
  const lines = ['Exact ADB error:', 'Android version and device model:', 'APK source, version, and file name:', 'Installed package and version:', 'Play Protect warning (exact text):'];
  try {
    await navigator.clipboard.writeText(lines.join('\n'));
    document.querySelector('#copy-status').textContent = 'Checklist copied.';
  } catch {
    document.querySelector('#copy-status').textContent = 'Copy unavailable here; select the checklist text instead.';
  }
});
