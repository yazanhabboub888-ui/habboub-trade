/* ECONOVA — complete public EN/AR language switcher. */
(() => {
  'use strict';
  const T={
    'Tools':'الأدوات','How it works':'كيف يعمل','Membership':'الاشتراك','Stories':'التجارب','Education':'التعليم','Log in':'تسجيل الدخول','Get started':'ابدأ الآن',
    'AI ECONOMIC INTELLIGENCE':'الذكاء الاقتصادي بالذكاء الاصطناعي','ECONOVA INTELLIGENCE':'ذكاء ECONOVA','See the market.':'شوف السوق.','Before you trade.':'قبل ما تتداول.',
    'A focused trading environment built to bring market context, structure, news, positioning and decision-support tools into one place — without adding more noise to your workflow.':'بيئة تداول مركّزة تجمع سياق السوق، وهيكل السوق، والأخبار، والتمركزات، وأدوات دعم القرار في مكان واحد — بدون ضوضاء إضافية على طريقة عملك.',
    'Explore tools':'استكشف الأدوات','Live market context':'سياق السوق المباشر','Structured workflow':'سير عمل منظّم','AI-assisted intelligence':'ذكاء مدعوم بالذكاء الاصطناعي',
    'LIVE MARKET ENVIRONMENT':'بيئة السوق المباشرة','● LIVE':'● مباشر','Market Context':'سياق السوق','Market View':'نظرة السوق',
    'Structure, macro events, positioning and AI context — combined into one readable environment.':'هيكل السوق، والأحداث الاقتصادية، والتمركزات، وسياق الذكاء الاصطناعي — مجتمعة في بيئة واضحة وسهلة القراءة.',
    'Everything starts from one public dashboard.':'كل شيء يبدأ من لوحة عامة واحدة.','Use the navigation to jump through the ECONOVA experience. The public site stays on one page; member tools remain inside the trading environment.':'استخدم القائمة للتنقل داخل تجربة ECONOVA. الموقع العام يبقى في صفحة واحدة، بينما تبقى أدوات الأعضاء داخل بيئة التداول.',
    'Live Stream':'البث المباشر','Live sessions and market context':'جلسات مباشرة وسياق السوق','Follow live market sessions, commentary and context in a focused environment.':'تابع جلسات السوق المباشرة والتعليق والسياق في بيئة مركّزة.',
    'Daily Journal':'السجل اليومي','Review and track your workflow':'راجع سير عملك وتابعه','Record daily trades or backtests quickly, keep context and build a useful performance record.':'سجّل صفقاتك اليومية أو اختباراتك بسرعة، واحتفظ بالسياق وابنِ سجل أداء مفيد.',
    'Decision Support':'دعم القرار','Organize context before execution':'نظّم السياق قبل التنفيذ','Organize market context before execution without turning ECONOVA into a signal service.':'نظّم سياق السوق قبل التنفيذ بدون تحويل ECONOVA إلى خدمة إشارات.',
    'Market Intelligence':'ذكاء السوق','Structure, macro, positioning and AI':'الهيكل والاقتصاد والتمركزات والذكاء الاصطناعي','Market structure, institutional positioning, macro events and AI context in one layer.':'هيكل السوق، والتمركز المؤسسي، والأحداث الاقتصادية، وسياق الذكاء الاصطناعي في طبقة واحدة.','Explore →':'استكشف ←',
    '01 · TOOLS':'01 · الأدوات','02 · HOW IT WORKS':'02 · كيف يعمل','03 · MEMBERSHIP':'03 · الاشتراك','04 · STORIES':'04 · التجارب','05 · EDUCATION':'05 · التعليم',
    'From raw data to readable context.':'من البيانات الخام إلى سياق واضح.','ECONOVA organizes multiple layers of market information into a workflow you can actually follow.':'تنظّم ECONOVA عدة طبقات من معلومات السوق ضمن سير عمل يمكنك متابعته فعليًا.',
    '01 · Live Data':'01 · البيانات المباشرة','Prices and market conditions form the real-time foundation.':'الأسعار وحالة السوق تشكّل الأساس اللحظي.',
    '02 · Market Structure':'02 · هيكل السوق','Market Structure':'هيكل السوق','Structure and price behavior are translated into a clearer market view.':'يتم تحويل سلوك السعر والهيكل إلى رؤية أوضح للسوق.',
    '03 · Macro & News':'03 · الاقتصاد والأخبار','Economic events and global news add the fundamental context.':'الأحداث الاقتصادية والأخبار العالمية تضيف السياق الأساسي.',
    '04 · Positioning':'04 · التمركزات','Institutional Positioning':'التمركز المؤسسي','Institutional positioning and COT context add another layer of evidence.':'التمركز المؤسسي وسياق COT يضيفان طبقة أخرى من الأدلة.',
    '05 · AI Intelligence':'05 · ذكاء الذكاء الاصطناعي','AI helps combine the available context without replacing your judgment.':'يساعد الذكاء الاصطناعي في جمع السياق المتاح بدون استبدال حكمك.',
    '06 · Your Workflow':'06 · طريقة عملك','You remain in control of the final decision and execution.':'أنت تبقى صاحب القرار النهائي والتنفيذ.',
    'Choose the workflow that fits you.':'اختَر سير العمل المناسب لك.','Membership plans can grow with your use of the ECONOVA environment.':'يمكن لخطط العضوية أن تتوسع مع استخدامك لبيئة ECONOVA.',
    'Essential':'الأساسي','Core market context and a clean trading workflow for everyday use.':'سياق السوق الأساسي وسير عمل تداول واضح للاستخدام اليومي.',
    'Intelligence':'الذكاء','Deeper market intelligence, news context and AI-assisted analysis.':'ذكاء أعمق للسوق، وسياق للأخبار، وتحليل مدعوم بالذكاء الاصطناعي.',
    'Full Workflow':'سير العمل الكامل','Bring the broader ECONOVA toolkit together in one member environment.':'اجمع أدوات ECONOVA الأوسع داخل بيئة أعضاء واحدة.','RECOMMENDED':'موصى به','Start now':'ابدأ الآن',
    'Built for better trading routines.':'مصمّم لعادات تداول أفضل.','Real user stories should focus on workflow improvements and disciplined process — not unrealistic promises.':'يجب أن تركز تجارب المستخدمين الحقيقية على تحسين سير العمل والانضباط، وليس على وعود غير واقعية.',
    'Less noise':'ضوضاء أقل','A cleaner view of the information that matters before a session.':'رؤية أنظف للمعلومات المهمة قبل بدء الجلسة.',
    'Better review':'مراجعة أفضل','A repeatable journal process makes it easier to learn from previous sessions.':'سجل متكرر ومنظم يجعل التعلم من الجلسات السابقة أسهل.',
    'More context':'سياق أكثر','Market structure, macro and positioning can be reviewed together.':'يمكن مراجعة هيكل السوق والاقتصاد والتمركزات معًا.',
    'Learn the market context.':'تعلّم سياق السوق.','Educational material for understanding structure, macro events, positioning and decision-making workflows.':'محتوى تعليمي لفهم هيكل السوق والأحداث الاقتصادية والتمركزات وسير عمل اتخاذ القرار.',
    'Understand how price behavior and structure shape the market environment.':'افهم كيف يشكّل سلوك السعر والهيكل بيئة السوق.',
    'Macro & Economic Events':'الأحداث الاقتصادية والكلية','Learn how major economic releases can change market conditions.':'تعلّم كيف يمكن للإصدارات الاقتصادية المهمة تغيير حالة السوق.',
    'Understand positioning and COT context without treating it as a standalone signal.':'افهم التمركزات وسياق COT بدون اعتبارها إشارة مستقلة.',
    'Trading Journal & Review':'سجل التداول والمراجعة','Build a consistent process for reviewing trades, ideas and market context.':'ابنِ طريقة ثابتة لمراجعة الصفقات والأفكار وسياق السوق.',
    'READY WHEN YOU ARE':'جاهز عندما تكون مستعدًا','Build a clearer trading workflow.':'ابنِ طريقة تداول أوضح.',
    'Explore the public experience, then create your account when you are ready to enter ECONOVA.':'استكشف التجربة العامة، ثم أنشئ حسابك عندما تكون مستعدًا للدخول إلى ECONOVA.',
    'View membership':'عرض الاشتراك','Decision support, not financial advice.':'أداة لدعم القرار وليست نصيحة مالية.',
    '© 2026 ECONOVA — AI ECONOMIC INTELLIGENCE':'© 2026 ECONOVA — الذكاء الاقتصادي بالذكاء الاصطناعي',
    'Decision support, not financial advice.':'أداة لدعم القرار وليست نصيحة مالية.'
  };
  const originals=new WeakMap();
  const root=()=>document.getElementById('econova-public-site');
  function translate(lang){
    const r=root(); if(!r)return;
    const ar=lang==='ar';
    const walker=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||p.closest('script,style,noscript,template')||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
    const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(node=>{if(!originals.has(node))originals.set(node,node.nodeValue);const original=originals.get(node),clean=original.trim(),translated=T[clean];node.nodeValue=ar&&translated?original.replace(clean,translated):original;});
    document.documentElement.lang=ar?'ar':'en';
    document.documentElement.dir=ar?'rtl':'ltr';
    document.body.classList.toggle('econova-ar',ar);document.body.classList.toggle('econova-en',!ar);
    document.querySelectorAll('#publicLang').forEach(b=>{b.textContent=ar?'EN':'عربي';b.setAttribute('aria-label',ar?'Switch to English':'التبديل إلى العربية');});
  }
  function getLang(){try{return localStorage.getItem('habboub_language')==='ar'?'ar':'en'}catch(_){return'en'}}
  function setLang(lang){const l=lang==='ar'?'ar':'en';try{localStorage.setItem('habboub_language',l)}catch(_){}translate(l)}
  document.addEventListener('click',e=>{const b=e.target.closest('#publicLang');if(!b)return;e.preventDefault();e.stopImmediatePropagation();setLang(getLang()==='ar'?'en':'ar')},true);
  const observer=new MutationObserver(()=>{if(window.__ECONOVA_I18N_LOCK__)return;window.__ECONOVA_I18N_LOCK__=true;requestAnimationFrame(()=>{window.__ECONOVA_I18N_LOCK__=false;translate(getLang())})});
  function boot(){translate(getLang());const r=root();if(r)observer.observe(r,{childList:true,subtree:true})}
  window.EconovaPublicI18n={apply:translate,getLang,setLang,toggleLanguage:()=>setLang(getLang()==='ar'?'en':'ar')};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
