/**
 * ui.js
 * DOM interaction helpers — modal, tabs, status tag.
 */

// ── Modal ────────────────────────────────────────────────────

function openModal() {
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

function closeOnBackdrop(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

// ── Tabs ─────────────────────────────────────────────────────

function switchTab(tab) {
  const isMD = tab === 'md';
  document.getElementById('md-preview').classList.toggle('visible', isMD);
  document.getElementById('pdf-preview-panel').classList.toggle('visible', !isMD);
  document.getElementById('tab-md').classList.toggle('active', isMD);
  document.getElementById('tab-pdf').classList.toggle('active', !isMD);
}

// ── Status tag ───────────────────────────────────────────────

function setStatus(text) {
  document.getElementById('status').textContent = text;
}

// ── Fullscreen preview ───────────────────────────────────────

function toggleFullscreen() {
  const pane  = document.getElementById('preview-pane');
  const btn   = document.getElementById('btn-fullscreen');
  const isFs  = pane.classList.toggle('fullscreen');

  btn.innerHTML = isFs
    ? `<svg viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>`
    : `<svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
  btn.title = isFs ? 'Exit fullscreen (Esc)' : 'Fullscreen preview';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const pane = document.getElementById('preview-pane');
    if (pane && pane.classList.contains('fullscreen')) toggleFullscreen();
  }
});

// ── Word/line/char counts ────────────────────────────────────

function updateCounts(md) {
  const words = md.trim() ? md.trim().split(/\s+/).filter(Boolean).length : 0;
  const lines = md ? md.split('\n').length : 0;
  const chars = md.length;

  document.getElementById('wc').textContent = words + ' words';
  document.getElementById('lc').textContent = lines + ' lines';
  document.getElementById('cc').textContent = chars + ' chars';
}
