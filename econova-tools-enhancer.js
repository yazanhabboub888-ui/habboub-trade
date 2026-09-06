/* ECONOVA — premium Tools mega-menu enhancer */
(function(){
  'use strict';
  if(window.__ECONOVA_TOOLS_ENHANCER__) return;
  window.__ECONOVA_TOOLS_ENHANCER__=true;
  const AR={
    'Tools':'الأدوات','Live Stream':'البث المباشر','Live sessions and market context':'جلسات مباشرة وسياق السوق','Daily Journal':'السجل اليومي','Review and track your workflow':'راجع سير عملك وتابعه','Decision Support':'دعم القرار','Organize context before execution':'نظّم السياق قبل التنفيذ','Market Intelligence':'ذكاء السوق','Structure, macro, positioning and AI':'الهيكل والاقتصاد والتمركزات والذكاء الاصطناعي'
  };
  const EN={Tools:'Tools','Live Stream':'Live Stream','Live sessions and market context':'Live sessions and market context','Daily Journal':'Daily Journal','Review and track your workflow':'Review and track your workflow','Decision Support':'Decision Support','Organize context before execution':'Organize context before execution','Market Intelligence':'Market Intelligence','Structure, macro, positioning and AI':'Structure, macro, positioning and AI'};
  function lang(){return localStorage.getItem('habboub_language')==='ar'?'ar':'en'}
  function apply(){
    const r=document.getElementById('econova-public-site'); if(!r)return;
    const dict=lang()==='ar'?AR:EN;
    const tool=r.querySelector('.v-nav-tool');
    if(tool){tool.childNodes.forEach(n=>{if(n.nodeType===3)n.nodeValue=' '+dict.Tools+' '});tool.setAttribute('aria-label',dict.Tools)}
    r.querySelectorAll('.v-drop-item').forEach(item=>{
      item.querySelectorAll('strong,small').forEach(el=>{const key=el.textContent.trim();if(dict[key])el.textContent=dict[key]});
    });
  }
  function watch(){
    apply();
    let last=lang();
    setInterval(()=>{const now=lang();if(now!==last){last=now;apply()}},180);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
})();
