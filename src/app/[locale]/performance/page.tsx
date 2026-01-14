'use client';

import { useState, useEffect, useRef } from 'react';
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

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    performance: "AI Performance",
    performanceSubtitle: "Transparent AI betting results with verified track record. Is AI betting profitable? See our safest AI football tips performance.",
    totalProfit: "Total Profit",
    winRate: "Win Rate",
    totalBets: "Total Bets",
    totalMatches: "Total Matches",
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
    performanceSubtitle: "Rastrea la precisión de nuestras predicciones de IA en las principales ligas",
    totalProfit: "Ganancia Total",
    winRate: "Tasa de Acierto",
    totalBets: "Apuestas Totales",
    totalMatches: "Partidos Totales",
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
    performanceSubtitle: "Acompanhe a precisão das nossas previsões de IA nas principais ligas",
    totalProfit: "Lucro Total",
    winRate: "Taxa de Acerto",
    totalBets: "Apostas Totais",
    totalMatches: "Total de Partidas",
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
    performanceSubtitle: "Verfolgen Sie die Genauigkeit unserer KI-Vorhersagen in den großen Ligen",
    totalProfit: "Gesamtgewinn",
    winRate: "Gewinnrate",
    totalBets: "Gesamtwetten",
    totalMatches: "Gesamtspiele",
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
    performance: "AI Performance",
    performanceSubtitle: "Suivez la précision de nos prédictions IA dans les grandes ligues",
    totalProfit: "Profit Total",
    winRate: "Taux de Réussite",
    totalBets: "Paris Totaux",
    totalMatches: "Matchs Totaux",
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
    performance: "AI パフォーマンス",
    performanceSubtitle: "主要リーグでのAI予測精度を追跡",
    totalProfit: "総利益",
    winRate: "勝率",
    totalBets: "総ベット数",
    totalMatches: "総試合数",
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
    performanceSubtitle: "주요 리그에서 AI 예측 정확도 추적",
    totalProfit: "총 수익",
    winRate: "승률",
    totalBets: "총 베팅",
    totalMatches: "총 경기",
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
    performance: "AI 表现",
    performanceSubtitle: "追踪我们AI在主要联赛中的预测准确率",
    totalProfit: "总盈利",
    winRate: "胜率",
    totalBets: "总投注",
    totalMatches: "总比赛",
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
    performance: "AI 表現",
    performanceSubtitle: "追蹤我們AI在主要聯賽中的預測準確率",
    totalProfit: "總盈利",
    winRate: "勝率",
    totalBets: "總投注",
    totalMatches: "總比賽",
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
    performanceSubtitle: "Hasil taruhan AI transparan dengan rekam jejak terverifikasi. Apakah taruhan AI menguntungkan? Lihat performa tips sepak bola AI teraman kami.",
    totalProfit: "Total Keuntungan",
    winRate: "Tingkat Kemenangan",
    totalBets: "Total Taruhan",
    totalMatches: "Total Pertandingan",
    roi: "ROI",
    profitByMarket: "Keuntungan per Pasar",
    moneyline: "1x2",
    handicap: "HDP",
    overUnder: "O/U",
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
  const params = useParams();
  const urlLocale = (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';

  // Helper function to create locale-aware paths
  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  // Helper function to get locale URL for language dropdown
  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/performance';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

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
  const BET_STYLES = ['Aggressive', 'Conservative', 'Balanced', 'Value Hunter', 'Safe Play'];

  // Chart/Stats Bet Style filter
  const [chartBetStyle, setChartBetStyle] = useState<string>('all');
  const [allBetRecords, setAllBetRecords] = useState<any[]>([]);


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
  const getBetTypeFromSelection = (selection: string | null): 'moneyline' | 'handicap' | 'ou' => {
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
  const filteredChartStats = (() => {
    const filtered = chartBetStyle === 'all'
      ? allBetRecords
      : allBetRecords.filter(r => r.bet_style?.toLowerCase() === chartBetStyle.toLowerCase());

    let profitMoneyline = 0;
    let profitHandicap = 0;
    let profitOU = 0;
    let totalProfit = 0;
    let totalInvested = 0;

    filtered.forEach(r => {
      const profit = r.profit || 0;
      const invested = r.stake_money || 0;
      totalProfit += profit;
      totalInvested += invested;

      const betType = getBetTypeFromSelection(r.selection);
      if (betType === 'moneyline') profitMoneyline += profit;
      else if (betType === 'handicap') profitHandicap += profit;
      else profitOU += profit;
    });

    const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    // Calculate daily cumulative data
    const sortedRecords = [...filtered].sort((a, b) =>
      new Date(a.bet_time).getTime() - new Date(b.bet_time).getTime()
    );

    let cumulative = 0;
    let cumulativeML = 0;
    let cumulativeHDP = 0;
    let cumulativeOU = 0;

    const dailyData = sortedRecords.map(r => {
      const profit = r.profit || 0;
      const betType = getBetTypeFromSelection(r.selection);
      cumulative += profit;
      if (betType === 'moneyline') cumulativeML += profit;
      else if (betType === 'handicap') cumulativeHDP += profit;
      else cumulativeOU += profit;

      return {
        date: r.bet_time?.split('T')[0] || '',
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
      totalBets: filtered.length,
    };
  })();

  // Compute per-match profits filtered by chartBetStyle (for table)
  const matchProfitsByStyle = (() => {
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

    // Group by fixture_id and calculate profits
    filtered.forEach(r => {
      const fixtureId = String(r.fixture_id);
      const profit = r.profit || 0;
      const invested = r.stake_money || 0;
      const betType = getBetTypeFromSelection(r.selection);

      if (!profitMap.has(fixtureId)) {
        profitMap.set(fixtureId, {
          profit_moneyline: 0,
          profit_handicap: 0,
          profit_ou: 0,
          total_profit: 0,
          total_invested: 0,
        });
      }

      const current = profitMap.get(fixtureId)!;
      current.total_profit += profit;
      current.total_invested += invested;

      if (betType === 'moneyline') current.profit_moneyline += profit;
      else if (betType === 'handicap') current.profit_handicap += profit;
      else current.profit_ou += profit;
    });

    return profitMap;
  })();

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


  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      // Fetch finished matches from prematches table (increase limit from default 1000)
      const { data: matchesData, error: matchesError } = await supabase
        .from('prematches')
        .select('fixture_id, league_name, league_logo, home_name, home_logo, away_name, away_logo, goals_home, goals_away, start_date_msia')
        .eq('status_short', 'FT')
        .order('start_date_msia', { ascending: false })
        .limit(10000);

      if (matchesError) throw matchesError;

      // Fetch all profit_summary data with individual bet details (increase limit from default 1000)
      const { data: profitData, error: profitError } = await supabase
        .from('profit_summary')
        .select('fixture_id, total_profit, total_invested, roi_percentage, total_bets, profit_moneyline, profit_handicap, profit_ou, bet_time, bet_style, profit, selection, stake_money, clock, line, odds, home_score, away_score, status')
        .order('bet_time', { ascending: true })
        .limit(50000);

      if (profitError) throw profitError;

      // Store all individual bet records for filtering
      setAllBetRecords(profitData || []);

      // Create a map of profit data by fixture_id (aggregate individual bets per fixture)
      const profitMap = new Map<string, {
        total_profit: number;
        total_invested: number;
        total_bets: number;
        profit_moneyline: number;
        profit_handicap: number;
        profit_ou: number;
        bet_time: string;
      }>();

      // Helper function for bet type detection
      const getBetTypeLocal = (selection: string | null): 'moneyline' | 'handicap' | 'ou' => {
        if (!selection) return 'ou';
        const sel = selection.toLowerCase();
        if (sel.includes('hdp') || sel.includes('handicap')) return 'handicap';
        if (sel.includes('over') || sel.includes('under')) return 'ou';
        if (/^(home|away)\s*[+-]?\d/.test(sel)) return 'handicap';
        if (sel === 'home' || sel === 'draw' || sel === 'away') return 'moneyline';
        return 'ou';
      };

      profitData?.forEach((p: any) => {
        const key = String(p.fixture_id);
        const profit = p.profit || 0;
        const invested = p.stake_money || 0;
        const betType = getBetTypeLocal(p.selection);

        if (!profitMap.has(key)) {
          profitMap.set(key, {
            total_profit: 0,
            total_invested: 0,
            total_bets: 0,
            profit_moneyline: 0,
            profit_handicap: 0,
            profit_ou: 0,
            bet_time: p.bet_time,
          });
        }

        const current = profitMap.get(key)!;
        current.total_profit += profit;
        current.total_invested += invested;
        current.total_bets += 1;
        if (betType === 'moneyline') current.profit_moneyline += profit;
        else if (betType === 'handicap') current.profit_handicap += profit;
        else current.profit_ou += profit;
      });

      // Combine match data with profit data
      const matchesFromPrematches: MatchSummary[] = matchesData
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

      // Also include matches from profit_summary that don't exist in prematches
      const prematchFixtureIds = new Set(matchesData?.map((m: any) => String(m.fixture_id)) || []);

      // Get unique fixture_ids from profit_summary that are NOT in prematches
      const profitOnlyFixtures = new Map<string, { league_name: string; home_score: number; away_score: number; bet_time: string }>();
      profitData?.forEach((p: any) => {
        const fixtureId = String(p.fixture_id);
        if (!prematchFixtureIds.has(fixtureId) && !profitOnlyFixtures.has(fixtureId)) {
          profitOnlyFixtures.set(fixtureId, {
            league_name: p.league_name || 'Unknown',
            home_score: p.home_score || 0,
            away_score: p.away_score || 0,
            bet_time: p.bet_time,
          });
        }
      });

      // Create match entries for profit-only fixtures
      const matchesFromProfitOnly: MatchSummary[] = [];
      profitOnlyFixtures.forEach((matchInfo, fixtureId) => {
        if (profitMap.has(fixtureId)) {
          const profit = profitMap.get(fixtureId)!;
          const roi = profit.total_invested > 0 ? (profit.total_profit / profit.total_invested) * 100 : 0;
          matchesFromProfitOnly.push({
            fixture_id: fixtureId,
            league_name: matchInfo.league_name,
            league_logo: '',
            home_name: 'Home Team',
            home_logo: '',
            away_name: 'Away Team',
            away_logo: '',
            home_score: matchInfo.home_score,
            away_score: matchInfo.away_score,
            total_profit: profit.total_profit,
            total_invested: profit.total_invested,
            roi_percentage: roi,
            total_bets: profit.total_bets,
            profit_moneyline: profit.profit_moneyline,
            profit_handicap: profit.profit_handicap,
            profit_ou: profit.profit_ou,
            match_date: matchInfo.bet_time,
          });
        }
      });

      // Combine both sources
      const combinedMatches = [...matchesFromPrematches, ...matchesFromProfitOnly];

      setMatches(combinedMatches);

      // Get unique leagues - start with top 5 leagues, then add any others from data
      const topLeagueNames = TOP_LEAGUES.map(l => l.name);
      const otherLeagues = [...new Set(combinedMatches.map(m => m.league_name))]
        .filter(l => !topLeagueNames.includes(l));
      setAvailableLeagues([...topLeagueNames, ...otherLeagues]);

      // Calculate overall stats from individual bet records (more accurate)
      let totalProfit = 0;
      let totalBets = profitData?.length || 0;
      let totalInvested = 0;
      let profitMoneyline = 0;
      let profitHandicap = 0;
      let profitOU = 0;

      // Helper to derive bet type from selection
      const deriveBetType = (selection: string | null): 'moneyline' | 'handicap' | 'ou' => {
        if (!selection) return 'ou';
        const sel = selection.toLowerCase();
        if (sel.includes('hdp') || sel.includes('handicap')) return 'handicap';
        if (sel.includes('over') || sel.includes('under')) return 'ou';
        if (/^(home|away)\s*[+-]?\d/.test(sel)) return 'handicap';
        if (sel === 'home' || sel === 'draw' || sel === 'away') return 'moneyline';
        return 'ou';
      };

      profitData?.forEach((p: any) => {
        const profit = p.profit || 0;
        const invested = p.stake_money || 0;
        totalProfit += profit;
        totalInvested += invested;

        const betType = deriveBetType(p.selection);
        if (betType === 'moneyline') profitMoneyline += profit;
        else if (betType === 'handicap') profitHandicap += profit;
        else profitOU += profit;
      });

      // Win rate still based on matches (fixtures)
      const wins = combinedMatches.filter(m => m.total_profit > 0).length;
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


  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  const filteredMatches = (() => {
    let result = selectedLeague === 'all'
      ? matches
      : matches.filter(m => m.league_name === selectedLeague);

    // Also filter by bet style - only show matches that have at least one bet of the selected style
    if (chartBetStyle !== 'all') {
      result = result.filter(m => {
        const profits = matchProfitsByStyle.get(String(m.fixture_id));
        // Check if this match has any profits (bets) for the selected style
        return profits && (profits.total_profit !== 0 || profits.total_invested > 0);
      });
    }

    return result;
  })();

  // Pagination
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);
  const paginatedMatches = filteredMatches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when league or bet style filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLeague, chartBetStyle]);

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

  // Fetch profit summary for a match (use allBetRecords for consistency with table)
  const fetchProfitSummary = (fixtureId: string) => {
    setLoadingProfit(true);
    try {
      // Filter from allBetRecords to ensure consistency with table data
      const filteredData = allBetRecords
        .filter(r => String(r.fixture_id) === fixtureId)
        .sort((a, b) => new Date(b.bet_time).getTime() - new Date(a.bet_time).getTime());

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
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t('performance')}</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('performanceSubtitle')}</p>
          </div>

          {/* Trust Badges - Mobile: 2 per row, Desktop: all in one row */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-2">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs md:text-sm text-emerald-400 font-medium">AI Performance</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-xs md:text-sm text-cyan-400 font-medium whitespace-nowrap">Transparent AI</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs md:text-sm text-purple-400 font-medium whitespace-nowrap">Safest Tips</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs md:text-sm text-yellow-400 font-medium whitespace-nowrap">Most Accurate</span>
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
                  <p className="text-gray-400 text-sm mb-1">{t('totalMatches')}</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    <AnimatedCounter
                      target={matches.length}
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

              {/* Bet Style Filter for Charts */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-400 mr-2">Bet Style:</span>
                <button
                  onClick={() => setChartBetStyle('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    chartBetStyle === 'all'
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  All Styles
                </button>
                {BET_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setChartBetStyle(style)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      chartBetStyle === style
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/50'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
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

              {/* Profit by Market */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-4 md:p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">{t('profitByMarket')}</h2>
                {/* Mobile: Vertical layout */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400 text-sm">{t('moneyline')}</span>
                    <span className={`text-lg font-bold ${filteredChartStats.profitMoneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredChartStats.profitMoneyline >= 0 ? '+$' : '-$'}{Math.abs(filteredChartStats.profitMoneyline).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
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
                  <div className="text-center p-4 bg-white/5 rounded-lg">
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
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#4b5563', fontSize: 11 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                          content={({ active, payload, label }: any) => {
                            if (active && payload && payload.length) {
                              const total = (payload[0]?.value || 0) + (payload[1]?.value || 0) + (payload[2]?.value || 0);
                              return (
                                <div className="bg-gray-950/95 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl min-w-[180px]">
                                  <p className="text-gray-500 text-xs mb-2 border-b border-white/5 pb-2">
                                    {new Date(label).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
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

              {/* Past Matches - Table Style */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 overflow-hidden">
                {/* Desktop Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-white/5 border-b border-white/5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="col-span-4">{t('pastMatches')}</div>
                  <div className="col-span-2 text-center">Score</div>
                  <div className="col-span-1 text-right">{t('moneyline')}</div>
                  <div className="col-span-1 text-right">{t('handicap')}</div>
                  <div className="col-span-1 text-right">{t('overUnder')}</div>
                  <div className="col-span-1 text-right">ROI</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden px-4 py-3 bg-white/5 border-b border-white/5">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t('pastMatches')}</h3>
                </div>

                {filteredMatches.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">{t('noMatches')}</div>
                ) : (
                  <div className="divide-y divide-white/5">
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
                      <div key={match.fixture_id}>
                        {/* Mobile Card Layout */}
                        <div
                          className={`md:hidden relative p-4 transition-all ${
                            index % 2 === 0 ? 'bg-white/[0.02]' : ''
                          } ${isHotMatch ? 'bg-emerald-500/5' : ''}`}
                          onClick={() => openSignalHistory(match)}
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
                                {match.league_name.length > 15 ? match.league_name.substring(0, 15) + '...' : match.league_name}
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

                          {/* Row 2: Teams & Score */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1 min-w-0 mr-3">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded-full bg-white/10 p-0.5 flex items-center justify-center flex-shrink-0">
                                  {match.home_logo ? (
                                    <img src={match.home_logo} alt="" className="w-full h-full object-contain" />
                                  ) : (
                                    <span className="text-[8px] font-bold text-white">{(match.home_name || 'H').substring(0, 2)}</span>
                                  )}
                                </div>
                                <span className="text-sm text-white font-medium truncate">{match.home_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/10 p-0.5 flex items-center justify-center flex-shrink-0">
                                  {match.away_logo ? (
                                    <img src={match.away_logo} alt="" className="w-full h-full object-contain" />
                                  ) : (
                                    <span className="text-[8px] font-bold text-white">{(match.away_name || 'A').substring(0, 2)}</span>
                                  )}
                                </div>
                                <span className="text-sm text-white font-medium truncate">{match.away_name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-lg font-bold text-white">{match.home_score}</span>
                              <span className="text-lg font-bold text-white">{match.away_score}</span>
                            </div>
                          </div>

                          {/* Row 3: Profit breakdown */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3 text-xs">
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
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold ${
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
                            <button
                              onClick={() => openProfitDetails(match)}
                              className="p-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                              title="View Profit Details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </button>
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
                  <h3 className="text-xl font-bold text-white">Profit Summary</h3>
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
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Profit</div>
                    <div className={`text-2xl font-bold ${filteredTotalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredTotalProfit >= 0 ? '+$' : '-$'}{Math.abs(filteredTotalProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">ROI</div>
                    <div className={`text-2xl font-bold ${filteredROI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {filteredROI >= 0 ? '+' : ''}{filteredROI.toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Invested</div>
                    <div className="text-xl font-bold text-white">
                      ${filteredTotalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Bets</div>
                    <div className="text-xl font-bold text-white">{filteredTotalBets}</div>
                  </div>
                </div>

                {/* Market Breakdown */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Profit by Market</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                        <span className="text-gray-300 text-sm">1X2 Moneyline</span>
                      </div>
                      <span className={`font-bold ${filteredProfitMoneyline >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {filteredProfitMoneyline >= 0 ? '+$' : '-$'}{Math.abs(filteredProfitMoneyline).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-gray-300 text-sm">Asian Handicap</span>
                      </div>
                      <span className={`font-bold ${filteredProfitHandicap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {filteredProfitHandicap >= 0 ? '+$' : '-$'}{Math.abs(filteredProfitHandicap).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-gray-300 text-sm">Over/Under</span>
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
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Bet Details ({filteredRecords.length})</div>
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
                            {style === 'Safe Play' && '✅ '}
                            {style}
                          </button>
                        ))}
                      </div>
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
                                <td className="py-2 px-2 text-center text-gray-300 text-xs">{record.stake_units ?? '-'}</td>
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

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2">
              <Link href={localePath('/')} className="flex items-center gap-3 mb-6">
                <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
                <span className="text-xl font-bold">OddsFlow</span>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">{t('footerDesc')}</p>
              <div className="flex items-center gap-4">
                {/* Facebook */}
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </Link>
                {/* Instagram */}
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
                {/* Telegram */}
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('product')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/predictions')} className="hover:text-emerald-400 transition-colors">{t('predictions')}</Link></li>
                <li><Link href={localePath('/leagues')} className="hover:text-emerald-400 transition-colors">{t('leagues')}</Link></li>
                <li><Link href={localePath('/performance')} className="hover:text-emerald-400 transition-colors">{t('performance')}</Link></li>
                <li><Link href={localePath('/solution')} className="hover:text-emerald-400 transition-colors">{t('solution')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('popularLeagues')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/leagues/premier-league')} className="hover:text-emerald-400 transition-colors">Premier League</Link></li>
                <li><Link href={localePath('/leagues/la-liga')} className="hover:text-emerald-400 transition-colors">La Liga</Link></li>
                <li><Link href={localePath('/leagues/serie-a')} className="hover:text-emerald-400 transition-colors">Serie A</Link></li>
                <li><Link href={localePath('/leagues/bundesliga')} className="hover:text-emerald-400 transition-colors">Bundesliga</Link></li>
                <li><Link href={localePath('/leagues/ligue-1')} className="hover:text-emerald-400 transition-colors">Ligue 1</Link></li>
                <li><Link href={localePath('/leagues/champions-league')} className="hover:text-emerald-400 transition-colors">Champions League</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('communityFooter')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/community')} className="hover:text-emerald-400 transition-colors">{t('community')}</Link></li>
                <li><Link href={localePath('/community/global-chat')} className="hover:text-emerald-400 transition-colors">{t('globalChat')}</Link></li>
                <li><Link href={localePath('/community/user-predictions')} className="hover:text-emerald-400 transition-colors">{t('userPredictions')}</Link></li>
              </ul>
            </div>

            <div className="relative z-10">
              <h4 className="font-semibold mb-5 text-white">{t('company')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/about')} className="hover:text-emerald-400 transition-colors inline-block">{t('aboutUs')}</Link></li>
                <li><Link href={localePath('/contact')} className="hover:text-emerald-400 transition-colors inline-block">{t('contact')}</Link></li>
                <li><Link href={localePath('/blog')} className="hover:text-emerald-400 transition-colors inline-block">{t('blog')}</Link></li>
              </ul>
            </div>

            <div className="relative z-10">
              <h4 className="font-semibold mb-5 text-white">{t('legal')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/terms-of-service')} className="hover:text-emerald-400 transition-colors inline-block">{t('termsOfService')}</Link></li>
                <li><Link href={localePath('/privacy-policy')} className="hover:text-emerald-400 transition-colors inline-block">{t('privacyPolicy')}</Link></li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-gray-500 text-xs leading-relaxed">{t('disclaimer')}</p>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <p className="text-gray-500 text-sm">&copy; 2026 OddsFlow. {t('allRightsReserved')}</p>
            <p className="text-gray-600 text-xs">{t('gamblingWarning')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
