/* =========================================================
   HABBOUB — MARKET WATCH LIVE FEEDS
   Core markets only: Gold, Nasdaq 100, S&P 500
========================================================= */

"use strict";

(function () {
  const REFRESH_MS = 5000;
  const YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart/";

  const MARKETS = [
    { symbol: "XAUUSD", yahoo: "XAUUSD=X", priceId: "goldPrice", changeId: "goldChange", heroPriceId: "heroGold", heroChangeId: "heroGoldChange", decimals: 2 },
    { symbol: "NAS100", yahoo: "^NDX", priceId: "nasdaqPrice", changeId: "nasdaqChange", heroPriceId: "heroNasdaq", heroChangeId: "heroNasdaqChange", decimals: 2 },
    { symbol: "SPX", yahoo: "^GSPC", priceId: "spxPrice", changeId: "spxChange", heroPriceId: "heroSPX", heroChangeId: "heroSPXChange", decimals: 2 }
  ];

  let busy = false;

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function removeUnwantedCards() {
    document.querySelectorAll("#markets .large-market-card").forEach((card) => {
      const symbol = card.dataset.symbol || card.querySelector(".market-symbol")?.textContent?.trim().toUpperCase();
      if (symbol === "EURUSD" || symbol === "BTCUSD") card.remove();
    });
  }

  function ensureLiveStyles() {
    if (document.getElementById("habboub-market-live-styles")) return;

    const style = document.createElement("style");
    style.id = "habboub-market-live-styles";
    style.textContent = `
      .market-live-status {
        display:inline-flex;
        align-items:center;
        gap:7px;
        width:max-content;
        margin-top:16px;
        padding:6px 10px;
        border:1px solid rgba(53,255,180,.25);
        border-radius:999px;
        background:rgba(53,255,180,.07);
        color:#65f5bc;
        font-size:10px;
        font-weight:800;
        letter-spacing:.11em;
        text-transform:uppercase;
      }
      .market-live-status .market-live-dot {
        width:7px;
        height:7px;
        border-radius:50%;
        background:currentColor;
        box-shadow:0 0 10px currentColor;
        animation:habboubLivePulse 1.2s ease-in-out infinite;
      }
      .market-live-status.closed {
        color:#9aa5b1;
        border-color:rgba(154,165,177,.2);
        background:rgba(154,165,177,.06);
      }
      .market-live-status.closed .market-live-dot { animation:none; box-shadow:none; }
      .market-live-status.error {
        color:#ffb45e;
        border-color:rgba(255,180,94,.22);
        background:rgba(255,180,94,.06);
      }
      @keyframes habboubLivePulse {
        0%,100% { opacity:.45; transform:scale(.85); }
        50% { opacity:1; transform:scale(1); }
      }
      @media (max-width:700px) {
        .market-live-status { margin-top:12px; }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureStatus(card) {
    if (!card) return null;
    let status = card.querySelector(".market-live-status");
    if (!status) {
      status = document.createElement("div");
      status.className = "market-live-status";
      status.innerHTML = '<span class="market-live-dot"></span><span class="market-live-label">LIVE FEED</span>';
      const priceRow = card.querySelector(".price-row");
      if (priceRow) priceRow.insertAdjacentElement("afterend", status);
      else card.appendChild(status);
    }
    return status;
  }

  function setStatus(market, state, error = false) {
    const card = document.querySelector(`#markets .large-market-card[data-symbol="${market.symbol}"]`);
    const status = ensureStatus(card);
    if (!status) return;

    const label = status.querySelector(".market-live-label");
    status.classList.toggle("closed", state === "CLOSED");
    status.classList.toggle("error", error);

    if (label) {
      label.textContent = error
        ? "FEED ERROR"
        : state === "CLOSED"
          ? "MARKET CLOSED"
          : "LIVE FEED";
    }
  }

  function formatPrice(value, decimals) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function formatChange(value) {
    if (!Number.isFinite(value)) return "--";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  }

  async function fetchQuote(market) {
    const url = `${YAHOO_BASE}${encodeURIComponent(market.yahoo)}?range=1d&interval=1m&_=${Date.now()}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`${market.symbol} HTTP ${response.status}`);

    const payload = await response.json();
    const meta = payload?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error(`${market.symbol} returned no quote data`);

    const price = Number(meta.regularMarketPrice ?? meta.previousClose);
    const previous = Number(meta.chartPreviousClose ?? meta.previousClose);
    if (!Number.isFinite(price)) throw new Error(`${market.symbol} returned invalid price`);

    const change = Number.isFinite(previous) && previous !== 0
      ? ((price - previous) / previous) * 100
      : NaN;

    return {
      price,
      change,
      marketState: String(meta.marketState || "").toUpperCase()
    };
  }

  function render(market, quote) {
    const price = formatPrice(quote.price, market.decimals);
    const change = formatChange(quote.change);

    setText(market.priceId, price);
    setText(market.changeId, change);
    setText(market.heroPriceId, price);
    setText(market.heroChangeId, change);

    [market.changeId, market.heroChangeId].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle("positive", quote.change > 0);
      el.classList.toggle("negative", quote.change < 0);
    });

    setStatus(market, quote.marketState);
  }

  async function refresh() {
    if (busy) return;
    busy = true;
    removeUnwantedCards();

    try {
      await Promise.all(MARKETS.map(async (market) => {
        try {
          const quote = await fetchQuote(market);
          render(market, quote);
        } catch (error) {
          setStatus(market, "", true);
          console.warn(`Habboub ${market.symbol} feed unavailable:`, error);
        }
      }));
    } finally {
      busy = false;
    }
  }

  function start() {
    ensureLiveStyles();
    removeUnwantedCards();
    MARKETS.forEach((market) => {
      const card = document.querySelector(`#markets .large-market-card[data-symbol="${market.symbol}"]`);
      ensureStatus(card);
    });

    refresh();
    window.setInterval(refresh, REFRESH_MS);

    const observer = new MutationObserver(() => {
      removeUnwantedCards();
      MARKETS.forEach((market) => {
        const card = document.querySelector(`#markets .large-market-card[data-symbol="${market.symbol}"]`);
        ensureStatus(card);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
