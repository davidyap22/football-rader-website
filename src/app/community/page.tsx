'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { supabase, chatSupabase, Prematch, MatchComment, ChatMessage, ChatReaction, CommentReaction, UserMatchPrediction, getMatchComments, addComment, toggleCommentLike, deleteComment, getCommentStats, getChatMessages, sendChatMessage, subscribeToChatMessages, getMessageReactions, toggleMessageReaction, getCommentReactions, toggleCommentReaction, getMatchUserPredictions, submitUserPrediction, deleteUserPrediction, getRecentPredictions } from '@/lib/supabase';

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
    communityTitle: "Match Discussions",
    communitySubtitle: "Share your thoughts on today's matches with the community",
    totalComments: "Total Comments",
    todayComments: "Today",
    activeUsers: "Active Users",
    noMatches: "No matches for this date",
    comments: "comments",
    writeComment: "Write a comment...",
    reply: "Reply",
    likes: "likes",
    loginToComment: "Login to comment",
    send: "Send",
    cancel: "Cancel",
    delete: "Delete",
    showComments: "Show Comments",
    hideComments: "Hide Comments",
    noComments: "No comments yet. Be the first to comment!",
    yesterday: "Yesterday",
    today: "Today",
    tomorrow: "Tomorrow",
    globalChat: "Global Chat",
    matchChat: "Match Chat",
    onlineNow: "online now",
    typeMessage: "Type a message...",
    loginToChat: "Login to chat",
    closeChat: "Close",
    openChat: "Chat",
    liveChat: "Live Chat",
    userPredictions: "User Predictions",
    makePrediction: "Make Prediction",
    predictedScore: "Predicted Score",
    winner: "Winner",
    analysis: "Analysis",
    yourAnalysis: "Your analysis (optional)...",
    submitPrediction: "Submit Prediction",
    updatePrediction: "Update Prediction",
    noPredictions: "No predictions yet. Be the first to predict!",
    loginToPredict: "Login to make predictions",
    homeWin: "Home",
    draw: "Draw",
    awayWin: "Away",
    recentPredictions: "Recent Predictions",
    vs: "vs",
    predicts: "predicts",
    predictionSuccess: "Prediction submitted successfully!",
    predictionError: "Failed to submit prediction",
    predictionErrorSetup: "Predictions feature not enabled. Please run the SQL setup.",
    communityPoll: "Community Poll",
    totalVotes: "votes",
    viewAllPredictions: "View All Predictions",
    // Homepage translations
    communityHub: "Community Hub",
    welcomeMessage: "Welcome to OddsFlow Community",
    welcomeSubtitle: "Chat, predict, and share with football fans worldwide",
    enterChat: "Enter Chat",
    hotDiscussions: "Hot Discussions",
    topPredictors: "Top Predictors",
    featuredMatches: "Featured Matches",
    comingSoon: "Coming Soon",
    liveDiscussion: "Join live discussions with fans",
    sharePredictions: "Share your match predictions",
    discussMatches: "Discuss today's matches",
    viewAll: "View All",
    exploreAll: "Explore all features",
    scrollDown: "Scroll Down",
    latestNews: "Latest football news",
    // SEO Section
    whatIsCommunity: "What is OddsFlow Community?",
    communityDesc1: "OddsFlow Community is your ultimate hub for football discussion, predictions, and real-time chat with fans worldwide.",
    communityDesc2: "Join thousands of football enthusiasts sharing insights, match predictions, and live discussions across Premier League, La Liga, Serie A, Bundesliga, and more.",
    communityDesc3: "Our AI-powered platform provides accurate predictions while our community adds the human element - share your analysis, debate match outcomes, and celebrate wins together.",
    communityDesc4: "Whether you're a casual fan or a serious bettor, OddsFlow Community gives you the tools and connections to enhance your football experience.",
    communityFeature1Title: "Live Global Chat",
    communityFeature1Desc: "Chat in real-time with football fans from around the world. Discuss matches, share tips, and celebrate goals together.",
    communityFeature2Title: "User Predictions",
    communityFeature2Desc: "Share your match predictions and see what the community thinks. Track your accuracy and compete with other predictors.",
    communityFeature3Title: "Match Discussions",
    communityFeature3Desc: "Deep dive into specific matches with dedicated chat rooms. Analyze teams, formations, and betting opportunities.",
    joinCommunityToday: "Join the Community Today",
    joinCommunityDesc: "Connect with thousands of football fans, share your predictions, and be part of the most active football betting community.",
    // Footer
    footerDesc: "AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.",
    product: "Product",
    liveOdds: "AI Performance",
    company: "Company",
    aboutUs: "About Us",
    blog: "Blog",
    contact: "Contact",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    solution: "Solution",
    communityFooter: "Community",
    globalChatFooter: "Global Chat",
    userPredictionsFooter: "User Predictions",
    todayMatches: "Today Matches",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
    popularLeagues: "Popular Leagues",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始",
    communityTitle: "比赛讨论",
    communitySubtitle: "与社区分享您对今日比赛的看法",
    totalComments: "总评论",
    todayComments: "今日",
    activeUsers: "活跃用户",
    noMatches: "该日期没有比赛",
    comments: "评论",
    writeComment: "写评论...",
    reply: "回复",
    likes: "赞",
    loginToComment: "登录后评论",
    send: "发送",
    cancel: "取消",
    delete: "删除",
    showComments: "显示评论",
    hideComments: "隐藏评论",
    noComments: "暂无评论，成为第一个评论者！",
    yesterday: "昨天",
    today: "今天",
    tomorrow: "明天",
    globalChat: "全局聊天",
    matchChat: "比赛聊天",
    onlineNow: "在线",
    typeMessage: "输入消息...",
    loginToChat: "登录聊天",
    closeChat: "关闭",
    openChat: "聊天",
    liveChat: "实时聊天",
    userPredictions: "用户预测",
    makePrediction: "发表预测",
    predictedScore: "预测比分",
    winner: "获胜者",
    analysis: "分析",
    yourAnalysis: "您的分析（可选）...",
    submitPrediction: "提交预测",
    updatePrediction: "更新预测",
    noPredictions: "暂无预测，成为第一个预测者！",
    loginToPredict: "登录发表预测",
    homeWin: "主队",
    draw: "平局",
    awayWin: "客队",
    recentPredictions: "最新预测",
    vs: "对阵",
    predicts: "预测",
    predictionSuccess: "预测提交成功！",
    predictionError: "预测提交失败",
    predictionErrorSetup: "预测功能未启用，请先运行 SQL 设置。",
    communityPoll: "社区民调",
    totalVotes: "票",
    viewAllPredictions: "查看所有预测",
    communityHub: "社区中心",
    welcomeMessage: "欢迎来到 OddsFlow 社区",
    welcomeSubtitle: "与全球球迷一起聊天、预测、分享",
    enterChat: "进入聊天",
    hotDiscussions: "热门讨论",
    topPredictors: "预测排行榜",
    featuredMatches: "精选比赛",
    comingSoon: "即将推出",
    liveDiscussion: "加入球迷实时讨论",
    sharePredictions: "分享您的比赛预测",
    discussMatches: "讨论今日比赛",
    viewAll: "查看全部",
    exploreAll: "探索所有功能",
    scrollDown: "向下滚动",
    latestNews: "最新足球新闻",
    // SEO Section
    whatIsCommunity: "什么是 OddsFlow 社区？",
    communityDesc1: "OddsFlow 社区是您与全球球迷讨论足球、预测比赛和实时聊天的终极平台。",
    communityDesc2: "加入成千上万的足球爱好者，分享英超、西甲、意甲、德甲等联赛的见解、比赛预测和实时讨论。",
    communityDesc3: "我们的 AI 平台提供精准预测，而社区带来人性化元素 - 分享您的分析，讨论比赛结果，一起庆祝胜利。",
    communityDesc4: "无论您是普通球迷还是专业投注者，OddsFlow 社区都能为您提供工具和连接，提升您的足球体验。",
    communityFeature1Title: "全球实时聊天",
    communityFeature1Desc: "与世界各地的球迷实时聊天。讨论比赛，分享技巧，一起庆祝进球。",
    communityFeature2Title: "用户预测",
    communityFeature2Desc: "分享您的比赛预测，看看社区怎么想。追踪您的准确率，与其他预测者竞争。",
    communityFeature3Title: "比赛讨论",
    communityFeature3Desc: "在专属聊天室深入讨论特定比赛。分析球队、阵型和投注机会。",
    joinCommunityToday: "立即加入社区",
    joinCommunityDesc: "与数千名球迷建立联系，分享您的预测，成为最活跃的足球投注社区的一员。",
    // Footer
    footerDesc: "AI 驱动的足球赔率分析，助您做出更明智的预测。通过实时洞察做出数据驱动的决策。",
    product: "产品",
    liveOdds: "AI 分析",
    company: "公司",
    aboutUs: "关于我们",
    blog: "博客",
    contact: "联系我们",
    legal: "法律",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩有风险，请理性投注。",
    solution: "解决方案",
    communityFooter: "社区",
    globalChatFooter: "全球聊天",
    userPredictionsFooter: "用户预测",
    todayMatches: "今日比赛",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
    popularLeagues: "热门联赛",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始",
    communityTitle: "比賽討論",
    communitySubtitle: "與社區分享您對今日比賽的看法",
    totalComments: "總評論",
    todayComments: "今日",
    activeUsers: "活躍用戶",
    noMatches: "該日期沒有比賽",
    comments: "評論",
    writeComment: "寫評論...",
    reply: "回覆",
    likes: "讚",
    loginToComment: "登入後評論",
    send: "發送",
    cancel: "取消",
    delete: "刪除",
    showComments: "顯示評論",
    hideComments: "隱藏評論",
    noComments: "暫無評論，成為第一個評論者！",
    yesterday: "昨天",
    today: "今天",
    tomorrow: "明天",
    globalChat: "全局聊天",
    matchChat: "比賽聊天",
    onlineNow: "在線",
    typeMessage: "輸入消息...",
    loginToChat: "登入聊天",
    closeChat: "關閉",
    openChat: "聊天",
    liveChat: "實時聊天",
    userPredictions: "用戶預測",
    makePrediction: "發表預測",
    predictedScore: "預測比分",
    winner: "獲勝者",
    analysis: "分析",
    yourAnalysis: "您的分析（可選）...",
    submitPrediction: "提交預測",
    updatePrediction: "更新預測",
    noPredictions: "暫無預測，成為第一個預測者！",
    loginToPredict: "登入發表預測",
    homeWin: "主隊",
    draw: "平局",
    awayWin: "客隊",
    recentPredictions: "最新預測",
    vs: "對陣",
    predicts: "預測",
    predictionSuccess: "預測提交成功！",
    predictionError: "預測提交失敗",
    predictionErrorSetup: "預測功能未啟用，請先運行 SQL 設置。",
    communityPoll: "社區民調",
    totalVotes: "票",
    viewAllPredictions: "查看所有預測",
    communityHub: "社區中心",
    welcomeMessage: "歡迎來到 OddsFlow 社區",
    welcomeSubtitle: "與全球球迷一起聊天、預測、分享",
    enterChat: "進入聊天",
    hotDiscussions: "熱門討論",
    topPredictors: "預測排行榜",
    featuredMatches: "精選比賽",
    comingSoon: "即將推出",
    liveDiscussion: "加入球迷即時討論",
    sharePredictions: "分享您的比賽預測",
    discussMatches: "討論今日比賽",
    viewAll: "查看全部",
    exploreAll: "探索所有功能",
    scrollDown: "向下滾動",
    latestNews: "最新足球新聞",
    // SEO Section
    whatIsCommunity: "什麼是 OddsFlow 社區？",
    communityDesc1: "OddsFlow 社區是您與全球球迷討論足球、預測比賽和即時聊天的終極平台。",
    communityDesc2: "加入成千上萬的足球愛好者，分享英超、西甲、意甲、德甲等聯賽的見解、比賽預測和即時討論。",
    communityDesc3: "我們的 AI 平台提供精準預測，而社區帶來人性化元素 - 分享您的分析，討論比賽結果，一起慶祝勝利。",
    communityDesc4: "無論您是普通球迷還是專業投注者，OddsFlow 社區都能為您提供工具和連接，提升您的足球體驗。",
    communityFeature1Title: "全球即時聊天",
    communityFeature1Desc: "與世界各地的球迷即時聊天。討論比賽，分享技巧，一起慶祝進球。",
    communityFeature2Title: "用戶預測",
    communityFeature2Desc: "分享您的比賽預測，看看社區怎麼想。追蹤您的準確率，與其他預測者競爭。",
    communityFeature3Title: "比賽討論",
    communityFeature3Desc: "在專屬聊天室深入討論特定比賽。分析球隊、陣型和投注機會。",
    joinCommunityToday: "立即加入社區",
    joinCommunityDesc: "與數千名球迷建立聯繫，分享您的預測，成為最活躍的足球投注社區的一員。",
    // Footer
    footerDesc: "AI 驅動的足球賠率分析，助您做出更明智的預測。通過即時洞察做出數據驅動的決策。",
    product: "產品",
    liveOdds: "AI 分析",
    company: "公司",
    aboutUs: "關於我們",
    blog: "部落格",
    contact: "聯繫我們",
    legal: "法律",
    privacyPolicy: "隱私政策",
    termsOfService: "服務條款",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩有風險，請理性投注。",
    solution: "解決方案",
    communityFooter: "社區",
    globalChatFooter: "全球聊天",
    userPredictionsFooter: "用戶預測",
    todayMatches: "今日比賽",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
    popularLeagues: "熱門聯賽",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    communityTitle: "Diskusi Pertandingan",
    communitySubtitle: "Bagikan pendapat Anda tentang pertandingan hari ini dengan komunitas",
    totalComments: "Total Komentar",
    todayComments: "Hari Ini",
    activeUsers: "Pengguna Aktif",
    noMatches: "Tidak ada pertandingan untuk tanggal ini",
    comments: "komentar",
    writeComment: "Tulis komentar...",
    reply: "Balas",
    likes: "suka",
    loginToComment: "Masuk untuk berkomentar",
    send: "Kirim",
    cancel: "Batal",
    delete: "Hapus",
    showComments: "Tampilkan Komentar",
    hideComments: "Sembunyikan Komentar",
    noComments: "Belum ada komentar. Jadilah yang pertama berkomentar!",
    yesterday: "Kemarin",
    today: "Hari Ini",
    tomorrow: "Besok",
    globalChat: "Chat Global",
    matchChat: "Chat Pertandingan",
    onlineNow: "online sekarang",
    typeMessage: "Ketik pesan...",
    loginToChat: "Masuk untuk chat",
    closeChat: "Tutup",
    openChat: "Chat",
    liveChat: "Chat Langsung",
    userPredictions: "Prediksi Pengguna",
    makePrediction: "Buat Prediksi",
    predictedScore: "Skor Prediksi",
    winner: "Pemenang",
    analysis: "Analisis",
    yourAnalysis: "Analisis Anda (opsional)...",
    submitPrediction: "Kirim Prediksi",
    updatePrediction: "Perbarui Prediksi",
    noPredictions: "Belum ada prediksi. Jadilah yang pertama memprediksi!",
    loginToPredict: "Masuk untuk membuat prediksi",
    homeWin: "Tuan Rumah",
    draw: "Seri",
    awayWin: "Tamu",
    recentPredictions: "Prediksi Terbaru",
    vs: "vs",
    predicts: "memprediksi",
    predictionSuccess: "Prediksi berhasil dikirim!",
    predictionError: "Gagal mengirim prediksi",
    predictionErrorSetup: "Fitur prediksi belum diaktifkan. Silakan jalankan SQL setup.",
    communityPoll: "Jajak Pendapat Komunitas",
    totalVotes: "suara",
    viewAllPredictions: "Lihat Semua Prediksi",
    communityHub: "Pusat Komunitas",
    welcomeMessage: "Selamat Datang di Komunitas OddsFlow",
    welcomeSubtitle: "Mengobrol, prediksi, dan berbagi dengan penggemar sepak bola",
    enterChat: "Masuk Chat",
    hotDiscussions: "Diskusi Hangat",
    topPredictors: "Prediktor Terbaik",
    featuredMatches: "Pertandingan Unggulan",
    comingSoon: "Segera Hadir",
    liveDiscussion: "Bergabung diskusi langsung dengan penggemar",
    sharePredictions: "Bagikan prediksi pertandingan Anda",
    discussMatches: "Diskusikan pertandingan hari ini",
    viewAll: "Lihat Semua",
    exploreAll: "Jelajahi semua fitur",
    scrollDown: "Gulir ke Bawah",
    latestNews: "Berita sepak bola terbaru",
    // SEO Section
    whatIsCommunity: "Apa itu Komunitas OddsFlow?",
    communityDesc1: "Komunitas OddsFlow adalah pusat utama Anda untuk diskusi sepak bola, prediksi, dan chat real-time dengan penggemar di seluruh dunia.",
    communityDesc2: "Bergabung dengan ribuan penggemar sepak bola yang berbagi wawasan, prediksi pertandingan, dan diskusi langsung tentang Premier League, La Liga, Serie A, Bundesliga, dan lainnya.",
    communityDesc3: "Platform AI kami menyediakan prediksi akurat sementara komunitas menambahkan sentuhan manusia - bagikan analisis Anda, debatkan hasil pertandingan, dan rayakan kemenangan bersama.",
    communityDesc4: "Baik Anda penggemar kasual atau petaruh serius, Komunitas OddsFlow memberi Anda alat dan koneksi untuk meningkatkan pengalaman sepak bola Anda.",
    communityFeature1Title: "Chat Global Langsung",
    communityFeature1Desc: "Mengobrol secara real-time dengan penggemar sepak bola dari seluruh dunia. Diskusikan pertandingan, berbagi tips, dan rayakan gol bersama.",
    communityFeature2Title: "Prediksi Pengguna",
    communityFeature2Desc: "Bagikan prediksi pertandingan Anda dan lihat apa yang dipikirkan komunitas. Lacak akurasi Anda dan bersaing dengan prediktor lain.",
    communityFeature3Title: "Diskusi Pertandingan",
    communityFeature3Desc: "Selami pertandingan tertentu dengan ruang chat khusus. Analisis tim, formasi, dan peluang taruhan.",
    joinCommunityToday: "Bergabung dengan Komunitas Sekarang",
    joinCommunityDesc: "Terhubung dengan ribuan penggemar sepak bola, bagikan prediksi Anda, dan jadilah bagian dari komunitas taruhan sepak bola paling aktif.",
    // Footer
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi lebih cerdas. Buat keputusan berbasis data dengan wawasan real-time.",
    product: "Produk",
    liveOdds: "Performa AI",
    company: "Perusahaan",
    aboutUs: "Tentang Kami",
    blog: "Blog",
    contact: "Kontak",
    legal: "Legal",
    privacyPolicy: "Kebijakan Privasi",
    termsOfService: "Ketentuan Layanan",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Judi melibatkan risiko. Mohon bertaruh secara bertanggung jawab.",
    solution: "Solusi",
    communityFooter: "Komunitas",
    globalChatFooter: "Obrolan Global",
    userPredictionsFooter: "Prediksi Pengguna",
    todayMatches: "Pertandingan Hari Ini",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
    popularLeagues: "Liga Populer",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Empezar",
    communityTitle: "Discusiones de Partidos",
    communitySubtitle: "Comparte tus opiniones sobre los partidos de hoy con la comunidad",
    totalComments: "Total Comentarios",
    todayComments: "Hoy",
    activeUsers: "Usuarios Activos",
    noMatches: "No hay partidos para esta fecha",
    comments: "comentarios",
    writeComment: "Escribe un comentario...",
    reply: "Responder",
    likes: "me gusta",
    loginToComment: "Inicia sesión para comentar",
    send: "Enviar",
    cancel: "Cancelar",
    delete: "Eliminar",
    showComments: "Mostrar Comentarios",
    hideComments: "Ocultar Comentarios",
    noComments: "Aún no hay comentarios. ¡Sé el primero en comentar!",
    yesterday: "Ayer",
    today: "Hoy",
    tomorrow: "Mañana",
    globalChat: "Chat Global",
    matchChat: "Chat del Partido",
    onlineNow: "en línea ahora",
    typeMessage: "Escribe un mensaje...",
    loginToChat: "Inicia sesión para chatear",
    closeChat: "Cerrar",
    openChat: "Chat",
    liveChat: "Chat en Vivo",
    userPredictions: "Predicciones de Usuarios",
    makePrediction: "Hacer Predicción",
    predictedScore: "Marcador Predicho",
    winner: "Ganador",
    analysis: "Análisis",
    yourAnalysis: "Tu análisis (opcional)...",
    submitPrediction: "Enviar Predicción",
    updatePrediction: "Actualizar Predicción",
    noPredictions: "Aún no hay predicciones. ¡Sé el primero en predecir!",
    loginToPredict: "Inicia sesión para predecir",
    homeWin: "Local",
    draw: "Empate",
    awayWin: "Visitante",
    recentPredictions: "Predicciones Recientes",
    vs: "vs",
    predicts: "predice",
    predictionSuccess: "¡Predicción enviada con éxito!",
    predictionError: "Error al enviar la predicción",
    predictionErrorSetup: "Función de predicción no habilitada. Por favor ejecute la configuración SQL.",
    communityPoll: "Encuesta Comunitaria",
    totalVotes: "votos",
    viewAllPredictions: "Ver Todas las Predicciones",
    communityHub: "Centro Comunitario",
    welcomeMessage: "Bienvenido a la Comunidad OddsFlow",
    welcomeSubtitle: "Chatea, predice y comparte con aficionados al fútbol",
    enterChat: "Entrar al Chat",
    hotDiscussions: "Discusiones Populares",
    topPredictors: "Mejores Predictores",
    featuredMatches: "Partidos Destacados",
    comingSoon: "Próximamente",
    liveDiscussion: "Únete a discusiones en vivo con fans",
    sharePredictions: "Comparte tus predicciones",
    discussMatches: "Discute los partidos de hoy",
    viewAll: "Ver Todo",
    exploreAll: "Explorar todas las funciones",
    scrollDown: "Desplazar hacia abajo",
    latestNews: "Últimas noticias de fútbol",
    // SEO Section
    whatIsCommunity: "¿Qué es la Comunidad OddsFlow?",
    communityDesc1: "La Comunidad OddsFlow es tu centro definitivo para discusiones de fútbol, predicciones y chat en tiempo real con aficionados de todo el mundo.",
    communityDesc2: "Únete a miles de entusiastas del fútbol compartiendo insights, predicciones de partidos y discusiones en vivo sobre Premier League, La Liga, Serie A, Bundesliga y más.",
    communityDesc3: "Nuestra plataforma impulsada por IA proporciona predicciones precisas mientras nuestra comunidad añade el elemento humano - comparte tu análisis, debate resultados y celebra victorias juntos.",
    communityDesc4: "Ya seas un aficionado casual o un apostador serio, la Comunidad OddsFlow te da las herramientas y conexiones para mejorar tu experiencia futbolística.",
    communityFeature1Title: "Chat Global en Vivo",
    communityFeature1Desc: "Chatea en tiempo real con aficionados al fútbol de todo el mundo. Discute partidos, comparte consejos y celebra goles juntos.",
    communityFeature2Title: "Predicciones de Usuarios",
    communityFeature2Desc: "Comparte tus predicciones de partidos y mira qué piensa la comunidad. Rastrea tu precisión y compite con otros predictores.",
    communityFeature3Title: "Discusiones de Partidos",
    communityFeature3Desc: "Profundiza en partidos específicos con salas de chat dedicadas. Analiza equipos, formaciones y oportunidades de apuestas.",
    joinCommunityToday: "Únete a la Comunidad Hoy",
    joinCommunityDesc: "Conéctate con miles de aficionados al fútbol, comparte tus predicciones y sé parte de la comunidad de apuestas más activa.",
    // Footer
    footerDesc: "Análisis de cuotas de fútbol impulsado por IA para predicciones más inteligentes. Toma decisiones basadas en datos con insights en tiempo real.",
    product: "Producto",
    liveOdds: "Rendimiento IA",
    company: "Empresa",
    aboutUs: "Sobre Nosotros",
    blog: "Blog",
    contact: "Contacto",
    legal: "Legal",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor, juegue responsablemente.",
    solution: "Solución",
    communityFooter: "Comunidad",
    globalChatFooter: "Chat Global",
    userPredictionsFooter: "Predicciones de Usuarios",
    todayMatches: "Partidos de Hoy",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No se garantizan ganancias. Por favor, apueste de manera responsable.",
    popularLeagues: "Ligas Populares",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    communityTitle: "Discussões de Partidas",
    communitySubtitle: "Compartilhe suas opiniões sobre as partidas de hoje com a comunidade",
    totalComments: "Total de Comentários",
    todayComments: "Hoje",
    activeUsers: "Usuários Ativos",
    noMatches: "Nenhuma partida para esta data",
    comments: "comentários",
    writeComment: "Escreva um comentário...",
    reply: "Responder",
    likes: "curtidas",
    loginToComment: "Entre para comentar",
    send: "Enviar",
    cancel: "Cancelar",
    delete: "Excluir",
    showComments: "Mostrar Comentários",
    hideComments: "Ocultar Comentários",
    noComments: "Ainda não há comentários. Seja o primeiro a comentar!",
    yesterday: "Ontem",
    today: "Hoje",
    tomorrow: "Amanhã",
    globalChat: "Chat Global",
    matchChat: "Chat da Partida",
    onlineNow: "online agora",
    typeMessage: "Digite uma mensagem...",
    loginToChat: "Entre para conversar",
    closeChat: "Fechar",
    openChat: "Chat",
    liveChat: "Chat ao Vivo",
    userPredictions: "Previsões dos Usuários",
    makePrediction: "Fazer Previsão",
    predictedScore: "Placar Previsto",
    winner: "Vencedor",
    analysis: "Análise",
    yourAnalysis: "Sua análise (opcional)...",
    submitPrediction: "Enviar Previsão",
    updatePrediction: "Atualizar Previsão",
    noPredictions: "Ainda não há previsões. Seja o primeiro a prever!",
    loginToPredict: "Entre para fazer previsões",
    homeWin: "Casa",
    draw: "Empate",
    awayWin: "Fora",
    recentPredictions: "Previsões Recentes",
    vs: "vs",
    predicts: "prevê",
    predictionSuccess: "Previsão enviada com sucesso!",
    predictionError: "Falha ao enviar previsão",
    predictionErrorSetup: "Recurso de previsão não ativado. Por favor, execute a configuração SQL.",
    communityPoll: "Enquete da Comunidade",
    totalVotes: "votos",
    viewAllPredictions: "Ver Todas as Previsões",
    communityHub: "Centro da Comunidade",
    welcomeMessage: "Bem-vindo à Comunidade OddsFlow",
    welcomeSubtitle: "Converse, preveja e compartilhe com fãs de futebol",
    enterChat: "Entrar no Chat",
    hotDiscussions: "Discussões Populares",
    topPredictors: "Melhores Preditores",
    featuredMatches: "Partidas em Destaque",
    comingSoon: "Em Breve",
    liveDiscussion: "Participe de discussões ao vivo com fãs",
    sharePredictions: "Compartilhe suas previsões",
    discussMatches: "Discuta as partidas de hoje",
    viewAll: "Ver Tudo",
    exploreAll: "Explorar todos os recursos",
    scrollDown: "Rolar para baixo",
    latestNews: "Últimas notícias de futebol",
    // SEO Section
    whatIsCommunity: "O que é a Comunidade OddsFlow?",
    communityDesc1: "A Comunidade OddsFlow é seu centro definitivo para discussões de futebol, previsões e chat em tempo real com fãs de todo o mundo.",
    communityDesc2: "Junte-se a milhares de entusiastas do futebol compartilhando insights, previsões de partidas e discussões ao vivo sobre Premier League, La Liga, Serie A, Bundesliga e mais.",
    communityDesc3: "Nossa plataforma alimentada por IA fornece previsões precisas enquanto nossa comunidade adiciona o elemento humano - compartilhe sua análise, debata resultados e celebre vitórias juntos.",
    communityDesc4: "Seja você um fã casual ou um apostador sério, a Comunidade OddsFlow oferece as ferramentas e conexões para melhorar sua experiência no futebol.",
    communityFeature1Title: "Chat Global ao Vivo",
    communityFeature1Desc: "Converse em tempo real com fãs de futebol do mundo todo. Discuta partidas, compartilhe dicas e celebre gols juntos.",
    communityFeature2Title: "Previsões de Usuários",
    communityFeature2Desc: "Compartilhe suas previsões de partidas e veja o que a comunidade pensa. Acompanhe sua precisão e compita com outros preditores.",
    communityFeature3Title: "Discussões de Partidas",
    communityFeature3Desc: "Aprofunde-se em partidas específicas com salas de chat dedicadas. Analise times, formações e oportunidades de apostas.",
    joinCommunityToday: "Junte-se à Comunidade Hoje",
    joinCommunityDesc: "Conecte-se com milhares de fãs de futebol, compartilhe suas previsões e faça parte da comunidade de apostas mais ativa.",
    // Footer
    footerDesc: "Análise de odds de futebol alimentada por IA para previsões mais inteligentes. Tome decisões baseadas em dados com insights em tempo real.",
    product: "Produto",
    liveOdds: "Desempenho IA",
    company: "Empresa",
    aboutUs: "Sobre Nós",
    blog: "Blog",
    contact: "Contato",
    legal: "Legal",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor, aposte com responsabilidade.",
    solution: "Solução",
    communityFooter: "Comunidade",
    globalChatFooter: "Chat Global",
    userPredictionsFooter: "Previsoes de Usuarios",
    todayMatches: "Jogos de Hoje",
    disclaimer: "Aviso: OddsFlow fornece previsoes baseadas em IA apenas para fins informativos e de entretenimento. Nao ha garantia de lucros. Por favor, aposte com responsabilidade.",
    popularLeagues: "Ligas Populares",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    communityTitle: "Spiel-Diskussionen",
    communitySubtitle: "Teile deine Meinung zu den heutigen Spielen mit der Community",
    totalComments: "Gesamte Kommentare",
    todayComments: "Heute",
    activeUsers: "Aktive Benutzer",
    noMatches: "Keine Spiele für dieses Datum",
    comments: "Kommentare",
    writeComment: "Kommentar schreiben...",
    reply: "Antworten",
    likes: "Likes",
    loginToComment: "Anmelden zum Kommentieren",
    send: "Senden",
    cancel: "Abbrechen",
    delete: "Löschen",
    showComments: "Kommentare anzeigen",
    hideComments: "Kommentare ausblenden",
    noComments: "Noch keine Kommentare. Sei der Erste!",
    yesterday: "Gestern",
    today: "Heute",
    tomorrow: "Morgen",
    globalChat: "Globaler Chat",
    matchChat: "Spiel-Chat",
    onlineNow: "jetzt online",
    typeMessage: "Nachricht eingeben...",
    loginToChat: "Anmelden zum Chatten",
    closeChat: "Schließen",
    openChat: "Chat",
    liveChat: "Live-Chat",
    userPredictions: "Benutzer-Vorhersagen",
    makePrediction: "Vorhersage machen",
    predictedScore: "Vorhergesagter Spielstand",
    winner: "Gewinner",
    analysis: "Analyse",
    yourAnalysis: "Deine Analyse (optional)...",
    submitPrediction: "Vorhersage senden",
    updatePrediction: "Vorhersage aktualisieren",
    noPredictions: "Noch keine Vorhersagen. Sei der Erste!",
    loginToPredict: "Anmelden um Vorhersagen zu machen",
    homeWin: "Heim",
    draw: "Unentschieden",
    awayWin: "Auswärts",
    recentPredictions: "Aktuelle Vorhersagen",
    vs: "vs",
    predicts: "sagt voraus",
    predictionSuccess: "Vorhersage erfolgreich gesendet!",
    predictionError: "Fehler beim Senden der Vorhersage",
    predictionErrorSetup: "Vorhersagefunktion nicht aktiviert. Bitte SQL-Setup ausführen.",
    communityPoll: "Community-Umfrage",
    totalVotes: "Stimmen",
    viewAllPredictions: "Alle Vorhersagen anzeigen",
    communityHub: "Community-Hub",
    welcomeMessage: "Willkommen in der OddsFlow Community",
    welcomeSubtitle: "Chatte, tippe und teile mit Fußballfans weltweit",
    enterChat: "Chat betreten",
    hotDiscussions: "Aktuelle Diskussionen",
    topPredictors: "Top-Tipper",
    featuredMatches: "Ausgewählte Spiele",
    comingSoon: "Demnächst",
    liveDiscussion: "Live-Diskussionen mit Fans",
    sharePredictions: "Teile deine Vorhersagen",
    discussMatches: "Diskutiere heutige Spiele",
    viewAll: "Alle anzeigen",
    exploreAll: "Alle Funktionen erkunden",
    scrollDown: "Nach unten scrollen",
    latestNews: "Neueste Fußballnachrichten",
    // SEO Section
    whatIsCommunity: "Was ist die OddsFlow Community?",
    communityDesc1: "Die OddsFlow Community ist Ihr ultimativer Hub für Fußballdiskussionen, Vorhersagen und Echtzeit-Chat mit Fans weltweit.",
    communityDesc2: "Schließen Sie sich Tausenden von Fußballbegeisterten an, die Einblicke, Spielvorhersagen und Live-Diskussionen über Premier League, La Liga, Serie A, Bundesliga und mehr teilen.",
    communityDesc3: "Unsere KI-gestützte Plattform liefert präzise Vorhersagen, während unsere Community das menschliche Element hinzufügt - teilen Sie Ihre Analyse, debattieren Sie Spielergebnisse und feiern Sie gemeinsam Siege.",
    communityDesc4: "Ob Gelegenheitsfan oder ernsthafter Wetter, die OddsFlow Community bietet Ihnen die Tools und Verbindungen, um Ihr Fußballerlebnis zu verbessern.",
    communityFeature1Title: "Globaler Live-Chat",
    communityFeature1Desc: "Chatten Sie in Echtzeit mit Fußballfans aus aller Welt. Diskutieren Sie Spiele, teilen Sie Tipps und feiern Sie gemeinsam Tore.",
    communityFeature2Title: "Benutzer-Vorhersagen",
    communityFeature2Desc: "Teilen Sie Ihre Spielvorhersagen und sehen Sie, was die Community denkt. Verfolgen Sie Ihre Genauigkeit und konkurrieren Sie mit anderen Tippern.",
    communityFeature3Title: "Spiel-Diskussionen",
    communityFeature3Desc: "Tauchen Sie in spezifische Spiele mit dedizierten Chaträumen ein. Analysieren Sie Teams, Formationen und Wettmöglichkeiten.",
    joinCommunityToday: "Treten Sie der Community heute bei",
    joinCommunityDesc: "Verbinden Sie sich mit Tausenden von Fußballfans, teilen Sie Ihre Vorhersagen und werden Sie Teil der aktivsten Wett-Community.",
    // Footer
    footerDesc: "KI-gestützte Fußball-Quotenanalyse für intelligentere Vorhersagen. Treffen Sie datengestützte Entscheidungen mit Echtzeit-Einblicken.",
    product: "Produkt",
    liveOdds: "KI-Leistung",
    company: "Unternehmen",
    aboutUs: "Über uns",
    blog: "Blog",
    contact: "Kontakt",
    legal: "Rechtliches",
    privacyPolicy: "Datenschutz",
    termsOfService: "Nutzungsbedingungen",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    solution: "Lösung",
    communityFooter: "Community",
    globalChatFooter: "Globaler Chat",
    userPredictionsFooter: "Benutzer-Vorhersagen",
    todayMatches: "Heutige Spiele",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestutzte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Es werden keine Gewinne garantiert. Bitte wetten Sie verantwortungsvoll.",
    popularLeagues: "Beliebte Ligen",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    communityTitle: "Discussions des Matchs",
    communitySubtitle: "Partagez vos avis sur les matchs d'aujourd'hui avec la communauté",
    totalComments: "Total Commentaires",
    todayComments: "Aujourd'hui",
    activeUsers: "Utilisateurs Actifs",
    noMatches: "Pas de matchs pour cette date",
    comments: "commentaires",
    writeComment: "Écrire un commentaire...",
    reply: "Répondre",
    likes: "j'aime",
    loginToComment: "Connectez-vous pour commenter",
    send: "Envoyer",
    cancel: "Annuler",
    delete: "Supprimer",
    showComments: "Afficher Commentaires",
    hideComments: "Masquer Commentaires",
    noComments: "Pas encore de commentaires. Soyez le premier!",
    yesterday: "Hier",
    today: "Aujourd'hui",
    tomorrow: "Demain",
    globalChat: "Chat Global",
    matchChat: "Chat du Match",
    onlineNow: "en ligne",
    typeMessage: "Tapez un message...",
    loginToChat: "Connectez-vous pour chatter",
    closeChat: "Fermer",
    openChat: "Chat",
    liveChat: "Chat en Direct",
    userPredictions: "Prédictions Utilisateurs",
    makePrediction: "Faire une Prédiction",
    predictedScore: "Score Prédit",
    winner: "Gagnant",
    analysis: "Analyse",
    yourAnalysis: "Votre analyse (optionnel)...",
    submitPrediction: "Soumettre Prédiction",
    updatePrediction: "Mettre à jour Prédiction",
    noPredictions: "Pas encore de prédictions. Soyez le premier!",
    loginToPredict: "Connectez-vous pour prédire",
    homeWin: "Domicile",
    draw: "Nul",
    awayWin: "Extérieur",
    recentPredictions: "Prédictions Récentes",
    vs: "vs",
    predicts: "prédit",
    predictionSuccess: "Prédiction soumise avec succès!",
    predictionError: "Échec de l'envoi de la prédiction",
    predictionErrorSetup: "Fonction de prédiction non activée. Veuillez exécuter la configuration SQL.",
    communityPoll: "Sondage Communautaire",
    totalVotes: "votes",
    viewAllPredictions: "Voir Toutes les Prédictions",
    communityHub: "Centre Communautaire",
    welcomeMessage: "Bienvenue dans la Communauté OddsFlow",
    welcomeSubtitle: "Discutez, prédisez et partagez avec les fans de football",
    enterChat: "Entrer dans le Chat",
    hotDiscussions: "Discussions Populaires",
    topPredictors: "Meilleurs Prédicteurs",
    featuredMatches: "Matchs en Vedette",
    comingSoon: "Bientôt Disponible",
    liveDiscussion: "Rejoignez les discussions en direct",
    sharePredictions: "Partagez vos prédictions",
    discussMatches: "Discutez des matchs du jour",
    viewAll: "Voir Tout",
    exploreAll: "Explorer toutes les fonctionnalités",
    scrollDown: "Défiler vers le bas",
    latestNews: "Dernières actualités football",
    // SEO Section
    whatIsCommunity: "Qu'est-ce que la Communauté OddsFlow ?",
    communityDesc1: "La Communauté OddsFlow est votre hub ultime pour les discussions football, les prédictions et le chat en temps réel avec des fans du monde entier.",
    communityDesc2: "Rejoignez des milliers de passionnés de football partageant des insights, des prédictions de matchs et des discussions en direct sur Premier League, La Liga, Serie A, Bundesliga et plus.",
    communityDesc3: "Notre plateforme alimentée par l'IA fournit des prédictions précises tandis que notre communauté ajoute l'élément humain - partagez votre analyse, débattez des résultats et célébrez les victoires ensemble.",
    communityDesc4: "Que vous soyez un fan occasionnel ou un parieur sérieux, la Communauté OddsFlow vous offre les outils et les connexions pour améliorer votre expérience football.",
    communityFeature1Title: "Chat Global en Direct",
    communityFeature1Desc: "Discutez en temps réel avec des fans de football du monde entier. Débattez des matchs, partagez des conseils et célébrez les buts ensemble.",
    communityFeature2Title: "Prédictions Utilisateurs",
    communityFeature2Desc: "Partagez vos prédictions de matchs et voyez ce que pense la communauté. Suivez votre précision et rivalisez avec d'autres prédicteurs.",
    communityFeature3Title: "Discussions de Matchs",
    communityFeature3Desc: "Plongez dans des matchs spécifiques avec des salons de chat dédiés. Analysez les équipes, les formations et les opportunités de paris.",
    joinCommunityToday: "Rejoignez la Communauté Aujourd'hui",
    joinCommunityDesc: "Connectez-vous avec des milliers de fans de football, partagez vos prédictions et faites partie de la communauté de paris la plus active.",
    // Footer
    footerDesc: "Analyse des cotes de football alimentée par l'IA pour des prédictions plus intelligentes. Prenez des décisions basées sur les données avec des insights en temps réel.",
    product: "Produit",
    liveOdds: "Performance IA",
    company: "Entreprise",
    aboutUs: "À propos",
    blog: "Blog",
    contact: "Contact",
    legal: "Légal",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    allRightsReserved: "Tous droits réservés.",
    gamblingWarning: "Les jeux d'argent comportent des risques. Veuillez jouer de manière responsable.",
    solution: "Solution",
    communityFooter: "Communaute",
    globalChatFooter: "Chat Global",
    userPredictionsFooter: "Predictions Utilisateurs",
    todayMatches: "Matchs du Jour",
    disclaimer: "Avertissement : OddsFlow fournit des predictions basees sur l'IA a des fins d'information et de divertissement uniquement. Aucun profit n'est garanti. Veuillez parier de maniere responsable.",
    popularLeagues: "Ligues Populaires",
  },
  JA: {
    home: "ホーム", predictions: "予想", leagues: "リーグ", performance: "AI性能",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    communityTitle: "試合ディスカッション",
    communitySubtitle: "今日の試合についてコミュニティと意見を共有しましょう",
    totalComments: "総コメント数",
    todayComments: "今日",
    activeUsers: "アクティブユーザー",
    noMatches: "この日付の試合はありません",
    comments: "コメント",
    writeComment: "コメントを書く...",
    reply: "返信",
    likes: "いいね",
    loginToComment: "ログインしてコメント",
    send: "送信",
    cancel: "キャンセル",
    delete: "削除",
    showComments: "コメントを表示",
    hideComments: "コメントを非表示",
    noComments: "まだコメントはありません。最初の投稿者になりましょう！",
    yesterday: "昨日",
    today: "今日",
    tomorrow: "明日",
    globalChat: "グローバルチャット",
    matchChat: "試合チャット",
    onlineNow: "オンライン",
    typeMessage: "メッセージを入力...",
    loginToChat: "ログインしてチャット",
    closeChat: "閉じる",
    openChat: "チャット",
    liveChat: "ライブチャット",
    userPredictions: "ユーザー予想",
    makePrediction: "予想する",
    predictedScore: "予想スコア",
    winner: "勝者",
    analysis: "分析",
    yourAnalysis: "あなたの分析（任意）...",
    submitPrediction: "予想を送信",
    updatePrediction: "予想を更新",
    noPredictions: "まだ予想はありません。最初の予想者になりましょう！",
    loginToPredict: "ログインして予想",
    homeWin: "ホーム",
    draw: "引き分け",
    awayWin: "アウェイ",
    recentPredictions: "最近の予想",
    vs: "vs",
    predicts: "が予想",
    predictionSuccess: "予想が正常に送信されました！",
    predictionError: "予想の送信に失敗しました",
    predictionErrorSetup: "予想機能が有効ではありません。SQLセットアップを実行してください。",
    communityPoll: "コミュニティ投票",
    totalVotes: "票",
    viewAllPredictions: "すべての予想を見る",
    communityHub: "コミュニティハブ",
    welcomeMessage: "OddsFlowコミュニティへようこそ",
    welcomeSubtitle: "世界中のサッカーファンとチャット、予想、共有",
    enterChat: "チャットに参加",
    hotDiscussions: "人気の議論",
    topPredictors: "トッププレディクター",
    featuredMatches: "注目の試合",
    comingSoon: "近日公開",
    liveDiscussion: "ファンとのライブ議論に参加",
    sharePredictions: "予想を共有",
    discussMatches: "今日の試合を議論",
    viewAll: "すべて見る",
    exploreAll: "すべての機能を探索",
    scrollDown: "下にスクロール",
    latestNews: "最新のサッカーニュース",
    // SEO Section
    whatIsCommunity: "OddsFlowコミュニティとは？",
    communityDesc1: "OddsFlowコミュニティは、世界中のファンとサッカー討論、予想、リアルタイムチャットを行うための究極のハブです。",
    communityDesc2: "プレミアリーグ、ラ・リーガ、セリエA、ブンデスリーガなどについて、洞察、試合予想、ライブ議論を共有する何千人ものサッカーファンに参加しましょう。",
    communityDesc3: "私たちのAI搭載プラットフォームは正確な予想を提供し、コミュニティが人間的要素を追加します - 分析を共有し、試合結果を議論し、一緒に勝利を祝いましょう。",
    communityDesc4: "カジュアルファンでも真剣なベッターでも、OddsFlowコミュニティはサッカー体験を向上させるツールとつながりを提供します。",
    communityFeature1Title: "グローバルライブチャット",
    communityFeature1Desc: "世界中のサッカーファンとリアルタイムでチャット。試合を議論し、ヒントを共有し、一緒にゴールを祝いましょう。",
    communityFeature2Title: "ユーザー予想",
    communityFeature2Desc: "試合予想を共有し、コミュニティの意見を見ましょう。精度を追跡し、他の予想者と競争しましょう。",
    communityFeature3Title: "試合ディスカッション",
    communityFeature3Desc: "専用チャットルームで特定の試合を深く掘り下げましょう。チーム、フォーメーション、ベッティング機会を分析。",
    joinCommunityToday: "今日コミュニティに参加",
    joinCommunityDesc: "何千人ものサッカーファンとつながり、予想を共有し、最もアクティブなベッティングコミュニティの一員になりましょう。",
    // Footer
    footerDesc: "よりスマートな予想のためのAI搭載サッカーオッズ分析。リアルタイムの洞察でデータ駆動型の決定を。",
    product: "製品",
    liveOdds: "AI性能",
    company: "会社",
    aboutUs: "会社概要",
    blog: "ブログ",
    contact: "お問い合わせ",
    legal: "法的情報",
    privacyPolicy: "プライバシーポリシー",
    termsOfService: "利用規約",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
    solution: "ソリューション",
    communityFooter: "コミュニティ",
    globalChatFooter: "グローバルチャット",
    userPredictionsFooter: "ユーザー予測",
    todayMatches: "今日の試合",
    disclaimer: "免責事項：OddsFlowはAI駆動の予測を情報および娯楽目的のみで提供しています。利益を保証するものではありません。責任を持ってお楽しみください。",
    popularLeagues: "人気リーグ",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성능",
    community: "커뮤니티", news: "뉴스", pricing: "요금", login: "로그인", getStarted: "시작하기",
    communityTitle: "경기 토론",
    communitySubtitle: "오늘의 경기에 대한 의견을 커뮤니티와 공유하세요",
    totalComments: "총 댓글",
    todayComments: "오늘",
    activeUsers: "활성 사용자",
    noMatches: "이 날짜에 경기가 없습니다",
    comments: "댓글",
    writeComment: "댓글 작성...",
    reply: "답글",
    likes: "좋아요",
    loginToComment: "로그인하여 댓글",
    send: "보내기",
    cancel: "취소",
    delete: "삭제",
    showComments: "댓글 보기",
    hideComments: "댓글 숨기기",
    noComments: "아직 댓글이 없습니다. 첫 번째 댓글을 작성하세요!",
    yesterday: "어제",
    today: "오늘",
    tomorrow: "내일",
    globalChat: "글로벌 채팅",
    matchChat: "경기 채팅",
    onlineNow: "온라인",
    typeMessage: "메시지 입력...",
    loginToChat: "로그인하여 채팅",
    closeChat: "닫기",
    openChat: "채팅",
    liveChat: "실시간 채팅",
    userPredictions: "사용자 예측",
    makePrediction: "예측하기",
    predictedScore: "예측 스코어",
    winner: "승자",
    analysis: "분석",
    yourAnalysis: "분석 (선택사항)...",
    submitPrediction: "예측 제출",
    updatePrediction: "예측 업데이트",
    noPredictions: "아직 예측이 없습니다. 첫 번째 예측자가 되세요!",
    loginToPredict: "로그인하여 예측",
    homeWin: "홈",
    draw: "무승부",
    awayWin: "원정",
    recentPredictions: "최근 예측",
    vs: "vs",
    predicts: "예측",
    predictionSuccess: "예측이 성공적으로 제출되었습니다!",
    predictionError: "예측 제출 실패",
    predictionErrorSetup: "예측 기능이 활성화되지 않았습니다. SQL 설정을 실행해주세요.",
    communityPoll: "커뮤니티 투표",
    totalVotes: "표",
    viewAllPredictions: "모든 예측 보기",
    communityHub: "커뮤니티 허브",
    welcomeMessage: "OddsFlow 커뮤니티에 오신 것을 환영합니다",
    welcomeSubtitle: "전 세계 축구 팬들과 채팅, 예측, 공유하세요",
    enterChat: "채팅 입장",
    hotDiscussions: "인기 토론",
    topPredictors: "최고 예측가",
    featuredMatches: "추천 경기",
    comingSoon: "곧 출시",
    liveDiscussion: "팬들과 실시간 토론 참여",
    sharePredictions: "예측을 공유하세요",
    discussMatches: "오늘의 경기를 토론하세요",
    viewAll: "모두 보기",
    exploreAll: "모든 기능 탐색",
    scrollDown: "아래로 스크롤",
    latestNews: "최신 축구 뉴스",
    // SEO Section
    whatIsCommunity: "OddsFlow 커뮤니티란?",
    communityDesc1: "OddsFlow 커뮤니티는 전 세계 팬들과 축구 토론, 예측, 실시간 채팅을 위한 궁극의 허브입니다.",
    communityDesc2: "프리미어리그, 라리가, 세리에A, 분데스리가 등에 대한 인사이트, 경기 예측, 라이브 토론을 공유하는 수천 명의 축구 팬에 합류하세요.",
    communityDesc3: "AI 기반 플랫폼이 정확한 예측을 제공하고 커뮤니티가 인간적 요소를 추가합니다 - 분석을 공유하고, 경기 결과를 토론하고, 함께 승리를 축하하세요.",
    communityDesc4: "캐주얼 팬이든 진지한 베터든, OddsFlow 커뮤니티는 축구 경험을 향상시키는 도구와 연결을 제공합니다.",
    communityFeature1Title: "글로벌 실시간 채팅",
    communityFeature1Desc: "전 세계 축구 팬들과 실시간으로 채팅하세요. 경기를 토론하고, 팁을 공유하고, 함께 골을 축하하세요.",
    communityFeature2Title: "사용자 예측",
    communityFeature2Desc: "경기 예측을 공유하고 커뮤니티의 의견을 확인하세요. 정확도를 추적하고 다른 예측가와 경쟁하세요.",
    communityFeature3Title: "경기 토론",
    communityFeature3Desc: "전용 채팅룸에서 특정 경기를 심층 분석하세요. 팀, 포메이션, 베팅 기회를 분석하세요.",
    joinCommunityToday: "오늘 커뮤니티에 가입하세요",
    joinCommunityDesc: "수천 명의 축구 팬과 연결하고, 예측을 공유하고, 가장 활발한 베팅 커뮤니티의 일원이 되세요.",
    // Footer
    footerDesc: "더 스마트한 예측을 위한 AI 기반 축구 배당률 분석. 실시간 인사이트로 데이터 기반 결정을 내리세요.",
    product: "제품",
    liveOdds: "AI 성능",
    company: "회사",
    aboutUs: "회사 소개",
    blog: "블로그",
    contact: "문의",
    legal: "법적 고지",
    privacyPolicy: "개인정보 처리방침",
    termsOfService: "이용약관",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
    solution: "솔루션",
    communityFooter: "커뮤니티",
    globalChatFooter: "글로벌 채팅",
    userPredictionsFooter: "사용자 예측",
    todayMatches: "오늘의 경기",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다. 수익을 보장하지 않습니다. 책임감 있게 베팅하세요.",
    popularLeagues: "인기 리그",
  },
};

