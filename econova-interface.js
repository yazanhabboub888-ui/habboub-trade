/* ECONOVA — visible terminology + visitor experience polish */
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

  function addVisitorRail() {
    const home = document.getElementById("home");
    if (!home || home.querySelector(".econova-home-rail")) return;
    const marketGrid = home.querySelector(".market-grid.compact");
    if (!marketGrid) return;

    const rail = document.createElement("div");
    rail.className = "econova-home-rail";
    rail.innerHTML = `
      <div class="rail-item">
        <span class="rail-icon">◎</span>
        <div><strong>Market Structure</strong><small>Price action &amp; structural context</small></div>
      </div>
      <div class="rail-item">
        <span class="rail-icon">◈</span>
        <div><strong>Institutional Positioning</strong><small>Positioning context from market data</small></div>
      </div>
      <div class="rail-item">
        <span class="rail-icon">⚡</span>
        <div><strong>Economic Events</strong><small>Macro releases &amp; market impact</small></div>
      </div>
      <div class="rail-item">
        <span class="rail-icon">✦</span>
        <div><strong>AI Intelligence</strong><small>One clear market-condition view</small></div>
      </div>`;
    marketGrid.insertAdjacentElement("afterend", rail);
  }

  function init() {
    clean();
    addVisitorRail();
    const observer = new MutationObserver(() => {
      clean();
      addVisitorRail();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
