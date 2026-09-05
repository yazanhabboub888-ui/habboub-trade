(() => {
  "use strict";

  const KEY = "habboub_last_section";
  const HOME_IDS = new Set(["home", "overview"]);

  function normalize(value) {
    return String(value || "").replace(/^#/, "").trim().toLowerCase();
  }

  function saveSection(id) {
    const section = normalize(id);
    if (section) localStorage.setItem(KEY, section);
  }

  function findTarget(id) {
    id = normalize(id);
    if (!id) return null;
    return document.getElementById(id) || document.querySelector(`[data-section-id="${CSS.escape(id)}"]`);
  }

  function restoreSection() {
    const saved = normalize(localStorage.getItem(KEY));
    if (!saved || HOME_IDS.has(saved)) return;

    const target = findTarget(saved);
    if (!target) return;

    // Habboub navigation uses data-nav; trigger the real navigation handler.
    const nav = document.querySelector(`[data-nav="${CSS.escape(saved)}"]`);
    if (nav) {
      nav.click();
      return;
    }

    target.classList.add("active-section");
    target.scrollIntoView({ block: "start" });
  }

  // Save the exact section the user selected instead of trying to infer it
  // from which DOM element happens to be visible.
  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-nav]");
    if (!nav) return;
    saveSection(nav.getAttribute("data-nav"));
  }, true);

  window.addEventListener("hashchange", () => {
    const hash = normalize(window.location.hash);
    if (hash) saveSection(hash);
  });

  function init() {
    // Main script gets time to initialize its active section first.
    setTimeout(restoreSection, 700);
    setTimeout(restoreSection, 1600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
