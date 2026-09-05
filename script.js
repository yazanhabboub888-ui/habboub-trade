const SUPABASE_URL = "https://feoyjasuvrqxzhskqzye.supabase.co";
const SUPABASE_KEY = "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const $ = (id) => document.getElementById(id);

const state = {
  language: localStorage.getItem("habboub_language") || "en",
  analysis: null,
  journal: [],
  news: [],
  announcements: [],
  courses: [],
  live: null,
  lastUpdated: null,
  user: null,
  profile: null
};

const translations = {
  en: {
    login: "Login",
    logout: "Logout",
    profile: "Profile",
    register: "Register",
    create_account: "Create an account",
    welcome_back: "Welcome back",
    login_subtitle: "Enter your account to continue.",
    register_subtitle: "Join Habboub Intelligence.",
    full_name: "Full Name",
    email: "Email",
    password: "Password",
    already_account: "Already have an account?",
    account: "Account",
    my_profile: "My Profile",
    logged_in_as: "Logged in as",
    login_success: "Login successful.",
    account_created: "Account created. Check your email if verification is enabled.",
    profile_updated: "Profile updated.",
    home: "Home",
    nav_home: "Home",
    nav_session: "Trading Session",
    nav_markets: "Markets",
    nav_intelligence: "Intelligence",
    nav_news: "News",
    nav_journal: "Journal",
    nav_live: "Live",
    nav_academy: "Academy"
  },

  ar: {
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    profile: "الملف الشخصي",
    register: "إنشاء حساب",
    create_account: "إنشاء حساب",
    welcome_back: "أهلاً بعودتك",
    login_subtitle: "أدخل بيانات حسابك للمتابعة.",
    register_subtitle: "انضم إلى Habboub Intelligence.",
    full_name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    already_account: "لديك حساب بالفعل؟",
    account: "الحساب",
    my_profile: "ملفي الشخصي",
    logged_in_as: "مسجل الدخول باسم",
    login_success: "تم تسجيل الدخول بنجاح.",
    account_created: "تم إنشاء الحساب. افحص بريدك الإلكتروني إذا كان تأكيد البريد مفعلاً.",
    profile_updated: "تم تحديث الملف الشخصي.",
    home: "الرئيسية",
    nav_home: "الرئيسية",
    nav_session: "جلسة التداول",
    nav_markets: "الأسواق",
    nav_intelligence: "الذكاء",
    nav_news: "الأخبار",
    nav_journal: "السجل",
    nav_live: "البث المباشر",
    nav_academy: "الأكاديمية"
  }
};


/* =========================================================
   INIT
========================================================= */

async function init() {
  applyLanguage(state.language);

  setupNavigation();
  setupLanguage();
  setupModals();
  setupAI();
  setupMobileMenu();
  setupAuthUI();

  setTimeout(() => {
    $("loader")?.classList.add("hide");
  }, 500);

  updateClock();
  setInterval(updateClock, 1000);

  updateSessionTimeline();

  await refreshAuthUI();

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


/* =========================================================
   LANGUAGE
========================================================= */

function applyLanguage(language) {
  const lang = translations[language] || translations.en;

  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    if (lang[key]) {
      element.textContent = lang[key];
    }
  });

  $("langEN")?.classList.toggle("active", language === "en");
  $("langAR")?.classList.toggle("active", language === "ar");

  localStorage.setItem("habboub_language", language);
}

function setupLanguage() {
  $("langEN")?.addEventListener("click", () => {
    state.language = "en";
    applyLanguage("en");
  });

  $("langAR")?.addEventListener("click", () => {
    state.language = "ar";
    applyLanguage("ar");
  });
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {
  document.querySelectorAll("[data-nav]").forEach((element) => {
    element.addEventListener("click", () => {
      const target = element.dataset.nav;

      if (!target) return;

      navigateTo(target);
    });
  });
}

function navigateTo(target) {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active-section");
  });

  const section = $(target);

  if (section) {
    section.classList.add("active-section");
  }

  document.querySelectorAll("[data-nav]").forEach((element) => {
    if (
      element.classList.contains("nav-link") &&
      element.dataset.nav === target
    ) {
      element.classList.add("active");
    } else if (element.classList.contains("nav-link")) {
      element.classList.remove("active");
    }
  });

  $("mobileNav")?.classList.remove("open");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {
  $("mobileMenuButton")?.addEventListener("click", () => {
    $("mobileNav")?.classList.toggle("open");
  });
}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {
  $(id)?.classList.remove("hidden");
}

