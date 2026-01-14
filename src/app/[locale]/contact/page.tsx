'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, submitContactMessage } from '@/lib/supabase';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeToTranslationCode, type Locale } from '@/i18n/config';

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
    footer: "© 2026 OddsFlow. All rights reserved.",
    // Footer
    product: "Product",
    liveOdds: "AI Performance",
    solution: "Solution",
    popularLeagues: "Popular Leagues",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
    todayMatches: "Today Matches",
    company: "Company",
    aboutUs: "About Us",
    contact: "Contact",
    blog: "Blog",
    legal: "Legal",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
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
    footer: "© 2026 OddsFlow. Todos los derechos reservados.",
    // Footer
    product: "Producto",
    liveOdds: "Rendimiento IA",
    solution: "Solución",
    popularLeagues: "Ligas Populares",
    communityFooter: "Comunidad",
    globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios",
    todayMatches: "Partidos de Hoy",
    company: "Empresa",
    aboutUs: "Sobre Nosotros",
    contact: "Contacto",
    blog: "Blog",
    legal: "Legal",
    termsOfService: "Términos de Servicio",
    privacyPolicy: "Política de Privacidad",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juegue responsablemente.",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precisión de las predicciones y no somos responsables de ninguna pérdida financiera. El juego implica riesgo. Por favor juegue responsablemente. Si usted o alguien que conoce tiene un problema de juego, busque ayuda. Los usuarios deben tener más de 18 años.",
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
    footer: "© 2026 OddsFlow. Todos os direitos reservados.",
    // Footer
    product: "Produto",
    liveOdds: "Desempenho IA",
    solution: "Solução",
    popularLeagues: "Ligas Populares",
    communityFooter: "Comunidade",
    globalChat: "Chat Global",
    userPredictions: "Previsões de Usuários",
    todayMatches: "Jogos de Hoje",
    company: "Empresa",
    aboutUs: "Sobre Nós",
    contact: "Contato",
    blog: "Blog",
    legal: "Legal",
    termsOfService: "Termos de Serviço",
    privacyPolicy: "Política de Privacidade",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    disclaimer: "Aviso: OddsFlow fornece previsões baseadas em IA apenas para fins informativos e de entretenimento. Não garantimos a precisão das previsões e não somos responsáveis por quaisquer perdas financeiras. Apostas envolvem risco. Por favor aposte com responsabilidade. Se você ou alguém que conhece tem um problema com jogos, procure ajuda. Usuários devem ter mais de 18 anos.",
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
    footer: "© 2026 OddsFlow. Alle Rechte vorbehalten.",
    // Footer
    product: "Produkt",
    liveOdds: "KI-Leistung",
    solution: "Lösung",
    popularLeagues: "Beliebte Ligen",
    communityFooter: "Community",
    globalChat: "Globaler Chat",
    userPredictions: "Benutzer-Vorhersagen",
    todayMatches: "Heutige Spiele",
    company: "Unternehmen",
    aboutUs: "Über uns",
    contact: "Kontakt",
    blog: "Blog",
    legal: "Rechtliches",
    termsOfService: "Nutzungsbedingungen",
    privacyPolicy: "Datenschutz",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestützte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Wir garantieren nicht die Genauigkeit der Vorhersagen und sind nicht verantwortlich für finanzielle Verluste. Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll. Wenn Sie oder jemand, den Sie kennen, ein Glücksspielproblem hat, suchen Sie bitte Hilfe. Benutzer müssen über 18 Jahre alt sein.",
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
    footer: "© 2026 OddsFlow. Tous droits réservés.",
    // Footer
    product: "Produit",
    liveOdds: "Performance IA",
    solution: "Solution",
    popularLeagues: "Ligues Populaires",
    communityFooter: "Communauté",
    globalChat: "Chat Global",
    userPredictions: "Prédictions Utilisateurs",
    todayMatches: "Matchs du Jour",
    company: "Entreprise",
    aboutUs: "À Propos",
    contact: "Contact",
    blog: "Blog",
    legal: "Mentions Légales",
    termsOfService: "Conditions d'Utilisation",
    privacyPolicy: "Politique de Confidentialité",
    allRightsReserved: "Tous droits réservés.",
    gamblingWarning: "Le jeu comporte des risques. Veuillez jouer de manière responsable.",
    disclaimer: "Avertissement : OddsFlow fournit des prédictions basées sur l'IA à des fins d'information et de divertissement uniquement. Nous ne garantissons pas l'exactitude des prédictions et ne sommes pas responsables des pertes financières. Le jeu comporte des risques. Veuillez jouer de manière responsable. Si vous ou quelqu'un que vous connaissez a un problème de jeu, veuillez demander de l'aide. Les utilisateurs doivent avoir plus de 18 ans.",
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
    footer: "© 2026 OddsFlow. 全著作権所有。",
    // Footer
    product: "製品",
    liveOdds: "AI分析",
    solution: "ソリューション",
    popularLeagues: "人気リーグ",
    communityFooter: "コミュニティ",
    globalChat: "グローバルチャット",
    userPredictions: "ユーザー予測",
    todayMatches: "今日の試合",
    company: "会社",
    aboutUs: "会社概要",
    contact: "お問い合わせ",
    blog: "ブログ",
    legal: "法的情報",
    termsOfService: "利用規約",
    privacyPolicy: "プライバシーポリシー",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
    disclaimer: "免責事項：OddsFlowはAI駆動の予測を情報および娯楽目的のみで提供しています。予測の正確性を保証するものではなく、いかなる財務損失についても責任を負いません。ギャンブルにはリスクが伴います。責任を持ってお楽しみください。あなたまたはあなたの知人がギャンブル問題を抱えている場合は、助けを求めてください。ユーザーは18歳以上である必要があります。",
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
    footer: "© 2026 OddsFlow. 모든 권리 보유.",
    // Footer
    product: "제품",
    liveOdds: "AI 분석",
    solution: "솔루션",
    popularLeagues: "인기 리그",
    communityFooter: "커뮤니티",
    globalChat: "글로벌 채팅",
    userPredictions: "사용자 예측",
    todayMatches: "오늘의 경기",
    company: "회사",
    aboutUs: "회사 소개",
    contact: "연락처",
    blog: "블로그",
    legal: "법적 정보",
    termsOfService: "서비스 약관",
    privacyPolicy: "개인정보 처리방침",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다. 예측의 정확성을 보장하지 않으며 재정적 손실에 대해 책임지지 않습니다. 도박에는 위험이 따릅니다. 책임감 있게 베팅하세요. 본인 또는 아는 사람이 도박 문제가 있다면 도움을 구하세요. 사용자는 18세 이상이어야 합니다.",
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
    footer: "© 2026 OddsFlow. 版权所有。",
    // Footer
    product: "产品",
    liveOdds: "AI分析",
    solution: "解决方案",
    popularLeagues: "热门联赛",
    communityFooter: "社区",
    globalChat: "全球聊天",
    userPredictions: "用户预测",
    todayMatches: "今日比赛",
    company: "公司",
    aboutUs: "关于我们",
    contact: "联系我们",
    blog: "博客",
    legal: "法律",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩有风险，请理性投注。",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
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
    footer: "© 2026 OddsFlow. 版權所有。",
    // Footer
    product: "產品",
    liveOdds: "AI分析",
    solution: "解決方案",
    popularLeagues: "熱門聯賽",
    communityFooter: "社區",
    globalChat: "全球聊天",
    userPredictions: "用戶預測",
    todayMatches: "今日比賽",
    company: "公司",
    aboutUs: "關於我們",
    contact: "聯繫我們",
    blog: "部落格",
    legal: "法律",
    termsOfService: "服務條款",
    privacyPolicy: "隱私政策",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩有風險，請理性投注。",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
    successTitle: "發送成功!",
    successMessage: "感謝您的留言。我們將在24小時內回覆您。",
    sendAnother: "發送另一條訊息",
    errorMessage: "發送失敗，請重試。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    contactTitle: "Hubungi Kami",
    contactSubtitle: "Kami senang mendengar dari Anda. Hubungi tim kami.",
    generalInquiries: "Pertanyaan Umum",
    generalEmail: "support@oddsflow.com",
    businessInquiries: "Pertanyaan Bisnis",
    businessEmail: "business@oddsflow.com",
    sendMessage: "Kirim Pesan",
    name: "Nama", email: "Email", subject: "Subjek", message: "Pesan", send: "Kirim",
    sending: "Mengirim...",
    followUs: "Ikuti Kami",
    responseTime: "Kami biasanya merespons dalam 24 jam",
    footer: "© 2026 OddsFlow. Hak cipta dilindungi.",
    // Footer
    product: "Produk",
    liveOdds: "Performa AI",
    solution: "Solusi",
    popularLeagues: "Liga Populer",
    communityFooter: "Komunitas",
    globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna",
    todayMatches: "Pertandingan Hari Ini",
    company: "Perusahaan",
    aboutUs: "Tentang Kami",
    contact: "Kontak",
    blog: "Blog",
    legal: "Hukum",
    termsOfService: "Ketentuan Layanan",
    privacyPolicy: "Kebijakan Privasi",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
    successTitle: "Pesan Terkirim!",
    successMessage: "Terima kasih telah menghubungi kami. Kami akan membalas dalam 24 jam.",
    sendAnother: "Kirim Pesan Lain",
    errorMessage: "Gagal mengirim pesan. Silakan coba lagi.",
  },
};

export default function ContactPage() {
  const params = useParams();
  const urlLocale = (params?.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/contact';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check auth state
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

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;
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
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Login/Signup */}
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
                  </>
                )}
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
      <footer className="relative z-10 py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2">
              <Link href={localePath('/')} className="flex items-center gap-3 mb-6">
                <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
                <span className="text-xl font-bold">OddsFlow</span>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.</p>
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
                <li><Link href={localePath('/performance')} className="hover:text-emerald-400 transition-colors">{t('liveOdds')}</Link></li>
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
