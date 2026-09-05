/* HABBOUB JOURNAL PRO — Market Alignment */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? "").replace(/[&<>\"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
  const num = (id) => { const n = parseFloat($(id)?.textContent?.replace(/[^0-9.-]/g, "")); return Number.isFinite(n) ? n : null; };

  function direction() {
    const el = $("journalType");
    const v = String(el?.value || "").toLowerCase();
    return /sell|short/.test(v) ? "SHORT" : /buy|long/.test(v) ? "LONG" : "";
  }

  function score() {
    const s = num("sessionScore");
    if (s === null) return null;
    const risk = String($("marketRisk")?.textContent || "").toLowerCase();
    const bias = String($("sessionBias")?.textContent || "").toLowerCase();
    const mss = String($("sessionMSS")?.textContent || "").toLowerCase();
    const fvg = String($("sessionFVG")?.textContent || "").toLowerCase();
    const trend = String($("regimeTrend")?.textContent || "").toLowerCase();
    const liq = String($("sessionLiquidity")?.textContent || "").toLowerCase();
    const dir = direction();
    let value = s * 0.55;
    let support = 0;
    const bullish = /(bull|long|buy|up)/;
    const bearish = /(bear|short|sell|down)/;
    if (dir) {
      const wanted = dir === "LONG" ? bullish : bearish;
      const opposed = dir === "LONG" ? bearish : bullish;
      [bias, mss, fvg, trend, liq].forEach((x) => { if (wanted.test(x)) support += 1; if (opposed.test(x)) support -= 1; });
      value += Math.max(-15, Math.min(15, support * 3));
    }
    if (/high|extreme|danger/.test(risk)) value -= 10;
    if (/low|normal|controlled/.test(risk)) value += 5;
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  function render() {
    const journal = $("journal");
    if (!journal) return;
    let box = $("journalMarketAlignment");
    if (!box) {
      box = document.createElement("div");
      box.id = "journalMarketAlignment";
      box.className = "journal-alignment";
      const stats = journal.querySelector(".journal-stats");
      if (stats) stats.parentNode.insertBefore(box, stats);
    }
    const v = score();
    const ar = document.documentElement.lang === "ar";
    const label = v === null ? (ar ? "بانتظار بيانات السوق" : "WAITING FOR MARKET DATA") : v >= 80 ? (ar ? "توافق قوي" : "HIGH ALIGNMENT") : v >= 65 ? (ar ? "متوافق" : "ALIGNED") : v >= 45 ? (ar ? "محايد" : "NEUTRAL") : v >= 25 ? (ar ? "توافق ضعيف" : "WEAK ALIGNMENT") : (ar ? "عكس السوق" : "AGAINST MARKET");
    const dir = direction();
    box.innerHTML = `<div class="jpa-head"><div><span class="jpa-kicker">${ar ? "توافق الصفقة مع السوق" : "TRADE × MARKET ALIGNMENT"}</span><h3 class="jpa-title">${ar ? "وضعك مقابل بيئة Habboub الحالية" : "Your execution vs Habboub market context"}</h3></div><span class="jpa-live">● LIVE</span></div><div class="jpa-main"><div class="jpa-ring"><div class="jpa-ring-inner"><strong>${v === null ? "--" : v}</strong><span>/100</span></div></div><div class="jpa-copy"><div class="jpa-status">${esc(label)}</div><p>${ar ? "المؤشر يقيس مدى توافق اتجاه الصفقة مع حالة السوق الحالية، وليس احتمال الربح." : "This measures execution alignment with the current market context — not profit probability."}</p><div class="jpa-bars"><div><span>Habboub Score</span><b>${v === null ? "--" : v}/100</b></div><div><span>Trade Direction</span><b>${dir || "--"}</b></div><div><span>Risk Environment</span><b>${esc($("marketRisk")?.textContent || "--")}</b></div></div></div></div>`;
  }

  function boot() {
    render();
    setInterval(render, 3000);
    $("journalType")?.addEventListener("change", render);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
