'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, FootballNews } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

const ITEMS_PER_PAGE = 21;

// Helper function to format relative time
function getRelativeTime(dateString: string | undefined): string {
  if (!dateString) return '';

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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
    newsTitle: "News & Insights",
    newsSubtitle: "Stay updated with the latest football news, betting insights, and AI predictions",
    noNews: "No news available",
    readOn: "Read on",
    stayInLoop: "Stay in the Loop",
    getLatestNews: "Get the latest news and predictions delivered to your inbox",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    home: "Home",
    predictions: "Predictions",
    leagues: "Leagues",
    performance: "AI Performance",
    community: "Community",
    news: "News",
    pricing: "Pricing",
    login: "Log In",
    getStarted: "Get Started",
    footer: "18+ | Gambling involves risk. Please gamble responsibly.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
    liveUpdates: "LIVE UPDATES",
    featuredStory: "FEATURED",
    latestNews: "LATEST NEWS",
    readMore: "Read Full Article",
  },
  ES: {
    newsTitle: "Noticias e Información",
    newsSubtitle: "Mantente actualizado con las últimas noticias de fútbol, información de apuestas y predicciones de IA",
    noNews: "No hay noticias disponibles",
    readOn: "Leer en",
    stayInLoop: "Mantente Informado",
    getLatestNews: "Recibe las últimas noticias y predicciones en tu correo",
    enterEmail: "Ingresa tu correo",
    subscribe: "Suscribirse",
    home: "Inicio",
    predictions: "Predicciones",
    leagues: "Ligas",
    performance: "Análisis",
    community: "Comunidad",
    news: "Noticias",
    pricing: "Precios",
    login: "Iniciar Sesión",
    getStarted: "Comenzar",
    footer: "18+ | El juego implica riesgo. Por favor juega responsablemente.",
    allRights: "© 2025 OddsFlow. Todos los derechos reservados.",
    liveUpdates: "EN VIVO",
    featuredStory: "DESTACADO",
    latestNews: "ÚLTIMAS NOTICIAS",
    readMore: "Leer Artículo Completo",
  },
  PT: {
    newsTitle: "Notícias e Insights",
    newsSubtitle: "Fique atualizado com as últimas notícias de futebol, insights de apostas e previsões de IA",
    noNews: "Nenhuma notícia disponível",
    readOn: "Ler em",
    stayInLoop: "Fique por Dentro",
    getLatestNews: "Receba as últimas notícias e previsões no seu e-mail",
    enterEmail: "Digite seu e-mail",
    subscribe: "Inscrever-se",
    home: "Início",
    predictions: "Previsões",
    leagues: "Ligas",
    performance: "Análise",
    community: "Comunidade",
    news: "Notícias",
    pricing: "Preços",
    login: "Entrar",
    getStarted: "Começar",
    footer: "18+ | O jogo envolve risco. Por favor, jogue com responsabilidade.",
    allRights: "© 2025 OddsFlow. Todos os direitos reservados.",
    liveUpdates: "AO VIVO",
    featuredStory: "DESTAQUE",
    latestNews: "ÚLTIMAS NOTÍCIAS",
    readMore: "Ler Artigo Completo",
  },
  DE: {
    newsTitle: "Nachrichten & Einblicke",
    newsSubtitle: "Bleiben Sie mit den neuesten Fußballnachrichten, Wett-Einblicken und KI-Vorhersagen auf dem Laufenden",
    noNews: "Keine Nachrichten verfügbar",
    readOn: "Lesen auf",
    stayInLoop: "Bleiben Sie Informiert",
    getLatestNews: "Erhalten Sie die neuesten Nachrichten und Vorhersagen in Ihrem Posteingang",
    enterEmail: "E-Mail eingeben",
    subscribe: "Abonnieren",
    home: "Startseite",
    predictions: "Vorhersagen",
    leagues: "Ligen",
    performance: "Analyse",
    community: "Community",
    news: "Nachrichten",
    pricing: "Preise",
    login: "Anmelden",
    getStarted: "Loslegen",
    footer: "18+ | Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    allRights: "© 2025 OddsFlow. Alle Rechte vorbehalten.",
    liveUpdates: "LIVE",
    featuredStory: "HIGHLIGHT",
    latestNews: "NEUESTE NACHRICHTEN",
    readMore: "Vollständigen Artikel Lesen",
  },
  FR: {
    newsTitle: "Actualités & Analyses",
    newsSubtitle: "Restez informé des dernières actualités football, analyses de paris et prédictions IA",
    noNews: "Aucune actualité disponible",
    readOn: "Lire sur",
    stayInLoop: "Restez Informé",
    getLatestNews: "Recevez les dernières actualités et prédictions dans votre boîte mail",
    enterEmail: "Entrez votre e-mail",
    subscribe: "S'abonner",
    home: "Accueil",
    predictions: "Prédictions",
    leagues: "Ligues",
    performance: "Analyse",
    community: "Communauté",
    news: "Actualités",
    pricing: "Tarifs",
    login: "Connexion",
    getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez de manière responsable.",
    allRights: "© 2025 OddsFlow. Tous droits réservés.",
    liveUpdates: "EN DIRECT",
    featuredStory: "À LA UNE",
    latestNews: "DERNIÈRES ACTUALITÉS",
    readMore: "Lire l'Article Complet",
  },
  JA: {
    newsTitle: "ニュース＆インサイト",
    newsSubtitle: "最新のサッカーニュース、ベッティング情報、AI予測をお届けします",
    noNews: "ニュースがありません",
    readOn: "で読む",
    stayInLoop: "最新情報を入手",
    getLatestNews: "最新のニュースと予測をメールでお届けします",
    enterEmail: "メールアドレスを入力",
    subscribe: "購読する",
    home: "ホーム",
    predictions: "予測",
    leagues: "リーグ",
    performance: "分析",
    community: "コミュニティ",
    news: "ニュース",
    pricing: "料金",
    login: "ログイン",
    getStarted: "始める",
    footer: "18+ | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2025 OddsFlow. All rights reserved.",
    liveUpdates: "ライブ更新",
    featuredStory: "注目",
    latestNews: "最新ニュース",
    readMore: "記事を読む",
  },
  KO: {
    newsTitle: "뉴스 & 인사이트",
    newsSubtitle: "최신 축구 뉴스, 베팅 인사이트 및 AI 예측을 확인하세요",
    noNews: "뉴스가 없습니다",
    readOn: "에서 읽기",
    stayInLoop: "최신 정보 받기",
    getLatestNews: "최신 뉴스와 예측을 이메일로 받아보세요",
    enterEmail: "이메일 입력",
    subscribe: "구독하기",
    home: "홈",
    predictions: "예측",
    leagues: "리그",
    performance: "분석",
    community: "커뮤니티",
    news: "뉴스",
    pricing: "가격",
    login: "로그인",
    getStarted: "시작하기",
    footer: "18+ | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
    liveUpdates: "실시간",
    featuredStory: "주요 기사",
    latestNews: "최신 뉴스",
    readMore: "전체 기사 읽기",
  },
  '中文': {
    newsTitle: "新闻与洞察",
    newsSubtitle: "获取最新的足球新闻、投注分析和AI预测",
    noNews: "暂无新闻",
    readOn: "阅读来源",
    stayInLoop: "保持关注",
    getLatestNews: "将最新新闻和预测发送到您的邮箱",
    enterEmail: "输入您的邮箱",
    subscribe: "订阅",
    home: "首页",
    predictions: "预测",
    leagues: "联赛",
    performance: "分析",
    community: "社区",
    news: "新闻",
    pricing: "价格",
    login: "登录",
    getStarted: "开始使用",
    footer: "18+ | 赌博有风险，请理性参与。",
    allRights: "© 2025 OddsFlow. 保留所有权利。",
    liveUpdates: "实时更新",
    featuredStory: "头条",
    latestNews: "最新新闻",
    readMore: "阅读全文",
  },
  '繁體': {
    newsTitle: "新聞與洞察",
    newsSubtitle: "獲取最新的足球新聞、投注分析和AI預測",
    noNews: "暫無新聞",
    readOn: "閱讀來源",
    stayInLoop: "保持關注",
    getLatestNews: "將最新新聞和預測發送到您的郵箱",
    enterEmail: "輸入您的郵箱",
    subscribe: "訂閱",
    home: "首頁",
    predictions: "預測",
    leagues: "聯賽",
    performance: "分析",
    community: "社區",
    news: "新聞",
    pricing: "價格",
    login: "登入",
    getStarted: "開始使用",
    footer: "18+ | 賭博有風險，請理性參與。",
    allRights: "© 2025 OddsFlow. 保留所有權利。",
    liveUpdates: "即時更新",
    featuredStory: "頭條",
    latestNews: "最新新聞",
    readMore: "閱讀全文",
  },
};

