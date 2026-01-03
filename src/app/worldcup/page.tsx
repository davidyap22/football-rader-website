'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase, Prematch, MatchPrediction, getMatchPredictions } from '@/lib/supabase';
import WorldCupFooter from '@/components/WorldCupFooter';
import { User } from '@supabase/supabase-js';

// Date helper functions - All using UTC
function getUTCToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function getDateRange() {
  const dates = [];
  const today = getUTCToday();

  // Get 7 days: 3 days before, today, 3 days after
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() + i);
    dates.push(date);
  }

  return dates;
}

function formatDateForQuery(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameDay(date1: Date, date2: Date) {
  return date1.getUTCFullYear() === date2.getUTCFullYear() &&
         date1.getUTCMonth() === date2.getUTCMonth() &&
         date1.getUTCDate() === date2.getUTCDate();
}

function getInitialDate() {
  return getUTCToday();
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

// World Cup specific translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    worldCup: "FIFA World Cup 2026",
    worldCupSubtitle: "AI predictions for the biggest football tournament on Earth. Get winning tips for every World Cup match.",
    yesterday: "YESTERDAY",
    today: "TODAY",
    tomorrow: "TOMORROW",
    matches: "matches",
    loading: "Loading World Cup matches...",
    noMatches: "No World Cup matches scheduled for this date",
    home: "Home",
    predictions: "Predictions",
    worldcup: "World Cup",
    leagues: "Leagues",
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
    worldCup: "Copa Mundial FIFA 2026",
    worldCupSubtitle: "Predicciones IA para el torneo de fútbol más grande del mundo",
    yesterday: "AYER",
    today: "HOY",
    tomorrow: "MAÑANA",
    matches: "partidos",
    loading: "Cargando partidos del Mundial...",
    noMatches: "No hay partidos del Mundial programados para esta fecha",
    home: "Inicio",
    predictions: "Predicciones",
    worldcup: "Mundial",
    leagues: "Ligas",
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
    worldCup: "Copa do Mundo FIFA 2026",
    worldCupSubtitle: "Previsões de IA para o maior torneio de futebol do mundo",
    yesterday: "ONTEM",
    today: "HOJE",
    tomorrow: "AMANHÃ",
    matches: "jogos",
    loading: "Carregando jogos da Copa...",
    noMatches: "Nenhum jogo da Copa programado para esta data",
    home: "Início",
    predictions: "Previsões",
    worldcup: "Copa",
    leagues: "Ligas",
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
    worldCup: "FIFA Weltmeisterschaft 2026",
    worldCupSubtitle: "KI-Vorhersagen für das größte Fußballturnier der Welt",
    yesterday: "GESTERN",
    today: "HEUTE",
    tomorrow: "MORGEN",
    matches: "Spiele",
    loading: "WM-Spiele werden geladen...",
    noMatches: "Keine WM-Spiele für dieses Datum geplant",
    home: "Startseite",
    predictions: "Vorhersagen",
    worldcup: "WM",
    leagues: "Ligen",
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
    worldCup: "Coupe du Monde FIFA 2026",
    worldCupSubtitle: "Prédictions IA pour le plus grand tournoi de football au monde",
    yesterday: "HIER",
    today: "AUJOURD'HUI",
    tomorrow: "DEMAIN",
    matches: "matchs",
    loading: "Chargement des matchs de la Coupe...",
    noMatches: "Aucun match de la Coupe prévu pour cette date",
    home: "Accueil",
    predictions: "Prédictions",
    worldcup: "Coupe",
    leagues: "Ligues",
    performance: "Analyse",
    community: "Communauté",
    news: "Actualités",
    pricing: "Tarifs",
    login: "Connexion",
    getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez responsablement.",
    allRights: "© 2025 OddsFlow. Tous droits réservés.",
  },
  JA: {
    worldCup: "FIFAワールドカップ2026",
    worldCupSubtitle: "世界最大のサッカー大会のAI予測",
    yesterday: "昨日",
    today: "今日",
    tomorrow: "明日",
    matches: "試合",
    loading: "W杯の試合を読み込み中...",
    noMatches: "この日のW杯試合予定はありません",
    home: "ホーム",
    predictions: "予測",
    worldcup: "W杯",
    leagues: "リーグ",
    performance: "分析",
    community: "コミュニティ",
    news: "ニュース",
    pricing: "料金",
    login: "ログイン",
    getStarted: "始める",
    footer: "18歳以上 | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2025 OddsFlow. 全著作権所有。",
  },
  KO: {
    worldCup: "FIFA 월드컵 2026",
    worldCupSubtitle: "세계 최대 축구 대회의 AI 예측",
    yesterday: "어제",
    today: "오늘",
    tomorrow: "내일",
    matches: "경기",
    loading: "월드컵 경기 로딩 중...",
    noMatches: "이 날짜에 예정된 월드컵 경기가 없습니다",
    home: "홈",
    predictions: "예측",
    worldcup: "월드컵",
    leagues: "리그",
    performance: "분석",
    community: "커뮤니티",
    news: "뉴스",
    pricing: "가격",
    login: "로그인",
    getStarted: "시작하기",
    footer: "18세 이상 | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2025 OddsFlow. 모든 권리 보유.",
  },
  '中文': {
    worldCup: "2026世界杯",
    worldCupSubtitle: "世界最大足球赛事的AI预测",
    yesterday: "昨天",
    today: "今天",
    tomorrow: "明天",
    matches: "场比赛",
    loading: "加载世界杯比赛中...",
    noMatches: "该日期暂无世界杯比赛",
    home: "首页",
    predictions: "预测",
    worldcup: "世界杯",
    leagues: "联赛",
    performance: "分析",
    community: "社区",
    news: "新闻",
    pricing: "价格",
    login: "登录",
    getStarted: "开始使用",
    footer: "18+ | 博彩有风险，请理性投注。",
    allRights: "© 2025 OddsFlow. 保留所有权利。",
  },
  '繁體': {
    worldCup: "2026世界盃",
    worldCupSubtitle: "世界最大足球賽事的AI預測",
    yesterday: "昨天",
    today: "今天",
    tomorrow: "明天",
    matches: "場比賽",
    loading: "載入世界盃比賽中...",
    noMatches: "該日期暫無世界盃比賽",
    home: "首頁",
    predictions: "預測",
    worldcup: "世界盃",
    leagues: "聯賽",
    performance: "分析",
    community: "社區",
    news: "新聞",
    pricing: "價格",
    login: "登入",
    getStarted: "開始使用",
    footer: "18+ | 博彩有風險，請理性投注。",
    allRights: "© 2025 OddsFlow. 保留所有權利。",
  },
};

