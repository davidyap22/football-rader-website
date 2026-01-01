"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, createContext, useContext, ReactNode } from "react";
import { supabase, Prematch } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

// ============ Translations ============
const translations: Record<string, Record<string, string>> = {
  EN: {
    // Navbar
    home: "Home",
    predictions: "Predictions",
    leagues: "Leagues",
    analysis: "Performance",
    community: "Community",
    news: "News",
    pricing: "Pricing",
    login: "Log In",
    getStarted: "Get Started",
    // Hero
    heroTitle1: "Smart",
    heroTitle2: "Football Odds",
    heroTitle3: "Performance",
    heroSubtitle: "Leverage AI-powered insights to analyze football odds in real-time. Make data-driven decisions with our advanced prediction algorithms.",
    startAnalyzing: "Start Analyzing Free",
    viewLiveOdds: "View Live Odds",
    accuracyRate: "Accuracy Rate",
    matchesAnalyzed: "Matches Analyzed",
    leaguesCovered: "Leagues Covered",
    realtimeUpdates: "Real-time Updates",
    // Leagues Section
    globalCoverage: "Global Coverage",
    topLeagues: "Top Leagues We Cover",
    leaguesSubtitle: "Get AI predictions for all major football leagues worldwide",
    matchesSeason: "matches/season",
    // Features Section
    whyOddsFlow: "Why OddsFlow",
    mostAdvanced: "The Most Advanced",
    predictionEngine: "Prediction Engine",
    featuresSubtitle: "Our AI analyzes millions of historical matches, real-time data, and market trends to deliver predictions with unmatched accuracy.",
    aiPoweredPerformance: "AI-Powered Performance",
    aiPoweredDesc: "Machine learning models analyze thousands of data points for precise predictions.",
    realtimeTracking: "Real-time Tracking",
    realtimeTrackingDesc: "Monitor odds movements across bookmakers with instant live updates.",
    deepStatistics: "Deep Statistics",
    deepStatisticsDesc: "Access team stats, head-to-head records, and historical performance data.",
    smartAlerts: "Smart Alerts",
    smartAlertsDesc: "Get notified when value opportunities arise or odds shift significantly.",
    aiDashboard: "AI Prediction Dashboard",
    live: "LIVE",
    startingIn: "Starting in 2h",
    aiConfidence: "AI Confidence",
    homeWin: "Home Win",
    draw: "Draw",
    awayWin: "Away Win",
    // Live Predictions
    livePredictions: "Live Predictions",
    todaysTopPicks: "Today's Top Picks",
    predictionsSubtitle: "AI-analyzed matches with the highest confidence scores",
    viewAllPredictions: "View All Predictions",
    // CTA
    readyToMake: "Ready to Make",
    smarterPredictions: "Smarter Predictions",
    ctaSubtitle: "Join thousands of users who trust OddsFlow for their football analysis. Start your free trial today — no credit card required.",
    startFreeTrial: "Start Free Trial",
    contactSales: "Contact Sales",
    // Footer
    footerDesc: "AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.",
    product: "Product",
    liveOdds: "AI Performance",
    statistics: "Statistics",
    apiAccess: "API Access",
    company: "Company",
    aboutUs: "About Us",
    blog: "Blog",
    careers: "Careers",
    contact: "Contact",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    responsibleGaming: "Responsible Gaming",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    // AI Predictions Section
    aiPredictions: "AI Predictions",
    upcomingMatches: "Upcoming Matches",
    aiPredictionsSubtitle: "AI-powered predictions for scheduled matches",
    dateLeague: "Date / League",
    fixture: "Fixture",
    prediction: "Prediction",
    confidence: "Confidence",
    loading: "Loading matches...",
    noMatches: "No scheduled matches found",
    // Why Choose Section
    whyChooseUs: "Why Choose Us",
    whyChooseTitle: "Why Choose OddsFlow",
    whyChooseSubtitle: "Experience the difference with our AI-powered platform",
    benefit1Title: "99.9% Uptime",
    benefit1Desc: "Our platform runs 24/7 with enterprise-grade reliability",
    benefit2Title: "Real-time Data",
    benefit2Desc: "Get instant updates from 50+ bookmakers worldwide",
    benefit3Title: "AI Accuracy",
    benefit3Desc: "Our models achieve 78%+ prediction accuracy",
    benefit4Title: "Secure & Private",
    benefit4Desc: "Bank-level encryption protects your data",
    benefit5Title: "24/7 Support",
    benefit5Desc: "Expert support team available around the clock",
    benefit6Title: "Money Back",
    benefit6Desc: "30-day money back guarantee, no questions asked",
    // Trusted Section
    trustedBy: "Trusted By Users",
    trustedTitle: "Trusted by Thousands",
    trustedSubtitle: "Join our growing community of successful bettors",
    activeUsers: "Active Users",
    countriesServed: "Countries Served",
    predictionsDaily: "Predictions Daily",
    satisfactionRate: "Satisfaction Rate",
    testimonial1: "OddsFlow has completely changed how I approach football betting. The AI predictions are incredibly accurate!",
    testimonial1Author: "Michael T.",
    testimonial1Role: "Professional Bettor",
    testimonial2: "The real-time odds tracking saves me hours every day. Best investment I've made.",
    testimonial2Author: "Sarah K.",
    testimonial2Role: "Sports Analyst",
    testimonial3: "Finally a platform that delivers on its promises. The accuracy rate is unmatched.",
    testimonial3Author: "James L.",
    testimonial3Role: "Football Enthusiast",
    // FAQ Section
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Everything you need to know about OddsFlow",
    faq1Question: "Can AI predict football scores?",
    faq1Answer: "Yes! Our AI football predictor analyzes millions of historical matches, player statistics, team form, and real-time data to predict football scores with high accuracy. As the most accurate AI football predictor, we achieve 78%+ accuracy across Premier League, Bundesliga, Serie A, La Liga, and Ligue 1.",
    faq2Question: "Is AI betting profitable?",
    faq2Answer: "AI betting can be highly profitable when using verified AI betting records and transparent AI betting sites like OddsFlow. Our users have seen consistent returns through our European football AI tips, with detailed performance tracking to prove profitability.",
    faq3Question: "Is handicap betting profitable?",
    faq3Answer: "Handicap betting is one of the most profitable betting strategies when done correctly. Our best AI for handicap betting analyzes handicap draw predictions and provides data-driven picks that maximize value across all European leagues.",
    faq4Question: "How to use data to predict Over/Under?",
    faq4Answer: "Our AI analyzes Premier League over 2.5 goals stats, team scoring patterns, defensive records, and historical data to predict Over/Under outcomes. The system considers factors like home/away form, head-to-head records, and recent goal-scoring trends.",
    faq5Question: "Which leagues do you cover?",
    faq5Answer: "We provide AI predictions for all major European leagues: EPL top 5 betting predictions, Bundesliga AI betting predictions, Serie A artificial intelligence picks, La Liga top 5 betting predictions, Ligue 1 AI prediction model, and Champions League betting analysis AI.",
    faq6Question: "How accurate is OddsFlow compared to other AI predictors?",
    faq6Answer: "OddsFlow is recognized as the most accurate AI football predictor with verified AI betting records. Unlike other platforms, we provide transparent AI betting results with full performance history, making us the safest AI football tips provider.",
    faq7Question: "What types of predictions do you offer?",
    faq7Answer: "We offer Premier League 1x2 predictions today, English Premier League draw predictions, handicap draw prediction, over 2.5 goals stats, and full match analysis. Our European football AI tips cover all major betting markets.",
    // What is OddsFlow
    whatIsOddsFlow: "What is OddsFlow?",
    whatIsDesc1: "OddsFlow is a platform which offers AI football predictions generated exclusively using Artificial Intelligence.",
    whatIsDesc2: "It offers AI Football Tips for more than 100+ football leagues including Premier League, La Liga, Serie A, Bundesliga, UEFA Champions League.",
    whatIsDesc3: "The best selection of betting predictions can be checked on our daily picks where AI selects the most accurate football tips.",
    whatIsDesc4: "Follow OddsFlow for football match tips, detailed AI predictions (ball possession, shots on goal, corners, H2H reports, odds etc.).",
  },
  "中文": {
    // Navbar
    home: "首页",
    predictions: "预测",
    leagues: "联赛",
    analysis: "分析",
    community: "社区",
    news: "新闻",
    pricing: "价格",
    login: "登录",
    getStarted: "开始使用",
    // Hero
    heroTitle1: "智能",
    heroTitle2: "足球赔率",
    heroTitle3: "分析",
    heroSubtitle: "利用 AI 驱动的洞察力实时分析足球赔率。通过我们先进的预测算法做出数据驱动的决策。",
    startAnalyzing: "免费开始分析",
    viewLiveOdds: "查看实时赔率",
    accuracyRate: "准确率",
    matchesAnalyzed: "已分析比赛",
    leaguesCovered: "覆盖联赛",
    realtimeUpdates: "实时更新",
    // Leagues Section
    globalCoverage: "全球覆盖",
    topLeagues: "我们覆盖的顶级联赛",
    leaguesSubtitle: "获取全球所有主要足球联赛的 AI 预测",
    matchesSeason: "场比赛/赛季",
    // Features Section
    whyOddsFlow: "为什么选择 OddsFlow",
    mostAdvanced: "最先进的",
    predictionEngine: "预测引擎",
    featuresSubtitle: "我们的 AI 分析数百万场历史比赛、实时数据和市场趋势，提供无与伦比的准确预测。",
    aiPoweredPerformance: "AI 驱动分析",
    aiPoweredDesc: "机器学习模型分析数千个数据点，提供精确预测。",
    realtimeTracking: "实时追踪",
    realtimeTrackingDesc: "即时监控多家博彩公司的赔率变动。",
    deepStatistics: "深度统计",
    deepStatisticsDesc: "访问球队统计、历史对战记录和历史表现数据。",
    smartAlerts: "智能提醒",
    smartAlertsDesc: "当出现价值机会或赔率大幅变动时获得通知。",
    aiDashboard: "AI 预测仪表板",
    live: "直播中",
    startingIn: "2小时后开始",
    aiConfidence: "AI 置信度",
    homeWin: "主胜",
    draw: "平局",
    awayWin: "客胜",
    // Live Predictions
    livePredictions: "实时预测",
    todaysTopPicks: "今日精选",
    predictionsSubtitle: "AI 分析的最高置信度比赛",
    viewAllPredictions: "查看所有预测",
    // CTA
    readyToMake: "准备好做出",
    smarterPredictions: "更明智的预测",
    ctaSubtitle: "加入数千名信任 OddsFlow 进行足球分析的用户。立即开始免费试用 - 无需信用卡。",
    startFreeTrial: "开始免费试用",
    contactSales: "联系销售",
    // Footer
    footerDesc: "AI 驱动的足球赔率分析，助您做出更明智的预测。通过实时洞察做出数据驱动的决策。",
    product: "产品",
    liveOdds: "实时赔率",
    statistics: "统计数据",
    apiAccess: "API 接口",
    company: "公司",
    aboutUs: "关于我们",
    blog: "博客",
    careers: "招聘",
    contact: "联系我们",
    legal: "法律",
    privacyPolicy: "隐私政策",
    termsOfService: "服务条款",
    responsibleGaming: "负责任博彩",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩有风险，请理性投注。",
    // AI Predictions Section
    aiPredictions: "AI 预测",
    upcomingMatches: "即将开始的比赛",
    aiPredictionsSubtitle: "AI 驱动的赛程预测",
    dateLeague: "日期 / 联赛",
    fixture: "对阵",
    prediction: "预测",
    confidence: "置信度",
    loading: "加载比赛中...",
    noMatches: "未找到预定比赛",
    // Why Choose Section
    whyChooseUs: "为什么选择我们",
    whyChooseTitle: "为什么选择 OddsFlow",
    whyChooseSubtitle: "体验 AI 驱动平台的与众不同",
    benefit1Title: "99.9% 在线率",
    benefit1Desc: "我们的平台 24/7 全天候运行，具有企业级可靠性",
    benefit2Title: "实时数据",
    benefit2Desc: "获取来自全球 50+ 博彩公司的即时更新",
    benefit3Title: "AI 准确性",
    benefit3Desc: "我们的模型达到 78%+ 的预测准确率",
    benefit4Title: "安全隐私",
    benefit4Desc: "银行级加密保护您的数据",
    benefit5Title: "24/7 支持",
    benefit5Desc: "专业支持团队全天候为您服务",
    benefit6Title: "退款保证",
    benefit6Desc: "30天无条件退款保证",
    // Trusted Section
    trustedBy: "用户信赖",
    trustedTitle: "数千用户的信赖之选",
    trustedSubtitle: "加入我们不断壮大的成功投注者社区",
    activeUsers: "活跃用户",
    countriesServed: "服务国家",
    predictionsDaily: "每日预测",
    satisfactionRate: "满意度",
    testimonial1: "OddsFlow 彻底改变了我的足球投注方式。AI 预测非常准确！",
    testimonial1Author: "Michael T.",
    testimonial1Role: "职业投注者",
    testimonial2: "实时赔率追踪每天为我节省数小时。这是我做过的最好投资。",
    testimonial2Author: "Sarah K.",
    testimonial2Role: "体育分析师",
    testimonial3: "终于有一个兑现承诺的平台。准确率无与伦比。",
    testimonial3Author: "James L.",
    testimonial3Role: "足球爱好者",
    // FAQ Section
    faqTitle: "常见问题解答",
    faqSubtitle: "关于 OddsFlow 您需要了解的一切",
    faq1Question: "AI 能预测足球比分吗？",
    faq1Answer: "可以！我们的 AI 足球预测器分析数百万场历史比赛、球员数据、球队状态和实时数据来预测足球比分。作为最准确的 AI 足球预测器，我们在英超、德甲、意甲、西甲和法甲达到 78%+ 的准确率。",
    faq2Question: "AI 投注有利可图吗？",
    faq2Answer: "使用经过验证的 AI 投注记录和透明的 AI 投注平台如 OddsFlow，AI 投注可以非常有利可图。我们的用户通过我们的欧洲足球 AI 贴士获得了稳定的回报，并有详细的业绩追踪来证明盈利性。",
    faq3Question: "让球投注有利可图吗？",
    faq3Answer: "如果操作得当，让球投注是最有利可图的投注策略之一。我们最好的 AI 让球分析系统分析让球预测，提供数据驱动的选择，在所有欧洲联赛中最大化价值。",
    faq4Question: "如何使用数据预测大小球？",
    faq4Answer: "我们的 AI 分析英超 2.5 球以上数据、球队进球模式、防守记录和历史数据来预测大小球结果。系统考虑主客场状态、历史对战记录和近期进球趋势等因素。",
    faq5Question: "你们覆盖哪些联赛？",
    faq5Answer: "我们提供所有主要欧洲联赛的 AI 预测：英超前 5 投注预测、德甲 AI 投注预测、意甲人工智能选择、西甲前 5 投注预测、法甲 AI 预测模型和欧冠投注分析 AI。",
    faq6Question: "OddsFlow 与其他 AI 预测器相比准确率如何？",
    faq6Answer: "OddsFlow 被公认为最准确的 AI 足球预测器，拥有经过验证的 AI 投注记录。与其他平台不同，我们提供透明的 AI 投注结果和完整的业绩历史，使我们成为最安全的 AI 足球贴士提供商。",
    faq7Question: "你们提供哪些类型的预测？",
    faq7Answer: "我们提供英超今日 1x2 预测、英超平局预测、让球预测、2.5 球以上数据和完整比赛分析。我们的欧洲足球 AI 贴士涵盖所有主要投注市场。",
    // What is OddsFlow
    whatIsOddsFlow: "什么是 OddsFlow？",
    whatIsDesc1: "OddsFlow 是一个完全使用人工智能生成足球预测的平台。",
    whatIsDesc2: "提供 100+ 足球联赛的 AI 预测，包括英超、西甲、意甲、德甲、欧冠等。",
    whatIsDesc3: "每日精选中可查看最佳投注预测，AI 选出最准确的足球贴士。",
    whatIsDesc4: "关注 OddsFlow 获取比赛贴士、详细 AI 预测（控球率、射门、角球、H2H 报告、赔率等）。",
  },
  "繁體": {
    // Navbar
    home: "首頁",
    predictions: "預測",
    leagues: "聯賽",
    analysis: "分析",
    community: "社區",
    news: "新聞",
    pricing: "價格",
    login: "登入",
    getStarted: "開始使用",
    // Hero
    heroTitle1: "智能",
    heroTitle2: "足球賠率",
    heroTitle3: "分析",
    heroSubtitle: "利用 AI 驅動的洞察力即時分析足球賠率。通過我們先進的預測演算法做出數據驅動的決策。",
    startAnalyzing: "免費開始分析",
    viewLiveOdds: "查看即時賠率",
    accuracyRate: "準確率",
    matchesAnalyzed: "已分析比賽",
    leaguesCovered: "覆蓋聯賽",
    realtimeUpdates: "即時更新",
    // Leagues Section
    globalCoverage: "全球覆蓋",
    topLeagues: "我們覆蓋的頂級聯賽",
    leaguesSubtitle: "獲取全球所有主要足球聯賽的 AI 預測",
    matchesSeason: "場比賽/賽季",
    // Features Section
    whyOddsFlow: "為什麼選擇 OddsFlow",
    mostAdvanced: "最先進的",
    predictionEngine: "預測引擎",
    featuresSubtitle: "我們的 AI 分析數百萬場歷史比賽、即時數據和市場趨勢，提供無與倫比的準確預測。",
    aiPoweredPerformance: "AI 驅動分析",
    aiPoweredDesc: "機器學習模型分析數千個數據點，提供精確預測。",
    realtimeTracking: "即時追蹤",
    realtimeTrackingDesc: "即時監控多家博彩公司的賠率變動。",
    deepStatistics: "深度統計",
    deepStatisticsDesc: "訪問球隊統計、歷史對戰記錄和歷史表現數據。",
    smartAlerts: "智能提醒",
    smartAlertsDesc: "當出現價值機會或賠率大幅變動時獲得通知。",
    aiDashboard: "AI 預測儀表板",
    live: "直播中",
    startingIn: "2小時後開始",
    aiConfidence: "AI 置信度",
    homeWin: "主勝",
    draw: "平局",
    awayWin: "客勝",
    // Live Predictions
    livePredictions: "即時預測",
    todaysTopPicks: "今日精選",
    predictionsSubtitle: "AI 分析的最高置信度比賽",
    viewAllPredictions: "查看所有預測",
    // CTA
    readyToMake: "準備好做出",
    smarterPredictions: "更明智的預測",
    ctaSubtitle: "加入數千名信任 OddsFlow 進行足球分析的用戶。立即開始免費試用 - 無需信用卡。",
    startFreeTrial: "開始免費試用",
    contactSales: "聯繫銷售",
    // Footer
    footerDesc: "AI 驅動的足球賠率分析，助您做出更明智的預測。通過即時洞察做出數據驅動的決策。",
    product: "產品",
    liveOdds: "即時賠率",
    statistics: "統計數據",
    apiAccess: "API 接口",
    company: "公司",
    aboutUs: "關於我們",
    blog: "部落格",
    careers: "招聘",
    contact: "聯繫我們",
    legal: "法律",
    privacyPolicy: "隱私政策",
    termsOfService: "服務條款",
    responsibleGaming: "負責任博彩",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩有風險，請理性投注。",
    // AI Predictions Section
    aiPredictions: "AI 預測",
    upcomingMatches: "即將開始的比賽",
    aiPredictionsSubtitle: "AI 驅動的賽程預測",
    dateLeague: "日期 / 聯賽",
    fixture: "對陣",
    prediction: "預測",
    confidence: "置信度",
    loading: "載入比賽中...",
    noMatches: "未找到預定比賽",
    // Why Choose Section
    whyChooseUs: "為什麼選擇我們",
    whyChooseTitle: "為什麼選擇 OddsFlow",
    whyChooseSubtitle: "體驗 AI 驅動平台的與眾不同",
    benefit1Title: "99.9% 在線率",
    benefit1Desc: "我們的平台 24/7 全天候運行，具有企業級可靠性",
    benefit2Title: "即時數據",
    benefit2Desc: "獲取來自全球 50+ 博彩公司的即時更新",
    benefit3Title: "AI 準確性",
    benefit3Desc: "我們的模型達到 78%+ 的預測準確率",
    benefit4Title: "安全隱私",
    benefit4Desc: "銀行級加密保護您的數據",
    benefit5Title: "24/7 支援",
    benefit5Desc: "專業支援團隊全天候為您服務",
    benefit6Title: "退款保證",
    benefit6Desc: "30天無條件退款保證",
    // Trusted Section
    trustedBy: "用戶信賴",
    trustedTitle: "數千用戶的信賴之選",
    trustedSubtitle: "加入我們不斷壯大的成功投注者社區",
    activeUsers: "活躍用戶",
    countriesServed: "服務國家",
    predictionsDaily: "每日預測",
    satisfactionRate: "滿意度",
    testimonial1: "OddsFlow 徹底改變了我的足球投注方式。AI 預測非常準確！",
    testimonial1Author: "Michael T.",
    testimonial1Role: "職業投注者",
    testimonial2: "即時賠率追蹤每天為我節省數小時。這是我做過的最好投資。",
    testimonial2Author: "Sarah K.",
    testimonial2Role: "體育分析師",
    testimonial3: "終於有一個兌現承諾的平台。準確率無與倫比。",
    testimonial3Author: "James L.",
    testimonial3Role: "足球愛好者",
    // FAQ Section
    faqTitle: "常見問題解答",
    faqSubtitle: "關於 OddsFlow 您需要了解的一切",
    faq1Question: "AI 能預測足球比分嗎？",
    faq1Answer: "可以！我們的 AI 足球預測器分析數百萬場歷史比賽、球員數據、球隊狀態和即時數據來預測足球比分。作為最準確的 AI 足球預測器，我們在英超、德甲、意甲、西甲和法甲達到 78%+ 的準確率。",
    faq2Question: "AI 投注有利可圖嗎？",
    faq2Answer: "使用經過驗證的 AI 投注記錄和透明的 AI 投注平台如 OddsFlow，AI 投注可以非常有利可圖。我們的用戶通過我們的歐洲足球 AI 貼士獲得了穩定的回報，並有詳細的業績追蹤來證明盈利性。",
    faq3Question: "讓球投注有利可圖嗎？",
    faq3Answer: "如果操作得當，讓球投注是最有利可圖的投注策略之一。我們最好的 AI 讓球分析系統分析讓球預測，提供數據驅動的選擇，在所有歐洲聯賽中最大化價值。",
    faq4Question: "如何使用數據預測大小球？",
    faq4Answer: "我們的 AI 分析英超 2.5 球以上數據、球隊進球模式、防守記錄和歷史數據來預測大小球結果。系統考慮主客場狀態、歷史對戰記錄和近期進球趨勢等因素。",
    faq5Question: "你們覆蓋哪些聯賽？",
    faq5Answer: "我們提供所有主要歐洲聯賽的 AI 預測：英超前 5 投注預測、德甲 AI 投注預測、意甲人工智慧選擇、西甲前 5 投注預測、法甲 AI 預測模型和歐冠投注分析 AI。",
    faq6Question: "OddsFlow 與其他 AI 預測器相比準確率如何？",
    faq6Answer: "OddsFlow 被公認為最準確的 AI 足球預測器，擁有經過驗證的 AI 投注記錄。與其他平台不同，我們提供透明的 AI 投注結果和完整的業績歷史，使我們成為最安全的 AI 足球貼士提供商。",
    faq7Question: "你們提供哪些類型的預測？",
    faq7Answer: "我們提供英超今日 1x2 預測、英超平局預測、讓球預測、2.5 球以上數據和完整比賽分析。我們的歐洲足球 AI 貼士涵蓋所有主要投注市場。",
    // What is OddsFlow
    whatIsOddsFlow: "什麼是 OddsFlow？",
    whatIsDesc1: "OddsFlow 是一個完全使用人工智慧生成足球預測的平台。",
    whatIsDesc2: "提供 100+ 足球聯賽的 AI 預測，包括英超、西甲、意甲、德甲、歐冠等。",
    whatIsDesc3: "每日精選中可查看最佳投注預測，AI 選出最準確的足球貼士。",
    whatIsDesc4: "關注 OddsFlow 獲取比賽貼士、詳細 AI 預測（控球率、射門、角球、H2H 報告、賠率等）。",
  },
  ES: {
    home: "Inicio",
    predictions: "Predicciones",
    leagues: "Ligas",
    analysis: "Análisis",
    community: "Comunidad",
    news: "Noticias",
    pricing: "Precios",
    login: "Iniciar Sesión",
    getStarted: "Comenzar",
    heroTitle1: "Análisis",
    heroTitle2: "Inteligente de",
    heroTitle3: "Cuotas de Fútbol",
    heroSubtitle: "Aproveche los conocimientos impulsados por IA para analizar las cuotas de fútbol en tiempo real. Tome decisiones basadas en datos con nuestros algoritmos de predicción avanzados.",
    startAnalyzing: "Comenzar Gratis",
    viewLiveOdds: "Ver Cuotas en Vivo",
    accuracyRate: "Tasa de Precisión",
    matchesAnalyzed: "Partidos Analizados",
    leaguesCovered: "Ligas Cubiertas",
    realtimeUpdates: "Actualizaciones en Tiempo Real",
    globalCoverage: "Cobertura Global",
    topLeagues: "Principales Ligas que Cubrimos",
    leaguesSubtitle: "Obtenga predicciones de IA para todas las principales ligas de fútbol del mundo",
    matchesSeason: "partidos/temporada",
    whyOddsFlow: "Por qué OddsFlow",
    mostAdvanced: "El Motor de",
    predictionEngine: "Predicción Más Avanzado",
    featuresSubtitle: "Nuestra IA analiza millones de partidos históricos, datos en tiempo real y tendencias del mercado para ofrecer predicciones con una precisión inigualable.",
    aiPoweredPerformance: "Análisis Impulsado por IA",
    aiPoweredDesc: "Los modelos de aprendizaje automático analizan miles de puntos de datos para predicciones precisas.",
    realtimeTracking: "Seguimiento en Tiempo Real",
    realtimeTrackingDesc: "Monitoree los movimientos de cuotas en las casas de apuestas con actualizaciones instantáneas.",
    deepStatistics: "Estadísticas Profundas",
    deepStatisticsDesc: "Acceda a estadísticas de equipos, registros de enfrentamientos directos y datos de rendimiento histórico.",
    smartAlerts: "Alertas Inteligentes",
    smartAlertsDesc: "Reciba notificaciones cuando surjan oportunidades de valor o las cuotas cambien significativamente.",
    aiDashboard: "Panel de Predicción IA",
    live: "EN VIVO",
    startingIn: "Comienza en 2h",
    aiConfidence: "Confianza IA",
    homeWin: "Victoria Local",
    draw: "Empate",
    awayWin: "Victoria Visitante",
    livePredictions: "Predicciones en Vivo",
    todaysTopPicks: "Mejores Selecciones de Hoy",
    predictionsSubtitle: "Partidos analizados por IA con las puntuaciones de confianza más altas",
    viewAllPredictions: "Ver Todas las Predicciones",
    readyToMake: "¿Listo para Hacer",
    smarterPredictions: "Predicciones Más Inteligentes",
    ctaSubtitle: "Únase a miles de usuarios que confían en OddsFlow para su análisis de fútbol. Comience su prueba gratuita hoy — sin tarjeta de crédito.",
    startFreeTrial: "Iniciar Prueba Gratuita",
    contactSales: "Contactar Ventas",
    footerDesc: "Análisis de cuotas de fútbol impulsado por IA para predicciones más inteligentes.",
    product: "Producto",
    liveOdds: "Cuotas en Vivo",
    statistics: "Estadísticas",
    apiAccess: "Acceso API",
    company: "Empresa",
    aboutUs: "Sobre Nosotros",
    blog: "Blog",
    careers: "Carreras",
    contact: "Contacto",
    legal: "Legal",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    responsibleGaming: "Juego Responsable",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juegue responsablemente.",
    // AI Predictions Section
    aiPredictions: "Predicciones IA",
    upcomingMatches: "Partidos Programados",
    aiPredictionsSubtitle: "Predicciones impulsadas por IA para partidos programados",
    dateLeague: "Fecha / Liga",
    fixture: "Partido",
    prediction: "Prediccion",
    confidence: "Confianza",
    loading: "Cargando partidos...",
    noMatches: "No se encontraron partidos programados",
  },
  PT: {
    home: "Início",
    predictions: "Previsões",
    leagues: "Ligas",
    analysis: "Análise",
    community: "Comunidade",
    news: "Notícias",
    pricing: "Preços",
    login: "Entrar",
    getStarted: "Começar",
    heroTitle1: "Análise",
    heroTitle2: "Inteligente de",
    heroTitle3: "Odds de Futebol",
    heroSubtitle: "Aproveite insights impulsionados por IA para analisar odds de futebol em tempo real. Tome decisões baseadas em dados com nossos algoritmos avançados de previsão.",
    startAnalyzing: "Começar Grátis",
    viewLiveOdds: "Ver Odds ao Vivo",
    accuracyRate: "Taxa de Precisão",
    matchesAnalyzed: "Partidas Analisadas",
    leaguesCovered: "Ligas Cobertas",
    realtimeUpdates: "Atualizações em Tempo Real",
    globalCoverage: "Cobertura Global",
    topLeagues: "Principais Ligas que Cobrimos",
    leaguesSubtitle: "Obtenha previsões de IA para todas as principais ligas de futebol do mundo",
    matchesSeason: "partidas/temporada",
    whyOddsFlow: "Por que OddsFlow",
    mostAdvanced: "O Motor de",
    predictionEngine: "Previsão Mais Avançado",
    featuresSubtitle: "Nossa IA analisa milhões de partidas históricas, dados em tempo real e tendências de mercado para entregar previsões com precisão incomparável.",
    aiPoweredPerformance: "Análise com IA",
    aiPoweredDesc: "Modelos de machine learning analisam milhares de pontos de dados para previsões precisas.",
    realtimeTracking: "Rastreamento em Tempo Real",
    realtimeTrackingDesc: "Monitore movimentos de odds em casas de apostas com atualizações instantâneas.",
    deepStatistics: "Estatísticas Profundas",
    deepStatisticsDesc: "Acesse estatísticas de equipes, histórico de confrontos diretos e dados de desempenho.",
    smartAlerts: "Alertas Inteligentes",
    smartAlertsDesc: "Seja notificado quando oportunidades de valor surgirem ou odds mudarem significativamente.",
    aiDashboard: "Painel de Previsão IA",
    live: "AO VIVO",
    startingIn: "Começa em 2h",
    aiConfidence: "Confiança IA",
    homeWin: "Vitória Casa",
    draw: "Empate",
    awayWin: "Vitória Fora",
    livePredictions: "Previsões ao Vivo",
    todaysTopPicks: "Melhores Escolhas de Hoje",
    predictionsSubtitle: "Partidas analisadas por IA com as maiores pontuações de confiança",
    viewAllPredictions: "Ver Todas as Previsões",
    readyToMake: "Pronto para Fazer",
    smarterPredictions: "Previsões Mais Inteligentes",
    ctaSubtitle: "Junte-se a milhares de usuários que confiam no OddsFlow para análise de futebol. Comece seu teste gratuito hoje — sem cartão de crédito.",
    startFreeTrial: "Iniciar Teste Gratuito",
    contactSales: "Contatar Vendas",
    footerDesc: "Análise de odds de futebol com IA para previsões mais inteligentes.",
    product: "Produto",
    liveOdds: "Odds ao Vivo",
    statistics: "Estatísticas",
    apiAccess: "Acesso API",
    company: "Empresa",
    aboutUs: "Sobre Nós",
    blog: "Blog",
    careers: "Carreiras",
    contact: "Contato",
    legal: "Legal",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    responsibleGaming: "Jogo Responsável",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    // AI Predictions Section
    aiPredictions: "Previsoes IA",
    upcomingMatches: "Partidas Programadas",
    aiPredictionsSubtitle: "Previsoes alimentadas por IA para partidas programadas",
    dateLeague: "Data / Liga",
    fixture: "Partida",
    prediction: "Previsao",
    confidence: "Confianca",
    loading: "Carregando partidas...",
    noMatches: "Nenhuma partida programada encontrada",
  },
  JA: {
    home: "ホーム",
    predictions: "予測",
    leagues: "リーグ",
    analysis: "分析",
    community: "コミュニティ",
    news: "ニュース",
    pricing: "料金",
    login: "ログイン",
    getStarted: "始める",
    heroTitle1: "スマート",
    heroTitle2: "サッカーオッズ",
    heroTitle3: "分析",
    heroSubtitle: "AIを活用した洞察でサッカーオッズをリアルタイムで分析。高度な予測アルゴリズムでデータドリブンな意思決定を。",
    startAnalyzing: "無料で分析開始",
    viewLiveOdds: "ライブオッズを見る",
    accuracyRate: "的中率",
    matchesAnalyzed: "分析試合数",
    leaguesCovered: "対応リーグ",
    realtimeUpdates: "リアルタイム更新",
    globalCoverage: "グローバル対応",
    topLeagues: "対応トップリーグ",
    leaguesSubtitle: "世界の主要サッカーリーグのAI予測を取得",
    matchesSeason: "試合/シーズン",
    whyOddsFlow: "OddsFlowを選ぶ理由",
    mostAdvanced: "最先端の",
    predictionEngine: "予測エンジン",
    featuresSubtitle: "AIが数百万の過去試合、リアルタイムデータ、市場トレンドを分析し、比類なき精度の予測を提供。",
    aiPoweredPerformance: "AI駆動分析",
    aiPoweredDesc: "機械学習モデルが数千のデータポイントを分析し、精密な予測を提供。",
    realtimeTracking: "リアルタイム追跡",
    realtimeTrackingDesc: "複数のブックメーカーのオッズ変動を即座に監視。",
    deepStatistics: "詳細統計",
    deepStatisticsDesc: "チーム統計、対戦成績、過去のパフォーマンスデータにアクセス。",
    smartAlerts: "スマートアラート",
    smartAlertsDesc: "バリュー機会やオッズの大幅な変動時に通知を受け取る。",
    aiDashboard: "AI予測ダッシュボード",
    live: "ライブ",
    startingIn: "2時間後開始",
    aiConfidence: "AI信頼度",
    homeWin: "ホーム勝利",
    draw: "引き分け",
    awayWin: "アウェイ勝利",
    livePredictions: "ライブ予測",
    todaysTopPicks: "今日のトップピック",
    predictionsSubtitle: "最高信頼度のAI分析試合",
    viewAllPredictions: "すべての予測を見る",
    readyToMake: "準備はできましたか？",
    smarterPredictions: "より賢い予測を",
    ctaSubtitle: "OddsFlowを信頼する数千のユーザーに参加。今すぐ無料トライアルを開始 — クレジットカード不要。",
    startFreeTrial: "無料トライアル開始",
    contactSales: "営業に連絡",
    footerDesc: "よりスマートな予測のためのAI駆動サッカーオッズ分析。",
    product: "製品",
    liveOdds: "ライブオッズ",
    statistics: "統計",
    apiAccess: "APIアクセス",
    company: "会社",
    aboutUs: "会社概要",
    blog: "ブログ",
    careers: "採用",
    contact: "お問い合わせ",
    legal: "法的情報",
    privacyPolicy: "プライバシーポリシー",
    termsOfService: "利用規約",
    responsibleGaming: "責任あるギャンブル",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
    // AI Predictions Section
    aiPredictions: "AI予測",
    upcomingMatches: "予定試合",
    aiPredictionsSubtitle: "予定試合のAI予測",
    dateLeague: "日付 / リーグ",
    fixture: "対戦",
    prediction: "予測",
    confidence: "信頼度",
    loading: "試合を読み込み中...",
    noMatches: "予定試合が見つかりません",
  },
  KO: {
    home: "홈",
    predictions: "예측",
    leagues: "리그",
    analysis: "분석",
    community: "커뮤니티",
    news: "뉴스",
    pricing: "가격",
    login: "로그인",
    getStarted: "시작하기",
    heroTitle1: "스마트",
    heroTitle2: "축구 배당률",
    heroTitle3: "분석",
    heroSubtitle: "AI 기반 인사이트를 활용하여 실시간으로 축구 배당률을 분석하세요. 고급 예측 알고리즘으로 데이터 기반 의사결정을 내리세요.",
    startAnalyzing: "무료 분석 시작",
    viewLiveOdds: "실시간 배당률 보기",
    accuracyRate: "정확도",
    matchesAnalyzed: "분석된 경기",
    leaguesCovered: "지원 리그",
    realtimeUpdates: "실시간 업데이트",
    globalCoverage: "글로벌 커버리지",
    topLeagues: "지원하는 주요 리그",
    leaguesSubtitle: "전 세계 주요 축구 리그의 AI 예측을 받아보세요",
    matchesSeason: "경기/시즌",
    whyOddsFlow: "OddsFlow를 선택하는 이유",
    mostAdvanced: "가장 진보된",
    predictionEngine: "예측 엔진",
    featuresSubtitle: "AI가 수백만 개의 과거 경기, 실시간 데이터 및 시장 동향을 분석하여 비교할 수 없는 정확도의 예측을 제공합니다.",
    aiPoweredPerformance: "AI 기반 분석",
    aiPoweredDesc: "머신러닝 모델이 수천 개의 데이터 포인트를 분석하여 정확한 예측을 제공합니다.",
    realtimeTracking: "실시간 추적",
    realtimeTrackingDesc: "여러 북메이커의 배당률 변동을 즉시 모니터링합니다.",
    deepStatistics: "심층 통계",
    deepStatisticsDesc: "팀 통계, 상대 전적 및 과거 성과 데이터에 접근하세요.",
    smartAlerts: "스마트 알림",
    smartAlertsDesc: "가치 기회가 발생하거나 배당률이 크게 변동할 때 알림을 받으세요.",
    aiDashboard: "AI 예측 대시보드",
    live: "라이브",
    startingIn: "2시간 후 시작",
    aiConfidence: "AI 신뢰도",
    homeWin: "홈 승",
    draw: "무승부",
    awayWin: "원정 승",
    livePredictions: "실시간 예측",
    todaysTopPicks: "오늘의 추천",
    predictionsSubtitle: "가장 높은 신뢰도의 AI 분석 경기",
    viewAllPredictions: "모든 예측 보기",
    readyToMake: "준비되셨나요?",
    smarterPredictions: "더 스마트한 예측을",
    ctaSubtitle: "OddsFlow를 신뢰하는 수천 명의 사용자와 함께하세요. 오늘 무료 체험을 시작하세요 — 신용카드 불필요.",
    startFreeTrial: "무료 체험 시작",
    contactSales: "영업팀 연락",
    footerDesc: "더 스마트한 예측을 위한 AI 기반 축구 배당률 분석.",
    product: "제품",
    liveOdds: "실시간 배당률",
    statistics: "통계",
    apiAccess: "API 접근",
    company: "회사",
    aboutUs: "회사 소개",
    blog: "블로그",
    careers: "채용",
    contact: "연락처",
    legal: "법적 정보",
    privacyPolicy: "개인정보 처리방침",
    termsOfService: "서비스 약관",
    responsibleGaming: "책임감 있는 게임",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
    // AI Predictions Section
    aiPredictions: "AI 예측",
    upcomingMatches: "예정된 경기",
    aiPredictionsSubtitle: "예정된 경기에 대한 AI 기반 예측",
    dateLeague: "날짜 / 리그",
    fixture: "경기",
    prediction: "예측",
    confidence: "신뢰도",
    loading: "경기 로딩 중...",
    noMatches: "예정된 경기가 없습니다",
  },
  DE: {
    home: "Startseite",
    predictions: "Vorhersagen",
    leagues: "Ligen",
    analysis: "Analyse",
    community: "Community",
    news: "Nachrichten",
    pricing: "Preise",
    login: "Anmelden",
    getStarted: "Loslegen",
    heroTitle1: "Intelligente",
    heroTitle2: "Fußball-Quoten",
    heroTitle3: "Analyse",
    heroSubtitle: "Nutzen Sie KI-gestützte Erkenntnisse, um Fußballquoten in Echtzeit zu analysieren. Treffen Sie datengesteuerte Entscheidungen mit unseren fortschrittlichen Vorhersagealgorithmen.",
    startAnalyzing: "Kostenlos starten",
    viewLiveOdds: "Live-Quoten ansehen",
    accuracyRate: "Genauigkeitsrate",
    matchesAnalyzed: "Analysierte Spiele",
    leaguesCovered: "Abgedeckte Ligen",
    realtimeUpdates: "Echtzeit-Updates",
    globalCoverage: "Globale Abdeckung",
    topLeagues: "Top-Ligen die wir abdecken",
    leaguesSubtitle: "Erhalten Sie KI-Vorhersagen für alle großen Fußballligen weltweit",
    matchesSeason: "Spiele/Saison",
    whyOddsFlow: "Warum OddsFlow",
    mostAdvanced: "Die fortschrittlichste",
    predictionEngine: "Vorhersage-Engine",
    featuresSubtitle: "Unsere KI analysiert Millionen historischer Spiele, Echtzeitdaten und Markttrends, um Vorhersagen mit unübertroffener Genauigkeit zu liefern.",
    aiPoweredPerformance: "KI-gestützte Analyse",
    aiPoweredDesc: "Machine-Learning-Modelle analysieren tausende Datenpunkte für präzise Vorhersagen.",
    realtimeTracking: "Echtzeit-Tracking",
    realtimeTrackingDesc: "Überwachen Sie Quotenbewegungen bei Buchmachern mit sofortigen Updates.",
    deepStatistics: "Tiefe Statistiken",
    deepStatisticsDesc: "Zugriff auf Teamstatistiken, direkte Vergleiche und historische Leistungsdaten.",
    smartAlerts: "Intelligente Alarme",
    smartAlertsDesc: "Werden Sie benachrichtigt, wenn Value-Chancen entstehen oder sich Quoten erheblich ändern.",
    aiDashboard: "KI-Vorhersage-Dashboard",
    live: "LIVE",
    startingIn: "Beginnt in 2h",
    aiConfidence: "KI-Konfidenz",
    homeWin: "Heimsieg",
    draw: "Unentschieden",
    awayWin: "Auswärtssieg",
    livePredictions: "Live-Vorhersagen",
    todaysTopPicks: "Heutige Top-Tipps",
    predictionsSubtitle: "KI-analysierte Spiele mit den höchsten Konfidenzwerten",
    viewAllPredictions: "Alle Vorhersagen ansehen",
    readyToMake: "Bereit für",
    smarterPredictions: "Klügere Vorhersagen",
    ctaSubtitle: "Schließen Sie sich tausenden Nutzern an, die OddsFlow für ihre Fußballanalyse vertrauen. Starten Sie heute Ihre kostenlose Testversion — keine Kreditkarte erforderlich.",
    startFreeTrial: "Kostenlos testen",
    contactSales: "Vertrieb kontaktieren",
    footerDesc: "KI-gestützte Fußballquoten-Analyse für klügere Vorhersagen.",
    product: "Produkt",
    liveOdds: "Live-Quoten",
    statistics: "Statistiken",
    apiAccess: "API-Zugang",
    company: "Unternehmen",
    aboutUs: "Über uns",
    blog: "Blog",
    careers: "Karriere",
    contact: "Kontakt",
    legal: "Rechtliches",
    privacyPolicy: "Datenschutz",
    termsOfService: "Nutzungsbedingungen",
    responsibleGaming: "Verantwortungsvolles Spielen",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    // AI Predictions Section
    aiPredictions: "KI-Vorhersagen",
    upcomingMatches: "Geplante Spiele",
    aiPredictionsSubtitle: "KI-gestutzte Vorhersagen fur geplante Spiele",
    dateLeague: "Datum / Liga",
    fixture: "Spiel",
    prediction: "Vorhersage",
    confidence: "Konfidenz",
    loading: "Spiele werden geladen...",
    noMatches: "Keine geplanten Spiele gefunden",
  },
  FR: {
    home: "Accueil",
    predictions: "Prédictions",
    leagues: "Ligues",
    analysis: "Analyse",
    community: "Communauté",
    news: "Actualités",
    pricing: "Tarifs",
    login: "Connexion",
    getStarted: "Commencer",
    heroTitle1: "Analyse",
    heroTitle2: "Intelligente des",
    heroTitle3: "Cotes Football",
    heroSubtitle: "Exploitez les insights propulsés par l'IA pour analyser les cotes de football en temps réel. Prenez des décisions basées sur les données avec nos algorithmes de prédiction avancés.",
    startAnalyzing: "Commencer Gratuitement",
    viewLiveOdds: "Voir les Cotes en Direct",
    accuracyRate: "Taux de Précision",
    matchesAnalyzed: "Matchs Analysés",
    leaguesCovered: "Ligues Couvertes",
    realtimeUpdates: "Mises à Jour en Temps Réel",
    globalCoverage: "Couverture Mondiale",
    topLeagues: "Principales Ligues Couvertes",
    leaguesSubtitle: "Obtenez des prédictions IA pour toutes les principales ligues de football du monde",
    matchesSeason: "matchs/saison",
    whyOddsFlow: "Pourquoi OddsFlow",
    mostAdvanced: "Le Moteur de",
    predictionEngine: "Prédiction le Plus Avancé",
    featuresSubtitle: "Notre IA analyse des millions de matchs historiques, des données en temps réel et des tendances du marché pour fournir des prédictions d'une précision inégalée.",
    aiPoweredPerformance: "Analyse Propulsée par l'IA",
    aiPoweredDesc: "Les modèles d'apprentissage automatique analysent des milliers de points de données pour des prédictions précises.",
    realtimeTracking: "Suivi en Temps Réel",
    realtimeTrackingDesc: "Surveillez les mouvements de cotes chez les bookmakers avec des mises à jour instantanées.",
    deepStatistics: "Statistiques Approfondies",
    deepStatisticsDesc: "Accédez aux statistiques des équipes, aux confrontations directes et aux données de performance historiques.",
    smartAlerts: "Alertes Intelligentes",
    smartAlertsDesc: "Soyez notifié lorsque des opportunités de valeur apparaissent ou que les cotes changent significativement.",
    aiDashboard: "Tableau de Bord IA",
    live: "EN DIRECT",
    startingIn: "Commence dans 2h",
    aiConfidence: "Confiance IA",
    homeWin: "Victoire Domicile",
    draw: "Match Nul",
    awayWin: "Victoire Extérieur",
    livePredictions: "Prédictions en Direct",
    todaysTopPicks: "Meilleurs Choix du Jour",
    predictionsSubtitle: "Matchs analysés par l'IA avec les scores de confiance les plus élevés",
    viewAllPredictions: "Voir Toutes les Prédictions",
    readyToMake: "Prêt à Faire des",
    smarterPredictions: "Prédictions Plus Intelligentes",
    ctaSubtitle: "Rejoignez des milliers d'utilisateurs qui font confiance à OddsFlow pour leur analyse de football. Commencez votre essai gratuit aujourd'hui — sans carte de crédit.",
    startFreeTrial: "Essai Gratuit",
    contactSales: "Contacter les Ventes",
    footerDesc: "Analyse de cotes de football propulsée par l'IA pour des prédictions plus intelligentes.",
    product: "Produit",
    liveOdds: "Cotes en Direct",
    statistics: "Statistiques",
    apiAccess: "Accès API",
    company: "Entreprise",
    aboutUs: "À Propos",
    blog: "Blog",
    careers: "Carrières",
    contact: "Contact",
    legal: "Mentions Légales",
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'Utilisation",
    responsibleGaming: "Jeu Responsable",
    allRightsReserved: "Tous droits réservés.",
    gamblingWarning: "Le jeu comporte des risques. Veuillez jouer de manière responsable.",
    // AI Predictions Section
    aiPredictions: "Predictions IA",
    upcomingMatches: "Matchs Programmes",
    aiPredictionsSubtitle: "Predictions alimentees par l'IA pour les matchs programmes",
    dateLeague: "Date / Ligue",
    fixture: "Match",
    prediction: "Prediction",
    confidence: "Confiance",
    loading: "Chargement des matchs...",
    noMatches: "Aucun match programme trouve",
  },
};

