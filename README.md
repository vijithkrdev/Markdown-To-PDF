# Markdown → PDF

A clean, offline-capable tool to write markdown and export it as a paginated PDF.

## Project structure

```
markdown-to-pdf/
│
├── index.html              # Entry point
│
├── css/
│   ├── base.css            # Reset, body, shared button & empty-state styles
│   ├── topbar.css          # Top navigation bar
│   ├── workspace.css       # Two-column layout, pane cards, editor, tab toggle
│   ├── preview-md.css      # Markdown rendered preview styles
│   ├── preview-pdf.css     # PDF page simulation styles (mirrors export)
│   └── modal.css           # Export options modal
│
├── js/
│   ├── constants.js        # PAGE_DIMS, SHEET_PX_WIDTH, SAMPLE_MARKDOWN
│   ├── settings.js         # getSettings(), getPageMetrics(), buildInfoLabel()
│   ├── paginator.js        # paginateHTML() — splits content into pages by height
│   ├── renderer.js         # renderMarkdownPreview(), renderPDFPages()
│   ├── exporter.js         # exportToPDF(), applyInlineStyles()
│   ├── ui.js               # openModal(), closeModal(), switchTab(), setStatus(), updateCounts()
│   └── app.js              # Entry point — wires modules, attaches event listeners
│
└── lib/
    ├── marked.min.js            # Markdown parser (local, no CDN)
    └── html2pdf.bundle.min.js   # PDF export (local, no CDN)
```

## Usage

1. Open `index.html` in any browser — no server needed.
2. Paste or type markdown in the **Editor** panel.
3. Use the **Markdown** tab to see the rendered preview.
4. Use the **PDF pages** tab to see real paginated pages — you can see exactly where content breaks.
5. Edit the markdown until pages look right, then click **Download PDF**.
6. In the export modal, choose paper size, orientation, font size, margins, and filename.

## Adding support for new paper sizes

In `js/constants.js`, add an entry to `PAGE_DIMS`:

```js
const PAGE_DIMS = {
  a4:   { w: 210,   h: 297   },
  // Add new size here, dimensions in mm:
  b5:   { w: 176,   h: 250   },
};
```

Then add the `<option>` to the `#opt-format` select in `index.html`.

## Dependencies

Both are bundled locally in `lib/` — no internet required.

| Library | Version | Purpose |
|---------|---------|---------|
| marked  | 9.1.6   | Markdown → HTML parsing |
| html2pdf.js | 0.10.1 | HTML → PDF export via html2canvas + jsPDF |
