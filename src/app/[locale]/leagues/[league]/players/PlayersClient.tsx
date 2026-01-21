"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { LeaguePlayerData } from "@/lib/team-data";

// Props interface
interface PlayersClientProps {
  initialPlayers: LeaguePlayerData[];
  topScorers: LeaguePlayerData[];
  topAssists: LeaguePlayerData[];
  highestRated: LeaguePlayerData[];
  leagueName: string;
  leagueSlug: string;
}

// Translations
const translations: Record<string, Record<string, string>> = {
  en: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "Performance",
    community: "Community", news: "News", solution: "Solution", pricing: "Pricing",
    login: "Login", getStarted: "Get Started", backToLeague: "Back to League",
    allPlayers: "All Players", playersInLeague: "players in the league",
    searchPlayers: "Search players...", allPositions: "All Positions",
    sortByRating: "Sort by Rating", sortByGoals: "Sort by Goals", sortByAssists: "Sort by Assists",
    sortByApps: "Sort by Apps", sortByName: "Sort by Name", noPlayersFound: "No players found",
    goals: "Goals", assists: "Assists", apps: "Apps", mins: "Mins",
    topScorers: "Top Scorers", topAssistsTitle: "Top Assists", highestRated: "Highest Rated",
    viewProfile: "View Profile",
  },
  'zh-CN': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "表现",
    community: "社区", news: "新闻", solution: "解决方案", pricing: "定价",
    login: "登录", getStarted: "立即开始", backToLeague: "返回联赛",
    allPlayers: "所有球员", playersInLeague: "名球员",
    searchPlayers: "搜索球员...", allPositions: "所有位置",
    sortByRating: "按评分排序", sortByGoals: "按进球排序", sortByAssists: "按助攻排序",
    sortByApps: "按出场排序", sortByName: "按名字排序", noPlayersFound: "未找到球员",
    goals: "进球", assists: "助攻", apps: "出场", mins: "分钟",
    topScorers: "射手榜", topAssistsTitle: "助攻榜", highestRated: "评分最高",
    viewProfile: "查看详情",
  },
  'zh-TW': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "表現",
    community: "社區", news: "新聞", solution: "解決方案", pricing: "定價",
    login: "登入", getStarted: "立即開始", backToLeague: "返回聯賽",
    allPlayers: "所有球員", playersInLeague: "名球員",
    searchPlayers: "搜尋球員...", allPositions: "所有位置",
    sortByRating: "按評分排序", sortByGoals: "按進球排序", sortByAssists: "按助攻排序",
    sortByApps: "按出場排序", sortByName: "按名字排序", noPlayersFound: "未找到球員",
    goals: "進球", assists: "助攻", apps: "出場", mins: "分鐘",
    topScorers: "射手榜", topAssistsTitle: "助攻榜", highestRated: "評分最高",
    viewProfile: "查看詳情",
  },
  id: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa",
    community: "Komunitas", news: "Berita", solution: "Solusi", pricing: "Harga",
    login: "Masuk", getStarted: "Mulai", backToLeague: "Kembali ke Liga",
    allPlayers: "Semua Pemain", playersInLeague: "pemain di liga",
    searchPlayers: "Cari pemain...", allPositions: "Semua Posisi",
    sortByRating: "Urutkan Rating", sortByGoals: "Urutkan Gol", sortByAssists: "Urutkan Assist",
    sortByApps: "Urutkan Penampilan", sortByName: "Urutkan Nama", noPlayersFound: "Pemain tidak ditemukan",
    goals: "Gol", assists: "Assist", apps: "Main", mins: "Menit",
    topScorers: "Top Skor", topAssistsTitle: "Top Assist", highestRated: "Rating Tertinggi",
    viewProfile: "Lihat Profil",
  },
  es: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento",
    community: "Comunidad", news: "Noticias", solution: "Solución", pricing: "Precios",
    login: "Iniciar", getStarted: "Empezar", backToLeague: "Volver a Liga",
    allPlayers: "Todos los Jugadores", playersInLeague: "jugadores en la liga",
    searchPlayers: "Buscar jugadores...", allPositions: "Todas las Posiciones",
    sortByRating: "Ordenar por Rating", sortByGoals: "Ordenar por Goles", sortByAssists: "Ordenar por Asistencias",
    sortByApps: "Ordenar por Partidos", sortByName: "Ordenar por Nombre", noPlayersFound: "No se encontraron jugadores",
    goals: "Goles", assists: "Asist.", apps: "Part.", mins: "Min",
    topScorers: "Goleadores", topAssistsTitle: "Asistencias", highestRated: "Mejor Valorados",
    viewProfile: "Ver Perfil",
  },
  pt: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho",
    community: "Comunidade", news: "Notícias", solution: "Solução", pricing: "Preços",
    login: "Entrar", getStarted: "Começar", backToLeague: "Voltar à Liga",
    allPlayers: "Todos os Jogadores", playersInLeague: "jogadores na liga",
    searchPlayers: "Buscar jogadores...", allPositions: "Todas as Posições",
    sortByRating: "Ordenar por Rating", sortByGoals: "Ordenar por Gols", sortByAssists: "Ordenar por Assistências",
    sortByApps: "Ordenar por Jogos", sortByName: "Ordenar por Nome", noPlayersFound: "Nenhum jogador encontrado",
    goals: "Gols", assists: "Assist.", apps: "Jogos", mins: "Min",
    topScorers: "Artilheiros", topAssistsTitle: "Assistências", highestRated: "Mais Bem Avaliados",
    viewProfile: "Ver Perfil",
  },
  ja: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "パフォーマンス",
    community: "コミュニティ", news: "ニュース", solution: "ソリューション", pricing: "料金",
    login: "ログイン", getStarted: "始める", backToLeague: "リーグに戻る",
    allPlayers: "全選手", playersInLeague: "人の選手",
    searchPlayers: "選手を検索...", allPositions: "全ポジション",
    sortByRating: "評価順", sortByGoals: "ゴール順", sortByAssists: "アシスト順",
    sortByApps: "出場順", sortByName: "名前順", noPlayersFound: "選手が見つかりません",
    goals: "ゴール", assists: "アシスト", apps: "出場", mins: "分",
    topScorers: "得点ランキング", topAssistsTitle: "アシストランキング", highestRated: "最高評価",
    viewProfile: "プロフィール",
  },
  ko: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "성과",
    community: "커뮤니티", news: "뉴스", solution: "솔루션", pricing: "가격",
    login: "로그인", getStarted: "시작하기", backToLeague: "리그로 돌아가기",
    allPlayers: "모든 선수", playersInLeague: "명의 선수",
    searchPlayers: "선수 검색...", allPositions: "모든 포지션",
    sortByRating: "평점순", sortByGoals: "골순", sortByAssists: "어시스트순",
    sortByApps: "출전순", sortByName: "이름순", noPlayersFound: "선수를 찾을 수 없습니다",
    goals: "골", assists: "어시스트", apps: "출전", mins: "분",
    topScorers: "득점 순위", topAssistsTitle: "어시스트 순위", highestRated: "최고 평점",
    viewProfile: "프로필 보기",
  },
  de: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Leistung",
    community: "Community", news: "Nachrichten", solution: "Lösung", pricing: "Preise",
    login: "Anmelden", getStarted: "Loslegen", backToLeague: "Zurück zur Liga",
    allPlayers: "Alle Spieler", playersInLeague: "Spieler in der Liga",
    searchPlayers: "Spieler suchen...", allPositions: "Alle Positionen",
    sortByRating: "Nach Bewertung", sortByGoals: "Nach Toren", sortByAssists: "Nach Vorlagen",
    sortByApps: "Nach Einsätzen", sortByName: "Nach Name", noPlayersFound: "Keine Spieler gefunden",
    goals: "Tore", assists: "Vorlagen", apps: "Einsätze", mins: "Min",
    topScorers: "Torjäger", topAssistsTitle: "Vorlagengeber", highestRated: "Beste Bewertung",
    viewProfile: "Profil ansehen",
  },
  fr: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance",
    community: "Communauté", news: "Actualités", solution: "Solution", pricing: "Tarifs",
    login: "Connexion", getStarted: "Commencer", backToLeague: "Retour à la Ligue",
    allPlayers: "Tous les Joueurs", playersInLeague: "joueurs dans la ligue",
    searchPlayers: "Rechercher joueurs...", allPositions: "Toutes les Positions",
    sortByRating: "Trier par Note", sortByGoals: "Trier par Buts", sortByAssists: "Trier par Passes",
    sortByApps: "Trier par Matchs", sortByName: "Trier par Nom", noPlayersFound: "Aucun joueur trouvé",
    goals: "Buts", assists: "Passes", apps: "Matchs", mins: "Min",
    topScorers: "Meilleurs Buteurs", topAssistsTitle: "Meilleures Passes", highestRated: "Mieux Notés",
    viewProfile: "Voir le Profil",
  },
};

