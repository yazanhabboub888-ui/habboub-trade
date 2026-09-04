const SUPABASE_URL = "https://feoyjasuvrqxzhskqzye.supabase.co";
const SUPABASE_KEY = "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const state = {
  language: localStorage.getItem("habboub_language") || "en",
  analysis: null,
  journal: [],
  news: [],
  announcements: [],
  courses: [],
  live: null,
  lastUpdated: null
};

const translations = {
  en: {
    nav_home: "Home",
    nav_session: "Trading Session",
    nav_markets: "Markets",
    nav_intelligence: "Intelligence",
    nav_news: "News",
    nav_journal: "Journal",
    nav_live: "Live",
    nav_academy: "Academy",
    login: "Login",
    system_online: "HABBOUB INTELLIGENCE ONLINE",
    hero_title_1: "Understand the market.",
    hero_title_2: "Trade with context.",
    hero_description: "Habboub combines market structure, ICT context, COT positioning, economic events and AI intelligence into one clear trading environment.",
    open_session: "Open Trading Session",
    view_markets: "View Markets",
    current_score: "CURRENT HABBOUB SCORE",
    market_condition: "Market Condition",
    risk: "Risk",
    overview: "OVERVIEW",
    market_overview: "Market Overview",
    ai_context: "AI Context",
    click_intelligence: "Open Intelligence →",
    session: "SESSION",
    trading_session: "Trading Session",
    session_subtitle: "Everything you need for one trading session, in one place.",
    habboub_score: "Habboub Score",
    score_explanation: "Score reflects the overall market environment, not a BUY/SELL command.",
    market_context: "Market Context",
    symbol: "Symbol",
    htf_bias: "HTF Bias",
    liquidity: "Liquidity",
    mss: "MSS",
    fvg: "FVG",
    environment: "Environment",
    confidence: "Confidence",
    ict_context: "ICT Context",
    cot_positioning: "COT Positioning",
    session_timeline: "Session Timeline",
    why_score: "Why is the score here?",
    full_analysis: "Full Analysis →",
    waiting: "Waiting for data",
    waiting_analysis: "Habboub will display the main factors here.",
    markets: "MARKETS",
    markets_title: "Market Watch",
    markets_subtitle: "Monitor the assets that matter.",
    intelligence_title: "Market Intelligence",
    intelligence_subtitle: "Understand what is influencing the environment.",
    ask_ai: "Ask Habboub AI",
    current_analysis: "Current Analysis",
    market_regime: "Market Regime",
    risk_environment: "Risk Environment",
    risk_note: "Risk describes the environment. It is not a trade instruction.",
    news: "NEWS",
    news_title: "Economic Calendar & Impact",
    news_subtitle: "Major events can change the market environment quickly.",
    loading_news: "Loading news...",
    journal: "JOURNAL",
    journal_title: "Trading Journal",
    journal_subtitle: "Track execution, results and mistakes.",
    add_trade: "Add Trade",
    win_rate: "Win Rate",
    average_r: "Average R",
    drawdown: "Drawdown",
    trades: "Trades",
    recent_trades: "Recent Trades",
    no_trades: "No trades yet",
    add_first_trade: "Add your first trade to start building your journal.",
    live: "LIVE",
    live_title: "Live Room",
    live_subtitle: "Live market sessions and broadcasts.",
    no_live: "No live session right now",
    live_waiting: "The live room will appear here when the admin starts a session.",
    live_status: "Live Status",
    academy: "ACADEMY",
    academy_title: "Habboub Academy",
    academy_subtitle: "Learn the concepts behind the analysis.",
    loading_courses: "Loading courses...",
    announcements: "ANNOUNCEMENTS",
    announcements_title: "Latest Updates",
    loading: "Loading...",
    welcome_back: "Welcome back",
    login_subtitle: "Enter your account to continue.",
    create_account: "Create an account",
    register: "Register",
    register_subtitle: "Join Habboub Intelligence.",
    already_account: "Already have an account?",
    journal_form_subtitle: "Save the important details of your trade.",
    save_trade: "Save Trade",
    ai_welcome: "Ask about the current market context, risk, news or ICT structure."
  },

  ar: {
    nav_home: "الرئيسية",
    nav_session: "جلسة التداول",
    nav_markets: "الأسواق",
    nav_intelligence: "الذكاء",
    nav_news: "الأخبار",
    nav_journal: "السجل",
    nav_live: "البث المباشر",
    nav_academy: "الأكاديمية",
    login: "تسجيل الدخول",
    system_online: "نظام حبوب يعمل الآن",
    hero_title_1: "افهم السوق.",
    hero_title_2: "تداول مع السياق.",
    hero_description: "يجمع حبوب هيكل السوق وسياق ICT وتمركزات COT والأحداث الاقتصادية وذكاء الذكاء الاصطناعي في بيئة تداول واحدة واضحة.",
    open_session: "افتح جلسة التداول",
    view_markets: "عرض الأسواق",
    current_score: "درجة حبوب الحالية",
    market_condition: "حالة السوق",
    risk: "المخاطرة",
    overview: "نظرة عامة",
    market_overview: "نظرة عامة على السوق",
    ai_context: "سياق الذكاء الاصطناعي",
    click_intelligence: "افتح الذكاء →",
    session: "الجلسة",
    trading_session: "جلسة التداول",
    session_subtitle: "كل ما تحتاجه لجلسة تداول واحدة في مكان واحد.",
    habboub_score: "درجة حبوب",
    score_explanation: "الدرجة تصف بيئة السوق العامة وليست أمر شراء أو بيع.",
    market_context: "سياق السوق",
    symbol: "الأصل",
    htf_bias: "اتجاه HTF",
    liquidity: "السيولة",
    mss: "MSS",
    fvg: "FVG",
    environment: "البيئة",
    confidence: "الثقة",
    ict_context: "سياق ICT",
    cot_positioning: "تمركزات COT",
    session_timeline: "مراحل الجلسة",
    why_score: "لماذا الدرجة بهذا الشكل؟",
    full_analysis: "التحليل الكامل →",
    waiting: "بانتظار البيانات",
    waiting_analysis: "سيعرض حبوب أهم العوامل هنا.",
    markets: "الأسواق",
    markets_title: "مراقبة الأسواق",
    markets_subtitle: "راقب الأصول المهمة.",
    intelligence_title: "ذكاء السوق",
    intelligence_subtitle: "افهم العوامل التي تؤثر على البيئة.",
    ask_ai: "اسأل حبوب AI",
    current_analysis: "التحليل الحالي",
    market_regime: "نظام السوق",
    risk_environment: "بيئة المخاطرة",
    risk_note: "المخاطرة تصف البيئة وليست توصية تداول.",
    news: "الأخبار",
    news_title: "الأجندة الاقتصادية والتأثير",
    news_subtitle: "الأحداث الكبرى يمكن أن تغير بيئة السوق بسرعة.",
    loading_news: "جاري تحميل الأخبار...",
    journal: "السجل",
    journal_title: "سجل التداول",
    journal_subtitle: "تابع التنفيذ والنتائج والأخطاء.",
    add_trade: "إضافة صفقة",
    win_rate: "نسبة الفوز",
    average_r: "متوسط R",
    drawdown: "السحب",
    trades: "الصفقات",
    recent_trades: "آخر الصفقات",
    no_trades: "لا توجد صفقات",
    add_first_trade: "أضف أول صفقة لبدء بناء سجل التداول.",
    live: "مباشر",
    live_title: "غرفة البث",
    live_subtitle: "جلسات السوق والبث المباشر.",
    no_live: "لا توجد جلسة مباشرة الآن",
    live_waiting: "سيظهر البث هنا عندما يبدأ المسؤول الجلسة.",
    live_status: "حالة البث",
    academy: "الأكاديمية",
    academy_title: "أكاديمية حبوب",
    academy_subtitle: "تعلم المفاهيم التي يعتمد عليها التحليل.",
    loading_courses: "جاري تحميل الدورات...",
    announcements: "الإعلانات",
    announcements_title: "آخر التحديثات",
    loading: "جاري التحميل...",
    welcome_back: "أهلًا بعودتك",
    login_subtitle: "أدخل حسابك للمتابعة.",
    create_account: "إنشاء حساب",
    register: "تسجيل",
    register_subtitle: "انضم إلى Habboub Intelligence.",
    already_account: "لديك حساب بالفعل؟",
    journal_form_subtitle: "احفظ المعلومات المهمة عن صفقتك.",
    save_trade: "حفظ الصفقة",
    ai_welcome: "اسأل عن سياق السوق الحالي أو المخاطرة أو الأخبار أو هيكل ICT."
  }
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  applyLanguage(state.language);
  setupNavigation();
  setupLanguage();
  setupModals();
  setupAI();
  setupMobileMenu();

  setTimeout(() => {
    document.getElementById("loader")?.classList.add("hide");
  }, 500);

  updateClock();
  setInterval(updateClock, 1000);

  updateSessionTimeline();

  await Promise.allSettled([
    loadMarketAnalysis(),
    loadJournal(),
    loadAnnouncements(),
    loadCourses(),
    loadLive(),
    loadNews()
  ]);

  subscribeToUpdates();
}

