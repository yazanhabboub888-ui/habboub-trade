/* =========================================================
   HABBOUB — MARKET PRICE SOURCE TOGGLE
   Switch Market Watch between CFD-style quotes and Futures.
========================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "habboub_market_source";
  const DEFAULT_SOURCE = "cfd";

  function getSource() {
    return localStorage.getItem(STORAGE_KEY) === "futures" ? "futures" : DEFAULT_SOURCE;
  }

  function setSource(source) {
    const value = source === "futures" ? "futures" : "cfd";
    localStorage.setItem(STORAGE_KEY, value);
    document.documentElement.dataset.marketSource = value;
    document.dispatchEvent(new CustomEvent("habboub:market-source-change", { detail: { source: value } }));
    updateButtons(value);
  }

  function updateButtons(source) {
    document.querySelectorAll("[data-market-source]").forEach((button) => {
      const active = button.dataset.marketSource === source;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function mount() {
    const heading = document.querySelector("#markets .section-heading");
    if (!heading || heading.querySelector(".market-source-switch")) return;

    const wrap = document.createElement("div");
    wrap.className = "market-source-switch";
    wrap.innerHTML = `
      <div class="market-source-label" data-market-source-label>PRICE SOURCE</div>
      <div class="market-source-buttons" role="group" aria-label="Market price source">
        <button type="button" class="market-source-btn" data-market-source="cfd" aria-pressed="false">CFD</button>
        <button type="button" class="market-source-btn" data-market-source="futures" aria-pressed="false">FUTURES</button>
      </div>
    `;

    heading.appendChild(wrap);

    wrap.addEventListener("click", (event) => {
      const button = event.target.closest("[data-market-source]");
      if (!button) return;
      setSource(button.dataset.marketSource);
    });

    const source = getSource();
    document.documentElement.dataset.marketSource = source;
    updateButtons(source);
  }

  document.addEventListener("DOMContentLoaded", mount, { once: true });
  if (document.readyState !== "loading") mount();

  new MutationObserver(mount).observe(document.body, { childList: true, subtree: true });

  window.HabboubMarketSource = {
    getSource,
    setSource
  };
})();
