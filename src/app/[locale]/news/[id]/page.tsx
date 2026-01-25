'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, FootballNews, Prematch, ExclusiveReportData } from '@/lib/supabase';
import { addTeamLinks } from '@/lib/auto-link-teams';
import ExclusiveReportTemplate from '@/components/ExclusiveReportTemplate';
import { User } from '@supabase/supabase-js';
import FlagIcon from "@/components/FlagIcon";
import { locales, localeNames, localeToTranslationCode, type Locale } from '@/i18n/config';
import Footer from '@/components/Footer';

// Helper function to format date
function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Helper function to calculate reading time
function calculateReadingTime(content: string | null | undefined): number {
  if (!content) return 1;
  // Strip HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

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
    login: "Log In",
    getStarted: "Get Started",
    backToNews: "Back to News",
    publishedOn: "Published on",
    share: "Share",
    shareDesc: "Share this article with your friends",
    relatedArticles: "Related Articles",
    articleNotFound: "Article not found",
    loading: "Loading...",
    exclusiveReport: "OddsFlow Exclusive Report",
    minRead: "min read",
    footerDesc: "AI-powered football odds analysis for smarter predictions.",
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
    popularLeagues: "Popular Leagues",
    aiPredictionsFooter: "AI Predictions",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly.",
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
    login: "Iniciar Sesión",
    getStarted: "Comenzar",
    backToNews: "Volver a Noticias",
    publishedOn: "Publicado el",
    share: "Compartir",
    shareDesc: "Comparte este artículo con tus amigos",
    relatedArticles: "Artículos Relacionados",
    articleNotFound: "Artículo no encontrado",
    loading: "Cargando...",
    exclusiveReport: "Informe Exclusivo OddsFlow",
    minRead: "min de lectura",
    footerDesc: "Análisis de cuotas de fútbol impulsado por IA.",
    product: "Producto",
    company: "Empresa",
    legal: "Legal",
    aboutUs: "Sobre Nosotros",
    contact: "Contacto",
    blog: "Blog",
    termsOfService: "Términos de Servicio",
    privacyPolicy: "Política de Privacidad",
    responsibleGaming: "Juego Responsable",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juega responsablemente.",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Predicciones IA",
    communityFooter: "Comunidad",
    globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento.",
  },
  '中文': {
    home: "首页",
    predictions: "预测",
    leagues: "联赛",
    performance: "AI表现",
    community: "社区",
    news: "新闻",
    solution: "解决方案",
    pricing: "价格",
    login: "登录",
    getStarted: "开始使用",
    backToNews: "返回新闻",
    publishedOn: "发布于",
    share: "分享",
    shareDesc: "分享这篇文章给你的朋友",
    relatedArticles: "相关文章",
    articleNotFound: "文章未找到",
    loading: "加载中...",
    exclusiveReport: "OddsFlow 独家报告",
    minRead: "分钟阅读",
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
    popularLeagues: "热门联赛",
    aiPredictionsFooter: "AI 预测",
    communityFooter: "社区",
    globalChat: "全球聊天",
    userPredictions: "用户预测",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。",
  },
  '繁體': {
    home: "首頁",
    predictions: "預測",
    leagues: "聯賽",
    performance: "AI表現",
    community: "社區",
    news: "新聞",
    solution: "解決方案",
    pricing: "價格",
    login: "登入",
    getStarted: "開始使用",
    backToNews: "返回新聞",
    publishedOn: "發布於",
    share: "分享",
    shareDesc: "分享這篇文章給你的朋友",
    relatedArticles: "相關文章",
    articleNotFound: "文章未找到",
    loading: "載入中...",
    exclusiveReport: "OddsFlow 獨家報告",
    minRead: "分鐘閱讀",
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
    popularLeagues: "熱門聯賽",
    aiPredictionsFooter: "AI 預測",
    communityFooter: "社區",
    globalChat: "全球聊天",
    userPredictions: "用戶預測",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。",
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
    login: "Masuk",
    getStarted: "Mulai",
    backToNews: "Kembali ke Berita",
    publishedOn: "Dipublikasikan pada",
    share: "Bagikan",
    shareDesc: "Bagikan artikel ini dengan teman-teman Anda",
    relatedArticles: "Artikel Terkait",
    articleNotFound: "Artikel tidak ditemukan",
    loading: "Memuat...",
    exclusiveReport: "Laporan Eksklusif OddsFlow",
    minRead: "menit baca",
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi lebih cerdas.",
    product: "Produk",
    company: "Perusahaan",
    legal: "Legal",
    aboutUs: "Tentang Kami",
    contact: "Kontak",
    blog: "Blog",
    termsOfService: "Syarat Layanan",
    privacyPolicy: "Kebijakan Privasi",
    responsibleGaming: "Perjudian Bertanggung Jawab",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    popularLeagues: "Liga Populer",
    aiPredictionsFooter: "Prediksi AI",
    communityFooter: "Komunitas",
    globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan.",
  },
};

