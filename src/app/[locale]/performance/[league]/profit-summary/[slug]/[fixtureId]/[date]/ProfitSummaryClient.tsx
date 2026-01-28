'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { locales, localeNames, type Locale } from '@/i18n/config';
import FlagIcon from '@/components/FlagIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

// Translations
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    profitSummary: 'Profit Summary',
    totalProfit: 'Total Profit',
    roi: 'ROI',
    totalInvested: 'Total Invested',
    totalBets: 'Total Bets',
    profitByMarket: 'Profit by Market',
    moneyline1x2: '1X2 Moneyline',
    asianHandicap: 'Asian Handicap',
    overUnder: 'O/U',
    betDetails: 'Bet Details',
    backToPerformance: 'Back to Performance',
    home: 'Home',
    predictions: 'Predictions',
    leagues: 'Leagues',
    performance: 'Performance',
    community: 'Community',
    news: 'News',
    solution: 'Solution',
    pricing: 'Pricing',
    fullTime: 'Full Time',
    homeTeam: 'HOME',
    awayTeam: 'AWAY',
    win: 'WIN',
    viewDetails: 'View Details',
    hdpSniper: 'HDP Sniper',
    activeTrader: 'Active Trader',
    oddsflowCore: 'Oddsflow Core',
    oddsflowBeta: 'Oddsflow Beta',
    allModels: 'All Models',
    comingSoon: 'COMING SOON',
    moneylineOddsChart: '1X2 Moneyline Odds',
    hdpOddsChart: 'Asian Handicap Odds',
    ouOddsChart: 'Over/Under Odds',
    away: 'Away',
    draw: 'Draw',
    homeChart: 'Home',
    line: 'Line',
    over: 'Over',
    under: 'Under',
  },
  es: {
    profitSummary: 'Resumen de Ganancias',
    totalProfit: 'Ganancia Total',
    roi: 'ROI',
    totalInvested: 'Total Invertido',
    totalBets: 'Total Apuestas',
    profitByMarket: 'Ganancia por Mercado',
    moneyline1x2: '1X2 Ganador',
    asianHandicap: 'Handicap Asiatico',
    overUnder: 'Mas/Menos',
    betDetails: 'Detalles de Apuestas',
    backToPerformance: 'Volver a Rendimiento',
    home: 'Inicio',
    predictions: 'Predicciones',
    leagues: 'Ligas',
    performance: 'Rendimiento',
    community: 'Comunidad',
    news: 'Noticias',
    solution: 'Solucion',
    pricing: 'Precios',
    fullTime: 'Tiempo Completo',
    homeTeam: 'LOCAL',
    awayTeam: 'VISITANTE',
    win: 'VICTORIA',
    viewDetails: 'Ver Detalles',
    hdpSniper: 'Francotirador HDP',
    activeTrader: 'Comerciante Activo',
    oddsflowCore: 'Oddsflow Core',
    oddsflowBeta: 'Oddsflow Beta',
    allModels: 'Todos los Modelos',
    comingSoon: 'PRÓXIMAMENTE',
    moneylineOddsChart: 'Cuotas Moneyline 1X2',
    hdpOddsChart: 'Cuotas Handicap Asiático',
    ouOddsChart: 'Cuotas Más/Menos',
    away: 'Visitante',
    draw: 'Empate',
    homeChart: 'Local',
    line: 'Línea',
    over: 'Más',
    under: 'Menos',
  },
  pt: {
    profitSummary: 'Resumo de Lucros',
    totalProfit: 'Lucro Total',
    roi: 'ROI',
    totalInvested: 'Total Investido',
    totalBets: 'Total de Apostas',
    profitByMarket: 'Lucro por Mercado',
    moneyline1x2: '1X2 Vencedor',
    asianHandicap: 'Handicap Asiatico',
    overUnder: 'Mais/Menos',
    betDetails: 'Detalhes das Apostas',
    backToPerformance: 'Voltar ao Desempenho',
    home: 'Inicio',
    predictions: 'Previsoes',
    leagues: 'Ligas',
    performance: 'Desempenho',
    community: 'Comunidade',
    news: 'Noticias',
    solution: 'Solucao',
    pricing: 'Precos',
    fullTime: 'Tempo Integral',
    homeTeam: 'CASA',
    awayTeam: 'FORA',
    win: 'VITORIA',
    viewDetails: 'Ver Detalhes',
    hdpSniper: 'Atirador HDP',
    activeTrader: 'Trader Ativo',
    oddsflowCore: 'Oddsflow Core',
    oddsflowBeta: 'Oddsflow Beta',
    allModels: 'Todos os Modelos',
    comingSoon: 'EM BREVE',
    moneylineOddsChart: 'Odds Moneyline 1X2',
    hdpOddsChart: 'Odds Handicap Asiático',
    ouOddsChart: 'Odds Mais/Menos',
    away: 'Fora',
    draw: 'Empate',
    homeChart: 'Casa',
    line: 'Linha',
    over: 'Mais',
    under: 'Menos',
  },
  de: {
    profitSummary: 'Gewinnubersicht',
    totalProfit: 'Gesamtgewinn',
    roi: 'ROI',
    totalInvested: 'Gesamtinvestition',
    totalBets: 'Gesamtwetten',
    profitByMarket: 'Gewinn nach Markt',
    moneyline1x2: '1X2 Sieger',
    asianHandicap: 'Asian Handicap',
    overUnder: 'Uber/Unter',
    betDetails: 'Wettdetails',
    backToPerformance: 'Zuruck zur Leistung',
    home: 'Startseite',
    predictions: 'Vorhersagen',
    leagues: 'Ligen',
    performance: 'Leistung',
    community: 'Community',
    news: 'Nachrichten',
    solution: 'Losung',
    pricing: 'Preise',
    fullTime: 'Vollzeit',
    homeTeam: 'HEIM',
    awayTeam: 'AUSWARTS',
    win: 'SIEG',
    viewDetails: 'Details Anzeigen',
    hdpSniper: 'HDP Scharfschutze',
    activeTrader: 'Aktiver Handler',
    oddsflowCore: 'Oddsflow Core',
    oddsflowBeta: 'Oddsflow Beta',
    allModels: 'Alle Modelle',
    comingSoon: 'DEMNACHST',
    moneylineOddsChart: '1X2 Moneyline Quoten',
    hdpOddsChart: 'Asian Handicap Quoten',
    ouOddsChart: 'Uber/Unter Quoten',
    away: 'Auswarts',
    draw: 'Unentschieden',
    homeChart: 'Heim',
    line: 'Linie',
    over: 'Uber',
    under: 'Unter',
  },
  fr: {
    profitSummary: 'Resume des Profits',
    totalProfit: 'Profit Total',
    roi: 'ROI',
    totalInvested: 'Total Investi',
    totalBets: 'Total des Paris',
    profitByMarket: 'Profit par Marche',
    moneyline1x2: '1X2 Gagnant',
    asianHandicap: 'Handicap Asiatique',
    overUnder: 'Plus/Moins',
    betDetails: 'Details des Paris',
    backToPerformance: 'Retour a Performance',
    home: 'Accueil',
    predictions: 'Predictions',
    leagues: 'Ligues',
    performance: 'Performance',
    community: 'Communaute',
    news: 'Actualites',
    solution: 'Solution',
    pricing: 'Tarifs',
    fullTime: 'Temps Plein',
    homeTeam: 'DOMICILE',
    awayTeam: 'EXTERIEUR',
    win: 'VICTOIRE',
    viewDetails: 'Voir Détails',
    hdpSniper: 'Tireur HDP',
    activeTrader: 'Trader Actif',
    oddsflowCore: 'Oddsflow Core',
    oddsflowBeta: 'Oddsflow Beta',
    allModels: 'Tous les Modèles',
    comingSoon: 'BIENTÔT DISPONIBLE',
    moneylineOddsChart: 'Cotes Moneyline 1X2',
    hdpOddsChart: 'Cotes Handicap Asiatique',
    ouOddsChart: 'Cotes Plus/Moins',
    away: 'Extérieur',
    draw: 'Nul',
    homeChart: 'Domicile',
    line: 'Ligne',
    over: 'Plus',
    under: 'Moins',
  },
  ja: {
    profitSummary: '収益サマリー',
    totalProfit: '総収益',
    roi: 'ROI',
    totalInvested: '総投資額',
    totalBets: '総ベット数',
    profitByMarket: '市場別収益',
    moneyline1x2: '1X2 マネーライン',
    asianHandicap: 'アジアンハンディキャップ',
    overUnder: 'オーバー/アンダー',
    betDetails: 'ベット詳細',
    backToPerformance: 'パフォーマンスに戻る',
    home: 'ホーム',
    predictions: '予測',
    leagues: 'リーグ',
    performance: 'パフォーマンス',
    community: 'コミュニティ',
    news: 'ニュース',
    solution: 'ソリューション',
    pricing: '料金',
    fullTime: 'フルタイム',
    homeTeam: 'ホーム',
    awayTeam: 'アウェー',
    win: '勝利',
    viewDetails: '詳細を見る',
    hdpSniper: 'HDP スナイパー',
    activeTrader: 'アクティブトレーダー',
    oddsflowCore: 'Oddsflow コア',
    oddsflowBeta: 'Oddsflow ベータ',
    allModels: '全モデル',
    comingSoon: '近日公開',
    moneylineOddsChart: '1X2 マネーライン オッズ',
    hdpOddsChart: 'アジアンハンディキャップ オッズ',
    ouOddsChart: 'オーバー/アンダー オッズ',
    away: 'アウェー',
    draw: '引き分け',
    homeChart: 'ホーム',
    line: 'ライン',
    over: 'オーバー',
    under: 'アンダー',
  },
  ko: {
    profitSummary: '수익 요약',
    totalProfit: '총 수익',
    roi: 'ROI',
    totalInvested: '총 투자',
    totalBets: '총 베팅',
    profitByMarket: '시장별 수익',
    moneyline1x2: '1X2 머니라인',
    asianHandicap: '아시안 핸디캡',
    overUnder: '오버/언더',
    betDetails: '베팅 상세',
    backToPerformance: '성과로 돌아가기',
    home: '홈',
    predictions: '예측',
    leagues: '리그',
    performance: '성과',
    community: '커뮤니티',
    news: '뉴스',
    solution: '솔루션',
    pricing: '가격',
    fullTime: '풀타임',
    homeTeam: '홈',
    awayTeam: '원정',
    win: '승리',
    viewDetails: '세부정보 보기',
    hdpSniper: 'HDP 스나이퍼',
    activeTrader: '액티브 트레이더',
    oddsflowCore: 'Oddsflow 코어',
    oddsflowBeta: 'Oddsflow 베타',
    allModels: '모든 모델',
    comingSoon: '곧 출시',
    moneylineOddsChart: '1X2 머니라인 배당',
    hdpOddsChart: '아시안 핸디캡 배당',
    ouOddsChart: '오버/언더 배당',
    away: '원정',
    draw: '무승부',
    homeChart: '홈',
    line: '라인',
    over: '오버',
    under: '언더',
  },
  zh: {
    profitSummary: '盈利摘要',
    totalProfit: '总盈利',
    roi: '投资回报率',
    totalInvested: '总投资',
    totalBets: '总投注',
    profitByMarket: '按市场分类盈利',
    moneyline1x2: '1X2 独赢',
    asianHandicap: '亚洲盘',
    overUnder: '大小球',
    betDetails: '投注详情',
    backToPerformance: '返回表现',
    home: '首页',
    predictions: '预测',
    leagues: '联赛',
    performance: '表现',
    community: '社区',
    news: '新闻',
    solution: '解决方案',
    pricing: '定价',
    fullTime: '全场',
    homeTeam: '主队',
    awayTeam: '客队',
    win: '胜',
    viewDetails: '查看详情',
    hdpSniper: '让球狙击手',
    activeTrader: '活跃交易者',
    oddsflowCore: 'Oddsflow 核心策略',
    oddsflowBeta: 'Oddsflow 测试版',
    allModels: '所有风格',
    comingSoon: '即将推出',
    moneylineOddsChart: '1X2 独赢赔率',
    hdpOddsChart: '亚洲盘赔率',
    ouOddsChart: '大小球赔率',
    away: '客队',
    draw: '平局',
    homeChart: '主队',
    line: '盘口',
    over: '大球',
    under: '小球',
  },
  tw: {
    profitSummary: '盈利摘要',
    totalProfit: '總盈利',
    roi: '投資回報率',
    totalInvested: '總投資',
    totalBets: '總投注',
    profitByMarket: '按市場分類盈利',
    moneyline1x2: '1X2 獨贏',
    asianHandicap: '亞洲盤',
    overUnder: '大小球',
    betDetails: '投注詳情',
    backToPerformance: '返回表現',
    home: '首頁',
    predictions: '預測',
    leagues: '聯賽',
    performance: '表現',
    community: '社區',
    news: '新聞',
    solution: '解決方案',
    pricing: '定價',
    fullTime: '全場',
    homeTeam: '主隊',
    awayTeam: '客隊',
    win: '勝',
    viewDetails: '查看詳情',
    hdpSniper: '讓球狙擊手',
    activeTrader: '活躍交易者',
    oddsflowCore: 'Oddsflow 核心策略',
    oddsflowBeta: 'Oddsflow 測試版',
    allModels: '所有風格',
    comingSoon: '即將推出',
    moneylineOddsChart: '1X2 獨贏賠率',
    hdpOddsChart: '亞洲盤賠率',
    ouOddsChart: '大小球賠率',
    away: '客隊',
    draw: '平局',
    homeChart: '主隊',
    line: '盤口',
    over: '大球',
    under: '小球',
  },
  id: {
    profitSummary: 'Ringkasan Keuntungan',
    totalProfit: 'Total Keuntungan',
    roi: 'ROI',
    totalInvested: 'Total Investasi',
    totalBets: 'Total Taruhan',
    profitByMarket: 'Keuntungan per Pasar',
    moneyline1x2: '1X2 Moneyline',
    asianHandicap: 'Asian Handicap',
    overUnder: 'Over/Under',
    betDetails: 'Detail Taruhan',
    backToPerformance: 'Kembali ke Performa',
    home: 'Beranda',
    predictions: 'Prediksi',
    leagues: 'Liga',
    performance: 'Performa',
    community: 'Komunitas',
    news: 'Berita',
    solution: 'Solusi',
    pricing: 'Harga',
    fullTime: 'Penuh Waktu',
    homeTeam: 'TUAN RUMAH',
    awayTeam: 'TANDANG',
    win: 'MENANG',
    viewDetails: 'Lihat Detail',
    hdpSniper: 'Penembak Jitu HDP',
    activeTrader: 'Trader Aktif',
    oddsflowCore: 'Oddsflow Core',
    oddsflowBeta: 'Oddsflow Beta',
    allModels: 'Semua Model',
    comingSoon: 'SEGERA HADIR',
    moneylineOddsChart: 'Odds Moneyline 1X2',
    hdpOddsChart: 'Odds Asian Handicap',
    ouOddsChart: 'Odds Over/Under',
    away: 'Tandang',
    draw: 'Seri',
    homeChart: 'Tuan Rumah',
    line: 'Garis',
    over: 'Over',
    under: 'Under',
  },
};

