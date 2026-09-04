const SUPABASE_URL =
  "https://feoyjasuvrqxzhskqzye.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0";

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


window.addEventListener("load", function () {

  setTimeout(function () {

    const loader =
      document.getElementById("loader");

    if (loader) {
      loader.classList.add("hidden");
    }

  }, 900);

});


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


function openJournal() {

  closeModals();

  const modal =
    document.getElementById("journalModal");

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


function enterGuest() {

  const dashboard =
    document.getElementById("dashboard");

  if (dashboard) {

    dashboard.scrollIntoView({
      behavior: "smooth"
    });

  }

}


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
    "Habboub AI is preparing market context. AI model connection will be added through the secure backend.";

  messages.appendChild(response);

  messages.scrollTop =
    messages.scrollHeight;

}


function setText(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent =
      value ?? "--";
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


async function loginUser() {

  const email =
    document.getElementById("loginEmail")?.value.trim();

  const password =
    document.getElementById("loginPassword")?.value;

  const message =
    document.getElementById("loginMessage");

  const button =
    document.getElementById("loginButton");


  if (!email || !password) {

    if (message) {
      message.textContent =
        "Please enter your email and password.";
    }

    return;

  }


  if (button) {
    button.disabled = true;
  }


  const result =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });


  if (result.error) {

    if (message) {
      message.textContent =
        result.error.message;
    }

    if (button) {
      button.disabled = false;
    }

    return;

  }


  if (message) {
    message.textContent =
      "Login successful.";
  }


  setTimeout(function () {
    closeModals();
  }, 500);

}


async function registerUser() {

  const name =
    document.getElementById("registerName")?.value.trim();

  const email =
    document.getElementById("registerEmail")?.value.trim();

  const password =
    document.getElementById("registerPassword")?.value;

  const message =
    document.getElementById("registerMessage");

  const button =
    document.getElementById("registerButton");


  if (!name || !email || !password) {

    if (message) {
      message.textContent =
        "Please complete all fields.";
    }

    return;

  }


  if (password.length < 6) {

    if (message) {
      message.textContent =
        "Password must contain at least 6 characters.";
    }

    return;

  }


  if (button) {
    button.disabled = true;
  }


  const result =
    await supabaseClient.auth.signUp({

      email,
      password,

      options: {
        data: {
          full_name: name
        }
      }

    });


  if (result.error) {

    if (message) {
      message.textContent =
        result.error.message;
    }

    if (button) {
      button.disabled = false;
    }

    return;

  }


  if (message) {

    message.textContent =
      "Account created. Check your email to verify your account.";

  }


  if (button) {
    button.disabled = false;
  }

}


async function getCurrentUser() {

  const result =
    await supabaseClient.auth.getUser();

  if (result.error) {
    return null;
  }

  return result.data.user || null;

}


async function saveJournalTrade() {

  const user =
    await getCurrentUser();

  const message =
    document.getElementById("journalMessage");


  if (!user) {

    if (message) {
      message.textContent =
        "Please login before saving a trade.";
    }

    return;

  }


  const symbol =
    document.getElementById("journalSymbol")?.value.trim();

  const direction =
    document.getElementById("journalDirection")?.value.trim();

  const entry =
    document.getElementById("journalEntry")?.value;

  const stop =
    document.getElementById("journalStop")?.value;

  const take =
    document.getElementById("journalTake")?.value;

  const resultValue =
    document.getElementById("journalResult")?.value;

  const notes =
    document.getElementById("journalNotes")?.value.trim();


  const result =
    await supabaseClient
      .from("trading_journal")
      .insert({

        user_id: user.id,
        symbol: symbol || "XAUUSD",
        direction: direction || null,
        entry_price: entry ? Number(entry) : null,
        stop_loss: stop ? Number(stop) : null,
        take_profit: take ? Number(take) : null,
        result: resultValue ? Number(resultValue) : 0,
        notes: notes || null

      });


  if (result.error) {

    console.error(
      "Journal:",
      result.error
    );

    if (message) {
      message.textContent =
        result.error.message;
    }

    return;

  }


  if (message) {
    message.textContent =
      "Trade saved successfully.";
  }


  await loadJournal();

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

  renderJournalTrades(
    result.data || []
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


  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;


  results.forEach(function (r) {

    equity += r;

    if (equity > peak) {
      peak = equity;
    }

    const drawdown =
      peak - equity;

    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }

  });


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
    maxDrawdown.toFixed(2)
  );

}


