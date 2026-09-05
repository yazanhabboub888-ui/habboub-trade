/* Habboub live consensus bridge. */
(function () {
  "use strict";
  const SUPABASE_URL = "https://feoyjasuvrqxzhskqzye.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0";
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

  async function loadConsensus() {
    const db = getClient();
    if (!db) return;
    const now = new Date().toISOString();
    const { data, error } = await db
      .from("news_probability")
      .select("news_id,event_name,event_time,up_probability,down_probability,confidence,phase,model_version,updated_at,metadata")
      .eq("symbol", "XAUUSD")
      .gte("event_time", now)
      .order("event_time", { ascending: true })
      .limit(12);
    if (error || !data?.length) return;

    const best = data.find(row => Number(row.up_probability) !== 50) || data[0];
    if (!best) return;
    const up = Math.round(Number(best.up_probability));
    const down = Math.round(Number(best.down_probability));
    const confidence = Math.round(Number(best.confidence));
    const root = document.getElementById("habboubNewsIntelligence");
    if (!root) return;

    root.classList.add("hni-live-consensus");
    const command = root.querySelector(".hni-command");
    if (command) {
      const p = command.querySelector("p");
      if (p) p.textContent = "Analyst consensus is connected to the economic calendar. Gold baseline updates automatically as new public analyst views are captured.";
      const live = command.querySelector(".hni-live");
      if (live) live.innerHTML = '<span class="hni-dot"></span> LIVE CONSENSUS';
    }

    const cards = root.querySelectorAll(".hni-asset");
    const gold = [...cards].find(card => /Gold/i.test(card.textContent || ""));
    if (gold) {
      const score = gold.querySelector(".hni-score");
      const meter = gold.querySelector(".hni-meter span");
      const note = gold.querySelector(".hni-note");
      if (score) score.textContent = `${up}% UP`;
      if (meter) { meter.style.width = `${up}%`; meter.style.background = up >= 50 ? "#56e39f" : "#ff7f86"; }
      if (note) note.innerHTML = `<strong>${down}% down</strong> · confidence ${confidence}%`;
      gold.setAttribute("title", `${best.event_name || "Next event"}: Gold ${up}% up / ${down}% down`);
    }

    root.querySelectorAll(".hni-event").forEach(eventCard => {
      if (!best.event_name || !eventCard.textContent.includes(best.event_name)) return;
      const cells = eventCard.querySelectorAll(".hni-cell");
      const goldCell = [...cells].find(cell => /^Gold/i.test(cell.textContent.trim()));
      if (goldCell) {
        const strong = goldCell.querySelector("strong");
        if (strong) {
          strong.className = up >= 50 ? "hni-up" : "hni-down";
          strong.textContent = `${up >= 50 ? "BULLISH" : "BEARISH"} · ${Math.max(up,down)}%`;
        }
      }
      const foot = eventCard.querySelector(".hni-foot:last-child");
      if (foot) foot.innerHTML = `<strong>Analyst baseline:</strong> Gold ${up}% up / ${down}% down · confidence ${confidence}%. Decision support only; not a BUY/SELL command.`;
    });

    let badge = document.getElementById("habboubConsensusBadge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "habboubConsensusBadge";
      badge.className = "hni-consensus-badge";
      root.appendChild(badge);
    }
    badge.innerHTML = `<span>GOLD ANALYST BASELINE</span><strong>${up}% UP</strong><strong>${down}% DOWN</strong><em>Confidence ${confidence}%</em><small>Next: ${escapeHtml(best.event_name || "Economic event")}</small>`;
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
      } else if (attempts > 30) {
        clearInterval(timer);
      }
    }, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();