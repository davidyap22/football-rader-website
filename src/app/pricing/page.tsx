'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, getUserSubscription, UserSubscription } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

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

const translations: Record<string, Record<string, string>> = {
  EN: {
    pricing: "Pricing",
    pricingSubtitle: "Choose the plan that fits your needs",
    comingSoon: "Coming Soon",
    comingSoonDesc: "Flexible pricing plans will be available soon",
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance", community: "Community", news: "News",
    login: "Log In", getStarted: "Get Started",
    footer: "18+ | Gambling involves risk. Please gamble responsibly.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
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
  },
  ES: {
    pricing: "Precios",
    pricingSubtitle: "Elige el plan que se adapte a tus necesidades",
    comingSoon: "Próximamente",
    comingSoonDesc: "Planes de precios flexibles estarán disponibles pronto",
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Análisis", community: "Comunidad", news: "Noticias",
    login: "Iniciar Sesión", getStarted: "Comenzar",
    footer: "18+ | El juego implica riesgo. Por favor juega responsablemente.",
    allRights: "© 2025 OddsFlow. Todos los derechos reservados.",
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
  },
  PT: {
    pricing: "Preços",
    pricingSubtitle: "Escolha o plano que atende às suas necessidades",
    comingSoon: "Em Breve",
    comingSoonDesc: "Planos de preços flexíveis estarão disponíveis em breve",
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Análise", community: "Comunidade", news: "Notícias",
    login: "Entrar", getStarted: "Começar",
    footer: "18+ | O jogo envolve risco. Por favor, jogue com responsabilidade.",
    allRights: "© 2025 OddsFlow. Todos os direitos reservados.",
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
  },
  DE: {
    pricing: "Preise",
    pricingSubtitle: "Wählen Sie den Plan, der Ihren Bedürfnissen entspricht",
    comingSoon: "Demnächst",
    comingSoonDesc: "Flexible Preispläne werden bald verfügbar sein",
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse", community: "Community", news: "Nachrichten",
    login: "Anmelden", getStarted: "Loslegen",
    footer: "18+ | Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    allRights: "© 2025 OddsFlow. Alle Rechte vorbehalten.",
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
  },
  FR: {
    pricing: "Tarifs",
    pricingSubtitle: "Choisissez le plan qui correspond à vos besoins",
    comingSoon: "Bientôt Disponible",
    comingSoonDesc: "Des plans tarifaires flexibles seront bientôt disponibles",
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Analyse", community: "Communauté", news: "Actualités",
    login: "Connexion", getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez de manière responsable.",
    allRights: "© 2025 OddsFlow. Tous droits réservés.",
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
  },
  JA: {
    pricing: "料金",
    pricingSubtitle: "ニーズに合ったプランをお選びください",
    comingSoon: "近日公開",
    comingSoonDesc: "柔軟な料金プランを準備中です",
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "分析", community: "コミュニティ", news: "ニュース",
    login: "ログイン", getStarted: "始める",
    footer: "18+ | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2025 OddsFlow. All rights reserved.",
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
  },
  KO: {
    pricing: "가격",
    pricingSubtitle: "필요에 맞는 플랜을 선택하세요",
    comingSoon: "곧 출시 예정",
    comingSoonDesc: "유연한 가격 플랜이 곧 제공될 예정입니다",
    home: "홈", predictions: "예측", leagues: "리그", performance: "분석", community: "커뮤니티", news: "뉴스",
    login: "로그인", getStarted: "시작하기",
    footer: "18+ | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
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
  },
  '中文': {
    pricing: "价格",
    pricingSubtitle: "选择适合您需求的计划",
    comingSoon: "即将推出",
    comingSoonDesc: "灵活的定价计划即将上线",
    home: "首页", predictions: "预测", leagues: "联赛", performance: "分析", community: "社区", news: "新闻",
    login: "登录", getStarted: "开始使用",
    footer: "18+ | 赌博有风险，请理性参与。",
    allRights: "© 2025 OddsFlow. 保留所有权利。",
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
  },
  '繁體': {
    pricing: "價格",
    pricingSubtitle: "選擇適合您需求的計劃",
    comingSoon: "即將推出",
    comingSoonDesc: "靈活的定價計劃即將上線",
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "分析", community: "社區", news: "新聞",
    login: "登入", getStarted: "開始使用",
    footer: "18+ | 賭博有風險，請理性參與。",
    allRights: "© 2025 OddsFlow. 保留所有權利。",
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
              <Link href="/pricing" className="text-emerald-400 text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer">
                  <span>{currentLang.flag}</span>
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
      <footer className="relative z-10 py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>{t('footer')}</p>
        <p className="mt-2">{t('allRights')}</p>
      </footer>
    </div>
  );
}
