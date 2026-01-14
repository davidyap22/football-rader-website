'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeToTranslationCode, type Locale } from '@/i18n/config';

const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    aboutTitle: "About OddsFlow",
    aboutSubtitle: "Revolutionizing football predictions with AI-powered analytics",
    ourMission: "Our Mission",
    missionText: "At OddsFlow, we're dedicated to transforming how football enthusiasts analyze matches and make predictions. Our cutting-edge AI algorithms process millions of data points to deliver accurate, real-time insights that help you make informed decisions.",
    ourStory: "Our Story",
    storyText: "Founded in 2024, OddsFlow emerged from a passion for football and a belief that advanced technology could democratize access to professional-grade analytics. What started as a small project has grown into a platform trusted by thousands of users worldwide.",
    ourValues: "Our Values",
    value1Title: "Accuracy",
    value1Text: "We're committed to delivering the most accurate predictions possible through continuous improvement of our AI models.",
    value2Title: "Transparency",
    value2Text: "We believe in being transparent about our methods and providing clear explanations for our predictions.",
    value3Title: "Innovation",
    value3Text: "We constantly push the boundaries of what's possible with AI and machine learning in sports analytics.",
    value4Title: "Community",
    value4Text: "We value our community and strive to create a platform that benefits all football enthusiasts.",
    teamTitle: "Our Team",
    teamText: "Our team consists of data scientists, software engineers, and football analysts united by a common goal: to bring the power of AI-driven analytics to every football fan.",
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
    responsibleGaming: "Responsible Gaming",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Análisis",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Comenzar",
    aboutTitle: "Sobre OddsFlow",
    aboutSubtitle: "Revolucionando las predicciones de fútbol con análisis impulsados por IA",
    ourMission: "Nuestra Misión",
    missionText: "En OddsFlow, nos dedicamos a transformar cómo los entusiastas del fútbol analizan partidos y hacen predicciones. Nuestros algoritmos de IA de vanguardia procesan millones de datos para ofrecer información precisa y en tiempo real.",
    ourStory: "Nuestra Historia",
    storyText: "Fundada en 2024, OddsFlow surgió de una pasión por el fútbol y la creencia de que la tecnología avanzada podría democratizar el acceso a análisis de nivel profesional.",
    ourValues: "Nuestros Valores",
    value1Title: "Precisión", value1Text: "Nos comprometemos a ofrecer las predicciones más precisas posibles.",
    value2Title: "Transparencia", value2Text: "Creemos en ser transparentes sobre nuestros métodos.",
    value3Title: "Innovación", value3Text: "Constantemente expandimos los límites de lo posible con IA.",
    value4Title: "Comunidad", value4Text: "Valoramos nuestra comunidad y nos esforzamos por beneficiar a todos.",
    teamTitle: "Nuestro Equipo",
    teamText: "Nuestro equipo consiste en científicos de datos, ingenieros y analistas de fútbol unidos por un objetivo común.",
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
    responsibleGaming: "Juego Responsable",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juegue responsablemente.",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precisión de las predicciones y no somos responsables de ninguna pérdida financiera. El juego implica riesgo. Por favor juegue responsablemente. Si usted o alguien que conoce tiene un problema de juego, busque ayuda. Los usuarios deben tener más de 18 años.",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Análise",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    aboutTitle: "Sobre OddsFlow",
    aboutSubtitle: "Revolucionando previsões de futebol com análises alimentadas por IA",
    ourMission: "Nossa Missão",
    missionText: "Na OddsFlow, somos dedicados a transformar como os entusiastas do futebol analisam partidas e fazem previsões.",
    ourStory: "Nossa História",
    storyText: "Fundada em 2024, a OddsFlow surgiu de uma paixão pelo futebol e a crença de que a tecnologia avançada poderia democratizar o acesso a análises profissionais.",
    ourValues: "Nossos Valores",
    value1Title: "Precisão", value1Text: "Estamos comprometidos em oferecer as previsões mais precisas possíveis.",
    value2Title: "Transparência", value2Text: "Acreditamos em ser transparentes sobre nossos métodos.",
    value3Title: "Inovação", value3Text: "Constantemente expandimos os limites do possível com IA.",
    value4Title: "Comunidade", value4Text: "Valorizamos nossa comunidade e nos esforçamos para beneficiar todos.",
    teamTitle: "Nossa Equipe",
    teamText: "Nossa equipe consiste em cientistas de dados, engenheiros e analistas de futebol unidos por um objetivo comum.",
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
    responsibleGaming: "Jogo Responsavel",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    disclaimer: "Aviso: OddsFlow fornece previsões baseadas em IA apenas para fins informativos e de entretenimento. Não garantimos a precisão das previsões e não somos responsáveis por quaisquer perdas financeiras. Apostas envolvem risco. Por favor aposte com responsabilidade. Se você ou alguém que conhece tem um problema com jogos, procure ajuda. Usuários devem ter mais de 18 anos.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    aboutTitle: "Über OddsFlow",
    aboutSubtitle: "Revolutionierung von Fußballvorhersagen mit KI-gestützten Analysen",
    ourMission: "Unsere Mission",
    missionText: "Bei OddsFlow widmen wir uns der Transformation, wie Fußballfans Spiele analysieren und Vorhersagen treffen.",
    ourStory: "Unsere Geschichte",
    storyText: "OddsFlow wurde 2024 gegründet und entstand aus einer Leidenschaft für Fußball und dem Glauben, dass fortschrittliche Technologie den Zugang zu professionellen Analysen demokratisieren kann.",
    ourValues: "Unsere Werte",
    value1Title: "Genauigkeit", value1Text: "Wir verpflichten uns, die genauesten Vorhersagen zu liefern.",
    value2Title: "Transparenz", value2Text: "Wir glauben an Transparenz bei unseren Methoden.",
    value3Title: "Innovation", value3Text: "Wir erweitern ständig die Grenzen des Möglichen mit KI.",
    value4Title: "Gemeinschaft", value4Text: "Wir schätzen unsere Gemeinschaft und bemühen uns, allen zu helfen.",
    teamTitle: "Unser Team",
    teamText: "Unser Team besteht aus Datenwissenschaftlern, Ingenieuren und Fußballanalysten mit einem gemeinsamen Ziel.",
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
    responsibleGaming: "Verantwortungsvolles Spielen",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestützte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Wir garantieren nicht die Genauigkeit der Vorhersagen und sind nicht verantwortlich für finanzielle Verluste. Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll. Wenn Sie oder jemand, den Sie kennen, ein Glücksspielproblem hat, suchen Sie bitte Hilfe. Benutzer müssen über 18 Jahre alt sein.",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Analyse",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    aboutTitle: "À Propos d'OddsFlow",
    aboutSubtitle: "Révolutionner les prédictions de football avec des analyses alimentées par l'IA",
    ourMission: "Notre Mission",
    missionText: "Chez OddsFlow, nous nous consacrons à transformer la façon dont les passionnés de football analysent les matchs et font des prédictions.",
    ourStory: "Notre Histoire",
    storyText: "Fondée en 2024, OddsFlow est née d'une passion pour le football et de la conviction que la technologie avancée pouvait démocratiser l'accès aux analyses professionnelles.",
    ourValues: "Nos Valeurs",
    value1Title: "Précision", value1Text: "Nous nous engageons à fournir les prédictions les plus précises possibles.",
    value2Title: "Transparence", value2Text: "Nous croyons en la transparence sur nos méthodes.",
    value3Title: "Innovation", value3Text: "Nous repoussons constamment les limites du possible avec l'IA.",
    value4Title: "Communauté", value4Text: "Nous valorisons notre communauté et nous efforçons d'aider tous.",
    teamTitle: "Notre Équipe",
    teamText: "Notre équipe est composée de data scientists, d'ingénieurs et d'analystes football unis par un objectif commun.",
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
    responsibleGaming: "Jeu Responsable",
    allRightsReserved: "Tous droits réservés.",
    gamblingWarning: "Le jeu comporte des risques. Veuillez jouer de manière responsable.",
    disclaimer: "Avertissement : OddsFlow fournit des prédictions basées sur l'IA à des fins d'information et de divertissement uniquement. Nous ne garantissons pas l'exactitude des prédictions et ne sommes pas responsables des pertes financières. Le jeu comporte des risques. Veuillez jouer de manière responsable. Si vous ou quelqu'un que vous connaissez a un problème de jeu, veuillez demander de l'aide. Les utilisateurs doivent avoir plus de 18 ans.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "分析",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    aboutTitle: "OddsFlowについて",
    aboutSubtitle: "AI駆動の分析でサッカー予測を革新",
    ourMission: "私たちのミッション",
    missionText: "OddsFlowでは、サッカーファンが試合を分析し予測を行う方法を変革することに専念しています。",
    ourStory: "私たちのストーリー",
    storyText: "2024年に設立されたOddsFlowは、サッカーへの情熱と、先進技術がプロレベルの分析へのアクセスを民主化できるという信念から生まれました。",
    ourValues: "私たちの価値観",
    value1Title: "正確性", value1Text: "可能な限り正確な予測を提供することに取り組んでいます。",
    value2Title: "透明性", value2Text: "私たちの方法について透明であることを信じています。",
    value3Title: "革新", value3Text: "AIで可能なことの限界を常に押し広げています。",
    value4Title: "コミュニティ", value4Text: "コミュニティを大切にし、すべての人に貢献するよう努めています。",
    teamTitle: "チーム紹介",
    teamText: "私たちのチームは、共通の目標を持つデータサイエンティスト、エンジニア、サッカーアナリストで構成されています。",
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
    responsibleGaming: "責任あるギャンブル",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
    disclaimer: "免責事項：OddsFlowはAI駆動の予測を情報および娯楽目的のみで提供しています。予測の正確性を保証するものではなく、いかなる財務損失についても責任を負いません。ギャンブルにはリスクが伴います。責任を持ってお楽しみください。あなたまたはあなたの知人がギャンブル問題を抱えている場合は、助けを求めてください。ユーザーは18歳以上である必要があります。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "분석",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기",
    aboutTitle: "OddsFlow 소개",
    aboutSubtitle: "AI 기반 분석으로 축구 예측 혁신",
    ourMission: "우리의 미션",
    missionText: "OddsFlow에서는 축구 팬들이 경기를 분석하고 예측하는 방식을 변화시키는 데 전념하고 있습니다.",
    ourStory: "우리의 이야기",
    storyText: "2024년에 설립된 OddsFlow는 축구에 대한 열정과 첨단 기술이 전문가 수준의 분석에 대한 접근을 민주화할 수 있다는 믿음에서 탄생했습니다.",
    ourValues: "우리의 가치",
    value1Title: "정확성", value1Text: "가능한 한 가장 정확한 예측을 제공하기 위해 노력합니다.",
    value2Title: "투명성", value2Text: "우리의 방법에 대해 투명하게 공개합니다.",
    value3Title: "혁신", value3Text: "AI로 가능한 것의 한계를 끊임없이 확장합니다.",
    value4Title: "커뮤니티", value4Text: "커뮤니티를 소중히 여기고 모든 사람에게 도움이 되도록 노력합니다.",
    teamTitle: "팀 소개",
    teamText: "우리 팀은 공통의 목표를 가진 데이터 과학자, 엔지니어, 축구 분석가로 구성되어 있습니다.",
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
    responsibleGaming: "책임감 있는 게임",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다. 예측의 정확성을 보장하지 않으며 재정적 손실에 대해 책임지지 않습니다. 도박에는 위험이 따릅니다. 책임감 있게 베팅하세요. 본인 또는 아는 사람이 도박 문제가 있다면 도움을 구하세요. 사용자는 18세 이상이어야 합니다.",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "分析",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始",
    aboutTitle: "关于 OddsFlow",
    aboutSubtitle: "用AI驱动的分析革新足球预测",
    ourMission: "我们的使命",
    missionText: "在 OddsFlow，我们致力于改变足球爱好者分析比赛和做出预测的方式。我们尖端的AI算法处理数百万数据点，提供准确的实时洞察。",
    ourStory: "我们的故事",
    storyText: "OddsFlow 成立于2024年，源于对足球的热爱和先进技术可以让专业级分析触手可及的信念。",
    ourValues: "我们的价值观",
    value1Title: "准确性", value1Text: "我们致力于通过持续改进AI模型来提供最准确的预测。",
    value2Title: "透明度", value2Text: "我们相信对我们的方法保持透明，为预测提供清晰的解释。",
    value3Title: "创新", value3Text: "我们不断突破AI和机器学习在体育分析中的可能性边界。",
    value4Title: "社区", value4Text: "我们重视社区，努力创建一个让所有足球爱好者受益的平台。",
    teamTitle: "我们的团队",
    teamText: "我们的团队由数据科学家、软件工程师和足球分析师组成，他们有着共同的目标。",
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
    responsibleGaming: "负责任博彩",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩有风险，请理性投注。",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "分析",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始",
    aboutTitle: "關於 OddsFlow",
    aboutSubtitle: "用AI驅動的分析革新足球預測",
    ourMission: "我們的使命",
    missionText: "在 OddsFlow，我們致力於改變足球愛好者分析比賽和做出預測的方式。我們尖端的AI演算法處理數百萬數據點，提供準確的即時洞察。",
    ourStory: "我們的故事",
    storyText: "OddsFlow 成立於2024年，源於對足球的熱愛和先進技術可以讓專業級分析觸手可及的信念。",
    ourValues: "我們的價值觀",
    value1Title: "準確性", value1Text: "我們致力於通過持續改進AI模型來提供最準確的預測。",
    value2Title: "透明度", value2Text: "我們相信對我們的方法保持透明，為預測提供清晰的解釋。",
    value3Title: "創新", value3Text: "我們不斷突破AI和機器學習在體育分析中的可能性邊界。",
    value4Title: "社區", value4Text: "我們重視社區，努力創建一個讓所有足球愛好者受益的平台。",
    teamTitle: "我們的團隊",
    teamText: "我們的團隊由數據科學家、軟件工程師和足球分析師組成，他們有著共同的目標。",
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
    responsibleGaming: "負責任博彩",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩有風險，請理性投注。",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    aboutTitle: "Tentang OddsFlow",
    aboutSubtitle: "Merevolusi prediksi sepak bola dengan analitik bertenaga AI",
    ourMission: "Misi Kami",
    missionText: "Di OddsFlow, kami berdedikasi untuk mengubah cara penggemar sepak bola menganalisis pertandingan dan membuat prediksi. Algoritma AI canggih kami memproses jutaan titik data untuk memberikan wawasan real-time yang akurat.",
    ourStory: "Cerita Kami",
    storyText: "Didirikan pada tahun 2024, OddsFlow muncul dari kecintaan terhadap sepak bola dan keyakinan bahwa teknologi canggih dapat mendemokratisasi akses ke analitik tingkat profesional.",
    ourValues: "Nilai-Nilai Kami",
    value1Title: "Akurasi", value1Text: "Kami berkomitmen untuk memberikan prediksi seakurat mungkin melalui peningkatan berkelanjutan model AI kami.",
    value2Title: "Transparansi", value2Text: "Kami percaya pada transparansi tentang metode kami dan memberikan penjelasan yang jelas untuk prediksi kami.",
    value3Title: "Inovasi", value3Text: "Kami terus mendorong batas-batas kemungkinan dengan AI dan machine learning dalam analitik olahraga.",
    value4Title: "Komunitas", value4Text: "Kami menghargai komunitas kami dan berusaha menciptakan platform yang bermanfaat bagi semua penggemar sepak bola.",
    teamTitle: "Tim Kami",
    teamText: "Tim kami terdiri dari ilmuwan data, insinyur perangkat lunak, dan analis sepak bola yang disatukan oleh tujuan bersama.",
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
    responsibleGaming: "Perjudian Bertanggung Jawab",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
  },
};

export default function AboutPage() {
  const params = useParams();
  const urlLocale = (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';
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

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/about';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            {t('aboutSubtitle')}
          </p>
          {/* Large Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse" />
              <img
                src="/homepage/OddsFlow Logo2.png"
                alt="OddsFlow Logo"
                className="relative w-48 h-48 md:w-64 md:h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">{t('ourMission')}</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{t('missionText')}</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">{t('ourStory')}</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{t('storyText')}</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('ourValues')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t('value1Title'), text: t('value1Text'), icon: '🎯' },
              { title: t('value2Title'), text: t('value2Text'), icon: '🔍' },
              { title: t('value3Title'), text: t('value3Text'), icon: '💡' },
              { title: t('value4Title'), text: t('value4Text'), icon: '🤝' },
            ].map((value, i) => (
              <div key={i} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-6 hover:border-emerald-500/30 transition-all">
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('teamTitle')}</h2>
          <p className="text-gray-400 text-lg">{t('teamText')}</p>
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
