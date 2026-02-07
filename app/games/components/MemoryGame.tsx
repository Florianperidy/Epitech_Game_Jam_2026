"use client";

import { useEffect, useState } from "react";

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onComplete: (score: number) => void;
}

const symbols = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function MemoryGame({ onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [glitches, setGlitches] = useState(0);

  const initGame = () => {
    const shuffled = [...symbols, ...symbols].sort(() => Math.random() - 0.5).map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGlitches(0);
    setIsActive(true);
  };

  useEffect(() => {
    if (matches === symbols.length && isActive) {
      const score = Math.max(0, 100 - moves * 5);
      setTimeout(() => {
        onComplete(score);
      }, 1000);
    }
  }, [matches, moves, isActive, onComplete]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.symbol === secondCard.symbol) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatches((prev) => prev + 1);
        setFlippedCards([]);
      } else {
        const hasGlitch = Math.random() < 0.4;

        if (hasGlitch) {
          setGlitches((prev) => prev + 1);
          const glitchType = Math.floor(Math.random() * 3);

          setTimeout(() => {
            if (glitchType === 0) {
              const stayFlipped = Math.random() < 0.5 ? first : second;
              const willFlip = stayFlipped === first ? second : first;
              setCards((prev) => prev.map((card) => card.id === willFlip ? { ...card, isFlipped: false } : card));
            } else if (glitchType === 1) {
              const validCards = cards.filter((c) => !c.isMatched && c.id !== first && c.id !== second).map((c) => c.id);
              if (validCards.length > 0) {
                const randomCard = validCards[Math.floor(Math.random() * validCards.length)];
                setCards((prev) => prev.map((card) => card.id === first || card.id === second ? { ...card, isFlipped: false } : card.id === randomCard ? { ...card, isFlipped: !card.isFlipped } : card));
              } else {
                setCards((prev) => prev.map((c) => c.id === first || c.id === second ? { ...c, isFlipped: false } : c));
              }
            } else {
              setCards((prev) => prev.map((card) => card.id === first || card.id === second ? { ...card, isFlipped: false } : card ));
              setTimeout(() => {
                const flipAgain = Math.random() < 0.5 ? first : second;
                setCards((prev) => prev.map((c) => c.id === flipAgain ? { ...c, isFlipped: true } : c));
              }, 300);
            }
            setFlippedCards([]);
          }, 800);
        } else {
          setTimeout(() => {
            setCards((prev) => prev.map((card) => card.id === first || card.id === second ? { ...card, isFlipped: false } : card));
            setFlippedCards([]);
          }, 800);
        }
      }
      setMoves((prev) => prev + 1);
    }
  }, [flippedCards, cards]);

  const handleCardClick = (id: number) => {
    if (!isActive || flippedCards.length >= 2) return;

    const card = cards[id];
    if (card.isFlipped || card.isMatched) return;

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  return (
    <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Memory Match
        </h2>
        <div className="flex justify-center gap-12 text-lg font-mono text-slate-300">
          <div>
            <p className="text-xs text-slate-500 mb-1">Moves</p>
            <p className="text-xl font-semibold text-white">{moves}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Matches</p>
            <p className="text-xl font-semibold text-white">{matches}/{symbols.length}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Glitches</p>
            <p className="text-xl font-semibold text-red-400">{glitches}</p>
          </div>
        </div>
      </div>

      {!isActive ? (
        <>
          {matches === symbols.length ? (
            <div className="text-center py-8">
              <p className="text-2xl font-semibold text-white mb-4">
                Complete
              </p>
              <p className="text-lg text-slate-300">
                Finished in {moves} moves
              </p>
            </div>
          ) : (
            <button onClick={initGame} className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all">
              Start Game
            </button>
          )}
        </>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div key={card.id} onClick={() => handleCardClick(card.id)} className={`aspect-square flex items-center justify-center text-2xl font-semibold rounded-lg cursor-pointer transition-all ${card.isFlipped || card.isMatched ? "bg-blue-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-400"} ${card.isMatched ? "opacity-50" : ""}`}>
              {card.isFlipped || card.isMatched ? card.symbol : "?"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
