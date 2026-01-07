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
  { code: 'ID', name: 'Bahasa Indonesia', flag: '🇮🇩' },
];

const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    blogTitle: "Blog",
    blogSubtitle: "Insights, tutorials, and updates from the OddsFlow team",
    all: "All",
    tutorials: "Tutorials",
    insights: "Insights",
    updates: "Updates",
    readMore: "Read More",
    minRead: "min read",
    featured: "Featured",
    // Footer
    product: "Product",
    liveOdds: "AI Performance",
    solution: "Solution",
    popularLeagues: "Popular Leagues",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
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
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Análisis",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Comenzar",
    blogTitle: "Blog",
    blogSubtitle: "Información, tutoriales y actualizaciones del equipo de OddsFlow",
    all: "Todo",
    tutorials: "Tutoriales",
    insights: "Perspectivas",
    updates: "Actualizaciones",
    readMore: "Leer Más",
    minRead: "min de lectura",
    featured: "Destacado",
    product: "Producto", liveOdds: "Rendimiento IA", solution: "Solución", popularLeagues: "Ligas Populares",
    communityFooter: "Comunidad", globalChat: "Chat Global", userPredictions: "Predicciones de Usuarios",
    company: "Empresa", aboutUs: "Sobre Nosotros", contact: "Contacto", blog: "Blog",
    legal: "Legal", termsOfService: "Términos de Servicio", privacyPolicy: "Política de Privacidad",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juegue responsablemente.",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precisión de las predicciones y no somos responsables de ninguna pérdida financiera. El juego implica riesgo. Por favor juegue responsablemente. Si usted o alguien que conoce tiene un problema de juego, busque ayuda. Los usuarios deben tener más de 18 años.",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Análise",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    blogTitle: "Blog",
    blogSubtitle: "Insights, tutoriais e atualizações da equipe OddsFlow",
    all: "Todos",
    tutorials: "Tutoriais",
    insights: "Insights",
    updates: "Atualizações",
    readMore: "Leia Mais",
    minRead: "min de leitura",
    featured: "Destaque",
    product: "Produto", liveOdds: "Desempenho IA", solution: "Solução", popularLeagues: "Ligas Populares",
    communityFooter: "Comunidade", globalChat: "Chat Global", userPredictions: "Previsões de Usuários",
    company: "Empresa", aboutUs: "Sobre Nós", contact: "Contato", blog: "Blog",
    legal: "Legal", termsOfService: "Termos de Serviço", privacyPolicy: "Política de Privacidade",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    disclaimer: "Aviso: OddsFlow fornece previsões baseadas em IA apenas para fins informativos e de entretenimento. Não garantimos a precisão das previsões e não somos responsáveis por quaisquer perdas financeiras. Apostas envolvem risco. Por favor aposte com responsabilidade. Se você ou alguém que conhece tem um problema com jogos, procure ajuda. Usuários devem ter mais de 18 anos.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    blogTitle: "Blog",
    blogSubtitle: "Einblicke, Tutorials und Updates vom OddsFlow-Team",
    all: "Alle",
    tutorials: "Tutorials",
    insights: "Einblicke",
    updates: "Updates",
    readMore: "Weiterlesen",
    minRead: "Min. Lesezeit",
    featured: "Empfohlen",
    product: "Produkt", liveOdds: "KI-Leistung", solution: "Lösung", popularLeagues: "Beliebte Ligen",
    communityFooter: "Community", globalChat: "Globaler Chat", userPredictions: "Benutzer-Vorhersagen",
    company: "Unternehmen", aboutUs: "Über uns", contact: "Kontakt", blog: "Blog",
    legal: "Rechtliches", termsOfService: "Nutzungsbedingungen", privacyPolicy: "Datenschutz",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestützte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Wir garantieren nicht die Genauigkeit der Vorhersagen und sind nicht verantwortlich für finanzielle Verluste. Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll. Wenn Sie oder jemand, den Sie kennen, ein Glücksspielproblem hat, suchen Sie bitte Hilfe. Benutzer müssen über 18 Jahre alt sein.",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Analyse",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    blogTitle: "Blog",
    blogSubtitle: "Analyses, tutoriels et mises à jour de l'équipe OddsFlow",
    all: "Tout",
    tutorials: "Tutoriels",
    insights: "Perspectives",
    updates: "Mises à jour",
    readMore: "Lire Plus",
    minRead: "min de lecture",
    featured: "À la une",
    product: "Produit", liveOdds: "Performance IA", solution: "Solution", popularLeagues: "Ligues Populaires",
    communityFooter: "Communauté", globalChat: "Chat Global", userPredictions: "Prédictions Utilisateurs",
    company: "Entreprise", aboutUs: "À Propos", contact: "Contact", blog: "Blog",
    legal: "Mentions Légales", termsOfService: "Conditions d'Utilisation", privacyPolicy: "Politique de Confidentialité",
    allRightsReserved: "Tous droits réservés.",
    gamblingWarning: "Le jeu comporte des risques. Veuillez jouer de manière responsable.",
    disclaimer: "Avertissement : OddsFlow fournit des prédictions basées sur l'IA à des fins d'information et de divertissement uniquement. Nous ne garantissons pas l'exactitude des prédictions et ne sommes pas responsables des pertes financières. Le jeu comporte des risques. Veuillez jouer de manière responsable. Si vous ou quelqu'un que vous connaissez a un problème de jeu, veuillez demander de l'aide. Les utilisateurs doivent avoir plus de 18 ans.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "分析",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    blogTitle: "ブログ",
    blogSubtitle: "OddsFlowチームからの洞察、チュートリアル、最新情報",
    all: "すべて",
    tutorials: "チュートリアル",
    insights: "インサイト",
    updates: "アップデート",
    readMore: "続きを読む",
    minRead: "分で読める",
    featured: "注目",
    product: "製品", liveOdds: "AI分析", solution: "ソリューション", popularLeagues: "人気リーグ",
    communityFooter: "コミュニティ", globalChat: "グローバルチャット", userPredictions: "ユーザー予測",
    company: "会社", aboutUs: "会社概要", contact: "お問い合わせ", blog: "ブログ",
    legal: "法的情報", termsOfService: "利用規約", privacyPolicy: "プライバシーポリシー",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
    disclaimer: "免責事項：OddsFlowはAI駆動の予測を情報および娯楽目的のみで提供しています。予測の正確性を保証するものではなく、いかなる財務損失についても責任を負いません。ギャンブルにはリスクが伴います。責任を持ってお楽しみください。あなたまたはあなたの知人がギャンブル問題を抱えている場合は、助けを求めてください。ユーザーは18歳以上である必要があります。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "분석",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기",
    blogTitle: "블로그",
    blogSubtitle: "OddsFlow 팀의 인사이트, 튜토리얼 및 업데이트",
    all: "전체",
    tutorials: "튜토리얼",
    insights: "인사이트",
    updates: "업데이트",
    readMore: "더 읽기",
    minRead: "분 소요",
    featured: "추천",
    product: "제품", liveOdds: "AI 분석", solution: "솔루션", popularLeagues: "인기 리그",
    communityFooter: "커뮤니티", globalChat: "글로벌 채팅", userPredictions: "사용자 예측",
    company: "회사", aboutUs: "회사 소개", contact: "연락처", blog: "블로그",
    legal: "법적 정보", termsOfService: "서비스 약관", privacyPolicy: "개인정보 처리방침",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다. 예측의 정확성을 보장하지 않으며 재정적 손실에 대해 책임지지 않습니다. 도박에는 위험이 따릅니다. 책임감 있게 베팅하세요. 본인 또는 아는 사람이 도박 문제가 있다면 도움을 구하세요. 사용자는 18세 이상이어야 합니다.",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "分析",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始",
    blogTitle: "博客",
    blogSubtitle: "来自 OddsFlow 团队的见解、教程和更新",
    all: "全部",
    tutorials: "教程",
    insights: "洞察",
    updates: "更新",
    readMore: "阅读更多",
    minRead: "分钟阅读",
    featured: "精选",
    product: "产品", liveOdds: "AI分析", solution: "解决方案", popularLeagues: "热门联赛",
    communityFooter: "社区", globalChat: "全球聊天", userPredictions: "用户预测",
    company: "公司", aboutUs: "关于我们", contact: "联系我们", blog: "博客",
    legal: "法律", termsOfService: "服务条款", privacyPolicy: "隐私政策",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩有风险，请理性投注。",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "分析",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始",
    blogTitle: "部落格",
    blogSubtitle: "來自 OddsFlow 團隊的見解、教程和更新",
    all: "全部",
    tutorials: "教程",
    insights: "洞察",
    updates: "更新",
    readMore: "閱讀更多",
    minRead: "分鐘閱讀",
    featured: "精選",
    product: "產品", liveOdds: "AI分析", solution: "解決方案", popularLeagues: "熱門聯賽",
    communityFooter: "社區", globalChat: "全球聊天", userPredictions: "用戶預測",
    company: "公司", aboutUs: "關於我們", contact: "聯繫我們", blog: "部落格",
    legal: "法律", termsOfService: "服務條款", privacyPolicy: "隱私政策",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩有風險，請理性投注。",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    blogTitle: "Blog",
    blogSubtitle: "Wawasan, tutorial, dan pembaruan dari tim OddsFlow",
    all: "Semua",
    tutorials: "Tutorial",
    insights: "Wawasan",
    updates: "Pembaruan",
    readMore: "Baca Selengkapnya",
    minRead: "menit baca",
    featured: "Unggulan",
    product: "Produk", liveOdds: "Performa AI", solution: "Solusi", popularLeagues: "Liga Populer",
    communityFooter: "Komunitas", globalChat: "Obrolan Global", userPredictions: "Prediksi Pengguna",
    company: "Perusahaan", aboutUs: "Tentang Kami", contact: "Kontak", blog: "Blog",
    legal: "Hukum", termsOfService: "Ketentuan Layanan", privacyPolicy: "Kebijakan Privasi",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
  },
};

