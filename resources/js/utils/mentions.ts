// resources/js/utils/mentions.ts
// Helper untuk linkify mentions di HTML string (memproses text nodes saja)
export default function linkifyMentions(html: string) {
  if (!html) return "";

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // walk only text nodes so we don't break existing tags
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text);
    }

    const mentionRegex = /@([a-zA-Z0-9_]+)/g;

    textNodes.forEach((textNode) => {
      const text = textNode.nodeValue || "";
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      const frag = doc.createDocumentFragment();
      mentionRegex.lastIndex = 0;

      while ((match = mentionRegex.exec(text)) !== null) {
        const idx = match.index;
        const handle = match[1];

        if (idx > lastIndex) {
          frag.appendChild(doc.createTextNode(text.slice(lastIndex, idx)));
        }

        const a = doc.createElement("a");
        // arahkan ke user profile (sesuaikan route kalau perlu)
        a.setAttribute("href", `/users/${encodeURIComponent(handle)}`);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
        a.className = "mention text-primary font-medium hover:underline";
        a.textContent = `@${handle}`;

        frag.appendChild(a);
        lastIndex = idx + match[0].length;
      }

      if (lastIndex < text.length) {
        frag.appendChild(doc.createTextNode(text.slice(lastIndex)));
      }

      if (frag.childNodes.length > 0) {
        textNode.parentNode?.replaceChild(frag, textNode);
      }
    });

    return doc.body.innerHTML;
  } catch (err) {
    // fallback kalau DOMParser gagal
    return html;
  }
}
