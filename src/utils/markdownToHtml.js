// Minimal markdown-ish renderer for our content strings.
// Supports: #/##/### headings, paragraphs, bold (**text**), italics (*text*),
// unordered lists (- / *), and horizontal rule (---).
//
// NOTE: Content is authored by us (not user-generated), so we keep this simple.

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const inlineFormat = (str) => {
  // Escape first, then allow our limited formatting.
  let s = escapeHtml(str);
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // simple italics: *text* (avoid matching list markers by requiring non-space after *)
  s = s.replace(/\*(\S.+?\S)\*/g, '<em>$1</em>');
  return s;
};

export function markdownToHtml(markdown) {
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];

  let paragraph = [];
  let listItems = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(`<p>${inlineFormat(paragraph.join(' ').trim())}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    const items = listItems.map((li) => `<li>${inlineFormat(li)}</li>`).join('');
    blocks.push(`<ul>${items}</ul>`);
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    // blank line: end paragraph/list
    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }

    // horizontal rule
    if (trimmed === '---') {
      flushList();
      flushParagraph();
      blocks.push('<hr />');
      continue;
    }

    // headings
    const h3 = trimmed.match(/^###\s+(.*)$/);
    if (h3) {
      flushList();
      flushParagraph();
      blocks.push(`<h3>${inlineFormat(h3[1])}</h3>`);
      continue;
    }
    const h2 = trimmed.match(/^##\s+(.*)$/);
    if (h2) {
      flushList();
      flushParagraph();
      blocks.push(`<h2>${inlineFormat(h2[1])}</h2>`);
      continue;
    }
    const h1 = trimmed.match(/^#\s+(.*)$/);
    if (h1) {
      flushList();
      flushParagraph();
      // In our UI the article title is already rendered, so treat # as section heading.
      blocks.push(`<h2>${inlineFormat(h1[1])}</h2>`);
      continue;
    }

    // unordered list item
    const li = trimmed.match(/^[-*]\s+(.*)$/);
    if (li) {
      flushParagraph();
      listItems.push(li[1]);
      continue;
    }

    // default: paragraph line
    flushList();
    paragraph.push(trimmed);
  }

  flushList();
  flushParagraph();

  return blocks.join('\n');
}


