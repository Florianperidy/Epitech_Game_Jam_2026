import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import GlitchCounter from "@/components/GlitchCounter";
import './globals.css'

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="min-h-screen bg-slate-950">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-40">
              <Link href="/" className="flex items-center relative">
                <Image
                  src="/logo-crashledger.png"
                  alt="CrashLedger Logo"
                  width={200}
                  height={60}
                  className="w-auto glitch-logo"
                />
                <Image
                  src="/logo-crashledger-glitch.png"
                  alt="CrashLedger Logo Glitch"
                  width={200}
                  height={60}
                  className="w-auto absolute top-0 left-0 glitch-overlay opacity-0"
                />
              </Link>

              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/"
                  className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Cryptos
                </Link>

                {isLoggedIn ? (
                  <Link
                    href="/"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Page Admin
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Se connecter
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="absolute inset-0">
          <Image
            src="/home_background.jpeg"
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-slate-950/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950"></div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Analysez les marchés
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              comme un professionnel
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Outils de graphiques avancés, données en temps réel et analyses pour prendre les meilleures décisions de trading
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isLoggedIn && (
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/50 hover:shadow-blue-600/70 hover:scale-105"
              >
                Commencer gratuitement
              </Link>
            )}
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <GlitchCounter initialValue="50M+" label="Utilisateurs" />
            <GlitchCounter initialValue="100+" label="Marchés" />
            <GlitchCounter initialValue="24/7" label="Support" />
            <GlitchCounter initialValue="Real-time" label="Données" />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-slate-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Tout ce dont vous avez besoin pour trader
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Graphiques professionnels",
                description: "Des outils de dessin avancés et plus de 100 indicateurs techniques",
                icon: "📊",
                buttonText: "Découvrir les graphiques",
                buttonLink: "/info/graphics",
              },
              {
                title: "Données en temps réel",
                description: "Accédez aux cotations en direct de tous les marchés mondiaux",
                icon: "⚡",
                buttonText: "Voir les données",
                buttonLink: "/info/data",
              },
              {
                title: "Alertes personnalisées",
                description: "Recevez des notifications pour ne manquer aucune opportunité",
                icon: "🔔",
                buttonText: "Configurer les alertes",
                buttonLink: "/info/newsletter",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 mb-4">{feature.description}</p>
                <Link
                  href={feature.buttonLink}
                  className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/50 hover:shadow-blue-600/70"
                >
                  {feature.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
