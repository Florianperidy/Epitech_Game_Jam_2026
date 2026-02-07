"use client";

import { useEffect, useState } from 'react';

interface Transaction {
  _id: string;
  type: 'buy' | 'sell' | 'deposit';
  asset: string;
  amount: number;
  date: string;
  status: 'pending' | 'Completed' | 'Failed' | 'Pending' | 'Corrupted';
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.slice(0, 10));
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Refresh transactions every 5 seconds
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions <span className="text-red-500">(Live)</span></h2>
      <ul className="space-y-2 text-sm">
        {transactions.length === 0 && <li className="text-gray-500">No transactions recorded (yet).</li>}
        {transactions.map((tx) => (
          <li key={tx._id} className="flex justify-between items-center p-2 rounded bg-slate-800">
            <div className="flex flex-col">
              <span className={tx.type === 'buy' ? 'text-green-400' : tx.type === 'sell' ? 'text-red-400' : 'text-blue-400'}>
                {tx.type.toUpperCase()} {tx.amount.toFixed(5)} {tx.asset}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(tx.date).toLocaleTimeString()}
              </span>
            </div>
            <span className={`
              text-xs font-bold
              ${tx.status === 'Completed' ? 'text-green-500' : ''}
              ${tx.status === 'Pending' ? 'text-yellow-500 animate-pulse' : ''}
              ${tx.status === 'Failed' || tx.status === 'Corrupted' ? 'text-red-500' : ''}
            `}>
              {tx.status.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
