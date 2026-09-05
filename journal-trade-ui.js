/* Habboub — Simple Journal / Backtest */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://feoyjasuvrqxzhskqzye.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0';
  let client = null;
  let activeMode = 'journal';

  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const num = v => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };

  function getClient() {
    if (client) return client;
    if (window.supabase?.createClient) {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return client;
  }

  async function getUser() {
    const c = getClient();
    if (!c) return null;
    const { data } = await c.auth.getUser();
    return data?.user || null;
  }

  function balanceKey() {
    return activeMode === 'backtest' ? 'habboub_backtest_start_balance' : 'habboub_journal_start_balance';
  }

  function inject() {
    const section = $('journal');
    if (!section || section.querySelector('.simple-journal')) return;

    const box = document.createElement('div');
    box.className = 'simple-journal';
    box.innerHTML = `
      <div class="sj-balance">
        <span>CURRENT BALANCE</span>
        <strong id="sjBalance">$0.00</strong>
      </div>

      <div class="sj-tabs">
        <button type="button" data-mode="journal" class="active">Journal</button>
        <button type="button" data-mode="backtest">Backtest</button>
      </div>

      <form id="sjForm" class="sj-form">
        <div class="sj-fields">
          <label>Starting Balance
            <input id="sjStart" type="number" step="0.01" placeholder="10000">
          </label>
          <label>Symbol
            <input id="sjSymbol" type="text" placeholder="XAUUSD">
          </label>
          <label>Setup
            <input id="sjSetup" type="text" placeholder="ICT / AMT / Breakout">
          </label>
          <label>Result
            <select id="sjResult">
              <option value="win">WIN</option>
              <option value="loss">LOSS</option>
              <option value="break_even">BREAK EVEN</option>
            </select>
          </label>
          <label>R Result
            <input id="sjR" type="number" step="0.01" placeholder="2.00">
          </label>
          <label>Money ($)
            <input id="sjPnl" type="number" step="0.01" placeholder="200">
          </label>
        </div>

        <label class="sj-notes">Entry reason / Notes
          <textarea id="sjNotes" rows="3" placeholder="سبب الدخول وملاحظات الصفقة"></textarea>
        </label>

        <button id="sjSave" type="submit" class="primary-btn">Save Trade</button>
      </form>

      <div id="sjTrades" class="sj-trades"></div>
    `;

    section.prepend(box);

    box.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeMode = btn.dataset.mode;
        box.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('active', x === btn));
        loadAndRender();
      });
    });

    $('sjForm').addEventListener('submit', saveTrade);
    $('sjStart').value = localStorage.getItem(balanceKey()) || '';
  }

  async function saveTrade(e) {
    e.preventDefault();
    const c = getClient();
    const user = await getUser();
    if (!c || !user) {
      alert('Please login first.');
      return;
    }

    const symbol = $('sjSymbol').value.trim();
    const setup = $('sjSetup').value.trim();
    const result = $('sjResult').value;
    const rr = num($('sjR').value);
    let pnl = num($('sjPnl').value);
    const notes = $('sjNotes').value.trim();
    const start = num($('sjStart').value);

    if (!symbol) return alert('Enter the symbol.');
    if (!start && !localStorage.getItem(balanceKey())) return alert('Enter the starting balance.');

    if (result === 'loss') pnl = -Math.abs(pnl);
    else if (result === 'win') pnl = Math.abs(pnl);
    else pnl = 0;

    const oldStart = num(localStorage.getItem(balanceKey()));
    const startingBalance = start || oldStart;

    if (start) localStorage.setItem(balanceKey(), String(start));

    const { data: previous } = await c
      .from('trading_journal')
      .select('pnl')
      .eq('user_id', user.id)
      .eq('journal_type', activeMode)
      .order('created_at', { ascending: true });

    const balanceAfter = startingBalance + (previous || []).reduce((sum, row) => sum + num(row.pnl), 0) + pnl;

    const { error } = await c.from('trading_journal').insert({
      user_id: user.id,
      journal_type: activeMode,
      symbol,
      setup,
      result,
      r_result: rr,
      pnl,
      notes,
      account_balance: balanceAfter
    });

    if (error) {
      console.error(error);
      alert('Save failed: ' + error.message);
      return;
    }

    $('sjSymbol').value = '';
    $('sjSetup').value = '';
    $('sjR').value = '';
    $('sjPnl').value = '';
    $('sjNotes').value = '';
    $('sjStart').value = startingBalance;

    await loadAndRender();
    if (typeof window.showToast === 'function') window.showToast('Trade saved');
  }

  async function loadAndRender() {
    const c = getClient();
    const user = await getUser();
    if (!c || !user) return;

    const { data, error } = await c
      .from('trading_journal')
      .select('*')
      .eq('user_id', user.id)
      .eq('journal_type', activeMode)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    const rows = data || [];
    let start = num(localStorage.getItem(balanceKey()));
    if (!start && rows.length) start = num(rows[0].account_balance) - num(rows[0].pnl);

    let balance = start;
    rows.forEach(row => { balance += num(row.pnl); });
    $('sjBalance').textContent = '$' + balance.toFixed(2);
    $('sjStart').value = start || '';

    const list = $('sjTrades');
    list.innerHTML = rows.length ? rows.slice().reverse().map(row => `
      <article class="sj-trade">
        <div class="sj-trade-top">
          <strong>${esc(row.symbol)}</strong>
          <span class="sj-result ${esc(row.result)}">${esc(String(row.result || '').replace('_', ' ').toUpperCase())}</span>
        </div>
        <div class="sj-trade-meta">
          <span>${esc(row.setup || 'No setup')}</span>
          <b>${num(row.r_result).toFixed(2)}R</b>
          <b class="${num(row.pnl) >= 0 ? 'profit' : 'loss'}">${num(row.pnl) >= 0 ? '+' : ''}$${num(row.pnl).toFixed(2)}</b>
        </div>
        ${row.notes ? `<p>${esc(row.notes)}</p>` : ''}
      </article>
    `).join('') : '';
  }

  function styles() {
    if ($('simple-journal-css')) return;
    const style = document.createElement('style');
    style.id = 'simple-journal-css';
    style.textContent = `
      .simple-journal{display:grid;gap:14px;margin:0 0 22px}
      .sj-balance{padding:20px 22px;border:1px solid rgba(54,216,255,.18);border-radius:16px;background:#0a1118}
      .sj-balance span{display:block;font-size:11px;letter-spacing:.14em;color:#8190a0;margin-bottom:6px}
      .sj-balance strong{font-size:32px;line-height:1}
      .sj-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .sj-tabs button{border:1px solid #26313d;background:#0b1118;color:inherit;border-radius:10px;padding:11px;cursor:pointer}
      .sj-tabs button.active{border-color:#36d8ff;color:#36d8ff;background:rgba(54,216,255,.08)}
      .sj-form{padding:16px;border:1px solid #202b36;border-radius:16px;background:#0a1017}
      .sj-fields{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .sj-form label{display:grid;gap:6px;color:#8997a8;font-size:12px}
      .sj-form input,.sj-form select,.sj-form textarea{width:100%;box-sizing:border-box;background:#080d13;border:1px solid #273442;color:inherit;border-radius:9px;padding:10px;outline:none}
      .sj-notes{margin-top:10px}
      .sj-form .primary-btn{margin-top:10px;width:100%}
      .sj-trades{display:grid;gap:8px}
      .sj-trade{padding:14px 15px;border:1px solid #202b36;border-radius:13px;background:#0b1118}
      .sj-trade-top,.sj-trade-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
      .sj-trade-top strong{font-size:16px}
      .sj-result{font-size:10px;padding:4px 7px;border-radius:6px}
      .sj-result.win{color:#63e6aa;background:rgba(99,230,170,.08)}
      .sj-result.loss{color:#ff7777;background:rgba(255,119,119,.08)}
      .sj-result.break_even{color:#ffd66b;background:rgba(255,214,107,.08)}
      .sj-trade-meta{margin-top:8px;color:#8795a5;font-size:12px}
      .sj-trade-meta b{color:#dce5ed}
      .sj-trade-meta .profit{color:#63e6aa}.sj-trade-meta .loss{color:#ff7777}
      .sj-trade p{margin:9px 0 0;color:#9aa7b5;font-size:12px}
      @media(max-width:700px){.sj-fields{grid-template-columns:1fr 1fr}.sj-balance strong{font-size:28px}}
      @media(max-width:430px){.sj-fields{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function boot() {
    styles();
    inject();
    loadAndRender();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