export default function ArticlePage() {
  const params = useParams();
  const urlLocale = (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as keyof typeof localeToTranslationCode] || 'EN';
  const articleId = params.id as string;

  const [article, setArticle] = useState<FootballNews | null>(null);
  const [matchInfo, setMatchInfo] = useState<Prematch | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const getLocaleUrl = (targetLocale: Locale): string => {
    return targetLocale === 'en' ? `/news/${articleId}` : `/${targetLocale}/news/${articleId}`;
  };

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  // Check auth
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

  // Fetch article
  useEffect(() => {
    async function fetchArticle() {
      try {
        const { data, error } = await supabase
          .from('football_news')
          .select('*')
          .eq('id', articleId)
          .single();

        if (error) throw error;
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  // Fetch match info when article has fixture_id
  useEffect(() => {
    async function fetchMatchInfo() {
      if (!article?.fixture_id) {
        console.log('No fixture_id in article');
        return;
      }

      console.log('Fetching match info for fixture_id:', article.fixture_id);

      try {
        const { data, error } = await supabase
          .from('prematches')
          .select('*')
          .eq('fixture_id', article.fixture_id)
          .maybeSingle();

        console.log('Prematch query result:', { data, error });

        if (error) {
          console.error('Error fetching match info:', error.message || error);
          return;
        }
        if (data) {
          setMatchInfo(data);
        }
      } catch (error) {
        console.error('Error fetching match info:', error);
      }
    }

    fetchMatchInfo();
  }, [article?.fixture_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05080d] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#05080d] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('articleNotFound')}</h1>
          <Link href={localePath('/news')} className="text-emerald-400 hover:underline">
            {t('backToNews')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05080d] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
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
              <Link href={localePath('/leagues')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('leagues')}</Link>
              <Link href={localePath('/performance')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('performance')}</Link>
              <Link href={localePath('/community')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
              <Link href={localePath('/news')} className="text-emerald-400 text-sm font-medium">{t('news')}</Link>
              <Link href={localePath('/solution')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('solution')}</Link>
              <Link href={localePath('/pricing')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Language Selector */}
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
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-[#0c1018] border border-white/10 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                      {locales.map((loc) => (
                        <Link key={loc} href={getLocaleUrl(loc)} onClick={() => setLangDropdownOpen(false)} className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${locale === loc ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'}`}>
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
                  <Link href={localePath('/get-started')} className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
                </>
              )}

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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[45] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
              {[
                { href: localePath('/'), label: t('home') },
                { href: localePath('/predictions'), label: t('predictions') },
                { href: localePath('/leagues'), label: t('leagues') },
                { href: localePath('/performance'), label: t('performance') },
                { href: localePath('/community'), label: t('community') },
                { href: localePath('/news'), label: t('news'), active: true },
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
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Featured Image */}
      {article.image_url && (
        <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px]">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080d] via-[#05080d]/60 to-transparent" />

          {/* Back Button on Hero */}
          <div className="absolute top-20 left-4 sm:left-8 z-20">
            <Link href={localePath('/news')} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all group">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">{t('backToNews')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`relative z-10 ${article.image_url ? '-mt-32' : 'pt-24'} pb-16 px-4`}>
        <div className="max-w-4xl mx-auto">

          {/* Back to News (only show if no hero image) */}
          {!article.image_url && (
            <Link href={localePath('/news')} className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-8 group">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">{t('backToNews')}</span>
            </Link>
          )}

          {/* Article Card */}
          <article className="bg-[#0a0e14]/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8 lg:p-12">

              {/* Check if this is an Exclusive Report with structured data */}
              {article.source === 'OddsFlow Exclusive Report' && article.article_data ? (
                /* EXCLUSIVE REPORT TEMPLATE */
                <ExclusiveReportTemplate
                  title={article.title}
                  summary={article.summary}
                  publishedAt={article.published_at}
                  imageUrl={article.image_url}
                  matchInfo={matchInfo}
                  articleData={article.article_data as ExclusiveReportData}
                  locale={locale}
                />
              ) : (
                /* REGULAR ARTICLE TEMPLATE */
                <>
                  {/* Source Badge & League */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-bold uppercase tracking-wider">
                      {article.source === 'OddsFlow Exclusive Report' ? t('exclusiveReport') : article.source}
                    </span>
                    {article.league && (
                      <span className="px-3 py-1.5 rounded-full bg-white/5 text-gray-300 text-xs font-medium border border-white/10">
                        {article.league}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                    {article.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-8">
                    {article.published_at && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{calculateReadingTime(article.content)} {t('minRead')}</span>
                    </div>
                  </div>

                  {/* Match Info Card */}
                  {matchInfo && (
                    <div className="mb-10 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#111827] to-[#0c1220]">
                      <div className="flex items-center justify-between px-5 py-3 bg-black/40 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          {matchInfo.league_logo && (
                            <img src={matchInfo.league_logo} alt={matchInfo.league_name} className="w-5 h-5 object-contain" />
                          )}
                          <span className="text-white text-sm font-medium">{matchInfo.league_name}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          matchInfo.status_short === 'FT' ? 'bg-emerald-500/20 text-emerald-400' :
                          matchInfo.status_short === 'NS' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {matchInfo.status_short === 'FT' ? 'Full Time' : matchInfo.status_short}
                        </span>
                      </div>
                      <div className="px-4 py-6 sm:px-6 sm:py-8">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 flex flex-col items-center text-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                              {matchInfo.home_logo ? (
                                <img src={matchInfo.home_logo} alt={matchInfo.home_name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                              ) : (
                                <span className="text-xl font-bold text-gray-400">{matchInfo.home_name?.charAt(0)}</span>
                              )}
                            </div>
                            <span className="text-white font-medium text-xs sm:text-sm line-clamp-2">{matchInfo.home_name}</span>
                          </div>
                          <div className="flex items-center gap-3 px-4">
                            {matchInfo.goals_home !== null && matchInfo.goals_away !== null ? (
                              <>
                                <span className="text-3xl sm:text-4xl font-bold text-white">{matchInfo.goals_home}</span>
                                <span className="text-xl text-gray-500">-</span>
                                <span className="text-3xl sm:text-4xl font-bold text-white">{matchInfo.goals_away}</span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-gray-400">VS</span>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col items-center text-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                              {matchInfo.away_logo ? (
                                <img src={matchInfo.away_logo} alt={matchInfo.away_name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                              ) : (
                                <span className="text-xl font-bold text-gray-400">{matchInfo.away_name?.charAt(0)}</span>
                              )}
                            </div>
                            <span className="text-white font-medium text-xs sm:text-sm line-clamp-2">{matchInfo.away_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {article.summary && (
                    <div className="mb-10 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-l-4 border-emerald-500">
                      <p className="text-lg text-gray-200 leading-relaxed italic">{article.summary}</p>
                    </div>
                  )}

                  <div className="border-t border-white/10 mb-10" />

                  {/* Article Content */}
                  <div
                    className="article-content prose prose-invert prose-lg max-w-none
                      prose-headings:text-white prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-4
                      prose-h2:text-xl prose-h2:text-emerald-400 prose-h2:border-l-4 prose-h2:border-emerald-500 prose-h2:pl-4 prose-h2:py-1
                      prose-h3:text-lg prose-h3:text-cyan-400
                      prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
                      prose-strong:text-white prose-strong:font-semibold
                      prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                      prose-ul:text-gray-300 prose-ul:my-6 prose-ol:text-gray-300 prose-ol:my-6
                      prose-li:text-gray-300 prose-li:mb-2
                      prose-blockquote:border-l-emerald-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
                      prose-img:rounded-xl prose-img:my-8"
                    dangerouslySetInnerHTML={{ __html: addTeamLinks(article.content || '', locale) }}
                  />
                </>
              )}

              {/* End Divider */}
              <div className="flex items-center justify-center my-12">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-emerald-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan-500/50" />
                </div>
              </div>

              {/* Share Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <h3 className="text-white font-semibold mb-1">{t('share')}</h3>
                  <p className="text-gray-500 text-sm">{t('shareDesc')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Link */}
          <div className="mt-6">
            <Link
              href={localePath(`/news/${articleId}/comments`)}
              className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-[#0a0e14] border border-white/5 hover:border-emerald-500/30 text-gray-300 hover:text-white transition-all group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium">View Comments & Discussion</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

<Footer localePath={localePath} t={t} />
    </div>
  );
}
