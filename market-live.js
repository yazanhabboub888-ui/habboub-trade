/* =========================================================
   HABBOUB — MARKET WATCH LIVE FEEDS
   EURUSD reference FX + BTCUSD live market data
========================================================= */

"use strict";

(function () {
  const REFRESH_BTC_MS = 15000;
  const REFRESH_EUR_MS = 60000;

  function getMarketCard(symbol) {
    return Array.from(document.querySelectorAll(".large-market-card")).find((card) => {
      const label = card.querySelector(".market-symbol");
      return label && label.textContent.trim().toUpperCase() === symbol;
    });
  }

  function ensureCardElements(card) {
    if (!card) return null;
    const price = card.querySelector(".price-row strong");
    const change = card.querySelector(".price-row span");
    if (!price || !change) return null;
    return { price, change };
  }

  function formatBtc(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  function formatEurUsd(value) {
    return Number(value).toFixed(5);
  }

  function formatPercent(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "--";
    return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
  }

  function setStatus(changeEl, text, positive) {
    changeEl.textContent = text;
    changeEl.dataset.live = "true";
    changeEl.classList.toggle("positive", positive === true);
    changeEl.classList.toggle("negative", positive === false);
  }

  async function loadBitcoin() {
    const card = getMarketCard("BTCUSD");
    const els = ensureCardElements(card);
    if (!els) return;

    try {
      const response = await fetch(
        "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT",
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error(`BTC feed HTTP ${response.status}`);

      const data = await response.json();
      const price = Number(data.lastPrice);
      const change = Number(data.priceChangePercent);

      if (!Number.isFinite(price)) throw new Error("Invalid BTC price");

      els.price.textContent = formatBtc(price);
      setStatus(
        els.change,
        `${formatPercent(change)} · 24h`,
        change > 0 ? true : change < 0 ? false : null
      );
    } catch (error) {
      console.warn("Habboub BTC feed unavailable:", error);
      if (els.price.textContent === "--") {
        els.change.textContent = "Live feed unavailable";
      }
    }
  }

  async function loadEurUsd() {
    const card = getMarketCard("EURUSD");
    const els = ensureCardElements(card);
    if (!els) return;

    try {
      const response = await fetch(
        "https://api.frankfurter.app/latest?from=EUR&to=USD",
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error(`EURUSD feed HTTP ${response.status}`);

      const data = await response.json();
      const price = Number(data?.rates?.USD);

      if (!Number.isFinite(price)) throw new Error("Invalid EURUSD price");

      els.price.textContent = formatEurUsd(price);
      els.change.textContent = `FX reference · ${data.date || "latest"}`;
      els.change.classList.remove("positive", "negative");
    } catch (error) {
      console.warn("Habboub EURUSD feed unavailable:", error);
      if (els.price.textContent === "--") {
        els.change.textContent = "FX feed unavailable";
      }
    }
  }

  function start() {
    loadBitcoin();
    loadEurUsd();

    window.setInterval(loadBitcoin, REFRESH_BTC_MS);
    window.setInterval(loadEurUsd, REFRESH_EUR_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