// Blog post content translations
const blogPosts: Record<string, {
  id: string;
  category: 'tutorial' | 'insight' | 'update';
  image: string;
  readTime: number;
  date: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
}[]> = {
  posts: [
    {
      id: 'getting-started-oddsflow',
      category: 'tutorial',
      image: '/blog/tutorial-1.jpg',
      readTime: 5,
      date: '2026-01-05',
      title: {
        EN: 'Getting Started with OddsFlow: A Complete Guide',
        ES: 'Comenzando con OddsFlow: Guía Completa',
        PT: 'Começando com OddsFlow: Guia Completo',
        DE: 'Erste Schritte mit OddsFlow: Ein vollständiger Leitfaden',
        FR: 'Débuter avec OddsFlow : Guide Complet',
        JA: 'OddsFlow入門：完全ガイド',
        KO: 'OddsFlow 시작하기: 완전 가이드',
        '中文': 'OddsFlow入门：完整指南',
        '繁體': 'OddsFlow入門：完整指南',
        ID: 'Memulai dengan OddsFlow: Panduan Lengkap',
      },
      excerpt: {
        EN: 'Learn how to set up your account, navigate the dashboard, and make the most of AI-powered predictions for smarter betting decisions.',
        ES: 'Aprende cómo configurar tu cuenta, navegar por el panel y aprovechar al máximo las predicciones de IA para decisiones de apuestas más inteligentes.',
        PT: 'Aprenda a configurar sua conta, navegar pelo painel e aproveitar ao máximo as previsões de IA para decisões de apostas mais inteligentes.',
        DE: 'Erfahren Sie, wie Sie Ihr Konto einrichten, das Dashboard navigieren und das Beste aus KI-gestützten Vorhersagen für klügere Wettentscheidungen herausholen.',
        FR: 'Apprenez à configurer votre compte, naviguer dans le tableau de bord et tirer le meilleur parti des prédictions IA pour des paris plus intelligents.',
        JA: 'アカウントの設定方法、ダッシュボードの操作方法、AI予測を活用したスマートなベッティング判断について学びましょう。',
        KO: '계정 설정, 대시보드 탐색, AI 기반 예측을 활용한 현명한 베팅 결정 방법을 알아보세요.',
        '中文': '了解如何设置账户、浏览仪表板，并充分利用AI预测做出更明智的投注决策。',
        '繁體': '了解如何設置帳戶、瀏覽儀表板，並充分利用AI預測做出更明智的投注決策。',
        ID: 'Pelajari cara mengatur akun Anda, menavigasi dasbor, dan memanfaatkan prediksi AI untuk keputusan taruhan yang lebih cerdas.',
      },
    },
    {
      id: 'understanding-odds-formats',
      category: 'tutorial',
      image: '/blog/tutorial-2.jpg',
      readTime: 7,
      date: '2026-01-03',
      title: {
        EN: 'Understanding Odds Formats: Decimal, Fractional & American',
        ES: 'Entendiendo los Formatos de Cuotas: Decimal, Fraccional y Americana',
        PT: 'Entendendo Formatos de Odds: Decimal, Fracionária e Americana',
        DE: 'Quotenformate verstehen: Dezimal, Bruch & Amerikanisch',
        FR: 'Comprendre les Formats de Cotes : Décimal, Fractionnaire et Américain',
        JA: 'オッズ形式を理解する：デシマル、フラクショナル、アメリカン',
        KO: '배당률 형식 이해하기: 소수점, 분수, 미국식',
        '中文': '理解赔率格式：小数、分数和美式',
        '繁體': '理解賠率格式：小數、分數和美式',
        ID: 'Memahami Format Odds: Desimal, Pecahan & Amerika',
      },
      excerpt: {
        EN: 'Master the three main odds formats used worldwide. Convert between them easily and understand implied probability for better value betting.',
        ES: 'Domina los tres formatos principales de cuotas usados en todo el mundo. Convierte entre ellos fácilmente y entiende la probabilidad implícita.',
        PT: 'Domine os três principais formatos de odds usados mundialmente. Converta entre eles facilmente e entenda a probabilidade implícita.',
        DE: 'Beherrschen Sie die drei wichtigsten Quotenformate weltweit. Konvertieren Sie einfach zwischen ihnen und verstehen Sie implizite Wahrscheinlichkeiten.',
        FR: 'Maîtrisez les trois principaux formats de cotes utilisés dans le monde. Convertissez facilement entre eux et comprenez la probabilité implicite.',
        JA: '世界で使用される3つの主要なオッズ形式をマスターしましょう。簡単に変換し、暗示確率を理解してより良いベッティングを。',
        KO: '전 세계에서 사용되는 세 가지 주요 배당률 형식을 마스터하세요. 쉽게 변환하고 내재 확률을 이해하세요.',
        '中文': '掌握全球使用的三种主要赔率格式。轻松转换并理解隐含概率以获得更好的价值投注。',
        '繁體': '掌握全球使用的三種主要賠率格式。輕鬆轉換並理解隱含概率以獲得更好的價值投注。',
        ID: 'Kuasai tiga format odds utama yang digunakan di seluruh dunia. Konversi dengan mudah dan pahami probabilitas tersirat.',
      },
    },
    {
      id: 'bankroll-management',
      category: 'tutorial',
      image: '/blog/tutorial-3.jpg',
      readTime: 6,
      date: '2025-12-28',
      title: {
        EN: 'Bankroll Management: The Key to Long-term Success',
        ES: 'Gestión de Bankroll: La Clave del Éxito a Largo Plazo',
        PT: 'Gestão de Banca: A Chave para o Sucesso a Longo Prazo',
        DE: 'Bankroll-Management: Der Schlüssel zum langfristigen Erfolg',
        FR: 'Gestion de Bankroll : La Clé du Succès à Long Terme',
        JA: 'バンクロール管理：長期的成功の鍵',
        KO: '자금 관리: 장기적 성공의 핵심',
        '中文': '资金管理：长期成功的关键',
        '繁體': '資金管理：長期成功的關鍵',
        ID: 'Manajemen Bankroll: Kunci Sukses Jangka Panjang',
      },
      excerpt: {
        EN: 'Learn proven strategies for managing your betting bankroll. Discover unit sizing, the Kelly Criterion, and how to avoid common pitfalls.',
        ES: 'Aprende estrategias probadas para gestionar tu bankroll de apuestas. Descubre el tamaño de unidades, el Criterio de Kelly y cómo evitar errores comunes.',
        PT: 'Aprenda estratégias comprovadas para gerenciar sua banca de apostas. Descubra dimensionamento de unidades, o Critério de Kelly e como evitar armadilhas.',
        DE: 'Lernen Sie bewährte Strategien für die Verwaltung Ihrer Wettbankroll. Entdecken Sie Einheitengrößen, das Kelly-Kriterium und wie Sie häufige Fallstricke vermeiden.',
        FR: 'Apprenez des stratégies éprouvées pour gérer votre bankroll de paris. Découvrez le dimensionnement des unités, le Critère de Kelly et comment éviter les pièges.',
        JA: 'ベッティングバンクロールの管理に実績のある戦略を学びましょう。ユニットサイジング、ケリー基準、よくある落とし穴を避ける方法を発見してください。',
        KO: '베팅 자금 관리를 위한 검증된 전략을 배우세요. 단위 크기 조정, 켈리 기준, 일반적인 함정을 피하는 방법을 알아보세요.',
        '中文': '学习管理投注资金的经过验证的策略。了解单位大小、凯利准则以及如何避免常见陷阱。',
        '繁體': '學習管理投注資金的經過驗證的策略。了解單位大小、凱利準則以及如何避免常見陷阱。',
        ID: 'Pelajari strategi terbukti untuk mengelola bankroll taruhan Anda. Temukan ukuran unit, Kriteria Kelly, dan cara menghindari jebakan umum.',
      },
    },
    {
      id: 'ai-prediction-accuracy',
      category: 'insight',
      image: '/blog/insight-1.jpg',
      readTime: 8,
      date: '2026-01-04',
      title: {
        EN: 'How Our AI Achieves 68% Prediction Accuracy',
        ES: 'Cómo Nuestra IA Logra 68% de Precisión en Predicciones',
        PT: 'Como Nossa IA Alcança 68% de Precisão nas Previsões',
        DE: 'Wie unsere KI 68% Vorhersagegenauigkeit erreicht',
        FR: 'Comment Notre IA Atteint 68% de Précision',
        JA: '当社のAIが68%の予測精度を達成する方法',
        KO: 'AI가 68% 예측 정확도를 달성하는 방법',
        '中文': '我们的AI如何实现68%的预测准确率',
        '繁體': '我們的AI如何實現68%的預測準確率',
        ID: 'Bagaimana AI Kami Mencapai Akurasi Prediksi 68%',
      },
      excerpt: {
        EN: 'Dive deep into the machine learning models behind OddsFlow. Understand how we analyze 50+ data points per match to generate accurate predictions.',
        ES: 'Profundiza en los modelos de aprendizaje automático detrás de OddsFlow. Entiende cómo analizamos más de 50 puntos de datos por partido.',
        PT: 'Mergulhe nos modelos de machine learning por trás do OddsFlow. Entenda como analisamos mais de 50 pontos de dados por partida.',
        DE: 'Tauchen Sie tief in die Machine-Learning-Modelle hinter OddsFlow ein. Verstehen Sie, wie wir 50+ Datenpunkte pro Spiel analysieren.',
        FR: 'Plongez dans les modèles de machine learning derrière OddsFlow. Comprenez comment nous analysons plus de 50 points de données par match.',
        JA: 'OddsFlowの背後にある機械学習モデルを深く掘り下げます。試合ごとに50以上のデータポイントを分析する方法を理解しましょう。',
        KO: 'OddsFlow의 머신러닝 모델을 자세히 살펴보세요. 경기당 50개 이상의 데이터 포인트를 분석하는 방법을 이해하세요.',
        '中文': '深入了解OddsFlow背后的机器学习模型。了解我们如何分析每场比赛50多个数据点来生成准确预测。',
        '繁體': '深入了解OddsFlow背後的機器學習模型。了解我們如何分析每場比賽50多個數據點來生成準確預測。',
        ID: 'Selami model machine learning di balik OddsFlow. Pahami bagaimana kami menganalisis 50+ poin data per pertandingan.',
      },
    },
    {
      id: 'premier-league-analysis',
      category: 'insight',
      image: '/blog/insight-2.jpg',
      readTime: 10,
      date: '2025-12-30',
      title: {
        EN: 'Premier League 2025/26: Mid-Season Statistical Analysis',
        ES: 'Premier League 2025/26: Análisis Estadístico de Media Temporada',
        PT: 'Premier League 2025/26: Análise Estatística do Meio da Temporada',
        DE: 'Premier League 2025/26: Statistische Analyse zur Halbzeit',
        FR: 'Premier League 2025/26 : Analyse Statistique de Mi-Saison',
        JA: 'プレミアリーグ2025/26：シーズン中盤の統計分析',
        KO: '프리미어리그 2025/26: 시즌 중반 통계 분석',
        '中文': '英超2025/26：赛季中期统计分析',
        '繁體': '英超2025/26：賽季中期統計分析',
        ID: 'Premier League 2025/26: Analisis Statistik Pertengahan Musim',
      },
      excerpt: {
        EN: 'Comprehensive breakdown of xG, possession stats, and form analysis for all 20 Premier League teams. Find value in the second half of the season.',
        ES: 'Desglose completo de xG, estadísticas de posesión y análisis de forma para los 20 equipos de la Premier League. Encuentra valor en la segunda mitad.',
        PT: 'Análise completa de xG, estatísticas de posse e análise de forma para todos os 20 times da Premier League. Encontre valor na segunda metade.',
        DE: 'Umfassende Aufschlüsselung von xG, Ballbesitzstatistiken und Formanalyse für alle 20 Premier-League-Teams. Finden Sie Wert in der zweiten Halbzeit.',
        FR: 'Analyse complète des xG, statistiques de possession et analyse de forme pour les 20 équipes de Premier League. Trouvez de la valeur en deuxième partie.',
        JA: 'プレミアリーグ全20チームのxG、ポゼッション統計、フォーム分析の包括的な内訳。シーズン後半のバリューを見つけましょう。',
        KO: '프리미어리그 20개 팀의 xG, 점유율 통계, 폼 분석을 종합적으로 분석합니다. 시즌 후반부의 가치를 찾아보세요.',
        '中文': '全面分析英超20支球队的xG、控球率统计和状态分析。在下半赛季发现价值。',
        '繁體': '全面分析英超20支球隊的xG、控球率統計和狀態分析。在下半賽季發現價值。',
        ID: 'Analisis lengkap xG, statistik penguasaan bola, dan analisis form untuk 20 tim Premier League. Temukan nilai di paruh kedua musim.',
      },
    },
    {
      id: 'home-advantage-myth',
      category: 'insight',
      image: '/blog/insight-3.jpg',
      readTime: 6,
      date: '2025-12-22',
      title: {
        EN: 'Is Home Advantage Still a Factor in Modern Football?',
        ES: '¿Sigue Siendo la Ventaja de Local un Factor en el Fútbol Moderno?',
        PT: 'A Vantagem de Jogar em Casa Ainda é um Fator no Futebol Moderno?',
        DE: 'Ist Heimvorteil im modernen Fußball noch ein Faktor?',
        FR: "L'Avantage à Domicile Est-il Encore un Facteur dans le Football Moderne?",
        JA: '現代サッカーでホームアドバンテージはまだ重要か？',
        KO: '홈 어드밴티지는 현대 축구에서 여전히 중요한가?',
        '中文': '主场优势在现代足球中还重要吗？',
        '繁體': '主場優勢在現代足球中還重要嗎？',
        ID: 'Apakah Keuntungan Kandang Masih Menjadi Faktor dalam Sepak Bola Modern?',
      },
      excerpt: {
        EN: 'Our data scientists analyze 10,000+ matches to reveal how home advantage has evolved post-pandemic and what it means for your betting strategy.',
        ES: 'Nuestros científicos de datos analizan más de 10,000 partidos para revelar cómo ha evolucionado la ventaja de local post-pandemia.',
        PT: 'Nossos cientistas de dados analisam mais de 10.000 partidas para revelar como a vantagem em casa evoluiu pós-pandemia.',
        DE: 'Unsere Datenwissenschaftler analysieren über 10.000 Spiele, um zu zeigen, wie sich der Heimvorteil nach der Pandemie entwickelt hat.',
        FR: 'Nos data scientists analysent plus de 10 000 matchs pour révéler comment l\'avantage à domicile a évolué après la pandémie.',
        JA: 'データサイエンティストが10,000試合以上を分析し、パンデミック後のホームアドバンテージの変化を明らかにします。',
        KO: '데이터 과학자들이 10,000경기 이상을 분석하여 팬데믹 이후 홈 어드밴티지가 어떻게 변화했는지 밝힙니다.',
        '中文': '我们的数据科学家分析了10,000多场比赛，揭示疫情后主场优势如何演变及其对投注策略的影响。',
        '繁體': '我們的數據科學家分析了10,000多場比賽，揭示疫情後主場優勢如何演變及其對投注策略的影響。',
        ID: 'Ilmuwan data kami menganalisis 10.000+ pertandingan untuk mengungkap bagaimana keuntungan kandang telah berkembang pasca-pandemi.',
      },
    },
    {
      id: 'new-features-jan-2026',
      category: 'update',
      image: '/blog/update-1.jpg',
      readTime: 4,
      date: '2026-01-06',
      title: {
        EN: 'New Features: Live Odds Tracker & Enhanced Dashboard',
        ES: 'Nuevas Funciones: Rastreador de Cuotas en Vivo y Panel Mejorado',
        PT: 'Novos Recursos: Rastreador de Odds ao Vivo e Painel Aprimorado',
        DE: 'Neue Funktionen: Live-Quoten-Tracker & Verbessertes Dashboard',
        FR: 'Nouvelles Fonctionnalités : Suivi des Cotes en Direct & Tableau de Bord Amélioré',
        JA: '新機能：ライブオッズトラッカーと強化されたダッシュボード',
        KO: '새로운 기능: 실시간 배당률 추적기 및 향상된 대시보드',
        '中文': '新功能：实时赔率追踪器和增强版仪表板',
        '繁體': '新功能：實時賠率追蹤器和增強版儀表板',
        ID: 'Fitur Baru: Pelacak Odds Langsung & Dasbor yang Ditingkatkan',
      },
      excerpt: {
        EN: 'Introducing our latest update with real-time odds movement tracking, personalized dashboard widgets, and improved mobile experience.',
        ES: 'Presentamos nuestra última actualización con seguimiento de movimiento de cuotas en tiempo real, widgets de panel personalizados y experiencia móvil mejorada.',
        PT: 'Apresentando nossa última atualização com rastreamento de movimento de odds em tempo real, widgets de painel personalizados e experiência móvel aprimorada.',
        DE: 'Wir stellen unser neuestes Update mit Echtzeit-Quotenverfolgung, personalisierten Dashboard-Widgets und verbesserter mobiler Erfahrung vor.',
        FR: 'Découvrez notre dernière mise à jour avec suivi des mouvements de cotes en temps réel, widgets de tableau de bord personnalisés et expérience mobile améliorée.',
        JA: 'リアルタイムのオッズ変動追跡、パーソナライズされたダッシュボードウィジェット、改善されたモバイル体験を含む最新アップデートを紹介します。',
        KO: '실시간 배당률 변동 추적, 개인화된 대시보드 위젯, 향상된 모바일 경험을 포함한 최신 업데이트를 소개합니다.',
        '中文': '介绍我们的最新更新，包括实时赔率变动追踪、个性化仪表板小部件和改进的移动体验。',
        '繁體': '介紹我們的最新更新，包括實時賠率變動追蹤、個性化儀表板小部件和改進的移動體驗。',
        ID: 'Memperkenalkan pembaruan terbaru kami dengan pelacakan pergerakan odds real-time, widget dasbor yang dipersonalisasi, dan pengalaman mobile yang ditingkatkan.',
      },
    },
    {
      id: 'fifa-world-cup-2026',
      category: 'update',
      image: '/blog/update-2.jpg',
      readTime: 5,
      date: '2026-01-02',
      title: {
        EN: 'FIFA World Cup 2026: OddsFlow Coverage Begins',
        ES: 'Copa Mundial FIFA 2026: Comienza la Cobertura de OddsFlow',
        PT: 'Copa do Mundo FIFA 2026: Cobertura OddsFlow Começa',
        DE: 'FIFA WM 2026: OddsFlow Berichterstattung beginnt',
        FR: 'Coupe du Monde FIFA 2026 : La Couverture OddsFlow Commence',
        JA: 'FIFAワールドカップ2026：OddsFlowの報道開始',
        KO: 'FIFA 월드컵 2026: OddsFlow 보도 시작',
        '中文': '2026年FIFA世界杯：OddsFlow报道开始',
        '繁體': '2026年FIFA世界杯：OddsFlow報道開始',
        ID: 'Piala Dunia FIFA 2026: Liputan OddsFlow Dimulai',
      },
      excerpt: {
        EN: 'Get ready for the biggest football event! We\'re launching dedicated World Cup predictions, team analysis, and special betting insights for all 48 teams.',
        ES: '¡Prepárate para el evento de fútbol más grande! Lanzamos predicciones dedicadas al Mundial, análisis de equipos y perspectivas especiales para los 48 equipos.',
        PT: 'Prepare-se para o maior evento de futebol! Lançamos previsões dedicadas à Copa do Mundo, análise de times e insights especiais para todas as 48 seleções.',
        DE: 'Machen Sie sich bereit für das größte Fußballereignis! Wir starten spezielle WM-Vorhersagen, Teamanalysen und besondere Wett-Einblicke für alle 48 Teams.',
        FR: 'Préparez-vous pour le plus grand événement de football ! Nous lançons des prédictions dédiées à la Coupe du Monde, des analyses d\'équipes et des insights pour les 48 équipes.',
        JA: '最大のサッカーイベントに備えましょう！48チームすべての専用ワールドカップ予測、チーム分析、特別なベッティングインサイトを開始します。',
        KO: '최대 축구 이벤트를 준비하세요! 48개 팀 모두를 위한 전용 월드컵 예측, 팀 분석 및 특별 베팅 인사이트를 시작합니다.',
        '中文': '准备迎接最大的足球盛事！我们为所有48支球队推出专门的世界杯预测、球队分析和特别投注洞察。',
        '繁體': '準備迎接最大的足球盛事！我們為所有48支球隊推出專門的世界盃預測、球隊分析和特別投注洞察。',
        ID: 'Bersiaplah untuk acara sepak bola terbesar! Kami meluncurkan prediksi Piala Dunia khusus, analisis tim, dan wawasan taruhan khusus untuk semua 48 tim.',
      },
    },
    {
      id: 'community-features',
      category: 'update',
      image: '/blog/update-3.jpg',
      readTime: 3,
      date: '2025-12-18',
      title: {
        EN: 'Community Hub Launch: Share & Discuss Predictions',
        ES: 'Lanzamiento del Hub Comunitario: Comparte y Discute Predicciones',
        PT: 'Lançamento do Hub da Comunidade: Compartilhe e Discuta Previsões',
        DE: 'Community Hub Start: Teilen und Diskutieren Sie Vorhersagen',
        FR: 'Lancement du Hub Communautaire : Partagez et Discutez des Prédictions',
        JA: 'コミュニティハブ開始：予測を共有・議論',
        KO: '커뮤니티 허브 출시: 예측 공유 및 토론',
        '中文': '社区中心上线：分享和讨论预测',
        '繁體': '社區中心上線：分享和討論預測',
        ID: 'Peluncuran Hub Komunitas: Bagikan & Diskusikan Prediksi',
      },
      excerpt: {
        EN: 'Connect with fellow bettors in our new community hub. Share your predictions, discuss strategies, and learn from the OddsFlow community.',
        ES: 'Conéctate con otros apostadores en nuestro nuevo hub comunitario. Comparte tus predicciones, discute estrategias y aprende de la comunidad.',
        PT: 'Conecte-se com outros apostadores em nosso novo hub comunitário. Compartilhe suas previsões, discuta estratégias e aprenda com a comunidade.',
        DE: 'Verbinden Sie sich mit anderen Wettern in unserem neuen Community Hub. Teilen Sie Ihre Vorhersagen, diskutieren Sie Strategien und lernen Sie von der Community.',
        FR: 'Connectez-vous avec d\'autres parieurs dans notre nouveau hub communautaire. Partagez vos prédictions, discutez des stratégies et apprenez de la communauté.',
        JA: '新しいコミュニティハブで他のベッターとつながりましょう。予測を共有し、戦略を議論し、コミュニティから学びましょう。',
        KO: '새로운 커뮤니티 허브에서 다른 베터들과 연결하세요. 예측을 공유하고, 전략을 토론하고, 커뮤니티에서 배우세요.',
        '中文': '在我们的新社区中心与其他投注者联系。分享您的预测，讨论策略，向社区学习。',
        '繁體': '在我們的新社區中心與其他投注者聯繫。分享您的預測，討論策略，向社區學習。',
        ID: 'Terhubung dengan sesama petaruh di hub komunitas baru kami. Bagikan prediksi Anda, diskusikan strategi, dan belajar dari komunitas.',
      },
    },
  ],
};

