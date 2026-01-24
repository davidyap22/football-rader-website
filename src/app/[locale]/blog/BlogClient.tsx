'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeToTranslationCode, type Locale } from '@/i18n/config';
import { supabase } from "@/lib/supabase";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

interface BlogClientProps {
  locale: string;
}

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
    responsibleGaming: "Responsible Gaming",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
    footerDesc: "AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.",
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
    responsibleGaming: "Juego Responsable",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juegue responsablemente.",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precisión de las predicciones y no somos responsables de ninguna pérdida financiera. El juego implica riesgo. Por favor juegue responsablemente. Si usted o alguien que conoce tiene un problema de juego, busque ayuda. Los usuarios deben tener más de 18 años.",
    footerDesc: "Análisis de cuotas de fútbol impulsado por IA para predicciones más inteligentes. Toma decisiones basadas en datos con información en tiempo real.",
  },
  PT: {
    home: "Início", predictions: "Palpites", leagues: "Ligas", performance: "Análise",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    blogTitle: "Blog de Palpites",
    blogSubtitle: "Palpites de futebol, guias de apostas e análises com IA da equipe OddsFlow",
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
    responsibleGaming: "Jogo Responsavel",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    disclaimer: "Aviso: OddsFlow fornece previsões baseadas em IA apenas para fins informativos e de entretenimento. Não garantimos a precisão das previsões e não somos responsáveis por quaisquer perdas financeiras. Apostas envolvem risco. Por favor aposte com responsabilidade. Se você ou alguém que conhece tem um problema com jogos, procure ajuda. Usuários devem ter mais de 18 anos.",
    footerDesc: "Análise de odds de futebol com IA para palpites mais inteligentes. Tome decisões baseadas em dados com insights em tempo real.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    blogTitle: "Fußball-Wett-Blog",
    blogSubtitle: "Experten-Tipps, Quoten-Guides und KI-Analysen für intelligentere Wetten",
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
    responsibleGaming: "Verantwortungsvolles Spielen",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestützte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Wir garantieren nicht die Genauigkeit der Vorhersagen und sind nicht verantwortlich für finanzielle Verluste. Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll. Wenn Sie oder jemand, den Sie kennen, ein Glücksspielproblem hat, suchen Sie bitte Hilfe. Benutzer müssen über 18 Jahre alt sein.",
    footerDesc: "KI-gestützte Analyse von Fußball-Quoten für intelligentere Vorhersagen. Treffen Sie datenbasierte Entscheidungen mit Echtzeit-Einblicken.",
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
    responsibleGaming: "Jeu Responsable",
    allRightsReserved: "Tous droits réservés.",
    gamblingWarning: "Le jeu comporte des risques. Veuillez jouer de manière responsable.",
    disclaimer: "Avertissement : OddsFlow fournit des prédictions basées sur l'IA à des fins d'information et de divertissement uniquement. Nous ne garantissons pas l'exactitude des prédictions et ne sommes pas responsables des pertes financières. Le jeu comporte des risques. Veuillez jouer de manière responsable. Si vous ou quelqu'un que vous connaissez a un problème de jeu, veuillez demander de l'aide. Les utilisateurs doivent avoir plus de 18 ans.",
    footerDesc: "Analyse des cotes de football par IA pour des pronostics plus intelligents. Prenez des décisions basées sur les données avec des informations en temps réel.",
  },
  JA: {
    home: "ホーム", predictions: "予想", leagues: "リーグ", performance: "分析",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    blogTitle: "ブックメーカー攻略ブログ",
    blogSubtitle: "サッカー予想、オッズ分析、ブックメーカー投資のエキスパートガイド",
    all: "すべて",
    tutorials: "チュートリアル",
    insights: "インサイト",
    updates: "アップデート",
    readMore: "続きを読む",
    minRead: "分で読める",
    featured: "注目",
    product: "製品", liveOdds: "AI分析", solution: "ソリューション", popularLeagues: "人気リーグ",
    communityFooter: "コミュニティ", globalChat: "グローバルチャット", userPredictions: "ユーザー予想",
    company: "会社", aboutUs: "会社概要", contact: "お問い合わせ", blog: "ブログ",
    legal: "法的情報", termsOfService: "利用規約", privacyPolicy: "プライバシーポリシー",
    responsibleGaming: "責任あるギャンブル",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
    disclaimer: "免責事項：OddsFlowはAI駆動のサッカー予想を情報および娯楽目的のみで提供しています。予想の正確性を保証するものではなく、いかなる財務損失についても責任を負いません。ギャンブルにはリスクが伴います。責任を持ってお楽しみください。あなたまたはあなたの知人がギャンブル問題を抱えている場合は、助けを求めてください。ユーザーは18歳以上である必要があります。",
    footerDesc: "AI搭載のサッカーオッズ分析でよりスマートな予想を。リアルタイムの洞察でデータに基づいた意思決定を。",
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
    responsibleGaming: "책임감 있는 게임",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다. 예측의 정확성을 보장하지 않으며 재정적 손실에 대해 책임지지 않습니다. 도박에는 위험이 따릅니다. 책임감 있게 베팅하세요. 본인 또는 아는 사람이 도박 문제가 있다면 도움을 구하세요. 사용자는 18세 이상이어야 합니다.",
    footerDesc: "AI 기반 축구 배당률 분석으로 더 스마트한 예측을. 실시간 인사이트로 데이터 기반 결정을 내리세요.",
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
    responsibleGaming: "负责任博彩",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩有风险，请理性投注。",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
    footerDesc: "AI驱动的足球赔率分析，助您做出更明智的预测。实时数据洞察，助力数据驱动决策。",
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
    responsibleGaming: "負責任博彩",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩有風險，請理性投注。",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
    footerDesc: "AI驅動的足球賠率分析，助您做出更明智的預測。即時數據洞察，助力數據驅動決策。",
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
    responsibleGaming: "Perjudian Bertanggung Jawab",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi yang lebih cerdas. Buat keputusan berbasis data dengan wawasan real-time.",
  },
};

