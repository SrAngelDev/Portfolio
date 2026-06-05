/**
 * SplitText utilities (no GSAP plugin required).
 * Splits an element into <span>s by character, word, or line.
 * Each piece is wrapped in a mask span so GSAP can clip the reveal.
 *
 *   <h1>Hola mundo</h1>
 *   splitWords(h1)  ⇒
 *   <h1>
 *     <span class="split-word-mask"><span class="split-word">Hola</span></span>
 *     <span class="split-word-mask"><span class="split-word">mundo</span></span>
 *   </h1>
 */

function preserveWhitespace(text: string): string {
  return text.replace(/ /g, "\u00A0");
}

export function splitChars(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "chars") return getPieces(el, ".split-char");
  const text = el.textContent ?? "";
  el.textContent = "";
  el.dataset.split = "chars";

  const pieces: HTMLElement[] = [];
  // Split by word first to keep wrapping at word boundaries
  const words = text.split(/(\s+)/);
  for (const word of words) {
    if (/^\s+$/.test(word)) {
      el.appendChild(document.createTextNode(word));
      continue;
    }
    const wordWrap = document.createElement("span");
    wordWrap.className = "split-word";
    wordWrap.style.whiteSpace = "nowrap";
    for (const ch of Array.from(word)) {
      const mask = document.createElement("span");
      mask.className = "split-char-mask";
      const inner = document.createElement("span");
      inner.className = "split-char";
      inner.textContent = ch;
      mask.appendChild(inner);
      wordWrap.appendChild(mask);
      pieces.push(inner);
    }
    el.appendChild(wordWrap);
  }
  return pieces;
}

export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "words") return getPieces(el, ".split-word");
  const text = el.textContent ?? "";
  el.textContent = "";
  el.dataset.split = "words";

  const pieces: HTMLElement[] = [];
  const tokens = text.split(/(\s+)/);
  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      el.appendChild(document.createTextNode(preserveWhitespace(token)));
      continue;
    }
    if (!token) continue;
    const mask = document.createElement("span");
    mask.className = "split-word-mask";
    const inner = document.createElement("span");
    inner.className = "split-word";
    inner.textContent = token;
    mask.appendChild(inner);
    el.appendChild(mask);
    pieces.push(inner);
  }
  return pieces;
}

/**
 * Line split: detects visual line breaks using getClientRects()
 * on a temporary char-split, then reassembles characters per line.
 */
export function splitLines(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "lines") return getPieces(el, ".split-line");

  // First, split into words wrapped in spans
  const words = splitWords(el);
  if (words.length === 0) return [];

  // Group words by their top offset (visual line)
  const lines: HTMLElement[][] = [];
  let currentTop = -Infinity;
  let currentLine: HTMLElement[] = [];
  for (const word of words) {
    const rect = word.getBoundingClientRect();
    if (Math.abs(rect.top - currentTop) > 4) {
      if (currentLine.length) lines.push(currentLine);
      currentLine = [word];
      currentTop = rect.top;
    } else {
      currentLine.push(word);
    }
  }
  if (currentLine.length) lines.push(currentLine);

  // Rebuild: each line wrapped in its own mask
  el.textContent = "";
  el.dataset.split = "lines";
  const pieces: HTMLElement[] = [];
  lines.forEach((lineWords, i) => {
    const mask = document.createElement("span");
    mask.className = "split-line-mask";
    mask.style.display = "block";
    const inner = document.createElement("span");
    inner.className = "split-line";
    inner.style.display = "block";
    lineWords.forEach((w, wi) => {
      inner.appendChild(w.parentElement!); // re-attach the original word-mask
      if (wi < lineWords.length - 1)
        inner.appendChild(document.createTextNode("\u00A0"));
    });
    mask.appendChild(inner);
    el.appendChild(mask);
    pieces.push(inner);
    if (i < lines.length - 1) el.appendChild(document.createTextNode(""));
  });
  return pieces;
}

function getPieces(el: HTMLElement, selector: string): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(selector));
}
