/* ECONOVA public/member gate — never hide the public page while auth is loading. */
(function(){
  'use strict';
  if(window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__=true;

  /* Critical rule: the visitor homepage must paint immediately. Only hide legacy chrome. */
  const earlyStyle=document.createElement('style');
  earlyStyle.id='econova-gate-early-style';
  earlyStyle.textContent='html.econova-gating body>.topbar,html.econova-gating body>#mobileNav,html.econova-gating body>#loader{display:none!important}';
  document.head.appendChild(earlyStyle);

  function installPWA(){
    if(!document.querySelector('link[rel="manifest"]')){const manifest=document.createElement('link');manifest.rel='manifest';manifest.href='manifest.webmanifest?v=20260906-2';document.head.appendChild(manifest);}
    if(!document.querySelector('link[rel="apple-touch-icon"]')){const appleIcon=document.createElement('link');appleIcon.rel='apple-touch-icon';appleIcon.href='econova-icon.svg?v=20260906-2';document.head.appendChild(appleIcon);}
    const metas=[['mobile-web-app-capable','yes'],['apple-mobile-web-app-capable','yes'],['apple-mobile-web-app-status-bar-style','black-translucent'],['apple-mobile-web-app-title','ECONOVA']];
    metas.forEach(([name,content])=>{if(!document.querySelector(`meta[name="${name}"]`)){const meta=document.createElement('meta');meta.name=name;meta.content=content;document.head.appendChild(meta);}});
    if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js',{scope:'./'}).catch(()=>{});},{once:true});}
  }
  installPWA();

  function installMobileMenu(){
    if(!document.querySelector('link[data-econova-mobile-menu]')){const css=document.createElement('link');css.rel='stylesheet';css.dataset.econovaMobileMenu='true';css.href='econova-mobile-menu.css?v=20260906-2';document.head.appendChild(css);}
    if(!document.getElementById('econova-mobile-menu-script')){const s=document.createElement('script');s.id='econova-mobile-menu-script';s.src='econova-mobile-menu.js?v=20260906-2';s.defer=true;document.head.appendChild(s);}
  }
  installMobileMenu();

  const path=location.pathname.replace(/\/+$/,'');
  const isApp=/(^|\/)index\.html$/.test(path)||path.endsWith('/habboub-trade');
  if(!isApp)return;

  const supabaseUrl='https://feoyjasuvrqxzhskqzye.supabase.co';
  const supabaseKey='sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0';

  function loadToolsEnhancer(){if(document.getElementById('econova-tools-enhancer'))return;const s=document.createElement('script');s.id='econova-tools-enhancer';s.src='econova-tools-enhancer.js?v=20260906-5';s.async=true;document.head.appendChild(s);}
  function loadHeroEnhancer(){if(document.getElementById('econova-hero-enhancer'))return;const link=document.createElement('link');link.id='econova-hero-css';link.rel='stylesheet';link.href='econova-hero.css?v=20260906-2';document.head.appendChild(link);const s=document.createElement('script');s.id='econova-hero-enhancer';s.src='econova-hero-enhancer.js?v=20260906-2';s.async=true;document.head.appendChild(s);}

  function applyPublicTheme(){
    const light=localStorage.getItem('econova_theme')==='light';
    document.body.classList.toggle('v-light',light);
    document.body.classList.toggle('v-dark',!light);
    const b=document.getElementById('publicTheme');
    if(b){b.textContent=light?'☾':'☀';b.setAttribute('aria-label',light?'Switch to dark mode':'Switch to light mode');b.setAttribute('title',light?'Switch to dark mode':'Switch to light mode');}
  }

  function installPublicControls(){
    if(window.__ECONOVA_PUBLIC_CONTROLS__)return;
    window.__ECONOVA_PUBLIC_CONTROLS__=true;
    document.addEventListener('click',e=>{
      const theme=e.target.closest('#publicTheme');
      if(theme){e.preventDefault();e.stopImmediatePropagation();try{localStorage.setItem('econova_theme',document.body.classList.contains('v-light')?'dark':'light')}catch(_){document.body.classList.toggle('v-light')}applyPublicTheme();return;}
      const lang=e.target.closest('#publicLang');
      if(lang){e.preventDefault();e.stopImmediatePropagation();if(window.EconovaPublicI18n?.toggleLanguage)window.EconovaPublicI18n.toggleLanguage();setTimeout(()=>window.EconovaHero?.render?.(),0);}
    },true);
    applyPublicTheme();
  }

  function publicMode(){
    document.body.classList.add('econova-public-mode');
    document.documentElement.classList.remove('econova-gating');
    /* Do not hide main sections: the public homepage is allowed to render naturally. */
    if(!document.getElementById('econova-public-gate-style')){
      const style=document.createElement('style');
      style.id='econova-public-gate-style';
      style.textContent='body.econova-public-mode>.topbar,body.econova-public-mode>#mobileNav,body.econova-public-mode>#loader{display:none!important}';
      document.head.appendChild(style);
    }
    loadToolsEnhancer();
    loadHeroEnhancer();
    installPublicControls();
    window.EconovaPublicI18n?.apply(window.EconovaPublicI18n.getLang());
    applyPublicTheme();
    setTimeout(()=>window.EconovaHero?.render?.(),40);
  }

  function memberMode(){
    document.body.classList.remove('econova-public-mode');
    document.documentElement.classList.remove('econova-gating');
    const s=document.createElement('script');
    s.id='econova-member-i18n';
    s.src='i18n.js?v=20260906-3';
    s.async=true;
    document.head.appendChild(s);
  }

  async function boot(){
    if(!window.supabase?.createClient)return setTimeout(boot,50);
    try{
      const client=window.supabase.createClient(supabaseUrl,supabaseKey);
      const {data}=await client.auth.getSession();
      if(data?.session?.user)memberMode();
    }catch(_){/* Public mode stays visible. */}
  }

  function waitForBody(){
    if(!document.body)return setTimeout(waitForBody,10);
    publicMode();
    boot();
  }
  waitForBody();
})();