function renderJournalTrades(trades) {

  const container =
    document.getElementById("journalTrades");

  if (!container) {
    return;
  }


  if (!trades.length) {

    container.innerHTML = `
      <div class="dashboard-card">
        <h3>No trades yet</h3>
        <p>Your trading journal will appear here.</p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    trades.slice(0, 10)
      .map(function (trade) {

        const result =
          Number(trade.result) || 0;

        return `
          <article class="dashboard-card">

            <span class="eyebrow">
              ${escapeHTML(trade.symbol || "XAUUSD")}
            </span>

            <h3>
              ${escapeHTML(trade.direction || "Trade")}
            </h3>

            <p>
              Result:
              <strong>
                ${result.toFixed(2)}
              </strong>
            </p>

            <p>
              ${escapeHTML(trade.notes || "")}
            </p>

          </article>
        `;

      })
      .join("");

}


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


  if (!result.data || !result.data.length) {

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


  if (!result.data || !result.data.length) {

    container.innerHTML = `
      <div class="course-card">
        <span class="course-number">--</span>
        <h3>No courses yet</h3>
        <p>Courses will appear here when published.</p>
      </div>
    `;

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

          <button onclick="openCourse('${escapeAttribute(course.id)}')">
            View Course →
          </button>

        </article>
      `;

    }).join("");

}


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

    alert(
      "Unable to load course lessons."
    );

    return;

  }


  if (!result.data || !result.data.length) {

    alert(
      "This course does not have lessons yet."
    );

    return;

  }


  const lessons =
    result.data.map(function (lesson) {

      return `
        <div class="dashboard-card">

          <span class="eyebrow">
            LESSON ${lesson.lesson_order}
          </span>

          <h3>
            ${escapeHTML(lesson.title)}
          </h3>

          <p>
            ${escapeHTML(lesson.content || "")}
          </p>

        </div>
      `;

    }).join("");


  const container =
    document.getElementById(
      "courseContainer"
    );

  if (container) {

    container.innerHTML =
      lessons;

    container.scrollIntoView({
      behavior: "smooth"
    });

  }

}


async function loadLive() {

  const result =
    await supabaseClient
      .from("live_sessions")
      .select("*")
      .eq("is_live", true)
      .order("created_at", {
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


  const live =
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


  if (!live) {

    setText(
      "liveIndicator",
      "● OFFLINE"
    );

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
      live.title || "Habboub Live";
  }


  if (description) {
    description.textContent =
      live.description || "";
  }

}


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
    "sessionHTFBias",
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
    "sessionScore",
    data.confidence !== undefined
      ? data.confidence + " / 100"
      : "--"
  );


  setText(
    "marketAnalysisText",
    data.analysis || ""
  );


  setText(
    "analysisDescription",
    data.analysis || ""
  );


  setText(
    "tradeDecisionText",
    data.analysis || "Waiting for market context."
  );


  setText(
    "scoreReason",
    data.analysis || "Waiting for market data."
  );


  setText(
    "macroReason",
    data.market_condition || "Waiting for macro data."
  );


  setText(
    "newsReason",
    data.news_impact || "Waiting for news analysis."
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
    "mss",
    data.mss || "--"
  );


  setText(
    "fvg",
    data.fvg || "--"
  );


  setText(
    "riskLevelText",
    data.risk_level || "Risk level unavailable"
  );


  const riskMeter =
    document.getElementById("riskMeter");

  if (riskMeter) {

    const confidence =
      Number(data.confidence) || 0;

    const risk =
      Math.max(
        0,
        Math.min(
          100,
          100 - confidence
        )
      );

    riskMeter.style.width =
      risk + "%";

  }


  updateHabboubSession({

    price:
      data.price ??
      data.current_price,

    score:
      data.confidence,

    bias:
      data.bias,

    liquidity:
      data.liquidity,

    regime:
      data.market_regime

  });

}


