"use client";

import { useState } from 'react';

interface OrderFormProps {
  symbol?: string;
}

export default function OrderForm({ symbol = 'BTC' }: OrderFormProps) {
  const [amount, setAmount] = useState<string>('0.00');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLastError(null);
    setLastSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          amount: parseFloat(amount),
          orderType,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.hasBug) {
        setLastError(data.error || 'Order failed');
      } else {
        setLastSuccess(data.message || `Order successful!`);
        setAmount('0.00');

        // Reload page after 2 seconds to show updated portfolio
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setLastError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <label htmlFor="amount" className="block text-sm text-gray-400 mb-1">Amount ({symbol})</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            disabled={isSubmitting}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            placeholder="0.00"
          />
        </div>

        {lastError && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-md text-sm animate-pulse">
            {lastError}
          </div>
        )}

        {lastSuccess && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 text-green-300 rounded-md text-sm">
            {lastSuccess}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 rounded-md font-bold ${
            orderType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Processing...' : orderType === 'buy' ? 'Execute Buy Order' : 'Execute Sell Order'}
        </button>
      </form>
    </div>
  );
}
