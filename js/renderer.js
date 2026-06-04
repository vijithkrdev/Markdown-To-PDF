/**
 * renderer.js
 * Renders markdown into the markdown preview panel
 * and builds paginated PDF page sheets.
 */

/** Render raw markdown into the markdown preview panel */
function renderMarkdownPreview(html) {
  const panel = document.getElementById('md-preview');

  if (!html) {
    panel.innerHTML = emptyState(
      'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8',
      'Markdown preview will appear here'
    );
    return;
  }

  panel.innerHTML = html;
}

/** Build paginated PDF page sheets and inject into #pages-container */
function renderPDFPages(html, settings) {
  const container = document.getElementById('pages-container');

  if (!html) {
    container.innerHTML = singleEmptyPage();
    document.getElementById('pdf-page-count').textContent = '';
    return;
  }

  const { pages, metrics } = paginateHTML(html, settings);
  const { pagePxH, paddingTop, paddingRight, paddingBottom, paddingLeft } = metrics;

  container.innerHTML = '';

  pages.forEach((nodes, i) => {
    const sheet = document.createElement('div');
    sheet.className = 'pdf-page-sheet';
    sheet.style.minHeight = pagePxH + 'px';

    const content = document.createElement('div');
    content.className = 'pdf-content';
    content.style.cssText = [
      `padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
      `font-size: ${settings.fontSize}px`,
    ].join('; ');

    nodes.forEach(n => content.appendChild(n.cloneNode(true)));

    const badge = document.createElement('span');
    badge.className = 'page-badge';
    badge.textContent = i + 1;

    sheet.appendChild(content);
    sheet.appendChild(badge);
    container.appendChild(sheet);
  });

  // Update info labels
  document.getElementById('pdf-info').textContent        = buildInfoLabel(settings);
  document.getElementById('pdf-page-count').textContent  =
    pages.length + (pages.length === 1 ? ' page' : ' pages');
}

// ── Helpers ────────────────────────────────────────────────

function emptyState(pathData, text) {
  return `
    <div class="empty">
      <svg viewBox="0 0 24 24"><path d="${pathData}" /></svg>
      ${text}
    </div>`;
}

function singleEmptyPage() {
  return `
    <div class="pdf-page-sheet">
      <div class="pdf-content">
        <div class="empty empty-dim">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          PDF page preview will appear here
        </div>
      </div>
      <span class="page-badge">1</span>
    </div>`;
}
