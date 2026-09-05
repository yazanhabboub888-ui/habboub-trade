/* Habboub News Consensus compatibility layer.
 * The live news-intelligence module is now the single renderer.
 * This file intentionally does not generate or invent directional probabilities.
 * It also bootstraps the Market Watch live-feed module so the existing index
 * does not need another script tag.
 */
(function () {
  "use strict";

  // Keep the second script tag backward-compatible without creating a competing renderer.
  // All probabilities must come from public.news_probability.

  if (document.getElementById("habboubMarketLiveScript")) return;

  const script = document.createElement("script");
  script.id = "habboubMarketLiveScript";
  script.src = "market-live.js?v=1";
  script.async = true;
  document.head.appendChild(script);
})();
