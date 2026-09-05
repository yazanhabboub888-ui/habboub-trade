```javascript
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
    account_created:
      "Account created. Check your email if verification is enabled.",
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
    account_created:
      "تم إنشاء الحساب. افحص بريدك الإلكتروني إذا كان تأكيد البريد مفعلاً.",
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
  setupProfileMenu();

  setTimeout(() => {
    $("loader")?.classList.add("hide");
  }, 500);

  updateClock();

  setInterval(() => {
    updateClock();
    updateSessionTimeline();
  }, 1000);

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

  document.documentElement.dir =
    language === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    if (lang[key]) {
      element.textContent = lang[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(
    (element) => {
      const key = element.dataset.i18nPlaceholder;

      if (lang[key]) {
        element.placeholder = lang[key];
      }
    }
  );

  $("langEN")?.classList.toggle(
    "active",
    language === "en"
  );

  $("langAR")?.classList.toggle(
    "active",
    language === "ar"
  );

  localStorage.setItem(
    "habboub_language",
    language
  );

  if (state.user) {
    renderAuthUI();
  }
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
    } else if (
      element.classList.contains("nav-link")
    ) {
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
    clearMessage("loginMessage");
    openModal("registerModal");
  });

  $("showLoginButton")?.addEventListener("click", () => {
    closeModal("registerModal");
    clearMessage("registerMessage");
    openModal("loginModal");
  });

  $("openJournalButton")?.addEventListener(
    "click",
    async () => {
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
    }
  );

  document
    .querySelectorAll("[data-close-modal]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const modal = button.closest(".modal");

        modal?.classList.add("hidden");
      });
    });

  document
    .querySelectorAll(".modal-overlay")
    .forEach((overlay) => {
      overlay.addEventListener("click", () => {
        overlay
          .closest(".modal")
          ?.classList.add("hidden");
      });
    });

  $("loginForm")?.addEventListener(
    "submit",
    loginUser
  );

  $("registerForm")?.addEventListener(
    "submit",
    registerUser
  );

  $("journalForm")?.addEventListener(
    "submit",
    saveJournalTrade
  );
}


/* =========================================================
   AUTH STATE
========================================================= */

function setupAuthUI() {
  supabaseClient.auth.onAuthStateChange(
    async (event, session) => {
      console.log(
        "Habboub Auth Event:",
        event
      );

      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED"
      ) {
        setTimeout(async () => {
          await refreshAuthUI();

          if (session?.user) {
            await ensureProfile(session.user);
            await refreshAuthUI();
          }

          await loadJournal();
        }, 100);
      }
    }
  );
}

async function refreshAuthUI() {
  const user = await getCurrentUser();

  state.user = user;
  state.profile = null;

  if (user) {
    state.profile = await getProfile(user.id);

    if (!state.profile) {
      state.profile = await ensureProfile(user);
    }
  }

  renderAuthUI();
}

async function getCurrentUser() {
  try {
    const {
      data,
      error
    } = await supabaseClient.auth.getUser();

    if (error) {
      return null;
    }

    return data?.user || null;
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return null;
  }
}


/* =========================================================
   PROFILE DATABASE
========================================================= */

async function getProfile(userId) {
  if (!userId) return null;

  const {
    data,
    error
  } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "Profile load error:",
      error
    );

    return null;
  }

  return data || null;
}

async function ensureProfile(user) {
  if (!user?.id) {
    return null;
  }

  const existing = await getProfile(user.id);

  if (existing) {
    return existing;
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    null;

  const {
    data,
    error
  } = await supabaseClient
    .from("profiles")
    .insert({
      id: user.id,
      full_name: fullName,
      email: user.email || null,
      avatar_url: avatarUrl
    })
    .select("*")
    .maybeSingle();

  if (error) {
    console.error(
      "Profile creation error:",
      error
    );

    return null;
  }

  return data || null;
}


/* =========================================================
   AUTH UI
   IMPORTANT:
   Uses the EXISTING HTML profileArea/profileMenu.
   Does NOT create another profile menu.
========================================================= */

function renderAuthUI() {
  const loginButton = $("loginButton");
  const profileArea = $("profileArea");

  if (!loginButton) return;

  /*
   * LOGGED OUT
   */

  if (!state.user) {
    loginButton.classList.remove("hidden");
    loginButton.classList.remove("user-account-button");

    loginButton.innerHTML =
      translations[state.language]?.login ||
      "Login";

    profileArea?.classList.add("hidden");

    $("profileMenu")?.classList.add("hidden");

    return;
  }

  /*
   * LOGGED IN
   */

  loginButton.classList.add("hidden");

  profileArea?.classList.remove("hidden");

  const name =
    state.profile?.full_name ||
    state.user.user_metadata?.full_name ||
    state.user.email?.split("@")[0] ||
    "User";

  const email =
    state.user.email || "";

  const avatarUrl =
    state.profile?.avatar_url ||
    state.user.user_metadata?.avatar_url ||
    "";

  /*
   * Header avatar
   */

  updateAvatarElement(
    $("profileAvatar"),
    name,
    avatarUrl
  );

  /*
   * Menu avatar
   */

  updateAvatarElement(
    $("profileAvatarLarge"),
    name,
    avatarUrl
  );

  /*
   * Names
   */

  setText(
    "profileButtonName",
    name
  );

  setText(
    "profileName",
    name
  );

  setText(
    "profileEmail",
    email
  );

  /*
   * Keep menu closed after rendering.
   */

  $("profileMenu")?.classList.add("hidden");
}


/* =========================================================
   AVATAR
========================================================= */

function updateAvatarElement(
  element,
  name,
  avatarUrl
) {
  if (!element) return;

  const initial =
    String(name || "U")
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  /*
   * Clear previous content.
   */

  element.innerHTML = "";

  /*
   * Prevent any old inline sizing from causing problems.
   */

  element.style.overflow = "hidden";
  element.style.borderRadius = "50%";
  element.style.backgroundSize = "cover";
  element.style.backgroundPosition = "center";
  element.style.backgroundRepeat = "no-repeat";

  /*
   * Avatar image.
   */

  if (avatarUrl) {
    const img =
      document.createElement("img");

    img.src = avatarUrl;
    img.alt = "Profile avatar";

    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.minWidth = "0";
    img.style.minHeight = "0";
    img.style.objectFit = "cover";
    img.style.objectPosition = "center";
    img.style.borderRadius = "50%";

    img.onerror = () => {
      element.innerHTML = "";
      element.textContent = initial;
      element.classList.remove("has-image");
    };

    element.classList.add("has-image");

    element.appendChild(img);

    return;
  }

  /*
   * No avatar: first letter.
   */

  element.classList.remove("has-image");
  element.textContent = initial;
}


/* =========================================================
   PROFILE MENU
========================================================= */

function setupProfileMenu() {
  const profileButton =
    $("profileButton");

  const profileMenu =
    $("profileMenu");

  const profileLabel =
    $("profileLabel");

  const logoutButton =
    $("logoutButton");

  /*
   * Profile button
   */

  profileButton?.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      toggleProfileMenu();
    }
  );

  /*
   * Profile
   */

  profileLabel?.addEventListener(
    "click",
    () => {
      profileMenu?.classList.add("hidden");

      showProfileModal();
    }
  );

  /*
   * Logout
   */

  logoutButton?.addEventListener(
    "click",
    async () => {
      profileMenu?.classList.add("hidden");

      await logoutUser();
    }
  );

  /*
   * Click outside.
   */

  document.addEventListener(
    "click",
    (event) => {
      if (
        !profileMenu ||
        profileMenu.classList.contains("hidden")
      ) {
        return;
      }

      if (
        !profileMenu.contains(event.target) &&
        !profileButton?.contains(event.target)
      ) {
        profileMenu.classList.add("hidden");
      }
    }
  );
}

function toggleProfileMenu() {
  if (!state.user) {
    openModal("loginModal");
    return;
  }

  const menu =
    $("profileMenu");

  if (!menu) return;

  menu.classList.toggle("hidden");
}


/* =========================================================
   LOGOUT
========================================================= */

async function logoutUser() {
  const {
    error
  } = await supabaseClient.auth.signOut();

  if (error) {
    console.error(
      "Logout error:",
      error
    );

    showToast(error.message);

    return;
  }

  state.user = null;
  state.profile = null;
  state.journal = [];

  $("profileMenu")?.classList.add("hidden");

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
  /*
   * Remove an old dynamically-created profile modal.
   */

  document
    .querySelectorAll("#profileModal")
    .forEach((element) => {
      element.remove();
    });

  const profile =
    state.profile;

  const user =
    state.user;

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

  const lang =
    translations[state.language] ||
    translations.en;

  const modal =
    document.createElement("div");

  modal.id = "profileModal";
  modal.className = "modal";

  modal.innerHTML = `
    <div
      class="modal-overlay"
      data-profile-close
    ></div>

    <div
      class="modal-box profile-modal-box"
      style="
        width:min(460px, calc(100vw - 32px));
        max-width:460px;
        min-width:0;
        height:auto;
        max-height:calc(100vh - 40px);
        overflow-y:auto;
        box-sizing:border-box;
      "
    >

      <button
        class="modal-close"
        id="profileModalClose"
        type="button"
        aria-label="Close"
      >
        ×
      </button>

      <div
        id="profileLargeAvatarPreview"
        style="
          width:96px;
          height:96px;
          min-width:96px;
          min-height:96px;
          max-width:96px;
          max-height:96px;
          margin:0 auto 18px;
          border-radius:50%;
          overflow:hidden;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg,#ffffff,#8c9aaa);
          color:#080b12;
          font-size:32px;
          font-weight:800;
          box-sizing:border-box;
        "
      ></div>

      <h2>
        ${escapeHtml(lang.my_profile)}
      </h2>

      <p class="profile-email">
        ${escapeHtml(user.email || "")}
      </p>

      <form id="profileForm">

        <label>
          <span>
            ${escapeHtml(lang.full_name)}
          </span>

          <input
            id="profileFullName"
            type="text"
            value="${escapeAttribute(name)}"
            minlength="2"
            maxlength="80"
            required
          >
        </label>

        <label>
          <span>
            Avatar URL
          </span>

          <input
            id="profileAvatarUrl"
            type="url"
            value="${escapeAttribute(avatarUrl)}"
            placeholder="https://..."
            autocomplete="off"
          >
        </label>

        <button
          class="primary-btn full"
          type="submit"
        >
          ${
            state.language === "ar"
              ? "حفظ التغييرات"
              : "Save Changes"
          }
        </button>

      </form>

      <div
        class="form-message"
        id="profileMessage"
      ></div>

    </div>
  `;

  document.body.appendChild(modal);

  /*
   * Render preview.
   */

  updateAvatarElement(
    $("profileLargeAvatarPreview"),
    name,
    avatarUrl
  );

  /*
   * Close.
   */

  $("profileModalClose")?.addEventListener(
    "click",
    () => {
      modal.remove();
    }
  );

  /*
   * Overlay close.
   */

  modal
    .querySelector("[data-profile-close]")
    ?.addEventListener(
      "click",
      () => {
        modal.remove();
      }
    );

  /*
   * Save.
   */

  $("profileForm")?.addEventListener(
    "submit",
    updateProfile
  );

  /*
   * Live avatar preview.
   */

  $("profileAvatarUrl")?.addEventListener(
    "input",
    () => {
      const currentUrl =
        $("profileAvatarUrl")
          ?.value
          .trim() || "";

      const currentName =
        $("profileFullName")
          ?.value
          .trim() ||
        name;

      updateAvatarElement(
        $("profileLargeAvatarPreview"),
        currentName,
        currentUrl
      );
    }
  );

  /*
   * Live name preview.
   */

  $("profileFullName")?.addEventListener(
    "input",
    () => {
      const currentName =
        $("profileFullName")
          ?.value
          .trim() ||
        "User";

      const currentUrl =
        $("profileAvatarUrl")
          ?.value
          .trim() || "";

      updateAvatarElement(
        $("profileLargeAvatarPreview"),
        currentName,
        currentUrl
      );
    }
  );
}


/* =========================================================
   UPDATE PROFILE
========================================================= */

async function updateProfile(event) {
  event.preventDefault();

  if (!state.user) {
    return;
  }

  const fullName =
    $("profileFullName")
      ?.value
      .trim();

  const avatarUrl =
    $("profileAvatarUrl")
      ?.value
      .trim();

  const message =
    $("profileMessage");

  if (!fullName) {
    setMessage(
      "profileMessage",
      state.language === "ar"
        ? "اكتب اسمك الكامل."
        : "Please enter your full name."
    );

    return;
  }

  if (message) {
    message.textContent =
      state.language === "ar"
        ? "جاري الحفظ..."
        : "Saving...";
  }

  const {
    error
  } = await supabaseClient
    .from("profiles")
    .upsert(
      {
        id: state.user.id,
        full_name: fullName,
        email: state.user.email || null,
        avatar_url:
          avatarUrl || null
      },
      {
        onConflict: "id"
      }
    );

  if (error) {
    console.error(
      "Profile update error:",
      error
    );

    setMessage(
      "profileMessage",
      error.message
    );

    return;
  }

  /*
   * Update Supabase Auth metadata too.
   */

  const {
    error: authError
  } = await supabaseClient.auth.updateUser(
    {
      data: {
        full_name: fullName,
        avatar_url:
          avatarUrl || null
      }
    }
  );

  if (authError) {
    console.error(
      "Auth metadata update error:",
      authError
    );
  }

  state.profile =
    await getProfile(
      state.user.id
    );

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

  const email =
    $("loginEmail")
      ?.value
      .trim();

  const password =
    $("loginPassword")
      ?.value;

  if (!email || !password) {
    setMessage(
      "loginMessage",
      state.language === "ar"
        ? "أدخل البريد الإلكتروني وكلمة المرور."
        : "Enter your email and password."
    );

    return;
  }

  setMessage(
    "loginMessage",
    state.language === "ar"
      ? "جاري تسجيل الدخول..."
      : "Logging in..."
  );

  const {
    data,
    error
  } =
    await supabaseClient.auth.signInWithPassword(
      {
        email,
        password
      }
    );

  if (error) {
    console.error(
      "Login error:",
      error
    );

    setMessage(
      "loginMessage",
      error.message
    );

    return;
  }

  state.user =
    data?.user || null;

  if (!state.user) {
    setMessage(
      "loginMessage",
      state.language === "ar"
        ? "تعذر الحصول على بيانات الحساب."
        : "Could not load account information."
    );

    return;
  }

  await ensureProfile(
    state.user
  );

  await refreshAuthUI();

  closeModal("loginModal");

  $("loginForm")?.reset();

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

  /*
   * IMPORTANT:
   * HTML must use:
   * id="registerFullName"
   */

  const fullName =
    $("registerFullName")
      ?.value
      .trim();

  const email =
    $("registerEmail")
      ?.value
      .trim()
      .toLowerCase();

  const password =
    $("registerPassword")
      ?.value;

  if (!fullName) {
    setMessage(
      "registerMessage",
      state.language === "ar"
        ? "اكتب اسمك الكامل."
        : "Please enter your full name."
    );

    return;
  }

  if (fullName.length < 2) {
    setMessage(
      "registerMessage",
      state.language === "ar"
        ? "الاسم يجب أن يحتوي على حرفين على الأقل."
        : "Your name must contain at least 2 characters."
    );

    return;
  }

  if (!email) {
    setMessage(
      "registerMessage",
      state.language === "ar"
        ? "اكتب بريدك الإلكتروني."
        : "Please enter your email."
    );

    return;
  }

  if (!password) {
    setMessage(
      "registerMessage",
      state.language === "ar"
        ? "اكتب كلمة المرور."
        : "Please enter a password."
    );

    return;
  }

  if (password.length < 6) {
    setMessage(
      "registerMessage",
      state.language === "ar"
        ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل."
        : "Password must be at least 6 characters."
    );

    return;
  }

  setMessage(
    "registerMessage",
    state.language === "ar"
      ? "جاري إنشاء الحساب..."
      : "Creating account..."
  );

  const {
    data,
    error
  } =
    await supabaseClient.auth.signUp(
      {
        email,
        password,

        options: {
          data: {
            full_name: fullName
          },

          emailRedirectTo:
            "https://yazanhabboub888-ui.github.io/habboub-trade/"
        }
      }
    );

  if (error) {
    console.error(
      "Register error:",
      error
    );

    setMessage(
      "registerMessage",
      error.message
    );

    return;
  }

  /*
   * Confirmation disabled.
   */

  if (data?.session && data?.user) {
    state.user =
      data.user;

    await ensureProfile(
      data.user
    );

    await refreshAuthUI();

    closeModal(
      "registerModal"
    );

    $("registerForm")?.reset();

    showToast(
      state.language === "ar"
        ? "تم إنشاء الحساب بنجاح."
        : "Account created successfully."
    );

    return;
  }

  /*
   * Confirmation enabled.
   */

  setMessage(
    "registerMessage",
    state.language === "ar"
      ? "تم إنشاء الحساب. افحص بريدك الإلكتروني واضغط رابط التأكيد."
      : "Account created. Check your email and click the confirmation link."
  );
}


/* =========================================================
   JOURNAL — LOAD
========================================================= */

async function loadJournal() {
  const user =
    await getCurrentUser();

  if (!user) {
    state.journal = [];

    renderJournal([]);

    return;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("trading_journal")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false
      });

  if (error) {
    console.error(
      "Journal load error:",
      error
    );

    state.journal = [];

    renderJournal([]);

    return;
  }

  state.journal =
    data || [];

  renderJournal(
    state.journal
  );
}


/* =========================================================
   JOURNAL — SAVE
========================================================= */

async function saveJournalTrade(event) {
  event.preventDefault();

  const user =
    await getCurrentUser();

  if (!user) {
    setMessage(
      "journalMessage",
      state.language === "ar"
        ? "سجل الدخول أولاً."
        : "Please login first."
    );

    return;
  }

  const symbol =
    $("tradeSymbol")
      ?.value
      .trim()
      .toUpperCase() ||
    "XAUUSD";

  const setup =
    $("tradeSetup")
      ?.value
      .trim() ||
    "";

  const result =
    $("tradeResult")
      ?.value ||
    "win";

  const rResult =
    Number(
      $("tradeR")
        ?.value || 0
    );

  const notes =
    $("tradeNotes")
      ?.value
      .trim() ||
    "";

  if (!symbol) {
    setMessage(
      "journalMessage",
      state.language === "ar"
        ? "أدخل الرمز."
        : "Enter a symbol."
    );

    return;
  }

  if (
    Number.isNaN(rResult)
  ) {
    setMessage(
      "journalMessage",
      state.language === "ar"
        ? "قيمة R غير صحيحة."
        : "Invalid R result."
    );

    return;
  }

  setMessage(
    "journalMessage",
    state.language === "ar"
      ? "جاري حفظ الصفقة..."
      : "Saving trade..."
  );

  const {
    data,
    error
  } =
    await supabaseClient
      .from("trading_journal")
      .insert({
        user_id: user.id,
        journal_type: "manual",
        symbol,
        direction:
          result === "win"
            ? "WIN"
            : result === "loss"
            ? "LOSS"
            : "BREAKEVEN",
        setup,
        result,
        r_result: rResult,
        notes
      })
      .select("*")
      .maybeSingle();

  if (error) {
    console.error(
      "Journal save error:",
      error
    );

    setMessage(
      "journalMessage",
      error.message
    );

    return;
  }

  console.log(
    "Trade saved:",
    data
  );

  setMessage(
    "journalMessage",
    state.language === "ar"
      ? "تم حفظ الصفقة."
      : "Trade saved."
  );

  $("journalForm")?.reset();

  if ($("tradeSymbol")) {
    $("tradeSymbol").value =
      "XAUUSD";
  }

  if ($("tradeR")) {
    $("tradeR").value = "1";
  }

  await loadJournal();

  showToast(
    state.language === "ar"
      ? "تم حفظ الصفقة بنجاح."
      : "Trade saved successfully."
  );

  setTimeout(() => {
    closeModal("journalModal");
  }, 500);
}


/* =========================================================
   JOURNAL — DELETE
========================================================= */

async function deleteJournalTrade(tradeId) {
  if (!tradeId) {
    return;
  }

  const user =
    await getCurrentUser();

  if (!user) {
    return;
  }

  const confirmText =
    state.language === "ar"
      ? "هل أنت متأكد أنك تريد حذف هذه الصفقة؟"
      : "Are you sure you want to delete this trade?";

  if (!window.confirm(confirmText)) {
    return;
  }

  const {
    error
  } =
    await supabaseClient
      .from("trading_journal")
      .delete()
      .eq("id", tradeId)
      .eq("user_id", user.id);

  if (error) {
    console.error(
      "Journal delete error:",
      error
    );

    showToast(
      error.message
    );

    return;
  }

  await loadJournal();

  showToast(
    state.language === "ar"
      ? "تم حذف الصفقة."
      : "Trade deleted."
  );
}


/* =========================================================
   JOURNAL — RENDER
========================================================= */

function renderJournal(trades) {
  const container =
    $("journalTable");

  if (!container) {
    return;
  }

  if (!trades?.length) {
    container.innerHTML = `
      <div class="empty-state">

        <span>▤</span>

        <strong>
          ${
            state.language === "ar"
              ? "لا توجد صفقات بعد"
              : "No trades yet"
          }
        </strong>

        <p>
          ${
            state.language === "ar"
              ? "أضف أول صفقة للبدء ببناء سجلك."
              : "Add your first trade to start building your journal."
          }
        </p>

      </div>
    `;

    setText(
      "journalWinRate",
      "--"
    );

    setText(
      "journalProfitFactor",
      "--"
    );

    setText(
      "journalAverageR",
      "--"
    );

    setText(
      "journalDrawdown",
      "--"
    );

    setText(
      "journalTrades",
      "0"
    );

    return;
  }

  const wins =
    trades.filter(
      (trade) =>
        trade.result === "win"
    ).length;

  const winRate =
    trades.length > 0
      ? (
          (wins /
            trades.length) *
          100
        ).toFixed(1)
      : "0.0";

  const totalR =
    trades.reduce(
      (sum, trade) =>
        sum +
        Number(
          trade.r_result || 0
        ),
      0
    );

  const averageR =
    trades.length > 0
      ? (
          totalR /
          trades.length
        ).toFixed(2)
      : "0.00";

  const grossProfit =
    trades
      .filter(
        (trade) =>
          Number(
            trade.r_result || 0
          ) > 0
      )
      .reduce(
        (sum, trade) =>
          sum +
          Number(
            trade.r_result || 0
          ),
        0
      );

  const grossLoss =
    Math.abs(
      trades
        .filter(
          (trade) =>
            Number(
              trade.r_result || 0
            ) < 0
        )
        .reduce(
          (sum, trade) =>
            sum +
            Number(
              trade.r_result || 0
            ),
          0
        )
    );

  const profitFactor =
    grossLoss > 0
      ? (
          grossProfit /
          grossLoss
        ).toFixed(2)
      : "--";

  /*
   * Maximum drawdown.
   */

  let cumulative = 0;
  let peak = 0;
  let maxDrawdown = 0;

  [...trades]
    .reverse()
    .forEach((trade) => {
      cumulative +=
        Number(
          trade.r_result || 0
        );

      peak = Math.max(
        peak,
        cumulative
      );

      maxDrawdown =
        Math.max(
          maxDrawdown,
          peak - cumulative
        );
    });

  setText(
    "journalWinRate",
    `${winRate}%`
  );

  setText(
    "journalProfitFactor",
    profitFactor
  );

  setText(
    "journalAverageR",
    averageR
  );

  setText(
    "journalDrawdown",
    maxDrawdown > 0
      ? `-${maxDrawdown.toFixed(2)}R`
      : "0R"
  );

  setText(
    "journalTrades",
    trades.length
  );

  container.innerHTML =
    trades
      .map((trade) => {
        const resultClass =
          trade.result === "win"
            ? "positive"
            : trade.result === "loss"
            ? "negative"
            : "neutral";

        const resultLabel =
          trade.result === "win"
            ? state.language === "ar"
              ? "ربح"
              : "Win"
            : trade.result === "loss"
            ? state.language === "ar"
              ? "خسارة"
              : "Loss"
            : state.language === "ar"
            ? "تعادل"
            : "Breakeven";

        return `
          <div class="journal-row">

            <div>
              <strong>
                ${escapeHtml(
                  trade.symbol ||
                    "XAUUSD"
                )}
              </strong>

              <small>
                ${escapeHtml(
                  trade.setup ||
                    "—"
                )}
              </small>
            </div>

            <div>
              <span class="${resultClass}">
                ${resultLabel}
              </span>
            </div>

            <div>
              <strong>
                ${Number(
                  trade.r_result || 0
                ).toFixed(2)}R
              </strong>
            </div>

            <div>
              <small>
                ${escapeHtml(
                  trade.notes ||
                    ""
                )}
              </small>
            </div>

            <div>
              <button
                type="button"
                class="text-btn journal-delete-btn"
                data-delete-trade="${escapeAttribute(
                  trade.id
                )}"
              >
                ${
                  state.language === "ar"
                    ? "حذف"
                    : "Delete"
                }
              </button>
            </div>

          </div>
        `;
      })
      .join("");

  container
    .querySelectorAll(
      "[data-delete-trade]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          deleteJournalTrade(
            button.dataset.deleteTrade
          );
        }
      );
    });
}


/* =========================================================
   MARKET ANALYSIS
========================================================= */

async function loadMarketAnalysis() {
  const {
    data,
    error
  } =
    await supabaseClient
      .from("market_analysis")
      .select("*")
      .order("created_at", {
        ascending: false
      })
      .limit(1)
      .maybeSingle();

  if (error) {
    console.error(
      "Market analysis error:",
      error
    );

    return;
  }

  if (!data) {
    return;
  }

  state.analysis =
    data;

  state.lastUpdated =
    data.created_at ||
    null;

  renderAnalysis(data);

  setText(
    "lastUpdated",
    data.created_at
      ? formatDate(
          data.created_at
        )
      : "--"
  );
}

function renderAnalysis(data) {
  const score =
    Number(
      data.score ??
        data.habboub_score ??
        0
    );

  const confidence =
    Number(
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

  setText(
    "heroScore",
    Number.isFinite(score)
      ? score
      : "--"
  );

  setText(
    "sessionScore",
    Number.isFinite(score)
      ? score
      : "--"
  );

  setText(
    "heroCondition",
    condition
  );

  setText(
    "marketCondition",
    condition
  );

  setText(
    "heroRisk",
    risk
  );

  setText(
    "marketRisk",
    risk
  );

  setText(
    "marketConfidence",
    `${Number.isFinite(confidence) ? confidence : 0}%`
  );

  setText(
    "analysisConfidenceLarge",
    `${Number.isFinite(confidence) ? confidence : 0}%`
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
    data.status ||
      "LIVE"
  );

  setText(
    "analysisSymbol",
    data.symbol ||
      "XAUUSD"
  );

  setText(
    "analysisSymbolLarge",
    data.symbol ||
      "XAUUSD"
  );

  setText(
    "htfBias",
    data.htf_bias ||
      "--"
  );

  setText(
    "sessionBias",
    data.htf_bias ||
      "--"
  );

  setText(
    "intelBias",
    data.htf_bias ||
      "--"
  );

  setText(
    "liquidity",
    data.liquidity ||
      "--"
  );

  setText(
    "sessionLiquidity",
    data.liquidity ||
      "--"
  );

  setText(
    "intelLiquidity",
    data.liquidity ||
      "--"
  );

  setText(
    "mss",
    data.mss ||
      "--"
  );

  setText(
    "sessionMSS",
    data.mss ||
      "--"
  );

  setText(
    "intelMSS",
    data.mss ||
      "--"
  );

  setText(
    "fvg",
    data.fvg ||
      "--"
  );

  setText(
    "sessionFVG",
    data.fvg ||
      "--"
  );

  setText(
    "intelFVG",
    data.fvg ||
      "--"
  );

  setText(
    "cotCommercial",
    data.cot_commercial ||
      "--"
  );

  setText(
    "intelCommercial",
    data.cot_commercial ||
      "--"
  );

  setText(
    "cotManaged",
    data.cot_managed ||
      "--"
  );

  setText(
    "intelManaged",
    data.cot_managed ||
      "--"
  );

  setText(
    "cotNet",
    data.cot_net ||
      "--"
  );

  setText(
    "intelNet",
    data.cot_net ||
      "--"
  );

  setText(
    "cotBias",
    data.cot_bias ||
      "--"
  );

  setText(
    "intelCotBias",
    data.cot_bias ||
      "--"
  );

  setText(
    "regimeTrend",
    data.trend ||
      "--"
  );

  setText(
    "regimeVolatility",
    data.volatility ||
      "--"
  );

  setText(
    "regimeLiquidity",
    data.liquidity ||
      "--"
  );

  setText(
    "riskLevelText",
    risk
  );

  updateScoreVisuals(
    score,
    confidence,
    risk
  );

  renderScoreReasons(data);
}


/* =========================================================
   SCORE VISUALS
========================================================= */

function updateScoreVisuals(
  score,
  confidence,
  risk
) {
  const safeScore =
    Math.max(
      0,
      Math.min(
        100,
        Number(score) || 0
      )
    );

  const safeConfidence =
    Math.max(
      0,
      Math.min(
        100,
        Number(confidence) || 0
      )
    );

  const heroRing =
    $("heroScoreRing");

  const sessionBar =
    $("sessionScoreBar");

  const confidenceBar =
    $("confidenceBar");

  const riskMeter =
    $("riskMeter");

  if (heroRing) {
    heroRing.style.setProperty(
      "--score",
      `${safeScore}%`
    );
  }

  if (sessionBar) {
    sessionBar.style.width =
      `${safeScore}%`;
  }

  if (confidenceBar) {
    confidenceBar.style.width =
      `${safeConfidence}%`;
  }

  if (riskMeter) {
    const riskValue =
      riskToNumber(risk);

    const meter =
      riskMeter.querySelector("span");

    if (meter) {
      meter.style.width =
        `${riskValue}%`;
    }
  }

  const stateText =
    safeScore >= 80
      ? "STRONG ENVIRONMENT"
      : safeScore >= 60
      ? "FAVORABLE ENVIRONMENT"
      : safeScore >= 40
      ? "MIXED ENVIRONMENT"
      : safeScore >= 20
      ? "HIGH RISK ENVIRONMENT"
      : "EXTREME RISK";

  setText(
    "heroScoreState",
    stateText
  );

  setText(
    "sessionScoreState",
    stateText
  );
}

function riskToNumber(risk) {
  if (
    typeof risk ===
    "number"
  ) {
    return Math.max(
      0,
      Math.min(
        100,
        risk
      )
    );
  }

  const text =
    String(risk)
      .toLowerCase();

  if (
    text.includes("extreme")
  ) {
    return 90;
  }

  if (
    text.includes("high")
  ) {
    return 75;
  }

  if (
    text.includes("medium")
  ) {
    return 50;
  }

  if (
    text.includes("low")
  ) {
    return 25;
  }

  return 50;
}


/* =========================================================
   SCORE REASONS
========================================================= */

function renderScoreReasons(data) {
  const container =
    $("scoreReasons");

  if (!container) {
    return;
  }

  const reasons = [
    [
      "HTF Bias",
      data.htf_bias
    ],
    [
      "Liquidity",
      data.liquidity
    ],
    [
      "MSS",
      data.mss
    ],
    [
      "FVG",
      data.fvg
    ],
    [
      "COT",
      data.cot_bias
    ],
    [
      "Risk",
      data.risk
    ]
  ].filter(
    (item) =>
      item[1] !== null &&
      item[1] !== undefined &&
      String(item[1]).trim() !== ""
  );

  if (!reasons.length) {
    return;
  }

  container.innerHTML =
    reasons
      .map(
        ([title, value]) => `
          <div class="reason neutral">

            <span>◌</span>

            <div>

              <strong>
                ${escapeHtml(title)}
              </strong>

              <p>
                ${escapeHtml(
                  String(value)
                )}
              </p>

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
  const {
    data,
    error
  } =
    await supabaseClient
      .from("news")
      .select("*")
      .order(
        "event_time",
        {
          ascending: true
        }
      );

  if (error) {
    console.error(
      "News load error:",
      error
    );

    return;
  }

  state.news =
    data || [];

  renderNews(
    state.news
  );
}