function closeModal(id) {
  $(id)?.classList.add("hidden");
}

function setupModals() {
  $("loginButton")?.addEventListener("click", async () => {
    const user = await getCurrentUser();

    if (user) {
      toggleProfileMenu();
      return;
    }

    openModal("loginModal");
  });

  $("showRegisterButton")?.addEventListener("click", () => {
    closeModal("loginModal");
    openModal("registerModal");
  });

  $("showLoginButton")?.addEventListener("click", () => {
    closeModal("registerModal");
    openModal("loginModal");
  });

  $("openJournalButton")?.addEventListener("click", async () => {
    const user = await getCurrentUser();

    if (!user) {
      openModal("loginModal");
      showToast(
        state.language === "ar"
          ? "سجل الدخول أولاً لاستخدام السجل."
          : "Please login first to use the journal."
      );
      return;
    }

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


/* =========================================================
   AUTH UI
========================================================= */

function setupAuthUI() {
  supabaseClient.auth.onAuthStateChange(async (event) => {
    if (
      event === "SIGNED_IN" ||
      event === "SIGNED_OUT" ||
      event === "USER_UPDATED"
    ) {
      setTimeout(async () => {
        await refreshAuthUI();
        await loadJournal();
      }, 100);
    }
  });
}

async function refreshAuthUI() {
  const user = await getCurrentUser();

  state.user = user;
  state.profile = null;

  if (user) {
    state.profile = await getProfile(user.id);
  }

  renderAuthUI();
}

async function getCurrentUser() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      return null;
    }

    return data?.user || null;
  } catch {
    return null;
  }
}

async function getProfile(userId) {
  if (!userId) return null;

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Profile load error:", error);
    return null;
  }

  return data;
}

function renderAuthUI() {
  const loginButton = $("loginButton");

  if (!loginButton) return;

  if (!state.user) {
    loginButton.textContent =
      translations[state.language]?.login || "Login";

    loginButton.classList.remove("user-account-button");

    const oldProfile = $("profileMenu");
    oldProfile?.remove();

    return;
  }

  const name =
    state.profile?.full_name ||
    state.user.user_metadata?.full_name ||
    state.user.email?.split("@")[0] ||
    "User";

  const avatarUrl =
    state.profile?.avatar_url ||
    state.user.user_metadata?.avatar_url ||
    "";

  loginButton.classList.add("user-account-button");

  loginButton.innerHTML = "";

  const avatar = document.createElement("span");
  avatar.className = "user-avatar";

  if (avatarUrl) {
    avatar.innerHTML = `<img src="${escapeAttribute(
      avatarUrl
    )}" alt="Profile">`;
  } else {
    avatar.textContent = name.charAt(0).toUpperCase();
  }

  const nameSpan = document.createElement("span");
  nameSpan.className = "user-name";
  nameSpan.textContent = name;

  loginButton.appendChild(avatar);
  loginButton.appendChild(nameSpan);

  createProfileMenu(name, avatarUrl);
}

function createProfileMenu(name, avatarUrl) {
  $("profileMenu")?.remove();

  const loginButton = $("loginButton");

  if (!loginButton?.parentElement) return;

  const menu = document.createElement("div");

  menu.id = "profileMenu";
  menu.className = "profile-menu hidden";

  const lang = translations[state.language] || translations.en;

  menu.innerHTML = `
    <div class="profile-menu-header">
      <div class="profile-menu-avatar">
        ${
          avatarUrl
            ? `<img src="${escapeAttribute(avatarUrl)}" alt="Profile">`
            : escapeHtml(name.charAt(0).toUpperCase())
        }
      </div>

      <div class="profile-menu-info">
        <strong>${escapeHtml(name)}</strong>
        <small>${escapeHtml(state.user?.email || "")}</small>
      </div>
    </div>

    <button type="button" id="profileMenuButton">
      <span>👤</span>
      <span>${lang.my_profile}</span>
    </button>

    <button type="button" id="logoutButton" class="logout-menu-button">
      <span>↪</span>
      <span>${lang.logout}</span>
    </button>
  `;

  loginButton.parentElement.appendChild(menu);

  $("profileMenuButton")?.addEventListener("click", () => {
    menu.classList.add("hidden");

    showProfileModal();
  });

  $("logoutButton")?.addEventListener("click", async () => {
    await logoutUser();
  });
}

