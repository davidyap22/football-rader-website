'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
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
];

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    leagues: "Leagues",
    leaguesSubtitle: "Explore predictions across all major football leagues worldwide",
    comingSoon: "Coming Soon",
    comingSoonDesc: "We're working on bringing you comprehensive league coverage",
    home: "Home",
    predictions: "Predictions",
    performance: "AI Performance",
    community: "Community",
    news: "News",
    pricing: "Pricing",
    login: "Log In",
    getStarted: "Get Started",
    footer: "18+ | Gambling involves risk. Please gamble responsibly.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
  },
  ES: {
    leagues: "Ligas",
    leaguesSubtitle: "Explora predicciones de todas las principales ligas de fútbol del mundo",
    comingSoon: "Próximamente",
    comingSoonDesc: "Estamos trabajando para ofrecerte cobertura completa de ligas",
    home: "Inicio",
    predictions: "Predicciones",
    performance: "Análisis",
    community: "Comunidad",
    news: "Noticias",
    pricing: "Precios",
    login: "Iniciar Sesión",
    getStarted: "Comenzar",
    footer: "18+ | El juego implica riesgo. Por favor juega responsablemente.",
    allRights: "© 2025 OddsFlow. Todos los derechos reservados.",
  },
  PT: {
    leagues: "Ligas",
    leaguesSubtitle: "Explore previsões das principais ligas de futebol do mundo",
    comingSoon: "Em Breve",
    comingSoonDesc: "Estamos trabalhando para trazer cobertura completa das ligas",
    home: "Início",
    predictions: "Previsões",
    performance: "Análise",
    community: "Comunidade",
    news: "Notícias",
    pricing: "Preços",
    login: "Entrar",
    getStarted: "Começar",
    footer: "18+ | O jogo envolve risco. Por favor, jogue com responsabilidade.",
    allRights: "© 2025 OddsFlow. Todos os direitos reservados.",
  },
  DE: {
    leagues: "Ligen",
    leaguesSubtitle: "Erkunden Sie Vorhersagen für alle großen Fußballligen weltweit",
    comingSoon: "Demnächst",
    comingSoonDesc: "Wir arbeiten daran, Ihnen umfassende Liga-Abdeckung zu bieten",
    home: "Startseite",
    predictions: "Vorhersagen",
    performance: "Analyse",
    community: "Community",
    news: "Nachrichten",
    pricing: "Preise",
    login: "Anmelden",
    getStarted: "Loslegen",
    footer: "18+ | Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    allRights: "© 2025 OddsFlow. Alle Rechte vorbehalten.",
  },
  FR: {
    leagues: "Ligues",
    leaguesSubtitle: "Explorez les prédictions de toutes les grandes ligues de football",
    comingSoon: "Bientôt Disponible",
    comingSoonDesc: "Nous travaillons pour vous offrir une couverture complète des ligues",
    home: "Accueil",
    predictions: "Prédictions",
    performance: "Analyse",
    community: "Communauté",
    news: "Actualités",
    pricing: "Tarifs",
    login: "Connexion",
    getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez de manière responsable.",
    allRights: "© 2025 OddsFlow. Tous droits réservés.",
  },
  JA: {
    leagues: "リーグ",
    leaguesSubtitle: "世界の主要サッカーリーグの予測を探索",
    comingSoon: "近日公開",
    comingSoonDesc: "包括的なリーグカバレッジを準備中です",
    home: "ホーム",
    predictions: "予測",
    performance: "分析",
    community: "コミュニティ",
    news: "ニュース",
    pricing: "料金",
    login: "ログイン",
    getStarted: "始める",
    footer: "18+ | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2025 OddsFlow. All rights reserved.",
  },
  KO: {
    leagues: "리그",
    leaguesSubtitle: "전 세계 주요 축구 리그의 예측을 탐색하세요",
    comingSoon: "곧 출시 예정",
    comingSoonDesc: "포괄적인 리그 커버리지를 준비하고 있습니다",
    home: "홈",
    predictions: "예측",
    performance: "분석",
    community: "커뮤니티",
    news: "뉴스",
    pricing: "가격",
    login: "로그인",
    getStarted: "시작하기",
    footer: "18+ | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
  },
  '中文': {
    leagues: "联赛",
    leaguesSubtitle: "探索全球主要足球联赛的预测",
    comingSoon: "即将推出",
    comingSoonDesc: "我们正在努力为您提供全面的联赛覆盖",
    home: "首页",
    predictions: "预测",
    performance: "分析",
    community: "社区",
    news: "新闻",
    pricing: "价格",
    login: "登录",
    getStarted: "开始使用",
    footer: "18+ | 赌博有风险，请理性参与。",
    allRights: "© 2025 OddsFlow. 保留所有权利。",
  },
  '繁體': {
    leagues: "聯賽",
    leaguesSubtitle: "探索全球主要足球聯賽的預測",
    comingSoon: "即將推出",
    comingSoonDesc: "我們正在努力為您提供全面的聯賽覆蓋",
    home: "首頁",
    predictions: "預測",
    performance: "分析",
    community: "社區",
    news: "新聞",
    pricing: "價格",
    login: "登入",
    getStarted: "開始使用",
    footer: "18+ | 賭博有風險，請理性參與。",
    allRights: "© 2025 OddsFlow. 保留所有權利。",
  },
};

