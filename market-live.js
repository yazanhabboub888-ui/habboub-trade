/* =========================================================
   HABBOUB — MARKET WATCH LIVE FEEDS
   CFD / Futures selector
   5s polling through the Vercel server proxy
========================================================= */

"use strict";

(function () {
  const REFRESH_MS = 5000;
  const QUOTE_PROXY = "/api/market-quote?symbol=";
  const SOURCE_KEY = "habboub_market_source";
  const SESSION_MARKET_KEY = "habboub_trading_session_symbol";
  const DEFAULT_SOURCE = "cfd";

  const SOURCES = {
    cfd: {
      label: "CFD",
      XAUUSD: "XAUUSD=X",
      NAS100: "^NDX",
      SPX: "^GSPC"
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
  let refreshTimer = null;

  function getSource() {
    return localStorage.getItem(SOURCE_KEY) === "futures" ? "futures" : DEFAULT_SOURCE;
  }

  function currentYahooSymbol(market) {
    return SOURCES[getSource()][market.symbol];
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

  /*
     Market Watch uses one generic data-nav="dashboard" on all three buttons.
     Own the click at document-capture level so the generic navigation handler
     cannot overwrite the selected market. The clicked card is the source of truth.
  */
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

      if (typeof window.navigateTo === "function") {
        window.navigateTo("dashboard");
      } else {
        const dashboard = document.getElementById("dashboard");
        document.querySelectorAll(".page-section").forEach((section) => section.classList.remove("active-section"));
        dashboard?.classList.add("active-section");
      }

      window.dispatchEvent(new CustomEvent("habboub:trading-session-open", {
        detail: { symbol, source: getSource() }
      }));
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
    wrap.innerHTML = `
      <div class="market-source-label">PRICE SOURCE</div>
      <div class="market-source-buttons" role="group" aria-label="Market price source">
        <button type="button" class="market-source-btn" data-market-source="cfd" aria-pressed="false">CFD</button>
        <button type="button" class="market-source-btn" data-market-source="futures" aria-pressed="false">FUTURES</button>
      </div>
    `;

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
    const yahoo = currentYahooSymbol(market);
    const response = await fetch(`${QUOTE_PROXY}${encodeURIComponent(yahoo)}&t=${Date.now()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" }
    });
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

    return { price, change, marketState: String(meta.marketState || "CLOSED").toUpperCase() };
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

    const liveStates = ["REGULAR", "PRE", "POST"];
    const live = liveStates.includes(quote.marketState);
    setStatus(market, live ? `● LIVE ${SOURCES[getSource()].label}` : "● MARKET CLOSED", live ? "live" : "closed");
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

  function start() {
    removeUnwantedCards();
    removeMarketWatchBadges();
    ensureSourceSwitch();
    bindSessionRouting();
    MARKETS.forEach(ensureStatus);
    refresh();
    refreshTimer = window.setInterval(() => refresh(), REFRESH_MS);

    new MutationObserver(() => {
      removeUnwantedCards();
      removeMarketWatchBadges();
      ensureSourceSwitch();
      bindSessionRouting();
      MARKETS.forEach(ensureStatus);
      updateSourceButtons(getSource());
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();