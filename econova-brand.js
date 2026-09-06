/* ECONOVA — visible brand only. Internal Habboub identifiers remain unchanged. */
(() => {
  "use strict";
  const BRAND = "ECONOVA";
  const TAG = "AI ECONOMIC INTELLIGENCE";
  function apply(root = document) {
    const replaceText = (node) => {
      if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue) return;
      if (/HABBOUB/i.test(node.nodeValue)) node.nodeValue = node.nodeValue.replace(/HABBOUB/gi, BRAND);
    };
    const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceText);
    document.title = `${BRAND} — Economic Intelligence`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `${BRAND} — AI Economic Intelligence`);
    document.querySelectorAll(".brand-mark").forEach((el) => { el.textContent = "E"; el.classList.add("econova-mark"); });
    document.querySelectorAll(".brand small").forEach((el) => { if (/TRADING INTELLIGENCE/i.test(el.textContent)) el.textContent = TAG; });
    const loader = document.querySelector(".loader-logo"); if (loader) loader.textContent = "E";
    const loaderText = document.querySelector(".loader-text"); if (loaderText) loaderText.textContent = BRAND;
  }
  const start = () => apply();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true }); else start();
  new MutationObserver(() => apply()).observe(document.documentElement, { childList: true, subtree: true });
})();
