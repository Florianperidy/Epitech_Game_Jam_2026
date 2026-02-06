"use client";

import ChartContainer from './components/ChartContainer';
import OrderForm from './components/OrderForm';
import TransactionList from './components/TransactionList';
import BugConsole from './components/BugConsole';

export default function ExchangePage() {
  const isSystemCorrupted = true;

  return (
    <div className={`p-4 bg-slate-950 min-h-screen text-white font-sans ${isSystemCorrupted ? 'font-mono' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between py-4 border-b border-slate-800 mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">
              BTC<span className="text-gray-500">/USD</span>
            </h1>
            <span className="text-xl text-green-500">
              69,420.69 USD <span className="text-sm text-green-700">+1.23%</span>
            </span>
          </div>
          <div className="text-sm text-red-500 animate-pulse">
            SYSTEM OVERLOAD [CODE: 0xDEADBEEF]
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <ChartContainer />
            <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-800">
              <h2 className="text-lg font-semibold mb-2 text-yellow-500">ANOMALY REPORT</h2>
              <p className="text-sm text-yellow-600">
                Data stream integrity compromised. Prices may not reflect reality. Proceed with caution.
                <span className="ml-2 text-red-500 animate-bounce">!</span>
              </p>
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <OrderForm />
            <TransactionList />
            {isSystemCorrupted && <BugConsole />}
          </div>
        </div>

        <footer className="mt-8 pt-4 border-t border-slate-800 text-center text-sm text-gray-600">
          © 2024 GLITCH-EX. All rights reserved. (Except for data integrity).
        </footer>
      </div>
    </div>
  );
}