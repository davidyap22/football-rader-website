'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, getUserSubscription, UserSubscription } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";

const translations: Record<string, Record<string, string>> = {
  EN: {
    pricing: "Pricing",
    pricingSubtitle: "Choose the plan that fits your needs",
    comingSoon: "Coming Soon",
    comingSoonDesc: "Flexible pricing plans will be available soon",
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance", community: "Community", news: "News",
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
    // Pricing cards
    freeTrial: "Free Trial", starter: "Starter", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/week", perMonth: "/month",
    choose1League: "Choose", oneLeague: "1 League",
    daysAccess: "access", sevenDays: "7 days",
    choose1Style: "Choose", oneBettingStyle: "1 Betting Style",
    aiPredictions: "AI Predictions & Signals",
    fromTop5: "from Top 5 + UEFA",
    all5Leagues: "All 5 Major Leagues", unlocked: "unlocked",
    uefaFifa: "UEFA CL + FIFA 2026", included: "included",
    all5LeaguesUefa: "All 5 Leagues + UEFA",
    all5Styles: "All 5 Betting Styles",
    prioritySupport: "Priority support",
    choose1LeagueLabel: "Choose 1 league:",
    choose1StyleLabel: "Choose 1 betting style:",
    everythingIncluded: "Everything included:",
    sixLeagues: "6 Leagues", fiveStyles: "5 Styles",
    startFreeTrial: "Start Free Trial",
    trialNote: "7-day free trial • No credit card",
    popular: "POPULAR",
    bettingStylesTitle: "Betting Styles Explained",
    availableLeaguesTitle: "Available Leagues",
    aggressive: "Aggressive", aggressiveDesc: "High risk, high reward picks",
    conservative: "Conservative", conservativeDesc: "Low risk, steady returns",
    balanced: "Balanced", balancedDesc: "Optimal risk-reward ratio",
    valueHunter: "Value Hunter", valueHunterDesc: "Best odds value picks",
    safePlay: "Safe Play", safePlayDesc: "Highest confidence picks",
    subscribe: "Subscribe", currentPlan: "Current Plan", managePlan: "Manage Plan", upgrade: "Upgrade",
    popularLeagues: "Popular Leagues",
    aiPredictionsFooter: "AI Predictions",
    aiFootballPredictions: "AI Football Predictions",
    onextwoPredictions: "1x2 Predictions",
    overUnderTips: "Over/Under Tips",
    handicapBetting: "Handicap Betting",
    aiBettingPerformance: "AI Betting Performance",
    footballTipsToday: "Football Tips Today",
    solution: "Solution",
    liveOdds: "AI Performance",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
    todayMatches: "Today Matches",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
  },
  ES: {
    pricing: "Precios",
    pricingSubtitle: "Elige el plan que se adapte a tus necesidades",
    comingSoon: "Próximamente",
    comingSoonDesc: "Planes de precios flexibles estarán disponibles pronto",
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA", community: "Comunidad", news: "Noticias",
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
    freeTrial: "Prueba Gratis", starter: "Básico", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/semana", perMonth: "/mes",
    choose1League: "Elige", oneLeague: "1 Liga",
    daysAccess: "acceso", sevenDays: "7 días",
    choose1Style: "Elige", oneBettingStyle: "1 Estilo de Apuesta",
    aiPredictions: "Predicciones IA y Señales",
    fromTop5: "de las Top 5 + UEFA",
    all5Leagues: "Las 5 Ligas Principales", unlocked: "desbloqueadas",
    uefaFifa: "UEFA CL + FIFA 2026", included: "incluidos",
    all5LeaguesUefa: "5 Ligas + UEFA",
    all5Styles: "5 Estilos de Apuesta",
    prioritySupport: "Soporte prioritario",
    choose1LeagueLabel: "Elige 1 liga:",
    choose1StyleLabel: "Elige 1 estilo:",
    everythingIncluded: "Todo incluido:",
    sixLeagues: "6 Ligas", fiveStyles: "5 Estilos",
    startFreeTrial: "Comenzar Prueba",
    trialNote: "7 días gratis • Sin tarjeta",
    popular: "POPULAR",
    bettingStylesTitle: "Estilos de Apuesta",
    availableLeaguesTitle: "Ligas Disponibles",
    aggressive: "Agresivo", aggressiveDesc: "Alto riesgo, alta recompensa",
    conservative: "Conservador", conservativeDesc: "Bajo riesgo, retornos estables",
    balanced: "Equilibrado", balancedDesc: "Ratio riesgo-recompensa óptimo",
    valueHunter: "Cazador de Valor", valueHunterDesc: "Mejores cuotas de valor",
    safePlay: "Juego Seguro", safePlayDesc: "Picks de mayor confianza",
    subscribe: "Suscribir", currentPlan: "Plan Actual", managePlan: "Gestionar Plan", upgrade: "Mejorar",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Predicciones IA",
    aiFootballPredictions: "Predicciones de Futbol IA",
    onextwoPredictions: "Predicciones 1x2",
    overUnderTips: "Consejos Over/Under",
    handicapBetting: "Apuestas Handicap",
    aiBettingPerformance: "Rendimiento de Apuestas IA",
    footballTipsToday: "Tips de Futbol Hoy",
    solution: "Solucion",
    liveOdds: "Rendimiento IA",
    communityFooter: "Comunidad",
    globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios",
    todayMatches: "Partidos de Hoy",
    disclaimer: "Aviso legal: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precision de las predicciones y no somos responsables de ninguna perdida financiera. El juego implica riesgo. Por favor juega responsablemente. Si usted o alguien que conoce tiene un problema con el juego, busque ayuda. Los usuarios deben tener 18+ años.",
  },
  PT: {
    pricing: "Preços",
    pricingSubtitle: "Escolha o plano que atende às suas necessidades",
    comingSoon: "Em Breve",
    comingSoonDesc: "Planos de preços flexíveis estarão disponíveis em breve",
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho IA", community: "Comunidade", news: "Notícias",
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
    freeTrial: "Teste Grátis", starter: "Iniciante", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/semana", perMonth: "/mês",
    choose1League: "Escolha", oneLeague: "1 Liga",
    daysAccess: "acesso", sevenDays: "7 dias",
    choose1Style: "Escolha", oneBettingStyle: "1 Estilo de Aposta",
    aiPredictions: "Previsões IA e Sinais",
    fromTop5: "das Top 5 + UEFA",
    all5Leagues: "As 5 Ligas Principais", unlocked: "desbloqueadas",
    uefaFifa: "UEFA CL + FIFA 2026", included: "incluídos",
    all5LeaguesUefa: "5 Ligas + UEFA",
    all5Styles: "5 Estilos de Aposta",
    prioritySupport: "Suporte prioritário",
    choose1LeagueLabel: "Escolha 1 liga:",
    choose1StyleLabel: "Escolha 1 estilo:",
    everythingIncluded: "Tudo incluído:",
    sixLeagues: "6 Ligas", fiveStyles: "5 Estilos",
    startFreeTrial: "Começar Teste",
    trialNote: "7 dias grátis • Sem cartão",
    popular: "POPULAR",
    bettingStylesTitle: "Estilos de Aposta",
    availableLeaguesTitle: "Ligas Disponíveis",
    aggressive: "Agressivo", aggressiveDesc: "Alto risco, alta recompensa",
    conservative: "Conservador", conservativeDesc: "Baixo risco, retornos estáveis",
    balanced: "Equilibrado", balancedDesc: "Proporção risco-recompensa ideal",
    valueHunter: "Caçador de Valor", valueHunterDesc: "Melhores odds de valor",
    safePlay: "Jogo Seguro", safePlayDesc: "Picks de maior confiança",
    subscribe: "Assinar", currentPlan: "Plano Atual", managePlan: "Gerenciar Plano", upgrade: "Atualizar",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Previsões IA",
    aiFootballPredictions: "Previsões de Futebol IA",
    onextwoPredictions: "Previsões 1x2",
    overUnderTips: "Dicas Over/Under",
    handicapBetting: "Apostas Handicap",
    aiBettingPerformance: "Desempenho de Apostas IA",
    footballTipsToday: "Dicas de Futebol Hoje",
    solution: "Solucao",
    liveOdds: "Desempenho IA",
    communityFooter: "Comunidade",
    globalChat: "Chat Global",
    userPredictions: "Previsoes de Usuarios",
    todayMatches: "Jogos de Hoje",
    disclaimer: "Aviso legal: OddsFlow fornece previsoes baseadas em IA apenas para fins informativos e de entretenimento. Nao garantimos a precisao das previsoes e nao somos responsaveis por quaisquer perdas financeiras. Apostas envolvem risco. Por favor aposte com responsabilidade. Se voce ou alguem que conhece tem um problema com jogos, procure ajuda. Usuarios devem ter 18+ anos.",
  },
  DE: {
    pricing: "Preise",
    pricingSubtitle: "Wählen Sie den Plan, der Ihren Bedürfnissen entspricht",
    comingSoon: "Demnächst",
    comingSoonDesc: "Flexible Preispläne werden bald verfügbar sein",
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung", community: "Community", news: "Nachrichten",
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
    freeTrial: "Kostenlos Testen", starter: "Starter", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/Woche", perMonth: "/Monat",
    choose1League: "Wähle", oneLeague: "1 Liga",
    daysAccess: "Zugang", sevenDays: "7 Tage",
    choose1Style: "Wähle", oneBettingStyle: "1 Wettstil",
    aiPredictions: "KI-Vorhersagen & Signale",
    fromTop5: "aus Top 5 + UEFA",
    all5Leagues: "Alle 5 Hauptligen", unlocked: "freigeschaltet",
    uefaFifa: "UEFA CL + FIFA 2026", included: "inklusive",
    all5LeaguesUefa: "5 Ligen + UEFA",
    all5Styles: "5 Wettstile",
    prioritySupport: "Prioritäts-Support",
    choose1LeagueLabel: "Wähle 1 Liga:",
    choose1StyleLabel: "Wähle 1 Stil:",
    everythingIncluded: "Alles inklusive:",
    sixLeagues: "6 Ligen", fiveStyles: "5 Stile",
    startFreeTrial: "Kostenlos Starten",
    trialNote: "7 Tage kostenlos • Keine Karte",
    popular: "BELIEBT",
    bettingStylesTitle: "Wettstile Erklärt",
    availableLeaguesTitle: "Verfügbare Ligen",
    aggressive: "Aggressiv", aggressiveDesc: "Hohes Risiko, hohe Belohnung",
    conservative: "Konservativ", conservativeDesc: "Niedriges Risiko, stabile Erträge",
    balanced: "Ausgewogen", balancedDesc: "Optimales Risiko-Ertrags-Verhältnis",
    valueHunter: "Wertjäger", valueHunterDesc: "Beste Quotenwert-Picks",
    safePlay: "Sicheres Spiel", safePlayDesc: "Picks mit höchster Zuversicht",
    subscribe: "Abonnieren", currentPlan: "Aktueller Plan", managePlan: "Plan Verwalten", upgrade: "Upgrade",
    popularLeagues: "Beliebte Ligen",
    aiPredictionsFooter: "KI-Vorhersagen",
    aiFootballPredictions: "KI-Fussballvorhersagen",
    onextwoPredictions: "1x2 Vorhersagen",
    overUnderTips: "Über/Unter Tipps",
    handicapBetting: "Handicap-Wetten",
    aiBettingPerformance: "KI-Wettleistung",
    footballTipsToday: "Fussballtipps Heute",
    solution: "Losung",
    liveOdds: "KI-Leistung",
    communityFooter: "Community",
    globalChat: "Globaler Chat",
    userPredictions: "Benutzervorhersagen",
    todayMatches: "Heutige Spiele",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestutzte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Wir garantieren nicht die Genauigkeit der Vorhersagen und sind nicht verantwortlich fur finanzielle Verluste. Glucksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll. Wenn Sie oder jemand den Sie kennen ein Glucksspielproblem hat, suchen Sie Hilfe. Benutzer mussen 18+ Jahre alt sein.",
  },
  FR: {
    pricing: "Tarifs",
    pricingSubtitle: "Choisissez le plan qui correspond à vos besoins",
    comingSoon: "Bientôt Disponible",
    comingSoonDesc: "Des plans tarifaires flexibles seront bientôt disponibles",
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance IA", community: "Communauté", news: "Actualités",
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
    freeTrial: "Essai Gratuit", starter: "Débutant", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/semaine", perMonth: "/mois",
    choose1League: "Choisir", oneLeague: "1 Ligue",
    daysAccess: "accès", sevenDays: "7 jours",
    choose1Style: "Choisir", oneBettingStyle: "1 Style de Pari",
    aiPredictions: "Prédictions IA & Signaux",
    fromTop5: "du Top 5 + UEFA",
    all5Leagues: "Les 5 Ligues Majeures", unlocked: "débloquées",
    uefaFifa: "UEFA CL + FIFA 2026", included: "inclus",
    all5LeaguesUefa: "5 Ligues + UEFA",
    all5Styles: "5 Styles de Pari",
    prioritySupport: "Support prioritaire",
    choose1LeagueLabel: "Choisir 1 ligue:",
    choose1StyleLabel: "Choisir 1 style:",
    everythingIncluded: "Tout inclus:",
    sixLeagues: "6 Ligues", fiveStyles: "5 Styles",
    startFreeTrial: "Essai Gratuit",
    trialNote: "7 jours gratuits • Sans carte",
    popular: "POPULAIRE",
    bettingStylesTitle: "Styles de Pari",
    availableLeaguesTitle: "Ligues Disponibles",
    aggressive: "Agressif", aggressiveDesc: "Risque élevé, récompense élevée",
    conservative: "Conservateur", conservativeDesc: "Faible risque, rendements stables",
    balanced: "Équilibré", balancedDesc: "Ratio risque-récompense optimal",
    valueHunter: "Chasseur de Valeur", valueHunterDesc: "Meilleures cotes de valeur",
    safePlay: "Jeu Sûr", safePlayDesc: "Picks de haute confiance",
    subscribe: "S'abonner", currentPlan: "Plan Actuel", managePlan: "Gérer le Plan", upgrade: "Mettre à niveau",
    popularLeagues: "Ligues Populaires",
    aiPredictionsFooter: "Prédictions IA",
    aiFootballPredictions: "Prédictions Football IA",
    onextwoPredictions: "Prédictions 1x2",
    overUnderTips: "Conseils Over/Under",
    handicapBetting: "Paris Handicap",
    aiBettingPerformance: "Performance Paris IA",
    footballTipsToday: "Pronostics Foot Aujourd'hui",
    solution: "Solution",
    liveOdds: "Performance IA",
    communityFooter: "Communaute",
    globalChat: "Chat Global",
    userPredictions: "Predictions Utilisateurs",
    todayMatches: "Matchs du Jour",
    disclaimer: "Avertissement: OddsFlow fournit des predictions basees sur l'IA a des fins d'information et de divertissement uniquement. Nous ne garantissons pas l'exactitude des predictions et ne sommes pas responsables des pertes financieres. Le jeu comporte des risques. Veuillez jouer de maniere responsable. Si vous ou quelqu'un que vous connaissez a un probleme de jeu, veuillez chercher de l'aide. Les utilisateurs doivent avoir 18+ ans.",
  },
  JA: {
    pricing: "料金",
    pricingSubtitle: "ニーズに合ったプランをお選びください",
    comingSoon: "近日公開",
    comingSoonDesc: "柔軟な料金プランを準備中です",
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "AIパフォーマンス", community: "コミュニティ", news: "ニュース",
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
    freeTrial: "無料トライアル", starter: "スターター", pro: "プロ", ultimate: "アルティメット",
    perWeek: "/週", perMonth: "/月",
    choose1League: "選択", oneLeague: "1リーグ",
    daysAccess: "アクセス", sevenDays: "7日間",
    choose1Style: "選択", oneBettingStyle: "1ベッティングスタイル",
    aiPredictions: "AI予測＆シグナル",
    fromTop5: "トップ5 + UEFAから",
    all5Leagues: "5大リーグすべて", unlocked: "解放",
    uefaFifa: "UEFA CL + FIFA 2026", included: "含む",
    all5LeaguesUefa: "5リーグ + UEFA",
    all5Styles: "5つのベッティングスタイル",
    prioritySupport: "優先サポート",
    choose1LeagueLabel: "1リーグを選択:",
    choose1StyleLabel: "1スタイルを選択:",
    everythingIncluded: "すべて含む:",
    sixLeagues: "6リーグ", fiveStyles: "5スタイル",
    startFreeTrial: "無料で始める",
    trialNote: "7日間無料 • カード不要",
    popular: "人気",
    bettingStylesTitle: "ベッティングスタイル説明",
    availableLeaguesTitle: "利用可能なリーグ",
    aggressive: "アグレッシブ", aggressiveDesc: "ハイリスク、ハイリターン",
    conservative: "コンサバティブ", conservativeDesc: "低リスク、安定リターン",
    balanced: "バランス", balancedDesc: "最適なリスクリターン比",
    valueHunter: "バリューハンター", valueHunterDesc: "最高価値のオッズ",
    safePlay: "セーフプレイ", safePlayDesc: "最高信頼度のピック",
    subscribe: "購読する", currentPlan: "現在のプラン", managePlan: "プラン管理", upgrade: "アップグレード",
    popularLeagues: "人気リーグ",
    aiPredictionsFooter: "AI予測",
    aiFootballPredictions: "AIサッカー予測",
    onextwoPredictions: "1x2予測",
    overUnderTips: "オーバー/アンダー予想",
    handicapBetting: "ハンディキャップベット",
    aiBettingPerformance: "AIベッティング実績",
    footballTipsToday: "今日のサッカー予想",
    solution: "ソリューション",
    liveOdds: "AIパフォーマンス",
    communityFooter: "コミュニティ",
    globalChat: "グローバルチャット",
    userPredictions: "ユーザー予測",
    todayMatches: "今日の試合",
    disclaimer: "免責事項: OddsFlowは情報および娯楽目的のみでAI駆動の予測を提供しています。予測の正確性を保証せず、いかなる財務損失についても責任を負いません。ギャンブルにはリスクが伴います。責任を持ってお楽しみください。あなたまたはあなたの知人がギャンブル問題を抱えている場合は、助けを求めてください。ユーザーは18歳以上である必要があります。",
  },
  KO: {
    pricing: "가격",
    pricingSubtitle: "필요에 맞는 플랜을 선택하세요",
    comingSoon: "곧 출시 예정",
    comingSoonDesc: "유연한 가격 플랜이 곧 제공될 예정입니다",
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성능", community: "커뮤니티", news: "뉴스",
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
    freeTrial: "무료 체험", starter: "스타터", pro: "프로", ultimate: "얼티밋",
    perWeek: "/주", perMonth: "/월",
    choose1League: "선택", oneLeague: "1개 리그",
    daysAccess: "이용", sevenDays: "7일",
    choose1Style: "선택", oneBettingStyle: "1개 베팅 스타일",
    aiPredictions: "AI 예측 & 시그널",
    fromTop5: "Top 5 + UEFA 중",
    all5Leagues: "5대 리그 전체", unlocked: "해제",
    uefaFifa: "UEFA CL + FIFA 2026", included: "포함",
    all5LeaguesUefa: "5개 리그 + UEFA",
    all5Styles: "5개 베팅 스타일",
    prioritySupport: "우선 지원",
    choose1LeagueLabel: "1개 리그 선택:",
    choose1StyleLabel: "1개 스타일 선택:",
    everythingIncluded: "모두 포함:",
    sixLeagues: "6개 리그", fiveStyles: "5개 스타일",
    startFreeTrial: "무료 시작",
    trialNote: "7일 무료 • 카드 불필요",
    popular: "인기",
    bettingStylesTitle: "베팅 스타일 설명",
    availableLeaguesTitle: "이용 가능한 리그",
    aggressive: "공격적", aggressiveDesc: "고위험, 고수익",
    conservative: "보수적", conservativeDesc: "저위험, 안정 수익",
    balanced: "균형", balancedDesc: "최적의 위험-수익 비율",
    valueHunter: "가치 헌터", valueHunterDesc: "최고 가치 배당",
    safePlay: "안전 플레이", safePlayDesc: "최고 신뢰도 픽",
    subscribe: "구독하기", currentPlan: "현재 플랜", managePlan: "플랜 관리", upgrade: "업그레이드",
    popularLeagues: "인기 리그",
    aiPredictionsFooter: "AI 예측",
    aiFootballPredictions: "AI 축구 예측",
    onextwoPredictions: "1x2 예측",
    overUnderTips: "오버/언더 팁",
    handicapBetting: "핸디캡 베팅",
    aiBettingPerformance: "AI 베팅 성과",
    footballTipsToday: "오늘의 축구 팁",
    solution: "솔루션",
    liveOdds: "AI 성능",
    communityFooter: "커뮤니티",
    globalChat: "글로벌 채팅",
    userPredictions: "사용자 예측",
    todayMatches: "오늘 경기",
    disclaimer: "면책조항: OddsFlow는 정보 및 오락 목적으로만 AI 기반 예측을 제공합니다. 예측의 정확성을 보장하지 않으며 어떠한 재정적 손실에 대해서도 책임지지 않습니다. 도박에는 위험이 따릅니다. 책임감 있게 즐기세요. 본인 또는 아는 사람이 도박 문제가 있다면 도움을 구하세요. 사용자는 18세 이상이어야 합니다.",
  },
  '中文': {
    pricing: "价格",
    pricingSubtitle: "选择适合您需求的计划",
    comingSoon: "即将推出",
    comingSoonDesc: "灵活的定价计划即将上线",
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现", community: "社区", news: "新闻",
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
    freeTrial: "免费试用", starter: "入门版", pro: "专业版", ultimate: "旗舰版",
    perWeek: "/周", perMonth: "/月",
    choose1League: "选择", oneLeague: "1个联赛",
    daysAccess: "使用权限", sevenDays: "7天",
    choose1Style: "选择", oneBettingStyle: "1种投注风格",
    aiPredictions: "AI预测和信号",
    fromTop5: "从五大联赛 + UEFA中",
    all5Leagues: "全部5大联赛", unlocked: "已解锁",
    uefaFifa: "UEFA CL + FIFA 2026", included: "包含",
    all5LeaguesUefa: "5大联赛 + UEFA",
    all5Styles: "5种投注风格",
    prioritySupport: "优先支持",
    choose1LeagueLabel: "选择1个联赛:",
    choose1StyleLabel: "选择1种风格:",
    everythingIncluded: "全部包含:",
    sixLeagues: "6个联赛", fiveStyles: "5种风格",
    startFreeTrial: "开始免费试用",
    trialNote: "7天免费 • 无需信用卡",
    popular: "热门",
    bettingStylesTitle: "投注风格说明",
    availableLeaguesTitle: "可用联赛",
    aggressive: "激进型", aggressiveDesc: "高风险，高回报",
    conservative: "保守型", conservativeDesc: "低风险，稳定回报",
    balanced: "平衡型", balancedDesc: "最佳风险回报比",
    valueHunter: "价值猎手", valueHunterDesc: "最佳赔率价值",
    safePlay: "稳妥型", safePlayDesc: "最高置信度选择",
    subscribe: "订阅", currentPlan: "当前套餐", managePlan: "管理套餐", upgrade: "升级",
    popularLeagues: "热门联赛",
    aiPredictionsFooter: "AI 预测",
    aiFootballPredictions: "AI 足球预测",
    onextwoPredictions: "1x2 预测",
    overUnderTips: "大小球建议",
    handicapBetting: "让球盘投注",
    aiBettingPerformance: "AI 投注表现",
    footballTipsToday: "今日足球贴士",
    solution: "解决方案",
    liveOdds: "AI表现",
    communityFooter: "社区",
    globalChat: "全球聊天",
    userPredictions: "用户预测",
    todayMatches: "今日比赛",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
  },
  '繁體': {
    pricing: "價格",
    pricingSubtitle: "選擇適合您需求的計劃",
    comingSoon: "即將推出",
    comingSoonDesc: "靈活的定價計劃即將上線",
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現", community: "社區", news: "新聞",
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
    freeTrial: "免費試用", starter: "入門版", pro: "專業版", ultimate: "旗艦版",
    perWeek: "/週", perMonth: "/月",
    choose1League: "選擇", oneLeague: "1個聯賽",
    daysAccess: "使用權限", sevenDays: "7天",
    choose1Style: "選擇", oneBettingStyle: "1種投注風格",
    aiPredictions: "AI預測和信號",
    fromTop5: "從五大聯賽 + UEFA中",
    all5Leagues: "全部5大聯賽", unlocked: "已解鎖",
    uefaFifa: "UEFA CL + FIFA 2026", included: "包含",
    all5LeaguesUefa: "5大聯賽 + UEFA",
    all5Styles: "5種投注風格",
    prioritySupport: "優先支援",
    choose1LeagueLabel: "選擇1個聯賽:",
    choose1StyleLabel: "選擇1種風格:",
    everythingIncluded: "全部包含:",
    sixLeagues: "6個聯賽", fiveStyles: "5種風格",
    startFreeTrial: "開始免費試用",
    trialNote: "7天免費 • 無需信用卡",
    popular: "熱門",
    bettingStylesTitle: "投注風格說明",
    availableLeaguesTitle: "可用聯賽",
    aggressive: "激進型", aggressiveDesc: "高風險，高回報",
    conservative: "保守型", conservativeDesc: "低風險，穩定回報",
    balanced: "平衡型", balancedDesc: "最佳風險回報比",
    valueHunter: "價值獵手", valueHunterDesc: "最佳賠率價值",
    safePlay: "穩妥型", safePlayDesc: "最高置信度選擇",
    subscribe: "訂閱", currentPlan: "當前套餐", managePlan: "管理套餐", upgrade: "升級",
    popularLeagues: "熱門聯賽",
    aiPredictionsFooter: "AI 預測",
    aiFootballPredictions: "AI 足球預測",
    onextwoPredictions: "1x2 預測",
    overUnderTips: "大小球建議",
    handicapBetting: "讓球盤投注",
    aiBettingPerformance: "AI 投注表現",
    footballTipsToday: "今日足球貼士",
    solution: "解決方案",
    liveOdds: "AI表現",
    communityFooter: "社區",
    globalChat: "全球聊天",
    userPredictions: "用戶預測",
    todayMatches: "今日比賽",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
  },
  ID: {
    pricing: "Harga",
    pricingSubtitle: "Pilih paket yang sesuai untuk Anda",
    comingSoon: "Segera Hadir",
    comingSoonDesc: "Paket harga fleksibel akan segera tersedia",
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI", community: "Komunitas", news: "Berita",
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
    freeTrial: "Uji Coba Gratis", starter: "Pemula", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/minggu", perMonth: "/bulan",
    choose1League: "Pilih", oneLeague: "1 Liga",
    daysAccess: "akses", sevenDays: "7 hari",
    choose1Style: "Pilih", oneBettingStyle: "1 Gaya Taruhan",
    aiPredictions: "Prediksi AI & Sinyal",
    fromTop5: "dari Top 5 + UEFA",
    all5Leagues: "Semua 5 Liga Utama", unlocked: "terbuka",
    uefaFifa: "UEFA CL + FIFA 2026", included: "termasuk",
    all5LeaguesUefa: "5 Liga + UEFA",
    all5Styles: "5 Gaya Taruhan",
    prioritySupport: "Dukungan prioritas",
    choose1LeagueLabel: "Pilih 1 liga:",
    choose1StyleLabel: "Pilih 1 gaya:",
    everythingIncluded: "Semua termasuk:",
    sixLeagues: "6 Liga", fiveStyles: "5 Gaya",
    startFreeTrial: "Mulai Uji Coba Gratis",
    trialNote: "7 hari gratis • Tanpa kartu kredit",
    popular: "POPULER",
    bettingStylesTitle: "Penjelasan Gaya Taruhan",
    availableLeaguesTitle: "Liga Tersedia",
    aggressive: "Agresif", aggressiveDesc: "Risiko tinggi, hasil tinggi",
    conservative: "Konservatif", conservativeDesc: "Risiko rendah, hasil stabil",
    balanced: "Seimbang", balancedDesc: "Rasio risiko-hasil optimal",
    valueHunter: "Pemburu Nilai", valueHunterDesc: "Pilihan odds terbaik",
    safePlay: "Aman", safePlayDesc: "Pilihan kepercayaan tertinggi",
    subscribe: "Berlangganan", currentPlan: "Paket Saat Ini", managePlan: "Kelola Paket", upgrade: "Tingkatkan",
    popularLeagues: "Liga Populer",
    aiPredictionsFooter: "Prediksi AI",
    aiFootballPredictions: "Prediksi Sepak Bola AI",
    onextwoPredictions: "Prediksi 1x2",
    overUnderTips: "Tips Over/Under",
    handicapBetting: "Taruhan Handicap",
    aiBettingPerformance: "Performa Taruhan AI",
    footballTipsToday: "Tips Sepak Bola Hari Ini",
    solution: "Solusi",
    liveOdds: "Performa AI",
    communityFooter: "Komunitas",
    globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna",
    todayMatches: "Pertandingan Hari Ini",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi berbasis AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial apa pun. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
  },
};

