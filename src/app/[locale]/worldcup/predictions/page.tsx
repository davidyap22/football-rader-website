'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { supabase, Prematch, MatchPrediction, getMatchPredictions } from '@/lib/supabase';
import WorldCupFooter from '@/components/WorldCupFooter';
import { User } from '@supabase/supabase-js';
import FlagIcon from "@/components/FlagIcon";
import { locales, localeNames, localeToTranslationCode, type Locale } from '@/i18n/config';

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    worldCupPredictions: "World Cup Predictions",
    worldCupSubtitle: "AI predictions for FIFA World Cup 2026 matches",
    matches: "matches",
    loading: "Loading World Cup matches...",
    noMatches: "No matches in this group",
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
    backToWorldCup: "Back to World Cup",
    footer: "18+ | Gambling involves risk. Please gamble responsibly.",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    allDates: "All Dates",
  },
  '中文': {
    worldCupPredictions: "世界杯预测",
    worldCupSubtitle: "FIFA世界杯2026比赛AI预测",
    matches: "场比赛",
    loading: "加载世界杯比赛中...",
    noMatches: "该小组暂无比赛",
    home: "首页",
    predictions: "预测",
    worldcup: "世界杯",
    leagues: "联赛",
    performance: "AI表现",
    community: "社区",
    news: "新闻",
    pricing: "价格",
    login: "登录",
    getStarted: "开始使用",
    backToWorldCup: "返回世界杯",
    footer: "18+ | 博彩有风险，请理性投注。",
    allRights: "© 2026 OddsFlow. 保留所有权利。",
    allDates: "全部日期",
  },
  '繁體': {
    worldCupPredictions: "世界盃預測",
    worldCupSubtitle: "FIFA世界盃2026比賽AI預測",
    matches: "場比賽",
    loading: "載入世界盃比賽中...",
    noMatches: "該小組暫無比賽",
    home: "首頁",
    predictions: "預測",
    worldcup: "世界盃",
    leagues: "聯賽",
    performance: "AI表現",
    community: "社區",
    news: "新聞",
    pricing: "價格",
    login: "登入",
    getStarted: "開始使用",
    backToWorldCup: "返回世界盃",
    footer: "18+ | 博彩有風險，請理性投注。",
    allRights: "© 2026 OddsFlow. 保留所有權利。",
    allDates: "全部日期",
  },
  ID: {
    worldCupPredictions: "Prediksi Piala Dunia",
    worldCupSubtitle: "Prediksi AI untuk pertandingan Piala Dunia FIFA 2026",
    matches: "pertandingan",
    loading: "Memuat pertandingan Piala Dunia...",
    noMatches: "Tidak ada pertandingan di grup ini",
    home: "Beranda",
    predictions: "Prediksi",
    worldcup: "Piala Dunia",
    leagues: "Liga",
    performance: "Performa AI",
    community: "Komunitas",
    news: "Berita",
    pricing: "Harga",
    login: "Masuk",
    getStarted: "Mulai",
    backToWorldCup: "Kembali ke Piala Dunia",
    footer: "18+ | Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    allRights: "© 2026 OddsFlow. Hak cipta dilindungi.",
    allDates: "Semua Tanggal",
  },
};

