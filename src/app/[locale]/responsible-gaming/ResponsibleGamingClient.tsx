'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeToTranslationCode, type Locale } from '@/i18n/config';
import Footer from '@/components/Footer';

// Navigation translations only
const navTranslations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    solution: "Solution",
    footerDesc: "AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.",
    product: "Product", liveOdds: "AI Performance",
    company: "Company", aboutUs: "About Us", blog: "Blog", contact: "Contact",
    legal: "Legal", privacyPolicy: "Privacy Policy", termsOfService: "Terms of Service",
    responsibleGaming: "Responsible Gaming",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    popularLeagues: "Popular Leagues",
    communityFooter: "Community", globalChat: "Global Chat", userPredictions: "User Predictions",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesion", getStarted: "Comenzar",
    solution: "Solucion",
    footerDesc: "Analisis de cuotas de futbol impulsado por IA para predicciones mas inteligentes.",
    product: "Producto", liveOdds: "Rendimiento IA",
    company: "Empresa", aboutUs: "Sobre Nosotros", blog: "Blog", contact: "Contacto",
    legal: "Legal", privacyPolicy: "Politica de Privacidad", termsOfService: "Terminos de Servicio",
    responsibleGaming: "Uso Responsable",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juegue responsablemente.",
    popularLeagues: "Ligas Populares",
    communityFooter: "Comunidad", globalChat: "Chat Global", userPredictions: "Predicciones de Usuarios",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precision de las predicciones. El juego implica riesgo. Los usuarios deben tener mas de 18 anos.",
  },
  PT: {
    home: "Inicio", predictions: "Palpites", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Noticias", pricing: "Precos", login: "Entrar", getStarted: "Comecar",
    solution: "Solucao",
    footerDesc: "Analise de odds de futebol com IA para palpites mais inteligentes.",
    product: "Produto", liveOdds: "Desempenho IA",
    company: "Empresa", aboutUs: "Sobre Nos", blog: "Blog", contact: "Contato",
    legal: "Legal", privacyPolicy: "Politica de Privacidade", termsOfService: "Termos de Servico",
    responsibleGaming: "Uso Responsavel",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    popularLeagues: "Ligas Populares",
    communityFooter: "Comunidade", globalChat: "Chat Global", userPredictions: "Palpites de Usuarios",
    disclaimer: "Aviso: OddsFlow fornece previsoes baseadas em IA apenas para fins informativos. Nao garantimos a precisao das previsoes. Usuarios devem ter mais de 18 anos.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    solution: "Losung",
    footerDesc: "KI-gestutzte Fussball-Quotenanalyse fur intelligentere Vorhersagen.",
    product: "Produkt", liveOdds: "KI-Leistung",
    company: "Unternehmen", aboutUs: "Uber uns", blog: "Blog", contact: "Kontakt",
    legal: "Rechtliches", privacyPolicy: "Datenschutz", termsOfService: "Nutzungsbedingungen",
    responsibleGaming: "Verantwortungsvolle Nutzung",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glucksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    popularLeagues: "Beliebte Ligen",
    communityFooter: "Community", globalChat: "Globaler Chat", userPredictions: "Benutzer-Vorhersagen",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestutzte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Benutzer mussen 18+ Jahre alt sein.",
  },
  FR: {
    home: "Accueil", predictions: "Predictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communaute", news: "Actualites", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    solution: "Solution",
    footerDesc: "Analyse des cotes de football alimentee par l'IA pour des pronostics plus intelligents.",
    product: "Produit", liveOdds: "Performance IA",
    company: "Entreprise", aboutUs: "A Propos", blog: "Blog", contact: "Contact",
    legal: "Legal", privacyPolicy: "Politique de Confidentialite", termsOfService: "Conditions d'Utilisation",
    responsibleGaming: "Utilisation Responsable",
    allRightsReserved: "Tous droits reserves.",
    gamblingWarning: "Les jeux d'argent comportent des risques. Jouez de maniere responsable.",
    popularLeagues: "Ligues Populaires",
    communityFooter: "Communaute", globalChat: "Chat Global", userPredictions: "Predictions Utilisateurs",
    disclaimer: "Avertissement: OddsFlow fournit des predictions basees sur l'IA uniquement a des fins d'information et de divertissement. Les utilisateurs doivent avoir 18+ ans.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "AIパフォーマンス",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    solution: "ソリューション",
    footerDesc: "AI搭載のサッカーオッズ分析でよりスマートな予測を。",
    product: "製品", liveOdds: "AIパフォーマンス",
    company: "会社", aboutUs: "会社概要", blog: "ブログ", contact: "お問い合わせ",
    legal: "法的情報", privacyPolicy: "プライバシーポリシー", termsOfService: "利用規約",
    responsibleGaming: "責任ある利用",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってギャンブルしてください。",
    popularLeagues: "人気リーグ",
    communityFooter: "コミュニティ", globalChat: "グローバルチャット", userPredictions: "ユーザー予測",
    disclaimer: "免責事項：OddsFlowは情報および娯楽目的でのみAI予測を提供しています。ユーザーは18歳以上である必要があります。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성과",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기",
    solution: "솔루션",
    footerDesc: "더 스마트한 예측을 위한 AI 기반 축구 배당률 분석.",
    product: "제품", liveOdds: "AI 성과",
    company: "회사", aboutUs: "회사 소개", blog: "블로그", contact: "연락처",
    legal: "법적 정보", privacyPolicy: "개인정보 보호정책", termsOfService: "서비스 약관",
    responsibleGaming: "책임감 있는 사용",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 도박하세요.",
    popularLeagues: "인기 리그",
    communityFooter: "커뮤니티", globalChat: "글로벌 채팅", userPredictions: "사용자 예측",
    disclaimer: "면책 조항: OddsFlow는 정보 및 오락 목적으로만 AI 예측을 제공합니다. 사용자는 18세 이상이어야 합니다.",
  },
  "中文": {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始使用",
    solution: "解决方案",
    footerDesc: "AI驱动的足球赔率分析，助您做出更明智的预测。",
    product: "产品", liveOdds: "AI表现",
    company: "公司", aboutUs: "关于我们", blog: "博客", contact: "联系我们",
    legal: "法律", privacyPolicy: "隐私政策", termsOfService: "服务条款",
    responsibleGaming: "负责任使用",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩涉及风险。请负责任地博彩。",
    popularLeagues: "热门联赛",
    communityFooter: "社区", globalChat: "全球聊天", userPredictions: "用户预测",
    disclaimer: "免责声明：OddsFlow仅为信息和娱乐目的提供AI预测。用户必须年满18岁。",
  },
  "繁體": {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始使用",
    solution: "解決方案",
    footerDesc: "AI驅動的足球賠率分析，助您做出更明智的預測。",
    product: "產品", liveOdds: "AI表現",
    company: "公司", aboutUs: "關於我們", blog: "部落格", contact: "聯繫我們",
    legal: "法律", privacyPolicy: "隱私政策", termsOfService: "服務條款",
    responsibleGaming: "負責任使用",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩涉及風險。請負責任地博彩。",
    popularLeagues: "熱門聯賽",
    communityFooter: "社區", globalChat: "全球聊天", userPredictions: "用戶預測",
    disclaimer: "免責聲明：OddsFlow僅為資訊和娛樂目的提供AI預測。用戶必須年滿18歲。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    solution: "Solusi",
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi yang lebih cerdas.",
    product: "Produk", liveOdds: "Performa AI",
    company: "Perusahaan", aboutUs: "Tentang Kami", blog: "Blog", contact: "Kontak",
    legal: "Legal", privacyPolicy: "Kebijakan Privasi", termsOfService: "Ketentuan Layanan",
    responsibleGaming: "Penggunaan Bertanggung Jawab",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Silakan berjudi secara bertanggung jawab.",
    popularLeagues: "Liga Populer",
    communityFooter: "Komunitas", globalChat: "Chat Global", userPredictions: "Prediksi Pengguna",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi berbasis AI hanya untuk tujuan informasi dan hiburan. Pengguna harus berusia 18+ tahun.",
  },
};