function WorldCupContent() {
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(getInitialDate);
  const [matches, setMatches] = useState<Prematch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dates] = useState(getDateRange);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fifaDropdownOpen, setFifaDropdownOpen] = useState(false);
  const [predictions, setPredictions] = useState<Record<number, MatchPrediction>>({});
  const [contentVisible, setContentVisible] = useState(false);
  const [videoFaded, setVideoFaded] = useState(false);
  const [visibleMatches, setVisibleMatches] = useState(10);
  const today = getUTCToday();

  // Gradually show content and fade video
  useEffect(() => {
    // Start showing content after 1 second
    const contentTimer = setTimeout(() => {
      setContentVisible(true);
    }, 1000);

    // Start fading video after 3 seconds
    const videoTimer = setTimeout(() => {
      setVideoFaded(true);
    }, 3000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(videoTimer);
    };
  }, []);
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  const handleMatchClick = (e: React.MouseEvent, matchId: number) => {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

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
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsedDate = new Date(dateParam + 'T00:00:00Z');
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
        sessionStorage.setItem('oddsflow_worldcup_date', dateParam);
        return;
      }
    }

    const savedDate = sessionStorage.getItem('oddsflow_worldcup_date');
    if (savedDate) {
      const parsedDate = new Date(savedDate + 'T00:00:00Z');
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
      }
    }
  }, []);

  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsedDate = new Date(dateParam + 'T00:00:00Z');
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
        sessionStorage.setItem('oddsflow_worldcup_date', dateParam);
      }
    }
  }, [searchParams]);

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

  const t = (key: string): string => {
    return translations[selectedLang]?.[key] || translations['EN']?.[key] || key;
  };

  const formatDateLabelTranslated = (date: Date, todayDate: Date) => {
    const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const todayUTC = Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate());
    const diffDays = Math.round((dateUTC - todayUTC) / (1000 * 60 * 60 * 24));

    if (diffDays === -1) return t('yesterday');
    if (diffDays === 0) return t('today');
    if (diffDays === 1) return t('tomorrow');

    const day = date.getUTCDate();
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    const month = months[date.getUTCMonth()];
    return `${day} ${month}`;
  };

  // Fetch ALL World Cup matches (no date filter since tournament hasn't started)
  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('prematches')
          .select('*')
          .eq('league_name', 'World Cup')
          .order('start_date_msia', { ascending: true });

        if (error) throw error;
        setMatches(data || []);

        if (data && data.length > 0) {
          const fixtureIds = data.map((m: Prematch) => m.id);
          const { data: predictionsData } = await getMatchPredictions(fixtureIds);
          if (predictionsData) {
            setPredictions(predictionsData);
          }
        }
      } catch (error) {
        console.error('Error fetching World Cup matches:', error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatMatchDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getUTCMonth()];
    return `${day} ${month}`;
  };

  // Countdown calculation
  const getCountdown = () => {
    const worldCupStart = new Date('2026-06-11T00:00:00Z');
    const now = new Date();
    const diff = worldCupStart.getTime() - now.getTime();

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  // Initialize with static values to avoid hydration mismatch
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCountdown(getCountdown());
    const timer = setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative">
      {/* World Cup Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0f] to-[#1a1a2e]" />
        <div className="absolute inset-0 bg-[url('/worldcup/stadium-pattern.png')] opacity-5" />
      </div>

      {/* World Cup Ambient Effects - Golden Theme */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 -right-40 w-[500px] h-[500px] bg-yellow-500/8 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/worldcup" className="text-amber-400 text-sm font-medium">{t('home')}</Link>
              <Link href="/worldcup/predictions" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('predictions')}</Link>
              <Link href="/worldcup/leagues" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('leagues')}</Link>
              <Link href="/worldcup/ai_performance" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('performance')}</Link>
            </div>

            {/* Right Side - Language, User, Menu Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer"
                >
                  <span>{currentLang.flag}</span>
                  <span className="font-medium">{currentLang.code}</span>
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            selectedLang === l.code ? 'bg-amber-500/20 text-amber-400' : 'text-gray-300'
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-black font-bold text-sm">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
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
                    <Link
                      href="/"
                      onClick={() => setFifaDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors border-b border-white/10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">Back to OddsFlow</span>
                    </Link>
                    <Link
                      href="/worldcup/predictions"
                      onClick={() => setFifaDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="font-medium">{t('predictions')}</span>
                    </Link>
                    <Link
                      href="/worldcup/leagues"
                      onClick={() => setFifaDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="font-medium">{t('leagues')}</span>
                    </Link>
                    <Link
                      href="/worldcup/ai_performance"
                      onClick={() => setFifaDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="font-medium">{t('performance')}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[45] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
              {/* FIFA World Cup Special Entry - Current Page */}
              <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-8 w-auto object-contain relative z-10" />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
                <span className="ml-auto text-black/60 text-xs font-medium relative z-10">Current</span>
              </div>

              {[
                { href: '/', label: t('home') },
                { href: '/predictions', label: t('predictions') },
                { href: '/leagues', label: t('leagues') },
                { href: '/performance', label: t('performance') },
                { href: '/community', label: t('community') },
                { href: '/news', label: t('news') },
                { href: '/pricing', label: t('pricing') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              {!user && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all">
                    {t('login')}
                  </Link>
                  <Link href="/get-started" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-center font-semibold hover:shadow-lg transition-all">
                    {t('getStarted')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for navbar */}
      <div className="h-16"></div>

      {/* Hero Section with Video */}
      <section className="relative z-10 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-[4000ms] ${videoFaded ? 'opacity-40' : 'opacity-100'}`}
          >
            <source src="/fifa2026/fifa_video.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0a0a0f]" />
          {/* Golden Accent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-amber-900/20" />
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 pt-16 pb-20 px-4 transition-all duration-[2000ms] ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-6xl mx-auto">
            {/* Main Hero Content */}
            <div className="text-center mb-12">
              {/* FIFA Logo with Glow */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  {/* Multiple glow layers */}
                  <div className="absolute inset-0 bg-amber-500 rounded-full blur-[80px] opacity-50 animate-pulse"></div>
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-[60px] opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full blur-[40px] opacity-40"></div>
                  <img
                    src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png"
                    alt="FIFA World Cup 2026"
                    className="relative w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]"
                  />
                </div>
              </div>

              {/* Title with Glow */}
              <div className="relative mb-6">
                {/* Background glow for title */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[600px] h-20 bg-amber-500/30 blur-[60px] rounded-full"></div>
                </div>
                <h1 className="relative text-5xl md:text-8xl font-black mb-2">
                  {/* Main text with gradient */}
                  <span className="bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(251,191,36,0.6)]">
                    FIFA World Cup 2026
                  </span>
                </h1>
              </div>

              {/* Host Countries with glow */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">🇺🇸</span>
                <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">🇨🇦</span>
                <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">🇲🇽</span>
                <span className="text-white text-base ml-2 font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">USA • Canada • Mexico</span>
              </div>

              {/* Subtitle with better contrast */}
              <p className="text-white text-xl max-w-2xl mx-auto mb-10 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)' }}>
                {t('worldCupSubtitle')}
              </p>

              {/* Countdown Timer with Glow */}
              <div className="relative">
                {/* Glow behind countdown */}
                <div className="absolute inset-0 bg-amber-500/20 blur-[40px] rounded-full"></div>
                <div className="relative inline-flex items-center gap-2 sm:gap-6 bg-black/60 backdrop-blur-xl border-2 border-amber-500/50 rounded-2xl px-6 sm:px-10 py-5 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" style={{ textShadow: '0 0 30px rgba(251,191,36,0.6)' }}>
                      {isClient ? countdown.days : '--'}
                    </div>
                    <div className="text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest font-semibold mt-1">Days</div>
                  </div>
                  <span className="text-amber-400 text-2xl sm:text-3xl font-bold">:</span>
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" style={{ textShadow: '0 0 30px rgba(251,191,36,0.6)' }}>
                      {isClient ? String(countdown.hours).padStart(2, '0') : '--'}
                    </div>
                    <div className="text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest font-semibold mt-1">Hours</div>
                  </div>
                  <span className="text-amber-400 text-2xl sm:text-3xl font-bold">:</span>
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" style={{ textShadow: '0 0 30px rgba(251,191,36,0.6)' }}>
                      {isClient ? String(countdown.minutes).padStart(2, '0') : '--'}
                    </div>
                    <div className="text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest font-semibold mt-1">Mins</div>
                  </div>
                  <span className="text-amber-400 text-2xl sm:text-3xl font-bold">:</span>
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" style={{ textShadow: '0 0 30px rgba(251,191,36,0.6)' }}>
                      {isClient ? String(countdown.seconds).padStart(2, '0') : '--'}
                    </div>
                    <div className="text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest font-semibold mt-1">Secs</div>
                  </div>
                </div>
              </div>

              <p className="text-amber-300 text-base font-semibold mt-6 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">June 11 - July 19, 2026</p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {/* Predictions Card */}
            <Link href="/worldcup/predictions" className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-amber-500/20 p-6 hover:border-amber-500/40 transition-all hover:scale-[1.02] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Predictions</h3>
                <p className="text-gray-400 text-sm mb-4">Get AI-powered predictions for every World Cup match with detailed analysis.</p>
                <span className="inline-flex items-center text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
                  View Predictions
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Teams & Groups Card */}
            <Link href="/worldcup/leagues" className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all hover:scale-[1.02] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Teams & Groups</h3>
                <p className="text-gray-400 text-sm mb-4">Explore all 48 qualified teams, group standings, and match schedules.</p>
                <span className="inline-flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                  View Teams
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* AI Performance Card */}
            <Link href="/worldcup/ai_performance" className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all hover:scale-[1.02] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Performance</h3>
                <p className="text-gray-400 text-sm mb-4">Track our AI prediction accuracy and historical performance metrics.</p>
                <span className="inline-flex items-center text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all">
                  View Stats
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Tournament Info */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-950/60 rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">Tournament Info</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">48</div>
                <div className="text-gray-400 text-sm">Teams</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">104</div>
                <div className="text-gray-400 text-sm">Matches</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">16</div>
                <div className="text-gray-400 text-sm">Venues</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-1">3</div>
                <div className="text-gray-400 text-sm">Host Countries</div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Matches Section Title */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          World Cup Matches
        </h2>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-8 flex-1 w-full">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        )}

        {/* No Matches */}
        {!loading && matches.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('noMatches')}</h3>
            <p className="text-gray-500">Check back later for World Cup matches</p>
          </div>
        )}

        {/* World Cup Matches */}
        {!loading && matches.length > 0 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-amber-500/20 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-amber-500/20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 p-0.5 flex items-center justify-center">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">FIFA World Cup 2026</h3>
                  <p className="text-xs text-amber-400/80">USA, Canada & Mexico</p>
                </div>
                <span className="text-xs text-gray-500 ml-auto">{matches.length} {t('matches')}</span>
              </div>

              {/* Matches */}
              <div className="divide-y divide-white/5">
                {matches.slice(0, visibleMatches).map((match) => (
                  <Link
                    href={`/worldcup/predictions/${match.id}?date=${match.start_date_msia ? match.start_date_msia.split('T')[0] : ''}`}
                    key={match.id}
                    onClick={(e) => handleMatchClick(e, match.id)}
                    className={`block transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                      match.type === 'In Play'
                        ? 'bg-red-500/5 hover:bg-red-500/10 border-l-2 border-red-500'
                        : 'hover:bg-amber-500/5'
                    }`}
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-amber-500/10 to-transparent pointer-events-none" />

                    {/* Mobile Layout */}
                    <div className="md:hidden p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        {match.type === 'In Play' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                            </span>
                            <span className="text-red-500 font-bold text-xs uppercase animate-pulse">
                              {match.status_elapsed ? `${match.status_elapsed}'` : 'LIVE'}
                            </span>
                          </div>
                        ) : match.type === 'Finished' ? (
                          <span className="text-gray-500 font-medium text-xs">FT</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">{formatMatchDate(match.start_date_msia)}</span>
                            <span className="text-amber-400 font-mono text-sm font-medium">
                              {formatTime(match.start_date_msia)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {match.home_logo && (
                            <div className="w-8 h-8 rounded-full bg-white p-0.5 flex-shrink-0">
                              <img src={match.home_logo} alt="" className="w-full h-full object-contain" />
                            </div>
                          )}
                          <span className="text-white font-medium text-sm truncate">{match.home_name}</span>
                        </div>

                        {(match.type === 'Finished' || match.type === 'In Play') ? (
                          <div className={`px-3 py-1 rounded-lg text-sm font-bold flex-shrink-0 ${
                            match.type === 'In Play' ? 'bg-red-500/20 text-white' : 'bg-gray-700/50 text-gray-300'
                          }`}>
                            {match.goals_home ?? 0} - {match.goals_away ?? 0}
                          </div>
                        ) : (
                          <span className="text-gray-600 text-xs font-medium flex-shrink-0">vs</span>
                        )}

                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                          <span className="text-white font-medium text-sm truncate text-right">{match.away_name}</span>
                          {match.away_logo && (
                            <div className="w-8 h-8 rounded-full bg-white p-0.5 flex-shrink-0">
                              <img src={match.away_logo} alt="" className="w-full h-full object-contain" />
                            </div>
                          )}
                        </div>
                      </div>

                      {match.type !== 'Finished' && predictions[match.id] && (
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                            <span className="text-gray-400">Winner:</span>
                            <span className="text-amber-400 font-medium truncate max-w-[80px]">
                              {predictions[match.id].winner_name || 'Draw'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                            <span className="text-gray-400">H:</span>
                            <span className="text-blue-400 font-medium">{predictions[match.id].goals_home || '-'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                            <span className="text-gray-400">A:</span>
                            <span className="text-green-400 font-medium">{predictions[match.id].goals_away || '-'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center px-5 py-4">
                      <div className="col-span-2">
                        {match.type === 'In Play' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                            </span>
                            <span className="text-red-500 font-bold text-xs uppercase animate-pulse">
                              {match.status_elapsed ? `${match.status_elapsed}'` : 'LIVE'}
                            </span>
                          </div>
                        ) : match.type === 'Finished' ? (
                          <span className="text-gray-500 font-medium text-xs">FT</span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-gray-400 text-xs">{formatMatchDate(match.start_date_msia)}</span>
                            <span className="text-amber-400 font-mono text-sm font-medium">
                              {formatTime(match.start_date_msia)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="col-span-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1 justify-end">
                            <span className="text-white font-medium text-sm text-right truncate">{match.home_name}</span>
                            {match.home_logo && (
                              <div className="w-7 h-7 rounded-full bg-white p-0.5 flex-shrink-0">
                                <img src={match.home_logo} alt="" className="w-full h-full object-contain" />
                              </div>
                            )}
                          </div>

                          {(match.type === 'Finished' || match.type === 'In Play') ? (
                            <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              match.type === 'In Play' ? 'bg-red-500/20 text-white' : 'bg-gray-700/50 text-gray-300'
                            }`}>
                              {match.goals_home ?? 0} - {match.goals_away ?? 0}
                            </div>
                          ) : (
                            <span className="text-gray-600 text-xs font-medium px-2">vs</span>
                          )}

                          <div className="flex items-center gap-2 flex-1">
                            {match.away_logo && (
                              <div className="w-7 h-7 rounded-full bg-white p-0.5 flex-shrink-0">
                                <img src={match.away_logo} alt="" className="w-full h-full object-contain" />
                              </div>
                            )}
                            <span className="text-white font-medium text-sm truncate">{match.away_name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-4 text-right">
                        {match.type !== 'Finished' && predictions[match.id] ? (
                          <div className="inline-flex items-center gap-2 text-xs">
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                              <span className="text-gray-400">Winner:</span>
                              <span className="text-amber-400 font-medium truncate max-w-[100px]">
                                {predictions[match.id].winner_name || 'Draw'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                              <span className="text-gray-400">H:</span>
                              <span className="text-blue-400 font-medium">{predictions[match.id].goals_home || '-'}</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                              <span className="text-gray-400">A:</span>
                              <span className="text-green-400 font-medium">{predictions[match.id].goals_away || '-'}</span>
                            </div>
                          </div>
                        ) : match.type === 'Finished' ? null : (
                          <span className="text-gray-500 text-xs">No prediction</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {visibleMatches < matches.length && (
                <div className="p-4 border-t border-white/5">
                  <button
                    onClick={() => setVisibleMatches(prev => Math.min(prev + 10, matches.length))}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-400 font-medium hover:from-amber-500/20 hover:to-yellow-500/20 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Load More</span>
                    <span className="text-xs text-gray-500">({visibleMatches} / {matches.length})</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <WorldCupFooter lang={selectedLang} />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-500/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Sign in to view predictions
            </h2>

            <p className="text-gray-400 text-center mb-8">
              Create a free account to access World Cup AI predictions
            </p>

            <div className="space-y-3">
              <Link href="/get-started" className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-center hover:shadow-lg hover:shadow-amber-500/25 transition-all" onClick={() => setShowLoginModal(false)}>
                Sign Up Free
              </Link>
              <Link href="/login" className="block w-full py-3 px-4 rounded-xl border border-white/20 text-white font-semibold text-center hover:bg-white/10 transition-all" onClick={() => setShowLoginModal(false)}>
                Already have an account? Log In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorldCupLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading World Cup...</p>
      </div>
    </div>
  );
}

export default function WorldCupPage() {
  return (
    <Suspense fallback={<WorldCupLoading />}>
      <WorldCupContent />
    </Suspense>
  );
}
