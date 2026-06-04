/**
 * settings.js
 * Reads and writes export settings from the modal form fields.
 */

function getSettings() {
  return {
    format:   document.getElementById('opt-format').value,
    orient:   document.getElementById('opt-orient').value,
    fontSize: parseInt(document.getElementById('opt-fontsize').value, 10),
    quality:  parseFloat(document.getElementById('opt-quality').value),
    mgTop:    parseInt(document.getElementById('mg-top').value,    10) || 14,
    mgRight:  parseInt(document.getElementById('mg-right').value,  10) || 14,
    mgBottom: parseInt(document.getElementById('mg-bottom').value, 10) || 14,
    mgLeft:   parseInt(document.getElementById('mg-left').value,   10) || 14,
    filename: (document.getElementById('opt-filename').value.trim() || 'document') + '.pdf',
  };
}

/**
 * Given settings, return pixel measurements for the preview sheet.
 * Everything is scaled relative to SHEET_PX_WIDTH.
 */
function getPageMetrics(settings) {
  const dims = PAGE_DIMS[settings.format] || PAGE_DIMS['a4'];
  let wMM = dims.w;
  let hMM = dims.h;

  if (settings.orient === 'landscape') {
    [wMM, hMM] = [hMM, wMM];
  }

  const mmToPx      = SHEET_PX_WIDTH / wMM;
  const pagePxH     = Math.round(hMM * mmToPx);
  const paddingTop  = Math.round(settings.mgTop    * mmToPx);
  const paddingRight  = Math.round(settings.mgRight  * mmToPx);
  const paddingBottom = Math.round(settings.mgBottom * mmToPx);
  const paddingLeft   = Math.round(settings.mgLeft   * mmToPx);
  const contentH    = pagePxH - paddingTop - paddingBottom;

  return { pagePxH, contentH, paddingTop, paddingRight, paddingBottom, paddingLeft };
}

/**
 * Build the label string shown above the PDF preview pages.
 */
function buildInfoLabel(settings) {
  const fmt    = settings.format.toUpperCase();
  const orient = settings.orient.charAt(0).toUpperCase() + settings.orient.slice(1);
  return `${fmt} · ${orient} · ${settings.mgTop}/${settings.mgRight}/${settings.mgBottom}/${settings.mgLeft}mm`;
}
