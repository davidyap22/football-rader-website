'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, TeamStatistics, PlayerStats, getTeamStatsByName, getPlayerStatsByTeam } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeNames, localeToTranslationCode, type Locale } from '@/i18n/config';

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home",
    predictions: "Predictions",
    leagues: "Leagues",
    performance: "AI Performance",
    community: "Community",
    news: "News",
    solution: "Solution",
    pricing: "Pricing",
    footer: "18+ | Gambling involves risk. Please gamble responsibly.",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    footerDesc: "AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.",
    product: "Product",
    company: "Company",
    legal: "Legal",
    aboutUs: "About Us",
    contact: "Contact",
    blog: "Blog",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    popularLeagues: "Popular Leagues",
    aiPredictionsFooter: "AI Predictions",
    aiFootballPredictions: "AI Football Predictions",
    onextwoPredictions: "1x2 Predictions",
    overUnderTips: "Over/Under Tips",
    handicapBetting: "Handicap Betting",
    aiBettingPerformance: "AI Betting Performance",
    footballTipsToday: "Football Tips Today",
    // Team Page Content
    backTo: "Back to",
    leagueNotFound: "League not found",
    teamNotFound: "Team not found",
    loadingTeamData: "Loading team data...",
    season: "Season",
    points: "Points",
    winRate: "Win Rate",
    played: "Played",
    wins: "Wins",
    draws: "Draws",
    losses: "Losses",
    goalsFor: "Goals For",
    goalsAgainst: "Goals Against",
    teamFormation: "Team Formation",
    allFormationsUsed: "All Formations Used",
    performanceStats: "Performance",
    goalDifference: "Goal Difference",
    goalsPerMatch: "Goals/Match",
    concededPerMatch: "Conceded/Match",
    cleanSheets: "Clean Sheets",
    failedToScore: "Failed to Score",
    discipline: "Discipline",
    yellowCards: "Yellow Cards",
    redCards: "Red Cards",
    cardsPerMatch: "Cards/Match",
    recentForm: "Recent Form",
    lastMatches: "Last {count} matches",
    win: "Win",
    draw: "Draw",
    loss: "Loss",
    squad: "Squad",
    players: "Players",
    player: "Player",
    position: "Position",
    age: "Age",
    apps: "Apps",
    minutes: "Minutes",
    goals: "Goals",
    assists: "Assists",
    rating: "Rating",
    viewProfile: "View Profile",
    noPlayerData: "No player data available",
    login: "Log In",
    getStarted: "Get Started",
  },
  ES: {
    home: "Inicio",
    predictions: "Predicciones",
    leagues: "Ligas",
    performance: "Rendimiento IA",
    community: "Comunidad",
    news: "Noticias",
    solution: "Solución",
    pricing: "Precios",
    footer: "18+ | El juego implica riesgo. Por favor juega responsablemente.",
    allRights: "© 2026 OddsFlow. Todos los derechos reservados.",
    footerDesc: "Analisis de cuotas de futbol impulsado por IA para predicciones mas inteligentes.",
    product: "Producto",
    company: "Empresa",
    legal: "Legal",
    aboutUs: "Sobre Nosotros",
    contact: "Contacto",
    blog: "Blog",
    termsOfService: "Terminos de Servicio",
    privacyPolicy: "Politica de Privacidad",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juega responsablemente.",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Predicciones IA",
    aiFootballPredictions: "Predicciones de Futbol IA",
    onextwoPredictions: "Predicciones 1x2",
    overUnderTips: "Consejos Over/Under",
    handicapBetting: "Apuestas Handicap",
    aiBettingPerformance: "Rendimiento de Apuestas IA",
    footballTipsToday: "Tips de Futbol Hoy",
    backTo: "Volver a",
    leagueNotFound: "Liga no encontrada",
    teamNotFound: "Equipo no encontrado",
    loadingTeamData: "Cargando datos del equipo...",
    season: "Temporada",
    points: "Puntos",
    winRate: "Tasa de Victoria",
    played: "Jugados",
    wins: "Victorias",
    draws: "Empates",
    losses: "Derrotas",
    goalsFor: "Goles a Favor",
    goalsAgainst: "Goles en Contra",
    teamFormation: "Formación del Equipo",
    allFormationsUsed: "Todas las Formaciones Usadas",
    performanceStats: "Rendimiento",
    goalDifference: "Diferencia de Goles",
    goalsPerMatch: "Goles/Partido",
    concededPerMatch: "Recibidos/Partido",
    cleanSheets: "Porterías a Cero",
    failedToScore: "Sin Marcar",
    discipline: "Disciplina",
    yellowCards: "Tarjetas Amarillas",
    redCards: "Tarjetas Rojas",
    cardsPerMatch: "Tarjetas/Partido",
    recentForm: "Forma Reciente",
    lastMatches: "Últimos {count} partidos",
    win: "Victoria",
    draw: "Empate",
    loss: "Derrota",
    squad: "Plantilla",
    players: "Jugadores",
    player: "Jugador",
    position: "Posición",
    age: "Edad",
    apps: "Partidos",
    minutes: "Minutos",
    goals: "Goles",
    assists: "Asistencias",
    rating: "Valoración",
    viewProfile: "Ver Perfil",
    noPlayerData: "No hay datos de jugadores disponibles",
    login: "Iniciar Sesión",
    getStarted: "Comenzar",
  },
  PT: {
    home: "Início",
    predictions: "Previsões",
    leagues: "Ligas",
    performance: "Desempenho IA",
    community: "Comunidade",
    news: "Notícias",
    solution: "Solução",
    pricing: "Preços",
    footer: "18+ | O jogo envolve risco. Por favor, jogue com responsabilidade.",
    allRights: "© 2026 OddsFlow. Todos os direitos reservados.",
    footerDesc: "Analise de probabilidades de futebol com IA para previsoes mais inteligentes.",
    product: "Produto",
    company: "Empresa",
    legal: "Legal",
    aboutUs: "Sobre Nos",
    contact: "Contato",
    blog: "Blog",
    termsOfService: "Termos de Servico",
    privacyPolicy: "Politica de Privacidade",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "O jogo envolve risco. Por favor, jogue com responsabilidade.",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Previsões IA",
    aiFootballPredictions: "Previsões de Futebol IA",
    onextwoPredictions: "Previsões 1x2",
    overUnderTips: "Dicas Over/Under",
    handicapBetting: "Apostas Handicap",
    aiBettingPerformance: "Desempenho de Apostas IA",
    footballTipsToday: "Dicas de Futebol Hoje",
    backTo: "Voltar para",
    leagueNotFound: "Liga não encontrada",
    teamNotFound: "Equipe não encontrada",
    loadingTeamData: "Carregando dados da equipe...",
    season: "Temporada",
    points: "Pontos",
    winRate: "Taxa de Vitória",
    played: "Jogados",
    wins: "Vitórias",
    draws: "Empates",
    losses: "Derrotas",
    goalsFor: "Gols Marcados",
    goalsAgainst: "Gols Sofridos",
    teamFormation: "Formação da Equipe",
    allFormationsUsed: "Todas as Formações Usadas",
    performanceStats: "Desempenho",
    goalDifference: "Saldo de Gols",
    goalsPerMatch: "Gols/Jogo",
    concededPerMatch: "Sofridos/Jogo",
    cleanSheets: "Jogos sem Sofrer Gols",
    failedToScore: "Sem Marcar",
    discipline: "Disciplina",
    yellowCards: "Cartões Amarelos",
    redCards: "Cartões Vermelhos",
    cardsPerMatch: "Cartões/Jogo",
    recentForm: "Forma Recente",
    lastMatches: "Últimos {count} jogos",
    win: "Vitória",
    draw: "Empate",
    loss: "Derrota",
    squad: "Elenco",
    players: "Jogadores",
    player: "Jogador",
    position: "Posição",
    age: "Idade",
    apps: "Jogos",
    minutes: "Minutos",
    goals: "Gols",
    assists: "Assistências",
    rating: "Avaliação",
    viewProfile: "Ver Perfil",
    noPlayerData: "Dados de jogadores não disponíveis",
    login: "Entrar",
    getStarted: "Começar",
  },
  DE: {
    home: "Startseite",
    predictions: "Vorhersagen",
    leagues: "Ligen",
    performance: "KI-Leistung",
    community: "Community",
    news: "Nachrichten",
    solution: "Lösung",
    pricing: "Preise",
    footer: "18+ | Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    allRights: "© 2026 OddsFlow. Alle Rechte vorbehalten.",
    footerDesc: "KI-gestutzte Fussball-Quotenanalyse fur intelligentere Vorhersagen.",
    product: "Produkt",
    company: "Unternehmen",
    legal: "Rechtliches",
    aboutUs: "Uber Uns",
    contact: "Kontakt",
    blog: "Blog",
    termsOfService: "Nutzungsbedingungen",
    privacyPolicy: "Datenschutzrichtlinie",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glucksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    popularLeagues: "Beliebte Ligen",
    aiPredictionsFooter: "KI-Vorhersagen",
    aiFootballPredictions: "KI-Fussballvorhersagen",
    onextwoPredictions: "1x2 Vorhersagen",
    overUnderTips: "Über/Unter Tipps",
    handicapBetting: "Handicap-Wetten",
    aiBettingPerformance: "KI-Wettleistung",
    footballTipsToday: "Fussballtipps Heute",
    backTo: "Zurück zu",
    leagueNotFound: "Liga nicht gefunden",
    teamNotFound: "Team nicht gefunden",
    loadingTeamData: "Lade Teamdaten...",
    season: "Saison",
    points: "Punkte",
    winRate: "Siegquote",
    played: "Gespielt",
    wins: "Siege",
    draws: "Unentschieden",
    losses: "Niederlagen",
    goalsFor: "Tore",
    goalsAgainst: "Gegentore",
    teamFormation: "Teamformation",
    allFormationsUsed: "Alle verwendeten Formationen",
    performanceStats: "Leistung",
    goalDifference: "Tordifferenz",
    goalsPerMatch: "Tore/Spiel",
    concededPerMatch: "Gegentore/Spiel",
    cleanSheets: "Zu-Null-Spiele",
    failedToScore: "Ohne Torerfolg",
    discipline: "Disziplin",
    yellowCards: "Gelbe Karten",
    redCards: "Rote Karten",
    cardsPerMatch: "Karten/Spiel",
    recentForm: "Aktuelle Form",
    lastMatches: "Letzte {count} Spiele",
    win: "Sieg",
    draw: "Unentschieden",
    loss: "Niederlage",
    squad: "Kader",
    players: "Spieler",
    player: "Spieler",
    position: "Position",
    age: "Alter",
    apps: "Einsätze",
    minutes: "Minuten",
    goals: "Tore",
    assists: "Vorlagen",
    rating: "Bewertung",
    viewProfile: "Profil ansehen",
    noPlayerData: "Keine Spielerdaten verfügbar",
    login: "Anmelden",
    getStarted: "Loslegen",
  },
  FR: {
    home: "Accueil",
    predictions: "Prédictions",
    leagues: "Ligues",
    performance: "Performance IA",
    community: "Communauté",
    news: "Actualités",
    solution: "Solution",
    pricing: "Tarifs",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez de manière responsable.",
    allRights: "© 2026 OddsFlow. Tous droits réservés.",
    footerDesc: "Analyse des cotes de football par IA pour des predictions plus intelligentes.",
    product: "Produit",
    company: "Entreprise",
    legal: "Legal",
    aboutUs: "A Propos",
    contact: "Contact",
    blog: "Blog",
    termsOfService: "Conditions d'Utilisation",
    privacyPolicy: "Politique de Confidentialite",
    allRightsReserved: "Tous droits reserves.",
    gamblingWarning: "Les jeux d'argent comportent des risques. Jouez de maniere responsable.",
    popularLeagues: "Ligues Populaires",
    aiPredictionsFooter: "Prédictions IA",
    aiFootballPredictions: "Prédictions Football IA",
    onextwoPredictions: "Prédictions 1x2",
    overUnderTips: "Conseils Over/Under",
    handicapBetting: "Paris Handicap",
    aiBettingPerformance: "Performance Paris IA",
    footballTipsToday: "Pronostics Foot Aujourd'hui",
    backTo: "Retour à",
    leagueNotFound: "Ligue non trouvée",
    teamNotFound: "Équipe non trouvée",
    loadingTeamData: "Chargement des données...",
    season: "Saison",
    points: "Points",
    winRate: "Taux de Victoire",
    played: "Joués",
    wins: "Victoires",
    draws: "Nuls",
    losses: "Défaites",
    goalsFor: "Buts Marqués",
    goalsAgainst: "Buts Encaissés",
    teamFormation: "Formation d'Équipe",
    allFormationsUsed: "Toutes les Formations Utilisées",
    performanceStats: "Performance",
    goalDifference: "Différence de Buts",
    goalsPerMatch: "Buts/Match",
    concededPerMatch: "Encaissés/Match",
    cleanSheets: "Clean Sheets",
    failedToScore: "Sans Marquer",
    discipline: "Discipline",
    yellowCards: "Cartons Jaunes",
    redCards: "Cartons Rouges",
    cardsPerMatch: "Cartons/Match",
    recentForm: "Forme Récente",
    lastMatches: "Derniers {count} matchs",
    win: "Victoire",
    draw: "Nul",
    loss: "Défaite",
    squad: "Effectif",
    players: "Joueurs",
    player: "Joueur",
    position: "Position",
    age: "Âge",
    apps: "Matchs",
    minutes: "Minutes",
    goals: "Buts",
    assists: "Passes Décisives",
    rating: "Note",
    viewProfile: "Voir le Profil",
    noPlayerData: "Aucune donnée de joueur disponible",
    login: "Connexion",
    getStarted: "Commencer",
  },
  JA: {
    home: "ホーム",
    predictions: "予測",
    leagues: "リーグ",
    performance: "AI パフォーマンス",
    community: "コミュニティ",
    news: "ニュース",
    solution: "ソリューション",
    pricing: "料金",
    footer: "18歳以上 | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    footerDesc: "AIによるサッカーオッズ分析で、より賢い予測を。",
    product: "製品",
    company: "会社",
    legal: "法的情報",
    aboutUs: "会社概要",
    contact: "お問い合わせ",
    blog: "ブログ",
    termsOfService: "利用規約",
    privacyPolicy: "プライバシーポリシー",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    popularLeagues: "人気リーグ",
    aiPredictionsFooter: "AI予測",
    aiFootballPredictions: "AIサッカー予測",
    onextwoPredictions: "1x2予測",
    overUnderTips: "オーバー/アンダー予想",
    handicapBetting: "ハンディキャップベット",
    aiBettingPerformance: "AIベッティング実績",
    footballTipsToday: "今日のサッカー予想",
    backTo: "戻る",
    leagueNotFound: "リーグが見つかりません",
    teamNotFound: "チームが見つかりません",
    loadingTeamData: "チームデータを読み込み中...",
    season: "シーズン",
    points: "ポイント",
    winRate: "勝率",
    played: "試合数",
    wins: "勝利",
    draws: "引分",
    losses: "敗北",
    goalsFor: "得点",
    goalsAgainst: "失点",
    teamFormation: "チームフォーメーション",
    allFormationsUsed: "使用した全フォーメーション",
    performanceStats: "パフォーマンス",
    goalDifference: "得失点差",
    goalsPerMatch: "得点/試合",
    concededPerMatch: "失点/試合",
    cleanSheets: "クリーンシート",
    failedToScore: "無得点",
    discipline: "規律",
    yellowCards: "イエローカード",
    redCards: "レッドカード",
    cardsPerMatch: "カード/試合",
    recentForm: "最近の調子",
    lastMatches: "直近{count}試合",
    win: "勝",
    draw: "分",
    loss: "敗",
    squad: "選手一覧",
    players: "選手",
    player: "選手",
    position: "ポジション",
    age: "年齢",
    apps: "出場",
    minutes: "分",
    goals: "得点",
    assists: "アシスト",
    rating: "評価",
    viewProfile: "プロフィール",
    noPlayerData: "選手データがありません",
    login: "ログイン",
    getStarted: "始める",
  },
  KO: {
    home: "홈",
    predictions: "예측",
    leagues: "리그",
    performance: "AI 성과",
    community: "커뮤니티",
    news: "뉴스",
    solution: "솔루션",
    pricing: "가격",
    footer: "18세 이상 | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    footerDesc: "AI 기반 축구 배당률 분석으로 더 스마트한 예측을.",
    product: "제품",
    company: "회사",
    legal: "법적 정보",
    aboutUs: "회사 소개",
    contact: "연락처",
    blog: "블로그",
    termsOfService: "서비스 약관",
    privacyPolicy: "개인정보 처리방침",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    popularLeagues: "인기 리그",
    aiPredictionsFooter: "AI 예측",
    aiFootballPredictions: "AI 축구 예측",
    onextwoPredictions: "1x2 예측",
    overUnderTips: "오버/언더 팁",
    handicapBetting: "핸디캡 베팅",
    aiBettingPerformance: "AI 베팅 성과",
    footballTipsToday: "오늘의 축구 팁",
    backTo: "돌아가기",
    leagueNotFound: "리그를 찾을 수 없습니다",
    teamNotFound: "팀을 찾을 수 없습니다",
    loadingTeamData: "팀 데이터 로딩 중...",
    season: "시즌",
    points: "포인트",
    winRate: "승률",
    played: "경기",
    wins: "승",
    draws: "무",
    losses: "패",
    goalsFor: "득점",
    goalsAgainst: "실점",
    teamFormation: "팀 포메이션",
    allFormationsUsed: "사용된 모든 포메이션",
    performanceStats: "성과",
    goalDifference: "골득실",
    goalsPerMatch: "경기당 득점",
    concededPerMatch: "경기당 실점",
    cleanSheets: "클린시트",
    failedToScore: "무득점",
    discipline: "징계",
    yellowCards: "옐로카드",
    redCards: "레드카드",
    cardsPerMatch: "경기당 카드",
    recentForm: "최근 폼",
    lastMatches: "최근 {count}경기",
    win: "승",
    draw: "무",
    loss: "패",
    squad: "스쿼드",
    players: "선수",
    player: "선수",
    position: "포지션",
    age: "나이",
    apps: "출전",
    minutes: "분",
    goals: "골",
    assists: "도움",
    rating: "평점",
    viewProfile: "프로필 보기",
    noPlayerData: "선수 데이터가 없습니다",
    login: "로그인",
    getStarted: "시작하기",
  },
  '中文': {
    home: "首页",
    predictions: "预测",
    leagues: "联赛",
    performance: "AI 表现",
    community: "社区",
    news: "新闻",
    solution: "解决方案",
    pricing: "价格",
    footer: "18+ | 博彩有风险，请理性投注。",
    allRights: "© 2026 OddsFlow. 保留所有权利。",
    footerDesc: "AI驱动的足球赔率分析，助您做出更明智的预测。",
    product: "产品",
    company: "公司",
    legal: "法律信息",
    aboutUs: "关于我们",
    contact: "联系我们",
    blog: "博客",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
    allRightsReserved: "保留所有权利。",
    gamblingWarning: "博彩有风险，请理性投注。",
    popularLeagues: "热门联赛",
    aiPredictionsFooter: "AI 预测",
    aiFootballPredictions: "AI 足球预测",
    onextwoPredictions: "1x2 预测",
    overUnderTips: "大小球建议",
    handicapBetting: "让球盘投注",
    aiBettingPerformance: "AI 投注表现",
    footballTipsToday: "今日足球贴士",
    backTo: "返回",
    leagueNotFound: "未找到联赛",
    teamNotFound: "未找到球队",
    loadingTeamData: "加载球队数据中...",
    season: "赛季",
    points: "积分",
    winRate: "胜率",
    played: "已赛",
    wins: "胜",
    draws: "平",
    losses: "负",
    goalsFor: "进球",
    goalsAgainst: "失球",
    teamFormation: "球队阵型",
    allFormationsUsed: "所有使用过的阵型",
    performanceStats: "表现",
    goalDifference: "净胜球",
    goalsPerMatch: "场均进球",
    concededPerMatch: "场均失球",
    cleanSheets: "零封场次",
    failedToScore: "未进球场次",
    discipline: "纪律",
    yellowCards: "黄牌",
    redCards: "红牌",
    cardsPerMatch: "场均卡牌",
    recentForm: "近期状态",
    lastMatches: "近{count}场",
    win: "胜",
    draw: "平",
    loss: "负",
    squad: "阵容",
    players: "球员",
    player: "球员",
    position: "位置",
    age: "年龄",
    apps: "出场",
    minutes: "分钟",
    goals: "进球",
    assists: "助攻",
    rating: "评分",
    viewProfile: "查看详情",
    noPlayerData: "暂无球员数据",
    login: "登录",
    getStarted: "开始使用",
  },
  '繁體': {
    home: "首頁",
    predictions: "預測",
    leagues: "聯賽",
    performance: "AI 表現",
    community: "社區",
    news: "新聞",
    solution: "解決方案",
    pricing: "價格",
    footer: "18+ | 博彩有風險，請理性投注。",
    allRights: "© 2026 OddsFlow. 保留所有權利。",
    footerDesc: "AI驅動的足球賠率分析，助您做出更明智的預測。",
    product: "產品",
    company: "公司",
    legal: "法律資訊",
    aboutUs: "關於我們",
    contact: "聯繫我們",
    blog: "部落格",
    termsOfService: "服務條款",
    privacyPolicy: "隱私政策",
    allRightsReserved: "保留所有權利。",
    gamblingWarning: "博彩有風險，請理性投注。",
    popularLeagues: "熱門聯賽",
    aiPredictionsFooter: "AI 預測",
    aiFootballPredictions: "AI 足球預測",
    onextwoPredictions: "1x2 預測",
    overUnderTips: "大小球建議",
    handicapBetting: "讓球盤投注",
    aiBettingPerformance: "AI 投注表現",
    footballTipsToday: "今日足球貼士",
    backTo: "返回",
    leagueNotFound: "未找到聯賽",
    teamNotFound: "未找到球隊",
    loadingTeamData: "載入球隊資料中...",
    season: "賽季",
    points: "積分",
    winRate: "勝率",
    played: "已賽",
    wins: "勝",
    draws: "平",
    losses: "負",
    goalsFor: "進球",
    goalsAgainst: "失球",
    teamFormation: "球隊陣型",
    allFormationsUsed: "所有使用過的陣型",
    performanceStats: "表現",
    goalDifference: "淨勝球",
    goalsPerMatch: "場均進球",
    concededPerMatch: "場均失球",
    cleanSheets: "零封場次",
    failedToScore: "未進球場次",
    discipline: "紀律",
    yellowCards: "黃牌",
    redCards: "紅牌",
    cardsPerMatch: "場均卡牌",
    recentForm: "近期狀態",
    lastMatches: "近{count}場",
    win: "勝",
    draw: "平",
    loss: "負",
    squad: "陣容",
    players: "球員",
    player: "球員",
    position: "位置",
    age: "年齡",
    apps: "出場",
    minutes: "分鐘",
    goals: "進球",
    assists: "助攻",
    rating: "評分",
    viewProfile: "查看詳情",
    noPlayerData: "暫無球員資料",
    login: "登入",
    getStarted: "開始使用",
  },
  ID: {
    home: "Beranda",
    predictions: "Prediksi",
    leagues: "Liga",
    performance: "Performa AI",
    community: "Komunitas",
    news: "Berita",
    solution: "Solusi",
    pricing: "Harga",
    footer: "18+ | Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    allRights: "© 2026 OddsFlow. Hak cipta dilindungi.",
    footerDesc: "Analisis odds sepak bola berbasis AI untuk prediksi yang lebih cerdas.",
    product: "Produk",
    company: "Perusahaan",
    legal: "Hukum",
    aboutUs: "Tentang Kami",
    contact: "Kontak",
    blog: "Blog",
    termsOfService: "Syarat Layanan",
    privacyPolicy: "Kebijakan Privasi",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    popularLeagues: "Liga Populer",
    aiPredictionsFooter: "Prediksi AI",
    aiFootballPredictions: "Prediksi Sepak Bola AI",
    onextwoPredictions: "Prediksi 1x2",
    overUnderTips: "Tips Over/Under",
    handicapBetting: "Taruhan Handicap",
    aiBettingPerformance: "Performa Taruhan AI",
    footballTipsToday: "Tips Sepak Bola Hari Ini",
    backTo: "Kembali ke",
    leagueNotFound: "Liga tidak ditemukan",
    teamNotFound: "Tim tidak ditemukan",
    loadingTeamData: "Memuat data tim...",
    season: "Musim",
    points: "Poin",
    winRate: "Tingkat Kemenangan",
    played: "Dimainkan",
    wins: "Menang",
    draws: "Seri",
    losses: "Kalah",
    goalsFor: "Gol Dicetak",
    goalsAgainst: "Gol Kemasukan",
    teamFormation: "Formasi Tim",
    allFormationsUsed: "Semua Formasi yang Digunakan",
    performanceStats: "Performa",
    goalDifference: "Selisih Gol",
    goalsPerMatch: "Gol/Pertandingan",
    concededPerMatch: "Kemasukan/Pertandingan",
    cleanSheets: "Clean Sheet",
    failedToScore: "Gagal Mencetak Gol",
    discipline: "Disiplin",
    yellowCards: "Kartu Kuning",
    redCards: "Kartu Merah",
    cardsPerMatch: "Kartu/Pertandingan",
    recentForm: "Form Terkini",
    lastMatches: "{count} pertandingan terakhir",
    win: "Menang",
    draw: "Seri",
    loss: "Kalah",
    squad: "Skuad",
    players: "Pemain",
    player: "Pemain",
    position: "Posisi",
    age: "Usia",
    apps: "Penampilan",
    minutes: "Menit",
    goals: "Gol",
    assists: "Assist",
    rating: "Rating",
    viewProfile: "Lihat Profil",
    noPlayerData: "Data pemain tidak tersedia",
    login: "Masuk",
    getStarted: "Mulai",
  },
};

