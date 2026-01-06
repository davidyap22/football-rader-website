'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, TeamStatistics } from '@/lib/supabase';
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
    seoTitle: "European Football AI Tips",
    seoP1: "OddsFlow provides the most accurate AI football predictor for all major European leagues. Our transparent AI betting platform offers verified AI betting records for Premier League, Bundesliga, Serie A, La Liga, Ligue 1, and Champions League.",
    seoP2: "Whether you're looking for Premier League 1x2 predictions today, Bundesliga AI betting predictions, or Serie A artificial intelligence picks, our platform delivers data-driven insights powered by advanced machine learning algorithms.",
    seoP3: "Our best AI for handicap betting analyzes handicap draw predictions, over 2.5 goals stats, and provides comprehensive match analysis. Experience the safest AI football tips with our transparent AI betting results.",
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
    seoTitle: "Consejos de IA para Fútbol Europeo",
    seoP1: "OddsFlow ofrece el predictor de fútbol con IA más preciso para todas las principales ligas europeas. Nuestra plataforma transparente de apuestas con IA ofrece registros verificados para Premier League, Bundesliga, Serie A, La Liga, Ligue 1 y Champions League.",
    seoP2: "Ya sea que busques predicciones 1x2 de la Premier League, predicciones de apuestas con IA de la Bundesliga, o picks de inteligencia artificial de la Serie A, nuestra plataforma ofrece análisis basados en datos impulsados por algoritmos avanzados de aprendizaje automático.",
    seoP3: "Nuestra mejor IA para apuestas handicap analiza predicciones de empate handicap, estadísticas de más de 2.5 goles y proporciona análisis completos de partidos. Experimenta los consejos de fútbol con IA más seguros con nuestros resultados transparentes.",
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
    seoTitle: "Dicas de IA para Futebol Europeu",
    seoP1: "OddsFlow oferece o preditor de futebol com IA mais preciso para todas as principais ligas europeias. Nossa plataforma transparente de apostas com IA oferece registros verificados para Premier League, Bundesliga, Serie A, La Liga, Ligue 1 e Champions League.",
    seoP2: "Seja você procurando previsões 1x2 da Premier League, previsões de apostas com IA da Bundesliga, ou picks de inteligência artificial da Serie A, nossa plataforma oferece insights baseados em dados impulsionados por algoritmos avançados de aprendizado de máquina.",
    seoP3: "Nossa melhor IA para apostas handicap analisa previsões de empate handicap, estatísticas de mais de 2.5 gols e fornece análises abrangentes de partidas. Experimente as dicas de futebol com IA mais seguras com nossos resultados transparentes.",
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
    seoTitle: "KI-Tipps für Europäischen Fußball",
    seoP1: "OddsFlow bietet den genauesten KI-Fußballprediktor für alle großen europäischen Ligen. Unsere transparente KI-Wettplattform bietet verifizierte Wettaufzeichnungen für Premier League, Bundesliga, Serie A, La Liga, Ligue 1 und Champions League.",
    seoP2: "Ob Sie nach Premier League 1x2-Vorhersagen, Bundesliga KI-Wettvorhersagen oder Serie A-Picks mit künstlicher Intelligenz suchen, unsere Plattform liefert datengesteuerte Einblicke durch fortschrittliche maschinelle Lernalgorithmen.",
    seoP3: "Unsere beste KI für Handicap-Wetten analysiert Handicap-Unentschieden-Vorhersagen, über 2,5 Tore-Statistiken und bietet umfassende Spielanalysen. Erleben Sie die sichersten KI-Fußballtipps mit unseren transparenten Wettergebnissen.",
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
    seoTitle: "Conseils IA pour le Football Européen",
    seoP1: "OddsFlow offre le prédicteur de football IA le plus précis pour toutes les grandes ligues européennes. Notre plateforme de paris IA transparente offre des records de paris vérifiés pour la Premier League, la Bundesliga, la Serie A, La Liga, la Ligue 1 et la Champions League.",
    seoP2: "Que vous cherchiez des prédictions 1x2 de Premier League, des prédictions de paris IA de Bundesliga, ou des picks d'intelligence artificielle de Serie A, notre plateforme fournit des analyses basées sur les données grâce à des algorithmes d'apprentissage automatique avancés.",
    seoP3: "Notre meilleure IA pour les paris handicap analyse les prédictions de match nul handicap, les statistiques de plus de 2,5 buts et fournit des analyses de match complètes. Découvrez les conseils de football IA les plus sûrs avec nos résultats de paris transparents.",
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
    seoTitle: "欧州サッカーAI予測",
    seoP1: "OddsFlowは、すべての主要欧州リーグで最も正確なAIサッカー予測を提供します。当社の透明なAIベッティングプラットフォームは、プレミアリーグ、ブンデスリーガ、セリエA、ラ・リーガ、リーグ1、チャンピオンズリーグの検証済みベッティング記録を提供します。",
    seoP2: "プレミアリーグの1x2予測、ブンデスリーガのAIベッティング予測、セリエAの人工知能ピックをお探しの場合でも、当社のプラットフォームは高度な機械学習アルゴリズムによるデータ駆動型の分析を提供します。",
    seoP3: "ハンディキャップベッティングに最適な当社のAIは、ハンディキャップドロー予測、2.5ゴール以上の統計を分析し、包括的な試合分析を提供します。透明なAIベッティング結果で最も安全なサッカー予測をお楽しみください。",
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
    seoTitle: "유럽 축구 AI 예측",
    seoP1: "OddsFlow는 모든 주요 유럽 리그에서 가장 정확한 AI 축구 예측을 제공합니다. 당사의 투명한 AI 베팅 플랫폼은 프리미어리그, 분데스리가, 세리에 A, 라리가, 리그 1, 챔피언스 리그에 대한 검증된 베팅 기록을 제공합니다.",
    seoP2: "프리미어리그 1x2 예측, 분데스리가 AI 베팅 예측, 세리에 A 인공지능 픽을 찾고 계시든, 당사 플랫폼은 고급 머신러닝 알고리즘을 통해 데이터 기반 분석을 제공합니다.",
    seoP3: "핸디캡 베팅을 위한 최고의 AI는 핸디캡 무승부 예측, 2.5 이상 골 통계를 분석하고 포괄적인 경기 분석을 제공합니다. 투명한 AI 베팅 결과로 가장 안전한 축구 예측을 경험하세요.",
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
    seoTitle: "欧洲足球AI预测",
    seoP1: "OddsFlow为所有主要欧洲联赛提供最精准的AI足球预测。我们透明的AI投注平台为英超、德甲、意甲、西甲、法甲和欧冠提供经过验证的投注记录。",
    seoP2: "无论您是在寻找英超1x2预测、德甲AI投注预测，还是意甲人工智能选择，我们的平台都通过先进的机器学习算法提供数据驱动的分析。",
    seoP3: "我们最优秀的让球投注AI分析让球平局预测、2.5球以上统计数据，并提供全面的比赛分析。通过我们透明的AI投注结果，体验最安全的足球预测。",
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
    seoTitle: "歐洲足球AI預測",
    seoP1: "OddsFlow為所有主要歐洲聯賽提供最精準的AI足球預測。我們透明的AI投注平台為英超、德甲、意甲、西甲、法甲和歐冠提供經過驗證的投注記錄。",
    seoP2: "無論您是在尋找英超1x2預測、德甲AI投注預測，還是意甲人工智能選擇，我們的平台都通過先進的機器學習算法提供數據驅動的分析。",
    seoP3: "我們最優秀的讓球投注AI分析讓球平局預測、2.5球以上統計數據，並提供全面的比賽分析。通過我們透明的AI投注結果，體驗最安全的足球預測。",
  },
};

