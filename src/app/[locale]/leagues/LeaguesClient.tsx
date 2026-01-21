'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { locales, localeNames, localeToTranslationCode, type Locale } from '@/i18n/config';
import { User } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { LeagueStatsSummary, LEAGUES_CONFIG } from '@/lib/leagues-data';

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    leagues: "Leagues",
    leaguesSubtitle: "Explore predictions across all major football leagues worldwide",
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
  },
  ES: {
    leagues: "Ligas",
    leaguesSubtitle: "Explora predicciones de todas las principales ligas de futbol del mundo",
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
    seoTitle: "Consejos de IA para Futbol Europeo",
    seoP1: "OddsFlow ofrece el predictor de futbol con IA mas preciso para todas las principales ligas europeas.",
    seoP2: "Ya sea que busques predicciones 1x2 de la Premier League o predicciones de apuestas con IA de la Bundesliga.",
    seoP3: "Nuestra mejor IA para apuestas handicap analiza predicciones de empate handicap y estadisticas de mas de 2.5 goles.",
    popularLeagues: "Ligas Populares",
    communityFooter: "Comunidad",
    globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento.",
  },
  PT: {
    leagues: "Ligas",
    leaguesSubtitle: "Explore previsoes das principais ligas de futebol do mundo",
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
    seoTitle: "Dicas de IA para Futebol Europeu",
    seoP1: "OddsFlow oferece o preditor de futebol com IA mais preciso para todas as principais ligas europeias.",
    seoP2: "Seja voce procurando previsoes 1x2 da Premier League ou previsoes de apostas com IA da Bundesliga.",
    seoP3: "Nossa melhor IA para apostas handicap analisa previsoes de empate handicap e estatisticas de mais de 2.5 gols.",
    popularLeagues: "Ligas Populares",
    communityFooter: "Comunidade",
    globalChat: "Chat Global",
    userPredictions: "Previsoes de Usuarios",
    disclaimer: "Aviso: OddsFlow fornece previsoes baseadas em IA apenas para fins informativos e de entretenimento.",
  },
  DE: {
    leagues: "Ligen",
    leaguesSubtitle: "Erkunden Sie Vorhersagen fur alle grossen Fussballligen weltweit",
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
    seoTitle: "KI-Tipps fur Europaischen Fussball",
    seoP1: "OddsFlow bietet den genauesten KI-Fussballprediktor fur alle grossen europaischen Ligen.",
    seoP2: "Ob Sie nach Premier League 1x2-Vorhersagen oder Bundesliga KI-Wettvorhersagen suchen.",
    seoP3: "Unsere beste KI fur Handicap-Wetten analysiert Handicap-Unentschieden-Vorhersagen.",
    popularLeagues: "Beliebte Ligen",
    communityFooter: "Community",
    globalChat: "Globaler Chat",
    userPredictions: "Benutzer-Vorhersagen",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestutzte Vorhersagen nur zu Informations- und Unterhaltungszwecken.",
  },
  FR: {
    leagues: "Ligues",
    leaguesSubtitle: "Explorez les predictions de toutes les grandes ligues de football",
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
    seoTitle: "Conseils IA pour le Football Europeen",
    seoP1: "OddsFlow offre le predicteur de football IA le plus precis pour toutes les grandes ligues europeennes.",
    seoP2: "Que vous cherchiez des predictions 1x2 de Premier League ou des predictions de paris IA de Bundesliga.",
    seoP3: "Notre meilleure IA pour les paris handicap analyse les predictions de match nul handicap.",
    popularLeagues: "Ligues Populaires",
    communityFooter: "Communaute",
    globalChat: "Chat Global",
    userPredictions: "Predictions Utilisateurs",
    disclaimer: "Avertissement : OddsFlow fournit des predictions basees sur l'IA a des fins d'information et de divertissement uniquement.",
  },
  JA: {
    leagues: "リーグ",
    leaguesSubtitle: "世界の主要サッカーリーグの予測を探索",
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
    seoTitle: "欧州サッカーAI予測",
    seoP1: "OddsFlowは、すべての主要欧州リーグで最も正確なAIサッカー予測を提供します。",
    seoP2: "プレミアリーグの1x2予測、ブンデスリーガのAIベッティング予測をお探しの場合でも。",
    seoP3: "ハンディキャップベッティングに最適な当社のAIは、ハンディキャップドロー予測を分析します。",
    popularLeagues: "人気リーグ",
    communityFooter: "コミュニティ",
    globalChat: "グローバルチャット",
    userPredictions: "ユーザー予測",
    disclaimer: "免責事項：OddsFlowはAI駆動の予測を情報および娯楽目的のみで提供しています。",
  },
  KO: {
    leagues: "리그",
    leaguesSubtitle: "전 세계 주요 축구 리그의 예측을 탐색하세요",
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
    seoTitle: "유럽 축구 AI 예측",
    seoP1: "OddsFlow는 모든 주요 유럽 리그에서 가장 정확한 AI 축구 예측을 제공합니다.",
    seoP2: "프리미어리그 1x2 예측, 분데스리가 AI 베팅 예측을 찾고 계시든.",
    seoP3: "핸디캡 베팅을 위한 최고의 AI는 핸디캡 무승부 예측을 분석합니다.",
    popularLeagues: "인기 리그",
    communityFooter: "커뮤니티",
    globalChat: "글로벌 채팅",
    userPredictions: "사용자 예측",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다.",
  },
  '中文': {
    leagues: "联赛",
    leaguesSubtitle: "探索全球主要足球联赛的预测",
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
    seoTitle: "欧洲足球AI预测",
    seoP1: "OddsFlow为所有主要欧洲联赛提供最精准的AI足球预测。",
    seoP2: "无论您是在寻找英超1x2预测还是德甲AI投注预测。",
    seoP3: "我们最优秀的让球投注AI分析让球平局预测。",
    popularLeagues: "热门联赛",
    communityFooter: "社区",
    globalChat: "全球聊天",
    userPredictions: "用户预测",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。",
  },
  '繁體': {
    leagues: "聯賽",
    leaguesSubtitle: "探索全球主要足球聯賽的預測",
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
    seoTitle: "歐洲足球AI預測",
    seoP1: "OddsFlow為所有主要歐洲聯賽提供最精準的AI足球預測。",
    seoP2: "無論您是在尋找英超1x2預測還是德甲AI投注預測。",
    seoP3: "我們最優秀的讓球投注AI分析讓球平局預測。",
    popularLeagues: "熱門聯賽",
    communityFooter: "社區",
    globalChat: "全球聊天",
    userPredictions: "用戶預測",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。",
  },
  ID: {
    leagues: "Liga",
    leaguesSubtitle: "Jelajahi prediksi dari semua liga sepak bola utama di dunia",
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
    seoTitle: "Tips AI Sepak Bola Eropa",
    seoP1: "OddsFlow menyediakan prediktor sepak bola AI paling akurat untuk semua liga utama Eropa.",
    seoP2: "Apakah Anda mencari prediksi 1x2 Premier League atau prediksi taruhan AI Bundesliga.",
    seoP3: "AI terbaik kami untuk taruhan handicap menganalisis prediksi seri handicap.",
    popularLeagues: "Liga Populer",
    communityFooter: "Komunitas",
    globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan.",
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
                    <img src={league.logo} alt={league.name} className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{league.name}</h3>
                    <p className="text-sm text-emerald-400">{league.country}</p>
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
                            alt={leagueStats[league.dbName].topTeam!}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <span className="text-xs text-emerald-400 font-medium">
                          Leading: {leagueStats[league.dbName].topTeam}
                        </span>
                      </div>
                    )}
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].teams} Teams</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].totalGoals} Goals</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].avgGoalsPerMatch.toFixed(1)} Avg/Match</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">{leagueStats[league.dbName].cleanSheets} Clean Sheets</span>
                      </div>
                    </div>
                    {/* Season Badge */}
                    {leagueStats[league.dbName].season && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500">Season {leagueStats[league.dbName].season}/{(leagueStats[league.dbName].season! + 1).toString().slice(-2)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-3 italic">No statistics available</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">View Standings</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">Team Stats</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Formations</span>
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
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
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
