'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, TeamStatistics, getTeamStatisticsByLeague, PlayerStats, getPlayerStatsByTeam, Coach, getCoachesByTeamIds } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeNames, localeToTranslationCode, type Locale } from '@/i18n/config';

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
    responsibleGaming: "Responsible Gaming",
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
    responsibleGaming: "Juego Responsable",
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
    responsibleGaming: "Jogo Responsavel",
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
    responsibleGaming: "Verantwortungsvolles Spielen",
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
    responsibleGaming: "Jeu Responsable",
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
    responsibleGaming: "責任あるギャンブル",
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
    responsibleGaming: "책임감 있는 게임",
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
    responsibleGaming: "负责任博彩",
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
    responsibleGaming: "負責任博彩",
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
    responsibleGaming: "Perjudian Bertanggung Jawab",
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

// SEO Content type
interface SEOContent {
  title: string;
  description: string;
  features: string[];
  whatWeOffer: string;
  faqTitle: string;
  viewAllPredictions: string;
  faq: { q: string; a: string }[];
}

// Multi-language SEO Content for each league
const LEAGUES_SEO_CONTENT: Record<string, Record<string, SEOContent>> = {
  'premier-league': {
    EN: {
      title: 'Premier League AI Predictions & Betting Analysis',
      description: 'The Premier League is the most-watched football league in the world, featuring elite clubs like Manchester City, Arsenal, Liverpool, and Chelsea. Our AI analyzes comprehensive match data including head-to-head records, form, injuries, and historical patterns to deliver accurate Premier League predictions.',
      whatWeOffer: 'What We Offer',
      faqTitle: 'Frequently Asked Questions',
      viewAllPredictions: 'View All Premier League Predictions',
      features: ['Real-time standings updated after each matchday', 'Team form analysis across home and away fixtures', 'Detailed squad statistics including goals scored and clean sheets', 'AI-powered predictions for all EPL matches'],
      faq: [{ q: 'How accurate are your Premier League predictions?', a: 'Our AI model achieves consistent accuracy by analyzing historical data, team form, and real-time statistics. Check our Performance page for verified track record.' }, { q: 'When are Premier League predictions available?', a: 'Predictions are generated as soon as odds are released, typically 2-3 days before each match.' }],
    },
    ES: {
      title: 'Predicciones IA de la Premier League y Analisis de Apuestas',
      description: 'La Premier League es la liga de futbol mas vista del mundo, con clubes de elite como Manchester City, Arsenal, Liverpool y Chelsea. Nuestra IA analiza datos completos de partidos para ofrecer predicciones precisas de la Premier League.',
      whatWeOffer: 'Lo Que Ofrecemos',
      faqTitle: 'Preguntas Frecuentes',
      viewAllPredictions: 'Ver Todas las Predicciones de Premier League',
      features: ['Clasificacion en tiempo real actualizada cada jornada', 'Analisis de forma de equipos en casa y fuera', 'Estadisticas detalladas del equipo', 'Predicciones IA para todos los partidos de la EPL'],
      faq: [{ q: 'Que tan precisas son sus predicciones de la Premier League?', a: 'Nuestro modelo de IA logra una precision consistente analizando datos historicos y estadisticas en tiempo real.' }, { q: 'Cuando estan disponibles las predicciones?', a: 'Las predicciones se generan tan pronto como se publican las cuotas, normalmente 2-3 dias antes de cada partido.' }],
    },
    PT: {
      title: 'Previsoes IA da Premier League e Analise de Apostas',
      description: 'A Premier League e a liga de futebol mais assistida do mundo, com clubes de elite como Manchester City, Arsenal, Liverpool e Chelsea. Nossa IA analisa dados abrangentes de partidas para fornecer previsoes precisas da Premier League.',
      whatWeOffer: 'O Que Oferecemos',
      faqTitle: 'Perguntas Frequentes',
      viewAllPredictions: 'Ver Todas as Previsoes da Premier League',
      features: ['Classificacao em tempo real atualizada a cada rodada', 'Analise de desempenho em casa e fora', 'Estatisticas detalhadas da equipe', 'Previsoes de IA para todos os jogos da EPL'],
      faq: [{ q: 'Quao precisas sao suas previsoes da Premier League?', a: 'Nosso modelo de IA alcanca precisao consistente analisando dados historicos e estatisticas em tempo real.' }, { q: 'Quando as previsoes estao disponiveis?', a: 'As previsoes sao geradas assim que as odds sao lancadas, normalmente 2-3 dias antes de cada partida.' }],
    },
    DE: {
      title: 'Premier League KI-Vorhersagen & Wettanalyse',
      description: 'Die Premier League ist die meistgesehene Fussballliga der Welt mit Eliteklubs wie Manchester City, Arsenal, Liverpool und Chelsea. Unsere KI analysiert umfassende Spieldaten, um genaue Premier League Vorhersagen zu liefern.',
      whatWeOffer: 'Was Wir Bieten',
      faqTitle: 'Haufig Gestellte Fragen',
      viewAllPredictions: 'Alle Premier League Vorhersagen Anzeigen',
      features: ['Echtzeit-Tabelle nach jedem Spieltag aktualisiert', 'Formanalyse fur Heim- und Auswartsspiele', 'Detaillierte Teamstatistiken', 'KI-Vorhersagen fur alle EPL-Spiele'],
      faq: [{ q: 'Wie genau sind Ihre Premier League Vorhersagen?', a: 'Unser KI-Modell erreicht konsistente Genauigkeit durch Analyse historischer Daten und Echtzeitstatistiken.' }, { q: 'Wann sind Vorhersagen verfugbar?', a: 'Vorhersagen werden generiert, sobald Quoten veroffentlicht werden, normalerweise 2-3 Tage vor jedem Spiel.' }],
    },
    FR: {
      title: 'Predictions IA Premier League & Analyse des Paris',
      description: 'La Premier League est la ligue de football la plus regardee au monde, avec des clubs d\'elite comme Manchester City, Arsenal, Liverpool et Chelsea. Notre IA analyse des donnees completes pour fournir des predictions precises de la Premier League.',
      whatWeOffer: 'Ce Que Nous Offrons',
      faqTitle: 'Questions Frequentes',
      viewAllPredictions: 'Voir Toutes les Predictions Premier League',
      features: ['Classement en temps reel mis a jour apres chaque journee', 'Analyse de forme a domicile et a l\'exterieur', 'Statistiques detaillees des equipes', 'Predictions IA pour tous les matchs EPL'],
      faq: [{ q: 'Quelle est la precision de vos predictions Premier League?', a: 'Notre modele IA atteint une precision constante en analysant les donnees historiques et les statistiques en temps reel.' }, { q: 'Quand les predictions sont-elles disponibles?', a: 'Les predictions sont generees des que les cotes sont publiees, generalement 2-3 jours avant chaque match.' }],
    },
    JA: {
      title: 'プレミアリーグ AI予測＆ベッティング分析',
      description: 'プレミアリーグは世界で最も視聴されているサッカーリーグで、マンチェスター・シティ、アーセナル、リバプール、チェルシーなどのエリートクラブが所属しています。当社のAIは包括的な試合データを分析し、正確なプレミアリーグ予測を提供します。',
      whatWeOffer: '提供内容',
      faqTitle: 'よくある質問',
      viewAllPredictions: 'すべてのプレミアリーグ予測を見る',
      features: ['各節後にリアルタイム更新される順位表', 'ホーム＆アウェイのフォーム分析', '詳細なチーム統計', '全EPL試合のAI予測'],
      faq: [{ q: 'プレミアリーグ予測の精度は?', a: '当社のAIモデルは履歴データとリアルタイム統計を分析し、一貫した精度を達成しています。' }, { q: '予測はいつ利用可能ですか?', a: 'オッズが公開され次第、通常は各試合の2-3日前に予測が生成されます。' }],
    },
    KO: {
      title: '프리미어리그 AI 예측 및 베팅 분석',
      description: '프리미어리그는 맨체스터 시티, 아스날, 리버풀, 첼시 같은 엘리트 클럽이 참가하는 세계에서 가장 많이 시청되는 축구 리그입니다. 당사의 AI는 포괄적인 경기 데이터를 분석하여 정확한 프리미어리그 예측을 제공합니다.',
      whatWeOffer: '제공 서비스',
      faqTitle: '자주 묻는 질문',
      viewAllPredictions: '모든 프리미어리그 예측 보기',
      features: ['매 라운드 후 업데이트되는 실시간 순위표', '홈 & 원정 폼 분석', '상세한 팀 통계', '모든 EPL 경기 AI 예측'],
      faq: [{ q: '프리미어리그 예측은 얼마나 정확한가요?', a: '당사의 AI 모델은 과거 데이터와 실시간 통계를 분석하여 일관된 정확도를 달성합니다.' }, { q: '예측은 언제 제공되나요?', a: '예측은 배당률이 공개되는 즉시, 보통 각 경기 2-3일 전에 생성됩니다.' }],
    },
    ZH: {
      title: '英超AI预测与投注分析',
      description: '英超是全球收视率最高的足球联赛,拥有曼城、阿森纳、利物浦和切尔西等精英俱乐部。我们的AI分析全面的比赛数据,提供准确的英超预测。',
      whatWeOffer: '我们提供',
      faqTitle: '常见问题',
      viewAllPredictions: '查看所有英超预测',
      features: ['每轮比赛后实时更新的积分榜', '主客场表现分析', '详细的球队统计数据', '所有英超比赛的AI预测'],
      faq: [{ q: '您的英超预测准确度如何?', a: '我们的AI模型通过分析历史数据和实时统计数据,实现稳定的准确率。' }, { q: '预测何时可用?', a: '预测会在赔率发布后立即生成,通常在每场比赛前2-3天。' }],
    },
    TW: {
      title: '英超AI預測與投注分析',
      description: '英超是全球收視率最高的足球聯賽,擁有曼城、阿森納、利物浦和切爾西等精英俱樂部。我們的AI分析全面的比賽數據,提供準確的英超預測。',
      whatWeOffer: '我們提供',
      faqTitle: '常見問題',
      viewAllPredictions: '查看所有英超預測',
      features: ['每輪比賽後實時更新的積分榜', '主客場表現分析', '詳細的球隊統計數據', '所有英超比賽的AI預測'],
      faq: [{ q: '您的英超預測準確度如何?', a: '我們的AI模型通過分析歷史數據和實時統計數據,實現穩定的準確率。' }, { q: '預測何時可用?', a: '預測會在賠率發布後立即生成,通常在每場比賽前2-3天。' }],
    },
    ID: {
      title: 'Prediksi AI Premier League & Analisis Taruhan',
      description: 'Premier League adalah liga sepak bola yang paling banyak ditonton di dunia, menampilkan klub elit seperti Manchester City, Arsenal, Liverpool, dan Chelsea. AI kami menganalisis data pertandingan yang komprehensif untuk memberikan prediksi Premier League yang akurat.',
      whatWeOffer: 'Yang Kami Tawarkan',
      faqTitle: 'Pertanyaan yang Sering Diajukan',
      viewAllPredictions: 'Lihat Semua Prediksi Premier League',
      features: ['Klasemen real-time diperbarui setiap pekan', 'Analisis performa kandang dan tandang', 'Statistik tim yang detail', 'Prediksi AI untuk semua pertandingan EPL'],
      faq: [{ q: 'Seberapa akurat prediksi Premier League Anda?', a: 'Model AI kami mencapai akurasi yang konsisten dengan menganalisis data historis dan statistik real-time.' }, { q: 'Kapan prediksi tersedia?', a: 'Prediksi dibuat segera setelah odds dirilis, biasanya 2-3 hari sebelum setiap pertandingan.' }],
    },
  },
  'bundesliga': {
    EN: {
      title: 'Bundesliga AI Predictions & Betting Tips',
      description: 'The Bundesliga is Germany\'s top football division, known for its passionate fan culture and attacking football. Teams like Bayern Munich, Borussia Dortmund, and RB Leipzig compete for the Meisterschale trophy. Our AI prediction system analyzes Bundesliga-specific factors to deliver accurate betting insights.',
      whatWeOffer: 'What We Offer',
      faqTitle: 'Frequently Asked Questions',
      viewAllPredictions: 'View All Bundesliga Predictions',
      features: ['Live Bundesliga table with all statistics', 'Team performance analysis including goals per match', 'Historical data from all German top-flight matches', 'AI predictions for Moneyline, Handicap, and Over/Under markets'],
      faq: [{ q: 'What makes Bundesliga predictions different?', a: 'Bundesliga has the highest average goals per game in Europe. Our AI accounts for this attacking nature when generating Over/Under predictions.' }, { q: 'Do you cover Bundesliga 2 predictions?', a: 'Currently we focus on Bundesliga 1, with plans to expand coverage.' }],
    },
    ES: {
      title: 'Predicciones IA de la Bundesliga y Consejos de Apuestas',
      description: 'La Bundesliga es la maxima division del futbol aleman, conocida por su apasionada cultura de aficionados y futbol ofensivo. Equipos como Bayern Munich, Borussia Dortmund y RB Leipzig compiten por el trofeo Meisterschale.',
      whatWeOffer: 'Lo Que Ofrecemos',
      faqTitle: 'Preguntas Frecuentes',
      viewAllPredictions: 'Ver Todas las Predicciones de Bundesliga',
      features: ['Tabla en vivo de la Bundesliga con todas las estadisticas', 'Analisis de rendimiento del equipo', 'Datos historicos de partidos alemanes', 'Predicciones IA para mercados de Moneyline, Handicap y Over/Under'],
      faq: [{ q: 'Que hace diferentes las predicciones de la Bundesliga?', a: 'La Bundesliga tiene el promedio de goles por partido mas alto de Europa. Nuestra IA considera esta naturaleza ofensiva.' }, { q: 'Cubren predicciones de Bundesliga 2?', a: 'Actualmente nos enfocamos en la Bundesliga 1, con planes de expansion.' }],
    },
    PT: {
      title: 'Previsoes IA da Bundesliga e Dicas de Apostas',
      description: 'A Bundesliga e a principal divisao do futebol alemao, conhecida por sua cultura apaixonada de torcedores e futebol ofensivo. Times como Bayern de Munique, Borussia Dortmund e RB Leipzig competem pelo trofeu Meisterschale.',
      whatWeOffer: 'O Que Oferecemos',
      faqTitle: 'Perguntas Frequentes',
      viewAllPredictions: 'Ver Todas as Previsoes da Bundesliga',
      features: ['Tabela ao vivo da Bundesliga com todas as estatisticas', 'Analise de desempenho da equipe', 'Dados historicos de jogos alemaes', 'Previsoes IA para mercados de Moneyline, Handicap e Over/Under'],
      faq: [{ q: 'O que torna as previsoes da Bundesliga diferentes?', a: 'A Bundesliga tem a maior media de gols por jogo na Europa. Nossa IA considera essa natureza ofensiva.' }, { q: 'Voces cobrem previsoes da Bundesliga 2?', a: 'Atualmente focamos na Bundesliga 1, com planos de expansao.' }],
    },
    DE: {
      title: 'Bundesliga KI-Vorhersagen & Wetttipps',
      description: 'Die Bundesliga ist Deutschlands oberste Fussballliga, bekannt fur ihre leidenschaftliche Fankultur und offensiven Fussball. Teams wie Bayern Munchen, Borussia Dortmund und RB Leipzig kampfen um die Meisterschale.',
      whatWeOffer: 'Was Wir Bieten',
      faqTitle: 'Haufig Gestellte Fragen',
      viewAllPredictions: 'Alle Bundesliga Vorhersagen Anzeigen',
      features: ['Live Bundesliga-Tabelle mit allen Statistiken', 'Teamleistungsanalyse inklusive Tore pro Spiel', 'Historische Daten aller deutschen Erstligaspiele', 'KI-Vorhersagen fur Moneyline, Handicap und Over/Under Markte'],
      faq: [{ q: 'Was macht Bundesliga-Vorhersagen besonders?', a: 'Die Bundesliga hat den hochsten Tordurchschnitt pro Spiel in Europa. Unsere KI berucksichtigt diese offensive Natur.' }, { q: 'Decken Sie Bundesliga 2 Vorhersagen ab?', a: 'Derzeit konzentrieren wir uns auf die Bundesliga 1, mit Erweiterungsplanen.' }],
    },
    FR: {
      title: 'Predictions IA Bundesliga & Conseils de Paris',
      description: 'La Bundesliga est la premiere division allemande, connue pour sa culture de supporters passionnee et son football offensif. Des equipes comme le Bayern Munich, Borussia Dortmund et RB Leipzig se disputent le Meisterschale.',
      whatWeOffer: 'Ce Que Nous Offrons',
      faqTitle: 'Questions Frequentes',
      viewAllPredictions: 'Voir Toutes les Predictions Bundesliga',
      features: ['Classement Bundesliga en direct avec toutes les statistiques', 'Analyse des performances des equipes', 'Donnees historiques des matchs allemands', 'Predictions IA pour les marches Moneyline, Handicap et Over/Under'],
      faq: [{ q: 'Qu\'est-ce qui rend les predictions Bundesliga differentes?', a: 'La Bundesliga a la moyenne de buts par match la plus elevee d\'Europe. Notre IA prend en compte cette nature offensive.' }, { q: 'Couvrez-vous les predictions de Bundesliga 2?', a: 'Actuellement, nous nous concentrons sur la Bundesliga 1, avec des plans d\'expansion.' }],
    },
    JA: {
      title: 'ブンデスリーガ AI予測＆ベッティングヒント',
      description: 'ブンデスリーガはドイツのトップフットボールリーグで、熱狂的なファン文化と攻撃的なサッカーで知られています。バイエルン・ミュンヘン、ボルシア・ドルトムント、RBライプツィヒなどがマイスターシャーレを争います。',
      whatWeOffer: '提供内容',
      faqTitle: 'よくある質問',
      viewAllPredictions: 'すべてのブンデスリーガ予測を見る',
      features: ['全統計を含むライブブンデスリーガ順位表', '試合ごとのゴール数を含むチームパフォーマンス分析', 'ドイツトップリーグ全試合の履歴データ', 'マネーライン、ハンディキャップ、オーバー/アンダー市場のAI予測'],
      faq: [{ q: 'ブンデスリーガ予測の特徴は?', a: 'ブンデスリーガはヨーロッパで最も平均ゴール数が高いリーグです。当社のAIはオーバー/アンダー予測でこの攻撃的な性質を考慮します。' }, { q: 'ブンデスリーガ2の予測はありますか?', a: '現在はブンデスリーガ1に注力しており、拡張を計画中です。' }],
    },
    KO: {
      title: '분데스리가 AI 예측 및 베팅 팁',
      description: '분데스리가는 열정적인 팬 문화와 공격적인 축구로 유명한 독일 최고의 축구 리그입니다. 바이에른 뮌헨, 보루시아 도르트문트, RB 라이프치히 등이 마이스터샬레를 놓고 경쟁합니다.',
      whatWeOffer: '제공 서비스',
      faqTitle: '자주 묻는 질문',
      viewAllPredictions: '모든 분데스리가 예측 보기',
      features: ['모든 통계가 포함된 실시간 분데스리가 순위표', '경기당 골 수를 포함한 팀 성과 분석', '독일 1부 리그 전 경기 과거 데이터', '머니라인, 핸디캡, 오버/언더 시장 AI 예측'],
      faq: [{ q: '분데스리가 예측의 특징은?', a: '분데스리가는 유럽에서 경기당 평균 골이 가장 높습니다. 당사의 AI는 오버/언더 예측 시 이러한 공격적 특성을 고려합니다.' }, { q: '분데스리가 2 예측도 제공하나요?', a: '현재 분데스리가 1에 집중하고 있으며 확장 계획이 있습니다.' }],
    },
    ZH: {
      title: '德甲AI预测与投注技巧',
      description: '德甲是德国顶级足球联赛,以其热情的球迷文化和攻势足球闻名。拜仁慕尼黑、多特蒙德和RB莱比锡等球队争夺德甲冠军奖盘。',
      whatWeOffer: '我们提供',
      faqTitle: '常见问题',
      viewAllPredictions: '查看所有德甲预测',
      features: ['包含所有统计数据的实时德甲积分榜', '包括场均进球的球队表现分析', '德国顶级联赛所有比赛的历史数据', '独赢、让球和大小球市场的AI预测'],
      faq: [{ q: '德甲预测有何不同?', a: '德甲是欧洲场均进球最高的联赛。我们的AI在生成大小球预测时会考虑这种攻势特性。' }, { q: '您覆盖德乙预测吗?', a: '目前我们专注于德甲,计划扩展覆盖范围。' }],
    },
    TW: {
      title: '德甲AI預測與投注技巧',
      description: '德甲是德國頂級足球聯賽,以其熱情的球迷文化和攻勢足球聞名。拜仁慕尼黑、多特蒙德和RB萊比錫等球隊爭奪德甲冠軍獎盤。',
      whatWeOffer: '我們提供',
      faqTitle: '常見問題',
      viewAllPredictions: '查看所有德甲預測',
      features: ['包含所有統計數據的實時德甲積分榜', '包括場均進球的球隊表現分析', '德國頂級聯賽所有比賽的歷史數據', '獨贏、讓球和大小球市場的AI預測'],
      faq: [{ q: '德甲預測有何不同?', a: '德甲是歐洲場均進球最高的聯賽。我們的AI在生成大小球預測時會考慮這種攻勢特性。' }, { q: '您覆蓋德乙預測嗎?', a: '目前我們專注於德甲,計劃擴展覆蓋範圍。' }],
    },
    ID: {
      title: 'Prediksi AI Bundesliga & Tips Taruhan',
      description: 'Bundesliga adalah divisi utama sepak bola Jerman, dikenal dengan budaya suporter yang penuh gairah dan sepak bola menyerang. Tim seperti Bayern Munich, Borussia Dortmund, dan RB Leipzig bersaing untuk trofi Meisterschale.',
      whatWeOffer: 'Yang Kami Tawarkan',
      faqTitle: 'Pertanyaan yang Sering Diajukan',
      viewAllPredictions: 'Lihat Semua Prediksi Bundesliga',
      features: ['Klasemen Bundesliga langsung dengan semua statistik', 'Analisis performa tim termasuk gol per pertandingan', 'Data historis semua pertandingan kasta tertinggi Jerman', 'Prediksi AI untuk pasar Moneyline, Handicap, dan Over/Under'],
      faq: [{ q: 'Apa yang membuat prediksi Bundesliga berbeda?', a: 'Bundesliga memiliki rata-rata gol per pertandingan tertinggi di Eropa. AI kami memperhitungkan sifat menyerang ini.' }, { q: 'Apakah Anda meliput prediksi Bundesliga 2?', a: 'Saat ini kami fokus pada Bundesliga 1, dengan rencana untuk memperluas cakupan.' }],
    },
  },
  'serie-a': {
    EN: {
      title: 'Serie A AI Predictions & Italian Football Analysis',
      description: 'Serie A is Italy\'s premier football competition featuring legendary clubs like Inter Milan, AC Milan, Juventus, and Napoli. Known for its tactical sophistication and defensive excellence, Serie A requires specialized analysis.',
      whatWeOffer: 'What We Offer',
      faqTitle: 'Frequently Asked Questions',
      viewAllPredictions: 'View All Serie A Predictions',
      features: ['Complete Serie A standings and statistics', 'Tactical analysis factored into predictions', 'Clean sheet and defensive statistics for all teams', 'AI-powered betting tips for all Serie A fixtures'],
      faq: [{ q: 'How does your AI handle Serie A\'s tactical nature?', a: 'Our model weighs defensive statistics and tactical patterns more heavily for Serie A, reflecting the league\'s traditional emphasis on organized defense.' }, { q: 'Are Coppa Italia matches included?', a: 'We focus on Serie A league matches for optimal prediction accuracy.' }],
    },
    ES: {
      title: 'Predicciones IA de la Serie A y Analisis del Futbol Italiano',
      description: 'La Serie A es la principal competicion de futbol de Italia con clubes legendarios como Inter de Milan, AC Milan, Juventus y Napoli. Conocida por su sofisticacion tactica y excelencia defensiva.',
      whatWeOffer: 'Lo Que Ofrecemos',
      faqTitle: 'Preguntas Frecuentes',
      viewAllPredictions: 'Ver Todas las Predicciones de Serie A',
      features: ['Clasificacion completa de la Serie A', 'Analisis tactico en las predicciones', 'Estadisticas defensivas de todos los equipos', 'Consejos de apuestas IA para todos los partidos'],
      faq: [{ q: 'Como maneja su IA la naturaleza tactica de la Serie A?', a: 'Nuestro modelo da mas peso a las estadisticas defensivas y patrones tacticos, reflejando el enfasis tradicional de la liga en la defensa organizada.' }, { q: 'Se incluyen partidos de la Coppa Italia?', a: 'Nos enfocamos en partidos de liga de la Serie A para una precision optima.' }],
    },
    PT: {
      title: 'Previsoes IA da Serie A e Analise do Futebol Italiano',
      description: 'A Serie A e a principal competicao de futebol da Italia, com clubes lendarios como Inter de Milao, AC Milan, Juventus e Napoli. Conhecida por sua sofisticacao tatica e excelencia defensiva.',
      whatWeOffer: 'O Que Oferecemos',
      faqTitle: 'Perguntas Frequentes',
      viewAllPredictions: 'Ver Todas as Previsoes da Serie A',
      features: ['Classificacao completa da Serie A', 'Analise tatica nas previsoes', 'Estatisticas defensivas de todas as equipes', 'Dicas de apostas IA para todos os jogos'],
      faq: [{ q: 'Como sua IA lida com a natureza tatica da Serie A?', a: 'Nosso modelo da mais peso as estatisticas defensivas e padroes taticos, refletindo a enfase tradicional da liga na defesa organizada.' }, { q: 'Jogos da Coppa Italia estao incluidos?', a: 'Focamos em jogos da liga Serie A para precisao otima.' }],
    },
    DE: {
      title: 'Serie A KI-Vorhersagen & Italienische Fussballanalyse',
      description: 'Die Serie A ist Italiens hochste Fussballliga mit legendaren Klubs wie Inter Mailand, AC Mailand, Juventus und Napoli. Bekannt fur ihre taktische Raffinesse und defensive Exzellenz.',
      whatWeOffer: 'Was Wir Bieten',
      faqTitle: 'Haufig Gestellte Fragen',
      viewAllPredictions: 'Alle Serie A Vorhersagen Anzeigen',
      features: ['Vollstandige Serie A Tabelle und Statistiken', 'Taktische Analyse in Vorhersagen', 'Defensive Statistiken aller Teams', 'KI-Wetttipps fur alle Serie A Spiele'],
      faq: [{ q: 'Wie geht Ihre KI mit der taktischen Natur der Serie A um?', a: 'Unser Modell gewichtet defensive Statistiken und taktische Muster starker, was die traditionelle Betonung der Liga auf organisierte Verteidigung widerspiegelt.' }, { q: 'Sind Coppa Italia Spiele enthalten?', a: 'Wir konzentrieren uns auf Serie A Ligaspiele fur optimale Vorhersagegenauigkeit.' }],
    },
    FR: {
      title: 'Predictions IA Serie A & Analyse du Football Italien',
      description: 'La Serie A est la principale competition de football italienne avec des clubs legendaires comme l\'Inter Milan, l\'AC Milan, la Juventus et Naples. Connue pour sa sophistication tactique et son excellence defensive.',
      whatWeOffer: 'Ce Que Nous Offrons',
      faqTitle: 'Questions Frequentes',
      viewAllPredictions: 'Voir Toutes les Predictions Serie A',
      features: ['Classement complet de la Serie A', 'Analyse tactique dans les predictions', 'Statistiques defensives de toutes les equipes', 'Conseils de paris IA pour tous les matchs'],
      faq: [{ q: 'Comment votre IA gere-t-elle la nature tactique de la Serie A?', a: 'Notre modele accorde plus de poids aux statistiques defensives et aux schemas tactiques, refletant l\'accent traditionnel de la ligue sur la defense organisee.' }, { q: 'Les matchs de Coppa Italia sont-ils inclus?', a: 'Nous nous concentrons sur les matchs de Serie A pour une precision optimale.' }],
    },
    JA: {
      title: 'セリエA AI予測＆イタリアサッカー分析',
      description: 'セリエAはインテル・ミラノ、ACミラン、ユベントス、ナポリなどの伝説的クラブを擁するイタリアのプレミアフットボール大会です。戦術的な洗練さと守備の優秀さで知られています。',
      whatWeOffer: '提供内容',
      faqTitle: 'よくある質問',
      viewAllPredictions: 'すべてのセリエA予測を見る',
      features: ['完全なセリエA順位表と統計', '予測に組み込まれた戦術分析', '全チームのクリーンシートと守備統計', '全セリエA試合のAIベッティングヒント'],
      faq: [{ q: 'AIはセリエAの戦術的性質をどう扱いますか?', a: '当社のモデルはセリエAの守備統計と戦術パターンをより重視し、組織的な守備への伝統的な重点を反映しています。' }, { q: 'コッパ・イタリアの試合は含まれますか?', a: '最適な予測精度のためにセリエAのリーグ戦に注力しています。' }],
    },
    KO: {
      title: '세리에A AI 예측 및 이탈리아 축구 분석',
      description: '세리에A는 인테르 밀란, AC 밀란, 유벤투스, 나폴리 등 전설적인 클럽이 참가하는 이탈리아 최고의 축구 대회입니다. 전술적 정교함과 수비 우수성으로 유명합니다.',
      whatWeOffer: '제공 서비스',
      faqTitle: '자주 묻는 질문',
      viewAllPredictions: '모든 세리에A 예측 보기',
      features: ['완전한 세리에A 순위표 및 통계', '예측에 반영된 전술 분석', '모든 팀의 클린시트 및 수비 통계', '모든 세리에A 경기 AI 베팅 팁'],
      faq: [{ q: 'AI가 세리에A의 전술적 특성을 어떻게 처리하나요?', a: '당사 모델은 세리에A의 조직적 수비 강조 전통을 반영하여 수비 통계와 전술 패턴에 더 큰 가중치를 둡니다.' }, { q: '코파 이탈리아 경기도 포함되나요?', a: '최적의 예측 정확도를 위해 세리에A 리그 경기에 집중합니다.' }],
    },
    ZH: {
      title: '意甲AI预测与意大利足球分析',
      description: '意甲是意大利顶级足球赛事,拥有国际米兰、AC米兰、尤文图斯和那不勒斯等传奇俱乐部。以其战术精妙和防守卓越而闻名。',
      whatWeOffer: '我们提供',
      faqTitle: '常见问题',
      viewAllPredictions: '查看所有意甲预测',
      features: ['完整的意甲积分榜和统计数据', '预测中纳入战术分析', '所有球队的零封和防守统计', '所有意甲比赛的AI投注技巧'],
      faq: [{ q: 'AI如何处理意甲的战术特性?', a: '我们的模型更加重视防守统计和战术模式,反映了联赛对组织防守的传统重视。' }, { q: '包括意大利杯比赛吗?', a: '我们专注于意甲联赛比赛以获得最佳预测准确性。' }],
    },
    TW: {
      title: '意甲AI預測與意大利足球分析',
      description: '意甲是意大利頂級足球賽事,擁有國際米蘭、AC米蘭、尤文圖斯和那不勒斯等傳奇俱樂部。以其戰術精妙和防守卓越而聞名。',
      whatWeOffer: '我們提供',
      faqTitle: '常見問題',
      viewAllPredictions: '查看所有意甲預測',
      features: ['完整的意甲積分榜和統計數據', '預測中納入戰術分析', '所有球隊的零封和防守統計', '所有意甲比賽的AI投注技巧'],
      faq: [{ q: 'AI如何處理意甲的戰術特性?', a: '我們的模型更加重視防守統計和戰術模式,反映了聯賽對組織防守的傳統重視。' }, { q: '包括意大利杯比賽嗎?', a: '我們專注於意甲聯賽比賽以獲得最佳預測準確性。' }],
    },
    ID: {
      title: 'Prediksi AI Serie A & Analisis Sepak Bola Italia',
      description: 'Serie A adalah kompetisi sepak bola utama Italia yang menampilkan klub-klub legendaris seperti Inter Milan, AC Milan, Juventus, dan Napoli. Dikenal dengan kecanggihan taktis dan keunggulan defensifnya.',
      whatWeOffer: 'Yang Kami Tawarkan',
      faqTitle: 'Pertanyaan yang Sering Diajukan',
      viewAllPredictions: 'Lihat Semua Prediksi Serie A',
      features: ['Klasemen Serie A lengkap dan statistik', 'Analisis taktis dalam prediksi', 'Statistik clean sheet dan pertahanan semua tim', 'Tips taruhan AI untuk semua pertandingan Serie A'],
      faq: [{ q: 'Bagaimana AI Anda menangani sifat taktis Serie A?', a: 'Model kami memberikan bobot lebih pada statistik pertahanan dan pola taktis, mencerminkan penekanan tradisional liga pada pertahanan terorganisir.' }, { q: 'Apakah pertandingan Coppa Italia termasuk?', a: 'Kami fokus pada pertandingan liga Serie A untuk akurasi prediksi optimal.' }],
    },
  },
  'la-liga': {
    EN: {
      title: 'La Liga AI Predictions & Spanish Football Betting',
      description: 'La Liga showcases Spanish football excellence with giants Real Madrid and Barcelona, plus strong challengers like Atletico Madrid and Real Sociedad. The league is renowned for technical football and has produced the most Ballon d\'Or winners.',
      whatWeOffer: 'What We Offer',
      faqTitle: 'Frequently Asked Questions',
      viewAllPredictions: 'View All La Liga Predictions',
      features: ['Real-time La Liga table and standings', 'Team statistics including goals and form', 'Analysis of El Clasico and major derbies', 'AI predictions for all Spanish top-flight matches'],
      faq: [{ q: 'How do you predict El Clasico matches?', a: 'Our AI uses extended historical data and specific rivalry patterns for matches between Real Madrid and Barcelona.' }, { q: 'Do predictions account for European competition fatigue?', a: 'Yes, our model factors in squad rotation and fixture congestion for teams in Champions League or Europa League.' }],
    },
    ES: {
      title: 'Predicciones IA de La Liga y Apuestas de Futbol Espanol',
      description: 'La Liga muestra la excelencia del futbol espanol con gigantes como Real Madrid y Barcelona, mas fuertes rivales como Atletico de Madrid y Real Sociedad. La liga es reconocida por su futbol tecnico.',
      whatWeOffer: 'Lo Que Ofrecemos',
      faqTitle: 'Preguntas Frecuentes',
      viewAllPredictions: 'Ver Todas las Predicciones de La Liga',
      features: ['Clasificacion de La Liga en tiempo real', 'Estadisticas de equipos incluyendo goles y forma', 'Analisis del Clasico y derbis importantes', 'Predicciones IA para todos los partidos de primera division'],
      faq: [{ q: 'Como predicen los partidos del Clasico?', a: 'Nuestra IA usa datos historicos extensos y patrones de rivalidad especificos para partidos entre Real Madrid y Barcelona.' }, { q: 'Las predicciones consideran la fatiga de competiciones europeas?', a: 'Si, nuestro modelo considera la rotacion de plantilla y congestion de partidos.' }],
    },
    PT: {
      title: 'Previsoes IA da La Liga e Apostas no Futebol Espanhol',
      description: 'A La Liga mostra a excelencia do futebol espanhol com gigantes como Real Madrid e Barcelona, alem de fortes desafiantes como Atletico de Madrid e Real Sociedad. A liga e conhecida pelo futebol tecnico.',
      whatWeOffer: 'O Que Oferecemos',
      faqTitle: 'Perguntas Frequentes',
      viewAllPredictions: 'Ver Todas as Previsoes da La Liga',
      features: ['Classificacao da La Liga em tempo real', 'Estatisticas de equipes incluindo gols e forma', 'Analise do El Clasico e grandes derbis', 'Previsoes IA para todos os jogos da primeira divisao espanhola'],
      faq: [{ q: 'Como voces preveem os jogos do Clasico?', a: 'Nossa IA usa dados historicos extensos e padroes de rivalidade especificos para jogos entre Real Madrid e Barcelona.' }, { q: 'As previsoes consideram a fadiga de competicoes europeias?', a: 'Sim, nosso modelo considera a rotacao de elenco e congestionamento de jogos.' }],
    },
    DE: {
      title: 'La Liga KI-Vorhersagen & Spanischer Fussball Wetten',
      description: 'La Liga zeigt spanische Fussballexzellenz mit Giganten wie Real Madrid und Barcelona sowie starken Herausforderern wie Atletico Madrid und Real Sociedad. Die Liga ist fur technischen Fussball bekannt.',
      whatWeOffer: 'Was Wir Bieten',
      faqTitle: 'Haufig Gestellte Fragen',
      viewAllPredictions: 'Alle La Liga Vorhersagen Anzeigen',
      features: ['Echtzeit La Liga Tabelle und Platzierungen', 'Teamstatistiken inklusive Tore und Form', 'Analyse von El Clasico und grossen Derbys', 'KI-Vorhersagen fur alle spanischen Erstligaspiele'],
      faq: [{ q: 'Wie sagen Sie El Clasico Spiele voraus?', a: 'Unsere KI verwendet erweiterte historische Daten und spezifische Rivalitasmuster fur Spiele zwischen Real Madrid und Barcelona.' }, { q: 'Berucksichtigen Vorhersagen europaische Wettbewerbs-Ermudung?', a: 'Ja, unser Modell berucksichtigt Kaderrotation und Spieluberlastung.' }],
    },
    FR: {
      title: 'Predictions IA La Liga & Paris Football Espagnol',
      description: 'La Liga met en valeur l\'excellence du football espagnol avec des geants comme le Real Madrid et Barcelone, ainsi que des challengers comme l\'Atletico Madrid et la Real Sociedad. La ligue est reputee pour son football technique.',
      whatWeOffer: 'Ce Que Nous Offrons',
      faqTitle: 'Questions Frequentes',
      viewAllPredictions: 'Voir Toutes les Predictions La Liga',
      features: ['Classement La Liga en temps reel', 'Statistiques d\'equipes incluant buts et forme', 'Analyse du Clasico et des grands derbys', 'Predictions IA pour tous les matchs de premiere division'],
      faq: [{ q: 'Comment predisez-vous les matchs du Clasico?', a: 'Notre IA utilise des donnees historiques etendues et des schemas de rivalite specifiques pour les matchs entre Real Madrid et Barcelone.' }, { q: 'Les predictions tiennent-elles compte de la fatigue europeenne?', a: 'Oui, notre modele prend en compte la rotation de l\'effectif et l\'encombrement du calendrier.' }],
    },
    JA: {
      title: 'ラ・リーガ AI予測＆スペインサッカーベッティング',
      description: 'ラ・リーガはレアル・マドリードとバルセロナの巨人、そしてアトレティコ・マドリードやレアル・ソシエダなどの強力なチャレンジャーでスペインサッカーの卓越性を示しています。技術的なサッカーで知られています。',
      whatWeOffer: '提供内容',
      faqTitle: 'よくある質問',
      viewAllPredictions: 'すべてのラ・リーガ予測を見る',
      features: ['リアルタイムのラ・リーガ順位表', 'ゴール数とフォームを含むチーム統計', 'エル・クラシコと主要ダービーの分析', '全スペイントップリーグ試合のAI予測'],
      faq: [{ q: 'エル・クラシコの試合をどう予測しますか?', a: '当社のAIはレアル・マドリードとバルセロナの試合に拡張された履歴データと特定のライバル関係パターンを使用します。' }, { q: '欧州大会の疲労は考慮されますか?', a: 'はい、モデルはスカッドローテーションと試合の過密スケジュールを考慮します。' }],
    },
    KO: {
      title: '라리가 AI 예측 및 스페인 축구 베팅',
      description: '라리가는 레알 마드리드와 바르셀로나 그리고 아틀레티코 마드리드, 레알 소시에다드 등 강력한 도전자들과 함께 스페인 축구의 우수성을 보여줍니다. 기술적인 축구로 유명합니다.',
      whatWeOffer: '제공 서비스',
      faqTitle: '자주 묻는 질문',
      viewAllPredictions: '모든 라리가 예측 보기',
      features: ['실시간 라리가 순위표', '골 수와 폼을 포함한 팀 통계', '엘 클라시코와 주요 더비 분석', '모든 스페인 1부 리그 경기 AI 예측'],
      faq: [{ q: '엘 클라시코 경기를 어떻게 예측하나요?', a: '당사의 AI는 레알 마드리드와 바르셀로나 경기에 확장된 과거 데이터와 특정 라이벌 패턴을 사용합니다.' }, { q: '유럽 대회 피로도를 고려하나요?', a: '네, 모델은 스쿼드 로테이션과 일정 과밀을 고려합니다.' }],
    },
    ZH: {
      title: '西甲AI预测与西班牙足球投注',
      description: '西甲展示了皇家马德里和巴塞罗那巨头以及马德里竞技、皇家社会等强劲挑战者的西班牙足球卓越。该联赛以技术足球著称。',
      whatWeOffer: '我们提供',
      faqTitle: '常见问题',
      viewAllPredictions: '查看所有西甲预测',
      features: ['实时西甲积分榜', '包括进球和状态的球队统计', '国家德比和重要德比分析', '所有西甲比赛的AI预测'],
      faq: [{ q: '如何预测国家德比?', a: '我们的AI使用扩展的历史数据和皇马与巴萨比赛的特定rivalry模式。' }, { q: '预测考虑欧洲赛事疲劳吗?', a: '是的,我们的模型考虑了球队轮换和赛程拥挤。' }],
    },
    TW: {
      title: '西甲AI預測與西班牙足球投注',
      description: '西甲展示了皇家馬德里和巴塞羅那巨頭以及馬德里競技、皇家社會等強勁挑戰者的西班牙足球卓越。該聯賽以技術足球著稱。',
      whatWeOffer: '我們提供',
      faqTitle: '常見問題',
      viewAllPredictions: '查看所有西甲預測',
      features: ['實時西甲積分榜', '包括進球和狀態的球隊統計', '國家德比和重要德比分析', '所有西甲比賽的AI預測'],
      faq: [{ q: '如何預測國家德比?', a: '我們的AI使用擴展的歷史數據和皇馬與巴薩比賽的特定rivalry模式。' }, { q: '預測考慮歐洲賽事疲勞嗎?', a: '是的,我們的模型考慮了球隊輪換和賽程擁擠。' }],
    },
    ID: {
      title: 'Prediksi AI La Liga & Taruhan Sepak Bola Spanyol',
      description: 'La Liga menampilkan keunggulan sepak bola Spanyol dengan raksasa Real Madrid dan Barcelona, serta penantang kuat seperti Atletico Madrid dan Real Sociedad. Liga ini terkenal dengan sepak bola teknis.',
      whatWeOffer: 'Yang Kami Tawarkan',
      faqTitle: 'Pertanyaan yang Sering Diajukan',
      viewAllPredictions: 'Lihat Semua Prediksi La Liga',
      features: ['Klasemen La Liga real-time', 'Statistik tim termasuk gol dan performa', 'Analisis El Clasico dan derbi besar', 'Prediksi AI untuk semua pertandingan divisi utama Spanyol'],
      faq: [{ q: 'Bagaimana Anda memprediksi pertandingan El Clasico?', a: 'AI kami menggunakan data historis yang diperluas dan pola persaingan khusus untuk pertandingan antara Real Madrid dan Barcelona.' }, { q: 'Apakah prediksi memperhitungkan kelelahan kompetisi Eropa?', a: 'Ya, model kami memperhitungkan rotasi skuad dan kepadatan jadwal.' }],
    },
  },
  'ligue-1': {
    EN: {
      title: 'Ligue 1 AI Predictions & French Football Betting Tips',
      description: 'Ligue 1 is France\'s elite football division featuring Paris Saint-Germain and rising clubs like Monaco, Lille, and Nice. Known for developing world-class talent and fast-paced football, Ligue 1 offers exciting betting opportunities.',
      whatWeOffer: 'What We Offer',
      faqTitle: 'Frequently Asked Questions',
      viewAllPredictions: 'View All Ligue 1 Predictions',
      features: ['Live Ligue 1 standings and team stats', 'Young talent impact analysis', 'Home and away form breakdowns', 'AI-powered predictions for French top-flight'],
      faq: [{ q: 'Is PSG always favored in your predictions?', a: 'While PSG\'s dominance is reflected in odds, our AI objectively assesses each match based on form, injuries, and head-to-head records.' }, { q: 'Do you cover Ligue 2?', a: 'Currently we focus on Ligue 1, the top French division.' }],
    },
    ES: {
      title: 'Predicciones IA de la Ligue 1 y Consejos de Apuestas',
      description: 'La Ligue 1 es la elite del futbol frances con Paris Saint-Germain y clubes emergentes como Monaco, Lille y Nice. Conocida por desarrollar talento de clase mundial y futbol rapido.',
      whatWeOffer: 'Lo Que Ofrecemos',
      faqTitle: 'Preguntas Frecuentes',
      viewAllPredictions: 'Ver Todas las Predicciones de Ligue 1',
      features: ['Clasificacion en vivo de la Ligue 1', 'Analisis del impacto de jovenes talentos', 'Desglose de forma en casa y fuera', 'Predicciones IA para la primera division francesa'],
      faq: [{ q: 'El PSG siempre es favorito en sus predicciones?', a: 'Aunque el dominio del PSG se refleja en las cuotas, nuestra IA evalua objetivamente cada partido.' }, { q: 'Cubren la Ligue 2?', a: 'Actualmente nos enfocamos en la Ligue 1, la primera division francesa.' }],
    },
    PT: {
      title: 'Previsoes IA da Ligue 1 e Dicas de Apostas',
      description: 'A Ligue 1 e a divisao de elite do futebol frances com Paris Saint-Germain e clubes emergentes como Monaco, Lille e Nice. Conhecida por desenvolver talentos de classe mundial e futebol rapido.',
      whatWeOffer: 'O Que Oferecemos',
      faqTitle: 'Perguntas Frequentes',
      viewAllPredictions: 'Ver Todas as Previsoes da Ligue 1',
      features: ['Classificacao ao vivo da Ligue 1', 'Analise do impacto de jovens talentos', 'Analise de desempenho em casa e fora', 'Previsoes IA para a primeira divisao francesa'],
      faq: [{ q: 'O PSG e sempre favorito nas suas previsoes?', a: 'Embora o dominio do PSG seja refletido nas odds, nossa IA avalia objetivamente cada partida.' }, { q: 'Voces cobrem a Ligue 2?', a: 'Atualmente focamos na Ligue 1, a primeira divisao francesa.' }],
    },
    DE: {
      title: 'Ligue 1 KI-Vorhersagen & Franzosischer Fussball Tipps',
      description: 'Die Ligue 1 ist Frankreichs Elite-Fussballliga mit Paris Saint-Germain und aufstrebenden Klubs wie Monaco, Lille und Nice. Bekannt fur die Entwicklung von Weltklasse-Talenten und schnellem Fussball.',
      whatWeOffer: 'Was Wir Bieten',
      faqTitle: 'Haufig Gestellte Fragen',
      viewAllPredictions: 'Alle Ligue 1 Vorhersagen Anzeigen',
      features: ['Live Ligue 1 Tabelle und Teamstatistiken', 'Analyse des Einflusses junger Talente', 'Heim- und Auswartsform-Aufschlusselung', 'KI-Vorhersagen fur die franzosische Erstliga'],
      faq: [{ q: 'Ist PSG immer Favorit in Ihren Vorhersagen?', a: 'Wahrend PSGs Dominanz in den Quoten reflektiert wird, bewertet unsere KI jedes Spiel objektiv.' }, { q: 'Decken Sie Ligue 2 ab?', a: 'Derzeit konzentrieren wir uns auf Ligue 1, die franzosische Erstliga.' }],
    },
    FR: {
      title: 'Predictions IA Ligue 1 & Conseils Paris Football Francais',
      description: 'La Ligue 1 est l\'elite du football francais avec le Paris Saint-Germain et des clubs montants comme Monaco, Lille et Nice. Connue pour developper des talents de classe mondiale et un football rapide.',
      whatWeOffer: 'Ce Que Nous Offrons',
      faqTitle: 'Questions Frequentes',
      viewAllPredictions: 'Voir Toutes les Predictions Ligue 1',
      features: ['Classement Ligue 1 en direct et statistiques', 'Analyse de l\'impact des jeunes talents', 'Analyse de forme a domicile et a l\'exterieur', 'Predictions IA pour l\'elite du football francais'],
      faq: [{ q: 'Le PSG est-il toujours favori dans vos predictions?', a: 'Bien que la domination du PSG soit refletee dans les cotes, notre IA evalue objectivement chaque match.' }, { q: 'Couvrez-vous la Ligue 2?', a: 'Actuellement, nous nous concentrons sur la Ligue 1, l\'elite du football francais.' }],
    },
    JA: {
      title: 'リーグ・アン AI予測＆フランスサッカーベッティングヒント',
      description: 'リーグ・アンはパリ・サンジェルマンとモナコ、リール、ニースなどの新興クラブを擁するフランスのエリートサッカーリーグです。ワールドクラスの才能育成と速いペースのサッカーで知られています。',
      whatWeOffer: '提供内容',
      faqTitle: 'よくある質問',
      viewAllPredictions: 'すべてのリーグ・アン予測を見る',
      features: ['ライブリーグ・アン順位表とチーム統計', '若手才能のインパクト分析', 'ホーム＆アウェイフォーム分析', 'フランストップリーグのAI予測'],
      faq: [{ q: 'PSGは常に予測で有利ですか?', a: 'PSGの優位性はオッズに反映されていますが、当社のAIは各試合を客観的に評価します。' }, { q: 'リーグ・ドゥはカバーしていますか?', a: '現在はフランストップリーグのリーグ・アンに注力しています。' }],
    },
    KO: {
      title: '리그1 AI 예측 및 프랑스 축구 베팅 팁',
      description: '리그1은 파리 생제르맹과 모나코, 릴, 니스 등 떠오르는 클럽이 참가하는 프랑스 엘리트 축구 리그입니다. 월드클래스 인재 육성과 빠른 템포의 축구로 유명합니다.',
      whatWeOffer: '제공 서비스',
      faqTitle: '자주 묻는 질문',
      viewAllPredictions: '모든 리그1 예측 보기',
      features: ['실시간 리그1 순위표 및 팀 통계', '젊은 재능 영향 분석', '홈 & 원정 폼 분석', '프랑스 최상위 리그 AI 예측'],
      faq: [{ q: 'PSG가 항상 예측에서 유리한가요?', a: 'PSG의 우위가 배당률에 반영되지만, 당사의 AI는 각 경기를 객관적으로 평가합니다.' }, { q: '리그2도 제공하나요?', a: '현재 프랑스 최상위 리그인 리그1에 집중하고 있습니다.' }],
    },
    ZH: {
      title: '法甲AI预测与法国足球投注技巧',
      description: '法甲是法国精英足球联赛,拥有巴黎圣日耳曼和摩纳哥、里尔、尼斯等新兴俱乐部。以培养世界级人才和快节奏足球闻名。',
      whatWeOffer: '我们提供',
      faqTitle: '常见问题',
      viewAllPredictions: '查看所有法甲预测',
      features: ['实时法甲积分榜和球队统计', '年轻人才影响分析', '主客场表现分析', '法国顶级联赛AI预测'],
      faq: [{ q: 'PSG在预测中总是被看好吗?', a: '虽然PSG的统治地位反映在赔率中,但我们的AI客观评估每场比赛。' }, { q: '您覆盖法乙吗?', a: '目前我们专注于法国顶级联赛法甲。' }],
    },
    TW: {
      title: '法甲AI預測與法國足球投注技巧',
      description: '法甲是法國精英足球聯賽,擁有巴黎聖日耳曼和摩納哥、里爾、尼斯等新興俱樂部。以培養世界級人才和快節奏足球聞名。',
      whatWeOffer: '我們提供',
      faqTitle: '常見問題',
      viewAllPredictions: '查看所有法甲預測',
      features: ['實時法甲積分榜和球隊統計', '年輕人才影響分析', '主客場表現分析', '法國頂級聯賽AI預測'],
      faq: [{ q: 'PSG在預測中總是被看好嗎?', a: '雖然PSG的統治地位反映在賠率中,但我們的AI客觀評估每場比賽。' }, { q: '您覆蓋法乙嗎?', a: '目前我們專注於法國頂級聯賽法甲。' }],
    },
    ID: {
      title: 'Prediksi AI Ligue 1 & Tips Taruhan Sepak Bola Prancis',
      description: 'Ligue 1 adalah divisi elit sepak bola Prancis yang menampilkan Paris Saint-Germain dan klub-klub berkembang seperti Monaco, Lille, dan Nice. Dikenal mengembangkan talenta kelas dunia dan sepak bola cepat.',
      whatWeOffer: 'Yang Kami Tawarkan',
      faqTitle: 'Pertanyaan yang Sering Diajukan',
      viewAllPredictions: 'Lihat Semua Prediksi Ligue 1',
      features: ['Klasemen Ligue 1 langsung dan statistik tim', 'Analisis dampak talenta muda', 'Analisis performa kandang dan tandang', 'Prediksi AI untuk kasta tertinggi Prancis'],
      faq: [{ q: 'Apakah PSG selalu difavoritkan dalam prediksi Anda?', a: 'Meskipun dominasi PSG tercermin dalam odds, AI kami menilai setiap pertandingan secara objektif.' }, { q: 'Apakah Anda meliput Ligue 2?', a: 'Saat ini kami fokus pada Ligue 1, divisi utama Prancis.' }],
    },
  },
  'champions-league': {
    EN: {
      title: 'Champions League AI Predictions & UCL Betting Analysis',
      description: 'The UEFA Champions League is Europe\'s premier club competition, featuring the continent\'s elite teams competing for the coveted trophy. From group stage to the final, our AI analyzes cross-league matchups and European pedigree.',
      whatWeOffer: 'What We Offer',
      faqTitle: 'Frequently Asked Questions',
      viewAllPredictions: 'View All Champions League Predictions',
      features: ['Champions League group and knockout standings', 'Cross-league team comparison analysis', 'Historical European performance data', 'AI predictions for all UCL matches'],
      faq: [{ q: 'How do you compare teams from different leagues?', a: 'Our AI uses coefficient-weighted statistics and historical European performance to fairly compare teams from different domestic leagues.' }, { q: 'Are Europa League matches covered?', a: 'We focus on Champions League for the most accurate predictions, with Europa League coverage planned.' }],
    },
    ES: {
      title: 'Predicciones IA de la Champions League y Analisis de Apuestas UCL',
      description: 'La UEFA Champions League es la principal competicion de clubes de Europa, con los equipos de elite del continente compitiendo por el codiciado trofeo. Desde la fase de grupos hasta la final.',
      whatWeOffer: 'Lo Que Ofrecemos',
      faqTitle: 'Preguntas Frecuentes',
      viewAllPredictions: 'Ver Todas las Predicciones de Champions League',
      features: ['Clasificacion de grupos y eliminatorias', 'Analisis comparativo entre ligas', 'Datos historicos de rendimiento europeo', 'Predicciones IA para todos los partidos UCL'],
      faq: [{ q: 'Como comparan equipos de diferentes ligas?', a: 'Nuestra IA usa estadisticas ponderadas por coeficiente y rendimiento historico europeo.' }, { q: 'Cubren partidos de Europa League?', a: 'Nos enfocamos en Champions League, con planes de cubrir Europa League.' }],
    },
    PT: {
      title: 'Previsoes IA da Champions League e Analise de Apostas UCL',
      description: 'A UEFA Champions League e a principal competicao de clubes da Europa, com as equipes de elite do continente competindo pelo cobicado trofeu. Da fase de grupos ate a final.',
      whatWeOffer: 'O Que Oferecemos',
      faqTitle: 'Perguntas Frequentes',
      viewAllPredictions: 'Ver Todas as Previsoes da Champions League',
      features: ['Classificacao de grupos e mata-mata', 'Analise comparativa entre ligas', 'Dados historicos de desempenho europeu', 'Previsoes IA para todos os jogos da UCL'],
      faq: [{ q: 'Como voces comparam equipes de diferentes ligas?', a: 'Nossa IA usa estatisticas ponderadas por coeficiente e desempenho historico europeu.' }, { q: 'Jogos da Europa League sao cobertos?', a: 'Focamos na Champions League, com planos de cobrir Europa League.' }],
    },
    DE: {
      title: 'Champions League KI-Vorhersagen & UCL Wettanalyse',
      description: 'Die UEFA Champions League ist Europas prestigetrachtigster Klubwettbewerb, in dem die Elite-Teams des Kontinents um die begehrte Trophae kampfen. Von der Gruppenphase bis zum Finale.',
      whatWeOffer: 'Was Wir Bieten',
      faqTitle: 'Haufig Gestellte Fragen',
      viewAllPredictions: 'Alle Champions League Vorhersagen Anzeigen',
      features: ['Gruppen- und K.O.-Runden-Tabellen', 'Ligaubergreifende Teamvergleichsanalyse', 'Historische europaische Leistungsdaten', 'KI-Vorhersagen fur alle UCL-Spiele'],
      faq: [{ q: 'Wie vergleichen Sie Teams aus verschiedenen Ligen?', a: 'Unsere KI verwendet koeffizientengewichtete Statistiken und historische europaische Leistung.' }, { q: 'Werden Europa League Spiele abgedeckt?', a: 'Wir konzentrieren uns auf die Champions League, mit Planen fur Europa League.' }],
    },
    FR: {
      title: 'Predictions IA Ligue des Champions & Analyse Paris UCL',
      description: 'La Ligue des Champions de l\'UEFA est la principale competition de clubs europeenne, reunissant les meilleures equipes du continent pour le trophee convoite. De la phase de groupes a la finale.',
      whatWeOffer: 'Ce Que Nous Offrons',
      faqTitle: 'Questions Frequentes',
      viewAllPredictions: 'Voir Toutes les Predictions Ligue des Champions',
      features: ['Classements des groupes et phases eliminatoires', 'Analyse comparative inter-ligues', 'Donnees historiques de performance europeenne', 'Predictions IA pour tous les matchs UCL'],
      faq: [{ q: 'Comment comparez-vous les equipes de differentes ligues?', a: 'Notre IA utilise des statistiques ponderees par coefficient et les performances historiques europeennes.' }, { q: 'Les matchs d\'Europa League sont-ils couverts?', a: 'Nous nous concentrons sur la Ligue des Champions, avec des plans pour l\'Europa League.' }],
    },
    JA: {
      title: 'チャンピオンズリーグ AI予測＆UCLベッティング分析',
      description: 'UEFAチャンピオンズリーグはヨーロッパ最高峰のクラブ大会で、大陸のエリートチームが名誉あるトロフィーを争います。グループステージから決勝まで。',
      whatWeOffer: '提供内容',
      faqTitle: 'よくある質問',
      viewAllPredictions: 'すべてのチャンピオンズリーグ予測を見る',
      features: ['チャンピオンズリーグのグループ＆ノックアウト順位表', 'リーグ間のチーム比較分析', '歴史的な欧州パフォーマンスデータ', '全UCL試合のAI予測'],
      faq: [{ q: '異なるリーグのチームをどう比較しますか?', a: '当社のAIは係数加重統計と歴史的な欧州パフォーマンスを使用してチームを公平に比較します。' }, { q: 'ヨーロッパリーグの試合はカバーしていますか?', a: 'チャンピオンズリーグに注力しており、ヨーロッパリーグのカバーを計画中です。' }],
    },
    KO: {
      title: '챔피언스리그 AI 예측 및 UCL 베팅 분석',
      description: 'UEFA 챔피언스리그는 유럽 최고의 클럽 대회로, 대륙의 엘리트 팀들이 명예로운 트로피를 놓고 경쟁합니다. 조별 리그부터 결승까지.',
      whatWeOffer: '제공 서비스',
      faqTitle: '자주 묻는 질문',
      viewAllPredictions: '모든 챔피언스리그 예측 보기',
      features: ['챔피언스리그 조별 및 토너먼트 순위', '리그 간 팀 비교 분석', '과거 유럽 대회 성적 데이터', '모든 UCL 경기 AI 예측'],
      faq: [{ q: '다른 리그의 팀을 어떻게 비교하나요?', a: '당사의 AI는 계수 가중 통계와 과거 유럽 대회 성적을 사용하여 팀을 공정하게 비교합니다.' }, { q: '유로파리그 경기도 제공하나요?', a: '챔피언스리그에 집중하고 있으며, 유로파리그 확장을 계획 중입니다.' }],
    },
    ZH: {
      title: '欧冠AI预测与UCL投注分析',
      description: 'UEFA欧洲冠军联赛是欧洲最高水平的俱乐部赛事,大陆精英球队争夺这一令人垂涎的奖杯。从小组赛到决赛。',
      whatWeOffer: '我们提供',
      faqTitle: '常见问题',
      viewAllPredictions: '查看所有欧冠预测',
      features: ['欧冠小组赛和淘汰赛排名', '跨联赛球队比较分析', '历史欧战表现数据', '所有UCL比赛的AI预测'],
      faq: [{ q: '如何比较不同联赛的球队?', a: '我们的AI使用系数加权统计和历史欧战表现来公平比较不同国内联赛的球队。' }, { q: '覆盖欧联杯比赛吗?', a: '我们专注于欧冠以获得最准确的预测,计划扩展到欧联杯。' }],
    },
    TW: {
      title: '歐冠AI預測與UCL投注分析',
      description: 'UEFA歐洲冠軍聯賽是歐洲最高水平的俱樂部賽事,大陸精英球隊爭奪這一令人垂涎的獎杯。從小組賽到決賽。',
      whatWeOffer: '我們提供',
      faqTitle: '常見問題',
      viewAllPredictions: '查看所有歐冠預測',
      features: ['歐冠小組賽和淘汰賽排名', '跨聯賽球隊比較分析', '歷史歐戰表現數據', '所有UCL比賽的AI預測'],
      faq: [{ q: '如何比較不同聯賽的球隊?', a: '我們的AI使用係數加權統計和歷史歐戰表現來公平比較不同國內聯賽的球隊。' }, { q: '覆蓋歐聯杯比賽嗎?', a: '我們專注於歐冠以獲得最準確的預測,計劃擴展到歐聯杯。' }],
    },
    ID: {
      title: 'Prediksi AI Liga Champions & Analisis Taruhan UCL',
      description: 'Liga Champions UEFA adalah kompetisi klub utama Eropa, menampilkan tim-tim elit benua yang bersaing memperebutkan trofi yang didambakan. Dari fase grup hingga final.',
      whatWeOffer: 'Yang Kami Tawarkan',
      faqTitle: 'Pertanyaan yang Sering Diajukan',
      viewAllPredictions: 'Lihat Semua Prediksi Liga Champions',
      features: ['Klasemen grup dan knockout Liga Champions', 'Analisis perbandingan tim antar liga', 'Data performa Eropa historis', 'Prediksi AI untuk semua pertandingan UCL'],
      faq: [{ q: 'Bagaimana Anda membandingkan tim dari liga berbeda?', a: 'AI kami menggunakan statistik tertimbang koefisien dan performa historis Eropa untuk membandingkan tim secara adil.' }, { q: 'Apakah pertandingan Liga Europa termasuk?', a: 'Kami fokus pada Liga Champions, dengan rencana untuk Liga Europa.' }],
    },
  },
};

