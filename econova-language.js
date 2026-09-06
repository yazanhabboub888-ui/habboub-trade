/* ECONOVA — stable bilingual UI layer
   Keeps Arabic/English switching deterministic and avoids text-node rewriting. */
(() => {
  'use strict';

  const PUBLIC = {
    en: {
      tools:'Tools', how:'How it works', membership:'Membership', stories:'Stories', education:'Education', login:'Log in', start:'Get started',
      kicker:'ECONOVA INTELLIGENCE', title1:'See the market.', title2:'Before you trade.',
      lead:'A focused trading environment built to bring market context, structure, news, positioning and decision-support tools into one place — without adding more noise to your workflow.',
      explore:'Explore tools', liveContext:'Live market context', workflow:'Structured workflow', ai:'AI-assisted intelligence', liveEnv:'LIVE MARKET ENVIRONMENT', context:'Market Context',
      marketView:'Market View', toolsTitle:'Everything starts from one public dashboard.', toolsCopy:'Use the navigation to jump through the ECONOVA experience. The public site stays on one page; member tools remain inside the trading environment.',
      liveStream:'Live Stream', liveStreamCopy:'Follow live market sessions, commentary and context in a focused environment.', journal:'Daily Journal', journalCopy:'Record daily trades or backtests quickly, keep context and build a useful performance record.', decision:'Decision Support', decisionCopy:'Organize market context before execution without turning ECONOVA into a signal service.', intelligence:'Market Intelligence', intelligenceCopy:'Market structure, institutional positioning, macro events and AI context in one layer.', exploreArrow:'Explore →',
      howTitle:'From raw data to readable context.', howCopy:'ECONOVA organizes multiple layers of market information into a workflow you can actually follow.',
      liveData:'01 · Live Data', liveDataCopy:'Prices and market conditions form the real-time foundation.', structure:'02 · Market Structure', structureCopy:'Structure and price behavior are translated into a clearer market view.', macro:'03 · Macro & News', macroCopy:'Economic events and global news add the fundamental context.', positioning:'04 · Positioning', positioningCopy:'Institutional positioning and COT context add another layer of evidence.', aiTitle:'05 · AI Intelligence', aiCopy:'AI helps combine the available context without replacing your judgment.', workflowTitle:'06 · Your Workflow', workflowCopy:'You remain in control of the final decision and execution.',
      pricingTitle:'Choose the workflow that fits you.', pricingCopy:'Membership plans can grow with your use of the ECONOVA environment.', essential:'Essential', essentialCopy:'Core market context and a clean trading workflow for everyday use.', intelPlan:'Intelligence', intelCopy:'Deeper market intelligence, news context and AI-assisted analysis.', fullWorkflow:'Full Workflow', fullCopy:'Bring the broader ECONOVA toolkit together in one member environment.', recommended:'RECOMMENDED', startNow:'Start now',
      storiesTitle:'Built for better trading routines.', storiesCopy:'Real user stories should focus on workflow improvements and disciplined process — not unrealistic promises.', lessNoise:'Less noise', lessNoiseCopy:'A cleaner view of the information that matters before a session.', betterReview:'Better review', betterReviewCopy:'A repeatable journal process makes it easier to learn from previous sessions.', moreContext:'More context', moreContextCopy:'Market structure, macro and positioning can be reviewed together.',
      eduTitle:'Learn the market context.', eduCopy:'Educational material for understanding structure, macro events, positioning and decision-making workflows.', marketStructure:'Market Structure', marketStructureCopy:'Understand how price behavior and structure shape the market environment.', macroEvents:'Macro & Economic Events', macroEventsCopy:'Learn how major economic releases can change market conditions.', institutional:'Institutional Positioning', institutionalCopy:'Understand positioning and COT context without treating it as a standalone signal.', journalReview:'Trading Journal & Review', journalReviewCopy:'Build a consistent process for reviewing trades, ideas and market context.',
      ready:'READY WHEN YOU ARE', ctaTitle:'Build a clearer trading workflow.', ctaCopy:'Explore the public experience, then create your account when you are ready to enter ECONOVA.', viewMembership:'View membership', disclaimer:'Decision support, not financial advice.'
    },
    ar: {
      tools:'الأدوات', how:'كيف يعمل', membership:'الاشتراك', stories:'التجارب', education:'التعليم', login:'تسجيل الدخول', start:'ابدأ الآن',
      kicker:'ذكاء ECONOVA', title1:'شوف السوق.', title2:'قبل ما تتداول.',
      lead:'بيئة تداول مركّزة تجمع سياق السوق، وهيكل السوق، والأخبار، والتمركزات، وأدوات دعم القرار في مكان واحد — بدون ضوضاء إضافية على طريقة عملك.',
      explore:'استكشف الأدوات', liveContext:'سياق السوق المباشر', workflow:'سير عمل منظّم', ai:'ذكاء مدعوم بالذكاء الاصطناعي', liveEnv:'بيئة السوق المباشرة', context:'سياق السوق',
      marketView:'نظرة السوق', toolsTitle:'كل شيء يبدأ من لوحة عامة واحدة.', toolsCopy:'استخدم القائمة للتنقل داخل تجربة ECONOVA. الموقع العام يبقى في صفحة واحدة، بينما تبقى أدوات الأعضاء داخل بيئة التداول.',
      liveStream:'البث المباشر', liveStreamCopy:'تابع جلسات السوق المباشرة والتعليق والسياق في بيئة مركّزة.', journal:'السجل اليومي', journalCopy:'سجّل صفقاتك اليومية أو اختباراتك بسرعة، واحتفظ بالسياق وابنِ سجل أداء مفيد.', decision:'دعم القرار', decisionCopy:'نظّم سياق السوق قبل التنفيذ بدون تحويل ECONOVA إلى خدمة إشارات.', intelligence:'ذكاء السوق', intelligenceCopy:'هيكل السوق، والتمركز المؤسسي، والأحداث الاقتصادية، وسياق الذكاء الاصطناعي في طبقة واحدة.', exploreArrow:'استكشف ←',
      howTitle:'من البيانات الخام إلى سياق واضح.', howCopy:'تنظّم ECONOVA عدة طبقات من معلومات السوق ضمن سير عمل يمكنك متابعته فعليًا.',
      liveData:'01 · البيانات المباشرة', liveDataCopy:'الأسعار وحالة السوق تشكّل الأساس اللحظي.', structure:'02 · هيكل السوق', structureCopy:'يتم تحويل سلوك السعر والهيكل إلى رؤية أوضح للسوق.', macro:'03 · الاقتصاد والأخبار', macroCopy:'الأحداث الاقتصادية والأخبار العالمية تضيف السياق الأساسي.', positioning:'04 · التمركزات', positioningCopy:'التمركز المؤسسي وسياق COT يضيفان طبقة أخرى من الأدلة.', aiTitle:'05 · ذكاء الذكاء الاصطناعي', aiCopy:'يساعد الذكاء الاصطناعي في جمع السياق المتاح بدون استبدال حكمك.', workflowTitle:'06 · طريقة عملك', workflowCopy:'أنت تبقى صاحب القرار النهائي والتنفيذ.',
      pricingTitle:'اختَر سير العمل المناسب لك.', pricingCopy:'يمكن لخطط العضوية أن تتوسع مع استخدامك لبيئة ECONOVA.', essential:'الأساسي', essentialCopy:'سياق السوق الأساسي وسير عمل تداول واضح للاستخدام اليومي.', intelPlan:'الذكاء', intelCopy:'ذكاء أعمق للسوق، وسياق للأخبار، وتحليل مدعوم بالذكاء الاصطناعي.', fullWorkflow:'سير العمل الكامل', fullCopy:'اجمع أدوات ECONOVA الأوسع داخل بيئة أعضاء واحدة.', recommended:'موصى به', startNow:'ابدأ الآن',
      storiesTitle:'مصمّم لعادات تداول أفضل.', storiesCopy:'يجب أن تركز تجارب المستخدمين الحقيقية على تحسين سير العمل والانضباط، وليس على وعود غير واقعية.', lessNoise:'ضوضاء أقل', lessNoiseCopy:'رؤية أنظف للمعلومات المهمة قبل بدء الجلسة.', betterReview:'مراجعة أفضل', betterReviewCopy:'سجل متكرر ومنظم يجعل التعلم من الجلسات السابقة أسهل.', moreContext:'سياق أكثر', moreContextCopy:'يمكن مراجعة هيكل السوق والاقتصاد والتمركزات معًا.',
      eduTitle:'تعلّم سياق السوق.', eduCopy:'محتوى تعليمي لفهم هيكل السوق والأحداث الاقتصادية والتمركزات وسير عمل اتخاذ القرار.', marketStructure:'هيكل السوق', marketStructureCopy:'افهم كيف يشكّل سلوك السعر والهيكل بيئة السوق.', macroEvents:'الأحداث الاقتصادية والكلية', macroEventsCopy:'تعلّم كيف يمكن للإصدارات الاقتصادية المهمة تغيير حالة السوق.', institutional:'التمركز المؤسسي', institutionalCopy:'افهم التمركزات وسياق COT بدون اعتبارها إشارة مستقلة.', journalReview:'سجل التداول والمراجعة', journalReviewCopy:'ابنِ طريقة ثابتة لمراجعة الصفقات والأفكار وسياق السوق.',
      ready:'جاهز عندما تكون مستعدًا', ctaTitle:'ابنِ طريقة تداول أوضح.', ctaCopy:'استكشف التجربة العامة، ثم أنشئ حسابك عندما تكون مستعدًا للدخول إلى ECONOVA.', viewMembership:'عرض الاشتراك', disclaimer:'أداة لدعم القرار وليست نصيحة مالية.'
    }
  };

  function text(selector, key) {
    document.querySelectorAll(selector).forEach(el => {
      const value = PUBLIC[window.__ECONOVA_LANG__ || 'en'][key];
      if (value != null) el.textContent = value;
    });
  }

  function applyPublic(lang) {
    const l = lang === 'ar' ? 'ar' : 'en';
    window.__ECONOVA_LANG__ = l;
    const root = document.documentElement;
    root.lang = l;
    root.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('econova-ar', l === 'ar');
    document.body.classList.toggle('econova-en', l !== 'ar');
    const s = PUBLIC[l];
    const map = {
      '.public-tools-link':'tools','.public-how-link':'how','.public-pricing-link':'membership','.public-stories-link':'stories','.public-education-link':'education','.public-login':'login','.public-start':'start',
      '.public-kicker':'kicker','.public-title-1':'title1','.public-title-2':'title2','.public-lead':'lead','.public-explore':'explore','.public-proof-live':'liveContext','.public-proof-workflow':'workflow','.public-proof-ai':'ai',
      '.public-live-env':'liveEnv','.public-context':'context','.public-market-view':'marketView','.public-tools-title':'toolsTitle','.public-tools-copy':'toolsCopy',
      '.public-live-stream':'liveStream','.public-live-stream-copy':'liveStreamCopy','.public-journal':'journal','.public-journal-copy':'journalCopy','.public-decision':'decision','.public-decision-copy':'decisionCopy','.public-intelligence':'intelligence','.public-intelligence-copy':'intelligenceCopy','.public-explore-arrow':'exploreArrow',
      '.public-how-title':'howTitle','.public-how-copy':'howCopy','.public-live-data':'liveData','.public-live-data-copy':'liveDataCopy','.public-structure':'structure','.public-structure-copy':'structureCopy','.public-macro':'macro','.public-macro-copy':'macroCopy','.public-positioning':'positioning','.public-positioning-copy':'positioningCopy','.public-ai-title':'aiTitle','.public-ai-copy':'aiCopy','.public-workflow-title':'workflowTitle','.public-workflow-copy':'workflowCopy',
      '.public-pricing-title':'pricingTitle','.public-pricing-copy':'pricingCopy','.public-essential':'essential','.public-essential-copy':'essentialCopy','.public-intel-plan':'intelPlan','.public-intel-copy':'intelCopy','.public-full-workflow':'fullWorkflow','.public-full-copy':'fullCopy','.public-recommended':'recommended','.public-start-now':'startNow',
      '.public-stories-title':'storiesTitle','.public-stories-copy':'storiesCopy','.public-less-noise':'lessNoise','.public-less-noise-copy':'lessNoiseCopy','.public-better-review':'betterReview','.public-better-review-copy':'betterReviewCopy','.public-more-context':'moreContext','.public-more-context-copy':'moreContextCopy',
      '.public-edu-title':'eduTitle','.public-edu-copy':'eduCopy','.public-market-structure':'marketStructure','.public-market-structure-copy':'marketStructureCopy','.public-macro-events':'macroEvents','.public-macro-events-copy':'macroEventsCopy','.public-institutional':'institutional','.public-institutional-copy':'institutionalCopy','.public-journal-review':'journalReview','.public-journal-review-copy':'journalReviewCopy',
      '.public-ready':'ready','.public-cta-title':'ctaTitle','.public-cta-copy':'ctaCopy','.public-view-membership':'viewMembership','.public-disclaimer':'disclaimer'
    };
    Object.entries(map).forEach(([selector,key]) => text(selector,key));
    document.querySelectorAll('#publicLang').forEach(b => b.textContent = l === 'ar' ? 'EN' : 'عربي');
  }

  function getLang(){ try { return localStorage.getItem('habboub_language') === 'ar' ? 'ar' : 'en'; } catch(e){ return 'en'; } }
  function setLang(lang){ try { localStorage.setItem('habboub_language', lang); } catch(e){} applyPublic(lang); if (window.HabboubI18n?.setLanguage) window.HabboubI18n.setLanguage(lang); }

  function bind(){
    document.addEventListener('click', e => {
      const b = e.target.closest('#publicLang');
      if (b) setLang(getLang() === 'ar' ? 'en' : 'ar');
      const menu = document.getElementById('publicMenu');
      if (e.target.closest('#publicMenu')) document.getElementById('publicMobileMenu')?.classList.toggle('open');
    });
    applyPublic(getLang());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, {once:true}); else bind();
})();