interface ResponsibleGamingClientProps {
  locale: string;
  children: React.ReactNode;
}

export default function ResponsibleGamingClient({ locale, children }: ResponsibleGamingClientProps) {
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/responsible-gaming';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const t = (key: string) => navTranslations[selectedLang]?.[key] || navTranslations['EN'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-black text-white">
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
              <Link href={localePath('/performance')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('performance')}</Link>
              <Link href={localePath('/community')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
              <Link href={localePath('/news')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('news')}</Link>
              <Link href={localePath('/solution')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('solution')}</Link>
              <Link href={localePath('/pricing')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                    {locales.map((loc) => {
                      const langCode = localeToTranslationCode[loc];
                      const language = LANGUAGES.find(l => l.code === langCode);
                      if (!language) return null;
                      return (
                        <Link key={loc} href={getLocaleUrl(loc)} className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${selectedLang === langCode ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300'}`}>
                          <FlagIcon code={langCode} size={20} />
                          <span className="font-medium">{language.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
              {user ? (
                <Link href={localePath('/dashboard')} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
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
                { href: localePath('/leagues'), label: t('leagues') },
                { href: localePath('/performance'), label: t('performance') },
                { href: localePath('/community'), label: t('community') },
                { href: localePath('/news'), label: t('news') },
                { href: localePath('/solution'), label: t('solution') },
                { href: localePath('/pricing'), label: t('pricing') },
              ].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                {user ? (
                  <Link
                    href={localePath('/dashboard')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-white font-medium">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                  </Link>
                ) : (
                  <>
                    <Link href={localePath('/login')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all">{t('login')}</Link>
                    <Link href={localePath('/get-started')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold hover:shadow-lg transition-all">{t('getStarted')}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content from Server Component */}
      {children}

<Footer localePath={localePath} t={t} locale={locale} />
    </div>
  );
}
