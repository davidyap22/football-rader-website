'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, PlayerStats, getPlayerStatsById } from '@/lib/supabase';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeNames, localeToTranslationCode, type Locale } from '@/i18n/config';
import { User } from '@supabase/supabase-js';

// League configuration
const LEAGUES_CONFIG: Record<string, { name: string; country: string; logo: string; dbName: string }> = {
  'premier-league': { name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', dbName: 'Premier League' },
  'bundesliga': { name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', dbName: 'Bundesliga' },
  'serie-a': { name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', dbName: 'Serie A' },
  'la-liga': { name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', dbName: 'La Liga' },
  'ligue-1': { name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', dbName: 'Ligue 1' },
  'champions-league': { name: 'Champions League', country: 'UEFA', logo: 'https://media.api-sports.io/football/leagues/2.png', dbName: 'UEFA Champions League' },
};

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", solution: "Solution", pricing: "Pricing",
    login: "Log In", getStarted: "Get Started", backTo: "Back to",
    leagueNotFound: "League not found", playerNotFound: "Player not found",
    rating: "Rating", age: "Age", height: "Height", weight: "Weight", born: "Born",
    appearances: "Appearances", lineups: "Lineups", minutesPlayed: "Minutes Played",
    avgMinPerGame: "Avg: {0} min/game", goals: "Goals", conceded: "Conceded", assists: "Assists",
    shooting: "Shooting", totalShots: "Total Shots", shotsOnTarget: "Shots on Target",
    shotAccuracy: "Shot Accuracy", penaltiesScored: "Penalties Scored", penaltiesMissed: "Penalties Missed",
    passing: "Passing", totalPasses: "Total Passes", keyPasses: "Key Passes",
    defending: "Defending", tackles: "Tackles", interceptions: "Interceptions",
    duelsTotal: "Duels Total", duelsWon: "Duels Won", duelWinRate: "Duel Win Rate",
    discipline: "Discipline", yellowCards: "Yellow Cards", redCards: "Red Cards",
    foulsCommitted: "Fouls Committed", foulsDrawn: "Fouls Drawn",
    goalkeeper: "Goalkeeper", defender: "Defender", midfielder: "Midfielder", attacker: "Attacker",
    captain: "CAPTAIN", injured: "INJURED",
    allRightsReserved: "All rights reserved.", gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", solution: "Solución", pricing: "Precios",
    login: "Iniciar Sesión", getStarted: "Comenzar", backTo: "Volver a",
    leagueNotFound: "Liga no encontrada", playerNotFound: "Jugador no encontrado",
    rating: "Valoración", age: "Edad", height: "Altura", weight: "Peso", born: "Nacido",
    appearances: "Apariciones", lineups: "Titularidades", minutesPlayed: "Minutos Jugados",
    avgMinPerGame: "Prom: {0} min/partido", goals: "Goles", conceded: "Encajados", assists: "Asistencias",
    shooting: "Disparos", totalShots: "Tiros Totales", shotsOnTarget: "Tiros a Puerta",
    shotAccuracy: "Precisión de Tiro", penaltiesScored: "Penaltis Anotados", penaltiesMissed: "Penaltis Fallados",
    passing: "Pases", totalPasses: "Pases Totales", keyPasses: "Pases Clave",
    defending: "Defensa", tackles: "Entradas", interceptions: "Intercepciones",
    duelsTotal: "Duelos Totales", duelsWon: "Duelos Ganados", duelWinRate: "% Duelos Ganados",
    discipline: "Disciplina", yellowCards: "Tarjetas Amarillas", redCards: "Tarjetas Rojas",
    foulsCommitted: "Faltas Cometidas", foulsDrawn: "Faltas Recibidas",
    goalkeeper: "Portero", defender: "Defensa", midfielder: "Centrocampista", attacker: "Delantero",
    captain: "CAPITÁN", injured: "LESIONADO",
    allRightsReserved: "Todos los derechos reservados.", gamblingWarning: "El juego implica riesgo. Por favor juega responsablemente.",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Notícias", solution: "Solução", pricing: "Preços",
    login: "Entrar", getStarted: "Começar", backTo: "Voltar para",
    leagueNotFound: "Liga não encontrada", playerNotFound: "Jogador não encontrado",
    rating: "Avaliação", age: "Idade", height: "Altura", weight: "Peso", born: "Nascido",
    appearances: "Jogos", lineups: "Titularidades", minutesPlayed: "Minutos Jogados",
    avgMinPerGame: "Média: {0} min/jogo", goals: "Gols", conceded: "Sofridos", assists: "Assistências",
    shooting: "Finalização", totalShots: "Chutes Totais", shotsOnTarget: "Chutes no Gol",
    shotAccuracy: "Precisão de Chute", penaltiesScored: "Pênaltis Marcados", penaltiesMissed: "Pênaltis Perdidos",
    passing: "Passes", totalPasses: "Passes Totais", keyPasses: "Passes Decisivos",
    defending: "Defesa", tackles: "Desarmes", interceptions: "Interceptações",
    duelsTotal: "Duelos Totais", duelsWon: "Duelos Vencidos", duelWinRate: "Taxa de Vitória em Duelos",
    discipline: "Disciplina", yellowCards: "Cartões Amarelos", redCards: "Cartões Vermelhos",
    foulsCommitted: "Faltas Cometidas", foulsDrawn: "Faltas Sofridas",
    goalkeeper: "Goleiro", defender: "Defensor", midfielder: "Meio-campista", attacker: "Atacante",
    captain: "CAPITÃO", injured: "LESIONADO",
    allRightsReserved: "Todos os direitos reservados.", gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", solution: "Lösung", pricing: "Preise",
    login: "Anmelden", getStarted: "Loslegen", backTo: "Zurück zu",
    leagueNotFound: "Liga nicht gefunden", playerNotFound: "Spieler nicht gefunden",
    rating: "Bewertung", age: "Alter", height: "Größe", weight: "Gewicht", born: "Geboren",
    appearances: "Einsätze", lineups: "Startelf", minutesPlayed: "Gespielte Minuten",
    avgMinPerGame: "Durchschn: {0} Min/Spiel", goals: "Tore", conceded: "Kassiert", assists: "Vorlagen",
    shooting: "Schießen", totalShots: "Schüsse Gesamt", shotsOnTarget: "Schüsse aufs Tor",
    shotAccuracy: "Schussgenauigkeit", penaltiesScored: "Elfmeter erzielt", penaltiesMissed: "Elfmeter verschossen",
    passing: "Passspiel", totalPasses: "Pässe Gesamt", keyPasses: "Schlüsselpässe",
    defending: "Verteidigung", tackles: "Tacklings", interceptions: "Abfangaktionen",
    duelsTotal: "Zweikämpfe Gesamt", duelsWon: "Zweikämpfe Gewonnen", duelWinRate: "Zweikampfquote",
    discipline: "Disziplin", yellowCards: "Gelbe Karten", redCards: "Rote Karten",
    foulsCommitted: "Fouls begangen", foulsDrawn: "Fouls erhalten",
    goalkeeper: "Torwart", defender: "Verteidiger", midfielder: "Mittelfeldspieler", attacker: "Stürmer",
    captain: "KAPITÄN", injured: "VERLETZT",
    allRightsReserved: "Alle Rechte vorbehalten.", gamblingWarning: "Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communauté", news: "Actualités", solution: "Solution", pricing: "Tarifs",
    login: "Connexion", getStarted: "Commencer", backTo: "Retour à",
    leagueNotFound: "Ligue non trouvée", playerNotFound: "Joueur non trouvé",
    rating: "Note", age: "Âge", height: "Taille", weight: "Poids", born: "Né",
    appearances: "Matchs", lineups: "Titularisations", minutesPlayed: "Minutes Jouées",
    avgMinPerGame: "Moy: {0} min/match", goals: "Buts", conceded: "Encaissés", assists: "Passes Décisives",
    shooting: "Tirs", totalShots: "Tirs Totaux", shotsOnTarget: "Tirs Cadrés",
    shotAccuracy: "Précision de Tir", penaltiesScored: "Penalties Marqués", penaltiesMissed: "Penalties Ratés",
    passing: "Passes", totalPasses: "Passes Totales", keyPasses: "Passes Clés",
    defending: "Défense", tackles: "Tacles", interceptions: "Interceptions",
    duelsTotal: "Duels Totaux", duelsWon: "Duels Gagnés", duelWinRate: "Taux de Duels Gagnés",
    discipline: "Discipline", yellowCards: "Cartons Jaunes", redCards: "Cartons Rouges",
    foulsCommitted: "Fautes Commises", foulsDrawn: "Fautes Subies",
    goalkeeper: "Gardien", defender: "Défenseur", midfielder: "Milieu", attacker: "Attaquant",
    captain: "CAPITAINE", injured: "BLESSÉ",
    allRightsReserved: "Tous droits réservés.", gamblingWarning: "Le jeu comporte des risques. Veuillez jouer de manière responsable.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "AIパフォーマンス",
    community: "コミュニティ", news: "ニュース", solution: "ソリューション", pricing: "料金",
    login: "ログイン", getStarted: "始める", backTo: "戻る",
    leagueNotFound: "リーグが見つかりません", playerNotFound: "選手が見つかりません",
    rating: "評価", age: "年齢", height: "身長", weight: "体重", born: "出身",
    appearances: "出場", lineups: "先発", minutesPlayed: "出場時間",
    avgMinPerGame: "平均: {0}分/試合", goals: "ゴール", conceded: "失点", assists: "アシスト",
    shooting: "シュート", totalShots: "総シュート数", shotsOnTarget: "枠内シュート",
    shotAccuracy: "シュート精度", penaltiesScored: "PK成功", penaltiesMissed: "PK失敗",
    passing: "パス", totalPasses: "総パス数", keyPasses: "キーパス",
    defending: "守備", tackles: "タックル", interceptions: "インターセプト",
    duelsTotal: "デュエル総数", duelsWon: "デュエル勝利", duelWinRate: "デュエル勝率",
    discipline: "規律", yellowCards: "イエローカード", redCards: "レッドカード",
    foulsCommitted: "ファウル", foulsDrawn: "被ファウル",
    goalkeeper: "GK", defender: "DF", midfielder: "MF", attacker: "FW",
    captain: "キャプテン", injured: "負傷中",
    allRightsReserved: "全著作権所有。", gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성능",
    community: "커뮤니티", news: "뉴스", solution: "솔루션", pricing: "가격",
    login: "로그인", getStarted: "시작하기", backTo: "돌아가기",
    leagueNotFound: "리그를 찾을 수 없습니다", playerNotFound: "선수를 찾을 수 없습니다",
    rating: "평점", age: "나이", height: "키", weight: "몸무게", born: "출생",
    appearances: "출전", lineups: "선발", minutesPlayed: "출전 시간",
    avgMinPerGame: "평균: {0}분/경기", goals: "골", conceded: "실점", assists: "도움",
    shooting: "슈팅", totalShots: "총 슈팅", shotsOnTarget: "유효 슈팅",
    shotAccuracy: "슈팅 정확도", penaltiesScored: "PK 성공", penaltiesMissed: "PK 실패",
    passing: "패스", totalPasses: "총 패스", keyPasses: "키 패스",
    defending: "수비", tackles: "태클", interceptions: "인터셉트",
    duelsTotal: "총 경합", duelsWon: "경합 승리", duelWinRate: "경합 승률",
    discipline: "징계", yellowCards: "옐로카드", redCards: "레드카드",
    foulsCommitted: "파울", foulsDrawn: "파울 유도",
    goalkeeper: "골키퍼", defender: "수비수", midfielder: "미드필더", attacker: "공격수",
    captain: "주장", injured: "부상",
    allRightsReserved: "모든 권리 보유.", gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", solution: "解决方案", pricing: "价格",
    login: "登录", getStarted: "开始使用", backTo: "返回",
    leagueNotFound: "未找到联赛", playerNotFound: "未找到球员",
    rating: "评分", age: "年龄", height: "身高", weight: "体重", born: "出生地",
    appearances: "出场", lineups: "首发", minutesPlayed: "出场时间",
    avgMinPerGame: "场均: {0}分钟", goals: "进球", conceded: "失球", assists: "助攻",
    shooting: "射门", totalShots: "总射门", shotsOnTarget: "射正",
    shotAccuracy: "射门精度", penaltiesScored: "点球进球", penaltiesMissed: "点球失手",
    passing: "传球", totalPasses: "总传球", keyPasses: "关键传球",
    defending: "防守", tackles: "抢断", interceptions: "拦截",
    duelsTotal: "对抗总数", duelsWon: "对抗成功", duelWinRate: "对抗成功率",
    discipline: "纪律", yellowCards: "黄牌", redCards: "红牌",
    foulsCommitted: "犯规", foulsDrawn: "被犯规",
    goalkeeper: "门将", defender: "后卫", midfielder: "中场", attacker: "前锋",
    captain: "队长", injured: "受伤",
    allRightsReserved: "版权所有。", gamblingWarning: "博彩有风险，请理性投注。",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社區", news: "新聞", solution: "解決方案", pricing: "價格",
    login: "登入", getStarted: "開始使用", backTo: "返回",
    leagueNotFound: "未找到聯賽", playerNotFound: "未找到球員",
    rating: "評分", age: "年齡", height: "身高", weight: "體重", born: "出生地",
    appearances: "出場", lineups: "首發", minutesPlayed: "出場時間",
    avgMinPerGame: "場均: {0}分鐘", goals: "進球", conceded: "失球", assists: "助攻",
    shooting: "射門", totalShots: "總射門", shotsOnTarget: "射正",
    shotAccuracy: "射門精度", penaltiesScored: "點球進球", penaltiesMissed: "點球失手",
    passing: "傳球", totalPasses: "總傳球", keyPasses: "關鍵傳球",
    defending: "防守", tackles: "搶斷", interceptions: "攔截",
    duelsTotal: "對抗總數", duelsWon: "對抗成功", duelWinRate: "對抗成功率",
    discipline: "紀律", yellowCards: "黃牌", redCards: "紅牌",
    foulsCommitted: "犯規", foulsDrawn: "被犯規",
    goalkeeper: "門將", defender: "後衛", midfielder: "中場", attacker: "前鋒",
    captain: "隊長", injured: "受傷",
    allRightsReserved: "版權所有。", gamblingWarning: "博彩有風險，請理性投注。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", solution: "Solusi", pricing: "Harga",
    login: "Masuk", getStarted: "Mulai", backTo: "Kembali ke",
    leagueNotFound: "Liga tidak ditemukan", playerNotFound: "Pemain tidak ditemukan",
    rating: "Rating", age: "Usia", height: "Tinggi", weight: "Berat", born: "Lahir",
    appearances: "Penampilan", lineups: "Starter", minutesPlayed: "Menit Bermain",
    avgMinPerGame: "Rata-rata: {0} menit/pertandingan", goals: "Gol", conceded: "Kebobolan", assists: "Assist",
    shooting: "Tembakan", totalShots: "Total Tembakan", shotsOnTarget: "Tembakan Tepat Sasaran",
    shotAccuracy: "Akurasi Tembakan", penaltiesScored: "Penalti Sukses", penaltiesMissed: "Penalti Gagal",
    passing: "Passing", totalPasses: "Total Passing", keyPasses: "Key Pass",
    defending: "Pertahanan", tackles: "Tekel", interceptions: "Intersep",
    duelsTotal: "Total Duel", duelsWon: "Duel Dimenangkan", duelWinRate: "Rasio Kemenangan Duel",
    discipline: "Disiplin", yellowCards: "Kartu Kuning", redCards: "Kartu Merah",
    foulsCommitted: "Pelanggaran", foulsDrawn: "Dilanggar",
    goalkeeper: "Kiper", defender: "Bek", midfielder: "Gelandang", attacker: "Penyerang",
    captain: "KAPTEN", injured: "CEDERA",
    allRightsReserved: "Hak cipta dilindungi.", gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
  },
};

export default function PlayerDetailPage() {
  const params = useParams();
  const urlLocale = (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';
  const leagueSlug = params.league as string;
  const playerId = params.id as string;
  const leagueConfig = LEAGUES_CONFIG[leagueSlug];

  // Translation helper
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  // Helper function for locale-aware paths
  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  // Helper for language dropdown URLs
  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = `/leagues/${leagueSlug}/player/${playerId}`;
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const [player, setPlayer] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchPlayer() {
      if (!playerId) return;

      setLoading(true);
      const { data, error } = await getPlayerStatsById(parseInt(playerId));

      if (data && !error) {
        setPlayer(data);
      }
      setLoading(false);
    }

    fetchPlayer();
  }, [playerId]);

  if (!leagueConfig) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <p className="text-gray-400">{t('leagueNotFound')}</p>
      </div>
    );
  }

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
                  <span className="font-medium">{selectedLang}</span>
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-[#0c1018] border border-white/10 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
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

              {user ? (
                <Link href={localePath('/dashboard')} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
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
                  <Link href={localePath('/login')} className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href={localePath('/get-started')} className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
                </>
              )}

              {/* World Cup Button */}
              <Link href={localePath('/worldcup')} className="relative hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all cursor-pointer group overflow-hidden hover:scale-105">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-5 w-auto object-contain relative z-10" />
                <span className="text-black font-semibold text-sm relative z-10">FIFA 2026</span>
              </Link>

              {/* Mobile Menu Button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all" aria-label="Toggle menu">
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
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
              <Link href={localePath('/worldcup')} onClick={() => setMobileMenuOpen(false)} className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-8 w-auto object-contain relative z-10" />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
              </Link>
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
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${link.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <Link href={localePath('/login')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all">{t('login')}</Link>
                  <Link href={localePath('/get-started')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold hover:shadow-lg transition-all">{t('getStarted')}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href={localePath(`/leagues/${leagueSlug}`)} className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backTo')} {leagueConfig.name}
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : !player ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">{t('playerNotFound')}</p>
            </div>
          ) : (
            <>
              {/* Player Header */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Player Photo */}
                  <div className="relative">
                    {player.photo ? (
                      <img src={player.photo} alt={player.player_name || ''} className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover bg-gray-700" />
                    ) : (
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gray-700 flex items-center justify-center text-gray-400 text-4xl">
                        {player.player_name?.charAt(0) || '?'}
                      </div>
                    )}
                    {player.captain && (
                      <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold bg-amber-500 text-black rounded-lg">{t('captain')}</span>
                    )}
                    {player.injured && (
                      <span className="absolute -bottom-2 -right-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-lg">{t('injured')}</span>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-white">{player.player_name}</h1>
                      {player.number && (
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xl font-bold">
                          #{player.number}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                      {/* Team */}
                      {player.team_logo && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <img src={player.team_logo} alt={player.team_name || ''} className="w-5 h-5 object-contain" />
                          <span className="text-white text-sm">{player.team_name}</span>
                        </div>
                      )}

                      {/* Position */}
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        player.position === 'Goalkeeper' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        player.position === 'Defender' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        player.position === 'Midfielder' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {player.position || 'Unknown'}
                      </span>

                      {/* Nationality */}
                      <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm">
                        {player.nationality}
                      </span>
                    </div>

                    {/* Personal Info */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                      {player.age && <span>{t('age')}: <span className="text-white">{player.age}</span></span>}
                      {player.height && <span>{t('height')}: <span className="text-white">{player.height}</span></span>}
                      {player.weight && <span>{t('weight')}: <span className="text-white">{player.weight}</span></span>}
                      {player.birth_country && <span>{t('born')}: <span className="text-white">{player.birth_country}</span></span>}
                    </div>
                  </div>

                  {/* Rating */}
                  {player.rating && (
                    <div className="text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('rating')}</p>
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold ${
                        player.rating >= 7.5 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        player.rating >= 7 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        player.rating >= 6.5 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {Number(player.rating).toFixed(1)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Appearances */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('appearances')}</p>
                  <p className="text-3xl font-bold text-white">{player.appearances || 0}</p>
                  <p className="text-gray-500 text-xs mt-1">{t('lineups')}: {player.lineups || 0}</p>
                </div>

                {/* Minutes */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('minutesPlayed')}</p>
                  <p className="text-3xl font-bold text-cyan-400">{player.minutes || 0}</p>
                  <p className="text-gray-500 text-xs mt-1">{t('avgMinPerGame').replace('{0}', String(player.appearances ? Math.round((player.minutes || 0) / player.appearances) : 0))}</p>
                </div>

                {/* Goals */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('goals')}</p>
                  <p className="text-3xl font-bold text-emerald-400">{player.goals_total || 0}</p>
                  {player.position === 'Goalkeeper' && (
                    <p className="text-gray-500 text-xs mt-1">{t('conceded')}: {player.conceded || 0}</p>
                  )}
                </div>

                {/* Assists */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('assists')}</p>
                  <p className="text-3xl font-bold text-purple-400">{player.assists || 0}</p>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shooting */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('shooting')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('totalShots')}</span>
                      <span className="text-white font-semibold">{player.shots_total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('shotsOnTarget')}</span>
                      <span className="text-white font-semibold">{player.shots_on || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('shotAccuracy')}</span>
                      <span className="text-emerald-400 font-semibold">
                        {player.shots_total ? Math.round((player.shots_on || 0) / player.shots_total * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('penaltiesScored')}</span>
                      <span className="text-white font-semibold">{player.penalty_scored || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('penaltiesMissed')}</span>
                      <span className="text-red-400 font-semibold">{player.penalty_missed || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Passing */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    {t('passing')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('totalPasses')}</span>
                      <span className="text-white font-semibold">{player.passes_total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('keyPasses')}</span>
                      <span className="text-cyan-400 font-semibold">{player.passes_key || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('assists')}</span>
                      <span className="text-purple-400 font-semibold">{player.assists || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Defending */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {t('defending')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('tackles')}</span>
                      <span className="text-white font-semibold">{player.tackles_total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('interceptions')}</span>
                      <span className="text-white font-semibold">{player.interceptions || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('duelsTotal')}</span>
                      <span className="text-white font-semibold">{player.duels_total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('duelsWon')}</span>
                      <span className="text-emerald-400 font-semibold">{player.duels_won || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('duelWinRate')}</span>
                      <span className="text-emerald-400 font-semibold">
                        {player.duels_total ? Math.round((player.duels_won || 0) / player.duels_total * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Discipline */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {t('discipline')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('yellowCards')}</span>
                      <span className="text-yellow-400 font-semibold">{player.cards_yellow || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('redCards')}</span>
                      <span className="text-red-400 font-semibold">{player.cards_red || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('foulsCommitted')}</span>
                      <span className="text-white font-semibold">{player.fouls_committed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{t('foulsDrawn')}</span>
                      <span className="text-white font-semibold">{player.fouls_drawn || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; 2026 OddsFlow. {t('allRightsReserved')} {t('gamblingWarning')}</p>
        </div>
      </footer>
    </div>
  );
}