// ============ Language Context ============
type LanguageContextType = {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState("EN");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setLang(savedLang);
  }, []);

  // Save language to localStorage when changed
  const handleSetLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('oddsflow_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["EN"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

// ============ Language Switcher ============
function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLanguage();

  const languages = [
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

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer"
      >
        <span>{currentLang.flag}</span>
        <span className="font-medium">{currentLang.code}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${
                  lang === l.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'
                }`}
              >
                <span className="text-lg">{l.flag}</span>
                <span className="font-medium">{l.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============ Navigation ============
function Navbar() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { href: '/', label: t('home'), active: true },
    { href: '/predictions', label: t('predictions') },
    { href: '/leagues', label: t('leagues') },
    { href: '/performance', label: t('performance') },
    { href: '/community', label: t('community') },
    { href: '/news', label: t('news') },
    { href: '/pricing', label: t('pricing') },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${link.active ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side - Language, User, Menu Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />

              {user ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer hidden sm:block">{t('getStarted')}</Link>
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
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

              {/* Mobile Login/Signup */}
              {!user && (
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============ Hero Section ============
function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/homepage/homepage_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 via-transparent to-cyan-900/20" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20 pb-24">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
          <span className="text-white">{t('heroTitle1')}</span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">{t('heroTitle2')}</span>
          <br />
          <span className="text-white">{t('heroTitle3')}</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">{t('heroSubtitle')}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            { value: '94.2%', label: t('accuracyRate') },
            { value: '10K+', label: t('matchesAnalyzed') },
            { value: '50+', label: t('leaguesCovered') },
            { value: '24/7', label: t('realtimeUpdates') },
          ].map((stat, index) => (
            <div key={index} className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-2 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/get-started" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 cursor-pointer text-center">{t('startAnalyzing')}</Link>
          <Link href="/predictions" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer text-center">{t('viewLiveOdds')}</Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <MatchTicker />
      </div>
    </section>
  );
}

// ============ Match Ticker ============
interface TickerMatch {
  home_name: string;
  away_name: string;
  home_logo: string;
  away_logo: string;
}

function MatchTicker() {
  const [matches, setMatches] = useState<TickerMatch[]>([]);

  useEffect(() => {
    async function fetchMatches() {
      const { data, error } = await supabase
        .from('prematches')
        .select('home_name, away_name, home_logo, away_logo')
        .eq('type', 'Scheduled')
        .limit(15);

      if (!error && data) {
        setMatches(data);
      }
    }
    fetchMatches();
  }, []);

  const predictions = ['1', '2', '1X', 'X2', 'Over 2.5', 'Under 2.5', '1', '2', 'BTTS'];
  const colors = ['bg-emerald-500 text-black', 'bg-cyan-500 text-black', 'bg-yellow-400 text-black', 'bg-red-500 text-white', 'bg-blue-500 text-white'];

  const getRandomPrediction = (index: number) => predictions[index % predictions.length];
  const getRandomColor = (index: number) => colors[index % colors.length];

  const allMatches = [...matches, ...matches];

  if (matches.length === 0) return null;

  // Shorten team name
  const shortenName = (name: string) => {
    if (name.length > 12) {
      return name.split(' ')[0];
    }
    return name;
  };

  return (
    <div className="relative bg-gradient-to-r from-black via-gray-900/95 to-black backdrop-blur-sm border-t border-emerald-500/20 py-4 overflow-hidden">
      {/* Glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-full bg-emerald-500/10 blur-3xl animate-pulse" />
        <div className="absolute top-0 left-1/2 w-32 h-full bg-cyan-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 right-1/4 w-32 h-full bg-emerald-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="flex animate-ticker relative z-10">
        {allMatches.map((match, index) => (
          <div key={index} className="flex items-center gap-8 px-8 whitespace-nowrap border-r border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              {/* Green indicator */}
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />

              {/* Home team */}
              <div className="flex items-center gap-2">
                {match.home_logo && (
                  <div className="w-6 h-6 rounded-full bg-white p-0.5 flex items-center justify-center">
                    <img src={match.home_logo} alt="" className="w-5 h-5 object-contain" />
                  </div>
                )}
                <span className="text-emerald-400 font-medium">{shortenName(match.home_name)}</span>
              </div>

              <span className="text-gray-600 text-sm font-medium">vs</span>

              {/* Away team */}
              <div className="flex items-center gap-2">
                {match.away_logo && (
                  <div className="w-6 h-6 rounded-full bg-white p-0.5 flex items-center justify-center">
                    <img src={match.away_logo} alt="" className="w-5 h-5 object-contain" />
                  </div>
                )}
                <span className="text-white font-medium">{shortenName(match.away_name)}</span>
              </div>

              {/* Prediction badge */}
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${getRandomColor(index)}`}>
                {getRandomPrediction(index)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Leagues Section ============
interface LeagueData {
  league_name: string;
  league_logo: string;
  count: number;
}

function LeaguesSection() {
  const { t } = useLanguage();
  const [leagues, setLeagues] = useState<LeagueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const { data, error } = await supabase
          .from('prematches')
          .select('league_name, league_logo')
          .eq('type', 'Scheduled');

        if (error) throw error;

        // Group by league and count matches
        const leagueMap = new Map<string, { logo: string; count: number }>();
        data?.forEach((match: any) => {
          if (match.league_name) {
            const existing = leagueMap.get(match.league_name);
            if (existing) {
              existing.count++;
            } else {
              leagueMap.set(match.league_name, { logo: match.league_logo || '', count: 1 });
            }
          }
        });

        // Convert to array and sort by count
        const leagueArray: LeagueData[] = Array.from(leagueMap.entries())
          .map(([name, data]) => ({
            league_name: name,
            league_logo: data.logo,
            count: data.count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6); // Top 6 leagues

        setLeagues(leagueArray);
      } catch (error) {
        console.error('Error fetching leagues:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeagues();
  }, []);

  return (
    <section id="leagues" className="py-24 px-4 relative bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4 block">{t('globalCoverage')}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{t('topLeagues')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t('leaguesSubtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sort leagues: Premier League first (top middle), UEFA last (bottom right) */}
            {[...leagues].sort((a, b) => {
              const priority: Record<string, number> = {
                'Premier League': 1,
                'La Liga': 2,
                'Bundesliga': 3,
                'Serie A': 4,
                'Ligue 1': 5,
                'UEFA Champions League': 6,
              };
              const getPriority = (name: string) => {
                for (const key of Object.keys(priority)) {
                  if (name.toLowerCase().includes(key.toLowerCase())) return priority[key];
                }
                return 99;
              };
              return getPriority(a.league_name) - getPriority(b.league_name);
            }).map((league, index) => {
              // SEO descriptions for each league
              const leagueSeoDesc: Record<string, string> = {
                'Premier League': 'EPL top 5 betting predictions • Premier League AI predictor',
                'La Liga': 'La Liga top 5 betting predictions • Spanish football AI tips',
                'Bundesliga': 'Bundesliga AI betting predictions • German league analysis',
                'Serie A': 'Serie A artificial intelligence picks • Italian football tips',
                'Ligue 1': 'Ligue 1 AI prediction model • French league insights',
                'UEFA Champions League': 'Champions League betting analysis AI • UCL predictions',
              };
              const getSeoDesc = (name: string) => {
                for (const key of Object.keys(leagueSeoDesc)) {
                  if (name.toLowerCase().includes(key.toLowerCase())) return leagueSeoDesc[key];
                }
                return 'AI-powered predictions & betting analysis';
              };
              return (
              <div
                key={index}
                className="group relative flex items-center justify-between p-5 rounded-2xl bg-[#0d1117] border border-gray-800/50 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                <div className="flex items-center gap-4 relative">
                  {/* Logo with animated glow */}
                  <div className="relative">
                    {/* Animated glow ring */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-500 animate-pulse" />
                    <div className="relative w-14 h-14 rounded-xl bg-white flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300 border border-gray-200 group-hover:border-emerald-500/50 shadow-sm">
                      {league.league_logo ? (
                        <Image
                          src={league.league_logo}
                          alt={league.league_name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg group-hover:text-emerald-300 transition-colors">{league.league_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{getSeoDesc(league.league_name)}</p>
                  </div>
                </div>
                <div className="text-right relative">
                  <span className="text-emerald-400 font-bold text-xl group-hover:text-emerald-300 transition-colors">{league.count}+</span>
                  <p className="text-xs text-gray-500">{t('matchesSeason')}</p>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ============ AI Predictions Section ============
function AIPredictionsSection() {
  const { t } = useLanguage();
  const [matches, setMatches] = useState<Prematch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const { data, error } = await supabase
          .from('prematches')
          .select('*')
          .eq('type', 'Scheduled')
          .order('start_date_msia', { ascending: true })
          .limit(8);

        if (error) throw error;
        setMatches(data || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatMatchDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  const getTodayDate = () => {
    const date = new Date();
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    return `${day}${suffix} ${month}`;
  };

  const getConfidence = (index: number) => {
    const confidences = [94, 91, 89, 87, 85, 83];
    return confidences[index % confidences.length];
  };

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header with animated gradient and glow */}
        <div className="relative rounded-t-xl p-8 text-center overflow-hidden">
          {/* Glow effects */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/30 rounded-full blur-[80px]" />
          <div className="absolute -top-10 left-1/4 w-[200px] h-[100px] bg-cyan-500/20 rounded-full blur-[60px]" />
          <div className="absolute -top-10 right-1/4 w-[200px] h-[100px] bg-teal-500/20 rounded-full blur-[60px]" />

          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-cyan-500 to-teal-500 animate-gradient bg-[length:200%_200%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-2 h-2 bg-white/30 rounded-full top-4 left-[20%] animate-float" />
            <div className="absolute w-1.5 h-1.5 bg-white/40 rounded-full top-8 left-[60%] animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute w-1 h-1 bg-white/35 rounded-full top-6 left-[80%] animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute w-1.5 h-1.5 bg-white/25 rounded-full bottom-4 left-[40%] animate-float" style={{ animationDelay: '0.5s' }} />
          </div>

          <div className="relative">
            {/* Red AI Predictions badge with sparkle */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500 shadow-lg shadow-red-500/30 mb-4 relative overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-semibold relative z-10">{t('aiPredictions')}</span>
              {/* Sparkles */}
              <svg className="w-3 h-3 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{t('upcomingMatches')}</h2>
            <p className="text-white/80 text-sm mt-2 font-medium">{getTodayDate()}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0d1117] rounded-b-xl border border-gray-800/50 border-t-0 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">{t('noMatches')}</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              {/* Desktop Header - Hidden on mobile */}
              <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 bg-gray-900/50 border-b border-gray-800/50">
                <div className="col-span-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t('dateLeague')}</div>
                <div className="col-span-6 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center">{t('fixture')}</div>
                <div className="col-span-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">{t('confidence')}</div>
              </div>

              {/* Table Body */}
              <div>
                {matches.map((match, index) => {
                  const confidence = getConfidence(index);
                  return (
                    <div
                      key={match.id}
                      className="group relative border-b border-gray-800/30 hover:bg-emerald-500/5 transition-all duration-300 overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      <div
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      />

                      {/* Mobile Layout */}
                      <div className="md:hidden p-4 space-y-3">
                        {/* League & Date Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {match.league_logo && (
                              <div className="w-5 h-5 rounded bg-white flex items-center justify-center p-0.5 flex-shrink-0">
                                <Image
                                  src={match.league_logo}
                                  alt={match.league_name || 'League'}
                                  width={16}
                                  height={16}
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <span className="text-gray-400 text-xs font-medium">{match.league_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="text-emerald-400">{formatMatchDate(match.start_date_msia)}</span>
                            <span>•</span>
                            <span>{formatTime(match.start_date_msia)}</span>
                          </div>
                        </div>

                        {/* Teams Row */}
                        <div className="flex items-center justify-between gap-3">
                          {/* Home Team */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {match.home_logo && (
                              <Image
                                src={match.home_logo}
                                alt={match.home_name || 'Home'}
                                width={28}
                                height={28}
                                className="rounded-full flex-shrink-0"
                              />
                            )}
                            <span className="text-white text-sm font-medium truncate">{match.home_name}</span>
                          </div>

                          {/* VS */}
                          <span className="text-emerald-400 text-xs font-bold flex-shrink-0">vs</span>

                          {/* Away Team */}
                          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                            <span className="text-white text-sm font-medium truncate text-right">{match.away_name}</span>
                            {match.away_logo && (
                              <Image
                                src={match.away_logo}
                                alt={match.away_name || 'Away'}
                                width={28}
                                height={28}
                                className="rounded-full flex-shrink-0"
                              />
                            )}
                          </div>
                        </div>

                        {/* Confidence Row */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold flex-shrink-0 ${confidence >= 90 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                            {confidence}%
                          </span>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-4 items-center">
                        {/* Date / League */}
                        <div className="col-span-3 relative">
                          <div className="flex items-center gap-2 mb-1">
                            {match.league_logo && (
                              <div className="w-5 h-5 rounded bg-white flex items-center justify-center p-0.5 flex-shrink-0">
                                <Image
                                  src={match.league_logo}
                                  alt={match.league_name || 'League'}
                                  width={16}
                                  height={16}
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <span className="text-gray-300 text-xs font-medium truncate">{match.league_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <span className="text-emerald-400/80">{formatMatchDate(match.start_date_msia)}</span>
                            <span>•</span>
                            <span>{formatTime(match.start_date_msia)}</span>
                          </div>
                        </div>

                        {/* Fixture */}
                        <div className="col-span-6 relative">
                          <div className="flex items-center justify-center gap-2">
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className="text-white text-sm font-medium text-right truncate group-hover:text-emerald-300 transition-colors">{match.home_name}</span>
                              {match.home_logo && (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/20 rounded-full transition-colors duration-300" />
                                  <Image
                                    src={match.home_logo}
                                    alt={match.home_name || 'Home'}
                                    width={24}
                                    height={24}
                                    className="rounded-full flex-shrink-0 relative"
                                  />
                                </div>
                              )}
                            </div>
                            <span className="text-emerald-400 text-xs font-bold px-2 group-hover:scale-110 transition-transform">vs</span>
                            <div className="flex items-center gap-2 flex-1">
                              {match.away_logo && (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/20 rounded-full transition-colors duration-300" />
                                  <Image
                                    src={match.away_logo}
                                    alt={match.away_name || 'Away'}
                                    width={24}
                                    height={24}
                                    className="rounded-full flex-shrink-0 relative"
                                  />
                                </div>
                              )}
                              <span className="text-white text-sm font-medium truncate group-hover:text-emerald-300 transition-colors">{match.away_name}</span>
                            </div>
                          </div>
                        </div>

                        {/* Confidence */}
                        <div className="col-span-3 relative">
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-sm font-bold transition-all duration-300 ${confidence >= 90 ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-cyan-400 group-hover:text-cyan-300'}`}>
                              {confidence}%
                            </span>
                            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full group-hover:shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-shadow duration-300"
                                style={{ width: `${confidence}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <Link href="/predictions" className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer inline-block">
            {t('viewAllPredictions')}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============ Features Section ============
function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="performance" className="py-24 px-4 relative bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4 block">{t('whyOddsFlow')}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t('mostAdvanced')}<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t('predictionEngine')}</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">{t('featuresSubtitle')}</p>

            <div className="space-y-6">
              {[
                { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: t('aiPoweredPerformance'), desc: t('aiPoweredDesc') },
                { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: t('realtimeTracking'), desc: t('realtimeTrackingDesc') },
                { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: t('deepStatistics'), desc: t('deepStatisticsDesc') },
                { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", title: t('smartAlerts'), desc: t('smartAlertsDesc') },
              ].map((feature, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-3xl p-8 overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-gray-400">{t('aiDashboard')}</span>
                  {/* Red LIVE badge with animation */}
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400 font-medium border border-red-500/30">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {t('live')}
                  </span>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    {/* Premier League with logo */}
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-white flex items-center justify-center p-0.5">
                        <Image
                          src="https://media.api-sports.io/football/leagues/39.png"
                          alt="Premier League"
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs text-gray-400">Premier League</span>
                    </div>
                    <span className="text-xs text-emerald-400">{t('startingIn')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Manchester City with logo */}
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1">
                          <Image
                            src="https://media.api-sports.io/football/teams/50.png"
                            alt="Manchester City"
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="font-semibold text-sm">Manchester City</div>
                      <div className="text-2xl font-bold text-emerald-400 mt-1">1.85</div>
                    </div>
                    <div className="px-4 text-gray-600 text-sm">VS</div>
                    {/* Arsenal with logo */}
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1">
                          <Image
                            src="https://media.api-sports.io/football/teams/42.png"
                            alt="Arsenal"
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div className="font-semibold text-sm">Arsenal</div>
                      <div className="text-2xl font-bold text-gray-400 mt-1">4.20</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{t('aiConfidence')}</span>
                      <span className="text-emerald-400 font-semibold">87%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full w-[87%] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-emerald-400">68%</div>
                    <div className="text-xs text-gray-500">{t('homeWin')}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-400">18%</div>
                    <div className="text-xs text-gray-500">{t('draw')}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-400">14%</div>
                    <div className="text-xs text-gray-500">{t('awayWin')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ Why Choose Section ============
function WhyChooseSection() {
  const { t } = useLanguage();

  const benefits = [
    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: t('benefit1Title'), desc: t('benefit1Desc') },
    { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: t('benefit2Title'), desc: t('benefit2Desc') },
    { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: t('benefit3Title'), desc: t('benefit3Desc') },
    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: t('benefit4Title'), desc: t('benefit4Desc') },
    { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: t('benefit5Title'), desc: t('benefit5Desc') },
    { icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z", title: t('benefit6Title'), desc: t('benefit6Desc') },
  ];

  return (
    <section className="py-24 px-4 relative bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4 block">{t('whyChooseUs')}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{t('whyChooseTitle')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t('whyChooseSubtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="group bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ Animated Counter Component ============
function AnimatedCounter({ end, suffix, duration = 2000, isVisible }: { end: number; suffix: string; duration?: number; isVisible: boolean }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      countRef.current = 0;
      return;
    }

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, isVisible]);

  // Format number with K suffix for large numbers
  const formatNumber = (num: number) => {
    if (suffix === 'K+') {
      return `${Math.floor(num / 1000)}K+`;
    }
    return `${num}${suffix}`;
  };

  return <span>{formatNumber(count)}</span>;
}

// ============ Trusted By Section ============
function TrustedBySection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 50000, suffix: 'K+', label: t('activeUsers') },
    { value: 120, suffix: '+', label: t('countriesServed') },
    { value: 1000, suffix: '+', label: t('predictionsDaily') },
    { value: 96, suffix: '%', label: t('satisfactionRate') },
  ];

  const testimonials = [
    { text: t('testimonial1'), author: t('testimonial1Author'), role: t('testimonial1Role') },
    { text: t('testimonial2'), author: t('testimonial2Author'), role: t('testimonial2Role') },
    { text: t('testimonial3'), author: t('testimonial3Author'), role: t('testimonial3Role') },
  ];

  return (
    <section ref={sectionRef} className="py-24 px-4 relative bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4 block">{t('trustedBy')}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{t('trustedTitle')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t('trustedSubtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} isVisible={isVisible} duration={2000} />
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">&quot;{testimonial.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.author}</div>
                  <div className="text-gray-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FAQ Section ============
function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { question: t('faq1Question'), answer: t('faq1Answer') },
    { question: t('faq2Question'), answer: t('faq2Answer') },
    { question: t('faq3Question'), answer: t('faq3Answer') },
    { question: t('faq4Question'), answer: t('faq4Answer') },
    { question: t('faq5Question'), answer: t('faq5Answer') },
    { question: t('faq6Question'), answer: t('faq6Answer') },
    { question: t('faq7Question'), answer: t('faq7Answer') },
  ];

  return (
    <section id="faq" className="py-24 px-4 relative bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4 block">FAQ</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{t('faqTitle')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t('faqSubtitle')}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-emerald-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ CTA Section ============
function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#0d0d14]">
      {/* Subtle glow effects */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-cyan-500/10 rounded-full blur-[80px]" />

      {/* Top glowing border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Top row: Logo + Social Icons */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-3">
            <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
            <span className="text-xl font-bold text-white">OddsFlow</span>
          </Link>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <Link href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </Link>
            <Link href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </Link>
            <Link href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </Link>
            <Link href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </Link>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('product')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/predictions" className="text-gray-400 hover:text-emerald-400 transition-colors">{t('predictions')}</Link></li>
              <li><Link href="/leagues" className="text-gray-400 hover:text-emerald-400 transition-colors">{t('leagues')}</Link></li>
              <li><Link href="/performance" className="text-gray-400 hover:text-emerald-400 transition-colors">{t('liveOdds')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('company')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors">{t('aboutUs')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">{t('contact')}</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-emerald-400 transition-colors">{t('blog')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms-of-service" className="text-gray-400 hover:text-emerald-400 transition-colors">{t('termsOfService')}</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-emerald-400 transition-colors">{t('privacyPolicy')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('contact')}</h4>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>support@oddsflow.com</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative pt-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <span className="text-gray-500">©2025 OddsFlow · {t('allRightsReserved')}</span>
            <div className="flex items-center gap-2 text-amber-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>18+ • {t('gamblingWarning')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ Footer ============
function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-16 px-4 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
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
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-white">{t('company')}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">{t('aboutUs')}</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">{t('contact')}</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">{t('blog')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-white">{t('legal')}</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/terms-of-service" className="hover:text-emerald-400 transition-colors">{t('termsOfService')}</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">{t('privacyPolicy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">&copy; 2024 OddsFlow. {t('allRightsReserved')}</p>
          <p className="text-gray-600 text-xs">{t('gamblingWarning')}</p>
        </div>
      </div>
    </footer>
  );
}

// ============ Main Page ============
export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <HeroSection />
        <LeaguesSection />
        <AIPredictionsSection />
        <FeaturesSection />
        <WhyChooseSection />
        <TrustedBySection />
        <FAQSection />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
