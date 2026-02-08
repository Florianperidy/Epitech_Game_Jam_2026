type Candle = { time: number; open: number; high: number; low: number; close: number; };
type MarketState = { history: Record<string, Candle[]>; lastUpdate: number; };

declare global { var marketStore: MarketState | undefined; }

const INITIAL_PRICES = { BTC: 69420, ETH: 3512, SOL: 145, GLITCH: 0.42 };

function generateInitialHistory(symbol: string, startPrice: number) {
  const candles: Candle[] = [];
  let currentPrice = startPrice;
  const now = Math.floor(Date.now() / 1000);
  for (let i = 2000; i > 0; i--) {
    const time = now - (i * 60);
    const volatility = symbol === 'GLITCH' ? 0.15 : 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = Math.max(0.01, currentPrice * (1 + change));
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    candles.push({ time, open, high, low, close });
    currentPrice = close;
  }
  return candles;
}

const getMarketState = (): MarketState => {
  if (!global.marketStore) {
    const history: Record<string, Candle[]> = {};
    Object.entries(INITIAL_PRICES).forEach(([symbol, price]) => {
      history[symbol] = generateInitialHistory(symbol, price);
    });
    global.marketStore = { history, lastUpdate: Math.floor(Date.now() / 1000) };
  }
  return global.marketStore;
};

export const updateMarket = () => {
  const state = getMarketState();
  const now = Math.floor(Date.now() / 1000);
  const secondsSinceLastUpdate = now - state.lastUpdate;
  if (secondsSinceLastUpdate >= 1) {
    Object.keys(state.history).forEach((symbol) => {
      const candles = state.history[symbol];
      let lastCandle = candles[candles.length - 1];

      if (now - lastCandle.time >= 60) {
        const newCandle = { ...lastCandle, time: lastCandle.time + 60, open: lastCandle.close, high: lastCandle.close, low: lastCandle.close };
        candles.push(newCandle);
        if (candles.length > 3000) candles.shift();
        lastCandle = newCandle;
      }

      const volatility = symbol === 'GLITCH' ? 0.05 : 0.002;
      let change = (Math.random() - 0.5) * volatility;
      if (symbol === 'GLITCH' && Math.random() < 0.01) change = change * 20;

      const newPrice = Math.max(0.01, lastCandle.close * (1 + change));
      lastCandle.close = newPrice;
      lastCandle.high = Math.max(lastCandle.high, newPrice);
      lastCandle.low = Math.min(lastCandle.low, newPrice);
    });
    state.lastUpdate = now;
  }
  return state;
};

export const getLivePrices = () => {
  const state = updateMarket();
  const prices: Record<string, number> = {};
  Object.keys(state.history).forEach((symbol) => {
    const candles = state.history[symbol];
    prices[symbol] = candles[candles.length - 1].close;
  });
  return prices;
};

export const getHistoricalData = (symbol: string) => {
  const state = updateMarket();
  return state.history[symbol] || [];
};