'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { locales, localeNames, localeToTranslationCode, type Locale } from '@/i18n/config';
import { User } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { LeagueStatsSummary, LEAGUES_CONFIG, getLocalizedLeagueName, getLocalizedTopTeamName } from '@/lib/leagues-data';
import Footer from '@/components/Footer';

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    leagues: "Football Leagues & AI Predictions",
    leaguesNav: "Leagues",
    leaguesSubtitle: "OddsFlow provides AI-powered predictions for Premier League, Bundesliga, Serie A, La Liga, Ligue 1, and Champions League. Browse league standings, team statistics, and get data-driven betting insights.",
    home: "Home",
    predictions: "Predictions",
    performance: "AI Performance",
    community: "Community",
    news: "News",
    solution: "Solution",
    pricing: "Pricing",
    login: "Log In",
    getStarted: "Get Started",
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
    seoTitle: "European Football AI Tips",
    seoP1: "OddsFlow provides the most accurate AI football predictor for all major European leagues. Our transparent AI betting platform offers verified AI betting records for Premier League, Bundesliga, Serie A, La Liga, Ligue 1, and Champions League.",
    seoP2: "Whether you're looking for Premier League 1x2 predictions today, Bundesliga AI betting predictions, or Serie A artificial intelligence picks, our platform delivers data-driven insights powered by advanced machine learning algorithms.",
    seoP3: "Our best AI for handicap betting analyzes handicap draw predictions, over 2.5 goals stats, and provides comprehensive match analysis. Experience the safest AI football tips with our transparent AI betting results.",
    popularLeagues: "Popular Leagues",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
    leading: "Leading",
    teams: "Teams",
    goals: "Goals",
    avgMatch: "Avg/Match",
    cleanSheets: "Clean Sheets",
    viewStandings: "View Standings",
    teamStats: "Team Stats",
    formations: "Formations",
    season: "Season",
  },
  ES: {
    leagues: "Ligas de Futbol y Predicciones IA",
    leaguesNav: "Ligas",
    leaguesSubtitle: "OddsFlow ofrece predicciones impulsadas por IA para Premier League, Bundesliga, Serie A, La Liga, Ligue 1 y Champions League. Consulta clasificaciones, estadisticas y obtiene consejos de apuestas.",
    home: "Inicio",
    predictions: "Predicciones",
    performance: "Rendimiento IA",
    community: "Comunidad",
    news: "Noticias",
    solution: "Solucion",
    pricing: "Precios",
    login: "Iniciar Sesion",
    getStarted: "Comenzar",
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
    seoTitle: "Pronósticos IA para las 5 Grandes Ligas de Fútbol",
    seoP1: "OddsFlow es la plataforma de pronósticos de fútbol con IA más precisa para La Liga, Premier League, Bundesliga, Serie A, Ligue 1 y Champions League. Nuestro modelo de big data analiza estadísticas, forma de equipos y lesiones para ofrecer predicciones fiables.",
    seoP2: "¿Buscas pronósticos 1x2 de La Liga, análisis de hándicap asiático de la Premier League o predicciones de más/menos goles de la Serie A? OddsFlow proporciona consejos de apuestas basados en datos. Sigue los movimientos de cuotas en tiempo real.",
    seoP3: "Nuestro modelo de IA destaca en análisis de hándicap asiático, cuotas europeas y predicciones over/under. Consulta nuestro historial de predicciones verificado en la página de Rendimiento. Toma decisiones de apuesta inteligentes con análisis de IA transparente.",
    popularLeagues: "Ligas Populares",
    communityFooter: "Comunidad",
    globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento.",
    leading: "Líder",
    teams: "Equipos",
    goals: "Goles",
    avgMatch: "Prom/Partido",
    cleanSheets: "Porterías Invictas",
    viewStandings: "Ver Clasificación",
    teamStats: "Estadísticas",
    formations: "Formaciones",
    season: "Temporada",
  },
  PT: {
    leagues: "Ligas de Futebol e Previsoes IA",
    leaguesNav: "Ligas",
    leaguesSubtitle: "OddsFlow oferece previsoes impulsionadas por IA para Premier League, Bundesliga, Serie A, La Liga, Ligue 1 e Champions League. Veja classificacoes, estatisticas e dicas de apostas.",
    home: "Inicio",
    predictions: "Previsoes",
    performance: "Desempenho IA",
    community: "Comunidade",
    news: "Noticias",
    solution: "Solucao",
    pricing: "Precos",
    login: "Entrar",
    getStarted: "Comecar",
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
    seoTitle: "Palpites de Futebol IA para as 5 Grandes Ligas Europeias",
    seoP1: "OddsFlow é a plataforma de palpites de futebol com IA mais precisa para Premier League, La Liga, Bundesliga, Serie A, Ligue 1 e Champions League. Nosso modelo de big data analisa estatísticas, forma das equipes e lesões para oferecer previsões confiáveis.",
    seoP2: "Procurando palpites 1x2 da Premier League, análise de handicap asiático da La Liga ou previsões de mais/menos gols da Serie A? OddsFlow fornece dicas de apostas baseadas em dados. Acompanhe os movimentos de odds em tempo real.",
    seoP3: "Nosso modelo de IA se destaca em análise de handicap asiático, odds europeias e previsões over/under. Confira nosso histórico de previsões verificado na página de Desempenho. Tome decisões de aposta inteligentes com análise de IA transparente.",
    popularLeagues: "Ligas Populares",
    communityFooter: "Comunidade",
    globalChat: "Chat Global",
    userPredictions: "Previsoes de Usuarios",
    disclaimer: "Aviso: OddsFlow fornece previsoes baseadas em IA apenas para fins informativos e de entretenimento.",
    leading: "Líder",
    teams: "Equipas",
    goals: "Gols",
    avgMatch: "Média/Jogo",
    cleanSheets: "Sem Sofrer Gol",
    viewStandings: "Ver Classificação",
    teamStats: "Estatísticas",
    formations: "Formações",
    season: "Temporada",
  },
  DE: {
    leagues: "Fussball-Ligen & KI-Vorhersagen",
    leaguesNav: "Ligen",
    leaguesSubtitle: "OddsFlow bietet KI-gestutzte Vorhersagen fur Premier League, Bundesliga, Serie A, La Liga, Ligue 1 und Champions League. Tabellen, Statistiken und Wett-Tipps.",
    home: "Startseite",
    predictions: "Vorhersagen",
    performance: "KI-Leistung",
    community: "Community",
    news: "Nachrichten",
    solution: "Losung",
    pricing: "Preise",
    login: "Anmelden",
    getStarted: "Loslegen",
    footer: "18+ | Glucksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
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
    seoTitle: "KI-Vorhersagen für die Top 5 Fußball-Ligen",
    seoP1: "OddsFlow ist die präziseste KI-Fußball-Vorhersage-Plattform für Bundesliga, Premier League, La Liga, Serie A, Ligue 1 und Champions League. Unser Big-Data-Modell analysiert Statistiken, Teamform und Verletzungen für zuverlässige Prognosen.",
    seoP2: "Suchen Sie 1x2-Vorhersagen für die Bundesliga, Asian Handicap-Analysen der Premier League oder Über/Unter-Prognosen der Serie A? OddsFlow liefert datenbasierte Wett-Tipps. Verfolgen Sie Quotenbewegungen in Echtzeit.",
    seoP3: "Unser KI-Modell glänzt bei Asian Handicap-Analysen, europäischen Quoten und Über/Unter-Vorhersagen. Überprüfen Sie unsere transparente Vorhersage-Bilanz auf der Performance-Seite. Treffen Sie kluge Wettentscheidungen mit transparenter KI-Analyse.",
    popularLeagues: "Beliebte Ligen",
    communityFooter: "Community",
    globalChat: "Globaler Chat",
    userPredictions: "Benutzer-Vorhersagen",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestutzte Vorhersagen nur zu Informations- und Unterhaltungszwecken.",
    leading: "Führend",
    teams: "Teams",
    goals: "Tore",
    avgMatch: "Ø/Spiel",
    cleanSheets: "Zu-Null-Spiele",
    viewStandings: "Tabelle ansehen",
    teamStats: "Team-Stats",
    formations: "Formationen",
    season: "Saison",
  },
  FR: {
    leagues: "Ligues de Football & Predictions IA",
    leaguesNav: "Ligues",
    leaguesSubtitle: "OddsFlow propose des predictions basees sur l'IA pour Premier League, Bundesliga, Serie A, La Liga, Ligue 1 et Champions League. Classements, stats et conseils paris.",
    home: "Accueil",
    predictions: "Predictions",
    performance: "Performance IA",
    community: "Communaute",
    news: "Actualites",
    solution: "Solution",
    pricing: "Tarifs",
    login: "Connexion",
    getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez de maniere responsable.",
    allRights: "© 2026 OddsFlow. Tous droits reserves.",
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
    seoTitle: "Pronostics Foot IA pour les 5 Grands Championnats",
    seoP1: "OddsFlow est la plateforme de pronostics foot IA la plus précise pour la Ligue 1, Premier League, Liga, Bundesliga, Serie A et Champions League. Notre modèle big data analyse statistiques, forme des équipes et blessures pour des pronostics fiables.",
    seoP2: "Vous cherchez des pronostics 1x2 pour la Ligue 1, des analyses de handicap asiatique de Premier League ou des prédictions plus/moins de buts pour la Serie A ? OddsFlow fournit des conseils paris sportifs basés sur les données. Suivez les mouvements de cotes en temps réel.",
    seoP3: "Notre modèle IA excelle dans l'analyse du handicap asiatique, des cotes européennes et des prédictions over/under. Consultez notre historique de pronostics vérifié sur la page Performance. Prenez des décisions de paris intelligentes avec une analyse IA transparente.",
    popularLeagues: "Ligues Populaires",
    communityFooter: "Communaute",
    globalChat: "Chat Global",
    userPredictions: "Predictions Utilisateurs",
    disclaimer: "Avertissement : OddsFlow fournit des predictions basees sur l'IA a des fins d'information et de divertissement uniquement.",
    leading: "Leader",
    teams: "Équipes",
    goals: "Buts",
    avgMatch: "Moy/Match",
    cleanSheets: "Clean Sheets",
    viewStandings: "Voir Classement",
    teamStats: "Stats Équipe",
    formations: "Formations",
    season: "Saison",
  },
  JA: {
    leagues: "サッカーリーグ & AI予測",
    leaguesNav: "リーグ",
    leaguesSubtitle: "OddsFlowはプレミアリーグ、ブンデスリーガ、セリエA、ラ・リーガ、リーグ・アン、チャンピオンズリーグのAI予測を提供。順位表、統計、ベッティングインサイト。",
    home: "ホーム",
    predictions: "予測",
    performance: "AIパフォーマンス",
    community: "コミュニティ",
    news: "ニュース",
    solution: "ソリューション",
    pricing: "料金",
    login: "ログイン",
    getStarted: "始める",
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
    seoTitle: "欧州5大リーグAI予想とブックメーカー分析",
    seoP1: "OddsFlowは欧州5大リーグ（プレミアリーグ、ブンデスリーガ、セリエA、ラ・リーガ、リーグ・アン）とチャンピオンズリーグに対応したAIサッカー予想サイトです。ビッグデータ分析で勝敗予想、オッズ分析を提供。",
    seoP2: "プレミアリーグの勝敗予想、ブンデスリーガのハンディキャップ分析、セリエAのオーバーアンダー予想など、データに基づいたブックメーカー投資判断をサポートします。リアルタイムのオッズ変動を追跡。",
    seoP3: "当サイトのAIモデルはアジアンハンディキャップ、欧州オッズ、オーバーアンダー予想で高い精度を誇ります。AI予想の的中実績はパフォーマンスページで透明に公開。データ分析で堅実なブックメーカー投資を。",
    popularLeagues: "人気リーグ",
    communityFooter: "コミュニティ",
    globalChat: "グローバルチャット",
    userPredictions: "ユーザー予測",
    disclaimer: "免責事項：OddsFlowはAI駆動の予測を情報および娯楽目的のみで提供しています。",
    leading: "首位",
    teams: "チーム",
    goals: "得点",
    avgMatch: "平均/試合",
    cleanSheets: "クリーンシート",
    viewStandings: "順位表",
    teamStats: "チーム統計",
    formations: "フォーメーション",
    season: "シーズン",
  },
  KO: {
    leagues: "축구 리그 & AI 예측",
    leaguesNav: "리그",
    leaguesSubtitle: "OddsFlow는 프리미어리그, 분데스리가, 세리에A, 라리가, 리그1, 챔피언스리그에 대한 AI 예측을 제공합니다. 순위, 통계, 베팅 인사이트를 확인하세요.",
    home: "홈",
    predictions: "예측",
    performance: "AI 성능",
    community: "커뮤니티",
    news: "뉴스",
    solution: "솔루션",
    pricing: "가격",
    login: "로그인",
    getStarted: "시작하기",
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
    seoTitle: "유럽 5대 리그 AI 분석 & 프로토 예측",
    seoP1: "OddsFlow는 유럽 5대 리그(프리미어리그, 분데스리가, 세리에A, 라리가, 리그1)와 챔피언스리그를 분석하는 빅데이터 AI 축구 예측 사이트입니다. 프로토, 스포츠토토 분석에 최적화된 승무패 예측을 제공합니다.",
    seoP2: "프리미어리그 승무패 예측, 분데스리가 핸디캡 분석, 세리에A 언오버 예측 등 데이터 기반의 프로토 분석을 제공합니다. 실시간 배당률 변동을 추적하여 최적의 배팅 타이밍을 파악하세요.",
    seoP3: "OddsFlow AI 모델은 아시안 핸디캡, 유럽 배당률, 언오버 예측에서 높은 적중률을 자랑합니다. AI 예측 적중 기록은 퍼포먼스 페이지에서 투명하게 공개됩니다. 빅데이터 분석으로 스마트한 스포츠토토 투자를 시작하세요.",
    popularLeagues: "인기 리그",
    communityFooter: "커뮤니티",
    globalChat: "글로벌 채팅",
    userPredictions: "사용자 예측",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다.",
    leading: "선두",
    teams: "팀",
    goals: "골",
    avgMatch: "평균/경기",
    cleanSheets: "클린시트",
    viewStandings: "순위 보기",
    teamStats: "팀 통계",
    formations: "포메이션",
    season: "시즌",
  },
  '中文': {
    leagues: "足球联赛与AI预测",
    leaguesNav: "联赛",
    leaguesSubtitle: "OddsFlow提供英超、德甲、意甲、西甲、法甲和欧冠的AI预测。查看积分榜、球队统计和投注建议。",
    home: "首页",
    predictions: "预测",
    performance: "AI表现",
    community: "社区",
    news: "新闻",
    solution: "解决方案",
    pricing: "价格",
    login: "登录",
    getStarted: "开始使用",
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
    seoTitle: "五大联赛AI预测与盘口分析",
    seoP1: "OddsFlow是专业的五大联赛AI预测平台，覆盖英超、德甲、意甲、西甲、法甲和欧冠。我们的大数据AI模型分析历史战绩、球队状态、伤病情况，为您提供最精准的足球预测。",
    seoP2: "无论您是寻找英超胜平负预测、德甲让球盘分析，还是意甲大小球推荐，OddsFlow都能提供数据驱动的投注建议。实时追踪赔率走势，把握最佳投注时机。",
    seoP3: "我们的AI模型在亚盘分析、欧赔解读、大小球预测方面表现出色。查看我们的AI表现页面，验证透明的历史战绩。用数据战胜庄家，从五大联赛开始您的智能投注之旅。",
    popularLeagues: "热门联赛",
    communityFooter: "社区",
    globalChat: "全球聊天",
    userPredictions: "用户预测",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。",
    leading: "领先",
    teams: "球队",
    goals: "进球",
    avgMatch: "场均",
    cleanSheets: "零封",
    viewStandings: "查看积分榜",
    teamStats: "球队数据",
    formations: "阵型",
    season: "赛季",
  },
  '繁體': {
    leagues: "足球聯賽與AI預測",
    leaguesNav: "聯賽",
    leaguesSubtitle: "OddsFlow提供英超、德甲、義甲、西甲、法甲和歐冠的AI預測。查看積分榜、球隊統計和投注建議。",
    home: "首頁",
    predictions: "預測",
    performance: "AI表現",
    community: "社區",
    news: "新聞",
    solution: "解決方案",
    pricing: "價格",
    login: "登入",
    getStarted: "開始使用",
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
    seoTitle: "五大聯賽AI預測與運彩分析",
    seoP1: "OddsFlow是專業的五大聯賽AI預測平台，提供英超、德甲、義甲、西甲、法甲和歐冠的運彩分析。大數據AI模型分析歷史戰績、球隊狀態、傷兵情況，為您提供最精準的足球預測。",
    seoP2: "無論您是尋找英超勝和負預測、德甲讓分盤分析，還是義甲大小分推薦，OddsFlow都能提供數據驅動的投注建議。即時追蹤賠率走勢，掌握最佳投注時機。",
    seoP3: "我們的AI模型在讓分盤分析、歐賠解讀、大小分預測方面表現出色。查看AI表現頁面，驗證透明的歷史戰績。用數據提升運彩勝率，從五大聯賽開始您的智能投注之旅。",
    popularLeagues: "熱門聯賽",
    communityFooter: "社區",
    globalChat: "全球聊天",
    userPredictions: "用戶預測",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。",
    leading: "領先",
    teams: "球隊",
    goals: "進球",
    avgMatch: "場均",
    cleanSheets: "零封",
    viewStandings: "查看積分榜",
    teamStats: "球隊數據",
    formations: "陣型",
    season: "賽季",
  },
  ID: {
    leagues: "Liga Sepak Bola & Prediksi AI",
    leaguesNav: "Liga",
    leaguesSubtitle: "OddsFlow menyediakan prediksi bertenaga AI untuk Premier League, Bundesliga, Serie A, La Liga, Ligue 1, dan Champions League. Lihat klasemen, statistik, dan tips taruhan.",
    home: "Beranda",
    predictions: "Prediksi",
    performance: "Performa AI",
    community: "Komunitas",
    news: "Berita",
    solution: "Solusi",
    pricing: "Harga",
    login: "Masuk",
    getStarted: "Mulai",
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
    seoTitle: "Prediksi Bola AI & Analisis Mix Parlay Liga Eropa",
    seoP1: "OddsFlow adalah platform prediksi bola AI terpercaya untuk Liga Inggris, Bundesliga, Serie A, La Liga, Ligue 1, dan Liga Champions. Analisis big data untuk prediksi akurat, cocok untuk mix parlay dan taruhan handicap.",
    seoP2: "Cari prediksi 1x2 Liga Inggris, analisis handicap Bundesliga, atau prediksi over/under Serie A? OddsFlow menyediakan tips taruhan berbasis data. Pantau pergerakan odds real-time untuk menemukan pola gacor terbaik.",
    seoP3: "Model AI kami unggul dalam analisis Asian Handicap, odds Eropa, dan prediksi over/under. Lihat rekam jejak prediksi kami yang transparan di halaman Performa. Tingkatkan peluang menang mix parlay Anda dengan analisis AI yang akurat.",
    popularLeagues: "Liga Populer",
    communityFooter: "Komunitas",
    globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan.",
    leading: "Memimpin",
    teams: "Tim",
    goals: "Gol",
    avgMatch: "Rata-rata/Laga",
    cleanSheets: "Clean Sheet",
    viewStandings: "Lihat Klasemen",
    teamStats: "Statistik Tim",
    formations: "Formasi",
    season: "Musim",
  },
};

