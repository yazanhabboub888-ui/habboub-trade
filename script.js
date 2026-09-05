/* =========================================================
   HABBOUB — MAIN SCRIPT
   Stable frontend + Supabase
   Loader-safe version
========================================================= */

"use strict";


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
  "https://feoyjasuvrqxzhskqzye.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0";

let supabaseClient = null;


/* =========================================================
   SUPABASE INITIALIZATION
========================================================= */

try {
  if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
  ) {
    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

    console.log("Habboub: Supabase initialized.");
  } else {
    console.warn(
      "Habboub: Supabase CDN was not loaded."
    );
  }
} catch (error) {
  console.error(
    "Habboub: Supabase initialization failed:",
    error
  );
}


/* =========================================================
   HELPERS
========================================================= */

const $ = (id) =>
  document.getElementById(id);

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function setMessage(id, msg) {
  const el = $(id);
  if (el) el.textContent = msg;
}

function clearMessage(id) {
  const el = $(id);
  if (el) el.textContent = "";
}

function showToast(message) {
  let toast = $("habboubToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "habboubToast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
    toast.style.backgroundColor = "#101827";
    toast.style.color = "#ffffff";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
    toast.style.border = "1px solid rgba(255,255,255,0.1)";
    toast.style.zIndex = "99999";
    toast.style.transition = "all 0.3s ease";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.visibility = "visible";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.visibility = "hidden";
  }, 3500);
}


/* =========================================================
   STATE
========================================================= */

const state = {
  language:
    localStorage.getItem(
      "habboub_language"
    ) || "en",

  analysis: null,

  journal: [],

  news: [],

  announcements: [],

  courses: [],

  live: null,

  lastUpdated: null,

  user: null,

  profile: null,

  initialized: false
};


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

  en: {

    login: "Login",

    logout: "Logout",

    profile: "Profile",

    register: "Register",

    create_account:
      "Create an account",

    welcome_back:
      "Welcome back",

    login_subtitle:
      "Enter your account to continue.",

    register_subtitle:
      "Join Habboub Intelligence.",

    full_name:
      "Full Name",

    email:
      "Email",

    password:
      "Password",

    already_account:
      "Already have an account?",

    account:
      "Account",

    my_profile:
      "My Profile",

    logged_in_as:
      "Logged in as",

    login_success:
      "Login successful.",

    account_created:
      "Account created. Check your email if verification is enabled.",

    profile_updated:
      "Profile updated.",

    home:
      "Home",

    nav_home:
      "Home",

    nav_session:
      "Trading Session",

    nav_markets:
      "Markets",

    nav_intelligence:
      "Intelligence",

    nav_news:
      "News",

    nav_journal:
      "Journal",

    nav_live:
      "Live",

    nav_academy:
      "Academy"
  },


  ar: {

    login:
      "تسجيل الدخول",

    logout:
      "تسجيل الخروج",

    profile:
      "الملف الشخصي",

    register:
      "إنشاء حساب",

    create_account:
      "إنشاء حساب",

    welcome_back:
      "أهلاً بعودتك",

    login_subtitle:
      "أدخل بيانات حسابك للمتابعة.",

    register_subtitle:
      "انضم إلى Habboub Intelligence.",

    full_name:
      "الاسم الكامل",

    email:
      "البريد الإلكتروني",

    password:
      "كلمة المرور",

    already_account:
      "لديك حساب بالفعل؟",

    account:
      "الحساب",

    my_profile:
      "ملفي الشخصي",

    logged_in_as:
      "مسجل الدخول باسم",

    login_success:
      "تم تسجيل الدخول بنجاح.",

    account_created:
      "تم إنشاء الحساب. افحص بريدك الإلكتروني إذا كان تأكيد البريد مفعلاً.",

    profile_updated:
      "تم تحديث الملف الشخصي.",

    home:
      "الرئيسية",

    nav_home:
      "الرئيسية",

    nav_session:
      "جلسة التداول",

    nav_markets:
      "الأسواق",

    nav_intelligence:
      "الذكاء",

    nav_news:
      "الأخبار",

    nav_journal:
      "السجل",

    nav_live:
      "البث المباشر",

    nav_academy:
      "الأكاديمية"
  }
};


/* =========================================================
   SAFE TIMEOUT HELPER
========================================================= */

function withTimeout(
  promise,
  timeout = 5000,
  fallback = null
) {

  return Promise.race([

    Promise.resolve(promise),

    new Promise((resolve) => {

      setTimeout(() => {
        resolve(fallback);
      }, timeout);

    })

  ]);
}


/* =========================================================
   LOADER
========================================================= */

function hideLoader() {

  const loader =
    $("loader");

  if (!loader) {
    return;
  }

  loader.classList.add(
    "hide"
  );

  loader.style.opacity =
    "0";

  loader.style.visibility =
    "hidden";

  loader.style.pointerEvents =
    "none";

  loader.style.display =
    "none";
}


