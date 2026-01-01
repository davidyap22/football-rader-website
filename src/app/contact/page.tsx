'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { submitContactMessage } from '@/lib/supabase';

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
    contactTitle: "Contact Us",
    contactSubtitle: "We'd love to hear from you. Get in touch with our team.",
    generalInquiries: "General Inquiries",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "Business Inquiries",
    businessEmail: "business@oddsflow.com",
    sendMessage: "Send us a Message",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    send: "Send Message",
    sending: "Sending...",
    followUs: "Follow Us",
    responseTime: "We typically respond within 24 hours",
    footer: "© 2025 OddsFlow. All rights reserved.",
    successTitle: "Message Sent!",
    successMessage: "Thank you for contacting us. We'll get back to you within 24 hours.",
    sendAnother: "Send Another Message",
    errorMessage: "Failed to send message. Please try again.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Análisis",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Comenzar",
    contactTitle: "Contáctenos",
    contactSubtitle: "Nos encantaría saber de ti. Ponte en contacto con nuestro equipo.",
    generalInquiries: "Consultas Generales",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "Consultas Comerciales",
    businessEmail: "business@oddsflow.com",
    sendMessage: "Envíanos un Mensaje",
    name: "Nombre", email: "Correo", subject: "Asunto", message: "Mensaje", send: "Enviar",
    sending: "Enviando...",
    followUs: "Síguenos",
    responseTime: "Normalmente respondemos en 24 horas",
    footer: "© 2025 OddsFlow. Todos los derechos reservados.",
    successTitle: "¡Mensaje Enviado!",
    successMessage: "Gracias por contactarnos. Te responderemos en 24 horas.",
    sendAnother: "Enviar Otro Mensaje",
    errorMessage: "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Análise",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    contactTitle: "Contato",
    contactSubtitle: "Adoraríamos ouvir de você. Entre em contato com nossa equipe.",
    generalInquiries: "Consultas Gerais",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "Consultas Comerciais",
    businessEmail: "business@oddsflow.com",
    sendMessage: "Envie-nos uma Mensagem",
    name: "Nome", email: "E-mail", subject: "Assunto", message: "Mensagem", send: "Enviar",
    sending: "Enviando...",
    followUs: "Siga-nos",
    responseTime: "Normalmente respondemos em 24 horas",
    footer: "© 2025 OddsFlow. Todos os direitos reservados.",
    successTitle: "Mensagem Enviada!",
    successMessage: "Obrigado por entrar em contato. Responderemos em 24 horas.",
    sendAnother: "Enviar Outra Mensagem",
    errorMessage: "Falha ao enviar mensagem. Por favor, tente novamente.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    contactTitle: "Kontakt",
    contactSubtitle: "Wir freuen uns von Ihnen zu hören. Kontaktieren Sie unser Team.",
    generalInquiries: "Allgemeine Anfragen",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "Geschäftliche Anfragen",
    businessEmail: "business@oddsflow.com",
    sendMessage: "Nachricht Senden",
    name: "Name", email: "E-Mail", subject: "Betreff", message: "Nachricht", send: "Senden",
    sending: "Wird gesendet...",
    followUs: "Folgen Sie uns",
    responseTime: "Wir antworten normalerweise innerhalb von 24 Stunden",
    footer: "© 2025 OddsFlow. Alle Rechte vorbehalten.",
    successTitle: "Nachricht Gesendet!",
    successMessage: "Vielen Dank für Ihre Kontaktaufnahme. Wir melden uns innerhalb von 24 Stunden.",
    sendAnother: "Weitere Nachricht Senden",
    errorMessage: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Analyse",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    contactTitle: "Contactez-nous",
    contactSubtitle: "Nous serions ravis de vous entendre. Contactez notre équipe.",
    generalInquiries: "Demandes Générales",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "Demandes Commerciales",
    businessEmail: "business@oddsflow.com",
    sendMessage: "Envoyez-nous un Message",
    name: "Nom", email: "E-mail", subject: "Objet", message: "Message", send: "Envoyer",
    sending: "Envoi en cours...",
    followUs: "Suivez-nous",
    responseTime: "Nous répondons généralement dans les 24 heures",
    footer: "© 2025 OddsFlow. Tous droits réservés.",
    successTitle: "Message Envoyé!",
    successMessage: "Merci de nous avoir contactés. Nous vous répondrons dans les 24 heures.",
    sendAnother: "Envoyer un Autre Message",
    errorMessage: "Échec de l'envoi du message. Veuillez réessayer.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "分析",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    contactTitle: "お問い合わせ",
    contactSubtitle: "お気軽にお問い合わせください。",
    generalInquiries: "一般的なお問い合わせ",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "ビジネスに関するお問い合わせ",
    businessEmail: "business@oddsflow.com",
    sendMessage: "メッセージを送る",
    name: "お名前", email: "メール", subject: "件名", message: "メッセージ", send: "送信",
    sending: "送信中...",
    followUs: "フォローする",
    responseTime: "通常24時間以内に返信いたします",
    footer: "© 2025 OddsFlow. 全著作権所有。",
    successTitle: "送信完了!",
    successMessage: "お問い合わせありがとうございます。24時間以内にご返信いたします。",
    sendAnother: "別のメッセージを送る",
    errorMessage: "メッセージの送信に失敗しました。もう一度お試しください。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "분석",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기",
    contactTitle: "문의하기",
    contactSubtitle: "연락을 기다리고 있습니다. 팀에 문의하세요.",
    generalInquiries: "일반 문의",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "비즈니스 문의",
    businessEmail: "business@oddsflow.com",
    sendMessage: "메시지 보내기",
    name: "이름", email: "이메일", subject: "제목", message: "메시지", send: "보내기",
    sending: "전송 중...",
    followUs: "팔로우",
    responseTime: "보통 24시간 이내에 답변드립니다",
    footer: "© 2025 OddsFlow. 모든 권리 보유.",
    successTitle: "메시지 전송 완료!",
    successMessage: "문의해 주셔서 감사합니다. 24시간 이내에 답변 드리겠습니다.",
    sendAnother: "다른 메시지 보내기",
    errorMessage: "메시지 전송에 실패했습니다. 다시 시도해 주세요.",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "分析",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始",
    contactTitle: "联系我们",
    contactSubtitle: "我们很乐意听取您的意见。与我们的团队取得联系。",
    generalInquiries: "一般咨询",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "商务合作",
    businessEmail: "business@oddsflow.com",
    sendMessage: "发送消息",
    name: "姓名", email: "邮箱", subject: "主题", message: "消息", send: "发送",
    sending: "发送中...",
    followUs: "关注我们",
    responseTime: "我们通常在24小时内回复",
    footer: "© 2025 OddsFlow. 版权所有。",
    successTitle: "发送成功!",
    successMessage: "感谢您的留言。我们将在24小时内回复您。",
    sendAnother: "发送另一条消息",
    errorMessage: "发送失败，请重试。",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "分析",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始",
    contactTitle: "聯繫我們",
    contactSubtitle: "我們很樂意聽取您的意見。與我們的團隊取得聯繫。",
    generalInquiries: "一般諮詢",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "商務合作",
    businessEmail: "business@oddsflow.com",
    sendMessage: "發送訊息",
    name: "姓名", email: "郵箱", subject: "主題", message: "訊息", send: "發送",
    sending: "發送中...",
    followUs: "關注我們",
    responseTime: "我們通常在24小時內回覆",
    footer: "© 2025 OddsFlow. 版權所有。",
    successTitle: "發送成功!",
    successMessage: "感謝您的留言。我們將在24小時內回覆您。",
    sendAnother: "發送另一條訊息",
    errorMessage: "發送失敗，請重試。",
  },
};

