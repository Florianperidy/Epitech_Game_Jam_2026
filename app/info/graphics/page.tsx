'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FallingElement {
  id: string
  left: number
  top: number
  rotation: number
  velocityY: number
  velocityX: number
  element: 'candle' | 'line' | 'axis' | 'label' | 'button'
  color?: string
}

export default function GraphiquesPage() {
  const [isBroken, setIsBroken] = useState(false)
  const [fallingElements, setFallingElements] = useState<FallingElement[]>([])

  const breakChart = () => {
    if (isBroken) return

    setIsBroken(true)

    const elements: FallingElement[] = [
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `candle-${i}`,
        left: 10 + (i * 4),
        top: 20 + Math.random() * 40,
        rotation: 0,
        velocityY: 0,
        velocityX: (Math.random() - 0.5) * 2,
        element: 'candle' as const,
        color: Math.random() > 0.5 ? 'bg-green-500' : 'bg-red-500',
      })),
      {
        id: 'line',
        left: 10,
        top: 30,
        rotation: 0,
        velocityY: 0,
        velocityX: 0,
        element: 'line' as const,
      },
      {
        id: 'axis-x',
        left: 10,
        top: 70,
        rotation: 0,
        velocityY: 0,
        velocityX: 1,
        element: 'axis' as const,
      },
      {
        id: 'axis-y',
        left: 5,
        top: 10,
        rotation: 0,
        velocityY: 0,
        velocityX: -1,
        element: 'axis' as const,
      },
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `label-${i}`,
        left: 15 + (i * 15),
        top: 75,
        rotation: 0,
        velocityY: 0,
        velocityX: (Math.random() - 0.5) * 3,
        element: 'label' as const,
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `button-${i}`,
        left: 10 + (i * 20),
        top: 5,
        rotation: 0,
        velocityY: 0,
        velocityX: (Math.random() - 0.5) * 2,
        element: 'button' as const,
      })),
    ]

    setFallingElements(elements)
  }

  useEffect(() => {
    if (!isBroken) return

    const gravity = 0.5
    const bounce = 0.6
    const friction = 0.98

    const interval = setInterval(() => {
      setFallingElements(prev =>
        prev.map(el => {
          let newTop = el.top + el.velocityY
          let newLeft = el.left + el.velocityX
          let newVelocityY = el.velocityY + gravity
          let newVelocityX = el.velocityX * friction
          let newRotation = el.rotation + el.velocityX * 2

          if (newTop > 85) {
            newTop = 85
            newVelocityY = -newVelocityY * bounce
            newVelocityX = newVelocityX * friction
          }

          if (newLeft < 0) {
            newLeft = 0
            newVelocityX = -newVelocityX * bounce
          }
          if (newLeft > 95) {
            newLeft = 95
            newVelocityX = -newVelocityX * bounce
          }

          return {
            ...el,
            top: newTop,
            left: newLeft,
            velocityY: newVelocityY,
            velocityX: newVelocityX,
            rotation: newRotation,
          }
        })
      )
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [isBroken])

  const renderFallingElement = (el: FallingElement) => {
    const style = {
      position: 'absolute' as const,
      left: `${el.left}%`,
      top: `${el.top}%`,
      transform: `rotate(${el.rotation}deg)`,
      transition: 'none',
    }

    switch (el.element) {
      case 'candle':
        return (
          <div
            key={el.id}
            style={style}
            className={`w-3 h-12 ${el.color} rounded-sm shadow-lg`}
          />
        )
      case 'line':
        return (
          <div
            key={el.id}
            style={style}
            className="w-[80%] h-1 bg-blue-500 shadow-lg"
          />
        )
      case 'axis':
        return (
          <div
            key={el.id}
            style={style}
            className="w-1 h-[60%] bg-slate-400 shadow-lg"
          />
        )
      case 'label':
        return (
          <div
            key={el.id}
            style={style}
            className="px-2 py-1 bg-slate-700 text-white text-xs rounded shadow-lg whitespace-nowrap"
          >
            {Math.floor(Math.random() * 10000)}
          </div>
        )
      case 'button':
        return (
          <div
            key={el.id}
            style={style}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded shadow-lg"
          >
            📊
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-5xl font-bold text-white mb-6">
          Graphiques Professionnels
        </h1>

        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-xl text-slate-300 mb-8">
            Découvrez nos outils de graphiques avancés avec plus de 100 indicateurs techniques pour analyser les marchés comme un pro.
          </p>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Des outils puissants à portée de main
            </h2>
            <ul className="text-slate-300 space-y-3">
              <li>📈 Chandelier japonais (Candlestick) avec analyse avancée</li>
              <li>📊 Indicateurs techniques : RSI, MACD, Bollinger Bands...</li>
              <li>✏️ Outils de dessin : lignes de tendance, support/résistance</li>
              <li>⏱️ Multi-timeframes : de 1 minute à 1 mois</li>
              <li>🎨 Interface personnalisable et intuitive</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Essayez notre graphique interactif (réalisé par nos soins)
          </h2>

          <div
            className="relative w-full h-[500px] bg-slate-900 rounded-lg border border-slate-600 overflow-hidden cursor-pointer"
            onClick={breakChart}
          >
            {!isBroken ? (
              <>
                <div className="absolute top-4 left-4 flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">📊</button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">📈</button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">✏️</button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">⚙️</button>
                </div>

                <div className="absolute left-4 top-16 bottom-16 w-0.5 bg-slate-400" />

                <div className="absolute bottom-16 left-16 right-4 h-0.5 bg-slate-400" />

                <div className="absolute left-16 top-16 right-16 bottom-20 flex items-end justify-around">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const isGreen = Math.random() > 0.5
                    const height = 20 + Math.random() * 60
                    return (
                      <div
                        key={i}
                        className={`w-3 ${isGreen ? 'bg-green-500' : 'bg-red-500'} rounded-sm`}
                        style={{ height: `${height}%` }}
                      />
                    )
                  })}
                </div>

                <svg className="absolute inset-0 pointer-events-none">
                  <line
                    x1="15%"
                    y1="60%"
                    x2="90%"
                    y2="30%"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>

                <div className="absolute bottom-12 left-16 right-16 flex justify-between text-xs text-slate-400">
                  <span>9:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>21:00</span>
                </div>

                <div className="absolute left-8 top-16 bottom-20 flex flex-col justify-between text-xs text-slate-400">
                  <span>$50k</span>
                  <span>$45k</span>
                  <span>$40k</span>
                  <span>$35k</span>
                  <span>$30k</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-800/90 px-6 py-3 rounded-lg border border-blue-500">
                    <p className="text-white text-sm">
                      Survolez ou cliquez pour interagir avec le graphique
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {fallingElements.map(renderFallingElement)}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-50">
                  <div className="bg-red-900/90 px-8 py-6 rounded-lg border-2 border-red-500 animate-pulse">
                    <p className="text-white text-2xl font-bold mb-2">ERREUR CRITIQUE</p>
                    <p className="text-red-200">Le graphique a rencontré une erreur gravitationnelle</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {isBroken && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsBroken(false)
                  setFallingElements([])
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                🔄 Réinitialiser le graphique
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm italic">
            * Les résultats peuvent varier. La gravité n'est pas incluse dans l'abonnement standard.
          </p>
        </div>
      </div>
    </main>
  )
}