/* =========================================================
   INIT
========================================================= */

async function init() {

  if (state.initialized) {
    return;
  }

  state.initialized = true;

  hideLoader();

  setTimeout(() => {
    hideLoader();
  }, 1000);

  try {

    applyLanguage(
      state.language
    );

    setupNavigation();

    setupLanguage();

    setupModals();

    setupAI();

    setupMobileMenu();

    setupAuthUI();

    setupProfileMenu();

    updateClock();

    updateSessionTimeline();

    setInterval(() => {

      try {

        updateClock();

        updateSessionTimeline();

      } catch (error) {

        console.error(
          "Clock error:",
          error
        );

      }

    }, 1000);

    hideLoader();

    if (!supabaseClient) {

      console.warn(
        "Habboub: Running without Supabase."
      );

      return;
    }

    try {

      await withTimeout(
        refreshAuthUI(),
        5000,
        null
      );

    } catch (error) {

      console.error(
        "Auth initialization error:",
        error
      );

    }

    Promise.allSettled([

      loadMarketAnalysis(),

      loadJournal(),

      loadAnnouncements(),

      loadCourses(),

      loadLive(),

      loadNews()

    ]).then(() => {

      console.log(
        "Habboub: Background data loading finished."
      );

    }).catch((error) => {

      console.error(
        "Background data loading error:",
        error
      );

    });

    try {

      subscribeToUpdates();

    } catch (error) {

      console.error(
        "Realtime setup error:",
        error
      );

    }

  } catch (error) {

    console.error(
      "Habboub initialization error:",
      error
    );

  } finally {

    hideLoader();

  }
}


/* =========================================================
   LANGUAGE
========================================================= */

function applyLanguage(
  language
) {

  const lang =
    translations[language] ||
    translations.en;


  state.language =
    translations[language]
      ? language
      : "en";


  document.documentElement.lang =
    state.language;


  document.documentElement.dir =
    state.language === "ar"
      ? "rtl"
      : "ltr";


  document
    .querySelectorAll(
      "[data-i18n]"
    )
    .forEach((element) => {

      const key =
        element.dataset.i18n;

      if (
        lang[key] !== undefined
      ) {

        element.textContent =
          lang[key];

      }

    });


  document
    .querySelectorAll(
      "[data-i18n-placeholder]"
    )
    .forEach((element) => {

      const key =
        element.dataset
          .i18nPlaceholder;

      if (
        lang[key] !== undefined
      ) {

        element.placeholder =
          lang[key];

      }

    });


  $("langEN")?.classList.toggle(
    "active",
    state.language === "en"
  );


  $("langAR")?.classList.toggle(
    "active",
    state.language === "ar"
  );


  try {

    localStorage.setItem(
      "habboub_language",
      state.language
    );

  } catch (error) {

    console.warn(
      "Language storage unavailable."
    );

  }


  if (state.user) {
    renderAuthUI();
  }


  renderJournal(
    state.journal
  );


  renderNews(
    state.news
  );


  renderAnnouncements(
    state.announcements
  );


  renderCourses(
    state.courses
  );


  renderLive(
    state.live
  );
}


function setupLanguage() {

  $("langEN")?.addEventListener(
    "click",
    () => {

      applyLanguage(
        "en"
      );

    }
  );


  $("langAR")?.addEventListener(
    "click",
    () => {

      applyLanguage(
        "ar"
      );

    }
  );
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

  document
    .querySelectorAll(
      "[data-nav]"
    )
    .forEach((element) => {

      element.addEventListener(
        "click",
        () => {

          const target =
            element.dataset.nav;

          if (!target) {
            return;
          }

          navigateTo(
            target
          );

        }
      );

    });
}


