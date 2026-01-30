'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { supabase, Prematch, MatchPrediction, getMatchPredictions } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { locales, localeNames, localeFlags, localeToTranslationCode, type Locale } from '@/i18n/config';

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

function formatDateLabel(date: Date, today: Date) {
  // Compare UTC dates only (ignore time)
  const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const diffDays = Math.round((dateUTC - todayUTC) / (1000 * 60 * 60 * 24));

  if (diffDays === -1) return 'YESTERDAY';
  if (diffDays === 0) return 'TODAY';
  if (diffDays === 1) return 'TOMORROW';

  const day = date.getUTCDate();
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const month = months[date.getUTCMonth()];
  return `${day} ${month}`;
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

// Check if date is within allowed range (-3 to +3 days from today)
function isDateInAllowedRange(date: Date): boolean {
  const today = getUTCToday();
  const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const diffDays = Math.round((dateUTC - todayUTC) / (1000 * 60 * 60 * 24));
  return diffDays >= -3 && diffDays <= 3;
}

function getInitialDate() {
  // Always return today on initial render to avoid hydration mismatch
  // useEffect will load saved date from sessionStorage/URL after hydration
  return getUTCToday();
}

import FlagIcon from "@/components/FlagIcon";
import { generateMatchSlug } from '@/lib/slug-utils';
import { SportsEventsListJsonLd } from '@/components/JsonLd';
import { LEAGUE_NAMES_LOCALIZED, LEAGUES_CONFIG } from '@/lib/leagues-data';
import { TeamNameLanguage } from '@/lib/supabase';

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    aiPredictions: "AI Football Predictions",
    aiPredictionsToday: "AI Football Predictions Today",
    aiPredictionsYesterday: "AI Football Predictions Yesterday",
    aiPredictionsTomorrow: "AI Football Predictions Tomorrow",
    todaysMatches: "Premier League 1x2 predictions, handicap betting tips & over 2.5 goals stats from the most accurate AI football predictor",
    yesterday: "YESTERDAY",
    today: "TODAY",
    tomorrow: "TOMORROW",
    matches: "matches",
    loading: "Loading matches...",
    noMatches: "No matches scheduled for this date",
    home: "Home",
    predictions: "Predictions",
    leagues: "Leagues",
    performance: "AI Performance",
    community: "Community",
    news: "News",
    solution: "Solution",
    pricing: "Pricing",
    login: "Log In",
    getStarted: "Get Started",
    footer: "18+ | Gambling involves risk. Please gamble responsibly.",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    aiConfidence: "AI Confidence",
    draw: "Draw",
  },
  ES: {
    aiPredictions: "Predicciones IA",
    aiPredictionsToday: "Predicciones IA de Hoy",
    aiPredictionsYesterday: "Predicciones IA de Ayer",
    aiPredictionsTomorrow: "Predicciones IA de Mañana",
    todaysMatches: "Partidos de hoy con predicciones de IA",
    yesterday: "AYER",
    today: "HOY",
    tomorrow: "MAÑANA",
    matches: "partidos",
    loading: "Cargando partidos...",
    noMatches: "No hay partidos programados para esta fecha",
    home: "Inicio",
    predictions: "Predicciones",
    leagues: "Ligas",
    performance: "Rendimiento IA",
    community: "Comunidad",
    news: "Noticias",
    solution: "Solución",
    pricing: "Precios",
    login: "Iniciar Sesión",
    getStarted: "Comenzar",
    footer: "18+ | El juego implica riesgo. Por favor juega responsablemente.",
    allRights: "© 2026 OddsFlow. Todos los derechos reservados.",
    aiConfidence: "Confianza IA",
    draw: "Empate",
  },
  PT: {
    aiPredictions: "Previsões IA",
    aiPredictionsToday: "Previsões IA de Hoje",
    aiPredictionsYesterday: "Previsões IA de Ontem",
    aiPredictionsTomorrow: "Previsões IA de Amanhã",
    todaysMatches: "Jogos de hoje com previsões de IA",
    yesterday: "ONTEM",
    today: "HOJE",
    tomorrow: "AMANHÃ",
    matches: "jogos",
    loading: "Carregando jogos...",
    noMatches: "Nenhum jogo programado para esta data",
    home: "Início",
    predictions: "Previsões",
    leagues: "Ligas",
    performance: "Desempenho IA",
    community: "Comunidade",
    news: "Notícias",
    solution: "Solução",
    pricing: "Preços",
    login: "Entrar",
    getStarted: "Começar",
    footer: "18+ | O jogo envolve risco. Por favor, jogue com responsabilidade.",
    allRights: "© 2026 OddsFlow. Todos os direitos reservados.",
    aiConfidence: "Confiança IA",
    draw: "Empate",
  },
  DE: {
    aiPredictions: "KI-Vorhersagen",
    aiPredictionsToday: "KI-Vorhersagen Heute",
    aiPredictionsYesterday: "KI-Vorhersagen Gestern",
    aiPredictionsTomorrow: "KI-Vorhersagen Morgen",
    todaysMatches: "Heutige Spiele mit KI-gestützten Vorhersagen",
    yesterday: "GESTERN",
    today: "HEUTE",
    tomorrow: "MORGEN",
    matches: "Spiele",
    loading: "Spiele werden geladen...",
    noMatches: "Keine Spiele für dieses Datum geplant",
    home: "Startseite",
    predictions: "Vorhersagen",
    leagues: "Ligen",
    performance: "KI-Leistung",
    community: "Community",
    news: "Nachrichten",
    solution: "Lösung",
    pricing: "Preise",
    login: "Anmelden",
    getStarted: "Loslegen",
    footer: "18+ | Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    allRights: "© 2026 OddsFlow. Alle Rechte vorbehalten.",
    aiConfidence: "KI-Konfidenz",
    draw: "Unentschieden",
  },
  FR: {
    aiPredictions: "Prédictions IA",
    aiPredictionsToday: "Prédictions IA Aujourd'hui",
    aiPredictionsYesterday: "Prédictions IA Hier",
    aiPredictionsTomorrow: "Prédictions IA Demain",
    todaysMatches: "Matchs d'aujourd'hui avec prédictions IA",
    yesterday: "HIER",
    today: "AUJOURD'HUI",
    tomorrow: "DEMAIN",
    matches: "matchs",
    loading: "Chargement des matchs...",
    noMatches: "Aucun match prévu pour cette date",
    home: "Accueil",
    predictions: "Prédictions",
    leagues: "Ligues",
    performance: "Performance IA",
    community: "Communauté",
    news: "Actualités",
    solution: "Solution",
    pricing: "Tarifs",
    login: "Connexion",
    getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez responsablement.",
    allRights: "© 2026 OddsFlow. Tous droits réservés.",
    aiConfidence: "Confiance IA",
    draw: "Nul",
  },
  JA: {
    aiPredictions: "AI予測",
    aiPredictionsToday: "今日のAI予測",
    aiPredictionsYesterday: "昨日のAI予測",
    aiPredictionsTomorrow: "明日のAI予測",
    todaysMatches: "AI予測による本日の試合",
    yesterday: "昨日",
    today: "今日",
    tomorrow: "明日",
    matches: "試合",
    loading: "試合を読み込み中...",
    noMatches: "この日の試合予定はありません",
    home: "ホーム",
    predictions: "予測",
    leagues: "リーグ",
    performance: "AIパフォーマンス",
    community: "コミュニティ",
    news: "ニュース",
    solution: "ソリューション",
    pricing: "料金",
    login: "ログイン",
    getStarted: "始める",
    footer: "18歳以上 | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2026 OddsFlow. 全著作権所有。",
    aiConfidence: "AI信頼度",
    draw: "引き分け",
  },
  KO: {
    aiPredictions: "AI 예측",
    aiPredictionsToday: "오늘의 AI 예측",
    aiPredictionsYesterday: "어제의 AI 예측",
    aiPredictionsTomorrow: "내일의 AI 예측",
    todaysMatches: "AI 기반 예측이 포함된 오늘의 경기",
    yesterday: "어제",
    today: "오늘",
    tomorrow: "내일",
    matches: "경기",
    loading: "경기 로딩 중...",
    noMatches: "이 날짜에 예정된 경기가 없습니다",
    home: "홈",
    predictions: "예측",
    leagues: "리그",
    performance: "AI 성능",
    community: "커뮤니티",
    news: "뉴스",
    solution: "솔루션",
    pricing: "가격",
    login: "로그인",
    getStarted: "시작하기",
    footer: "18세 이상 | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2026 OddsFlow. 모든 권리 보유.",
    aiConfidence: "AI 신뢰도",
    draw: "무승부",
  },
  '中文': {
    aiPredictions: "AI预测",
    aiPredictionsToday: "今日AI预测",
    aiPredictionsYesterday: "昨日AI预测",
    aiPredictionsTomorrow: "明日AI预测",
    todaysMatches: "今日AI预测比赛",
    yesterday: "昨天",
    today: "今天",
    tomorrow: "明天",
    matches: "场比赛",
    loading: "加载比赛中...",
    noMatches: "该日期暂无比赛安排",
    home: "首页",
    predictions: "预测",
    leagues: "联赛",
    performance: "AI表现",
    community: "社区",
    news: "新闻",
    solution: "解决方案",
    pricing: "价格",
    login: "登录",
    getStarted: "开始使用",
    footer: "18+ | 博彩有风险，请理性投注。",
    allRights: "© 2026 OddsFlow. 保留所有权利。",
    aiConfidence: "AI 信心",
    draw: "平局",
  },
  '繁體': {
    aiPredictions: "AI預測",
    aiPredictionsToday: "今日AI預測",
    aiPredictionsYesterday: "昨日AI預測",
    aiPredictionsTomorrow: "明日AI預測",
    todaysMatches: "今日AI預測比賽",
    yesterday: "昨天",
    today: "今天",
    tomorrow: "明天",
    matches: "場比賽",
    loading: "載入比賽中...",
    noMatches: "該日期暫無比賽安排",
    home: "首頁",
    predictions: "預測",
    leagues: "聯賽",
    performance: "AI表現",
    community: "社區",
    news: "新聞",
    solution: "解決方案",
    pricing: "價格",
    login: "登入",
    getStarted: "開始使用",
    footer: "18+ | 博彩有風險，請理性投注。",
    allRights: "© 2026 OddsFlow. 保留所有權利。",
    aiConfidence: "AI 信心",
    draw: "平手",
  },
  ID: {
    aiPredictions: "Prediksi AI",
    aiPredictionsToday: "Prediksi AI Hari Ini",
    aiPredictionsYesterday: "Prediksi AI Kemarin",
    aiPredictionsTomorrow: "Prediksi AI Besok",
    todaysMatches: "Prediksi bertenaga AI untuk pertandingan mendatang",
    yesterday: "KEMARIN",
    today: "HARI INI",
    tomorrow: "BESOK",
    matches: "pertandingan",
    loading: "Memuat pertandingan...",
    noMatches: "Tidak ada pertandingan untuk ditampilkan",
    home: "Beranda",
    predictions: "Prediksi",
    leagues: "Liga",
    performance: "Performa AI",
    community: "Komunitas",
    news: "Berita",
    solution: "Solusi",
    pricing: "Harga",
    login: "Masuk",
    getStarted: "Mulai",
    footer: "18+ | Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    allRights: "© 2026 OddsFlow. Hak cipta dilindungi.",
    aiConfidence: "Keyakinan AI",
    draw: "Seri",
  },
};

