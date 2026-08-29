// ======================================
// HABBOUB FRONTEND
// ======================================

window.addEventListener("load", () => {

  setTimeout(() => {
    document.getElementById("loader")
      .classList.add("hidden");
  }, 900);

});


// ======================================
// LOGIN
// ======================================

function openLogin() {

  closeModals();

  document
    .getElementById("loginModal")
    .classList.add("active");

}


function openRegister() {

  closeModals();

  document
    .getElementById("registerModal")
    .classList.add("active");

}


function closeModals() {

  document
    .querySelectorAll(".modal")
    .forEach(modal => {
      modal.classList.remove("active");
    });

}


// ======================================
// GUEST
// ======================================

function enterGuest() {

  document
    .getElementById("dashboard")
    .scrollIntoView({
      behavior: "smooth"
    });

}


// ======================================
// AI WINDOW
// ======================================

function openAI() {

  document
    .getElementById("aiWindow")
    .classList.add("active");

}


function closeAI() {

  document
    .getElementById("aiWindow")
    .classList.remove("active");

}


function handleAI(event) {

  if (event.key === "Enter") {
    sendAI();
  }

}


function sendAI() {

  const input =
    document.getElementById("aiInput");

  const messages =
    document.getElementById("aiMessages");

  const text =
    input.value.trim();

  if (!text) return;


  const userMessage =
    document.createElement("div");

  userMessage.className =
    "ai-message";

  userMessage.textContent =
    text;

  messages.appendChild(userMessage);

  input.value = "";


  setTimeout(() => {

    const response =
      document.createElement("div");

    response.className =
      "ai-message";

    response.textContent =
      "I'm ready to analyze this once the Habboub AI backend is connected to a real AI model and live market data.";

    messages.appendChild(response);

    messages.scrollTop =
      messages.scrollHeight;

  }, 700);

}


// ======================================
// DEMO PRICE DISPLAY
// ======================================

function updateConnectionStatus() {

  const price =
    document.getElementById("goldPrice");

  const change =
    document.getElementById("goldChange");

  if (!price || !change) return;

  price.textContent =
    "Connecting...";

  change.textContent =
    "Waiting for live market provider";

}

updateConnectionStatus();


// ======================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ======================================

document.querySelectorAll(".modal")
  .forEach(modal => {

    modal.addEventListener("click", event => {

      if (event.target === modal) {
        closeModals();
      }

    });

  });


// ======================================
// SCROLL ANIMATION
// ======================================

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.style.opacity = "1";
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
    ".dashboard-card, .asset-card, .course-card, .journal-stat"
  )
  .forEach(element => {

    element.style.opacity = "0";
    element.style.transform =
      "translateY(25px)";
    element.style.transition =
      "opacity .6s ease, transform .6s ease";

    observer.observe(element);

  });
