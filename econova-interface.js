/* ECONOVA — visible terminology polish */
(() => {
  "use strict";

  const replacements = [
    [/\bHABBOUB\b/g, "ECONOVA"],
    [/\bHabboub\b/g, "Econova"],
    [/\bICT Context\b/gi, "Market Structure"],
    [/\bICT\b/g, "Market Structure"],
    [/\bCOT Positioning\b/gi, "Institutional Positioning"],
    [/\bCOT\b/g, "Institutional Positioning"]
  ];

  function clean(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    for (const textNode of nodes) {
      const parent = textNode.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;
      let value = textNode.nodeValue;
      for (const [pattern, replacement] of replacements) value = value.replace(pattern, replacement);
      if (value !== textNode.nodeValue) textNode.nodeValue = value;
    }
  }

  function init() {
    clean();
    const observer = new MutationObserver(() => clean());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
