/**
 * app.js
 * Entry point. Wires all modules together and attaches event listeners.
 */

/* Configure marked */
marked.setOptions({ breaks: true, gfm: true });

/* ── App state ─────────────────────────────────────────── */
let currentHTML = '';

/* ── Core render pipeline ──────────────────────────────── */

function renderAll() {
  const md = document.getElementById('md-input').value;
  updateCounts(md);

  if (!md.trim()) {
    currentHTML = '';
    renderMarkdownPreview('');
    renderPDFPages('', getSettings());
    setStatus('Ready');
    return;
  }

  // Split on standalone <<< lines before parsing so marked.js never sees
  // the page-break marker — avoids it being wrapped inside a <p> tag.
  currentHTML = md
    .split(/^<<<$/m)
    .map(section => marked.parse(section))
    .join('<div class="page-break"></div>');
  renderMarkdownPreview(currentHTML);
  renderPDFPages(currentHTML, getSettings());

  const words = md.trim().split(/\s+/).filter(Boolean).length;
  setStatus(words + ' words · preview ready');
}

/** Re-paginate with current settings (called when modal options change) */
function refreshPDFPages() {
  if (currentHTML) {
    renderPDFPages(currentHTML, getSettings());
  }
}

/* ── Event listeners ───────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // Editor input
  document.getElementById('md-input').addEventListener('input', renderAll);

  // Toolbar buttons
  document.getElementById('btn-sample').addEventListener('click', loadSample);
  document.getElementById('btn-clear').addEventListener('click', clearAll);
  document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);
  document.getElementById('btn-download').addEventListener('click', () => {
    if (!currentHTML) { setStatus('Paste markdown first'); return; }
    openModal();
  });

  // Tab toggle
  document.getElementById('tab-md').addEventListener('click',  () => switchTab('md'));
  document.getElementById('tab-pdf').addEventListener('click', () => switchTab('pdf'));

  // Modal buttons
  document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);
  document.getElementById('btn-modal-export').addEventListener('click', handleExport);
  document.getElementById('modal').addEventListener('click', closeOnBackdrop);

  // Live re-pagination when any export option changes
  ['opt-format', 'opt-orient', 'opt-fontsize',
   'mg-top', 'mg-right', 'mg-bottom', 'mg-left'].forEach(id => {
    document.getElementById(id).addEventListener('change', refreshPDFPages);
  });

});

/* ── Actions ───────────────────────────────────────────── */

function loadSample() {
  document.getElementById('md-input').value = SAMPLE_MARKDOWN;
  renderAll();
}

function clearAll() {
  document.getElementById('md-input').value = '';
  renderAll();
}

function handleExport() {
  const settings = getSettings();
  closeModal();
  setStatus('Generating PDF…');

  exportToPDF(currentHTML, settings)
    .then(() => setStatus('✓ Downloaded ' + settings.filename))
    .catch(() => setStatus('Export failed — try again'));
}
