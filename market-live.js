/* =========================================================
   HABBOUB — MARKET WATCH LIVE FEEDS
   CFD / Futures selector
   Robust live polling through the Vercel market proxy
========================================================= */

"use strict";

(function () {
  const REFRESH_MS = 5000;
  const SOURCE_KEY = "habboub_market_source";
  const SESSION_MARKET_KEY = "habboub_trading_session_symbol";
  const DEFAULT_SOURCE = "cfd";
  const VERCEL_API_ORIGIN = "https://habboub-trade-ten.vercel.app";

  const SOURCES = {
    cfd: {
      label: "CFD",
      XAUUSD: "XAUUSD=X",
      NAS100: "USTEC",
      SPX: "US500_X100"
    },
    futures: {
      label: "FUTURES",
      XAUUSD: "GC=F",
      NAS100: "NQ=F",
      SPX: "ES=F"
    }
  };

  const MARKETS = [
    { symbol: "XAUUSD", priceId: "goldPrice", changeId: "goldChange", heroPriceId: "heroGold", heroChangeId: "heroGoldChange", decimals: 2 },
    { symbol: "NAS100", priceId: "nasdaqPrice", changeId: "nasdaqChange", heroPriceId: "heroNasdaq", heroChangeId: "heroNasdaqChange", decimals: 2 },
    { symbol: "SPX", priceId: "spxPrice", changeId: "spxChange", heroPriceId: "heroSPX", heroChangeId: "heroSPXChange", decimals: 2 }
  ];

  let busy = false;
  let observerQueued = false;

  function getSource() {
    return localStorage.getItem(SOURCE_KEY) === "futures" ? "futures" : DEFAULT_SOURCE;
  }

  function currentSymbol(market) {
    return SOURCES[getSource()][market.symbol];
  }

  function getQuoteUrl(symbol) {
    const encoded = encodeURIComponent(symbol);
    const sameOrigin = `${location.origin}/api/market-quote?symbol=${encoded}`;
    const isStaticHost = /(^|\.)github\.io$/i.test(location.hostname) || location.protocol === "file:";
    return isStaticHost
      ? `${VERCEL_API_ORIGIN}/api/market-quote?symbol=${encoded}`
      : sameOrigin;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setStatus(market, text, state) {
    document.querySelectorAll(`#markets .large-market-card[data-symbol="${market.symbol}"] .market-live-status`).forEach((el) => {
      el.textContent = text;
      el.className = `market-live-status ${state}`;
    });
  }

  function removeUnwantedCards() {
    document.querySelectorAll("#markets .large-market-card").forEach((card) => {
      const symbol = card.dataset.symbol || card.querySelector(".market-symbol")?.textContent?.trim().toUpperCase();
      if (symbol === "EURUSD" || symbol === "BTCUSD") card.remove();
    });
  }

  function removeMarketWatchBadges() {
    document.querySelectorAll("#markets .large-market-card .market-icon").forEach((icon) => icon.remove());
  }

  function bindSessionRouting() {
    if (window.__habboubMarketSessionRoutingBound) return;
    window.__habboubMarketSessionRoutingBound = true;

    document.addEventListener("click", (event) => {
      const button = event.target.closest("#markets .large-market-card[data-symbol] .market-open-btn");
      if (!button) return;
      const card = button.closest(".large-market-card");
      const symbol = String(card?.dataset?.symbol || "").toUpperCase();
      if (!MARKETS.some((market) => market.symbol === symbol)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      localStorage.setItem(SESSION_MARKET_KEY, symbol);

      if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
      else {
        const dashboard = document.getElementById("dashboard");
        document.querySelectorAll(".page-section").forEach((section) => section.classList.remove("active-section"));
        dashboard?.classList.add("active-section");
      }

      window.dispatchEvent(new CustomEvent("habboub:trading-session-open", { detail: { symbol, source: getSource() } }));
    }, true);
  }

  function ensureStatus(market) {
    const card = document.querySelector(`#markets .large-market-card[data-symbol="${market.symbol}"]`);
    if (!card || card.querySelector(".market-live-status")) return;
    const status = document.createElement("div");
    status.className = "market-live-status connecting";
    status.textContent = "CONNECTING...";
    card.appendChild(status);
  }

  function ensureSourceStyles() {
    if (document.getElementById("habboubMarketSourceStyles")) return;
    const style = document.createElement("style");
    style.id = "habboubMarketSourceStyles";
    style.textContent = `
      #markets .market-source-switch{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end;margin-top:8px}
      #markets .market-source-label{font-size:10px;font-weight:800;letter-spacing:.08em;color:#7f8a98}
      #markets .market-source-buttons{display:flex;align-items:center;gap:4px;padding:3px;border:1px solid rgba(255,255,255,.09);border-radius:12px;background:rgba(255,255,255,.025)}
      #markets .market-source-btn{border:0;border-radius:9px;padding:7px 11px;background:transparent;color:#7f8a98;font:800 10px/1 Inter,sans-serif;letter-spacing:.04em;cursor:pointer;transition:.18s ease;direction:ltr;unicode-bidi:isolate}
      #markets .market-source-btn:hover{color:#fff;background:rgba(255,255,255,.05)}
      #markets .market-source-btn.active{color:#080b12;background:#36d9ff;box-shadow:0 0 18px rgba(54,217,255,.15)}
      html[lang="ar"] #markets .market-source-switch{direction:rtl}
      @media(max-width:700px){#markets .market-source-switch{justify-content:flex-start;margin-top:12px}#markets .market-source-btn{padding:7px 10px}}
    `;
    document.head.appendChild(style);
  }

  function updateSourceButtons(source) {
    document.querySelectorAll("#markets [data-market-source]").forEach((button) => {
      const active = button.dataset.marketSource === source;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function ensureSourceSwitch() {
    const heading = document.querySelector("#markets .section-heading");
    if (!heading || heading.querySelector(".market-source-switch")) return;
    ensureSourceStyles();
    const wrap = document.createElement("div");
    wrap.className = "market-source-switch";
    wrap.innerHTML = `<div class="market-source-label">PRICE SOURCE</div><div class="market-source-buttons" role="group" aria-label="Market price source"><button type="button" class="market-source-btn" data-market-source="cfd" aria-pressed="false">CFD</button><button type="button" class="market-source-btn" data-market-source="futures" aria-pressed="false">FUTURES</button></div>`;
    heading.appendChild(wrap);
    wrap.addEventListener("click", (event) => {
      const button = event.target.closest("[data-market-source]");
      if (!button) return;
      const source = button.dataset.marketSource === "futures" ? "futures" : "cfd";
      localStorage.setItem(SOURCE_KEY, source);
      updateSourceButtons(source);
      refresh(true);
    });
    updateSourceButtons(getSource());
  }

  function formatPrice(value, decimals) {
    return Number(value).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  function formatChange(value) {
    if (!Number.isFinite(value)) return "--";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  }

  async function fetchQuote(market) {
    const symbol = currentSymbol(market);
    const url = `${getQuoteUrl(symbol)}&t=${Date.now()}`;
    const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
    const raw = await response.text();

    if (!response.ok) throw new Error(`${market.symbol} HTTP ${response.status}: ${raw.slice(0, 180)}`);

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      throw new Error(`${market.symbol} returned invalid JSON`);
    }

    const meta = payload?.chart?.result?.[0]?.meta;
    if (!meta) throw new Error(`${market.symbol} returned no quote data`);

    const price = Number(meta.regularMarketPrice ?? meta.previousClose);
    const previous = Number(meta.chartPreviousClose ?? meta.previousClose);
    if (!Number.isFinite(price)) throw new Error(`${market.symbol} returned invalid price`);

    const change = Number.isFinite(previous) && previous !== 0 ? ((price - previous) / previous) * 100 : NaN;
    const age = Number(meta.quoteAgeSeconds);
    return { price, change, marketState: String(meta.marketState || "CLOSED").toUpperCase(), quoteAgeSeconds: Number.isFinite(age) ? age : null };
  }

  function render(market, quote) {
    setText(market.priceId, formatPrice(quote.price, market.decimals));
    setText(market.changeId, formatChange(quote.change));
    setText(market.heroPriceId, formatPrice(quote.price, market.decimals));
    setText(market.heroChangeId, formatChange(quote.change));

    [market.changeId, market.heroChangeId].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle("positive", quote.change > 0);
      el.classList.toggle("negative", quote.change < 0);
    });

    const live = ["REGULAR", "PRE", "POST"].includes(quote.marketState);
    const label = SOURCES[getSource()].label;
    if (live) setStatus(market, `● LIVE ${label}`, "live");
    else setStatus(market, `● MARKET CLOSED · ${label}`, "closed");
  }

  async function refresh(force = false) {
    if (busy && !force) return;
    busy = true;
    removeUnwantedCards();
    removeMarketWatchBadges();
    ensureSourceSwitch();
    bindSessionRouting();
    MARKETS.forEach(ensureStatus);
    const sourceAtStart = getSource();

    await Promise.all(MARKETS.map(async (market) => {
      try {
        render(market, await fetchQuote(market));
      } catch (error) {
        setStatus(market, `● ${SOURCES[sourceAtStart].label} FEED ERROR`, "error");
        console.warn(`Habboub ${market.symbol} ${sourceAtStart} feed unavailable:`, error);
      }
    }));
    busy = false;
  }

  function scheduleStructureCheck() {
    if (observerQueued) return;
    observerQueued = true;
    requestAnimationFrame(() => {
      observerQueued = false;
      removeUnwantedCards();
      removeMarketWatchBadges();
      ensureSourceSwitch();
      MARKETS.forEach(ensureStatus);
      updateSourceButtons(getSource());
    });
  }

  function start() {
    removeUnwantedCards();
    removeMarketWatchBadges();
    ensureSourceSwitch();
    bindSessionRouting();
    MARKETS.forEach(ensureStatus);
    refresh();

    window.setInterval(() => {
      const active = document.getElementById("home")?.classList.contains("active-section") || document.getElementById("markets")?.classList.contains("active-section");
      if (!document.hidden && active) refresh();
    }, REFRESH_MS);

    const marketsRoot = document.getElementById("markets");
    if (marketsRoot) {
      const observer = new MutationObserver(scheduleStructureCheck);
      observer.observe(marketsRoot, { childList: true, subtree: true });
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        const active = document.getElementById("home")?.classList.contains("active-section") || document.getElementById("markets")?.classList.contains("active-section");
        if (active) refresh(true);
      }
    }, { passive: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
