export default async function handler(req, res) {
  const symbol = String(req.query.symbol || "").trim();
  const allowed = new Set(["GC=F", "NQ=F", "ES=F"]);

  if (!allowed.has(symbol)) {
    return res.status(400).json({ error: "Unsupported market" });
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1m&includePrePost=true&events=div%2Csplits`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; HabboubMarketFeed/1.0)"
      },
      cache: "no-store"
    });

    const text = await response.text();
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(response.status).send(text);
  } catch (error) {
    console.error("Habboub market proxy error:", error);
    return res.status(502).json({ error: "Market provider unavailable" });
  }
}