function renderNews(news) {
  const container =
    $("newsContainer");

  if (!container) {
    return;
  }

  if (!news?.length) {
    container.innerHTML = `
      <div class="empty-state">

        <span>◌</span>

        <strong>
          ${
            state.language === "ar"
              ? "لا توجد أخبار"
              : "No news available"
          }
        </strong>

      </div>
    `;

    return;
  }

  container.innerHTML =
    news
      .map(
        (item) => `
          <article class="news-card">

            <div>

              <span class="news-impact">
                ${escapeHtml(
                  item.impact ||
                    "Medium"
                )}
              </span>

              <h3>
                ${escapeHtml(
                  item.title ||
                    "Economic Event"
                )}
              </h3>

              <p>
                ${escapeHtml(
                  item.description ||
                    ""
                )}
              </p>

            </div>

            <time>
              ${formatDate(
                item.event_time
              )}
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
  const {
    data,
    error
  } =
    await supabaseClient
      .from("announcements")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {
    console.error(
      "Announcements error:",
      error
    );

    return;
  }

  state.announcements =
    data || [];

  renderAnnouncements(
    state.announcements
  );
}

function renderAnnouncements(items) {
  const container =
    $("announcementsContainer");

  if (!container) {
    return;
  }

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">

        <span>◆</span>

        <strong>
          ${
            state.language === "ar"
              ? "لا توجد إعلانات بعد"
              : "No announcements yet"
          }
        </strong>

      </div>
    `;

    return;
  }

  container.innerHTML =
    items
      .map(
        (item) => `
          <article class="announcement-card">

            <span>◆</span>

            <div>

              <h3>
                ${escapeHtml(
                  item.title ||
                    "Announcement"
                )}
              </h3>

              <p>
                ${escapeHtml(
                  item.content ||
                    item.description ||
                    ""
                )}
              </p>

              <small>
                ${formatDate(
                  item.created_at
                )}
              </small>

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
  const {
    data,
    error
  } =
    await supabaseClient
      .from("courses")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {
    console.error(
      "Courses error:",
      error
    );

    return;
  }

  state.courses =
    data || [];

  renderCourses(
    state.courses
  );
}

function renderCourses(courses) {
  const container =
    $("courseContainer");

  if (!container) {
    return;
  }

  if (!courses.length) {
    container.innerHTML = `
      <div class="empty-state">

        <span>◇</span>

        <strong>
          ${
            state.language === "ar"
              ? "لا توجد دورات متاحة حالياً"
              : "No courses available yet"
          }
        </strong>

      </div>
    `;

    return;
  }

  container.innerHTML =
    courses
      .map(
        (course) => `
          <article class="course-card">

            <div class="course-icon">
              ◇
            </div>

            <h3>
              ${escapeHtml(
                course.title ||
                  "Course"
              )}
            </h3>

            <p>
              ${escapeHtml(
                course.description ||
                  ""
              )}
            </p>

            <button
              class="secondary-btn"
              type="button"
            >
              ${
                state.language === "ar"
                  ? "فتح الدورة"
                  : "Open Course"
              }
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
  const {
    data,
    error
  } =
    await supabaseClient
      .from("live_sessions")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle();

  if (error) {
    console.error(
      "Live error:",
      error
    );

    return;
  }

  state.live =
    data;

  renderLive(data);
}

function renderLive(data) {
  const indicator =
    $("liveIndicator");

  const title =
    $("liveTitleDisplay");

  const description =
    $("liveDescriptionDisplay");

  const isLive =
    data &&
    (
      data.is_live === true ||
      data.status === "live"
    );

  if (indicator) {
    indicator.textContent =
      isLive
        ? "LIVE"
        : "OFFLINE";

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
        ? data.title ||
          "Habboub Live"
        : state.language === "ar"
        ? "لا توجد جلسة مباشرة الآن"
        : "No live session right now";
  }

  if (description) {
    description.textContent =
      isLive
        ? data.description ||
          ""
        : state.language === "ar"
        ? "ستظهر جلسة البث هنا عندما يبدأ المشرف جلسة."
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

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "trading_journal"
      },
      async () => {
        if (state.user) {
          await loadJournal();
        }
      }
    )

    .subscribe();
}


