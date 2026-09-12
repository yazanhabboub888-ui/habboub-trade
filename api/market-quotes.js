const DATASET = 'GLBX.MDP3';
const INSTRUMENTS = [
  { key: 'GOLD', symbol: 'GC.v.0', frontendSymbol: 'GC=F' },
  { key: 'NASDAQ', symbol: 'NQ.v.0', frontendSymbol: 'NQ=F' },
  { key: 'SP500', symbol: 'ES.v.0', frontendSymbol: 'ES=F' },
];

const finite = value => Number.isFinite(Number(value)) ? Number(value) : null;
let cache = { expiresAt: 0, payload: null };

async function getBars(apiKey, symbol, schema, start, end) {
  const url = new URL('https://hist.databento.com/v0/timeseries.get_range');
  url.searchParams.set('dataset', DATASET);
  url.searchParams.set('symbols', symbol);
  url.searchParams.set('stype_in', 'continuous');
  url.searchParams.set('schema', schema);
  url.searchParams.set('start', start);
  url.searchParams.set('end', end);
  url.searchParams.set('encoding', 'json');

  const response = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}` },
  });
  if (!response.ok) throw new Error(`Databento ${response.status}: ${(await response.text().catch(() => '')).slice(0, 240)}`);

  return (await response.text())
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean);
}

function normalizeRecord(record) {
  const source = record?.hd ? { ...record.hd, ...record } : record;
  return {
    ts: source?.ts_event ?? null,
    open: finite(source?.open),
    high: finite(source?.high),
    low: finite(source?.low),
    close: finite(source?.close),
    volume: finite(source?.volume),
  };
}

function makeQuote(instrument, minuteBars, hourBars, now) {
  const minutes = minuteBars.map(normalizeRecord).filter(b => b.close != null).sort((a,b) => Number(a.ts) - Number(b.ts));
  const hours = hourBars.map(normalizeRecord).filter(b => b.close != null).sort((a,b) => Number(a.ts) - Number(b.ts));
  if (!minutes.length) return {
    key: instrument.key, symbol: instrument.frontendSymbol, providerSymbol: instrument.symbol,
    price: null, previous: null, change: null, changePct: null, dayHigh: null, dayLow: null, volume: null,
    marketState: 'UNAVAILABLE', source: 'Databento'
  };

  const latest = minutes[minutes.length - 1];
  const baseline = hours[0]?.close ?? null;
  const change = baseline != null ? latest.close - baseline : null;
  const changePct = baseline ? (change / baseline) * 100 : null;
  const highs = hours.map(b => b.high).filter(v => v != null);
  const lows = hours.map(b => b.low).filter(v => v != null);
  const volume = hours.map(b => b.volume).filter(v => v != null).reduce((sum,v) => sum + v, 0);
  const ageMs = latest.ts ? Math.max(0, now - Date.parse(latest.ts)) : Infinity;

  return {
    key: instrument.key,
    symbol: instrument.frontendSymbol,
    providerSymbol: instrument.symbol,
    price: latest.close,
    previous: baseline,
    change,
    changePct,
    dayHigh: highs.length ? Math.max(...highs) : null,
    dayLow: lows.length ? Math.min(...lows) : null,
    volume,
    marketState: ageMs <= 2 * 60 * 1000 ? 'LIVE' : 'DELAYED',
    source: 'Databento',
    dataTimestamp: latest.ts,
  };
}

export default async function handler(req, res) {
  const apiKey = process.env.DATABENTO_API_KEY;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (!apiKey) return res.status(503).json({ error: 'Market data provider is not configured', provider: 'databento', data: [] });

  const now = Date.now();
  if (cache.payload && cache.expiresAt > now) return res.status(200).json(cache.payload);

  try {
    const end = new Date(now);
    const minuteStart = new Date(now - 12 * 60 * 1000);
    const hourStart = new Date(now - 26 * 60 * 60 * 1000);
    const minuteStartIso = minuteStart.toISOString();
    const hourStartIso = hourStart.toISOString();
    const endIso = end.toISOString();

    const data = await Promise.all(INSTRUMENTS.map(async instrument => {
      const [minuteBars, hourBars] = await Promise.all([
        getBars(apiKey, instrument.symbol, 'ohlcv-1m', minuteStartIso, endIso),
        getBars(apiKey, instrument.symbol, 'ohlcv-1h', hourStartIso, endIso),
      ]);
      return makeQuote(instrument, minuteBars, hourBars, now);
    }));

    data.push({
      key: 'DOLLAR', symbol: 'DX-Y.NYB', providerSymbol: 'DXY', price: null, previous: null,
      change: null, changePct: null, dayHigh: null, dayLow: null, volume: null,
      marketState: 'UNAVAILABLE', source: 'Not configured'
    });

    const payload = { updatedAt: new Date().toISOString(), provider: 'databento', data };
    cache = { payload, expiresAt: now + 5000 };
    return res.status(200).json(payload);
  } catch (error) {
    console.error('Databento market data error:', error);
    return res.status(502).json({ error: 'Market data temporarily unavailable', provider: 'databento', data: [] });
  }
}