function navigateTo(
  target
) {

  document
    .querySelectorAll(
      ".page-section"
    )
    .forEach((section) => {

      section.classList.remove(
        "active-section"
      );

    });


  const section =
    $(target);


  if (section) {

    section.classList.add(
      "active-section"
    );

  }


  document
    .querySelectorAll(
      "[data-nav]"
    )
    .forEach((element) => {

      if (
        element.classList.contains(
          "nav-link"
        )
      ) {

        element.classList.toggle(
          "active",
          element.dataset.nav ===
            target
        );

      }

    });


  $("mobileNav")
    ?.classList.remove(
      "open"
    );


  try {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {

    window.scrollTo(
      0,
      0
    );

  }
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

  $("mobileMenuButton")
    ?.addEventListener(
      "click",
      () => {

        $("mobileNav")
          ?.classList.toggle(
            "open"
          );

      }
    );
}


/* =========================================================
   MODALS
========================================================= */

function openModal(
  id
) {

  $(id)
    ?.classList.remove(
      "hidden"
    );
}


function closeModal(
  id
) {

  $(id)
    ?.classList.add(
      "hidden"
    );
}


function setupModals() {

  $("loginButton")
    ?.addEventListener(
      "click",
      async () => {

        const user =
          await withTimeout(
            getCurrentUser(),
            4000,
            null
          );

        if (user) {

          state.user =
            user;

          renderAuthUI();

          toggleProfileMenu();

          return;
        }

        openModal(
          "loginModal"
        );

      }
    );


  $("showRegisterButton")
    ?.addEventListener(
      "click",
      () => {

        closeModal(
          "loginModal"
        );

        clearMessage(
          "loginMessage"
        );

        openModal(
          "registerModal"
        );

      }
    );


  $("showLoginButton")
    ?.addEventListener(
      "click",
      () => {

        closeModal(
          "registerModal"
        );

        clearMessage(
          "registerMessage"
        );

        openModal(
          "loginModal"
        );

      }
    );


  $("openJournalButton")
    ?.addEventListener(
      "click",
      async () => {

        const user =
          await withTimeout(
            getCurrentUser(),
            4000,
            null
          );

        if (!user) {

          openModal(
            "loginModal"
          );

          showToast(
            state.language === "ar"
              ? "سجل الدخول أولاً لاستخدام السجل."
              : "Please login first to use the journal."
          );

          return;
        }

        state.user =
          user;

        openModal(
          "journalModal"
        );

      }
    );


  document
    .querySelectorAll(
      "[data-close-modal]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const modal =
            button.closest(
              ".modal"
            );

          modal?.classList.add(
            "hidden"
          );

        }
      );

    });


  document
    .querySelectorAll(
      ".modal-overlay"
    )
    .forEach((overlay) => {

      overlay.addEventListener(
        "click",
        () => {

          overlay
            .closest(
              ".modal"
            )
            ?.classList.add(
              "hidden"
            );

        }
      );

    });


  $("loginForm")
    ?.addEventListener(
      "submit",
      loginUser
    );


  $("registerForm")
    ?.addEventListener(
      "submit",
      registerUser
    );


  $("journalForm")
    ?.addEventListener(
      "submit",
      saveJournalTrade
    );
}


/* =========================================================
   AUTH
========================================================= */

function setupAuthUI() {

  if (!supabaseClient) {
    return;
  }


  try {

    supabaseClient.auth
      .onAuthStateChange(
        (
          event,
          session
        ) => {

          console.log(
            "Habboub Auth Event:",
            event
          );


          if (
            event === "SIGNED_IN" ||
            event === "SIGNED_OUT" ||
            event === "USER_UPDATED"
          ) {

            setTimeout(
              async () => {

                try {

                  state.user =
                    session?.user ||
                    (
                      event ===
                        "SIGNED_OUT"
                        ? null
                        : state.user
                    );


                  await withTimeout(
                    refreshAuthUI(),
                    5000,
                    null
                  );


                  if (
                    state.user
                  ) {

                    await withTimeout(
                      loadJournal(),
                      5000,
                      null
                    );

                  }

                } catch (error) {

                  console.error(
                    "Auth refresh error:",
                    error
                  );

                }

              },
              100
            );

          }

        }
      );

  } catch (error) {

    console.error(
      "Auth listener error:",
      error
    );

  }
}


async function refreshAuthUI() {

  const user =
    await withTimeout(
      getCurrentUser(),
      4500,
      null
    );


  state.user =
    user;


  state.profile =
    null;


  if (user) {

    state.profile =
      await withTimeout(
        getProfile(
          user.id
        ),
        4500,
        null
      );


    if (
      !state.profile
    ) {

      state.profile =
        await withTimeout(
          ensureProfile(
            user
          ),
          4500,
          null
        );

    }

  }


  renderAuthUI();
}


