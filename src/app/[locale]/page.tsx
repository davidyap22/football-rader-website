"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, createContext, useContext, ReactNode } from "react";
import { useParams } from "next/navigation";
import { supabase, Prematch } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import CookieConsent from "@/components/CookieConsent";
import FlagIcon from "@/components/FlagIcon";
import { locales, localeNames, localeFlags, localeToTranslationCode, type Locale } from "@/i18n/config";
import { generateMatchSlug } from "@/lib/slug-utils";

// ============ Translations ============
const translations: Record<string, Record<string, string>> = {
  EN: {
    // Navbar
    home: "Home",
    predictions: "Predictions",
    worldcup: "World Cup",
    leagues: "Leagues",
    performance: "AI Performance",
    community: "Community",
    news: "News",
    solution: "Solution",
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
    viewAnalysis: "View Analysis",
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
    // Footer SEO
    popularLeagues: "Popular Leagues",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
    todayMatches: "Today Matches",
    solutionFooter: "Solution",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
    // AI Predictions Section
    aiPredictions: "AI Predictions",
    upcomingMatches: "Upcoming Matches",
    aiPredictionsSubtitle: "AI-powered predictions for scheduled matches",
    dateLeague: "Date / League",
    fixture: "Fixture",
    prediction: "Prediction",
    confidence: "1x2 Prediction",
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
    testimonial1Author: "Kevin L.",
    testimonial1Role: "Professional Bettor",
    testimonial2: "The real-time odds tracking saves me hours every day. Best investment I've made.",
    testimonial2Author: "Emma S.",
    testimonial2Role: "Sports Analyst",
    testimonial3: "Finally a platform that delivers on its promises. The accuracy rate is unmatched.",
    testimonial3Author: "Marcus J.",
    testimonial3Role: "Football Enthusiast",
    testimonial4: "I've tried many prediction platforms, but OddsFlow's AI accuracy is on another level. Highly recommended!",
    testimonial4Author: "Robert M.",
    testimonial4Role: "Betting Veteran",
    testimonial5: "As a passionate football fan, OddsFlow helps me make smarter decisions. The data insights are incredible!",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "Football Fan",
    // FAQ Section
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Everything You Need to Know About OddsFlow",
    faq1Question: "Can AI actually analyze football matches?",
    faq1Answer: "AI isn't a crystal ball—it can't predict the future. However, it can process massive amounts of data far faster than any human. OddsFlow uses algorithms to analyze historical stats, market movements, and match variables to spot patterns that the naked eye misses. Simply put: We don't guess the score; we reveal the true state of the market and the teams.",
    faq2Question: "Does using your data guarantee profit?",
    faq2Answer: "Let's be honest: No. Anyone promising you \"guaranteed wins\" is lying to you. Think of OddsFlow as your tactical advisor—we provide the data backing and the analytical angle to improve your decision-making and your edge. But football is unpredictable, and the final call (and the risk) is always yours.",
    faq3Question: "How does OddsFlow interpret Asian Handicap markets?",
    faq3Answer: "We don't just look at what the lines are; we look at how they move. We track capital flow and bookmaker adjustments to help you understand where the market sentiment lies, or if there's a potential \"trap.\" This gives you far more actionable value than just looking at the league table.",
    faq4Question: "How does the goal trend analysis work?",
    faq4Answer: "Beyond just looking at average goals per game, we analyze \"match tempo\" and time-segment habits. For example, does a team tend to chase goals in the last 15 minutes? Or do two specific playstyles usually result in a deadlock? We dig up these deep-layer stats for you.",
    faq5Question: "Which leagues do you cover?",
    faq5Answer: "We cover all the major leagues (the \"Big Five\"), of course. But we also cover selected secondary and lower-tier leagues. Why? Because we know that the \"edge\" and value often hide in the smaller leagues where bookmakers are more likely to make mistakes.",
    faq6Question: "How is OddsFlow different from other score sites?",
    faq6Answer: "Most websites just tell you what happened (scores, cards). OddsFlow focuses on why it happened and what the market is thinking. We specialize in odds movement analysis and market behavior. We are a tool for serious analysis, not just a news feed.",
    faq7Question: "What specific analysis do you provide?",
    faq7Answer: "Our core features include: Market Movement Monitoring (real-time tracking of significant odds shifts), Probability Models (outcome estimations based on big data), Match Tempo Indicators (who is controlling the game vs. who is under pressure), and Historical Odds Analysis (how similar handicaps have performed in the past).",
    faq8Question: "Is OddsFlow a betting site?",
    faq8Answer: "Absolutely not. OddsFlow is purely a data analytics company. We do not accept wagers, we do not open markets, and we do not handle any betting funds. We provide the tools to dig for gold; we don't own the mine.",
    faq9Question: "Is it suitable for beginners?",
    faq9Answer: "Definitely. While the logic behind our models is complex, the dashboard you see is designed to be simple and intuitive. We simplify the data so that even if you are new to football analysis, you can spot the trends and market direction immediately.",
    faq10Question: "Important Disclaimer",
    faq10Answer: "While we have full confidence in our models, we have to be clear: All content provided by OddsFlow is for reference and research only. The football market is volatile. Please use the data rationally and gamble responsibly.",
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
    worldcup: "世界杯",
    leagues: "联赛",
    performance: "AI 表现",
    community: "社区",
    news: "新闻",
    solution: "解决方案",
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
    viewAnalysis: "查看分析",
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
    // Footer SEO
    popularLeagues: "热门联赛",
    communityFooter: "社区",
    globalChat: "全球聊天",
    userPredictions: "用户预测",
    todayMatches: "今日比赛",
    solutionFooter: "解决方案",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
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
    testimonial1Author: "Kevin L.",
    testimonial1Role: "职业投注者",
    testimonial2: "实时赔率追踪每天为我节省数小时。这是我做过的最好投资。",
    testimonial2Author: "Emma S.",
    testimonial2Role: "体育分析师",
    testimonial3: "终于有一个兑现承诺的平台。准确率无与伦比。",
    testimonial3Author: "Marcus J.",
    testimonial3Role: "足球爱好者",
    testimonial4: "我试过很多预测平台，但OddsFlow的AI准确率是另一个级别。强烈推荐！",
    testimonial4Author: "Robert M.",
    testimonial4Role: "投注老手",
    testimonial5: "作为一个狂热的足球迷，OddsFlow帮助我做出更明智的决策。数据洞察令人难以置信！",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "足球迷",
    // FAQ Section
    faqTitle: "常见问题解答",
    faqSubtitle: "关于 OddsFlow 您需要了解的一切",
    faq1Question: "AI 真的能分析足球比赛吗？",
    faq1Answer: "AI 不是水晶球——它无法预测未来。但它可以比任何人类更快地处理海量数据。OddsFlow 使用算法分析历史统计、市场动向和比赛变量，发现肉眼无法察觉的规律。简单来说：我们不猜比分，我们揭示市场和球队的真实状态。",
    faq2Question: "使用你们的数据能保证盈利吗？",
    faq2Answer: "说实话：不能。任何向你承诺\"稳赚不赔\"的人都在骗你。把 OddsFlow 当作你的战术顾问——我们提供数据支撑和分析角度，帮助你提升决策能力和优势。但足球是不可预测的，最终决定（和风险）始终在你手中。",
    faq3Question: "OddsFlow 如何解读亚洲让球盘市场？",
    faq3Answer: "我们不只看盘口是什么，我们关注盘口如何变动。我们追踪资金流向和庄家调整，帮你理解市场情绪在哪里，或者是否存在潜在\"陷阱\"。这比单纯看积分榜有价值得多。",
    faq4Question: "进球趋势分析是怎么工作的？",
    faq4Answer: "除了看场均进球，我们还分析\"比赛节奏\"和时间段习惯。比如，某支球队是否习惯在最后15分钟追逐进球？或者两种特定打法通常会导致僵局？我们为你挖掘这些深层数据。",
    faq5Question: "你们覆盖哪些联赛？",
    faq5Answer: "当然，我们覆盖所有主流联赛（\"五大联赛\"）。但我们也覆盖精选的次级和低级别联赛。为什么？因为我们知道\"优势\"和价值往往隐藏在庄家更容易出错的小联赛中。",
    faq6Question: "OddsFlow 与其他比分网站有何不同？",
    faq6Answer: "大多数网站只告诉你发生了什么（比分、红黄牌）。OddsFlow 专注于为什么会这样以及市场在想什么。我们专注于赔率变动分析和市场行为。我们是严肃分析的工具，而不只是新闻推送。",
    faq7Question: "你们提供哪些具体分析？",
    faq7Answer: "我们的核心功能包括：市场动向监控（实时追踪重大赔率变化）、概率模型（基于大数据的结果估算）、比赛节奏指标（谁在控制比赛 vs 谁处于被动）、历史盘口分析（类似让球盘的历史表现）。",
    faq8Question: "OddsFlow 是博彩网站吗？",
    faq8Answer: "绝对不是。OddsFlow 纯粹是一家数据分析公司。我们不接受投注，不开盘，不处理任何投注资金。我们提供挖金子的工具，但我们不拥有金矿。",
    faq9Question: "适合初学者吗？",
    faq9Answer: "当然适合。虽然我们模型背后的逻辑很复杂，但你看到的界面设计得简单直观。我们简化数据，即使你是足球分析新手，也能立即发现趋势和市场方向。",
    faq10Question: "重要免责声明",
    faq10Answer: "虽然我们对模型充满信心，但必须明确：OddsFlow 提供的所有内容仅供参考和研究。足球市场波动很大。请理性使用数据，理性投注。",
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
    worldcup: "世界盃",
    leagues: "聯賽",
    performance: "AI 表現",
    community: "社區",
    news: "新聞",
    solution: "解決方案",
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
    viewAnalysis: "查看分析",
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
    // Footer SEO
    popularLeagues: "熱門聯賽",
    communityFooter: "社區",
    globalChat: "全球聊天",
    userPredictions: "用戶預測",
    todayMatches: "今日比賽",
    solutionFooter: "解決方案",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
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
    testimonial1Author: "Kevin L.",
    testimonial1Role: "職業投注者",
    testimonial2: "即時賠率追蹤每天為我節省數小時。這是我做過的最好投資。",
    testimonial2Author: "Emma S.",
    testimonial2Role: "體育分析師",
    testimonial3: "終於有一個兌現承諾的平台。準確率無與倫比。",
    testimonial3Author: "Marcus J.",
    testimonial3Role: "足球愛好者",
    testimonial4: "我試過很多預測平台，但OddsFlow的AI準確率是另一個級別。強烈推薦！",
    testimonial4Author: "Robert M.",
    testimonial4Role: "投注老手",
    testimonial5: "作為一個狂熱的足球迷，OddsFlow幫助我做出更明智的決策。數據洞察令人難以置信！",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "足球迷",
    // FAQ Section
    faqTitle: "常見問題解答",
    faqSubtitle: "關於 OddsFlow 您需要了解的一切",
    faq1Question: "AI 真的能分析足球比賽嗎？",
    faq1Answer: "AI 不是水晶球——它無法預測未來。但它可以比任何人類更快地處理海量數據。OddsFlow 使用演算法分析歷史統計、市場動向和比賽變量，發現肉眼無法察覺的規律。簡單來說：我們不猜比分，我們揭示市場和球隊的真實狀態。",
    faq2Question: "使用你們的數據能保證盈利嗎？",
    faq2Answer: "說實話：不能。任何向你承諾「穩賺不賠」的人都在騙你。把 OddsFlow 當作你的戰術顧問——我們提供數據支撐和分析角度，幫助你提升決策能力和優勢。但足球是不可預測的，最終決定（和風險）始終在你手中。",
    faq3Question: "OddsFlow 如何解讀亞洲讓球盤市場？",
    faq3Answer: "我們不只看盤口是什麼，我們關注盤口如何變動。我們追蹤資金流向和莊家調整，幫你理解市場情緒在哪裡，或者是否存在潛在「陷阱」。這比單純看積分榜有價值得多。",
    faq4Question: "進球趨勢分析是怎麼運作的？",
    faq4Answer: "除了看場均進球，我們還分析「比賽節奏」和時間段習慣。比如，某支球隊是否習慣在最後15分鐘追逐進球？或者兩種特定打法通常會導致僵局？我們為你挖掘這些深層數據。",
    faq5Question: "你們覆蓋哪些聯賽？",
    faq5Answer: "當然，我們覆蓋所有主流聯賽（「五大聯賽」）。但我們也覆蓋精選的次級和低級別聯賽。為什麼？因為我們知道「優勢」和價值往往隱藏在莊家更容易出錯的小聯賽中。",
    faq6Question: "OddsFlow 與其他比分網站有何不同？",
    faq6Answer: "大多數網站只告訴你發生了什麼（比分、紅黃牌）。OddsFlow 專注於為什麼會這樣以及市場在想什麼。我們專注於賠率變動分析和市場行為。我們是嚴肅分析的工具，而不只是新聞推送。",
    faq7Question: "你們提供哪些具體分析？",
    faq7Answer: "我們的核心功能包括：市場動向監控（即時追蹤重大賠率變化）、概率模型（基於大數據的結果估算）、比賽節奏指標（誰在控制比賽 vs 誰處於被動）、歷史盤口分析（類似讓球盤的歷史表現）。",
    faq8Question: "OddsFlow 是博彩網站嗎？",
    faq8Answer: "絕對不是。OddsFlow 純粹是一家數據分析公司。我們不接受投注，不開盤，不處理任何投注資金。我們提供挖金子的工具，但我們不擁有金礦。",
    faq9Question: "適合初學者嗎？",
    faq9Answer: "當然適合。雖然我們模型背後的邏輯很複雜，但你看到的介面設計得簡單直觀。我們簡化數據，即使你是足球分析新手，也能立即發現趨勢和市場方向。",
    faq10Question: "重要免責聲明",
    faq10Answer: "雖然我們對模型充滿信心，但必須明確：OddsFlow 提供的所有內容僅供參考和研究。足球市場波動很大。請理性使用數據，理性投注。",
    // What is OddsFlow
    whatIsOddsFlow: "什麼是 OddsFlow？",
    whatIsDesc1: "OddsFlow 是一個完全使用人工智慧生成足球預測的平台。",
    whatIsDesc2: "提供 100+ 足球聯賽的 AI 預測，包括英超、西甲、意甲、德甲、歐冠等。",
    whatIsDesc3: "每日精選中可查看最佳投注預測，AI 選出最準確的足球貼士。",
    whatIsDesc4: "關注 OddsFlow 獲取比賽貼士、詳細 AI 預測（控球率、射門、角球、H2H 報告、賠率等）。",
  },
  ID: {
    // Navbar
    home: "Beranda",
    predictions: "Prediksi",
    worldcup: "Piala Dunia",
    leagues: "Liga",
    performance: "Performa AI",
    community: "Komunitas",
    news: "Berita",
    solution: "Solusi",
    pricing: "Harga",
    login: "Masuk",
    getStarted: "Mulai",
    // Hero
    heroTitle1: "Performa",
    heroTitle2: "Odds Sepak Bola",
    heroTitle3: "Cerdas",
    heroSubtitle: "Manfaatkan wawasan bertenaga AI untuk menganalisis odds sepak bola secara real-time. Buat keputusan berbasis data dengan algoritma prediksi canggih kami.",
    startAnalyzing: "Mulai Analisis Gratis",
    viewLiveOdds: "Lihat Odds Langsung",
    accuracyRate: "Tingkat Akurasi",
    matchesAnalyzed: "Pertandingan Dianalisis",
    leaguesCovered: "Liga Tercakup",
    realtimeUpdates: "Pembaruan Real-time",
    // Leagues Section
    globalCoverage: "Cakupan Global",
    topLeagues: "Liga Top yang Kami Cakup",
    leaguesSubtitle: "Dapatkan prediksi AI untuk semua liga sepak bola utama di seluruh dunia",
    matchesSeason: "pertandingan/musim",
    // Features Section
    whyOddsFlow: "Mengapa OddsFlow",
    mostAdvanced: "Mesin Prediksi",
    predictionEngine: "Paling Canggih",
    featuresSubtitle: "AI kami menganalisis jutaan pertandingan historis, data real-time, dan tren pasar untuk memberikan prediksi dengan akurasi tak tertandingi.",
    aiPoweredPerformance: "Analisis Bertenaga AI",
    aiPoweredDesc: "Model pembelajaran mesin menganalisis ribuan titik data untuk prediksi yang tepat.",
    realtimeTracking: "Pelacakan Real-Time",
    realtimeTrackingDesc: "Pantau pergerakan odds di berbagai bandar taruhan dengan pembaruan instan.",
    deepStatistics: "Statistik Mendalam",
    deepStatisticsDesc: "Akses statistik tim, catatan pertemuan langsung, dan data performa historis.",
    smartAlerts: "Peringatan Cerdas",
    smartAlertsDesc: "Dapatkan notifikasi saat peluang nilai muncul atau odds berubah signifikan.",
    aiDashboard: "Dasbor Prediksi AI",
    live: "LANGSUNG",
    startingIn: "Dimulai dalam 2 jam",
    aiConfidence: "Kepercayaan AI",
    homeWin: "Menang Kandang",
    draw: "Seri",
    awayWin: "Menang Tandang",
    // Live Predictions
    livePredictions: "Prediksi Langsung",
    todaysTopPicks: "Pilihan Teratas Hari Ini",
    predictionsSubtitle: "Pertandingan yang dianalisis AI dengan skor kepercayaan tertinggi",
    viewAllPredictions: "Lihat Semua Prediksi",
    viewAnalysis: "Lihat Analisis",
    // CTA
    readyToMake: "Siap Membuat",
    smarterPredictions: "Prediksi Lebih Cerdas",
    ctaSubtitle: "Bergabunglah dengan ribuan pengguna yang mempercayai OddsFlow untuk analisis sepak bola mereka. Mulai uji coba gratis Anda hari ini - tidak perlu kartu kredit.",
    startFreeTrial: "Mulai Uji Coba Gratis",
    contactSales: "Hubungi Penjualan",
    // Footer
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi yang lebih cerdas. Buat keputusan berbasis data dengan wawasan real-time.",
    product: "Produk",
    liveOdds: "Performa AI",
    statistics: "Statistik",
    apiAccess: "Akses API",
    company: "Perusahaan",
    aboutUs: "Tentang Kami",
    blog: "Blog",
    careers: "Karir",
    contact: "Kontak",
    legal: "Hukum",
    privacyPolicy: "Kebijakan Privasi",
    termsOfService: "Ketentuan Layanan",
    responsibleGaming: "Perjudian Bertanggung Jawab",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    // Footer SEO
    popularLeagues: "Liga Populer",
    communityFooter: "Komunitas",
    globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna",
    todayMatches: "Pertandingan Hari Ini",
    solutionFooter: "Solusi",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
    // AI Predictions Section
    aiPredictions: "Prediksi AI",
    upcomingMatches: "Pertandingan Mendatang",
    aiPredictionsSubtitle: "Prediksi bertenaga AI untuk pertandingan terjadwal",
    dateLeague: "Tanggal / Liga",
    fixture: "Pertandingan",
    prediction: "Prediksi",
    confidence: "Kepercayaan",
    loading: "Memuat pertandingan...",
    noMatches: "Tidak ada pertandingan terjadwal ditemukan",
    // Why Choose Section
    whyChooseUs: "Mengapa Memilih Kami",
    whyChooseTitle: "Mengapa Memilih OddsFlow",
    whyChooseSubtitle: "Rasakan perbedaan dengan platform bertenaga AI kami",
    benefit1Title: "99.9% Uptime",
    benefit1Desc: "Platform kami berjalan 24/7 dengan keandalan tingkat enterprise",
    benefit2Title: "Data Real-time",
    benefit2Desc: "Dapatkan pembaruan instan dari 50+ bandar taruhan di seluruh dunia",
    benefit3Title: "Akurasi AI",
    benefit3Desc: "Model kami mencapai akurasi prediksi 78%+",
    benefit4Title: "Aman & Privat",
    benefit4Desc: "Enkripsi tingkat bank melindungi data Anda",
    benefit5Title: "Dukungan 24/7",
    benefit5Desc: "Tim dukungan ahli tersedia sepanjang waktu",
    benefit6Title: "Garansi Uang Kembali",
    benefit6Desc: "Garansi uang kembali 30 hari, tanpa pertanyaan",
    // Trusted Section
    trustedBy: "Dipercaya Pengguna",
    trustedTitle: "Dipercaya Ribuan Orang",
    trustedSubtitle: "Bergabunglah dengan komunitas petaruh sukses kami yang terus berkembang",
    activeUsers: "Pengguna Aktif",
    countriesServed: "Negara Dilayani",
    predictionsDaily: "Prediksi Harian",
    satisfactionRate: "Tingkat Kepuasan",
    testimonial1: "OddsFlow benar-benar mengubah cara saya mendekati taruhan sepak bola. Prediksi AI sangat akurat!",
    testimonial1Author: "Kevin L.",
    testimonial1Role: "Petaruh Profesional",
    testimonial2: "Pelacakan odds real-time menghemat berjam-jam setiap hari. Investasi terbaik yang pernah saya buat.",
    testimonial2Author: "Emma S.",
    testimonial2Role: "Analis Olahraga",
    testimonial3: "Akhirnya platform yang menepati janjinya. Tingkat akurasi tak tertandingi.",
    testimonial3Author: "Marcus J.",
    testimonial3Role: "Penggemar Sepak Bola",
    testimonial4: "Saya sudah mencoba banyak platform prediksi, tapi akurasi AI OddsFlow berada di level lain. Sangat direkomendasikan!",
    testimonial4Author: "Robert M.",
    testimonial4Role: "Veteran Taruhan",
    testimonial5: "Sebagai penggemar sepak bola yang antusias, OddsFlow membantu saya membuat keputusan yang lebih cerdas. Wawasan datanya luar biasa!",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "Penggemar Bola",
    // FAQ Section
    faqTitle: "Pertanyaan yang Sering Diajukan",
    faqSubtitle: "Semua yang Perlu Anda Ketahui Tentang OddsFlow",
    faq1Question: "Bisakah AI benar-benar menganalisis pertandingan sepak bola?",
    faq1Answer: "AI bukan bola kristal—ia tidak bisa memprediksi masa depan. Namun, ia dapat memproses data dalam jumlah besar jauh lebih cepat dari manusia manapun. OddsFlow menggunakan algoritma untuk menganalisis statistik historis, pergerakan pasar, dan variabel pertandingan untuk menemukan pola yang tidak terlihat mata biasa. Sederhananya: Kami tidak menebak skor; kami mengungkapkan kondisi sebenarnya dari pasar dan tim.",
    faq2Question: "Apakah menggunakan data Anda menjamin keuntungan?",
    faq2Answer: "Jujur saja: Tidak. Siapapun yang menjanjikan \"kemenangan pasti\" berbohong kepada Anda. Anggap OddsFlow sebagai penasihat taktis Anda—kami menyediakan dukungan data dan sudut analitis untuk meningkatkan pengambilan keputusan dan keunggulan Anda. Tapi sepak bola tidak dapat diprediksi, dan keputusan akhir (dan risikonya) selalu ada di tangan Anda.",
    faq3Question: "Bagaimana OddsFlow menginterpretasikan pasar Asian Handicap?",
    faq3Answer: "Kami tidak hanya melihat apa line-nya; kami melihat bagaimana pergerakannya. Kami melacak aliran modal dan penyesuaian bandar untuk membantu Anda memahami di mana sentimen pasar berada, atau apakah ada potensi \"jebakan\". Ini memberikan nilai yang jauh lebih actionable daripada hanya melihat klasemen liga.",
    faq4Question: "Bagaimana analisis tren gol bekerja?",
    faq4Answer: "Selain melihat rata-rata gol per pertandingan, kami menganalisis \"tempo pertandingan\" dan kebiasaan segmen waktu. Misalnya, apakah sebuah tim cenderung mengejar gol di 15 menit terakhir? Atau apakah dua gaya bermain tertentu biasanya menghasilkan kebuntuan? Kami menggali statistik lapisan dalam ini untuk Anda.",
    faq5Question: "Liga mana saja yang Anda cakup?",
    faq5Answer: "Kami mencakup semua liga utama (\"Lima Besar\"), tentu saja. Tapi kami juga mencakup liga sekunder dan tingkat bawah terpilih. Mengapa? Karena kami tahu bahwa \"keunggulan\" dan nilai sering tersembunyi di liga-liga kecil di mana bandar lebih mungkin membuat kesalahan.",
    faq6Question: "Apa yang membuat OddsFlow berbeda dari situs skor lainnya?",
    faq6Answer: "Sebagian besar website hanya memberitahu Anda apa yang terjadi (skor, kartu). OddsFlow berfokus pada mengapa itu terjadi dan apa yang dipikirkan pasar. Kami mengkhususkan diri dalam analisis pergerakan odds dan perilaku pasar. Kami adalah alat untuk analisis serius, bukan sekadar feed berita.",
    faq7Question: "Analisis spesifik apa yang Anda sediakan?",
    faq7Answer: "Fitur inti kami meliputi: Pemantauan Pergerakan Pasar (pelacakan real-time perubahan odds signifikan), Model Probabilitas (estimasi hasil berdasarkan big data), Indikator Tempo Pertandingan (siapa yang mengendalikan permainan vs siapa yang di bawah tekanan), dan Analisis Odds Historis (bagaimana handicap serupa tampil di masa lalu).",
    faq8Question: "Apakah OddsFlow situs taruhan?",
    faq8Answer: "Sama sekali tidak. OddsFlow murni perusahaan analitik data. Kami tidak menerima taruhan, tidak membuka pasar, dan tidak menangani dana taruhan apapun. Kami menyediakan alat untuk menggali emas; kami tidak memiliki tambangnya.",
    faq9Question: "Apakah cocok untuk pemula?",
    faq9Answer: "Tentu saja. Meskipun logika di balik model kami kompleks, dashboard yang Anda lihat dirancang sederhana dan intuitif. Kami menyederhanakan data sehingga meskipun Anda baru dalam analisis sepak bola, Anda dapat langsung melihat tren dan arah pasar.",
    faq10Question: "Penafian Penting",
    faq10Answer: "Meskipun kami memiliki kepercayaan penuh pada model kami, kami harus jelas: Semua konten yang disediakan oleh OddsFlow hanya untuk referensi dan penelitian. Pasar sepak bola sangat fluktuatif. Harap gunakan data dengan rasional dan bertaruh dengan bertanggung jawab.",
    // What is OddsFlow
    whatIsOddsFlow: "Apa itu OddsFlow?",
    whatIsDesc1: "OddsFlow adalah platform yang menawarkan prediksi sepak bola AI yang dihasilkan secara eksklusif menggunakan Kecerdasan Buatan.",
    whatIsDesc2: "Menawarkan Tips Sepak Bola AI untuk lebih dari 100+ liga sepak bola termasuk Premier League, La Liga, Serie A, Bundesliga, Liga Champions UEFA.",
    whatIsDesc3: "Pilihan prediksi taruhan terbaik dapat dilihat di pilihan harian kami di mana AI memilih tips sepak bola paling akurat.",
    whatIsDesc4: "Ikuti OddsFlow untuk tips pertandingan sepak bola, prediksi AI detail (penguasaan bola, tembakan ke gawang, sudut, laporan H2H, odds dll.).",
  },
  ES: {
    home: "Inicio",
    predictions: "Pronósticos",
    leagues: "Ligas",
    performance: "AI Performance",
    community: "Comunidad",
    news: "Noticias",
    solution: "Solución",
    pricing: "Precios",
    login: "Iniciar Sesión",
    getStarted: "Comenzar",
    heroTitle1: "Pronósticos",
    heroTitle2: "Inteligentes de",
    heroTitle3: "Fútbol con IA",
    heroSubtitle: "Domina las apuestas con pronósticos de IA para La Liga, Premier League, Serie A y más. Análisis de cuotas en tiempo real y value bets identificados por nuestra inteligencia artificial.",
    startAnalyzing: "Comenzar Gratis",
    viewLiveOdds: "Ver Cuotas en Vivo",
    accuracyRate: "Tasa de Precisión",
    matchesAnalyzed: "Partidos Analizados",
    leaguesCovered: "Ligas Cubiertas",
    realtimeUpdates: "Actualizaciones en Tiempo Real",
    globalCoverage: "Cobertura Global",
    topLeagues: "Pronósticos para La Liga y Más",
    leaguesSubtitle: "Obtén pronósticos de IA para La Liga, Premier League, Serie A, Bundesliga y todas las ligas principales",
    matchesSeason: "partidos/temporada",
    whyOddsFlow: "Por qué OddsFlow",
    mostAdvanced: "El Motor de",
    predictionEngine: "Pronósticos Más Avanzado",
    featuresSubtitle: "Nuestra IA analiza millones de partidos históricos, datos en tiempo real y tendencias del mercado para ofrecer pronósticos con una precisión inigualable.",
    aiPoweredPerformance: "Análisis Impulsado por IA",
    aiPoweredDesc: "Los modelos de aprendizaje automático analizan miles de puntos de datos para predicciones precisas.",
    realtimeTracking: "Seguimiento en Tiempo Real",
    realtimeTrackingDesc: "Monitoree los movimientos de cuotas en las casas de apuestas con actualizaciones instantáneas.",
    deepStatistics: "Estadísticas Profundas",
    deepStatisticsDesc: "Acceda a estadísticas de equipos, registros de enfrentamientos directos y datos de rendimiento histórico.",
    smartAlerts: "Alertas Inteligentes",
    smartAlertsDesc: "Reciba notificaciones cuando surjan oportunidades de valor o las cuotas cambien significativamente.",
    aiDashboard: "Panel de Pronósticos IA",
    live: "EN VIVO",
    startingIn: "Comienza en 2h",
    aiConfidence: "Confianza IA",
    homeWin: "Victoria Local",
    draw: "Empate",
    awayWin: "Victoria Visitante",
    livePredictions: "Pronósticos en Vivo",
    todaysTopPicks: "Mejores Pronósticos de Hoy",
    predictionsSubtitle: "Partidos analizados por IA con las puntuaciones de confianza más altas para La Liga, Premier League y más",
    viewAllPredictions: "Ver Todos los Pronósticos",
    viewAnalysis: "Ver Analisis",
    readyToMake: "¿Listo para Hacer",
    smarterPredictions: "Pronósticos Más Inteligentes",
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
    // Footer SEO
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Predicciones IA",
    aiFootballPredictions: "Predicciones de Fútbol IA",
    onextwoPredictions: "Predicciones 1x2",
    overUnderTips: "Consejos Over/Under",
    handicapBetting: "Apuestas Hándicap",
    aiBettingPerformance: "Rendimiento de Apuestas IA",
    footballTipsToday: "Tips de Fútbol Hoy",
    communityFooter: "Comunidad",
    globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios",
    todayMatches: "Partidos de Hoy",
    solutionFooter: "Solución",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No se garantizan ganancias. Por favor, apueste de manera responsable.",
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
    // Why Choose Section
    whyChooseUs: "Por qué Elegirnos",
    whyChooseTitle: "Por qué Elegir OddsFlow",
    whyChooseSubtitle: "Experimente la diferencia con nuestra plataforma impulsada por IA",
    benefit1Title: "99.9% Disponibilidad",
    benefit1Desc: "Nuestra plataforma funciona 24/7 con fiabilidad empresarial",
    benefit2Title: "Datos en Tiempo Real",
    benefit2Desc: "Obtenga actualizaciones instantáneas de más de 50 casas de apuestas",
    benefit3Title: "Precisión IA",
    benefit3Desc: "Nuestros modelos logran más del 78% de precisión",
    benefit4Title: "Seguro y Privado",
    benefit4Desc: "Encriptación de nivel bancario protege sus datos",
    benefit5Title: "Soporte 24/7",
    benefit5Desc: "Equipo de soporte experto disponible todo el tiempo",
    benefit6Title: "Garantía de Devolución",
    benefit6Desc: "Garantía de devolución de 30 días, sin preguntas",
    // Trusted Section
    trustedBy: "Confianza de Usuarios",
    trustedTitle: "Confiado por Miles",
    trustedSubtitle: "Únase a nuestra comunidad creciente de apostadores exitosos",
    activeUsers: "Usuarios Activos",
    countriesServed: "Países Atendidos",
    predictionsDaily: "Pronósticos Diarios",
    satisfactionRate: "Tasa de Satisfacción",
    testimonial1: "OddsFlow ha cambiado completamente mi enfoque en las apuestas de fútbol. ¡Los pronósticos de IA son increíblemente precisos!",
    testimonial1Author: "Miguel L.",
    testimonial1Role: "Apostador Profesional",
    testimonial2: "El seguimiento de cuotas en tiempo real me ahorra horas cada día. La mejor inversión que he hecho.",
    testimonial2Author: "Ana S.",
    testimonial2Role: "Analista Deportivo",
    testimonial3: "Finalmente una plataforma que cumple sus promesas. La tasa de precisión es inigualable.",
    testimonial3Author: "Marcos J.",
    testimonial3Role: "Entusiasta del Fútbol",
    testimonial4: "He probado muchas plataformas de pronósticos, pero la precisión de IA de OddsFlow está en otro nivel. ¡Muy recomendado!",
    testimonial4Author: "Roberto M.",
    testimonial4Role: "Veterano de Apuestas",
    testimonial5: "Como apasionado del fútbol y La Liga, OddsFlow me ayuda a tomar decisiones más inteligentes. ¡Los datos son increíbles!",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "Fanático del Fútbol",
    // FAQ Section
    faqTitle: "Preguntas Frecuentes",
    faqSubtitle: "Todo lo Que Necesita Saber Sobre OddsFlow",
    faq1Question: "¿Puede la IA realmente analizar partidos de fútbol?",
    faq1Answer: "La IA no es una bola de cristal—no puede predecir el futuro. Sin embargo, puede procesar cantidades masivas de datos mucho más rápido que cualquier humano. OddsFlow utiliza algoritmos para analizar estadísticas históricas, movimientos del mercado y variables de partidos para detectar patrones que el ojo no puede ver. En pocas palabras: No adivinamos el marcador; revelamos el estado real del mercado y los equipos.",
    faq2Question: "¿Usar sus datos garantiza ganancias?",
    faq2Answer: "Seamos honestos: No. Cualquiera que te prometa \"victorias garantizadas\" te está mintiendo. Piensa en OddsFlow como tu asesor táctico—proporcionamos el respaldo de datos y el ángulo analítico para mejorar tu toma de decisiones y tu ventaja. Pero el fútbol es impredecible, y la decisión final (y el riesgo) siempre es tuya.",
    faq3Question: "¿Cómo interpreta OddsFlow los mercados de Hándicap Asiático?",
    faq3Answer: "No solo miramos cuáles son las líneas; miramos cómo se mueven. Rastreamos el flujo de capital y los ajustes de las casas de apuestas para ayudarte a entender dónde está el sentimiento del mercado, o si hay una potencial \"trampa\". Esto te da mucho más valor accionable que solo mirar la tabla de posiciones.",
    faq4Question: "¿Cómo funciona el análisis de tendencias de goles?",
    faq4Answer: "Más allá de solo mirar el promedio de goles por partido, analizamos el \"tempo del partido\" y los hábitos por segmentos de tiempo. Por ejemplo, ¿un equipo tiende a buscar goles en los últimos 15 minutos? ¿O dos estilos de juego específicos suelen resultar en empate? Desenterramos estas estadísticas de capa profunda para ti.",
    faq5Question: "¿Qué ligas cubren?",
    faq5Answer: "Cubrimos todas las ligas principales (las \"Cinco Grandes\"), por supuesto. Pero también cubrimos ligas secundarias y de menor nivel seleccionadas. ¿Por qué? Porque sabemos que la \"ventaja\" y el valor a menudo se esconden en las ligas más pequeñas donde las casas de apuestas son más propensas a cometer errores.",
    faq6Question: "¿Qué hace diferente a OddsFlow de otros sitios de resultados?",
    faq6Answer: "La mayoría de los sitios web solo te dicen qué pasó (marcadores, tarjetas). OddsFlow se enfoca en por qué pasó y qué está pensando el mercado. Nos especializamos en análisis de movimiento de cuotas y comportamiento del mercado. Somos una herramienta para análisis serio, no solo un feed de noticias.",
    faq7Question: "¿Qué análisis específicos proporcionan?",
    faq7Answer: "Nuestras características principales incluyen: Monitoreo de Movimientos del Mercado (seguimiento en tiempo real de cambios significativos en las cuotas), Modelos de Probabilidad (estimaciones de resultados basadas en big data), Indicadores de Tempo del Partido (quién controla el juego vs quién está bajo presión), y Análisis de Cuotas Históricas (cómo han funcionado hándicaps similares en el pasado).",
    faq8Question: "¿Es OddsFlow un sitio de apuestas?",
    faq8Answer: "Absolutamente no. OddsFlow es puramente una empresa de análisis de datos. No aceptamos apuestas, no abrimos mercados y no manejamos ningún fondo de apuestas. Proporcionamos las herramientas para encontrar oro; no somos dueños de la mina.",
    faq9Question: "¿Es adecuado para principiantes?",
    faq9Answer: "Definitivamente. Aunque la lógica detrás de nuestros modelos es compleja, el panel que ves está diseñado para ser simple e intuitivo. Simplificamos los datos para que incluso si eres nuevo en el análisis de fútbol, puedas detectar las tendencias y la dirección del mercado inmediatamente.",
    faq10Question: "Aviso Legal Importante",
    faq10Answer: "Aunque tenemos plena confianza en nuestros modelos, debemos ser claros: Todo el contenido proporcionado por OddsFlow es solo para referencia e investigación. El mercado del fútbol es volátil. Por favor, usa los datos racionalmente y apuesta responsablemente.",
    // What is OddsFlow
    whatIsOddsFlow: "¿Qué es OddsFlow?",
    whatIsDesc1: "OddsFlow es una plataforma que ofrece pronósticos de fútbol generados exclusivamente con Inteligencia Artificial.",
    whatIsDesc2: "Ofrece pronósticos de fútbol IA para más de 100 ligas incluyendo La Liga, Premier League, Serie A, Bundesliga.",
    whatIsDesc3: "La mejor selección de pronósticos se puede ver en nuestras selecciones diarias donde la IA elige los consejos más precisos.",
    whatIsDesc4: "Siga OddsFlow para pronósticos de partidos, análisis detallados de IA y cobertura completa de La Liga y más.",
  },
  PT: {
    home: "Início",
    predictions: "Previsões",
    leagues: "Ligas",
    performance: "AI Performance",
    community: "Comunidade",
    news: "Notícias",
    solution: "Solução",
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
    viewAnalysis: "Ver Analise",
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
    // Footer SEO
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Previsões IA",
    aiFootballPredictions: "Previsões de Futebol IA",
    onextwoPredictions: "Previsões 1x2",
    overUnderTips: "Dicas Over/Under",
    handicapBetting: "Apostas Handicap",
    aiBettingPerformance: "Desempenho de Apostas IA",
    footballTipsToday: "Dicas de Futebol Hoje",
    communityFooter: "Comunidade",
    globalChat: "Chat Global",
    userPredictions: "Previsões de Usuários",
    todayMatches: "Jogos de Hoje",
    solutionFooter: "Solução",
    disclaimer: "Aviso: OddsFlow fornece previsões baseadas em IA apenas para fins informativos e de entretenimento. Não há garantia de lucros. Por favor, aposte com responsabilidade.",
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
    // Why Choose Section
    whyChooseUs: "Por que Nos Escolher",
    whyChooseTitle: "Por que Escolher OddsFlow",
    whyChooseSubtitle: "Experimente a diferença com nossa plataforma impulsionada por IA",
    benefit1Title: "99.9% Disponibilidade",
    benefit1Desc: "Nossa plataforma funciona 24/7 com confiabilidade empresarial",
    benefit2Title: "Dados em Tempo Real",
    benefit2Desc: "Obtenha atualizações instantâneas de mais de 50 casas de apostas",
    benefit3Title: "Precisão IA",
    benefit3Desc: "Nossos modelos alcançam mais de 78% de precisão",
    benefit4Title: "Seguro e Privado",
    benefit4Desc: "Criptografia de nível bancário protege seus dados",
    benefit5Title: "Suporte 24/7",
    benefit5Desc: "Equipe de suporte especializada disponível o tempo todo",
    benefit6Title: "Garantia de Devolução",
    benefit6Desc: "Garantia de devolução de 30 dias, sem perguntas",
    // Trusted Section
    trustedBy: "Confiança dos Usuários",
    trustedTitle: "Confiado por Milhares",
    trustedSubtitle: "Junte-se à nossa comunidade crescente de apostadores de sucesso",
    activeUsers: "Usuários Ativos",
    countriesServed: "Países Atendidos",
    predictionsDaily: "Previsões Diárias",
    satisfactionRate: "Taxa de Satisfação",
    testimonial1: "OddsFlow mudou completamente minha abordagem nas apostas de futebol. As previsões de IA são incrivelmente precisas!",
    testimonial1Author: "Kevin L.",
    testimonial1Role: "Apostador Profissional",
    testimonial2: "O rastreamento de odds em tempo real me economiza horas todos os dias. O melhor investimento que fiz.",
    testimonial2Author: "Emma S.",
    testimonial2Role: "Analista Esportivo",
    testimonial3: "Finalmente uma plataforma que cumpre suas promessas. A taxa de precisão é incomparável.",
    testimonial3Author: "Marcus J.",
    testimonial3Role: "Entusiasta do Futebol",
    testimonial4: "Já testei muitas plataformas de previsão, mas a precisão da IA do OddsFlow está em outro nível. Muito recomendado!",
    testimonial4Author: "Robert M.",
    testimonial4Role: "Veterano de Apostas",
    testimonial5: "Como apaixonado por futebol, OddsFlow me ajuda a tomar decisões mais inteligentes. Os dados são incríveis!",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "Fã de Futebol",
    // FAQ Section
    faqTitle: "Perguntas Frequentes",
    faqSubtitle: "Tudo o que você precisa saber sobre OddsFlow",
    faq1Question: "A IA realmente consegue analisar jogos de futebol?",
    faq1Answer: "A IA não é uma bola de cristal—ela não pode prever o futuro. No entanto, ela pode processar quantidades massivas de dados muito mais rápido do que qualquer humano. OddsFlow usa algoritmos para analisar estatísticas históricas, movimentos de mercado e variáveis de partidas para identificar padrões que o olho nu não percebe. Resumindo: Não adivinhamos o placar; revelamos o estado real do mercado e das equipes.",
    faq2Question: "Usar seus dados garante lucro?",
    faq2Answer: "Vamos ser honestos: Não. Qualquer um que prometa \"vitórias garantidas\" está mentindo para você. Pense no OddsFlow como seu consultor tático—fornecemos o suporte de dados e o ângulo analítico para melhorar sua tomada de decisão e sua vantagem. Mas o futebol é imprevisível, e a decisão final (e o risco) é sempre sua.",
    faq3Question: "Como o OddsFlow interpreta os mercados de Handicap Asiático?",
    faq3Answer: "Não olhamos apenas quais são as linhas; olhamos como elas se movem. Rastreamos o fluxo de capital e os ajustes das casas de apostas para ajudá-lo a entender onde está o sentimento do mercado, ou se há uma potencial \"armadilha\". Isso oferece muito mais valor acionável do que apenas olhar a tabela do campeonato.",
    faq4Question: "Como funciona a análise de tendências de gols?",
    faq4Answer: "Além de olhar a média de gols por jogo, analisamos o \"ritmo da partida\" e hábitos por segmentos de tempo. Por exemplo, uma equipe tende a buscar gols nos últimos 15 minutos? Ou dois estilos de jogo específicos geralmente resultam em empate? Desenterramos essas estatísticas de camada profunda para você.",
    faq5Question: "Quais ligas vocês cobrem?",
    faq5Answer: "Cobrimos todas as principais ligas (as \"Cinco Grandes\"), é claro. Mas também cobrimos ligas secundárias e de nível inferior selecionadas. Por quê? Porque sabemos que a \"vantagem\" e o valor frequentemente se escondem nas ligas menores onde as casas de apostas são mais propensas a cometer erros.",
    faq6Question: "O que torna o OddsFlow diferente de outros sites de resultados?",
    faq6Answer: "A maioria dos sites apenas diz o que aconteceu (placares, cartões). OddsFlow foca em por que aconteceu e o que o mercado está pensando. Especializamo-nos em análise de movimento de odds e comportamento de mercado. Somos uma ferramenta para análise séria, não apenas um feed de notícias.",
    faq7Question: "Que análises específicas vocês fornecem?",
    faq7Answer: "Nossas características principais incluem: Monitoramento de Movimentos de Mercado (rastreamento em tempo real de mudanças significativas de odds), Modelos de Probabilidade (estimativas de resultados baseadas em big data), Indicadores de Ritmo de Partida (quem está controlando o jogo vs quem está sob pressão), e Análise de Odds Históricas (como handicaps similares performaram no passado).",
    faq8Question: "O OddsFlow é um site de apostas?",
    faq8Answer: "Absolutamente não. OddsFlow é puramente uma empresa de análise de dados. Não aceitamos apostas, não abrimos mercados e não lidamos com nenhum fundo de apostas. Fornecemos as ferramentas para encontrar ouro; não somos donos da mina.",
    faq9Question: "É adequado para iniciantes?",
    faq9Answer: "Definitivamente. Embora a lógica por trás de nossos modelos seja complexa, o painel que você vê foi projetado para ser simples e intuitivo. Simplificamos os dados para que, mesmo se você for novo na análise de futebol, possa identificar as tendências e a direção do mercado imediatamente.",
    faq10Question: "Aviso Legal Importante",
    faq10Answer: "Embora tenhamos total confiança em nossos modelos, precisamos ser claros: Todo o conteúdo fornecido pelo OddsFlow é apenas para referência e pesquisa. O mercado de futebol é volátil. Por favor, use os dados racionalmente e aposte com responsabilidade.",
    // What is OddsFlow
    whatIsOddsFlow: "O que é OddsFlow?",
    whatIsDesc1: "OddsFlow é uma plataforma que oferece previsões de futebol geradas exclusivamente com Inteligência Artificial.",
    whatIsDesc2: "Oferece dicas de futebol IA para mais de 100 ligas incluindo Premier League, La Liga, Serie A, Bundesliga.",
    whatIsDesc3: "A melhor seleção de previsões pode ser vista em nossas escolhas diárias onde a IA seleciona as dicas mais precisas.",
    whatIsDesc4: "Siga OddsFlow para dicas de jogos, previsões detalhadas de IA e análises completas.",
  },
  JA: {
    home: "ホーム",
    predictions: "予測",
    leagues: "リーグ",
    performance: "AI パフォーマンス",
    community: "コミュニティ",
    news: "ニュース",
    solution: "ソリューション",
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
    viewAnalysis: "分析を見る",
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
    // Footer SEO
    popularLeagues: "人気リーグ",
    aiPredictionsFooter: "AI予測",
    aiFootballPredictions: "AIサッカー予測",
    onextwoPredictions: "1x2予測",
    overUnderTips: "オーバー/アンダー予想",
    handicapBetting: "ハンディキャップベット",
    aiBettingPerformance: "AIベッティング実績",
    footballTipsToday: "今日のサッカー予想",
    communityFooter: "コミュニティ",
    globalChat: "グローバルチャット",
    userPredictions: "ユーザー予測",
    todayMatches: "今日の試合",
    solutionFooter: "ソリューション",
    disclaimer: "免責事項：OddsFlowはAI駆動の予測を情報および娯楽目的のみで提供しています。利益を保証するものではありません。責任を持ってお楽しみください。",
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
    // Why Choose Section
    whyChooseUs: "選ばれる理由",
    whyChooseTitle: "OddsFlowを選ぶ理由",
    whyChooseSubtitle: "AI搭載プラットフォームで違いを体験",
    benefit1Title: "99.9% 稼働率",
    benefit1Desc: "24時間365日、企業レベルの信頼性で稼働",
    benefit2Title: "リアルタイムデータ",
    benefit2Desc: "50以上のブックメーカーから即時更新",
    benefit3Title: "AI精度",
    benefit3Desc: "78%以上の予測精度を達成",
    benefit4Title: "安全＆プライベート",
    benefit4Desc: "銀行レベルの暗号化でデータを保護",
    benefit5Title: "24時間サポート",
    benefit5Desc: "専門サポートチームが常時対応",
    benefit6Title: "返金保証",
    benefit6Desc: "30日間返金保証、質問不要",
    // Trusted Section
    trustedBy: "ユーザーからの信頼",
    trustedTitle: "数千人に信頼されています",
    trustedSubtitle: "成功したベッターの成長するコミュニティに参加",
    activeUsers: "アクティブユーザー",
    countriesServed: "対応国",
    predictionsDaily: "日間予測数",
    satisfactionRate: "満足度",
    testimonial1: "OddsFlowはサッカーベッティングへのアプローチを完全に変えました。AI予測は驚くほど正確です！",
    testimonial1Author: "Kevin L.",
    testimonial1Role: "プロベッター",
    testimonial2: "リアルタイムのオッズ追跡で毎日数時間節約。最高の投資でした。",
    testimonial2Author: "Emma S.",
    testimonial2Role: "スポーツアナリスト",
    testimonial3: "約束を守るプラットフォーム。精度は比類なし。",
    testimonial3Author: "Marcus J.",
    testimonial3Role: "サッカーファン",
    testimonial4: "多くの予測プラットフォームを試しましたが、OddsFlowのAI精度は別格。強くお勧め！",
    testimonial4Author: "Robert M.",
    testimonial4Role: "ベテランベッター",
    testimonial5: "サッカーファンとして、OddsFlowでより賢い判断ができます。データの洞察は素晴らしい！",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "サッカーファン",
    // FAQ Section
    faqTitle: "よくある質問",
    faqSubtitle: "OddsFlowについて知っておくべきこと",
    faq1Question: "AIは本当にサッカーの試合を分析できるのですか？",
    faq1Answer: "AIは水晶玉ではありません—未来を予測することはできません。しかし、人間よりもはるかに速く大量のデータを処理することができます。OddsFlowはアルゴリズムを使用して過去の統計、市場の動き、試合の変数を分析し、肉眼では見えないパターンを発見します。簡単に言えば：私たちはスコアを推測しません；市場とチームの真の状態を明らかにします。",
    faq2Question: "あなたのデータを使えば利益が保証されますか？",
    faq2Answer: "正直に言いましょう：いいえ。「確実な勝利」を約束する人は嘘をついています。OddsFlowをあなたの戦術アドバイザーと考えてください—私たちはデータの裏付けと分析的な視点を提供し、あなたの意思決定と優位性を向上させます。しかし、サッカーは予測不可能であり、最終的な決定（とリスク）は常にあなた自身のものです。",
    faq3Question: "OddsFlowはアジアンハンディキャップ市場をどのように解釈しますか？",
    faq3Answer: "私たちはラインが何であるかだけでなく、どのように動くかを見ています。資金の流れとブックメーカーの調整を追跡し、市場のセンチメントがどこにあるのか、または潜在的な「罠」があるかどうかを理解するのに役立ちます。これは、リーグ順位表を見るよりもはるかに実用的な価値を提供します。",
    faq4Question: "ゴールトレンド分析はどのように機能しますか？",
    faq4Answer: "試合あたりの平均ゴール数を見るだけでなく、「試合のテンポ」と時間セグメントの習慣を分析します。例えば、あるチームは最後の15分でゴールを追いかける傾向がありますか？または、2つの特定のプレースタイルは通常、膠着状態になりますか？これらの深層統計をあなたのために掘り起こします。",
    faq5Question: "どのリーグをカバーしていますか？",
    faq5Answer: "もちろん、すべての主要リーグ（「ビッグファイブ」）をカバーしています。しかし、選ばれた二次および下位リーグもカバーしています。なぜ？ブックメーカーがミスを犯しやすい小さなリーグに「エッジ」と価値がしばしば隠れていることを知っているからです。",
    faq6Question: "OddsFlowは他のスコアサイトと何が違いますか？",
    faq6Answer: "ほとんどのウェブサイトは何が起こったかを伝えるだけです（スコア、カード）。OddsFlowはなぜそれが起こったのか、そして市場が何を考えているかに焦点を当てています。私たちはオッズの動きの分析と市場行動を専門としています。私たちは真剣な分析のためのツールであり、単なるニュースフィードではありません。",
    faq7Question: "具体的にどのような分析を提供していますか？",
    faq7Answer: "コア機能には以下が含まれます：市場動向モニタリング（重要なオッズの変化のリアルタイム追跡）、確率モデル（ビッグデータに基づく結果推定）、試合テンポ指標（誰がゲームをコントロールしているか vs 誰がプレッシャーを受けているか）、過去のオッズ分析（類似のハンディキャップが過去にどのように機能したか）。",
    faq8Question: "OddsFlowはベッティングサイトですか？",
    faq8Answer: "絶対にありません。OddsFlowは純粋にデータ分析会社です。私たちは賭けを受け付けず、市場を開かず、賭け資金を一切扱いません。私たちは金を掘るためのツールを提供します；鉱山を所有しているわけではありません。",
    faq9Question: "初心者にも適していますか？",
    faq9Answer: "もちろんです。私たちのモデルの背後にあるロジックは複雑ですが、あなたが見るダッシュボードはシンプルで直感的に設計されています。サッカー分析の初心者であっても、トレンドと市場の方向性をすぐに見つけることができるようにデータを簡素化しています。",
    faq10Question: "重要な免責事項",
    faq10Answer: "私たちは私たちのモデルに完全な自信を持っていますが、明確にしなければなりません：OddsFlowが提供するすべてのコンテンツは参考および研究目的のみです。サッカー市場は変動が激しいです。データを合理的に使用し、責任を持って賭けてください。",
    // What is OddsFlow
    whatIsOddsFlow: "OddsFlowとは？",
    whatIsDesc1: "OddsFlowは人工知能のみを使用して生成されたサッカー予測を提供するプラットフォームです。",
    whatIsDesc2: "プレミアリーグ、ラ・リーガ、セリエA、ブンデスリーガを含む100以上のリーグのAIサッカーヒントを提供。",
    whatIsDesc3: "最高の予測セレクションは、AIが最も正確なヒントを選ぶ日次ピックで確認できます。",
    whatIsDesc4: "OddsFlowをフォローして試合のヒント、詳細なAI予測、完全な分析を入手。",
  },
  KO: {
    home: "홈",
    predictions: "예측",
    leagues: "리그",
    performance: "AI 성과",
    community: "커뮤니티",
    news: "뉴스",
    solution: "솔루션",
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
    viewAnalysis: "분석 보기",
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
    // Footer SEO
    popularLeagues: "인기 리그",
    aiPredictionsFooter: "AI 예측",
    aiFootballPredictions: "AI 축구 예측",
    onextwoPredictions: "1x2 예측",
    overUnderTips: "오버/언더 팁",
    handicapBetting: "핸디캡 베팅",
    aiBettingPerformance: "AI 베팅 성과",
    footballTipsToday: "오늘의 축구 팁",
    communityFooter: "커뮤니티",
    globalChat: "글로벌 채팅",
    userPredictions: "사용자 예측",
    todayMatches: "오늘의 경기",
    solutionFooter: "솔루션",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 예측을 제공합니다. 수익을 보장하지 않습니다. 책임감 있게 베팅하세요.",
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
    // Why Choose Section
    whyChooseUs: "선택 이유",
    whyChooseTitle: "OddsFlow를 선택하는 이유",
    whyChooseSubtitle: "AI 기반 플랫폼으로 차이를 경험하세요",
    benefit1Title: "99.9% 가동률",
    benefit1Desc: "24시간 연중무휴 엔터프라이즈급 안정성으로 운영",
    benefit2Title: "실시간 데이터",
    benefit2Desc: "50개 이상의 북메이커에서 즉시 업데이트",
    benefit3Title: "AI 정확도",
    benefit3Desc: "78% 이상의 예측 정확도 달성",
    benefit4Title: "안전 & 개인정보",
    benefit4Desc: "은행 수준의 암호화로 데이터 보호",
    benefit5Title: "24시간 지원",
    benefit5Desc: "전문 지원팀이 항상 대기",
    benefit6Title: "환불 보장",
    benefit6Desc: "30일 환불 보장, 질문 없음",
    // Trusted Section
    trustedBy: "사용자 신뢰",
    trustedTitle: "수천 명이 신뢰합니다",
    trustedSubtitle: "성공적인 베터들의 성장하는 커뮤니티에 참여하세요",
    activeUsers: "활성 사용자",
    countriesServed: "서비스 국가",
    predictionsDaily: "일일 예측",
    satisfactionRate: "만족도",
    testimonial1: "OddsFlow는 축구 베팅에 대한 접근 방식을 완전히 바꿨습니다. AI 예측이 놀랍도록 정확합니다!",
    testimonial1Author: "Kevin L.",
    testimonial1Role: "프로 베터",
    testimonial2: "실시간 배당률 추적으로 매일 몇 시간을 절약합니다. 최고의 투자였습니다.",
    testimonial2Author: "Emma S.",
    testimonial2Role: "스포츠 분석가",
    testimonial3: "약속을 지키는 플랫폼. 정확도는 비교할 수 없습니다.",
    testimonial3Author: "Marcus J.",
    testimonial3Role: "축구 애호가",
    testimonial4: "많은 예측 플랫폼을 시도했지만 OddsFlow의 AI 정확도는 다른 수준입니다. 강력 추천!",
    testimonial4Author: "Robert M.",
    testimonial4Role: "베팅 베테랑",
    testimonial5: "열정적인 축구 팬으로서 OddsFlow로 더 현명한 결정을 내립니다. 데이터 인사이트가 놀랍습니다!",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "축구 팬",
    // FAQ Section
    faqTitle: "자주 묻는 질문",
    faqSubtitle: "OddsFlow에 대해 알아야 할 모든 것",
    faq1Question: "AI가 정말 축구 경기를 분석할 수 있나요?",
    faq1Answer: "AI는 수정구슬이 아닙니다—미래를 예측할 수 없습니다. 하지만 어떤 인간보다 훨씬 빠르게 방대한 양의 데이터를 처리할 수 있습니다. OddsFlow는 알고리즘을 사용하여 역사적 통계, 시장 움직임, 경기 변수를 분석하여 육안으로 보이지 않는 패턴을 발견합니다. 간단히 말해: 우리는 점수를 추측하지 않습니다; 시장과 팀의 실제 상태를 드러냅니다.",
    faq2Question: "당신의 데이터를 사용하면 수익이 보장되나요?",
    faq2Answer: "솔직히 말씀드리면: 아닙니다. \"확실한 승리\"를 약속하는 사람은 거짓말을 하고 있습니다. OddsFlow를 전술 고문으로 생각하세요—우리는 의사결정과 우위를 향상시키기 위한 데이터 지원과 분석적 관점을 제공합니다. 하지만 축구는 예측 불가능하고, 최종 결정(과 위험)은 항상 당신의 것입니다.",
    faq3Question: "OddsFlow는 아시안 핸디캡 시장을 어떻게 해석하나요?",
    faq3Answer: "우리는 라인이 무엇인지만 보지 않습니다; 어떻게 움직이는지 봅니다. 자본 흐름과 북메이커 조정을 추적하여 시장 심리가 어디에 있는지, 또는 잠재적인 \"함정\"이 있는지 이해하는 데 도움을 줍니다. 이것은 리그 순위표를 보는 것보다 훨씬 더 실행 가능한 가치를 제공합니다.",
    faq4Question: "골 트렌드 분석은 어떻게 작동하나요?",
    faq4Answer: "경기당 평균 골 수를 보는 것 외에도, \"경기 템포\"와 시간대별 습관을 분석합니다. 예를 들어, 팀이 마지막 15분에 골을 쫓는 경향이 있나요? 아니면 두 가지 특정 플레이 스타일이 보통 교착 상태를 만드나요? 우리는 이러한 깊은 층의 통계를 당신을 위해 발굴합니다.",
    faq5Question: "어떤 리그를 다루나요?",
    faq5Answer: "물론 모든 주요 리그(\"빅 파이브\")를 다룹니다. 하지만 선택된 2부 리그와 하위 리그도 다룹니다. 왜? 북메이커가 실수를 저지르기 쉬운 작은 리그에 \"엣지\"와 가치가 종종 숨어 있기 때문입니다.",
    faq6Question: "OddsFlow는 다른 스코어 사이트와 무엇이 다른가요?",
    faq6Answer: "대부분의 웹사이트는 무슨 일이 일어났는지만 알려줍니다(스코어, 카드). OddsFlow는 왜 그런 일이 일어났는지와 시장이 무엇을 생각하는지에 초점을 맞춥니다. 우리는 배당률 움직임 분석과 시장 행동을 전문으로 합니다. 우리는 진지한 분석을 위한 도구이지, 단순한 뉴스 피드가 아닙니다.",
    faq7Question: "구체적으로 어떤 분석을 제공하나요?",
    faq7Answer: "핵심 기능에는 다음이 포함됩니다: 시장 움직임 모니터링(중요한 배당률 변화의 실시간 추적), 확률 모델(빅 데이터 기반 결과 추정), 경기 템포 지표(누가 경기를 지배하는지 vs 누가 압박을 받는지), 과거 배당률 분석(과거에 유사한 핸디캡이 어떻게 작동했는지).",
    faq8Question: "OddsFlow는 베팅 사이트인가요?",
    faq8Answer: "절대 아닙니다. OddsFlow는 순수한 데이터 분석 회사입니다. 우리는 베팅을 받지 않고, 시장을 열지 않으며, 베팅 자금을 일절 다루지 않습니다. 우리는 금을 캐기 위한 도구를 제공합니다; 광산을 소유하고 있지 않습니다.",
    faq9Question: "초보자에게 적합한가요?",
    faq9Answer: "물론입니다. 우리 모델 뒤에 있는 논리는 복잡하지만, 당신이 보는 대시보드는 단순하고 직관적으로 설계되었습니다. 축구 분석을 처음 접하더라도 트렌드와 시장 방향을 즉시 발견할 수 있도록 데이터를 단순화합니다.",
    faq10Question: "중요한 면책 조항",
    faq10Answer: "우리는 모델에 대한 완전한 확신을 가지고 있지만, 명확히 해야 합니다: OddsFlow가 제공하는 모든 콘텐츠는 참조 및 연구 목적으로만 제공됩니다. 축구 시장은 변동성이 큽니다. 데이터를 합리적으로 사용하고 책임감 있게 베팅하세요.",
    // What is OddsFlow
    whatIsOddsFlow: "OddsFlow란?",
    whatIsDesc1: "OddsFlow는 인공지능만을 사용하여 생성된 축구 예측을 제공하는 플랫폼입니다.",
    whatIsDesc2: "프리미어리그, 라리가, 세리에A, 분데스리가를 포함한 100개 이상의 리그에 대한 AI 축구 팁을 제공합니다.",
    whatIsDesc3: "AI가 가장 정확한 팁을 선택하는 일일 픽에서 최고의 예측 선택을 확인할 수 있습니다.",
    whatIsDesc4: "경기 팁, 상세한 AI 예측, 완전한 분석을 위해 OddsFlow를 팔로우하세요.",
  },
  DE: {
    home: "Startseite",
    predictions: "Vorhersagen",
    leagues: "Ligen",
    performance: "AI Performance",
    community: "Community",
    news: "Nachrichten",
    solution: "Lösung",
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
    viewAnalysis: "Analyse ansehen",
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
    // Footer SEO
    popularLeagues: "Beliebte Ligen",
    aiPredictionsFooter: "KI-Vorhersagen",
    aiFootballPredictions: "KI-Fußballvorhersagen",
    onextwoPredictions: "1x2 Vorhersagen",
    overUnderTips: "Über/Unter Tipps",
    handicapBetting: "Handicap-Wetten",
    aiBettingPerformance: "KI-Wettleistung",
    footballTipsToday: "Fußballtipps Heute",
    communityFooter: "Community",
    globalChat: "Globaler Chat",
    userPredictions: "Benutzer-Vorhersagen",
    todayMatches: "Heutige Spiele",
    solutionFooter: "Lösung",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestützte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Es werden keine Gewinne garantiert. Bitte wetten Sie verantwortungsvoll.",
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
    // Why Choose Section
    whyChooseUs: "Warum uns wählen",
    whyChooseTitle: "Warum OddsFlow wählen",
    whyChooseSubtitle: "Erleben Sie den Unterschied mit unserer KI-gestützten Plattform",
    benefit1Title: "99.9% Verfügbarkeit",
    benefit1Desc: "Unsere Plattform läuft 24/7 mit Enterprise-Grade-Zuverlässigkeit",
    benefit2Title: "Echtzeit-Daten",
    benefit2Desc: "Sofortige Updates von über 50 Buchmachern",
    benefit3Title: "KI-Genauigkeit",
    benefit3Desc: "Unsere Modelle erreichen über 78% Genauigkeit",
    benefit4Title: "Sicher & Privat",
    benefit4Desc: "Bank-Level-Verschlüsselung schützt Ihre Daten",
    benefit5Title: "24/7 Support",
    benefit5Desc: "Experten-Support-Team rund um die Uhr verfügbar",
    benefit6Title: "Geld-zurück-Garantie",
    benefit6Desc: "30 Tage Geld-zurück-Garantie, keine Fragen",
    // Trusted Section
    trustedBy: "Nutzervertrauen",
    trustedTitle: "Von Tausenden vertraut",
    trustedSubtitle: "Treten Sie unserer wachsenden Community erfolgreicher Wetter bei",
    activeUsers: "Aktive Nutzer",
    countriesServed: "Bediente Länder",
    predictionsDaily: "Tägliche Vorhersagen",
    satisfactionRate: "Zufriedenheitsrate",
    testimonial1: "OddsFlow hat meine Herangehensweise an Fußballwetten komplett verändert. Die KI-Vorhersagen sind unglaublich genau!",
    testimonial1Author: "Kevin L.",
    testimonial1Role: "Profiwetter",
    testimonial2: "Die Echtzeit-Quoten-Verfolgung spart mir jeden Tag Stunden. Beste Investition.",
    testimonial2Author: "Emma S.",
    testimonial2Role: "Sportanalyst",
    testimonial3: "Endlich eine Plattform, die ihre Versprechen hält. Die Genauigkeit ist unübertroffen.",
    testimonial3Author: "Marcus J.",
    testimonial3Role: "Fußball-Enthusiast",
    testimonial4: "Ich habe viele Vorhersage-Plattformen getestet, aber OddsFlows KI-Genauigkeit ist auf einem anderen Level. Sehr empfohlen!",
    testimonial4Author: "Robert M.",
    testimonial4Role: "Wett-Veteran",
    testimonial5: "Als leidenschaftlicher Fußballfan hilft mir OddsFlow, klügere Entscheidungen zu treffen. Die Daten-Insights sind unglaublich!",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "Fußballfan",
    // FAQ Section
    faqTitle: "Häufig gestellte Fragen",
    faqSubtitle: "Alles, was Sie über OddsFlow wissen müssen",
    faq1Question: "Kann KI wirklich Fußballspiele analysieren?",
    faq1Answer: "KI ist keine Kristallkugel—sie kann die Zukunft nicht vorhersagen. Allerdings kann sie massive Datenmengen viel schneller verarbeiten als jeder Mensch. OddsFlow verwendet Algorithmen, um historische Statistiken, Marktbewegungen und Spielvariablen zu analysieren und Muster zu erkennen, die das bloße Auge übersieht. Einfach gesagt: Wir raten nicht den Spielstand; wir enthüllen den wahren Zustand des Marktes und der Teams.",
    faq2Question: "Garantiert die Nutzung Ihrer Daten Gewinn?",
    faq2Answer: "Seien wir ehrlich: Nein. Wer Ihnen \"garantierte Gewinne\" verspricht, lügt Sie an. Betrachten Sie OddsFlow als Ihren taktischen Berater—wir liefern die Datenunterstützung und den analytischen Blickwinkel, um Ihre Entscheidungsfindung und Ihren Vorteil zu verbessern. Aber Fußball ist unvorhersehbar, und die endgültige Entscheidung (und das Risiko) liegt immer bei Ihnen.",
    faq3Question: "Wie interpretiert OddsFlow die Asian Handicap-Märkte?",
    faq3Answer: "Wir schauen nicht nur darauf, was die Linien sind; wir schauen, wie sie sich bewegen. Wir verfolgen Kapitalflüsse und Buchmacher-Anpassungen, um Ihnen zu helfen zu verstehen, wo die Marktstimmung liegt, oder ob es eine potenzielle \"Falle\" gibt. Das gibt Ihnen viel mehr handlungsorientierten Wert als nur die Tabelle anzuschauen.",
    faq4Question: "Wie funktioniert die Toretrend-Analyse?",
    faq4Answer: "Über den Blick auf durchschnittliche Tore pro Spiel hinaus analysieren wir \"Spieltempo\" und Zeitsegment-Gewohnheiten. Zum Beispiel: Neigt ein Team dazu, in den letzten 15 Minuten Tore zu jagen? Oder führen zwei bestimmte Spielstile normalerweise zu einem Unentschieden? Wir graben diese tiefschichtigen Statistiken für Sie aus.",
    faq5Question: "Welche Ligen decken Sie ab?",
    faq5Answer: "Natürlich alle großen Ligen (die \"Big Five\"). Aber wir decken auch ausgewählte Zweit- und unterklassige Ligen ab. Warum? Weil wir wissen, dass der \"Edge\" und der Wert oft in kleineren Ligen versteckt sind, wo Buchmacher eher Fehler machen.",
    faq6Question: "Was unterscheidet OddsFlow von anderen Ergebnis-Seiten?",
    faq6Answer: "Die meisten Websites sagen Ihnen nur, was passiert ist (Ergebnisse, Karten). OddsFlow konzentriert sich darauf, warum es passiert ist und was der Markt denkt. Wir spezialisieren uns auf die Analyse von Quotenbewegungen und Marktverhalten. Wir sind ein Werkzeug für ernsthafte Analyse, nicht nur ein News-Feed.",
    faq7Question: "Welche spezifischen Analysen bieten Sie an?",
    faq7Answer: "Unsere Kernfunktionen umfassen: Marktbewegungsüberwachung (Echtzeit-Tracking signifikanter Quotenänderungen), Wahrscheinlichkeitsmodelle (Ergebnisschätzungen basierend auf Big Data), Spieltempo-Indikatoren (wer kontrolliert das Spiel vs wer steht unter Druck) und Historische Quotenanalyse (wie ähnliche Handicaps in der Vergangenheit abgeschnitten haben).",
    faq8Question: "Ist OddsFlow eine Wettseite?",
    faq8Answer: "Absolut nicht. OddsFlow ist ein reines Datenanalyse-Unternehmen. Wir akzeptieren keine Wetten, eröffnen keine Märkte und handhaben keine Wettgelder. Wir liefern die Werkzeuge zum Goldschürfen; wir besitzen die Mine nicht.",
    faq9Question: "Ist es für Anfänger geeignet?",
    faq9Answer: "Definitiv. Obwohl die Logik hinter unseren Modellen komplex ist, ist das Dashboard, das Sie sehen, einfach und intuitiv gestaltet. Wir vereinfachen die Daten, sodass Sie, selbst wenn Sie neu in der Fußballanalyse sind, die Trends und die Marktrichtung sofort erkennen können.",
    faq10Question: "Wichtiger Haftungsausschluss",
    faq10Answer: "Obwohl wir volles Vertrauen in unsere Modelle haben, müssen wir klarstellen: Alle von OddsFlow bereitgestellten Inhalte dienen nur als Referenz und zur Recherche. Der Fußballmarkt ist volatil. Bitte nutzen Sie die Daten rational und wetten Sie verantwortungsvoll.",
    // What is OddsFlow
    whatIsOddsFlow: "Was ist OddsFlow?",
    whatIsDesc1: "OddsFlow ist eine Plattform, die ausschließlich mit Künstlicher Intelligenz generierte Fußballvorhersagen anbietet.",
    whatIsDesc2: "Bietet KI-Fußballtipps für über 100 Ligen einschließlich Premier League, La Liga, Serie A, Bundesliga.",
    whatIsDesc3: "Die beste Auswahl an Vorhersagen finden Sie in unseren täglichen Picks, wo die KI die genauesten Tipps auswählt.",
    whatIsDesc4: "Folgen Sie OddsFlow für Spieltipps, detaillierte KI-Vorhersagen und vollständige Analysen.",
  },
  FR: {
    home: "Accueil",
    predictions: "Prédictions",
    leagues: "Ligues",
    performance: "AI Performance",
    community: "Communauté",
    news: "Actualités",
    solution: "Solution",
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
    viewAnalysis: "Voir l'Analyse",
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
    // Footer SEO
    popularLeagues: "Ligues Populaires",
    aiPredictionsFooter: "Prédictions IA",
    aiFootballPredictions: "Prédictions Football IA",
    onextwoPredictions: "Prédictions 1x2",
    overUnderTips: "Conseils Over/Under",
    handicapBetting: "Paris Handicap",
    aiBettingPerformance: "Performance Paris IA",
    footballTipsToday: "Pronostics Foot Aujourd'hui",
    communityFooter: "Communauté",
    globalChat: "Chat Global",
    userPredictions: "Prédictions Utilisateurs",
    todayMatches: "Matchs du Jour",
    solutionFooter: "Solution",
    disclaimer: "Avertissement : OddsFlow fournit des prédictions basées sur l'IA à des fins d'information et de divertissement uniquement. Aucun profit n'est garanti. Veuillez parier de manière responsable.",
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
    // Why Choose Section
    whyChooseUs: "Pourquoi Nous Choisir",
    whyChooseTitle: "Pourquoi Choisir OddsFlow",
    whyChooseSubtitle: "Découvrez ce qui différencie notre plateforme alimentée par l'IA",
    benefit1Title: "99,9% de disponibilité",
    benefit1Desc: "Notre plateforme fonctionne 24/7 avec une fiabilité de niveau entreprise",
    benefit2Title: "Données en temps réel",
    benefit2Desc: "Obtenez des mises à jour instantanées de plus de 50 bookmakers dans le monde",
    benefit3Title: "Précision IA",
    benefit3Desc: "Nos modèles atteignent plus de 78% de précision de prédiction",
    benefit4Title: "Sécurité et confidentialité",
    benefit4Desc: "Cryptage de niveau bancaire pour protéger vos données",
    benefit5Title: "Support 24/7",
    benefit5Desc: "L'équipe de support dédiée est toujours disponible pour vous aider",
    benefit6Title: "Garantie de remboursement",
    benefit6Desc: "Garantie de remboursement de 30 jours, sans questions",
    // Trusted Section
    trustedBy: "Ils Nous Font Confiance",
    trustedTitle: "Approuvé par des Milliers",
    trustedSubtitle: "Rejoignez notre communauté grandissante de parieurs à succès",
    activeUsers: "Utilisateurs Actifs",
    countriesServed: "Pays Desservis",
    predictionsDaily: "Prédictions Quotidiennes",
    satisfactionRate: "Taux de Satisfaction",
    testimonial1: "OddsFlow a transformé ma façon de parier sur le football. Les prédictions IA sont incroyablement précises !",
    testimonial1Author: "Kevin L.",
    testimonial1Role: "Parieur Professionnel",
    testimonial2: "Le suivi des cotes en temps réel me fait économiser des heures chaque jour. Meilleur investissement que j'ai fait.",
    testimonial2Author: "Emma S.",
    testimonial2Role: "Analyste Sportif",
    testimonial3: "Enfin une plateforme qui tient ses promesses. La précision est inégalée.",
    testimonial3Author: "Marcus J.",
    testimonial3Role: "Passionné de Football",
    testimonial4: "J'ai essayé de nombreuses plateformes de prédiction, mais la précision de l'IA d'OddsFlow est d'un autre niveau. Fortement recommandé !",
    testimonial4Author: "Robert M.",
    testimonial4Role: "Parieur Expérimenté",
    testimonial5: "En tant que fan de football passionné, OddsFlow m'aide à prendre des décisions plus intelligentes. Les données sont incroyables !",
    testimonial5Author: "Carlos R.",
    testimonial5Role: "Fan de Football",
    // FAQ Section
    faqTitle: "Questions Fréquentes",
    faqSubtitle: "Tout ce que vous devez savoir sur OddsFlow",
    faq1Question: "L'IA peut-elle vraiment analyser les matchs de football ?",
    faq1Answer: "L'IA n'est pas une boule de cristal—elle ne peut pas prédire l'avenir. Cependant, elle peut traiter des quantités massives de données bien plus rapidement que n'importe quel humain. OddsFlow utilise des algorithmes pour analyser les statistiques historiques, les mouvements du marché et les variables des matchs pour repérer des patterns que l'œil nu ne voit pas. En bref : Nous ne devinons pas le score ; nous révélons l'état réel du marché et des équipes.",
    faq2Question: "L'utilisation de vos données garantit-elle des profits ?",
    faq2Answer: "Soyons honnêtes : Non. Quiconque vous promet des \"gains garantis\" vous ment. Considérez OddsFlow comme votre conseiller tactique—nous fournissons le support de données et l'angle analytique pour améliorer votre prise de décision et votre avantage. Mais le football est imprévisible, et la décision finale (et le risque) vous appartient toujours.",
    faq3Question: "Comment OddsFlow interprète-t-il les marchés Handicap Asiatique ?",
    faq3Answer: "Nous ne regardons pas seulement quelles sont les lignes ; nous regardons comment elles bougent. Nous suivons les flux de capitaux et les ajustements des bookmakers pour vous aider à comprendre où se situe le sentiment du marché, ou s'il y a un potentiel \"piège\". Cela vous donne bien plus de valeur actionnable que de simplement regarder le classement.",
    faq4Question: "Comment fonctionne l'analyse des tendances de buts ?",
    faq4Answer: "Au-delà de simplement regarder la moyenne de buts par match, nous analysons le \"tempo du match\" et les habitudes par segments de temps. Par exemple, une équipe a-t-elle tendance à chercher des buts dans les 15 dernières minutes ? Ou deux styles de jeu spécifiques résultent-ils généralement en un match nul ? Nous déterrons ces statistiques de couche profonde pour vous.",
    faq5Question: "Quelles ligues couvrez-vous ?",
    faq5Answer: "Nous couvrons toutes les ligues majeures (les \"Big Five\"), bien sûr. Mais nous couvrons aussi des ligues secondaires et de niveau inférieur sélectionnées. Pourquoi ? Parce que nous savons que l'\"edge\" et la valeur se cachent souvent dans les petites ligues où les bookmakers sont plus susceptibles de faire des erreurs.",
    faq6Question: "Qu'est-ce qui différencie OddsFlow des autres sites de scores ?",
    faq6Answer: "La plupart des sites web vous disent juste ce qui s'est passé (scores, cartons). OddsFlow se concentre sur pourquoi c'est arrivé et ce que pense le marché. Nous nous spécialisons dans l'analyse des mouvements de cotes et le comportement du marché. Nous sommes un outil pour une analyse sérieuse, pas juste un fil d'actualités.",
    faq7Question: "Quelles analyses spécifiques fournissez-vous ?",
    faq7Answer: "Nos fonctionnalités principales incluent : Surveillance des Mouvements du Marché (suivi en temps réel des changements significatifs de cotes), Modèles de Probabilité (estimations de résultats basées sur le big data), Indicateurs de Tempo de Match (qui contrôle le jeu vs qui est sous pression), et Analyse des Cotes Historiques (comment des handicaps similaires ont performé dans le passé).",
    faq8Question: "OddsFlow est-il un site de paris ?",
    faq8Answer: "Absolument pas. OddsFlow est purement une société d'analyse de données. Nous n'acceptons pas de paris, n'ouvrons pas de marchés et ne gérons aucun fonds de paris. Nous fournissons les outils pour chercher de l'or ; nous ne possédons pas la mine.",
    faq9Question: "Est-ce adapté aux débutants ?",
    faq9Answer: "Définitivement. Bien que la logique derrière nos modèles soit complexe, le tableau de bord que vous voyez est conçu pour être simple et intuitif. Nous simplifions les données pour que même si vous êtes nouveau dans l'analyse du football, vous puissiez repérer les tendances et la direction du marché immédiatement.",
    faq10Question: "Avertissement Important",
    faq10Answer: "Bien que nous ayons pleine confiance en nos modèles, nous devons être clairs : Tout le contenu fourni par OddsFlow est uniquement à titre de référence et de recherche. Le marché du football est volatile. Veuillez utiliser les données de manière rationnelle et parier de manière responsable.",
    // What is OddsFlow
    whatIsOddsFlow: "Qu'est-ce que OddsFlow ?",
    whatIsDesc1: "OddsFlow est une plateforme qui génère des prédictions de football entièrement par intelligence artificielle.",
    whatIsDesc2: "Fournit des prédictions IA pour plus de 100 ligues de football, y compris la Premier League, La Liga, Serie A, Bundesliga, Ligue des Champions et plus.",
    whatIsDesc3: "Consultez les meilleures prédictions de paris dans nos sélections quotidiennes, avec les conseils de football les plus précis sélectionnés par l'IA.",
    whatIsDesc4: "Suivez OddsFlow pour des conseils de match, des prédictions IA détaillées (possession, tirs, corners, rapports H2H, cotes et plus).",
  },
};

