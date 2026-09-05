/* Habboub News Intelligence — live economic-event intelligence.
 * Uses public news + news_probability data only.
 * No synthetic directional percentage is shown when the AI/consensus model has no result.
 */
(function () {
  "use strict";

  const SUPABASE_URL = "https://feoyjasuvrqxzhskqzye.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0";
  const ASSETS = [
    { key: "XAUUSD", label: "Gold", symbol: "XAUUSD" },
    { key: "NAS100", label: "Nasdaq", symbol: "NAS100" },
    { key: "SPX", label: "S&P 500", symbol: "SPX" },
    { key: "DXY", label: "USD", symbol: "DXY" }
  ];

  let client = null;
  let events = [];
  let probabilities = [];
  let lastSync = 0;
  let refreshBusy = false;

  const esc = (v) => String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  function getClient() {
    if (client) return client;
    if (!window.supabase?.createClient) return null;
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return client;
  }

  function ensureStyles() {
    if (document.getElementById("habboubNewsIntelStyles")) return;
    const style = document.createElement("style");
    style.id = "habboubNewsIntelStyles";
    style.textContent = `
      .hni-wrap{margin:0 0 22px;display:grid;gap:14px}
      .hni-command{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:18px 20px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.045),rgba(255,255,255,.018));box-shadow:0 14px 40px rgba(0,0,0,.16)}
      .hni-command h3{margin:0 0 5px;font-size:18px}.hni-command p{margin:0;color:#8c9aaa;font-size:13px}
      .hni-live{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;letter-spacing:.08em;white-space:nowrap}.hni-dot{width:8px;height:8px;border-radius:50%;background:#56e39f;box-shadow:0 0 12px rgba(86,227,159,.8)}
      .hni-assets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.hni-asset{padding:14px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.025)}
      .hni-asset-top{display:flex;justify-content:space-between;gap:10px}.hni-asset-name{font-weight:800}.hni-asset-symbol{font-size:10px;color:#788596;display:block;margin-top:3px}.hni-score{font-size:24px;font-weight:900}.hni-meter{height:7px;background:rgba(255,255,255,.08);border-radius:99px;margin:12px 0 8px;overflow:hidden}.hni-meter span{display:block;height:100%;border-radius:99px;background:currentColor}.hni-note{font-size:11px;color:#8793a3;margin-top:4px}
      .hni-event{margin:10px 0 0;padding:14px 15px;border:1px solid rgba(255,255,255,.075);border-radius:15px;background:rgba(255,255,255,.018)}.hni-event-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.hni-event-title{font-weight:800}.hni-badges{display:flex;gap:6px;flex-wrap:wrap}.hni-badge,.hni-severity-label{font-size:10px;font-weight:900;padding:4px 8px;border-radius:999px}.hni-badge{background:rgba(255,255,255,.07)}
      .hni-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:12px}.hni-cell{padding:10px;border-radius:11px;background:rgba(255,255,255,.035)}.hni-cell small{display:block;color:#788596;font-size:10px;margin-bottom:4px}.hni-cell strong{font-size:13px}.hni-up{color:#56e39f}.hni-down{color:#ff7f86}.hni-neutral{color:#aab4c0}.hni-pending{color:#ffc86b}
      .hni-foot{margin-top:10px;color:#6f7b8b;font-size:10px;line-height:1.5}.hni-severity-high{border-color:rgba(255,70,82,.58)!important;box-shadow:0 0 0 1px rgba(255,70,82,.08),0 12px 30px rgba(255,70,82,.10)}.hni-severity-medium{border-color:rgba(255,184,72,.52)!important;box-shadow:0 0 0 1px rgba(255,184,72,.07),0 12px 28px rgba(255,184,72,.08)}.hni-severity-low{border-color:rgba(82,221,145,.40)!important}.hni-severity-label.high{color:#ff6972;background:rgba(255,70,82,.10);border:1px solid rgba(255,70,82,.18)}.hni-severity-label.medium{color:#ffc45e;background:rgba(255,184,72,.10);border:1px solid rgba(255,184,72,.16)}.hni-severity-label.low{color:#67dfa0;background:rgba(82,221,145,.09);border:1px solid rgba(82,221,145,.14)}
      @media(max-width:800px){.hni-assets{grid-template-columns:repeat(2,minmax(0,1fr))}.hni-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hni-command{align-items:flex-start;flex-direction:column}}@media(max-width:480px){.hni-assets,.hni-grid{grid-template-columns:1fr 1fr}.hni-asset{padding:11px}.hni-score{font-size:20px}}
    `;
    document.head.appendChild(style);
  }

  function severity(event) {
    const impact = String(event.impact || "").toLowerCase();
    const name = String(event.event_name || event.title || "").toLowerCase();
    const major = /cpi|pce|nfp|nonfarm|payroll|fomc|fed|interest rate|gdp|ppi|employment|unemployment|retail sales|ism/.test(name);
    if (impact === "high" || major) return { key: "high", label: "HIGH RISK" };
    if (impact === "medium") return { key: "medium", label: "MEDIUM" };
    return { key: "low", label: "LOW" };
  }

  function eventStatus(event) {
    const t = new Date(event.event_time || 0).getTime();
    if (!Number.isFinite(t) || !t) return "scheduled";
    const delta = Date.now() - t;
    if (delta >= 0 && delta <= 30 * 60000) return "reaction";
    if (delta < 0) return "upcoming";
    return "released";
  }

  function statusText(event) {
    const status = eventStatus(event);
    if (status === "reaction") return "LIVE REACTION";
    if (status === "released") return "RELEASED";
    if (status === "scheduled") return "SCHEDULED";
    const ms = new Date(event.event_time).getTime() - Date.now();
    const total = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(total / 86400), h = Math.floor((total % 86400) / 3600), m = Math.floor((total % 3600) / 60);
    if (d) return `IN ${d}D ${h}H`;
    return `IN ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
  }

  function probabilityFor(eventId, symbol) {
    const rows = probabilities.filter(r => Number(r.news_id) === Number(eventId) && r.symbol === symbol);
    if (!rows.length) return null;
    rows.sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
    const ai = rows.find(r => r.model_version === "openrouter-gpt-5-nano-v1" && r.ai_score !== null);
    const best = ai || rows.find(r => r.ai_score !== null) || rows[0];
    const up = Number(best.up_probability), down = Number(best.down_probability), confidence = Number(best.confidence);
    if (![up,down].every(Number.isFinite)) return null;
    return { up: Math.max(0, Math.min(100, Math.round(up))), down: Math.max(0, Math.min(100, Math.round(down))), confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(100, Math.round(confidence))) : null, model: best.model_version || "consensus", phase: best.phase || null, ai: best.model_version === "openrouter-gpt-5-nano-v1" };
  }

  function directionCell(event, asset) {
    const p = probabilityFor(event.id, asset.key);
    if (!p) return `<div class="hni-cell"><small>${asset.label}</small><strong class="hni-pending">AI PENDING</strong><div class="hni-foot">No model result yet</div></div>`;
    const up = p.up >= p.down;
    const dir = up ? "↑" : "↓", value = up ? p.up : p.down;
    return `<div class="hni-cell"><small>${asset.label}</small><strong class="${up ? "hni-up" : "hni-down"}">${dir} ${value}%</strong><div class="hni-foot">Confidence ${p.confidence ?? "--"}%</div></div>`;
  }

  function topScore(symbol) {
    const candidates = probabilities.filter(r => r.symbol === symbol && r.ai_score !== null);
    if (!candidates.length) return null;
    candidates.sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
    const r = candidates[0], score = Number(r.ai_score);
    return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : null;
  }

  function buildTop() {
    const cards = ASSETS.map(asset => {
      const score = topScore(asset.key);
      const display = score === null ? "--" : `${score}%`;
      const note = score === null ? "Awaiting AI probability" : score >= 65 ? "AI directional bias" : score <= 35 ? "AI downside bias" : "AI balanced context";
      return `<div class="hni-asset"><div class="hni-asset-top"><div><span class="hni-asset-name">${asset.label}</span><span class="hni-asset-symbol">${asset.symbol}</span></div><strong class="hni-score">${display}</strong></div><div class="hni-meter" style="color:${score === null ? "#6f7b8b" : score >= 50 ? "#56e39f" : "#ff7f86"}"><span style="width:${score === null ? 0 : score}%"></span></div><div class="hni-note">${note}</div></div>`;
    }).join("");
    return `<div class="hni-wrap" id="habboubNewsIntelligence"><div class="hni-command"><div><h3>Habboub News Intelligence</h3><p>Live economic events with model-backed probabilities for Gold, Nasdaq, S&P 500 and USD.</p></div><div class="hni-live"><span class="hni-dot"></span> LIVE · ${events.length} USD EVENTS</div></div><div class="hni-assets">${cards}</div></div>`;
  }

  function render() {
    const container = document.getElementById("newsContainer");
    if (!container) return;
    const oldTop = document.getElementById("habboubNewsIntelligence");
    if (oldTop) oldTop.remove();
    container.insertAdjacentHTML("beforebegin", buildTop());

    const cards = [...container.querySelectorAll(".habboub-economic-event")];
    cards.forEach((card, index) => {
      const event = events[index];
      if (!event) return;
      const old = card.querySelector(".hni-event");
      if (old) old.remove();
      const sev = severity(event);
      const html = `<div class="hni-event hni-severity-${sev.key}"><div class="hni-event-head"><div><div class="hni-event-title">${esc(event.event_name || event.title || "Economic Event")}</div><div class="hni-foot">${esc(event.currency || "USD")} · ${statusText(event)}</div></div><div class="hni-badges"><span class="hni-severity-label ${sev.key}">${sev.label}</span></div></div><div class="hni-grid">${ASSETS.map(a => directionCell(event,a)).join("")}</div><div class="hni-foot">${eventStatus(event) === "upcoming" ? "Pre-event: probability remains pending until the AI engine has sufficient event context." : "Decision-support context only. Never a BUY/SELL instruction."}</div></div>`;
      card.insertAdjacentHTML("beforeend", html);
    });
  }

  async function sync() {
    if (refreshBusy) return;
    const db = getClient();
    if (!db) return;
    refreshBusy = true;
    try {
      const now = new Date();
      const start = new Date(now.getTime() - 30 * 60000).toISOString();
      const end = new Date(now.getTime() + 7 * 86400000).toISOString();
      const [newsResult, probResult] = await Promise.all([
        db.from("news").select("id,title,description,source,url,image_url,category,impact,currency,published_at,created_at,event_name,actual,forecast,previous,event_time,country,unit,time_mode,revised_previous,event_status").eq("category","economic_calendar").eq("currency","USD").gte("event_time",start).lte("event_time",end).order("event_time",{ascending:true}).limit(200),
        db.from("news_probability").select("news_id,symbol,event_name,event_time,up_probability,down_probability,confidence,phase,ai_score,model_version,updated_at").gte("event_time",start).lte("event_time",end).in("symbol",ASSETS.map(a=>a.key)).order("updated_at",{ascending:false}).limit(1000)
      ]);
      if (newsResult.error) throw newsResult.error;
      if (probResult.error) throw probResult.error;
      events = Array.isArray(newsResult.data) ? newsResult.data : [];
      probabilities = Array.isArray(probResult.data) ? probResult.data : [];
      lastSync = Date.now();
      render();
    } catch (error) {
      console.warn("Habboub News Intelligence sync failed:", error);
    } finally {
      refreshBusy = false;
    }
  }

  function start() {
    ensureStyles();
    sync();
    setInterval(sync, 30000);
    setInterval(() => { if (events.length) render(); }, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