// Props interface for PredictionsContent
interface PredictionsContentProps {
  initialMatches?: Prematch[];
  initialPredictions?: Record<number, MatchPrediction>;
  initialDate?: string;
}

function PredictionsContent({
  initialMatches = [],
  initialPredictions = {},
  initialDate,
}: PredictionsContentProps = {}) {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || 'en';
  const selectedLang = localeToTranslationCode[locale as keyof typeof localeToTranslationCode] || 'EN';

  // Parse initial date if provided, otherwise use today
  const getInitialDateFromProps = () => {
    if (initialDate) {
      const date = new Date(initialDate + 'T00:00:00Z');
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return getInitialDate();
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDateFromProps);
  // Use server-provided initial data for SEO - matches will be in initial HTML
  const [matches, setMatches] = useState<Prematch[]>(initialMatches);
  // Start with loading=false if we have initial data (SSR)
  const [loading, setLoading] = useState(initialMatches.length === 0);
  const [isDateInitialized, setIsDateInitialized] = useState(initialMatches.length > 0);
  // Track if we've already used SSR data (using ref to avoid re-render loop)
  const hasUsedSSRDataRef = useRef(initialMatches.length > 0);
  const [dates] = useState(getDateRange);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Use server-provided predictions for SEO
  const [predictions, setPredictions] = useState<Record<number, MatchPrediction>>(initialPredictions);
  const today = getUTCToday();

  // Handle date selection - updates state, sessionStorage, and URL
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateStr = formatDateForQuery(date);
    sessionStorage.setItem('oddsflow_selected_date', dateStr);

    // Update URL with date parameter for SEO
    const basePath = locale === 'en' ? '/predictions' : `/${locale}/predictions`;

    // For today, use clean URL without date parameter
    if (isSameDay(date, today)) {
      router.replace(basePath, { scroll: false });
    } else {
      router.replace(`${basePath}?date=${dateStr}`, { scroll: false });
    }
  };

  // Simple URL builder for language switching
  const getLocaleUrl = (targetLocale: Locale): string => {
    // For predictions page, always go to /predictions or /{locale}/predictions
    return targetLocale === 'en' ? '/predictions' : `/${targetLocale}/predictions`;
  };

  // Helper function to create locale-aware paths
  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  // Get the appropriate prediction title based on selected date
  const getPredictionTitle = () => {
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    if (isSameDay(selectedDate, today)) {
      return t('aiPredictionsToday');
    } else if (isSameDay(selectedDate, yesterday)) {
      return t('aiPredictionsYesterday');
    } else if (isSameDay(selectedDate, tomorrow)) {
      return t('aiPredictionsTomorrow');
    } else {
      // For other dates, show generic title with the date
      return t('aiPredictions');
    }
  };

  // Handle match click - check if user is logged in
  const handleMatchClick = (e: React.MouseEvent, matchId: number) => {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

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

  // Load date from URL parameter or sessionStorage on mount
  useEffect(() => {
    const basePath = locale === 'en' ? '/predictions' : `/${locale}/predictions`;

    // First check URL parameter
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsedDate = new Date(dateParam + 'T00:00:00Z');
      if (!isNaN(parsedDate.getTime())) {
        // Validate date is within allowed range (-3 to +3 days)
        if (isDateInAllowedRange(parsedDate)) {
          // If it's today, redirect to clean URL
          if (isSameDay(parsedDate, today)) {
            router.replace(basePath, { scroll: false });
          }
          setSelectedDate(parsedDate);
          sessionStorage.setItem('oddsflow_selected_date', dateParam);
          setIsDateInitialized(true);
          return;
        } else {
          // Date outside allowed range - redirect to clean URL (today)
          router.replace(basePath, { scroll: false });
          setIsDateInitialized(true);
          return;
        }
      }
    }

    // No valid URL param, check sessionStorage (runs on mount for client-side hydration)
    const savedDate = sessionStorage.getItem('oddsflow_selected_date');
    if (savedDate) {
      const parsedDate = new Date(savedDate + 'T00:00:00Z');
      if (!isNaN(parsedDate.getTime()) && isDateInAllowedRange(parsedDate)) {
        setSelectedDate(parsedDate);
        setIsDateInitialized(true);
        return;
      }
    }

    // No saved date found or saved date out of range, use today (already set as initial state)
    setIsDateInitialized(true);
  }, []); // Empty dependency - run once on mount

  // Also handle URL param changes
  useEffect(() => {
    const basePath = locale === 'en' ? '/predictions' : `/${locale}/predictions`;
    const dateParam = searchParams.get('date');

    if (dateParam) {
      const parsedDate = new Date(dateParam + 'T00:00:00Z');
      if (!isNaN(parsedDate.getTime())) {
        // Validate date is within allowed range (-3 to +3 days)
        if (isDateInAllowedRange(parsedDate)) {
          setSelectedDate(parsedDate);
          sessionStorage.setItem('oddsflow_selected_date', dateParam);
        } else {
          // Date outside allowed range - redirect to clean URL (today)
          router.replace(basePath, { scroll: false });
        }
      }
    }
  }, [searchParams, locale, router]);

  // Translation function
  const t = (key: string): string => {
    return translations[selectedLang]?.[key] || translations['EN']?.[key] || key;
  };

  // Localized month names for all supported languages
  const monthNames: Record<string, string[]> = {
    EN: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
    ES: ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'],
    PT: ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'],
    DE: ['JANUAR', 'FEBRUAR', 'MÄRZ', 'APRIL', 'MAI', 'JUNI', 'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DEZEMBER'],
    FR: ['JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN', 'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'],
    JA: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    KO: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    '中文': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    '繁體': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    ID: ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'],
  };

  // Format date label with translation
  const formatDateLabelTranslated = (date: Date, todayDate: Date) => {
    const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const todayUTC = Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate());
    const diffDays = Math.round((dateUTC - todayUTC) / (1000 * 60 * 60 * 24));

    if (diffDays === -1) return t('yesterday');
    if (diffDays === 0) return t('today');
    if (diffDays === 1) return t('tomorrow');

    const day = date.getUTCDate();
    const months = monthNames[selectedLang] || monthNames['EN'];
    const month = months[date.getUTCMonth()];

    // For Asian languages (JA, KO, ZH, TW), use "月日" format
    if (['JA', 'KO', '中文', '繁體'].includes(selectedLang)) {
      return `${month}${day}日`;
    }

    return `${day} ${month}`;
  };

  // Map database league names to slugs for localization lookup
  const leagueNameToSlug: Record<string, string> = {
    'Premier League': 'premier-league',
    'Bundesliga': 'bundesliga',
    'Serie A': 'serie-a',
    'La Liga': 'la-liga',
    'Ligue 1': 'ligue-1',
    'UEFA Champions League': 'champions-league',
    'UEFA Europa League': 'europa-league',
    'FA Cup': 'fa-cup',
    'EFL Cup': 'efl-cup',
    'Copa del Rey': 'copa-del-rey',
    'DFB Pokal': 'dfb-pokal',
    'Coupe de France': 'coupe-de-france',
    'Coppa Italia': 'coppa-italia',
  };

  // Helper function to get localized league name
  const getLeagueNameLocalized = (dbName: string): string => {
    const slug = leagueNameToSlug[dbName];
    if (slug && LEAGUE_NAMES_LOCALIZED[slug]) {
      const localized = LEAGUE_NAMES_LOCALIZED[slug][locale];
      if (localized) return localized.name;
    }
    // Fallback to database name
    return dbName;
  };

  // State for localized team names
  const [teamNameMap, setTeamNameMap] = useState<Record<string, string>>({});

  // Helper function to get localized team name
  const getTeamNameLocalized = (englishName: string): string => {
    return teamNameMap[englishName] || englishName;
  };

  useEffect(() => {
    // Only fetch after date is initialized from sessionStorage/URL
    if (!isDateInitialized) return;

    async function fetchMatches(isBackgroundRefresh = false) {
      // Only show loading spinner on initial fetch, not background refresh
      if (!isBackgroundRefresh) {
        setLoading(true);
      }
      try {
        const dateStr = formatDateForQuery(selectedDate);
        const nextDate = new Date(selectedDate);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        const nextDateStr = formatDateForQuery(nextDate);

        const { data, error } = await supabase
          .from('prematches')
          .select('*')
          .gte('start_date_msia', dateStr)
          .lt('start_date_msia', nextDateStr)
          .order('start_date_msia', { ascending: true });

        if (error) throw error;
        setMatches(data || []);

        // Fetch predictions for all matches
        if (data && data.length > 0) {
          const fixtureIds = data.map((m: Prematch) => m.fixture_id);
          const { data: predictionsData } = await getMatchPredictions(fixtureIds);
          if (predictionsData) {
            setPredictions(predictionsData);
          }
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
        if (!isBackgroundRefresh) {
          setMatches([]);
        }
      } finally {
        if (!isBackgroundRefresh) {
          setLoading(false);
        }
      }
    }

    // Skip initial fetch if we have SSR data for the same date
    // This prevents overwriting SSR data with potentially stale client data
    const initialDateStr = initialDate ? initialDate : null;
    const currentDateStr = formatDateForQuery(selectedDate);
    const shouldSkipInitialFetch = hasUsedSSRDataRef.current && initialDateStr === currentDateStr;

    if (!shouldSkipInitialFetch) {
      // Initial fetch only if we don't have SSR data or date has changed
      fetchMatches();
    }

    // Mark SSR data as used after first render
    if (hasUsedSSRDataRef.current) {
      hasUsedSSRDataRef.current = false;
    }

    // Auto-refresh every 30 seconds for live match updates
    // This ensures live status and match minutes are updated automatically
    const refreshInterval = setInterval(() => {
      fetchMatches(true); // Background refresh (no loading spinner)
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, [selectedDate, isDateInitialized, initialDate]);

  // Fetch team name translations when matches change
  useEffect(() => {
    if (matches.length === 0 || locale === 'en') return;

    async function fetchTeamNames() {
      // Extract unique team names
      const teamNames = new Set<string>();
      matches.forEach(match => {
        teamNames.add(match.home_name);
        teamNames.add(match.away_name);
      });

      if (teamNames.size === 0) return;

      try {
        // Fetch team statistics to get localized names
        const { data, error } = await supabase
          .from('team_statistics')
          .select('team_name, team_name_language')
          .in('team_name', Array.from(teamNames));

        if (error || !data) return;

        // Map locale codes to team_name_language keys
        const localeMap: Record<string, keyof TeamNameLanguage> = {
          'en': 'en',
          'es': 'es',
          'pt': 'pt',
          'de': 'de',
          'fr': 'fr',
          'ja': 'ja',
          'ko': 'ko',
          'zh': 'zh_cn',
          'tw': 'zh_tw',
          'id': 'id',
        };

        const langKey = localeMap[locale];
        const nameMap: Record<string, string> = {};

        data.forEach((team: { team_name: string | null; team_name_language: TeamNameLanguage | null }) => {
          if (!team.team_name) return;
          if (team.team_name_language && langKey && team.team_name_language[langKey]) {
            nameMap[team.team_name] = team.team_name_language[langKey] as string;
          }
        });

        setTeamNameMap(nameMap);
      } catch (err) {
        console.error('Error fetching team translations:', err);
      }
    }

    fetchTeamNames();
  }, [matches, locale]);

  const formatTime = (dateStr: string) => {
    // The database stores Malaysia time (UTC+8)
    // We need to interpret the string as Malaysia time, then display in user's local timezone

    // If no timezone info, explicitly add Malaysia timezone (+08:00)
    let correctedDateStr = dateStr;
    if (!dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.includes('-', 10)) {
      // Add Malaysia timezone offset
      correctedDateStr = dateStr + '+08:00';
    }

    const date = new Date(correctedDateStr);

    // Display in user's local timezone
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getConfidence = (index: number) => {
    const confidences = [94, 91, 89, 87, 85, 83, 81, 79, 77, 75];
    return confidences[index % confidences.length];
  };

  const getPrediction = (index: number) => {
    const predictions = ['1', '2', '1X', 'X2', 'Over 2.5', 'Under 2.5', '1', '2', 'BTTS', 'X'];
    return predictions[index % predictions.length];
  };

  // Group matches by league
  const matchesByLeague = matches.reduce((acc, match) => {
    const league = match.league_name;
    if (!acc[league]) {
      acc[league] = {
        logo: match.league_logo,
        matches: []
      };
    }
    acc[league].matches.push(match);
    return acc;
  }, {} as Record<string, { logo: string; matches: Prematch[] }>);

  // Generate schema data for SEO
  const schemaEvents = matches.map(match => {
    const matchSlug = `${generateMatchSlug(match.home_name, match.away_name)}-${match.fixture_id}`;
    const matchDate = formatDateForQuery(selectedDate);
    const basePath = locale === 'en' ? '' : `/${locale}`;
    return {
      name: `${match.home_name} vs ${match.away_name}`,
      homeTeam: match.home_name,
      awayTeam: match.away_name,
      startDate: match.start_date_msia,
      location: match.venue_name || undefined,
      url: `https://www.oddsflow.ai${basePath}/predictions/${matchDate}/${matchSlug}`,
    };
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative">
      {/* Sports Events Schema for SEO */}
      {matches.length > 0 && (
        <SportsEventsListJsonLd
          events={schemaEvents}
          listName={`Football Predictions for ${formatDateForQuery(selectedDate)}`}
          listDescription="AI-powered football match predictions with 1x2, Asian handicap, and over/under analysis"
        />
      )}

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/predictions/prediction_background.png"
          alt=""
          className="w-full h-full object-cover object-[center_30%]"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[#0a0a0f]/85" />
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]" />
      </div>

      {/* Ambient Glow Effects - Stadium Lights */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Top left stadium light */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
        {/* Top right stadium light */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        {/* Center glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[200px]" />
        {/* Bottom left accent */}
        <div className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] bg-teal-500/6 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        {/* Bottom right accent */}
        <div className="absolute bottom-1/3 -right-40 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
        {/* Moving spotlight effect */}
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-emerald-400/4 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '3s' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href={localePath('/')} className="flex items-center gap-3 flex-shrink-0">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href={localePath('/')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('home')}</Link>
              <Link href={localePath('/predictions')} className="text-emerald-400 text-sm font-medium">{t('predictions')}</Link>
              <Link href={localePath('/leagues')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('leagues')}</Link>
              <Link href={localePath('/performance')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('performance')}</Link>
              <Link href={localePath('/community')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
              <Link href={localePath('/news')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('news')}</Link>
              <Link href={localePath('/solution')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('solution')}</Link>
              <Link href={localePath('/pricing')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer"
                >
                  <FlagIcon code={locale} size={20} />
                  <span className="font-medium uppercase">{locale === 'zh' ? '中文' : locale.toUpperCase()}</span>
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
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                    {locales.map((loc) => (
                      <Link
                        key={loc}
                        href={getLocaleUrl(loc)}
                        className={`block w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${
                          locale === loc ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'
                        }`}
                      >
                        <FlagIcon code={loc} size={20} />
                        <span className="font-medium">{localeNames[loc]}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {user ? (
                <Link href={localePath('/dashboard')} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href={localePath('/login')} className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href={localePath('/get-started')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer hidden sm:block">{t('getStarted')}</Link>
                </>
              )}

              {/* World Cup Special Button */}
              <Link
                href={localePath('/worldcup')}
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
              <Link
                href={localePath('/worldcup')}
                onClick={() => setMobileMenuOpen(false)}
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-8 w-auto object-contain relative z-10" />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
              </Link>

              {[
                { href: localePath('/'), label: t('home') },
                { href: localePath('/predictions'), label: t('predictions'), active: true },
                { href: localePath('/leagues'), label: t('leagues') },
                { href: localePath('/performance'), label: t('performance') },
                { href: localePath('/community'), label: t('community') },
                { href: localePath('/news'), label: t('news') },
                { href: localePath('/solution'), label: t('solution') },
                { href: localePath('/pricing'), label: t('pricing') },
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
                    href={localePath('/login')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href={localePath('/get-started')}
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

      {/* Spacer for fixed navbar + date bar */}
      <div className="h-[132px]"></div>

      {/* Date Selector - Fixed below navbar */}
      <div className="fixed top-16 left-0 right-0 z-40">
        <div className="relative bg-gradient-to-r from-[#0a0a0f]/95 via-[#0d1117]/95 to-[#0a0a0f]/95 backdrop-blur-sm border-b border-emerald-500/20 overflow-hidden">
          {/* Animated glow effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[100px] bg-emerald-500/20 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[120px] bg-cyan-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[100px] bg-teal-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          {/* Bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
            {/* Mobile: Only show 3 dates (Yesterday, Today, Tomorrow) */}
            <div className="flex md:hidden items-center justify-center gap-1">
              {dates.filter((_, index) => index >= 2 && index <= 4).map((date, index) => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);
                const label = formatDateLabelTranslated(date, today);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`
                      relative px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300
                      ${isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                      ${isToday && !isSelected ? 'text-emerald-400' : ''}
                    `}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Desktop: Show all 7 dates */}
            <div className="hidden md:flex items-center justify-center gap-3">
              {dates.map((date, index) => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);
                const label = formatDateLabelTranslated(date, today);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`
                      relative px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300
                      ${isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/30 scale-105'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-emerald-500/20'
                      }
                      ${isToday && !isSelected ? 'text-emerald-400 border border-emerald-500/30' : ''}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 blur-xl opacity-50 -z-10" />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {getPredictionTitle()}
            </span>
          </h1>
          <p className="text-gray-400">
            {t('todaysMatches')}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}

        {/* No Matches */}
        {!loading && matches.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('noMatches')}</h3>
            <p className="text-gray-500">{t('noMatches')}</p>
          </div>
        )}

        {/* Matches by League */}
        {!loading && Object.keys(matchesByLeague).length > 0 && (
          <div className="space-y-6">
            {Object.entries(matchesByLeague).map(([leagueName, { logo, matches: leagueMatches }]) => (
              <div key={leagueName} className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 overflow-hidden">
                {/* League Header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-white/5 border-b border-white/5">
                  {logo && (
                    <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center">
                      <img src={logo} alt={leagueName} className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  <h3 className="font-semibold text-white">{getLeagueNameLocalized(leagueName)}</h3>
                  <span className="text-xs text-gray-500 ml-auto">{leagueMatches.length} {t('matches')}</span>
                </div>

                {/* Matches */}
                <div className="divide-y divide-white/5">
                  {leagueMatches.map((match, index) => {
                    // Generate SEO-friendly URL slug
                    const matchSlug = `${generateMatchSlug(match.home_name, match.away_name)}-${match.fixture_id}`;
                    const matchDate = formatDateForQuery(selectedDate);

                    return (
                    <Link
                      href={localePath(`/predictions/${matchDate}/${matchSlug}`)}
                      key={match.id}
                      onClick={(e) => handleMatchClick(e, match.id)}
                      target={user ? "_blank" : undefined}
                      rel={user ? "noopener noreferrer" : undefined}
                      className={`block transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                        match.type === 'In Play'
                          ? 'bg-red-500/5 hover:bg-red-500/10 border-l-2 border-red-500'
                          : 'hover:bg-emerald-500/5'
                      }`}
                    >
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                      {/* Glow border effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                      </div>
                      {/* Live Match Glow */}
                      {match.type === 'In Play' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-transparent animate-pulse pointer-events-none" />
                      )}

                      {/* Mobile Layout */}
                      <div className="md:hidden p-4 space-y-3">
                        {/* Time Row */}
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
                          ) : match.type === 'Postponed' ? (
                            <span className="text-amber-500 font-medium text-xs">PPD</span>
                          ) : match.type === 'Cancelled' ? (
                            <span className="text-red-500 font-medium text-xs">CAN</span>
                          ) : match.type === 'Abandoned' ? (
                            <span className="text-orange-500 font-medium text-xs">ABD</span>
                          ) : match.type === 'Not Played' ? (
                            <span className="text-gray-500 font-medium text-xs">N/P</span>
                          ) : (
                            <span className="text-emerald-400 font-mono text-sm font-medium">
                              {formatTime(match.start_date_msia)}
                            </span>
                          )}
                        </div>

                        {/* Teams Row */}
                        <div className="flex items-center justify-between gap-2">
                          {/* Home Team */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {match.home_logo && (
                              <div className="w-8 h-8 rounded-full bg-white p-0.5 flex-shrink-0">
                                <img src={match.home_logo} alt="" className="w-full h-full object-contain" />
                              </div>
                            )}
                            <span className="text-white font-medium text-sm truncate">{getTeamNameLocalized(match.home_name)}</span>
                          </div>

                          {/* VS / Score */}
                          {(match.type === 'Finished' || match.type === 'In Play') ? (
                            <div className={`px-3 py-1 rounded-lg text-sm font-bold flex-shrink-0 ${
                              match.type === 'In Play'
                                ? 'bg-red-500/20 text-white'
                                : 'bg-gray-700/50 text-gray-300'
                            }`}>
                              {match.goals_home ?? 0} - {match.goals_away ?? 0}
                            </div>
                          ) : (
                            <span className="text-gray-600 text-xs font-medium flex-shrink-0">vs</span>
                          )}

                          {/* Away Team */}
                          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                            <span className="text-white font-medium text-sm truncate text-right">{getTeamNameLocalized(match.away_name)}</span>
                            {match.away_logo && (
                              <div className="w-8 h-8 rounded-full bg-white p-0.5 flex-shrink-0">
                                <img src={match.away_logo} alt="" className="w-full h-full object-contain" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* AI Prediction Info - Only for Scheduled/In Play */}
                        {match.type !== 'Finished' && predictions[match.fixture_id] && (
                          <div className="flex flex-col gap-2 text-xs">
                            {/* Predicted Winner */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                              <span className="text-amber-400">🏆</span>
                              <span className="text-emerald-400 font-semibold truncate">
                                {predictions[match.fixture_id].winner_name
                                  ? getTeamNameLocalized(predictions[match.fixture_id].winner_name!)
                                  : t('draw')}
                              </span>
                            </div>
                            {/* Win Probabilities */}
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-center">
                                <span className="text-blue-400 font-bold text-[11px]">
                                  {predictions[match.fixture_id].prob_home ? `${Math.round(predictions[match.fixture_id].prob_home!)}%` : '-'}
                                </span>
                              </div>
                              <div className="flex-1 px-2 py-1 rounded bg-gray-500/10 border border-gray-500/20 text-center">
                                <span className="text-gray-400 font-bold text-[11px]">
                                  {predictions[match.fixture_id].prob_draw ? `${Math.round(predictions[match.fixture_id].prob_draw!)}%` : '-'}
                                </span>
                              </div>
                              <div className="flex-1 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-center">
                                <span className="text-green-400 font-bold text-[11px]">
                                  {predictions[match.fixture_id].prob_away ? `${Math.round(predictions[match.fixture_id].prob_away!)}%` : '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center px-5 py-4">
                        {/* Time / Live / Finished Indicator */}
                        <div className="col-span-1">
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
                          ) : match.type === 'Postponed' ? (
                            <span className="text-amber-500 font-medium text-xs">PPD</span>
                          ) : match.type === 'Cancelled' ? (
                            <span className="text-red-500 font-medium text-xs">CAN</span>
                          ) : match.type === 'Abandoned' ? (
                            <span className="text-orange-500 font-medium text-xs">ABD</span>
                          ) : match.type === 'Not Played' ? (
                            <span className="text-gray-500 font-medium text-xs">N/P</span>
                          ) : (
                            <span className="text-emerald-400 font-mono text-sm font-medium">
                              {formatTime(match.start_date_msia)}
                            </span>
                          )}
                        </div>

                        {/* Teams */}
                        <div className="col-span-7">
                          <div className="flex items-center gap-3">
                            {/* Home Team */}
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className="text-white font-medium text-sm text-right truncate">{getTeamNameLocalized(match.home_name)}</span>
                              {match.home_logo && (
                                <div className="w-7 h-7 rounded-full bg-white p-0.5 flex-shrink-0">
                                  <img src={match.home_logo} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}
                            </div>

                            {/* VS / Score */}
                            {(match.type === 'Finished' || match.type === 'In Play') ? (
                              <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                match.type === 'In Play'
                                  ? 'bg-red-500/20 text-white'
                                  : 'bg-gray-700/50 text-gray-300'
                              }`}>
                                {match.goals_home ?? 0} - {match.goals_away ?? 0}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-xs font-medium px-2">vs</span>
                            )}

                            {/* Away Team */}
                            <div className="flex items-center gap-2 flex-1">
                              {match.away_logo && (
                                <div className="w-7 h-7 rounded-full bg-white p-0.5 flex-shrink-0">
                                  <img src={match.away_logo} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}
                              <span className="text-white font-medium text-sm truncate">{getTeamNameLocalized(match.away_name)}</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Prediction - Only for Scheduled/In Play */}
                        <div className="col-span-4 text-right">
                          {match.type !== 'Finished' && predictions[match.fixture_id] ? (
                            <div className="inline-flex items-center gap-2 text-xs">
                              {/* Predicted Winner */}
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                                <span className="text-amber-400">🏆</span>
                                <span className="text-emerald-400 font-semibold truncate max-w-[100px]">
                                  {predictions[match.fixture_id].winner_name
                                    ? getTeamNameLocalized(predictions[match.fixture_id].winner_name!)
                                    : t('draw')}
                                </span>
                              </div>
                              {/* Win Probabilities */}
                              <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <div className="px-1.5 py-0.5 rounded bg-blue-500/20 text-center">
                                  <span className="text-blue-400 font-bold text-[10px]">
                                    {predictions[match.fixture_id].prob_home ? `${Math.round(predictions[match.fixture_id].prob_home!)}%` : '-'}
                                  </span>
                                </div>
                                <div className="px-1.5 py-0.5 rounded bg-gray-500/20 text-center">
                                  <span className="text-gray-400 font-bold text-[10px]">
                                    {predictions[match.fixture_id].prob_draw ? `${Math.round(predictions[match.fixture_id].prob_draw!)}%` : '-'}
                                  </span>
                                </div>
                                <div className="px-1.5 py-0.5 rounded bg-green-500/20 text-center">
                                  <span className="text-green-400 font-bold text-[10px]">
                                    {predictions[match.fixture_id].prob_away ? `${Math.round(predictions[match.fixture_id].prob_away!)}%` : '-'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>{t('allRights')} {t('footer')}</p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {selectedLang === '中文' ? '登录以查看预测' :
               selectedLang === '繁體' ? '登入以查看預測' :
               selectedLang === 'JA' ? 'ログインして予測を見る' :
               selectedLang === 'KO' ? '예측을 보려면 로그인하세요' :
               selectedLang === 'ES' ? 'Inicia sesión para ver predicciones' :
               selectedLang === 'PT' ? 'Faça login para ver previsões' :
               selectedLang === 'DE' ? 'Anmelden um Vorhersagen zu sehen' :
               selectedLang === 'FR' ? 'Connectez-vous pour voir les prédictions' :
               'Sign in to view predictions'}
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-center mb-8">
              {selectedLang === '中文' ? '创建免费账户或登录以访问AI预测和分析' :
               selectedLang === '繁體' ? '創建免費帳戶或登入以訪問AI預測和分析' :
               selectedLang === 'JA' ? '無料アカウントを作成するかログインしてAI予測と分析にアクセス' :
               selectedLang === 'KO' ? '무료 계정을 만들거나 로그인하여 AI 예측 및 분석에 액세스하세요' :
               selectedLang === 'ES' ? 'Crea una cuenta gratis o inicia sesión para acceder a predicciones y análisis de IA' :
               selectedLang === 'PT' ? 'Crie uma conta gratuita ou faça login para acessar previsões e análises de IA' :
               selectedLang === 'DE' ? 'Erstellen Sie ein kostenloses Konto oder melden Sie sich an, um auf KI-Vorhersagen zuzugreifen' :
               selectedLang === 'FR' ? 'Créez un compte gratuit ou connectez-vous pour accéder aux prédictions IA' :
               'Create a free account or sign in to access AI predictions and analysis'}
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <Link
                href={localePath('/get-started')}
                className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                onClick={() => setShowLoginModal(false)}
              >
                {selectedLang === '中文' ? '免费注册' :
                 selectedLang === '繁體' ? '免費註冊' :
                 selectedLang === 'JA' ? '無料で登録' :
                 selectedLang === 'KO' ? '무료 가입' :
                 selectedLang === 'ES' ? 'Registrarse gratis' :
                 selectedLang === 'PT' ? 'Cadastre-se grátis' :
                 selectedLang === 'DE' ? 'Kostenlos registrieren' :
                 selectedLang === 'FR' ? "S'inscrire gratuitement" :
                 'Sign Up Free'}
              </Link>
              <Link
                href={localePath('/login')}
                className="block w-full py-3 px-4 rounded-xl border border-white/20 text-white font-semibold text-center hover:bg-white/10 transition-all"
                onClick={() => setShowLoginModal(false)}
              >
                {selectedLang === '中文' ? '已有账户？登录' :
                 selectedLang === '繁體' ? '已有帳戶？登入' :
                 selectedLang === 'JA' ? 'アカウントをお持ちですか？ログイン' :
                 selectedLang === 'KO' ? '이미 계정이 있으신가요? 로그인' :
                 selectedLang === 'ES' ? '¿Ya tienes cuenta? Iniciar sesión' :
                 selectedLang === 'PT' ? 'Já tem conta? Entrar' :
                 selectedLang === 'DE' ? 'Bereits ein Konto? Anmelden' :
                 selectedLang === 'FR' ? 'Déjà un compte? Se connecter' :
                 'Already have an account? Log In'}
              </Link>
            </div>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{selectedLang === '中文' ? '7天免费试用' : selectedLang === '繁體' ? '7天免費試用' : '7-day free trial'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{selectedLang === '中文' ? 'AI驱动的预测' : selectedLang === '繁體' ? 'AI驅動的預測' : 'AI-powered predictions'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{selectedLang === '中文' ? '实时赔率分析' : selectedLang === '繁體' ? '實時賠率分析' : 'Real-time odds analysis'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading fallback component
export function PredictionsLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Props interface for server-side data
interface PredictionsClientProps {
  initialMatches?: Prematch[];
  initialPredictions?: Record<number, MatchPrediction>;
  initialDate?: string;
}

// Main client component - wrapped with Suspense to fix useSearchParams issue
export default function PredictionsClient({
  initialMatches,
  initialPredictions,
  initialDate,
}: PredictionsClientProps = {}) {
  return (
    <Suspense fallback={<PredictionsLoading />}>
      <PredictionsContent
        initialMatches={initialMatches}
        initialPredictions={initialPredictions}
        initialDate={initialDate}
      />
    </Suspense>
  );
}
