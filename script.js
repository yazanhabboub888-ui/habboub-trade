// ======================================
// HABBOUB FRONTEND
// SUPABASE CONNECTION
// ======================================

const SUPABASE_URL =
  "https://feoyjasuvrqxzhskqzye.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// ======================================
// PAGE LOADER
// ======================================

window.addEventListener("load", function () {

  setTimeout(function () {

    const loader = document.getElementById("loader");

    if (loader) {
      loader.classList.add("hidden");
    }

  }, 900);

});


// ======================================
// AUTH
// ======================================

async function getCurrentUser() {

  const { data, error } =
    await supabaseClient.auth.getUser();

  if (error) {
    console.warn("Auth:", error.message);
    return null;
  }

  return data.user || null;
}


// ======================================
// LOGIN MODAL
// ======================================

function openLogin() {

  closeModals();

  const modal =
    document.getElementById("loginModal");

  if (modal) {
    modal.classList.add("active");
  }
}


function openRegister() {

  closeModals();

  const modal =
    document.getElementById("registerModal");

  if (modal) {
    modal.classList.add("active");
  }
}


function closeModals() {

  document
    .querySelectorAll(".modal")
    .forEach(function (modal) {

      modal.classList.remove("active");

    });

}


// ======================================
// LOGIN
// ======================================

async function loginUser() {

  const emailElement =
    document.getElementById("loginEmail");

  const passwordElement =
    document.getElementById("loginPassword");

  const message =
    document.getElementById("loginMessage");

  const button =
    document.getElementById("loginButton");

  if (!emailElement || !passwordElement) {
    console.error("Login fields not found.");
    return;
  }

  const email =
    emailElement.value.trim();

  const password =
    passwordElement.value;

  if (!email || !password) {

    if (message) {
      message.textContent =
        "Please enter your email and password.";
    }

    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "Logging in...";
  }

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

  if (error) {

    if (message) {
      message.textContent =
        error.message;
    }

    if (button) {
      button.disabled = false;
      button.textContent = "Login";
    }

    return;
  }

  if (message) {
    message.textContent =
      "Login successful.";
  }

  await loadUserProfile(data.user);

  setTimeout(function () {

    closeModals();

    if (button) {
      button.disabled = false;
      button.textContent = "Login";
    }

  }, 600);

}


// ======================================
// REGISTER
// ======================================

async function registerUser() {

  const nameElement =
    document.getElementById("registerName");

  const emailElement =
    document.getElementById("registerEmail");

  const passwordElement =
    document.getElementById("registerPassword");

  const message =
    document.getElementById("registerMessage");

  const button =
    document.getElementById("registerButton");

  if (!nameElement || !emailElement || !passwordElement) {
    console.error("Register fields not found.");
    return;
  }

  const fullName =
    nameElement.value.trim();

  const email =
    emailElement.value.trim();

  const password =
    passwordElement.value;

  if (!fullName || !email || !password) {

    if (message) {
      message.textContent =
        "Please complete all fields.";
    }

    return;
  }

  if (password.length < 6) {

    if (message) {
      message.textContent =
        "Password must be at least 6 characters.";
    }

    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "Creating...";
  }

  const { data, error } =
    await supabaseClient.auth.signUp({

      email: email,

      password: password,

      options: {
        data: {
          full_name: fullName
        }
      }

    });

  if (error) {

    if (message) {
      message.textContent =
        error.message;
    }

    if (button) {
      button.disabled = false;
      button.textContent = "Create Account";
    }

    return;
  }

  if (data.user) {

    const { error: profileError } =
      await supabaseClient
        .from("profiles")
        .upsert({
          id: data.user.id,
          full_name: fullName,
          email: email
        });

    if (profileError) {
      console.warn(
        "Profile:",
        profileError.message
      );
    }

  }

  if (message) {
    message.textContent =
      "Account created. Check your email if confirmation is required.";
  }

  if (button) {
    button.disabled = false;
    button.textContent = "Create Account";
  }

}


// ======================================
// PROFILE
// ======================================

async function loadUserProfile(user) {

  if (!user) return;

  const { data, error } =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

  if (error) {

    console.warn(
      "Profile:",
      error.message
    );

    return;
  }

  if (!data) {

    await supabaseClient
      .from("profiles")
      .insert({
        id: user.id,
        full_name:
          user.user_metadata?.full_name || "",
        email:
          user.email || ""
      });

  }

}


// ======================================
// GUEST
// ======================================

function enterGuest() {

  const dashboard =
    document.getElementById("dashboard");

  if (dashboard) {

    dashboard.scrollIntoView({
      behavior: "smooth"
    });

  }

}