async function getCurrentUser() {

  if (!supabaseClient) {
    return null;
  }


  try {

    const result =
      await withTimeout(
        supabaseClient
          .auth
          .getUser(),
        4000,
        null
      );


    if (!result) {
      return null;
    }


    const {
      data,
      error
    } = result;


    if (error) {

      console.warn(
        "Get current user:",
        error.message
      );

      return null;
    }


    return (
      data?.user ||
      null
    );

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

async function getProfile(
  userId
) {

  if (
    !userId ||
    !supabaseClient
  ) {
    return null;
  }


  try {

    const result =
      await withTimeout(
        supabaseClient
          .from("profiles")
          .select("*")
          .eq(
            "id",
            userId
          )
          .maybeSingle(),
        4500,
        null
      );


    if (!result) {
      return null;
    }


    const {
      data,
      error
    } = result;


    if (error) {

      console.error(
        "Profile load error:",
        error
      );

      return null;
    }


    return data || null;

  } catch (error) {

    console.error(
      "Profile request error:",
      error
    );

    return null;
  }
}


async function ensureProfile(
  user
) {

  if (
    !user?.id ||
    !supabaseClient
  ) {
    return null;
  }


  const existing =
    await getProfile(
      user.id
    );


  if (existing) {
    return existing;
  }


  const fullName =
    user.user_metadata
      ?.full_name ||
    user.email
      ?.split("@")[0] ||
    "User";


  const avatarUrl =
    user.user_metadata
      ?.avatar_url ||
    null;


  try {

    const result =
      await withTimeout(
        supabaseClient
          .from("profiles")
          .insert({
            id:
              user.id,

            full_name:
              fullName,

            email:
              user.email ||
              null,

            avatar_url:
              avatarUrl
          })
          .select("*")
          .maybeSingle(),
        4500,
        null
      );


    if (!result) {
      return null;
    }


    const {
      data,
      error
    } = result;


    if (error) {

      console.error(
        "Profile creation error:",
        error
      );

      return null;
    }


    return data || null;

  } catch (error) {

    console.error(
      "Profile creation request error:",
      error
    );

    return null;
  }
}


/* =========================================================
   AUTH UI
========================================================= */

function renderAuthUI() {

  const loginButton =
    $("loginButton");

  const profileArea =
    $("profileArea");


  if (!loginButton) {
    return;
  }

  if (!state.user) {

    loginButton.classList.remove(
      "hidden"
    );


    loginButton.classList.remove(
      "user-account-button"
    );


    loginButton.innerHTML =
      translations[
        state.language
      ]?.login ||
      "Login";


    profileArea
      ?.classList.add(
        "hidden"
      );


    $("profileMenu")
      ?.classList.add(
        "hidden"
      );


    return;
  }

  loginButton.classList.add(
    "hidden"
  );


  profileArea
    ?.classList.remove(
      "hidden"
    );


  const name =
    state.profile
      ?.full_name ||
    state.user.user_metadata
      ?.full_name ||
    state.user.email
      ?.split("@")[0] ||
    "User";


  const email =
    state.user.email ||
    "";


  const avatarUrl =
    state.profile
      ?.avatar_url ||
    state.user.user_metadata
      ?.avatar_url ||
    "";


  updateAvatarElement(
    $("profileAvatar"),
    name,
    avatarUrl
  );


  updateAvatarElement(
    $("profileAvatarLarge"),
    name,
    avatarUrl
  );


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


  $("profileMenu")
    ?.classList.add(
      "hidden"
    );
}


/* =========================================================
   AVATAR
========================================================= */

function updateAvatarElement(
  element,
  name,
  avatarUrl
) {

  if (!element) {
    return;
  }


  const initial =
    String(
      name || "U"
    )
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "U";


  element.innerHTML =
    "";


  element.style.borderRadius =
    "50%";

  element.style.overflow =
    "hidden";


  if (avatarUrl) {

    const img =
      document.createElement(
        "img"
      );


    img.src =
      avatarUrl;


    img.alt =
      "Profile avatar";


    img.style.width =
      "100%";

    img.style.height =
      "100%";

    img.style.maxWidth =
      "100%";

    img.style.maxHeight =
      "100%";

    img.style.minWidth =
      "0";

    img.style.minHeight =
      "0";

    img.style.display =
      "block";

    img.style.objectFit =
      "cover";

    img.style.objectPosition =
      "center";

    img.style.borderRadius =
      "50%";


    img.onerror = () => {

      element.innerHTML =
        "";

      element.textContent =
        initial;

      element.classList.remove(
        "has-image"
      );

    };


    element.classList.add(
      "has-image"
    );


    element.appendChild(
      img
    );


    return;
  }


  element.classList.remove(
    "has-image"
  );


  element.textContent =
    initial;
}


/* =========================================================
   PROFILE MENU
========================================================= */

function toggleProfileMenu() {

  if (!state.user) {

    openModal(
      "loginModal"
    );

    return;
  }


  const menu =
    $("profileMenu");


  if (!menu) {
    return;
  }


  menu.classList.toggle(
    "hidden"
  );
}


function setupProfileMenu() {

  const profileButton =
    $("profileButton");

  const profileMenu =
    $("profileMenu");

  const profileLabel =
    $("profileLabel");

  const logoutButton =
    $("logoutButton");


  if (!profileButton) {
    return;
  }


  profileButton.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      toggleProfileMenu();

    }
  );


  profileLabel?.addEventListener(
    "click",
    () => {

      profileMenu
        ?.classList.add(
          "hidden"
        );

      showProfileModal();

    }
  );


  logoutButton?.addEventListener(
    "click",
    async () => {

      profileMenu
        ?.classList.add(
          "hidden"
        );

      await logoutUser();

    }
  );


  document.addEventListener(
    "click",
    (event) => {

      if (
        !profileMenu ||
        profileMenu.classList.contains(
          "hidden"
        )
      ) {
        return;
      }


      if (
        !profileMenu.contains(
          event.target
        ) &&
        !profileButton.contains(
          event.target
        )
      ) {

        profileMenu.classList.add(
          "hidden"
        );

      }

    }
  );
}


