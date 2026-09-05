(() => {
  "use strict";

  const MARKETS = {
    XAUUSD: {
      name: "Gold",
      icon: "Au",
      drivers: ["DXY", "US10Y", "Gold COT", "USD News"]
    },
    NAS100: {
      name: "Nasdaq 100",
      icon: "NQ",
      drivers: ["US10Y", "VIX", "NQ Futures", "US Tech News"]
    },
    SPX: {
      name: "S&P 500",
      icon: "SP",
      drivers: ["US10Y", "VIX", "ES Futures", "US Macro News"]
    }
  };

  const STORAGE_KEY = "habboub_trading_session_symbol";
  let selected = localStorage.getItem(STORAGE_KEY) || "XAUUSD";
  if (!MARKETS[selected]) selected = "XAUUSD";

  const q = (id) => document.getElementById(id);

  function labels() {
    return document.documentElement.lang === "ar"
      ? {
          market: "السوق",
          live: "السوق المختار",
          waiting: "بانتظار تحليل هذا السوق",
          drivers: "عوامل السوق"
        }
      : {
          market: "MARKET",
          live: "SELECTED MARKET",
          waiting: "Waiting for this market's analysis",
          drivers: "MARKET DRIVERS"
        };
  }

  function injectStyles() {
    if (q("habboubTradingSessionMarketStyles")) return;
    const style = document.createElement("style");
    style.id = "habboubTradingSessionMarketStyles";
    style.textContent = `
      #dashboard .habboub-session-marketbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 18px;padding:12px 14px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.025);}
      #dashboard .habboub-session-market-info{display:flex;align-items:center;gap:10px;min-width:0;}
      #dashboard .habboub-session-market-dot{width:8px;height:8px;border-radius:50%;background:#29d391;box-shadow:0 0 12px rgba(41,211,145,.45);flex:0 0 auto;}
      #dashboard .habboub-session-market-copy{min-width:0;}
      #dashboard .habboub-session-market-copy small{display:block;color:#7f8a98;font-size:9px;font-weight:800;letter-spacing:.08em;}
      #dashboard .habboub-session-market-copy strong{display:block;margin-top:2px;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      #dashboard .habboub-session-market-switch{display:flex;align-items:center;gap:4px;padding:3px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(0,0,0,.18);flex:0 0 auto;}
      #dashboard .habboub-session-market-switch button{border:0;background:transparent;color:#7f8a98;padding:7px 10px;border-radius:7px;font:800 10px/1 Inter,sans-serif;letter-spacing:.04em;cursor:pointer;transition:.18s ease;}
      #dashboard .habboub-session-market-switch button:hover{color:#fff;background:rgba(255,255,255,.05);}
      #dashboard .habboub-session-market-switch button.active{color:#061017;background:#36d9ff;box-shadow:0 4px 14px rgba(54,217,255,.18);}
      #dashboard .habboub-session-market-drivers{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:-8px 0 18px;}
      #dashboard .habboub-session-market-driver-label{font-size:9px;font-weight:800;letter-spacing:.07em;color:#657180;margin-right:2px;}
      #dashboard .habboub-session-market-driver{font-size:9px;font-weight:800;color:#9ba6b3;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);border-radius:999px;padding:5px 8px;}
      #dashboard[data-active-symbol="XAUUSD"] .habboub-session-market-driver{border-color:rgba(246,193,75,.14);}
      #dashboard[data-active-symbol="NAS100"] .habboub-session-market-driver{border-color:rgba(54,217,255,.14);}
      #dashboard[data-active-symbol="SPX"] .habboub-session-market-driver{border-color:rgba(161,122,255,.14);}
      @media(max-width:600px){#dashboard .habboub-session-marketbar{align-items:stretch;flex-direction:column;}#dashboard .habboub-session-market-switch{width:100%;}#dashboard .habboub-session-market-switch button{flex:1;}}
    `;
    document.head.appendChild(style);
  }

  function injectUI() {
    const dashboard = q("dashboard");
    if (!dashboard || q("habboubSessionMarketBar")) return;

    const heading = dashboard.querySelector(".section-heading");
    if (!heading) return;

    const bar = document.createElement("div");
    bar.id = "habboubSessionMarketBar";
    bar.className = "habboub-session-marketbar";
    bar.innerHTML = `
      <div class="habboub-session-market-info">
        <span class="habboub-session-market-dot"></span>
        <div class="habboub-session-market-copy">
          <small id="habboubSessionMarketLabel"></small>
          <strong id="habboubSessionMarketName">XAUUSD · Gold</strong>
        </div>
      </div>
      <div class="habboub-session-market-switch" role="tablist" aria-label="Trading session market">
        <button type="button" data-session-market="XAUUSD">XAUUSD</button>
        <button type="button" data-session-market="NAS100">NAS100</button>
        <button type="button" data-session-market="SPX">SPX</button>
      </div>
    `;

    heading.insertAdjacentElement("afterend", bar);

    const drivers = document.createElement("div");
    drivers.id = "habboubSessionMarketDrivers";
    drivers.className = "habboub-session-market-drivers";
    bar.insertAdjacentElement("afterend", drivers);

    bar.querySelectorAll("[data-session-market]").forEach((button) => {
      button.addEventListener("click", () => selectMarket(button.dataset.sessionMarket));
    });
  }

  function setText(id, value) {
    const el = q(id);
    if (el) el.textContent = value;
  }

  function selectMarket(symbol) {
    if (!MARKETS[symbol]) return;
    selected = symbol;
    localStorage.setItem(STORAGE_KEY, selected);
    renderMarketShell();
    loadMarketSpecificAnalysis();
  }

  function renderMarketShell() {
    const market = MARKETS[selected];
    const text = labels();
    const dashboard = q("dashboard");
    if (!market || !dashboard) return;

    dashboard.dataset.activeSymbol = selected;
    setText("habboubSessionMarketLabel", text.live);
    setText("habboubSessionMarketName", `${selected} · ${market.name}`);

    document.querySelectorAll("[data-session-market]").forEach((button) => {
      button.classList.toggle("active", button.dataset.sessionMarket === selected);
      button.setAttribute("aria-selected", button.dataset.sessionMarket === selected ? "true" : "false");
    });

    setText("analysisSymbol", selected);
    setText("analysisSymbolLarge", selected);

    const drivers = q("habboubSessionMarketDrivers");
    if (drivers) {
      drivers.innerHTML = `<span class="habboub-session-market-driver-label">${text.drivers}</span>` +
        market.drivers.map((driver) => `<span class="habboub-session-market-driver">${driver}</span>`).join("");
    }
  }

  function clearSymbolSpecificAnalysis() {
    [
      "htfBias", "liquidity", "mss", "fvg", "marketRisk", "marketCondition",
      "sessionBias", "sessionLiquidity", "sessionMSS", "sessionFVG",
      "cotCommercial", "cotManaged", "cotNet", "cotBias",
      "intelBias", "intelLiquidity", "intelMSS", "intelFVG",
      "intelCommercial", "intelManaged", "intelNet", "intelCotBias",
      "regimeTrend", "regimeVolatility", "regimeLiquidity", "riskLevelText",
      "marketConfidence", "analysisConfidenceLarge", "marketAnalysisText", "analysisLongText"
    ].forEach((id) => setText(id, "--"));

    const score = q("sessionScore");
    if (score) score.textContent = "--";
    const scoreBar = q("sessionScoreBar");
    if (scoreBar) scoreBar.style.width = "0%";
    const confidenceBar = q("confidenceBar");
    if (confidenceBar) confidenceBar.style.width = "0%";
    setText("sessionScoreState", labels().waiting);
    setText("analysisStatus", labels().waiting);
    setText("regimeBadge", "WAITING");
    setText("riskLevelText", "--");
  }

  function normalizeSymbol(value) {
    const s = String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (s.includes("XAU")) return "XAUUSD";
    if (s.includes("NAS") || s.includes("NQ")) return "NAS100";
    if (s.includes("SPX") || s.includes("SP500") || s === "ES") return "SPX";
    return s;
  }

  function findSymbol(row) {
    if (!row || typeof row !== "object") return "";
    return normalizeSymbol(row.symbol || row.ticker || row.pair || row.market || row.asset || row.instrument);
  }

  function applyAnalysis(row) {
    if (!row) return;
    const value = (keys, fallback = "--") => {
      for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
      }
      return fallback;
    };

    const score = Number(value(["score", "market_score", "habboub_score"], NaN));
    const confidence = Number(value(["confidence", "market_confidence"], NaN));

    if (Number.isFinite(score)) {
      setText("sessionScore", Math.round(score));
      const bar = q("sessionScoreBar");
      if (bar) bar.style.width = `${Math.max(0, Math.min(100, score))}%`;
      setText("sessionScoreState", score >= 70 ? "FAVORABLE" : score >= 50 ? "NEUTRAL" : "CAUTION");
    }
    if (Number.isFinite(confidence)) {
      setText("marketConfidence", `${Math.round(confidence)}%`);
      setText("analysisConfidenceLarge", `${Math.round(confidence)}%`);
      const bar = q("confidenceBar");
      if (bar) bar.style.width = `${Math.max(0, Math.min(100, confidence))}%`;
    }

    const map = {
      htfBias: ["htf_bias", "bias", "market_bias"],
      liquidity: ["liquidity"],
      mss: ["mss", "market_structure"],
      fvg: ["fvg"],
      marketRisk: ["risk", "market_risk"],
      marketCondition: ["condition", "market_condition", "environment"],
      sessionBias: ["htf_bias", "bias", "market_bias"],
      sessionLiquidity: ["liquidity"],
      sessionMSS: ["mss", "market_structure"],
      sessionFVG: ["fvg"],
      cotCommercial: ["cot_commercial", "commercial"],
      cotManaged: ["cot_managed_money", "managed_money"],
      cotNet: ["cot_net", "net_position"],
      cotBias: ["cot_bias"],
      intelBias: ["htf_bias", "bias", "market_bias"],
      intelLiquidity: ["liquidity"],
      intelMSS: ["mss", "market_structure"],
      intelFVG: ["fvg"],
      intelCommercial: ["cot_commercial", "commercial"],
      intelManaged: ["cot_managed_money", "managed_money"],
      intelNet: ["cot_net", "net_position"],
      intelCotBias: ["cot_bias"],
      regimeTrend: ["trend", "market_trend"],
      regimeVolatility: ["volatility"],
      regimeLiquidity: ["liquidity"],
      riskLevelText: ["risk", "market_risk"],
      marketAnalysisText: ["content", "analysis", "description"],
      analysisLongText: ["content", "analysis", "description"]
    };

    Object.entries(map).forEach(([id, keys]) => setText(id, value(keys)));
    setText("analysisStatus", value(["status", "state"], "LIVE"));
    setText("regimeBadge", value(["regime", "market_regime"], "LIVE"));
  }

  async function loadMarketSpecificAnalysis() {
    clearSymbolSpecificAnalysis();
    if (typeof supabaseClient === "undefined" || !supabaseClient) return;

    try {
      const { data, error } = await supabaseClient
        .from("market_analysis")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.warn("Habboub market session analysis:", error.message);
        return;
      }

      const rows = Array.isArray(data) ? data : [];
      const matching = rows.find((row) => findSymbol(row) === selected);
      if (matching) applyAnalysis(matching);
    } catch (error) {
      console.warn("Habboub market session analysis failed:", error);
    }
  }

  function init() {
    injectStyles();
    injectUI();
    renderMarketShell();
    loadMarketSpecificAnalysis();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
