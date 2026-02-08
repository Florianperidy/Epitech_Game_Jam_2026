"use client";
import { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  IChartApi,
  CandlestickSeries,
  ISeriesApi
} from 'lightweight-charts';

export default function ChartContainer({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lastPriceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    seriesRef.current = series;
    chartInstanceRef.current = chart;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/history?symbol=${symbol}`);
        const data = await res.json();
        series.setData(data);
        if (data.length > 0) {
          lastPriceRef.current = data[data.length - 1].close;
        }
      } catch (e) {
      }
    };

    fetchHistory();

    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol]);

  useEffect(() => {
    lastPriceRef.current = null;
    const interval = setInterval(async () => {
      if (!seriesRef.current) return;

      try {
        const res = await fetch("/api/prices");
        const prices = await res.json();
        const currentPrice = prices[symbol.toUpperCase()];

        if (currentPrice) {
            const now = Math.floor(Date.now() / 1000);
            const open = lastPriceRef.current ?? currentPrice;
            lastPriceRef.current = currentPrice;

            seriesRef.current.update({
                time: now as any,
                open: open,
                high: Math.max(open, currentPrice) * 1.0001,
                low: Math.min(open, currentPrice) * 0.9999,
                close: currentPrice
            });
        }
      } catch (error) {
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-[400px] bg-slate-900 rounded-lg border border-slate-800 overflow-hidden"
    />
  );
}