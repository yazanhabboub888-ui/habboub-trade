/* HABBOUB JOURNAL PRO — Trade Capture */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const n = (id) => {
    const v = parseFloat($(id)?.value ?? "");
    return Number.isFinite(v) ? v : null;
  };
  const esc = (v) => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));

  function field(id, label, type = "number", step = "any", placeholder = "") {
    return `<label class="jtp-field"><span>${label}</span><input id="${id}" type="${type}" ${type === "number" ? `step="${step}"` : ""} placeholder="${placeholder}" autocomplete="off"></label>`;
  }

  function injectFields() {
    const form = $("journalForm");
    if (!form || $("journalAccountBalance")) return;
    const notes = $("journalNotes")?.closest("label") || $("journalNotes")?.parentElement;
    const wrap = document.createElement("div");
    wrap.className = "journal-trade-pro-fields";
    wrap.innerHTML = `
      <div class="jtp-section-title">TRADE FINANCIALS</div>
      <div class="jtp-grid">
        ${field("journalAccountBalance", "Account Balance", "number", "0.01", "10000")}
        ${field("journalRiskAmount", "Risk Amount ($)", "number", "0.01", "100")}
        ${field("journalPositionSize", "Position Size", "number", "0.001", "0.10")}
        ${field("journalEntryPrice", "Entry Price", "number", "0.00001", "")}
        ${field("journalStopLoss", "Stop Loss", "number", "0.00001", "")}
        ${field("journalTakeProfit", "Take Profit", "number", "0.00001", "")}
        ${field("journalExitPrice", "Exit Price", "number", "0.00001", "")}
        ${field("journalRR", "Risk / Reward", "number", "0.01", "2.00")}
      </div>
      <div class="jtp-live-calc"><span>Calculated R</span><strong id="journalCalculatedR">--</strong><span>Potential $</span><strong id="journalPotentialMoney">--</strong></div>`;
    if (notes?.parentNode) notes.parentNode.insertBefore(wrap, notes);
    else form.appendChild(wrap);
    ["journalAccountBalance","journalRiskAmount","journalPositionSize","journalEntryPrice","journalStopLoss","journalTakeProfit","journalExitPrice","journalRR"].forEach(id => $(id)?.addEventListener("input", calculate));
  }

  function calculate() {
    const risk = n("journalRiskAmount");
    const rr = n("journalRR");
    const r = n("journalPnL");
    const pnl = r !== null ? r : null;
    $("journalCalculatedR") && ($("journalCalculatedR").textContent = risk && pnl !== null ? `${(pnl / risk).toFixed(2)}R` : "--");
    $("journalPotentialMoney") && ($("journalPotentialMoney").textContent = risk && rr ? `$${(risk * rr).toFixed(2)}` : "--");
  }

  async function save(e) {
    const form = $("journalForm");
    if (!form || !window.supabaseClient || !window.state?.user) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const symbol = $("journalPair")?.value.trim();
    const direction = $("journalType")?.value || "BUY";
    const pnl = n("journalPnL") ?? 0;
    if (!symbol) {
      window.showToast?.(window.state.language === "ar" ? "اكتب رمز السوق أولاً." : "Enter a market symbol first.");
      return;
    }
    const entry = n("journalEntryPrice"), sl = n("journalStopLoss"), tp = n("journalTakeProfit"), exit = n("journalExitPrice");
    let rr = n("journalRR");
    if (rr === null && entry !== null && sl !== null && tp !== null && Math.abs(entry - sl) > 0) rr = Math.abs(tp - entry) / Math.abs(entry - sl);
    const account = n("journalAccountBalance"), risk = n("journalRiskAmount");
    const rResult = risk && risk > 0 ? pnl / risk : null;
    const scoreText = $("sessionScore")?.textContent?.replace(/[^0-9.-]/g, "");
    const marketScore = Number.isFinite(parseFloat(scoreText)) ? parseFloat(scoreText) : null;
    const payload = {
      user_id: window.state.user.id,
      journal_type: "trade",
      symbol,
      direction: String(direction).toUpperCase(),
      entry_price: entry,
      stop_loss: sl,
      take_profit: tp,
      exit_price: exit,
      risk_reward: rr,
      result: pnl > 0 ? "WIN" : pnl < 0 ? "LOSS" : "BREAKEVEN",
      notes: $("journalNotes")?.value.trim() || null,
      setup: $("journalSetup")?.value?.trim() || null,
      r_result: rResult,
      account_balance: account,
      risk_amount: risk,
      position_size: n("journalPositionSize"),
      pnl,
      alignment_score: null,
      market_score: marketScore,
      market_risk: $("marketRisk")?.textContent?.trim() || null,
      market_bias: $("sessionBias")?.textContent?.trim() || null
    };
    try {
      const result = await window.supabaseClient.from("trading_journal").insert(payload);
      if (result.error) throw result.error;
      window.closeModal?.("journalModal");
      form.reset();
      await window.loadJournal?.();
      window.showToast?.(window.state.language === "ar" ? "تم حفظ الصفقة بنجاح." : "Trade saved successfully.");
    } catch (err) {
      console.error("Journal Pro save error:", err);
      window.showToast?.(window.state.language === "ar" ? `فشل حفظ الصفقة: ${err.message || "خطأ غير معروف"}` : `Could not save trade: ${err.message || "Unknown error"}`);
    }
  }

  function style() {
    if ($("journalTradeProStyle")) return;
    const s = document.createElement("style"); s.id = "journalTradeProStyle";
    s.textContent = `.journal-trade-pro-fields{margin:16px 0;padding:16px;border:1px solid rgba(0,220,255,.14);border-radius:16px;background:rgba(255,255,255,.025)}.jtp-section-title{font-size:11px;font-weight:800;letter-spacing:.14em;color:#72e9ff;margin-bottom:12px}.jtp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.jtp-field{display:flex;flex-direction:column;gap:6px}.jtp-field span{font-size:11px;color:#8b99a8}.jtp-field input{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:10px;border:1px solid #26313d;background:#0b1016;color:inherit;outline:none}.jtp-field input:focus{border-color:#3bdcff;box-shadow:0 0 0 3px rgba(59,220,255,.1)}.jtp-live-calc{display:flex;gap:10px;align-items:center;margin-top:12px;padding:10px 12px;border-radius:10px;background:rgba(0,220,255,.04);font-size:11px;color:#8b99a8}.jtp-live-calc strong{color:#fff;margin-right:10px}@media(max-width:600px){.jtp-grid{grid-template-columns:1fr}.jtp-live-calc{flex-wrap:wrap}}`;
    document.head.appendChild(s);
  }

  function boot() {
    style(); injectFields();
    document.addEventListener("submit", (e) => { if (e.target?.id === "journalForm") save(e); }, true);
    new MutationObserver(injectFields).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
