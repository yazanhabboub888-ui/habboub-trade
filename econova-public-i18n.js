/* ECONOVA — public EN/AR language + theme switcher */
(() => {
  'use strict';
  if (window.__ECONOVA_PUBLIC_I18N__) return;
  window.__ECONOVA_PUBLIC_I18N__ = true;

  const T = {
    'Tools':'الأدوات','How it works':'كيف يعمل','Membership':'الاشتراك','Stories':'التجارب','Education':'التعليم','Log in':'تسجيل الدخول','Get started':'ابدأ الآن',
    'AI ECONOMIC INTELLIGENCE':'الذكاء الاقتصادي بالذكاء الاصطناعي','ECONOVA INTELLIGENCE':'ذكاء ECONOVA','See the market.':'شوف السوق.','Before you trade.':'قبل ما تتداول.',
    'Explore tools':'استكشف الأدوات','Live market context':'سياق السوق المباشر','Structured workflow':'سير عمل منظّم','AI-assisted intelligence':'ذكاء مدعوم بالذكاء الاصطناعي',
    'LIVE MARKET ENVIRONMENT':'بيئة السوق المباشرة','● LIVE':'● مباشر','Market Context':'سياق السوق','Market View':'نظرة السوق','Live Stream':'البث المباشر','Daily Journal':'السجل اليومي','Decision Support':'دعم القرار','Market Intelligence':'ذكاء السوق',
    'How it works':'كيف يعمل','Explore →':'استكشف ←','01 · TOOLS':'01 · الأدوات','02 · HOW IT WORKS':'02 · كيف يعمل','03 · MEMBERSHIP':'03 · الاشتراك','04 · STORIES':'04 · التجارب','05 · EDUCATION':'05 · التعليم',
    'From raw data to readable context.':'من البيانات الخام إلى سياق واضح.','01 · Live Data':'01 · البيانات المباشرة','02 · Market Structure':'02 · هيكل السوق','Market Structure':'هيكل السوق','03 · Macro & News':'03 · الاقتصاد والأخبار','04 · Positioning':'04 · التمركزات','Institutional Positioning':'التمركز المؤسسي','05 · AI Intelligence':'05 · ذكاء الذكاء الاصطناعي','06 · Your Workflow':'06 · طريقة عملك',
    'Essential':'الأساسي','Intelligence':'الذكاء','Full Workflow':'سير العمل الكامل','RECOMMENDED':'موصى به','Start now':'ابدأ الآن','Less noise':'ضوضاء أقل','Better review':'مراجعة أفضل','More context':'سياق أكثر',
    'Learn the market context.':'تعلّم سياق السوق.','Macro & Economic Events':'الأحداث الاقتصادية والكلية','Trading Journal & Review':'سجل التداول والمراجعة','READY WHEN YOU ARE':'جاهز عندما تكون مستعدًا','Build a clearer trading workflow.':'ابنِ طريقة تداول أوضح.','View membership':'عرض الاشتراك','Decision support, not financial advice.':'أداة لدعم القرار وليست نصيحة مالية.','© 2026 ECONOVA — AI ECONOMIC INTELLIGENCE':'© 2026 ECONOVA — الذكاء الاقتصادي بالذكاء الاصطناعي',
    'Everything starts from one public dashboard.':'كل شيء يبدأ من لوحة عامة واحدة.','Live sessions and market context':'جلسات مباشرة وسياق السوق','Review and track your workflow':'راجع سير عملك وتابعه','Organize context before execution':'نظّم السياق قبل التنفيذ','Structure, macro, positioning and AI':'الهيكل والاقتصاد والتمركزات والذكاء الاصطناعي',
    'Built for better trading routines.':'مصمّم لعادات تداول أفضل.','Choose the workflow that fits you.':'اختَر سير العمل المناسب لك.','Learn the market context.':'تعلّم سياق السوق.'
  };

  const originals = new WeakMap();
  const root = () => document.getElementById('econova-public-site');

  function injectPublicStyle() {
    if (document.getElementById('econova-public-ui-fix')) return;
    const s = document.createElement('style');
    s.id = 'econova-public-ui-fix';
    s.textContent = `
      .econova-public-site{font-synthesis:none;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
      .econova-public-site,.econova-public-site *{font-family:"Noto Sans Arabic","Noto Sans",Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .econova-public-site .v-nav-inner{direction:ltr!important}
      .econova-public-site .v-brand{margin-right:auto!important;margin-left:0!important;direction:ltr!important;white-space:nowrap!important;font-weight:800!important}
      .econova-public-site .v-links{direction:ltr!important;white-space:nowrap!important}
      .econova-public-site .v-links a,.econova-public-site .v-login,.econova-public-site .v-start{font-weight:650!important}
      .econova-public-site .v-actions{direction:ltr!important;display:flex!important;align-items:center!important;gap:8px!important;white-space:nowrap!important}
      .econova-public-site .v-actions .v-lang{min-width:46px!important;height:38px!important;padding:0 12px!important;border:1px solid var(--line)!important;border-radius:11px!important;background:var(--panel)!important;color:var(--text)!important;font-weight:800!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 6px 18px rgba(0,0,0,.12)!important;transition:.18s ease!important;cursor:pointer!important}
      .econova-public-site .v-actions .v-lang:hover{border-color:rgba(54,217,255,.42)!important;background:rgba(54,217,255,.08)!important;color:var(--cyan)!important;transform:translateY(-1px)!important}
      .econova-public-site .v-actions #publicTheme{font-size:17px!important;min-width:42px!important;padding:0!important}
      html[dir="rtl"] .econova-public-site{direction:rtl!important}
      html[dir="rtl"] .econova-public-site .v-nav-inner{direction:ltr!important}
      html[dir="rtl"] .econova-public-site .v-links>a,html[dir="rtl"] .econova-public-site .v-drop>a{direction:rtl!important;text-align:right!important;unicode-bidi:isolate!important;white-space:nowrap!important;font-weight:700!important}
      html[dir="rtl"] .econova-public-site .v-drop-menu,html[dir="rtl"] .econova-public-site .v-drop-item{direction:rtl!important;text-align:right!important}
      html[dir="rtl"] .econova-public-site .v-hero,html[dir="rtl"] .econova-public-site .v-section,html[dir="rtl"] .econova-public-site .v-cta{direction:rtl!important}
      html[dir="rtl"] .econova-public-site .v-section-head,html[dir="rtl"] .econova-public-site .v-card,html[dir="rtl"] .econova-public-site .v-cta{text-align:right!important}
      html[dir="rtl"] .econova-public-site p,html[dir="rtl"] .econova-public-site li,html[dir="rtl"] .econova-public-site .v-card p{font-weight:500!important}
      body.v-light .econova-public-site .v-nav{background:rgba(255,255,255,.94)!important}
      body.v-light .econova-public-site .v-actions .v-lang,body.v-light .econova-public-site .v-actions .v-login{color:#243244!important}
      body.v-light .econova-public-site p,body.v-light .econova-public-site li{color:#334155!important}
      body.v-dark .econova-public-site p,body.v-dark .econova-public-site li{color:var(--muted,#aeb8c7)!important}
    `;
    document.head.appendChild(s);
  }

  function walk(node, lang) {
    if (!node) return;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(text => {
      const parent = text.parentElement;
      if (!parent || ['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT'].includes(parent.tagName)) return;
      if (!originals.has(text)) originals.set(text, text.nodeValue);
      const original = originals.get(text).trim();
      if (!original) return;
      if (lang === 'ar' && T[original]) text.nodeValue = text.nodeValue.replace(original, T[original]);
      if (lang === 'en' && T[original]) text.nodeValue = text.nodeValue.replace(T[original], original);
    });
  }

  function apply(lang) {
    const r = root();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (r) walk(r, lang);
    const b = document.getElementById('publicLang');
    if (b) { b.textContent = lang === 'ar' ? 'EN' : 'عربي'; b.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'); }
    localStorage.setItem('econova_lang', lang);
  }

  function getLang() { return localStorage.getItem('econova_lang') === 'ar' ? 'ar' : 'en'; }
  function setLang(lang) { apply(lang === 'ar' ? 'ar' : 'en'); }
  function toggleLanguage() { setLang(getLang() === 'ar' ? 'en' : 'ar'); }

  function applyTheme() {
    const light = localStorage.getItem('econova_theme') === 'light';
    document.body.classList.toggle('v-light', light);
    document.body.classList.toggle('v-dark', !light);
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    const b = document.getElementById('publicTheme');
    if (b) { b.textContent = light ? '☾' : '☀'; b.title = light ? 'Switch to dark mode' : 'Switch to light mode'; b.setAttribute('aria-label', b.title); }
  }
  function toggleTheme() {
    localStorage.setItem('econova_theme', document.body.classList.contains('v-light') ? 'dark' : 'light');
    applyTheme();
  }

  function bind() {
    injectPublicStyle();
    apply(getLang());
    applyTheme();
    const lang = document.getElementById('publicLang');
    const theme = document.getElementById('publicTheme');
    if (lang && !lang.dataset.econovaBound) { lang.addEventListener('click', toggleLanguage); lang.dataset.econovaBound='1'; }
    if (theme && !theme.dataset.econovaBound) { theme.addEventListener('click', toggleTheme); theme.dataset.econovaBound='1'; }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, {once:true});
  else bind();
  window.EconovaPublicI18n = {apply,getLang,setLang,toggleLanguage,applyTheme,toggleTheme};
})();