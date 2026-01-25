'use client';

import { useState } from 'react';
import Link from 'next/link';
import { locales, localeNames, type Locale } from '@/i18n/config';
import FlagIcon from '@/components/FlagIcon';

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
  },
};

const BET_STYLES = ['Aggressive', 'Conservative', 'Balanced', 'Value Hunter', 'Safe Play'];

interface BetRecord {
  id: number;
  fixture_id: string;
  bet_time: string | null;
  odds: number | null;
  stake_units: number | null;
  stake_money: number | null;
  profit: number | null;
  home_score: number | null;
  away_score: number | null;
  clock: number | null;
  line: number | null;
  league_name: string | null;
  selection: string | null;
  type: string | null;
  status: string | null;
  bet_style: string | null;
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
  totalProfit: number;
  totalInvested: number;
  totalBets: number;
  roi: number;
  profitMoneyline: number;
  profitHandicap: number;
  profitOU: number;
  betRecords: BetRecord[];
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
  totalProfit: initialTotalProfit,
  totalInvested: initialTotalInvested,
  totalBets: initialTotalBets,
  roi: initialROI,
  profitMoneyline: initialProfitMoneyline,
  profitHandicap: initialProfitHandicap,
  profitOU: initialProfitOU,
  betRecords,
}: Props) {
  const t = (key: string) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS.en[key] || key;
  const localePath = (path: string) => locale === 'en' ? path : `/${locale}${path}`;

  const [typeFilter, setTypeFilter] = useState<'all' | 'moneyline' | 'handicap' | 'ou'>('all');
  const [betStyleFilter, setBetStyleFilter] = useState<string>('all');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to determine bet type
  const getBetType = (selection: string | null): 'moneyline' | 'handicap' | 'ou' => {
    if (!selection) return 'ou';
    const sel = selection.toLowerCase();
    if (sel.includes('hdp') || sel.includes('handicap')) return 'handicap';
    if (sel.includes('over') || sel.includes('under')) return 'ou';
    if (/^(home|away)\s*[+-]?\d/.test(sel)) return 'handicap';
    if (sel === 'home' || sel === 'draw' || sel === 'away') return 'moneyline';
    return 'ou';
  };

  // Filter records based on type and bet style
  const filteredRecords = betRecords.filter(record => {
    if (typeFilter !== 'all' && getBetType(record.selection) !== typeFilter) {
      return false;
    }
    if (betStyleFilter !== 'all' && record.bet_style !== betStyleFilter) {
      return false;
    }
    return true;
  });

  // Calculate dynamic stats from filtered records
  const totalProfit = filteredRecords.reduce((sum, r) => sum + (r.profit ?? 0), 0);
  const totalInvested = filteredRecords.reduce((sum, r) => sum + (r.stake_money ?? 0), 0);
  const totalBets = filteredRecords.length;
  const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Calculate profit by market from filtered records
  const profitMoneyline = filteredRecords.filter(r => getBetType(r.selection) === 'moneyline').reduce((sum, r) => sum + (r.profit ?? 0), 0);
  const profitHandicap = filteredRecords.filter(r => getBetType(r.selection) === 'handicap').reduce((sum, r) => sum + (r.profit ?? 0), 0);
  const profitOU = filteredRecords.filter(r => getBetType(r.selection) === 'ou').reduce((sum, r) => sum + (r.profit ?? 0), 0);

  const getLocaleUrl = (newLocale: string) => {
    return `/${newLocale}/performance/${league}/profit-summary/${homeTeam.toLowerCase().replace(/\s+/g, '-')}-vs-${awayTeam.toLowerCase().replace(/\s+/g, '-')}/${fixtureId}/${date}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
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
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href={localePath('/performance')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToPerformance')}
          </Link>

          {/* Content Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 p-6 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t('profitSummary')}</h1>
                <div className="flex items-center gap-2 text-gray-400">
                  {leagueLogo && <img src={leagueLogo} alt={leagueName} className="w-4 h-4 object-contain" />}
                  <span className="text-sm">{homeTeam} vs {awayTeam}</span>
                  {homeScore !== undefined && awayScore !== undefined && (
                    <span className="text-white font-bold ml-2">({homeScore} - {awayScore})</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="relative z-10 space-y-4">
              {/* Main Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('totalProfit')}</div>
                  <div className={`text-2xl sm:text-3xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {totalProfit >= 0 ? '+$' : '-$'}{Math.abs(totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('roi')}</div>
                  <div className={`text-2xl sm:text-3xl font-bold ${roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('totalInvested')}</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('totalBets')}</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">{totalBets}</div>
                </div>
              </div>

              {/* Market Breakdown */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">{t('profitByMarket')}</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                      <span className="text-gray-300 text-sm">{t('moneyline1x2')}</span>
                    </div>
                    <span className={`font-bold ${profitMoneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {profitMoneyline >= 0 ? '+$' : '-$'}{Math.abs(profitMoneyline).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-gray-300 text-sm">{t('asianHandicap')}</span>
                    </div>
                    <span className={`font-bold ${profitHandicap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {profitHandicap >= 0 ? '+$' : '-$'}{Math.abs(profitHandicap).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-gray-300 text-sm">{t('overUnder')}</span>
                    </div>
                    <span className={`font-bold ${profitOU >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {profitOU >= 0 ? '+$' : '-$'}{Math.abs(profitOU).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bet Details Table */}
              {betRecords.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{t('betDetails')} ({filteredRecords.length})</div>
                    <div className="flex gap-1 flex-wrap">
                      {(['all', 'moneyline', 'handicap', 'ou'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setTypeFilter(filter)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                            typeFilter === filter
                              ? filter === 'all' ? 'bg-white/20 text-white'
                                : filter === 'moneyline' ? 'bg-cyan-500/30 text-cyan-400'
                                : filter === 'handicap' ? 'bg-purple-500/30 text-purple-400'
                                : 'bg-amber-500/30 text-amber-400'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {filter === 'all' ? 'All' : filter === 'moneyline' ? '1X2' : filter === 'handicap' ? 'HDP' : 'O/U'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bet Style Filter */}
                  <div className="flex flex-wrap items-center gap-1 mb-3">
                    <span className="text-xs text-gray-500 mr-2">Style:</span>
                    <button
                      onClick={() => setBetStyleFilter('all')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        betStyleFilter === 'all'
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      All
                    </button>
                    {BET_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => setBetStyleFilter(style)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                          betStyleFilter === style
                            ? 'bg-amber-500/30 text-amber-400'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {style === 'Aggressive' && '🔥 '}
                        {style === 'Conservative' && '🛡️ '}
                        {style === 'Balanced' && '⚖️ '}
                        {style === 'Value Hunter' && '💎 '}
                        {style === 'Safe Play' && '✅ '}
                        {style}
                      </button>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-2 text-gray-400 font-medium text-xs">Clock</th>
                          <th className="text-left py-2 px-2 text-gray-400 font-medium text-xs">Type</th>
                          <th className="text-left py-2 px-2 text-gray-400 font-medium text-xs">Selection</th>
                          <th className="text-center py-2 px-2 text-gray-400 font-medium text-xs">Line</th>
                          <th className="text-center py-2 px-2 text-gray-400 font-medium text-xs">Odds</th>
                          <th className="text-center py-2 px-2 text-gray-400 font-medium text-xs">Stake</th>
                          <th className="text-center py-2 px-2 text-gray-400 font-medium text-xs">Score</th>
                          <th className="text-center py-2 px-2 text-gray-400 font-medium text-xs">Status</th>
                          <th className="text-right py-2 px-2 text-gray-400 font-medium text-xs">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map((record, index) => {
                          const derivedType = getBetType(record.selection);
                          return (
                            <tr key={record.id || index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-2 px-2 text-gray-300 text-xs">{record.clock !== null ? `${record.clock}'` : '-'}</td>
                              <td className="py-2 px-2">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  derivedType === 'moneyline' ? 'bg-cyan-500/20 text-cyan-400' :
                                  derivedType === 'handicap' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {derivedType === 'moneyline' ? '1X2' : derivedType === 'handicap' ? 'HDP' : 'O/U'}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-white text-xs font-medium">{record.selection || '-'}</td>
                              <td className="py-2 px-2 text-center text-amber-400 text-xs">{record.line ?? '-'}</td>
                              <td className="py-2 px-2 text-center text-gray-300 text-xs">{record.odds?.toFixed(2) ?? '-'}</td>
                              <td className="py-2 px-2 text-center text-gray-300 text-xs">{record.stake_money ? `$${record.stake_money.toFixed(2)}` : '-'}</td>
                              <td className="py-2 px-2 text-center text-white text-xs font-medium">
                                {record.home_score !== null && record.away_score !== null ? `${record.home_score}-${record.away_score}` : '-'}
                              </td>
                              <td className="py-2 px-2 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                                    record.status?.toLowerCase() === 'won' || record.status?.toLowerCase() === 'win' ? 'bg-emerald-500/20 text-emerald-400' :
                                    record.status?.toLowerCase() === 'lost' || record.status?.toLowerCase() === 'loss' ? 'bg-red-500/20 text-red-400' :
                                    record.status?.toLowerCase() === 'push' ? 'bg-gray-500/20 text-gray-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                  }`}
                                >
                                  {record.status?.toUpperCase() || '-'}
                                </span>
                              </td>
                              <td className={`py-2 px-2 text-right text-xs font-bold ${(record.profit ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {(record.profit ?? 0) >= 0 ? '+' : ''}{record.profit?.toFixed(2) ?? '0.00'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card Layout */}
                  <div className="md:hidden space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredRecords.map((record, index) => {
                      const derivedType = getBetType(record.selection);
                      return (
                        <div key={record.id || index} className="bg-white/5 rounded-lg p-3 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-xs">{record.clock !== null ? `${record.clock}'` : '-'}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                derivedType === 'moneyline' ? 'bg-cyan-500/20 text-cyan-400' :
                                derivedType === 'handicap' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                                {derivedType === 'moneyline' ? '1X2' : derivedType === 'handicap' ? 'HDP' : 'O/U'}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                record.status?.toLowerCase() === 'won' || record.status?.toLowerCase() === 'win' ? 'bg-emerald-500/20 text-emerald-400' :
                                record.status?.toLowerCase() === 'lost' || record.status?.toLowerCase() === 'loss' ? 'bg-red-500/20 text-red-400' :
                                record.status?.toLowerCase() === 'push' ? 'bg-gray-500/20 text-gray-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {record.status?.toUpperCase() || '-'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-white text-sm font-medium">{record.selection || '-'}</div>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                <span>Line: <span className="text-amber-400">{record.line ?? '-'}</span></span>
                                <span>@{record.odds?.toFixed(2) ?? '-'}</span>
                                <span>${record.stake_money?.toFixed(0) ?? '-'}</span>
                              </div>
                            </div>
                            <div className={`text-sm font-bold ${(record.profit ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {(record.profit ?? 0) >= 0 ? '+$' : '-$'}{Math.abs(record.profit ?? 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {betRecords.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No bet records found for this match.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
