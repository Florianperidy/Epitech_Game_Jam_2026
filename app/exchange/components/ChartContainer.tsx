"use client";
import { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  CandlestickData,
  IChartApi,
  CandlestickSeries,
  ISeriesApi
} from 'lightweight-charts';

const generateBuggyData = (count: number, symbol: string): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let lastClose = symbol === "eth" ? 3500 : symbol === "sol" ? 145 : 60000;
  if (symbol === "glitch") lastClose = 10;

  const currentTime = new Date(Date.now() - count * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const open = lastClose * (1 + (Math.random() - 0.5) * 0.02);
    const close = open * (1 + (Math.random() - 0.5) * 0.03);
    data.push({
      time: currentTime.toISOString().split('T')[0] as any,
      open,
      high: Math.max(open, close) * 1.01,
      low: Math.min(open, close) * 0.99,
      close,
    });
    lastClose = close;
    currentTime.setDate(currentTime.getDate() + 1);
  }
  return data;
};

export default function ChartContainer({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);

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
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const data = generateBuggyData(100, symbol);
    series.setData(data);

    chartInstanceRef.current = chart;

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
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [symbol]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-[400px] bg-slate-900 rounded-lg border border-slate-800 overflow-hidden"
    />
  );
}