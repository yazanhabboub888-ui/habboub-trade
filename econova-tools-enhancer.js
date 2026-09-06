/* ECONOVA — premium Tools mega-menu enhancer */
(function(){
  'use strict';
  if(window.__ECONOVA_TOOLS_ENHANCER__) return;
  window.__ECONOVA_TOOLS_ENHANCER__=true;

  const AR={Tools:'الأدوات','Live Stream':'البث المباشر','Live sessions and market context':'جلسات مباشرة وسياق السوق','Daily Journal':'السجل اليومي','Review and track your workflow':'راجع سير عملك وتابعه','Decision Support':'دعم القرار','Organize context before execution':'نظّم السياق قبل التنفيذ','Market Intelligence':'ذكاء السوق','Structure, macro, positioning and AI':'الهيكل والاقتصاد والتمركزات والذكاء الاصطناعي'};
  const EN={Tools:'Tools','Live Stream':'Live Stream','Live sessions and market context':'Live sessions and market context','Daily Journal':'Daily Journal','Review and track your workflow':'Review and track your workflow','Decision Support':'Decision Support','Organize context before execution':'Organize context before execution','Market Intelligence':'Market Intelligence','Structure, macro, positioning and AI':'Structure, macro, positioning and AI'};
  function lang(){return localStorage.getItem('habboub_language')==='ar'?'ar':'en'}

  function installPolish(){
    if(document.getElementById('econova-tools-polish'))return;
    const s=document.createElement('style');s.id='econova-tools-polish';
    s.textContent=`
      .econova-public-site .v-drop{position:static!important}
      .econova-public-site .v-drop-menu{
        position:fixed!important;top:76px!important;left:50vw!important;right:auto!important;
        width:min(1020px,calc(100vw - 40px))!important;max-height:calc(100vh - 96px);
        transform:translateX(-50%) translateY(-12px) scale(.97)!important;
        transform-origin:top center!important;overflow:auto!important;
        margin:0!important;
      }
      .econova-public-site .v-drop:hover .v-drop-menu,
      .econova-public-site .v-drop-menu:hover{
        transform:translateX(-50%) translateY(0) scale(1)!important;
      }
      .econova-public-site .v-drop-menu:before,.econova-public-site .v-drop-menu:after{content:none!important;display:none!important}
      .econova-public-site .v-drop-menu .econova-tools-heading{
        position:absolute!important;top:20px!important;left:25px!important;right:25px!important;
        display:flex!important;align-items:center!important;gap:10px!important;
        color:var(--text)!important;font-size:17px!important;font-weight:850!important;
        letter-spacing:-.25px!important;line-height:1.2!important;pointer-events:none!important;
      }
      .econova-public-site .econova-tools-heading:before{
        content:''!important;display:block!important;width:8px!important;height:8px!important;flex:0 0 8px!important;
        border-radius:50%!important;background:var(--cyan)!important;box-shadow:0 0 14px rgba(54,217,255,.65)!important;
      }
      .econova-public-site .econova-tools-panel{
        grid-column:1!important;grid-row:1 / 3!important;min-height:100%!important;
        padding:22px 20px!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important;
        border-radius:20px!important;background:linear-gradient(155deg,rgba(54,217,255,.14),rgba(71,125,255,.07))!important;
        border:1px solid rgba(54,217,255,.22)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 14px 34px rgba(0,0,0,.16)!important;
        position:relative!important;overflow:hidden!important;
      }
      .econova-public-site .econova-tools-panel:before{content:''!important;position:absolute!important;inset:auto -55px -65px auto!important;width:180px!important;height:180px!important;border-radius:50%!important;background:radial-gradient(circle,rgba(54,217,255,.22),transparent 68%)!important;pointer-events:none!important}
      .econova-public-site .econova-tools-panel:after{content:''!important;position:absolute!important;inset:0!important;background:linear-gradient(120deg,transparent 20%,rgba(255,255,255,.035) 50%,transparent 80%)!important;pointer-events:none!important}
      .econova-public-site .econova-tools-badge{
        position:relative!important;z-index:2!important;align-self:flex-start!important;display:inline-flex!important;align-items:center!important;gap:7px!important;
        padding:6px 10px!important;border-radius:999px!important;color:var(--cyan)!important;background:rgba(54,217,255,.1)!important;
        border:1px solid rgba(54,217,255,.26)!important;font-size:9px!important;font-weight:900!important;letter-spacing:1.15px!important;white-space:nowrap!important;
      }
      .econova-public-site .econova-tools-badge i{display:block!important;width:6px!important;height:6px!important;flex:0 0 6px!important;border-radius:50%!important;background:var(--green)!important;box-shadow:0 0 10px rgba(41,211,145,.75)!important}
      .econova-public-site .econova-tools-panel-title{position:relative;z-index:2;margin:18px 0 8px!important;font-size:20px!important;line-height:1.1!important;font-weight:850!important;letter-spacing:-.5px!important;color:var(--text)!important}
      .econova-public-site .econova-tools-panel-copy{position:relative;z-index:2;margin:0!important;color:var(--muted)!important;font-size:11px!important;line-height:1.7!important}
      .econova-public-site .econova-tools-points{position:relative;z-index:2;display:grid!important;gap:8px!important;margin-top:18px!important}
      .econova-public-site .econova-tools-point{display:flex!important;align-items:center!important;gap:9px!important;color:var(--text)!important;font-size:10.5px!important;font-weight:650!important;line-height:1.35!important}
      .econova-public-site .econova-tools-point b{width:25px!important;height:25px!important;display:grid!important;place-items:center!important;flex:0 0 25px!important;border-radius:8px!important;color:var(--cyan)!important;font-size:9px!important;font-weight:900!important;background:rgba(54,217,255,.09)!important;border:1px solid rgba(54,217,255,.2)!important}
      .econova-public-site .econova-tools-panel-foot{position:relative;z-index:2;margin-top:18px!important;padding-top:12px!important;border-top:1px solid rgba(255,255,255,.1)!important;color:var(--muted)!important;font-size:9px!important;letter-spacing:.35px!important}
      .econova-public-site .v-drop-item{min-width:0!important}
      .econova-public-site .v-drop-item > div{min-width:0!important}
      body.v-light .econova-public-site .econova-tools-panel{background:linear-gradient(155deg,rgba(54,217,255,.11),rgba(71,125,255,.055))!important;border-color:rgba(15,80,110,.16)!important;box-shadow:0 12px 30px rgba(20,40,60,.08),inset 0 1px 0 rgba(255,255,255,.85)!important}
      body.v-light .econova-public-site .econova-tools-panel-foot{border-color:rgba(10,30,50,.1)!important}
      html[dir="rtl"] .econova-public-site .econova-tools-heading{justify-content:flex-end!important;direction:rtl!important}
      html[dir="rtl"] .econova-public-site .econova-tools-panel{text-align:right!important;direction:rtl!important}
      html[dir="rtl"] .econova-public-site .econova-tools-badge{align-self:flex-end!important}
      @media(max-width:700px){
        .econova-public-site .v-drop-menu{position:absolute!important;top:calc(100% + 12px)!important;left:auto!important;right:0!important;width:min(390px,calc(100vw - 20px))!important;max-height:calc(100vh - 90px)!important;transform:translateY(-10px) scale(.97)!important}
        .econova-public-site .v-drop:hover .v-drop-menu,.econova-public-site .v-drop-menu:hover{transform:translateY(0) scale(1)!important}
        html[dir="rtl"] .econova-public-site .v-drop-menu{left:auto!important;right:0!important}
      }
    `;
    document.head.appendChild(s);
  }

  function buildPanel(menu){
    if(menu.querySelector('.econova-tools-panel'))return;
    const panel=document.createElement('aside');panel.className='econova-tools-panel';
    panel.innerHTML=`<div><span class="econova-tools-badge"><i></i><span data-tools-badge>EXPLORE TOOLS</span></span><div class="econova-tools-panel-title" data-tools-panel-title>Trade with context.</div><p class="econova-tools-panel-copy" data-tools-panel-copy>Everything you need to understand the market before making a decision.</p><div class="econova-tools-points"><div class="econova-tools-point"><b>01</b><span data-tools-point-1>Live market context</span></div><div class="econova-tools-point"><b>02</b><span data-tools-point-2>Journal & review</span></div><div class="econova-tools-point"><b>03</b><span data-tools-point-3>AI market intelligence</span></div></div></div><div class="econova-tools-panel-foot" data-tools-foot>Built for clarity. Designed for disciplined decisions.</div>`;
    menu.prepend(panel);
  }

  function apply(){
    const r=document.getElementById('econova-public-site');if(!r)return;
    const isAr=lang()==='ar',dict=isAr?AR:EN;
    const tool=r.querySelector('.v-nav-tool');
    if(tool){tool.childNodes.forEach(n=>{if(n.nodeType===3)n.nodeValue=' '+dict.Tools+' '});tool.setAttribute('aria-label',dict.Tools)}
    r.querySelectorAll('.v-drop-menu').forEach(menu=>{
      buildPanel(menu);
      let heading=menu.querySelector('.econova-tools-heading');
      if(!heading){heading=document.createElement('div');heading.className='econova-tools-heading';menu.appendChild(heading)}
      heading.textContent=isAr?'تعرف على ECONOVA':'Discover ECONOVA';
      const set=(sel,text)=>{const el=menu.querySelector(sel);if(el)el.textContent=text};
      if(isAr){set('[data-tools-badge]','استكشف الأدوات');set('[data-tools-panel-title]','تداول بوضوح.');set('[data-tools-panel-copy]','كل ما تحتاجه لفهم السوق قبل اتخاذ القرار.');set('[data-tools-point-1]','سياق السوق اللحظي');set('[data-tools-point-2]','السجل والمراجعة');set('[data-tools-point-3]','ذكاء السوق بالـAI');set('[data-tools-foot]','وضوح أكثر. قرارات أكثر انضباطاً.')}else{set('[data-tools-badge]','EXPLORE TOOLS');set('[data-tools-panel-title]','Trade with context.');set('[data-tools-panel-copy]','Everything you need to understand the market before making a decision.');set('[data-tools-point-1]','Live market context');set('[data-tools-point-2]','Journal & review');set('[data-tools-point-3]','AI market intelligence');set('[data-tools-foot]','Built for clarity. Designed for disciplined decisions.')}
      menu.querySelectorAll('.v-drop-item').forEach(item=>item.querySelectorAll('strong,small').forEach(el=>{const key=el.textContent.trim();if(dict[key])el.textContent=dict[key]}));
    });
  }
  function watch(){installPolish();apply();let last=lang();setInterval(()=>{const now=lang();if(now!==last){last=now;apply()}},180)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
})();