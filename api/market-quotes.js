export default async function handler(req, res) {
  const symbols = ['GC=F', 'NQ=F', 'ES=F', 'DX-Y.NYB'];
  try {
    const results = await Promise.all(symbols.map(async symbol => {
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1m&includePrePost=true`);
      if (!response.ok) throw new Error(`Market provider returned ${response.status}`);
      const json = await response.json();
      const result = json?.chart?.result?.[0];
      const meta = result?.meta || {};
      const timestamps = result?.timestamp || [];
      const quote = result?.indicators?.quote?.[0] || {};
      let index = timestamps.length - 1;
      while (index >= 0 && quote.close?.[index] == null) index--;
      const price = index >= 0 ? Number(quote.close[index]) : Number(meta.regularMarketPrice);
      const previous = Number(meta.previousClose ?? meta.chartPreviousClose);
      const change = Number.isFinite(price) && Number.isFinite(previous) ? price - previous : null;
      const changePct = Number.isFinite(change) && previous ? (change / previous) * 100 : null;
      const highs = (quote.high || []).map(Number).filter(Number.isFinite);
      const lows = (quote.low || []).map(Number).filter(Number.isFinite);
      const volumes = (quote.volume || []).map(Number).filter(Number.isFinite);
      const dayHigh = highs.length ? Math.max(...highs) : Number(meta.regularMarketDayHigh);
      const dayLow = lows.length ? Math.min(...lows) : Number(meta.regularMarketDayLow);
      const volume = volumes.length ? volumes.reduce((sum, value) => sum + value, 0) : Number(meta.regularMarketVolume);
      const state = meta.marketState || 'CLOSED';
      return { symbol, price, previous, change, changePct, dayHigh, dayLow, volume, marketState: state, currency: meta.currency || 'USD', exchange: meta.exchangeName || '' };
    }));
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ updatedAt: new Date().toISOString(), data: results });
  } catch (error) {
    return res.status(502).json({ error: 'Market data temporarily unavailable' });
  }
}