export default function PricingPage() {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  // Check auth session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });
    return () => authSub.unsubscribe();
  }, []);

  // Load user subscription
  useEffect(() => {
    const loadSubscription = async () => {
      if (user) {
        const { data } = await getUserSubscription(user.id);
        setSubscription(data);
      } else {
        setSubscription(null);
      }
    };
    loadSubscription();
  }, [user]);

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setSelectedLang(savedLang);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('oddsflow_lang', langCode);
    setLangDropdownOpen(false);
  };

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  // Helper to get button text and style based on subscription status
  const getButtonConfig = (planType: string) => {
    if (!user) {
      // Not logged in - show Get Started
      return { text: t('getStarted'), href: '/get-started', style: 'default', disabled: false };
    }

    if (!subscription) {
      // Logged in but no subscription - show Subscribe
      return { text: t('subscribe'), href: `/checkout?plan=${planType}`, style: 'default', disabled: false };
    }

    const currentPlan = subscription.package_type;
    const planOrder = ['free_trial', 'starter', 'pro', 'ultimate'];
    const currentIndex = planOrder.indexOf(currentPlan);
    const targetIndex = planOrder.indexOf(planType);

    if (currentPlan === planType) {
      // This is the user's current plan
      return { text: t('currentPlan'), href: '/dashboard', style: 'current', disabled: true };
    } else if (targetIndex > currentIndex) {
      // This is an upgrade
      return { text: t('upgrade'), href: `/checkout?plan=${planType}`, style: 'upgrade', disabled: false };
    } else {
      // This is a downgrade or different plan
      return { text: t('subscribe'), href: `/checkout?plan=${planType}`, style: 'default', disabled: false };
    }
  };

  return (
    <div className="min-h-screen text-white relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/pricing/wp2603379.jpg')" }}
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/80" />
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
              <Link href="/leagues" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('leagues')}</Link>
              <Link href="/performance" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('performance')}</Link>
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
              <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('news')}</Link>
              <Link href="/solution" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('solution')}</Link>
              <Link href="/pricing" className="text-emerald-400 text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer">
                  <FlagIcon code={currentLang.code} size={20} />
                  <span className="font-medium">{currentLang.code}</span>
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                      {LANGUAGES.map((l) => (
                        <button key={l.code} onClick={() => handleLanguageChange(l.code)} className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${selectedLang === l.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'}`}>
                          <FlagIcon code={l.code} size={20} />
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
                  <Link href="/get-started" className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
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
              <Link href="/worldcup" onClick={() => setMobileMenuOpen(false)} className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-8 w-auto object-contain relative z-10" />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
              </Link>

              {[
                { href: '/', label: t('home') },
                { href: '/predictions', label: t('predictions') },
                { href: '/leagues', label: t('leagues') },
                { href: '/performance', label: t('performance') },
                { href: '/community', label: t('community') },
                { href: '/news', label: t('news') },
                { href: '/solution', label: t('solution') },
                { href: '/pricing', label: t('pricing'), active: true },
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
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/get-started"
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
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t('pricing')}
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('pricingSubtitle')}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-4 gap-5 max-w-6xl mx-auto pt-4">
            {/* Package - Free Trial */}
            <div className="group relative bg-black rounded-2xl border border-white/10 p-5 hover:border-gray-500/50 transition-all overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-gray-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              {/* White shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              <div className="relative mb-5">
                <h3 className="text-lg font-bold text-white mb-2">{t('freeTrial')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-gray-400 text-sm">{t('perWeek')}</span>
                </div>
              </div>

              <div className="relative space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1League')} <span className="text-gray-300 font-semibold">{t('oneLeague')}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-yellow-400 font-semibold">{t('sevenDays')}</span> {t('daysAccess')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1Style')} <span className="text-gray-300 font-semibold">{t('oneBettingStyle')}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('aiPredictions')}</span>
                </div>
              </div>

              {/* Trial Note */}
              <div className="relative mb-5">
                <p className="text-xs text-yellow-500/80 mb-2">{t('trialNote')}</p>
              </div>

              {(() => {
                const config = getButtonConfig('free_trial');
                return config.disabled ? (
                  <div className="relative w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold text-sm text-center border border-emerald-500/30">
                    {config.text}
                  </div>
                ) : (
                  <Link href={config.href} className="relative block w-full py-2.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all cursor-pointer text-sm text-center">
                    {user ? config.text : t('startFreeTrial')}
                  </Link>
                );
              })()}
            </div>

            {/* Package A - Starter */}
            <div className="group relative bg-black rounded-2xl border border-white/10 p-6 hover:border-cyan-500/50 transition-all overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              {/* White shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              <div className="relative mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{t('starter')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$3</span>
                  <span className="text-gray-400">{t('perMonth')}</span>
                </div>
              </div>

              <div className="relative space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1League')} <span className="text-emerald-400 font-semibold">{t('oneLeague')}</span> {t('fromTop5')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1Style')} <span className="text-cyan-400 font-semibold">{t('oneBettingStyle')}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('aiPredictions')}</span>
                </div>
              </div>

              {/* Available Leagues */}
              <div className="relative mb-6">
                <p className="text-xs text-gray-500 mb-2">{t('choose1LeagueLabel')}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">EPL</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">Bundesliga</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">Serie A</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">La Liga</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">Ligue 1</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">UEFA</span>
                </div>
              </div>

              {(() => {
                const config = getButtonConfig('starter');
                return config.disabled ? (
                  <div className="relative w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold text-center border border-emerald-500/30">
                    {config.text}
                  </div>
                ) : (
                  <Link href={config.href} className={`relative block w-full py-3 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                    config.style === 'upgrade'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-lg hover:shadow-cyan-500/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}>
                    {config.text}
                  </Link>
                );
              })()}
            </div>

            {/* Package B - Pro (Popular) */}
            <div className="group relative scale-105 mt-4">
              {/* Popular Badge - outside overflow container */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-black text-xs font-bold shadow-lg shadow-blue-500/30 whitespace-nowrap">{t('popular')}</span>
              </div>
              {/* Card container */}
              <div className="relative bg-black rounded-2xl border-2 border-blue-500/50 p-6 pt-6 shadow-xl shadow-blue-500/20 overflow-hidden">
                {/* Animated glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                {/* White shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 z-10" />

              <div className="relative mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{t('pro')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-blue-400">$5</span>
                  <span className="text-gray-400">{t('perMonth')}</span>
                </div>
              </div>

              <div className="relative space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-blue-400 font-semibold">{t('all5Leagues')}</span> {t('unlocked')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1Style')} <span className="text-cyan-400 font-semibold">{t('oneBettingStyle')}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('aiPredictions')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-yellow-400 font-semibold">{t('uefaFifa')}</span> {t('included')}</span>
                </div>
              </div>

              {/* Betting Styles */}
              <div className="relative mb-6">
                <p className="text-xs text-gray-500 mb-2">{t('choose1StyleLabel')}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">🔥 {t('aggressive')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">🥦 {t('conservative')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">⚖️ {t('balanced')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">💎 {t('valueHunter')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">🏛️ {t('safePlay')}</span>
                </div>
              </div>

              {(() => {
                const config = getButtonConfig('pro');
                return config.disabled ? (
                  <div className="relative w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-center border border-emerald-500/30">
                    {config.text}
                  </div>
                ) : (
                  <Link href={config.href} className={`relative block w-full py-3 rounded-xl font-bold transition-all cursor-pointer text-center ${
                    config.style === 'upgrade'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-blue-500/25'
                  }`}>
                    {config.text}
                  </Link>
                );
              })()}
              </div>
            </div>

            {/* Package C - Ultimate */}
            <div className="group relative bg-black rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              {/* White shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              <div className="relative mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{t('ultimate')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$10</span>
                  <span className="text-gray-400">{t('perMonth')}</span>
                </div>
              </div>

              <div className="relative space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-emerald-400 font-semibold">{t('all5LeaguesUefa')}</span> {t('unlocked')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-purple-400 font-semibold">{t('all5Styles')}</span> {t('unlocked')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('aiPredictions')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('prioritySupport')}</span>
                </div>
              </div>

              {/* All Included */}
              <div className="relative mb-6">
                <p className="text-xs text-gray-500 mb-2">{t('everythingIncluded')}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-center">{t('sixLeagues')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-center">{t('fiveStyles')}</span>
                </div>
              </div>

              {(() => {
                const config = getButtonConfig('ultimate');
                return config.disabled ? (
                  <div className="relative w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold text-center border border-emerald-500/30">
                    {config.text}
                  </div>
                ) : (
                  <Link href={config.href} className={`relative block w-full py-3 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                    config.style === 'upgrade'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}>
                    {config.text}
                  </Link>
                );
              })()}
            </div>
          </div>

          {/* Betting Styles Explanation */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">{t('bettingStylesTitle')}</h2>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="bg-black rounded-xl border border-orange-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">🔥</span>
                <h4 className="font-semibold text-orange-400 mb-1">{t('aggressive')}</h4>
                <p className="text-xs text-gray-400">{t('aggressiveDesc')}</p>
              </div>
              <div className="bg-black rounded-xl border border-green-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">🥦</span>
                <h4 className="font-semibold text-green-400 mb-1">{t('conservative')}</h4>
                <p className="text-xs text-gray-400">{t('conservativeDesc')}</p>
              </div>
              <div className="bg-black rounded-xl border border-blue-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">⚖️</span>
                <h4 className="font-semibold text-blue-400 mb-1">{t('balanced')}</h4>
                <p className="text-xs text-gray-400">{t('balancedDesc')}</p>
              </div>
              <div className="bg-black rounded-xl border border-emerald-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">💎</span>
                <h4 className="font-semibold text-emerald-400 mb-1">{t('valueHunter')}</h4>
                <p className="text-xs text-gray-400">{t('valueHunterDesc')}</p>
              </div>
              <div className="bg-black rounded-xl border border-yellow-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">🏛️</span>
                <h4 className="font-semibold text-yellow-400 mb-1">{t('safePlay')}</h4>
                <p className="text-xs text-gray-400">{t('safePlayDesc')}</p>
              </div>
            </div>
          </div>

          {/* Leagues Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">{t('availableLeaguesTitle')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="group relative bg-black rounded-xl border border-purple-500/20 p-4 text-center hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-purple-500/20">
                  <img src="https://media.api-sports.io/football/leagues/39.png" alt="Premier League" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-purple-300 font-medium">Premier League</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-red-500/20 p-4 text-center hover:border-red-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-red-500/20">
                  <img src="https://media.api-sports.io/football/leagues/78.png" alt="Bundesliga" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-red-300 font-medium">Bundesliga</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-blue-500/20 p-4 text-center hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-blue-500/20">
                  <img src="https://media.api-sports.io/football/leagues/135.png" alt="Serie A" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-blue-300 font-medium">Serie A</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-orange-500/20 p-4 text-center hover:border-orange-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-orange-500/20">
                  <img src="https://media.api-sports.io/football/leagues/140.png" alt="La Liga" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-orange-300 font-medium">La Liga</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-green-500/20 p-4 text-center hover:border-green-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-green-500/20">
                  <img src="https://media.api-sports.io/football/leagues/61.png" alt="Ligue 1" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-green-300 font-medium">Ligue 1</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-cyan-500/20 p-4 text-center hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-cyan-500/20">
                  <img src="https://media.api-sports.io/football/leagues/2.png" alt="UEFA Champions League" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-cyan-300 font-medium">UEFA CL</p>
              </div>
            </div>
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
                <li><Link href="/performance" className="hover:text-emerald-400 transition-colors">{t('liveOdds')}</Link></li>
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