/* =========================================================
   LOGOUT
========================================================= */

async function logoutUser() {

  if (!supabaseClient) {
    return;
  }


  try {

    const result =
      await withTimeout(
        supabaseClient
          .auth
          .signOut(),
        5000,
        null
      );


    if (!result) {

      console.warn(
        "Logout timed out."
      );

    } else {

      const {
        error
      } = result;


      if (error) {

        console.error(
          "Logout error:",
          error
        );

        showToast(
          error.message
        );

        return;
      }

    }


    state.user =
      null;

    state.profile =
      null;

    state.journal =
      [];


    $("profileMenu")
      ?.classList.add(
        "hidden"
      );


    renderAuthUI();


    renderJournal(
      []
    );


    showToast(
      state.language === "ar"
        ? "تم تسجيل الخروج."
        : "Logged out successfully."
    );

  } catch (error) {

    console.error(
      "Logout request error:",
      error
    );

  }
}


/* =========================================================
   PROFILE MODAL
========================================================= */

function showProfileModal() {

  document
    .querySelectorAll(
      "#profileModal"
    )
    .forEach((element) => {

      element.remove();

    });


  const user =
    state.user;


  if (!user) {
    return;
  }


  const profile =
    state.profile;


  const name =
    profile?.full_name ||
    user.user_metadata
      ?.full_name ||
    user.email
      ?.split("@")[0] ||
    "User";


  const avatarUrl =
    profile?.avatar_url ||
    user.user_metadata
      ?.avatar_url ||
    "";


  const lang =
    translations[
      state.language
    ] ||
    translations.en;


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "profileModal";


  modal.className =
    "modal";


  modal.style.position =
    "fixed";

  modal.style.inset =
    "0";

  modal.style.zIndex =
    "10000";

  modal.style.display =
    "flex";

  modal.style.alignItems =
    "center";

  modal.style.justifyContent =
    "center";

  modal.style.padding =
    "20px";

  modal.style.boxSizing =
    "border-box";


  modal.innerHTML = `

    <div
      class="modal-overlay"
      data-profile-close
    ></div>

    <div
      class="modal-box profile-modal-box"
      style="
        position:relative;
        width:min(460px, calc(100vw - 32px));
        max-width:460px;
        min-width:0;
        height:auto;
        max-height:calc(100vh - 40px);
        overflow-y:auto;
        box-sizing:border-box;
        z-index:2;
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
        ${escapeHtml(
          lang.my_profile
        )}
      </h2>


      <p class="profile-email">
        ${escapeHtml(
          user.email || ""
        )}
      </p>


      <form
        id="profileForm"
      >

        <label>

          <span>
            ${escapeHtml(
              lang.full_name
            )}
          </span>


          <input
            id="profileFullName"
            type="text"
            value="${escapeAttribute(
              name
            )}"
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
            value="${escapeAttribute(
              avatarUrl
            )}"
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


  document.body.appendChild(
    modal
  );


  updateAvatarElement(
    $("profileLargeAvatarPreview"),
    name,
    avatarUrl
  );


  $("profileModalClose")
    ?.addEventListener(
      "click",
      () => {

        modal.remove();

      }
    );


  modal
    .querySelector(
      "[data-profile-close]"
    )
    ?.addEventListener(
      "click",
      () => {

        modal.remove();

      }
    );


  $("profileForm")
    ?.addEventListener(
      "submit",
      updateProfile
    );


  $("profileAvatarUrl")
    ?.addEventListener(
      "input",
      () => {

        const url =
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
          url
        );

      }
    );


  $("profileFullName")
    ?.addEventListener(
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

async function updateProfile(
  event
) {

  event.preventDefault();


  if (
    !state.user ||
    !supabaseClient
  ) {
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


  if (!fullName) {

    setMessage(
      "profileMessage",
      state.language === "ar"
        ? "اكتب اسمك الكامل."
        : "Please enter your full name."
    );

    return;
  }


  setMessage(
    "profileMessage",
    state.language === "ar"
      ? "جاري الحفظ..."
      : "Saving..."
  );


  try {

    const result =
      await withTimeout(
        supabaseClient
          .from("profiles")
          .upsert(
            {
              id:
                state.user.id,

              full_name:
                fullName,

              email:
                state.user.email ||
                null,

              avatar_url:
                avatarUrl ||
                null
            },
            {
              onConflict:
                "id"
            }
          ),
        5000,
        null
      );


    if (!result) {

      setMessage(
        "profileMessage",
        state.language === "ar"
          ? "انتهت مهلة الاتصال."
          : "Connection timed out."
      );

      return;
    }


    const {
      error
    } = result;


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


    try {

      await withTimeout(
        supabaseClient
          .auth
          .updateUser({
            data: {
              full_name:
                fullName,

              avatar_url:
                avatarUrl ||
                null
            }
          }),
        5000,
        null
      );

    } catch (error) {

      console.error(
        "Auth metadata update error:",
        error
      );

    }


    state.profile = {
      ...(state.profile || {}),
      id: state.user.id,
      full_name: fullName,
      email: state.user.email,
      avatar_url: avatarUrl || null
    };

    renderAuthUI();

    setMessage(
      "profileMessage",
      state.language === "ar"
        ? "تم الحفظ بنجاح!"
        : "Saved successfully!"
    );

    setTimeout(() => {
      document.querySelector("#profileModal")?.remove();
    }, 1000);

  } catch (error) {
    console.error("Update profile error:", error);
    setMessage(
      "profileMessage",
      error.message || "An unexpected error occurred."
    );
  }
}


/* =========================================================
   LOGIN & REGISTER
========================================================= */

async function loginUser(event) {
  event.preventDefault();

  if (!supabaseClient) return;

  const email = $("loginEmail")?.value.trim();
  const password = $("loginPassword")?.value;

  if (!email || !password) {
    setMessage(
      "loginMessage",
      state.language === "ar"
        ? "الرجاء أدخل البريد وكلمة المرور."
        : "Please enter email and password."
    );
    return;
  }

  setMessage(
    "loginMessage",
    state.language === "ar" ? "جاري الدخول..." : "Logging in..."
  );

  try {
    const result = await withTimeout(
      supabaseClient.auth.signInWithPassword({ email, password }),
      6000,
      null
    );

    if (!result) {
      setMessage(
        "loginMessage",
        state.language === "ar" ? "انتهت مهلة الاتصال." : "Connection timed out."
      );
      return;
    }

    const { data, error } = result;

    if (error) {
      setMessage("loginMessage", error.message);
      return;
    }

    state.user = data.user;
    await refreshAuthUI();
    closeModal("loginModal");
    clearMessage("loginMessage");
    showToast(
      state.language === "ar"
        ? translations.ar.login_success
        : translations.en.login_success
    );
  } catch (error) {
    console.error("Login error:", error);
    setMessage("loginMessage", error.message || "Login failed.");
  }
}


async function registerUser(event) {
  event.preventDefault();

  if (!supabaseClient) return;

  const fullName = $("registerName")?.value.trim();
  const email = $("registerEmail")?.value.trim();
  const password = $("registerPassword")?.value;

  if (!fullName || !email || !password) {
    setMessage(
      "registerMessage",
      state.language === "ar"
        ? "الرجاء ملء جميع الحقول."
        : "Please fill all fields."
    );
    return;
  }

  setMessage(
    "registerMessage",
    state.language === "ar" ? "جاري إنشاء الحساب..." : "Creating account..."
  );

  try {
    const result = await withTimeout(
      supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      }),
      6000,
      null
    );

    if (!result) {
      setMessage(
        "registerMessage",
        state.language === "ar" ? "انتهت مهلة الاتصال." : "Connection timed out."
      );
      return;
    }

    const { data, error } = result;

    if (error) {
      setMessage("registerMessage", error.message);
      return;
    }

    if (data.user) {
      state.user = data.user;
      await ensureProfile(data.user);
      await refreshAuthUI();
    }

    closeModal("registerModal");
    clearMessage("registerMessage");
    showToast(
      state.language === "ar"
        ? translations.ar.account_created
        : translations.en.account_created
    );
  } catch (error) {
    console.error("Registration error:", error);
    setMessage("registerMessage", error.message || "Registration failed.");
  }
}


/* =========================================================
   MARKET ANALYSIS
========================================================= */

async function loadMarketAnalysis() {
  if (!supabaseClient) return;

  try {
    const result = await withTimeout(
      supabaseClient
        .from("market_analysis")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      5000,
      null
    );

    if (result && result.data) {
      state.analysis = result.data;
      renderMarketAnalysis(result.data);
    }
  } catch (error) {
    console.error("Load market analysis error:", error);
  }
}

function renderMarketAnalysis(data) {
  if (!data) return;
  setText("analysisTitle", data.title || "");
  setText("analysisContent", data.content || "");
  if (data.updated_at || data.created_at) {
    const d = new Date(data.updated_at || data.created_at);
    setText("analysisDate", d.toLocaleDateString());
  }
}


/* =========================================================
   JOURNAL
========================================================= */

async function loadJournal() {
  if (!supabaseClient || !state.user) return;

  try {
    const result = await withTimeout(
      supabaseClient
        .from("journal")
        .select("*")
        .eq("user_id", state.user.id)
        .order("created_at", { ascending: false }),
      5000,
      null
    );

    if (result && result.data) {
      state.journal = result.data;
      renderJournal(result.data);
    }
  } catch (error) {
    console.error("Load journal error:", error);
  }
}

function renderJournal(trades) {
  const container = $("journalList");
  if (!container) return;

  if (!trades || trades.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">${
      state.language === "ar" ? "لا توجد صفقات مسجلة." : "No recorded trades."
    }</p>`;
    return;
  }

  container.innerHTML = trades
    .map(
      (t) => `
    <div class="journal-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong style="font-size: 16px;">${escapeHtml(t.pair || "N/A")} (${escapeHtml(t.type || "BUY")})</strong>
        <span style="color: ${t.pnl >= 0 ? "#10b981" : "#ef4444"}; font-weight: bold;">
          ${t.pnl >= 0 ? "+" : ""}${t.pnl || 0} USD
        </span>
      </div>
      <p style="font-size: 14px; color: var(--text-muted); margin: 4px 0;">${escapeHtml(t.notes || "")}</p>
      <small style="color: #6b7280;">${new Date(t.created_at).toLocaleString()}</small>
    </div>
  `
    )
    .join("");
}

