'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NewsletterPage() {
  const [showPopup, setShowPopup] = useState(false)
  const [confirmLevel, setConfirmLevel] = useState(0)

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setShowPopup(true)
      setConfirmLevel(0)
    }, 5000)

    return () => clearTimeout(initialTimeout)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showPopup) {
        setShowPopup(true)
        setConfirmLevel(0)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [showPopup])

  const handleClose = () => {
    if (confirmLevel === 0) {
      setConfirmLevel(1)
    } else if (confirmLevel === 1) {
      setConfirmLevel(2)
    } else {
      setShowPopup(false)
      setConfirmLevel(0)
    }
  }

  const handleSubscribe = () => {
    alert("Merci pour votre inscription !")
    setShowPopup(false)
    setConfirmLevel(0)
  }

  return (
    <main className="min-h-screen bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-5xl font-bold text-white mb-6">
          Newsletter CrashLedger
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-slate-300 mb-8">
            Restez informé des dernières tendances du marché et ne manquez plus aucune opportunité !
          </p>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Pourquoi s'abonner ?
            </h2>
            <ul className="text-slate-300 space-y-3">
              <li>✨ Analyses quotidiennes des marchés crypto</li>
              <li>📈 Alertes en temps réel sur les mouvements importants</li>
              <li>💡 Conseils d'experts pour optimiser vos investissements</li>
              <li>🎯 Signaux de trading exclusifs</li>
              <li>📊 Rapports hebdomadaires détaillés</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8 mb-8">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Ce que vous recevrez
            </h2>
            <p className="text-slate-300 mb-4">
              Notre newsletter premium vous donne accès à du contenu exclusif réservé à nos membres les plus fidèles. *
              Chaque jour, découvrez les analyses de nos experts et anticipez les mouvements du marché.
            </p>
            <p className="text-slate-300 mb-4">
              Rejoignez plus de 50 000 traders qui nous font confiance pour prendre les meilleures décisions d'investissement.
            </p>
            <p className="text-slate-300">
              L'inscription est 100% gratuite et vous pouvez vous désabonner à tout moment.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Offre spéciale : Abonnement gratuit à vie !
            </h3>
            <p className="text-white/90 mb-6">
              Inscrivez-vous maintenant et recevez un bonus exclusif de bienvenue
            </p>
            <button
              onClick={handleSubscribe}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Je m'inscris maintenant
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border-2 border-blue-500 p-8 max-w-md w-full shadow-2xl animate-bounce">
            {confirmLevel === 0 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-4">
                  🎉 Offre exceptionnelle !
                </h3>
                <p className="text-slate-300 mb-6">
                  Ne manquez pas cette opportunité unique ! Abonnez-vous maintenant à notre newsletter et recevez des alertes exclusives !
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleSubscribe}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Oui, je m'inscris !
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}

            {confirmLevel === 1 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-4">
                  ⚠️ Êtes-vous sûr ?
                </h3>
                <p className="text-slate-300 mb-6">
                  Vous allez vraiment refuser cette offre ?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleSubscribe}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Non, je m'inscris !
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Oui, je suis sûr
                  </button>
                </div>
              </>
            )}

            {confirmLevel === 2 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-4">
                  😱 Êtes-vous SÛR-SÛR ??
                </h3>
                <p className="text-slate-300 mb-6">
                  Vraiment vraiment sûr ? Cette opportunité ne reviendra peut-être jamais !
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleSubscribe}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 animate-pulse"
                  >
                    OK j'ai compris, je m'inscris !
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Oui, absolument certain
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
