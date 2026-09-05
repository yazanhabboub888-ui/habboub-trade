export default async function handler(req, res) {
  const symbol = String(req.query.symbol || "").trim();
  const allowed = new Set(["GC=F", "NQ=F", "ES=F", "XAUUSD=X", "^NDX", "^GSPC", "USTEC", "US500_X100"]);

  if (!allowed.has(symbol)) return res.status(400).json({ error: "Unsupported market" });

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  function normalizeCfdTick(tick, source) {
    const price = Number(tick?.mid ?? tick?.bid ?? tick?.ask ?? tick?.last);
    const dayChange = Number(tick?.dayDiffPercent);
    if (!Number.isFinite(price)) return null;
    const previous = Number.isFinite(dayChange) && dayChange !== -100
      ? price / (1 + dayChange / 100) : price;
    return { chart: { result: [{ meta: {
      regularMarketPrice: price,
      previousClose: previous,
      chartPreviousClose: previous,
      marketState: String(tick?.marketState || "closed").toUpperCase() === "OPEN" ? "REGULAR" : "CLOSED",
      source: tick?.source || source,
      quoteAgeSeconds: Number(tick?.quoteAgeSeconds || 0)
    }}], error: null } };
  }

  async function fetchBiquote(name) {
    const response = await fetch(`https://biquote.io/api/${encodeURIComponent(name)}`, {
      headers: { Accept: "application/json", "User-Agent": "HabboubMarketFeed/1.0" },
      cache: "no-store"
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`BiQuote ${name} HTTP ${response.status}: ${text.slice(0,120)}`);
    const normalized = normalizeCfdTick(JSON.parse(text), "BiQuote MT5 CFD");
    if (!normalized) throw new Error(`BiQuote ${name} returned invalid price`);
    return normalized;
  }

  async function fetchYahoo(name) {
    const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
    let lastError = null;
    for (const host of hosts) {
      try {
        const url = `https://${host}/v8/finance/chart/${encodeURIComponent(name)}?range=1d&interval=1m&includePrePost=true&events=div%2Csplits`;
        const response = await fetch(url, {
          headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (compatible; HabboubMarketFeed/1.0)" },
          cache: "no-store"
        });
        const text = await response.text();
        if (!response.ok) { lastError = new Error(`Yahoo ${host} HTTP ${response.status}`); continue; }
        const payload = JSON.parse(text);
        const meta = payload?.chart?.result?.[0]?.meta;
        if (!meta || !Number.isFinite(Number(meta.regularMarketPrice ?? meta.previousClose))) {
          lastError = new Error(`Yahoo ${name} returned no quote data`); continue;
        }
        return payload;
      } catch (error) { lastError = error; }
    }
    throw lastError || new Error(`No market data for ${name}`);
  }

  try {
    if (symbol === "XAUUSD=X") return res.status(200).json(await fetchBiquote("XAUUSD"));
    if (symbol === "USTEC") return res.status(200).json(await fetchBiquote("USTEC"));
    if (symbol === "US500_X100") return res.status(200).json(await fetchBiquote("US500_X100"));
    return res.status(200).json(await fetchYahoo(symbol));
  } catch (error) {
    console.error("Habboub market proxy error:", symbol, error);
    return res.status(502).json({ error: "Market provider unavailable", symbol, detail: String(error.message || error) });
  }
}
