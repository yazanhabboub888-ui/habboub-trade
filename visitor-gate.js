/* ECONOVA public/member routing gate.
   Public visitors see the ECONOVA landing page directly at the main URL.
   Authenticated members keep the full trading application at the same URL. */
(function(){
  if (window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__ = true;

  const path = location.pathname.replace(/\\/+$/, '');
  const isApp = /(^|\\/)index\\.html$/.test(path) || path.endsWith('/habboub-trade');
  if (!isApp) return;

  const supabaseUrl = 'https://feoyjasuvrqxzhskqzye.supabase.co';
  const supabaseKey = 'sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0';

  const gateStyle = document.createElement('style');
  gateStyle.textContent = 'html.econova-gating body{visibility:hidden!important}';
  document.documentElement.classList.add('econova-gating');
  document.head.appendChild(gateStyle);

  async function showPublicSite(){
    try {
      const response = await fetch('visitor.html?v=20260906-5', {cache:'no-store'});
      if (!response.ok) throw new Error('visitor page unavailable');
      const html = await response.text();
      document.open();
      document.write(html);
      document.close();
    } catch(e) {
      document.documentElement.classList.remove('econova-gating');
      document.body.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;background:#05070a;color:#f5f7fa;font-family:Inter,Arial,sans-serif"><div style="text-align:center;padding:30px"><h1>ECONOVA</h1><p>Unable to load the public experience. Please refresh.</p></div></main>';
    }
  }

  async function boot(){
    if (!window.supabase?.createClient) return setTimeout(boot, 50);
    try {
      const client = window.supabase.createClient(supabaseUrl, supabaseKey);
      const {data} = await client.auth.getSession();
      if (data?.session?.user) {
        document.documentElement.classList.remove('econova-gating');
        return;
      }
      await showPublicSite();
    } catch(e) {
      await showPublicSite();
    }
  }

  boot();
})();
