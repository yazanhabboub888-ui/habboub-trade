/* ECONOVA public/member gate.
   Unauthenticated visitors see the public ECONOVA homepage directly on index.html.
   Authenticated members keep the full trading application. */
(function(){
  if (window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__ = true;

  const path = location.pathname.replace(/\/+$/, '');
  const isApp = /(^|\/)index\.html$/.test(path) || path.endsWith('/habboub-trade');
  if (!isApp) return;

  const supabaseUrl = 'https://feoyjasuvrqxzhskqzye.supabase.co';
  const supabaseKey = 'sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0';

  const style = document.createElement('style');
  style.textContent = `
    html.econova-gating body { visibility:hidden!important; }
    body.econova-public-mode > .topbar,
    body.econova-public-mode > #mobileNav,
    body.econova-public-mode > #loader,
    body.econova-public-mode > main > .page-section { display:none!important; }
    body.econova-public-mode > main { display:block!important; padding:0!important; margin:0!important; max-width:none!important; }
    body.econova-public-mode #econova-public-site { display:block!important; }
  `;
  document.documentElement.classList.add('econova-gating');
  document.head.appendChild(style);

  function showPublic(){
    document.body.classList.add('econova-public-mode');
    document.documentElement.classList.remove('econova-gating');
    if (typeof window.initPublicEconomy === 'function') window.initPublicEconomy();
  }

  function showMember(){
    document.body.classList.remove('econova-public-mode');
    document.documentElement.classList.remove('econova-gating');
  }

  async function boot(){
    if (!window.supabase?.createClient) return setTimeout(boot, 50);
    try {
      const client = window.supabase.createClient(supabaseUrl, supabaseKey);
      const {data} = await client.auth.getSession();
      if (data?.session?.user) showMember();
      else showPublic();
    } catch(e) {
      showPublic();
    }
  }

  function waitForBody(){
    if (!document.body) return setTimeout(waitForBody, 20);
    boot();
  }
  waitForBody();
})();