// League data configuration with URL slugs
const LEAGUES_CONFIG = [
  { name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', slug: 'premier-league', dbName: 'Premier League' },
  { name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', slug: 'bundesliga', dbName: 'Bundesliga' },
  { name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', slug: 'serie-a', dbName: 'Serie A' },
  { name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', slug: 'la-liga', dbName: 'La Liga' },
  { name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', slug: 'ligue-1', dbName: 'Ligue 1' },
  { name: 'Champions League', country: 'UEFA', logo: 'https://media.api-sports.io/football/leagues/2.png', slug: 'champions-league', dbName: 'UEFA Champions League' },
];

// League stats summary type
interface LeagueStatsSummary {
  teams: number;
  totalGoals: number;
  avgGoalsPerMatch: number;
  cleanSheets: number;
  topTeam: string | null;
  topTeamLogo: string | null;
  season: number | null;
}

export default function LeaguesPage() {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leagueStats, setLeagueStats] = useState<Record<string, LeagueStatsSummary>>({});
  const [loadingStats, setLoadingStats] = useState(true);
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

  // Fetch league statistics
  useEffect(() => {
    async function fetchAllLeagueStats() {
      if (!supabase) return;

      setLoadingStats(true);
      const statsMap: Record<string, LeagueStatsSummary> = {};

      for (const league of LEAGUES_CONFIG) {
        try {
          const { data, error } = await supabase
            .from('team_statistics')
            .select('*')
            .eq('league_name', league.dbName);

          if (data && !error && data.length > 0) {
            // Calculate points for sorting
            const teamsWithPoints = data.map((team: TeamStatistics) => ({
              ...team,
              points: ((team.total_wins || 0) * 3) + (team.total_draws || 0),
            }));

            // Sort by points to find top team
            teamsWithPoints.sort((a: TeamStatistics & { points: number }, b: TeamStatistics & { points: number }) => b.points - a.points);
            const topTeam = teamsWithPoints[0];

            statsMap[league.dbName] = {
              teams: data.length,
              totalGoals: data.reduce((sum: number, t: TeamStatistics) => sum + (t.goals_for_total || 0), 0),
              avgGoalsPerMatch: data.reduce((sum: number, t: TeamStatistics) => sum + (t.goals_for_average || 0), 0) / data.length,
              cleanSheets: data.reduce((sum: number, t: TeamStatistics) => sum + (t.clean_sheets || 0), 0),
              topTeam: topTeam?.team_name || null,
              topTeamLogo: topTeam?.logo || null,
              season: data[0]?.season || null,
            };
          }
        } catch (err) {
          console.error(`Failed to fetch stats for ${league.name}`, err);
        }
      }

      setLeagueStats(statsMap);
      setLoadingStats(false);
    }

    fetchAllLeagueStats();
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
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
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

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
                  <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer hidden sm:block">{t('getStarted')}</Link>
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
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
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
            {LEAGUES_CONFIG.map((league) => (
              <Link
                key={league.name}
                href={`/leagues/${league.slug}`}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                    <img src={league.logo} alt={league.name} className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{league.name}</h3>
                    <p className="text-sm text-emerald-400">{league.country}</p>
                  </div>
                </div>
                {/* Statistics Summary */}
                {loadingStats ? (
                  <div className="space-y-2 mb-3">
                    <div className="h-4 bg-white/10 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded animate-pulse w-1/2"></div>
                  </div>
                ) : leagueStats[league.dbName] ? (
                  <div className="mb-3">
                    {/* Top Team */}
                    {leagueStats[league.dbName].topTeam && (
                      <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        {leagueStats[league.dbName].topTeamLogo && (
                          <img
                            src={leagueStats[league.dbName].topTeamLogo!}
                            alt={leagueStats[league.dbName].topTeam!}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className="text-xs text-emerald-400 font-medium">
                          Leading: {leagueStats[league.dbName].topTeam}
                        </span>
                      </div>
                    )}
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].teams} Teams</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].totalGoals} Goals</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].avgGoalsPerMatch.toFixed(1)} Avg/Match</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].cleanSheets} Clean Sheets</span>
                      </div>
                    </div>
                    {/* Season Badge */}
                    {leagueStats[league.dbName].season && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500">Season {leagueStats[league.dbName].season}/{(leagueStats[league.dbName].season! + 1).toString().slice(-2)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-3 italic">No statistics available</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">View Standings</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">Team Stats</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Formations</span>
                </div>
              </Link>
            ))}
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">{t('seoTitle')}</h2>
            <p className="text-gray-400 mb-4">{t('seoP1')}</p>
            <p className="text-gray-400 mb-4">{t('seoP2')}</p>
            <p className="text-gray-400">{t('seoP3')}</p>
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
