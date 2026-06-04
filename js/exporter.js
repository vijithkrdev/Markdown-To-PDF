/**
 * exporter.js
 * Builds a fully inline-styled DOM clone of the content
 * and triggers the html2pdf download.
 */

function exportToPDF(html, settings) {
  const fs  = settings.fontSize;
  const fs2 = Math.round(fs * 0.875); // smaller size for code/tables

  const wrapper = document.createElement('div');
  wrapper.style.cssText = [
    'font-family: Arial, sans-serif',
    `font-size: ${fs}px`,
    'line-height: 1.7',
    'color: #111',
    'background: #fff',
  ].join('; ');

  wrapper.innerHTML = html;

  applyInlineStyles(wrapper, fs, fs2);

  return html2pdf()
    .set({
      margin:      [settings.mgTop, settings.mgRight, settings.mgBottom, settings.mgLeft],
      filename:    settings.filename,
      image:       { type: 'jpeg', quality: settings.quality },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF:       { unit: 'mm', format: settings.format, orientation: settings.orient },
      pagebreak:   { before: '.page-break' },
    })
    .from(wrapper)
    .save();
}

/**
 * Apply all inline styles to the clone so html2canvas
 * captures them correctly (it ignores external stylesheets).
 */
function applyInlineStyles(root, fs, fs2) {
  const s = (el, css) => { el.style.cssText = css; };

  root.querySelectorAll('h1').forEach(el => s(el,
    `font-size:${Math.round(fs * 1.58)}px; font-weight:700; color:#111;
     border-bottom:2px solid #e5e7eb; padding-bottom:6px; margin:0 0 12px;
     page-break-after:avoid;`
  ));
  root.querySelectorAll('h2').forEach(el => s(el,
    `font-size:${Math.round(fs * 1.17)}px; font-weight:700; color:#1a1a1a;
     border-bottom:1px solid #f0f0f0; padding-bottom:4px; margin:18px 0 7px;
     page-break-after:avoid;`
  ));
  root.querySelectorAll('h3').forEach(el => s(el,
    `font-size:${fs}px; font-weight:700; color:#222; margin:14px 0 5px;
     page-break-after:avoid;`
  ));
  root.querySelectorAll('h4').forEach(el => s(el,
    `font-size:${fs}px; font-weight:700; margin:10px 0 4px;
     page-break-after:avoid;`
  ));
  root.querySelectorAll('p').forEach(el => s(el,
    `margin:0 0 8px; font-size:${fs}px; line-height:1.7; color:#111;`
  ));
  root.querySelectorAll('ul, ol').forEach(el => s(el,
    `padding-left:18px; margin:0 0 8px; font-size:${fs}px;`
  ));
  root.querySelectorAll('blockquote').forEach(el => s(el,
    `border-left:4px solid #2563eb; background:#eff6ff; padding:7px 12px;
     margin:9px 0; color:#1e40af; border-radius:0 4px 4px 0;
     page-break-inside:avoid;`
  ));
  root.querySelectorAll('pre').forEach(el => s(el,
    `background:#1e1e2e; color:#cdd6f4; padding:10px 13px; border-radius:5px;
     margin:8px 0; font-size:${fs2}px; white-space:pre-wrap;
     word-break:break-all; page-break-inside:avoid;`
  ));
  root.querySelectorAll('code').forEach(el => {
    if (el.closest('pre')) {
      s(el, 'background:none; border:none; padding:0; color:inherit; font-size:inherit;');
    } else {
      s(el,
        `background:#f3f4f6; border:1px solid #e5e7eb; padding:1px 5px;
         border-radius:3px; color:#dc2626; font-size:${fs2}px;`
      );
    }
  });
  root.querySelectorAll('table').forEach(el => s(el,
    `border-collapse:collapse; width:100%; font-size:${fs2}px;
     margin:8px 0; page-break-inside:avoid;`
  ));
  root.querySelectorAll('th').forEach(el => s(el,
    `background:#1e293b; color:#fff; padding:6px 9px; text-align:left;
     font-weight:700; border:1px solid #334155;`
  ));
  root.querySelectorAll('td').forEach(el => s(el,
    `padding:5px 9px; border:1px solid #e5e7eb; vertical-align:top;`
  ));
  // Zebra rows — re-apply since nth-child doesn't work in html2canvas
  root.querySelectorAll('tbody tr:nth-child(even) td').forEach(el => {
    el.style.background = '#f9fafb';
  });
  root.querySelectorAll('hr').forEach(el => s(el,
    `border:none; border-top:1px solid #e5e7eb; margin:14px 0;`
  ));
  root.querySelectorAll('strong').forEach(el => s(el, 'font-weight:700;'));
  root.querySelectorAll('em').forEach(el => s(el, 'font-style:italic;'));
  root.querySelectorAll('a').forEach(el => s(el,
    'color:#2563eb; text-decoration:underline;'
  ));
  root.querySelectorAll('.page-break').forEach(el => s(el,
    'display:block; height:0; overflow:hidden; page-break-before:always; break-before:page;'
  ));
}
