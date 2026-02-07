"use client";

import { useEffect, useRef, useState } from "react";

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: "coin" | "glitch" | "bomb";
  speed: number;
  direction: number;
}

interface CatchGameProps {
  onComplete: (score: number) => void;
}

export default function CatchGame({ onComplete }: CatchGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [glitches, setGlitches] = useState(0);
  const itemIdRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

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
  }, [isActive, score, onComplete]);

  useEffect(() => {
    if (!isActive) return;

    const spawnInterval = setInterval(() => {
      const itemType = Math.random();
      const type: "coin" | "glitch" | "bomb" =
        itemType < 0.6 ? "coin" : itemType < 0.85 ? "glitch" : "bomb";

      const newItem: FallingItem = {
        id: itemIdRef.current++,
        x: Math.random() * 90,
        y: -5,
        type,
        speed: 2 + Math.random() * 2,
        direction: 1,
      };

      setItems((prev) => [...prev, newItem]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const moveInterval = setInterval(() => {
      setItems((prev) =>
        prev
          .map((item) => {
            let newItem = { ...item };

            if (Math.random() < 0.2) {
              newItem.x = Math.random() * 90;
              setGlitches((g) => g + 1);
            }

            if (Math.random() < 0.1) {
              newItem.direction = -1;
              setGlitches((g) => g + 1);
            }

            let newY = newItem.y + (newItem.speed * newItem.direction);

            if (
              newY >= 85 &&
              newY <= 95 &&
              newItem.x >= basketX - 8 &&
              newItem.x <= basketX + 8
            ) {
              if (newItem.type === "coin") {
                setScore((s) => s + 10);
              } else if (newItem.type === "glitch") {
                setScore((s) => s + 25);
              } else if (newItem.type === "bomb") {
                setLives((l) => {
                  if (l <= 1) {
                    setIsActive(false);
                    onComplete(score);
                    return 0;
                  }
                  return l - 1;
                });
              }
              return null;
            }

            if (newY > 105 || newY < -5) {
              return null;
            }

            return { ...newItem, y: newY };
          })
          .filter(Boolean) as FallingItem[]
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isActive, basketX, score]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, x)));
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(20);
    setItems([]);
    setGlitches(0);
    setIsActive(true);
  };

  return (
    <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Catch Items
        </h2>
        <div className="flex justify-center gap-12 text-lg font-mono text-slate-300">
          <div>
            <p className="text-xs text-slate-500 mb-1">Score</p>
            <p className="text-xl font-semibold text-white">{score}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Lives</p>
            <p className="text-xl font-semibold text-white">{lives}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Time</p>
            <p className="text-xl font-semibold text-white">{timeLeft}s</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Glitches</p>
            <p className="text-xl font-semibold text-red-400">{glitches}</p>
          </div>
        </div>
      </div>

      {!isActive && timeLeft === 20 ? (
        <button
          onClick={startGame}
          className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
        >
          Start Game
        </button>
      ) : !isActive ? (
        <div className="text-center py-8">
          <p className="text-2xl font-semibold text-white mb-4">Game Over</p>
          <p className="text-lg text-slate-300">Score: {score}</p>
        </div>
      ) : (
        <div
          ref={gameAreaRef}
          onMouseMove={handleMouseMove}
          className="relative w-full h-80 bg-slate-800 rounded-lg overflow-hidden"
        >
          {/* Falling items */}
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute font-semibold rounded px-2 py-1 text-xs transition-none"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: item.type === "coin" ? "#fbbf24" : item.type === "glitch" ? "#818cf8" : "#ef4444",
                color: "#fff",
              }}
            >
              {item.type === "coin" ? "COIN" : item.type === "glitch" ? "GLITCH" : "BOMB"}
            </div>
          ))}

          {/* Basket */}
          <div
            className="absolute bottom-4 w-12 h-8 bg-blue-600 rounded transition-none flex items-center justify-center text-white font-bold text-sm"
            style={{
              left: `${basketX}%`,
              transform: "translateX(-50%)",
            }}
          >
            [ ]
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-600 text-sm font-medium pointer-events-none">
            Move mouse to catch
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-slate-500">
        COIN: +10pts | GLITCH: +25pts | BOMB: -1 life
      </div>
    </div>
  );
}
