'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, ProfitSummary } from '@/lib/supabase';
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
  ReferenceLine,
} from 'recharts';

import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeNames, localeToTranslationCode, type Locale } from '@/i18n/config';
import { generateMatchSlug } from '@/lib/slug-utils';
import Footer from '@/components/Footer';

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    performance: "AI Performance",
    performanceTitle: "AI Football Prediction Performance",
    performanceSubtitle: "Verified Track Record & Real-Time ROI Analysis",
    totalProfit: "Total Profit",
    winRate: "Win Rate",
    totalBets: "Total Bets",
    totalMatches: "Total Matches",
    roi: "ROI",
    profitByMarket: "Profit by Market",
    recommended: "Recommended",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    betStyle: "Bet Style:",
    allStyles: "All Styles",
    hdpSniper: "HDP Sniper",
    activeTrader: "Active Trader",
    oddsflowCore: "Oddsflow Core Strategy",
    oddsflowBeta: "Oddsflow Beta",
    searchTeams: "Search teams...",
    from: "From",
    to: "To",
    showing: "Showing",
    of: "of",
    matches: "matches",
    previous: "Previous",
    next: "Next",
    comingSoon: "COMING SOON",
    score: "SCORE",
    total: "TOTAL",
    aiPerformance: "AI Performance",
    transparentAI: "Transparent AI",
    safestTips: "Safest Tips",
    mostAccurate: "Most Accurate",
    today: "Today",
    dayAgo: "day ago",
    daysAgo: "days ago",
    profitSummary: "Profit Summary",
    totalInvested: "Total Invested",
    moneyline1x2: "1X2 Moneyline",
    asianHandicap: "Asian Handicap",
    betDetails: "Bet Details",
    yearlyPerformance: "Yearly Performance",
    pastMatches: "Past Matches",
    allLeagues: "All Leagues",
    noMatches: "No matches found",
    loading: "Loading...",
    home: "Home", predictions: "Predictions", leagues: "Leagues", community: "Community", news: "News", pricing: "Pricing",
    login: "Log In", getStarted: "Get Started",
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
    responsibleGaming: "Responsible Gaming",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    units: "units",
    invested: "Invested",
    bets: "Bets",
    cumulativeProfit: "Cumulative Profit",
    popularLeagues: "Popular Leagues",
    aiPredictionsFooter: "AI Predictions",
    aiFootballPredictions: "AI Football Predictions",
    onextwoPredictions: "1x2 Predictions",
    overUnderTips: "Over/Under Tips",
    handicapBetting: "Handicap Betting",
    aiBettingPerformance: "AI Betting Performance",
    footballTipsToday: "Football Tips Today",
    solution: "Solution",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
    todayMatches: "Today Matches",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
  },
  ES: {
    performance: "Rendimiento IA",
    performanceTitle: "Rendimiento de Predicciones de Fútbol IA",
    performanceSubtitle: "Historial Verificado y Análisis de ROI en Tiempo Real",
    totalProfit: "Ganancia Total",
    winRate: "Tasa de Acierto",
    totalBets: "Apuestas Totales",
    totalMatches: "Partidos Totales",
    roi: "ROI",
    profitByMarket: "Ganancia por Mercado",
    recommended: "Recomendado",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    betStyle: "Estilo de Apuesta:",
    allStyles: "Todos los Estilos",
    hdpSniper: "HDP Sniper",
    activeTrader: "Trader Activo",
    oddsflowCore: "Estrategia Principal Oddsflow",
    oddsflowBeta: "Oddsflow Beta",
    searchTeams: "Buscar equipos...",
    from: "Desde",
    to: "Hasta",
    showing: "Mostrando",
    of: "de",
    matches: "partidos",
    previous: "Anterior",
    next: "Siguiente",
    comingSoon: "PRÓXIMAMENTE",
    score: "RESULTADO",
    total: "TOTAL",
    aiPerformance: "Rendimiento IA",
    transparentAI: "IA Transparente",
    safestTips: "Consejos Seguros",
    mostAccurate: "Más Preciso",
    today: "Hoy",
    dayAgo: "día atrás",
    daysAgo: "días atrás",
    profitSummary: "Resumen de Ganancias",
    totalInvested: "Total Invertido",
    moneyline1x2: "1X2 Ganador",
    asianHandicap: "Hándicap Asiático",
    betDetails: "Detalles de Apuestas",
    yearlyPerformance: "Rendimiento Anual",
    pastMatches: "Partidos Pasados",
    allLeagues: "Todas las Ligas",
    noMatches: "No se encontraron partidos",
    loading: "Cargando...",
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", community: "Comunidad", news: "Noticias", pricing: "Precios",
    login: "Iniciar Sesión", getStarted: "Comenzar",
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
    responsibleGaming: "Juego Responsable",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juega responsablemente.",
    units: "unidades",
    invested: "Invertido",
    bets: "Apuestas",
    cumulativeProfit: "Ganancia Acumulada",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Predicciones IA",
    aiFootballPredictions: "Predicciones de Futbol IA",
    onextwoPredictions: "Predicciones 1x2",
    overUnderTips: "Consejos Over/Under",
    handicapBetting: "Apuestas Handicap",
    aiBettingPerformance: "Rendimiento de Apuestas IA",
    footballTipsToday: "Tips de Futbol Hoy",
    solution: "Solucion",
    communityFooter: "Comunidad",
    globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios",
    todayMatches: "Partidos de Hoy",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No se garantizan ganancias. Por favor, apueste de manera responsable.",
  },
  PT: {
    performance: "Desempenho IA",
    performanceTitle: "Desempenho de Previsões de Futebol IA",
    performanceSubtitle: "Histórico Verificado e Análise de ROI em Tempo Real",
    totalProfit: "Lucro Total",
    winRate: "Taxa de Acerto",
    totalBets: "Apostas Totais",
    totalMatches: "Total de Partidas",
    roi: "ROI",
    profitByMarket: "Lucro por Mercado",
    recommended: "Recomendado",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    betStyle: "Estilo de Aposta:",
    allStyles: "Todos os Estilos",
    hdpSniper: "HDP Sniper",
    activeTrader: "Trader Ativo",
    oddsflowCore: "Estratégia Principal Oddsflow",
    oddsflowBeta: "Oddsflow Beta",
    searchTeams: "Pesquisar times...",
    from: "De",
    to: "Até",
    showing: "Mostrando",
    of: "de",
    matches: "partidas",
    previous: "Anterior",
    next: "Próximo",
    comingSoon: "EM BREVE",
    score: "PLACAR",
    total: "TOTAL",
    aiPerformance: "Desempenho IA",
    transparentAI: "IA Transparente",
    safestTips: "Dicas Seguras",
    mostAccurate: "Mais Preciso",
    today: "Hoje",
    dayAgo: "dia atrás",
    daysAgo: "dias atrás",
    profitSummary: "Resumo de Lucros",
    totalInvested: "Total Investido",
    moneyline1x2: "1X2 Vencedor",
    asianHandicap: "Handicap Asiático",
    betDetails: "Detalhes das Apostas",
    yearlyPerformance: "Desempenho Anual",
    pastMatches: "Partidas Passadas",
    allLeagues: "Todas as Ligas",
    noMatches: "Nenhuma partida encontrada",
    loading: "Carregando...",
    home: "Início", predictions: "Previsões", leagues: "Ligas", community: "Comunidade", news: "Notícias", pricing: "Preços",
    login: "Entrar", getStarted: "Começar",
    footer: "18+ | O jogo envolve risco. Por favor, jogue com responsabilidade.",
    allRights: "© 2026 OddsFlow. Todos os direitos reservados.",
    footerDesc: "Analise de odds de futebol com IA para previsoes mais inteligentes.",
    product: "Produto",
    company: "Empresa",
    legal: "Legal",
    aboutUs: "Sobre Nos",
    contact: "Contato",
    blog: "Blog",
    termsOfService: "Termos de Servico",
    privacyPolicy: "Politica de Privacidade",
    responsibleGaming: "Jogo Responsavel",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    units: "unidades",
    invested: "Investido",
    bets: "Apostas",
    cumulativeProfit: "Lucro Acumulado",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Previsoes IA",
    aiFootballPredictions: "Previsoes de Futebol IA",
    onextwoPredictions: "Previsoes 1x2",
    overUnderTips: "Dicas Over/Under",
    handicapBetting: "Apostas Handicap",
    aiBettingPerformance: "Desempenho de Apostas IA",
    footballTipsToday: "Dicas de Futebol Hoje",
    solution: "Solucao",
    communityFooter: "Comunidade",
    globalChat: "Chat Global",
    userPredictions: "Previsoes de Usuarios",
    todayMatches: "Jogos de Hoje",
    disclaimer: "Aviso: OddsFlow fornece previsoes baseadas em IA apenas para fins informativos e de entretenimento. Nao ha garantia de lucros. Por favor, aposte com responsabilidade.",
  },
  DE: {
    performance: "KI-Leistung",
    performanceTitle: "KI-Fußballvorhersage Leistung",
    performanceSubtitle: "Verifizierte Erfolgsbilanz & Echtzeit-ROI-Analyse",
    totalProfit: "Gesamtgewinn",
    winRate: "Gewinnrate",
    totalBets: "Gesamtwetten",
    totalMatches: "Gesamtspiele",
    roi: "ROI",
    profitByMarket: "Gewinn nach Markt",
    recommended: "Empfohlen",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    betStyle: "Wettstil:",
    allStyles: "Alle Stile",
    hdpSniper: "HDP Sniper",
    activeTrader: "Aktiver Trader",
    oddsflowCore: "Oddsflow Kernstrategie",
    oddsflowBeta: "Oddsflow Beta",
    searchTeams: "Teams suchen...",
    from: "Von",
    to: "Bis",
    showing: "Zeige",
    of: "von",
    matches: "Spiele",
    previous: "Zurück",
    next: "Weiter",
    comingSoon: "DEMNÄCHST",
    score: "ERGEBNIS",
    total: "GESAMT",
    aiPerformance: "KI-Leistung",
    transparentAI: "Transparente KI",
    safestTips: "Sicherste Tipps",
    mostAccurate: "Am Genauesten",
    today: "Heute",
    dayAgo: "Tag her",
    daysAgo: "Tage her",
    profitSummary: "Gewinnübersicht",
    totalInvested: "Gesamtinvestition",
    moneyline1x2: "1X2 Siegwette",
    asianHandicap: "Asiatisches Handicap",
    betDetails: "Wettdetails",
    yearlyPerformance: "Jahresleistung",
    pastMatches: "Vergangene Spiele",
    allLeagues: "Alle Ligen",
    noMatches: "Keine Spiele gefunden",
    loading: "Laden...",
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", community: "Community", news: "Nachrichten", pricing: "Preise",
    login: "Anmelden", getStarted: "Loslegen",
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
    privacyPolicy: "Datenschutz",
    responsibleGaming: "Verantwortungsvolles Spielen",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glucksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    units: "Einheiten",
    invested: "Investiert",
    bets: "Wetten",
    cumulativeProfit: "Kumulierter Gewinn",
    popularLeagues: "Beliebte Ligen",
    aiPredictionsFooter: "KI-Vorhersagen",
    aiFootballPredictions: "KI-Fussballvorhersagen",
    onextwoPredictions: "1x2 Vorhersagen",
    overUnderTips: "Uber/Unter Tipps",
    handicapBetting: "Handicap-Wetten",
    aiBettingPerformance: "KI-Wettleistung",
    footballTipsToday: "Fussballtipps Heute",
    solution: "Losung",
    communityFooter: "Community",
    globalChat: "Globaler Chat",
    userPredictions: "Benutzer-Vorhersagen",
    todayMatches: "Heutige Spiele",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestutzte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Es werden keine Gewinne garantiert. Bitte wetten Sie verantwortungsvoll.",
  },
  FR: {
    performance: "Performance IA",
    performanceTitle: "Performance des Prédictions Football IA",
    performanceSubtitle: "Historique Vérifié et Analyse ROI en Temps Réel",
    totalProfit: "Profit Total",
    winRate: "Taux de Réussite",
    totalBets: "Paris Totaux",
    totalMatches: "Matchs Totaux",
    roi: "ROI",
    profitByMarket: "Profit par Marché",
    recommended: "Recommandé",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    betStyle: "Style de Pari:",
    allStyles: "Tous les Styles",
    hdpSniper: "HDP Sniper",
    activeTrader: "Trader Actif",
    oddsflowCore: "Stratégie Principale Oddsflow",
    oddsflowBeta: "Oddsflow Beta",
    searchTeams: "Rechercher des équipes...",
    from: "De",
    to: "À",
    showing: "Affichage",
    of: "de",
    matches: "matchs",
    previous: "Précédent",
    next: "Suivant",
    comingSoon: "BIENTÔT",
    score: "SCORE",
    total: "TOTAL",
    aiPerformance: "Performance IA",
    transparentAI: "IA Transparente",
    safestTips: "Conseils Sûrs",
    mostAccurate: "Plus Précis",
    today: "Aujourd'hui",
    dayAgo: "jour dernier",
    daysAgo: "jours derniers",
    profitSummary: "Résumé des Profits",
    totalInvested: "Total Investi",
    moneyline1x2: "1X2 Vainqueur",
    asianHandicap: "Handicap Asiatique",
    betDetails: "Détails des Paris",
    yearlyPerformance: "Performance Annuelle",
    pastMatches: "Matchs Passés",
    allLeagues: "Toutes les Ligues",
    noMatches: "Aucun match trouvé",
    loading: "Chargement...",
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", community: "Communauté", news: "Actualités", pricing: "Tarifs",
    login: "Connexion", getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez de manière responsable.",
    allRights: "© 2026 OddsFlow. Tous droits réservés.",
    footerDesc: "Analyse de cotes de football propulsee par l'IA pour des predictions plus intelligentes.",
    product: "Produit",
    company: "Entreprise",
    legal: "Mentions Legales",
    aboutUs: "A Propos",
    contact: "Contact",
    blog: "Blog",
    termsOfService: "Conditions d'Utilisation",
    privacyPolicy: "Politique de Confidentialite",
    responsibleGaming: "Jeu Responsable",
    allRightsReserved: "Tous droits reserves.",
    gamblingWarning: "Le jeu comporte des risques. Veuillez jouer de maniere responsable.",
    units: "unités",
    invested: "Investi",
    bets: "Paris",
    cumulativeProfit: "Profit Cumulé",
    popularLeagues: "Ligues Populaires",
    aiPredictionsFooter: "Prédictions IA",
    aiFootballPredictions: "Prédictions Football IA",
    onextwoPredictions: "Prédictions 1x2",
    overUnderTips: "Conseils Over/Under",
    handicapBetting: "Paris Handicap",
    aiBettingPerformance: "Performance Paris IA",
    footballTipsToday: "Pronostics Foot Aujourd'hui",
    solution: "Solution",
    communityFooter: "Communaute",
    globalChat: "Chat Global",
    userPredictions: "Predictions Utilisateurs",
    todayMatches: "Matchs du Jour",
    disclaimer: "Avertissement : OddsFlow fournit des predictions basees sur l'IA a des fins d'information et de divertissement uniquement. Aucun profit n'est garanti. Veuillez parier de maniere responsable.",
  },
  JA: {
    performance: "AI実績",
    performanceTitle: "AIサッカー予測の実績",
    performanceSubtitle: "検証済みトラックレコード＆リアルタイムROI分析",
    totalProfit: "総利益",
    winRate: "勝率",
    totalBets: "総ベット数",
    totalMatches: "総試合数",
    roi: "ROI",
    profitByMarket: "市場別利益",
    recommended: "おすすめ",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    betStyle: "ベットスタイル:",
    allStyles: "すべてのスタイル",
    hdpSniper: "HDP スナイパー",
    activeTrader: "アクティブトレーダー",
    oddsflowCore: "Oddsflow コア戦略",
    oddsflowBeta: "Oddsflow ベータ",
    searchTeams: "チームを検索...",
    from: "開始",
    to: "終了",
    showing: "表示中",
    of: "/",
    matches: "試合",
    previous: "前へ",
    next: "次へ",
    comingSoon: "近日公開",
    score: "スコア",
    total: "合計",
    aiPerformance: "AIパフォーマンス",
    transparentAI: "透明なAI",
    safestTips: "最も安全",
    mostAccurate: "最も正確",
    today: "今日",
    dayAgo: "日前",
    daysAgo: "日前",
    profitSummary: "利益サマリー",
    totalInvested: "総投資額",
    moneyline1x2: "1X2 勝利予想",
    asianHandicap: "アジアンハンディ",
    betDetails: "ベット詳細",
    yearlyPerformance: "年間パフォーマンス",
    pastMatches: "過去の試合",
    allLeagues: "全リーグ",
    noMatches: "試合が見つかりません",
    loading: "読み込み中...",
    home: "ホーム", predictions: "予測", leagues: "リーグ", community: "コミュニティ", news: "ニュース", pricing: "料金",
    login: "ログイン", getStarted: "始める",
    footer: "18+ | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    footerDesc: "よりスマートな予測のためのAI駆動フットボールオッズ分析。",
    product: "製品",
    company: "会社",
    legal: "法的情報",
    aboutUs: "私たちについて",
    contact: "お問い合わせ",
    blog: "ブログ",
    termsOfService: "利用規約",
    privacyPolicy: "プライバシーポリシー",
    responsibleGaming: "責任あるギャンブル",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
    units: "ユニット",
    invested: "投資額",
    bets: "ベット",
    cumulativeProfit: "累積利益",
    popularLeagues: "人気リーグ",
    aiPredictionsFooter: "AI予測",
    aiFootballPredictions: "AIサッカー予測",
    onextwoPredictions: "1x2予測",
    overUnderTips: "オーバー/アンダー予想",
    handicapBetting: "ハンディキャップベット",
    aiBettingPerformance: "AIベッティング実績",
    footballTipsToday: "今日のサッカー予想",
    solution: "ソリューション",
    communityFooter: "コミュニティ",
    globalChat: "グローバルチャット",
    userPredictions: "ユーザー予測",
    todayMatches: "今日の試合",
    disclaimer: "免責事項：OddsFlowはAI駆動の予測を情報および娯楽目的のみで提供しています。利益を保証するものではありません。責任を持ってお楽しみください。",
  },
  KO: {
    performance: "AI 성과",
    performanceTitle: "AI 축구 예측 성과",
    performanceSubtitle: "검증된 실적 및 실시간 ROI 분석",
    totalProfit: "총 수익",
    winRate: "승률",
    totalBets: "총 베팅",
    totalMatches: "총 경기",
    roi: "ROI",
    profitByMarket: "시장별 수익",
    recommended: "추천",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    betStyle: "베팅 스타일:",
    allStyles: "모든 스타일",
    hdpSniper: "HDP 스나이퍼",
    activeTrader: "액티브 트레이더",
    oddsflowCore: "Oddsflow 핵심 전략",
    oddsflowBeta: "Oddsflow 베타",
    searchTeams: "팀 검색...",
    from: "시작",
    to: "종료",
    showing: "표시 중",
    of: "/",
    matches: "경기",
    previous: "이전",
    next: "다음",
    comingSoon: "출시 예정",
    score: "점수",
    total: "합계",
    aiPerformance: "AI 성과",
    transparentAI: "투명한 AI",
    safestTips: "가장 안전",
    mostAccurate: "가장 정확",
    today: "오늘",
    dayAgo: "일 전",
    daysAgo: "일 전",
    profitSummary: "수익 요약",
    totalInvested: "총 투자",
    moneyline1x2: "1X2 승부예측",
    asianHandicap: "아시안핸디캡",
    betDetails: "베팅 상세",
    yearlyPerformance: "연간 성과",
    pastMatches: "지난 경기",
    allLeagues: "모든 리그",
    noMatches: "경기를 찾을 수 없습니다",
    loading: "로딩 중...",
    home: "홈", predictions: "예측", leagues: "리그", community: "커뮤니티", news: "뉴스", pricing: "가격",
    login: "로그인", getStarted: "시작하기",
    footer: "18+ | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    footerDesc: "더 스마트한 예측을 위한 AI 기반 축구 배당률 분석.",
    product: "제품",
    company: "회사",
    legal: "법적 정보",
    aboutUs: "회사 소개",
    contact: "문의하기",
    blog: "블로그",
    termsOfService: "서비스 약관",
    privacyPolicy: "개인정보 처리방침",
    responsibleGaming: "책임감 있는 게임",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
    units: "유닛",
    invested: "투자",
    bets: "베팅",
    cumulativeProfit: "누적 수익",
    popularLeagues: "인기 리그",
    aiPredictionsFooter: "AI 예측",
    aiFootballPredictions: "AI 축구 예측",
    onextwoPredictions: "1x2 예측",
    overUnderTips: "오버/언더 팁",
    handicapBetting: "핸디캡 베팅",
    aiBettingPerformance: "AI 베팅 성과",
    footballTipsToday: "오늘의 축구 팁",
    solution: "솔루션",
    communityFooter: "커뮤니티",
    globalChat: "글로벌 채팅",
    userPredictions: "사용자 예측",
    todayMatches: "오늘의 경기",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다. 수익을 보장하지 않습니다. 책임감 있게 베팅하세요.",
  },
  '中文': {
    performance: "AI表现",
    performanceTitle: "AI足球预测表现",
    performanceSubtitle: "经过验证的业绩记录与实时ROI分析",
    totalProfit: "总盈利",
    winRate: "胜率",
    totalBets: "总投注",
    totalMatches: "总比赛",
    roi: "投资回报率",
    profitByMarket: "市场盈利",
    recommended: "推荐",
    moneyline: "1x2",
    handicap: "让球",
    overUnder: "大小球",
    betStyle: "投注风格:",
    allStyles: "所有风格",
    hdpSniper: "让球狙击手",
    activeTrader: "活跃交易者",
    oddsflowCore: "Oddsflow 核心策略",
    oddsflowBeta: "Oddsflow 测试版",
    searchTeams: "搜索球队...",
    from: "从",
    to: "到",
    showing: "显示",
    of: "共",
    matches: "场比赛",
    previous: "上一页",
    next: "下一页",
    comingSoon: "即将推出",
    score: "比分",
    total: "总计",
    aiPerformance: "AI表现",
    transparentAI: "透明AI",
    safestTips: "最安全",
    mostAccurate: "最准确",
    today: "今天",
    dayAgo: "天前",
    daysAgo: "天前",
    profitSummary: "盈利详情",
    totalInvested: "总投资",
    moneyline1x2: "1X2 独赢",
    asianHandicap: "亚洲盘",
    betDetails: "投注明细",
    yearlyPerformance: "年度表现",
    pastMatches: "历史比赛",
    allLeagues: "所有联赛",
    noMatches: "未找到比赛",
    loading: "加载中...",
    home: "首页", predictions: "预测", leagues: "联赛", community: "社区", news: "新闻", pricing: "价格",
    login: "登录", getStarted: "开始使用",
    footer: "18+ | 赌博有风险，请理性参与。",
    allRights: "© 2026 OddsFlow. 保留所有权利。",
    footerDesc: "AI 驱动的足球赔率分析，助您做出更明智的预测。",
    product: "产品",
    company: "公司",
    legal: "法律",
    aboutUs: "关于我们",
    contact: "联系我们",
    blog: "博客",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
    responsibleGaming: "负责任博彩",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩有风险，请理性投注。",
    units: "单位",
    invested: "投资",
    bets: "投注",
    cumulativeProfit: "累计盈利",
    popularLeagues: "热门联赛",
    aiPredictionsFooter: "AI 预测",
    aiFootballPredictions: "AI 足球预测",
    onextwoPredictions: "1x2 预测",
    overUnderTips: "大小球建议",
    handicapBetting: "让球盘投注",
    aiBettingPerformance: "AI 投注表现",
    footballTipsToday: "今日足球贴士",
    solution: "解决方案",
    communityFooter: "社区",
    globalChat: "全球聊天",
    userPredictions: "用户预测",
    todayMatches: "今日比赛",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
  },
  '繁體': {
    performance: "AI表現",
    performanceTitle: "AI足球預測表現",
    performanceSubtitle: "經過驗證的業績記錄與實時ROI分析",
    totalProfit: "總盈利",
    winRate: "勝率",
    totalBets: "總投注",
    totalMatches: "總比賽",
    roi: "投資回報率",
    profitByMarket: "市場盈利",
    recommended: "推薦",
    moneyline: "1x2",
    handicap: "讓球",
    overUnder: "大小球",
    betStyle: "投注風格:",
    allStyles: "所有風格",
    hdpSniper: "讓球狙擊手",
    activeTrader: "活躍交易者",
    oddsflowCore: "Oddsflow 核心策略",
    oddsflowBeta: "Oddsflow 測試版",
    searchTeams: "搜尋球隊...",
    from: "從",
    to: "到",
    showing: "顯示",
    of: "共",
    matches: "場比賽",
    previous: "上一頁",
    next: "下一頁",
    comingSoon: "即將推出",
    score: "比分",
    total: "總計",
    aiPerformance: "AI表現",
    transparentAI: "透明AI",
    safestTips: "最安全",
    mostAccurate: "最準確",
    today: "今天",
    dayAgo: "天前",
    daysAgo: "天前",
    profitSummary: "盈利詳情",
    totalInvested: "總投資",
    moneyline1x2: "1X2 獨贏",
    asianHandicap: "亞洲盤",
    betDetails: "投注明細",
    yearlyPerformance: "年度表現",
    pastMatches: "歷史比賽",
    allLeagues: "所有聯賽",
    noMatches: "未找到比賽",
    loading: "載入中...",
    home: "首頁", predictions: "預測", leagues: "聯賽", community: "社區", news: "新聞", pricing: "價格",
    login: "登入", getStarted: "開始使用",
    footer: "18+ | 賭博有風險，請理性參與。",
    allRights: "© 2026 OddsFlow. 保留所有權利。",
    footerDesc: "AI 驅動的足球賠率分析，助您做出更明智的預測。",
    product: "產品",
    company: "公司",
    legal: "法律",
    aboutUs: "關於我們",
    contact: "聯繫我們",
    blog: "博客",
    termsOfService: "服務條款",
    privacyPolicy: "隱私政策",
    responsibleGaming: "負責任博彩",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩有風險，請理性投注。",
    units: "單位",
    invested: "投資",
    bets: "投注",
    cumulativeProfit: "累計盈利",
    popularLeagues: "熱門聯賽",
    aiPredictionsFooter: "AI 預測",
    aiFootballPredictions: "AI 足球預測",
    onextwoPredictions: "1x2 預測",
    overUnderTips: "大小球建議",
    handicapBetting: "讓球盤投注",
    aiBettingPerformance: "AI 投注表現",
    footballTipsToday: "今日足球貼士",
    solution: "解決方案",
    communityFooter: "社區",
    globalChat: "全球聊天",
    userPredictions: "用戶預測",
    todayMatches: "今日比賽",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
  },
  ID: {
    performance: "Performa AI",
    performanceTitle: "Performa Prediksi Sepak Bola AI",
    performanceSubtitle: "Rekam Jejak Terverifikasi & Analisis ROI Real-Time",
    totalProfit: "Total Keuntungan",
    winRate: "Tingkat Kemenangan",
    totalBets: "Total Taruhan",
    totalMatches: "Total Pertandingan",
    roi: "ROI",
    profitByMarket: "Keuntungan per Pasar",
    recommended: "Direkomendasikan",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
    betStyle: "Gaya Taruhan:",
    allStyles: "Semua Gaya",
    hdpSniper: "HDP Sniper",
    activeTrader: "Trader Aktif",
    oddsflowCore: "Strategi Inti Oddsflow",
    oddsflowBeta: "Oddsflow Beta",
    searchTeams: "Cari tim...",
    from: "Dari",
    to: "Hingga",
    showing: "Menampilkan",
    of: "dari",
    matches: "pertandingan",
    previous: "Sebelumnya",
    next: "Berikutnya",
    comingSoon: "SEGERA HADIR",
    score: "SKOR",
    total: "TOTAL",
    aiPerformance: "Performa AI",
    transparentAI: "AI Transparan",
    safestTips: "Tips Teraman",
    mostAccurate: "Paling Akurat",
    today: "Hari ini",
    dayAgo: "hari lalu",
    daysAgo: "hari lalu",
    profitSummary: "Ringkasan Keuntungan",
    totalInvested: "Total Investasi",
    moneyline1x2: "1X2 Pemenang",
    asianHandicap: "Handicap Asia",
    betDetails: "Detail Taruhan",
    yearlyPerformance: "Performa Tahunan",
    pastMatches: "Pertandingan Sebelumnya",
    allLeagues: "Semua Liga",
    noMatches: "Tidak ada pertandingan ditemukan",
    loading: "Memuat...",
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", community: "Komunitas", news: "Berita", pricing: "Harga",
    login: "Masuk", getStarted: "Mulai",
    footer: "18+ | Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    allRights: "© 2026 OddsFlow. Hak cipta dilindungi.",
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi yang lebih cerdas.",
    product: "Produk",
    company: "Perusahaan",
    legal: "Legal",
    aboutUs: "Tentang Kami",
    contact: "Kontak",
    blog: "Blog",
    termsOfService: "Ketentuan Layanan",
    privacyPolicy: "Kebijakan Privasi",
    responsibleGaming: "Perjudian Bertanggung Jawab",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    units: "unit",
    invested: "Diinvestasikan",
    bets: "Taruhan",
    cumulativeProfit: "Keuntungan Kumulatif",
    popularLeagues: "Liga Populer",
    aiPredictionsFooter: "Prediksi AI",
    aiFootballPredictions: "Prediksi Sepak Bola AI",
    onextwoPredictions: "Prediksi 1x2",
    overUnderTips: "Tips Over/Under",
    handicapBetting: "Taruhan Handicap",
    aiBettingPerformance: "Performa Taruhan AI",
    footballTipsToday: "Tips Sepak Bola Hari Ini",
    solution: "Solusi",
    communityFooter: "Komunitas",
    globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna",
    todayMatches: "Pertandingan Hari Ini",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
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

interface OddsHistoryItem {
  created_at: string;
  bookmaker: string | null;
  moneyline_1x2_home: number | null;
  moneyline_1x2_draw: number | null;
  moneyline_1x2_away: number | null;
  handicap_main_line: number | null;
  handicap_home: number | null;
  handicap_away: number | null;
  totalpoints_main_line: number | null;
  totalpoints_over: number | null;
  totalpoints_under: number | null;
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

// Props interface for SSR data
interface PerformanceClientProps {
  locale: string;
  initialStats?: {
    total_profit: number;
    total_invested: number;
    total_bets: number;
    total_matches: number;
    win_rate: number;
    roi: number;
    profit_moneyline: number;
    profit_handicap: number;
    profit_ou: number;
  } | null;
  initialChartData?: {
    date: string;
    profit: number;
    cumulative: number;
    cumulativeMoneyline: number;
    cumulativeHandicap: number;
    cumulativeOU: number;
  }[];
  initialMatches?: MatchSummary[];
  initialTotalMatchCount?: number;
}

export default function PerformanceClient({
  locale: propLocale,
  initialStats,
  initialChartData,
  initialMatches,
  initialTotalMatchCount,
}: PerformanceClientProps) {
  const params = useParams();
  const urlLocale = propLocale || (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';

  // Helper function to create locale-aware paths
  // Always include locale prefix for App Router with [locale] segment
  const localePath = (path: string): string => {
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  // Helper function to get locale URL for language dropdown
  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/performance';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  // Check if we have SSR data
  const hasSSRData = !!(initialStats && initialChartData && initialMatches);

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [matches, setMatches] = useState<MatchSummary[]>(initialMatches || []);
  const [loading, setLoading] = useState(!hasSSRData);
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [teamTranslations, setTeamTranslations] = useState<Record<string, any>>({});
  const [dailyPerformance, setDailyPerformance] = useState<DailyPerformance[]>(
    initialChartData?.map(d => ({
      date: d.date,
      profit: d.profit,
      cumulative: d.cumulative,
      cumulativeMoneyline: d.cumulativeMoneyline,
      cumulativeHandicap: d.cumulativeHandicap,
      cumulativeOU: d.cumulativeOU,
    })) || []
  );
  const [availableLeagues, setAvailableLeagues] = useState<string[]>([]);
  const [animationStarted, setAnimationStarted] = useState(hasSSRData);
  const [overallStats, setOverallStats] = useState({
    totalProfit: initialStats?.total_profit || 0,
    winRate: initialStats?.win_rate || 0,
    totalBets: initialStats?.total_bets || 0,
    roi: initialStats?.roi || 0,
    totalInvested: initialStats?.total_invested || 0,
    profitMoneyline: initialStats?.profit_moneyline || 0,
    profitHandicap: initialStats?.profit_handicap || 0,
    profitOU: initialStats?.profit_ou || 0,
  });

  // Selected match for profit modal
  const [selectedMatch, setSelectedMatch] = useState<MatchSummary | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leagueDropdownOpen, setLeagueDropdownOpen] = useState(false);

  // Profit Details Modal state
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [profitSummary, setProfitSummary] = useState<ProfitSummary | null>(null);
  const [profitSummaryRecords, setProfitSummaryRecords] = useState<ProfitSummary[]>([]);
  const [profitTypeFilter, setProfitTypeFilter] = useState<'all' | 'moneyline' | 'handicap' | 'ou'>('all');
  const [profitBetStyleFilter, setProfitBetStyleFilter] = useState<string>('all');
  const [loadingProfit, setLoadingProfit] = useState(false);

  // Bet Style filter for chart and past matches table
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

  // Translate team name based on current locale
  const translateTeamName = (teamName: string | null): string => {
    if (!teamName) return '';

    const translation = teamTranslations[teamName];
    if (!translation || !translation.team_name_language) return teamName;

    // Map locale to database key
    const localeMap: Record<string, string> = {
      'en': 'en',
      'es': 'es',
      'pt': 'pt',
      'de': 'de',
      'fr': 'fr',
      'ja': 'ja',
      'ko': 'ko',
      'zh': 'zh_cn',
      'tw': 'zh_tw',
      'id': 'id'
    };

    const dbKey = localeMap[locale] || 'en';
    return translation.team_name_language[dbKey] || teamName;
  };

  // Translate league name based on current locale
  const translateLeagueName = (leagueName: string | null): string => {
    if (!leagueName) return '';

    const leagueTranslations: Record<string, Record<string, string>> = {
      'Premier Leag': {
        en: 'Premier Leag',
        es: 'Premier Leag',
        pt: 'Premier Leag',
        de: 'Premier League',
        fr: 'Premier League',
        ja: 'プレミアリーグ',
        ko: '프리미어리그',
        zh: '英超',
        tw: '英超',
        id: 'Liga Premier'
      },
      'La Liga': {
        en: 'La Liga',
        es: 'La Liga',
        pt: 'La Liga',
        de: 'La Liga',
        fr: 'La Liga',
        ja: 'ラ・リーガ',
        ko: '라리가',
        zh: '西甲',
        tw: '西甲',
        id: 'La Liga'
      },
      'Serie A': {
        en: 'Serie A',
        es: 'Serie A',
        pt: 'Série A',
        de: 'Serie A',
        fr: 'Serie A',
        ja: 'セリエA',
        ko: '세리에A',
        zh: '意甲',
        tw: '意甲',
        id: 'Serie A'
      },
      'Bundesliga': {
        en: 'Bundesliga',
        es: 'Bundesliga',
        pt: 'Bundesliga',
        de: 'Bundesliga',
        fr: 'Bundesliga',
        ja: 'ブンデスリーガ',
        ko: '분데스리가',
        zh: '德甲',
        tw: '德甲',
        id: 'Bundesliga'
      },
      'Ligue 1': {
        en: 'Ligue 1',
        es: 'Ligue 1',
        pt: 'Ligue 1',
        de: 'Ligue 1',
        fr: 'Ligue 1',
        ja: 'リーグ・アン',
        ko: '리그1',
        zh: '法甲',
        tw: '法甲',
        id: 'Ligue 1'
      }
    };

    const translations = leagueTranslations[leagueName];
    if (!translations) return leagueName;

    return translations[locale] || leagueName;
  };

  // Format relative time based on current locale
  const formatRelativeTime = (dateString: string): string => {
    const matchDate = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - matchDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return t('today');
    } else if (diffInDays === 1) {
      return `1 ${t('dayAgo')}`;
    } else {
      return `${diffInDays} ${t('daysAgo')}`;
    }
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

  // Chart/Stats Bet Style filter
  const [chartBetStyle, setChartBetStyle] = useState<string>('all');
  const [allBetRecords, setAllBetRecords] = useState<any[]>([]);

  // Server-side pagination state
  const [totalMatchCount, setTotalMatchCount] = useState(initialTotalMatchCount || 0);
  const [matchesPage, setMatchesPage] = useState(0);
  const MATCHES_PAGE_SIZE = 20;
  const [loadingMore, setLoadingMore] = useState(false);

  // Infinite scroll sentinel ref
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);

  // Progressive loading states - initialize with SSR data availability
  const [statsLoaded, setStatsLoaded] = useState(hasSSRData);
  const [chartLoaded, setChartLoaded] = useState(hasSSRData);
  const [matchesLoaded, setMatchesLoaded] = useState(hasSSRData);

  // RPC-based stats (for fast loading)
  const [rpcStats, setRpcStats] = useState<{
    total_profit: number;
    total_invested: number;
    total_bets: number;
    total_matches: number;
    win_rate: number;
    roi: number;
    profit_moneyline: number;
    profit_handicap: number;
    profit_ou: number;
  } | null>(initialStats || null);
  const [rpcChartData, setRpcChartData] = useState<any[]>(initialChartData || []);


  // Top 5 European leagues (always show in filter)
  const TOP_LEAGUES = [
    { name: 'La Liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
    { name: 'Serie A', logo: 'https://media.api-sports.io/football/leagues/135.png' },
    { name: 'Bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
    { name: 'Premier League', logo: 'https://media.api-sports.io/football/leagues/39.png' },
    { name: 'Ligue 1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
  ];

  // Get league logo map from matches (include top leagues)
  const leagueLogoMap = matches.reduce((acc, match) => {
    if (match.league_name && match.league_logo && !acc[match.league_name]) {
      acc[match.league_name] = match.league_logo;
    }
    return acc;
  }, TOP_LEAGUES.reduce((acc, league) => {
    acc[league.name] = league.logo;
    return acc;
  }, {} as Record<string, string>));

  // Helper to derive bet type from selection
  const getBetTypeFromRecord = (record: { type?: string | null; selection?: string | null }): 'moneyline' | 'handicap' | 'ou' => {
    // Use the type column directly if available (most accurate)
    if (record.type) {
      const t = record.type.toLowerCase();
      if (t.includes('1x2') || t.includes('moneyline') || t === 'home' || t === 'draw' || t === 'away') return 'moneyline';
      if (t.includes('handicap') || t.includes('hdp') || t.includes('ah')) return 'handicap';
      if (t.includes('over') || t.includes('under') || t.includes('o/u') || t.includes('ou') || t.includes('goal')) return 'ou';
    }

    // Fallback to selection-based inference
    const selection = record.selection;
    if (!selection) return 'ou';
    const sel = selection.toLowerCase();
    // Handicap bets - check for HDP in selection (e.g., HOME_HDP_-0.75, AWAY_HDP_+0.5)
    if (sel.includes('hdp') || sel.includes('handicap')) return 'handicap';
    if (sel.includes('over') || sel.includes('under')) return 'ou';
    if (/^(home|away)\s*[+-]?\d/.test(sel)) return 'handicap';
    if (sel === 'home' || sel === 'draw' || sel === 'away') return 'moneyline';
    return 'ou';
  };

  // Compute filtered stats for chart based on chartBetStyle
  // Now uses RPC data when available for much faster performance
  const filteredChartStats = useMemo(() => {
    // If RPC data is available, use it directly (much faster)
    if (rpcStats && rpcChartData) {
      // Convert RPC chart data to the expected format with index
      const dailyData = rpcChartData.map((d: any, index: number) => ({
        index: index,
        date: d.date,
        fullDateTime: d.date,
        profit: d.profit || 0,
        cumulative: d.cumulative || 0,
        cumulativeMoneyline: d.cumulativeMoneyline || 0,
        cumulativeHandicap: d.cumulativeHandicap || 0,
        cumulativeOU: d.cumulativeOU || 0,
      }));

      return {
        profitMoneyline: rpcStats.profit_moneyline || 0,
        profitHandicap: rpcStats.profit_handicap || 0,
        profitOU: rpcStats.profit_ou || 0,
        totalProfit: rpcStats.total_profit || 0,
        totalInvested: rpcStats.total_invested || 0,
        roi: rpcStats.roi || 0,
        dailyData,
        totalBets: rpcStats.total_bets || 0,
      };
    }

    // Fallback to client-side calculation if RPC data not available
    const filtered = chartBetStyle === 'all'
      ? allBetRecords
      : allBetRecords.filter(r => r.bet_style?.toLowerCase() === chartBetStyle.toLowerCase());

    let profitMoneyline = 0;
    let profitHandicap = 0;
    let profitOU = 0;
    let totalProfit = 0;
    let totalInvested = 0;
    let totalBets = 0;

    filtered.forEach(r => {
      totalProfit += r.total_profit || 0;
      totalInvested += r.total_invested || 0;
      totalBets += r.total_bets || 0;
      profitMoneyline += r.profit_moneyline || 0;
      profitHandicap += r.profit_handicap || 0;
      profitOU += r.profit_ou || 0;
    });

    const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    // Calculate daily cumulative data
    const sortedRecords = [...filtered]
      .filter(r => r.created_at && !isNaN(new Date(r.created_at).getTime()))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    let cumulative = 0;
    let cumulativeML = 0;
    let cumulativeHDP = 0;
    let cumulativeOU = 0;

    const dailyData = sortedRecords.map((r, index) => {
      const profit = r.total_profit || 0;
      const ml = r.profit_moneyline || 0;
      const hdp = r.profit_handicap || 0;
      const ou = r.profit_ou || 0;

      cumulative += profit;
      cumulativeML += ml;
      cumulativeHDP += hdp;
      cumulativeOU += ou;

      return {
        index: index,
        date: r.created_at.split('T')[0],
        fullDateTime: r.created_at,
        profit: profit,
        cumulative: cumulative,
        cumulativeMoneyline: cumulativeML,
        cumulativeHandicap: cumulativeHDP,
        cumulativeOU: cumulativeOU,
      };
    });

    return {
      profitMoneyline,
      profitHandicap,
      profitOU,
      totalProfit,
      totalInvested,
      roi,
      dailyData,
      totalBets,
    };
  }, [rpcStats, rpcChartData, chartBetStyle, allBetRecords]);

  // Compute per-match profits filtered by chartBetStyle (for table)
  const matchProfitsByStyle = useMemo(() => {
    const profitMap = new Map<string, {
      profit_moneyline: number;
      profit_handicap: number;
      profit_ou: number;
      total_profit: number;
      total_invested: number;
    }>();

    // Filter records by selected bet style (case-insensitive comparison)
    const filtered = chartBetStyle === 'all'
      ? allBetRecords
      : allBetRecords.filter(r => r.bet_style?.toLowerCase() === chartBetStyle.toLowerCase());

    // Data is already aggregated, just map it
    filtered.forEach(r => {
      const fixtureId = String(r.fixture_id);
      profitMap.set(fixtureId, {
        profit_moneyline: r.profit_moneyline || 0,
        profit_handicap: r.profit_handicap || 0,
        profit_ou: r.profit_ou || 0,
        total_profit: r.total_profit || 0,
        total_invested: r.total_invested || 0,
      });
    });

    return profitMap;
  }, [chartBetStyle, allBetRecords]);

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


  // Cache key for localStorage
  const CACHE_KEY = 'oddsflow_performance_cache';
  const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  // Load cached data immediately on mount (skip if SSR data available for default style)
  useEffect(() => {
    if (hasSSRData && chartBetStyle === 'all') {
      // SSR data already loaded, no need to fetch
      return;
    }
    loadCachedData();
    fetchPerformanceDataFast(); // Fetch fresh data in background
  }, []);

  // Refetch when bet style changes
  useEffect(() => {
    if (!loading || hasSSRData) {
      // If bet style changed from 'all' and we had SSR data, need to fetch new data
      if (chartBetStyle !== 'all') {
        loadCachedData(); // Show cached data for this style immediately
        fetchPerformanceDataFast();
      }
    }
  }, [chartBetStyle]);

  // Load cached data from localStorage
  const loadCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp, betStyle } = JSON.parse(cached);
        // Only use cache if it matches current bet style
        if (betStyle === chartBetStyle && data) {
          setOverallStats(data.overallStats);
          setMatches(data.matches || []);
          setDailyPerformance(data.dailyPerformance || []);
          setAllBetRecords(data.allBetRecords || []);
          setAvailableLeagues(data.availableLeagues || []);
          setStatsLoaded(true);
          setMatchesLoaded(true);
          setChartLoaded(true);
          setLoading(false);
          setAnimationStarted(true);
          console.log('Loaded from cache (age: ' + Math.round((Date.now() - timestamp) / 1000) + 's)');
        }
      }
    } catch (e) {
      console.log('No cache available');
    }
  };

  // Save data to cache
  const saveToCache = (data: any) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now(),
        betStyle: chartBetStyle,
      }));
    } catch (e) {
      console.log('Failed to save cache');
    }
  };

  // Fast data fetching (runs in background, updates cache)
  const fetchPerformanceDataFast = async () => {
    // Don't show loading if we have cached data
    const hasCachedData = statsLoaded;
    if (!hasCachedData) {
      setLoading(true);
      setStatsLoaded(false);
      setChartLoaded(false);
      setMatchesLoaded(false);
    }

    const betStyleParam = chartBetStyle === 'all' ? null : chartBetStyle;

    // Try RPC first
    const testResult = await supabase.rpc('get_performance_summary', { p_bet_style: betStyleParam });

    if (!testResult.error) {
      // RPC available - use fast path
      await fetchWithRPC(betStyleParam, testResult);
    } else {
      // Fallback to progressive legacy loading
      console.log('RPC not available, using progressive legacy loading...');
      await fetchProgressiveLegacy();
    }
  };

  // RPC-based fast loading
  const fetchWithRPC = async (betStyleParam: string | null, summaryResult: any) => {
    // Phase 1: Stats already loaded from test call
    setRpcStats(summaryResult.data);
    if (summaryResult.data) {
      setOverallStats({
        totalProfit: summaryResult.data.total_profit || 0,
        winRate: summaryResult.data.win_rate || 0,
        totalBets: summaryResult.data.total_bets || 0,
        roi: summaryResult.data.roi || 0,
        totalInvested: summaryResult.data.total_invested || 0,
        profitMoneyline: summaryResult.data.profit_moneyline || 0,
        profitHandicap: summaryResult.data.profit_handicap || 0,
        profitOU: summaryResult.data.profit_ou || 0,
      });
    }
    setStatsLoaded(true);
    setLoading(false);
    setTimeout(() => setAnimationStarted(true), 100);

    // Phase 2 & 3: Load chart and matches in parallel (background)
    console.log('[Performance RPC] Calling RPC functions with bet_style:', betStyleParam);
    const [chartResult, matchesResult] = await Promise.all([
      supabase.rpc('get_performance_chart_data', { p_bet_style: betStyleParam }),
      supabase.rpc('get_performance_matches', {
        p_bet_style: betStyleParam,
        p_page: 0,
        p_page_size: MATCHES_PAGE_SIZE
      })
    ]);
    console.log('[Performance RPC] Chart result error:', chartResult.error);
    console.log('[Performance RPC] Matches result error:', matchesResult.error);
    if (matchesResult.error) {
      console.error('[Performance RPC] get_performance_matches error details:', {
        code: matchesResult.error.code,
        message: matchesResult.error.message,
        details: matchesResult.error.details,
        hint: matchesResult.error.hint
      });
    }

    // Set chart data
    let dailyData: DailyPerformance[] = [];
    if (!chartResult.error) {
      setRpcChartData(chartResult.data || []);
      dailyData = (chartResult.data || []).map((d: any) => ({
        date: d.date,
        profit: d.profit || 0,
        cumulative: d.cumulative || 0,
        cumulativeMoneyline: d.cumulativeMoneyline || 0,
        cumulativeHandicap: d.cumulativeHandicap || 0,
        cumulativeOU: d.cumulativeOU || 0,
      }));
      setDailyPerformance(dailyData);
    }
    setChartLoaded(true);

    // Set matches
    let rpcMatches: MatchSummary[] = [];
    let availableLeaguesList: string[] = [];
    if (!matchesResult.error) {
      const matchesData = matchesResult.data;
      console.log('[Performance RPC] get_performance_matches returned:', matchesData);
      console.log('[Performance RPC] Total count:', matchesData?.total_count);
      console.log('[Performance RPC] Matches array length:', matchesData?.matches?.length);
      console.log('[Performance RPC] Match fixture_ids:', matchesData?.matches?.map((m: any) => m.fixture_id));
      setTotalMatchCount(matchesData?.total_count || 0);
      setMatchesPage(0);

      rpcMatches = (matchesData?.matches || []).map((m: any) => ({
        fixture_id: String(m.fixture_id),
        league_name: m.league_name || 'Unknown',
        league_logo: m.league_logo || '',
        home_name: m.home_name || 'Home Team',
        home_logo: m.home_logo || '',
        away_name: m.away_name || 'Away Team',
        away_logo: m.away_logo || '',
        home_score: m.home_score ?? 0,
        away_score: m.away_score ?? 0,
        total_profit: m.total_profit || 0,
        total_invested: m.total_invested || 0,
        roi_percentage: m.roi || 0,
        total_bets: m.bet_count || 0,
        profit_moneyline: m.profit_moneyline || 0,
        profit_handicap: m.profit_handicap || 0,
        profit_ou: m.profit_ou || 0,
        match_date: m.match_date || m.latest_bet_time || '',
      }));

      setMatches(rpcMatches);
      const topLeagueNames = TOP_LEAGUES.map(l => l.name);
      const otherLeagues = [...new Set(rpcMatches.map(m => m.league_name))]
        .filter(l => !topLeagueNames.includes(l));
      availableLeaguesList = [...topLeagueNames, ...otherLeagues];
      setAvailableLeagues(availableLeaguesList);

      // Load team translations
      const allTeamNames = [
        ...new Set([
          ...rpcMatches.map(m => m.home_name),
          ...rpcMatches.map(m => m.away_name)
        ])
      ].filter(Boolean);

      if (allTeamNames.length > 0) {
        const { data: teamData } = await supabase
          .from('team_statistics')
          .select('team_name, team_name_language')
          .in('team_name', allTeamNames);

        if (teamData) {
          const translationsMap: Record<string, any> = {};
          teamData.forEach((team: any) => {
            translationsMap[team.team_name] = team;
          });
          setTeamTranslations(translationsMap);
        }
      }
    }
    setMatchesLoaded(true);

    // Save to cache
    saveToCache({
      overallStats: {
        totalProfit: summaryResult.data.total_profit || 0,
        winRate: summaryResult.data.win_rate || 0,
        totalBets: summaryResult.data.total_bets || 0,
        roi: summaryResult.data.roi || 0,
        totalInvested: summaryResult.data.total_invested || 0,
        profitMoneyline: summaryResult.data.profit_moneyline || 0,
        profitHandicap: summaryResult.data.profit_handicap || 0,
        profitOU: summaryResult.data.profit_ou || 0,
      },
      matches: rpcMatches,
      dailyPerformance: dailyData,
      allBetRecords: [],
      availableLeagues: availableLeaguesList,
    });
  };

  // Progressive legacy loading (without RPC) - loads ALL data with pagination
  const fetchProgressiveLegacy = async () => {
    try {
      // Fetch ALL ai_performance_summary data using pagination
      let allSummaryData: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data: pageData, error: pageError } = await supabase
          .from('ai_performance_summary')
          .select('fixture_id, league_name, bet_style, profit_moneyline, profit_handicap, profit_ou, total_profit, total_invested, roi_percentage, total_bets, created_at')
          .order('created_at', { ascending: true })
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (pageError) throw pageError;

        if (pageData && pageData.length > 0) {
          allSummaryData = [...allSummaryData, ...pageData];
          page++;
          hasMore = pageData.length === pageSize;

          // After first page, show initial stats to user (progressive loading)
          if (page === 1) {
            setLoading(false);
            setTimeout(() => setAnimationStarted(true), 100);
          }
        } else {
          hasMore = false;
        }
      }

      // Store all summary records
      console.log('[Performance] ai_performance_summary records fetched:', allSummaryData.length);
      console.log('[Performance] Sample records:', allSummaryData.slice(0, 3));
      console.log('[Performance] Fixture IDs:', allSummaryData.map(r => r.fixture_id));
      setAllBetRecords(allSummaryData);

      // Calculate overall stats from aggregated data
      let totalProfit = 0;
      let totalInvested = 0;
      let totalBets = 0;
      let profitMoneyline = 0;
      let profitHandicap = 0;
      let profitOU = 0;
      const fixtureSet = new Set<string>();

      allSummaryData.forEach((record: any) => {
        totalProfit += record.total_profit || 0;
        totalInvested += record.total_invested || 0;
        totalBets += record.total_bets || 0;
        profitMoneyline += record.profit_moneyline || 0;
        profitHandicap += record.profit_handicap || 0;
        profitOU += record.profit_ou || 0;
        fixtureSet.add(String(record.fixture_id));
      });

      // Calculate win rate based on profitable matches
      const winningMatches = allSummaryData.filter(r => (r.total_profit || 0) > 0).length;
      const winRate = allSummaryData.length > 0 ? (winningMatches / allSummaryData.length) * 100 : 0;
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
      setStatsLoaded(true);

      // Get unique fixture IDs for prematches lookup
      const fixtureIds = [...fixtureSet];

      // Fetch prematches info (batch by 100 to avoid query limits)
      // IMPORTANT: Use id DESC to get the most recent record when there are duplicates
      const prematchesMap = new Map<string, any>();
      console.log('[Performance] Querying prematches for fixture_ids:', fixtureIds);
      for (let i = 0; i < fixtureIds.length; i += 100) {
        const batch = fixtureIds.slice(i, i + 100);
        const { data: prematchesData } = await supabase
          .from('prematches')
          .select('id, fixture_id, league_logo, home_name, home_logo, away_name, away_logo, goals_home, goals_away, start_date_msia')
          .in('fixture_id', batch)
          .order('id', { ascending: false }); // Get newest records first

        console.log('[Performance] Prematches batch result:', prematchesData?.length, 'records for', batch.length, 'fixture_ids');
        console.log('[Performance] Prematches data:', prematchesData);

        // Only keep the first (newest) record for each fixture_id
        prematchesData?.forEach((m: any) => {
          const key = String(m.fixture_id);
          if (!prematchesMap.has(key)) {
            prematchesMap.set(key, m);
          } else {
            console.log('[Performance] Duplicate fixture_id detected:', key, 'Keeping newest (id:', prematchesMap.get(key).id, '), ignoring older (id:', m.id, ')');
          }
        });
      }
      console.log('[Performance] prematchesMap size:', prematchesMap.size);
      console.log('[Performance] prematchesMap keys:', Array.from(prematchesMap.keys()));

      // Convert to MatchSummary array (data is already aggregated)
      // Use Map to deduplicate by fixture_id (in case ai_performance_summary has duplicates)
      const matchesMap = new Map<string, MatchSummary>();

      for (const record of allSummaryData) {
        const fixtureId = String(record.fixture_id);
        const prematch = prematchesMap.get(fixtureId);

        // If fixture_id already exists, aggregate the profits
        if (matchesMap.has(fixtureId)) {
          const existing = matchesMap.get(fixtureId)!;
          existing.total_profit += record.total_profit || 0;
          existing.total_invested += record.total_invested || 0;
          existing.total_bets += record.total_bets || 0;
          existing.profit_moneyline += record.profit_moneyline || 0;
          existing.profit_handicap += record.profit_handicap || 0;
          existing.profit_ou += record.profit_ou || 0;
          // Recalculate ROI
          existing.roi_percentage = existing.total_invested > 0
            ? (existing.total_profit / existing.total_invested) * 100
            : 0;
          console.log('[Performance] Duplicate fixture_id found in ai_performance_summary:', fixtureId, 'Aggregating profits');
        } else {
          matchesMap.set(fixtureId, {
            fixture_id: fixtureId,
            league_name: record.league_name || 'Unknown',
            league_logo: prematch?.league_logo || '',
            home_name: prematch?.home_name || 'Home Team',
            home_logo: prematch?.home_logo || '',
            away_name: prematch?.away_name || 'Away Team',
            away_logo: prematch?.away_logo || '',
            home_score: prematch?.goals_home ?? 0,
            away_score: prematch?.goals_away ?? 0,
            total_profit: record.total_profit || 0,
            total_invested: record.total_invested || 0,
            roi_percentage: record.roi_percentage || 0,
            total_bets: record.total_bets || 0,
            profit_moneyline: record.profit_moneyline || 0,
            profit_handicap: record.profit_handicap || 0,
            profit_ou: record.profit_ou || 0,
            match_date: prematch?.start_date_msia || record.created_at
          });
        }
      }

      const combinedMatches = Array.from(matchesMap.values());
      combinedMatches.sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime());
      console.log('[Performance] combinedMatches created:', combinedMatches.length);
      console.log('[Performance] combinedMatches fixture_ids:', combinedMatches.map(m => m.fixture_id));
      console.log('[Performance] First 3 matches:', combinedMatches.slice(0, 3));
      setMatches(combinedMatches);
      setMatchesLoaded(true);

      // Load team translations
      const allTeamNames = [
        ...new Set([
          ...combinedMatches.map(m => m.home_name),
          ...combinedMatches.map(m => m.away_name)
        ])
      ].filter(Boolean);

      if (allTeamNames.length > 0) {
        const { data: teamData } = await supabase
          .from('team_statistics')
          .select('team_name, team_name_language')
          .in('team_name', allTeamNames);

        if (teamData) {
          const translationsMap: Record<string, any> = {};
          teamData.forEach((team: any) => {
            translationsMap[team.team_name] = team;
          });
          setTeamTranslations(translationsMap);
        }
      }

      const topLeagueNames = TOP_LEAGUES.map(l => l.name);
      const otherLeagues = [...new Set(combinedMatches.map(m => m.league_name))]
        .filter(l => !topLeagueNames.includes(l));
      setAvailableLeagues([...topLeagueNames, ...otherLeagues]);

      // Calculate daily cumulative for chart
      const sortedRecords = [...allSummaryData].sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      let cumulative = 0;
      let cumulativeML = 0;
      let cumulativeHDP = 0;
      let cumulativeOU = 0;
      const dailyData: DailyPerformance[] = [];
      const dailyMap = new Map<string, { profit: number; ml: number; hdp: number; ou: number }>();

      sortedRecords.forEach((r) => {
        const date = r.created_at?.split('T')[0] || '';
        const profit = r.total_profit || 0;
        const ml = r.profit_moneyline || 0;
        const hdp = r.profit_handicap || 0;
        const ou = r.profit_ou || 0;

        if (!dailyMap.has(date)) {
          dailyMap.set(date, { profit: 0, ml: 0, hdp: 0, ou: 0 });
        }
        const day = dailyMap.get(date)!;
        day.profit += profit;
        day.ml += ml;
        day.hdp += hdp;
        day.ou += ou;
      });

      [...dailyMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).forEach(([date, day]) => {
        cumulative += day.profit;
        cumulativeML += day.ml;
        cumulativeHDP += day.hdp;
        cumulativeOU += day.ou;
        dailyData.push({
          date,
          profit: day.profit,
          cumulative,
          cumulativeMoneyline: cumulativeML,
          cumulativeHandicap: cumulativeHDP,
          cumulativeOU: cumulativeOU,
        });
      });

      setDailyPerformance(dailyData);
      setChartLoaded(true);

      // Save to cache for instant loading next time
      saveToCache({
        overallStats: {
          totalProfit,
          winRate,
          totalBets,
          roi,
          totalInvested,
          profitMoneyline,
          profitHandicap,
          profitOU,
        },
        matches: combinedMatches,
        dailyPerformance: dailyData,
        allBetRecords: allSummaryData,
        availableLeagues: [...topLeagueNames, ...otherLeagues],
      });
      console.log('Data cached successfully');

    } catch (error) {
      console.error('Error in progressive loading:', error);
      setLoading(false);
    }
  };

  // Load more matches (pagination)
  const loadMoreMatches = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = matchesPage + 1;
      const betStyleParam = chartBetStyle === 'all' ? null : chartBetStyle;

      const { data, error } = await supabase.rpc('get_performance_matches', {
        p_bet_style: betStyleParam,
        p_page: nextPage,
        p_page_size: MATCHES_PAGE_SIZE
      });

      if (error) throw error;

      const newMatches: MatchSummary[] = (data?.matches || []).map((m: any) => ({
        fixture_id: String(m.fixture_id),
        league_name: m.league_name || 'Unknown',
        league_logo: m.league_logo || '',
        home_name: m.home_name || 'Home Team',
        home_logo: m.home_logo || '',
        away_name: m.away_name || 'Away Team',
        away_logo: m.away_logo || '',
        home_score: m.home_score ?? 0,
        away_score: m.away_score ?? 0,
        total_profit: m.total_profit || 0,
        total_invested: m.total_invested || 0,
        roi_percentage: m.roi || 0,
        total_bets: m.bet_count || 0,
        profit_moneyline: m.profit_moneyline || 0,
        profit_handicap: m.profit_handicap || 0,
        profit_ou: m.profit_ou || 0,
        match_date: m.match_date || m.latest_bet_time || '',
      }));

      setMatches(prev => [...prev, ...newMatches]);
      setMatchesPage(nextPage);
    } catch (error) {
      console.error('Error loading more matches:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll - auto load more when sentinel is visible
  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Load more when sentinel is visible and we have more data to load
        if (entry.isIntersecting && matches.length < totalMatchCount && !loadingMore) {
          loadMoreMatches();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Start loading 200px before reaching the end
        threshold: 0
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [matches.length, totalMatchCount, loadingMore]);

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  // Filter matches by league only (bet style is already filtered server-side)
  const filteredMatches = useMemo(() => {
    // First filter by league
    let filtered = selectedLeague === 'all'
      ? matches
      : matches.filter(m => m.league_name === selectedLeague);

    // Then filter by search query (search in home or away team names - both English and translated)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(m =>
        m.home_name?.toLowerCase().includes(query) ||
        m.away_name?.toLowerCase().includes(query) ||
        translateTeamName(m.home_name)?.toLowerCase().includes(query) ||
        translateTeamName(m.away_name)?.toLowerCase().includes(query)
      );
    }

    // Filter by date range
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(m => {
        const matchDate = m.match_date ? m.match_date.split('T')[0] : '';
        if (!matchDate) return false;

        const isAfterStart = !dateRange.start || matchDate >= dateRange.start;
        const isBeforeEnd = !dateRange.end || matchDate <= dateRange.end;

        return isAfterStart && isBeforeEnd;
      });
    }

    return filtered;
  }, [selectedLeague, searchQuery, dateRange, matches, teamTranslations, locale]);

  // Debug: log filtering results
  useEffect(() => {
    console.log('[Performance] Filtering results:');
    console.log('  - Total matches:', matches.length);
    console.log('  - After filtering:', filteredMatches.length);
    console.log('  - selectedLeague:', selectedLeague);
    console.log('  - searchQuery:', searchQuery);
    console.log('  - dateRange:', dateRange);
    console.log('  - chartBetStyle:', chartBetStyle);
    console.log('  - filteredMatches fixture_ids:', filteredMatches.map(m => m.fixture_id));
  }, [filteredMatches, matches, selectedLeague, searchQuery, dateRange, chartBetStyle]);

  // Client-side pagination: slice filteredMatches based on currentPage
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

  // Reset to page 1 when league, search query, date range, or bet style filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLeague, searchQuery, dateRange, chartBetStyle]);

  // Ref for scrolling to Past Matches section
  const pastMatchesRef = useRef<HTMLDivElement>(null);

  // Scroll to Past Matches section when page changes
  useEffect(() => {
    if (pastMatchesRef.current) {
      pastMatchesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Format match date as "X days ago" or actual date
  const formatMatchDate = (dateStr: string) => {
    const matchDate = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - matchDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: t('today'), isHot: true, daysAgo: 0 };
    if (diffDays === 1) return { text: `1 ${t('dayAgo')}`, isHot: true, daysAgo: 1 };
    if (diffDays === 2) return { text: `2 ${t('daysAgo')}`, isHot: true, daysAgo: 2 };
    if (diffDays === 3) return { text: `3 ${t('daysAgo')}`, isHot: true, daysAgo: 3 };

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

  // Generate profit summary page URL
  const getProfitSummaryUrl = (match: MatchSummary) => {
    const leagueSlug = (match.league_name || 'unknown').toLowerCase().replace(/\s+/g, '-');
    const matchSlug = `${match.home_name}-vs-${match.away_name}`.toLowerCase().replace(/\s+/g, '-');
    const dateStr = match.match_date ? match.match_date.split('T')[0] : new Date().toISOString().split('T')[0];
    return localePath(`/performance/${leagueSlug}/profit-summary/${matchSlug}/${match.fixture_id}/${dateStr}`);
  };


  // Fetch profit summary for a match (use allBetRecords for consistency with table)
  const fetchProfitSummary = (fixtureId: string) => {
    setLoadingProfit(true);
    try {
      // Filter from allBetRecords to ensure consistency with table data
      // Sort by clock (match minute) in ascending order
      const filteredData = allBetRecords
        .filter(r => String(r.fixture_id) === fixtureId)
        .sort((a, b) => (a.clock || 0) - (b.clock || 0));

      if (filteredData.length > 0) {
        setProfitSummary(filteredData[0]);
        setProfitSummaryRecords(filteredData);
      } else {
        setProfitSummary(null);
        setProfitSummaryRecords([]);
      }
    } catch (error) {
      console.error('Error fetching profit summary:', error);
      setProfitSummary(null);
      setProfitSummaryRecords([]);
    }
    setLoadingProfit(false);
  };

  // Open profit details modal
  const openProfitDetails = (match: MatchSummary) => {
    setSelectedMatch(match);
    setProfitTypeFilter('all');
    // Auto-select the currently active bet style filter
    setProfitBetStyleFilter(chartBetStyle);
    setShowProfitModal(true);
    fetchProfitSummary(match.fixture_id);
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
    <div
      className="min-h-screen bg-[#0a0a0f] text-white relative"
      style={{
        backgroundImage: 'url(/performance/performance_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better content readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
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
                  <span className="font-medium">{selectedLang}</span>
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
              {user ? (
                <Link href={localePath('/dashboard')} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
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
                  <Link href={localePath('/login')} className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href={localePath('/get-started')} className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
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
              <Link href={localePath('/worldcup')} onClick={() => setMobileMenuOpen(false)} className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-8 w-auto object-contain relative z-10" />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
              </Link>

              {[
                { href: localePath('/'), label: t('home') },
                { href: localePath('/predictions'), label: t('predictions') },
                { href: localePath('/leagues'), label: t('leagues') },
                { href: localePath('/performance'), label: t('performance'), active: true },
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

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t('performanceTitle')}</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('performanceSubtitle')}</p>
          </div>

          {/* Trust Badges - Mobile: 2 per row, Desktop: all in one row */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-2">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs md:text-sm text-emerald-400 font-medium">{t('aiPerformance')}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs md:text-sm text-cyan-400 font-medium whitespace-nowrap">{t('transparentAI')}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs md:text-sm text-purple-400 font-medium whitespace-nowrap">{t('safestTips')}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs md:text-sm text-yellow-400 font-medium whitespace-nowrap">{t('mostAccurate')}</span>
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/5 p-6">
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
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/5 p-6">
                  <p className="text-gray-400 text-sm mb-1">{t('winRate')}</p>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter
                      target={overallStats.winRate}
                      suffix="%"
                      decimals={1}
                      isStarted={animationStarted}
                    />
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/5 p-6">
                  <p className="text-gray-400 text-sm mb-1">{t('totalBets')}</p>
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter
                      target={overallStats.totalBets}
                      decimals={0}
                      isStarted={animationStarted}
                    />
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/5 p-6">
                  <p className="text-gray-400 text-sm mb-1">{t('totalMatches')}</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    <AnimatedCounter
                      target={matches.length}
                      decimals={0}
                      isStarted={animationStarted}
                    />
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/5 p-6">
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

              {/* Bet Style Filter for Charts */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-400 mr-2">{t('betStyle')}</span>
                <button
                  onClick={() => setChartBetStyle('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer relative overflow-hidden group flex items-center gap-2 ${
                    chartBetStyle === 'all'
                      ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-400 border border-amber-500/50 shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {chartBetStyle !== 'all' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  )}
                  {/* Icon placeholder for consistent sizing */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center relative z-10 transition-all bg-gradient-to-br from-amber-400 to-orange-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                  <span className="relative z-10">{t('allStyles')}</span>
                </button>
                {BET_STYLES.map((style) => {
                  const imagePath = getBetStyleImage(style);
                  const displayName = getBetStyleDisplayName(style);
                  const gradientColor = getBetStyleColor(style);
                  const logoColor = getBetStyleLogoColor(style);
                  const isLocked = style === 'Balanced'; // Only lock 'Balanced', unlock 'Oddsflow Beta v8'

                  // Get translated display name
                  const translatedName = style === 'Value Hunter' ? t('hdpSniper')
                    : style === 'Aggressive' ? t('activeTrader')
                    : style === 'Balanced' ? t('oddsflowCore')
                    : style === 'Oddsflow Beta v8' ? t('oddsflowBeta')
                    : displayName;

                  return (
                    <button
                      key={style}
                      onClick={() => !isLocked && setChartBetStyle(style)}
                      disabled={isLocked}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative overflow-hidden group flex items-center gap-2 ${
                        isLocked
                          ? 'bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed'
                          : chartBetStyle === style
                          ? `bg-gradient-to-r ${gradientColor} text-white border border-white/20 shadow-lg cursor-pointer`
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 cursor-pointer'
                      }`}
                    >
                      {/* Coming Soon badge */}
                      {isLocked && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-20 shadow-lg">
                          {t('comingSoon')}
                        </span>
                      )}

                      {/* Hover shine effect */}
                      {chartBetStyle !== style && !isLocked && (
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      )}

                      {/* Icon image with custom background colors */}
                      {imagePath && (
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center relative z-10 transition-all bg-gradient-to-br ${logoColor} ${
                            chartBetStyle === style
                              ? 'shadow-xl scale-110 ring-2 ring-white/30'
                              : ''
                          }`}
                        >
                          <img
                            src={imagePath}
                            alt={displayName}
                            className={`object-contain transition-all ${
                              chartBetStyle === style ? 'w-6 h-6' : 'w-5 h-5'
                            }`}
                          />
                        </div>
                      )}

                      {/* Display name */}
                      <span className="relative z-10">{translatedName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Profit by Market */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/5 p-4 md:p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">{t('profitByMarket')}</h2>
                {/* Mobile: Vertical layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400 text-sm">{t('moneyline')}</span>
                    <span className={`text-lg font-bold ${filteredChartStats.profitMoneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredChartStats.profitMoneyline >= 0 ? '+$' : '-$'}{Math.abs(filteredChartStats.profitMoneyline).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg relative">
                    {chartBetStyle === 'Value Hunter' && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg italic overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></span>
                        <span className="relative z-10">{t('recommended')}</span>
                      </span>
                    )}
                    <span className="text-gray-400 text-sm">{t('handicap')}</span>
                    <span className={`text-lg font-bold ${filteredChartStats.profitHandicap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredChartStats.profitHandicap >= 0 ? '+$' : '-$'}{Math.abs(filteredChartStats.profitHandicap).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400 text-sm">{t('overUnder')}</span>
                    <span className={`text-lg font-bold ${filteredChartStats.profitOU >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredChartStats.profitOU >= 0 ? '+$' : '-$'}{Math.abs(filteredChartStats.profitOU).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                {/* Desktop: Grid layout */}
                <div className="hidden md:grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">{t('moneyline')}</p>
                    <p className={`text-xl font-bold ${filteredChartStats.profitMoneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredChartStats.profitMoneyline >= 0 ? '+$' : '-$'}{Math.abs(filteredChartStats.profitMoneyline).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg relative">
                    {chartBetStyle === 'Value Hunter' && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 italic overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></span>
                        <span className="relative z-10">{t('recommended')}</span>
                      </span>
                    )}
                    <p className="text-gray-400 text-sm mb-1">{t('handicap')}</p>
                    <p className={`text-xl font-bold ${filteredChartStats.profitHandicap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredChartStats.profitHandicap >= 0 ? '+$' : '-$'}{Math.abs(filteredChartStats.profitHandicap).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">{t('overUnder')}</p>
                    <p className={`text-xl font-bold ${filteredChartStats.profitOU >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredChartStats.profitOU >= 0 ? '+$' : '-$'}{Math.abs(filteredChartStats.profitOU).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Line Chart - Stock Market Style */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-6 mb-8">
                {/* Header with stats */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">{t('cumulativeProfit')}</h2>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-3xl font-bold ${filteredChartStats.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {filteredChartStats.totalProfit >= 0 ? '+' : '-'}${formatNumber(Math.abs(filteredChartStats.totalProfit))}
                      </span>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded ${filteredChartStats.roi >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {filteredChartStats.roi >= 0 ? '+' : ''}{filteredChartStats.roi.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-gray-400">{t('moneyline')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                      <span className="text-gray-400">{t('handicap')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-gray-400">{t('overUnder')}</span>
                    </div>
                  </div>
                </div>

                {filteredChartStats.dailyData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={filteredChartStats.dailyData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={overallStats.totalProfit >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={overallStats.totalProfit >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorMoneylineNew" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorHandicapNew" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorOUNew" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis
                          dataKey="index"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#4b5563', fontSize: 11 }}
                          tickFormatter={(value) => {
                            const dataPoint = filteredChartStats.dailyData[value];
                            if (dataPoint?.date) {
                              return new Date(dataPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }
                            return '';
                          }}
                          interval="preserveStartEnd"
                          minTickGap={50}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#4b5563', fontSize: 11 }}
                          tickFormatter={(value) => {
                            if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                            return `$${value}`;
                          }}
                          width={55}
                          domain={['dataMin - 1000', 'dataMax + 1000']}
                        />
                        <Tooltip
                          content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                              // Use actual cumulative values from payload (changes as user hovers)
                              const ml = payload[0]?.value ?? 0;
                              const hdp = payload[1]?.value ?? 0;
                              const ou = payload[2]?.value ?? 0;
                              const total = ml + hdp + ou;
                              // Get date from the data point, not from label (which is now index)
                              const dateStr = payload[0]?.payload?.date || '';

                              return (
                                <div className="bg-gray-950/95 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl min-w-[180px]">
                                  <p className="text-gray-500 text-xs mb-2 border-b border-white/5 pb-2">
                                    {dateStr ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                  </p>
                                  <div className="space-y-1.5">
                                    {payload.map((entry: any, index: number) => (
                                      <div key={index} className="flex items-center justify-between gap-4 text-xs">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                          <span className="text-gray-400">{entry.name}</span>
                                        </div>
                                        <span className={`font-mono font-medium ${entry.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                          {entry.value >= 0 ? '+' : ''}${formatNumber(entry.value, 0)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="border-t border-white/5 mt-2 pt-2 flex items-center justify-between">
                                    <span className="text-gray-400 text-xs">Total</span>
                                    <span className={`font-mono font-bold text-sm ${total >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                      {total >= 0 ? '+' : ''}${formatNumber(total, 0)}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeMoneyline"
                          name={t('moneyline')}
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorMoneylineNew)"
                          dot={false}
                          activeDot={{ r: 4, fill: '#10b981', stroke: '#0a0a0f', strokeWidth: 2 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeHandicap"
                          name={t('handicap')}
                          stroke="#06b6d4"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorHandicapNew)"
                          dot={false}
                          activeDot={{ r: 4, fill: '#06b6d4', stroke: '#0a0a0f', strokeWidth: 2 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeOU"
                          name={t('overUnder')}
                          stroke="#f59e0b"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorOUNew)"
                          dot={false}
                          activeDot={{ r: 4, fill: '#f59e0b', stroke: '#0a0a0f', strokeWidth: 2 }}
                        />
                        {/* Zero line reference */}
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>

              {/* League Filter - Mobile: Custom Dropdown with Logos, Desktop: Buttons */}
              {/* Mobile Custom Dropdown */}
              <div className="md:hidden mb-6 relative">
                <button
                  onClick={() => setLeagueDropdownOpen(!leagueDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {selectedLeague === 'all' ? (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </div>
                    ) : leagueLogoMap[selectedLeague] ? (
                      <div className="w-7 h-7 rounded-lg bg-white/90 p-1 flex items-center justify-center">
                        <img src={leagueLogoMap[selectedLeague]} alt="" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{selectedLeague.substring(0, 2)}</span>
                      </div>
                    )}
                    <span className="text-white font-medium">
                      {selectedLeague === 'all' ? t('allLeagues') : selectedLeague}
                    </span>
                  </div>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${leagueDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {leagueDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLeagueDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-[60vh] overflow-y-auto">
                      {/* All Leagues Option */}
                      <button
                        onClick={() => { setSelectedLeague('all'); setLeagueDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-all cursor-pointer ${
                          selectedLeague === 'all'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          selectedLeague === 'all'
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                            : 'bg-white/10'
                        }`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </div>
                        <span className="font-medium">{t('allLeagues')}</span>
                        {selectedLeague === 'all' && (
                          <svg className="w-5 h-5 ml-auto text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* League Options */}
                      {availableLeagues.map((league) => (
                        <button
                          key={league}
                          onClick={() => { setSelectedLeague(league); setLeagueDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-all cursor-pointer ${
                            selectedLeague === league
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          {leagueLogoMap[league] ? (
                            <div className="w-7 h-7 rounded-lg bg-white/90 p-1 flex items-center justify-center flex-shrink-0">
                              <img src={leagueLogoMap[league]} alt="" className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-white">{league.substring(0, 2)}</span>
                            </div>
                          )}
                          <span className="font-medium">{league}</span>
                          {selectedLeague === league && (
                            <svg className="w-5 h-5 ml-auto text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Desktop Buttons with Logos */}
              <div className="hidden md:flex items-center gap-3 mb-6 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedLeague('all')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedLeague === 'all'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    selectedLeague === 'all' ? 'bg-emerald-500' : 'bg-white/20'
                  }`}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  {t('allLeagues')}
                </button>
                {availableLeagues.map((league) => (
                  <button
                    key={league}
                    onClick={() => setSelectedLeague(league)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedLeague === league
                        ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {leagueLogoMap[league] ? (
                      <div className="w-5 h-5 rounded bg-white/90 p-0.5 flex items-center justify-center">
                        <img src={leagueLogoMap[league]} alt="" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                        <span className="text-[8px] font-bold">{league.substring(0, 2)}</span>
                      </div>
                    )}
                    {league}
                  </button>
                ))}
              </div>

              {/* Search and Date Filters */}
              <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-end">
                {/* Team Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={selectedLeague === 'all' ? t('searchTeams') : `${t('searchTeams').replace('...', '')} ${selectedLeague}...`}
                      className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                    <svg
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {searchQuery && filteredMatches.length === 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      No teams found matching "{searchQuery}"
                      {selectedLeague !== 'all' && ` in ${selectedLeague}`}
                    </p>
                  )}
                </div>

                {/* Date Range Filter */}
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">{t('from')}</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                        style={{ colorScheme: 'dark' }}
                      />
                      <svg
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">{t('to')}</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                        style={{ colorScheme: 'dark' }}
                      />
                      <svg
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Clear date filters button */}
                  {(dateRange.start || dateRange.end) && (
                    <button
                      onClick={() => setDateRange({ start: '', end: '' })}
                      className="mt-7 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                      title="Clear dates"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Past Matches - Table Style */}
              <div
                ref={pastMatchesRef}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: 'none',
                  scrollMarginTop: '100px'
                }}
              >
                {/* Desktop Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-white/5 border-b border-white/5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="col-span-4">{t('pastMatches')}</div>
                  <div className="col-span-2 text-center">{t('score')}</div>
                  <div className="col-span-1 text-right">{t('moneyline')}</div>
                  <div className="col-span-1 text-right">{t('handicap')}</div>
                  <div className="col-span-1 text-right">{t('overUnder')}</div>
                  <div className="col-span-1 text-right">{t('roi').toUpperCase()}</div>
                  <div className="col-span-2 text-right">{t('total')}</div>
                </div>

                {/* Mobile Header */}
                <div
                  className="md:hidden px-4 py-3"
                  style={{
                    backgroundColor: '#111827',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    color: '#9CA3AF'
                  }}
                >
                  <h3
                    className="text-sm font-medium uppercase tracking-wider"
                    style={{
                      color: '#9CA3AF',
                      backgroundColor: 'transparent'
                    }}
                  >
                    {t('pastMatches')}
                  </h3>
                </div>

                {filteredMatches.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">{t('noMatches')}</div>
                ) : (
                  <div>
                    {paginatedMatches.map((match, index) => {
                      const dateInfo = formatMatchDate(match.match_date);
                      const isHotMatch = dateInfo.isHot;

                      // Get filtered profits for this match based on chartBetStyle
                      const filteredProfits = matchProfitsByStyle.get(String(match.fixture_id)) || {
                        profit_moneyline: 0,
                        profit_handicap: 0,
                        profit_ou: 0,
                        total_profit: 0,
                        total_invested: 0,
                      };
                      const filteredROI = filteredProfits.total_invested > 0
                        ? (filteredProfits.total_profit / filteredProfits.total_invested) * 100
                        : 0;

                      return (
                      <div
                        key={`${match.fixture_id}-${index}`}
                        style={{
                          borderBottom: index < paginatedMatches.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                        }}
                      >
                        {/* Mobile Card Layout */}
                        <div
                          className="md:hidden relative p-4"
                          style={{
                            backgroundColor: 'rgb(17, 24, 39)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.15s'
                          }}
                        >
                          {/* Hot Match Indicator */}
                          {isHotMatch && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-r" />
                          )}

                          {/* Row 1: League & Date */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {match.league_logo && (
                                <div className="w-5 h-5 rounded-sm bg-white/90 p-0.5 flex items-center justify-center">
                                  <img src={match.league_logo} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}
                              <span className="text-xs text-emerald-400 font-medium">
                                {translateLeagueName(match.league_name).length > 15 ? translateLeagueName(match.league_name).substring(0, 15) + '...' : translateLeagueName(match.league_name)}
                              </span>
                            </div>
                            <span className={`text-xs flex items-center gap-1 ${dateInfo.isHot ? 'text-emerald-400 font-semibold' : 'text-gray-500'}`}>
                              {dateInfo.isHot && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                              )}
                              {dateInfo.text}
                            </span>
                          </div>

                          {/* Row 2: Teams & Score - Clickable link to match analysis */}
                          <Link
                            href={localePath(`/predictions/${match.match_date ? match.match_date.split('T')[0] : new Date().toISOString().split('T')[0]}/${generateMatchSlug(match.home_name || 'home', match.away_name || 'away')}-${match.fixture_id}`)}
                            className="flex items-center justify-between mb-3 group/match hover:bg-white/5 -mx-2 px-2 py-1 rounded-lg transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="flex-1 min-w-0 mr-3">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded-full bg-white/10 p-0.5 flex items-center justify-center flex-shrink-0">
                                  {match.home_logo ? (
                                    <img src={match.home_logo} alt="" className="w-full h-full object-contain" />
                                  ) : (
                                    <span className="text-[8px] font-bold text-white">{(match.home_name || 'H').substring(0, 2)}</span>
                                  )}
                                </div>
                                <span className="text-sm text-white font-medium truncate group-hover/match:text-emerald-400 transition-colors">{translateTeamName(match.home_name)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/10 p-0.5 flex items-center justify-center flex-shrink-0">
                                  {match.away_logo ? (
                                    <img src={match.away_logo} alt="" className="w-full h-full object-contain" />
                                  ) : (
                                    <span className="text-[8px] font-bold text-white">{(match.away_name || 'A').substring(0, 2)}</span>
                                  )}
                                </div>
                                <span className="text-sm text-white font-medium truncate group-hover/match:text-emerald-400 transition-colors">{translateTeamName(match.away_name)}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-lg font-bold text-white">{match.home_score}</span>
                              <span className="text-lg font-bold text-white">{match.away_score}</span>
                            </div>
                          </Link>

                          {/* Row 3: Profit breakdown */}
                          <div className="flex items-center justify-between gap-2 mb-2 bg-transparent">
                            <div className="flex items-center gap-3 text-xs bg-transparent">
                              <div>
                                <span className="text-gray-500">1x2: </span>
                                <span className={filteredProfits.profit_moneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                  {filteredProfits.profit_moneyline >= 0 ? '+' : ''}{formatNumber(filteredProfits.profit_moneyline, 0)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">HDP: </span>
                                <span className={filteredProfits.profit_handicap >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                  {filteredProfits.profit_handicap >= 0 ? '+' : ''}{formatNumber(filteredProfits.profit_handicap, 0)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">O/U: </span>
                                <span className={filteredProfits.profit_ou >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                  {filteredProfits.profit_ou >= 0 ? '+' : ''}{formatNumber(filteredProfits.profit_ou, 0)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Row 4: Total Profit & ROI */}
                          <div className="flex items-center justify-between bg-transparent">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold isolate ${
                              filteredProfits.total_profit >= 0
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              Total: {filteredProfits.total_profit >= 0 ? '+$' : '-$'}{formatNumber(Math.abs(filteredProfits.total_profit), 0)}
                            </span>
                            <span className={`text-sm font-medium ${filteredROI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              ROI: {filteredROI >= 0 ? '+' : ''}{filteredROI.toFixed(0)}%
                            </span>
                          </div>

                          {/* Row 5: Action Buttons */}
                          <div
                            className="flex items-center justify-end gap-2 mt-3 pt-3"
                            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
                          >
                            <Link
                              href={getProfitSummaryUrl(match)}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              View Profit
                            </Link>
                          </div>
                        </div>

                        {/* Desktop Row Layout */}
                        <div
                          className={`hidden md:grid relative grid-cols-12 gap-2 px-4 py-3 items-center transition-all ${
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

                          {/* Match Info - Clickable link to match analysis */}
                          <Link
                            href={localePath(`/predictions/${match.match_date ? match.match_date.split('T')[0] : new Date().toISOString().split('T')[0]}/${generateMatchSlug(match.home_name || 'home', match.away_name || 'away')}-${match.fixture_id}`)}
                            className="col-span-4 relative group/match"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {match.league_logo && (
                                <div className="w-4 h-4 rounded-sm bg-white/90 p-0.5 flex items-center justify-center flex-shrink-0">
                                  <img src={match.league_logo} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}
                              <span className="text-[10px] text-emerald-400 font-medium">
                                {translateLeagueName(match.league_name).length > 12 ? translateLeagueName(match.league_name).substring(0, 12) : translateLeagueName(match.league_name)}
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
                              {/* Link indicator */}
                              <svg className="w-3 h-3 text-gray-500 group-hover/match:text-emerald-400 transition-colors ml-auto opacity-0 group-hover/match:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
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
                                <span className="text-sm text-white font-medium truncate group-hover/match:text-emerald-400 transition-colors">{translateTeamName(match.home_name)}</span>
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
                                <span className="text-sm text-white font-medium truncate group-hover/match:text-emerald-400 transition-colors">{translateTeamName(match.away_name)}</span>
                              </div>
                            </div>
                          </Link>

                          {/* Score */}
                          <div className="col-span-2 text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 bg-white/5 rounded-md text-sm font-bold text-white min-w-[60px]">
                              {match.home_score} - {match.away_score}
                            </span>
                          </div>

                          {/* 1x2 */}
                          <div className={`col-span-1 text-right text-sm font-medium ${filteredProfits.profit_moneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {filteredProfits.profit_moneyline >= 0 ? '+' : ''}{formatNumber(filteredProfits.profit_moneyline, 0)}
                          </div>

                          {/* HDP */}
                          <div className={`col-span-1 text-right text-sm font-medium ${filteredProfits.profit_handicap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {filteredProfits.profit_handicap >= 0 ? '+' : ''}{formatNumber(filteredProfits.profit_handicap, 0)}
                          </div>

                          {/* O/U */}
                          <div className={`col-span-1 text-right text-sm font-medium ${filteredProfits.profit_ou >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {filteredProfits.profit_ou >= 0 ? '+' : ''}{formatNumber(filteredProfits.profit_ou, 0)}
                          </div>

                          {/* ROI */}
                          <div className={`col-span-1 text-right text-sm font-medium ${filteredROI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {filteredROI >= 0 ? '+' : ''}{filteredROI.toFixed(0)}%
                          </div>

                          {/* Total + View Button */}
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-bold min-w-[80px] ${
                              filteredProfits.total_profit >= 0
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {filteredProfits.total_profit >= 0 ? '+$' : '-$'}{formatNumber(Math.abs(filteredProfits.total_profit), 0)}
                            </span>
                            <div className="relative group/profit">
                              <Link
                                href={getProfitSummaryUrl(match)}
                                className="p-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer inline-block"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </Link>
                              <span className="absolute top-full right-0 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 border border-white/10 rounded shadow-lg whitespace-nowrap opacity-0 group-hover/profit:opacity-100 pointer-events-none z-[100]">
                                View Profit Details
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination Controls */}
                <div className="flex flex-col items-center gap-4 p-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  {/* Show count */}
                  <span className="text-sm text-gray-400">
                    {t('showing')} {startIndex + 1}-{Math.min(endIndex, filteredMatches.length)} {t('of')} {filteredMatches.length} {t('matches')}
                  </span>

                  {/* Pagination buttons */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      {/* Previous button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === 1
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                        style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                      >
                        ← {t('previous')}
                      </button>

                      {/* Page numbers */}
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Show first 3, current +/- 1, and last page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          if (pageNum < 1 || pageNum > totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }`}
                              style={{ cursor: 'pointer' }}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === totalPages
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                        style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                      >
                        {t('next')} →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Profit Details Modal */}
      {showProfitModal && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowProfitModal(false)} />

          {/* Modal */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Background glow */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t('profitSummary')}</h3>
                  <span className="text-sm text-gray-400">{selectedMatch.home_name} vs {selectedMatch.away_name}</span>
                </div>
              </div>
              <button
                onClick={() => setShowProfitModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingProfit ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : profitSummary ? (
              (() => {
                // Helper function to determine bet type
                const getBetType = (selection: string | null): 'moneyline' | 'handicap' | 'ou' => {
                  if (!selection) return 'ou';
                  const sel = selection.toLowerCase();
                  // Handicap bets - check for HDP in selection (e.g., HOME_HDP_-0.75, AWAY_HDP_+0.5)
                  if (sel.includes('hdp') || sel.includes('handicap')) return 'handicap';
                  if (sel.includes('over') || sel.includes('under')) return 'ou';
                  if (/^(home|away)\s*[+-]?\d/.test(sel)) return 'handicap';
                  if (sel === 'home' || sel === 'draw' || sel === 'away') return 'moneyline';
                  return 'ou';
                };

                // Filter records based on type and bet style
                const filteredRecords = profitSummaryRecords.filter(record => {
                  if (profitTypeFilter !== 'all' && getBetType(record.selection) !== profitTypeFilter) {
                    return false;
                  }
                  if (profitBetStyleFilter !== 'all' && record.bet_style !== profitBetStyleFilter) {
                    return false;
                  }
                  return true;
                });

                // Calculate dynamic stats from filtered records
                const filteredTotalProfit = filteredRecords.reduce((sum, r) => sum + (r.profit ?? 0), 0);
                const filteredTotalInvested = filteredRecords.reduce((sum, r) => sum + (r.stake_money ?? 0), 0);
                const filteredTotalBets = filteredRecords.length;
                const filteredROI = filteredTotalInvested > 0 ? (filteredTotalProfit / filteredTotalInvested) * 100 : 0;

                // Calculate profit by market from filtered records
                const filteredProfitMoneyline = filteredRecords.filter(r => getBetType(r.selection) === 'moneyline').reduce((sum, r) => sum + (r.profit ?? 0), 0);
                const filteredProfitHandicap = filteredRecords.filter(r => getBetType(r.selection) === 'handicap').reduce((sum, r) => sum + (r.profit ?? 0), 0);
                const filteredProfitOU = filteredRecords.filter(r => getBetType(r.selection) === 'ou').reduce((sum, r) => sum + (r.profit ?? 0), 0);

                return (
              <div className="relative z-10 space-y-4">
                {/* Main Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('totalProfit')}</div>
                    <div className={`text-2xl font-bold ${filteredTotalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredTotalProfit >= 0 ? '+$' : '-$'}{Math.abs(filteredTotalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('roi')}</div>
                    <div className={`text-2xl font-bold ${filteredROI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredROI >= 0 ? '+' : ''}{filteredROI.toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('totalInvested')}</div>
                    <div className="text-xl font-bold text-white">
                      ${filteredTotalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('totalBets')}</div>
                    <div className="text-xl font-bold text-white">{filteredTotalBets}</div>
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
                      <span className={`font-bold ${filteredProfitMoneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {filteredProfitMoneyline >= 0 ? '+$' : '-$'}{Math.abs(filteredProfitMoneyline).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-gray-300 text-sm">{t('asianHandicap')}</span>
                      </div>
                      <span className={`font-bold ${filteredProfitHandicap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {filteredProfitHandicap >= 0 ? '+$' : '-$'}{Math.abs(filteredProfitHandicap).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-gray-300 text-sm">{t('overUnder')}</span>
                      </div>
                      <span className={`font-bold ${filteredProfitOU >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {filteredProfitOU >= 0 ? '+$' : '-$'}{Math.abs(filteredProfitOU).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bet Details Table */}
                {profitSummaryRecords.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{t('betDetails')} ({filteredRecords.length})</div>
                        <div className="flex gap-1">
                          {(['all', 'moneyline', 'handicap', 'ou'] as const).map((filter) => (
                            <button
                              key={filter}
                              onClick={() => setProfitTypeFilter(filter)}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                                profitTypeFilter === filter
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
                          onClick={() => setProfitBetStyleFilter('all')}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                            profitBetStyleFilter === 'all'
                              ? 'bg-white/20 text-white'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          All
                        </button>
                        {BET_STYLES.map((style) => (
                          <button
                            key={style}
                            onClick={() => setProfitBetStyleFilter(style)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                              profitBetStyleFilter === style
                                ? 'bg-amber-500/30 text-amber-400'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {style === 'Aggressive' && '🔥 '}
                            {style === 'Conservative' && '🛡️ '}
                            {style === 'Balanced' && '⚖️ '}
                            {style === 'Value Hunter' && '💎 '}
                            {style === 'Oddsflow Beta v8' && '✅ '}
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
                                        record.status?.toLowerCase() === 'won' || record.status?.toLowerCase() === 'win' ? 'status-win-glow' :
                                        record.status?.toLowerCase() === 'lost' || record.status?.toLowerCase() === 'loss' ? 'status-loss-glow' :
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
                      <div className="md:hidden space-y-2 max-h-[300px] overflow-y-auto">
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
                                    record.status?.toLowerCase() === 'won' || record.status?.toLowerCase() === 'win' ? 'status-win-glow' :
                                    record.status?.toLowerCase() === 'lost' || record.status?.toLowerCase() === 'loss' ? 'status-loss-glow' :
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

                <div className="text-center text-xs text-gray-500">1 Bet = $100</div>
              </div>
                );
              })()
            ) : (
              <div className="relative z-10 text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm">No profit summary available</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer localePath={localePath} t={t} locale={locale} />
      </div>
    </div>
  );
}