// Helper function to get UTC today
function getUTCToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// Helper to format time ago
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Format chat time
function formatChatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

// Chat Component
function ChatRoom({
  fixtureId,
  user,
  t,
  matchInfo,
  onClose
}: {
  fixtureId: number | null;
  user: User | null;
  t: (key: string) => string;
  matchInfo?: { home: string; away: string; league: string };
  onClose?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState(0);
  const [reactions, setReactions] = useState<Record<string, ChatReaction[]>>({});
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Available reactions
  const reactionTypes = [
    { type: 'like', emoji: '👍' },
    { type: 'love', emoji: '❤️' },
    { type: 'haha', emoji: '😂' },
    { type: 'wow', emoji: '😮' },
    { type: 'sad', emoji: '😢' },
    { type: 'angry', emoji: '😡' },
  ];

  // Emoji categories for chat
  const emojiCategories = [
    {
      name: 'Faces',
      emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😜', '🤪', '😎', '🤩', '🥳', '😏', '😒', '🙄', '😬', '😌', '😔', '😢', '😭', '😤', '😠', '🤬', '😱', '😨', '😰', '🤔', '🤫', '🤭', '🥱', '😴', '🤤']
    },
    {
      name: 'Gestures',
      emojis: ['👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤝', '🙏', '✌️', '🤞', '🤟', '🤘', '👌', '🤌', '👈', '👉', '👆', '👇', '☝️', '💪', '🦾', '🖐️', '✋', '👋', '🤚', '🖖']
    },
    {
      name: 'Sports',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '⛳', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎯', '🎮', '🎰', '🎲']
    },
    {
      name: 'Money',
      emojis: ['💰', '💵', '💴', '💶', '💷', '💸', '💳', '🪙', '📈', '📉', '📊', '💹', '🤑', '💎', '🏦', '💲']
    },
    {
      name: 'Hearts',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '♥️']
    },
    {
      name: 'Objects',
      emojis: ['🔥', '⭐', '✨', '💫', '🌟', '⚡', '💥', '🎉', '🎊', '🎁', '🏠', '🚀', '✈️', '🚗', '⏰', '📱', '💻', '🔔', '📢', '🔒', '🔑', '💡', '📌', '✅', '❌', '⚠️', '❓', '❗', '💯', '🆒', '🆕', '🆓']
    },
  ];

  const insertEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
    // Keep emoji picker open, don't close
  };

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      const { data } = await getChatMessages(fixtureId ? String(fixtureId) : null, 100);
      if (data) {
        setMessages(data);
      }
      setLoading(false);
    };
    loadMessages();
  }, [fixtureId]);

  // Subscribe to real-time messages with fallback polling
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;
    let isRealtimeConnected = false;

    const channel = subscribeToChatMessages(
      fixtureId ? String(fixtureId) : null,
      (newMessage) => {
        // Only add if not already in the list (avoid duplicates from optimistic updates)
        setMessages(prev => {
          const exists = prev.some(m => m.id === newMessage.id);
          if (exists) return prev;
          // Also remove any temp message with same content from same user
          const filtered = prev.filter(m =>
            !(m.id.startsWith('temp-') && m.sender_name === newMessage.sender_name && m.content === newMessage.content)
          );
          return [...filtered, newMessage];
        });
      },
      (status) => {
        isRealtimeConnected = status === 'SUBSCRIBED';
        // If realtime fails, start polling
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          if (!pollingInterval) {
            pollingInterval = setInterval(async () => {
              const { data } = await getChatMessages(fixtureId ? String(fixtureId) : null, 100);
              if (data) {
                setMessages(data);
              }
            }, 3000); // Poll every 3 seconds
          }
        }
      }
    );

    // Fallback: always poll every 5 seconds as backup
    const backupPolling = setInterval(async () => {
      if (!isRealtimeConnected) {
        const { data } = await getChatMessages(fixtureId ? String(fixtureId) : null, 100);
        if (data) {
          setMessages(prev => {
            // Merge new messages without duplicates
            const newIds = new Set(data.map((m: ChatMessage) => m.id));
            const oldMessages = prev.filter((m: ChatMessage) => m.id.startsWith('temp-') || !newIds.has(m.id));
            return [...data, ...oldMessages.filter((m: ChatMessage) => m.id.startsWith('temp-'))];
          });
        }
      }
    }, 5000);

    return () => {
      if (channel) {
        chatSupabase.removeChannel(channel);
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      clearInterval(backupPolling);
    };
  }, [fixtureId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load reactions when messages change
  useEffect(() => {
    const loadReactions = async () => {
      const messageIds = messages.filter(m => !m.id.startsWith('temp-')).map(m => m.id);
      if (messageIds.length > 0) {
        const { data } = await getMessageReactions(messageIds);
        if (data) {
          setReactions(data);
        }
      }
    };
    loadReactions();
  }, [messages]);

  // Handle reaction
  const handleReaction = async (messageId: string, reactionType: string) => {
    if (!user || messageId.startsWith('temp-')) return;

    // Optimistic update
    setReactions(prev => {
      const messageReactions = prev[messageId] || [];
      const existingIndex = messageReactions.findIndex(r => r.user_id === user.id);

      if (existingIndex >= 0) {
        if (messageReactions[existingIndex].reaction_type === reactionType) {
          // Remove reaction
          return {
            ...prev,
            [messageId]: messageReactions.filter((_, i) => i !== existingIndex)
          };
        } else {
          // Update reaction
          const updated = [...messageReactions];
          updated[existingIndex] = { ...updated[existingIndex], reaction_type: reactionType };
          return { ...prev, [messageId]: updated };
        }
      } else {
        // Add new reaction
        return {
          ...prev,
          [messageId]: [...messageReactions, {
            id: `temp-${Date.now()}`,
            message_id: messageId,
            user_id: user.id,
            reaction_type: reactionType,
            created_at: new Date().toISOString()
          }]
        };
      }
    });

    setShowReactionPicker(null);
    await toggleMessageReaction(messageId, user.id, reactionType);
  };

  // Get reaction summary for a message
  const getReactionSummary = (messageId: string) => {
    const messageReactions = reactions[messageId] || [];
    const summary: Record<string, { count: number; hasUser: boolean }> = {};

    messageReactions.forEach(r => {
      if (!summary[r.reaction_type]) {
        summary[r.reaction_type] = { count: 0, hasUser: false };
      }
      summary[r.reaction_type].count++;
      if (user && r.user_id === user.id) {
        summary[r.reaction_type].hasUser = true;
      }
    });

    return summary;
  };

  const handleSend = async () => {
    if (!user || !input.trim()) return;

    const content = input.trim();
    const senderName = user.user_metadata?.full_name || user.email?.split('@')[0] || `User${user.id.substring(0, 4)}`;
    setInput('');

    // Optimistic update - show message immediately
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      match_id: fixtureId ? String(fixtureId) : null,
      sender_name: senderName,
      content: content,
      role: 'user',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMessage]);

    // Send to database - pass sender_name and match_id as string
    const { data, error } = await sendChatMessage(senderName, content, fixtureId ? String(fixtureId) : null);

    if (error) {
      // Remove optimistic message if failed
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      console.error('Failed to send message:', error);
    } else if (data) {
      // Replace optimistic message with real one
      setMessages(prev => prev.map(m => m.id === optimisticMessage.id ? data : m));
    }
  };

  const getUserDisplay = (message: ChatMessage) => {
    const currentUserName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
    const isMe = message.sender_name === currentUserName;

    return {
      name: message.sender_name || 'Anonymous',
      avatar: isMe ? (user?.user_metadata?.avatar_url || user?.user_metadata?.picture) : null,
      isMe: isMe,
    };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-white">
            {fixtureId === null ? t('globalChat') : matchInfo ? `${matchInfo.home} vs ${matchInfo.away}` : t('matchChat')}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            {t('liveChat')} - Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const userDisplay = getUserDisplay(message);
            const reactionSummary = getReactionSummary(message.id);
            const hasReactions = Object.keys(reactionSummary).length > 0;

            return (
              <div key={message.id} className={`group flex gap-2 ${userDisplay.isMe ? 'flex-row-reverse' : ''}`}>
                {userDisplay.avatar ? (
                  <img src={userDisplay.avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0" />
                ) : (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${userDisplay.isMe ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-white'}`}>
                    {userDisplay.name[0].toUpperCase()}
                  </div>
                )}
                <div className={`max-w-[75%] ${userDisplay.isMe ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 mb-0.5 ${userDisplay.isMe ? 'justify-end' : ''}`}>
                    <span className="text-xs font-medium text-gray-400">{userDisplay.name}</span>
                    <span className="text-xs text-gray-600">{formatChatTime(message.created_at)}</span>
                  </div>

                  {/* Message bubble with reactions */}
                  <div className="relative inline-block">
                    <div className={`inline-flex items-end gap-1 px-3 py-2 rounded-xl text-sm ${userDisplay.isMe ? 'bg-emerald-500/20 text-emerald-100' : 'bg-white/10 text-gray-200'}`}>
                      <span className="whitespace-pre-wrap break-words">{message.content}</span>
                      {userDisplay.isMe && (
                        <span className="flex-shrink-0 ml-1">
                          {message.id.startsWith('temp-') ? (
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Reaction display */}
                    {hasReactions && (
                      <div className={`flex gap-0.5 mt-1 ${userDisplay.isMe ? 'justify-end' : 'justify-start'}`}>
                        {Object.entries(reactionSummary).map(([type, data]) => {
                          const reactionEmoji = reactionTypes.find(r => r.type === type)?.emoji || '👍';
                          return (
                            <button
                              key={type}
                              onClick={() => handleReaction(message.id, type)}
                              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs cursor-pointer transition-colors ${
                                data.hasUser
                                  ? 'bg-emerald-500/30 border border-emerald-500/50'
                                  : 'bg-white/10 border border-white/10 hover:bg-white/20'
                              }`}
                            >
                              <span>{reactionEmoji}</span>
                              {data.count > 1 && <span className="text-gray-300">{data.count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Reaction picker trigger - shows on hover */}
                    {user && !message.id.startsWith('temp-') && (
                      <div className={`absolute top-0 ${userDisplay.isMe ? 'left-0 -translate-x-full pr-1' : 'right-0 translate-x-full pl-1'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <button
                          onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                          className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Reaction picker popup */}
                    {showReactionPicker === message.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowReactionPicker(null)} />
                        <div className={`absolute z-20 ${userDisplay.isMe ? 'right-0' : 'left-0'} bottom-full mb-1 flex gap-1 p-1.5 bg-gray-800 border border-white/10 rounded-full shadow-xl`}>
                          {reactionTypes.map(({ type, emoji }) => (
                            <button
                              key={type}
                              onClick={() => handleReaction(message.id, type)}
                              className="p-1.5 text-lg hover:bg-white/10 rounded-full transition-transform hover:scale-125 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 relative">
        {/* Emoji Picker */}
        {showEmojis && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowEmojis(false)} />
            <div className="absolute bottom-full left-0 right-0 mb-2 mx-3 bg-gray-800 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
              {/* Category Tabs */}
              <div className="flex border-b border-white/10 overflow-x-auto">
                {emojiCategories.map((cat, i) => (
                  <button
                    key={cat.name}
                    onClick={() => setEmojiCategory(i)}
                    className={`px-3 py-2 text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      emojiCategory === i
                        ? 'text-emerald-400 border-b-2 border-emerald-400 bg-white/5'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {/* Emojis Grid */}
              <div className="p-2 max-h-[200px] overflow-y-auto">
                <div className="grid grid-cols-8 gap-1">
                  {emojiCategories[emojiCategory].emojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => insertEmoji(emoji)}
                      className="p-2 text-xl hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {user ? (
          <div className="flex gap-2">
            {/* Emoji Button */}
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className={`px-3 py-2 rounded-lg border transition-all cursor-pointer ${showEmojis ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('typeMessage')}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50 resize-none min-h-[40px] max-h-[120px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        ) : (
          <Link href="/login" className="block w-full py-2 text-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all text-sm">
            {t('loginToChat')}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(getUTCToday());
  const [matches, setMatches] = useState<Prematch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatches, setExpandedMatches] = useState<Set<number>>(new Set());
  const [matchComments, setMatchComments] = useState<Record<number, MatchComment[]>>({});
  const [loadingComments, setLoadingComments] = useState<Set<number>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalComments: 0, todayComments: 0, activeUsers: 0 });
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'matches' | 'predictions'>('home');
  const [matchChatOpen, setMatchChatOpen] = useState<number | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReaction[]>>({});
  const [activeReactionPicker, setActiveReactionPicker] = useState<string | null>(null);
  // Predictions state
  const [predictionModalMatch, setPredictionModalMatch] = useState<Prematch | null>(null);
  const [matchPredictions, setMatchPredictions] = useState<Record<number, UserMatchPrediction[]>>({});
  const [recentPredictions, setRecentPredictionsList] = useState<UserMatchPrediction[]>([]);
  const [predictionForm, setPredictionForm] = useState<{
    homeScore: string;
    awayScore: string;
    winner: '1' | 'X' | '2' | null;
    analysis: string;
  }>({ homeScore: '', awayScore: '', winner: null, analysis: '' });
  const [submittingPrediction, setSubmittingPrediction] = useState(false);
  const [expandedPredictions, setExpandedPredictions] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const COMMENT_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  // Generate date options (yesterday, today, tomorrow, +4 more days)
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(getUTCToday());
    date.setUTCDate(date.getUTCDate() + i - 2);
    return date;
  });

  // Auth check
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

  // Load language
  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setSelectedLang(savedLang);
  }, []);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      const { data } = await getCommentStats();
      if (data) setStats(data);
    };
    loadStats();
  }, []);

  // Fetch matches for selected date
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const nextDate = new Date(selectedDate);
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
      const nextDateStr = nextDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('prematches')
        .select('*')
        .gte('start_date_msia', dateStr)
        .lt('start_date_msia', nextDateStr)
        .order('start_date_msia', { ascending: true });

      if (!error && data) {
        setMatches(data);

        // Load comment counts for all matches
        const fixtureIds = data.map((m: Prematch) => m.fixture_id);
        if (fixtureIds.length > 0) {
          const { data: countData, error: countError } = await supabase
            .from('match_comments')
            .select('fixture_id')
            .in('fixture_id', fixtureIds);

          if (!countError && countData) {
            const counts: Record<number, number> = {};
            countData.forEach((c: { fixture_id: number }) => {
              counts[c.fixture_id] = (counts[c.fixture_id] || 0) + 1;
            });
            setCommentCounts(counts);
          }
        }
      }
      setLoading(false);
    };
    fetchMatches();
  }, [selectedDate]);

  // Load comments for a match
  const loadComments = async (fixtureId: number) => {
    setLoadingComments(prev => new Set(prev).add(fixtureId));
    const { data } = await getMatchComments(fixtureId, user?.id);
    if (data) {
      setMatchComments(prev => ({ ...prev, [fixtureId]: data }));
      // Load reactions for all comments and replies
      const allCommentIds: string[] = [];
      data.forEach((comment: MatchComment) => {
        allCommentIds.push(comment.id);
        if (comment.replies) {
          comment.replies.forEach((reply: MatchComment) => allCommentIds.push(reply.id));
        }
      });
      if (allCommentIds.length > 0) {
        const { data: reactionsData } = await getCommentReactions(allCommentIds);
        if (reactionsData) {
          setCommentReactions(prev => ({ ...prev, ...reactionsData }));
        }
      }
    }
    setLoadingComments(prev => {
      const newSet = new Set(prev);
      newSet.delete(fixtureId);
      return newSet;
    });
  };

  // Toggle expand match comments
  const toggleExpand = async (fixtureId: number) => {
    const newExpanded = new Set(expandedMatches);
    if (newExpanded.has(fixtureId)) {
      newExpanded.delete(fixtureId);
    } else {
      newExpanded.add(fixtureId);
      if (!matchComments[fixtureId]) {
        await loadComments(fixtureId);
      }
    }
    setExpandedMatches(newExpanded);
  };

  // Submit comment
  const handleSubmitComment = async (fixtureId: number) => {
    if (!user || !commentInputs[fixtureId]?.trim()) return;

    const { data } = await addComment(fixtureId, user.id, commentInputs[fixtureId].trim());
    if (data) {
      setCommentInputs(prev => ({ ...prev, [fixtureId]: '' }));
      await loadComments(fixtureId);
      setStats(prev => ({ ...prev, totalComments: prev.totalComments + 1, todayComments: prev.todayComments + 1 }));
      setCommentCounts(prev => ({ ...prev, [fixtureId]: (prev[fixtureId] || 0) + 1 }));
    }
  };

  // Submit reply
  const handleSubmitReply = async (fixtureId: number, parentId: string) => {
    if (!user || !replyInputs[parentId]?.trim()) return;

    const { data } = await addComment(fixtureId, user.id, replyInputs[parentId].trim(), parentId);
    if (data) {
      setReplyInputs(prev => ({ ...prev, [parentId]: '' }));
      setReplyingTo(null);
      await loadComments(fixtureId);
      setStats(prev => ({ ...prev, totalComments: prev.totalComments + 1, todayComments: prev.todayComments + 1 }));
      setCommentCounts(prev => ({ ...prev, [fixtureId]: (prev[fixtureId] || 0) + 1 }));
    }
  };

  // Handle comment reaction
  const handleCommentReaction = async (fixtureId: number, commentId: string, reactionType: string) => {
    if (!user) return;

    // Optimistic update
    const currentReactions = commentReactions[commentId] || [];
    const existingReaction = currentReactions.find(r => r.user_id === user.id);

    let newReactions: CommentReaction[];
    if (existingReaction) {
      if (existingReaction.reaction_type === reactionType) {
        // Remove reaction
        newReactions = currentReactions.filter(r => r.user_id !== user.id);
      } else {
        // Update reaction
        newReactions = currentReactions.map(r =>
          r.user_id === user.id ? { ...r, reaction_type: reactionType } : r
        );
      }
    } else {
      // Add new reaction
      newReactions = [...currentReactions, {
        id: `temp-${Date.now()}`,
        comment_id: commentId,
        user_id: user.id,
        reaction_type: reactionType,
        created_at: new Date().toISOString()
      }];
    }

    setCommentReactions(prev => ({ ...prev, [commentId]: newReactions }));
    setActiveReactionPicker(null);

    // Actual update
    await toggleCommentReaction(commentId, user.id, reactionType);
    await loadComments(fixtureId);
  };

  // Get grouped reactions for a comment
  const getGroupedReactions = (commentId: string) => {
    const reactions = commentReactions[commentId] || [];
    const grouped: Record<string, { count: number; hasUserReacted: boolean }> = {};

    reactions.forEach(r => {
      if (!grouped[r.reaction_type]) {
        grouped[r.reaction_type] = { count: 0, hasUserReacted: false };
      }
      grouped[r.reaction_type].count++;
      if (r.user_id === user?.id) {
        grouped[r.reaction_type].hasUserReacted = true;
      }
    });

    return grouped;
  };

  // Handle delete
  const handleDelete = async (fixtureId: number, commentId: string) => {
    if (!user) return;
    await deleteComment(commentId, user.id);
    await loadComments(fixtureId);
    setStats(prev => ({ ...prev, totalComments: Math.max(0, prev.totalComments - 1) }));
    setCommentCounts(prev => ({ ...prev, [fixtureId]: Math.max(0, (prev[fixtureId] || 0) - 1) }));
  };

  // Load predictions for a match
  const loadMatchPredictions = async (matchId: number) => {
    const { data } = await getMatchUserPredictions(matchId);
    if (data) {
      setMatchPredictions(prev => ({ ...prev, [matchId]: data }));
    }
  };

  // Load recent predictions
  useEffect(() => {
    const loadRecent = async () => {
      const { data } = await getRecentPredictions(20);
      if (data) {
        setRecentPredictionsList(data);
      }
    };
    loadRecent();
  }, []);

  // Toggle expand predictions for a match
  const toggleExpandPredictions = async (matchId: number) => {
    const newExpanded = new Set(expandedPredictions);
    if (newExpanded.has(matchId)) {
      newExpanded.delete(matchId);
    } else {
      newExpanded.add(matchId);
      if (!matchPredictions[matchId]) {
        await loadMatchPredictions(matchId);
      }
    }
    setExpandedPredictions(newExpanded);
  };

  // Open prediction modal
  const openPredictionModal = (match: Prematch) => {
    setPredictionModalMatch(match);
    setPredictionForm({ homeScore: '', awayScore: '', winner: null, analysis: '' });
  };

  // Submit prediction
  const handleSubmitPrediction = async () => {
    if (!user || !predictionModalMatch) return;
    setSubmittingPrediction(true);

    const { data, error } = await submitUserPrediction(
      predictionModalMatch.fixture_id,
      user.id,
      {
        home_team: predictionModalMatch.home_name,
        away_team: predictionModalMatch.away_name,
        league: predictionModalMatch.league_name,
        match_date: predictionModalMatch.start_date_msia,
        home_score_prediction: predictionForm.homeScore ? parseInt(predictionForm.homeScore) : null,
        away_score_prediction: predictionForm.awayScore ? parseInt(predictionForm.awayScore) : null,
        winner_prediction: predictionForm.winner,
        analysis: predictionForm.analysis,
      },
      {
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      }
    );

    setSubmittingPrediction(false);

    if (error) {
      // Show error toast
      const errorMsg = error.message?.includes('SQL setup') || error.message?.includes('not yet enabled')
        ? t('predictionErrorSetup')
        : t('predictionError');
      setToast({ type: 'error', message: errorMsg });
      setTimeout(() => setToast(null), 5000);
      return;
    }

    if (data) {
      // Show success toast
      setToast({ type: 'success', message: t('predictionSuccess') });
      setTimeout(() => setToast(null), 3000);

      // Update local state
      setMatchPredictions(prev => ({
        ...prev,
        [predictionModalMatch.fixture_id]: [data, ...(prev[predictionModalMatch.fixture_id] || []).filter(p => p.user_id !== user.id)]
      }));
      // Refresh recent predictions
      const { data: recent } = await getRecentPredictions(20);
      if (recent) setRecentPredictionsList(recent);
      setPredictionModalMatch(null);
    }
  };

  const handleSetLang = (newLang: string) => {
    setSelectedLang(newLang);
    localStorage.setItem('oddsflow_lang', newLang);
    setLangDropdownOpen(false);
  };

  // Format date label
  const formatDateLabel = (date: Date) => {
    const today = getUTCToday();
    const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === -1) return t('yesterday');
    if (diff === 0) return t('today');
    if (diff === 1) return t('tomorrow');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get user display name
  const getUserName = (comment: MatchComment) => {
    if (user?.id === comment.user_id) {
      return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    }
    return `User${comment.user_id.substring(0, 4)}`;
  };

  // Get user avatar
  const getUserAvatar = (comment: MatchComment) => {
    if (user?.id === comment.user_id) {
      return user.user_metadata?.avatar_url || user.user_metadata?.picture;
    }
    return null;
  };

  // Get match info for chat
  const getMatchInfo = (fixtureId: number) => {
    const match = matches.find(m => m.fixture_id === fixtureId);
    if (!match) return undefined;
    return {
      home: match.home_name,
      away: match.away_name,
      league: match.league_name,
    };
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 ${
          toast.type === 'success'
            ? 'bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 border border-emerald-400/50'
            : 'bg-gradient-to-r from-red-500/90 to-red-600/90 border border-red-400/50'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="text-white font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

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
              <Link href="/community" className="text-emerald-400 font-medium text-sm">{t('community')}</Link>
              <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('news')}</Link>
              <Link href="/solution" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('solution')}</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer">
                  <span>{currentLang.flag}</span>
                  <span className="font-medium">{currentLang.code}</span>
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                      {LANGUAGES.map((language) => (
                        <button key={language.code} onClick={() => handleSetLang(language.code)} className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${selectedLang === language.code ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300'}`}>
                          <span className="text-lg">{language.flag}</span>
                          <span className="font-medium">{language.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Auth buttons */}
              {user ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-black ${user.user_metadata?.avatar_url || user.user_metadata?.picture ? 'hidden' : ''}`}>
                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium">{t('login')}</Link>
                  <Link href="/get-started" className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm">{t('getStarted')}</Link>
                </>
              )}

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
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[45] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 py-4 space-y-1">
              {/* World Cup Special Entry */}
              <Link href="/worldcup" onClick={() => setMobileMenuOpen(false)} className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-8 w-auto object-contain relative z-10" />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
              </Link>

              {[{ href: '/', label: t('home') }, { href: '/predictions', label: t('predictions') }, { href: '/leagues', label: t('leagues') }, { href: '/performance', label: t('performance') }, { href: '/community', label: t('community') }, { href: '/news', label: t('news') }, { href: '/pricing', label: t('pricing') }].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5">
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium">{t('login')}</Link>
                  <Link href="/get-started" onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold">{t('getStarted')}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header - Hidden on home tab */}
      {activeTab !== 'home' && (
        <section className="pt-24 pb-6 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {t('communityTitle')}
            </h1>
            <p className="text-gray-400 text-lg">{t('communitySubtitle')}</p>
          </div>
        </section>
      )}

      {/* Tab Selector - Hidden on home tab */}
      {activeTab !== 'home' && (
        <section className="px-4 pb-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">{t('communityHub')}</span>
              <span className="sm:hidden">Hub</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="hidden sm:inline">{t('globalChat')}</span>
              <span className="sm:hidden">Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'predictions'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">{t('userPredictions')}</span>
              <span className="sm:hidden">{t('predictions')}</span>
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'matches'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="hidden sm:inline">{t('today')}&apos;s Matches</span>
              <span className="sm:hidden">Matches</span>
            </button>
          </div>
        </div>
      </section>
      )}

      {/* Fullscreen Video Hero for Home Tab */}
      {activeTab === 'home' && (
        <div className="relative min-h-screen">
          {/* Video Background */}
          <video
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/community/community_homepage.mp4" type="video/mp4" />
          </video>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-cyan-900/20" />

          {/* Content Overlay */}
          <div className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-16">
            {/* LIVE Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-sm font-medium tracking-wider">LIVE COMMUNITY</span>
            </div>

            {/* Welcome Text */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-4 drop-shadow-2xl">
              {t('welcomeMessage')}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 text-center mb-6 max-w-2xl drop-shadow-lg">
              {t('welcomeSubtitle')}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-semibold">{stats.activeUsers}</span>
                <span className="text-gray-200 text-sm">{t('onlineNow')}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                <span className="text-cyan-400 font-semibold">{recentPredictions.length}</span>
                <span className="text-gray-200 text-sm">{t('userPredictions')}</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl px-4">
              {/* Global Chat Button */}
              <Link
                href={user ? "/community/global-chat" : "/login"}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/40 to-emerald-600/40 backdrop-blur-md border border-emerald-400/50 p-5 md:p-6 text-center hover:border-emerald-300/70 hover:from-emerald-500/50 hover:to-emerald-600/50 transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto rounded-xl bg-emerald-400/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-1">{t('globalChat')}</h3>
                  <p className="text-xs text-emerald-200/80 hidden md:block">{t('liveDiscussion')}</p>
                </div>
              </Link>

              {/* User Predictions Button */}
              <Link
                href={user ? "/community/user-predictions" : "/login"}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/40 to-cyan-600/40 backdrop-blur-md border border-cyan-400/50 p-5 md:p-6 text-center hover:border-cyan-300/70 hover:from-cyan-500/50 hover:to-cyan-600/50 transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto rounded-xl bg-cyan-400/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-1">{t('userPredictions')}</h3>
                  <p className="text-xs text-cyan-200/80 hidden md:block">{t('sharePredictions')}</p>
                </div>
              </Link>

              {/* News Button */}
              <Link
                href="/news"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/40 to-orange-600/40 backdrop-blur-md border border-amber-400/50 p-5 md:p-6 text-center hover:border-amber-300/70 hover:from-amber-500/50 hover:to-orange-600/50 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto rounded-xl bg-amber-400/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 md:w-7 md:h-7 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-1">{t('news')}</h3>
                  <p className="text-xs text-amber-200/80 hidden md:block">{t('latestNews')}</p>
                </div>
              </Link>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
              <span className="text-white/70 text-sm">{t('scrollDown')}</span>
              <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not on home tab */}
      {activeTab !== 'home' && (
      <section className="px-4 pb-16 pt-24">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'chat' ? (
            /* Global Chat Section */
            <div className="grid md:grid-cols-3 gap-4">
              {/* Global Chat - Full width on mobile, 2/3 on desktop */}
              <div className="md:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 overflow-hidden h-[500px] md:h-[600px]">
                <ChatRoom fixtureId={null} user={user} t={t} />
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-4">
                {/* Stats Cards */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Community Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">{t('totalComments')}</span>
                      <span className="text-emerald-400 font-bold">{stats.totalComments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">{t('todayComments')}</span>
                      <span className="text-cyan-400 font-bold">{stats.todayComments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">{t('activeUsers')}</span>
                      <span className="text-purple-400 font-bold">{stats.activeUsers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Today's Matches Quick View */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">{t('today')}&apos;s Matches</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {matches.slice(0, 5).map((match) => (
                      <button
                        key={match.id}
                        onClick={() => {
                          setMatchChatOpen(match.fixture_id);
                        }}
                        className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                          {match.league_logo && <img src={match.league_logo} alt="" className="w-3 h-3" />}
                          <span className="truncate">{match.league_name}</span>
                        </div>
                        <div className="text-sm text-white truncate">{match.home_name} vs {match.away_name}</div>
                      </button>
                    ))}
                    {matches.length > 5 && (
                      <button
                        onClick={() => setActiveTab('matches')}
                        className="w-full text-center text-xs text-emerald-400 hover:text-emerald-300 py-2 cursor-pointer"
                      >
                        View all {matches.length} matches →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'predictions' ? (
            /* Predictions Tab - Premium Design */
            <div className="grid md:grid-cols-3 gap-6">
              {/* Matches List with Predictions */}
              <div className="md:col-span-2 space-y-4">
                {/* Date Selector - Enhanced */}
                <div className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2">
                  {dates.slice(1, 5).map((date) => {
                    const isSelected = selectedDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-emerald-300 border border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                            : 'bg-white/[0.03] text-gray-400 border border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        {formatDateLabel(date)}
                      </button>
                    );
                  })}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-emerald-500/30"></div>
                    </div>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">{t('noMatches')}</p>
                  </div>
                ) : (
                  matches.map((match) => {
                    const predictions = matchPredictions[match.fixture_id] || [];
                    const isExpanded = expandedPredictions.has(match.fixture_id);
                    const matchTime = new Date(match.start_date_msia).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                    return (
                      <div
                        key={match.id}
                        className="group relative bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                      >
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Match Header */}
                        <div className="relative p-5">
                          {/* League & Time Row */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                                {match.league_logo ? (
                                  <img src={match.league_logo} alt="" className="w-5 h-5 object-contain" />
                                ) : (
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-xs font-medium text-emerald-400 truncate max-w-[140px] md:max-w-none">{match.league_name}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-xs font-mono text-gray-400">{matchTime}</span>
                            </div>
                          </div>

                          {/* Teams Display - New Design */}
                          <div className="flex items-center justify-between gap-4 mb-5">
                            {/* Home Team */}
                            <div className="flex-1 text-center">
                              <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                {match.home_logo ? (
                                  <img src={match.home_logo} alt="" className="w-10 h-10 object-contain" />
                                ) : (
                                  <span className="text-lg font-bold text-gray-500">{match.home_name[0]}</span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-white truncate">{match.home_name}</p>
                            </div>

                            {/* VS Badge */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-400">VS</span>
                              </div>
                            </div>

                            {/* Away Team */}
                            <div className="flex-1 text-center">
                              <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                {match.away_logo ? (
                                  <img src={match.away_logo} alt="" className="w-10 h-10 object-contain" />
                                ) : (
                                  <span className="text-lg font-bold text-gray-500">{match.away_name[0]}</span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-white truncate">{match.away_name}</p>
                            </div>
                          </div>

                          {/* Action Buttons - Enhanced */}
                          <div className="flex gap-3">
                            {user ? (
                              <button
                                onClick={() => openPredictionModal(match)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/20 transition-all text-sm font-medium text-emerald-400 cursor-pointer border border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                {t('makePrediction')}
                              </button>
                            ) : (
                              <Link href="/login" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-medium text-gray-400 border border-white/10 hover:border-white/20">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                {t('loginToPredict')}
                              </Link>
                            )}
                            <button
                              onClick={() => toggleExpandPredictions(match.fixture_id)}
                              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl transition-all text-sm font-medium cursor-pointer border ${
                                isExpanded
                                  ? 'bg-white/10 border-white/20 text-white'
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                              }`}
                            >
                              <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              <span className="tabular-nums">{predictions.length}</span>
                            </button>
                          </div>
                        </div>

                        {/* Predictions List - Enhanced */}
                        {isExpanded && (
                          <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
                            {predictions.length === 0 ? (
                              <div className="text-center py-8">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                                <p className="text-gray-500 text-sm">{t('noPredictions')}</p>
                              </div>
                            ) : (
                              <div className="p-4 space-y-4">
                                {/* Community Poll Summary */}
                                {(() => {
                                  const winnerPredictions = predictions.filter(p => p.winner_prediction);
                                  const totalVotes = winnerPredictions.length;
                                  const homeWins = winnerPredictions.filter(p => p.winner_prediction === '1').length;
                                  const draws = winnerPredictions.filter(p => p.winner_prediction === 'X').length;
                                  const awayWins = winnerPredictions.filter(p => p.winner_prediction === '2').length;
                                  const homePercent = totalVotes > 0 ? Math.round((homeWins / totalVotes) * 100) : 0;
                                  const drawPercent = totalVotes > 0 ? Math.round((draws / totalVotes) * 100) : 0;
                                  const awayPercent = totalVotes > 0 ? Math.round((awayWins / totalVotes) * 100) : 0;

                                  if (totalVotes === 0) return null;

                                  return (
                                    <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent rounded-xl border border-white/10 p-4 mb-2">
                                      {/* Poll Header */}
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                          </div>
                                          <span className="text-sm font-semibold text-white">{t('communityPoll')}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 px-2 py-1 rounded-full bg-white/5">
                                          {totalVotes} {t('totalVotes')}
                                        </span>
                                      </div>

                                      {/* Poll Bars */}
                                      <div className="space-y-3">
                                        {/* Home Win */}
                                        <div className="relative">
                                          <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                              {match.home_logo && (
                                                <img src={match.home_logo} alt="" className="w-5 h-5 object-contain" />
                                              )}
                                              <span className="text-sm font-medium text-blue-300">{match.home_name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-blue-400">{homePercent}%</span>
                                          </div>
                                          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                                              style={{ width: `${homePercent}%` }}
                                            />
                                          </div>
                                        </div>

                                        {/* Draw */}
                                        <div className="relative">
                                          <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-amber-300">{t('draw')}</span>
                                            <span className="text-sm font-bold text-amber-400">{drawPercent}%</span>
                                          </div>
                                          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                                              style={{ width: `${drawPercent}%` }}
                                            />
                                          </div>
                                        </div>

                                        {/* Away Win */}
                                        <div className="relative">
                                          <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2">
                                              {match.away_logo && (
                                                <img src={match.away_logo} alt="" className="w-5 h-5 object-contain" />
                                              )}
                                              <span className="text-sm font-medium text-rose-300">{match.away_name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-rose-400">{awayPercent}%</span>
                                          </div>
                                          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-500"
                                              style={{ width: `${awayPercent}%` }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* Individual Predictions */}
                                <div className="space-y-3">
                                {predictions.map((pred, idx) => (
                                  <div
                                    key={pred.id}
                                    className="relative bg-gradient-to-r from-white/[0.06] to-white/[0.02] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                  >
                                    <div className="flex items-start gap-3">
                                      {/* Avatar */}
                                      {pred.user_avatar ? (
                                        <img src={pred.user_avatar} alt="" className="w-10 h-10 rounded-xl flex-shrink-0 border border-white/10" />
                                      ) : (
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center text-sm font-bold text-emerald-300 flex-shrink-0 border border-emerald-500/20">
                                          {(pred.user_name || 'U')[0].toUpperCase()}
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        {/* User Info */}
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-sm font-semibold text-white">{pred.user_name || 'User'}</span>
                                          <span className="text-[10px] text-gray-500 px-2 py-0.5 rounded-full bg-white/5">{timeAgo(pred.created_at)}</span>
                                        </div>

                                        {/* Predictions Display - Inline */}
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                          {/* Score Prediction */}
                                          {(pred.home_score_prediction !== null || pred.away_score_prediction !== null) && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30">
                                              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                              </svg>
                                              <span className="text-sm font-bold text-emerald-300">
                                                {pred.home_score_prediction ?? '?'} - {pred.away_score_prediction ?? '?'}
                                              </span>
                                            </div>
                                          )}

                                          {/* Winner Prediction */}
                                          {pred.winner_prediction && (
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                                              pred.winner_prediction === '1' ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' :
                                              pred.winner_prediction === 'X' ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' :
                                              'bg-rose-500/15 border-rose-500/30 text-rose-300'
                                            }`}>
                                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                              </svg>
                                              <span className="text-xs font-semibold">
                                                {pred.winner_prediction === '1' ? match.home_name :
                                                 pred.winner_prediction === 'X' ? t('draw') : match.away_name}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Analysis */}
                                        {pred.analysis && (
                                          <p className="text-sm text-gray-400 leading-relaxed break-words">{pred.analysis}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Recent Predictions Sidebar - Enhanced */}
              <div className="space-y-4">
                <div className="sticky top-4">
                  <div className="bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent rounded-2xl border border-white/10 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-transparent">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-white">{t('recentPredictions')}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
                      {recentPredictions.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-xs">{t('noPredictions')}</p>
                        </div>
                      ) : (
                        recentPredictions.map((pred) => (
                          <div key={pred.id} className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-all border border-transparent hover:border-white/10">
                            {/* User Row */}
                            <div className="flex items-center gap-2 mb-2">
                              {pred.user_avatar ? (
                                <img src={pred.user_avatar} alt="" className="w-6 h-6 rounded-lg" />
                              ) : (
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                                  {(pred.user_name || 'U')[0].toUpperCase()}
                                </div>
                              )}
                              <span className="text-xs font-medium text-white truncate flex-1">{pred.user_name || 'User'}</span>
                            </div>

                            {/* Match */}
                            <div className="text-[11px] text-gray-500 mb-2 truncate">
                              {pred.home_team} {t('vs')} {pred.away_team}
                            </div>

                            {/* Predictions */}
                            <div className="flex flex-wrap gap-1.5">
                              {(pred.home_score_prediction !== null || pred.away_score_prediction !== null) && (
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-md text-[10px] font-bold border border-emerald-500/20">
                                  {pred.home_score_prediction ?? '?'}-{pred.away_score_prediction ?? '?'}
                                </span>
                              )}
                              {pred.winner_prediction && (
                                <span className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${
                                  pred.winner_prediction === '1' ? 'bg-blue-500/15 border-blue-500/20 text-blue-300' :
                                  pred.winner_prediction === 'X' ? 'bg-amber-500/15 border-amber-500/20 text-amber-300' :
                                  'bg-rose-500/15 border-rose-500/20 text-rose-300'
                                }`}>
                                  {pred.winner_prediction === '1' ? t('homeWin') :
                                   pred.winner_prediction === 'X' ? t('draw') : t('awayWin')}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Matches Tab */
            <div>
              {/* Date Selector */}
              <div className="mb-6">
                {/* Mobile: 3 dates */}
                <div className="flex md:hidden justify-center gap-2">
                  {dates.filter((_, i) => i >= 1 && i <= 3).map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        selectedDate.toISOString().split('T')[0] === date.toISOString().split('T')[0]
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}
                    >
                      {formatDateLabel(date)}
                    </button>
                  ))}
                </div>
                {/* Desktop: All dates */}
                <div className="hidden md:flex justify-center gap-3">
                  {dates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        selectedDate.toISOString().split('T')[0] === date.toISOString().split('T')[0]
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {formatDateLabel(date)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matches List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">{t('noMatches')}</div>
                ) : (
                  matches.map((match) => {
                    const isExpanded = expandedMatches.has(match.fixture_id);
                    const comments = matchComments[match.fixture_id] || [];
                    const isLoadingComments = loadingComments.has(match.fixture_id);
                    const matchTime = new Date(match.start_date_msia).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                    return (
                      <div key={match.id} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 overflow-hidden">
                        {/* Match Info */}
                        <div className="p-4">
                          {/* League & Time */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {match.league_logo && (
                                <img src={match.league_logo} alt="" className="w-5 h-5 object-contain" />
                              )}
                              <span className="text-xs text-emerald-400 font-medium truncate max-w-[150px] md:max-w-none">{match.league_name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{matchTime}</span>
                          </div>

                          {/* Teams */}
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                {match.home_logo && <img src={match.home_logo} alt="" className="w-6 h-6 object-contain flex-shrink-0" />}
                                <span className="text-white font-medium truncate">{match.home_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {match.away_logo && <img src={match.away_logo} alt="" className="w-6 h-6 object-contain flex-shrink-0" />}
                                <span className="text-white font-medium truncate">{match.away_name}</span>
                              </div>
                            </div>
                            {match.goals_home !== null && match.goals_away !== null && (
                              <div className="text-right ml-4">
                                <div className="text-xl font-bold text-white">{match.goals_home}</div>
                                <div className="text-xl font-bold text-white">{match.goals_away}</div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => setMatchChatOpen(match.fixture_id)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-all text-sm text-emerald-400 cursor-pointer border border-emerald-500/30"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {t('openChat')}
                            </button>
                            <button
                              onClick={() => toggleExpand(match.fixture_id)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm text-gray-400 cursor-pointer"
                            >
                              <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              {isExpanded ? t('hideComments') : t('showComments')} ({comments.length || commentCounts[match.fixture_id] || 0})
                            </button>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {isExpanded && (
                          <div className="border-t border-white/10 p-4 bg-black/20">
                            {/* Comment Input */}
                            {user ? (
                              <div className="flex gap-3 mb-4">
                                {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                                  <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
                                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1 flex gap-2">
                                  <input
                                    type="text"
                                    value={commentInputs[match.fixture_id] || ''}
                                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [match.fixture_id]: e.target.value }))}
                                    placeholder={t('writeComment')}
                                    className="flex-1 px-3 md:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(match.fixture_id)}
                                  />
                                  <button
                                    onClick={() => handleSubmitComment(match.fixture_id)}
                                    disabled={!commentInputs[match.fixture_id]?.trim()}
                                    className="px-3 md:px-4 py-2 rounded-lg bg-emerald-500 text-black font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    {t('send')}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <Link href="/login" className="block w-full py-3 mb-4 text-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all">
                                {t('loginToComment')}
                              </Link>
                            )}

                            {/* Comments List */}
                            {isLoadingComments ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500"></div>
                              </div>
                            ) : comments.length === 0 ? (
                              <div className="text-center py-8 text-gray-500 text-sm">{t('noComments')}</div>
                            ) : (
                              <div className="space-y-4">
                                {comments.map((comment) => (
                                  <div key={comment.id} className="space-y-3">
                                    {/* Main Comment */}
                                    <div className="flex gap-3">
                                      {getUserAvatar(comment) ? (
                                        <img src={getUserAvatar(comment)!} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                          {getUserName(comment)[0].toUpperCase()}
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                          <span className="text-sm font-medium text-white">{getUserName(comment)}</span>
                                          <span className="text-xs text-gray-500">{timeAgo(comment.created_at)}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 break-words">{comment.content}</p>

                                        {/* Reaction Display */}
                                        {Object.keys(getGroupedReactions(comment.id)).length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-2">
                                            {Object.entries(getGroupedReactions(comment.id)).map(([emoji, data]) => (
                                              <button
                                                key={emoji}
                                                onClick={() => handleCommentReaction(match.fixture_id, comment.id, emoji)}
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                                  data.hasUserReacted ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-white/5 border border-white/10'
                                                } cursor-pointer hover:bg-white/10`}
                                              >
                                                <span>{emoji}</span>
                                                <span className="text-gray-400">{data.count}</span>
                                              </button>
                                            ))}
                                          </div>
                                        )}

                                        <div className="flex items-center gap-4 mt-2">
                                          {/* Reaction Button */}
                                          <div className="relative">
                                            <button
                                              onClick={() => user && setActiveReactionPicker(activeReactionPicker === comment.id ? null : comment.id)}
                                              disabled={!user}
                                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 cursor-pointer disabled:opacity-50"
                                            >
                                              <span className="text-base">😀</span>
                                              <span>React</span>
                                            </button>
                                            {activeReactionPicker === comment.id && (
                                              <div className="absolute bottom-full left-0 mb-1 bg-gray-800 border border-white/10 rounded-lg p-2 flex gap-1 z-50 shadow-lg">
                                                {COMMENT_REACTIONS.map(emoji => (
                                                  <button
                                                    key={emoji}
                                                    onClick={() => handleCommentReaction(match.fixture_id, comment.id, emoji)}
                                                    className="text-xl hover:scale-125 transition-transform cursor-pointer p-1"
                                                  >
                                                    {emoji}
                                                  </button>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                          {user && (
                                            <button
                                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                              className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
                                            >
                                              {t('reply')}
                                            </button>
                                          )}
                                          {user?.id === comment.user_id && (
                                            <button
                                              onClick={() => handleDelete(match.fixture_id, comment.id)}
                                              className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                                            >
                                              {t('delete')}
                                            </button>
                                          )}
                                        </div>

                                        {/* Reply Input */}
                                        {replyingTo === comment.id && (
                                          <div className="flex gap-2 mt-3">
                                            <input
                                              type="text"
                                              value={replyInputs[comment.id] || ''}
                                              onChange={(e) => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                              placeholder={t('writeComment')}
                                              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-emerald-500/50"
                                              onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply(match.fixture_id, comment.id)}
                                              autoFocus
                                            />
                                            <button
                                              onClick={() => handleSubmitReply(match.fixture_id, comment.id)}
                                              disabled={!replyInputs[comment.id]?.trim()}
                                              className="px-3 py-2 rounded-lg bg-emerald-500 text-black font-medium text-xs disabled:opacity-50 cursor-pointer"
                                            >
                                              {t('send')}
                                            </button>
                                            <button
                                              onClick={() => setReplyingTo(null)}
                                              className="px-3 py-2 rounded-lg bg-white/5 text-gray-400 text-xs cursor-pointer"
                                            >
                                              {t('cancel')}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                      <div className="ml-8 md:ml-11 space-y-3 border-l-2 border-white/10 pl-3 md:pl-4">
                                        {comment.replies.map((reply) => (
                                          <div key={reply.id} className="flex gap-2 md:gap-3">
                                            {getUserAvatar(reply) ? (
                                              <img src={getUserAvatar(reply)!} alt="" className="w-6 h-6 rounded-full flex-shrink-0" />
                                            ) : (
                                              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                                {getUserName(reply)[0].toUpperCase()}
                                              </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-sm font-medium text-white">{getUserName(reply)}</span>
                                                <span className="text-xs text-gray-500">{timeAgo(reply.created_at)}</span>
                                              </div>
                                              <p className="text-sm text-gray-300 break-words">{reply.content}</p>

                                              {/* Reply Reaction Display */}
                                              {Object.keys(getGroupedReactions(reply.id)).length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                  {Object.entries(getGroupedReactions(reply.id)).map(([emoji, data]) => (
                                                    <button
                                                      key={emoji}
                                                      onClick={() => handleCommentReaction(match.fixture_id, reply.id, emoji)}
                                                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                                        data.hasUserReacted ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-white/5 border border-white/10'
                                                      } cursor-pointer hover:bg-white/10`}
                                                    >
                                                      <span>{emoji}</span>
                                                      <span className="text-gray-400">{data.count}</span>
                                                    </button>
                                                  ))}
                                                </div>
                                              )}

                                              <div className="flex items-center gap-4 mt-2">
                                                {/* Reply Reaction Button */}
                                                <div className="relative">
                                                  <button
                                                    onClick={() => user && setActiveReactionPicker(activeReactionPicker === reply.id ? null : reply.id)}
                                                    disabled={!user}
                                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 cursor-pointer disabled:opacity-50"
                                                  >
                                                    <span className="text-sm">😀</span>
                                                    <span>React</span>
                                                  </button>
                                                  {activeReactionPicker === reply.id && (
                                                    <div className="absolute bottom-full left-0 mb-1 bg-gray-800 border border-white/10 rounded-lg p-2 flex gap-1 z-50 shadow-lg">
                                                      {COMMENT_REACTIONS.map(emoji => (
                                                        <button
                                                          key={emoji}
                                                          onClick={() => handleCommentReaction(match.fixture_id, reply.id, emoji)}
                                                          className="text-lg hover:scale-125 transition-transform cursor-pointer p-1"
                                                        >
                                                          {emoji}
                                                        </button>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                                {user?.id === reply.user_id && (
                                                  <button
                                                    onClick={() => handleDelete(match.fixture_id, reply.id)}
                                                    className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                                                  >
                                                    {t('delete')}
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Match Chat Modal */}
      {matchChatOpen !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMatchChatOpen(null)} />
          <div className="relative w-full max-w-lg h-[80vh] max-h-[600px] bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
            <ChatRoom
              fixtureId={matchChatOpen}
              user={user}
              t={t}
              matchInfo={getMatchInfo(matchChatOpen)}
              onClose={() => setMatchChatOpen(null)}
            />
          </div>
        </div>
      )}

      {/* Prediction Modal - Premium Design */}
      {predictionModalMatch && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setPredictionModalMatch(null)} />
          <div className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 pointer-events-none" />

            {/* Modal Header */}
            <div className="relative flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center border border-emerald-500/30">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">{t('makePrediction')}</h3>
              </div>
              <button onClick={() => setPredictionModalMatch(null)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Match Info - Enhanced */}
            <div className="relative p-5 bg-gradient-to-r from-white/[0.05] to-transparent border-b border-white/5">
              <div className="flex items-center gap-2 text-xs text-emerald-400 mb-4">
                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center overflow-hidden">
                  {predictionModalMatch.league_logo ? (
                    <img src={predictionModalMatch.league_logo} alt="" className="w-4 h-4 object-contain" />
                  ) : (
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{predictionModalMatch.league_name}</span>
              </div>

              {/* Teams Display */}
              <div className="flex items-center justify-between gap-4">
                {/* Home Team */}
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {predictionModalMatch.home_logo ? (
                      <img src={predictionModalMatch.home_logo} alt="" className="w-12 h-12 object-contain" />
                    ) : (
                      <span className="text-xl font-bold text-gray-500">{predictionModalMatch.home_name[0]}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-white truncate">{predictionModalMatch.home_name}</p>
                </div>

                {/* VS Badge */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">{t('vs')}</span>
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {predictionModalMatch.away_logo ? (
                      <img src={predictionModalMatch.away_logo} alt="" className="w-12 h-12 object-contain" />
                    ) : (
                      <span className="text-xl font-bold text-gray-500">{predictionModalMatch.away_name[0]}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-white truncate">{predictionModalMatch.away_name}</p>
                </div>
              </div>
            </div>

            {/* Prediction Form */}
            <div className="relative p-5 space-y-5">
              {/* Validation helper */}
              {(() => {
                const homeScore = predictionForm.homeScore ? parseInt(predictionForm.homeScore) : null;
                const awayScore = predictionForm.awayScore ? parseInt(predictionForm.awayScore) : null;
                const winner = predictionForm.winner;
                let hasError = false;
                let errorMessage = '';

                if (homeScore !== null && awayScore !== null && winner) {
                  if (winner === '1' && homeScore <= awayScore) {
                    hasError = true;
                    errorMessage = t('homeWin') + ': ' + t('predictedScore') + ' ' + homeScore + '-' + awayScore + ' ≠ ' + t('homeWin');
                  } else if (winner === 'X' && homeScore !== awayScore) {
                    hasError = true;
                    errorMessage = t('draw') + ': ' + t('predictedScore') + ' ' + homeScore + '-' + awayScore + ' ≠ ' + t('draw');
                  } else if (winner === '2' && awayScore <= homeScore) {
                    hasError = true;
                    errorMessage = t('awayWin') + ': ' + t('predictedScore') + ' ' + homeScore + '-' + awayScore + ' ≠ ' + t('awayWin');
                  }
                }

                return (
                  <>
                    {/* Score Prediction */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {t('predictedScore')}
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={predictionForm.homeScore}
                            onChange={(e) => setPredictionForm(prev => ({ ...prev, homeScore: e.target.value }))}
                            placeholder="0"
                            className={`w-full px-4 py-4 bg-white/[0.04] border rounded-xl text-center text-2xl font-bold focus:outline-none transition-all ${
                              hasError ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50 focus:bg-white/[0.06]'
                            }`}
                          />
                          <div className="text-[11px] text-gray-500 text-center mt-2 truncate">{predictionModalMatch.home_name}</div>
                        </div>
                        <div className={`text-3xl font-light ${hasError ? 'text-red-500' : 'text-gray-600'}`}>:</div>
                        <div className="flex-1">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={predictionForm.awayScore}
                            onChange={(e) => setPredictionForm(prev => ({ ...prev, awayScore: e.target.value }))}
                            placeholder="0"
                            className={`w-full px-4 py-4 bg-white/[0.04] border rounded-xl text-center text-2xl font-bold focus:outline-none transition-all ${
                              hasError ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-emerald-500/50 focus:bg-white/[0.06]'
                            }`}
                          />
                          <div className="text-[11px] text-gray-500 text-center mt-2 truncate">{predictionModalMatch.away_name}</div>
                        </div>
                      </div>
                    </div>

                    {/* Winner Prediction (1X2) */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        {t('winner')}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setPredictionForm(prev => ({ ...prev, winner: prev.winner === '1' ? null : '1' }))}
                          className={`py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                            predictionForm.winner === '1'
                              ? hasError && winner === '1'
                                ? 'bg-red-500/25 border-red-500/70 text-red-300 shadow-lg shadow-red-500/20'
                                : 'bg-blue-500/25 border-blue-500/70 text-blue-300 shadow-lg shadow-blue-500/20'
                              : 'bg-white/[0.04] border-white/10 text-gray-400 hover:bg-white/[0.08] hover:border-white/20'
                          }`}
                        >
                          {t('homeWin')}
                        </button>
                        <button
                          onClick={() => setPredictionForm(prev => ({ ...prev, winner: prev.winner === 'X' ? null : 'X' }))}
                          className={`py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                            predictionForm.winner === 'X'
                              ? hasError && winner === 'X'
                                ? 'bg-red-500/25 border-red-500/70 text-red-300 shadow-lg shadow-red-500/20'
                                : 'bg-amber-500/25 border-amber-500/70 text-amber-300 shadow-lg shadow-amber-500/20'
                              : 'bg-white/[0.04] border-white/10 text-gray-400 hover:bg-white/[0.08] hover:border-white/20'
                          }`}
                        >
                          {t('draw')}
                        </button>
                        <button
                          onClick={() => setPredictionForm(prev => ({ ...prev, winner: prev.winner === '2' ? null : '2' }))}
                          className={`py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                            predictionForm.winner === '2'
                              ? hasError && winner === '2'
                                ? 'bg-red-500/25 border-red-500/70 text-red-300 shadow-lg shadow-red-500/20'
                                : 'bg-rose-500/25 border-rose-500/70 text-rose-300 shadow-lg shadow-rose-500/20'
                              : 'bg-white/[0.04] border-white/10 text-gray-400 hover:bg-white/[0.08] hover:border-white/20'
                          }`}
                        >
                          {t('awayWin')}
                        </button>
                      </div>

                      {/* Error Message */}
                      {hasError && (
                        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-xs text-red-300">Error: {errorMessage}</span>
                        </div>
                      )}
                    </div>

                    {/* Analysis */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {t('analysis')}
                      </label>
                      <textarea
                        value={predictionForm.analysis}
                        onChange={(e) => setPredictionForm(prev => ({ ...prev, analysis: e.target.value }))}
                        placeholder={t('yourAnalysis')}
                        rows={3}
                        maxLength={500}
                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all resize-none placeholder-gray-500"
                      />
                      <div className="flex justify-end mt-2">
                        <span className={`text-xs ${predictionForm.analysis.length > 450 ? 'text-amber-400' : 'text-gray-500'}`}>
                          {predictionForm.analysis.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmitPrediction}
                      disabled={submittingPrediction || hasError || (!predictionForm.homeScore && !predictionForm.awayScore && !predictionForm.winner && !predictionForm.analysis)}
                      className={`w-full py-4 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-lg ${
                        hasError
                          ? 'bg-red-500/50 text-white/70 shadow-red-500/20 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-500/30 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {submittingPrediction ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        </div>
                      ) : hasError ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Error
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          {t('submitPrediction')}
                        </span>
                      )}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* SEO Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-6xl mx-auto">
          {/* What is OddsFlow Community */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {t('whatIsCommunity')}
            </h2>
            <div className="max-w-4xl mx-auto space-y-4 text-gray-400 leading-relaxed">
              <p>{t('communityDesc1')}</p>
              <p>{t('communityDesc2')}</p>
              <p>{t('communityDesc3')}</p>
              <p>{t('communityDesc4')}</p>
            </div>
          </div>

          {/* Community Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('communityFeature1Title')}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t('communityFeature1Desc')}</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('communityFeature2Title')}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t('communityFeature2Desc')}</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent border border-white/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 border border-emerald-500/20">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('communityFeature3Title')}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t('communityFeature3Desc')}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-3">{t('joinCommunityToday')}</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">{t('joinCommunityDesc')}</p>
            <Link
              href={user ? "/community/global-chat" : "/login"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              {t('getStarted')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
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
              <p className="text-gray-400 mb-6 leading-relaxed">{t('footerDesc')}</p>
              <div className="flex items-center gap-4">
                {/* Facebook */}
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </Link>
                {/* Instagram */}
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
                {/* Telegram */}
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
                <li><Link href="/community/global-chat" className="hover:text-emerald-400 transition-colors">{t('globalChatFooter')}</Link></li>
                <li><Link href="/community/user-predictions" className="hover:text-emerald-400 transition-colors">{t('userPredictionsFooter')}</Link></li>
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
