"use client";

import { useParams } from "next/navigation";
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
        <header className="flex justify-between py-4 border-b border-slate-800 mb-4">
          <h1 className="text-3xl font-bold uppercase">{symbol}/USD</h1>
          <div className="text-red-500 animate-pulse text-xs">SYSTEM_STATUS: CORRUPTED</div>
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