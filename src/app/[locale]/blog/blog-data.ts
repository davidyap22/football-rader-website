// Blog posts data - shared between server and client components
export interface BlogPost {
  id: string;
  category: 'tutorial' | 'insight' | 'update';
  image: string;
  readTime: number;
  date: string;
  isPillar?: boolean;
  title: Record<string, string>;
  excerpt: Record<string, string>;
}

// Locale to translation code mapping
export const localeToLangCode: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  pt: 'PT',
  de: 'DE',
  fr: 'FR',
  ja: 'JA',
  ko: 'KO',
  zh: '中文',
  tw: '繁體',
  id: 'ID',
};

// Blog post titles for JSON-LD (first 10 posts for SEO)
export const blogPostsForSEO: BlogPost[] = [
  {
    id: 'how-to-interpret-football-odds',
    category: 'tutorial',
    image: '/blog/blog_picture/How to Interpret.png',
    readTime: 15,
    date: '2026-01-14',
    isPillar: true,
    title: {
      EN: 'How to Interpret Football Odds: Turn Prices Into Probabilities',
      ES: 'Cómo Interpretar las Cuotas de Fútbol: Convierte Precios en Probabilidades',
      PT: 'Como Interpretar Odds de Futebol: Transforme Preços em Probabilidades',
      DE: 'Fußball-Quoten verstehen: Preise in Wahrscheinlichkeiten umwandeln',
      FR: 'Comment Interpréter les Cotes de Football: Convertir les Prix en Probabilités',
      JA: 'サッカーオッズの読み方：価格を確率に変換する方法',
      KO: '축구 배당률 해석법: 가격을 확률로 변환하기',
      '中文': '如何解读足球赔率：将价格转化为概率',
      '繁體': '如何解讀足球賠率：將價格轉化為概率',
      ID: 'Cara Membaca Odds Sepak Bola: Mengubah Harga Menjadi Probabilitas',
    },
    excerpt: {
      EN: 'The complete guide to understanding football odds. Learn to convert odds to implied probability, identify value bets, and use AI predictions effectively.',
      ES: 'La guía completa para entender las cuotas de fútbol. Aprende a convertir cuotas en probabilidad implícita e identificar apuestas de valor.',
      PT: 'O guia completo para entender odds de futebol. Aprenda a converter odds em probabilidade implícita e identificar apostas de valor.',
      DE: 'Der komplette Leitfaden zum Verständnis von Fußballquoten. Lernen Sie, Quoten in implizite Wahrscheinlichkeiten umzuwandeln.',
      FR: 'Le guide complet pour comprendre les cotes de football. Apprenez à convertir les cotes en probabilité implicite.',
      JA: 'サッカーオッズを理解するための完全ガイド。オッズを暗示確率に変換し、バリューベットを見つける方法を学びましょう。',
      KO: '축구 배당률을 이해하기 위한 완벽 가이드. 배당률을 내재 확률로 변환하고 가치 베팅을 찾는 방법을 배우세요.',
      '中文': '理解足球赔率的完整指南。学习如何将赔率转换为隐含概率，识别价值投注，有效使用AI预测。',
      '繁體': '理解足球賠率的完整指南。學習如何將賠率轉換為隱含概率，識別價值投注，有效使用AI預測。',
      ID: 'Panduan lengkap untuk memahami odds sepak bola. Pelajari cara mengubah odds menjadi probabilitas tersirat dan mengidentifikasi taruhan bernilai.',
    },
  },
  {
    id: 'what-are-football-odds',
    category: 'tutorial',
    image: '/blog/blog_picture/What Are Football Odds.png',
    readTime: 8,
    date: '2026-01-13',
    title: {
      EN: 'What Are Football Odds? A Beginner\'s Guide to Betting Numbers',
      ES: '¿Qué Son las Cuotas de Fútbol? Guía para Principiantes',
      PT: 'O Que São Odds de Futebol? Guia para Iniciantes',
      DE: 'Was Sind Fußballquoten? Ein Anfängerleitfaden',
      FR: 'Que Sont les Cotes de Football? Guide du Débutant',
      JA: 'サッカーオッズとは？初心者向けガイド',
      KO: '축구 배당률이란? 초보자 가이드',
      '中文': '什么是足球赔率？新手入门指南',
      '繁體': '什麼是足球賠率？新手入門指南',
      ID: 'Apa Itu Odds Sepak Bola? Panduan Pemula',
    },
    excerpt: {
      EN: 'New to football betting? Learn what odds represent, how bookmakers set them, and why understanding odds is crucial for making informed bets.',
      ES: '¿Nuevo en las apuestas de fútbol? Aprende qué representan las cuotas y cómo los corredores las establecen.',
      PT: 'Novo em apostas de futebol? Aprenda o que as odds representam e como as casas de apostas as definem.',
      DE: 'Neu bei Fußballwetten? Lernen Sie, was Quoten darstellen und wie Buchmacher sie festlegen.',
      FR: 'Nouveau dans les paris football? Apprenez ce que représentent les cotes et comment les bookmakers les fixent.',
      JA: 'サッカーベッティング初心者ですか？オッズが何を表すか、ブックメーカーがどのように設定するかを学びましょう。',
      KO: '축구 베팅이 처음이신가요? 배당률이 무엇을 나타내는지, 북메이커가 어떻게 설정하는지 배우세요.',
      '中文': '足球投注新手？了解赔率代表什么，博彩公司如何设置赔率，以及为什么理解赔率对明智投注至关重要。',
      '繁體': '足球投注新手？了解賠率代表什麼，博彩公司如何設置賠率，以及為什麼理解賠率對明智投注至關重要。',
      ID: 'Baru dalam taruhan sepak bola? Pelajari apa yang diwakili odds dan bagaimana bandar menetapkannya.',
    },
  },
  {
    id: 'asian-handicap-betting-guide',
    category: 'tutorial',
    image: '/blog/blog_picture/Asian Handicap Betting.png',
    readTime: 12,
    date: '2026-01-09',
    title: {
      EN: 'Asian Handicap Betting: The Complete Guide to AH Lines',
      ES: 'Hándicap Asiático: La Guía Completa de Líneas AH',
      PT: 'Handicap Asiático: O Guia Completo de Linhas AH',
      DE: 'Asiatisches Handicap: Der Komplette Guide zu AH-Linien',
      FR: 'Handicap Asiatique: Le Guide Complet des Lignes AH',
      JA: 'アジアンハンディキャップ：AHラインの完全ガイド',
      KO: '아시안 핸디캡: AH 라인 완벽 가이드',
      '中文': '亚盘投注：AH盘口完全指南',
      '繁體': '亞盤投注：AH盤口完全指南',
      ID: 'Asian Handicap: Panduan Lengkap Garis AH',
    },
    excerpt: {
      EN: 'Master Asian handicap betting from quarter lines to full goals. Learn when to use AH over 1X2 and how to read half-ball handicaps.',
      ES: 'Domina las apuestas de hándicap asiático. Aprende cuándo usar AH sobre 1X2.',
      PT: 'Domine as apostas de handicap asiático. Aprenda quando usar AH ao invés de 1X2.',
      DE: 'Meistern Sie asiatische Handicap-Wetten. Lernen Sie, wann AH statt 1X2 zu verwenden ist.',
      FR: 'Maîtrisez les paris handicap asiatique. Apprenez quand utiliser AH plutôt que 1X2.',
      JA: 'クォーターラインからフルゴールまでアジアンハンディキャップをマスター。1X2よりAHを使うべき時を学びましょう。',
      KO: '쿼터 라인부터 풀 골까지 아시안 핸디캡을 마스터하세요. 1X2 대신 AH를 사용해야 할 때를 배우세요.',
      '中文': '掌握亚盘投注，从让球到大小球。学习何时使用亚盘而非1X2。',
      '繁體': '掌握亞盤投注，從讓球到大小球。學習何時使用亞盤而非1X2。',
      ID: 'Kuasai taruhan Asian Handicap. Pelajari kapan menggunakan AH daripada 1X2.',
    },
  },
  {
    id: 'how-ai-predicts-football-matches',
    category: 'insight',
    image: '/blog/blog_picture/How AI Predicts.png',
    readTime: 14,
    date: '2026-01-05',
    title: {
      EN: 'How AI Predicts Football Matches: Inside Machine Learning Models',
      ES: 'Cómo la IA Predice Partidos de Fútbol: Dentro de los Modelos de Machine Learning',
      PT: 'Como a IA Prevê Jogos de Futebol: Por Dentro dos Modelos de Machine Learning',
      DE: 'Wie KI Fußballspiele vorhersagt: Einblick in Machine Learning Modelle',
      FR: 'Comment l\'IA Prédit les Matchs de Football: À l\'intérieur des Modèles de Machine Learning',
      JA: 'AIはどのようにサッカーの試合を予想するか：機械学習モデルの内部',
      KO: 'AI가 축구 경기를 예측하는 방법: 머신 러닝 모델 내부',
      '中文': 'AI如何预测足球比赛：机器学习模型内部揭秘',
      '繁體': 'AI如何預測足球比賽：機器學習模型內部揭秘',
      ID: 'Bagaimana AI Memprediksi Pertandingan Sepak Bola: Di Dalam Model Machine Learning',
    },
    excerpt: {
      EN: 'Explore how modern AI models analyze football data. From xG and form analysis to neural networks and ensemble methods.',
      ES: 'Explora cómo los modelos de IA modernos analizan datos de fútbol. Desde xG hasta redes neuronales.',
      PT: 'Explore como os modelos de IA modernos analisam dados de futebol. De xG a redes neurais.',
      DE: 'Erfahren Sie, wie moderne KI-Modelle Fußballdaten analysieren. Von xG bis zu neuronalen Netzwerken.',
      FR: 'Découvrez comment les modèles d\'IA modernes analysent les données du football. Du xG aux réseaux de neurones.',
      JA: '最新のAIモデルがサッカーデータをどのように分析するかを探ります。xGとフォーム分析からニューラルネットワークまで。',
      KO: '현대 AI 모델이 축구 데이터를 분석하는 방법을 탐구합니다. xG부터 신경망까지.',
      '中文': '探索现代AI模型如何分析足球数据。从xG和状态分析到神经网络和集成方法。',
      '繁體': '探索現代AI模型如何分析足球數據。從xG和狀態分析到神經網路和集成方法。',
      ID: 'Jelajahi bagaimana model AI modern menganalisis data sepak bola. Dari xG hingga jaringan saraf.',
    },
  },
  {
    id: 'over-under-totals-betting-guide',
    category: 'tutorial',
    image: '/blog/blog_picture/Over Under.png',
    readTime: 10,
    date: '2026-01-08',
    title: {
      EN: 'Over/Under (Totals) Betting Guide: How to Bet on Football Goals',
      ES: 'Guía de Apuestas Over/Under (Totales): Cómo Apostar a Goles',
      PT: 'Guia de Apostas Over/Under (Totais): Como Apostar em Gols',
      DE: 'Over/Under (Totals) Wett-Guide: Wie man auf Tore wettet',
      FR: 'Guide Paris Over/Under (Totaux): Comment Parier sur les Buts',
      JA: 'オーバー/アンダーベッティングガイド：サッカーゴールへの賭け方',
      KO: '오버/언더 베팅 가이드: 축구 골에 베팅하는 방법',
      '中文': '大小球投注指南：如何投注足球进球数',
      '繁體': '大小球投注指南：如何投注足球進球數',
      ID: 'Panduan Taruhan Over/Under: Cara Bertaruh pada Gol Sepak Bola',
    },
    excerpt: {
      EN: 'Everything you need to know about totals betting in football. From reading lines to analyzing team scoring trends.',
      ES: 'Todo lo que necesitas saber sobre apuestas de totales en fútbol.',
      PT: 'Tudo o que você precisa saber sobre apostas de totais no futebol.',
      DE: 'Alles, was Sie über Totals-Wetten im Fußball wissen müssen.',
      FR: 'Tout ce que vous devez savoir sur les paris totaux dans le football.',
      JA: 'サッカーのトータルベッティングについて知っておくべきすべてのこと。ラインの読み方からチームの得点傾向の分析まで。',
      KO: '축구 토탈 베팅에 대해 알아야 할 모든 것.',
      '中文': '关于足球大小球投注的一切。从盘口解读到球队得分趋势分析。',
      '繁體': '關於足球大小球投注的一切。從盤口解讀到球隊得分趨勢分析。',
      ID: 'Semua yang perlu Anda ketahui tentang taruhan total dalam sepak bola.',
    },
  },
];

// Generate JSON-LD for blog listing page
export function generateBlogJsonLd(locale: string, baseUrl: string = 'https://www.oddsflow.ai') {
  const langCode = localeToLangCode[locale] || 'EN';
  const blogUrl = locale === 'en' ? `${baseUrl}/blog` : `${baseUrl}/${locale}/blog`;

  const blogPosts = blogPostsForSEO.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title[langCode] || post.title['EN'],
    description: post.excerpt[langCode] || post.excerpt['EN'],
    url: locale === 'en' ? `${baseUrl}/blog/${post.id}` : `${baseUrl}/${locale}/blog/${post.id}`,
    datePublished: post.date,
    image: `${baseUrl}${post.image}`,
    author: {
      '@type': 'Organization',
      name: 'OddsFlow',
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'OddsFlow Blog',
    url: blogUrl,
    description: 'Football betting guides, tutorials, and AI predictions',
    publisher: {
      '@type': 'Organization',
      name: 'OddsFlow',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/homepage/OddsFlow Logo2.png`,
      },
    },
    blogPost: blogPosts,
  };
}
