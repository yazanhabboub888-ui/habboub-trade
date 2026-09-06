/* ECONOVA public/member routing gate. UX routing only; real authorization belongs in Supabase RLS. */
(function(){
  if (window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__ = true;
  const path = location.pathname.replace(/\\/+$/, '');
  const isApp = /(^|\\/)index\\.html$/.test(path) || path.endsWith('/habboub-trade');
  if (!isApp) return;

  const visitor = 'visitor.html';
  const supabaseUrl = 'https://feoyjasuvrqxzhskqzye.supabase.co';
  const supabaseKey = 'sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0';

  function redirect(){
    if (!location.pathname.endsWith('/visitor.html')) location.replace(visitor);
  }

  function boot(){
    if (!window.supabase?.createClient) return setTimeout(boot, 50);
    try {
      const client = window.supabase.createClient(supabaseUrl, supabaseKey);
      client.auth.getSession().then(({data}) => {
        if (data?.session?.user) return;
        redirect();
      }).catch(redirect);
    } catch(e){ redirect(); }
  }
  boot();
})();
