/* ECONOVA public/member routing gate. */
(function(){
  if (window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__ = true;
  const isApp = /(?:^|\/)index\.html(?:$|#|\?)/.test(location.pathname + location.search + location.hash) || location.pathname.endsWith('/habboub-trade/') || location.pathname.endsWith('/habboub-trade');
  if (!isApp) return;
  const visitor = 'visitor.html';
  const url = location.href;
  if (sessionStorage.getItem('econova_member_check') === '1') return;
  const load = () => {
    if (!window.supabase?.createClient) return setTimeout(load, 50);
    try {
      const client = window.supabase.createClient('https://feoyjasuvrqxzhskqzye.supabase.co','sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0');
      client.auth.getSession().then(({data}) => {
        if (data?.session?.user) {
          sessionStorage.setItem('econova_member_check','1');
        } else {
          location.replace(visitor);
        }
      }).catch(() => location.replace(visitor));
    } catch(e) { location.replace(visitor); }
  };
  load();
})();