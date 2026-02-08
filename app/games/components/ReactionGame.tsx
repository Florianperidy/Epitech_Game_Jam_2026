"use client";

import { useEffect, useState } from "react";

interface ReactionGameProps {
  onComplete: (score: number) => void;
}

export default function ReactionGame({ onComplete }: ReactionGameProps) {
  const [isActive, setIsActive] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [failedClick, setFailedClick] = useState(false);
  const [lagCount, setLagCount] = useState(0);

  const maxRounds = 5;

  const startNextRound = () => {
    setShowTarget(false);
    setReactionTime(null);
    setFailedClick(false);

    const delay = 1000 + Math.random() * 3000;

    setTimeout(() => {
      const artificialLag = 200 + Math.random() * 800;
      setLagCount((prev) => prev + 1);

      setTargetTime(Date.now() - artificialLag);
      setShowTarget(true);
    }, delay);
  };

  const handleClick = () => {
    if (!isActive) return;

    if (!showTarget) {
      setFailedClick(true);
      setTimeout(() => {
        if (round + 1 >= maxRounds) {
          finishGame([...reactionTimes, 9999]);
        } else {
          setRound((r) => r + 1);
          startNextRound();
        }
      }, 1000);
      return;
    }

    if (targetTime) {
      const actualReactionTime = Date.now() - targetTime;
      setReactionTime(actualReactionTime);
      setReactionTimes((prev) => [...prev, actualReactionTime]);

      setTimeout(() => {
        if (round + 1 >= maxRounds) {
          finishGame([...reactionTimes, actualReactionTime]);
        } else {
          setRound((r) => r + 1);
          startNextRound();
        }
      }, 1000);
    }
  };

  const finishGame = (times: number[]) => {
    const validTimes = times.filter((t) => t < 9999);
    const avgTime = validTimes.length > 0 ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length : 0;

    const score = Math.max(0, Math.floor(1000 - avgTime / 2));
    onComplete(score);
  };

  const startGame = () => {
    setIsActive(true);
    setRound(0);
    setReactionTimes([]);
    setLagCount(0);
    startNextRound();
  };

  useEffect(() => {
    if (isActive && round === 0 && !showTarget && reactionTime === null) {
      startNextRound();
    }
  }, []);

  const avgReactionTime = reactionTimes.length > 0 ? reactionTimes.filter((t) => t < 9999).reduce((a, b) => a + b, 0) / reactionTimes.filter((t) => t < 9999).length : 0;

  return (
    <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Reaction Time Test
        </h2>
        <div className="flex justify-center gap-12 text-lg font-mono text-slate-300">
          <div>
            <p className="text-xs text-slate-500 mb-1">Round</p>
            <p className="text-xl font-semibold text-white">{round + 1}/{maxRounds}</p>
          </div>
          {avgReactionTime > 0 && (<div>
            <p className="text-xs text-slate-500 mb-1">Average</p>
            <p className="text-xl font-semibold text-white">{Math.round(avgReactionTime)}ms</p>
          </div>)}
          {lagCount > 0 && (<div>
            <p className="text-xs text-slate-500 mb-1">Lag Events</p>
            <p className="text-xl font-semibold text-red-400">{lagCount}</p>
          </div>)}
        </div>
      </div>

      {!isActive ? (
        <>
          {reactionTimes.length > 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl font-semibold text-white mb-4">
                Test Complete
              </p>
              <p className="text-lg text-slate-300 mb-4">
                Average: {Math.round(avgReactionTime)}ms
              </p>
            </div>
          ) : (
            <button onClick={startGame} className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all">
              Start Test
            </button>
          )}
        </>
      ) : (
        <div onClick={handleClick} className={`relative w-full h-80 rounded-lg cursor-pointer flex items-center justify-center transition-all ${showTarget ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-800 hover:bg-slate-700"}`}>
          {!showTarget && !reactionTime && !failedClick && (
            <p className="text-lg font-medium text-slate-500">
              Wait for target...
            </p>
          )}

          {showTarget && !reactionTime && (<p className="text-3xl font-bold text-white">
            Click Now
          </p>)}

          {reactionTime && (<p className="text-3xl font-bold text-white">
            {reactionTime}ms
          </p>)}

          {failedClick && (<p className="text-2xl font-bold text-red-400">
            Too Early
          </p>)}
        </div>
      )}

      <div className="mt-4 text-center text-sm text-slate-500">
        Click as quickly as possible when the box turns blue
      </div>
    </div>
  );
}
