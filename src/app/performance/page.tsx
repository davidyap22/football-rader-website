'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from 'recharts';

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
    performance: "AI Performance",
    performanceSubtitle: "Transparent AI betting results with verified track record. Is AI betting profitable? See our safest AI football tips performance.",
    totalProfit: "Total Profit",
    winRate: "Win Rate",
    totalBets: "Total Bets",
    roi: "ROI",
    profitByMarket: "Profit by Market",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    yearlyPerformance: "Yearly Performance",
    pastMatches: "Past Matches",
    allLeagues: "All Leagues",
    noMatches: "No matches found",
    loading: "Loading...",
    home: "Home", predictions: "Predictions", leagues: "Leagues", community: "Community", news: "News", pricing: "Pricing",
    login: "Log In", getStarted: "Get Started",
    footer: "18+ | Gambling involves risk. Please gamble responsibly.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
    units: "units",
    invested: "Invested",
    bets: "Bets",
    cumulativeProfit: "Cumulative Profit",
  },
  ES: {
    performance: "Rendimiento",
    performanceSubtitle: "Rastrea la precisión de nuestras predicciones de IA en las principales ligas",
    totalProfit: "Ganancia Total",
    winRate: "Tasa de Acierto",
    totalBets: "Apuestas Totales",
    roi: "ROI",
    profitByMarket: "Ganancia por Mercado",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    yearlyPerformance: "Rendimiento Anual",
    pastMatches: "Partidos Pasados",
    allLeagues: "Todas las Ligas",
    noMatches: "No se encontraron partidos",
    loading: "Cargando...",
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", community: "Comunidad", news: "Noticias", pricing: "Precios",
    login: "Iniciar Sesión", getStarted: "Comenzar",
    footer: "18+ | El juego implica riesgo. Por favor juega responsablemente.",
    allRights: "© 2025 OddsFlow. Todos los derechos reservados.",
    units: "unidades",
    invested: "Invertido",
    bets: "Apuestas",
    cumulativeProfit: "Ganancia Acumulada",
  },
  PT: {
    performance: "Desempenho",
    performanceSubtitle: "Acompanhe a precisão das nossas previsões de IA nas principais ligas",
    totalProfit: "Lucro Total",
    winRate: "Taxa de Acerto",
    totalBets: "Apostas Totais",
    roi: "ROI",
    profitByMarket: "Lucro por Mercado",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    yearlyPerformance: "Desempenho Anual",
    pastMatches: "Partidas Passadas",
    allLeagues: "Todas as Ligas",
    noMatches: "Nenhuma partida encontrada",
    loading: "Carregando...",
    home: "Início", predictions: "Previsões", leagues: "Ligas", community: "Comunidade", news: "Notícias", pricing: "Preços",
    login: "Entrar", getStarted: "Começar",
    footer: "18+ | O jogo envolve risco. Por favor, jogue com responsabilidade.",
    allRights: "© 2025 OddsFlow. Todos os direitos reservados.",
    units: "unidades",
    invested: "Investido",
    bets: "Apostas",
    cumulativeProfit: "Lucro Acumulado",
  },
  DE: {
    performance: "Leistung",
    performanceSubtitle: "Verfolgen Sie die Genauigkeit unserer KI-Vorhersagen in den großen Ligen",
    totalProfit: "Gesamtgewinn",
    winRate: "Gewinnrate",
    totalBets: "Gesamtwetten",
    roi: "ROI",
    profitByMarket: "Gewinn nach Markt",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    yearlyPerformance: "Jahresleistung",
    pastMatches: "Vergangene Spiele",
    allLeagues: "Alle Ligen",
    noMatches: "Keine Spiele gefunden",
    loading: "Laden...",
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", community: "Community", news: "Nachrichten", pricing: "Preise",
    login: "Anmelden", getStarted: "Loslegen",
    footer: "18+ | Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    allRights: "© 2025 OddsFlow. Alle Rechte vorbehalten.",
    units: "Einheiten",
    invested: "Investiert",
    bets: "Wetten",
    cumulativeProfit: "Kumulierter Gewinn",
  },
  FR: {
    performance: "AI Performance",
    performanceSubtitle: "Suivez la précision de nos prédictions IA dans les grandes ligues",
    totalProfit: "Profit Total",
    winRate: "Taux de Réussite",
    totalBets: "Paris Totaux",
    roi: "ROI",
    profitByMarket: "Profit par Marché",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    yearlyPerformance: "Performance Annuelle",
    pastMatches: "Matchs Passés",
    allLeagues: "Toutes les Ligues",
    noMatches: "Aucun match trouvé",
    loading: "Chargement...",
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", community: "Communauté", news: "Actualités", pricing: "Tarifs",
    login: "Connexion", getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez de manière responsable.",
    allRights: "© 2025 OddsFlow. Tous droits réservés.",
    units: "unités",
    invested: "Investi",
    bets: "Paris",
    cumulativeProfit: "Profit Cumulé",
  },
  JA: {
    performance: "パフォーマンス",
    performanceSubtitle: "主要リーグでのAI予測精度を追跡",
    totalProfit: "総利益",
    winRate: "勝率",
    totalBets: "総ベット数",
    roi: "ROI",
    profitByMarket: "市場別利益",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    yearlyPerformance: "年間パフォーマンス",
    pastMatches: "過去の試合",
    allLeagues: "全リーグ",
    noMatches: "試合が見つかりません",
    loading: "読み込み中...",
    home: "ホーム", predictions: "予測", leagues: "リーグ", community: "コミュニティ", news: "ニュース", pricing: "料金",
    login: "ログイン", getStarted: "始める",
    footer: "18+ | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2025 OddsFlow. All rights reserved.",
    units: "ユニット",
    invested: "投資額",
    bets: "ベット",
    cumulativeProfit: "累積利益",
  },
  KO: {
    performance: "성과",
    performanceSubtitle: "주요 리그에서 AI 예측 정확도 추적",
    totalProfit: "총 수익",
    winRate: "승률",
    totalBets: "총 베팅",
    roi: "ROI",
    profitByMarket: "시장별 수익",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    yearlyPerformance: "연간 성과",
    pastMatches: "지난 경기",
    allLeagues: "모든 리그",
    noMatches: "경기를 찾을 수 없습니다",
    loading: "로딩 중...",
    home: "홈", predictions: "예측", leagues: "리그", community: "커뮤니티", news: "뉴스", pricing: "가격",
    login: "로그인", getStarted: "시작하기",
    footer: "18+ | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
    units: "유닛",
    invested: "투자",
    bets: "베팅",
    cumulativeProfit: "누적 수익",
  },
  '中文': {
    performance: "表现",
    performanceSubtitle: "追踪我们AI在主要联赛中的预测准确率",
    totalProfit: "总盈利",
    winRate: "胜率",
    totalBets: "总投注",
    roi: "投资回报率",
    profitByMarket: "市场盈利",
    moneyline: "1x2",
    handicap: "让球",
    overUnder: "大小球",
    yearlyPerformance: "年度表现",
    pastMatches: "历史比赛",
    allLeagues: "所有联赛",
    noMatches: "未找到比赛",
    loading: "加载中...",
    home: "首页", predictions: "预测", leagues: "联赛", community: "社区", news: "新闻", pricing: "价格",
    login: "登录", getStarted: "开始使用",
    footer: "18+ | 赌博有风险，请理性参与。",
    allRights: "© 2025 OddsFlow. 保留所有权利。",
    units: "单位",
    invested: "投资",
    bets: "投注",
    cumulativeProfit: "累计盈利",
  },
  '繁體': {
    performance: "表現",
    performanceSubtitle: "追蹤我們AI在主要聯賽中的預測準確率",
    totalProfit: "總盈利",
    winRate: "勝率",
    totalBets: "總投注",
    roi: "投資回報率",
    profitByMarket: "市場盈利",
    moneyline: "1x2",
    handicap: "讓球",
    overUnder: "大小球",
    yearlyPerformance: "年度表現",
    pastMatches: "歷史比賽",
    allLeagues: "所有聯賽",
    noMatches: "未找到比賽",
    loading: "載入中...",
    home: "首頁", predictions: "預測", leagues: "聯賽", community: "社區", news: "新聞", pricing: "價格",
    login: "登入", getStarted: "開始使用",
    footer: "18+ | 賭博有風險，請理性參與。",
    allRights: "© 2025 OddsFlow. 保留所有權利。",
    units: "單位",
    invested: "投資",
    bets: "投注",
    cumulativeProfit: "累計盈利",
  },
};