function updateHabboubSession(data) {

  data = data || {};


  if (
    data.price !== undefined &&
    data.price !== null
  ) {

    setText(
      "sessionPrice",
      data.price
    );

  }


  if (
    data.score !== undefined &&
    data.score !== null
  ) {

    const score =
      Number(data.score) || 0;


    setText(
      "sessionScore",
      score + " / 100"
    );


    setText(
      "sessionScoreText",

      score >= 70
        ? "Favorable Conditions"
        : score >= 45
        ? "Neutral Conditions"
        : "Elevated Risk"

    );

  }


  if (data.bias) {

    setText(
      "sessionHTFBias",
      data.bias
    );

  }


  if (data.liquidity) {

    setText(
      "sessionLiquidity",
      data.liquidity
    );

  }


  if (data.regime) {

    setHabboubMarketRegime(
      data.regime
    );

  }

}


function setHabboubMarketRegime(regime) {

  const element =
    document.getElementById(
      "sessionRegime"
    );

  if (!element) {
    return;
  }


  element.classList.remove(
    "regime-trending",
    "regime-ranging",
    "regime-risk"
  );


  const normalized =
    String(regime || "")
      .toUpperCase();


  if (normalized === "TRENDING") {

    element.textContent =
      "TRENDING";

    element.classList.add(
      "regime-trending"
    );

  }

  else if (normalized === "RANGING") {

    element.textContent =
      "RANGING";

    element.classList.add(
      "regime-ranging"
    );

  }

  else if (normalized) {

    element.textContent =
      "HIGH VOLATILITY";

    element.classList.add(
      "regime-risk"
    );

  }

}


function showHabboubNewsAlert(news) {

  news = news || {};


  const alert =
    document.getElementById(
      "habboubNewsAlert"
    );


  if (!alert) {
    return;
  }


  setText(
    "newsAlertTitle",
    news.title ||
    "High Impact Economic Event"
  );


  setText(
    "newsAlertExplanation",
    news.explanation ||
    "A major economic event may increase market volatility."
  );


  alert.classList.add("show");


  if (news.timestamp) {

    startNewsCountdown(
      news.timestamp
    );

  }

}


function hideHabboubNewsAlert() {

  const alert =
    document.getElementById(
      "habboubNewsAlert"
    );

  if (alert) {
    alert.classList.remove("show");
  }

}


function renderNewsList(news) {

  const container =
    document.getElementById(
      "newsListPanel"
    );

  if (!container) {
    return;
  }


  if (!news || !news.length) {

    container.innerHTML =
      `
        <div class="news-list-item">

          <div class="news-list-time">
            --
          </div>

          <div class="news-list-name">
            No important events available.
          </div>

          <div class="news-list-impact">
            --
          </div>

        </div>
      `;

    return;

  }


  container.innerHTML =
    news.map(function (item) {

      const impact =
        String(item.impact || "HIGH")
          .toUpperCase();


      return `
        <div class="news-list-item">

          <div class="news-list-time">
            ${escapeHTML(item.time || "--")}
          </div>

          <div class="news-list-name">
            ${escapeHTML(item.title || "Economic Event")}
          </div>

          <div
            class="news-list-impact ${
              impact === "HIGH"
                ? "news-high"
                : "news-medium"
            }">

            ${escapeHTML(impact)}

          </div>

        </div>
      `;

    }).join("");

}


function toggleNewsList() {

  const panel =
    document.getElementById(
      "newsListPanel"
    );

  if (!panel) {
    return;
  }

  panel.classList.toggle("open");

}


let newsTimer = null;