async function saveJournalTrade(event) {
  event.preventDefault();

  if (!supabaseClient || !state.user) return;

  const pair = $("journalPair")?.value.trim();
  const type = $("journalType")?.value;
  const pnl = parseFloat($("journalPnL")?.value || "0");
  const notes = $("journalNotes")?.value.trim();

  if (!pair) return;

  try {
    const result = await withTimeout(
      supabaseClient.from("journal").insert({
        user_id: state.user.id,
        pair,
        type,
        pnl,
        notes
      }),
      5000,
      null
    );

    if (result && !result.error) {
      closeModal("journalModal");
      $("journalForm")?.reset();
      await loadJournal();
      showToast(
        state.language === "ar" ? "تم حفظ الصفقة." : "Trade saved successfully."
      );
    }
  } catch (error) {
    console.error("Save trade error:", error);
  }
}


/* =========================================================
   NEWS (ECONOMIC CALENDAR - USD)
========================================================= */

async function loadNews() {
  if (!supabaseClient) {
    renderNews([]);
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("news")
      .select("id, title, description, source, url, image_url, category, impact, currency, published_at, created_at, event_name, actual, forecast, previous, event_time, country, unit, time_mode, revised_previous, event_status")
      .eq("category", "economic_calendar")
      .eq("currency", "USD")
      .order("event_time", { ascending: true });

    if (error) {
      console.error("Supabase news query error:", error);
      renderNews([]);
      return;
    }

    if (data) {
      state.news = data;
      renderNews(data);
    } else {
      renderNews([]);
    }
  } catch (error) {
    console.error("Load news unexpected error:", error);
    renderNews([]);
  }
}

