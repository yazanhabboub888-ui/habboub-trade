/* ECONOVA — deterministic public EN/AR translator.
   Translation is scoped to #econova-public-site only.
   Each text node keeps its original English value, so switching languages never
   translates already-translated Arabic back into a different string or scrambles DOM order. */
(() => {
  'use strict';

  const pairs = [
    ['Tools','الأدوات'],['How it works','كيف يعمل'],['Membership','الاشتراك'],['Stories','التجارب'],['Education','التعليم'],['Log in','تسجيل الدخول'],['Get started','ابدأ الآن'],
    ['ECONOVA INTELLIGENCE','ذكاء ECONOVA'],['See the market.','شوف السوق.'],['Before you trade.','قبل ما تتداول.'],
    ['A focused trading environment built to bring market context, structure, news, positioning and decision-support tools into one place — without adding more noise to your workflow.','بيئة تداول مركّزة تجمع سياق السوق، وهيكل السوق، والأخبار، والتمركزات، وأدوات دعم القرار في مكان واحد — بدون ضوضاء إضافية على طريقة عملك.'],
    ['Explore tools','استكشف الأدوات'],['Live market context','سياق السوق المباشر'],['Structured workflow','سير عمل منظّم'],['AI-assisted intelligence','ذكاء مدعوم بالذكاء الاصطناعي'],['LIVE MARKET ENVIRONMENT','بيئة السوق المباشرة'],['Market Context','سياق السوق'],['Market View','نظرة السوق'],
    ['Everything starts from one public dashboard.','كل شيء يبدأ من لوحة عامة واحدة.'],['Use the navigation to jump through the ECONOVA experience. The public site stays on one page; member tools remain inside the trading environment.','استخدم القائمة للتنقل داخل تجربة ECONOVA. الموقع العام يبقى في صفحة واحدة، بينما تبقى أدوات الأعضاء داخل بيئة التداول.'],
    ['Live Stream','البث المباشر'],['Live sessions and market context','جلسات مباشرة وسياق السوق'],['Follow live market sessions, commentary and context in a focused environment.','تابع جلسات السوق المباشرة والتعليق والسياق في بيئة مركّزة.'],['Daily Journal','السجل اليومي'],['Review and track your workflow','راجع سير عملك وتابعه'],['Record daily trades or backtests quickly, keep context and build a useful performance record.','سجّل صفقاتك اليومية أو اختباراتك بسرعة، واحتفظ بالسياق وابنِ سجل أداء مفيد.'],['Decision Support','دعم القرار'],['Organize context before execution','نظّم السياق قبل التنفيذ'],['Organize market context before execution without turning ECONOVA into a signal service.','نظّم سياق السوق قبل التنفيذ بدون تحويل ECONOVA إلى خدمة إشارات.'],['Market Intelligence','ذكاء السوق'],['Structure, macro, positioning and AI','الهيكل والاقتصاد والتمركزات والذكاء الاصطناعي'],['Market structure, institutional positioning, macro events and AI context in one layer.','هيكل السوق، والتمركز المؤسسي، والأحداث الاقتصادية، وسياق الذكاء الاصطناعي في طبقة واحدة.'],['Explore →','استكشف ←'],
    ['From raw data to readable context.','من البيانات الخام إلى سياق واضح.'],['ECONOVA organizes multiple layers of market information into a workflow you can actually follow.','تنظّم ECONOVA عدة طبقات من معلومات السوق ضمن سير عمل يمكنك متابعته فعليًا.'],
    ['01 · Live Data','01 · البيانات المباشرة'],['Prices and market conditions form the real-time foundation.','الأسعار وحالة السوق تشكّل الأساس اللحظي.'],['02 · Market Structure','02 · هيكل السوق'],['Structure and price behavior are translated into a clearer market view.','يتم تحويل سلوك السعر والهيكل إلى رؤية أوضح للسوق.'],['03 · Macro & News','03 · الاقتصاد والأخبار'],['Economic events and global news add the fundamental context.','الأحداث الاقتصادية والأخبار العالمية تضيف السياق الأساسي.'],['04 · Positioning','04 · التمركزات'],['Institutional positioning and COT context add another layer of evidence.','التمركز المؤسسي وسياق COT يضيفان طبقة أخرى من الأدلة.'],['05 · AI Intelligence','05 · ذكاء الذكاء الاصطناعي'],['AI helps combine the available context without replacing your judgment.','يساعد الذكاء الاصطناعي في جمع السياق المتاح بدون استبدال حكمك.'],['06 · Your Workflow','06 · طريقة عملك'],['You remain in control of the final decision and execution.','أنت تبقى صاحب القرار النهائي والتنفيذ.'],
    ['Choose the workflow that fits you.','اختَر سير العمل المناسب لك.'],['Membership plans can grow with your use of the ECONOVA environment.','يمكن لخطط العضوية أن تتوسع مع استخدامك لبيئة ECONOVA.'],['Essential','الأساسي'],['Core market context and a clean trading workflow for everyday use.','سياق السوق الأساسي وسير عمل تداول واضح للاستخدام اليومي.'],['Intelligence','الذكاء'],['Deeper market intelligence, news context and AI-assisted analysis.','ذكاء أعمق للسوق، وسياق للأخبار، وتحليل مدعوم بالذكاء الاصطناعي.'],['Full Workflow','سير العمل الكامل'],['Bring the broader ECONOVA toolkit together in one member environment.','اجمع أدوات ECONOVA الأوسع داخل بيئة أعضاء واحدة.'],['RECOMMENDED','موصى به'],['Start now','ابدأ الآن'],
    ['Built for better trading routines.','مصمّم لعادات تداول أفضل.'],['Real user stories should focus on workflow improvements and disciplined process — not unrealistic promises.','يجب أن تركز تجارب المستخدمين الحقيقية على تحسين سير العمل والانضباط، وليس على وعود غير واقعية.'],['Less noise','ضوضاء أقل'],['A cleaner view of the information that matters before a session.','رؤية أنظف للمعلومات المهمة قبل بدء الجلسة.'],['Better review','مراجعة أفضل'],['A repeatable journal process makes it easier to learn from previous sessions.','سجل متكرر ومنظم يجعل التعلم من الجلسات السابقة أسهل.'],['More context','سياق أكثر'],['Market structure, macro and positioning can be reviewed together.','يمكن مراجعة هيكل السوق والاقتصاد والتمركزات معًا.'],
    ['Learn the market context.','تعلّم سياق السوق.'],['Educational material for understanding structure, macro events, positioning and decision-making workflows.','محتوى تعليمي لفهم هيكل السوق والأحداث الاقتصادية والتمركزات وسير عمل اتخاذ القرار.'],['Understand how price behavior and structure shape the market environment.','افهم كيف يشكّل سلوك السعر والهيكل بيئة السوق.'],['Learn how major economic releases can change market conditions.','تعلّم كيف يمكن للإصدارات الاقتصادية المهمة تغيير حالة السوق.'],['Understand positioning and COT context without treating it as a standalone signal.','افهم التمركزات وسياق COT بدون اعتبارها إشارة مستقلة.'],['Build a consistent process for reviewing trades, ideas and market context.','ابنِ طريقة ثابتة لمراجعة الصفقات والأفكار وسياق السوق.'],
    ['READY WHEN YOU ARE','جاهز عندما تكون مستعدًا'],['Build a clearer trading workflow.','ابنِ طريقة تداول أوضح.'],['Explore the public experience, then create your account when you are ready to enter ECONOVA.','استكشف التجربة العامة، ثم أنشئ حسابك عندما تكون مستعدًا للدخول إلى ECONOVA.'],['View membership','عرض الاشتراك'],['Decision support, not financial advice.','أداة لدعم القرار وليست نصيحة مالية.']
  ];

  const forward = new Map(pairs);
  const reverse = new Map(pairs.map(([en, ar]) => [ar, en]));
  const ORIGINAL = 'econovaOriginalText';

  function originalTextNode(node) {
    if (!node[ORIGINAL]) node[ORIGINAL] = node.nodeValue;
    return node[ORIGINAL];
  }

  function translateRoot(lang) {
    const root = document.getElementById('econova-public-site');
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style')) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach(n => {
      const original = originalTextNode(n);
      const clean = original.trim();
      if (!clean) return;

      if (lang === 'ar') {
        const translated = forward.get(clean);
        if (translated) n.nodeValue = original.replace(clean, translated);
        else n.nodeValue = original;
      } else {
        n.nodeValue = original;
      }
    });

    document.querySelectorAll('#publicLang').forEach(btn => {
      btn.textContent = lang === 'ar' ? 'EN' : 'عربي';
      btn.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    });
  }

  function apply(lang) {
    const current = lang === 'ar' ? 'ar' : 'en';
    window.__ECONOVA_LANG__ = current;
    document.documentElement.lang = current;
    document.documentElement.dir = current === 'ar' ? 'rtl' : 'ltr';
    if (document.body) {
      document.body.classList.toggle('econova-ar', current === 'ar');
      document.body.classList.toggle('econova-en', current !== 'ar');
    }
    translateRoot(current);
  }

  function getLang() {
    try { return localStorage.getItem('habboub_language') === 'ar' ? 'ar' : 'en'; }
    catch (_) { return 'en'; }
  }

  function toggleLanguage() {
    const next = getLang() === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('habboub_language', next); } catch (_) {}
    apply(next);
  }

  function bind() {
    document.addEventListener('click', event => {
      if (event.target.closest('#publicLang')) {
        event.preventDefault();
        event.stopPropagation();
        toggleLanguage();
      }
    }, true);
  }

  window.EconovaPublicI18n = { apply, getLang, toggleLanguage };
  bind();

  function boot() {
    apply(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
