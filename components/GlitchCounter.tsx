"use client";

import { useState, useEffect, useRef } from "react";

interface GlitchCounterProps {
  initialValue: string;
  label: string;
}

export default function GlitchCounter({ initialValue, label }: GlitchCounterProps) {
  const [counter, setCounter] = useState(0);
  const [hasExploded, setHasExploded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const errorMessages = [
    "MEMORY LEAK",
    "DATA CORRUPTED",
    "OVERFLOW ERROR",
    "STACK OVERFLOW",
    "SEGMENTATION FAULT",
    "NULL POINTER",
    "BUFFER OVERFLOW",
    "CRITICAL ERROR"
  ];

  const [errorMessage] = useState(
    errorMessages[Math.floor(Math.random() * errorMessages.length)]
  );

  const startAnimation = () => {
    if (isAnimating || hasExploded) return;

    setIsAnimating(true);
    let speed = 100;
    let value = 0;

    intervalRef.current = setInterval(() => {
      value += Math.floor(Math.random() * 500) + 10;
      setCounter(value);

      if (value > 500) {
        speed = 50;
      }
      if (value > 1000) {
        speed = 20;
      }
      if (value > 2000) {
        speed = 10;
      }

      if (value >= 3000) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setHasExploded(true);
        setIsAnimating(false);
      }
    }, speed);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCounter(0);
    setHasExploded(false);
    setIsAnimating(false);
  };

  return (
    <div
      className="text-center cursor-pointer select-none"
      onMouseEnter={startAnimation}
      onClick={reset}
    >
      <div className={`text-3xl md:text-4xl font-bold mb-2 transition-all duration-200 ${
        hasExploded
          ? 'text-red-500 animate-pulse scale-110'
          : isAnimating
            ? 'text-yellow-400 animate-pulse'
            : 'text-white'
      }`}>
        {hasExploded ? (
          <span className="text-2xl font-mono tracking-wider glitch-text">
            {errorMessage}
          </span>
        ) : isAnimating ? (
          counter.toLocaleString()
        ) : (
          initialValue
        )}
      </div>
      <div className={`text-sm transition-colors duration-200 ${
        hasExploded ? 'text-red-400' : 'text-slate-400'
      }`}>
        {hasExploded ? '⚠️ SYSTEM FAILURE, CLICK TO RESET' : label}
      </div>

      <style jsx>{`
        @keyframes glitch-text {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(2px, -2px);
          }
          60% {
            transform: translate(-2px, -2px);
          }
          80% {
            transform: translate(2px, 2px);
          }
        }

        .glitch-text {
          animation: glitch-text 0.3s infinite;
        }
      `}</style>
    </div>
  );
}