// ======================================
// ANNOUNCEMENTS
// ======================================

async function loadAnnouncements() {

  const container =
    document.getElementById(
      "announcementsContainer"
    );

  if (!container) return;

  const { data, error } =
    await supabaseClient
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", {
        ascending: false
      });

  if (error) {

    console.warn(
      "Announcements:",
      error.message
    );

    return;
  }

  if (!data || data.length === 0) {

    container.innerHTML = "";

    return;
  }

  container.innerHTML =
    data.map(function (item) {

      return `
        <article class="dashboard-card">

          <span class="eyebrow">
            ANNOUNCEMENT
          </span>

          <h3>
            ${escapeHTML(item.title)}
          </h3>

          <p>
            ${escapeHTML(item.content || "")}
          </p>

          ${
            item.image_url
              ? `
                <img
                  src="${escapeAttribute(item.image_url)}"
                  alt="Announcement"
                  style="max-width:100%;border-radius:12px;margin-top:15px;"
                >
              `
              : ""
          }

          ${
            item.link_url
              ? `
                <a
                  href="${escapeAttribute(item.link_url)}"
                  target="_blank"
                  rel="noopener"
                  class="primary-btn">
                  Open
                </a>
              `
              : ""
          }

        </article>
      `;

    }).join("");

}


// ======================================
// COURSES
// ======================================

async function loadCourses() {

  const container =
    document.getElementById(
      "courseContainer"
    );

  if (!container) return;

  const { data, error } =
    await supabaseClient
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", {
        ascending: false
      });

  if (error) {

    console.warn(
      "Courses:",
      error.message
    );

    return;
  }

  if (!data || data.length === 0) {

    return;
  }

  container.innerHTML =
    data.map(function (course, index) {

      return `
        <article class="course-card">

          <span class="course-number">
            ${String(index + 1).padStart(2, "0")}
          </span>

          ${
            course.thumbnail_url
              ? `
                <img
                  src="${escapeAttribute(course.thumbnail_url)}"
                  alt="${escapeAttribute(course.title)}"
                  style="width:100%;border-radius:12px;margin:12px 0;"
                >
              `
              : ""
          }

          <h3>
            ${escapeHTML(course.title)}
          </h3>

          <p>
            ${escapeHTML(course.description || "")}
          </p>

          <button
            onclick="openCourse('${course.id}')">
            View Course →
          </button>

        </article>
      `;

    }).join("");

}


// ======================================
// COURSE
// ======================================

async function openCourse(courseId) {

  const { data, error } =
    await supabaseClient
      .from("course_lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("lesson_order", {
        ascending: true
      });

  if (error) {

    alert(
      "Unable to load course lessons."
    );

    return;
  }

  if (!data || data.length === 0) {

    alert(
      "This course does not have lessons yet."
    );

    return;
  }

  const lessons =
    data.map(function (lesson) {

      return (
        lesson.lesson_order +
        ". " +
        lesson.title
      );

    }).join("\n");

  alert(
    "Course lessons:\n\n" +
    lessons
  );

}


// ======================================
// LIVE
// ======================================

async function loadLive() {

  const { data, error } =
    await supabaseClient
      .from("live_sessions")
      .select("*")
      .eq("is_live", true)
      .order("started_at", {
        ascending: false
      })
      .limit(1)
      .maybeSingle();

  const indicator =
    document.getElementById(
      "liveIndicator"
    );

  const title =
    document.getElementById(
      "liveTitleDisplay"
    );

  const description =
    document.getElementById(
      "liveDescriptionDisplay"
    );

  const screen =
    document.getElementById(
      "liveScreen"
    );

  if (error) {

    console.warn(
      "Live:",
      error.message
    );

    return;
  }

  if (!data) {

    if (indicator)
      indicator.textContent =
        "● OFFLINE";

    if (title)
      title.textContent =
        "No live broadcast";

    if (description)
      description.textContent =
        "The administrator can start a live session from the Admin Panel.";

    return;
  }

  if (indicator)
    indicator.textContent =
      "● LIVE";

  if (title)
    title.textContent =
      data.title || "Habboub Live";

  if (description)
    description.textContent =
      data.description || "";

  if (screen && data.stream_url) {

    screen.innerHTML = `
      <iframe
        src="${escapeAttribute(data.stream_url)}"
        style="width:100%;height:100%;border:0;border-radius:15px;"
        allow="autoplay; fullscreen"
        allowfullscreen>
      </iframe>
    `;

  }

}