function $(id) {
  return document.getElementById(id);
}

/* LANGUAGE */

function setupLanguage() {
  $("langEN")?.addEventListener("click", () => changeLanguage("en"));
  $("langAR")?.addEventListener("click", () => changeLanguage("ar"));
}

function changeLanguage(language) {
  state.language = language;
  localStorage.setItem("habboub_language", language);
  applyLanguage(language);
  renderNews();
}

function applyLanguage(language) {
  const isArabic = language === "ar";

  document.documentElement.lang = language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) {
      element.textContent = translations[language][key];
    }
  });

  $("langEN")?.classList.toggle("active", language === "en");
  $("langAR")?.classList.toggle("active", language === "ar");
}

/* NAVIGATION */

function setupNavigation() {
  document.querySelectorAll("[data-nav]").forEach((element) => {
    element.addEventListener("click", () => {
      const target = element.dataset.nav;
      showSection(target);
    });
  });
}

function showSection(sectionId) {
  const target = document.getElementById(sectionId);

  if (!target) return;

  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active-section");
  });

  target.classList.add("active-section");

  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.nav === sectionId
    );
  });

  $("mobileNav")?.classList.remove("open");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* MOBILE */

function setupMobileMenu() {
  $("mobileMenuButton")?.addEventListener("click", () => {
    $("mobileNav")?.classList.toggle("open");
  });
}