interface MatchSummary {
  fixture_id: string;
  league_name: string;
  league_logo: string;
  home_name: string;
  home_logo: string;
  away_name: string;
  away_logo: string;
  home_score: number;
  away_score: number;
  total_profit: number;
  total_invested: number;
  roi_percentage: number;
  total_bets: number;
  profit_moneyline: number;
  profit_handicap: number;
  profit_ou: number;
  match_date: string;
}

interface DailyPerformance {
  date: string;
  profit: number;
  cumulative: number;
  cumulativeMoneyline: number;
  cumulativeHandicap: number;
  cumulativeOU: number;
}

interface SignalHistoryItem {
  clock: number;
  signal: string;
  selection: string | null;
  odds1: number;
  odds2: number;
  odds3: number;
  bookmaker: string;
  stacking: string;
  result_status: boolean;
  line?: number;
}

// Animated Counter Component
function AnimatedCounter({
  target,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 2,
  isStarted = false
}: {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isStarted?: boolean;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isStarted) {
      setCount(0);
      return;
    }

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      countRef.current = target * easeOutQuart;
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    startTimeRef.current = null;
    requestAnimationFrame(animate);
  }, [target, duration, isStarted]);

  // Format number with commas
  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimals > 0 ? parts.join('.') : parts[0];
  };

  return (
    <span>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

export default function PerformancePage() {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const [dailyPerformance, setDailyPerformance] = useState<DailyPerformance[]>([]);
  const [availableLeagues, setAvailableLeagues] = useState<string[]>([]);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [overallStats, setOverallStats] = useState({
    totalProfit: 0,
    winRate: 0,
    totalBets: 0,
    roi: 0,
    totalInvested: 0,
    profitMoneyline: 0,
    profitHandicap: 0,
    profitOU: 0,
  });

  // Signal History Modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchSummary | null>(null);
  const [historyTab, setHistoryTab] = useState<'1x2' | 'hdp' | 'ou'>('1x2');
  const [signalHistory, setSignalHistory] = useState<{
    moneyline: SignalHistoryItem[];
    handicap: SignalHistoryItem[];
    overunder: SignalHistoryItem[];
  }>({ moneyline: [], handicap: [], overunder: [] });
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  // Check auth session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setSelectedLang(savedLang);
  }, []);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      // Fetch finished matches from prematches table
      const { data: matchesData, error: matchesError } = await supabase
        .from('prematches')
        .select('fixture_id, league_name, league_logo, home_name, home_logo, away_name, away_logo, goals_home, goals_away, start_date_msia')
        .eq('status_short', 'FT')
        .order('start_date_msia', { ascending: false });

      if (matchesError) throw matchesError;

      // Fetch all profit_summary data
      const { data: profitData, error: profitError } = await supabase
        .from('profit_summary')
        .select('fixture_id, total_profit, total_invested, roi_percentage, total_bets, profit_moneyline, profit_handicap, profit_ou, bet_time')
        .order('bet_time', { ascending: true });

      if (profitError) throw profitError;

      // Create a map of profit data by fixture_id (aggregate multiple rows per fixture)
      const profitMap = new Map<string, {
        total_profit: number;
        total_invested: number;
        total_bets: number;
        profit_moneyline: number;
        profit_handicap: number;
        profit_ou: number;
        bet_time: string;
      }>();

      profitData?.forEach((p: any) => {
        const key = String(p.fixture_id);
        if (!profitMap.has(key)) {
          profitMap.set(key, {
            total_profit: p.total_profit || 0,
            total_invested: p.total_invested || 0,
            total_bets: p.total_bets || 0,
            profit_moneyline: p.profit_moneyline || 0,
            profit_handicap: p.profit_handicap || 0,
            profit_ou: p.profit_ou || 0,
            bet_time: p.bet_time,
          });
        }
      });

      // Combine match data with profit data
      const combinedMatches: MatchSummary[] = matchesData
        ?.filter((m: any) => profitMap.has(String(m.fixture_id)))
        .map((m: any) => {
          const profit = profitMap.get(String(m.fixture_id))!;
          const roi = profit.total_invested > 0 ? (profit.total_profit / profit.total_invested) * 100 : 0;
          return {
            fixture_id: String(m.fixture_id),
            league_name: m.league_name || 'Unknown',
            league_logo: m.league_logo || '',
            home_name: m.home_name || 'Home',
            home_logo: m.home_logo || '',
            away_name: m.away_name || 'Away',
            away_logo: m.away_logo || '',
            home_score: m.goals_home || 0,
            away_score: m.goals_away || 0,
            total_profit: profit.total_profit,
            total_invested: profit.total_invested,
            roi_percentage: roi,
            total_bets: profit.total_bets,
            profit_moneyline: profit.profit_moneyline,
            profit_handicap: profit.profit_handicap,
            profit_ou: profit.profit_ou,
            match_date: m.start_date_msia || profit.bet_time,
          };
        }) || [];

      setMatches(combinedMatches);

      // Get unique leagues
      const leagues = [...new Set(combinedMatches.map(m => m.league_name))];
      setAvailableLeagues(leagues);

      // Calculate overall stats (only count each fixture once)
      let totalProfit = 0;
      let totalBets = 0;
      let totalInvested = 0;
      let wins = 0;
      let profitMoneyline = 0;
      let profitHandicap = 0;
      let profitOU = 0;

      combinedMatches.forEach((m) => {
        totalProfit += m.total_profit;
        totalBets += m.total_bets;
        totalInvested += m.total_invested;
        profitMoneyline += m.profit_moneyline;
        profitHandicap += m.profit_handicap;
        profitOU += m.profit_ou;
        if (m.total_profit > 0) wins++;
      });

      const winRate = combinedMatches.length > 0 ? (wins / combinedMatches.length) * 100 : 0;
      const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

      setOverallStats({
        totalProfit,
        winRate,
        totalBets,
        roi,
        totalInvested,
        profitMoneyline,
        profitHandicap,
        profitOU,
      });

      // Calculate cumulative performance for the full year (by month or by match)
      const sortedMatches = [...combinedMatches].sort((a, b) =>
        new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
      );

      let cumulative = 0;
      let cumulativeML = 0;
      let cumulativeHDP = 0;
      let cumulativeOU = 0;
      const dailyData: DailyPerformance[] = sortedMatches.map((match) => {
        cumulative += match.total_profit;
        cumulativeML += match.profit_moneyline;
        cumulativeHDP += match.profit_handicap;
        cumulativeOU += match.profit_ou;
        return {
          date: match.match_date.split('T')[0],
          profit: match.total_profit,
          cumulative: cumulative,
          cumulativeMoneyline: cumulativeML,
          cumulativeHandicap: cumulativeHDP,
          cumulativeOU: cumulativeOU,
        };
      });

      setDailyPerformance(dailyData);

      // Start animation after data is loaded
      setTimeout(() => {
        setAnimationStarted(true);
      }, 100);

    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('oddsflow_lang', langCode);
    setLangDropdownOpen(false);
  };

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  const filteredMatches = selectedLeague === 'all'
    ? matches
    : matches.filter(m => m.league_name === selectedLeague);

  // Pagination
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);
  const paginatedMatches = filteredMatches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when league filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLeague]);

  // Format match date as "X days ago" or actual date
  const formatMatchDate = (dateStr: string) => {
    const matchDate = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - matchDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Today', isHot: true, daysAgo: 0 };
    if (diffDays === 1) return { text: '1 day ago', isHot: true, daysAgo: 1 };
    if (diffDays === 2) return { text: '2 days ago', isHot: true, daysAgo: 2 };
    if (diffDays === 3) return { text: '3 days ago', isHot: true, daysAgo: 3 };

    // More than 3 days ago - show actual date
    return {
      text: matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isHot: false,
      daysAgo: diffDays
    };
  };

  // Format number with commas
  const formatNumber = (num: number, decimals: number = 2) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimals > 0 ? parts.join('.') : parts[0];
  };

  // Fetch signal history for a match
  const fetchSignalHistory = async (fixtureId: string) => {
    setLoadingHistory(true);
    try {
      // Fetch 1x2 moneyline signals
      const { data: mlData } = await supabase
        .from('moneyline 1x2')
        .select('clock, signal, selection, moneyline_1x2_home, moneyline_1x2_draw, moneyline_1x2_away, bookmaker, stacking_quantity, result_status')
        .eq('fixture_id', parseInt(fixtureId))
        .order('clock', { ascending: false });

      // Fetch handicap signals
      const { data: hdpData } = await supabase
        .from('Handicap')
        .select('clock, signal, selection, line, home_odds, away_odds, bookmaker, stacking_quantity, result_status')
        .eq('fixture_id', parseInt(fixtureId))
        .order('clock', { ascending: false });

      // Fetch over/under signals
      const { data: ouData } = await supabase
        .from('OverUnder')
        .select('clock, signal, selection, line, over, under, bookmaker, stacking_quantity, result_status')
        .eq('fixture_id', parseInt(fixtureId))
        .order('clock', { ascending: false });

      setSignalHistory({
        moneyline: mlData?.map((d: any) => ({
          clock: d.clock,
          signal: d.signal || '-',
          selection: d.selection,
          odds1: d.moneyline_1x2_home,
          odds2: d.moneyline_1x2_draw,
          odds3: d.moneyline_1x2_away,
          bookmaker: d.bookmaker,
          stacking: d.stacking_quantity || '-',
          result_status: d.result_status,
        })) || [],
        handicap: hdpData?.map((d: any) => ({
          clock: d.clock,
          signal: d.signal || '-',
          selection: d.selection,
          odds1: d.home_odds,
          odds2: 0,
          odds3: d.away_odds,
          bookmaker: d.bookmaker,
          stacking: d.stacking_quantity || '-',
          result_status: d.result_status,
          line: d.line,
        })) || [],
        overunder: ouData?.map((d: any) => ({
          clock: d.clock,
          signal: d.signal || '-',
          selection: d.selection,
          odds1: d.over,
          odds2: 0,
          odds3: d.under,
          bookmaker: d.bookmaker,
          stacking: d.stacking_quantity || '-',
          result_status: d.result_status,
          line: d.line,
        })) || [],
      });
    } catch (error) {
      console.error('Error fetching signal history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Open signal history modal
  const openSignalHistory = (match: MatchSummary) => {
    setSelectedMatch(match);
    setHistoryTab('1x2');
    setShowHistoryModal(true);
    fetchSignalHistory(match.fixture_id);
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-xl">
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-400">{entry.name}:</span>
              <span className={entry.value >= 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                {entry.value >= 0 ? '+' : ''}${formatNumber(entry.value, 0)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

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
              <Link href="/leagues" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('leagues')}</Link>
              <Link href="/performance" className="text-emerald-400 text-sm font-medium">{t('performance')}</Link>
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
              <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('news')}</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-3">
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
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
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
                  <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t('performance')}</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('performanceSubtitle')}</p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-emerald-400 font-medium">AI Performance</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm text-cyan-400 font-medium">Transparent AI Betting Results</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-purple-400 font-medium">Safest AI Football Tips</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm text-yellow-400 font-medium">Most Accurate AI Predictor</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              <span className="ml-4 text-gray-400">{t('loading')}</span>
            </div>
          ) : (
            <>
              {/* Overall Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-6">
                  <p className="text-gray-400 text-sm mb-1">{t('totalProfit')}</p>
                  <p className={`text-2xl font-bold ${overallStats.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    <AnimatedCounter
                      target={Math.abs(overallStats.totalProfit)}
                      prefix={overallStats.totalProfit >= 0 ? '+$' : '-$'}
                      isStarted={animationStarted}
                    />
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{t('invested')}: ${formatNumber(overallStats.totalInvested)}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-6">
                  <p className="text-gray-400 text-sm mb-1">{t('winRate')}</p>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter
                      target={overallStats.winRate}
                      suffix="%"
                      decimals={1}
                      isStarted={animationStarted}
                    />
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{matches.length} {t('pastMatches').toLowerCase()}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-6">
                  <p className="text-gray-400 text-sm mb-1">{t('totalBets')}</p>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter
                      target={overallStats.totalBets}
                      decimals={0}
                      isStarted={animationStarted}
                    />
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-6">
                  <p className="text-gray-400 text-sm mb-1">{t('roi')}</p>
                  <p className={`text-2xl font-bold ${overallStats.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    <AnimatedCounter
                      target={overallStats.roi}
                      prefix={overallStats.roi >= 0 ? '+' : ''}
                      suffix="%"
                      decimals={1}
                      isStarted={animationStarted}
                    />
                  </p>
                </div>
              </div>

              {/* Profit by Market */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">{t('profitByMarket')}</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">{t('moneyline')}</p>
                    <p className={`text-xl font-bold ${overallStats.profitMoneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      <AnimatedCounter
                        target={Math.abs(overallStats.profitMoneyline)}
                        prefix={overallStats.profitMoneyline >= 0 ? '+$' : '-$'}
                        isStarted={animationStarted}
                      />
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">{t('handicap')}</p>
                    <p className={`text-xl font-bold ${overallStats.profitHandicap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      <AnimatedCounter
                        target={Math.abs(overallStats.profitHandicap)}
                        prefix={overallStats.profitHandicap >= 0 ? '+$' : '-$'}
                        isStarted={animationStarted}
                      />
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">{t('overUnder')}</p>
                    <p className={`text-xl font-bold ${overallStats.profitOU >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      <AnimatedCounter
                        target={Math.abs(overallStats.profitOU)}
                        prefix={overallStats.profitOU >= 0 ? '+$' : '-$'}
                        isStarted={animationStarted}
                      />
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Line Chart */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-6">{t('yearlyPerformance')}</h2>

                {dailyPerformance.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyPerformance}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorMoneyline" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorHandicap" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorOU" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          width={60}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="top"
                          height={36}
                          iconType="circle"
                          formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeMoneyline"
                          name={t('moneyline')}
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorMoneyline)"
                          dot={false}
                          activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeHandicap"
                          name={t('handicap')}
                          stroke="#06b6d4"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorHandicap)"
                          dot={false}
                          activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeOU"
                          name={t('overUnder')}
                          stroke="#f59e0b"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorOU)"
                          dot={false}
                          activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>

              {/* League Filter */}
              <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedLeague('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedLeague === 'all'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {t('allLeagues')}
                </button>
                {availableLeagues.map((league) => (
                  <button
                    key={league}
                    onClick={() => setSelectedLeague(league)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedLeague === league
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {league}
                  </button>
                ))}
              </div>

              {/* Past Matches - Table Style */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-white/5 border-b border-white/5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="col-span-4">{t('pastMatches')}</div>
                  <div className="col-span-2 text-center">Score</div>
                  <div className="col-span-1 text-right">{t('moneyline')}</div>
                  <div className="col-span-1 text-right">{t('handicap')}</div>
                  <div className="col-span-1 text-right">{t('overUnder')}</div>
                  <div className="col-span-1 text-right">ROI</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {filteredMatches.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">{t('noMatches')}</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {paginatedMatches.map((match, index) => {
                      const dateInfo = formatMatchDate(match.match_date);
                      const isHotMatch = dateInfo.isHot;

                      return (
                      <div
                        key={match.fixture_id}
                        className={`relative grid grid-cols-12 gap-2 px-4 py-3 items-center transition-all ${
                          index % 2 === 0 ? 'bg-white/[0.02]' : ''
                        } ${isHotMatch ? 'hover:bg-emerald-500/10' : 'hover:bg-white/5'}`}
                      >
                        {/* Hot Match Glow Effect */}
                        {isHotMatch && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 animate-pulse pointer-events-none" />
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-r pointer-events-none" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl -z-10 pointer-events-none" />
                          </>
                        )}

                        {/* Match Info */}
                        <div className="col-span-4 relative">
                          <div className="flex items-center gap-2 mb-1">
                            {match.league_logo && (
                              <div className="w-4 h-4 rounded-sm bg-white/90 p-0.5 flex items-center justify-center flex-shrink-0">
                                <img src={match.league_logo} alt="" className="w-full h-full object-contain" />
                              </div>
                            )}
                            <span className="text-[10px] text-emerald-400 font-medium">
                              {match.league_name.length > 12 ? match.league_name.substring(0, 12) : match.league_name}
                            </span>
                            <span className={`text-[10px] flex items-center gap-1 ${
                              dateInfo.isHot
                                ? 'text-emerald-400 font-semibold'
                                : 'text-gray-500'
                            }`}>
                              {dateInfo.isHot && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                              )}
                              {dateInfo.text}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Home Team */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-white/10 p-1 flex items-center justify-center flex-shrink-0">
                                {match.home_logo ? (
                                  <img src={match.home_logo} alt={match.home_name} className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-[10px] font-bold text-white">{(match.home_name || 'H').substring(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <span className="text-sm text-white font-medium truncate">{match.home_name}</span>
                            </div>
                            <span className="text-gray-500 text-xs font-medium">vs</span>
                            {/* Away Team */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-white/10 p-1 flex items-center justify-center flex-shrink-0">
                                {match.away_logo ? (
                                  <img src={match.away_logo} alt={match.away_name} className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-[10px] font-bold text-white">{(match.away_name || 'A').substring(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <span className="text-sm text-white font-medium truncate">{match.away_name}</span>
                            </div>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="col-span-2 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-white/5 rounded-md text-sm font-bold text-white min-w-[60px]">
                            {match.home_score} - {match.away_score}
                          </span>
                        </div>

                        {/* 1x2 */}
                        <div className={`col-span-1 text-right text-sm font-medium ${match.profit_moneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {match.profit_moneyline >= 0 ? '+' : ''}{formatNumber(match.profit_moneyline, 0)}
                        </div>

                        {/* HDP */}
                        <div className={`col-span-1 text-right text-sm font-medium ${match.profit_handicap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {match.profit_handicap >= 0 ? '+' : ''}{formatNumber(match.profit_handicap, 0)}
                        </div>

                        {/* O/U */}
                        <div className={`col-span-1 text-right text-sm font-medium ${match.profit_ou >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {match.profit_ou >= 0 ? '+' : ''}{formatNumber(match.profit_ou, 0)}
                        </div>

                        {/* ROI */}
                        <div className={`col-span-1 text-right text-sm font-medium ${match.roi_percentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {match.roi_percentage >= 0 ? '+' : ''}{match.roi_percentage.toFixed(0)}%
                        </div>

                        {/* Total + View Button */}
                        <div className="col-span-2 flex items-center justify-end gap-2">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-bold min-w-[80px] ${
                            match.total_profit >= 0
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {match.total_profit >= 0 ? '+$' : '-$'}{formatNumber(Math.abs(match.total_profit), 0)}
                          </span>
                          <button
                            onClick={() => openSignalHistory(match)}
                            className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            title="View Signal History"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 p-4 border-t border-white/5">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        currentPage === 1
                          ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first, last, current, and pages around current
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - currentPage) <= 1) return true;
                          return false;
                        })
                        .map((page, index, arr) => (
                          <div key={page} className="flex items-center">
                            {/* Show ellipsis if there's a gap */}
                            {index > 0 && arr[index - 1] < page - 1 && (
                              <span className="px-2 text-gray-600">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                currentPage === page
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        currentPage === totalPages
                          ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Page Info */}
                    <span className="ml-4 text-sm text-gray-500">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredMatches.length)} of {filteredMatches.length}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Signal History Modal */}
      {showHistoryModal && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)} />

          {/* Modal */}
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">Signal History</h3>
                <span className="text-sm text-gray-400">
                  {selectedMatch.home_name} vs {selectedMatch.away_name}
                </span>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setHistoryTab('1x2')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  historyTab === '1x2' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                1X2 ({signalHistory.moneyline.length})
              </button>
              <button
                onClick={() => setHistoryTab('hdp')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  historyTab === 'hdp' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                HDP ({signalHistory.handicap.length})
              </button>
              <button
                onClick={() => setHistoryTab('ou')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  historyTab === 'ou' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                O/U ({signalHistory.overunder.length})
              </button>
            </div>

            {/* Content */}
            <div className="overflow-auto max-h-[60vh]">
              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-800">
                    <tr className="text-xs text-gray-400 uppercase">
                      <th className="px-4 py-3 text-left">Clock</th>
                      <th className="px-4 py-3 text-left">Signal</th>
                      <th className="px-4 py-3 text-left">Selection</th>
                      {historyTab === '1x2' ? (
                        <>
                          <th className="px-4 py-3 text-right">Home</th>
                          <th className="px-4 py-3 text-right">Draw</th>
                          <th className="px-4 py-3 text-right">Away</th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 py-3 text-right">Line</th>
                          <th className="px-4 py-3 text-right">{historyTab === 'hdp' ? 'Home' : 'Over'}</th>
                          <th className="px-4 py-3 text-right">{historyTab === 'hdp' ? 'Away' : 'Under'}</th>
                        </>
                      )}
                      <th className="px-4 py-3 text-left">Bookmaker</th>
                      <th className="px-4 py-3 text-left">Stacking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(historyTab === '1x2' ? signalHistory.moneyline :
                      historyTab === 'hdp' ? signalHistory.handicap :
                      signalHistory.overunder
                    ).map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-sm text-white font-medium">{item.clock}&apos;</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            item.signal.includes('ENTRY') ? 'bg-emerald-500/20 text-emerald-400' :
                            item.signal.includes('HOLD') ? 'bg-cyan-500/20 text-cyan-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {item.signal.replace(/🟢|🔵|🔴/g, '').trim() || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">{item.selection || '-'}</td>
                        {historyTab === '1x2' ? (
                          <>
                            <td className="px-4 py-3 text-sm text-cyan-400 text-right">{item.odds1?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-cyan-400 text-right">{item.odds2?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-amber-400 text-right">{item.odds3?.toFixed(2)}</td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-sm text-white text-right">{item.line}</td>
                            <td className="px-4 py-3 text-sm text-cyan-400 text-right">{item.odds1?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-amber-400 text-right">{item.odds3?.toFixed(2)}</td>
                          </>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-400">{item.bookmaker}</td>
                        <td className="px-4 py-3 text-sm text-emerald-400">{item.stacking}</td>
                      </tr>
                    ))}
                    {(historyTab === '1x2' ? signalHistory.moneyline :
                      historyTab === 'hdp' ? signalHistory.handicap :
                      signalHistory.overunder
                    ).length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          No signal history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>{t('footer')}</p>
        <p className="mt-2">{t('allRights')}</p>
      </footer>
    </div>
  );
}