// ======================================
// LIVE REALTIME
// ======================================

function subscribeToLive() {

  supabaseClient
    .channel("live-sessions")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "live_sessions"
      },
      function () {
        loadLive();
      }
    )
    .subscribe();

}


// ======================================
// ANNOUNCEMENTS REALTIME
// ======================================

function subscribeToAnnouncements() {

  supabaseClient
    .channel("announcements")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "announcements"
      },
      function () {
        loadAnnouncements();
      }
    )
    .subscribe();

}


// ======================================
// COURSES REALTIME
// ======================================

function subscribeToCourses() {

  supabaseClient
    .channel("courses")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "courses"
      },
      function () {
        loadCourses();
      }
    )
    .subscribe();

}


// ======================================
// MARKET ANALYSIS
// ======================================

async function loadMarketAnalysis() {

  const { data, error } =
    await supabaseClient
      .from("market_analysis")
      .select("*")
      .eq("symbol", "XAUUSD")
      .order("created_at", {
        ascending: false
      })
      .limit(1)
      .maybeSingle();

  if (error) {

    console.warn(
      "Market analysis:",
      error.message
    );

    return;
  }

  if (!data) return;

  setText(
    "marketTradeStatus",
    data.trade_status || "WAIT"
  );

  setText(
    "marketCondition",
    data.market_condition || "Unknown"
  );

  setText(
    "marketRisk",
    data.risk_level || "--"
  );

  setText(
    "marketConfidence",
    data.confidence ?? "--"
  );

  setText(
    "marketAnalysisText",
    data.analysis || ""
  );

  setText(
    "analysisSymbol",
    data.symbol || "XAUUSD"
  );

  setText(
    "analysisStatus",
    data.trade_status || "WAIT"
  );

  setText(
    "analysisDescription",
    data.analysis || ""
  );

  setText(
    "htfBias",
    data.bias || "--"
  );

  setText(
    "tradeDecision",
    data.trade_status || "WAIT"
  );

  setText(
    "tradeDecisionText",
    data.analysis || ""
  );

}


// ======================================
// JOURNAL
// ======================================

async function loadJournal() {

  const user =
    await getCurrentUser();

  if (!user) {

    setText("journalWinRate", "--");
    setText("journalProfitFactor", "--");
    setText("journalAverageR", "--");
    setText("journalDrawdown", "--");

    return;
  }

  const { data, error } =
    await supabaseClient
      .from("trading_journal")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false
      });

  if (error) {

    console.warn(
      "Journal:",
      error.message
    );

    return;
  }

  renderJournalStats(
    data || []
  );

  renderJournalTrades(
    data || []
  );

}


function renderJournalStats(trades) {

  if (!trades.length) {

    setText("journalWinRate", "0%");
    setText("journalProfitFactor", "0");
    setText("journalAverageR", "0");
    setText("journalDrawdown", "0");

    return;
  }

  const results =
    trades.map(function (trade) {
      return Number(trade.result) || 0;
    });

  const wins =
    results.filter(function (r) {
      return r > 0;
    }).length;

  const winRate =
    (wins / results.length) * 100;

  const grossProfit =
    results
      .filter(function (r) {
        return r > 0;
      })
      .reduce(function (sum, r) {
        return sum + r;
      }, 0);

  const grossLoss =
    Math.abs(
      results
        .filter(function (r) {
          return r < 0;
        })
        .reduce(function (sum, r) {
          return sum + r;
        }, 0)
    );

  const profitFactor =
    grossLoss === 0
      ? grossProfit
      : grossProfit / grossLoss;

  const average =
    results.reduce(function (sum, r) {
      return sum + r;
    }, 0) / results.length;

  setText(
    "journalWinRate",
    winRate.toFixed(1) + "%"
  );

  setText(
    "journalProfitFactor",
    profitFactor.toFixed(2)
  );

  setText(
    "journalAverageR",
    average.toFixed(2)
  );

  setText(
    "journalDrawdown",
    "--"
  );

}


function renderJournalTrades(trades) {

  const container =
    document.getElementById(
      "journalTrades"
    );

  if (!container) return;

  container.innerHTML =
    trades.slice(0, 10)
      .map(function (trade) {

        return `
          <div class="dashboard-card">

            <span class="eyebrow">
              ${escapeHTML(
                trade.journal_type || "TRADE"
              )}
            </span>

            <h3>
              ${escapeHTML(
                trade.symbol || "--"
              )}
            </h3>

            <p>
              ${escapeHTML(
                trade.direction || "--"
              )}
            </p>

            <strong>
              Result:
              ${trade.result ?? "--"}
            </strong>

          </div>
        `;

      })
      .join("");

}


