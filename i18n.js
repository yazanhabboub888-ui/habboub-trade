/* =========================================================
   ECONOVA — GLOBAL I18N
   Arabic / English language system

   Rules for future UI:
   1) Prefer data-i18n="key" for every user-facing string.
   2) For placeholders use data-i18n-placeholder="key".
   3) Add the same key to both en and ar below.
   4) Dynamic components can call window.HabboubI18n.apply().
========================================================= */

(function () {
  "use strict";

  const dictionary = {
    en: {
      login: "Login", logout: "Logout", profile: "Profile", register: "Register",
      create_account: "Create an account", welcome_back: "Welcome back",
      login_subtitle: "Enter your account to continue.", register_subtitle: "Join Econova Intelligence.",
      full_name: "Full Name", email: "Email", password: "Password", already_account: "Already have an account?",
      account: "Account", my_profile: "My Profile", logged_in_as: "Logged in as",
      login_success: "Login successful.", account_created: "Account created. Check your email if verification is enabled.",
      profile_updated: "Profile updated.", home: "Home", nav_home: "Home", nav_session: "Trading Session",
      nav_markets: "Markets", nav_intelligence: "Intelligence", nav_news: "News", nav_journal: "Journal",
      nav_live: "Live", nav_academy: "Academy", system_online: "ECONOVA INTELLIGENCE ONLINE",
      hero_title_1: "Understand the market.", hero_title_2: "Trade with context.",
      hero_description: "Econova combines market structure, Market Structure, Institutional Positioning, economic events and AI intelligence into one clear trading environment.",
      open_session: "Open Trading Session", view_markets: "View Markets", current_score: "CURRENT ECONOVA SCORE",
      market_condition: "Market Condition", risk: "Risk", overview: "OVERVIEW", market_overview: "Market Overview",
      ai_context: "AI Context", click_intelligence: "Open Intelligence →", session: "SESSION", trading_session: "Trading Session",
      session_subtitle: "Everything you need for one trading session, in one place.", habboub_score: "Econova Score",
      score_explanation: "Score reflects the overall market environment, not a BUY/SELL command.", market_context: "Market Context",
      symbol: "Symbol", htf_bias: "HTF Bias", liquidity: "Liquidity", mss: "MSS", fvg: "FVG", environment: "Environment",
      confidence: "Confidence", ict_context: "Market Structure", cot_positioning: "Institutional Positioning", session_timeline: "Session Timeline",
      why_score: "Why is the score here?", full_analysis: "Full Analysis →", waiting: "Waiting for data",
      waiting_analysis: "Econova will display the main factors here.", markets: "MARKETS", markets_title: "Market Watch",
      markets_subtitle: "Monitor the assets that matter.", intelligence_title: "Market Intelligence",
      intelligence_subtitle: "Understand what is influencing the environment.", ask_ai: "Ask Econova AI",
      current_analysis: "Current Analysis", market_regime: "Market Regime", risk_environment: "Risk Environment",
      risk_note: "Risk describes the environment. It is not a trade instruction.", news: "NEWS",
      news_title: "Economic Calendar & Impact", news_subtitle: "Major events can change the market environment quickly.",
      loading_news: "Loading news...", journal: "JOURNAL", journal_title: "Trading Journal",
      journal_subtitle: "Track execution, results and mistakes.", add_trade: "Add Trade", win_rate: "Win Rate",
      average_r: "Average R", drawdown: "Drawdown", trades: "Trades", recent_trades: "Recent Trades",
      no_trades: "No trades yet", add_first_trade: "Add your first trade to start building your journal.",
      live: "LIVE", live_title: "Live Room", live_subtitle: "Live market sessions and broadcasts.",
      no_live: "No live session right now", live_waiting: "The live room will appear here when the admin starts a session.",
      live_status: "Live Status", academy: "ACADEMY", academy_title: "Econova Academy",
      academy_subtitle: "Learn the concepts behind the analysis.", loading_courses: "Loading courses...",
      announcements: "ANNOUNCEMENTS", announcements_title: "Latest Updates", loading: "Loading...",
      journal_form_subtitle: "Save the important details of your trade.", save_trade: "Save Trade",
      ai_welcome: "Ask about the current market context, risk, news or ICT structure.",
      trend: "Trend", volatility: "Volatility", commercial: "Commercial", managed_money: "Managed Money",
      net_position: "Net Position", bias: "Bias", room: "Room", market: "Market", analysis: "Analysis",
      external_feed: "External feed", gold: "Gold", nasdaq_100: "Nasdaq 100", euro_dollar: "Euro / Dollar",
      bitcoin: "Bitcoin", profit_factor: "Profit Factor", setup: "Setup", result: "Result", r_result: "R Result",
      notes: "Notes", save: "Save", cancel: "Cancel", close: "Close", edit: "Edit", delete: "Delete",
      win: "Win", loss: "Loss", breakeven: "Breakeven", loading_analysis: "Waiting for market analysis...",
      waiting_data: "WAITING FOR DATA", waiting_short: "WAITING", ready: "Ready", offline: "OFFLINE", online: "ONLINE"
    },
    ar: {
      login: "تسجيل الدخول", logout: "تسجيل الخروج", profile: "الملف الشخصي", register: "إنشاء حساب",
      create_account: "إنشاء حساب", welcome_back: "أهلاً بعودتك", login_subtitle: "أدخل بيانات حسابك للمتابعة.",
      register_subtitle: "انضم إلى Econova Intelligence.", full_name: "الاسم الكامل", email: "البريد الإلكتروني",
      password: "كلمة المرور", already_account: "لديك حساب بالفعل؟", account: "الحساب", my_profile: "ملفي الشخصي",
      logged_in_as: "مسجل الدخول باسم", login_success: "تم تسجيل الدخول بنجاح.",
      account_created: "تم إنشاء الحساب. افحص بريدك الإلكتروني إذا كان تأكيد البريد مفعلاً.",
      profile_updated: "تم تحديث الملف الشخصي.", home: "الرئيسية", nav_home: "الرئيسية", nav_session: "جلسة التداول",
      nav_markets: "الأسواق", nav_intelligence: "الذكاء", nav_news: "الأخبار", nav_journal: "السجل",
      nav_live: "البث المباشر", nav_academy: "الأكاديمية", system_online: "نظام ECONOVA للذكاء يعمل الآن",
      hero_title_1: "افهم السوق.", hero_title_2: "تداول مع السياق.",
      hero_description: "يجمع Econova بين هيكل السوق وسياق ICT وتمركزات COT والأحداث الاقتصادية وذكاء الذكاء الاصطناعي في بيئة تداول واضحة.",
      open_session: "فتح جلسة التداول", view_markets: "عرض الأسواق", current_score: "مؤشر ECONOVA الحالي",
      market_condition: "حالة السوق", risk: "المخاطر", overview: "نظرة عامة", market_overview: "نظرة عامة على السوق",
      ai_context: "سياق الذكاء الاصطناعي", click_intelligence: "فتح الذكاء →", session: "الجلسة", trading_session: "جلسة التداول",
      session_subtitle: "كل ما تحتاجه لجلسة تداول واحدة، في مكان واحد.", habboub_score: "مؤشر Econova",
      score_explanation: "المؤشر يعكس حالة السوق العامة، وليس أمر شراء أو بيع.", market_context: "سياق السوق",
      symbol: "الأداة", htf_bias: "اتجاه الإطار العالي", liquidity: "السيولة", mss: "تغير هيكل السوق (MSS)",
      fvg: "فجوة القيمة العادلة (FVG)", environment: "بيئة السوق", confidence: "الثقة", ict_context: "سياق ICT",
      cot_positioning: "تمركزات COT", session_timeline: "تسلسل الجلسات", why_score: "لماذا المؤشر بهذا المستوى؟",
      full_analysis: "التحليل الكامل →", waiting: "بانتظار البيانات", waiting_analysis: "سيعرض Econova أهم العوامل هنا.",
      markets: "الأسواق", markets_title: "مراقبة الأسواق", markets_subtitle: "راقب الأصول المهمة.",
      intelligence_title: "ذكاء السوق", intelligence_subtitle: "افهم العوامل التي تؤثر على بيئة السوق.", ask_ai: "اسأل Econova AI",
      current_analysis: "التحليل الحالي", market_regime: "نظام السوق", risk_environment: "بيئة المخاطر",
      risk_note: "المخاطر تصف بيئة السوق، وليست توصية بصفقة.", news: "الأخبار", news_title: "التقويم الاقتصادي والتأثير",
      news_subtitle: "الأحداث المهمة قد تغيّر بيئة السوق بسرعة.", loading_news: "جارٍ تحميل الأخبار...", journal: "السجل",
      journal_title: "سجل التداول", journal_subtitle: "تابع تنفيذ صفقاتك ونتائجها وأخطاءك.", add_trade: "إضافة صفقة",
      win_rate: "نسبة الفوز", average_r: "متوسط R", drawdown: "السحب", trades: "الصفقات", recent_trades: "آخر الصفقات",
      no_trades: "لا توجد صفقات بعد", add_first_trade: "أضف أول صفقة لبدء بناء سجل التداول.", live: "مباشر",
      live_title: "غرفة البث المباشر", live_subtitle: "جلسات وبثوث السوق المباشرة.", no_live: "لا توجد جلسة مباشرة الآن",
      live_waiting: "ستظهر غرفة البث هنا عندما يبدأ المشرف جلسة.", live_status: "حالة البث", academy: "الأكاديمية",
      academy_title: "أكاديمية Econova", academy_subtitle: "تعلّم المفاهيم التي يعتمد عليها التحليل.",
      loading_courses: "جارٍ تحميل الدورات...", announcements: "الإعلانات", announcements_title: "آخر التحديثات",
      loading: "جارٍ التحميل...", journal_form_subtitle: "احفظ أهم تفاصيل صفقتك.", save_trade: "حفظ الصفقة",
      ai_welcome: "اسأل عن سياق السوق الحالي أو المخاطر أو الأخبار أو هيكل ICT.", trend: "الاتجاه", volatility: "التذبذب",
      commercial: "التجاريون", managed_money: "الأموال المُدارة", net_position: "صافي التمركز", bias: "الانحياز",
      room: "الغرفة", market: "السوق", analysis: "التحليل", external_feed: "مصدر خارجي", gold: "الذهب",
      nasdaq_100: "ناسداك 100", euro_dollar: "اليورو / الدولار", bitcoin: "بيتكوين", profit_factor: "عامل الربح",
      setup: "الإعداد", result: "النتيجة", r_result: "نتيجة R", notes: "ملاحظات", save: "حفظ", cancel: "إلغاء",
      close: "إغلاق", edit: "تعديل", delete: "حذف", win: "فوز", loss: "خسارة", breakeven: "تعادل",
      loading_analysis: "بانتظار أحدث تحليل للسوق...", waiting_data: "بانتظار البيانات", waiting_short: "بانتظار", ready: "جاهز",
      offline: "غير متصل", online: "متصل"
    }
  };

  const legacyText = {
    "Home": "nav_home", "Trading Session": "nav_session", "Markets": "nav_markets", "Intelligence": "nav_intelligence",
    "News": "nav_news", "Journal": "nav_journal", "Live": "nav_live", "Academy": "nav_academy",
    "AI ECONOMIC INTELLIGENCE": "nav_intelligence", "ECONOVA INTELLIGENCE ONLINE": "system_online",
    "Understand the market.": "hero_title_1", "Trade with context.": "hero_title_2", "Open Trading Session": "open_session",
    "View Markets": "view_markets", "CURRENT ECONOVA SCORE": "current_score", "Market Condition": "market_condition",
    "Risk": "risk", "OVERVIEW": "overview", "Market Overview": "market_overview", "AI Context": "ai_context",
    "Open Intelligence →": "click_intelligence", "SESSION": "session", "Trading Session": "trading_session",
    "Econova Score": "habboub_score", "Market Context": "market_context", "Symbol": "symbol", "HTF Bias": "htf_bias",
    "Liquidity": "liquidity", "MSS": "mss", "FVG": "fvg", "Environment": "environment", "Confidence": "confidence",
    "Market Structure": "ict_context", "Institutional Positioning": "cot_positioning", "Session Timeline": "session_timeline",
    "Why is the score here?": "why_score", "Full Analysis →": "full_analysis", "Waiting for data": "waiting",
    "Market Watch": "markets_title", "Monitor the assets that matter.": "markets_subtitle", "Gold": "gold",
    "Nasdaq 100": "nasdaq_100", "Euro / Dollar": "euro_dollar", "Bitcoin": "bitcoin", "External feed": "external_feed",
    "Market Intelligence": "intelligence_title", "Ask Econova AI": "ask_ai", "Current Analysis": "current_analysis",
    "Market Regime": "market_regime", "Trend": "trend", "Volatility": "volatility", "Commercial": "commercial",
    "Managed Money": "managed_money", "Net Position": "net_position", "Bias": "bias", "Risk Environment": "risk_environment",
    "NEWS": "news", "Economic Calendar & Impact": "news_title", "Loading news...": "loading_news",
    "JOURNAL": "journal", "Trading Journal": "journal_title", "Add Trade": "add_trade", "Win Rate": "win_rate",
    "Profit Factor": "profit_factor", "Average R": "average_r", "Drawdown": "drawdown", "Trades": "trades",
    "Recent Trades": "recent_trades", "No trades yet": "no_trades", "LIVE": "live", "Live Room": "live_title",
    "Live Status": "live_status", "Room": "room", "Market": "market", "Analysis": "analysis", "ACADEMY": "academy",
    "Econova Academy": "academy_title", "Loading courses...": "loading_courses", "ANNOUNCEMENTS": "announcements",
    "Latest Updates": "announcements_title", "Loading...": "loading", "Welcome back": "welcome_back",
    "Email": "email", "Password": "password", "Create an account": "create_account", "Register": "register",
    "Already have an account?": "already_account", "Setup": "setup", "Result": "result", "R Result": "r_result", "Notes": "notes",
    "Save Trade": "save_trade", "Win": "win", "Loss": "loss", "Breakeven": "breakeven"
  };

  function getLanguage() {
    try {
      return localStorage.getItem("habboub_language") === "ar" ? "ar" : "en";
    } catch (_) { return "en"; }
  }

  function setLanguage(language) {
    const lang = language === "ar" ? "ar" : "en";
    try { localStorage.setItem("habboub_language", lang); } catch (_) {}
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.language = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dictionary[lang][key] !== undefined) el.textContent = dictionary[lang][key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dictionary[lang][key] !== undefined) el.setAttribute("placeholder", dictionary[lang][key]);
    });

    const title = lang === "ar" ? "Econova — ذكاء التداول" : "Econova — AI ECONOMIC INTELLIGENCE";
    document.title = title;

    document.querySelectorAll("#langEN, #langAR").forEach((btn) => {
      const isAr = btn.id === "langAR";
      btn.classList.toggle("active", isAr === (lang === "ar"));
      btn.setAttribute("aria-pressed", String(isAr === (lang === "ar")));
    });

    translateLegacyText(document.body, lang);
  }

  function translateLegacyText(root, lang) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach((textNode) => {
      const parent = textNode.parentElement;
      if (!parent || parent.closest("script,style,noscript,textarea")) return;
      if (parent.hasAttribute("data-i18n") || parent.hasAttribute("data-i18n-placeholder")) return;
      const raw = textNode.nodeValue || "";
      const trimmed = raw.trim();
      if (!trimmed) return;
      const key = legacyText[trimmed];
      if (!key || dictionary[lang][key] === undefined) return;
      textNode.nodeValue = raw.replace(trimmed, dictionary[lang][key]);
    });
  }

  function apply() {
    setLanguage(getLanguage());
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const btn = event.target.closest("#langEN, #langAR");
      if (!btn) return;
      setLanguage(btn.id === "langAR" ? "ar" : "en");
    });

    const observer = new MutationObserver((mutations) => {
      let relevant = false;
      mutations.forEach((m) => {
        if (m.type === "childList" && m.addedNodes.length) relevant = true;
        if (m.type === "attributes" && (m.attributeName === "data-i18n" || m.attributeName === "data-i18n-placeholder")) relevant = true;
      });
      if (relevant) requestAnimationFrame(() => setLanguage(getLanguage()));
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-i18n", "data-i18n-placeholder"] });
  }

  window.HabboubI18n = {
    dictionary,
    getLanguage,
    setLanguage,
    apply
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { bind(); apply(); }, { once: true });
  } else {
    bind();
    apply();
  }
})();
