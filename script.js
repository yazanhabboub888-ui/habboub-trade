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


  /*
   * CRITICAL:
   *
   * Hide the loader BEFORE waiting for Supabase.
   *
   * The website must NEVER depend on
   * Supabase to become visible.
   */

  hideLoader();


  /*
   * Extra loader safety.
   */

  setTimeout(() => {
    hideLoader();
  }, 1000);


  try {

    /* -----------------------------------------
       FRONTEND
    ----------------------------------------- */

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


    /* -----------------------------------------
       CLOCK
    ----------------------------------------- */

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


    /*
     * Make absolutely sure loader is gone.
     */

    hideLoader();


    /* -----------------------------------------
       SUPABASE DATA
       Runs in background.
    ----------------------------------------- */

    if (!supabaseClient) {

      console.warn(
        "Habboub: Running without Supabase."
      );

      return;
    }


    /*
     * Authentication gets a maximum of 5 seconds.
     *
     * Even if Supabase hangs,
     * the website stays usable.
     */

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


    /*
     * NEVER block the page on database requests.
     */

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


    /*
     * Realtime is also background-only.
     */

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

    /*
     * Final emergency loader removal.
     */

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


  /*
   * LOGGED OUT
   */

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


  /*
   * LOGGED IN
   */

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


    state.profile =
      await getProfile(
        state.user.id
      );


    renderAuthUI();


    setMessage(
      "profileMessage",
      state.language === "ar"
        ? "تم حفظ التغييرات."
        : "Changes saved."
    );


    showToast(
      state.language === "ar"
        ? "تم تحديث الملف الشخصي."
        : "Profile updated."
    );

  } catch (error) {

    console.error(
      "Profile update request error:",
      error
    );

    setMessage(
      "profileMessage",
      error.message ||
        "Profile update failed."
    );
  }
}


/* =========================================================
   LOGIN
========================================================= */

async function loginUser(
  event
) {

  event.preventDefault();


  if (!supabaseClient) {

    setMessage(
      "loginMessage",
      "Supabase is not available."
    );

    return;
  }


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
        : "Enter the email and password."
    );

    return;
  }


  setMessage(
    "loginMessage",
    state.language === "ar"
      ? "جاري تسجيل الدخول..."
      : "Logging in..."
  );


  try {

    const result =
      await withTimeout(
        supabaseClient
          .auth
          .signInWithPassword({
            email,
            password
          }),
        8000,
        null
      );


    if (!result) {

      setMessage(
        "loginMessage",
        state.language === "ar"
          ? "انتهت مهلة الاتصال. حاول مرة أخرى."
          : "Connection timed out. Please try again."
      );

      return;
    }


    const {
      data,
      error
    } = result;


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
      data?.user ||
      null;


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


    closeModal(
      "loginModal"
    );


    $("loginForm")
      ?.reset();


    await loadJournal();


    showToast(
      state.language === "ar"
        ? "تم تسجيل الدخول بنجاح."
        : "Login successful."
    );

  } catch (error) {

    console.error(
      "Login request error:",
      error
    );

    setMessage(
      "loginMessage",
      error.message ||
        "Login failed."
    );
  }
}


/* =========================================================
   REGISTER
========================================================= */

