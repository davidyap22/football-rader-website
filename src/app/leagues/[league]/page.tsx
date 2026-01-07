'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, TeamStatistics, getTeamStatisticsByLeague, PlayerStats, getPlayerStatsByTeam, Coach, getCoachesByTeamIds } from '@/lib/supabase';
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
  { code: 'ID', name: 'Bahasa Indonesia', flag: '🇮🇩' },
];

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", solution: "Solution", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    backToLeagues: "Back to Leagues", viewAllPlayers: "View All Players", season: "Season",
    teams: "Teams", totalGoals: "Total Goals", avgGoals: "Avg Goals/Match", cleanSheets: "Clean Sheets",
    noStats: "No statistics available for this league", team: "Team", profile: "Profile",
    formation: "Formation", allFormations: "All Formations Used", clickToView: "(click to view)",
    failedToScore: "Failed to Score", goalsAvg: "Goals/Match Avg", cards: "Cards (Y/R)",
    squadPlayers: "Squad Players", noPlayerData: "No player data available", viewProfile: "View Profile",
    noFormation: "No formation data available", championsLeague: "Champions League / Promotion",
    relegation: "Relegation", legend: "P=Played, W=Won, D=Draw, L=Lost, GF=Goals For, GA=Goals Against, GD=Goal Diff",
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
    leagueNotFound: "League Not Found",
    player: "Player", pos: "Pos", age: "Age", apps: "Apps", mins: "Mins", goals: "Goals",
    assists: "Assists", rating: "Rating", coach: "Coach",
    popularLeagues: "Popular Leagues",
    aiPredictionsFooter: "AI Predictions",
    aiFootballPredictions: "AI Football Predictions",
    onextwoPredictions: "1x2 Predictions",
    overUnderTips: "Over/Under Tips",
    handicapBetting: "Handicap Betting",
    aiBettingPerformance: "AI Betting Performance",
    footballTipsToday: "Football Tips Today",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
    todayMatches: "Today Matches",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", solution: "Solución", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Comenzar",
    backToLeagues: "Volver a Ligas", viewAllPlayers: "Ver Todos los Jugadores", season: "Temporada",
    teams: "Equipos", totalGoals: "Goles Totales", avgGoals: "Prom. Goles/Partido", cleanSheets: "Porterías Invictas",
    noStats: "No hay estadísticas disponibles para esta liga", team: "Equipo", profile: "Perfil",
    formation: "Formación", allFormations: "Todas las Formaciones", clickToView: "(clic para ver)",
    failedToScore: "Sin Marcar", goalsAvg: "Prom. Goles/Partido", cards: "Tarjetas (A/R)",
    squadPlayers: "Plantilla", noPlayerData: "No hay datos de jugadores", viewProfile: "Ver Perfil",
    noFormation: "No hay datos de formación", championsLeague: "Champions League / Promoción",
    relegation: "Descenso", legend: "PJ=Jugados, G=Ganados, E=Empates, P=Perdidos, GF=Goles Favor, GC=Goles Contra, DG=Dif. Goles",
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
    leagueNotFound: "Liga No Encontrada",
    player: "Jugador", pos: "Pos", age: "Edad", apps: "Part.", mins: "Min", goals: "Goles",
    assists: "Asist.", rating: "Calif.", coach: "Entrenador",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Predicciones IA",
    aiFootballPredictions: "Predicciones de Futbol IA",
    onextwoPredictions: "Predicciones 1x2",
    overUnderTips: "Consejos Over/Under",
    handicapBetting: "Apuestas Handicap",
    aiBettingPerformance: "Rendimiento de Apuestas IA",
    footballTipsToday: "Tips de Futbol Hoy",
    communityFooter: "Comunidad",
    globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios",
    todayMatches: "Partidos de Hoy",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No se garantizan ganancias. Por favor, apueste de manera responsable.",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Notícias", solution: "Solução", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    backToLeagues: "Voltar às Ligas", viewAllPlayers: "Ver Todos os Jogadores", season: "Temporada",
    teams: "Times", totalGoals: "Gols Totais", avgGoals: "Média Gols/Jogo", cleanSheets: "Jogos Sem Sofrer Gol",
    noStats: "Não há estatísticas disponíveis para esta liga", team: "Time", profile: "Perfil",
    formation: "Formação", allFormations: "Todas as Formações", clickToView: "(clique para ver)",
    failedToScore: "Sem Marcar", goalsAvg: "Média Gols/Jogo", cards: "Cartões (A/V)",
    squadPlayers: "Elenco", noPlayerData: "Sem dados de jogadores", viewProfile: "Ver Perfil",
    noFormation: "Sem dados de formação", championsLeague: "Champions League / Promoção",
    relegation: "Rebaixamento", legend: "J=Jogos, V=Vitórias, E=Empates, D=Derrotas, GP=Gols Pró, GC=Gols Contra, SG=Saldo Gols",
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
    leagueNotFound: "Liga Não Encontrada",
    player: "Jogador", pos: "Pos", age: "Idade", apps: "Part.", mins: "Min", goals: "Gols",
    assists: "Assis.", rating: "Nota", coach: "Treinador",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Previsões IA",
    aiFootballPredictions: "Previsões de Futebol IA",
    onextwoPredictions: "Previsões 1x2",
    overUnderTips: "Dicas Over/Under",
    handicapBetting: "Apostas Handicap",
    aiBettingPerformance: "Desempenho de Apostas IA",
    footballTipsToday: "Dicas de Futebol Hoje",
    communityFooter: "Comunidade",
    globalChat: "Chat Global",
    userPredictions: "Previsões de Usuários",
    todayMatches: "Jogos de Hoje",
    disclaimer: "Aviso: OddsFlow fornece previsões baseadas em IA apenas para fins informativos e de entretenimento. Não há garantia de lucros. Por favor, aposte com responsabilidade.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", solution: "Lösung", pricing: "Preise", login: "Anmelden", getStarted: "Starten",
    backToLeagues: "Zurück zu Ligen", viewAllPlayers: "Alle Spieler anzeigen", season: "Saison",
    teams: "Teams", totalGoals: "Gesamttore", avgGoals: "Ø Tore/Spiel", cleanSheets: "Weiße Westen",
    noStats: "Keine Statistiken für diese Liga verfügbar", team: "Team", profile: "Profil",
    formation: "Formation", allFormations: "Alle Formationen", clickToView: "(klicken zum Anzeigen)",
    failedToScore: "Ohne Treffer", goalsAvg: "Ø Tore/Spiel", cards: "Karten (G/R)",
    squadPlayers: "Kader", noPlayerData: "Keine Spielerdaten verfügbar", viewProfile: "Profil anzeigen",
    noFormation: "Keine Formationsdaten", championsLeague: "Champions League / Aufstieg",
    relegation: "Abstieg", legend: "Sp=Spiele, S=Siege, U=Unentschieden, N=Niederlagen, T=Tore, GT=Gegentore, TD=Tordifferenz",
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
    leagueNotFound: "Liga Nicht Gefunden",
    player: "Spieler", pos: "Pos", age: "Alter", apps: "Ein.", mins: "Min", goals: "Tore",
    assists: "Vorl.", rating: "Note", coach: "Trainer",
    popularLeagues: "Beliebte Ligen",
    aiPredictionsFooter: "KI-Vorhersagen",
    aiFootballPredictions: "KI-Fussballvorhersagen",
    onextwoPredictions: "1x2 Vorhersagen",
    overUnderTips: "Über/Unter Tipps",
    handicapBetting: "Handicap-Wetten",
    aiBettingPerformance: "KI-Wettleistung",
    footballTipsToday: "Fussballtipps Heute",
    communityFooter: "Community",
    globalChat: "Globaler Chat",
    userPredictions: "Benutzer-Vorhersagen",
    todayMatches: "Heutige Spiele",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestützte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Es werden keine Gewinne garantiert. Bitte wetten Sie verantwortungsvoll.",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communauté", news: "Actualités", solution: "Solution", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    backToLeagues: "Retour aux Ligues", viewAllPlayers: "Voir Tous les Joueurs", season: "Saison",
    teams: "Équipes", totalGoals: "Buts Totaux", avgGoals: "Moy. Buts/Match", cleanSheets: "Clean Sheets",
    noStats: "Aucune statistique disponible pour cette ligue", team: "Équipe", profile: "Profil",
    formation: "Formation", allFormations: "Toutes les Formations", clickToView: "(cliquez pour voir)",
    failedToScore: "Sans Marquer", goalsAvg: "Moy. Buts/Match", cards: "Cartons (J/R)",
    squadPlayers: "Effectif", noPlayerData: "Aucune donnée de joueur", viewProfile: "Voir Profil",
    noFormation: "Aucune donnée de formation", championsLeague: "Ligue des Champions / Promotion",
    relegation: "Relégation", legend: "MJ=Matchs, V=Victoires, N=Nuls, D=Défaites, BP=Buts Pour, BC=Buts Contre, DB=Diff. Buts",
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
    leagueNotFound: "Ligue Non Trouvée",
    player: "Joueur", pos: "Pos", age: "Âge", apps: "App.", mins: "Min", goals: "Buts",
    assists: "Pass.", rating: "Note", coach: "Entraîneur",
    popularLeagues: "Ligues Populaires",
    aiPredictionsFooter: "Prédictions IA",
    aiFootballPredictions: "Prédictions Football IA",
    onextwoPredictions: "Prédictions 1x2",
    overUnderTips: "Conseils Over/Under",
    handicapBetting: "Paris Handicap",
    aiBettingPerformance: "Performance Paris IA",
    footballTipsToday: "Pronostics Foot Aujourd'hui",
    communityFooter: "Communauté",
    globalChat: "Chat Global",
    userPredictions: "Prédictions Utilisateurs",
    todayMatches: "Matchs du Jour",
    disclaimer: "Avertissement : OddsFlow fournit des prédictions basées sur l'IA à des fins d'information et de divertissement uniquement. Aucun profit n'est garanti. Veuillez parier de manière responsable.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "AIパフォーマンス",
    community: "コミュニティ", news: "ニュース", solution: "ソリューション", pricing: "料金", login: "ログイン", getStarted: "始める",
    backToLeagues: "リーグ一覧へ戻る", viewAllPlayers: "全選手を見る", season: "シーズン",
    teams: "チーム数", totalGoals: "総得点", avgGoals: "平均得点/試合", cleanSheets: "クリーンシート",
    noStats: "このリーグの統計はありません", team: "チーム", profile: "プロフィール",
    formation: "フォーメーション", allFormations: "全フォーメーション", clickToView: "(クリックで表示)",
    failedToScore: "無得点", goalsAvg: "平均得点/試合", cards: "カード (黄/赤)",
    squadPlayers: "選手一覧", noPlayerData: "選手データなし", viewProfile: "詳細を見る",
    noFormation: "フォーメーションデータなし", championsLeague: "チャンピオンズリーグ / 昇格",
    relegation: "降格", legend: "試=試合, 勝=勝利, 分=引分, 負=敗北, 得=得点, 失=失点, 差=得失差",
    footer: "18歳以上 | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2026 OddsFlow. 全著作権所有。",
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
    leagueNotFound: "リーグが見つかりません",
    player: "選手", pos: "Pos", age: "年齢", apps: "出場", mins: "分", goals: "得点",
    assists: "アシスト", rating: "評価", coach: "監督",
    popularLeagues: "人気リーグ",
    aiPredictionsFooter: "AI予測",
    aiFootballPredictions: "AIサッカー予測",
    onextwoPredictions: "1x2予測",
    overUnderTips: "オーバー/アンダー予想",
    handicapBetting: "ハンディキャップベット",
    aiBettingPerformance: "AIベッティング実績",
    footballTipsToday: "今日のサッカー予想",
    communityFooter: "コミュニティ",
    globalChat: "グローバルチャット",
    userPredictions: "ユーザー予測",
    todayMatches: "今日の試合",
    disclaimer: "免責事項：OddsFlowはAI駆動の予測を情報および娯楽目的のみで提供しています。利益を保証するものではありません。責任を持ってお楽しみください。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성능",
    community: "커뮤니티", news: "뉴스", solution: "솔루션", pricing: "가격", login: "로그인", getStarted: "시작하기",
    backToLeagues: "리그 목록으로", viewAllPlayers: "전체 선수 보기", season: "시즌",
    teams: "팀", totalGoals: "총 골", avgGoals: "경기당 평균 골", cleanSheets: "클린시트",
    noStats: "이 리그에 대한 통계가 없습니다", team: "팀", profile: "프로필",
    formation: "포메이션", allFormations: "모든 포메이션", clickToView: "(클릭하여 보기)",
    failedToScore: "무득점", goalsAvg: "경기당 평균 골", cards: "카드 (옐로/레드)",
    squadPlayers: "선수단", noPlayerData: "선수 데이터 없음", viewProfile: "프로필 보기",
    noFormation: "포메이션 데이터 없음", championsLeague: "챔피언스리그 / 승격",
    relegation: "강등", legend: "경=경기, 승=승리, 무=무승부, 패=패배, 득=득점, 실=실점, 차=골득실",
    footer: "18세 이상 | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2026 OddsFlow. 모든 권리 보유.",
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
    leagueNotFound: "리그를 찾을 수 없습니다",
    player: "선수", pos: "포지션", age: "나이", apps: "출전", mins: "분", goals: "골",
    assists: "도움", rating: "평점", coach: "감독",
    popularLeagues: "인기 리그",
    aiPredictionsFooter: "AI 예측",
    aiFootballPredictions: "AI 축구 예측",
    onextwoPredictions: "1x2 예측",
    overUnderTips: "오버/언더 팁",
    handicapBetting: "핸디캡 베팅",
    aiBettingPerformance: "AI 베팅 성과",
    footballTipsToday: "오늘의 축구 팁",
    communityFooter: "커뮤니티",
    globalChat: "글로벌 채팅",
    userPredictions: "사용자 예측",
    todayMatches: "오늘의 경기",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다. 수익을 보장하지 않습니다. 책임감 있게 베팅하세요.",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", solution: "解决方案", pricing: "价格", login: "登录", getStarted: "开始",
    backToLeagues: "返回联赛", viewAllPlayers: "查看所有球员", season: "赛季",
    teams: "球队", totalGoals: "总进球", avgGoals: "场均进球", cleanSheets: "零封场次",
    noStats: "该联赛暂无统计数据", team: "球队", profile: "详情",
    formation: "阵型", allFormations: "所有阵型", clickToView: "(点击查看)",
    failedToScore: "未进球场次", goalsAvg: "场均进球", cards: "黄牌/红牌",
    squadPlayers: "球员名单", noPlayerData: "暂无球员数据", viewProfile: "查看详情",
    noFormation: "暂无阵型数据", championsLeague: "欧冠/升级区",
    relegation: "降级区", legend: "场=比赛, 胜=胜利, 平=平局, 负=失败, 进=进球, 失=失球, 净=净胜球",
    footer: "18+ | 博彩有风险，请理性投注。",
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
    leagueNotFound: "未找到联赛",
    player: "球员", pos: "位置", age: "年龄", apps: "出场", mins: "分钟", goals: "进球",
    assists: "助攻", rating: "评分", coach: "主教练",
    popularLeagues: "热门联赛",
    aiPredictionsFooter: "AI 预测",
    aiFootballPredictions: "AI 足球预测",
    onextwoPredictions: "1x2 预测",
    overUnderTips: "大小球建议",
    handicapBetting: "让球盘投注",
    aiBettingPerformance: "AI 投注表现",
    footballTipsToday: "今日足球贴士",
    communityFooter: "社区",
    globalChat: "全球聊天",
    userPredictions: "用户预测",
    todayMatches: "今日比赛",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社群", news: "新聞", solution: "解決方案", pricing: "價格", login: "登入", getStarted: "開始",
    backToLeagues: "返回聯賽", viewAllPlayers: "查看所有球員", season: "賽季",
    teams: "球隊", totalGoals: "總進球", avgGoals: "場均進球", cleanSheets: "零封場次",
    noStats: "該聯賽暫無統計數據", team: "球隊", profile: "詳情",
    formation: "陣型", allFormations: "所有陣型", clickToView: "(點擊查看)",
    failedToScore: "未進球場次", goalsAvg: "場均進球", cards: "黃牌/紅牌",
    squadPlayers: "球員名單", noPlayerData: "暫無球員數據", viewProfile: "查看詳情",
    noFormation: "暫無陣型數據", championsLeague: "歐冠/升級區",
    relegation: "降級區", legend: "場=比賽, 勝=勝利, 平=平局, 負=失敗, 進=進球, 失=失球, 淨=淨勝球",
    footer: "18+ | 博彩有風險，請理性投注。",
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
    leagueNotFound: "未找到聯賽",
    player: "球員", pos: "位置", age: "年齡", apps: "出場", mins: "分鐘", goals: "進球",
    assists: "助攻", rating: "評分", coach: "主教練",
    popularLeagues: "熱門聯賽",
    aiPredictionsFooter: "AI 預測",
    aiFootballPredictions: "AI 足球預測",
    onextwoPredictions: "1x2 預測",
    overUnderTips: "大小球建議",
    handicapBetting: "讓球盤投注",
    aiBettingPerformance: "AI 投注表現",
    footballTipsToday: "今日足球貼士",
    communityFooter: "社區",
    globalChat: "全球聊天",
    userPredictions: "用戶預測",
    todayMatches: "今日比賽",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", solution: "Solusi", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    backToLeagues: "Kembali ke Liga", viewAllPlayers: "Lihat Semua Pemain", season: "Musim",
    teams: "Tim", totalGoals: "Total Gol", avgGoals: "Rata-rata Gol/Pertandingan", cleanSheets: "Clean Sheet",
    noStats: "Tidak ada statistik untuk liga ini", team: "Tim", profile: "Profil",
    formation: "Formasi", allFormations: "Semua Formasi", clickToView: "(klik untuk melihat)",
    failedToScore: "Gagal Mencetak Gol", goalsAvg: "Rata-rata Gol/Pertandingan", cards: "Kartu (K/M)",
    squadPlayers: "Pemain Skuad", noPlayerData: "Tidak ada data pemain", viewProfile: "Lihat Profil",
    noFormation: "Tidak ada data formasi", championsLeague: "Liga Champions / Promosi",
    relegation: "Degradasi", legend: "M=Main, M=Menang, S=Seri, K=Kalah, GM=Gol Memasukkan, GK=Gol Kemasukan, SG=Selisih Gol",
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
    leagueNotFound: "Liga Tidak Ditemukan",
    player: "Pemain", pos: "Pos", age: "Usia", apps: "Tampil", mins: "Menit", goals: "Gol",
    assists: "Assist", rating: "Rating", coach: "Pelatih",
    popularLeagues: "Liga Populer",
    aiPredictionsFooter: "Prediksi AI",
    aiFootballPredictions: "Prediksi Sepak Bola AI",
    onextwoPredictions: "Prediksi 1x2",
    overUnderTips: "Tips Over/Under",
    handicapBetting: "Taruhan Handicap",
    aiBettingPerformance: "Performa Taruhan AI",
    footballTipsToday: "Tips Sepak Bola Hari Ini",
    communityFooter: "Komunitas",
    globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna",
    todayMatches: "Pertandingan Hari Ini",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial. Harap bertaruh dengan bijak.",
  },
};