function toggleProfileMenu() {
  const menu = $("profileMenu");

  if (!menu) {
    const name =
      state.profile?.full_name ||
      state.user?.user_metadata?.full_name ||
      state.user?.email?.split("@")[0] ||
      "User";

    createProfileMenu(
      name,
      state.profile?.avatar_url ||
        state.user?.user_metadata?.avatar_url ||
        ""
    );
  }

  $("profileMenu")?.classList.toggle("hidden");
}

async function logoutUser() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    showToast(error.message);
    return;
  }

  state.user = null;
  state.profile = null;
  state.journal = [];

  renderAuthUI();
  renderJournal([]);

  showToast(
    state.language === "ar"
      ? "تم تسجيل الخروج."
      : "Logged out successfully."
  );
}


/* =========================================================
   PROFILE MODAL
========================================================= */

function showProfileModal() {
  document.querySelector("#profileModal")?.remove();

  const profile = state.profile;
  const user = state.user;

  if (!user) return;

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  const avatarUrl =
    profile?.avatar_url ||
    user.user_metadata?.avatar_url ||
    "";

  const lang = translations[state.language] || translations.en;

  const modal = document.createElement("div");

  modal.id = "profileModal";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-overlay"></div>

    <div class="modal-box profile-modal-box">
      <button class="modal-close" id="profileModalClose">×</button>

      <div class="profile-large-avatar">
        ${
          avatarUrl
            ? `<img src="${escapeAttribute(avatarUrl)}" alt="Profile">`
            : escapeHtml(name.charAt(0).toUpperCase())
        }
      </div>

      <h2>${lang.my_profile}</h2>

      <p class="profile-email">
        ${escapeHtml(user.email || "")}
      </p>

      <form id="profileForm">

        <label>
          <span>${lang.full_name}</span>
          <input
            id="profileFullName"
            type="text"
            value="${escapeAttribute(name)}"
            required
          >
        </label>

        <label>
          <span>Avatar URL</span>
          <input
            id="profileAvatar"
            type="url"
            value="${escapeAttribute(avatarUrl)}"
            placeholder="https://..."
          >
        </label>

        <button class="primary-btn full" type="submit">
          ${lang.profile_updated}
        </button>

      </form>

      <div class="form-message" id="profileMessage"></div>
    </div>
  `;

  document.body.appendChild(modal);

  $("profileModalClose")?.addEventListener("click", () => {
    modal.remove();
  });

  modal.querySelector(".modal-overlay")?.addEventListener("click", () => {
    modal.remove();
  });

  $("profileForm")?.addEventListener("submit", updateProfile);
}

async function updateProfile(event) {
  event.preventDefault();

  const fullName = $("profileFullName")?.value.trim();
  const avatarUrl = $("profileAvatar")?.value.trim();

  if (!state.user) return;

  const message = $("profileMessage");

  if (message) {
    message.textContent =
      state.language === "ar"
        ? "جاري الحفظ..."
        : "Saving...";
  }

  const { error } = await supabaseClient
    .from("profiles")
    .upsert({
      id: state.user.id,
      full_name: fullName,
      email: state.user.email,
      avatar_url: avatarUrl || null
    });

  if (error) {
    if (message) {
      message.textContent = error.message;
    }

    return;
  }

  await supabaseClient.auth.updateUser({
    data: {
      full_name: fullName,
      avatar_url: avatarUrl || null
    }
  });

  state.profile = await getProfile(state.user.id);

  renderAuthUI();

  if (message) {
    message.textContent =
      state.language === "ar"
        ? "تم حفظ التغييرات."
        : "Changes saved.";
  }

  showToast(
    state.language === "ar"
      ? "تم تحديث الملف الشخصي."
      : "Profile updated."
  );
}


/* =========================================================
   LOGIN
========================================================= */

async function loginUser(event) {
  event.preventDefault();

  const email = $("loginEmail")?.value.trim();
  const password = $("loginPassword")?.value;

  setMessage(
    "loginMessage",
    state.language === "ar"
      ? "جاري تسجيل الدخول..."
      : "Logging in..."
  );

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    setMessage("loginMessage", error.message);
    return;
  }

  state.user = data?.user || null;

  await refreshAuthUI();

  closeModal("loginModal");

  await loadJournal();

  showToast(
    state.language === "ar"
      ? "تم تسجيل الدخول بنجاح."
      : "Login successful."
  );
}


/* =========================================================
   REGISTER
========================================================= */

async function registerUser(event) {
  event.preventDefault();

  const fullName = $("registerFullName")?.value.trim();
  const email = $("registerEmail")?.value.trim();
  const password = $("registerPassword")?.value;

  if (!fullName) {
    setMessage(
      "registerMessage",
      state.language === "ar"
        ? "اكتب اسمك الكامل."
        : "Please enter your full name."
    );

    return;
  }

  setMessage(
    "registerMessage",
    state.language === "ar"
      ? "جاري إنشاء الحساب..."
      : "Creating account..."
  );

  const { data, error } =
    await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo:
          "https://yazanhabboub888-ui.github.io/habboub-trade/"
      }
    });

  if (error) {
    setMessage("registerMessage", error.message);
    return;
  }

  /*
   * If email confirmation is disabled,
   * Supabase may return an active session.
   * The database trigger handles profile creation
   * even when email confirmation is enabled.
   */

  if (data?.session) {
    state.user = data.user;

    await refreshAuthUI();

    closeModal("registerModal");

    showToast(
      state.language === "ar"
        ? "تم إنشاء الحساب بنجاح."
        : "Account created successfully."
    );

    return;
  }

  setMessage(
    "registerMessage",
    state.language === "ar"
      ? "تم إنشاء الحساب. افحص بريدك الإلكتروني لتأكيد الحساب."
      : "Account created. Check your email to confirm your account."
  );
}


/* =========================================================
   JOURNAL
========================================================= */

async function loadJournal() {
  const user = await getCurrentUser();

  if (!user) {
    state.journal = [];
    renderJournal([]);
    return;
  }

  const { data, error } = await supabaseClient
    .from("trading_journal")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    console.error("Journal load error:", error);
    renderJournal([]);
    return;
  }

  state.journal = data || [];

  renderJournal(state.journal);
}

async function saveJournalTrade(event) {
  event.preventDefault();

  const user = await getCurrentUser();

  if (!user) {
    setMessage(
      "journalMessage",
      state.language === "ar"
        ? "سجل الدخول أولاً."
        : "Please login first."
    );

    return;
  }

  const symbol = $("tradeSymbol")?.value.trim() || "XAUUSD";
  const setup = $("tradeSetup")?.value.trim() || "";
  const result = $("tradeResult")?.value || "win";
  const rResult = Number($("tradeR")?.value || 0);
  const notes = $("tradeNotes")?.value.trim() || "";

  const { error } = await supabaseClient
    .from("trading_journal")
    .insert({
      user_id: user.id,
      symbol,
      setup,
      result,
      r_result: rResult,
      notes
    });

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

  $("journalForm")?.reset();

  if ($("tradeSymbol")) {
    $("tradeSymbol").value = "XAUUSD";
  }

  if ($("tradeR")) {
    $("tradeR").value = "1";
  }

  await loadJournal();

  setTimeout(() => {
    closeModal("journalModal");
  }, 500);
}

function renderJournal(trades) {
  const container = $("journalTable");

  if (!container) return;

  if (!trades?.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>▤</span>
        <strong>No trades yet</strong>
        <p>Add your first trade to start building your journal.</p>
      </div>
    `;

    $("journalWinRate").textContent = "--";
    $("journalProfitFactor").textContent = "--";
    $("journalAverageR").textContent = "--";
    $("journalDrawdown").textContent = "--";
    $("journalTrades").textContent = "0";

    return;
  }

  const wins = trades.filter((trade) => trade.result === "win").length;

  const losses = trades.filter(
    (trade) => trade.result === "loss"
  ).length;

  const winRate =
    trades.length > 0
      ? ((wins / trades.length) * 100).toFixed(1)
      : 0;

  const totalR = trades.reduce(
    (sum, trade) => sum + Number(trade.r_result || 0),
    0
  );

  const averageR =
    trades.length > 0
      ? (totalR / trades.length).toFixed(2)
      : "0.00";

  const grossProfit = trades
    .filter((trade) => Number(trade.r_result || 0) > 0)
    .reduce(
      (sum, trade) => sum + Number(trade.r_result || 0),
      0
    );

  const grossLoss = Math.abs(
    trades
      .filter((trade) => Number(trade.r_result || 0) < 0)
      .reduce(
        (sum, trade) => sum + Number(trade.r_result || 0),
        0
      )
  );

  const profitFactor =
    grossLoss > 0
      ? (grossProfit / grossLoss).toFixed(2)
      : "--";

  let cumulative = 0;
  let peak = 0;
  let maxDrawdown = 0;

  [...trades].reverse().forEach((trade) => {
    cumulative += Number(trade.r_result || 0);

    peak = Math.max(peak, cumulative);

    maxDrawdown = Math.max(
      maxDrawdown,
      peak - cumulative
    );
  });

  $("journalWinRate").textContent = `${winRate}%`;
  $("journalProfitFactor").textContent = profitFactor;
  $("journalAverageR").textContent = averageR;
  $("journalDrawdown").textContent =
    maxDrawdown > 0 ? `-${maxDrawdown.toFixed(2)}R` : "0R";
  $("journalTrades").textContent = trades.length;

  container.innerHTML = trades
    .map((trade) => {
      const resultClass =
        trade.result === "win"
          ? "positive"
          : trade.result === "loss"
          ? "negative"
          : "neutral";

      return `
        <div class="journal-row">

          <div>
            <strong>${escapeHtml(trade.symbol || "XAUUSD")}</strong>
            <small>${escapeHtml(trade.setup || "—")}</small>
          </div>

          <div>
            <span class="${resultClass}">
              ${escapeHtml(trade.result || "—")}
            </span>
          </div>

          <div>
            <strong>${Number(
              trade.r_result || 0
            ).toFixed(2)}R</strong>
          </div>

          <div>
            <small>${escapeHtml(
              trade.notes || ""
            )}</small>
          </div>

        </div>
      `;
    })
    .join("");
}


