/**
 * toolbar.js
 * Markdown formatting toolbar — wrapping, block insertion, table picker.
 */

function ta() { return document.getElementById('md-input'); }

// ── Low-level helpers ────────────────────────────────────

function wrapSelection(before, after, placeholder) {
  const el  = ta();
  const s   = el.selectionStart;
  const e   = el.selectionEnd;
  const sel = el.value.slice(s, e);
  const inner = sel || placeholder;
  el.setRangeText(before + inner + after, s, e, 'end');
  el.setSelectionRange(s + before.length, s + before.length + inner.length);
  el.focus();
  renderAll();
}

function getCurrentLine() {
  const el  = ta();
  const pos = el.selectionStart;
  const val = el.value;
  const ls  = val.lastIndexOf('\n', pos - 1) + 1;
  const le  = val.indexOf('\n', pos);
  return { start: ls, end: le === -1 ? val.length : le, text: val.slice(ls, le === -1 ? val.length : le) };
}

// ── Toolbar actions ──────────────────────────────────────

function actionHeading(level) {
  const el   = ta();
  const line = getCurrentLine();
  const stripped = line.text.replace(/^#{1,6}\s/, '');
  const prefix   = '#'.repeat(level) + ' ';
  const same     = line.text.startsWith(prefix) && !/^#{level+1}/.test(line.text);
  const newText  = same ? stripped : prefix + stripped;
  el.setRangeText(newText, line.start, line.end, 'end');
  el.focus();
  renderAll();
}

function actionBold()          { wrapSelection('**', '**', 'bold text'); }
function actionItalic()        { wrapSelection('*',  '*',  'italic text'); }
function actionStrikethrough() { wrapSelection('~~', '~~', 'strikethrough'); }
function actionInlineCode()    { wrapSelection('`',  '`',  'code'); }

function actionCodeBlock() {
  const el  = ta();
  const s   = el.selectionStart;
  const e   = el.selectionEnd;
  const sel = el.value.slice(s, e);
  const val = el.value;
  const gap = s > 0 && val[s - 1] !== '\n' ? '\n\n' : '';
  const inner = sel || 'code here';
  const block = gap + '```\n' + inner + '\n```\n';
  el.setRangeText(block, s, e, 'end');
  const is = s + gap.length + 4;
  el.setSelectionRange(is, is + inner.length);
  el.focus();
  renderAll();
}

function actionBlockquote() {
  const el = ta();
  const s  = el.selectionStart;
  const e  = el.selectionEnd;
  const sel = el.value.slice(s, e);
  if (!sel) {
    const line = getCurrentLine();
    const already = line.text.startsWith('> ');
    el.setRangeText(already ? line.text.slice(2) : '> ' + line.text, line.start, line.end, 'end');
  } else {
    const lines = sel.split('\n').map(l => '> ' + l).join('\n');
    el.setRangeText(lines, s, e, 'end');
  }
  el.focus();
  renderAll();
}

function actionUnorderedList() {
  const el = ta();
  const s  = el.selectionStart;
  const e  = el.selectionEnd;
  const sel = el.value.slice(s, e);
  if (!sel) {
    const line = getCurrentLine();
    const already = /^[-*]\s/.test(line.text);
    el.setRangeText(already ? line.text.replace(/^[-*]\s/, '') : '- ' + line.text, line.start, line.end, 'end');
  } else {
    const lines = sel.split('\n').map(l => '- ' + l.replace(/^([-*]\s|\d+\.\s)/, '')).join('\n');
    el.setRangeText(lines, s, e, 'end');
  }
  el.focus();
  renderAll();
}

function actionOrderedList() {
  const el = ta();
  const s  = el.selectionStart;
  const e  = el.selectionEnd;
  const sel = el.value.slice(s, e);
  if (!sel) {
    const line = getCurrentLine();
    const already = /^\d+\.\s/.test(line.text);
    el.setRangeText(already ? line.text.replace(/^\d+\.\s/, '') : '1. ' + line.text, line.start, line.end, 'end');
  } else {
    let n = 1;
    const lines = sel.split('\n').map(l => `${n++}. ` + l.replace(/^([-*]\s|\d+\.\s)/, '')).join('\n');
    el.setRangeText(lines, s, e, 'end');
  }
  el.focus();
  renderAll();
}

function actionLink() {
  const el  = ta();
  const sel = el.value.slice(el.selectionStart, el.selectionEnd);
  const s   = el.selectionStart;
  if (sel) {
    wrapSelection('[', '](https://)', sel);
  } else {
    el.setRangeText('[link text](https://)', s, s, 'end');
    el.setSelectionRange(s + 1, s + 10);
    el.focus();
    renderAll();
  }
}

function actionHR() {
  const el  = ta();
  const pos = el.selectionStart;
  const val = el.value;
  const gap = pos > 0 && val[pos - 1] !== '\n' ? '\n\n' : '\n';
  el.setRangeText(gap + '---\n\n', pos, el.selectionEnd, 'end');
  el.focus();
  renderAll();
}

function actionPageBreak() {
  const el  = ta();
  const pos = el.selectionStart;
  const val = el.value;
  // Ensure a blank line before <<<  so the split regex always finds it cleanly
  const prev = val.slice(0, pos);
  const prefix = prev.endsWith('\n\n') ? '' : prev.endsWith('\n') ? '\n' : '\n\n';
  el.setRangeText(prefix + '<<<\n\n', pos, el.selectionEnd, 'end');
  el.focus();
  renderAll();
}

// ── Table picker ─────────────────────────────────────────

function buildMarkdownTable(rows, cols) {
  const headers = Array.from({ length: cols }, (_, i) => ` Col ${i + 1} `);
  const header  = '|' + headers.join('|') + '|';
  const sep     = '|' + Array(cols).fill('--------|').join('');
  const cell    = '|' + Array(cols).fill('         |').join('');
  return [header, sep, ...Array(rows - 1).fill(cell)].join('\n');
}

function openTablePicker(anchorBtn) {
  closePicker();
  const MAX    = 6;
  const picker = document.createElement('div');
  picker.id    = 'table-picker';
  picker.className = 'table-picker';

  const label = document.createElement('div');
  label.className = 'table-picker-label';
  label.textContent = 'Insert table';

  const grid = document.createElement('div');
  grid.className = 'table-picker-grid';

  for (let r = 1; r <= MAX; r++) {
    for (let c = 1; c <= MAX; c++) {
      const cell = document.createElement('div');
      cell.className = 'tp-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;

      cell.addEventListener('mouseenter', () => {
        label.textContent = `${r} × ${c} table`;
        grid.querySelectorAll('.tp-cell').forEach(el => {
          el.classList.toggle('active', +el.dataset.r <= r && +el.dataset.c <= c);
        });
      });

      cell.addEventListener('click', ev => {
        ev.stopPropagation();
        insertMarkdownTable(r, c);
        closePicker();
      });

      grid.appendChild(cell);
    }
  }

  picker.appendChild(label);
  picker.appendChild(grid);
  document.body.appendChild(picker);

  const rect = anchorBtn.getBoundingClientRect();
  picker.style.top  = (rect.bottom + 4) + 'px';
  picker.style.left = rect.left + 'px';

  // Close on any click outside
  setTimeout(() => document.addEventListener('click', closePicker, { once: true }), 0);
}

function closePicker() {
  document.getElementById('table-picker')?.remove();
}

function insertMarkdownTable(rows, cols) {
  const el  = ta();
  const pos = el.selectionStart;
  const val = el.value;
  const gap = pos > 0 && val[pos - 1] !== '\n' ? '\n\n' : '\n';
  const tbl = buildMarkdownTable(rows, cols);
  el.setRangeText(gap + tbl + '\n\n', pos, el.selectionEnd, 'end');
  el.focus();
  renderAll();
}

// ── Keyboard shortcuts ────────────────────────────────────

document.addEventListener('keydown', e => {
  const editor = document.getElementById('md-input');
  if (document.activeElement !== editor) return;
  if (!e.ctrlKey && !e.metaKey) return;
  switch (e.key.toLowerCase()) {
    case 'b': e.preventDefault(); actionBold();   break;
    case 'i': e.preventDefault(); actionItalic(); break;
    case 'k': e.preventDefault(); actionLink();   break;
  }
});

// ── Wire toolbar clicks ───────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('editor-toolbar').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    switch (btn.dataset.action) {
      case 'h1':            actionHeading(1);        break;
      case 'h2':            actionHeading(2);        break;
      case 'h3':            actionHeading(3);        break;
      case 'h4':            actionHeading(4);        break;
      case 'bold':          actionBold();            break;
      case 'italic':        actionItalic();          break;
      case 'strikethrough': actionStrikethrough();   break;
      case 'code':          actionInlineCode();      break;
      case 'codeblock':     actionCodeBlock();       break;
      case 'quote':         actionBlockquote();      break;
      case 'ul':            actionUnorderedList();   break;
      case 'ol':            actionOrderedList();     break;
      case 'link':          actionLink();            break;
      case 'hr':        actionHR();        break;
      case 'pagebreak': actionPageBreak(); break;
      case 'table':
        e.stopPropagation();
        openTablePicker(btn);
        break;
    }
  });
});
