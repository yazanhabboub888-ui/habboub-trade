(() => {
  "use strict";

  const KEY = "habboub_last_section";
  const HOME_IDS = new Set(["home", "overview"]);

  function normalize(value) {
    return String(value || "").replace(/^#/, "").trim().toLowerCase();
  }

  function visibleSection() {
    const sections = Array.from(document.querySelectorAll("section[id], main section[id], [data-section-id]"));
    return sections.find((el) => {
      const s = getComputedStyle(el);
      return s.display !== "none" && s.visibility !== "hidden" && el.offsetParent !== null;
    });
  }

  function saveCurrentSection() {
    const section = visibleSection();
    if (section && section.id) localStorage.setItem(KEY, section.id);
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

    const nav = Array.from(document.querySelectorAll("a[href], button, [role='button'], [data-target], [data-section], [data-section-id]")).find((el) => {
      const href = el.getAttribute("href");
      const candidates = [
        href && href.startsWith("#") ? href.slice(1) : "",
        el.getAttribute("data-target"),
        el.getAttribute("data-section"),
        el.getAttribute("data-section-id")
      ].map(normalize);
      return candidates.includes(saved);
    });

    if (nav) {
      try { nav.click(); return; } catch (_) {}
    }

    target.scrollIntoView({ block: "start" });
  }

  document.addEventListener("click", (event) => {
    const nav = event.target.closest("a[href], button, [role='button'], [data-target], [data-section], [data-section-id]");
    if (!nav) return;
    setTimeout(saveCurrentSection, 80);
  }, true);

  window.addEventListener("beforeunload", saveCurrentSection);
  window.addEventListener("pagehide", saveCurrentSection);

  function init() {
    setTimeout(restoreSection, 350);
    setTimeout(restoreSection, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