/* =========================================================
   AI
========================================================= */

function setupAI() {
  $("openAIButton")?.addEventListener(
    "click",
    () => {
      $("aiWindow")
        ?.classList.remove("hidden");
    }
  );

  $("floatingAI")?.addEventListener(
    "click",
    () => {
      $("aiWindow")
        ?.classList.toggle("hidden");
    }
  );

  $("closeAIButton")?.addEventListener(
    "click",
    () => {
      $("aiWindow")
        ?.classList.add("hidden");
    }
  );

  $("aiForm")?.addEventListener(
    "submit",
    handleAI
  );
}

async function handleAI(event) {
  event.preventDefault();

  const input =
    $("aiInput");

  const messages =
    $("aiMessages");

  if (!input || !messages) {
    return;
  }

  const message =
    input.value.trim();

  if (!message) {
    return;
  }

  addAIMessage(
    "user",
    message
  );

  input.value = "";

  const response =
    buildLocalAIResponse(message);

  setTimeout(() => {
    addAIMessage(
      "bot",
      response
    );
  }, 400);
}

function addAIMessage(
  type,
  text
) {
  const container =
    $("aiMessages");

  if (!container) {
    return;
  }

  const message =
    document.createElement("div");

  message.className =
    `ai-message ${type}`;

  message.innerHTML = `
    <strong>
      ${
        type === "bot"
          ? "Habboub"
          : "You"
      }
    </strong>

    <p>
      ${escapeHtml(text)}
    </p>
  `;

  container.appendChild(
    message
  );

  container.scrollTop =
    container.scrollHeight;
}

