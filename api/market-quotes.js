const DATASET = 'GLBX.MDP3';
const INSTRUMENTS = [
  { key: 'GOLD', symbol: 'GC.v.0' },
  { key: 'NASDAQ', symbol: 'NQ.v.0' },
  { key: 'SP500', symbol: 'ES.v.0' },
];

const finite = value => Number.isFinite(Number(value)) ? Number(value) : null;

async function getBars(apiKey, symbol, start, end) {
  const url = new URL('https://hist.databento.com/v0/timeseries.get_range');
  url.searchParams.set('dataset', DATASET);
  url.searchParams.set('symbols', symbol);
  url.searchParams.set('stype_in', 'continuous');
  url.searchParams.set('schema', 'ohlcv-1m');
  url.searchParams.set('start', start);
  url.searchParams.set('end', end);
  url.searchParams.set('encoding', 'json');

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Databento ${response.status}: ${body.slice(0, 300)}`);
  }

  const text = await response.text();
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);
}

function normalizeRecord(record) {
  const source = record?.hd ? { ...record.hd, ...record } : record;
  return {
    ts: source?.ts_event ?? source?.hd?.ts_event ?? null,
    open: finite(source?.open),
    high: finite(source?.high),
    low: finite(source?.low),
    close: finite(source?.close),
    volume: finite(source?.volume),
  };
}

export default async function handler(req, res) {
  const apiKey = process.env.DATABENTO_API_KEY;

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!apiKey) {
    return res.status(503).json({
      error: 'Market data provider is not configured',
      provider: 'databento',
      data: [],
    });
  }

  try {
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    const startIso = start.toISOString();
    const endIso = end.toISOString();

    const results = await Promise.all(INSTRUMENTS.map(async instrument => {
      const raw = await getBars(apiKey, instrument.symbol, startIso, endIso);
      const bars = raw.map(normalizeRecord).filter(bar => bar.close != null);

      if (!bars.length) {
        return {
          key: instrument.key,
          symbol: instrument.symbol,
          price: null,
          previous: null,
          change: null,
          changePct: null,
          dayHigh: null,
          dayLow: null,
          volume: null,
          marketState: 'UNKNOWN',
          source: 'Databento',
        };
      }

      const latest = bars[bars.length - 1];
      const previous = bars.length > 1 ? bars[bars.length - 2].close : null;
      const highs = bars.map(bar => bar.high).filter(v => v != null);
      const lows = bars.map(bar => bar.low).filter(v => v != null);
      const volume = bars
        .map(bar => bar.volume)
        .filter(v => v != null)
        .reduce((sum, value) => sum + value, 0);
      const change = previous != null ? latest.close - previous : null;
      const changePct = previous ? (change / previous) * 100 : null;

      return {
        key: instrument.key,
        symbol: instrument.symbol,
        price: latest.close,
        previous,
        change,
        changePct,
        dayHigh: highs.length ? Math.max(...highs) : null,
        dayLow: lows.length ? Math.min(...lows) : null,
        volume,
        marketState: 'DATA',
        source: 'Databento',
        dataTimestamp: latest.ts,
      };
    }));

    // DXY is intentionally not filled from another provider here.
    // ECONOVA must not mix market-data vendors for a single dashboard snapshot.
    results.push({
      key: 'DOLLAR',
      symbol: 'DXY',
      price: null,
      previous: null,
      change: null,
      changePct: null,
      dayHigh: null,
      dayLow: null,
      volume: null,
      marketState: 'UNAVAILABLE',
      source: 'Not configured',
    });

    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      provider: 'databento',
      data: results,
    });
  } catch (error) {
    console.error('Databento market data error:', error);
    return res.status(502).json({
      error: 'Market data temporarily unavailable',
      provider: 'databento',
      data: [],
    });
  }
}