async function registerUser(
  event
) {

  event.preventDefault();


  if (!supabaseClient) {

    setMessage(
      "registerMessage",
      "Supabase is not available."
    );

    return;
  }


  const fullName =
    (
      $("registerFullName") ||
      $("registerName")
    )
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


  if (
    fullName.length < 2
  ) {

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


  if (
    password.length < 6
  ) {

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


  try {

    const result =
      await withTimeout(
        supabaseClient
          .auth
          .signUp({
            email,
            password,

            options: {

              data: {
                full_name:
                  fullName
              },

              emailRedirectTo:
                "https://yazanhabboub888-ui.github.io/habboub-trade/"
            }
          }),
        10000,
        null
      );


    if (!result) {

      setMessage(
        "registerMessage",
        state.language === "ar"
          ? "انتهت مهلة الاتصال. حاول مرة أخرى."
          : "Connection timed out. Please try again."
      );

      return;
    }


    const {
      data,
      error
    } = result;


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


    if (
      data?.session &&
      data?.user
    ) {

      state.user =
        data.user;


      await ensureProfile(
        data.user
      );


      await refreshAuthUI();


      closeModal(
        "registerModal"
      );


      $("registerForm")
        ?.reset();


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
        ? "تم إنشاء الحساب. افحص بريدك الإلكتروني واضغط رابط التأكيد."
        : "Account created. Check your email and click the confirmation link."
    );

  } catch (error) {

    console.error(
      "Register request error:",
      error
    );

    setMessage(
      "registerMessage",
      error.message ||
        "Registration failed."
    );
  }
}


/* =========================================================
   JOURNAL — LOAD
========================================================= */

async function loadJournal() {

  if (!supabaseClient) {
    return;
  }


  const user =
    await getCurrentUser();


  if (!user) {

    state.journal =
      [];

    renderJournal(
      []
    );

    return;
  }


  try {

    const result =
      await withTimeout(
        supabaseClient
          .from("trading_journal")
          .select("*")
          .eq(
            "user_id",
            user.id
          )
          .order(
            "created_at",
            {
              ascending:
                false
            }
          ),
        5000,
        null
      );


    if (!result) {

      console.warn(
        "Journal request timed out."
      );

      return;
    }


    const {
      data,
      error
    } = result;


    if (error) {

      console.error(
        "Journal load error:",
        error
      );

      state.journal =
        [];

      renderJournal(
        []
      );

      return;
    }


    state.journal =
      data || [];


    renderJournal(
      state.journal
    );

  } catch (error) {

    console.error(
      "Journal request error:",
      error
    );

  }
}


/* =========================================================
   JOURNAL — SAVE
========================================================= */

async function saveJournalTrade(
  event
) {

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
        ?.value ||
      0
    );


  const notes =
    $("tradeNotes")
      ?.value
      .trim() ||
    "";


  if (
    Number.isNaN(
      rResult
    )
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


  try {

    const resultResponse =
      await withTimeout(
        supabaseClient
          .from("trading_journal")
          .insert({
            user_id:
              user.id,

            journal_type:
              "manual",

            symbol,

            direction:
              result === "win"
                ? "WIN"
                : result === "loss"
                ? "LOSS"
                : "BREAKEVEN",

            setup,

            result,

            r_result:
              rResult,

            notes

          })
          .select("*")
          .maybeSingle(),
        7000,
        null
      );


    if (!resultResponse) {

      setMessage(
        "journalMessage",
        state.language === "ar"
          ? "انتهت مهلة الاتصال."
          : "Connection timed out."
      );

      return;
    }


    const {
      data,
      error
    } = resultResponse;


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


    $("journalForm")
      ?.reset();


    if ($("tradeSymbol")) {

      $("tradeSymbol").value =
        "XAUUSD";

    }


    if ($("tradeR")) {

      $("tradeR").value =
        "1";

    }


    await loadJournal();


    showToast(
      state.language === "ar"
        ? "تم حفظ الصفقة بنجاح."
        : "Trade saved successfully."
    );


    setTimeout(() => {

      closeModal(
        "journalModal"
      );

    }, 500);

  } catch (error) {

    console.error(
      "Journal save request error:",
      error
    );

    setMessage(
      "journalMessage",
      error.message ||
        "Could not save trade."
    );
  }
}


/* =========================================================
   JOURNAL — DELETE
========================================================= */

async function deleteJournalTrade(
  tradeId
) {

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


  if (
    !window.confirm(
      confirmText
    )
  ) {
    return;
  }


  try {

    const result =
      await withTimeout(
        supabaseClient
          .from("trading_journal")
          .delete()
          .eq(
            "id",
            tradeId
          )
          .eq(
            "user_id",
            user.id
          ),
        6000,
        null
      );


    if (!result) {

      showToast(
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

  } catch (error) {

    console.error(
      "Journal delete request error:",
      error
    );

  }
}


/* =========================================================
   JOURNAL — RENDER
========================================================= */

function renderJournal(
  trades
) {

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
        trade.result ===
        "win"
    ).length;


  const winRate =
    (
      wins /
      trades.length *
      100
    ).toFixed(1);


  const totalR =
    trades.reduce(
      (
        sum,
        trade
      ) =>
        sum +
        Number(
          trade.r_result ||
            0
        ),
      0
    );


  const averageR =
    (
      totalR /
      trades.length
    ).toFixed(2);


  const grossProfit =
    trades
      .filter(
        (trade) =>
          Number(
            trade.r_result ||
              0
          ) > 0
      )
      .reduce(
        (
          sum,
          trade
        ) =>
          sum +
          Number(
            trade.r_result ||
              0
          ),
        0
      );


  const grossLoss =
    Math.abs(
      trades
        .filter(
          (trade) =>
            Number(
              trade.r_result ||
                0
            ) < 0
        )
        .reduce(
          (
            sum,
            trade
          ) =>
            sum +
            Number(
              trade.r_result ||
                0
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


  let cumulative =
    0;


  let peak =
    0;


  let maxDrawdown =
    0;


  [...trades]
    .reverse()
    .forEach(
      (trade) => {

        cumulative +=
          Number(
            trade.r_result ||
              0
          );


        peak =
          Math.max(
            peak,
            cumulative
          );


        maxDrawdown =
          Math.max(
            maxDrawdown,
            peak -
              cumulative
          );

      }
    );


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
      .map(
        (trade) => {

          const resultClass =
            trade.result ===
            "win"
              ? "positive"
              : trade.result ===
                "loss"
              ? "negative"
              : "neutral";


          const resultLabel =
            trade.result ===
            "win"
              ? state.language ===
                "ar"
                ? "ربح"
                : "Win"
              : trade.result ===
                "loss"
              ? state.language ===
                "ar"
                ? "خسارة"
                : "Loss"
              : state.language ===
                "ar"
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

                <span
                  class="${resultClass}"
                >
                  ${resultLabel}
                </span>

              </div>


              <div>

                <strong>
                  ${Number(
                    trade.r_result ||
                      0
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
                    state.language ===
                    "ar"
                      ? "حذف"
                      : "Delete"
                  }
                </button>

              </div>

            </div>
          `;
        }
      )
      .join("");


  container
    .querySelectorAll(
      "[data-delete-trade]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            deleteJournalTrade(
              button.dataset
                .deleteTrade
            );

          }
        );

      }
    );
}


/* =========================================================
   MARKET ANALYSIS
========================================================= */

async function loadMarketAnalysis() {

  if (!supabaseClient) {
    return;
  }


  try {

    const result =
      await withTimeout(
        supabaseClient
          .from("market_analysis")
          .select("*")
          .order(
            "created_at",
            {
              ascending:
                false
            }
          )
          .limit(1)
          .maybeSingle(),
        5000,
        null
      );


    if (!result) {

      console.warn(
        "Market analysis request timed out."
      );

      return;
    }


    const {
      data,
      error
    } = result;


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


    renderAnalysis(
      data
    );


    setText(
      "lastUpdated",
      data.created_at
        ? formatDate(
            data.created_at
          )
        : "--"
    );

  } catch (error) {

    console.error(
      "Market analysis request error:",
      error
    );

  }
}


function renderAnalysis(
  data
) {

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
    `${
      Number.isFinite(
        confidence
      )
        ? confidence
        : 0
    }%`
  );


  setText(
    "analysisConfidenceLarge",
    `${
      Number.isFinite(
        confidence
      )
        ? confidence
        : 0
    }%`
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


  renderScoreReasons(
    data
  );
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
        Number(score) ||
          0
      )
    );


  const safeConfidence =
    Math.max(
      0,
      Math.min(
        100,
        Number(confidence) ||
          0
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
      riskToNumber(
        risk
      );


    const meter =
      riskMeter.querySelector(
        "span"
      );


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


function riskToNumber(
  risk
) {

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
    String(
      risk
    )
      .toLowerCase();


  if (
    text.includes(
      "extreme"
    )
  ) {

    return 90;

  }


  if (
    text.includes(
      "high"
    )
  ) {

    return 75;

  }


  if (
    text.includes(
      "medium"
    )
  ) {

    return 50;

  }


  if (
    text.includes(
      "low"
    )
  ) {

    return 25;

  }


  return 50;
}


/* =========================================================
   SCORE REASONS
========================================================= */

function renderScoreReasons(
  data
) {

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
      item[1] !==
        null &&
      item[1] !==
        undefined &&
      String(
        item[1]
      ).trim() !== ""
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
                ${escapeHtml(
                  title
                )}
              </strong>

              <p>
                ${escapeHtml(
                  String(
                    value
                  )
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
   IMPORTANT:
   - Uses published_at
   - Never blocks the loader
   - News errors are isolated
========================================================= */

async function loadNews() {

  /*
   * NEWS IS ALWAYS BACKGROUND-ONLY.
   * It must never prevent the website from loading.
   */

  if (!supabaseClient) {

    state.news = [];

    renderNews([]);

    return;
  }


  try {

    const newsRequest =
      supabaseClient
        .from("news")
        .select(
          "id,title,description,source,url,image_url,category,impact,currency,published_at,created_at"
    )
    .eq(
      "currency",
      "USD"
    )
    .order(
      "published_at",
      {
        ascending:
          false
      }
    )
    .limit(30);


    const result =
      await withTimeout(
        newsRequest,
        5000,
        null
      );


    /*
     * Timeout:
     * Do NOT throw.
     * Do NOT affect the rest of the website.
     */

    if (!result) {

      console.warn(
        "News request timed out."
      );

      state.news = [];

      renderNews([]);

      return;
    }


    const {
      data,
      error
    } = result;


    if (error) {

      console.warn(
        "News unavailable:",
        error.message
      );

      state.news = [];

      renderNews([]);

      return;
    }


    state.news =
      Array.isArray(data)
        ? data
        : [];


    renderNews(
      state.news
    );

  } catch (error) {

    /*
     * News must NEVER break the page.
     */

    console.warn(
      "News request failed:",
      error
    );

    state.news = [];

    try {

      renderNews([]);

    } catch (renderError) {

      console.warn(
        "News render failed:",
        renderError
      );

    }

  }
}


function renderNews(
  news
) {

  const container =
    $("newsContainer");


  if (!container) {
    return;
  }


  if (
    !Array.isArray(news) ||
    news.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <span>◌</span>

        <strong>
          ${
            state.language === "ar"
              ? "لا توجد أخبار حالياً"
              : "No news available"
          }
        </strong>

        <p>
          ${
            state.language === "ar"
              ? "سيتم تحديث الأخبار تلقائياً."
              : "News will be updated automatically."
          }
        </p>

      </div>

    `;

    return;
  }


  container.innerHTML =
    news
      .map(
        (item) => {

          const impact =
            String(
              item?.impact ||
              "medium"
            ).toLowerCase();


          let impactLabel =
            "MEDIUM";


          if (
            impact ===
            "critical"
          ) {

            impactLabel =
              state.language === "ar"
                ? "حرج"
                : "CRITICAL";

          } else if (
            impact ===
            "high"
          ) {

            impactLabel =
              state.language === "ar"
                ? "مرتفع"
                : "HIGH";

          } else {

            impactLabel =
              state.language === "ar"
                ? "متوسط"
                : "MEDIUM";

          }


          const title =
            item?.title ||
            (
              state.language === "ar"
                ? "خبر اقتصادي"
                : "Economic News"
            );


          const description =
            item?.description ||
            "";


          const source =
            item?.source ||
            "Finnhub";


          const publishedAt =
            item?.published_at ||
            item?.created_at ||
            null;


          const date =
            publishedAt
              ? formatDate(
                  publishedAt
                )
              : "--";


          const articleUrl =
            item?.url ||
            "";


          const imageUrl =
            item?.image_url ||
            "";


          return `

            <article class="news-card">

              ${
                imageUrl
                  ? `
                    <div class="news-image">
                      <img
                        src="${escapeAttribute(
                          imageUrl
                        )}"
                        alt="${escapeAttribute(
                          title
                        )}"
                        loading="lazy"
                        onerror="this.parentElement.style.display='none';"
                      >
                    </div>
                  `
                  : ""
              }


              <div>

                <span class="news-impact">
                  ${escapeHtml(
                    impactLabel
                  )}
                </span>


                <h3>
                  ${escapeHtml(
                    title
                  )}
                </h3>


                ${
                  description
                    ? `
                      <p>
                        ${escapeHtml(
                          description
                        )}
                      </p>
                    `
                    : ""
                }


                <small>
                  ${escapeHtml(
                    source
                  )}
                </small>


                ${
                  articleUrl
                    ? `
                      <a
                        href="${escapeAttribute(
                          articleUrl
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="news-link"
                      >
                        ${
                          state.language ===
                          "ar"
                            ? "قراءة الخبر"
                            : "Read article"
                        }
                      </a>
                    `
                    : ""
                }

              </div>


              <time>
                ${escapeHtml(
                  date
                )}
              </time>

            </article>

          `;
        }
      )
      .join("");
}


/* =========================================================
   ANNOUNCEMENTS
========================================================= */

async function loadAnnouncements() {

  if (!supabaseClient) {
    return;
  }


  try {

    const result =
      await withTimeout(
        supabaseClient
          .from("announcements")
          .select("*")
          .order(
            "created_at",
            {
              ascending:
                false
            }
          ),
        5000,
        null
      );


    if (!result) {

      console.warn(
        "Announcements request timed out."
      );

      return;
    }


    const {
      data,
      error
    } = result;


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

  } catch (error) {

    console.error(
      "Announcements request error:",
      error
    );

  }
}


function renderAnnouncements(
  items
) {

  const container =
    $("announcementsContainer");


  if (!container) {
    return;
  }


  if (!items?.length) {

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

  if (!supabaseClient) {
    return;
  }


  try {

    const result =
      await withTimeout(
        supabaseClient
          .from("courses")
          .select("*")
          .order(
            "created_at",
            {
              ascending:
                false
            }
          ),
        5000,
        null
      );


    if (!result) {

      console.warn(
        "Courses request timed out."
      );

      return;
    }


    const {
      data,
      error
    } = result;


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

  } catch (error) {

    console.error(
      "Courses request error:",
      error
    );

  }
}


function renderCourses(
  courses
) {

  const container =
    $("courseContainer");


  if (!container) {
    return;
  }


  if (!courses?.length) {

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
                state.language ===
                "ar"
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

  if (!supabaseClient) {
    return;
  }


  try {

    const result =
      await withTimeout(
        supabaseClient
          .from("live_sessions")
          .select("*")
          .order(
            "created_at",
            {
              ascending:
                false
            }
          )
          .limit(1)
          .maybeSingle(),
        5000,
        null
      );


    if (!result) {

      console.warn(
        "Live request timed out."
      );

      return;
    }


    const {
      data,
      error
    } = result;


    if (error) {

      console.error(
        "Live error:",
        error
      );

      return;
    }


    state.live =
      data || null;


    renderLive(
      state.live
    );

  } catch (error) {

    console.error(
      "Live request error:",
      error
    );

  }
}


function renderLive(
  data
) {

  const indicator =
    $("liveIndicator");


  const title =
    $("liveTitleDisplay");


  const description =
    $("liveDescriptionDisplay");


  const isLive =
    data &&
    (
      data.is_live ===
        true ||
      data.status ===
        "live"
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
        : state.language ===
          "ar"
        ? "لا توجد جلسة مباشرة الآن"
        : "No live session right now";

  }


  if (description) {

    description.textContent =
      isLive
        ? data.description ||
          ""
        : state.language ===
          "ar"
        ? "ستظهر جلسة البث هنا عندما يبدأ المشرف جلسة."
        : "The live room will appear here when the admin starts a session.";

  }
}


/* =========================================================
   REALTIME
========================================================= */

function subscribeToUpdates() {

  if (!supabaseClient) {
    return;
  }


  try {

    const channel =
      supabaseClient
        .channel(
          "habboub-realtime"
        );


    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "market_analysis"
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
          table:
            "announcements"
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
          table:
            "courses"
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
          table:
            "live_sessions"
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
          table:
            "trading_journal"
        },
        () => {

          if (state.user) {

            loadJournal();

          }

        }
      )


      .subscribe(
        (status) => {

          console.log(
            "Habboub Realtime:",
            status
          );

        }
      );

  } catch (error) {

    console.error(
      "Realtime error:",
      error
    );

  }
}


/* =========================================================
   AI
========================================================= */

function setupAI() {

  $("openAIButton")
    ?.addEventListener(
      "click",
      () => {

        $("aiWindow")
          ?.classList.remove(
            "hidden"
          );

      }
    );


  $("floatingAI")
    ?.addEventListener(
      "click",
      () => {

        $("aiWindow")
          ?.classList.toggle(
            "hidden"
          );

      }
    );


  $("closeAIButton")
    ?.addEventListener(
      "click",
      () => {

        $("aiWindow")
          ?.classList.add(
            "hidden"
          );

      }
    );


  $("aiForm")
    ?.addEventListener(
      "submit",
      handleAI
    );
}


async function handleAI(
  event
) {

  event.preventDefault();


  const input =
    $("aiInput");


  const messages =
    $("aiMessages");


  if (
    !input ||
    !messages
  ) {
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


  input.value =
    "";


  const response =
    buildLocalAIResponse(
      message
    );


  setTimeout(
    () => {

      addAIMessage(
        "bot",
        response
      );

    },
    400
  );
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
    document.createElement(
      "div"
    );


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
      ${escapeHtml(
        text
      )}
    </p>

  `;


  container.appendChild(
    message
  );


  container.scrollTop =
    container.scrollHeight;
}


function buildLocalAIResponse(
  message
) {

  const text =
    message.toLowerCase();


  const score =
    state.analysis?.score ??
    state.analysis
      ?.habboub_score;


  const condition =
    state.analysis
      ?.market_condition ||
    state.analysis
      ?.condition;


  const risk =
    state.analysis?.risk ||
    state.analysis
      ?.risk_level;


  if (
    text.includes(
      "score"
    ) ||
    text.includes(
      "درجة"
    )
  ) {

    return `Current Habboub Score: ${
      score ?? "--"
    }/100.`;
  }


  if (
    text.includes(
      "risk"
    ) ||
    text.includes(
      "خطر"
    ) ||
    text.includes(
      "مخاطرة"
    )
  ) {

    return `Current risk environment: ${
      risk ?? "--"
    }.`;
  }


  if (
    text.includes(
      "gold"
    ) ||
    text.includes(
      "xau"
    ) ||
    text.includes(
      "ذهب"
    )
  ) {

    return `XAUUSD is currently being monitored through the Habboub market context. Current environment: ${
      condition ?? "--"
    }.`;
  }


  return "Habboub is monitoring market structure, liquidity, risk and the current market environment.";
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
        hour12:
          false
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
    .querySelectorAll(
      ".timeline-item"
    )
    .forEach(
      (item) => {

        item.classList.remove(
          "current"
        );

      }
    );


  if (
    hour >= 0 &&
    hour < 8
  ) {

    $("asiaSession")
      ?.classList.add(
        "current"
      );

  } else if (
    hour >= 8 &&
    hour < 13
  ) {

    $("londonSession")
      ?.classList.add(
        "current"
      );

  } else if (
    hour >= 13 &&
    hour < 21
  ) {

    $("newYorkSession")
      ?.classList.add(
        "current"
      );

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


function clearMessage(
  id
) {

  setMessage(
    id,
    ""
  );
}


function showToast(
  message
) {

  const toast =
    $("toast");


  if (!toast) {
    return;
  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    showToast.timeout
  );


  showToast.timeout =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      3000
    );
}


function formatDate(
  value
) {

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
      dateStyle:
        "medium",

      timeStyle:
        "short"
    }
  );
}


function escapeHtml(
  value
) {

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


function escapeAttribute(
  value
) {

  return escapeHtml(
    value
  );
}


/* =========================================================
   GLOBAL ERROR PROTECTION
========================================================= */

window.addEventListener(
  "error",
  (event) => {

    console.error(
      "Habboub JavaScript error:",
      event.error ||
        event.message
    );


    /*
     * If ANY unexpected JS error happens,
     * the loader still disappears.
     */

    hideLoader();

  }
);


window.addEventListener(
  "unhandledrejection",
  (event) => {

    console.error(
      "Habboub Promise error:",
      event.reason
    );


    hideLoader();

  }
);


/* =========================================================
   START
========================================================= */

function startHabboub() {

  /*
   * Emergency loader kill.
   * Even if something goes horribly wrong,
   * the page won't stay stuck.
   */

  hideLoader();


  setTimeout(() => {
    hideLoader();
  }, 1500);


  try {

    const result =
      init();


    /*
     * init() is async.
     * Catch rejected promises here too.
     */

    if (
      result &&
      typeof result.catch ===
        "function"
    ) {

      result.catch(
        (error) => {

          console.error(
            "Habboub startup error:",
            error
          );

          hideLoader();

        }
      );

    }

  } catch (error) {

    console.error(
      "Habboub startup error:",
      error
    );

    hideLoader();

  }
}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startHabboub,
    {
      once: true
    }
  );

} else {

  startHabboub();

}