// Props interface for server-side data
interface LeaguesClientProps {
  initialLeagueStats?: Record<string, LeagueStatsSummary>;
  leagues?: typeof LEAGUES_CONFIG;
}

export default function LeaguesClient({
  initialLeagueStats = {},
  leagues = LEAGUES_CONFIG,
}: LeaguesClientProps) {
  const params = useParams();
  const urlLocale = (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Use server-provided initial data for SEO
  const [leagueStats] = useState<Record<string, LeagueStatsSummary>>(initialLeagueStats);
  const [loadingStats] = useState(Object.keys(initialLeagueStats).length === 0);
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

  // Language change navigates to new locale URL
  const getLocaleUrl = (targetLocale: Locale): string => {
    return targetLocale === 'en' ? '/leagues' : `/${targetLocale}/leagues`;
  };

  // Translation helper
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

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
              <Link href={localePath('/leagues')} className="text-emerald-400 text-sm font-medium">{t('leaguesNav')}</Link>
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
                      {locales.map((loc) => {
                        const langInfo = LANGUAGES.find(l => l.code === localeToTranslationCode[loc]) || LANGUAGES[0];
                        return (
                          <Link
                            key={loc}
                            href={getLocaleUrl(loc)}
                            onClick={() => setLangDropdownOpen(false)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${
                              locale === loc ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'
                            }`}
                          >
                            <FlagIcon code={langInfo.code} size={20} />
                            <span className="font-medium">{localeNames[loc]}</span>
                          </Link>
                        );
                      })}
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
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
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
                { href: localePath('/leagues'), label: t('leaguesNav'), active: true },
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
              {!user && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <Link href={localePath('/login')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all">
                    {t('login')}
                  </Link>
                  <Link href={localePath('/get-started')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold hover:shadow-lg transition-all">
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

          {/* League Cards - SSR content visible to crawlers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leagues.map((league) => (
              <Link
                key={league.name}
                href={localePath(`/leagues/${league.slug}`)}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center p-2">
                    <img src={league.logo} alt={getLocalizedLeagueName(league.slug, locale).name} className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{getLocalizedLeagueName(league.slug, locale).name}</h3>
                    <p className="text-sm text-emerald-400">{getLocalizedLeagueName(league.slug, locale).country}</p>
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
                            alt={getLocalizedTopTeamName(leagueStats[league.dbName], locale)}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className="text-xs text-emerald-400 font-medium">
                          {t('leading')}: {getLocalizedTopTeamName(leagueStats[league.dbName], locale)}
                        </span>
                      </div>
                    )}
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].teams} {t('teams')}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].totalGoals} {t('goals')}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].avgGoalsPerMatch.toFixed(1)} {t('avgMatch')}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].cleanSheets} {t('cleanSheets')}</span>
                      </div>
                    </div>
                    {/* Season Badge */}
                    {leagueStats[league.dbName].season && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500">{t('season')} {leagueStats[league.dbName].season}/{(leagueStats[league.dbName].season! + 1).toString().slice(-2)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-3 italic">No statistics available</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">{t('viewStandings')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">{t('teamStats')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">{t('formations')}</span>
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

<Footer localePath={localePath} t={t} />
    </div>
  );
}