// ======================================
// SAVE JOURNAL
// ======================================

async function saveJournalTrade() {

  const user =
    await getCurrentUser();

  const message =
    document.getElementById(
      "journalMessage"
    );

  if (!user) {

    if (message) {
      message.textContent =
        "Please login before adding a trade.";
    }

    return;
  }

  const symbol =
    document
      .getElementById("journalSymbol")
      ?.value.trim() || "";

  const direction =
    document
      .getElementById("journalDirection")
      ?.value.trim() || "";

  const entry =
    Number(
      document
        .getElementById("journalEntry")
        ?.value
    );

  const stop =
    Number(
      document
        .getElementById("journalStop")
        ?.value
    );

  const take =
    Number(
      document
        .getElementById("journalTake")
        ?.value
    );

  const result =
    Number(
      document
        .getElementById("journalResult")
        ?.value
    );

  const notes =
    document
      .getElementById("journalNotes")
      ?.value.trim() || "";

  const { error } =
    await supabaseClient
      .from("trading_journal")
      .insert({

        user_id: user.id,

        journal_type: "manual",

        symbol: symbol,

        direction: direction,

        entry_price:
          Number.isFinite(entry)
            ? entry
            : null,

        stop_loss:
          Number.isFinite(stop)
            ? stop
            : null,

        take_profit:
          Number.isFinite(take)
            ? take
            : null,

        result:
          Number.isFinite(result)
            ? result
            : null,

        notes: notes

      });

  if (error) {

    if (message) {
      message.textContent =
        error.message;
    }

    return;
  }

  if (message) {
    message.textContent =
      "Trade saved successfully.";
  }

  await loadJournal();

}


// ======================================
// AI
// ======================================

function openAI() {

  const aiWindow =
    document.getElementById(
      "aiWindow"
    );

  if (aiWindow) {
    aiWindow.classList.add("active");
  }

}


function closeAI() {

  const aiWindow =
    document.getElementById(
      "aiWindow"
    );

  if (aiWindow) {
    aiWindow.classList.remove("active");
  }

}


function handleAI(event) {

  if (event.key === "Enter") {
    sendAI();
  }

}


async function sendAI() {

  const input =
    document.getElementById(
      "aiInput"
    );

  const messages =
    document.getElementById(
      "aiMessages"
    );

  if (!input || !messages) return;

  const text =
    input.value.trim();

  if (!text) return;

  const userMessage =
    document.createElement("div");

  userMessage.className =
    "ai-message";

  userMessage.textContent =
    text;

  messages.appendChild(
    userMessage
  );

  input.value = "";

  const response =
    document.createElement("div");

  response.className =
    "ai-message";

  response.textContent =
    "Habboub AI is being connected to the backend.";

  messages.appendChild(
    response
  );

  messages.scrollTop =
    messages.scrollHeight;

}


// ======================================
// UTILITIES
// ======================================

function setText(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent =
      value;
  }

}


// ======================================
// SAFE HTML
// ======================================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

  return escapeHTML(value);

}


// ======================================
// MODAL OUTSIDE CLICK
// ======================================

document
  .querySelectorAll(".modal")
  .forEach(function (modal) {

    modal.addEventListener(
      "click",
      function (event) {

        if (event.target === modal) {
          closeModals();
        }

      }
    );

  });


// ======================================
// SCROLL ANIMATION
// ======================================

if ("IntersectionObserver" in window) {

  const observer =
    new IntersectionObserver(
      function (entries) {

        entries.forEach(
          function (entry) {

            if (entry.isIntersecting) {

              entry.target.style.opacity =
                "1";

              entry.target.style.transform =
                "translateY(0)";

            }

          }
        );

      },
      {
        threshold: 0.1
      }
    );


  document
    .querySelectorAll(
      ".dashboard-card, .asset-card, .course-card, .journal-stat"
    )
    .forEach(function (element) {

      element.style.opacity = "0";

      element.style.transform =
        "translateY(25px)";

      element.style.transition =
        "opacity .6s ease, transform .6s ease";

      observer.observe(element);

    });

}


// ======================================
// INITIALIZE
// ======================================

async function initializeHabboub() {

  try {

    await loadAnnouncements();

    await loadCourses();

    await loadLive();

    await loadMarketAnalysis();

    await loadJournal();

    subscribeToLive();

    subscribeToAnnouncements();

    subscribeToCourses();

  } catch (error) {

    console.error(
      "Habboub initialization error:",
      error
    );

  }

}


initializeHabboub();