// Bet styles in display order (database values remain unchanged)
const BET_STYLES = ['Value Hunter', 'Aggressive', 'Balanced', 'Oddsflow Beta v8'];

// Display name mapping (frontend only)
const getBetStyleDisplayName = (style: string) => {
  const mapping: Record<string, string> = {
    'Value Hunter': 'HDP Sniper',
    'Aggressive': 'Active Trader',
    'Balanced': 'Oddsflow Core Strategy',
    'Oddsflow Beta v8': 'Oddsflow Beta',
  };
  return mapping[style] || style;
};

// Get image path for bet style
const getBetStyleImage = (style: string) => {
  const imageMap: Record<string, string> = {
    'Value Hunter': '/performance/HDP Snipper.png',
    'Aggressive': '/performance/Active trader.png',
    'Balanced': '/performance/Oddsflow Core Strategy.png',
    'Oddsflow Beta v8': '/performance/Oddsflow Beta.png',
  };
  return imageMap[style];
};

// Get background color for bet style button
const getBetStyleColor = (style: string) => {
  const colorMap: Record<string, string> = {
    'Value Hunter': 'from-gray-800 to-black',        // Black
    'Aggressive': 'from-sky-400 to-blue-400',        // Light blue
    'Balanced': 'from-green-500 to-green-600',       // Grass green
    'Oddsflow Beta v8': 'from-purple-600 to-purple-700',    // Purple
  };
  return colorMap[style] || 'from-gray-600 to-gray-700';
};

