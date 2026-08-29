// ======================================
// HABBOUB FRONTEND
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
// LOADER
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
// MODALS
// ======================================

function openLogin() {

  closeModals();

  const modal = document.getElementById("loginModal");

  if (modal) {
    modal.classList.add("active");
  }

}


function openRegister() {

  closeModals();

  const modal = document.getElementById("registerModal");

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
// AI
// ======================================

function openAI() {

  const ai =
    document.getElementById("aiWindow");

  if (ai) {
    ai.classList.add("active");
  }

}


function closeAI() {

  const ai =
    document.getElementById("aiWindow");

  if (ai) {
    ai.classList.remove("active");
  }

}


function handleAI(event) {

  if (event.key === "Enter") {
    sendAI();
  }

}


async function sendAI() {

  const input =
    document.getElementById("aiInput");

  const messages =
    document.getElementById("aiMessages");

  if (!input || !messages) {
    return;
  }

  const text =
    input.value.trim();

  if (!text) {
    return;
  }


  const userMessage =
    document.createElement("div");

  userMessage.className =
    "ai-message";

  userMessage.textContent =
    text;

  messages.appendChild(userMessage);

  input.value = "";


  const response =
    document.createElement("div");

  response.className =
    "ai-message";

  response.textContent =
    "Habboub AI backend is not connected yet.";

  messages.appendChild(response);

  messages.scrollTop =
    messages.scrollHeight;

}


// ======================================
// MARKET
// ======================================

function updateConnectionStatus() {

  const price =
    document.getElementById("goldPrice");

  const change =
    document.getElementById("goldChange");

  if (!price || !change) {
    return;
  }

  price.textContent =
    "Connecting...";

  change.textContent =
    "Waiting for live market provider";

}

updateConnectionStatus();


// ======================================
// SAFE TEXT
// ======================================

function setText(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }

}


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
// ANNOUNCEMENTS
// ======================================

async function loadAnnouncements() {

  const container =
    document.getElementById(
      "announcementsContainer"
    );

  if (!container) {
    return;
  }


  const result =
    await supabaseClient
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", {
        ascending: false
      });


  if (result.error) {

    console.error(
      "Announcements:",
      result.error
    );

    return;
  }


  if (!result.data || result.data.length === 0) {

    container.innerHTML = `
      <div class="dashboard-card">
        <h3>No announcements</h3>
        <p>There are no active announcements right now.</p>
      </div>
    `;

    return;
  }


  container.innerHTML =
    result.data.map(function (item) {

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

  if (!container) {
    return;
  }


  const result =
    await supabaseClient
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", {
        ascending: false
      });


  if (result.error) {

    console.error(
      "Courses:",
      result.error
    );

    return;
  }


  if (!result.data || result.data.length === 0) {

    return;
  }


  container.innerHTML =
    result.data.map(function (course, index) {

      return `
        <article class="course-card">

          <span class="course-number">
            ${String(index + 1).padStart(2, "0")}
          </span>

          <h3>
            ${escapeHTML(course.title)}
          </h3>

          <p>
            ${escapeHTML(course.description || "")}
          </p>

          <button onclick="openCourse('${course.id}')">
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

  const result =
    await supabaseClient
      .from("course_lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("lesson_order", {
        ascending: true
      });


  if (result.error) {

    alert("Unable to load course lessons.");

    return;
  }


  if (!result.data || result.data.length === 0) {

    alert("This course does not have lessons yet.");

    return;
  }


  const lessons =
    result.data.map(function (lesson) {

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

  const result =
    await supabaseClient
      .from("live_sessions")
      .select("*")
      .eq("is_live", true)
      .order("started_at", {
        ascending: false
      })
      .limit(1);


  if (result.error) {

    console.error(
      "Live:",
      result.error
    );

    return;
  }


  const data =
    result.data &&
    result.data.length
      ? result.data[0]
      : null;


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


  if (!data) {

    if (indicator) {
      indicator.textContent =
        "● OFFLINE";
    }

    if (title) {
      title.textContent =
        "No live broadcast";
    }

    if (description) {
      description.textContent =
        "The administrator can start a live session from the Admin Panel.";
    }

    return;
  }


  if (indicator) {
    indicator.textContent =
      "● LIVE";
  }


  if (title) {
    title.textContent =
      data.title || "Habboub Live";
  }


  if (description) {
    description.textContent =
      data.description || "";
  }


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
    .channel("habboub-live")
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
    .channel("habboub-announcements")
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
    .channel("habboub-courses")
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

  const result =
    await supabaseClient
      .from("market_analysis")
      .select("*")
      .eq("symbol", "XAUUSD")
      .order("created_at", {
        ascending: false
      })
      .limit(1);


  if (result.error) {

    console.error(
      "Market analysis:",
      result.error
    );

    return;
  }


  const data =
    result.data &&
    result.data.length
      ? result.data[0]
      : null;


  if (!data) {
    return;
  }


  setText(
    "htfBias",
    data.bias || "--"
  );

  setText(
    "tradeDecision",
    data.trade_status || "WAIT"
  );

  setText(
    "analysisStatus",
    data.trade_status || "WAIT"
  );

  setText(
    "analysisSymbol",
    data.symbol || "XAUUSD"
  );

  setText(
    "marketRisk",
    data.risk_level || "--"
  );

  setText(
    "marketCondition",
    data.market_condition || "--"
  );

  setText(
    "marketConfidence",
    data.confidence ?? "--"
  );

  setText(
    "marketAnalysisText",
    data.analysis || ""
  );

}


// ======================================
// JOURNAL
// ======================================

async function getCurrentUser() {

  const result =
    await supabaseClient.auth.getUser();

  if (result.error) {
    return null;
  }

  return result.data.user || null;

}


async function loadJournal() {

  const user =
    await getCurrentUser();


  if (!user) {
    return;
  }


  const result =
    await supabaseClient
      .from("trading_journal")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false
      });


  if (result.error) {

    console.error(
      "Journal:",
      result.error
    );

    return;
  }


  renderJournalStats(
    result.data || []
  );

}


function renderJournalStats(trades) {

  if (!trades.length) {

    setText(
      "journalWinRate",
      "0%"
    );

    setText(
      "journalProfitFactor",
      "0"
    );

    setText(
      "journalAverageR",
      "0"
    );

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

}


// ======================================
// MODAL CLICK
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

try {

  const observer =
    new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.style.opacity =
              "1";

            entry.target.style.transform =
              "translateY(0)";

          }

        });

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

} catch (error) {

  console.warn(
    "Animation unavailable:",
    error
  );

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
