/* ECONOVA — premium Tools mega-menu enhancer */
(function(){
  'use strict';
  if(window.__ECONOVA_TOOLS_ENHANCER__) return;
  window.__ECONOVA_TOOLS_ENHANCER__=true;

  const AR={
    Tools:'الأدوات',
    'Live Stream':'البث المباشر',
    'Live sessions and market context':'جلسات مباشرة وسياق السوق',
    'Daily Journal':'السجل اليومي',
    'Review and track your workflow':'راجع سير عملك وتابعه',
    'Decision Support':'دعم القرار',
    'Organize context before execution':'نظّم السياق قبل التنفيذ',
    'Market Intelligence':'ذكاء السوق',
    'Structure, macro, positioning and AI':'الهيكل والاقتصاد والتمركزات والذكاء الاصطناعي'
  };
  const EN={
    Tools:'Tools',
    'Live Stream':'Live Stream',
    'Live sessions and market context':'Live sessions and market context',
    'Daily Journal':'Daily Journal',
    'Review and track your workflow':'Review and track your workflow',
    'Decision Support':'Decision Support',
    'Organize context before execution':'Organize context before execution',
    'Market Intelligence':'Market Intelligence',
    'Structure, macro, positioning and AI':'Structure, macro, positioning and AI'
  };

  function lang(){return localStorage.getItem('habboub_language')==='ar'?'ar':'en'}

  function installPolish(){
    if(document.getElementById('econova-tools-polish')) return;
    const s=document.createElement('style');
    s.id='econova-tools-polish';
    s.textContent=`
      .econova-public-site .v-drop{position:relative}
      .econova-public-site .v-drop-menu{
        left:50%!important;right:auto!important;
        width:min(1020px,calc(100vw - 40px));
        transform:translateX(-50%) translateY(-12px) scale(.97)!important;
        transform-origin:top center!important;
        overflow:hidden;
      }
      .econova-public-site .v-drop:hover .v-drop-menu{
        transform:translateX(-50%) translateY(0) scale(1)!important;
      }
      .econova-public-site .v-drop-menu .econova-tools-heading{
        position:absolute;top:19px;left:25px;right:25px;
        display:flex;align-items:center;gap:10px;
        color:var(--text);font-size:17px;font-weight:800;
        letter-spacing:-.2px;line-height:1.2;
        pointer-events:none;
      }
      .econova-public-site .v-drop-menu .econova-tools-heading:before{
        content:'';width:8px;height:8px;border-radius:50%;
        background:var(--cyan);box-shadow:0 0 14px rgba(54,217,255,.65);
        flex:0 0 8px;
      }
      .econova-public-site .v-drop-menu:before{content:none!important}
      .econova-public-site .v-drop-menu:after{content:none!important}
      .econova-public-site .econova-tools-panel{
        grid-column:1;grid-row:1 / 3;
        min-height:100%;padding:22px 20px;
        display:flex;flex-direction:column;justify-content:space-between;
        border-radius:20px;
        background:linear-gradient(155deg,rgba(54,217,255,.14),rgba(71,125,255,.07));
        border:1px solid rgba(54,217,255,.18);
        box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 14px 34px rgba(0,0,0,.16);
        position:relative;overflow:hidden;
      }
      .econova-public-site .econova-tools-panel:after{
        content:'';position:absolute;width:150px;height:150px;right:-75px;top:-70px;
        border-radius:50%;background:radial-gradient(circle,rgba(54,217,255,.22),transparent 68%);
        pointer-events:none;
      }
      .econova-public-site .econova-tools-badge{
        align-self:flex-start;display:inline-flex;align-items:center;gap:7px;
        padding:6px 9px;border-radius:999px;
        color:var(--cyan);background:rgba(54,217,255,.09);
        border:1px solid rgba(54,217,255,.22);
        font-size:9px;font-weight:900;letter-spacing:1.3px;
        white-space:nowrap;
      }
      .econova-public-site .econova-tools-badge i{
        width:6px;height:6px;border-radius:50%;background:var(--green);
        box-shadow:0 0 10px rgba(41,211,145,.7);
      }
      .econova-public-site .econova-tools-panel-title{
        margin:18px 0 8px;font-size:20px;line-height:1.1;font-weight:850;
        letter-spacing:-.5px;color:var(--text);
      }
      .econova-public-site .econova-tools-panel-copy{
        margin:0;color:var(--muted);font-size:11px;line-height:1.7;
      }
      .econova-public-site .econova-tools-points{display:grid;gap:8px;margin-top:18px}
      .econova-public-site .econova-tools-point{
        display:flex;align-items:center;gap:9px;color:var(--text);
        font-size:10.5px;font-weight:650;line-height:1.35;
      }
      .econova-public-site .econova-tools-point b{
        width:23px;height:23px;display:grid;place-items:center;flex:0 0 23px;
        border-radius:8px;color:var(--cyan);font-size:9px;
        background:rgba(54,217,255,.08);border:1px solid rgba(54,217,255,.16);
      }
      .econova-public-site .econova-tools-panel-foot{
        margin-top:18px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08);
        color:var(--muted);font-size:9px;letter-spacing:.5px;
      }
      .econova-public-site .v-drop-item{min-width:0}
      .econova-public-site .v-drop-item > div{min-width:0}
      body.v-light .econova-public-site .econova-tools-panel{
        background:linear-gradient(155deg,rgba(54,217,255,.12),rgba(71,125,255,.055));
        border-color:rgba(15,80,110,.14);box-shadow:0 12px 30px rgba(20,40,60,.08),inset 0 1px 0 rgba(255,255,255,.8);
      }
      body.v-light .econova-public-site .econova-tools-panel-foot{border-color:rgba(10,30,50,.09)}
      html[dir="rtl"] .econova-public-site .v-drop-menu{
        left:50%!important;right:auto!important;
        transform:translateX(-50%) translateY(-12px) scale(.97)!important;
      }
      html[dir="rtl"] .econova-public-site .v-drop:hover .v-drop-menu{
        transform:translateX(-50%) translateY(0) scale(1)!important;
      }
      html[dir="rtl"] .econova-public-site .econova-tools-heading{left:25px;right:25px;justify-content:flex-end;direction:rtl}
      html[dir="rtl"] .econova-public-site .econova-tools-panel{text-align:right;direction:rtl}
      html[dir="rtl"] .econova-public-site .econova-tools-badge{align-self:flex-end}
      @media(max-width:700px){
        .econova-public-site .v-drop-menu{left:auto!important;right:0!important;width:min(390px,calc(100vw - 20px));transform:translateY(-10px) scale(.97)!important}
        .econova-public-site .v-drop:hover .v-drop-menu{transform:translateY(0) scale(1)!important}
        html[dir="rtl"] .econova-public-site .v-drop-menu{left:auto!important;right:0!important}
        html[dir="rtl"] .econova-public-site .v-drop:hover .v-drop-menu{transform:translateY(0) scale(1)!important}
      }
    `;
    document.head.appendChild(s);
  }

  function buildPanel(menu){
    if(menu.querySelector('.econova-tools-panel')) return;
    const panel=document.createElement('aside');
    panel.className='econova-tools-panel';
    panel.innerHTML=`
      <div>
        <span class="econova-tools-badge"><i></i><span data-tools-badge>EXPLORE TOOLS</span></span>
        <div class="econova-tools-panel-title" data-tools-panel-title>Trade with context.</div>
        <p class="econova-tools-panel-copy" data-tools-panel-copy>Everything you need to understand the market before making a decision.</p>
        <div class="econova-tools-points">
          <div class="econova-tools-point"><b>01</b><span data-tools-point-1>Live market context</span></div>
          <div class="econova-tools-point"><b>02</b><span data-tools-point-2>Journal & review</span></div>
          <div class="econova-tools-point"><b>03</b><span data-tools-point-3>AI market intelligence</span></div>
        </div>
      </div>
      <div class="econova-tools-panel-foot" data-tools-foot>Built for clarity. Designed for disciplined decisions.</div>
    `;
    menu.prepend(panel);
  }

  function apply(){
    const r=document.getElementById('econova-public-site'); if(!r)return;
    const isAr=lang()==='ar';
    const dict=isAr?AR:EN;
    const tool=r.querySelector('.v-nav-tool');
    if(tool){
      tool.childNodes.forEach(n=>{if(n.nodeType===3)n.nodeValue=' '+dict.Tools+' '});
      tool.setAttribute('aria-label',dict.Tools);
    }
    r.querySelectorAll('.v-drop-menu').forEach(menu=>{
      buildPanel(menu);
      let heading=menu.querySelector('.econova-tools-heading');
      if(!heading){heading=document.createElement('div');heading.className='econova-tools-heading';menu.appendChild(heading)}
      heading.textContent=isAr?'تعرف على ECONOVA':'Discover ECONOVA';
      const badge=menu.querySelector('[data-tools-badge]');
      const title=menu.querySelector('[data-tools-panel-title]');
      const copy=menu.querySelector('[data-tools-panel-copy]');
      const p1=menu.querySelector('[data-tools-point-1]');
      const p2=menu.querySelector('[data-tools-point-2]');
      const p3=menu.querySelector('[data-tools-point-3]');
      const foot=menu.querySelector('[data-tools-foot]');
      if(isAr){
        if(badge)badge.textContent='استكشف الأدوات';
        if(title)title.textContent='تداول بوضوح.';
        if(copy)copy.textContent='كل ما تحتاجه لفهم السوق قبل اتخاذ القرار.';
        if(p1)p1.textContent='سياق السوق اللحظي';
        if(p2)p2.textContent='السجل والمراجعة';
        if(p3)p3.textContent='ذكاء السوق بالـAI';
        if(foot)foot.textContent='وضوح أكثر. قرارات أكثر انضباطاً.';
      }else{
        if(badge)badge.textContent='EXPLORE TOOLS';
        if(title)title.textContent='Trade with context.';
        if(copy)copy.textContent='Everything you need to understand the market before making a decision.';
        if(p1)p1.textContent='Live market context';
        if(p2)p2.textContent='Journal & review';
        if(p3)p3.textContent='AI market intelligence';
        if(foot)foot.textContent='Built for clarity. Designed for disciplined decisions.';
      }
      menu.querySelectorAll('.v-drop-item').forEach(item=>{
        item.querySelectorAll('strong,small').forEach(el=>{
          const key=el.textContent.trim();
          if(dict[key])el.textContent=dict[key];
        });
      });
    });
  }

  function watch(){
    installPolish();
    apply();
    let last=lang();
    setInterval(()=>{
      const now=lang();
      if(now!==last){last=now;apply()}
    },180);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});
  else watch();
})();