// Blog post content translations - SEO-optimized hub-and-spoke structure
const blogPosts: Record<string, {
  id: string;
  category: 'tutorial' | 'insight' | 'update';
  image: string;
  readTime: number;
  date: string;
  isPillar?: boolean;
  title: Record<string, string>;
  excerpt: Record<string, string>;
}[]> = {
  posts: [
    // P0 - PILLAR POST
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
    // S1 - What Are Football Odds?
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
    // S2 - Decimal vs Fractional vs American Odds
    {
      id: 'decimal-vs-fractional-vs-american-odds',
      category: 'tutorial',
      image: '/blog/blog_picture/Decimal vs Fractional.png',
      readTime: 10,
      date: '2026-01-12',
      title: {
        EN: 'Decimal vs Fractional vs American Odds: Complete Conversion Guide',
        ES: 'Decimal vs Fraccional vs Americana: Guía de Conversión Completa',
        PT: 'Decimal vs Fracionária vs Americana: Guia de Conversão Completo',
        DE: 'Dezimal vs Bruch vs Amerikanisch: Vollständiger Umrechnungsführer',
        FR: 'Décimal vs Fractionnaire vs Américain: Guide de Conversion Complet',
        JA: 'デシマル vs フラクショナル vs アメリカン：完全変換ガイド',
        KO: '소수점 vs 분수 vs 미국식 배당률: 완벽 변환 가이드',
        '中文': '小数 vs 分数 vs 美式赔率：完整转换指南',
        '繁體': '小數 vs 分數 vs 美式賠率：完整轉換指南',
        ID: 'Desimal vs Pecahan vs Amerika: Panduan Konversi Lengkap',
      },
      excerpt: {
        EN: 'Master all three odds formats used worldwide. Step-by-step conversion formulas, examples, and a free odds calculator to help you compare prices.',
        ES: 'Domina los tres formatos de cuotas usados en todo el mundo. Fórmulas de conversión paso a paso y ejemplos.',
        PT: 'Domine os três formatos de odds usados mundialmente. Fórmulas de conversão passo a passo e exemplos.',
        DE: 'Beherrschen Sie alle drei weltweit verwendeten Quotenformate. Schritt-für-Schritt-Umrechnungsformeln und Beispiele.',
        FR: 'Maîtrisez les trois formats de cotes utilisés dans le monde. Formules de conversion étape par étape et exemples.',
        JA: '世界で使用される3つのオッズ形式をすべてマスター。段階的な変換公式と例。',
        KO: '전 세계에서 사용되는 세 가지 배당률 형식을 모두 마스터하세요. 단계별 변환 공식과 예시.',
        '中文': '掌握全球使用的三种赔率格式。分步转换公式、示例和免费赔率计算器帮助您比较价格。',
        '繁體': '掌握全球使用的三種賠率格式。分步轉換公式、示例和免費賠率計算器幫助您比較價格。',
        ID: 'Kuasai ketiga format odds yang digunakan di seluruh dunia. Formula konversi langkah demi langkah dan contoh.',
      },
    },
    // S3 - Implied Probability
    {
      id: 'implied-probability-explained',
      category: 'tutorial',
      image: '/blog/blog_picture/Implied Probability Explained.png',
      readTime: 9,
      date: '2026-01-11',
      title: {
        EN: 'Implied Probability Explained: The Hidden Key to Value Betting',
        ES: 'Probabilidad Implícita Explicada: La Clave Oculta para Apuestas de Valor',
        PT: 'Probabilidade Implícita Explicada: A Chave Oculta para Apostas de Valor',
        DE: 'Implizite Wahrscheinlichkeit Erklärt: Der Versteckte Schlüssel zu Value Bets',
        FR: 'Probabilité Implicite Expliquée: La Clé Cachée des Paris de Valeur',
        JA: '暗示確率の解説：バリューベッティングへの隠れた鍵',
        KO: '내재 확률 설명: 가치 베팅의 숨겨진 열쇠',
        '中文': '隐含概率详解：价值投注的隐藏关键',
        '繁體': '隱含概率詳解：價值投注的隱藏關鍵',
        ID: 'Probabilitas Tersirat Dijelaskan: Kunci Tersembunyi untuk Taruhan Bernilai',
      },
      excerpt: {
        EN: 'Learn to calculate implied probability from any odds format. Discover how to find value bets by comparing your estimates to bookmaker odds.',
        ES: 'Aprende a calcular la probabilidad implícita desde cualquier formato de cuotas. Descubre cómo encontrar apuestas de valor.',
        PT: 'Aprenda a calcular a probabilidade implícita de qualquer formato de odds. Descubra como encontrar apostas de valor.',
        DE: 'Lernen Sie, die implizite Wahrscheinlichkeit aus jedem Quotenformat zu berechnen. Entdecken Sie Value Bets.',
        FR: 'Apprenez à calculer la probabilité implicite à partir de n\'importe quel format de cotes. Découvrez les paris de valeur.',
        JA: '任意のオッズ形式から暗示確率を計算する方法を学びましょう。バリューベットの見つけ方を発見。',
        KO: '모든 배당률 형식에서 내재 확률을 계산하는 방법을 배우세요. 가치 베팅을 찾는 방법을 알아보세요.',
        '中文': '学习从任何赔率格式计算隐含概率。了解如何通过比较您的估计与博彩公司赔率来找到价值投注。',
        '繁體': '學習從任何賠率格式計算隱含概率。了解如何通過比較您的估計與博彩公司賠率來找到價值投注。',
        ID: 'Pelajari cara menghitung probabilitas tersirat dari format odds apa pun. Temukan cara menemukan taruhan bernilai.',
      },
    },
    // S4 - Bookmaker Margins
    {
      id: 'how-bookmakers-calculate-margins',
      category: 'insight',
      image: '/blog/blog_picture/How Bookmakers Calculate.webp',
      readTime: 8,
      date: '2026-01-10',
      title: {
        EN: 'How Bookmakers Calculate Margins: The Overround Explained',
        ES: 'Cómo los Corredores Calculan Márgenes: El Overround Explicado',
        PT: 'Como as Casas de Apostas Calculam Margens: O Overround Explicado',
        DE: 'Wie Buchmacher Margen Berechnen: Der Overround Erklärt',
        FR: 'Comment les Bookmakers Calculent les Marges: L\'Overround Expliqué',
        JA: 'ブックメーカーのマージン計算方法：オーバーラウンド解説',
        KO: '북메이커 마진 계산법: 오버라운드 설명',
        '中文': '博彩公司如何计算利润：过度让分解释',
        '繁體': '博彩公司如何計算利潤：過度讓分解釋',
        ID: 'Bagaimana Bandar Menghitung Margin: Overround Dijelaskan',
      },
      excerpt: {
        EN: 'Understand the bookmaker\'s edge and how it affects your long-term profits. Learn to identify books with lower margins for better returns.',
        ES: 'Entiende la ventaja del corredor y cómo afecta tus ganancias a largo plazo. Aprende a identificar casas con menores márgenes.',
        PT: 'Entenda a vantagem da casa de apostas e como ela afeta seus lucros a longo prazo. Aprenda a identificar casas com menores margens.',
        DE: 'Verstehen Sie den Buchmacher-Vorteil und wie er Ihre langfristigen Gewinne beeinflusst. Lernen Sie, Bücher mit niedrigeren Margen zu identifizieren.',
        FR: 'Comprenez l\'avantage du bookmaker et comment il affecte vos profits à long terme. Apprenez à identifier les books avec des marges plus faibles.',
        JA: 'ブックメーカーの優位性と長期的な利益への影響を理解しましょう。マージンの低いブックを見つける方法を学びます。',
        KO: '북메이커의 우위와 장기적인 수익에 미치는 영향을 이해하세요. 낮은 마진의 북을 찾는 방법을 배우세요.',
        '中文': '了解博彩公司的优势以及它如何影响您的长期利润。学习识别利润较低的博彩公司以获得更好的回报。',
        '繁體': '了解博彩公司的優勢以及它如何影響您的長期利潤。學習識別利潤較低的博彩公司以獲得更好的回報。',
        ID: 'Pahami keunggulan bandar dan bagaimana hal itu mempengaruhi keuntungan jangka panjang Anda. Pelajari cara mengidentifikasi buku dengan margin lebih rendah.',
      },
    },
    // S5 - Asian Handicap
    {
      id: 'asian-handicap-betting-guide',
      category: 'tutorial',
      image: '/blog/blog_picture/Asian Handicap Betting.png',
      readTime: 12,
      date: '2026-01-09',
      title: {
        EN: 'Asian Handicap Betting: Complete Guide to AH Lines',
        ES: 'Hándicap Asiático: Guía Completa de Líneas AH',
        PT: 'Handicap Asiático: Guia Completo das Linhas AH',
        DE: 'Asiatisches Handicap: Vollständiger Leitfaden zu AH-Linien',
        FR: 'Handicap Asiatique: Guide Complet des Lignes AH',
        JA: 'アジアンハンディキャップ：AHラインの完全ガイド',
        KO: '아시안 핸디캡 베팅: AH 라인 완전 가이드',
        '中文': '亚洲盘口投注：AH盘口完整指南',
        '繁體': '亞洲盤口投注：AH盤口完整指南',
        ID: 'Taruhan Handicap Asia: Panduan Lengkap Garis AH',
      },
      excerpt: {
        EN: 'Master Asian Handicap betting from quarter lines to full goals. Learn when to use AH over 1X2 and how to reduce variance in your bets.',
        ES: 'Domina el hándicap asiático desde cuartos de gol hasta goles completos. Aprende cuándo usar AH en lugar de 1X2.',
        PT: 'Domine o handicap asiático de quartos de gol a gols completos. Aprenda quando usar AH em vez de 1X2.',
        DE: 'Beherrschen Sie das asiatische Handicap von Viertellinien bis zu ganzen Toren. Lernen Sie, wann Sie AH statt 1X2 verwenden sollten.',
        FR: 'Maîtrisez le handicap asiatique des quarts de but aux buts entiers. Apprenez quand utiliser AH plutôt que 1X2.',
        JA: 'クォーターラインからフルゴールまでアジアンハンディキャップをマスター。1X2よりAHを使うべき時を学びましょう。',
        KO: '쿼터 라인부터 풀 골까지 아시안 핸디캡을 마스터하세요. 1X2 대신 AH를 사용할 때를 배우세요.',
        '中文': '从四分之一球到整球掌握亚洲盘口投注。了解何时使用AH而非1X2，以及如何减少投注的波动性。',
        '繁體': '從四分之一球到整球掌握亞洲盤口投注。了解何時使用AH而非1X2，以及如何減少投注的波動性。',
        ID: 'Kuasai taruhan Handicap Asia dari garis seperempat hingga gol penuh. Pelajari kapan menggunakan AH daripada 1X2.',
      },
    },
    // S6 - Over/Under Betting
    {
      id: 'over-under-totals-betting-guide',
      category: 'tutorial',
      image: '/blog/blog_picture/Over Under Betting Guide.png',
      readTime: 10,
      date: '2026-01-08',
      title: {
        EN: 'Over/Under Betting Guide: How to Bet on Football Totals',
        ES: 'Guía de Apuestas Over/Under: Cómo Apostar en Totales de Fútbol',
        PT: 'Guia de Apostas Over/Under: Como Apostar em Totais de Futebol',
        DE: 'Over/Under Wettführer: Wie Man auf Fußball-Totals Wettet',
        FR: 'Guide des Paris Over/Under: Comment Parier sur les Totaux de Football',
        JA: 'オーバー/アンダーベッティングガイド：サッカートータルへの賭け方',
        KO: '오버/언더 베팅 가이드: 축구 토탈에 베팅하는 방법',
        '中文': '大小球投注指南：如何投注足球总进球数',
        '繁體': '大小球投注指南：如何投注足球總進球數',
        ID: 'Panduan Taruhan Over/Under: Cara Bertaruh pada Total Sepak Bola',
      },
      excerpt: {
        EN: 'Everything you need to know about totals betting in football. From reading lines to analyzing team scoring trends and xG stats.',
        ES: 'Todo lo que necesitas saber sobre apuestas de totales en fútbol. Desde leer líneas hasta analizar tendencias de goles.',
        PT: 'Tudo o que você precisa saber sobre apostas de totais no futebol. Desde ler linhas até analisar tendências de gols.',
        DE: 'Alles, was Sie über Totals-Wetten im Fußball wissen müssen. Von der Linienanalyse bis zu Tortrends.',
        FR: 'Tout ce que vous devez savoir sur les paris sur les totaux dans le football. De la lecture des lignes à l\'analyse des tendances.',
        JA: 'サッカーのトータルベッティングについて知っておくべきすべてのこと。ラインの読み方からチームの得点傾向の分析まで。',
        KO: '축구 토탈 베팅에 대해 알아야 할 모든 것. 라인 읽기부터 팀 득점 트렌드 분석까지.',
        '中文': '关于足球总进球数投注您需要了解的一切。从阅读盘口到分析球队进球趋势和xG统计。',
        '繁體': '關於足球總進球數投注您需要了解的一切。從閱讀盤口到分析球隊進球趨勢和xG統計。',
        ID: 'Semua yang perlu Anda ketahui tentang taruhan total dalam sepak bola. Dari membaca garis hingga menganalisis tren skor tim.',
      },
    },
    // S7 - 1X2 Betting
    {
      id: 'match-result-1x2-betting-explained',
      category: 'tutorial',
      image: '/blog/blog_picture/Match Result (1X2) Betting Explained.png',
      readTime: 8,
      date: '2026-01-07',
      title: {
        EN: 'Match Result (1X2) Betting Explained: The Classic Football Market',
        ES: 'Resultado del Partido (1X2) Explicado: El Mercado Clásico de Fútbol',
        PT: 'Resultado da Partida (1X2) Explicado: O Mercado Clássico de Futebol',
        DE: 'Spielergebnis (1X2) Erklärt: Der Klassische Fußballmarkt',
        FR: 'Résultat du Match (1X2) Expliqué: Le Marché Classique du Football',
        JA: 'マッチ結果（1X2）ベッティング解説：クラシックなサッカー市場',
        KO: '경기 결과 (1X2) 베팅 설명: 클래식 축구 시장',
        '中文': '比赛结果（1X2）投注详解：经典足球市场',
        '繁體': '比賽結果（1X2）投注詳解：經典足球市場',
        ID: 'Hasil Pertandingan (1X2) Dijelaskan: Pasar Sepak Bola Klasik',
      },
      excerpt: {
        EN: 'The foundational football betting market explained. Learn how 1X2 odds work, when to bet each outcome, and strategies for maximizing value.',
        ES: 'El mercado fundamental de apuestas de fútbol explicado. Aprende cómo funcionan las cuotas 1X2 y cuándo apostar cada resultado.',
        PT: 'O mercado fundamental de apostas de futebol explicado. Aprenda como as odds 1X2 funcionam e quando apostar cada resultado.',
        DE: 'Der grundlegende Fußball-Wettmarkt erklärt. Lernen Sie, wie 1X2-Quoten funktionieren und wann Sie jedes Ergebnis wetten sollten.',
        FR: 'Le marché fondamental des paris de football expliqué. Apprenez comment fonctionnent les cotes 1X2 et quand parier chaque résultat.',
        JA: '基本的なサッカーベッティング市場を解説。1X2オッズの仕組みと各結果に賭けるべき時を学びましょう。',
        KO: '기본적인 축구 베팅 시장을 설명합니다. 1X2 배당률이 어떻게 작동하는지, 각 결과에 언제 베팅해야 하는지 배우세요.',
        '中文': '基础足球投注市场详解。了解1X2赔率如何运作，何时投注每个结果，以及最大化价值的策略。',
        '繁體': '基礎足球投注市場詳解。了解1X2賠率如何運作，何時投注每個結果，以及最大化價值的策略。',
        ID: 'Pasar taruhan sepak bola dasar dijelaskan. Pelajari cara kerja odds 1X2 dan kapan bertaruh setiap hasil.',
      },
    },
    // S8 - Why Odds Move
    {
      id: 'why-football-odds-move',
      category: 'insight',
      image: '/blog/blog_picture/Why Football Odds Move.png',
      readTime: 11,
      date: '2026-01-06',
      title: {
        EN: 'Why Football Odds Move: Understanding Line Movement',
        ES: 'Por Qué se Mueven las Cuotas de Fútbol: Entendiendo el Movimiento de Líneas',
        PT: 'Por Que as Odds de Futebol Se Movem: Entendendo o Movimento de Linhas',
        DE: 'Warum Sich Fußballquoten Bewegen: Linienbewegung Verstehen',
        FR: 'Pourquoi les Cotes de Football Bougent: Comprendre le Mouvement des Lignes',
        JA: 'サッカーオッズが動く理由：ライン変動の理解',
        KO: '축구 배당률이 움직이는 이유: 라인 움직임 이해하기',
        '中文': '足球赔率为何变动：理解盘口变化',
        '繁體': '足球賠率為何變動：理解盤口變化',
        ID: 'Mengapa Odds Sepak Bola Bergerak: Memahami Pergerakan Garis',
      },
      excerpt: {
        EN: 'Discover what causes odds to shift before kickoff. From injury news to sharp money, learn to read line movements like a professional.',
        ES: 'Descubre qué causa que las cuotas cambien antes del inicio. Desde noticias de lesiones hasta dinero inteligente.',
        PT: 'Descubra o que causa a mudança das odds antes do início. De notícias de lesões ao dinheiro inteligente.',
        DE: 'Entdecken Sie, was Quoten vor dem Anpfiff verschiebt. Von Verletzungsnachrichten bis zu Sharp Money.',
        FR: 'Découvrez ce qui fait bouger les cotes avant le coup d\'envoi. Des nouvelles de blessures à l\'argent intelligent.',
        JA: 'キックオフ前にオッズが変動する原因を発見。怪我のニュースからシャープマネーまで、プロのようにライン変動を読む方法を学びましょう。',
        KO: '킥오프 전에 배당률이 변하는 원인을 알아보세요. 부상 뉴스부터 샤프 머니까지, 프로처럼 라인 움직임을 읽는 방법을 배우세요.',
        '中文': '发现导致开球前赔率变化的原因。从伤病消息到聪明钱，学习像专业人士一样解读盘口变动。',
        '繁體': '發現導致開球前賠率變化的原因。從傷病消息到聰明錢，學習像專業人士一樣解讀盤口變動。',
        ID: 'Temukan apa yang menyebabkan odds bergeser sebelum kick-off. Dari berita cedera hingga uang tajam.',
      },
    },
    // S9 - Sharp vs Public Money
    {
      id: 'sharp-vs-public-money-betting',
      category: 'insight',
      image: '/blog/blog_picture/Sharp vs Public Money.jpg',
      readTime: 9,
      date: '2026-01-05',
      title: {
        EN: 'Sharp vs Public Money: How Professional Bettors Move Lines',
        ES: 'Dinero Inteligente vs Público: Cómo los Apostadores Profesionales Mueven Líneas',
        PT: 'Dinheiro Inteligente vs Público: Como Apostadores Profissionais Movem Linhas',
        DE: 'Sharp vs Public Money: Wie Profis Linien Bewegen',
        FR: 'Argent Sharp vs Public: Comment les Parieurs Pros Déplacent les Lignes',
        JA: 'シャープマネー vs パブリックマネー：プロがラインを動かす方法',
        KO: '샤프 머니 vs 퍼블릭 머니: 프로 베터가 라인을 움직이는 방법',
        '中文': '聪明钱 vs 大众钱：职业玩家如何影响盘口',
        '繁體': '聰明錢 vs 大眾錢：職業玩家如何影響盤口',
        ID: 'Uang Sharp vs Publik: Bagaimana Petaruh Profesional Menggerakkan Garis',
      },
      excerpt: {
        EN: 'Learn to distinguish between sharp and public betting action. Understand reverse line movement and how to follow the smart money.',
        ES: 'Aprende a distinguir entre acción de apuestas inteligentes y públicas. Entiende el movimiento de línea inverso.',
        PT: 'Aprenda a distinguir entre ação de apostas inteligentes e públicas. Entenda o movimento de linha reverso.',
        DE: 'Lernen Sie, zwischen Sharp und Public Betting Action zu unterscheiden. Verstehen Sie umgekehrte Linienbewegungen.',
        FR: 'Apprenez à distinguer l\'action sharp et publique. Comprenez le mouvement de ligne inversé.',
        JA: 'シャープとパブリックのベッティングアクションを見分ける方法を学びましょう。逆ライン変動とスマートマネーの追い方を理解します。',
        KO: '샤프와 퍼블릭 베팅 액션을 구별하는 방법을 배우세요. 역 라인 움직임과 스마트 머니를 따르는 방법을 이해하세요.',
        '中文': '学习区分聪明钱和大众投注行为。了解反向盘口变动以及如何跟随聪明钱。',
        '繁體': '學習區分聰明錢和大眾投注行為。了解反向盤口變動以及如何跟隨聰明錢。',
        ID: 'Pelajari cara membedakan antara aksi taruhan sharp dan publik. Pahami pergerakan garis terbalik.',
      },
    },
    // S10 - Steam Moves
    {
      id: 'steam-moves-in-football-betting',
      category: 'insight',
      image: '/blog/blog_picture/Steam Moves in Football Betting.png',
      readTime: 7,
      date: '2026-01-04',
      title: {
        EN: 'Steam Moves in Football Betting: Riding the Sharp Wave',
        ES: 'Movimientos Steam en Apuestas de Fútbol: Montando la Ola Inteligente',
        PT: 'Movimentos Steam em Apostas de Futebol: Surfando a Onda Inteligente',
        DE: 'Steam Moves bei Fußballwetten: Die Sharp-Welle Reiten',
        FR: 'Mouvements Steam dans les Paris Football: Surfer sur la Vague Sharp',
        JA: 'サッカーベッティングのスチームムーブ：シャープウェーブに乗る',
        KO: '축구 베팅의 스팀 무브: 샤프 웨이브 타기',
        '中文': '足球投注中的急剧变动：跟随聪明钱浪潮',
        '繁體': '足球投注中的急劇變動：跟隨聰明錢浪潮',
        ID: 'Steam Moves dalam Taruhan Sepak Bola: Mengikuti Gelombang Sharp',
      },
      excerpt: {
        EN: 'What are steam moves and how can you capitalize on them? Learn to identify and react to rapid odds changes across multiple bookmakers.',
        ES: '¿Qué son los movimientos steam y cómo puedes aprovecharlos? Aprende a identificar cambios rápidos de cuotas.',
        PT: 'O que são movimentos steam e como você pode aproveitá-los? Aprenda a identificar mudanças rápidas de odds.',
        DE: 'Was sind Steam Moves und wie können Sie davon profitieren? Lernen Sie, schnelle Quotenänderungen zu erkennen.',
        FR: 'Que sont les mouvements steam et comment en profiter? Apprenez à identifier les changements rapides de cotes.',
        JA: 'スチームムーブとは何か、どう活用するか？複数のブックメーカーでの急速なオッズ変化を識別し対応する方法を学びましょう。',
        KO: '스팀 무브란 무엇이며 어떻게 활용할 수 있을까요? 여러 북메이커에서의 빠른 배당률 변화를 식별하고 대응하는 방법을 배우세요.',
        '中文': '什么是急剧变动，如何利用它们？学习识别并应对多个博彩公司的快速赔率变化。',
        '繁體': '什麼是急劇變動，如何利用它們？學習識別並應對多個博彩公司的快速賠率變化。',
        ID: 'Apa itu steam moves dan bagaimana Anda bisa memanfaatkannya? Pelajari cara mengidentifikasi perubahan odds yang cepat.',
      },
    },
    // S11 - How AI Predicts Football
    {
      id: 'how-ai-predicts-football-matches',
      category: 'insight',
      image: '/blog/blog_picture/How AI Predicts Football Matches.png',
      readTime: 12,
      date: '2026-01-03',
      title: {
        EN: 'How AI Predicts Football Matches: Inside the Machine Learning Models',
        ES: 'Cómo la IA Predice Partidos de Fútbol: Dentro de los Modelos de Machine Learning',
        PT: 'Como a IA Prevê Jogos de Futebol: Dentro dos Modelos de Machine Learning',
        DE: 'Wie KI Fußballspiele Vorhersagt: Einblick in Machine Learning Modelle',
        FR: 'Comment l\'IA Prédit les Matchs de Football: Dans les Modèles de Machine Learning',
        JA: 'AIはどのようにサッカーの試合を予測するか：機械学習モデルの内部',
        KO: 'AI가 축구 경기를 예측하는 방법: 머신러닝 모델 내부',
        '中文': 'AI如何预测足球比赛：机器学习模型内部解析',
        '繁體': 'AI如何預測足球比賽：機器學習模型內部解析',
        ID: 'Bagaimana AI Memprediksi Pertandingan Sepak Bola: Di Dalam Model Machine Learning',
      },
      excerpt: {
        EN: 'Explore how modern AI models analyze football data. From xG and form analysis to neural networks predicting match outcomes.',
        ES: 'Explora cómo los modelos de IA modernos analizan datos de fútbol. Desde xG y análisis de forma hasta redes neuronales.',
        PT: 'Explore como os modelos de IA modernos analisam dados de futebol. De xG e análise de forma a redes neurais.',
        DE: 'Erkunden Sie, wie moderne KI-Modelle Fußballdaten analysieren. Von xG und Formanalyse bis zu neuronalen Netzen.',
        FR: 'Explorez comment les modèles IA modernes analysent les données de football. Du xG et de l\'analyse de forme aux réseaux de neurones.',
        JA: '最新のAIモデルがサッカーデータをどのように分析するかを探ります。xGとフォーム分析からニューラルネットワークまで。',
        KO: '최신 AI 모델이 축구 데이터를 어떻게 분석하는지 탐구합니다. xG와 폼 분석부터 신경망까지.',
        '中文': '探索现代AI模型如何分析足球数据。从xG和状态分析到预测比赛结果的神经网络。',
        '繁體': '探索現代AI模型如何分析足球數據。從xG和狀態分析到預測比賽結果的神經網絡。',
        ID: 'Jelajahi bagaimana model AI modern menganalisis data sepak bola. Dari xG dan analisis form hingga jaringan saraf.',
      },
    },
    // S12 - Evaluating AI Models
    {
      id: 'evaluating-ai-football-prediction-models',
      category: 'insight',
      image: '/blog/blog_picture/Evaluating AI Football Prediction Models.jpg',
      readTime: 10,
      date: '2026-01-02',
      title: {
        EN: 'Evaluating AI Football Prediction Models: Key Metrics That Matter',
        ES: 'Evaluando Modelos de Predicción de Fútbol con IA: Métricas Clave',
        PT: 'Avaliando Modelos de Previsão de Futebol com IA: Métricas Importantes',
        DE: 'KI-Fußball-Vorhersagemodelle Bewerten: Wichtige Metriken',
        FR: 'Évaluer les Modèles de Prédiction IA: Métriques Clés',
        JA: 'AIサッカー予測モデルの評価：重要な指標',
        KO: 'AI 축구 예측 모델 평가: 중요한 지표',
        '中文': '评估AI足球预测模型：关键指标',
        '繁體': '評估AI足球預測模型：關鍵指標',
        ID: 'Mengevaluasi Model Prediksi Sepak Bola AI: Metrik Kunci',
      },
      excerpt: {
        EN: 'Learn how to assess AI prediction quality. Understand accuracy, ROI, Brier scores, and what makes a trustworthy prediction model.',
        ES: 'Aprende a evaluar la calidad de las predicciones de IA. Entiende precisión, ROI, puntajes Brier y qué hace confiable un modelo.',
        PT: 'Aprenda a avaliar a qualidade das previsões de IA. Entenda precisão, ROI, pontuações Brier e o que torna um modelo confiável.',
        DE: 'Lernen Sie, die Qualität von KI-Vorhersagen zu bewerten. Verstehen Sie Genauigkeit, ROI, Brier-Scores und was ein vertrauenswürdiges Modell ausmacht.',
        FR: 'Apprenez à évaluer la qualité des prédictions IA. Comprenez la précision, le ROI, les scores Brier et ce qui fait un modèle fiable.',
        JA: 'AI予測の品質を評価する方法を学びましょう。精度、ROI、ブライアスコア、信頼できる予測モデルの条件を理解します。',
        KO: 'AI 예측 품질을 평가하는 방법을 배우세요. 정확도, ROI, 브라이어 점수, 신뢰할 수 있는 예측 모델의 조건을 이해하세요.',
        '中文': '学习如何评估AI预测质量。了解准确率、ROI、布里尔分数以及什么使预测模型值得信赖。',
        '繁體': '學習如何評估AI預測質量。了解準確率、ROI、布里爾分數以及什麼使預測模型值得信賴。',
        ID: 'Pelajari cara menilai kualitas prediksi AI. Pahami akurasi, ROI, skor Brier, dan apa yang membuat model prediksi dapat dipercaya.',
      },
    },
    // S13 - AI vs Human Tipsters
    {
      id: 'ai-vs-human-tipsters-comparison',
      category: 'insight',
      image: '/blog/blog_picture/AI vs Human Tipsters.png',
      readTime: 9,
      date: '2025-12-31',
      title: {
        EN: 'AI vs Human Tipsters: Which Produces Better Football Predictions?',
        ES: 'IA vs Tipsters Humanos: ¿Quién Produce Mejores Predicciones?',
        PT: 'IA vs Tipsters Humanos: Quem Produz Melhores Previsões?',
        DE: 'KI vs Menschliche Tipster: Wer Liefert Bessere Vorhersagen?',
        FR: 'IA vs Tipsters Humains: Qui Produit de Meilleures Prédictions?',
        JA: 'AI vs 人間のティップスター：どちらがより良い予測を生み出すか？',
        KO: 'AI vs 인간 티퍼: 누가 더 나은 예측을 할까?',
        '中文': 'AI vs 人类专家：谁的足球预测更准确？',
        '繁體': 'AI vs 人類專家：誰的足球預測更準確？',
        ID: 'AI vs Tipster Manusia: Siapa yang Menghasilkan Prediksi Lebih Baik?',
      },
      excerpt: {
        EN: 'An honest comparison of AI and human prediction performance. When to trust algorithms and when human insight still has the edge.',
        ES: 'Una comparación honesta del rendimiento de predicción de IA y humanos. Cuándo confiar en algoritmos y cuándo el insight humano tiene ventaja.',
        PT: 'Uma comparação honesta do desempenho de previsão de IA e humanos. Quando confiar em algoritmos e quando a intuição humana ainda tem vantagem.',
        DE: 'Ein ehrlicher Vergleich von KI- und menschlicher Vorhersageleistung. Wann man Algorithmen vertrauen sollte und wann menschliche Einsicht noch überlegen ist.',
        FR: 'Une comparaison honnête des performances de prédiction IA et humaines. Quand faire confiance aux algorithmes et quand l\'intuition humaine a l\'avantage.',
        JA: 'AIと人間の予測パフォーマンスの正直な比較。アルゴリズムを信頼すべき時と、人間の洞察力がまだ優位な時。',
        KO: 'AI와 인간 예측 성능의 정직한 비교. 알고리즘을 신뢰할 때와 인간의 통찰력이 여전히 우위에 있을 때.',
        '中文': 'AI与人类预测表现的真实比较。何时信任算法，何时人类洞察力仍占优势。',
        '繁體': 'AI與人類預測表現的真實比較。何時信任算法，何時人類洞察力仍占優勢。',
        ID: 'Perbandingan jujur kinerja prediksi AI dan manusia. Kapan mempercayai algoritma dan kapan wawasan manusia masih unggul.',
      },
    },
    // S14 - Using OddsFlow AI
    {
      id: 'how-to-use-oddsflow-ai-predictions',
      category: 'tutorial',
      image: '/blog/blog_picture/How to Use OddsFlow AI Predictions.png',
      readTime: 8,
      date: '2025-12-30',
      title: {
        EN: 'How to Use OddsFlow AI Predictions: Maximize Your Edge',
        ES: 'Cómo Usar las Predicciones de IA de OddsFlow: Maximiza Tu Ventaja',
        PT: 'Como Usar as Previsões de IA do OddsFlow: Maximize Sua Vantagem',
        DE: 'OddsFlow AI-Vorhersagen Nutzen: Maximieren Sie Ihren Vorteil',
        FR: 'Comment Utiliser les Prédictions IA OddsFlow: Maximisez Votre Avantage',
        JA: 'OddsFlow AI予測の使い方：あなたの優位性を最大化',
        KO: 'OddsFlow AI 예측 사용법: 우위 극대화하기',
        '中文': '如何使用OddsFlow AI预测：最大化您的优势',
        '繁體': '如何使用OddsFlow AI預測：最大化您的優勢',
        ID: 'Cara Menggunakan Prediksi AI OddsFlow: Maksimalkan Keunggulan Anda',
      },
      excerpt: {
        EN: 'A practical guide to getting the most from OddsFlow predictions. Learn to interpret confidence levels, combine with your analysis, and manage stakes.',
        ES: 'Una guía práctica para aprovechar al máximo las predicciones de OddsFlow. Aprende a interpretar niveles de confianza.',
        PT: 'Um guia prático para aproveitar ao máximo as previsões do OddsFlow. Aprenda a interpretar níveis de confiança.',
        DE: 'Ein praktischer Leitfaden, um das Beste aus OddsFlow-Vorhersagen herauszuholen. Lernen Sie, Konfidenzniveaus zu interpretieren.',
        FR: 'Un guide pratique pour tirer le meilleur parti des prédictions OddsFlow. Apprenez à interpréter les niveaux de confiance.',
        JA: 'OddsFlow予測を最大限に活用するための実践ガイド。信頼度レベルの解釈方法を学びましょう。',
        KO: 'OddsFlow 예측을 최대한 활용하기 위한 실용적인 가이드. 신뢰도 수준을 해석하는 방법을 배우세요.',
        '中文': '充分利用OddsFlow预测的实用指南。学习解读置信度水平，与您的分析相结合，并管理投注额。',
        '繁體': '充分利用OddsFlow預測的實用指南。學習解讀置信度水平，與您的分析相結合，並管理投注額。',
        ID: 'Panduan praktis untuk memaksimalkan prediksi OddsFlow. Pelajari cara menafsirkan tingkat kepercayaan.',
      },
    },
    // S15 - Responsible Betting
    {
      id: 'responsible-football-betting-guide',
      category: 'tutorial',
      image: '/blog/blog_picture/Responsible Football Betting.png',
      readTime: 7,
      date: '2025-12-28',
      title: {
        EN: 'Responsible Football Betting: Protecting Your Bankroll and Wellbeing',
        ES: 'Apuestas de Fútbol Responsables: Protegiendo Tu Bankroll y Bienestar',
        PT: 'Apostas de Futebol Responsáveis: Protegendo Sua Banca e Bem-estar',
        DE: 'Verantwortungsvolles Fußballwetten: Bankroll und Wohlbefinden Schützen',
        FR: 'Paris Football Responsables: Protéger Votre Bankroll et Votre Bien-être',
        JA: '責任あるサッカーベッティング：バンクロールと健康を守る',
        KO: '책임감 있는 축구 베팅: 자금과 건강 보호하기',
        '中文': '负责任的足球投注：保护您的资金和身心健康',
        '繁體': '負責任的足球投注：保護您的資金和身心健康',
        ID: 'Taruhan Sepak Bola Bertanggung Jawab: Melindungi Bankroll dan Kesejahteraan Anda',
      },
      excerpt: {
        EN: 'Essential guidance on maintaining a healthy relationship with betting. Set limits, recognize warning signs, and bet for entertainment, not income.',
        ES: 'Guía esencial sobre mantener una relación saludable con las apuestas. Establece límites y reconoce señales de advertencia.',
        PT: 'Orientação essencial sobre manter um relacionamento saudável com apostas. Defina limites e reconheça sinais de alerta.',
        DE: 'Wichtige Hinweise für eine gesunde Beziehung zum Wetten. Setzen Sie Limits und erkennen Sie Warnsignale.',
        FR: 'Conseils essentiels pour maintenir une relation saine avec les paris. Fixez des limites et reconnaissez les signaux d\'alarme.',
        JA: 'ベッティングとの健全な関係を維持するための重要なガイダンス。制限を設定し、警告サインを認識しましょう。',
        KO: '베팅과 건강한 관계를 유지하기 위한 필수 가이드. 한도를 설정하고 경고 신호를 인식하세요.',
        '中文': '保持与投注健康关系的重要指导。设定限制，识别警告信号，将投注视为娱乐而非收入来源。',
        '繁體': '保持與投注健康關係的重要指導。設定限制，識別警告信號，將投注視為娛樂而非收入來源。',
        ID: 'Panduan penting untuk menjaga hubungan yang sehat dengan taruhan. Tetapkan batas dan kenali tanda-tanda peringatan.',
      },
    },
    // NEW SEO POSTS S5-S15 (from PDF)
    // S5 NEW - Asian Handicap Explained
    {
      id: 'asian-handicap-explained',
      category: 'tutorial',
      image: '/blog/blog_picture/S5/hero.png',
      readTime: 8,
      date: '2026-01-14',
      title: {
        EN: 'Asian Handicap Explained: 0, ±0.25, ±0.5, ±0.75, ±1.0 (Simple Rules)',
        ES: 'Hándicap Asiático Explicado: 0, ±0.25, ±0.5, ±0.75, ±1.0 (Reglas Simples)',
        PT: 'Handicap Asiático Explicado: 0, ±0.25, ±0.5, ±0.75, ±1.0 (Regras Simples)',
        DE: 'Asiatisches Handicap Erklärt: 0, ±0.25, ±0.5, ±0.75, ±1.0 (Einfache Regeln)',
        FR: 'Handicap Asiatique Expliqué: 0, ±0.25, ±0.5, ±0.75, ±1.0 (Règles Simples)',
        JA: 'アジアンハンディキャップ解説：0, ±0.25, ±0.5, ±0.75, ±1.0（簡単なルール）',
        KO: '아시안 핸디캡 설명: 0, ±0.25, ±0.5, ±0.75, ±1.0 (간단한 규칙)',
        '中文': '亚洲盘口详解：0, ±0.25, ±0.5, ±0.75, ±1.0（简单规则）',
        '繁體': '亞洲盤口詳解：0, ±0.25, ±0.5, ±0.75, ±1.0（簡單規則）',
        ID: 'Handicap Asia Dijelaskan: 0, ±0.25, ±0.5, ±0.75, ±1.0 (Aturan Sederhana)',
      },
      excerpt: {
        EN: 'Learn Asian Handicap lines step-by-step, including quarter lines like ±0.25 and ±0.75, and how to interpret them as structured probabilities.',
        ES: 'Aprende líneas de hándicap asiático paso a paso, incluyendo cuartos de línea como ±0.25 y ±0.75.',
        PT: 'Aprenda linhas de handicap asiático passo a passo, incluindo quartos de linha como ±0.25 e ±0.75.',
        DE: 'Lernen Sie asiatische Handicap-Linien Schritt für Schritt, einschließlich Viertellinien wie ±0.25 und ±0.75.',
        FR: 'Apprenez les lignes de handicap asiatique étape par étape, y compris les quarts de ligne comme ±0.25 et ±0.75.',
        JA: 'アジアンハンディキャップラインを段階的に学び、±0.25や±0.75などのクォーターラインの解釈方法を理解しましょう。',
        KO: '±0.25, ±0.75와 같은 쿼터 라인을 포함한 아시안 핸디캡 라인을 단계별로 배우세요.',
        '中文': '逐步学习亚洲盘口线，包括±0.25和±0.75等四分之一线，以及如何将其解读为结构化概率。',
        '繁體': '逐步學習亞洲盤口線，包括±0.25和±0.75等四分之一線，以及如何將其解讀為結構化概率。',
        ID: 'Pelajari garis Handicap Asia langkah demi langkah, termasuk garis seperempat seperti ±0.25 dan ±0.75.',
      },
    },
    // S6 NEW - Over/Under Goals Explained
    {
      id: 'over-under-goals-explained',
      category: 'tutorial',
      image: '/blog/blog_picture/S6/Hero.png',
      readTime: 9,
      date: '2026-01-14',
      title: {
        EN: 'Over/Under Goals Odds: What Totals Reveal About Match Tempo',
        ES: 'Cuotas Over/Under: Lo Que los Totales Revelan Sobre el Ritmo del Partido',
        PT: 'Odds Over/Under: O Que os Totais Revelam Sobre o Ritmo da Partida',
        DE: 'Over/Under Quoten: Was Totals Über das Spieltempo Verraten',
        FR: 'Cotes Over/Under: Ce Que les Totaux Révèlent sur le Tempo du Match',
        JA: 'オーバー/アンダーオッズ：トータルが示す試合テンポ',
        KO: '오버/언더 배당률: 토탈이 밝히는 경기 템포',
        '中文': '大小球赔率：总进球数揭示的比赛节奏',
        '繁體': '大小球賠率：總進球數揭示的比賽節奏',
        ID: 'Odds Over/Under: Apa yang Total Ungkap Tentang Tempo Pertandingan',
      },
      excerpt: {
        EN: 'Learn how Over/Under lines work, how totals reflect match tempo and scoring expectation, and how to translate totals odds into probability signals.',
        ES: 'Aprende cómo funcionan las líneas Over/Under y cómo los totales reflejan el ritmo del partido.',
        PT: 'Aprenda como funcionam as linhas Over/Under e como os totais refletem o ritmo da partida.',
        DE: 'Erfahren Sie, wie Over/Under-Linien funktionieren und wie Totals das Spieltempo widerspiegeln.',
        FR: 'Apprenez comment fonctionnent les lignes Over/Under et comment les totaux reflètent le tempo du match.',
        JA: 'オーバー/アンダーラインの仕組みと、トータルが試合テンポをどのように反映するかを学びましょう。',
        KO: '오버/언더 라인의 작동 방식과 토탈이 경기 템포를 어떻게 반영하는지 배우세요.',
        '中文': '了解大小球盘口的运作方式，总进球数如何反映比赛节奏和进球预期，以及如何将赔率转化为概率信号。',
        '繁體': '了解大小球盤口的運作方式，總進球數如何反映比賽節奏和進球預期，以及如何將賠率轉化為概率信號。',
        ID: 'Pelajari cara kerja garis Over/Under dan bagaimana total mencerminkan tempo pertandingan.',
      },
    },
    // S7 NEW - BTTS Odds Explained
    {
      id: 'btts-odds-explained',
      category: 'tutorial',
      image: '/blog/blog_picture/S7/Hero.png',
      readTime: 7,
      date: '2026-01-14',
      title: {
        EN: 'BTTS Odds Explained: Read Scoreline Risk Without Guessing Exact Scores',
        ES: 'Cuotas BTTS Explicadas: Lee el Riesgo de Marcador Sin Adivinar Resultados',
        PT: 'Odds BTTS Explicadas: Leia o Risco do Placar Sem Adivinhar Resultados',
        DE: 'BTTS Quoten Erklärt: Torrisiko Lesen Ohne Genaue Ergebnisse zu Erraten',
        FR: 'Cotes BTTS Expliquées: Lisez le Risque de Score Sans Deviner les Résultats',
        JA: 'BTTS（両チーム得点）オッズ解説：正確なスコアを予測せずにリスクを読む',
        KO: 'BTTS 배당률 설명: 정확한 스코어 예측 없이 득점 리스크 읽기',
        '中文': 'BTTS赔率详解：无需猜测准确比分即可读懂进球风险',
        '繁體': 'BTTS賠率詳解：無需猜測準確比分即可讀懂進球風險',
        ID: 'Odds BTTS Dijelaskan: Baca Risiko Skor Tanpa Menebak Skor Tepat',
      },
      excerpt: {
        EN: 'Learn what BTTS means, how to interpret BTTS odds as probabilities, and how BTTS connects with totals for clearer match scoring signals.',
        ES: 'Aprende qué significa BTTS, cómo interpretar las cuotas BTTS como probabilidades.',
        PT: 'Aprenda o que BTTS significa, como interpretar as odds BTTS como probabilidades.',
        DE: 'Erfahren Sie, was BTTS bedeutet und wie Sie BTTS-Quoten als Wahrscheinlichkeiten interpretieren.',
        FR: 'Apprenez ce que signifie BTTS et comment interpréter les cotes BTTS comme des probabilités.',
        JA: 'BTTSの意味、BTTSオッズを確率として解釈する方法、トータルとの関連性を学びましょう。',
        KO: 'BTTS의 의미, BTTS 배당률을 확률로 해석하는 방법을 배우세요.',
        '中文': '了解BTTS的含义，如何将BTTS赔率解读为概率，以及BTTS如何与总进球数结合提供更清晰的进球信号。',
        '繁體': '了解BTTS的含義，如何將BTTS賠率解讀為概率，以及BTTS如何與總進球數結合提供更清晰的進球信號。',
        ID: 'Pelajari apa arti BTTS dan cara menginterpretasikan odds BTTS sebagai probabilitas.',
      },
    },
    // S8 NEW - Opening vs Closing Odds
    {
      id: 'opening-vs-closing-odds',
      category: 'insight',
      image: '/blog/blog_picture/S8/Hero.png',
      readTime: 10,
      date: '2026-01-13',
      title: {
        EN: 'Opening vs Closing Odds: Why Timing Changes Prediction Quality',
        ES: 'Cuotas de Apertura vs Cierre: Por Qué el Tiempo Cambia la Calidad de Predicción',
        PT: 'Odds de Abertura vs Fechamento: Por Que o Timing Muda a Qualidade da Previsão',
        DE: 'Eröffnungs- vs Schlussquoten: Warum Timing die Vorhersagequalität Beeinflusst',
        FR: 'Cotes d\'Ouverture vs Fermeture: Pourquoi le Timing Change la Qualité de Prédiction',
        JA: 'オープニングvsクロージングオッズ：タイミングが予測精度に与える影響',
        KO: '오프닝 vs 클로징 배당률: 타이밍이 예측 품질을 바꾸는 이유',
        '中文': '开盘vs收盘赔率：时机如何影响预测质量',
        '繁體': '開盤vs收盤賠率：時機如何影響預測質量',
        ID: 'Odds Pembukaan vs Penutupan: Mengapa Waktu Mengubah Kualitas Prediksi',
      },
      excerpt: {
        EN: 'Learn the difference between opening, live, and closing odds, why timing matters, and how to use timing safely in analysis and model evaluation.',
        ES: 'Aprende la diferencia entre cuotas de apertura, en vivo y cierre, y por qué el timing importa.',
        PT: 'Aprenda a diferença entre odds de abertura, ao vivo e fechamento, e por que o timing importa.',
        DE: 'Erfahren Sie den Unterschied zwischen Eröffnungs-, Live- und Schlussquoten und warum Timing wichtig ist.',
        FR: 'Apprenez la différence entre les cotes d\'ouverture, en direct et de fermeture, et pourquoi le timing compte.',
        JA: 'オープニング、ライブ、クロージングオッズの違いと、タイミングが重要な理由を学びましょう。',
        KO: '오프닝, 라이브, 클로징 배당률의 차이와 타이밍이 중요한 이유를 배우세요.',
        '中文': '了解开盘、实时和收盘赔率的区别，时机为何重要，以及如何在分析和模型评估中安全使用时机。',
        '繁體': '了解開盤、實時和收盤賠率的區別，時機為何重要，以及如何在分析和模型評估中安全使用時機。',
        ID: 'Pelajari perbedaan antara odds pembukaan, live, dan penutupan, dan mengapa timing penting.',
      },
    },
    // S9 NEW - Odds Movement 101
    {
      id: 'odds-movement-drift-steam',
      category: 'insight',
      image: '/blog/blog_picture/S9/Hero.png',
      readTime: 8,
      date: '2026-01-13',
      title: {
        EN: 'Odds Movement 101: Drift, Steam, Stability, and Late Shifts',
        ES: 'Movimiento de Cuotas 101: Drift, Steam, Estabilidad y Cambios Tardíos',
        PT: 'Movimento de Odds 101: Drift, Steam, Estabilidade e Mudanças Tardias',
        DE: 'Quotenbewegung 101: Drift, Steam, Stabilität und Späte Verschiebungen',
        FR: 'Mouvement des Cotes 101: Drift, Steam, Stabilité et Changements Tardifs',
        JA: 'オッズ変動入門：ドリフト、スチーム、安定性、終盤の変化',
        KO: '배당률 움직임 101: 드리프트, 스팀, 안정성, 후반 변동',
        '中文': '赔率变动入门：漂移、急变、稳定性和后期变化',
        '繁體': '賠率變動入門：漂移、急變、穩定性和後期變化',
        ID: 'Pergerakan Odds 101: Drift, Steam, Stabilitas, dan Pergeseran Akhir',
      },
      excerpt: {
        EN: 'Learn the basics of odds movement, what drift and steam mean, how to read stability, and why late shifts are different from random noise.',
        ES: 'Aprende los fundamentos del movimiento de cuotas, qué significan drift y steam.',
        PT: 'Aprenda os fundamentos do movimento de odds, o que drift e steam significam.',
        DE: 'Lernen Sie die Grundlagen der Quotenbewegung, was Drift und Steam bedeuten.',
        FR: 'Apprenez les bases du mouvement des cotes, ce que signifient drift et steam.',
        JA: 'オッズ変動の基本、ドリフトとスチームの意味、安定性の読み方を学びましょう。',
        KO: '배당률 움직임의 기본, 드리프트와 스팀의 의미를 배우세요.',
        '中文': '学习赔率变动的基础知识，了解漂移和急变的含义，如何读取稳定性，以及后期变化为何不同于随机噪音。',
        '繁體': '學習賠率變動的基礎知識，了解漂移和急變的含義，如何讀取穩定性，以及後期變化為何不同於隨機噪音。',
        ID: 'Pelajari dasar-dasar pergerakan odds, apa arti drift dan steam.',
      },
    },
    // S10 NEW - Bookmaker Consensus
    {
      id: 'bookmaker-consensus-odds',
      category: 'insight',
      image: '/blog/blog_picture/S10/Hero.png',
      readTime: 9,
      date: '2026-01-13',
      title: {
        EN: 'Bookmaker Consensus: Why Comparing Multiple Sources Reduces Noise',
        ES: 'Consenso de Casas de Apuestas: Por Qué Comparar Múltiples Fuentes Reduce el Ruido',
        PT: 'Consenso de Casas de Apostas: Por Que Comparar Múltiplas Fontes Reduz Ruído',
        DE: 'Buchmacher-Konsens: Warum das Vergleichen Mehrerer Quellen Rauschen Reduziert',
        FR: 'Consensus des Bookmakers: Pourquoi Comparer Plusieurs Sources Réduit le Bruit',
        JA: 'ブックメーカーコンセンサス：複数ソース比較がノイズを減らす理由',
        KO: '북메이커 컨센서스: 여러 소스 비교가 노이즈를 줄이는 이유',
        '中文': '博彩公司共识：为什么比较多个来源可以减少噪音',
        '繁體': '博彩公司共識：為什麼比較多個來源可以減少噪音',
        ID: 'Konsensus Bandar: Mengapa Membandingkan Beberapa Sumber Mengurangi Noise',
      },
      excerpt: {
        EN: 'Learn how bookmaker consensus works, why single-source odds can be noisy, and how to use averages, medians, and dispersion for cleaner signals.',
        ES: 'Aprende cómo funciona el consenso de casas de apuestas y por qué las cuotas de una sola fuente pueden ser ruidosas.',
        PT: 'Aprenda como funciona o consenso de casas de apostas e por que odds de uma única fonte podem ser ruidosas.',
        DE: 'Erfahren Sie, wie Buchmacher-Konsens funktioniert und warum Quoten aus einer einzigen Quelle verrauscht sein können.',
        FR: 'Apprenez comment fonctionne le consensus des bookmakers et pourquoi les cotes d\'une seule source peuvent être bruitées.',
        JA: 'ブックメーカーコンセンサスの仕組みと、単一ソースのオッズにノイズが多い理由を学びましょう。',
        KO: '북메이커 컨센서스의 작동 방식과 단일 소스 배당률에 노이즈가 많은 이유를 배우세요.',
        '中文': '了解博彩公司共识的运作方式，单一来源赔率可能存在噪音的原因，以及如何使用平均值、中位数和离散度获得更清晰的信号。',
        '繁體': '了解博彩公司共識的運作方式，單一來源賠率可能存在噪音的原因，以及如何使用平均值、中位數和離散度獲得更清晰的信號。',
        ID: 'Pelajari cara kerja konsensus bandar dan mengapa odds dari satu sumber bisa berisik.',
      },
    },
    // S11 NEW - OddsFlow Odds to Features
    {
      id: 'oddsflow-odds-to-features',
      category: 'tutorial',
      image: '/blog/blog_picture/S11/Hero.png',
      readTime: 11,
      date: '2026-01-12',
      title: {
        EN: 'How OddsFlow Turns Odds Into Features (Simple + Technical Guide)',
        ES: 'Cómo OddsFlow Convierte Cuotas en Características (Guía Simple + Técnica)',
        PT: 'Como OddsFlow Transforma Odds em Recursos (Guia Simples + Técnico)',
        DE: 'Wie OddsFlow Quoten in Features Umwandelt (Einfacher + Technischer Leitfaden)',
        FR: 'Comment OddsFlow Transforme les Cotes en Caractéristiques (Guide Simple + Technique)',
        JA: 'OddsFlowがオッズを特徴量に変換する方法（シンプル＋テクニカルガイド）',
        KO: 'OddsFlow가 배당률을 특성으로 변환하는 방법 (간단 + 기술 가이드)',
        '中文': 'OddsFlow如何将赔率转化为特征（简单+技术指南）',
        '繁體': 'OddsFlow如何將賠率轉化為特徵（簡單+技術指南）',
        ID: 'Bagaimana OddsFlow Mengubah Odds Menjadi Fitur (Panduan Sederhana + Teknis)',
      },
      excerpt: {
        EN: 'See how OddsFlow converts odds into structured features: de-vig probabilities, movement signals, consensus metrics, and cross-market consistency checks.',
        ES: 'Descubre cómo OddsFlow convierte las cuotas en características estructuradas: probabilidades sin vig, señales de movimiento.',
        PT: 'Veja como OddsFlow converte odds em recursos estruturados: probabilidades sem vig, sinais de movimento.',
        DE: 'Erfahren Sie, wie OddsFlow Quoten in strukturierte Features umwandelt: De-Vig-Wahrscheinlichkeiten, Bewegungssignale.',
        FR: 'Découvrez comment OddsFlow convertit les cotes en caractéristiques structurées: probabilités dé-vigées, signaux de mouvement.',
        JA: 'OddsFlowがオッズを構造化された特徴量に変換する方法をご覧ください：デビグ確率、変動シグナル、コンセンサス指標。',
        KO: 'OddsFlow가 배당률을 구조화된 특성으로 변환하는 방법을 확인하세요: 디빅 확률, 움직임 신호.',
        '中文': '了解OddsFlow如何将赔率转化为结构化特征：去水概率、变动信号、共识指标和跨市场一致性检查。',
        '繁體': '了解OddsFlow如何將賠率轉化為結構化特徵：去水概率、變動信號、共識指標和跨市場一致性檢查。',
        ID: 'Lihat bagaimana OddsFlow mengubah odds menjadi fitur terstruktur: probabilitas de-vig, sinyal pergerakan.',
      },
    },
    // S12 NEW - Accuracy vs Calibration
    {
      id: 'accuracy-vs-calibration-football-predictions',
      category: 'insight',
      image: '/blog/blog_picture/S12/hero.png',
      readTime: 10,
      date: '2026-01-12',
      title: {
        EN: 'Accuracy vs Calibration: How to Judge Football Predictions Properly',
        ES: 'Precisión vs Calibración: Cómo Juzgar Predicciones de Fútbol Correctamente',
        PT: 'Precisão vs Calibração: Como Avaliar Previsões de Futebol Corretamente',
        DE: 'Genauigkeit vs Kalibrierung: Wie Man Fußballvorhersagen Richtig Bewertet',
        FR: 'Précision vs Calibration: Comment Juger Correctement les Prédictions de Football',
        JA: '精度vsキャリブレーション：サッカー予測を正しく評価する方法',
        KO: '정확도 vs 캘리브레이션: 축구 예측을 올바르게 판단하는 방법',
        '中文': '准确率vs校准：如何正确评估足球预测',
        '繁體': '準確率vs校準：如何正確評估足球預測',
        ID: 'Akurasi vs Kalibrasi: Cara Menilai Prediksi Sepak Bola dengan Benar',
      },
      excerpt: {
        EN: 'Learn why win-rate can mislead, what calibration means, and how to evaluate probability predictions using Brier score and log loss concepts.',
        ES: 'Aprende por qué la tasa de aciertos puede engañar, qué significa calibración y cómo evaluar predicciones de probabilidad.',
        PT: 'Aprenda por que a taxa de acerto pode enganar, o que calibração significa e como avaliar previsões de probabilidade.',
        DE: 'Erfahren Sie, warum die Gewinnrate irreführen kann, was Kalibrierung bedeutet und wie man Wahrscheinlichkeitsvorhersagen bewertet.',
        FR: 'Apprenez pourquoi le taux de victoire peut tromper, ce que signifie la calibration et comment évaluer les prédictions de probabilité.',
        JA: '勝率が誤解を招く理由、キャリブレーションの意味、ブライアスコアを使った確率予測の評価方法を学びましょう。',
        KO: '승률이 오해를 불러일으킬 수 있는 이유, 캘리브레이션의 의미, 브라이어 점수를 사용한 확률 예측 평가 방법을 배우세요.',
        '中文': '了解为什么胜率可能具有误导性，校准的含义，以及如何使用布里尔分数和对数损失概念评估概率预测。',
        '繁體': '了解為什麼勝率可能具有誤導性，校準的含義，以及如何使用布里爾分數和對數損失概念評估概率預測。',
        ID: 'Pelajari mengapa win-rate bisa menyesatkan, apa arti kalibrasi, dan cara mengevaluasi prediksi probabilitas.',
      },
    },
    // S13 NEW - Backtesting Football Models
    {
      id: 'backtesting-football-models',
      category: 'insight',
      image: '/blog/blog_picture/S13/Hero.png',
      readTime: 9,
      date: '2026-01-11',
      title: {
        EN: 'Backtesting Football Models: Leakage, Cherry-Picking, and False Confidence',
        ES: 'Backtesting de Modelos de Fútbol: Fuga de Datos, Cherry-Picking y Falsa Confianza',
        PT: 'Backtesting de Modelos de Futebol: Vazamento de Dados, Cherry-Picking e Falsa Confiança',
        DE: 'Backtesting von Fußballmodellen: Datenleck, Cherry-Picking und Falsches Vertrauen',
        FR: 'Backtesting des Modèles de Football: Fuite de Données, Cherry-Picking et Fausse Confiance',
        JA: 'サッカーモデルのバックテスト：リーケージ、チェリーピッキング、偽の自信',
        KO: '축구 모델 백테스팅: 데이터 누출, 체리피킹, 거짓 자신감',
        '中文': '足球模型回测：数据泄露、挑选数据和虚假信心',
        '繁體': '足球模型回測：數據洩露、挑選數據和虛假信心',
        ID: 'Backtesting Model Sepak Bola: Kebocoran Data, Cherry-Picking, dan Kepercayaan Palsu',
      },
      excerpt: {
        EN: 'Learn the most common backtesting mistakes in football prediction: data leakage, biased sampling, improper splits, and how to test models realistically.',
        ES: 'Aprende los errores de backtesting más comunes en predicción de fútbol: fuga de datos, muestreo sesgado.',
        PT: 'Aprenda os erros de backtesting mais comuns em previsão de futebol: vazamento de dados, amostragem tendenciosa.',
        DE: 'Lernen Sie die häufigsten Backtesting-Fehler bei Fußballvorhersagen: Datenlecks, verzerrte Stichproben.',
        FR: 'Apprenez les erreurs de backtesting les plus courantes en prédiction de football: fuite de données, échantillonnage biaisé.',
        JA: 'サッカー予測で最も一般的なバックテストミスを学びましょう：データリーケージ、バイアスサンプリング。',
        KO: '축구 예측에서 가장 흔한 백테스팅 실수를 배우세요: 데이터 누출, 편향된 샘플링.',
        '中文': '了解足球预测中最常见的回测错误：数据泄露、偏差采样、不当分割，以及如何现实地测试模型。',
        '繁體': '了解足球預測中最常見的回測錯誤：數據洩露、偏差採樣、不當分割，以及如何現實地測試模型。',
        ID: 'Pelajari kesalahan backtesting paling umum dalam prediksi sepak bola: kebocoran data, sampling bias.',
      },
    },
    // S14 NEW - Beyond Odds
    {
      id: 'beyond-odds-football-features',
      category: 'insight',
      image: '/blog/blog_picture/S14/Hero.png',
      readTime: 10,
      date: '2026-01-11',
      title: {
        EN: 'Beyond Odds: xG, Injuries, Schedule Congestion (and How They Combine)',
        ES: 'Más Allá de las Cuotas: xG, Lesiones, Congestión de Calendario (y Cómo se Combinan)',
        PT: 'Além das Odds: xG, Lesões, Congestionamento de Calendário (e Como se Combinam)',
        DE: 'Jenseits der Quoten: xG, Verletzungen, Terminüberlastung (und Wie Sie sich Kombinieren)',
        FR: 'Au-delà des Cotes: xG, Blessures, Encombrement du Calendrier (et Comment Ils se Combinent)',
        JA: 'オッズを超えて：xG、怪我、日程過密（そしてそれらの組み合わせ方）',
        KO: '배당률을 넘어서: xG, 부상, 일정 과밀 (그리고 이들의 결합 방법)',
        '中文': '超越赔率：xG、伤病、赛程拥挤（以及它们如何结合）',
        '繁體': '超越賠率：xG、傷病、賽程擁擠（以及它們如何結合）',
        ID: 'Melampaui Odds: xG, Cedera, Kepadatan Jadwal (dan Bagaimana Mereka Bergabung)',
      },
      excerpt: {
        EN: 'Learn the main non-odds inputs used in football prediction—xG, injuries, travel, rest—and how to combine them with odds signals cleanly.',
        ES: 'Aprende los principales inputs no relacionados con cuotas en predicción de fútbol: xG, lesiones, viajes, descanso.',
        PT: 'Aprenda os principais inputs não relacionados a odds em previsão de futebol: xG, lesões, viagens, descanso.',
        DE: 'Erfahren Sie die wichtigsten Nicht-Quoten-Inputs in der Fußballvorhersage: xG, Verletzungen, Reisen, Ruhe.',
        FR: 'Apprenez les principaux inputs non liés aux cotes en prédiction de football: xG, blessures, voyages, repos.',
        JA: 'サッカー予測で使用される主なオッズ以外の入力データを学びましょう：xG、怪我、移動、休息。',
        KO: '축구 예측에서 사용되는 주요 비배당률 입력을 배우세요: xG, 부상, 이동, 휴식.',
        '中文': '了解足球预测中使用的主要非赔率输入数据——xG、伤病、旅行、休息——以及如何将它们与赔率信号清晰地结合。',
        '繁體': '了解足球預測中使用的主要非賠率輸入數據——xG、傷病、旅行、休息——以及如何將它們與賠率信號清晰地結合。',
        ID: 'Pelajari input non-odds utama yang digunakan dalam prediksi sepak bola: xG, cedera, perjalanan, istirahat.',
      },
    },
    // S15 NEW - Responsible Use of Predictions
    {
      id: 'responsible-use-of-predictions',
      category: 'tutorial',
      image: '/blog/blog_picture/S15/Hero.png',
      readTime: 7,
      date: '2026-01-10',
      title: {
        EN: 'Responsible Use of Predictions: Risk, Uncertainty, and Healthy Habits',
        ES: 'Uso Responsable de Predicciones: Riesgo, Incertidumbre y Hábitos Saludables',
        PT: 'Uso Responsável de Previsões: Risco, Incerteza e Hábitos Saudáveis',
        DE: 'Verantwortungsvoller Umgang mit Vorhersagen: Risiko, Unsicherheit und Gesunde Gewohnheiten',
        FR: 'Utilisation Responsable des Prédictions: Risque, Incertitude et Habitudes Saines',
        JA: '予測の責任ある使用：リスク、不確実性、健全な習慣',
        KO: '예측의 책임 있는 사용: 위험, 불확실성, 건강한 습관',
        '中文': '负责任地使用预测：风险、不确定性和健康习惯',
        '繁體': '負責任地使用預測：風險、不確定性和健康習慣',
        ID: 'Penggunaan Prediksi yang Bertanggung Jawab: Risiko, Ketidakpastian, dan Kebiasaan Sehat',
      },
      excerpt: {
        EN: 'Predictions are probabilities, not guarantees. Learn how to interpret uncertainty, avoid overconfidence, and keep a healthy approach to sports analytics.',
        ES: 'Las predicciones son probabilidades, no garantías. Aprende a interpretar la incertidumbre y evitar la sobreconfianza.',
        PT: 'Previsões são probabilidades, não garantias. Aprenda a interpretar a incerteza e evitar excesso de confiança.',
        DE: 'Vorhersagen sind Wahrscheinlichkeiten, keine Garantien. Lernen Sie, Unsicherheit zu interpretieren und Übervertrauen zu vermeiden.',
        FR: 'Les prédictions sont des probabilités, pas des garanties. Apprenez à interpréter l\'incertitude et à éviter l\'excès de confiance.',
        JA: '予測は確率であり、保証ではありません。不確実性の解釈方法と過信を避ける方法を学びましょう。',
        KO: '예측은 확률이지 보장이 아닙니다. 불확실성을 해석하고 과신을 피하는 방법을 배우세요.',
        '中文': '预测是概率，而非保证。了解如何解读不确定性，避免过度自信，保持对体育分析的健康态度。',
        '繁體': '預測是概率，而非保證。了解如何解讀不確定性，避免過度自信，保持對體育分析的健康態度。',
        ID: 'Prediksi adalah probabilitas, bukan jaminan. Pelajari cara menafsirkan ketidakpastian dan menghindari kepercayaan berlebihan.',
      },
    },
  ],
};