// Get logo background color for bet style
const getBetStyleLogoColor = (style: string) => {
  const colorMap: Record<string, string> = {
    'Value Hunter': 'from-red-500 to-red-600',           // Red
    'Aggressive': 'from-sky-300 to-blue-300',            // Light blue
    'Balanced': 'from-yellow-400 to-amber-500',          // Yellow (unchanged)
    'Oddsflow Beta v8': 'from-yellow-400 to-amber-500',         // Yellow (unchanged)
  };
  return colorMap[style] || 'from-yellow-400 to-amber-500';
};

interface BetRecord {
  id?: number;
  fixture_id: string;
  bet_time?: string | null;
  odds: number | null;
  stake_units?: number | null;
  stake_money: number | null;
  profit: number | null;
  home_score?: number | null;
  away_score?: number | null;
  clock: number | string | null;
  line: number | null;
  league_name?: string | null;
  selection: string | null;
  type: string | null;
  status: string | null;
  bet_style: string | null;
  // Additional fields from live_bets_v8
  signal_id?: string;
  score_home_at_bet?: number;
  score_away_at_bet?: number;
  minute_at_bet?: number;
  expected_value?: number;
  calculated_probability?: number;
  settled_at?: string;
  created_at?: string;
}

interface Props {
  locale: string;
  league: string;
  fixtureId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeScore?: number;
  awayScore?: number;
  leagueName: string;
  leagueLogo?: string;
  betRecords: BetRecord[];
  oddsHistory: any[];
  matchStartTime?: string;
  teamTranslations: Record<string, any>;
  leagueTranslations: Record<string, any>;
}

