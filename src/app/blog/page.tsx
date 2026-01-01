'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    blogTitle: "Blog",
    blogSubtitle: "Insights, tutorials, and updates from the OddsFlow team",
    comingSoon: "Coming Soon",
    comingSoonText: "We're working on bringing you insightful articles about football analytics, AI predictions, and betting strategies. Stay tuned!",
    subscribeTitle: "Get Notified",
    subscribeText: "Be the first to know when we publish new content",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    footer: "© 2025 OddsFlow. All rights reserved.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Análisis",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Comenzar",
    blogTitle: "Blog",
    blogSubtitle: "Información, tutoriales y actualizaciones del equipo de OddsFlow",
    comingSoon: "Próximamente",
    comingSoonText: "Estamos trabajando en traerte artículos sobre análisis de fútbol, predicciones de IA y estrategias de apuestas. ¡Mantente atento!",
    subscribeTitle: "Recibe Notificaciones",
    subscribeText: "Sé el primero en saber cuando publiquemos nuevo contenido",
    enterEmail: "Ingresa tu correo",
    subscribe: "Suscribirse",
    footer: "© 2025 OddsFlow. Todos los derechos reservados.",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Análise",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    blogTitle: "Blog",
    blogSubtitle: "Insights, tutoriais e atualizações da equipe OddsFlow",
    comingSoon: "Em Breve",
    comingSoonText: "Estamos trabalhando para trazer artigos sobre análise de futebol, previsões de IA e estratégias de apostas. Fique atento!",
    subscribeTitle: "Seja Notificado",
    subscribeText: "Seja o primeiro a saber quando publicarmos novo conteúdo",
    enterEmail: "Digite seu e-mail",
    subscribe: "Inscrever-se",
    footer: "© 2025 OddsFlow. Todos os direitos reservados.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    blogTitle: "Blog",
    blogSubtitle: "Einblicke, Tutorials und Updates vom OddsFlow-Team",
    comingSoon: "Demnächst",
    comingSoonText: "Wir arbeiten daran, Ihnen aufschlussreiche Artikel über Fußballanalysen, KI-Vorhersagen und Wettstrategien zu bringen. Bleiben Sie dran!",
    subscribeTitle: "Benachrichtigt Werden",
    subscribeText: "Erfahren Sie als Erster, wenn wir neue Inhalte veröffentlichen",
    enterEmail: "E-Mail eingeben",
    subscribe: "Abonnieren",
    footer: "© 2025 OddsFlow. Alle Rechte vorbehalten.",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Analyse",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    blogTitle: "Blog",
    blogSubtitle: "Analyses, tutoriels et mises à jour de l'équipe OddsFlow",
    comingSoon: "Bientôt Disponible",
    comingSoonText: "Nous travaillons à vous apporter des articles sur l'analyse du football, les prédictions IA et les stratégies de paris. Restez connecté!",
    subscribeTitle: "Soyez Notifié",
    subscribeText: "Soyez le premier à savoir quand nous publions du nouveau contenu",
    enterEmail: "Entrez votre e-mail",
    subscribe: "S'abonner",
    footer: "© 2025 OddsFlow. Tous droits réservés.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "分析",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    blogTitle: "ブログ",
    blogSubtitle: "OddsFlowチームからの洞察、チュートリアル、最新情報",
    comingSoon: "近日公開",
    comingSoonText: "サッカー分析、AI予測、ベッティング戦略に関する記事を準備中です。お楽しみに！",
    subscribeTitle: "通知を受け取る",
    subscribeText: "新しいコンテンツが公開されたら最初に知る",
    enterEmail: "メールアドレスを入力",
    subscribe: "購読する",
    footer: "© 2025 OddsFlow. 全著作権所有。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "분석",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기",
    blogTitle: "블로그",
    blogSubtitle: "OddsFlow 팀의 인사이트, 튜토리얼 및 업데이트",
    comingSoon: "곧 출시",
    comingSoonText: "축구 분석, AI 예측 및 베팅 전략에 관한 기사를 준비 중입니다. 기대해 주세요!",
    subscribeTitle: "알림 받기",
    subscribeText: "새 콘텐츠가 게시되면 가장 먼저 알아보세요",
    enterEmail: "이메일 입력",
    subscribe: "구독하기",
    footer: "© 2025 OddsFlow. 모든 권리 보유.",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "分析",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始",
    blogTitle: "博客",
    blogSubtitle: "来自 OddsFlow 团队的见解、教程和更新",
    comingSoon: "即将推出",
    comingSoonText: "我们正在为您带来关于足球分析、AI预测和投注策略的精彩文章。敬请期待！",
    subscribeTitle: "获取通知",
    subscribeText: "第一时间了解我们发布的新内容",
    enterEmail: "输入您的邮箱",
    subscribe: "订阅",
    footer: "© 2025 OddsFlow. 版权所有。",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "分析",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始",
    blogTitle: "部落格",
    blogSubtitle: "來自 OddsFlow 團隊的見解、教程和更新",
    comingSoon: "即將推出",
    comingSoonText: "我們正在為您帶來關於足球分析、AI預測和投注策略的精彩文章。敬請期待！",
    subscribeTitle: "獲取通知",
    subscribeText: "第一時間了解我們發布的新內容",
    enterEmail: "輸入您的郵箱",
    subscribe: "訂閱",
    footer: "© 2025 OddsFlow. 版權所有。",
  },
};

export default function BlogPage() {
  const [lang, setLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setLang(savedLang);
  }, []);

  const handleSetLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('oddsflow_lang', newLang);
    setLangDropdownOpen(false);
  };

  const t = (key: string) => translations[lang]?.[key] || translations['EN'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
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
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer">
                  <span>{currentLang.flag}</span>
                  <span className="font-medium">{currentLang.code}</span>
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    {LANGUAGES.map((language) => (
                      <button key={language.code} onClick={() => handleSetLang(language.code)} className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${lang === language.code ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300'}`}>
                        <span className="text-lg">{language.flag}</span>
                        <span className="font-medium">{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
              <Link href="/get-started" className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>

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
              {[
                { href: '/', label: t('home') },
                { href: '/predictions', label: t('predictions') },
                { href: '/leagues', label: t('leagues') },
                { href: '/performance', label: t('performance') },
                { href: '/community', label: t('community') },
                { href: '/news', label: t('news') },
                { href: '/pricing', label: t('pricing') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Login/Signup */}
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
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {t('blogTitle')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('blogSubtitle')}
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-12 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-6 md:p-12">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{t('comingSoon')}</h2>
            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-8">{t('comingSoonText')}</p>

            <div className="bg-black/50 rounded-xl p-4 md:p-6 border border-white/5">
              <h3 className="font-semibold mb-2">{t('subscribeTitle')}</h3>
              <p className="text-gray-500 text-sm mb-4">{t('subscribeText')}</p>
              {/* Mobile: Stacked layout, Desktop: Horizontal */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder={t('enterEmail')}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer whitespace-nowrap">
                  {t('subscribe')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
                <span className="text-xl font-bold">OddsFlow</span>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.</p>
              <div className="flex gap-4">
                {/* Facebook */}
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                {/* Telegram */}
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-white">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/predictions" className="hover:text-emerald-400 transition-colors">Predictions</Link></li>
                <li><Link href="/leagues" className="hover:text-emerald-400 transition-colors">Leagues</Link></li>
                <li><Link href="/performance" className="hover:text-emerald-400 transition-colors">AI Performance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-white">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/terms-of-service" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">{t('footer')}</p>
            <p className="text-gray-600 text-xs">Gambling involves risk. Please gamble responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
