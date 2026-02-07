"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Asset {
  symbol: string;
  name: string;
  amount: number;
  isFiat?: boolean;
  isGlitch?: boolean;
}

interface Portfolio {
  assets: Asset[];
}

interface Transaction {
  type: string;
  asset: string;
  amount: number;
  date: string;
  status: string;
  description?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, transactionsRes] = await Promise.all([
          fetch("/api/portfolio"),
          fetch("/api/transactions"),
        ]);

        if (!portfolioRes.ok || !transactionsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const portfolioData = await portfolioRes.json();
        const transactionsData = await transactionsRes.json();

        setPortfolio(portfolioData);
        setTransactions(
          transactionsData.map((tx: any) => ({
            type: tx.description || (tx.type === "deposit" ? "Dépôt" : tx.type === "buy" ? "Achat" : tx.type === "sell" ? "Vente" : tx.type),
            asset: tx.asset,
            amount: tx.type === "deposit" ? `+${tx.amount.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
            })}` : tx.type === "buy" ? `+${tx.amount.toLocaleString("fr-FR", {
              minimumFractionDigits: 5,
            })}` : `-${tx.amount.toLocaleString("fr-FR", {
              minimumFractionDigits: 5,
            })}`,
            date: new Date(tx.date).toLocaleDateString(),
            status: tx.status,
            description: tx.description,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 font-sans flex items-center justify-center">
        <p className="text-slate-400">Loading portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 font-sans flex items-center justify-center">
        <p className="text-red-400">{error || "Failed to load portfolio"}</p>
      </div>
    );
  }

  const eurAsset = portfolio.assets.find((a) => a.symbol === "EUR");
  const eurBalance = eurAsset?.amount || 0;

  const priceTable: Record<string, number> = {
    BTC: 69420,
    ETH: 3512,
    SOL: 145,
    GLITCH: 1,
  };

  const assets = portfolio.assets.map((asset) => {
    const isEur = asset.symbol === "EUR";
    const price = priceTable[asset.symbol] || 0;
    const valueNumber = isEur ? eurBalance : asset.symbol === "GLITCH" ? NaN : asset.amount * price;

    return {
      ...asset,
      amount: isEur ? eurBalance.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) : asset.amount.toLocaleString("fr-FR", { minimumFractionDigits: 5 }),
      value: isEur ? eurBalance.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) : asset.symbol === "GLITCH" ? "ERR_NULL" : valueNumber.toLocaleString("fr-FR", { minimumFractionDigits: 2 }),
      change: "0.00%",
      isPositive: true,
      valueNumber,
    };
  });

  const totalBalance = assets.reduce((sum, asset) => {
    if (typeof asset.valueNumber === "number" && Number.isFinite(asset.valueNumber)) {
      return sum + asset.valueNumber;
    }
    return sum;
  }, 0);

  const history = transactions.length > 0 ? transactions : [{
    type: "Dépôt Initial",
    asset: "EUR",
    amount: "+10 000.00",
    date: new Date().toLocaleDateString(),
    status: "Completed",
  }];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">

        <header className="flex items-center justify-between mb-8">
            <Link href="/exchange/btc" className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300">
                <span className="text-slate-400 group-hover:text-white transition-colors">←</span>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white">Retour à l'Exchange</span>
            </Link>
            <div className="text-right">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-bold">Mon Portefeuille</h1>
                    <p className="text-xs text-slate-500 font-mono">{session?.user?.email}</p>
                  </div>
                  <button onClick={() => signOut({ callbackUrl: "/auth/login" })} className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors">
                    Logout
                  </button>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative overflow-hidden backdrop-blur-sm">
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-slate-400 text-sm mb-1 font-medium">Solde Total Disponible</p>
                    <div className="flex items-baseline gap-3">
                    <h1 className="text-5xl font-bold tracking-tight text-white">
                        {totalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </h1>
                    <span className="text-slate-500 font-medium text-xl">€</span>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded font-mono font-bold border border-emerald-500/20">
                            Prêt à jouer
                        </span>
                    </div>
                </div>

                <div className="h-full min-h-[100px] flex items-center justify-end opacity-90">
                    <svg viewBox="0 0 200 60" className="w-full h-full text-emerald-500 overflow-visible" fill="none" stroke="currentColor" strokeWidth="3">
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0 55 L 20 55 L 40 55 L 200 55" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,5" opacity="0.5"/>
                        <path d="M0 55 L 200 55" fill="url(#gradient)" stroke="none" />
                    </svg>
                </div>
              </div>

              <div className="relative z-10 flex gap-3 mt-8">
                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
                  Ajouter des Fonds (Bug)
                </button>
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold text-sm border border-slate-700 transition-all">
                  Retirer
                </button>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Mes Actifs</h2>
              </div>

              <div className="divide-y divide-slate-800/50">
                {assets.map((asset) => (
                  <div key={asset.symbol} className={`p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors cursor-pointer group ${asset.isGlitch ? 'animate-pulse bg-red-900/10' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${asset.symbol === 'EUR' ? 'bg-slate-700 text-white border border-slate-600' : ''} ${asset.symbol === 'BTC' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : ''} ${asset.symbol === 'ETH' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' : ''} ${asset.symbol === 'SOL' ? 'bg-purple-500/20 text-purple-500 border border-purple-500/30' : ''} ${asset.symbol === 'GLITCH' ? 'bg-red-500/20 text-red-500 border border-red-500/30 font-mono' : ''}`}>
                        {asset.symbol === 'EUR' ? '€' : asset.symbol[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-white">{asset.symbol}</p>
                            {asset.isGlitch && <span className="text-[10px] bg-red-500 text-white px-1 rounded">BUG</span>}
                            {asset.isFiat && <span className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded">FIAT</span>}
                        </div>
                        <p className="text-xs text-slate-400">{asset.name}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-bold font-mono ${asset.isGlitch ? 'text-red-400 blur-[1px]' : 'text-white'}`}>
                        {asset.value} <span className="text-slate-500 text-xs">€</span>
                      </p>
                      <p className={`text-xs font-medium ${asset.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {asset.amount} {asset.symbol}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl h-fit">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Dernières Activités</h2>
            </div>

            <div className="p-4 space-y-4">
              {history.map((item, i) => (
                <div key={i} className="flex items-start gap-3 relative pb-4 border-l border-slate-800 pl-4 last:pb-0 last:border-0">
                  <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${item.status === 'Completed' ? 'bg-emerald-500' : item.status === 'Processing' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-slate-200">{item.type} {item.asset}</p>
                        <span className={`text-xs font-mono ${String(item.amount).includes('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {item.amount}
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