export default function NewsPage() {
  const [news, setNews] = useState<FootballNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setSelectedLang(savedLang);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('oddsflow_lang', langCode);
    setLangDropdownOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  useEffect(() => {
    async function fetchNews() {
      try {
        const { count } = await supabase
          .from('football_news')
          .select('*', { count: 'exact', head: true });

        setTotalCount(count || 0);

        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error } = await supabase
          .from('football_news')
          .select('*')
          .order('published_at', { ascending: false, nullsFirst: false })
          .range(from, to);

        if (error) throw error;
        setNews(data || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const featuredNews = news[0];
  const otherNews = news.slice(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05080d] text-white">
      {/* Stadium atmosphere background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top stadium light glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
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
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('home')}</Link>
              <Link href="/predictions" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('predictions')}</Link>
              <Link href="/leagues" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('leagues')}</Link>
              <Link href="/performance" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('performance')}</Link>
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
              <Link href="/news" className="text-emerald-400 text-sm font-medium">{t('news')}</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer">
                  <span>{currentLang.flag}</span>
                  <span className="font-medium">{currentLang.code}</span>
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {langDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-[#0c1018] border border-white/10 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                      {LANGUAGES.map((l) => (
                        <button key={l.code} onClick={() => handleLanguageChange(l.code)} className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${selectedLang === l.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'}`}>
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
                    <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
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
                  <Link href="/get-started" className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
                </>
              )}

              {/* World Cup Special Button */}
              <Link
                href="/worldcup"
                className="relative hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all cursor-pointer group overflow-hidden hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-5 w-auto object-contain relative z-10" />
                <span className="text-black font-semibold text-sm relative z-10">FIFA 2026</span>
              </Link>

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
        <div className="fixed inset-0 z-[45] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
              {/* World Cup Special Entry */}
              <Link href="/worldcup" onClick={() => setMobileMenuOpen(false)} className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-8 w-auto object-contain relative z-10" />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
              </Link>

              {[
                { href: '/', label: t('home') },
                { href: '/predictions', label: t('predictions') },
                { href: '/leagues', label: t('leagues') },
                { href: '/performance', label: t('performance') },
                { href: '/community', label: t('community') },
                { href: '/news', label: t('news'), active: true },
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

              {/* Mobile Login/Signup */}
              {!user && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/get-started"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold hover:shadow-lg transition-all"
                  >
                    {t('getStarted')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Broadcast-style Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-bold tracking-wider">{t('liveUpdates')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                {t('newsTitle')}
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
              {t('newsSubtitle')}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" />
              </div>
            </div>
          )}

          {!loading && news.length === 0 && (
            <div className="text-center py-20 text-gray-500">{t('noNews')}</div>
          )}

          {!loading && featuredNews && (
            <>
              {/* Featured Article - Broadcast Style */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase">{t('featuredStory')}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <a
                  href={featuredNews.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-[#0a0e14] border border-white/5">
                    {/* Stadium light effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05080d] via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="grid lg:grid-cols-5 gap-0">
                      {/* Image Section */}
                      <div className="lg:col-span-3 relative aspect-video lg:aspect-auto lg:min-h-[400px] overflow-hidden">
                        {featuredNews.image_url ? (
                          <>
                            <img
                              src={featuredNews.image_url}
                              alt={featuredNews.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0e14] lg:block hidden" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/50 to-transparent lg:hidden" />
                          </>
                        ) : (
                          <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#0c1018] to-[#05080d] flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <svg className="w-10 h-10 text-emerald-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="lg:col-span-2 p-8 flex flex-col justify-center relative">
                        {/* Broadcast-style source badge */}
                        <div className="flex items-center gap-3 mb-6">
                          <span className="px-3 py-1 rounded bg-emerald-500 text-black text-[11px] font-bold tracking-wide uppercase">
                            {featuredNews.source}
                          </span>
                          {featuredNews.published_at && (
                            <span className="text-xs text-gray-500 font-medium">
                              {getRelativeTime(featuredNews.published_at)}
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-emerald-400 transition-colors duration-300">
                          {featuredNews.title}
                        </h2>

                        <p className="text-gray-400 mb-6 leading-relaxed line-clamp-3 text-sm lg:text-base">
                          {featuredNews.summary}
                        </p>

                        {/* Read more with arrow */}
                        <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm group/link">
                          <span>{t('readMore')}</span>
                          <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Latest News Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">{t('latestNews')}</span>
                <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
              </div>

              {/* News Grid - Broadcast Style Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherNews.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative h-full rounded-xl overflow-hidden bg-[#0a0e14] border border-white/5 hover:border-emerald-500/30 transition-all duration-300">
                      {/* Spotlight effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Image */}
                      <div className="aspect-[16/10] relative overflow-hidden">
                        {item.image_url ? (
                          <>
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] to-transparent" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1018] to-[#05080d] flex items-center justify-center">
                            <svg className="w-12 h-12 text-white/5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                        )}

                        {/* Source badge overlay */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold tracking-wide uppercase border border-white/10">
                            {item.source}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Time */}
                        {item.published_at && (
                          <span className="text-[11px] text-emerald-400/80 font-medium uppercase tracking-wide">
                            {getRelativeTime(item.published_at)}
                          </span>
                        )}

                        <h3 className="font-bold text-white mt-2 mb-3 leading-snug group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>

                        {/* Read indicator */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs text-gray-500">{t('readOn')} {item.source}</span>
                          <svg className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg bg-[#0a0e14] border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 2) return true;
                      return false;
                    })
                    .map((page, index, arr) => {
                      const showEllipsisBefore = index > 0 && page - arr[index - 1] > 1;
                      return (
                        <span key={page} className="flex items-center gap-2">
                          {showEllipsisBefore && <span className="text-gray-600 px-2">...</span>}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all cursor-pointer ${
                              currentPage === page
                                ? 'bg-emerald-500 text-black'
                                : 'bg-[#0a0e14] border border-white/10 text-white hover:bg-white/5 hover:border-emerald-500/30'
                            }`}
                          >
                            {page}
                          </button>
                        </span>
                      );
                    })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg bg-[#0a0e14] border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>{t('footer')}</p>
        <p className="mt-2">{t('allRights')}</p>
      </footer>
    </div>
  );
}