function buildLocalAIResponse(message) {
  const text =
    message.toLowerCase();

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
    text.includes("xau") ||
    text.includes("ذهب")
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
  const now =
    new Date();

  const time =
    now.toLocaleTimeString(
      "en-GB",
      {
        hour12: false
      }
    );

  setText(
    "sessionClock",
    time
  );

  const hour =
    now.getUTCHours();

  let session =
    "Asia";

  if (
    hour >= 8 &&
    hour < 13
  ) {
    session =
      "London";
  } else if (
    hour >= 13 &&
    hour < 21
  ) {
    session =
      "New York";
  }

  setText(
    "sessionName",
    session
  );
}

function updateSessionTimeline() {
  const now =
    new Date();

  const hour =
    now.getUTCHours();

  document
    .querySelectorAll(".timeline-item")
    .forEach((item) => {
      item.classList.remove("current");
    });

  if (
    hour >= 0 &&
    hour < 8
  ) {
    $("asiaSession")
      ?.classList.add("current");
  } else if (
    hour >= 8 &&
    hour < 13
  ) {
    $("londonSession")
      ?.classList.add("current");
  } else if (
    hour >= 13 &&
    hour < 21
  ) {
    $("newYorkSession")
      ?.classList.add("current");
  }
}


/* =========================================================
   HELPERS
========================================================= */

function setText(
  id,
  value
) {
  const element =
    $(id);

  if (element) {
    element.textContent =
      value === null ||
      value === undefined
        ? "--"
        : String(value);
  }
}

function setMessage(
  id,
  message
) {
  const element =
    $(id);

  if (element) {
    element.textContent =
      message || "";
  }
}

function clearMessage(id) {
  setMessage(
    id,
    ""
  );
}

function showToast(message) {
  const toast =
    $("toast");

  if (!toast) {
    return;
  }

  toast.textContent =
    message;

  toast.classList.add("show");

  clearTimeout(
    showToast.timeout
  );

  showToast.timeout =
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
}

function formatDate(value) {
  if (!value) {
    return "--";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
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
  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
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
```
