'use client';

import Link from 'next/link';

export default function LeaguesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/homepage/logo-removebg-preview.png" alt="OddsFlow Logo" className="w-11 h-11 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Home</Link>
              <Link href="/predictions" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Predictions</Link>
              <Link href="/leagues" className="text-emerald-400 text-sm font-medium">Leagues</Link>
              <Link href="/analysis" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Analysis</Link>
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Community</Link>
              <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">News</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm cursor-pointer">
                  <span className="text-base">🇬🇧</span>
                  <span className="text-white font-medium">EN</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">Log In</Link>
              <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Leagues
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore predictions across all major football leagues worldwide
            </p>
          </div>

          {/* Coming Soon */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Coming Soon</h2>
            <p className="text-gray-500">We're working on bringing you comprehensive league coverage</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>18+ | Gambling involves risk. Please gamble responsibly.</p>
        <p className="mt-2">© 2025 OddsFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
