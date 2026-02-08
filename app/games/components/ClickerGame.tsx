"use client";

import { useEffect, useState } from "react";

interface ClickerGameProps {
  onComplete: (score: number) => void;
}

export default function ClickerGame({ onComplete }: ClickerGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [failedClicks, setFailedClicks] = useState(0);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, onComplete]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;

    if (Math.random() < 0.3) {
      setFailedClicks((prev) => prev + 1);
      return;
    }

    setScore((prev) => prev + 1);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setFailedClicks(0);
    setIsActive(true);
  };

  return (
    <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Rapid Click Test
        </h2>
        <div className="flex justify-center gap-12 text-lg font-mono text-slate-300">
          <div>
            <p className="text-xs text-slate-500 mb-1">Score</p>
            <p className="text-xl font-semibold text-white">{score}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Time Remaining</p>
            <p className="text-xl font-semibold text-white">{timeLeft}s</p>
          <div>
            <p className="text-xs text-slate-500 mb-1">Failed</p>
            <p className="text-xl font-semibold text-red-400">{failedClicks}</p>
          </div>
          </div>
        </div>
      </div>

      {!isActive && timeLeft === 10 ? (
        <button
          onClick={startGame}
          className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
        >
          Start Test
        </button>
      ) : !isActive ? (
        <div className="text-center py-8">
          <p className="text-2xl font-semibold text-white mb-4">
            Test Complete
          </p>
          <p className="text-lg text-slate-300">
            Score: {score}
          </p>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="relative w-full h-80 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors flex items-center justify-center overflow-hidden"
        >
          <p className="text-lg font-semibold text-slate-500 select-none">
            Click as fast as you can
          </p>
        </div>
      )}
    </div>
  );
}