export default function BlogClient({ locale: propLocale }: BlogClientProps) {
  const locale = locales.includes(propLocale as Locale) ? propLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/blog';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tutorial' | 'insight' | 'update'>('all');
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

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

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
    return date.toLocaleDateString(selectedLang === '中文' ? 'zh-CN' : selectedLang === '繁體' ? 'zh-TW' : selectedLang.toLowerCase(), {
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
            <Link href={localePath(`/blog/${featuredPost.id}`)} className="relative block bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden group hover:border-emerald-500/30 transition-all cursor-pointer">
              {/* Shine effect overlay */}
              <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />
              </div>
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-black">
                  {t('featured')}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title[selectedLang] || featuredPost.title['EN']}
                    className="w-full h-full object-cover"
                  />
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
                    {featuredPost.title[selectedLang] || featuredPost.title['EN']}
                  </h2>
                  <p className="text-gray-400 mb-6 line-clamp-3">
                    {featuredPost.excerpt[selectedLang] || featuredPost.excerpt['EN']}
                  </p>
                  <span className="inline-flex items-center gap-2 text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors">
                    {t('readMore')}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
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
                href={localePath(`/blog/${post.id}`)}
                className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 overflow-hidden hover:border-emerald-500/30 transition-all cursor-pointer block"
              >
                {/* Shine effect overlay */}
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </div>
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title[selectedLang] || post.title['EN']}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBgColor(post.category)}`}>
                      {t(post.category === 'tutorial' ? 'tutorials' : post.category === 'insight' ? 'insights' : 'updates')}
                    </span>
                    <span className="text-gray-500 text-xs">{post.readTime} {t('minRead')}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {post.title[selectedLang] || post.title['EN']}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt[selectedLang] || post.excerpt['EN']}
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