/* =========================================================
   MARKET ANALYSIS
========================================================= */

async function loadMarketAnalysis() {
  const { data, error } = await supabaseClient
    .from("market_analysis")
    .select("*")
    .order("created_at", {
      ascending: false
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Market analysis error:", error);
    return;
  }

  if (!data) return;

  state.analysis = data;

  renderAnalysis(data);
}

function renderAnalysis(data) {
  const score = Number(
    data.score ??
      data.habboub_score ??
      0
  );

  const confidence = Number(
    data.confidence ??
      data.market_confidence ??
      0
  );

  const condition =
    data.market_condition ||
    data.condition ||
    data.environment ||
    "--";

  const risk =
    data.risk ||
    data.risk_level ||
    "--";

  setText("heroScore", score || "--");
  setText("sessionScore", score || "--");

  setText("heroCondition", condition);
  setText("marketCondition", condition);

  setText("heroRisk", risk);
  setText("marketRisk", risk);

  setText(
    "marketConfidence",
    `${confidence || 0}%`
  );

  setText(
    "analysisConfidenceLarge",
    `${confidence || 0}%`
  );

  setText(
    "marketAnalysisText",
    data.analysis_text ||
      data.description ||
      "Waiting for market analysis..."
  );

  setText(
    "analysisLongText",
    data.analysis_long_text ||
      data.analysis_text ||
      data.description ||
      "Waiting for the latest market analysis."
  );

  setText(
    "analysisDescription",
    data.title ||
      data.description ||
      "Market analysis"
  );

  setText(
    "analysisStatus",
    data.status || "LIVE"
  );

  setText(
    "analysisSymbol",
    data.symbol || "XAUUSD"
  );

  setText(
    "analysisSymbolLarge",
    data.symbol || "XAUUSD"
  );

  setText(
    "htfBias",
    data.htf_bias || "--"
  );

  setText(
    "sessionBias",
    data.htf_bias || "--"
  );

  setText(
    "intelBias",
    data.htf_bias || "--"
  );

  setText(
    "liquidity",
    data.liquidity || "--"
  );

  setText(
    "sessionLiquidity",
    data.liquidity || "--"
  );

  setText(
    "intelLiquidity",
    data.liquidity || "--"
  );

  setText(
    "mss",
    data.mss || "--"
  );

  setText(
    "sessionMSS",
    data.mss || "--"
  );

  setText(
    "intelMSS",
    data.mss || "--"
  );

  setText(
    "fvg",
    data.fvg || "--"
  );

  setText(
    "sessionFVG",
    data.fvg || "--"
  );

  setText(
    "intelFVG",
    data.fvg || "--"
  );

  setText(
    "cotCommercial",
    data.cot_commercial || "--"
  );

  setText(
    "intelCommercial",
    data.cot_commercial || "--"
  );

  setText(
    "cotManaged",
    data.cot_managed || "--"
  );

  setText(
    "intelManaged",
    data.cot_managed || "--"
  );

  setText(
    "cotNet",
    data.cot_net || "--"
  );

  setText(
    "intelNet",
    data.cot_net || "--"
  );

  setText(
    "cotBias",
    data.cot_bias || "--"
  );

  setText(
    "intelCotBias",
    data.cot_bias || "--"
  );

  setText(
    "regimeTrend",
    data.trend || "--"
  );

  setText(
    "regimeVolatility",
    data.volatility || "--"
  );

  setText(
    "regimeLiquidity",
    data.liquidity || "--"
  );

  setText(
    "riskLevelText",
    risk
  );

  updateScoreVisuals(score, confidence, risk);
  renderScoreReasons(data);
}

function updateScoreVisuals(score, confidence, risk) {
  const heroRing = $("heroScoreRing");
  const sessionBar = $("sessionScoreBar");
  const confidenceBar = $("confidenceBar");
  const riskMeter = $("riskMeter");

  if (heroRing) {
    heroRing.style.setProperty(
      "--score",
      `${Math.max(0, Math.min(100, score))}%`
    );
  }

  if (sessionBar) {
    sessionBar.style.width =
      `${Math.max(0, Math.min(100, score))}%`;
  }

  if (confidenceBar) {
    confidenceBar.style.width =
      `${Math.max(0, Math.min(100, confidence))}%`;
  }

  if (riskMeter) {
    const riskValue =
      typeof risk === "number"
        ? risk
        : riskToNumber(risk);

    riskMeter.querySelector("span")?.style.setProperty(
      "width",
      `${riskValue}%`
    );
  }

  const stateText =
    score >= 80
      ? "STRONG ENVIRONMENT"
      : score >= 60
      ? "FAVORABLE ENVIRONMENT"
      : score >= 40
      ? "MIXED ENVIRONMENT"
      : score >= 20
      ? "HIGH RISK ENVIRONMENT"
      : "EXTREME RISK";

  setText("heroScoreState", stateText);
  setText("sessionScoreState", stateText);
}

function riskToNumber(risk) {
  const text = String(risk).toLowerCase();

  if (text.includes("extreme")) return 90;
  if (text.includes("high")) return 75;
  if (text.includes("medium")) return 50;
  if (text.includes("low")) return 25;

  return 50;
}

function renderScoreReasons(data) {
  const container = $("scoreReasons");

  if (!container) return;

  const reasons = [
    ["HTF Bias", data.htf_bias],
    ["Liquidity", data.liquidity],
    ["MSS", data.mss],
    ["FVG", data.fvg],
    ["COT", data.cot_bias],
    ["Risk", data.risk]
  ].filter((item) => item[1]);

  if (!reasons.length) return;

  container.innerHTML = reasons
    .map(
      ([title, value]) => `
        <div class="reason neutral">
          <span>◌</span>
          <div>
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeHtml(String(value))}</p>
          </div>
        </div>
      `
    )
    .join("");
}


/* =========================================================
   NEWS
========================================================= */

async function loadNews() {
  const { data, error } = await supabaseClient
    .from("news")
    .select("*")
    .order("event_time", {
      ascending: true
    });

  if (error) {
    console.error("News load error:", error);
    return;
  }

  state.news = data || [];

  renderNews(state.news);
}

function renderNews(news) {
  const container = $("newsContainer");

  if (!container) return;

  if (!news?.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>◌</span>
        <strong>No news available</strong>
      </div>
    `;

    return;
  }

  container.innerHTML = news
    .map(
      (item) => `
        <article class="news-card">
          <div>
            <span class="news-impact">
              ${escapeHtml(item.impact || "Medium")}
            </span>

            <h3>${escapeHtml(
              item.title || "Economic Event"
            )}</h3>

            <p>${escapeHtml(
              item.description || ""
            )}</p>
          </div>

          <time>
            ${formatDate(item.event_time)}
          </time>
        </article>
      `
    )
    .join("");
}


/* =========================================================
   ANNOUNCEMENTS
========================================================= */

async function loadAnnouncements() {
  const { data, error } = await supabaseClient
    .from("announcements")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {
    console.error("Announcements error:", error);
    return;
  }

  state.announcements = data || [];

  renderAnnouncements(state.announcements);
}

function renderAnnouncements(items) {
  const container = $("announcementsContainer");

  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>◆</span>
        <strong>No announcements yet</strong>
      </div>
    `;

    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <article class="announcement-card">
          <span>◆</span>

          <div>
            <h3>${escapeHtml(
              item.title || "Announcement"
            )}</h3>

            <p>${escapeHtml(
              item.content ||
                item.description ||
                ""
            )}</p>

            <small>${formatDate(
              item.created_at
            )}</small>
          </div>
        </article>
      `
    )
    .join("");
}


/* =========================================================
   COURSES
========================================================= */

async function loadCourses() {
  const { data, error } = await supabaseClient
    .from("courses")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {
    console.error("Courses error:", error);
    return;
  }

  state.courses = data || [];

  renderCourses(state.courses);
}

function renderCourses(courses) {
  const container = $("courseContainer");

  if (!container) return;

  if (!courses.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>◇</span>
        <strong>No courses available yet</strong>
      </div>
    `;

    return;
  }

  container.innerHTML = courses
    .map(
      (course) => `
        <article class="course-card">
          <div class="course-icon">◇</div>

          <h3>${escapeHtml(
            course.title || "Course"
          )}</h3>

          <p>${escapeHtml(
            course.description || ""
          )}</p>

          <button
            class="secondary-btn"
            type="button"
          >
            Open Course
          </button>
        </article>
      `
    )
    .join("");
}


/* =========================================================
   LIVE
========================================================= */

async function loadLive() {
  const { data, error } = await supabaseClient
    .from("live_sessions")
    .select("*")
    .order("created_at", {
      ascending: false
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Live error:", error);
    return;
  }

  state.live = data;

  renderLive(data);
}

function renderLive(data) {
  const indicator = $("liveIndicator");
  const title = $("liveTitleDisplay");
  const description = $("liveDescriptionDisplay");

  const isLive =
    data &&
    (
      data.is_live === true ||
      data.status === "live"
    );

  if (indicator) {
    indicator.textContent =
      isLive ? "LIVE" : "OFFLINE";

    indicator.classList.toggle(
      "offline",
      !isLive
    );

    indicator.classList.toggle(
      "online",
      isLive
    );
  }

  if (title) {
    title.textContent =
      isLive
        ? data.title || "Habboub Live"
        : "No live session right now";
  }

  if (description) {
    description.textContent =
      isLive
        ? data.description || ""
        : "The live room will appear here when the admin starts a session.";
  }
}


/* =========================================================
   REALTIME
========================================================= */

function subscribeToUpdates() {
  supabaseClient
    .channel("habboub-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "market_analysis"
      },
      () => {
        loadMarketAnalysis();
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "announcements"
      },
      () => {
        loadAnnouncements();
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "courses"
      },
      () => {
        loadCourses();
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "live_sessions"
      },
      () => {
        loadLive();
      }
    )
    .subscribe();
}


/* =========================================================
   AI
========================================================= */

function setupAI() {
  $("openAIButton")?.addEventListener("click", () => {
    $("aiWindow")?.classList.remove("hidden");
  });

  $("floatingAI")?.addEventListener("click", () => {
    $("aiWindow")?.classList.toggle("hidden");
  });

  $("closeAIButton")?.addEventListener("click", () => {
    $("aiWindow")?.classList.add("hidden");
  });

  $("aiForm")?.addEventListener("submit", handleAI);
}

async function handleAI(event) {
  event.preventDefault();

  const input = $("aiInput");
  const messages = $("aiMessages");

  if (!input || !messages) return;

  const message = input.value.trim();

  if (!message) return;

  addAIMessage("user", message);

  input.value = "";

  const response = buildLocalAIResponse(message);

  setTimeout(() => {
    addAIMessage("bot", response);
  }, 400);
}

function addAIMessage(type, text) {
  const container = $("aiMessages");

  if (!container) return;

  const message = document.createElement("div");

  message.className =
    `ai-message ${type}`;

  message.innerHTML = `
    <strong>
      ${type === "bot" ? "Habboub" : "You"}
    </strong>

    <p>${escapeHtml(text)}</p>
  `;

  container.appendChild(message);

  container.scrollTop =
    container.scrollHeight;
}

function buildLocalAIResponse(message) {
  const text = message.toLowerCase();

  const score =
    state.analysis?.score ??
    state.analysis?.habboub_score;

  const condition =
    state.analysis?.market_condition ||
    state.analysis?.condition;

  const risk =
    state.analysis?.risk ||
    state.analysis?.risk_level;

  if (
    text.includes("score") ||
    text.includes("درجة")
  ) {
    return `Current Habboub Score: ${
      score ?? "--"
    }/100.`;
  }

  if (
    text.includes("risk") ||
    text.includes("خطر") ||
    text.includes("مخاطرة")
  ) {
    return `Current risk environment: ${
      risk ?? "--"
    }.`;
  }

  if (
    text.includes("gold") ||
    text.includes("xau")
  ) {
    return `XAUUSD is currently being monitored through the Habboub market context. Current environment: ${
      condition ?? "--"
    }.`;
  }

  return `Habboub is monitoring market structure, liquidity, risk and the current market environment.`;
}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString(
    "en-GB",
    {
      hour12: false
    }
  );

  setText("sessionClock", time);

  const hour = now.getUTCHours();

  let session = "Asia";

  if (hour >= 8 && hour < 13) {
    session = "London";
  } else if (hour >= 13 && hour < 21) {
    session = "New York";
  }

  setText("sessionName", session);
}

function updateSessionTimeline() {
  const now = new Date();
  const hour = now.getUTCHours();

  document
    .querySelectorAll(".timeline-item")
    .forEach((item) => {
      item.classList.remove("current");
    });

  if (hour >= 0 && hour < 8) {
    $("asiaSession")?.classList.add("current");
  } else if (hour >= 8 && hour < 13) {
    $("londonSession")?.classList.add("current");
  } else if (hour >= 13 && hour < 21) {
    $("newYorkSession")?.classList.add("current");
  }
}


/* =========================================================
   HELPERS
========================================================= */

function setText(id, value) {
  const element = $(id);

  if (element) {
    element.textContent =
      value === null ||
      value === undefined
        ? "--"
        : String(value);
  }
}

function setMessage(id, message) {
  const element = $(id);

  if (element) {
    element.textContent = message || "";
  }
}

function showToast(message) {
  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(
    showToast.timeout
  );

  showToast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function formatDate(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString(
    state.language === "ar"
      ? "ar"
      : "en",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);
