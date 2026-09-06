/* ECONOVA — visible brand only. Internal Habboub identifiers remain unchanged. */
(() => {
  "use strict";
  const BRAND = "ECONOVA";
  const TAG = "AI ECONOMIC INTELLIGENCE";

  function apply() {
    document.title = `${BRAND} — Economic Intelligence`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `${BRAND} — AI Economic Intelligence`);

    document.querySelectorAll(".brand-mark").forEach((el) => {
      if (el.textContent !== "E") el.textContent = "E";
      el.classList.add("econova-mark");
    });

    document.querySelectorAll(".brand small").forEach((el) => {
      if (/TRADING INTELLIGENCE/i.test(el.textContent || "")) el.textContent = TAG;
    });

    const loader = document.querySelector(".loader-logo");
    if (loader && loader.textContent !== "E") loader.textContent = "E";

    const loaderText = document.querySelector(".loader-text");
    if (loaderText && loaderText.textContent !== BRAND) loaderText.textContent = BRAND;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