export default function LeaguesPage() {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  // Check auth session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) {
      setSelectedLang(savedLang);
    }
  }, []);

  // Save language to localStorage when changed
  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('oddsflow_lang', langCode);
    setLangDropdownOpen(false);
  };

  // Translation helper
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('home')}</Link>
              <Link href="/predictions" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('predictions')}</Link>
              <Link href="/leagues" className="text-emerald-400 text-sm font-medium">{t('leagues')}</Link>
              <Link href="/performance" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('performance')}</Link>
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
              <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('news')}</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer"
                >
                  <span>{currentLang.flag}</span>
                  <span className="font-medium">{currentLang.code}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {langDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => handleLanguageChange(l.code)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${
                            selectedLang === l.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'
                          }`}
                        >
                          <span className="text-lg">{l.flag}</span>
                          <span className="font-medium">{l.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {user ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer hidden sm:block">{t('getStarted')}</Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
              {[
                { href: '/', label: t('home') },
                { href: '/predictions', label: t('predictions') },
                { href: '/leagues', label: t('leagues'), active: true },
                { href: '/performance', label: t('performance') },
                { href: '/community', label: t('community') },
                { href: '/news', label: t('news') },
                { href: '/pricing', label: t('pricing') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    link.active
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all">
                    {t('login')}
                  </Link>
                  <Link href="/get-started" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold hover:shadow-lg transition-all">
                    {t('getStarted')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t('leagues')}
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('leaguesSubtitle')}
            </p>
          </div>

          {/* League Cards with SEO descriptions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Premier League */}
            <Link href="/predictions" className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                  <img src="https://media.api-sports.io/football/leagues/39.png" alt="Premier League" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Premier League</h3>
                  <p className="text-sm text-emerald-400">England</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">EPL top 5 betting predictions with our Premier League AI predictor. Get Premier League 1x2 predictions today, over 2.5 goals stats, and English Premier League draw predictions.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">1x2 Predictions</span>
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">Over/Under</span>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Handicap</span>
              </div>
            </Link>

            {/* Bundesliga */}
            <Link href="/predictions" className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                  <img src="https://media.api-sports.io/football/leagues/78.png" alt="Bundesliga" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Bundesliga</h3>
                  <p className="text-sm text-emerald-400">Germany</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">Bundesliga AI betting predictions powered by advanced machine learning. Get Bundesliga top 5 betting predictions with verified AI betting records.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">AI Analysis</span>
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">Over 2.5 Goals</span>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">BTTS</span>
              </div>
            </Link>

            {/* Serie A */}
            <Link href="/predictions" className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                  <img src="https://media.api-sports.io/football/leagues/135.png" alt="Serie A" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Serie A</h3>
                  <p className="text-sm text-emerald-400">Italy</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">Serie A artificial intelligence picks with the most accurate AI football predictor. Get Serie A top 5 betting predictions and transparent AI betting results.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">AI Picks</span>
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">Match Odds</span>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Draw Predictions</span>
              </div>
            </Link>

            {/* La Liga */}
            <Link href="/predictions" className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                  <img src="https://media.api-sports.io/football/leagues/140.png" alt="La Liga" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">La Liga</h3>
                  <p className="text-sm text-emerald-400">Spain</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">La Liga top 5 betting predictions with European football AI tips. Best AI for handicap betting on Spanish football matches.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Handicap Tips</span>
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">1x2 Analysis</span>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Goals Market</span>
              </div>
            </Link>

            {/* Ligue 1 */}
            <Link href="/predictions" className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                  <img src="https://media.api-sports.io/football/leagues/61.png" alt="Ligue 1" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Ligue 1</h3>
                  <p className="text-sm text-emerald-400">France</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">Ligue 1 AI prediction model with verified betting records. Get Ligue 1 top 5 betting predictions and safest AI football tips.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">AI Model</span>
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">Safe Tips</span>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Value Bets</span>
              </div>
            </Link>

            {/* Champions League */}
            <Link href="/predictions" className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                  <img src="https://media.api-sports.io/football/leagues/2.png" alt="Champions League" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Champions League</h3>
                  <p className="text-sm text-emerald-400">UEFA</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-3">Champions League betting analysis AI with transparent AI betting sites. Get UCL predictions from the most accurate AI football predictor.</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">UCL Analysis</span>
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">Match Preview</span>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Odds Comparison</span>
              </div>
            </Link>
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">European Football AI Tips</h2>
            <p className="text-gray-400 mb-4">
              OddsFlow provides the most accurate AI football predictor for all major European leagues. Our transparent AI betting platform offers verified AI betting records for Premier League, Bundesliga, Serie A, La Liga, Ligue 1, and Champions League.
            </p>
            <p className="text-gray-400 mb-4">
              Whether you&apos;re looking for Premier League 1x2 predictions today, Bundesliga AI betting predictions, or Serie A artificial intelligence picks, our platform delivers data-driven insights powered by advanced machine learning algorithms.
            </p>
            <p className="text-gray-400">
              Our best AI for handicap betting analyzes handicap draw predictions, over 2.5 goals stats, and provides comprehensive match analysis. Experience the safest AI football tips with our transparent AI betting results.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>{t('footer')}</p>
        <p className="mt-2">{t('allRights')}</p>
      </footer>
    </div>
  );
}