// Flag Icon Component
function FlagIcon({ code, size = 20 }: { code: string; size?: number }) {
  const flags: Record<string, string> = {
    'en': '🇬🇧', 'zh-CN': '🇨🇳', 'zh-TW': '🇹🇼', 'id': '🇮🇩', 'es': '🇪🇸',
    'pt': '🇧🇷', 'ja': '🇯🇵', 'ko': '🇰🇷', 'de': '🇩🇪', 'fr': '🇫🇷',
  };
  return <span style={{ fontSize: size }}>{flags[code] || '🌐'}</span>;
}

// Custom Premium Dropdown Component
function PremiumDropdown({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 min-w-[140px] sm:min-w-[180px] backdrop-blur-xl shadow-lg hover:shadow-emerald-500/10"
      >
        {icon && (
          <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors hidden sm:block">
            {icon}
          </span>
        )}
        <span className="flex-1 text-left text-white font-medium text-sm">
          {selectedOption?.label}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-all duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 border border-white/10 shadow-2xl shadow-black/50 z-50 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-5 py-2.5 text-left transition-all duration-200 text-sm ${
                value === option.value
                  ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-400 border-l-2 border-emerald-500"
                  : "text-gray-300 hover:bg-white/5 hover:text-white hover:pl-6"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const locales = ['en', 'zh-CN', 'zh-TW', 'id', 'es', 'pt', 'ja', 'ko', 'de', 'fr'];
const localeNames: Record<string, string> = {
  'en': 'EN', 'zh-CN': '中文', 'zh-TW': '繁體', 'id': 'ID', 'es': 'ES',
  'pt': 'PT', 'ja': 'JA', 'ko': 'KO', 'de': 'DE', 'fr': 'FR',
};

// Top Player Card Component
function TopPlayerCard({
  player,
  rank,
  statValue,
  statLabel,
  statColor,
  leagueSlug,
  localePath,
}: {
  player: LeaguePlayerData;
  rank: number;
  statValue: number;
  statLabel: string;
  statColor: string;
  leagueSlug: string;
  localePath: (path: string) => string;
}) {
  return (
    <Link
      href={localePath(`/leagues/${leagueSlug}/player/${player.id}`)}
      className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-800/50 border border-white/10 hover:border-emerald-500/30 transition-all"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
        {rank}
      </div>
      {player.photo ? (
        <img src={player.photo} alt={player.player_name || ""} className="w-10 h-10 rounded-full object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
          {player.player_name?.charAt(0) || "?"}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate group-hover:text-emerald-400 transition-colors">
          {player.player_name}
        </p>
        <p className="text-gray-500 text-xs truncate flex items-center gap-1">
          {player.team_logo && (
            <img src={player.team_logo} alt="" className="w-4 h-4 object-contain" />
          )}
          {player.team_name}
        </p>
      </div>
      <div className={`text-lg font-bold ${statColor}`}>
        {statValue}
      </div>
    </Link>
  );
}

export default function PlayersClient({
  initialPlayers,
  topScorers,
  topAssists,
  highestRated,
  leagueName,
  leagueSlug,
}: PlayersClientProps) {
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const t = (key: string): string => translations[locale]?.[key] || translations['en'][key] || key;
  const currentLang = { code: localeNames[locale] || 'EN' };

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const getLocaleUrl = (targetLocale: string): string => {
    const currentPath = `/leagues/${leagueSlug}/players`;
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const [mounted, setMounted] = useState(false);
  const [players] = useState<LeaguePlayerData[]>(initialPlayers);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Filter and sort players
  const filteredPlayers = players
    .filter((player) => {
      const matchesSearch = player.player_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPosition =
        positionFilter === "all" ||
        player.position?.toLowerCase() === positionFilter.toLowerCase();
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "goals":
          return (b.goals_total || 0) - (a.goals_total || 0);
        case "assists":
          return (b.assists || 0) - (a.assists || 0);
        case "appearances":
          return (b.appearances || 0) - (a.appearances || 0);
        case "name":
          return (a.player_name || "").localeCompare(b.player_name || "");
        default:
          return 0;
      }
    });

  // Get unique positions for filter
  const positions = [...new Set(players.map((p) => p.position).filter(Boolean))];

  // Calculate top 5 by rating for badge display
  const top5PlayerIds = new Set(
    [...players]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
      .map((p) => p.id)
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0f] to-[#1a1a2e]" />
      </div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
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
              <Link href={localePath('/predictions')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('predictions')}</Link>
              <Link href={localePath('/leagues')} className="text-emerald-400 text-sm font-medium">{t('leagues')}</Link>
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
                      {locales.map((loc) => (
                        <Link
                          key={loc}
                          href={getLocaleUrl(loc)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                            locale === loc
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                          onClick={() => setLangDropdownOpen(false)}
                        >
                          <FlagIcon code={loc} size={20} />
                          <span>{localeNames[loc]}</span>
                        </Link>
                      ))}
                    </div>
                  </>
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

              {/* World Cup Button */}
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
              {[
                { href: localePath('/'), label: t('home') },
                { href: localePath('/predictions'), label: t('predictions') },
                { href: localePath('/leagues'), label: t('leagues'), active: true },
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
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href={localePath(`/leagues/${leagueSlug}`)} className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToLeague')}
          </Link>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {leagueName}
              </span>{" "}
              {t('allPlayers')}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {players.length} {t('playersInLeague')}
            </p>
          </div>

          {/* Top Stats Section - SEO Content visible to crawlers */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Top Scorers */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚽</span> {t('topScorers')}
              </h2>
              <div className="space-y-2">
                {topScorers.map((player, idx) => (
                  <TopPlayerCard
                    key={player.id}
                    player={player}
                    rank={idx + 1}
                    statValue={player.goals_total || 0}
                    statLabel={t('goals')}
                    statColor="text-emerald-400"
                    leagueSlug={leagueSlug}
                    localePath={localePath}
                  />
                ))}
              </div>
            </div>

            {/* Top Assists */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> {t('topAssistsTitle')}
              </h2>
              <div className="space-y-2">
                {topAssists.map((player, idx) => (
                  <TopPlayerCard
                    key={player.id}
                    player={player}
                    rank={idx + 1}
                    statValue={player.assists || 0}
                    statLabel={t('assists')}
                    statColor="text-cyan-400"
                    leagueSlug={leagueSlug}
                    localePath={localePath}
                  />
                ))}
              </div>
            </div>

            {/* Highest Rated */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⭐</span> {t('highestRated')}
              </h2>
              <div className="space-y-2">
                {highestRated.map((player, idx) => (
                  <TopPlayerCard
                    key={player.id}
                    player={player}
                    rank={idx + 1}
                    statValue={Number(player.rating?.toFixed(1)) || 0}
                    statLabel="Rating"
                    statColor="text-amber-400"
                    leagueSlug={leagueSlug}
                    localePath={localePath}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('searchPlayers')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30 backdrop-blur-xl shadow-lg transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Position Filter */}
            <PremiumDropdown
              value={positionFilter}
              onChange={setPositionFilter}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              options={[
                { value: "all", label: t('allPositions') },
                ...positions.map((pos) => ({
                  value: pos?.toLowerCase() || "",
                  label: pos || "",
                })),
              ]}
            />

            {/* Sort By */}
            <PremiumDropdown
              value={sortBy}
              onChange={setSortBy}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              }
              options={[
                { value: "rating", label: t('sortByRating') },
                { value: "goals", label: t('sortByGoals') },
                { value: "assists", label: t('sortByAssists') },
                { value: "appearances", label: t('sortByApps') },
                { value: "name", label: t('sortByName') },
              ]}
            />
          </div>

          {/* Players Grid */}
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">{t('noPlayersFound')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredPlayers.map((player) => {
                const isTop5 = top5PlayerIds.has(player.id);
                const top5Rank = isTop5
                  ? [...players]
                      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                      .findIndex((p) => p.id === player.id) + 1
                  : null;

                return (
                  <Link
                    key={player.id}
                    href={localePath(`/leagues/${leagueSlug}/player/${player.id}`)}
                    className={`group relative p-4 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border transition-all hover:shadow-lg overflow-hidden ${
                      isTop5
                        ? "border-amber-500/50 hover:border-amber-400/70 hover:shadow-amber-500/20"
                        : "border-white/10 hover:border-emerald-500/30 hover:shadow-emerald-500/10"
                    }`}
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                    {/* TOP Badge */}
                    {isTop5 && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[10px] font-bold text-white">TOP {top5Rank}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-3 sm:gap-4 relative z-10">
                      {/* Player Photo */}
                      <div className="relative flex-shrink-0">
                        {player.photo ? (
                          <img
                            src={player.photo}
                            alt={player.player_name || ""}
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-gray-700 ${
                              isTop5 ? "ring-2 ring-amber-500/50" : ""
                            }`}
                          />
                        ) : (
                          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-700 flex items-center justify-center text-xl sm:text-2xl text-gray-400 ${
                            isTop5 ? "ring-2 ring-amber-500/50" : ""
                          }`}>
                            {player.player_name?.charAt(0) || "?"}
                          </div>
                        )}
                        {/* Rating Badge */}
                        {player.rating && (
                          <div
                            className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                              player.rating >= 7.5
                                ? "bg-emerald-500 text-white"
                                : player.rating >= 7
                                ? "bg-green-500 text-white"
                                : player.rating >= 6.5
                                ? "bg-yellow-500 text-black"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {Number(player.rating).toFixed(1)}
                          </div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold truncate transition-colors text-sm sm:text-base ${
                          isTop5
                            ? "text-amber-100 group-hover:text-amber-300"
                            : "text-white group-hover:text-emerald-400"
                        }`}>
                          {player.player_name}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm truncate flex items-center gap-1.5">
                          {player.team_logo ? (
                            <img src={player.team_logo} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                          ) : (
                            <svg className="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          )}
                          {player.team_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              player.position === "Goalkeeper"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : player.position === "Defender"
                                ? "bg-blue-500/20 text-blue-400"
                                : player.position === "Midfielder"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {player.position?.substring(0, 3).toUpperCase() || "-"}
                          </span>
                          {player.nationality && (
                            <span className="text-gray-500 text-xs truncate">
                              {player.nationality}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 relative z-10">
                      <div className="text-center">
                        <p className="text-emerald-400 font-bold text-base sm:text-lg">
                          {player.goals_total || 0}
                        </p>
                        <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase">{t('goals')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-cyan-400 font-bold text-base sm:text-lg">
                          {player.assists || 0}
                        </p>
                        <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase">{t('assists')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-purple-400 font-bold text-base sm:text-lg">
                          {player.appearances || 0}
                        </p>
                        <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase">{t('apps')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-300 font-bold text-base sm:text-lg">
                          {player.minutes || 0}
                        </p>
                        <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase">{t('mins')}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 OddsFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
