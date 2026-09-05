/* Habboub News Intelligence v1
 * Enhances the existing economic calendar without replacing the current data flow.
 * No BUY/SELL commands. Upcoming events remain directionally neutral until market data confirms a reaction.
 */
(function () {
  "use strict";

  const ASSETS = [
    { key: "gold", label: "Gold", symbol: "XAUUSD", cls: "gold" },
    { key: "nasdaq", label: "Nasdaq", symbol: "NAS100", cls: "nasdaq" },
    { key: "spx", label: "S&P 500", symbol: "SPX", cls: "spx" },
    { key: "usd", label: "USD", symbol: "DXY", cls: "usd" }
  ];

  const state = { events: [], lastSync: null };

  const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  function ensureStyles() {
    if (document.getElementById("habboubNewsIntelStyles")) return;
    const style = document.createElement("style");
    style.id = "habboubNewsIntelStyles";
    style.textContent = `
      .hni-wrap{margin:0 0 22px;display:grid;gap:14px}
      .hni-command{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:18px 20px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.045),rgba(255,255,255,.018));box-shadow:0 14px 40px rgba(0,0,0,.16)}
      .hni-command h3{margin:0 0 5px;font-size:18px}.hni-command p{margin:0;color:#8c9aaa;font-size:13px}
      .hni-live{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;letter-spacing:.08em;white-space:nowrap}
      .hni-dot{width:8px;height:8px;border-radius:50%;background:#56e39f;box-shadow:0 0 12px rgba(86,227,159,.8)}
      .hni-assets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
      .hni-asset{padding:14px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.025)}
      .hni-asset-top{display:flex;justify-content:space-between;gap:10px}.hni-asset-name{font-weight:800}.hni-asset-symbol{font-size:10px;color:#788596;display:block;margin-top:3px}
      .hni-meter{height:7px;background:rgba(255,255,255,.08);border-radius:99px;margin:12px 0 8px;overflow:hidden}.hni-meter span{display:block;height:100%;border-radius:99px;background:currentColor}
      .hni-score{font-size:24px;font-weight:900}.hni-note{font-size:11px;color:#8793a3;margin-top:4px}
      .hni-event{margin:0 0 10px;padding:14px 15px;border:1px solid rgba(255,255,255,.075);border-radius:15px;background:rgba(255,255,255,.018)}
      .hni-event-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.hni-event-title{font-weight:800}.hni-badges{display:flex;gap:6px;flex-wrap:wrap}.hni-badge{font-size:10px;font-weight:900;padding:4px 7px;border-radius:999px;background:rgba(255,255,255,.07)}
      .hni-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:12px}.hni-cell{padding:9px 10px;border-radius:11px;background:rgba(255,255,255,.035)}.hni-cell small{display:block;color:#788596;font-size:10px;margin-bottom:4px}.hni-cell strong{font-size:13px}
      .hni-up{color:#56e39f}.hni-down{color:#ff7f86}.hni-neutral{color:#aab4c0}.hni-warning{color:#ffc86b}
      .hni-foot{margin-top:10px;color:#6f7b8b;font-size:10px}
      @media(max-width:800px){.hni-assets{grid-template-columns:repeat(2,minmax(0,1fr))}.hni-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hni-command{align-items:flex-start;flex-direction:column}}
      @media(max-width:480px){.hni-assets{grid-template-columns:1fr 1fr}.hni-grid{grid-template-columns:1fr 1fr}.hni-asset{padding:11px}.hni-score{font-size:20px}}
    `;
    document.head.appendChild(style);
  }

  function parseNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(String(value).replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  function impactBase(event) {
    const impact = String(event.impact || "").toLowerCase();
    if (impact === "high") return 90;
    if (impact === "medium") return 60;
    return 32;
  }

  function proximityBoost(eventTime) {
    if (!eventTime) return 0;
    const ms = new Date(eventTime).getTime() - Date.now();
    if (!Number.isFinite(ms)) return 0;
    const mins = Math.abs(ms) / 60000;
    if (mins <= 5) return 10;
    if (mins <= 15) return 8;
    if (mins <= 60) return 5;
    if (mins <= 180) return 2;
    return 0;
  }

  function eventStatus(event) {
    const time = event.event_time ? new Date(event.event_time).getTime() : NaN;
    if (!Number.isFinite(time)) return "scheduled";
    const delta = Date.now() - time;
    if (delta >= 0 && delta <= 30 * 60000) return "reaction";
    if (delta < 0) return "upcoming";
    return "released";
  }

  function surprise(event) {
    const actual = parseNumber(event.actual);
    const forecast = parseNumber(event.forecast);
    if (actual === null || forecast === null) return null;
    const scale = Math.max(Math.abs(forecast), Math.abs(parseNumber(event.previous) || 0), 1);
    return Math.max(-1, Math.min(1, (actual - forecast) / scale));
  }

  function directionFor(event, asset) {
    const s = surprise(event);
    if (s === null) return { text: "PENDING", cls: "hni-neutral", confidence: 0 };
    const name = String(event.event_name || event.title || "").toLowerCase();
    const inflation = /cpi|inflation|pce|ppi/.test(name);
    const jobs = /nfp|payroll|employment|unemployment|jobless|claims|jolts/.test(name);
    const growth = /gdp|retail sales|pmi|ism|industrial production|consumer confidence/.test(name);
    const hawkish = (inflation || jobs || growth) && s > 0;
    const dovish = (inflation || jobs || growth) && s < 0;

    let bullish = 0;
    if (asset === "usd") bullish = s;
    else if (asset === "gold") bullish = inflation ? -s : -s * 0.65;
    else bullish = -s * 0.7;
    if (!inflation && !jobs && !growth) bullish *= 0.45;
    if (hawkish && asset === "usd") bullish = s;
    if (dovish && asset === "usd") bullish = s;

    const confidence = Math.round(Math.min(94, 52 + Math.abs(bullish) * 40));
    if (Math.abs(bullish) < 0.08) return { text: "NEUTRAL", cls: "hni-neutral", confidence: Math.max(50, confidence - 10) };
    return bullish > 0
      ? { text: "BULLISH", cls: "hni-up", confidence }
      : { text: "BEARISH", cls: "hni-down", confidence };
  }

  function assetScore(events, asset) {
    const relevant = events.slice(0, 12);
    let score = 0;
    let weight = 0;
    relevant.forEach(event => {
      const base = impactBase(event) + proximityBoost(event.event_time);
      const s = surprise(event);
      const d = directionFor(event, asset);
      const status = eventStatus(event);
      if (status === "upcoming" || status === "reaction") {
        score += 50 * base / 100;
        weight += base;
      } else if (s !== null) {
        score += (50 + (d.text === "BULLISH" ? d.confidence - 50 : d.text === "BEARISH" ? -(d.confidence - 50) : 0)) * base / 100;
        weight += base;
      }
    });
    return weight ? Math.max(0, Math.min(100, Math.round(score / weight * 100))) : 0;
  }

  function formatCountdown(event) {
    if (!event.event_time) return "No time";
    const ms = new Date(event.event_time).getTime() - Date.now();
    if (!Number.isFinite(ms)) return "Scheduled";
    if (ms <= 0) return eventStatus(event) === "reaction" ? "REACTION WINDOW" : "RELEASED";
    const total = Math.floor(ms / 1000);
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (d) return `IN ${d}D ${h}H`;
    return `IN ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  function buildTop() {
    const cards = ASSETS.map(asset => {
      const score = assetScore(state.events, asset.key);
      const note = score >= 75 ? "High event sensitivity" : score >= 50 ? "Moderate event sensitivity" : "Low event sensitivity";
      return `<div class="hni-asset"><div class="hni-asset-top"><div><span class="hni-asset-name">${asset.label}</span><span class="hni-asset-symbol">${asset.symbol}</span></div><strong class="hni-score">${score}%</strong></div><div class="hni-meter"><span style="width:${score}%"></span></div><div class="hni-note">${note}</div></div>`;
    }).join("");

    return `<div class="hni-wrap" id="habboubNewsIntelligence"><div class="hni-command"><div><h3>Habboub News Intelligence</h3><p>Real-time event pressure across the assets. Direction stays neutral until the release/reaction data supports it.</p></div><div class="hni-live"><span class="hni-dot"></span> LIVE · ${state.events.length} USD events</div></div><div class="hni-assets">${cards}</div></div>`;
  }

  function buildEventCard(event) {
    const status = eventStatus(event);
    const pressure = Math.min(100, impactBase(event) + proximityBoost(event.event_time));
    const statusText = status === "upcoming" ? formatCountdown(event) : status === "reaction" ? "LIVE REACTION" : status === "released" ? "RELEASED" : "SCHEDULED";
    const assets = ["gold", "nasdaq", "spx", "usd"].map(key => {
      const d = directionFor(event, key);
      const label = key === "gold" ? "Gold" : key === "nasdaq" ? "Nasdaq" : key === "spx" ? "S&P" : "USD";
      return `<div class="hni-cell"><small>${label}</small><strong class="${d.cls}">${d.text}${d.confidence ? ` · ${d.confidence}%` : ""}</strong></div>`;
    }).join("");
    return `<div class="hni-event"><div class="hni-event-head"><div><div class="hni-event-title">${esc(event.event_name || event.title || "Economic Event")}</div><div class="hni-foot">${esc(event.currency || "USD")} · ${esc(statusText)}</div></div><div class="hni-badges"><span class="hni-badge">IMPACT ${pressure}%</span><span class="hni-badge">${esc(String(event.impact || "UNKNOWN").toUpperCase())}</span></div></div><div class="hni-grid">${assets}</div><div class="hni-foot">${status === "upcoming" ? "Pre-event: no directional claim is made without a confirmed surprise." : status === "reaction" ? "Reaction window: reassess with live price movement before treating direction as confirmed." : "Directional estimate is derived from actual vs forecast when available; it is not a trade instruction."}</div></div>`;
  }

  async function load() {
    if (!window.supabase || !window.supabase.createClient) return;
    try {
      const client = window.supabase.createClient(
        "https://feoyjasuvrqxzhskqzye.supabase.co",
        "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0"
      );
      const { data, error } = await client.from("news")
        .select("id,title,description,source,url,image_url,category,impact,currency,published_at,created_at,event_name,actual,forecast,previous,event_time,country,unit,time_mode,revised_previous,event_status")
        .eq("category", "economic_calendar")
        .eq("currency", "USD")
        .order("event_time", { ascending: true });
      if (error) throw error;
      state.events = Array.isArray(data) ? data : [];
      state.lastSync = Date.now();
      render();
    } catch (error) {
      console.warn("Habboub News Intelligence sync failed:", error);
    }
  }

  function render() {
    const container = document.getElementById("newsContainer");
    if (!container) return;
    const old = document.getElementById("habboubNewsIntelligence");
    if (old) old.remove();
    container.insertAdjacentHTML("beforebegin", buildTop());

    const events = state.events.slice().sort((a,b) => new Date(a.event_time || 0) - new Date(b.event_time || 0));
    const existing = container.querySelectorAll(".habboub-economic-event");
    existing.forEach((node, index) => {
      const event = events[index];
      if (!event) return;
      const box = document.createElement("div");
      box.innerHTML = buildEventCard(event);
      node.appendChild(box.firstElementChild);
    });
  }

  function start() {
    ensureStyles();
    load();
    setInterval(load, 30000);
    setInterval(() => {
      state.events = state.events;
      const top = document.getElementById("habboubNewsIntelligence");
      if (top && state.events.length) render();
    }, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
