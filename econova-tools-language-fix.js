/* ECONOVA Tools — keep card copy stable across EN/AR switches. */
(() => {
  'use strict';
  const cards = () => [...document.querySelectorAll('#tools .v-card')];
  const copy = {
    en: [
      'Live sessions that bring market movement, commentary and context together in one calm, focused experience.',
      'Record trades, backtests and the context around them — then build a performance record you can actually review.',
      'Organize the information in front of you before execution, so decisions are built on context instead of noise.',
      'Market Structure, Institutional Positioning, Economic Events and AI Intelligence — brought together in one readable layer.'
    ],
    ar: [
      'جلسات مباشرة تجمع حركة السوق مع التعليق والسياق في تجربة واحدة هادئة ومركّزة.',
      'سجّل صفقاتك والباك تست والسياق حولها، وابنِ سجلًا تستطيع الرجوع إليه ومراجعته مع الوقت.',
      'رتّب المعلومات التي أمامك قبل التنفيذ، وخلي القرار مبنيًا على سياق واضح بدل الضوضاء.',
      'طبقة تجمع هيكل السوق والتمركز المؤسسي والأحداث الاقتصادية وذكاء الذكاء الاصطناعي في قراءة واحدة.'
    ]
  };
  function isArabic(){ return document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl'; }
  function apply(){ cards().forEach((card,i)=>{ const p=card.querySelector('.tools-content p'); if(p) p.textContent=copy[isArabic()?'ar':'en'][i]; }); }
  function watch(){
    apply();
    document.addEventListener('click', e => { if(e.target.closest('#publicLang')) setTimeout(apply,80); });
    new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['lang','dir']});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',watch); else watch();
})();
