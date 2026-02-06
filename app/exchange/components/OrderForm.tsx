"use client";

import { useState } from 'react';

export default function OrderForm() {
  const [amount, setAmount] = useState<string>('0.00');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [lastError, setLastError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLastError(null);
    if (Math.random() < 0.3) {
      const bugType = Math.floor(Math.random() * 3);
      switch (bugType) {
        case 0: setLastError("ERROR: Transaction ID Conflict (0xABC123). Please retry."); break;
        case 1: setLastError("WARNING: Funds deducted, but order not placed. Check balance."); break;
        case 2: setLastError(`CRITICAL: Order placed for ${parseFloat(amount) * 10} BTC! (Amount Multiplier Bug)`); break;
        default: break;
      }
      return;
    }

    alert(`Order of ${amount} BTC to ${orderType} successful! (Or was it?)`);
    setAmount('0.00');
  };

  return (
    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
      <h2 className="text-xl font-semibold mb-4">Place Order</h2>

      <div className="flex mb-4">
        <button
          onClick={() => setOrderType('buy')}
          className={`flex-1 p-2 rounded-l-md ${orderType === 'buy' ? 'bg-green-600' : 'bg-slate-700'} hover:bg-green-700 transition-colors`}
        >
          Buy
        </button>
        <button
          onClick={() => setOrderType('sell')}
          className={`flex-1 p-2 rounded-r-md ${orderType === 'sell' ? 'bg-red-600' : 'bg-slate-700'} hover:bg-red-700 transition-colors`}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm text-gray-400 mb-1">Amount (BTC)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        {lastError && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-md text-sm animate-pulse">
            {lastError}
          </div>
        )}

        <button
          type="submit"
          className={`w-full p-3 rounded-md font-bold ${
            orderType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          } transition-colors`}
        >
          {orderType === 'buy' ? 'Execute Buy Order' : 'Execute Sell Order'}
        </button>
      </form>
    </div>
  );
}