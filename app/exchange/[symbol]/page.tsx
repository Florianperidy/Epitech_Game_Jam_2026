"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import ChartContainer from '../components/ChartContainer';
import OrderForm from '../components/OrderForm';
import TransactionList from '../components/TransactionList';
import BugConsole from '../components/BugConsole';
import CryptoSelector from '../components/CryptoSelector';

export default function ExchangePage() {
  const params = useParams();
  const symbol = (params.symbol as string) || "btc";

  return (
    <div className="p-4 bg-slate-950 min-h-screen text-white font-mono">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between py-4 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold italic tracking-tighter">
              {symbol}<span className="text-gray-500">/USD</span>
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-sm text-red-500 animate-pulse font-mono hidden md:block">
              SYSTEM_STATUS: CORRUPTED
            </div>
            <Link href="/dashboard" className="transition-transform hover:scale-110">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </Link>
          </div>
        </header>

        <CryptoSelector current={symbol} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <ChartContainer symbol={symbol} />
            <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-800 text-yellow-600 text-sm">
              [ANOMALY] Prices for {symbol.toUpperCase()} are currently desynchronized.
            </div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <OrderForm />
            <TransactionList />
            <BugConsole />
          </div>
        </div>
      </div>
    </div>
  );
}