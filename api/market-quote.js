export default async function handler(req, res) {
  const symbol = String(req.query.symbol || "").trim();
  const allowed = new Set(["GC=F", "NQ=F", "ES=F", "XAUUSD=X", "^NDX", "^GSPC"]);

  if (!allowed.has(symbol)) {
    return res.status(400).json({ error: "Unsupported market" });
  }

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    // Yahoo's XAUUSD=X endpoint is not reliably available for the live FX/CFD quote.
    // Use BiQuote's public MT5 XAUUSD CFD feed instead, then normalize it to the
    // same small Yahoo-compatible envelope consumed by market-live.js.
    if (symbol === "XAUUSD=X") {
      const response = await fetch("https://biquote.io/api/XAUUSD", {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; HabboubMarketFeed/1.0)"
        },
        cache: "no-store"
      });

      if (!response.ok) {
        return res.status(502).json({ error: "CFD gold provider unavailable" });
      }

      const tick = await response.json();
      const price = Number(tick.mid ?? tick.bid ?? tick.ask);
      const dayChange = Number(tick.dayDiffPercent);

      if (!Number.isFinite(price)) {
        return res.status(502).json({ error: "CFD gold provider returned invalid price" });
      }

      const previous = Number.isFinite(dayChange) && dayChange !== -100
        ? price / (1 + dayChange / 100)
        : price;

      return res.status(200).json({
        chart: {
          result: [{
            meta: {
              regularMarketPrice: price,
              previousClose: previous,
              chartPreviousClose: previous,
              marketState: String(tick.marketState || "open").toUpperCase() === "OPEN" ? "REGULAR" : "CLOSED",
              source: tick.source || "BiQuote MT5 CFD"
            }
          }],
          error: null
        }
      });
    }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1m&includePrePost=true&events=div%2Csplits`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; HabboubMarketFeed/1.0)"
      },
      cache: "no-store"
    });

    const text = await response.text();
    return res.status(response.status).send(text);
  } catch (error) {
    console.error("Habboub market proxy error:", error);
    return res.status(502).json({ error: "Market provider unavailable" });
  }
}
