"use client";

import { useEffect, useState } from 'react';

const bugMessages = [
  "ERROR: [0xCAFEBABE] Memory leak detected in `calculate_profit_loss()`",
  "WARNING: [0xDEADBEEF] Price feed interrupted. Using cached data from 2005.",
  "CRITICAL: [0xBADF00D] User balance desynchronization. Funds are... somewhere.",
  "DEBUG: [0x1A2B3C4D] Initiating random UI glitch protocol.",
  "ALERT: [0x5EEDFACE] 'Sell All' button momentarily inverted with 'Buy All'.",
  "NOTICE: [0xAAAAAA] Price prediction algorithm now using astrological data.",
  "INFO: [0xBBBBBB] Server load high. Expect visual anomalies.",
  "BUG: [0xCCCCCCCC] Candlestick data points occasionally teleport to Mars.",
];

export default function BugConsole() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomBug = bugMessages[Math.floor(Math.random() * bugMessages.length)];
      setLogs((prev) => [randomBug, ...prev].slice(0, 5));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-slate-900 rounded-lg border border-red-800/50 font-mono text-sm text-red-400 animate-pulse-slow">
      <h2 className="text-xl font-bold mb-2 text-red-500">_SYSTEM_LOGS</h2>
      <div className="space-y-1">
        {logs.map((log, index) => (
          <p key={index} className="opacity-80 leading-tight">
            {log}
          </p>
        ))}
        {logs.length === 0 && <p className="text-gray-600">Loading system errors...</p>}
      </div>
    </div>
  );
}