/* MODALS */

function setupModals() {
  $("loginButton")?.addEventListener("click", () => openModal("loginModal"));

  $("showRegisterButton")?.addEventListener("click", () => {
    closeModal("loginModal");
    openModal("registerModal");
  });

  $("showLoginButton")?.addEventListener("click", () => {
    closeModal("registerModal");
    openModal("loginModal");
  });

  $("openJournalButton")?.addEventListener("click", () => {
    openModal("journalModal");
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      modal?.classList.add("hidden");
    });
  });

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", () => {
      overlay.closest(".modal")?.classList.add("hidden");
    });
  });

  $("loginForm")?.addEventListener("submit", loginUser);
  $("registerForm")?.addEventListener("submit", registerUser);
  $("journalForm")?.addEventListener("submit", saveJournalTrade);
}

function openModal(id) {
  $(id)?.classList.remove("hidden");
}

function closeModal(id) {
  $(id)?.classList.add("hidden");
}

/* AUTH */

async function loginUser(event) {
  event.preventDefault();

  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;

  setMessage("loginMessage", "Logging in...");

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setMessage("loginMessage", error.message);
    return;
  }

  setMessage("loginMessage", "Login successful.");
  closeModal("loginModal");

  await loadJournal();
  showToast("Logged in");
}

async function registerUser(event) {
  event.preventDefault();

  const email = $("registerEmail").value.trim();
  const password = $("registerPassword").value;

  setMessage("registerMessage", "Creating account...");

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "https://yazanhabboub888-ui.github.io/habboub-trade/"
    }
  });

  if (error) {
    setMessage("registerMessage", error.message);
    return;
  }

  setMessage(
    "registerMessage",
    "Account created. Check your email if verification is enabled."
  );
}

async function getCurrentUser() {
  const { data } = await supabaseClient.auth.getUser();
  return data?.user || null;
}

/* MARKET ANALYSIS */

async function loadMarketAnalysis() {
  try {
    const { data, error } = await supabaseClient
      .from("market_analysis")
      .select("*")
      .eq("symbol", "XAUUSD")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Market analysis:", error.message);
      return;
    }

    if (!data) return;

    state.analysis = data;
    state.lastUpdated = data.created_at;

    renderMarketAnalysis(data);
  } catch (error) {
    console.warn("Market analysis failed:", error);
  }
}

