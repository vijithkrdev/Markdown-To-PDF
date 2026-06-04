/**
 * paginator.js
 * Splits an HTML string into pages by measuring real rendered heights.
 * Returns an array of arrays of DOM nodes, one array per page.
 */

function paginateHTML(html, settings) {
  const metrics = getPageMetrics(settings);
  const { contentH, paddingTop, paddingRight, paddingBottom, paddingLeft } = metrics;

  // Off-screen measurer — same font/size as the final PDF content
  const measurer = document.createElement('div');
  measurer.style.cssText = [
    'position: fixed',
    'left: -9999px',
    'top: 0',
    `width: ${SHEET_PX_WIDTH - paddingLeft - paddingRight}px`,
    `font-family: Arial, sans-serif`,
    `font-size: ${settings.fontSize}px`,
    'line-height: 1.7',
    'visibility: hidden',
    'pointer-events: none',
  ].join('; ');

  measurer.innerHTML = html;
  document.body.appendChild(measurer);

  const children = Array.from(measurer.childNodes).filter(
    n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
  );

  const pages         = [];
  let currentNodes    = [];
  let currentHeight   = 0;

  children.forEach(node => {
    // Probe the node height inside the measurer
    const probe = document.createElement('div');
    probe.appendChild(node.cloneNode(true));
    measurer.appendChild(probe);
    const h = probe.getBoundingClientRect().height || 0;
    measurer.removeChild(probe);

    if (currentHeight + h > contentH && currentNodes.length > 0) {
      // Start a new page
      pages.push(currentNodes);
      currentNodes  = [node.cloneNode(true)];
      currentHeight = h;
    } else {
      currentNodes.push(node.cloneNode(true));
      currentHeight += h;
    }
  });

  if (currentNodes.length > 0) {
    pages.push(currentNodes);
  }

  document.body.removeChild(measurer);
  return { pages, metrics };
}
