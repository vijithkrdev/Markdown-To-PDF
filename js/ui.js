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

// ── Word/line/char counts ────────────────────────────────────

function updateCounts(md) {
  const words = md.trim() ? md.trim().split(/\s+/).filter(Boolean).length : 0;
  const lines = md ? md.split('\n').length : 0;
  const chars = md.length;

  document.getElementById('wc').textContent = words + ' words';
  document.getElementById('lc').textContent = lines + ' lines';
  document.getElementById('cc').textContent = chars + ' chars';
}