// Map translation codes to SEO content keys
const translationCodeToSEOKey: Record<string, string> = {
  'EN': 'EN',
  'ES': 'ES',
  'PT': 'PT',
  'DE': 'DE',
  'FR': 'FR',
  'JA': 'JA',
  'KO': 'KO',
  '中文': 'ZH',
  '繁體': 'TW',
  'ID': 'ID',
};

// Helper to get SEO content for current language
const getSEOContent = (leagueSlug: string, lang: string): SEOContent | null => {
  const leagueContent = LEAGUES_SEO_CONTENT[leagueSlug];
  if (!leagueContent) return null;
  const seoKey = translationCodeToSEOKey[lang] || 'EN';
  return leagueContent[seoKey] || leagueContent['EN'] || null;
};

export default function LeagueDetailPage() {
  const params = useParams();
  const urlLocale = (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';
  const leagueSlug = params.league as string;
  const leagueConfig = LEAGUES_CONFIG[leagueSlug];

  // Helper function for locale-aware paths
  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  // Helper for language dropdown URLs
  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = `/leagues/${leagueSlug}`;
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const [mounted, setMounted] = useState(false);
  const [teamStats, setTeamStats] = useState<TeamWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
  const [selectedFormations, setSelectedFormations] = useState<Record<number, string>>({});
  const [playerStats, setPlayerStats] = useState<Record<number, PlayerStats[]>>({});
  const [loadingPlayers, setLoadingPlayers] = useState<number | null>(null);
  const [coaches, setCoaches] = useState<Record<number, Coach>>({});
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  // Translation helper
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  // Wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
          <Link href={localePath('/leagues')} className="text-emerald-400 hover:underline">
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
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden"
              >
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

              {/* Auth Buttons for Mobile */}
              {!user && (
                <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
                  <Link
                    href={localePath('/login')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all font-medium"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href={localePath('/get-started')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
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
          <Link href={localePath('/leagues')} className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors mb-6">
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
              href={localePath(`/leagues/${leagueSlug}/players`)}
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
                  {(() => {
                    const totalGoals = teamStats.reduce((sum, t) => sum + (t.goals_for_total || 0), 0);
                    const totalMatches = teamStats.reduce((sum, t) => sum + (t.total_played || 0), 0) / 2; // Each match counted twice
                    return totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : '0.00';
                  })()}
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
              <>
              {/* Desktop Table */}
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full">
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
                              href={localePath(`/leagues/${leagueSlug}/${team.team_name?.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-')}`)}
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
                                      <p className="text-2xl font-bold text-purple-400">
                                        {team.total_played && team.total_played > 0
                                          ? ((team.goals_for_total || 0) / team.total_played).toFixed(2)
                                          : '0.00'}
                                      </p>
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
                                      <>
                                      {/* Desktop Table */}
                                      <div className="overflow-x-auto rounded-xl border border-white/10 hidden md:block">
                                        <table className="w-full">
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
                                                    href={localePath(`/leagues/${leagueSlug}/player/${player.id}`)}
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

                                      {/* Mobile Player Cards */}
                                      <div className="md:hidden space-y-2">
                                        {playerStats[team.team_id].map((player) => (
                                          <div key={player.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                            {/* Row 1: Photo, Name, Position, Rating */}
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                {player.photo ? (
                                                  <img src={player.photo} alt={player.player_name || ''} className="w-10 h-10 rounded-full object-cover bg-gray-700" />
                                                ) : (
                                                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
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
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-gray-500 text-[10px]">{player.nationality}</span>
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
                                                <span className={`px-2 py-1 rounded text-sm font-bold ${
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
                                            </div>

                                            {/* Row 2: Stats */}
                                            <div className="grid grid-cols-6 gap-1 text-center text-xs mb-2 py-2 border-t border-b border-white/5">
                                              <div>
                                                <span className="text-gray-500 block text-[10px]">{t('age')}</span>
                                                <span className="text-gray-300">{player.age || '-'}</span>
                                              </div>
                                              <div>
                                                <span className="text-gray-500 block text-[10px]">{t('apps')}</span>
                                                <span className="text-gray-300">{player.appearances || 0}</span>
                                              </div>
                                              <div>
                                                <span className="text-gray-500 block text-[10px]">{t('mins')}</span>
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
                                              <div>
                                                <span className="text-gray-500 block text-[10px]">Y/R</span>
                                                <span>
                                                  <span className="text-yellow-400">{player.cards_yellow || 0}</span>
                                                  <span className="text-gray-600">/</span>
                                                  <span className="text-red-400">{player.cards_red || 0}</span>
                                                </span>
                                              </div>
                                            </div>

                                            {/* Row 3: View Profile */}
                                            <div className="flex justify-end">
                                              <Link
                                                href={localePath(`/leagues/${leagueSlug}/player/${player.id}`)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                                              >
                                                {t('viewProfile')}
                                              </Link>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      </>
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

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-2">
                {teamStats.map((team, index) => (
                  <div
                    key={team.id}
                    onClick={() => handleTeamClick(team)}
                    className={`bg-white/5 rounded-lg p-3 border cursor-pointer transition-colors hover:bg-white/10 ${
                      index < 4 ? 'border-l-2 border-l-emerald-500 border-white/5' :
                      index >= teamStats.length - 3 ? 'border-l-2 border-l-red-500 border-white/5' : 'border-white/5'
                    } ${expandedTeamId === team.id ? 'bg-white/10' : ''}`}
                  >
                    {/* Row 1: Rank, Team, Points */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          index < 4 ? 'bg-emerald-500/20 text-emerald-400' :
                          index >= teamStats.length - 3 ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-700/50 text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                        {team.logo && (
                          <img src={team.logo} alt={team.team_name || ''} className="w-7 h-7 object-contain" />
                        )}
                        <span className="text-white font-medium text-sm">{team.team_name}</span>
                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${expandedTeamId === team.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <span className="inline-flex items-center justify-center min-w-[36px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-sm">
                        {team.points}
                      </span>
                    </div>

                    {/* Row 2: Stats Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                      <div>
                        <span className="text-gray-500 block text-[10px]">P</span>
                        <span className="text-gray-300">{team.total_played || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">W</span>
                        <span className="text-emerald-400 font-medium">{team.total_wins || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">D</span>
                        <span className="text-yellow-400">{team.total_draws || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">L</span>
                        <span className="text-red-400">{team.total_loses || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">GF</span>
                        <span className="text-gray-300">{team.goals_for_total || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">GA</span>
                        <span className="text-gray-300">{team.goals_against_total || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">GD</span>
                        <span className={`font-medium ${
                          team.goal_difference > 0 ? 'text-emerald-400' :
                          team.goal_difference < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                        </span>
                      </div>
                    </div>

                    {/* Row 3: Form & Profile */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        {renderForm(team.form)}
                      </div>
                      <Link
                        href={localePath(`/leagues/${leagueSlug}/${team.team_name?.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-')}`)}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                      >
                        {t('profile')}
                      </Link>
                    </div>

                    {/* Expanded Details (Mobile) */}
                    {expandedTeamId === team.id && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="space-y-3">
                          {/* Coach */}
                          {team.team_id && coaches[team.team_id] && (
                            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-900/50">
                              {coaches[team.team_id].photo ? (
                                <img
                                  src={coaches[team.team_id].photo || undefined}
                                  alt={coaches[team.team_id].name || ''}
                                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-emerald-500/30">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <p className="text-gray-400 text-[10px] uppercase">{t('coach')}</p>
                                <p className="text-white text-sm font-medium">{coaches[team.team_id].name}</p>
                              </div>
                            </div>
                          )}

                          {/* Formation */}
                          {team.team_id && selectedFormations[team.team_id] && (
                            <div className="p-2 rounded-lg bg-gray-900/50">
                              <p className="text-gray-400 text-[10px] uppercase mb-1">{t('formation')}</p>
                              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-sm font-bold">
                                {selectedFormations[team.team_id]}
                              </span>
                            </div>
                          )}

                          {/* Top Scorers */}
                          {team.team_id && playerStats[team.team_id] && playerStats[team.team_id].length > 0 && (
                            <div className="p-2 rounded-lg bg-gray-900/50">
                              <p className="text-gray-400 text-[10px] uppercase mb-2">{t('topScorers')}</p>
                              <div className="space-y-1">
                                {playerStats[team.team_id].slice(0, 3).map((player) => (
                                  <div key={player.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {player.photo ? (
                                        <img src={player.photo} alt="" className="w-6 h-6 rounded-full object-cover" />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-700 text-[10px] flex items-center justify-center text-gray-400">
                                          {player.player_name?.charAt(0)}
                                        </div>
                                      )}
                                      <span className="text-white text-xs">{player.player_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="text-emerald-400 font-medium">{player.goals_total || 0}G</span>
                                      <span className="text-cyan-400">{player.assists || 0}A</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </>
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

      {/* SEO Content Section */}
      {leagueConfig && (() => {
        const seoContent = getSEOContent(leagueSlug, selectedLang);
        if (!seoContent) return null;
        return (
          <section className="relative z-10 py-16 px-4 bg-gradient-to-b from-[#0a0a0f] to-black">
            <div className="max-w-5xl mx-auto">
              {/* Main SEO Content */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {seoContent.title}
                </h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  {seoContent.description}
                </p>
              </div>

              {/* Features List */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold text-white mb-4">{seoContent.whatWeOffer}</h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  {seoContent.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-6">{seoContent.faqTitle}</h3>
                <div className="space-y-4">
                  {seoContent.faq.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-gray-900/50 border border-white/5">
                      <h4 className="font-medium text-white mb-2">{item.q}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-4">
                <Link
                  href={localePath('/predictions')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  {seoContent.viewAllPredictions}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

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
                <li><Link href={localePath('/responsible-gaming')} className="hover:text-emerald-400 transition-colors inline-block">{t('responsibleGaming')}</Link></li>
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
