
export const BASE_PRICES = {
  BTC: 69420,
  ETH: 3512,
  SOL: 145,
  GLITCH: 0.42,
};

const getPriceAtTime = (symbol: string, timestamp: number) => {
  const base = BASE_PRICES[symbol as keyof typeof BASE_PRICES] || 100;

  let volatility = 0.05;
  let phase = 0;

  if (symbol === 'ETH') { volatility = 0.08; phase = 2; }
  if (symbol === 'SOL') { volatility = 0.12; phase = 4; }
  if (symbol === 'GLITCH') { volatility = 0.8; phase = 1; }

  const timeFactor = timestamp / 5000;
  const trend = Math.sin(timeFactor + phase) * volatility;
  const jitter = Math.cos(timeFactor * 3.5 + phase) * (volatility * 0.1);

  let price = base * (1 + trend + jitter);

  if (Math.random() < 0.005) price = price * 0.1;

  return Math.max(0.01, price);
};

export const getLivePrices = () => {
  const now = Date.now();
  return {
    BTC: getPriceAtTime('BTC', now),
    ETH: getPriceAtTime('ETH', now),
    SOL: getPriceAtTime('SOL', now),
    GLITCH: getPriceAtTime('GLITCH', now) + (Math.random() > 0.90 ? Math.random() * 50 : 0),
  };
};

export const getHistoricalData = (symbol: string, count: number = 100) => {
  const data = [];
  const now = Date.now();
  const interval = 60 * 60 * 1000;

  for (let i = count; i > 0; i--) {
    const time = now - (i * interval);
    const open = getPriceAtTime(symbol, time);
    const close = getPriceAtTime(symbol, time + interval);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    data.push({
      time: time / 1000 as any,
      open,
      high,
      low,
      close
    });
  }
  return data;
};