// League configuration
const LEAGUES_CONFIG: Record<string, { name: string; country: string; logo: string; dbName: string }> = {
  'premier-league': { name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', dbName: 'Premier League' },
  'bundesliga': { name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', dbName: 'Bundesliga' },
  'serie-a': { name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', dbName: 'Serie A' },
  'la-liga': { name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', dbName: 'La Liga' },
  'ligue-1': { name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', dbName: 'Ligue 1' },
  'champions-league': { name: 'Champions League', country: 'UEFA', logo: 'https://media.api-sports.io/football/leagues/2.png', dbName: 'UEFA Champions League' },
};

// Formation positions mapping
const FORMATION_POSITIONS: Record<string, number[][]> = {
  '4-3-3': [[1], [2, 3, 4, 5], [6, 7, 8], [9, 10, 11]],
  '4-4-2': [[1], [2, 3, 4, 5], [6, 7, 8, 9], [10, 11]],
  '4-2-3-1': [[1], [2, 3, 4, 5], [6, 7], [8, 9, 10], [11]],
  '3-5-2': [[1], [2, 3, 4], [5, 6, 7, 8, 9], [10, 11]],
  '3-4-3': [[1], [2, 3, 4], [5, 6, 7, 8], [9, 10, 11]],
  '5-3-2': [[1], [2, 3, 4, 5, 6], [7, 8, 9], [10, 11]],
  '5-4-1': [[1], [2, 3, 4, 5, 6], [7, 8, 9, 10], [11]],
  '4-1-4-1': [[1], [2, 3, 4, 5], [6], [7, 8, 9, 10], [11]],
  '4-5-1': [[1], [2, 3, 4, 5], [6, 7, 8, 9, 10], [11]],
};

// Props interface for server-side data
export interface TeamClientProps {
  initialTeam: TeamStatistics | null;
  initialPlayers: PlayerStats[];
}

export default function TeamProfilePage({ initialTeam, initialPlayers }: TeamClientProps) {
  const params = useParams();
  const urlLocale = (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';
  const leagueSlug = params.league as string;
  const teamSlug = params.team as string;
  const leagueConfig = LEAGUES_CONFIG[leagueSlug];

  // Helper function for locale-aware paths
  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  // Helper for language dropdown URLs
  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = `/leagues/${leagueSlug}/${teamSlug}`;
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const [mounted, setMounted] = useState(false);
  const [team, setTeam] = useState<TeamStatistics | null>(initialTeam);
  const [players, setPlayers] = useState<PlayerStats[]>(initialPlayers);
  const [loading, setLoading] = useState(!initialTeam); // Not loading if we have initial data
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<string>(initialTeam?.most_used_formation || '4-3-3');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Translation helper
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  // Wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check user authentication
  useEffect(() => {
    if (!mounted) return;
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    // Skip fetch if we already have initial data from server
    if (initialTeam) {
      setLoading(false);
      return;
    }

    async function fetchTeam() {
      if (!teamSlug || !leagueConfig) return;

      setLoading(true);
      const { data, error } = await getTeamStatsByName(teamSlug, leagueConfig.dbName);

      if (data && !error) {
        setTeam(data);
        setSelectedFormation(data.most_used_formation || '4-3-3');

        // Fetch players for this team
        if (data.team_id) {
          setLoadingPlayers(true);
          const { data: playersData } = await getPlayerStatsByTeam(data.team_id);
          if (playersData) {
            setPlayers(playersData);
          }
          setLoadingPlayers(false);
        }
      }
      setLoading(false);
    }

    fetchTeam();
  }, [mounted, teamSlug, leagueConfig, initialTeam]);

  // Render formation pitch
  const renderFormationPitch = (formation: string) => {
    const positions = FORMATION_POSITIONS[formation] || FORMATION_POSITIONS['4-3-3'];

    return (
      <div className="relative w-32 h-48 rounded-xl overflow-hidden bg-gradient-to-b from-emerald-800 to-emerald-900 border-2 border-emerald-600/50 shadow-lg shadow-emerald-500/20">
        {/* Pitch markings */}
        <div className="absolute inset-0">
          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-white/30 rounded-full" />
          {/* Top penalty area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 border-b border-l border-r border-white/30" />
          {/* Bottom penalty area */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 border-t border-l border-r border-white/30" />
        </div>

        {/* Players */}
        <div className="relative h-full flex flex-col justify-around py-2 px-1">
          {positions.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-around items-center">
              {row.map((_, playerIdx) => (
                <div
                  key={playerIdx}
                  className={`w-4 h-4 rounded-full ${
                    rowIdx === 0
                      ? 'bg-yellow-400 shadow-yellow-400/50'
                      : 'bg-cyan-400 shadow-cyan-400/50'
                  } shadow-lg ring-2 ring-white/30 transition-transform hover:scale-125`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Formation label */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/50 rounded text-[10px] text-white font-bold">
          {formation}
        </div>
      </div>
    );
  };

  if (!leagueConfig) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <p className="text-gray-400">{t('leagueNotFound')}</p>
      </div>
    );
  }

  const goalDiff = (team?.goals_for_total || 0) - (team?.goals_against_total || 0);
  const points = ((team?.total_wins || 0) * 3) + (team?.total_draws || 0);
  const winRate = team?.total_played ? ((team.total_wins || 0) / team.total_played * 100).toFixed(1) : '0';

  // Show loading screen only if we don't have initial data and not mounted yet
  // If we have initialTeam, render content for SSR even if not mounted
  if (!mounted && !initialTeam) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0f] to-[#1a1a2e]" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0f] to-[#1a1a2e]" />
      </div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-emerald-500/8 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
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

            {/* Right side - Language, Auth, FIFA, Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer"
                >
                  <FlagIcon code={currentLang.code} size={20} />
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
                          {locale === loc && (
                            <svg className="w-4 h-4 ml-auto text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Auth Buttons */}
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

              {/* World Cup Special Button - Always Visible */}
              <Link
                href={localePath('/worldcup')}
                className="relative hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all cursor-pointer group overflow-hidden hover:scale-105"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                <img
                  src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png"
                  alt="FIFA World Cup 2026"
                  className="h-5 w-auto object-contain relative z-10"
                />
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
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 border-2 border-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img
                  src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png"
                  alt="FIFA World Cup 2026"
                  className="h-8 w-auto object-contain relative z-10"
                />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
              </Link>

              <Link href={localePath('/')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-300 hover:bg-white/5 hover:text-white">{t('home')}</Link>
              <Link href={localePath('/predictions')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-300 hover:bg-white/5 hover:text-white">{t('predictions')}</Link>
              <Link href={localePath('/leagues')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium transition-all bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t('leagues')}</Link>
              <Link href={localePath('/performance')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-300 hover:bg-white/5 hover:text-white">{t('performance')}</Link>
              <Link href={localePath('/community')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-300 hover:bg-white/5 hover:text-white">{t('community')}</Link>
              <Link href={localePath('/news')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-300 hover:bg-white/5 hover:text-white">{t('news')}</Link>
              <Link href={localePath('/solution')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-300 hover:bg-white/5 hover:text-white">{t('solution')}</Link>
              <Link href={localePath('/pricing')} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium transition-all text-gray-300 hover:bg-white/5 hover:text-white">{t('pricing')}</Link>

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
                    className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
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
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href={localePath(`/leagues/${leagueSlug}`)} className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors mb-6 group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backTo')} {leagueConfig.name}
          </Link>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <p className="mt-4 text-gray-400">{t('loadingTeamData')}</p>
            </div>
          ) : !team ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">{t('teamNotFound')}</p>
            </div>
          ) : (
            <>
              {/* Hero Header */}
              <div className="relative mb-8 rounded-3xl overflow-hidden">
                {/* Background gradient based on team */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-gray-900/80 to-cyan-900/30" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    {/* Team Logo with glow */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all opacity-60" />
                      <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-white/10 backdrop-blur-sm p-4 border border-white/20 shadow-2xl">
                        {team.logo ? (
                          <img src={team.logo} alt={team.team_name || ''} className="w-full h-full object-contain drop-shadow-2xl" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl font-bold">
                            {team.team_name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 text-center lg:text-left">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                        {team.team_name}
                      </h1>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                        <span className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 text-sm font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          {team.team_country}
                        </span>
                        {team.team_founded && (
                          <span className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 text-sm font-medium">
                            Est. {team.team_founded}
                          </span>
                        )}
                        <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                          {leagueConfig.name}
                        </span>
                      </div>

                      {/* Venue */}
                      {team.venue_name && (
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-lg">{team.venue_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Season Stats Card */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                      <div className="relative px-8 py-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 text-center">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('season')} {team.season}</p>
                        <div className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                          {points}
                        </div>
                        <p className="text-gray-400 text-sm">{t('points')}</p>
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-4 text-sm">
                          <span className="text-emerald-400 font-semibold">{winRate}%</span>
                          <span className="text-gray-500">{t('winRate')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                  { label: t('played'), value: team.total_played || 0, color: 'text-white' },
                  { label: t('wins'), value: team.total_wins || 0, color: 'text-emerald-400' },
                  { label: t('draws'), value: team.total_draws || 0, color: 'text-yellow-400' },
                  { label: t('losses'), value: team.total_loses || 0, color: 'text-red-400' },
                  { label: t('goalsFor'), value: team.goals_for_total || 0, color: 'text-cyan-400' },
                  { label: t('goalsAgainst'), value: team.goals_against_total || 0, color: 'text-purple-400' },
                ].map((stat, idx) => (
                  <div key={idx} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl blur-sm group-hover:blur-md transition-all" />
                    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-white/10 transition-all">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Formation Section */}
                <div className="lg:col-span-1">
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-2xl" />
                    <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>
                        {t('teamFormation')}
                      </h3>

                      {/* Formation Pitch Display */}
                      <div className="flex justify-center mb-6">
                        {renderFormationPitch(selectedFormation)}
                      </div>

                      {/* All Formations */}
                      {team.all_formations && (
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">{t('allFormationsUsed')}</p>
                          <div className="flex flex-wrap gap-2">
                            {team.all_formations.split(',').map((formation, idx) => {
                              const formationTrimmed = formation.trim();
                              const isSelected = selectedFormation === formationTrimmed;
                              const isMostUsed = formationTrimmed === team.most_used_formation;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedFormation(formationTrimmed)}
                                  className={`relative px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ring-2 ring-emerald-500/30'
                                      : 'bg-gray-800/50 text-gray-300 border border-white/5 hover:bg-gray-700/50 hover:text-white hover:border-white/10'
                                  }`}
                                >
                                  {formationTrimmed}
                                  {isMostUsed && (
                                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[8px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-full">
                                      TOP
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance & Discipline */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Stats */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl" />
                    <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        {t('performanceStats')}
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: t('goalDifference'), value: goalDiff > 0 ? `+${goalDiff}` : goalDiff, color: goalDiff > 0 ? 'text-emerald-400' : goalDiff < 0 ? 'text-red-400' : 'text-gray-400' },
                          { label: t('goalsPerMatch'), value: team.goals_for_average?.toFixed(2) || '0.00', color: 'text-cyan-400' },
                          { label: t('concededPerMatch'), value: team.goals_against_average?.toFixed(2) || '0.00', color: 'text-orange-400' },
                          { label: t('cleanSheets'), value: team.clean_sheets || 0, color: 'text-emerald-400' },
                          { label: t('failedToScore'), value: team.failed_to_score || 0, color: 'text-red-400' },
                        ].map((stat, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                            <span className="text-gray-400">{stat.label}</span>
                            <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Discipline Stats */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-red-500/5 rounded-2xl" />
                    <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        {t('discipline')}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">{t('yellowCards')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-5 rounded-sm bg-yellow-400" />
                            <span className="font-bold text-lg text-yellow-400">{team.yellow_cards_total || 0}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">{t('redCards')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-5 rounded-sm bg-red-500" />
                            <span className="font-bold text-lg text-red-400">{team.red_cards_total || 0}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400">{t('cardsPerMatch')}</span>
                          <span className="font-bold text-lg text-orange-400">
                            {team.total_played ? (((team.yellow_cards_total || 0) + (team.red_cards_total || 0)) / team.total_played).toFixed(1) : '0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Form */}
              {team.form && (
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-yellow-500/5 to-red-500/5 rounded-2xl" />
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      {t('recentForm')}
                      <span className="text-gray-500 text-sm font-normal ml-2">{t('lastMatches').replace('{count}', String(team.form.length))}</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {team.form.split('').map((result, idx) => (
                        <div
                          key={idx}
                          className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-transform hover:scale-110 ${
                            result === 'W'
                              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                              : result === 'D'
                              ? 'bg-gradient-to-br from-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/30'
                              : 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500" />
                        <span className="text-gray-400">{t('win')}: {team.form.split('').filter(r => r === 'W').length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-yellow-500" />
                        <span className="text-gray-400">{t('draw')}: {team.form.split('').filter(r => r === 'D').length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span className="text-gray-400">{t('loss')}: {team.form.split('').filter(r => r === 'L').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Squad Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-2xl" />
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      {t('squad')}
                    </h3>
                    <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20">
                      {players.length} {t('players')}
                    </span>
                  </div>

                  {loadingPlayers ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                  ) : players.length > 0 ? (
                    <>
                    {/* Desktop Table */}
                    <div className="overflow-x-auto rounded-xl border border-white/10 hidden md:block">
                      <table className="w-full">
                        <thead className="bg-gray-900/95">
                          <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
                            <th className="text-left py-3 px-4 font-semibold">{t('player')}</th>
                            <th className="text-center py-3 px-3 font-semibold">{t('position')}</th>
                            <th className="text-center py-3 px-3 font-semibold">{t('age')}</th>
                            <th className="text-center py-3 px-3 font-semibold">{t('apps')}</th>
                            <th className="text-center py-3 px-3 font-semibold">{t('minutes')}</th>
                            <th className="text-center py-3 px-3 font-semibold">{t('goals')}</th>
                            <th className="text-center py-3 px-3 font-semibold">{t('assists')}</th>
                            <th className="text-center py-3 px-3 font-semibold">{t('rating')}</th>
                            <th className="text-center py-3 px-3 font-semibold"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {players.map((player) => (
                            <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    {player.photo ? (
                                      <img src={player.photo} alt={player.player_name || ''} className="w-10 h-10 rounded-xl object-cover bg-gray-700 ring-2 ring-white/10" />
                                    ) : (
                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400 text-sm font-medium ring-2 ring-white/10">
                                        {player.player_name?.charAt(0) || '?'}
                                      </div>
                                    )}
                                    {player.captain && (
                                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-black">
                                        C
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-white font-medium group-hover:text-emerald-400 transition-colors">{player.player_name}</span>
                                      {player.injured && (
                                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500/20 text-red-400 rounded">INJ</span>
                                      )}
                                    </div>
                                    <span className="text-gray-500 text-xs">{player.nationality}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center py-3 px-3">
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                  player.position === 'Goalkeeper' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                                  player.position === 'Defender' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                                  player.position === 'Midfielder' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                  'bg-red-500/20 text-red-400 border border-red-500/20'
                                }`}>
                                  {player.position || '-'}
                                </span>
                              </td>
                              <td className="text-center py-3 px-3 text-gray-300">{player.age || '-'}</td>
                              <td className="text-center py-3 px-3 text-gray-300">{player.appearances || 0}</td>
                              <td className="text-center py-3 px-3 text-gray-400">{player.minutes || 0}</td>
                              <td className="text-center py-3 px-3">
                                <span className="text-emerald-400 font-semibold">{player.goals_total || 0}</span>
                              </td>
                              <td className="text-center py-3 px-3">
                                <span className="text-cyan-400 font-semibold">{player.assists || 0}</span>
                              </td>
                              <td className="text-center py-3 px-3">
                                {player.rating ? (
                                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                    player.rating >= 7.5 ? 'bg-emerald-500/20 text-emerald-400' :
                                    player.rating >= 7 ? 'bg-green-500/20 text-green-400' :
                                    player.rating >= 6.5 ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {Number(player.rating).toFixed(1)}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </td>
                              <td className="text-center py-3 px-3">
                                <Link
                                  href={localePath(`/leagues/${leagueSlug}/player/${player.id}`)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                                >
                                  {t('viewProfile')}
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="md:hidden space-y-3">
                      {players.map((player) => (
                        <div key={player.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          {/* Row 1: Player Info & Rating */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                {player.photo ? (
                                  <img src={player.photo} alt={player.player_name || ''} className="w-12 h-12 rounded-xl object-cover bg-gray-700 ring-2 ring-white/10" />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400 font-medium ring-2 ring-white/10">
                                    {player.player_name?.charAt(0) || '?'}
                                  </div>
                                )}
                                {player.captain && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-black">
                                    C
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">{player.player_name}</span>
                                  {player.injured && (
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500/20 text-red-400 rounded">INJ</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-gray-500 text-xs">{player.nationality}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                    player.position === 'Goalkeeper' ? 'bg-yellow-500/20 text-yellow-400' :
                                    player.position === 'Defender' ? 'bg-blue-500/20 text-blue-400' :
                                    player.position === 'Midfielder' ? 'bg-green-500/20 text-green-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {player.position?.substring(0, 3).toUpperCase() || '-'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {player.rating ? (
                              <span className={`px-2.5 py-1.5 rounded-lg text-sm font-bold ${
                                player.rating >= 7.5 ? 'bg-emerald-500/20 text-emerald-400' :
                                player.rating >= 7 ? 'bg-green-500/20 text-green-400' :
                                player.rating >= 6.5 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {Number(player.rating).toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </div>

                          {/* Row 2: Stats Grid */}
                          <div className="grid grid-cols-5 gap-2 text-center text-xs py-3 border-t border-b border-white/5">
                            <div>
                              <span className="text-gray-500 block text-[10px]">{t('age')}</span>
                              <span className="text-gray-300">{player.age || '-'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">{t('apps')}</span>
                              <span className="text-gray-300">{player.appearances || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">{t('minutes')}</span>
                              <span className="text-gray-400">{player.minutes || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">{t('goals')}</span>
                              <span className="text-emerald-400 font-semibold">{player.goals_total || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">{t('assists')}</span>
                              <span className="text-cyan-400 font-semibold">{player.assists || 0}</span>
                            </div>
                          </div>

                          {/* Row 3: View Profile */}
                          <div className="flex justify-end pt-3">
                            <Link
                              href={localePath(`/leagues/${leagueSlug}/player/${player.id}`)}
                              className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                            >
                              {t('viewProfile')}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">{t('noPlayerData')}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>{t('allRights')} {t('gamblingWarning')}</p>
        </div>
      </footer>
    </div>
  );
}