export default function BlogPage() {
  const [lang, setLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tutorial' | 'insight' | 'update'>('all');

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

  const posts = blogPosts.posts;
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const featuredPost = posts[0]; // Latest post as featured

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tutorial': return 'from-blue-500 to-cyan-500';
      case 'insight': return 'from-purple-500 to-pink-500';
      case 'update': return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'tutorial': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'insight': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'update': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === '中文' ? 'zh-CN' : lang === '繁體' ? 'zh-TW' : lang.toLowerCase(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
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
                { href: '/pricing', label: t('pricing') },
              ].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all">{t('login')}</Link>
                <Link href="/get-started" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold hover:shadow-lg transition-all">{t('getStarted')}</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 relative overflow-hidden">
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

      {/* Category Filter */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { key: 'all', label: t('all') },
              { key: 'tutorial', label: t('tutorials') },
              { key: 'insight', label: t('insights') },
              { key: 'update', label: t('updates') },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as typeof selectedCategory)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {selectedCategory === 'all' && (
        <section className="px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-black">
                  {t('featured')}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-0">
                <div className={`aspect-video md:aspect-auto md:h-full bg-gradient-to-br ${getCategoryColor(featuredPost.category)} opacity-20`}>
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-24 h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBgColor(featuredPost.category)}`}>
                      {t(featuredPost.category === 'tutorial' ? 'tutorials' : featuredPost.category === 'insight' ? 'insights' : 'updates')}
                    </span>
                    <span className="text-gray-500 text-sm">{formatDate(featuredPost.date)}</span>
                    <span className="text-gray-500 text-sm">{featuredPost.readTime} {t('minRead')}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">
                    {featuredPost.title[lang] || featuredPost.title['EN']}
                  </h2>
                  <p className="text-gray-400 mb-6 line-clamp-3">
                    {featuredPost.excerpt[lang] || featuredPost.excerpt['EN']}
                  </p>
                  <Link href={`/blog/${featuredPost.id}`} className="inline-flex items-center gap-2 text-emerald-400 font-medium hover:text-emerald-300 transition-colors cursor-pointer">
                    {t('readMore')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.slice(selectedCategory === 'all' ? 1 : 0).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 overflow-hidden hover:border-emerald-500/30 transition-all cursor-pointer block"
              >
                <div className={`aspect-video bg-gradient-to-br ${getCategoryColor(post.category)} opacity-20 relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBgColor(post.category)}`}>
                      {t(post.category === 'tutorial' ? 'tutorials' : post.category === 'insight' ? 'insights' : 'updates')}
                    </span>
                    <span className="text-gray-500 text-xs">{post.readTime} {t('minRead')}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {post.title[lang] || post.title['EN']}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt[lang] || post.excerpt['EN']}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{formatDate(post.date)}</span>
                    <span className="text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      {t('readMore')}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
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