function renderNews(newsItems) {
  const container = $("newsList") || $("economicCalendar");
  if (!container) return;

  if (!newsItems || newsItems.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">${
      state.language === "ar" ? "لا توجد أحداث اقتصادية متاحة حالياً" : "No economic events available"
    }</p>`;
    return;
  }

  container.innerHTML = newsItems
    .map((item) => {
      const impactClass =
        item.impact === "High" || item.impact === "high" || item.impact === "HIGH"
          ? "high"
          : item.impact === "Medium" || item.impact === "medium" || item.impact === "MEDIUM"
          ? "medium"
          : "low";

      const eventTitle = item.event_name || item.title || "USD Event";
      const displayTime = item.event_time ? new Date(item.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

      return `
      <div class="news-card" style="background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; font-size: 14px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="impact-badge ${impactClass}" style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
            ${escapeHtml(item.impact || "LOW")}
          </span>
          <span style="font-weight: 600; color: #f3f4f6;">${escapeHtml(eventTitle)}</span>
        </div>
        <div style="display: flex; gap: 16px; color: var(--text-muted); font-size: 13px;">
          <span>Actual: <strong style="color: #fff;">${escapeHtml(item.actual || "-")}</strong></span>
          <span>Forecast: <strong>${escapeHtml(item.forecast || "-")}</strong></span>
          <span>Previous: <strong>${escapeHtml(item.previous || "-")}</strong></span>
          <span style="color: #6b7280;">${escapeHtml(displayTime)}</span>
        </div>
      </div>
    `;
    })
    .join("");
}


/* =========================================================
   ANNOUNCEMENTS
========================================================= */

async function loadAnnouncements() {
  if (!supabaseClient) return;

  try {
    const result = await withTimeout(
      supabaseClient
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false }),
      5000,
      null
    );

    if (result && result.data) {
      state.announcements = result.data;
      renderAnnouncements(result.data);
    }
  } catch (error) {
    console.error("Load announcements error:", error);
  }
}

function renderAnnouncements(list) {
  const container = $("announcementsList");
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = list
    .map(
      (a) => `
    <div class="announcement-item" style="padding: 12px; background: rgba(59,130,246,0.1); border-left: 4px solid #3b82f6; margin-bottom: 8px; border-radius: 4px;">
      <h4 style="margin: 0 0 4px 0; color: #60a5fa;">${escapeHtml(a.title || "")}</h4>
      <p style="margin: 0; font-size: 13px;">${escapeHtml(a.content || "")}</p>
    </div>
  `
    )
    .join("");
}


/* =========================================================
   COURSES
========================================================= */

async function loadCourses() {
  if (!supabaseClient) return;

  try {
    const result = await withTimeout(
      supabaseClient
        .from("courses")
        .select("*")
        .order("created_at", { ascending: true }),
      5000,
      null
    );

    if (result && result.data) {
      state.courses = result.data;
      renderCourses(result.data);
    }
  } catch (error) {
    console.error("Load courses error:", error);
  }
}

function renderCourses(courses) {
  const container = $("coursesGrid");
  if (!container) return;

  if (!courses || courses.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); text-align: center;">${
      state.language === "ar" ? "لا توجد دورات متاحة حالياً." : "No courses available."
    }</p>`;
    return;
  }

  container.innerHTML = courses
    .map(
      (c) => `
    <div class="course-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 20px; border-radius: 12px;">
      <h3>${escapeHtml(c.title || "")}</h3>
      <p style="color: var(--text-muted); font-size: 14px;">${escapeHtml(c.description || "")}</p>
      ${
        c.link
          ? `<a href="${escapeAttribute(c.link)}" target="_blank" class="primary-btn" style="display: inline-block; margin-top: 12px; text-decoration: none;">Watch Course</a>`
          : ""
      }
    </div>
  `
    )
    .join("");
}


