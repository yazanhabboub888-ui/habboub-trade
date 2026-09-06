/* ECONOVA — direct public homepage/member gate. */
(function(){
  'use strict';
  if (window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__ = true;
  const path = location.pathname.replace(/\/+$/, '');
  const isApp = /(^|\/)index\.html$/.test(path) || path.endsWith('/habboub-trade') || path === '';
  if (!isApp) return;

  const supabaseUrl = 'https://feoyjasuvrqxzhskqzye.supabase.co';
  const supabaseKey = 'sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0';
  const publicSite = () => document.getElementById('econova-public-site');

  // Prevent the old member chrome from flashing over the new public homepage.
  const style = document.createElement('style');
  style.id = 'econova-gate-style';
  style.textContent = '.topbar,#mobileNav{display:none!important}.econova-public-site{display:block!important}body.econova-member-mode .topbar{display:flex!important}body.econova-member-mode #mobileNav{display:none!important}body.econova-member-mode .econova-public-site{display:none!important}body.econova-public-mode main>.page-section{display:none!important}';
  (document.head || document.documentElement).appendChild(style);

  function publicMode(){
    document.body.classList.remove('econova-member-mode');
    document.body.classList.add('econova-public-mode');
    const site = publicSite();
    if (site) site.style.display = 'block';
    window.EconovaPublicI18n?.apply?.(window.EconovaPublicI18n.getLang?.() || 'en');
  }

  function memberMode(){
    document.body.classList.remove('econova-public-mode');
    document.body.classList.add('econova-member-mode');
    const site = publicSite();
    if (site) site.style.display = 'none';
    if (!document.querySelector('script[data-econova-member-i18n]')) {
      const s = document.createElement('script');
      s.src = 'i18n.js?v=20260906-2';
      s.dataset.econovaMemberI18n = '1';
      document.head.appendChild(s);
    }
  }

  function boot(){
    if (!window.supabase?.createClient) return setTimeout(boot,50);
    try {
      const client = window.supabase.createClient(supabaseUrl,supabaseKey);
      client.auth.getSession().then(({data}) => {
        if (data?.session?.user) memberMode();
        else publicMode();
      }).catch(publicMode);
    } catch(e){ publicMode(); }
  }
  boot();
})();
