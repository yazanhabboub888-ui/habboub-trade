/* ECONOVA public/member gate. Visitors stay on index.html; authenticated users keep the app. */
(function(){
  'use strict';
  if(window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__=true;
  const path=location.pathname.replace(/\/+$/,'');
  const isApp=/(^|\/)index\.html$/.test(path)||path.endsWith('/habboub-trade');
  if(!isApp)return;
  const supabaseUrl='https://feoyjasuvrqxzhskqzye.supabase.co';
  const supabaseKey='sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0';
  function loadMemberI18n(){
    if(document.getElementById('econova-member-i18n'))return;
    const s=document.createElement('script');s.id='econova-member-i18n';s.src='i18n.js?v=20260906-2';s.async=false;document.head.appendChild(s);
  }
  function publicMode(){
    if(!document.getElementById('econova-public-gate-style')){
      const style=document.createElement('style');style.id='econova-public-gate-style';style.textContent=`body.econova-public-mode>.topbar,body.econova-public-mode>#mobileNav,body.econova-public-mode>#loader,body.econova-public-mode>main>.page-section{display:none!important}body.econova-public-mode>main{display:block!important;max-width:none!important;margin:0!important;padding:0!important}body.econova-public-mode #econova-public-site{display:block!important}`;document.head.appendChild(style);
    }
    document.body.classList.add('econova-public-mode');document.documentElement.classList.remove('econova-gating');window.EconovaPublicI18n?.apply(window.EconovaPublicI18n.getLang());
  }
  function memberMode(){document.body.classList.remove('econova-public-mode');document.documentElement.classList.remove('econova-gating');loadMemberI18n();}
  async function boot(){
    if(!window.supabase?.createClient)return setTimeout(boot,50);
    try{const client=window.supabase.createClient(supabaseUrl,supabaseKey);const {data}=await client.auth.getSession();if(data?.session?.user)memberMode();else publicMode();}catch(_){publicMode();}
  }
  function waitForBody(){if(!document.body)return setTimeout(waitForBody,20);document.documentElement.classList.add('econova-gating');boot();}
  waitForBody();
})();
