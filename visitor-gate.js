/* ECONOVA public/member gate. Visitors stay on index.html; authenticated users keep the app. */
(function(){
  'use strict';
  if(window.__ECONOVA_GATE__) return;
  window.__ECONOVA_GATE__=true;
  document.documentElement.classList.add('econova-gating');
  const earlyStyle=document.createElement('style');
  earlyStyle.id='econova-gate-early-style';
  earlyStyle.textContent='html.econova-gating body>.topbar,html.econova-gating body>#mobileNav,html.econova-gating body>#loader,html.econova-gating body>main>.page-section{display:none!important}';
  document.head.appendChild(earlyStyle);

  const path=location.pathname.replace(/\/+$/,'');
  const isApp=/(^|\/)index\.html$/.test(path)||path.endsWith('/habboub-trade');
  if(!isApp)return;
  const supabaseUrl='https://feoyjasuvrqxzhskqzye.supabase.co';
  const supabaseKey='sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0';

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
      if(theme){
        e.preventDefault();e.stopImmediatePropagation();
        try{localStorage.setItem('econova_theme',document.body.classList.contains('v-light')?'dark':'light')}catch(_){document.body.classList.toggle('v-light')}
        applyPublicTheme();
        return;
      }
      const lang=e.target.closest('#publicLang');
      if(lang){e.preventDefault();e.stopImmediatePropagation();if(window.EconovaPublicI18n?.toggleLanguage)window.EconovaPublicI18n.toggleLanguage();}
    },true);
    applyPublicTheme();
  }

  function publicMode(){
    if(!document.getElementById('econova-public-gate-style')){
      const style=document.createElement('style');
      style.id='econova-public-gate-style';
      style.textContent='body.econova-public-mode>.topbar,body.econova-public-mode>#mobileNav,body.econova-public-mode>#loader,body.econova-public-mode>main>.page-section{display:none!important}body.econova-public-mode>main{display:block!important;max-width:none!important;margin:0!important;padding:0!important}body.econova-public-mode #econova-public-site{display:block!important}';
      document.head.appendChild(style);
    }
    document.body.classList.add('econova-public-mode');
    document.documentElement.classList.remove('econova-gating');
    installPublicControls();
    window.EconovaPublicI18n?.apply(window.EconovaPublicI18n.getLang());
    applyPublicTheme();
  }

  function memberMode(){
    document.body.classList.remove('econova-public-mode');
    document.documentElement.classList.remove('econova-gating');
    const s=document.createElement('script');s.id='econova-member-i18n';s.src='i18n.js?v=20260906-2';s.async=false;document.head.appendChild(s);
  }

  async function boot(){
    if(!window.supabase?.createClient)return setTimeout(boot,25);
    try{const client=window.supabase.createClient(supabaseUrl,supabaseKey);const {data}=await client.auth.getSession();if(data?.session?.user)memberMode();else publicMode();}catch(_){publicMode();}
  }
  function waitForBody(){if(!document.body)return setTimeout(waitForBody,10);boot();}
  waitForBody();
})();
