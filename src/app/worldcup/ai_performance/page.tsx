'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import WorldCupFooter from '@/components/WorldCupFooter';
import { User } from '@supabase/supabase-js';

// Language options
const LANGUAGES = [
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'PT', name: 'Português', flag: '🇧🇷' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'JA', name: '日本語', flag: '🇯🇵' },
  { code: 'KO', name: '한국어', flag: '🇰🇷' },
  { code: '中文', name: '简体中文', flag: '🇨🇳' },
  { code: '繁體', name: '繁體中文', flag: '🇭🇰' },
  { code: 'ID', name: 'Bahasa Indonesia', flag: '🇮🇩' },
];

const translations: Record<string, Record<string, string>> = {
  EN: {
    title: "World Cup AI Performance",
    comingSoon: "Coming Soon",
    description: "AI prediction accuracy and performance statistics for FIFA World Cup 2026 will be available here.",
    home: "Home",
    predictions: "Predictions",
    leagues: "Leagues",
    performance: "AI Performance",
    pricing: "Pricing",
    login: "Log In",
    getStarted: "Get Started",
    backToWorldCup: "Back to World Cup",
  },
  '中文': {
    title: "世界杯AI表现",
    comingSoon: "即将推出",
    description: "FIFA世界杯2026的AI预测准确率和表现统计即将在此提供。",
    home: "首页",
    predictions: "预测",
    leagues: "联赛",
    performance: "AI表现",
    pricing: "价格",
    login: "登录",
    getStarted: "开始使用",
    backToWorldCup: "返回世界杯",
  },
  '繁體': {
    title: "世界盃AI表現",
    comingSoon: "即將推出",
    description: "FIFA世界盃2026的AI預測準確率和表現統計即將在此提供。",
    home: "首頁",
    predictions: "預測",
    leagues: "聯賽",
    performance: "AI表現",
    pricing: "價格",
    login: "登入",
    getStarted: "開始使用",
    backToWorldCup: "返回世界盃",
  },
  ID: {
    title: "Performa AI Piala Dunia",
    comingSoon: "Segera Hadir",
    description: "Akurasi prediksi AI dan statistik performa untuk Piala Dunia FIFA 2026 akan tersedia di sini.",
    home: "Beranda",
    predictions: "Prediksi",
    leagues: "Liga",
    performance: "Performa AI",
    pricing: "Harga",
    login: "Masuk",
    getStarted: "Mulai",
    backToWorldCup: "Kembali ke Piala Dunia",
  },
};

export default function WorldCupAIPerformancePage() {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [fifaDropdownOpen, setFifaDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  const t = (key: string): string => {
    return translations[selectedLang]?.[key] || translations['EN']?.[key] || key;
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) {
      setSelectedLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('oddsflow_lang', langCode);
    setLangDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0f] to-[#1a1a2e]" />
      </div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/worldcup" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('home')}</Link>
              <Link href="/worldcup/predictions" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('predictions')}</Link>
              <Link href="/worldcup/leagues" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('leagues')}</Link>
              <Link href="/worldcup/ai_performance" className="text-amber-400 text-sm font-medium">{t('performance')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer"
                >
                  <span>{currentLang.flag}</span>
                  <span className="font-medium">{currentLang.code}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors ${selectedLang === lang.code ? 'bg-amber-500/10 text-amber-400' : 'text-gray-300'}`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User/Login */}
              {user ? (
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-black font-bold text-sm">
                    {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer hidden sm:block">{t('getStarted')}</Link>
                </>
              )}

              {/* FIFA 2026 Dropdown Button */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setFifaDropdownOpen(!fifaDropdownOpen)}
                  className="relative flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all cursor-pointer group overflow-hidden hover:scale-105"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                  <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-5 w-auto object-contain relative z-10" />
                  <span className="text-black font-semibold text-sm relative z-10">FIFA 2026</span>
                  <svg className={`w-4 h-4 text-black relative z-10 transition-transform ${fifaDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {fifaDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 rounded-xl shadow-xl shadow-amber-500/20 overflow-hidden z-50">
                    <Link href="/" onClick={() => setFifaDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors border-b border-white/10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">Back to OddsFlow</span>
                    </Link>
                    <Link href="/worldcup/predictions" onClick={() => setFifaDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="font-medium">{t('predictions')}</span>
                    </Link>
                    <Link href="/worldcup/leagues" onClick={() => setFifaDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="font-medium">{t('leagues')}</span>
                    </Link>
                    <Link href="/worldcup/ai_performance" onClick={() => setFifaDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-amber-400 bg-amber-500/10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="font-medium">{t('performance')}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16"></div>

      {/* Header */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <Link href="/worldcup" className="inline-flex items-center gap-2 text-amber-400 hover:text-white transition-colors mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToWorldCup')}
        </Link>
      </div>

      {/* Main Content - Coming Soon */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-20">
        <div className="text-center max-w-lg">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center">
            <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            {t('comingSoon')}
          </h1>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            {t('title')}
          </h2>

          <p className="text-gray-400 text-lg mb-8">
            {t('description')}
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/worldcup"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              {t('backToWorldCup')}
            </Link>
            <Link
              href="/worldcup/predictions"
              className="px-6 py-3 rounded-xl border border-amber-500/30 text-amber-400 font-semibold hover:bg-amber-500/10 transition-all"
            >
              {t('predictions')}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <WorldCupFooter lang={selectedLang} />
    </div>
  );
}
