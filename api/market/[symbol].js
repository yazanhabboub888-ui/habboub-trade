export default async function handler(req, res) {
  const symbol = String(req.query.symbol || "").trim();

  const allowed = new Set(["XAUUSD=X", "^NDX", "^GSPC"]);
  if (!allowed.has(symbol)) {
    return res.status(400).json({ error: "Unsupported market" });
  }

  const params = new URLSearchParams();
  params.set("range", String(req.query.range || "1d"));
  params.set("interval", String(req.query.interval || "1m"));

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 HabboubMarketFeed/1.0"
      }
    });

    const text = await response.text();
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(response.status).send(text);
  } catch (error) {
    return res.status(502).json({ error: "Market provider unavailable" });
  }
}
