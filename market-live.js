/* =========================================================
   HABBOUB — MARKET WATCH LIVE FEEDS
   Core markets only: Gold, Nasdaq 100, S&P 500
   Browser-safe Vercel proxy + 5s refresh
========================================================= */

"use strict";

(function () {
  const REFRESH_MS = 5000;
  const YAHOO_PROXY = "/api/market/";

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

  function setStatus(market, text, state) {
    document.querySelectorAll(`#markets .large-market-card[data-symbol="${market.symbol}"] .market-live-status`).forEach((el) => {
      el.textContent = text;
      el.classList.remove("live", "closed", "error");
      el.classList.add(state);
    });
  }

  function removeUnwantedCards() {
    document.querySelectorAll("#markets .large-market-card").forEach((card) => {
      const symbol = card.dataset.symbol || card.querySelector(".market-symbol")?.textContent?.trim().toUpperCase();
      if (symbol === "EURUSD" || symbol === "BTCUSD") card.remove();
    });
  }

  function ensureStatus(market) {
    const card = document.querySelector(`#markets .large-market-card[data-symbol="${market.symbol}"]`);
    if (!card || card.querySelector(".market-live-status")) return;
    const status = document.createElement("div");
    status.className = "market-live-status error";
    status.textContent = "CONNECTING...";
    card.appendChild(status);
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
    const url = `${YAHOO_PROXY}${encodeURIComponent(market.yahoo)}?range=1d&interval=1m`;
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

    return { price, change, marketState: meta.marketState || "REGULAR" };
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

    const live = ["REGULAR", "PRE", "POST"].includes(String(quote.marketState).toUpperCase());
    setStatus(market, live ? "● LIVE FEED" : "● MARKET CLOSED", live ? "live" : "closed");
  }

  async function refresh() {
    if (busy) return;
    busy = true;
    removeUnwantedCards();
    MARKETS.forEach(ensureStatus);

    try {
      await Promise.all(MARKETS.map(async (market) => {
        try {
          const quote = await fetchQuote(market);
          render(market, quote);
        } catch (error) {
          setStatus(market, "● FEED ERROR", "error");
          console.warn(`Habboub ${market.symbol} feed unavailable:`, error);
        }
      }));
    } finally {
      busy = false;
    }
  }

  function start() {
    removeUnwantedCards();
    MARKETS.forEach(ensureStatus);
    refresh();
    window.setInterval(refresh, REFRESH_MS);

    const observer = new MutationObserver(() => {
      removeUnwantedCards();
      MARKETS.forEach(ensureStatus);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