function renderMarketAnalysis(data) {
  const score = normalizeScore(
    data.score ??
    data.habboub_score ??
    data.confidence ??
    0
  );

  const bias = data.bias ?? data.htf_bias ?? "--";
  const tradeStatus = data.trade_status ?? data.status ?? "--";
  const risk = data.risk_level ?? data.risk ?? "--";
  const condition = data.market_condition ?? data.condition ?? "--";
  const confidence = normalizeScore(data.confidence ?? score);
  const analysisText =
    data.analysis ??
    data.description ??
    data.market_analysis ??
    "Market analysis is available.";

  setText("heroScore", score);
  setText("sessionScore", score);

  setText("heroScoreState", tradeStatus);
  setText("sessionScoreState", tradeStatus);

  setText("heroCondition", condition);
  setText("marketCondition", condition);

  setText("heroRisk", risk);
  setText("marketRisk", risk);

  setText("analysisStatus", tradeStatus);
  setText("analysisSymbol", data.symbol || "XAUUSD");
  setText("analysisSymbolLarge", data.symbol || "XAUUSD");

  setText("htfBias", bias);
  setText("sessionBias", bias);
  setText("intelBias", bias);

  setText(
    "liquidity",
    data.liquidity ?? data.liquidity_status ?? "--"
  );

  setText(
    "sessionLiquidity",
    data.liquidity ?? data.liquidity_status ?? "--"
  );

  setText(
    "intelLiquidity",
    data.liquidity ?? data.liquidity_status ?? "--"
  );

  setText("mss", data.mss ?? data.market_structure ?? "--");
  setText("sessionMSS", data.mss ?? data.market_structure ?? "--");
  setText("intelMSS", data.mss ?? data.market_structure ?? "--");

  setText("fvg", data.fvg ?? data.fvg_status ?? "--");
  setText("sessionFVG", data.fvg ?? data.fvg_status ?? "--");
  setText("intelFVG", data.fvg ?? data.fvg_status ?? "--");

  setText("marketConfidence", `${confidence}%`);
  setText("analysisConfidenceLarge", `${confidence}%`);

  setText("marketAnalysisText", analysisText);
  setText("analysisLongText", analysisText);

  setText("analysisDescription", condition || "Market analysis");

  setText(
    "cotCommercial",
    data.cot_commercial ?? data.commercial ?? "--"
  );

  setText(
    "cotManaged",
    data.cot_managed ?? data.managed_money ?? "--"
  );

  setText(
    "cotNet",
    data.cot_net ?? data.net_position ?? "--"
  );

  setText(
    "cotBias",
    data.cot_bias ?? "--"
  );

  setText(
    "intelCommercial",
    data.cot_commercial ?? data.commercial ?? "--"
  );

  setText(
    "intelManaged",
    data.cot_managed ?? data.managed_money ?? "--"
  );

  setText(
    "intelNet",
    data.cot_net ?? data.net_position ?? "--"
  );

  setText(
    "intelCotBias",
    data.cot_bias ?? "--"
  );

  setText(
    "regimeTrend",
    data.trend ?? data.market_trend ?? "--"
  );

  setText(
    "regimeVolatility",
    data.volatility ?? "--"
  );

  setText(
    "regimeLiquidity",
    data.liquidity ?? "--"
  );

  setText(
    "regimeBadge",
    data.regime ?? condition ?? "--"
  );

  const scoreBar = $("sessionScoreBar");
  if (scoreBar) scoreBar.style.width = `${score}%`;

  const confidenceBar = $("confidenceBar");
  if (confidenceBar) confidenceBar.style.width = `${confidence}%`;

  const riskMeter = $("riskMeter")?.querySelector("span");

  if (riskMeter) {
    const riskNumber = getRiskNumber(risk);
    riskMeter.style.width = `${riskNumber}%`;
  }

  updateScoreRing(score);
  renderReasons(data, score);
}

/* SCORE */

function normalizeScore(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return 0;

  return Math.max(0, Math.min(100, Math.round(number)));
}