// ============ Language Context ============
type LanguageContextType = {
  lang: string;
  locale: string;
  t: (key: string) => string;
  localePath: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function LanguageProvider({ children, locale }: { children: ReactNode; locale: string }) {
  // Map URL locale to translation code
  const lang = localeToTranslationCode[locale as keyof typeof localeToTranslationCode] || 'EN';

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["EN"]?.[key] || key;
  };

  // Helper function to create locale-aware paths
  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, locale, t, localePath }}>
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
  const { locale: currentLocale } = useLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer"
      >
        <FlagIcon code={currentLocale} size={20} />
        <span className="font-medium uppercase">{currentLocale === 'zh' ? '中文' : currentLocale.toUpperCase()}</span>
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
        <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
          {locales.map((loc) => {
            // English uses root /, others use /locale
            const href = loc === 'en' ? '/' : `/${loc}`;
            return (
              <Link
                key={loc}
                href={href}
                className={`block w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${
                  currentLocale === loc ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'
                }`}
              >
                <FlagIcon code={loc} size={24} />
                <span className="font-medium">{localeNames[loc]}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============ Navigation ============
function Navbar() {
  const { t, localePath } = useLanguage();
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
    { href: localePath('/'), label: t('home'), active: true },
    { href: localePath('/predictions'), label: t('predictions') },
    { href: localePath('/leagues'), label: t('leagues') },
    { href: localePath('/performance'), label: t('performance') },
    { href: localePath('/community'), label: t('community') },
    { href: localePath('/news'), label: t('news') },
    { href: localePath('/solution'), label: t('solution') },
    { href: localePath('/pricing'), label: t('pricing') },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <Link href={localePath('/')} className="flex items-center gap-3 flex-shrink-0">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            {/* Desktop Navigation - Center */}
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
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <LanguageSwitcher />

              {user ? (
                <Link href={localePath('/dashboard')} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
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

              {/* World Cup Special Button - Always Visible */}
              <Link
                href={localePath('/worldcup')}
                className="relative hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all cursor-pointer group overflow-hidden hover:scale-105"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                <img
                  src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png"
                  alt="FIFA World Cup 2026"
                  className="h-5 w-auto object-contain relative z-10"
                />
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
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
              {/* World Cup Special Entry */}
              <Link
                href={localePath('/worldcup')}
                onClick={() => setMobileMenuOpen(false)}
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 border-2 border-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img
                  src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png"
                  alt="FIFA World Cup 2026"
                  className="h-8 w-auto object-contain relative z-10"
                />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
              </Link>

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
  const { t, localePath } = useLanguage();

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
          <Link href={localePath('/get-started')} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 cursor-pointer text-center">{t('startAnalyzing')}</Link>
          <Link href={localePath('/predictions')} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer text-center">{t('viewLiveOdds')}</Link>
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
      // Get current date in ISO format for filtering upcoming matches
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('prematches')
        .select('home_name, away_name, home_logo, away_logo')
        .eq('type', 'Scheduled')
        .gte('start_date_msia', now)  // Only future matches
        .order('start_date_msia', { ascending: true })  // Soonest first
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

  // Priority leagues that should always appear
  const priorityLeagues: LeagueData[] = [
    { league_name: 'Premier League', league_logo: 'https://media.api-sports.io/football/leagues/39.png', count: 380 },
    { league_name: 'La Liga', league_logo: 'https://media.api-sports.io/football/leagues/140.png', count: 380 },
    { league_name: 'Bundesliga', league_logo: 'https://media.api-sports.io/football/leagues/78.png', count: 306 },
    { league_name: 'Serie A', league_logo: 'https://media.api-sports.io/football/leagues/135.png', count: 380 },
    { league_name: 'Ligue 1', league_logo: 'https://media.api-sports.io/football/leagues/61.png', count: 306 },
    { league_name: 'UEFA Champions League', league_logo: 'https://media.api-sports.io/football/leagues/2.png', count: 125 },
  ];

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

        // Merge with priority leagues - use DB data if available, otherwise use defaults
        const finalLeagues: LeagueData[] = priorityLeagues.map(priority => {
          // Check if this priority league exists in DB results
          for (const [name, dbData] of leagueMap.entries()) {
            if (name.toLowerCase().includes(priority.league_name.toLowerCase()) ||
                priority.league_name.toLowerCase().includes(name.toLowerCase())) {
              return {
                league_name: priority.league_name, // Use consistent naming
                league_logo: dbData.logo || priority.league_logo,
                count: dbData.count
              };
            }
          }
          // Use default priority league data if not in DB
          return priority;
        });

        setLeagues(finalLeagues);
      } catch (error) {
        console.error('Error fetching leagues:', error);
        // On error, show priority leagues with default data
        setLeagues(priorityLeagues);
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
              // League name to slug mapping
              const leagueSlugMap: Record<string, string> = {
                'Premier League': 'premier-league',
                'La Liga': 'la-liga',
                'Bundesliga': 'bundesliga',
                'Serie A': 'serie-a',
                'Ligue 1': 'ligue-1',
                'UEFA Champions League': 'champions-league',
                'Eredivisie': 'eredivisie',
                'Primeira Liga': 'primeira-liga',
                'Super Lig': 'super-lig',
              };
              const getLeagueSlug = (name: string) => {
                for (const key of Object.keys(leagueSlugMap)) {
                  if (name.toLowerCase().includes(key.toLowerCase())) return leagueSlugMap[key];
                }
                return name.toLowerCase().replace(/\s+/g, '-');
              };
              return (
              <Link
                key={index}
                href={`/leagues/${getLeagueSlug(league.league_name)}`}
                className="group relative flex items-center justify-between p-5 rounded-2xl bg-[#0d1117] border border-gray-800/50 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden cursor-pointer"
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
              </Link>
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
  const { t, localePath } = useLanguage();
  const [matches, setMatches] = useState<Prematch[]>([]);
  const [predictions, setPredictions] = useState<Map<number, { home: number; draw: number; away: number }>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        // Fetch matches
        const { data: matchesData, error: matchesError } = await supabase
          .from('prematches')
          .select('*')
          .eq('type', 'Scheduled')
          .order('start_date_msia', { ascending: true })
          .limit(8);

        if (matchesError) throw matchesError;
        setMatches(matchesData || []);

        // Fetch 1x2 predictions for these matches (from predictions_match table)
        if (matchesData && matchesData.length > 0) {
          const fixtureIds = matchesData.map((m: Prematch) => m.fixture_id);
          const { data: predictionsData } = await supabase
            .from('predictions_match')
            .select('fixture_id, prob_home, prob_draw, prob_away')
            .in('fixture_id', fixtureIds);

          if (predictionsData) {
            const predMap = new Map<number, { home: number; draw: number; away: number }>();
            predictionsData.forEach((p: any) => {
              // Only store the first prediction for each fixture
              if (!predMap.has(p.fixture_id)) {
                predMap.set(p.fixture_id, {
                  home: Math.round(p.prob_home || 0),
                  draw: Math.round(p.prob_draw || 0),
                  away: Math.round(p.prob_away || 0),
                });
              }
            });
            setPredictions(predMap);
          }
        }
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

  // Get 1x2 probabilities for a match
  const getProbabilities = (fixtureId: number) => {
    const pred = predictions.get(fixtureId);
    if (pred) return pred;
    // Default fallback if no prediction found
    return { home: 33, draw: 34, away: 33 };
  };

  // Format date for URL (YYYY-MM-DD)
  const formatDateForUrl = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
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
                  const probs = getProbabilities(match.fixture_id);
                  // Generate SEO-friendly URL
                  const matchSlug = `${generateMatchSlug(match.home_name, match.away_name)}-${match.fixture_id}`;
                  const matchDate = formatDateForUrl(match.start_date_msia);
                  const matchUrl = localePath(`/predictions/${matchDate}/${matchSlug}`);
                  return (
                    <Link
                      key={match.id}
                      href={matchUrl}
                      className="group relative border-b border-gray-800/30 hover:bg-emerald-500/5 transition-all duration-300 overflow-hidden block cursor-pointer"
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

                        {/* 1x2 Probabilities Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {probs.home}%
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-700/50 text-gray-300 border border-gray-600/30">
                              {probs.draw}%
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                              {probs.away}%
                            </span>
                          </div>
                          <span className="text-emerald-400 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t('viewAnalysis')}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
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

                        {/* 1x2 Probabilities */}
                        <div className="col-span-3 relative">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors">
                              {probs.home}%
                            </span>
                            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-gray-700/50 text-gray-300 border border-gray-600/30 group-hover:bg-gray-600/50 transition-colors">
                              {probs.draw}%
                            </span>
                            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-colors">
                              {probs.away}%
                            </span>
                            <span className="ml-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <Link href={localePath('/predictions')} className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer inline-block">
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
                      <div className="text-2xl font-bold text-cyan-400 mt-1">2</div>
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
                      <div className="text-2xl font-bold text-red-400 mt-1">3</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{t('aiConfidence')}</span>
                      <span className="text-purple-400 font-semibold">87%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full w-[87%] bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-cyan-400">68%</div>
                    <div className="text-xs text-gray-500">{t('homeWin')}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-yellow-400">18%</div>
                    <div className="text-xs text-gray-500">{t('draw')}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-red-400">14%</div>
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
            <div key={index} className="group relative bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 overflow-hidden cursor-pointer">
              {/* Shimmer effect on hover - white light */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>

              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-emerald-500/40 group-hover:to-cyan-500/40 transition-all duration-300 relative z-10">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={benefit.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-white mb-2 relative z-10">{benefit.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ Animated Counter Component ============
// SEO-friendly: starts from 80% of the end value so crawlers see meaningful numbers
function AnimatedCounter({ end, suffix, start, duration = 2000, isVisible }: { end: number; suffix: string; start?: number; duration?: number; isVisible: boolean }) {
  // Default start is 80% of end value for SEO (crawlers will see this initial value)
  const startValue = start ?? Math.floor(end * 0.8);
  const [count, setCount] = useState(startValue);
  const countRef = useRef(startValue);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isVisible) {
      // Keep showing the start value even when not visible (for SEO)
      setCount(startValue);
      countRef.current = startValue;
      return;
    }

    const startTime = performance.now();
    const range = end - startValue; // Only animate the remaining portion

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (easeOutQuart * range));

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
  }, [end, startValue, duration, isVisible]);

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
    { value: 50000, start: 40000, suffix: 'K+', label: t('activeUsers') },      // SEO sees "40K+"
    { value: 120, start: 100, suffix: '+', label: t('countriesServed') },       // SEO sees "100+"
    { value: 1000, start: 800, suffix: '+', label: t('predictionsDaily') },     // SEO sees "800+"
    { value: 96, start: 90, suffix: '%', label: t('satisfactionRate') },        // SEO sees "90%"
  ];

  const testimonials = [
    { text: t('testimonial1'), author: t('testimonial1Author'), role: t('testimonial1Role'), photo: '/homepage/profile_photo_1.png' },
    { text: t('testimonial2'), author: t('testimonial2Author'), role: t('testimonial2Role'), photo: '/homepage/profile_photo_2.png' },
    { text: t('testimonial3'), author: t('testimonial3Author'), role: t('testimonial3Role'), photo: '/homepage/profile_photo_3.png' },
    { text: t('testimonial4'), author: t('testimonial4Author'), role: t('testimonial4Role'), photo: '/homepage/profile_photo_4.png' },
    { text: t('testimonial5'), author: t('testimonial5Author'), role: t('testimonial5Role'), photo: '/homepage/profile_photo_5.png' },
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
            <div key={index} className="group relative text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 overflow-hidden cursor-pointer">
              {/* Shimmer effect on hover - white light */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2 relative z-10">
                <AnimatedCounter end={stat.value} start={stat.start} suffix={stat.suffix} isVisible={isVisible} duration={2000} />
              </div>
              <div className="text-gray-400 text-sm relative z-10">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials - Infinite Scroll */}
        <div className="relative overflow-hidden">
          {/* Gradient masks for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          {/* Scrolling container - duplicate for seamless loop */}
          <div className="flex w-max testimonial-scroll">
            {/* First set */}
            {testimonials.map((testimonial, index) => (
              <div key={`first-${index}`} className="group relative flex-shrink-0 w-[400px] bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-500/20 rounded-2xl p-6 mx-3 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 overflow-hidden cursor-pointer">
                {/* Shimmer effect on hover - white light */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
                <div className="flex items-center gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed relative z-10">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3 relative z-10">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.author}</div>
                    <div className="text-gray-500 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {testimonials.map((testimonial, index) => (
              <div key={`second-${index}`} className="group relative flex-shrink-0 w-[400px] bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-500/20 rounded-2xl p-6 mx-3 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 overflow-hidden cursor-pointer">
                {/* Shimmer effect on hover - white light */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
                <div className="flex items-center gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed relative z-10">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3 relative z-10">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.author}</div>
                    <div className="text-gray-500 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for infinite scroll animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes testimonial-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-406px * 5));
          }
        }
        .testimonial-scroll {
          animation: testimonial-scroll 25s linear infinite;
        }
        .testimonial-scroll:hover {
          animation-play-state: paused;
        }
      `}} />
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
    { question: t('faq8Question'), answer: t('faq8Answer') },
    { question: t('faq9Question'), answer: t('faq9Answer') },
    { question: t('faq10Question'), answer: t('faq10Answer') },
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
              className="group relative bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-500/20 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300"
            >
              {/* Shimmer effect on hover - white light */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer relative z-10"
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
              <div className={`overflow-hidden transition-all duration-300 relative z-10 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
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
  const { t, localePath } = useLanguage();

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
          <Link href={localePath('/')} className="flex items-center gap-3">
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
              <li><Link href={localePath('/predictions')} className="text-gray-400 hover:text-emerald-400 transition-colors">{t('predictions')}</Link></li>
              <li><Link href={localePath('/leagues')} className="text-gray-400 hover:text-emerald-400 transition-colors">{t('leagues')}</Link></li>
              <li><Link href={localePath('/performance')} className="text-gray-400 hover:text-emerald-400 transition-colors">{t('liveOdds')}</Link></li>
              <li><Link href={localePath('/solution')} className="text-gray-400 hover:text-emerald-400 transition-colors">{t('solution')}</Link></li>
            </ul>
          </div>
          <div className="relative z-10">
            <h4 className="text-white font-semibold mb-4 text-sm">{t('company')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={localePath('/about')} className="text-gray-400 hover:text-emerald-400 transition-colors inline-block">{t('aboutUs')}</Link></li>
              <li><Link href={localePath('/contact')} className="text-gray-400 hover:text-emerald-400 transition-colors inline-block">{t('contact')}</Link></li>
              <li><Link href={localePath('/blog')} className="text-gray-400 hover:text-emerald-400 transition-colors inline-block">{t('blog')}</Link></li>
            </ul>
          </div>
          <div className="relative z-10">
            <h4 className="text-white font-semibold mb-4 text-sm">{t('legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={localePath('/terms-of-service')} className="text-gray-400 hover:text-emerald-400 transition-colors inline-block">{t('termsOfService')}</Link></li>
              <li><Link href={localePath('/privacy-policy')} className="text-gray-400 hover:text-emerald-400 transition-colors inline-block">{t('privacyPolicy')}</Link></li>
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
            <span className="text-gray-500">©2026 OddsFlow · {t('allRightsReserved')}</span>
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

// ============ Cookie Consent Wrapper ============
function CookieConsentWrapper() {
  const { lang } = useLanguage();
  return <CookieConsent lang={lang} />;
}

// ============ Footer ============
function Footer() {
  const { t, localePath } = useLanguage();

  return (
    <footer className="py-16 px-4 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2">
            <Link href={localePath('/')} className="flex items-center gap-3 mb-6">
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
  );
}

// ============ Main Page ============
export default function Home() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  return (
    <LanguageProvider locale={locale}>
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
        <CookieConsentWrapper />
      </div>
    </LanguageProvider>
  );
}
