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

const generateBuggyCandlestickData = (count: number): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let lastClose = 60000;
  const currentTime = new Date(Date.now() - count * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const open = lastClose * (1 + (Math.random() - 0.5) * 0.02);
    const close = open * (1 + (Math.random() - 0.5) * 0.03);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    const timeString = currentTime.toISOString().split('T')[0];

    data.push({
      time: timeString,
      open,
      high,
      low,
      close,
    });

    lastClose = close;
    currentTime.setDate(currentTime.getDate() + 1);
  }
  return data;
};

export default function ChartContainer() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const initialData = generateBuggyCandlestickData(100);

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

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    candlestickSeries.setData(initialData);
    seriesRef.current = candlestickSeries;
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    const interval = setInterval(() => {
      if (seriesRef.current) {
        const lastData = initialData[initialData.length - 1];
        const newData: CandlestickData = {
            time: new Date().toISOString().split('T')[0],
            open: lastData.close,
            high: lastData.close * 1.02,
            low: lastData.close * 0.98,
            close: lastData.close * (Math.random() > 0.5 ? 1.01 : 0.99),
        };
        seriesRef.current.update(newData);
      }
    }, 3000);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-[400px] bg-slate-900 rounded-lg border border-slate-800 overflow-hidden"
    />
  );
}