// Extended team type with calculated fields
interface TeamWithStats extends TeamStatistics {
  points: number;
  goal_difference: number;
}

// League configuration
const LEAGUES_CONFIG: Record<string, { name: string; country: string; logo: string; dbName: string }> = {
  'premier-league': { name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', dbName: 'Premier League' },
  'bundesliga': { name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', dbName: 'Bundesliga' },
  'serie-a': { name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', dbName: 'Serie A' },
  'la-liga': { name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', dbName: 'La Liga' },
  'ligue-1': { name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', dbName: 'Ligue 1' },
  'champions-league': { name: 'Champions League', country: 'UEFA', logo: 'https://media.api-sports.io/football/leagues/2.png', dbName: 'UEFA Champions League' },
};

export default function LeagueDetailPage() {
  const params = useParams();
  const leagueSlug = params.league as string;
  const leagueConfig = LEAGUES_CONFIG[leagueSlug];

  const [mounted, setMounted] = useState(false);
  const [teamStats, setTeamStats] = useState<TeamWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
  const [selectedFormations, setSelectedFormations] = useState<Record<number, string>>({});
  const [playerStats, setPlayerStats] = useState<Record<number, PlayerStats[]>>({});
  const [loadingPlayers, setLoadingPlayers] = useState<number | null>(null);
  const [coaches, setCoaches] = useState<Record<number, Coach>>({});
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  // Translation helper
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  // Wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load language from localStorage
  useEffect(() => {
    if (!mounted) return;
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) {
      setSelectedLang(savedLang);
    }
  }, [mounted]);

  // Save language to localStorage when changed
  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('oddsflow_lang', langCode);
    setLangDropdownOpen(false);
  };

  // Check auth session
  useEffect(() => {
    if (!mounted) return;
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, [mounted]);

  // Fetch team statistics and coaches
  useEffect(() => {
    if (!mounted) return;

    async function fetchStats() {
      if (!leagueConfig) return;

      setLoading(true);
      const { data, error } = await getTeamStatisticsByLeague(leagueConfig.dbName);

      if (data && !error) {
        setTeamStats(data as TeamWithStats[]);

        // Fetch coaches for all teams
        const teamIds = data
          .map((team: TeamWithStats) => team.team_id)
          .filter((id): id is number => id !== null);

        if (teamIds.length > 0) {
          const { data: coachesData } = await getCoachesByTeamIds(teamIds);
          if (coachesData) {
            const coachesMap: Record<number, Coach> = {};
            coachesData.forEach((coach: Coach) => {
              if (coach.current_team_id) {
                coachesMap[coach.current_team_id] = coach;
              }
            });
            setCoaches(coachesMap);
          }
        }
      }
      setLoading(false);
    }

    fetchStats();
  }, [mounted, leagueConfig]);

  // Handle team expansion and fetch player stats
  const handleTeamClick = async (team: TeamWithStats) => {
    console.log('Team clicked:', team.team_name, 'team_id:', team.team_id);

    if (expandedTeamId === team.id) {
      setExpandedTeamId(null);
      return;
    }

    setExpandedTeamId(team.id);

    // Fetch player stats if not already loaded
    if (team.team_id && !playerStats[team.team_id]) {
      console.log('Fetching players for team_id:', team.team_id);
      setLoadingPlayers(team.team_id);
      const { data, error } = await getPlayerStatsByTeam(team.team_id);
      console.log('Player stats result:', { data, error, count: data?.length });
      if (data && !error) {
        setPlayerStats(prev => ({ ...prev, [team.team_id!]: data }));
      }
      setLoadingPlayers(null);
    } else {
      console.log('No team_id or already loaded:', { team_id: team.team_id, hasData: team.team_id ? !!playerStats[team.team_id] : false });
    }
  };

  // Render football pitch with formation
  const renderFormationPitch = (formation: string | null) => {
    if (!formation) return null;

    // Parse formation (e.g., "4-3-3" → [4, 3, 3])
    const lines = formation.split('-').map(n => parseInt(n)).filter(n => !isNaN(n));
    if (lines.length === 0) return null;

    // Calculate player positions
    const getPlayerPositions = () => {
      const positions: { x: number; y: number; isGoalkeeper?: boolean }[] = [];

      // Goalkeeper
      positions.push({ x: 50, y: 90, isGoalkeeper: true });

      // Field players - distribute across the pitch
      const totalLines = lines.length;
      lines.forEach((playersInLine, lineIndex) => {
        // Y position: from defense (80%) to attack (15%)
        const y = 80 - (lineIndex * (65 / totalLines));

        // X positions: evenly distribute players
        for (let i = 0; i < playersInLine; i++) {
          const x = ((i + 1) * 100) / (playersInLine + 1);
          positions.push({ x, y });
        }
      });

      return positions;
    };

    const positions = getPlayerPositions();

    return (
      <div className="relative w-full aspect-[3/4] max-w-[200px] bg-emerald-900/30 rounded-xl overflow-hidden border border-emerald-500/20">
        {/* Pitch markings */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="xMidYMid meet">
          {/* Pitch background */}
          <rect x="0" y="0" width="100" height="130" fill="transparent" />

          {/* Pitch outline */}
          <rect x="5" y="5" width="90" height="120" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

          {/* Center line */}
          <line x1="5" y1="65" x2="95" y2="65" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

          {/* Center circle */}
          <circle cx="50" cy="65" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <circle cx="50" cy="65" r="1" fill="rgba(255,255,255,0.3)" />

          {/* Penalty area - bottom */}
          <rect x="20" y="95" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <rect x="32" y="110" width="36" height="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <circle cx="50" cy="105" r="1" fill="rgba(255,255,255,0.3)" />

          {/* Penalty area - top */}
          <rect x="20" y="5" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <rect x="32" y="5" width="36" height="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <circle cx="50" cy="17" r="1" fill="rgba(255,255,255,0.3)" />

          {/* Players */}
          {positions.map((pos, idx) => (
            <g key={idx}>
              <circle
                cx={pos.x}
                cy={pos.y + 5}
                r={pos.isGoalkeeper ? 4 : 3.5}
                fill={pos.isGoalkeeper ? '#fbbf24' : '#10b981'}
                stroke="white"
                strokeWidth="0.8"
              />
            </g>
          ))}
        </svg>

        {/* Formation label */}
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-xs font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded">{formation}</span>
        </div>
      </div>
    );
  };

  // Render form badges (W/D/L)
  const renderForm = (form: string | null) => {
    if (!form) return null;
    return form.split('').slice(-5).map((result, index) => {
      let bgColor = 'bg-gray-600';
      if (result === 'W') bgColor = 'bg-emerald-500';
      else if (result === 'D') bgColor = 'bg-yellow-500';
      else if (result === 'L') bgColor = 'bg-red-500';
      return (
        <span key={index} className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-white ${bgColor}`}>
          {result}
        </span>
      );
    });
  };

  // 404 for unknown leagues
  if (!leagueConfig) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('leagueNotFound')}</h1>
          <Link href="/leagues" className="text-emerald-400 hover:underline">
            {t('backToLeagues')}
          </Link>
        </div>
      </div>
    );
  }

  // Show loading screen while waiting for client-side mount
  if (!mounted) {
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
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

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
              <Link href="/solution" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('solution')}</Link>
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
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                            selectedLang === lang.code
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                          {selectedLang === lang.code && (
                            <svg className="w-4 h-4 ml-auto text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {user ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer hidden sm:block">{t('getStarted')}</Link>
                </>
              )}

              {/* World Cup Button */}
              <Link
                href="/worldcup"
                className="relative hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all cursor-pointer group overflow-hidden hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-5 w-auto object-contain relative z-10" />
                <span className="text-black font-semibold text-sm relative z-10">FIFA 2026</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/leagues" className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToLeagues')}
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between gap-4 md:gap-6 mb-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center p-3">
                <img src={leagueConfig.logo} alt={leagueConfig.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{leagueConfig.name}</h1>
                <p className="text-emerald-400 text-lg">{leagueConfig.country} {teamStats.length > 0 ? `• ${teamStats[0]?.season || 2024} ${t('season')}` : ''}</p>
              </div>
            </div>
            <Link
              href={`/leagues/${leagueSlug}/player`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 font-medium hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all border border-emerald-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t('viewAllPlayers')}
            </Link>
          </div>

          {/* Stats Summary */}
          {!loading && teamStats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">{t('teams')}</p>
                <p className="text-2xl font-bold text-white">{teamStats.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">{t('totalGoals')}</p>
                <p className="text-2xl font-bold text-emerald-400">{teamStats.reduce((sum, t) => sum + (t.goals_for_total || 0), 0)}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">{t('avgGoals')}</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {(teamStats.reduce((sum, t) => sum + (t.goals_for_average || 0), 0) / teamStats.length).toFixed(2)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">{t('cleanSheets')}</p>
                <p className="text-2xl font-bold text-purple-400">{teamStats.reduce((sum, t) => sum + (t.clean_sheets || 0), 0)}</p>
              </div>
            </div>
          )}

          {/* Standings Table */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : teamStats.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">{t('noStats')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-900/95">
                    <tr className="text-xs text-gray-400 uppercase tracking-wider">
                      <th className="text-left py-4 px-4 font-semibold">#</th>
                      <th className="text-left py-4 px-4 font-semibold">{t('team')}</th>
                      <th className="text-center py-4 px-2 font-semibold">P</th>
                      <th className="text-center py-4 px-2 font-semibold">W</th>
                      <th className="text-center py-4 px-2 font-semibold">D</th>
                      <th className="text-center py-4 px-2 font-semibold">L</th>
                      <th className="text-center py-4 px-2 font-semibold">GF</th>
                      <th className="text-center py-4 px-2 font-semibold">GA</th>
                      <th className="text-center py-4 px-2 font-semibold">GD</th>
                      <th className="text-center py-4 px-2 font-semibold">Pts</th>
                      <th className="text-center py-4 px-4 font-semibold hidden md:table-cell">Form</th>
                      <th className="text-center py-4 px-4 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teamStats.map((team, index) => (
                      <React.Fragment key={team.id}>
                        <tr
                          onClick={() => handleTeamClick(team)}
                          className={`hover:bg-white/5 transition-colors cursor-pointer ${
                            index < 4 ? 'border-l-2 border-l-emerald-500' :
                            index >= teamStats.length - 3 ? 'border-l-2 border-l-red-500' : ''
                          } ${expandedTeamId === team.id ? 'bg-white/5' : ''}`}
                        >
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              index < 4 ? 'bg-emerald-500/20 text-emerald-400' :
                              index >= teamStats.length - 3 ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-700/50 text-gray-400'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {team.logo && (
                                <img src={team.logo} alt={team.team_name || ''} className="w-8 h-8 object-contain" />
                              )}
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{team.team_name}</span>
                                <svg className={`w-4 h-4 text-gray-500 transition-transform ${expandedTeamId === team.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-2 text-gray-300">{team.total_played || 0}</td>
                          <td className="text-center py-4 px-2 text-emerald-400 font-medium">{team.total_wins || 0}</td>
                          <td className="text-center py-4 px-2 text-yellow-400">{team.total_draws || 0}</td>
                          <td className="text-center py-4 px-2 text-red-400">{team.total_loses || 0}</td>
                          <td className="text-center py-4 px-2 text-gray-300">{team.goals_for_total || 0}</td>
                          <td className="text-center py-4 px-2 text-gray-300">{team.goals_against_total || 0}</td>
                          <td className={`text-center py-4 px-2 font-medium ${
                            team.goal_difference > 0 ? 'text-emerald-400' :
                            team.goal_difference < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                          </td>
                          <td className="text-center py-4 px-2">
                            <span className="inline-flex items-center justify-center min-w-[36px] px-2 py-1.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                              {team.points}
                            </span>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              {renderForm(team.form)}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Link
                              href={`/leagues/${leagueSlug}/${team.team_name?.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                            >
                              {t('profile')}
                            </Link>
                          </td>
                        </tr>
                        {/* Expanded Team Details */}
                        {expandedTeamId === team.id && (
                          <tr key={`${team.id}-details`} className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5">
                            <td colSpan={12} className="py-6 px-4">
                              <div className="flex flex-col lg:flex-row gap-6">
                                {/* Coach + Formation Column */}
                                <div className="flex-shrink-0 space-y-4">
                                  {/* Coach */}
                                  {team.team_id && coaches[team.team_id] && (
                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">{t('coach')}</p>
                                      <div className="flex items-center gap-3">
                                        {coaches[team.team_id].photo ? (
                                          <img
                                            src={coaches[team.team_id].photo || undefined}
                                            alt={coaches[team.team_id].name || ''}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/30"
                                          />
                                        ) : (
                                          <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center border-2 border-emerald-500/30">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                          </div>
                                        )}
                                        <div>
                                          <p className="text-white font-medium">{coaches[team.team_id].name}</p>
                                          {coaches[team.team_id].nationality && (
                                            <p className="text-gray-400 text-sm">{coaches[team.team_id].nationality}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Formation Pitch */}
                                  <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">{t('formation')}</p>
                                    {renderFormationPitch(selectedFormations[team.id] || team.most_used_formation)}
                                  </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="flex-1">
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {/* All Formations */}
                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10 col-span-2 md:col-span-3 lg:col-span-4">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">{t('allFormations')} <span className="text-gray-500 normal-case">{t('clickToView')}</span></p>
                                      <div className="flex flex-wrap gap-2">
                                        {team.all_formations ? (
                                          team.all_formations.split(',').map((formation, idx) => {
                                            const formationTrimmed = formation.trim();
                                            const isSelected = (selectedFormations[team.id] || team.most_used_formation) === formationTrimmed;
                                            const isMostUsed = formationTrimmed === team.most_used_formation;
                                            return (
                                              <button
                                                key={idx}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedFormations(prev => ({ ...prev, [team.id]: formationTrimmed }));
                                                }}
                                                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                                                  isSelected
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ring-2 ring-emerald-500/50'
                                                    : 'bg-gray-800 text-gray-300 border border-white/10 hover:bg-gray-700 hover:text-white'
                                                }`}
                                              >
                                                {formationTrimmed}
                                                {isMostUsed && (
                                                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-black rounded-full">
                                                    TOP
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          })
                                        ) : (
                                          <span className="text-gray-500">{t('noFormation')}</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Additional Stats */}
                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('cleanSheets')}</p>
                                      <p className="text-2xl font-bold text-cyan-400">{team.clean_sheets || 0}</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('failedToScore')}</p>
                                      <p className="text-2xl font-bold text-red-400">{team.failed_to_score || 0}</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('goalsAvg')}</p>
                                      <p className="text-2xl font-bold text-purple-400">{team.goals_for_average?.toFixed(2) || '0.00'}</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('cards')}</p>
                                      <p className="text-2xl font-bold">
                                        <span className="text-yellow-400">{team.yellow_cards_total || 0}</span>
                                        <span className="text-gray-500 mx-1">/</span>
                                        <span className="text-red-400">{team.red_cards_total || 0}</span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Player Stats Section */}
                                  <div className="mt-6">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">{t('squadPlayers')}</p>
                                    {loadingPlayers === team.team_id ? (
                                      <div className="flex items-center justify-center py-8">
                                        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                      </div>
                                    ) : team.team_id && playerStats[team.team_id] && playerStats[team.team_id].length > 0 ? (
                                      <div className="overflow-x-auto rounded-xl border border-white/10">
                                        <table className="w-full min-w-[700px]">
                                          <thead className="bg-gray-900/80">
                                            <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
                                              <th className="text-left py-2.5 px-3 font-semibold">{t('player')}</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">{t('pos')}</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">{t('age')}</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">{t('apps')}</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">{t('mins')}</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">{t('goals')}</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">{t('assists')}</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">{t('rating')}</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">Y/R</th>
                                              <th className="text-center py-2.5 px-2 font-semibold"></th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-white/5">
                                            {playerStats[team.team_id].map((player) => (
                                              <tr key={player.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-2.5 px-3">
                                                  <div className="flex items-center gap-2">
                                                    {player.photo ? (
                                                      <img src={player.photo} alt={player.player_name || ''} className="w-8 h-8 rounded-full object-cover bg-gray-700" />
                                                    ) : (
                                                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                                                        {player.player_name?.charAt(0) || '?'}
                                                      </div>
                                                    )}
                                                    <div>
                                                      <div className="flex items-center gap-1.5">
                                                        <span className="text-white text-sm font-medium">{player.player_name}</span>
                                                        {player.captain && (
                                                          <span className="px-1 py-0.5 text-[9px] font-bold bg-amber-500 text-black rounded">C</span>
                                                        )}
                                                        {player.injured && (
                                                          <span className="px-1 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded">INJ</span>
                                                        )}
                                                      </div>
                                                      <span className="text-gray-500 text-[10px]">{player.nationality}</span>
                                                    </div>
                                                  </div>
                                                </td>
                                                <td className="text-center py-2.5 px-2">
                                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                                    player.position === 'Goalkeeper' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    player.position === 'Defender' ? 'bg-blue-500/20 text-blue-400' :
                                                    player.position === 'Midfielder' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-red-500/20 text-red-400'
                                                  }`}>
                                                    {player.position?.substring(0, 3).toUpperCase() || '-'}
                                                  </span>
                                                </td>
                                                <td className="text-center py-2.5 px-2 text-gray-300 text-sm">{player.age || '-'}</td>
                                                <td className="text-center py-2.5 px-2 text-gray-300 text-sm">{player.appearances || 0}</td>
                                                <td className="text-center py-2.5 px-2 text-gray-400 text-sm">{player.minutes || 0}</td>
                                                <td className="text-center py-2.5 px-2 text-emerald-400 font-semibold text-sm">{player.goals_total || 0}</td>
                                                <td className="text-center py-2.5 px-2 text-cyan-400 font-semibold text-sm">{player.assists || 0}</td>
                                                <td className="text-center py-2.5 px-2">
                                                  {player.rating ? (
                                                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                                                      player.rating >= 7.5 ? 'bg-emerald-500/20 text-emerald-400' :
                                                      player.rating >= 7 ? 'bg-green-500/20 text-green-400' :
                                                      player.rating >= 6.5 ? 'bg-yellow-500/20 text-yellow-400' :
                                                      'bg-red-500/20 text-red-400'
                                                    }`}>
                                                      {Number(player.rating).toFixed(1)}
                                                    </span>
                                                  ) : (
                                                    <span className="text-gray-500 text-sm">-</span>
                                                  )}
                                                </td>
                                                <td className="text-center py-2.5 px-2">
                                                  <span className="text-yellow-400 text-sm">{player.cards_yellow || 0}</span>
                                                  <span className="text-gray-600 mx-0.5">/</span>
                                                  <span className="text-red-400 text-sm">{player.cards_red || 0}</span>
                                                </td>
                                                <td className="text-center py-2.5 px-2">
                                                  <Link
                                                    href={`/leagues/${leagueSlug}/player/${player.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                                                  >
                                                    {t('viewProfile')}
                                                  </Link>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <p className="text-gray-500 text-sm py-4">{t('noPlayerData')}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legend */}
            {teamStats.length > 0 && !loading && (
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-900/50 border-t border-white/5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>{t('championsLeague')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>{t('relegation')}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto hidden md:flex">
                  <span>{t('legend')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
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
                <li><Link href="/predictions" className="hover:text-emerald-400 transition-colors">{t('predictions')}</Link></li>
                <li><Link href="/leagues" className="hover:text-emerald-400 transition-colors">{t('leagues')}</Link></li>
                <li><Link href="/performance" className="hover:text-emerald-400 transition-colors">{t('performance')}</Link></li>
                <li><Link href="/solution" className="hover:text-emerald-400 transition-colors">{t('solution')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('popularLeagues')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/leagues/premier-league" className="hover:text-emerald-400 transition-colors">Premier League</Link></li>
                <li><Link href="/leagues/la-liga" className="hover:text-emerald-400 transition-colors">La Liga</Link></li>
                <li><Link href="/leagues/serie-a" className="hover:text-emerald-400 transition-colors">Serie A</Link></li>
                <li><Link href="/leagues/bundesliga" className="hover:text-emerald-400 transition-colors">Bundesliga</Link></li>
                <li><Link href="/leagues/ligue-1" className="hover:text-emerald-400 transition-colors">Ligue 1</Link></li>
                <li><Link href="/leagues/champions-league" className="hover:text-emerald-400 transition-colors">Champions League</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('communityFooter')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/community" className="hover:text-emerald-400 transition-colors">{t('community')}</Link></li>
                <li><Link href="/community/global-chat" className="hover:text-emerald-400 transition-colors">{t('globalChat')}</Link></li>
                <li><Link href="/community/user-predictions" className="hover:text-emerald-400 transition-colors">{t('userPredictions')}</Link></li>
              </ul>
            </div>

            <div className="relative z-10">
              <h4 className="font-semibold mb-5 text-white">{t('company')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors inline-block">{t('aboutUs')}</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors inline-block">{t('contact')}</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-400 transition-colors inline-block">{t('blog')}</Link></li>
              </ul>
            </div>

            <div className="relative z-10">
              <h4 className="font-semibold mb-5 text-white">{t('legal')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/terms-of-service" className="hover:text-emerald-400 transition-colors inline-block">{t('termsOfService')}</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors inline-block">{t('privacyPolicy')}</Link></li>
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