function updateScoreRing(score) {
  const ring = $("heroScoreRing");

  if (!ring) return;

  const degrees = score * 3.6;

  ring.style.background =
    `conic-gradient(var(--cyan) 0deg, var(--blue) ${degrees}deg, rgba(255,255,255,.07) ${degrees}deg)`;
}

function getRiskNumber(risk) {
  const text = String(risk).toLowerCase();

  if (
    text.includes("high") ||
    text.includes("مرتفع") ||
    text.includes("danger")
  ) return 85;

  if (
    text.includes("medium") ||
    text.includes("moderate") ||
    text.includes("متوسط")
  ) return 55;

  if (
    text.includes("low") ||
    text.includes("منخفض")
  ) return 25;

  const number = Number(risk);

  return Number.isFinite(number)
    ? Math.max(0, Math.min(100, number))
    : 0;
}

function renderReasons(data, score) {
  const container = $("scoreReasons");

  if (!container) return;

  const reasons = [
    {
      icon: "◈",
      title: "HTF Bias",
      value: data.bias ?? data.htf_bias ?? "--"
    },
    {
      icon: "◎",
      title: "Liquidity",
      value: data.liquidity ?? "--"
    },
    {
      icon: "⚡",
      title: "News",
      value: getNewsSummary()
    },
    {
      icon: "◆",
      title: "COT",
      value: data.cot_bias ?? "--"
    },
    {
      icon: "◉",
      title: "Risk",
      value: data.risk_level ?? "--"
    },
    {
      icon: "✦",
      title: "Score",
      value: `${score}/100`
    }
  ];

  container.innerHTML = reasons.map((reason) => `
    <div class="reason">
      <span>${escapeHtml(reason.icon)}</span>
      <div>
        <strong>${escapeHtml(reason.title)}</strong>
        <p>${escapeHtml(String(reason.value))}</p>
      </div>
    </div>
  `).join("");
}

/* NEWS */

async function loadNews() {
  try {
    const { data, error } = await supabaseClient
      .from("economic_news")
      .select("*")
      .order("event_time", { ascending: true })
      .limit(40);

    if (error) {
      console.warn("News table unavailable:", error.message);
      renderDemoNews();
      return;
    }

    state.news = data || [];

    renderNews();
  } catch (error) {
    console.warn("News failed:", error);
    renderDemoNews();
  }
}

function renderDemoNews() {
  state.news = [];
  renderNews();
}