export default function ContactPage() {
  const [lang, setLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setLang(savedLang);
  }, []);

  const handleSetLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('oddsflow_lang', newLang);
    setLangDropdownOpen(false);
  };

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if field is invalid
  const isFieldInvalid = (field: keyof typeof formData) => {
    if (!touched[field]) return false;
    if (field === 'email') {
      return !formData.email || !isValidEmail(formData.email);
    }
    return !formData[field];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, email: true, subject: true, message: true });

    // Validate all fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return;
    }
    if (!isValidEmail(formData.email)) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { error: submitError } = await submitContactMessage(formData);

      if (submitError) {
        console.error('Supabase error:', submitError);
        setError(submitError.message || t('errorMessage'));
      } else {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouched({ name: false, email: false, subject: false, message: false });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(t('errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setIsSuccess(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTouched({ name: false, email: false, subject: false, message: false });
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
            {t('contactTitle')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('contactSubtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('generalInquiries')}</h3>
              <a href="mailto:support@oddsflow.com" className="text-emerald-400 hover:underline">{t('generalEmail')}</a>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('businessInquiries')}</h3>
              <a href="mailto:business@oddsflow.com" className="text-cyan-400 hover:underline">{t('businessEmail')}</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
              {isSuccess ? (
                // Success Message
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-emerald-400">{t('successTitle')}</h2>
                  <p className="text-gray-400 mb-8">{t('successMessage')}</p>
                  <button
                    onClick={handleSendAnother}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    {t('sendAnother')}
                  </button>
                </div>
              ) : (
                // Contact Form
                <>
                  <h2 className="text-2xl font-bold mb-6">{t('sendMessage')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t('name')}</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('name')}
                          autoComplete="off"
                          className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none transition-colors text-white ${
                            isFieldInvalid('name')
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-white/10 focus:border-emerald-500/50'
                          }`}
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        />
                        {isFieldInvalid('name') && (
                          <p className="text-red-500 text-xs mt-1">{t('name')} is required</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t('email')}</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('email')}
                          autoComplete="off"
                          className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none transition-colors text-white ${
                            isFieldInvalid('email')
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-white/10 focus:border-emerald-500/50'
                          }`}
                          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                        />
                        {isFieldInvalid('email') && (
                          <p className="text-red-500 text-xs mt-1">
                            {!formData.email ? `${t('email')} is required` : 'Please enter a valid email'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t('subject')}</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('subject')}
                        autoComplete="off"
                        className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none transition-colors text-white ${
                          isFieldInvalid('subject')
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-white/10 focus:border-emerald-500/50'
                        }`}
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      />
                      {isFieldInvalid('subject') && (
                        <p className="text-red-500 text-xs mt-1">{t('subject')} is required</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t('message')}</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('message')}
                        rows={5}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none transition-colors resize-none text-white ${
                          isFieldInvalid('message')
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-white/10 focus:border-emerald-500/50'
                        }`}
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      />
                      {isFieldInvalid('message') && (
                        <p className="text-red-500 text-xs mt-1">{t('message')} is required</p>
                      )}
                    </div>
                    {error && (
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? t('sending') : t('send')}
                    </button>
                  </form>
                  <p className="text-center text-gray-500 text-sm mt-4">{t('responseTime')}</p>
                </>
              )}
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
