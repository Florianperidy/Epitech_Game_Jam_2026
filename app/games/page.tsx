"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CatchGame from "./components/CatchGame";
import ClickerGame from "./components/ClickerGame";
import MemoryGame from "./components/MemoryGame";
import ReactionGame from "./components/ReactionGame";

export default function GamesPage() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<{ amount: number; currency: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleGameComplete = async (score: number, gameType: string) => {
    try {
      const res = await fetch("/api/games/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, gameType }),
      });

      if (res.ok) {
        const data = await res.json();
        setEarnings({ amount: data.reward, currency: data.currency });
        setTimeout(() => {
          setSelectedGame(null);
          setEarnings(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 font-sans flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300">
            <span className="text-slate-400 group-hover:text-white transition-colors">
              ←
            </span>
            <span className="text-sm font-semibold text-slate-300 group-hover:text-white">
              Retour au Dashboard
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Games
          </h1>
          <div className="w-48"></div>
        </header>

        {earnings && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-center">
            <p className="text-lg font-semibold text-emerald-400">
              {earnings.amount} {earnings.currency} earned
            </p>
          </div>
        )}

        {!selectedGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div onClick={() => setSelectedGame("clicker")} className="p-6 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-all">
              <h2 className="text-lg font-semibold mb-2 text-white">
                Rapid Click Test
              </h2>
              <p className="text-slate-400 mb-4 text-sm">
                Test your clicking speed over 10 seconds
              </p>
              <div className="text-slate-500 text-xs font-medium">
                Reward: 5-15 EUR
              </div>
            </div>

            <div onClick={() => setSelectedGame("memory")} className="p-6 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-all">
              <h2 className="text-lg font-semibold mb-2 text-white">
                Memory Match
              </h2>
              <p className="text-slate-400 mb-4 text-sm">
                Match card pairs to complete the game
              </p>
              <div className="text-slate-500 text-xs font-medium">
                Reward: 10-25 EUR
              </div>
            </div>

            <div onClick={() => setSelectedGame("catch")} className="p-6 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-all">
              <h2 className="text-lg font-semibold mb-2 text-white">
                Catch Items
              </h2>
              <p className="text-slate-400 mb-4 text-sm">
                Catch falling items with your basket
              </p>
              <div className="text-slate-500 text-xs font-medium">
                Reward: 1-3 GLITCH
              </div>
            </div>

            <div onClick={() => setSelectedGame("reaction")} className="p-6 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-all">
              <h2 className="text-lg font-semibold mb-2 text-white">
                Reaction Time
              </h2>
              <p className="text-slate-400 mb-4 text-sm">
                Test your reaction speed with 5 rounds
              </p>
              <div className="text-slate-500 text-xs font-medium">
                Reward: 8-20 EUR
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setSelectedGame(null)} className="mb-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold">
              Back to Games
            </button>
            {selectedGame === "clicker" && <ClickerGame onComplete={(score) => handleGameComplete(score, "clicker")} />}
            {selectedGame === "memory" && <MemoryGame onComplete={(score) => handleGameComplete(score, "memory")} />}
            {selectedGame === "catch" && <CatchGame onComplete={(score) => handleGameComplete(score, "catch")} />}
            {selectedGame === "reaction" && <ReactionGame onComplete={(score) => handleGameComplete(score, "reaction")} />}
          </div>
        )}
      </div>
    </div>
  );
}