function renderNews() {
  const container = $("newsContainer");

  if (!container) return;

  const highImpact = state.news.filter(
    (item) => normalizeImpact(item.impact) === "high"
  );

  renderMajorAlert(highImpact);

  if (!state.news.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>⚡</span>
        <strong>${state.language === "ar" ? "لا توجد أخبار متاحة حاليًا" : "No economic events available"}</strong>
        <p>${state.language === "ar"
          ? "عند ربط التقويم الاقتصادي الحقيقي ستظهر الأحداث هنا."
          : "Real economic calendar events will appear here once the feed is connected."}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.news.map((item) => {
    const impact = normalizeImpact(item.impact);
    const time = formatNewsTime(item.event_time || item.time);

    return `
      <article class="news-item">
        <div class="news-time">${escapeHtml(time)}</div>

        <div>
          <h3>${escapeHtml(item.title || item.event || "Economic Event")}</h3>
          <p>${escapeHtml(
            item.description ||
            item.currency ||
            "Economic event"
          )}</p>
        </div>

        <div class="news-impact ${impact}">
          ${escapeHtml(impact.toUpperCase())}
        </div>
      </article>
    `;
  }).join("");
}

function normalizeImpact(value) {
  const text = String(value || "").toLowerCase();

  if (
    text.includes("high") ||
    text.includes("red") ||
    text.includes("مرتفع")
  ) return "high";

  if (
    text.includes("medium") ||
    text.includes("yellow") ||
    text.includes("متوسط")
  ) return "medium";

  return "low";
}

function renderMajorAlert(events) {
  const html = events.length
    ? `
      <div class="alert-title">
        🚨 ${state.language === "ar"
          ? "أخبار عالية التأثير"
          : "HIGH IMPACT NEWS"}
      </div>

      <div class="alert-list">
        ${events.map((event) => `
          <div class="alert-event">
            <div class="alert-time">
              ${escapeHtml(formatNewsTime(event.event_time || event.time))}
            </div>

            <div>
              <strong>${escapeHtml(event.title || event.event || "Major Event")}</strong>
              <small>
                ${escapeHtml(
                  event.currency ||
                  event.description ||
                  "Potential volatility"
                )}
              </small>
            </div>

            <div class="alert-impact">HIGH</div>
          </div>
        `).join("")}
      </div>
    `
    : "";

  setAlert("homeNewsAlert", html);
  setAlert("sessionNewsAlert", html);
}

function setAlert(id, html) {
  const element = $(id);

  if (!element) return;

  if (!html) {
    element.classList.add("hidden");
    element.innerHTML = "";
    return;
  }

  element.innerHTML = html;
  element.classList.remove("hidden");
}

function getNewsSummary() {
  const high = state.news.filter(
    (item) => normalizeImpact(item.impact) === "high"
  ).length;

  if (!high) {
    return state.language === "ar" ? "لا أخبار قوية" : "No high impact";
  }

  return state.language === "ar"
    ? `${high} أخبار قوية`
    : `${high} high impact`;
}

function formatNewsTime(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleTimeString(
    state.language === "ar" ? "ar-PS" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}

/* JOURNAL */

async function loadJournal() {
  const user = await getCurrentUser();

  if (!user) {
    renderJournal([]);
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("trading_journal")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.warn("Journal:", error.message);
      renderJournal([]);
      return;
    }

    state.journal = data || [];

    renderJournal(state.journal);
  } catch (error) {
    console.warn("Journal failed:", error);
    renderJournal([]);
  }
}

function renderJournal(trades) {
  const total = trades.length;

  const wins = trades.filter((trade) => {
    const result = String(
      trade.result ?? trade.status ?? ""
    ).toLowerCase();

    return result === "win" || Number(trade.r_result ?? trade.r) > 0;
  }).length;

  const winRate = total
    ? Math.round((wins / total) * 100)
    : 0;

  const rValues = trades
    .map((trade) =>
      Number(trade.r_result ?? trade.r ?? 0)
    )
    .filter(Number.isFinite);

  const averageR = rValues.length
    ? rValues.reduce((a, b) => a + b, 0) / rValues.length
    : 0;

  const positive = rValues
    .filter((r) => r > 0)
    .reduce((a, b) => a + b, 0);

  const negative = Math.abs(
    rValues
      .filter((r) => r < 0)
      .reduce((a, b) => a + b, 0)
  );

  const profitFactor = negative > 0
    ? positive / negative
    : positive > 0
      ? positive
      : 0;

  setText("journalWinRate", `${winRate}%`);
  setText("journalProfitFactor", profitFactor ? profitFactor.toFixed(2) : "--");
  setText("journalAverageR", rValues.length ? `${averageR.toFixed(2)}R` : "--");
  setText("journalDrawdown", calculateDrawdown(rValues));
  setText("journalTrades", total);

  const table = $("journalTable");

  if (!table) return;

  if (!trades.length) {
    table.innerHTML = `
      <div class="empty-state">
        <span>▤</span>
        <strong>${state.language === "ar" ? "لا توجد صفقات" : "No trades yet"}</strong>
        <p>${state.language === "ar"
          ? "أضف أول صفقة لبدء السجل."
          : "Add your first trade to start building your journal."}</p>
      </div>
    `;
    return;
  }

  table.innerHTML = trades.slice(0, 30).map((trade) => `
    <div class="trade-row">
      <strong>${escapeHtml(trade.symbol || "XAUUSD")}</strong>
      <span>${escapeHtml(trade.setup || "--")}</span>
      <span>${escapeHtml(trade.result || trade.status || "--")}</span>
      <strong>${escapeHtml(String(trade.r_result ?? trade.r ?? "--"))}R</strong>
      <span>${escapeHtml(trade.notes || "")}</span>
    </div>
  `).join("");
}

function calculateDrawdown(values) {
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;

  values.forEach((value) => {
    equity += value;

    if (equity > peak) {
      peak = equity;
    }

    const drawdown = peak - equity;

    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown
    ? `-${maxDrawdown.toFixed(2)}R`
    : "0R";
}

async function saveJournalTrade(event) {
  event.preventDefault();

  const user = await getCurrentUser();

  if (!user) {
    setMessage(
      "journalMessage",
      state.language === "ar"
        ? "سجّل الدخول أولًا."
        : "Please login first."
    );
    return;
  }

  const payload = {
    user_id: user.id,
    symbol: $("tradeSymbol").value.trim(),
    setup: $("tradeSetup").value.trim(),
    result: $("tradeResult").value,
    r_result: Number($("tradeR").value || 0),
    notes: $("tradeNotes").value.trim()
  };

  setMessage(
    "journalMessage",
    state.language === "ar" ? "جاري الحفظ..." : "Saving..."
  );

  const { error } = await supabaseClient
    .from("trading_journal")
    .insert(payload);

  if (error) {
    setMessage("journalMessage", error.message);
    return;
  }

  setMessage(
    "journalMessage",
    state.language === "ar"
      ? "تم حفظ الصفقة."
      : "Trade saved."
  );

  $("journalForm").reset();

  await loadJournal();

  setTimeout(() => {
    closeModal("journalModal");
  }, 500);
}

/* ANNOUNCEMENTS */

async function loadAnnouncements() {
  try {
    const { data, error } = await supabaseClient
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.warn("Announcements:", error.message);
      return;
    }

    state.announcements = data || [];

    renderAnnouncements();
  } catch (error) {
    console.warn("Announcements failed:", error);
  }
}

function renderAnnouncements() {
  const container = $("announcementsContainer");

  if (!container) return;

  if (!state.announcements.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>◆</span>
        <strong>${state.language === "ar" ? "لا توجد إعلانات" : "No announcements"}</strong>
      </div>
    `;
    return;
  }

  container.innerHTML = state.announcements.map((item) => `
    <article class="announcement">
      <h3>${escapeHtml(item.title || "Announcement")}</h3>
      <p>${escapeHtml(item.content || item.description || "")}</p>
      <small>${escapeHtml(formatDate(item.created_at))}</small>
    </article>
  `).join("");
}

/* COURSES */

async function loadCourses() {
  try {
    const { data, error } = await supabaseClient
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.warn("Courses:", error.message);
      return;
    }

    state.courses = data || [];

    renderCourses();
  } catch (error) {
    console.warn("Courses failed:", error);
  }
}

function renderCourses() {
  const container = $("courseContainer");

  if (!container) return;

  if (!state.courses.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>◇</span>
        <strong>${state.language === "ar" ? "لا توجد دورات منشورة" : "No published courses"}</strong>
      </div>
    `;
    return;
  }

  container.innerHTML = state.courses.map((course) => `
    <article class="course-card">
      <div class="course-cover">
        <span>HABBOUB ACADEMY</span>
      </div>

      <div class="course-content">
        <h3>${escapeHtml(course.title || "Course")}</h3>
        <p>${escapeHtml(course.description || "")}</p>

        <div class="course-meta">
          <span>${escapeHtml(course.level || "All levels")}</span>
          <span>${escapeHtml(String(course.lessons_count || "--"))} lessons</span>
        </div>
      </div>
    </article>
  `).join("");
}

/* LIVE */

async function loadLive() {
  try {
    const { data, error } = await supabaseClient
      .from("live_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Live:", error.message);
      return;
    }

    state.live = data;

    renderLive();
  } catch (error) {
    console.warn("Live failed:", error);
  }
}

function renderLive() {
  const data = state.live;

  if (!data) {
    setLiveOffline();
    return;
  }

  const active =
    data.is_live === true ||
    data.status === "live" ||
    data.active === true;

  if (!active) {
    setLiveOffline();
    return;
  }

  setText(
    "liveTitleDisplay",
    data.title || "Habboub Live"
  );

  setText(
    "liveDescriptionDisplay",
    data.description || "Live market session."
  );

  const indicator = $("liveIndicator");

  if (indicator) {
    indicator.textContent = "LIVE";
    indicator.className = "status-pill online";
  }
}

function setLiveOffline() {
  const indicator = $("liveIndicator");

  if (indicator) {
    indicator.textContent = "OFFLINE";
    indicator.className = "status-pill offline";
  }

  setText(
    "liveTitleDisplay",
    state.language === "ar"
      ? "لا توجد جلسة مباشرة الآن"
      : "No live session right now"
  );

  setText(
    "liveDescriptionDisplay",
    state.language === "ar"
      ? "سيظهر البث هنا عند بدء الجلسة."
      : "The live room will appear here when a session starts."
  );
}

/* AI */

function setupAI() {
  $("floatingAI")?.addEventListener("click", openAI);
  $("openAIButton")?.addEventListener("click", openAI);
  $("closeAIButton")?.addEventListener("click", closeAI);

  $("aiForm")?.addEventListener("submit", handleAI);
}

function openAI() {
  $("aiWindow")?.classList.remove("hidden");
  $("aiInput")?.focus();
}

function closeAI() {
  $("aiWindow")?.classList.add("hidden");
}

async function handleAI(event) {
  event.preventDefault();

  const input = $("aiInput");
  const message = input.value.trim();

  if (!message) return;

  addAIMessage("user", message);

  input.value = "";

  addAIMessage(
    "bot",
    buildLocalAIResponse(message)
  );
}

function buildLocalAIResponse(message) {
  const analysis = state.analysis;

  if (!analysis) {
    return state.language === "ar"
      ? "لسه ما وصلني تحليل السوق من قاعدة البيانات. أول ما تتوفر البيانات أقدر أعطيك سياق أوضح."
      : "I do not have the latest market analysis yet. Once the data is available, I can explain the current context.";
  }

  const score = normalizeScore(
    analysis.score ??
    analysis.habboub_score ??
    analysis.confidence
  );

  const bias = analysis.bias ?? analysis.htf_bias ?? "--";
  const risk = analysis.risk_level ?? analysis.risk ?? "--";
  const condition =
    analysis.market_condition ??
    analysis.condition ??
    "--";

  if (state.language === "ar") {
    return `السياق الحالي: درجة حبوب ${score}/100، الاتجاه HTF هو ${bias}، حالة السوق ${condition}، والمخاطرة ${risk}. هذا وصف لبيئة السوق وليس أمر شراء أو بيع.`;
  }

  return `Current context: Habboub Score ${score}/100, HTF Bias ${bias}, market condition ${condition}, and risk ${risk}. This describes the environment and is not a BUY/SELL instruction.`;
}

function addAIMessage(type, message) {
  const container = $("aiMessages");

  if (!container) return;

  const element = document.createElement("div");

  element.className = `ai-message ${type}`;

  element.innerHTML = `
    <strong>${type === "user" ? "You" : "Habboub"}</strong>
    <p>${escapeHtml(message)}</p>
  `;

  container.appendChild(element);

  while (container.children.length > 30) {
    container.removeChild(container.firstChild);
  }

  container.scrollTop = container.scrollHeight;
}

/* CLOCK */

function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString(
    state.language === "ar" ? "ar-PS" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  );

  setText("sessionClock", time);

  updateSessionTimeline();
}

