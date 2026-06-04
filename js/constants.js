/**
 * constants.js
 * Shared constants used across paginator, settings, and app.
 */

// Pixel width of the preview sheet — matches max-width in preview-pdf.css
const SHEET_PX_WIDTH = 600;

// Page dimensions in mm: { w, h } in portrait orientation
const PAGE_DIMS = {
  a4:     { w: 210,   h: 297   },
  a3:     { w: 297,   h: 420   },
  a5:     { w: 148,   h: 210   },
  letter: { w: 215.9, h: 279.4 },
  legal:  { w: 215.9, h: 355.6 },
};

const SAMPLE_MARKDOWN = `# Getting Started with Markdown → PDF

Welcome! This tool converts **Markdown** into a beautifully paginated PDF.

## Features

- Real-time Markdown preview
- Accurate page-break simulation
- Multiple paper sizes: A4, A3, A5, Letter, Legal
- Portrait and landscape orientation
- Adjustable margins and font size

## Text Formatting

You can use **bold**, *italic*, ~~strikethrough~~, and \`inline code\`.

> Blockquotes stand out with a blue accent bar — great for callouts or citations.

## Code Blocks

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Lists

### Unordered
- Apples
- Bananas
- Cherries

### Ordered
1. Plan the document
2. Write the content
3. Export to PDF

## Tables

| Feature        | Status  |
|----------------|---------|
| Live preview   | ✓       |
| PDF export     | ✓       |
| Dark mode      | Planned |

## Horizontal Rule

---

Made with ❤️ using [marked.js](https://marked.js.org) and [html2pdf.js](https://github.com/eKoopmans/html2pdf.js).
`;