function startNewsCountdown(timestamp) {

  if (newsTimer) {
    clearInterval(newsTimer);
  }


  const countdown =
    document.getElementById(
      "newsAlertCountdown"
    );


  if (!countdown) {
    return;
  }


  function update() {

    const difference =
      new Date(timestamp).getTime() -
      Date.now();


    if (difference <= 0) {

      countdown.textContent =
        "LIVE";

      return;

    }


    const seconds =
      Math.floor(
        difference / 1000
      );


    const hours =
      Math.floor(
        seconds / 3600
      );


    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );


    const secs =
      seconds % 60;


    countdown.textContent =
      String(hours).padStart(2,"0") +
      ":" +
      String(minutes).padStart(2,"0") +
      ":" +
      String(secs).padStart(2,"0");

  }


  update();

  newsTimer =
    setInterval(
      update,
      1000
    );

}


function updateSessionClock() {

  const clock =
    document.getElementById(
      "sessionClock"
    );


  if (!clock) {
    return;
  }


  clock.textContent =
    new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );


  updateTradingSessions();

}


function updateTradingSessions() {

  const hour =
    new Date().getUTCHours();


  const asia =
    document.getElementById(
      "asiaSession"
    );

  const london =
    document.getElementById(
      "londonSession"
    );

  const newYork =
    document.getElementById(
      "newYorkSession"
    );


  [
    asia,
    london,
    newYork
  ].forEach(function (element) {

    if (element) {
      element.classList.remove("active");
    }

  });


  if (hour >= 0 && hour < 8) {

    asia?.classList.add("active");

  }

  else if (hour >= 8 && hour < 13) {

    london?.classList.add("active");

  }

  else if (hour >= 13 && hour < 21) {

    newYork?.classList.add("active");

  }

}


const translations = {

  en: {
    dashboard: "Dashboard",
    markets: "Markets",
    intelligence: "Intelligence",
    news: "News",
    journal: "Journal",
    live: "Live",
    academy: "Academy",
    login: "Login",
    getStarted: "Get Started",
    highImpact: "HIGH IMPACT NEWS",
    tradingSession: "Trading Session"
  },

  ar: {
    dashboard: "لوحة التحكم",
    markets: "الأسواق",
    intelligence: "الذكاء السوقي",
    news: "الأخبار",
    journal: "السجل",
    live: "البث المباشر",
    academy: "الأكاديمية",
    login: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    highImpact: "خبر عالي التأثير",
    tradingSession: "جلسة التداول"
  }

};


function setHabboubLanguage(language) {

  if (!translations[language]) {
    language = "en";
  }


  localStorage.setItem(
    "habboub_language",
    language
  );


  document.documentElement.lang =
    language;


  document.documentElement.dir =
    language === "ar"
      ? "rtl"
      : "ltr";


  const en =
    document.getElementById("langEN");

  const ar =
    document.getElementById("langAR");


  if (en) {
    en.classList.toggle(
      "active",
      language === "en"
    );
  }


  if (ar) {
    ar.classList.toggle(
      "active",
      language === "ar"
    );
  }

}


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
        threshold: .1
      }
    );


  document
    .querySelectorAll(
      ".dashboard-card, .asset-card, .course-card, .journal-stat, .session-card, .reason-card"
    )
    .forEach(function (element) {

      element.style.opacity =
        "0";

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


document.addEventListener(
  "DOMContentLoaded",
  function () {

    setHabboubLanguage(
      localStorage.getItem(
        "habboub_language"
      ) || "en"
    );


    updateSessionClock();


    setInterval(
      updateSessionClock,
      1000
    );


    renderNewsList([

      {
        time: "--:--",
        title: "Major USD economic event",
        impact: "HIGH"
      },

      {
        time: "--:--",
        title: "Federal Reserve related event",
        impact: "HIGH"
      },

      {
        time: "--:--",
        title: "US inflation / employment data",
        impact: "HIGH"
      }

    ]);


    loadAnnouncements();
    loadCourses();
    loadLive();
    loadMarketAnalysis();
    loadJournal();


    subscribeToLive();
    subscribeToAnnouncements();
    subscribeToCourses();


    updateHabboubSession({

      score: 0,
      bias: "--",
      liquidity: "--",
      regime: ""

    });

  }
);