function updateSessionTimeline() {
  const now = new Date();

  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;

  setActive("asiaSession", utcHour >= 0 && utcHour < 8);
  setActive("londonSession", utcHour >= 8 && utcHour < 13);
  setActive("newYorkSession", utcHour >= 13 && utcHour < 21);

  let session = "Market closed";

  if (utcHour >= 0 && utcHour < 8) {
    session = "Asia";
  } else if (utcHour >= 8 && utcHour < 13) {
    session = "London";
  } else if (utcHour >= 13 && utcHour < 21) {
    session = "New York";
  }

  setText("sessionName", session);
}

function setActive(id, active) {
  $(id)?.classList.toggle("active", active);
}

/* REALTIME */

function subscribeToUpdates() {
  try {
    supabaseClient
      .channel("habboub-market-analysis")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "market_analysis"
        },
        () => loadMarketAnalysis()
      )
      .subscribe();

    supabaseClient
      .channel("habboub-announcements")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements"
        },
        () => loadAnnouncements()
      )
      .subscribe();

    supabaseClient
      .channel("habboub-courses")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "courses"
        },
        () => loadCourses()
      )
      .subscribe();

    supabaseClient
      .channel("habboub-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_sessions"
        },
        () => loadLive()
      )
      .subscribe();

  } catch (error) {
    console.warn("Realtime setup:", error);
  }
}

/* HELPERS */

function setText(id, value) {
  const element = $(id);

  if (element) {
    element.textContent = value ?? "--";
  }
}

function setMessage(id, message) {
  setText(id, message);
}

function formatDate(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(
    state.language === "ar" ? "ar-PS" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimer = null;

function showToast(message) {
  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}
