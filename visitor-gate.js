/* ECONOVA public/member routing gate.
   Unauthenticated visitors see the public ECONOVA homepage directly inside index.html.
   Authenticated users keep the full trading application. */
(function(){
  'use strict';
  if (window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__ = true;

  const path = location.pathname.replace(/\/+$/, '');
  const isApp = /(^|\/)index\.html$/.test(path) || path.endsWith('/habboub-trade');
  if (!isApp) return;

  const supabaseUrl = 'https://feoyjasuvrqxzhskqzye.supabase.co';
  const supabaseKey = 'sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0';

  function showPublic(){
    if (!document.body) return;
    document.body.classList.add('econova-public-mode');
    document.documentElement.classList.remove('econova-gating');
    const root = document.getElementById('econova-public-site');
    if (root) root.hidden = false;
    if (typeof window.initPublicEconomy === 'function') window.initPublicEconomy();
    window.dispatchEvent(new Event('econova:public-ready'));
  }

  function showMember(){
    if (!document.body) return;
    document.body.classList.remove('econova-public-mode');
    document.documentElement.classList.remove('econova-gating');
    const root = document.getElementById('econova-public-site');
    if (root) root.hidden = true;
  }

  function installGuardStyle(){
    const style = document.createElement('style');
    style.id = 'econova-gate-style';
    style.textContent = `
      html.econova-gating, html.econova-gating body { background:#080b12!important; }
      html.econova-gating body { visibility:hidden!important; }
      body.econova-public-mode > .topbar,
      body.econova-public-mode > #mobileNav,
      body.econova-public-mode > #loader,
      body.econova-public-mode > main > .page-section { display:none!important; }
      body.econova-public-mode > main { display:block!important; padding:0!important; margin:0!important; max-width:none!important; }
      body.econova-public-mode #econova-public-site { display:block!important; visibility:visible!important; }
      body.econova-public-mode .econova-public-site { min-height:100vh; }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add('econova-gating');
  }

  function boot(){
    if (!document.body) return setTimeout(boot, 20);
    installGuardStyle();
    if (!window.supabase?.createClient) return setTimeout(boot, 50);
    try {
      const client = window.supabase.createClient(supabaseUrl, supabaseKey);
      client.auth.getSession().then(({data}) => {
        if (data?.session?.user) showMember();
        else showPublic();
      }).catch(showPublic);
    } catch(e){
      showPublic();
    }
  }

  boot();
})();
