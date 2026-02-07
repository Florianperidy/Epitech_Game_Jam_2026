"use client";

import Link from "next/link";

const cryptos = [
  { id: "btc", symbol: "BTC", price: "69,420" },
  { id: "eth", symbol: "ETH", price: "3,512" },
  { id: "sol", symbol: "SOL", price: "145" },
  { id: "glitch", symbol: "GLITCH", price: "???" },
];

export default function CryptoSelector({ current }: { current: string }) {
  return (
    <nav className="flex space-x-2 mb-6 overflow-x-auto p-2 bg-slate-900 rounded-lg border border-slate-800">
      {cryptos.map((c) => (
        <Link
          key={c.id}
          href={`/exchange/${c.id}`}
          className={`px-4 py-2 rounded-md min-w-[100px] border-b-2 transition-all ${
            current === c.id ? "bg-slate-800 border-blue-500" : "border-transparent hover:bg-slate-800"
          }`}
        >
          <div className="font-bold text-sm">{c.symbol}</div>
          <div className="text-xs text-slate-500">${c.price}</div>
        </Link>
      ))}
    </nav>
  );
}