function WorldCupPredictionsContent() {
  const searchParams = useSearchParams();
  const groupFromUrl = searchParams.get('group');
  const params = useParams();
  const urlLocale = (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/worldcup/predictions';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const [allMatches, setAllMatches] = useState<Prematch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Prematch[]>([]);
  const [loading, setLoading] = useState(true);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [predictions, setPredictions] = useState<Record<number, MatchPrediction>>({});
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(groupFromUrl);
  const [fifaDropdownOpen, setFifaDropdownOpen] = useState(false);


  const t = (key: string): string => {
    return translations[selectedLang]?.[key] || translations['EN']?.[key] || key;
  };

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


  // Fetch ALL World Cup matches and extract unique groups
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

        const matches = data || [];
        setAllMatches(matches);

        // Extract unique groups and sort them (Group A, Group B, etc.)
        const groups = [...new Set(matches.map((m: Prematch) => m.group_cup).filter(Boolean))].sort();
        setAvailableGroups(groups as string[]);

        // Set group from URL or first group as default
        if (groups.length > 0 && !selectedGroup) {
          if (groupFromUrl && groups.includes(groupFromUrl)) {
            setSelectedGroup(groupFromUrl);
          } else {
            setSelectedGroup(groups[0] as string);
          }
        }

        // Fetch predictions for all matches
        if (matches.length > 0) {
          const fixtureIds = matches.map((m: Prematch) => m.id);
          const { data: predictionsData } = await getMatchPredictions(fixtureIds);
          if (predictionsData) {
            setPredictions(predictionsData);
          }
        }
      } catch (error) {
        console.error('Error fetching World Cup matches:', error);
        setAllMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  // Filter matches by selected group
  useEffect(() => {
    if (selectedGroup && allMatches.length > 0) {
      const filtered = allMatches.filter((m: Prematch) => m.group_cup === selectedGroup);
      setFilteredMatches(filtered);
    } else {
      setFilteredMatches(allMatches);
    }
  }, [selectedGroup, allMatches]);

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
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const month = months[date.getUTCMonth()];
    const weekday = weekdays[date.getUTCDay()];
    return `${weekday}, ${day} ${month}`;
  };

  const getMatchCountForGroup = (group: string) => {
    return allMatches.filter((m: Prematch) => m.group_cup === group).length;
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
            <Link href={localePath('/')} className="flex items-center gap-3 flex-shrink-0">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href={localePath('/worldcup')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('home')}</Link>
              <Link href={localePath('/worldcup/predictions')} className="text-amber-400 text-sm font-medium">{t('predictions')}</Link>
              <Link href={localePath('/worldcup/leagues')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('leagues')}</Link>
              <Link href={localePath('/worldcup/ai_performance')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('performance')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer"
                >
                  <FlagIcon code={selectedLang} size={20} />
                  <span className="font-medium">{selectedLang}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    {locales.map((loc) => (
                      <Link
                        key={loc}
                        href={getLocaleUrl(loc)}
                        onClick={() => setLangDropdownOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors ${locale === loc ? 'bg-amber-500/10 text-amber-400' : 'text-gray-300'}`}
                      >
                        <FlagIcon code={localeToTranslationCode[loc]} size={20} />
                        <span className="font-medium">{localeNames[loc]}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* User/Login */}
              {user ? (
                <Link href={localePath('/dashboard')} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-black font-bold text-sm">
                    {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href={localePath('/login')} className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href={localePath('/get-started')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer hidden sm:block">{t('getStarted')}</Link>
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
                      href={localePath('/')}
                      onClick={() => setFifaDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors border-b border-white/10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">Back to OddsFlow</span>
                    </Link>
                    <Link
                      href={localePath('/worldcup/predictions')}
                      onClick={() => setFifaDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-amber-400 bg-amber-500/10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="font-medium">{t('predictions')}</span>
                    </Link>
                    <Link
                      href={localePath('/worldcup/leagues')}
                      onClick={() => setFifaDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="font-medium">{t('leagues')}</span>
                    </Link>
                    <Link
                      href={localePath('/worldcup/ai_performance')}
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
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16"></div>

      {/* Header */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <Link href={localePath('/worldcup')} className="inline-flex items-center gap-2 text-amber-400 hover:text-white transition-colors mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToWorldCup')}
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <img
            src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png"
            alt="FIFA World Cup 2026"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              {t('worldCupPredictions')}
            </h1>
            <p className="text-gray-400 mt-1">{t('worldCupSubtitle')}</p>
          </div>
        </div>

        {/* Group Filter */}
        {availableGroups.length > 0 && (
          <div className="relative bg-gradient-to-r from-gray-900/80 via-[#1a1510]/80 to-gray-900/80 backdrop-blur-sm border border-amber-500/30 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[100px] bg-amber-500/20 rounded-full blur-[80px] animate-pulse" />
              <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[100px] bg-orange-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="px-4 py-4 relative z-10">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {availableGroups.map((group) => {
                  const isSelected = group === selectedGroup;
                  const matchCount = getMatchCountForGroup(group);

                  return (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      className={`
                        relative px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0
                        ${isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-amber-500/20'
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 blur-xl opacity-50 -z-10" />
                      )}
                      <div className="flex flex-col items-center">
                        <span>{group}</span>
                        <span className={`text-xs mt-0.5 ${isSelected ? 'text-black/70' : 'text-gray-500'}`}>
                          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
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
        {!loading && filteredMatches.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('noMatches')}</h3>
            <p className="text-gray-500">Select another group to view matches</p>
          </div>
        )}

        {/* World Cup Matches */}
        {!loading && filteredMatches.length > 0 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-amber-500/20 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-amber-500/20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 p-0.5 flex items-center justify-center">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">FIFA World Cup 2026</h3>
                  <p className="text-xs text-amber-400/80">{selectedGroup || 'All Matches'}</p>
                </div>
                <span className="text-xs text-gray-500 ml-auto">{filteredMatches.length} {t('matches')}</span>
              </div>

              {/* Matches */}
              <div className="divide-y divide-white/5">
                {filteredMatches.map((match) => (
                  <Link
                    href={localePath(`/worldcup/predictions/${match.id}?group=${encodeURIComponent(selectedGroup || '')}`)}
                    key={match.id}
                    onClick={(e) => handleMatchClick(e, match.id)}
                    className={`block transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                      match.type === 'In Play'
                        ? 'bg-red-500/5 hover:bg-red-500/10 border-l-2 border-red-500'
                        : 'hover:bg-amber-500/5'
                    }`}
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-amber-500/10 to-transparent pointer-events-none" />

                    {/* Match Row */}
                    <div className="grid grid-cols-12 gap-4 items-center px-5 py-4">
                      <div className="col-span-2">
                        {match.type === 'In Play' ? (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                              </span>
                              <span className="text-red-500 font-bold text-xs uppercase animate-pulse">
                                {match.status_elapsed ? `${match.status_elapsed}'` : 'LIVE'}
                              </span>
                            </div>
                          </div>
                        ) : match.type === 'Finished' ? (
                          <div className="flex flex-col">
                            <span className="text-gray-500 font-medium text-xs">FT</span>
                            <span className="text-gray-600 text-xs">{formatMatchDate(match.start_date_msia)}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-amber-400 font-mono text-sm font-medium">
                              {formatTime(match.start_date_msia)}
                            </span>
                            <span className="text-gray-500 text-xs">{formatMatchDate(match.start_date_msia)}</span>
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
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">View details</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
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
              <Link
                href={localePath('/login')}
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-center font-semibold hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
              <Link
                href={localePath('/get-started')}
                className="block w-full py-3 rounded-xl border border-amber-500/30 text-amber-400 text-center font-semibold hover:bg-amber-500/10 transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorldCupPredictionsLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
}

export default function WorldCupPredictionsPage() {
  return (
    <Suspense fallback={<WorldCupPredictionsLoading />}>
      <WorldCupPredictionsContent />
    </Suspense>
  );
}
