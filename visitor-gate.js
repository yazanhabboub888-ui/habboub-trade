/* ECONOVA public/member gate — keep first paint completely independent from auth. */
(function(){
  'use strict';
  if(window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__=true;

  // Public UI must render immediately. Nothing here blocks HTML/CSS paint.
  function addHeadAsset(kind,id,href){
    if(document.getElementById(id)) return;
    const el=document.createElement(kind);
    el.id=id;
    if(kind==='link'){el.rel='stylesheet';el.href=href;el.media='print';el.onload=function(){this.media='all';};}
    else {el.src=href;el.async=true;}
    document.head.appendChild(el);
  }

  function installPWA(){
    if(!document.querySelector('link[rel="manifest"]')){const m=document.createElement('link');m.rel='manifest';m.href='manifest.webmanifest?v=20260906-3';document.head.appendChild(m);}
    if(!document.querySelector('link[rel="apple-touch-icon"]')){const a=document.createElement('link');a.rel='apple-touch-icon';a.href='econova-icon.svg?v=20260906-3';document.head.appendChild(a);}
    if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js',{scope:'./'}).catch(()=>{}),{once:true});
  }

  function installMobileMenu(){
    addHeadAsset('link','econova-mobile-menu-css','econova-mobile-menu.css?v=20260906-3');
    addHeadAsset('script','econova-mobile-menu-script','econova-mobile-menu.js?v=20260906-3');
  }

  function publicMode(){
    document.body.classList.add('econova-public-mode');
    document.documentElement.classList.remove('econova-gating');
    const style=document.createElement('style');
    style.textContent='body.econova-public-mode>.topbar,body.econova-public-mode>#mobileNav,body.econova-public-mode>#loader{display:none!important}body.econova-public-mode .econova-public-site{display:block!important;visibility:visible!important;opacity:1!important}';
    document.head.appendChild(style);
    installPWA();
    installMobileMenu();

    // Non-critical visual enhancements load after the first frame.
    window.addEventListener('load',function(){
      addHeadAsset('link','econova-hero-css','econova-hero.css?v=20260906-3');
      addHeadAsset('script','econova-hero-enhancer','econova-hero-enhancer.js?v=20260906-3');
      addHeadAsset('script','econova-tools-enhancer','econova-tools-enhancer.js?v=20260906-6');
    },{once:true});
  }

  function memberMode(){
    document.body.classList.remove('econova-public-mode');
    const s=document.createElement('script');
    s.id='econova-member-i18n';s.src='i18n.js?v=20260906-4';s.async=true;
    document.head.appendChild(s);
  }

  function bootAuth(){
    if(!window.supabase?.createClient) return setTimeout(bootAuth,100);
    try{
      const client=window.supabase.createClient('https://feoyjasuvrqxzhskqzye.supabase.co','sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0');
      client.auth.getSession().then(({data})=>{if(data?.session?.user) memberMode();}).catch(()=>{});
    }catch(_){/* Public page remains usable. */}
  }

  if(!document.body){document.addEventListener('DOMContentLoaded',publicMode,{once:true});}
  else publicMode();
  // Auth is deliberately delayed until the browser has had a chance to paint.
  window.addEventListener('load',bootAuth,{once:true});
})();
