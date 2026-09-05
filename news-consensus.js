/* Habboub multi-asset news impact bridge. */
(function () {
  "use strict";
  const SUPABASE_URL = "https://feoyjasuvrqxzhskqzye.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0";
  const ASSETS = [
    { key: "XAUUSD", label: "GOLD", match: /gold|xau/i },
    { key: "NAS100", label: "NASDAQ", match: /nasdaq|nas100|nq/i },
    { key: "SPX", label: "S&P 500", match: /s&p|spx|sp500/i },
    { key: "DXY", label: "USD", match: /usd|dxy|dollar/i }
  ];
  let client = null;

  const escapeHtml = (v) => String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");

  function getClient() {
    if (client) return client;
    if (!window.supabase || typeof window.supabase.createClient !== "function") return null;
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return client;
  }

  function ensureStyles() {
    if (document.getElementById("habboubMultiAssetImpactStyles")) return;
    const style = document.createElement("style");
    style.id = "habboubMultiAssetImpactStyles";
    style.textContent = `
      .hni-impact-panel{margin-top:12px;padding:12px;border:1px solid rgba(255,255,255,.08);border-radius:13px;background:rgba(5,10,16,.34)}
      .hni-impact-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
      .hni-impact-title{font-size:10px;font-weight:900;letter-spacing:.11em;color:#aeb9c7}
      .hni-impact-phase{font-size:9px;font-weight:900;letter-spacing:.08em;color:#718094}
      .hni-impact-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
      .hni-impact-asset{padding:9px 8px;border-radius:10px;background:rgba(255,255,255,.035);min-width:0}
      .hni-impact-name{font-size:9px;font-weight:900;color:#7f8c9d;display:block;margin-bottom:4px}
      .hni-impact-dir{font-size:13px;font-weight:950;white-space:nowrap}
      .hni-impact-dir.up{color:#56e39f}.hni-impact-dir.down{color:#ff7f86}.hni-impact-dir.neutral{color:#aab4c0}.hni-impact-dir.pending{color:#7f8c9d}
      .hni-impact-conf{font-size:9px;color:#748194;margin-top:3px}
      .hni-impact-source{font-size:9px;color:#687588;margin-top:8px}
      .hni-consensus-badge.multi{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;padding:10px}
      .hni-consensus-mini{padding:7px 8px;border-radius:9px;background:rgba(255,255,255,.035)}
      .hni-consensus-mini small{display:block;color:#788596;font-size:8px;font-weight:900;letter-spacing:.06em}
      .hni-consensus-mini strong{display:block;font-size:12px;margin-top:3px}
      .hni-consensus-mini.up strong{color:#56e39f}.hni-consensus-mini.down strong{color:#ff7f86}.hni-consensus-mini.neutral strong{color:#aab4c0}
      @media(max-width:700px){.hni-impact-grid,.hni-consensus-badge.multi{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function directionFromEvent(event, asset) {
    const actual = Number(String(event.actual ?? "").replace(/,/g, ""));
    const forecast = Number(String(event.forecast ?? "").replace(/,/g, ""));
    if (!Number.isFinite(actual) || !Number.isFinite(forecast)) return null;
    const surprise = actual - forecast;
    if (Math.abs(surprise) < 0.000001) return { up: 50, down: 50, confidence: 50, source: "No surprise" };
    const name = String(event.event_name || event.title || "").toLowerCase();
    const inflation = /cpi|pce|inflation|ppi/.test(name);
    const jobs = /nfp|payroll|employment|unemployment|jobless|claims|jolts/.test(name);
    const growth = /gdp|retail sales|pmi|ism|industrial production|consumer confidence/.test(name);
    const relevant = inflation || jobs || growth;
    let bullish = 0;
    if (asset === "DXY") bullish = surprise > 0 ? 1 : -1;
    else if (asset === "XAUUSD") bullish = surprise > 0 ? (inflation ? -1 : -0.6) : (inflation ? 1 : 0.6);
    else bullish = surprise > 0 ? -0.7 : 0.7;
    if (!relevant) bullish *= 0.45;
    const magnitude = Math.min(0.46, Math.max(.08, Math.abs(surprise) / Math.max(Math.abs(forecast), Math.abs(Number(event.previous) || 0), 1) * .7));
    const up = Math.round(50 + (bullish > 0 ? magnitude : -magnitude) * 100);
    return { up, down: 100 - up, confidence: Math.round(50 + magnitude * 75), source: "Actual vs forecast" };
  }

  function rowFor(rows, symbol, event) {
    const exact = rows.find(r => r.symbol === symbol && r.news_id === event.id);
    if (exact) return { up: Math.round(Number(exact.up_probability)), down: Math.round(Number(exact.down_probability)), confidence: Math.round(Number(exact.confidence)), source: exact.model_version || "consensus" };
    return directionFromEvent(event, symbol);
  }

  function eventNameMatch(card, name) {
    return name && card.textContent && card.textContent.toLowerCase().includes(String(name).toLowerCase());
  }

  function renderImpact(eventCard, event, rows) {
    if (eventCard.querySelector(".hni-impact-panel")) return;
    const values = ASSETS.map(asset => ({ asset, value: rowFor(rows, asset.key, event) }));
    const cells = values.map(({ asset, value }) => {
      if (!value) return `<div class="hni-impact-asset"><span class="hni-impact-name">${asset.label}</span><div class="hni-impact-dir pending">PENDING</div><div class="hni-impact-conf">Awaiting release</div></div>`;
      const dir = value.up > value.down ? "up" : value.down > value.up ? "down" : "neutral";
      const arrow = dir === "up" ? "↑" : dir === "down" ? "↓" : "→";
      const side = dir === "up" ? value.up : dir === "down" ? value.down : 50;
      return `<div class="hni-impact-asset"><span class="hni-impact-name">${asset.label}</span><div class="hni-impact-dir ${dir}">${arrow} ${side}%</div><div class="hni-impact-conf">Confidence ${value.confidence}%</div></div>`;
    }).join("");
    const panel = document.createElement("div");
    panel.className = "hni-impact-panel";
    panel.innerHTML = `<div class="hni-impact-head"><span class="hni-impact-title">NEWS IMPACT · ALL MARKETS</span><span class="hni-impact-phase">${escapeHtml(String(event.phase || "PRE-EVENT").toUpperCase())}</span></div><div class="hni-impact-grid">${cells}</div><div class="hni-impact-source">Direction is event-specific. Probability data takes priority when available; otherwise the UI uses the existing event surprise baseline.</div>`;
    eventCard.appendChild(panel);
  }

  async function loadConsensus() {
    const db = getClient();
    if (!db) return;
    ensureStyles();
    const now = new Date().toISOString();
    const { data: rows } = await db.from("news_probability")
      .select("news_id,symbol,event_name,event_time,up_probability,down_probability,confidence,phase,model_version,updated_at")
      .gte("event_time", now)
      .order("event_time", { ascending: true })
      .limit(60);

    const root = document.getElementById("habboubNewsIntelligence");
    if (!root) return;
    const probabilityRows = rows || [];
    const eventCards = [...root.querySelectorAll(".hni-event")];

    eventCards.forEach(card => {
      const event = stateEventFromCard(card);
      if (!event) return;
      const matchingRows = probabilityRows.filter(r => event.id && r.news_id === event.id);
      renderImpact(card, event, matchingRows);
    });

    const upcoming = probabilityRows.find(r => r.symbol === "XAUUSD" && Number(r.up_probability) !== 50) || probabilityRows.find(r => r.symbol === "XAUUSD");
    const fallbackEvent = upcoming ? eventCards.find(card => eventNameMatch(card, upcoming.event_name)) : null;

    root.classList.add("hni-live-consensus");
    const command = root.querySelector(".hni-command");
    if (command) {
      const p = command.querySelector("p");
      if (p) p.textContent = "Every economic event now shows its directional impact across Gold, Nasdaq, S&P 500 and USD.";
      const live = command.querySelector(".hni-live");
      if (live) live.innerHTML = '<span class="hni-dot"></span> LIVE MULTI-ASSET IMPACT';
    }

    let badge = document.getElementById("habboubConsensusBadge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "habboubConsensusBadge";
      badge.className = "hni-consensus-badge multi";
      root.appendChild(badge);
    }
    const sourceEvent = fallbackEvent ? stateEventFromCard(fallbackEvent) : null;
    const minis = ASSETS.map(asset => {
      const value = upcoming && upcoming.symbol === asset.key ? { up: Math.round(Number(upcoming.up_probability)), down: Math.round(Number(upcoming.down_probability)), confidence: Math.round(Number(upcoming.confidence)) } : sourceEvent ? directionFromEvent(sourceEvent, asset.key) : null;
      if (!value) return `<div class="hni-consensus-mini neutral"><small>${asset.label}</small><strong>--</strong></div>`;
      const up = value.up >= value.down;
      return `<div class="hni-consensus-mini ${up ? "up" : "down"}"><small>${asset.label}</small><strong>${up ? "↑" : "↓"} ${up ? value.up : value.down}%</strong></div>`;
    }).join("");
    badge.innerHTML = `${minis}<small style="grid-column:1/-1;color:#687588">${escapeHtml(upcoming?.event_name || "Next economic event")}</small>`;
  }

  function stateEventFromCard(card) {
    const title = card.querySelector(".hni-event-title")?.textContent?.trim();
    if (!title) return null;
    const foot = [...card.querySelectorAll(".hni-foot")].map(x => x.textContent).join(" ");
    return { title, event_name: title, currency: "USD", id: null, actual: null, forecast: null, previous: null, phase: foot.includes("LIVE") ? "LIVE" : "PRE" };
  }

  function boot() {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      const ready = document.getElementById("habboubNewsIntelligence");
      if (ready && getClient()) {
        clearInterval(timer);
        loadConsensus();
        setInterval(loadConsensus, 60 * 1000);
      } else if (attempts > 30) clearInterval(timer);
    }, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();