/* =========================================================
   LIVE STREAM
========================================================= */

async function loadLive() {
  if (!supabaseClient) return;

  try {
    const result = await withTimeout(
      supabaseClient
        .from("live")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      5000,
      null
    );

    if (result && result.data) {
      state.live = result.data;
      renderLive(result.data);
    }
  } catch (error) {
    console.error("Load live stream error:", error);
  }
}

function renderLive(liveData) {
  const container = $("liveStreamContainer");
  if (!container) return;

  if (!liveData || !liveData.is_live) {
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">${
      state.language === "ar" ? "البث المباشر غير متاح حالياً." : "Live stream is currently offline."
    }</div>`;
    return;
  }

  container.innerHTML = `
    <div style="aspect-ratio: 16/9; width: 100%;">
      <iframe src="${escapeAttribute(liveData.stream_url)}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
    </div>
  `;
}


/* =========================================================
   REALTIME SUBSCRIPTIONS
========================================================= */

function subscribeToUpdates() {
  if (!supabaseClient) return;

  supabaseClient
    .channel("public-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "news" },
      (payload) => {
        console.log("Realtime news update received:", payload);
        loadNews();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "market_analysis" },
      () => {
        loadMarketAnalysis();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "live" },
      () => {
        loadLive();
      }
    )
    .subscribe();
}


/* =========================================================
   AI SETUP
========================================================= */

function setupAI() {
  const askBtn = $("askAiButton");
  const input = $("aiInput");
  const responseBox = $("aiResponse");

  if (!askBtn || !input) return;

  askBtn.addEventListener("click", async () => {
    const prompt = input.value.trim();
    if (!prompt) return;

    if (responseBox) {
      responseBox.textContent = state.language === "ar" ? "جاري التفكير..." : "Thinking...";
    }

    setTimeout(() => {
      if (responseBox) {
        responseBox.textContent =
          state.language === "ar"
            ? "الذكاء الاصطناعي متصل وجاهز للتحليل الفني والأساسي."
            : "AI Assistant is connected and ready for technical analysis.";
      }
    }, 1200);
  });
}


/* =========================================================
   CLOCK & TIMELINE
========================================================= */

function updateClock() {
  const clockEl = $("liveClock");
  if (!clockEl) return;
  const now = new Date();
  clockEl.textContent = now.toUTCString().replace("GMT", "UTC");
}

function updateSessionTimeline() {
  const timelineEl = $("sessionTimeline");
  if (!timelineEl) return;
}


/* =========================================================
   AUTO INIT ON LOAD
========================================================= */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
