'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface DataPoint {
  id: string
  symbol: string
  price: number
  change: number
  volume: string
  timestamp: number
}

export default function DonneesPage() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const cryptoSymbols = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'MATIC', 'LINK', 'UNI']

  const generateDataPoint = (): DataPoint => {
    const symbol = cryptoSymbols[Math.floor(Math.random() * cryptoSymbols.length)]
    return {
      id: `${Date.now()}-${Math.random()}`,
      symbol,
      price: Math.random() * 50000 + 1000,
      change: (Math.random() - 0.5) * 20,
      volume: `${(Math.random() * 1000).toFixed(2)}M`,
      timestamp: Date.now(),
    }
  }

  useEffect(() => {
    if (dataPoints.length >= 50 && !isOverflowing) {
      setIsOverflowing(true)
    }
  }, [dataPoints.length, isOverflowing])

  useEffect(() => {
    if (!isOverflowing) return

    const interval = setInterval(() => {
      const numberOfPoints = Math.floor(Math.random() * 6) + 5
      const newPoints = Array.from({ length: numberOfPoints }, () => generateDataPoint())

      setDataPoints(prev => [...prev, ...newPoints])
    }, 300)

    return () => clearInterval(interval)
  }, [isOverflowing])

  const handleApiRequest = () => {
    setIsLoading(true)

    setTimeout(() => {
      const numberOfPoints = Math.floor(Math.random() * 11) + 10
      const newPoints = Array.from({ length: numberOfPoints }, () => generateDataPoint())

      setDataPoints(prev => [...prev, ...newPoints])
      setIsLoading(false)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-5xl font-bold text-white mb-6">
          Données en Temps Réel
        </h1>

        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-xl text-slate-300 mb-8">
            Accédez aux cotations en direct de tous les marchés crypto mondiaux avec une latence ultra-faible.
          </p>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Des données fiables et précises
            </h2>
            <ul className="text-slate-300 space-y-3">
              <li>⚡ Mises à jour en temps réel (latence &lt; 100ms)</li>
              <li>🌍 Données provenant de plus de 50 exchanges</li>
              <li>📊 Historique complet sur 10 ans</li>
              <li>🔒 API sécurisée avec authentification</li>
              <li>💾 Stockage illimité de vos données personnelles</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Flux de données en direct
            </h2>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-slate-700 rounded-lg">
                <span className="text-slate-400 text-sm">Points de données: </span>
                <span className={`font-bold ${isOverflowing ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {dataPoints.length}
                </span>
              </div>
              {isOverflowing && (
                <div className="px-4 py-2 bg-red-900/50 border border-red-500 rounded-lg animate-pulse">
                  <span className="text-red-300 text-sm font-bold">FLUX INCONTRÔLÉ</span>
                </div>
              )}
            </div>
          </div>

          {dataPoints.length >= 40 && !isOverflowing && (
            <div className="mb-4 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg animate-pulse">
              <p className="text-yellow-200 text-sm">
                Attention: Approche du seuil critique ({dataPoints.length}/50 points).
                Le système pourrait devenir instable.
              </p>
            </div>
          )}

          <div
            ref={containerRef}
            className={`relative w-full bg-slate-900 rounded-lg border ${
              isOverflowing ? 'border-red-500 animate-pulse' : 'border-slate-600'
            } p-4 transition-all duration-300 mb-6`}
            style={{
              height: isOverflowing ? '600px' : '400px',
              overflow: isOverflowing ? 'visible' : 'hidden',
            }}
          >
            {dataPoints.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-500 text-lg">
                  Aucune donnée. Cliquez sur le bouton ci-dessous pour charger des données depuis l'API.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {dataPoints.map((point, index) => {
                  const isRecent = index >= dataPoints.length - 20
                  const shouldOverflow = isOverflowing && index >= dataPoints.length - 100

                  return (
                    <div
                      key={point.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        isRecent ? 'bg-blue-900/50 border border-blue-500' : 'bg-slate-800/50'
                      }`}
                      style={{
                        position: shouldOverflow ? 'absolute' : 'relative',
                        left: shouldOverflow ? `${Math.random() * 150 - 25}%` : 'auto',
                        top: shouldOverflow ? `${Math.random() * 300 + index * 2}%` : 'auto',
                        transform: shouldOverflow ? `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})` : 'none',
                        animation: shouldOverflow ? `float ${1 + Math.random() * 2}s infinite` : 'none',
                        zIndex: shouldOverflow ? 1000 + index : 'auto',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-white font-bold text-lg">{point.symbol}</span>
                        <span className="text-slate-300 font-mono">
                          ${point.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-semibold ${
                            point.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {point.change >= 0 ? '+' : ''}{point.change.toFixed(2)}%
                        </span>
                        <span className="text-slate-400 text-sm">{point.volume}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {isOverflowing && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[2000]">
                <div className="bg-red-900/95 px-8 py-6 rounded-lg border-4 border-red-500 animate-bounce shadow-2xl">
                  <p className="text-white text-3xl font-bold mb-2">!! OVERFLOW ERROR !!</p>
                  <p className="text-red-200 text-lg">Sorti de l'espace mémoire dédié</p>
                  <p className="text-red-300 text-sm mt-2">
                    {dataPoints.length} bytes en dehors de l'espace mémoire
                  </p>
                  <p className="text-red-400 text-xs mt-2 animate-pulse">
                    !! Risque de sur-écriture !!
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={handleApiRequest}
              disabled={isLoading || isOverflowing}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Chargement...
                </span>
              ) : isOverflowing ? (
                'API surchargée'
              ) : (
                'Requête à l\'API'
              )}
            </button>
          </div>

          {isOverflowing && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-600 rounded-lg">
              <p className="text-red-200">
                <strong>Erreur critique:</strong> Impossible de contenir le flux de données.
                Rechargez la page pour restaurer le fonctionnement normal.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Besoin de plus de données ?
          </h3>
          <p className="text-white/90 mb-6">
            Accédez à notre API premium pour des données encore plus complètes et des analyses avancées
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Découvrir l'API
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm italic">
            * Les performances peuvent varier selon la capacité de votre navigateur à gérer des flux de données massifs.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </main>
  )
}