export default function ProfitSummaryClient({
  locale,
  league,
  fixtureId,
  date,
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  homeScore,
  awayScore,
  leagueName,
  leagueLogo,
  betRecords,
  oddsHistory,
  matchStartTime,
  teamTranslations,
  leagueTranslations,
}: Props) {
  const t = (key: string) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS.en[key] || key;
  const localePath = (path: string) => locale === 'en' ? path : `/${locale}${path}`;

  // Translate team name
  const translateTeamName = (teamName: string): string => {
    if (!teamName) return '';
    const translation = teamTranslations[teamName];
    if (!translation) return teamName;

    // Map locale to database keys
    const localeMap: Record<string, string> = {
      'en': 'en', 'es': 'es', 'pt': 'pt', 'de': 'de', 'fr': 'fr',
      'ja': 'ja', 'ko': 'ko', 'zh': 'zh_cn', 'tw': 'zh_tw', 'id': 'id'
    };

    const dbKey = localeMap[locale] || 'en';
    return translation[dbKey] || teamName;
  };

  // Translate league name
  const translateLeagueName = (leagName: string): string => {
    if (!leagName) return '';
    const translation = leagueTranslations[leagName];
    if (!translation) return leagName;

    // Map locale to database keys
    const localeMap: Record<string, string> = {
      'en': 'en', 'es': 'es', 'pt': 'pt', 'de': 'de', 'fr': 'fr',
      'ja': 'ja', 'ko': 'ko', 'zh': 'zh_cn', 'tw': 'zh_tw', 'id': 'id'
    };

    const dbKey = localeMap[locale] || 'en';
    return translation[dbKey] || leagName;
  };

  // Get translated team and league names
  const homeTeamTranslated = translateTeamName(homeTeam);
  const awayTeamTranslated = translateTeamName(awayTeam);
  const leagueNameTranslated = translateLeagueName(leagueName);

  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [betTypeFilter, setBetTypeFilter] = useState<string>('All');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check auth status
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Calculate match clock (minutes) from timestamp
  const calculateClock = (timestamp: string): number => {
    if (!matchStartTime) return 0;
    const oddsTime = new Date(timestamp).getTime();
    const startTime = new Date(matchStartTime).getTime();
    const diffMinutes = Math.floor((oddsTime - startTime) / 1000 / 60);
    return diffMinutes;
  };

  // Custom Tooltip to show clock
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const clock = calculateClock(label);
      const clockDisplay = clock < 0 ? 'Pre-match' : clock > 90 ? '90+' : `${clock}'`;

      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white text-sm mb-2 font-bold">Clock: {clockDisplay}</p>
          <p className="text-gray-400 text-xs mb-2">{new Date(label).toLocaleString(locale)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Helper to determine bet type
  const getBetType = (record: any): 'moneyline' | 'handicap' | 'ou' => {
    // For live_bets_v8, use the type field directly
    if (record.type) {
      const type = record.type.toUpperCase();
      if (type === 'HANDICAP' || type.includes('HDP')) return 'handicap';
      if (type === 'OVER_UNDER' || type.includes('OVER') || type.includes('UNDER')) return 'ou';
      if (type === '1X2' || type === 'MONEYLINE') return 'moneyline';
    }

    // Fallback to selection-based detection for profit_summary records
    const selection = record.selection;
    if (!selection) return 'ou';
    const sel = selection.toLowerCase();
    if (sel.includes('hdp') || sel.includes('handicap')) return 'handicap';
    if (sel.includes('over') || sel.includes('under')) return 'ou';
    if (/^(home|away)\s*[+-]?\d/.test(sel)) return 'handicap';
    if (sel === 'home' || sel === 'draw' || sel === 'away') return 'moneyline';
    return 'ou';
  };

  // Define 5 models (All Models first, only Core locked, Beta unlocked)
  const models = ['All Models', 'Value Hunter', 'Aggressive', 'Balanced', 'Oddsflow Beta v8'];
  const lockedModels = ['Balanced']; // Only lock Balanced (Oddsflow Core Strategy)

  // Filter odds history - remove data points where any odds > 10
  const filtered1x2Data = oddsHistory.filter((d: any) => {
    const home = d.moneyline_1x2_home || 0;
    const draw = d.moneyline_1x2_draw || 0;
    const away = d.moneyline_1x2_away || 0;
    return home > 0 && home <= 10 && draw > 0 && draw <= 10 && away > 0 && away <= 10;
  });

  const filteredHdpData = oddsHistory.filter((d: any) => {
    const home = d.handicap_home || 0;
    const away = d.handicap_away || 0;
    return home > 0 && home <= 5 && away > 0 && away <= 5;
  });

  const filteredOuData = oddsHistory.filter((d: any) => {
    const over = d.totalpoints_over || 0;
    const under = d.totalpoints_under || 0;
    return over > 0 && over <= 6 && under > 0 && under <= 6;
  });

  // Group bet records by model (bet_style)
  const modelStats = models.map(model => {
    const records = model === 'All Models'
      ? betRecords
      : betRecords.filter(r => r.bet_style === model);

    const totalProfit = records.reduce((sum, r) => sum + (r.profit ?? 0), 0);
    const totalInvested = records.reduce((sum, r) => sum + (r.stake_money ?? 0), 0);
    const totalBets = records.length;
    const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    const profitMoneyline = records.filter(r => getBetType(r) === 'moneyline').reduce((sum, r) => sum + (r.profit ?? 0), 0);
    const profitHandicap = records.filter(r => getBetType(r) === 'handicap').reduce((sum, r) => sum + (r.profit ?? 0), 0);
    const profitOU = records.filter(r => getBetType(r) === 'ou').reduce((sum, r) => sum + (r.profit ?? 0), 0);

    return {
      model,
      totalProfit,
      totalInvested,
      totalBets,
      roi,
      profitMoneyline,
      profitHandicap,
      profitOU,
      records
    };
  });

  const getLocaleUrl = (newLocale: string) => {
    return `/${newLocale}/performance/${league}/profit-summary/${homeTeam.toLowerCase().replace(/\s+/g, '-')}-vs-${awayTeam.toLowerCase().replace(/\s+/g, '-')}/${fixtureId}/${date}`;
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-white relative"
      style={{
        backgroundImage: 'url(/performance/profit_details.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

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
              <Link href={localePath('/predictions')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('predictions')}</Link>
              <Link href={localePath('/leagues')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('leagues')}</Link>
              <Link href={localePath('/performance')} className="text-emerald-400 text-sm font-medium">{t('performance')}</Link>
              <Link href={localePath('/community')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
              <Link href={localePath('/news')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('news')}</Link>
              <Link href={localePath('/solution')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('solution')}</Link>
              <Link href={localePath('/pricing')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer">
                  <FlagIcon code={locale} size={20} />
                  <span className="font-medium">{localeNames[locale as Locale]}</span>
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                      {locales.map((loc) => (
                        <Link key={loc} href={getLocaleUrl(loc)} className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${locale === loc ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'}`}>
                          <FlagIcon code={loc} size={20} />
                          <span className="font-medium">{localeNames[loc]}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* User Account / Auth Buttons */}
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
                  <Link href={localePath('/login')} className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">Log In</Link>
                  <Link href={localePath('/get-started')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer hidden sm:block">Get Started</Link>
                </>
              )}

              {/* FIFA 2026 Button */}
              <Link
                href={localePath('/worldcup')}
                className="relative hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all cursor-pointer group overflow-hidden hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                <img
                  src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png"
                  alt="FIFA World Cup 2026"
                  className="h-5 w-auto object-contain relative z-10"
                />
                <span className="text-black font-semibold text-sm relative z-10">FIFA 2026</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/5 py-4 px-4">
            <div className="flex flex-col gap-2">
              <Link href={localePath('/')} className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400">{t('home')}</Link>
              <Link href={localePath('/predictions')} className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400">{t('predictions')}</Link>
              <Link href={localePath('/leagues')} className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400">{t('leagues')}</Link>
              <Link href={localePath('/performance')} className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400">{t('performance')}</Link>
              <Link href={localePath('/community')} className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400">{t('community')}</Link>
              <Link href={localePath('/news')} className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400">{t('news')}</Link>
              <Link href={localePath('/solution')} className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400">{t('solution')}</Link>
              <Link href={localePath('/pricing')} className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400">{t('pricing')}</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Back button - Full Width */}
        <Link
          href={localePath('/performance')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToPerformance')}
        </Link>

        <div className="max-w-7xl mx-auto">
          {/* Match Score Display */}
          {homeScore != null && awayScore != null && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 p-4 md:p-5 mb-6 relative overflow-hidden">
              {/* Background Image */}
              <div
                className="absolute inset-0 opacity-5 z-0"
                style={{
                  backgroundImage: 'url(/performance/2425_MD33_FCBBMG_JH_093_4gud8JWh_20250512053606.webp)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />

              {/* League Info Header */}
              <div className="flex items-center gap-2 mb-3 relative z-10">
                {leagueLogo && (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white p-1.5 flex items-center justify-center">
                    <img src={leagueLogo} alt={leagueNameTranslated} className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm">
                  <span>{leagueNameTranslated}</span>
                  <span>•</span>
                  <span>{new Date(date).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{new Date(date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false })} GMT+8</span>
                </div>
              </div>

              {/* Match Score Section */}
              <div className="flex items-center justify-between gap-6 md:gap-10 lg:gap-14 relative z-10">
                {/* Home Team */}
                <div className="flex-1 flex flex-col items-center text-center relative">
                  <div className="relative">
                    {homeLogo && (
                      <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white p-2 md:p-3 mb-2 md:mb-3 flex items-center justify-center">
                        <img src={homeLogo} alt={homeTeamTranslated} className="w-full h-full object-contain" />
                      </div>
                    )}
                    {homeScore > awayScore && (
                      <div className="absolute -top-1 -right-1">
                        <span className="px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-white text-xs md:text-sm font-bold uppercase shadow-lg">
                          {t('win')}
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className={`text-base md:text-xl lg:text-2xl font-bold mb-1 ${homeScore > awayScore ? 'text-yellow-400' : 'text-white'}`}>
                    {homeTeamTranslated}
                  </h2>
                  <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">{t('homeTeam')}</span>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3 md:gap-4 lg:gap-5 mb-2">
                    <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">{homeScore}</span>
                    <span className="text-2xl md:text-3xl lg:text-4xl text-gray-600">-</span>
                    <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">{awayScore}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-gray-800 border border-white/10">
                    <span className="text-xs md:text-sm text-gray-400">{t('fullTime')}</span>
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex-1 flex flex-col items-center text-center relative">
                  <div className="relative">
                    {awayLogo && (
                      <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white p-2 md:p-3 mb-2 md:mb-3 flex items-center justify-center">
                        <img src={awayLogo} alt={awayTeamTranslated} className="w-full h-full object-contain" />
                      </div>
                    )}
                    {awayScore > homeScore && (
                      <div className="absolute -top-1 -right-1">
                        <span className="px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-white text-xs md:text-sm font-bold uppercase shadow-lg">
                          {t('win')}
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className={`text-base md:text-xl lg:text-2xl font-bold mb-1 ${awayScore > homeScore ? 'text-yellow-400' : 'text-white'}`}>
                    {awayTeamTranslated}
                  </h2>
                  <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">{t('awayTeam')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Odds History Charts */}
          {oddsHistory && oddsHistory.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              {/* 1X2 Odds Chart */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/10 p-4">
                <h3 className="text-lg font-bold text-white mb-4">{t('moneylineOddsChart')}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filtered1x2Data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="created_at"
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[0, 10]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                    <Line type="monotone" dataKey="moneyline_1x2_home" stroke="#10B981" name={t('homeChart')} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="moneyline_1x2_draw" stroke="#F59E0B" name={t('draw')} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="moneyline_1x2_away" stroke="#EF4444" name={t('away')} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* HDP Odds Chart */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/10 p-4">
                <h3 className="text-lg font-bold text-white mb-4">{t('hdpOddsChart')}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredHdpData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="created_at"
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[0, 5]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                    <Line type="monotone" dataKey="handicap_main_line" stroke="#8B5CF6" name={t('line')} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="handicap_home" stroke="#10B981" name={t('homeChart')} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="handicap_away" stroke="#EF4444" name={t('away')} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* O/U Odds Chart */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/10 p-4">
                <h3 className="text-lg font-bold text-white mb-4">{t('ouOddsChart')}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredOuData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="created_at"
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[0, 6]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                    <Line type="monotone" dataKey="totalpoints_main_line" stroke="#8B5CF6" name={t('line')} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="totalpoints_over" stroke="#10B981" name={t('over')} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="totalpoints_under" stroke="#EF4444" name={t('under')} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Model Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {modelStats.map((stat, index) => {
              const modelName = stat.model === 'Value Hunter' ? t('hdpSniper')
                : stat.model === 'Aggressive' ? t('activeTrader')
                : stat.model === 'Balanced' ? t('oddsflowCore')
                : stat.model === 'Oddsflow Beta v8' ? t('oddsflowBeta')
                : t('allModels');

              const isLocked = lockedModels.includes(stat.model);

              // Get background image for each model
              const bgImage = stat.model === 'All Models' ? '/performance/AllModels.png'
                : stat.model === 'Value Hunter' ? '/performance/Hdp-snipper.png'
                : stat.model === 'Aggressive' ? '/performance/Active-trader.png'
                : stat.model === 'Balanced' ? '/performance/Oddsflow-core-strategic.png'
                : stat.model === 'Oddsflow Beta v8' ? '/performance/Oddsflow-beta.png'
                : '';

              return (
                <div key={index} className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/10 p-4 relative overflow-hidden">
                  {/* Background Image with 5% opacity */}
                  <div
                    className="absolute inset-0 opacity-5 z-0"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />

                  {/* Coming Soon Badge for locked models */}
                  {isLocked && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <span className="px-2 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase shadow-lg">
                        {t('comingSoon')}
                      </span>
                    </div>
                  )}

                  {/* Content overlay */}
                  <div className="relative z-10">
                    {/* Model Title */}
                    <h3 className="text-lg font-bold text-white mb-4">{modelName}</h3>

                    {/* Stats Grid */}
                    <div className="space-y-3">
                    {/* Total Profit */}
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('totalProfit')}</div>
                      <div className={`text-xl font-bold ${stat.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.totalProfit >= 0 ? '+' : ''}{stat.totalProfit.toFixed(2)}
                      </div>
                    </div>

                    {/* ROI */}
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('roi')}</div>
                      <div className={`text-xl font-bold ${stat.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.roi >= 0 ? '+' : ''}{stat.roi.toFixed(2)}%
                      </div>
                    </div>

                    {/* Total Invested */}
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('totalInvested')}</div>
                      <div className="text-lg font-bold text-white">${stat.totalInvested.toFixed(2)}</div>
                    </div>

                    {/* Total Bets */}
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('totalBets')}</div>
                      <div className="text-lg font-bold text-white">{stat.totalBets}</div>
                    </div>

                    {/* Profit by Market */}
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t('profitByMarket')}</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                            <span className="text-sm text-gray-300">{t('moneyline1x2')}</span>
                          </div>
                          <span className={`text-sm font-bold ${stat.profitMoneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {stat.profitMoneyline >= 0 ? '+' : ''}{stat.profitMoneyline.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-sm text-gray-300">{t('asianHandicap')}</span>
                          </div>
                          <span className={`text-sm font-bold ${stat.profitHandicap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {stat.profitHandicap >= 0 ? '+' : ''}{stat.profitHandicap.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-sm text-gray-300">{t('overUnder')}</span>
                          </div>
                          <span className={`text-sm font-bold ${stat.profitOU >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {stat.profitOU >= 0 ? '+' : ''}{stat.profitOU.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                      {/* View Details Button */}
                      <button
                        onClick={() => !isLocked && setSelectedModel(selectedModel === stat.model ? null : stat.model)}
                        disabled={isLocked}
                        className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isLocked
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600'
                        }`}
                      >
                        {selectedModel === stat.model ? t('betDetails') + ' ▼' : t('viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bet Details Section */}
          {selectedModel && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {t('betDetails')} - {selectedModel === 'Value Hunter' ? t('hdpSniper')
                  : selectedModel === 'Aggressive' ? t('activeTrader')
                  : selectedModel === 'Balanced' ? t('oddsflowCore')
                  : selectedModel === 'Oddsflow Beta v8' ? t('oddsflowBeta')
                  : t('allModels')}
              </h2>

              {/* Bet Type Filter */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {['All', 'HDP', '1X2', 'OU'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setBetTypeFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      betTypeFilter === filter
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Bet Records Table */}
              {(() => {
                const allRecords = modelStats.find(s => s.model === selectedModel)?.records || [];
                const filteredRecords = allRecords.filter(record => {
                  if (betTypeFilter === 'All') return true;
                  const betType = getBetType(record);
                  if (betTypeFilter === 'HDP') return betType === 'handicap';
                  if (betTypeFilter === '1X2') return betType === 'moneyline';
                  if (betTypeFilter === 'OU') return betType === 'ou';
                  return true;
                });

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                          <th className="pb-3">Clock</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Selection</th>
                          <th className="pb-3">Line</th>
                          <th className="pb-3">Odds</th>
                          <th className="pb-3">Stake</th>
                          <th className="pb-3">Score</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-gray-500">
                              No signals
                            </td>
                          </tr>
                        ) : (
                          filteredRecords.map((record, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 text-sm text-white">{record.clock}'</td>
                          <td className="py-3 text-sm">
                            <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
                              {record.type || '-'}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-white">{record.selection || '-'}</td>
                          <td className="py-3 text-sm text-gray-400">{record.line || '-'}</td>
                          <td className="py-3 text-sm text-white">{record.odds?.toFixed(2) || '-'}</td>
                          <td className="py-3 text-sm text-white">${record.stake_money?.toFixed(2) || '0.00'}</td>
                          <td className="py-3 text-sm text-white">
                            {(record.score_home_at_bet ?? record.home_score ?? 0)}-{(record.score_away_at_bet ?? record.away_score ?? 0)}
                          </td>
                          <td className="py-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              record.status?.toLowerCase() === 'win' ? 'bg-emerald-500/20 text-emerald-400' :
                              record.status?.toLowerCase() === 'loss' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {record.status || '-'}
                            </span>
                          </td>
                          <td className={`py-3 text-sm font-bold text-right ${(record.profit ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {(record.profit ?? 0) >= 0 ? '+' : ''}{record.profit?.toFixed(2) || '0.00'}
                          </td>
                        </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
