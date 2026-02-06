"use client";

import { useEffect, useState } from 'react';

interface Transaction {
  id: number;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'completed' | 'failed';
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        const newTransaction: Transaction = {
          id: Date.now(),
          type: Math.random() < 0.5 ? 'buy' : 'sell',
          amount: parseFloat((Math.random() * 0.1 + 0.01).toFixed(3)),
          price: parseFloat((60000 + (Math.random() - 0.5) * 5000).toFixed(2)),
          status: Math.random() < 0.8 ? 'completed' : (Math.random() < 0.5 ? 'pending' : 'failed'),
        };
        setTransactions((prev) => [newTransaction, ...prev].slice(0, 10));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions <span className="text-red-500">(Delayed)</span></h2>
      <ul className="space-y-2 text-sm">
        {transactions.length === 0 && <li className="text-gray-500">No transactions recorded (yet).</li>}
        {transactions.map((tx) => (
          <li key={tx.id} className="flex justify-between items-center p-2 rounded bg-slate-800">
            <span className={tx.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
              {tx.type.toUpperCase()} {tx.amount} BTC
            </span>
            <span className="text-gray-300">${tx.price}</span>
            <span className={`
              ${tx.status === 'completed' ? 'text-green-500' : ''}
              ${tx.status === 'pending' ? 'text-yellow-500 animate-pulse' : ''}
              ${tx.status === 'failed' ? 'text-red-500' : ''}
            `}>
              {tx.status.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}