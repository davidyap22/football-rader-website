'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

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
    community: "Community",
    communitySubtitle: "Join the discussion with thousands of football enthusiasts",
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance", news: "News", pricing: "Pricing",
    login: "Log In", getStarted: "Get Started",
    footer: "18+ | Gambling involves risk. Please gamble responsibly.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
    members: "Members", discussions: "Discussions", comments: "Comments", onlineNow: "Online Now",
    categories: "Categories", topContributors: "Top Contributors",
    latest: "Latest", popular: "Popular", unanswered: "Unanswered", newDiscussion: "New Discussion",
    loadMore: "Load More Discussions", replies: "replies", views: "views", by: "by", pinned: "Pinned",
  },
  ES: {
    community: "Comunidad",
    communitySubtitle: "Únete a la discusión con miles de entusiastas del fútbol",
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Análisis", news: "Noticias", pricing: "Precios",
    login: "Iniciar Sesión", getStarted: "Comenzar",
    footer: "18+ | El juego implica riesgo. Por favor juega responsablemente.",
    allRights: "© 2025 OddsFlow. Todos los derechos reservados.",
    members: "Miembros", discussions: "Discusiones", comments: "Comentarios", onlineNow: "En Línea",
    categories: "Categorías", topContributors: "Mejores Contribuidores",
    latest: "Recientes", popular: "Popular", unanswered: "Sin Respuesta", newDiscussion: "Nueva Discusión",
    loadMore: "Cargar Más Discusiones", replies: "respuestas", views: "vistas", by: "por", pinned: "Fijado",
  },
  PT: {
    community: "Comunidade",
    communitySubtitle: "Participe da discussão com milhares de entusiastas do futebol",
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Análise", news: "Notícias", pricing: "Preços",
    login: "Entrar", getStarted: "Começar",
    footer: "18+ | O jogo envolve risco. Por favor, jogue com responsabilidade.",
    allRights: "© 2025 OddsFlow. Todos os direitos reservados.",
    members: "Membros", discussions: "Discussões", comments: "Comentários", onlineNow: "Online Agora",
    categories: "Categorias", topContributors: "Melhores Contribuidores",
    latest: "Recentes", popular: "Popular", unanswered: "Sem Resposta", newDiscussion: "Nova Discussão",
    loadMore: "Carregar Mais Discussões", replies: "respostas", views: "visualizações", by: "por", pinned: "Fixado",
  },
  DE: {
    community: "Community",
    communitySubtitle: "Diskutieren Sie mit Tausenden von Fußball-Enthusiasten",
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse", news: "Nachrichten", pricing: "Preise",
    login: "Anmelden", getStarted: "Loslegen",
    footer: "18+ | Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    allRights: "© 2025 OddsFlow. Alle Rechte vorbehalten.",
    members: "Mitglieder", discussions: "Diskussionen", comments: "Kommentare", onlineNow: "Online Jetzt",
    categories: "Kategorien", topContributors: "Top-Mitwirkende",
    latest: "Neueste", popular: "Beliebt", unanswered: "Unbeantwortet", newDiscussion: "Neue Diskussion",
    loadMore: "Mehr Laden", replies: "Antworten", views: "Aufrufe", by: "von", pinned: "Angeheftet",
  },
  FR: {
    community: "Communauté",
    communitySubtitle: "Rejoignez la discussion avec des milliers de passionnés de football",
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Analyse", news: "Actualités", pricing: "Tarifs",
    login: "Connexion", getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez de manière responsable.",
    allRights: "© 2025 OddsFlow. Tous droits réservés.",
    members: "Membres", discussions: "Discussions", comments: "Commentaires", onlineNow: "En Ligne",
    categories: "Catégories", topContributors: "Meilleurs Contributeurs",
    latest: "Récent", popular: "Populaire", unanswered: "Sans Réponse", newDiscussion: "Nouvelle Discussion",
    loadMore: "Charger Plus", replies: "réponses", views: "vues", by: "par", pinned: "Épinglé",
  },
  JA: {
    community: "コミュニティ",
    communitySubtitle: "何千人ものサッカー愛好家と議論に参加しましょう",
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "分析", news: "ニュース", pricing: "料金",
    login: "ログイン", getStarted: "始める",
    footer: "18+ | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2025 OddsFlow. All rights reserved.",
    members: "メンバー", discussions: "ディスカッション", comments: "コメント", onlineNow: "オンライン中",
    categories: "カテゴリー", topContributors: "トップ貢献者",
    latest: "最新", popular: "人気", unanswered: "未回答", newDiscussion: "新規ディスカッション",
    loadMore: "もっと読み込む", replies: "返信", views: "閲覧", by: "by", pinned: "固定",
  },
  KO: {
    community: "커뮤니티",
    communitySubtitle: "수천 명의 축구 애호가들과 토론에 참여하세요",
    home: "홈", predictions: "예측", leagues: "리그", performance: "분석", news: "뉴스", pricing: "가격",
    login: "로그인", getStarted: "시작하기",
    footer: "18+ | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2025 OddsFlow. All rights reserved.",
    members: "회원", discussions: "토론", comments: "댓글", onlineNow: "온라인",
    categories: "카테고리", topContributors: "최고 기여자",
    latest: "최신", popular: "인기", unanswered: "답변 없음", newDiscussion: "새 토론",
    loadMore: "더 보기", replies: "답글", views: "조회", by: "by", pinned: "고정됨",
  },
  '中文': {
    community: "社区",
    communitySubtitle: "与数千名足球爱好者一起讨论",
    home: "首页", predictions: "预测", leagues: "联赛", performance: "分析", news: "新闻", pricing: "价格",
    login: "登录", getStarted: "开始使用",
    footer: "18+ | 赌博有风险，请理性参与。",
    allRights: "© 2025 OddsFlow. 保留所有权利。",
    members: "成员", discussions: "讨论", comments: "评论", onlineNow: "在线",
    categories: "分类", topContributors: "顶级贡献者",
    latest: "最新", popular: "热门", unanswered: "未回答", newDiscussion: "新讨论",
    loadMore: "加载更多", replies: "回复", views: "浏览", by: "由", pinned: "置顶",
  },
  '繁體': {
    community: "社區",
    communitySubtitle: "與數千名足球愛好者一起討論",
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "分析", news: "新聞", pricing: "價格",
    login: "登入", getStarted: "開始使用",
    footer: "18+ | 賭博有風險，請理性參與。",
    allRights: "© 2025 OddsFlow. 保留所有權利。",
    members: "成員", discussions: "討論", comments: "評論", onlineNow: "在線",
    categories: "分類", topContributors: "頂級貢獻者",
    latest: "最新", popular: "熱門", unanswered: "未回答", newDiscussion: "新討論",
    loadMore: "載入更多", replies: "回覆", views: "瀏覽", by: "由", pinned: "置頂",
  },
};

// Mock comments for discussions
const mockComments: Record<number, Array<{
  id: number;
  author: string;
  avatar: string;
  badge?: string;
  content: string;
  time: string;
  likes: number;
  replies?: Array<{
    id: number;
    author: string;
    avatar: string;
    content: string;
    time: string;
    likes: number;
  }>;
}>> = {
  1: [
    {
      id: 1,
      author: "TacticsGuru",
      avatar: "🔴",
      badge: "Expert",
      content: "I'm going with Arsenal to win this weekend. They've been in great form and their home record is exceptional. City might slip up against a tough Newcastle side.",
      time: "5 min ago",
      likes: 45,
      replies: [
        { id: 11, author: "FootballFan99", avatar: "🔵", content: "Agree on Arsenal! Their midfield has been unstoppable.", time: "3 min ago", likes: 12 },
        { id: 12, author: "SmartBettor", avatar: "⚽", content: "The odds on Arsenal are great value right now.", time: "2 min ago", likes: 8 },
      ]
    },
    {
      id: 2,
      author: "DataDriven",
      avatar: "📊",
      badge: "Pro",
      content: "Looking at the stats, Liverpool has a 67% win rate in away games this season. I'm backing them to beat Wolves.",
      time: "12 min ago",
      likes: 32,
    },
    {
      id: 3,
      author: "NewUser2024",
      avatar: "🆕",
      content: "What about the Chelsea vs Brighton game? I think Brighton might cause an upset.",
      time: "25 min ago",
      likes: 15,
      replies: [
        { id: 31, author: "TacticsGuru", avatar: "🔴", content: "Brighton is in good form but Chelsea at home is a different beast.", time: "20 min ago", likes: 9 },
      ]
    },
  ],
  2: [
    {
      id: 1,
      author: "FootballFan99",
      avatar: "🔵",
      badge: "Pro",
      content: "What a match! United's pressing in the second half completely changed the game. Fernandes was everywhere!",
      time: "15 min ago",
      likes: 67,
    },
    {
      id: 2,
      author: "SpanishFootball",
      avatar: "🇪🇸",
      content: "Liverpool's defense was exposed multiple times. They need to sort that out before the next big game.",
      time: "30 min ago",
      likes: 41,
    },
  ],
};

// Mock data for community
const mockDiscussions = [
  {
    id: 1,
    title: "Premier League Weekend Predictions Thread",
    author: "FootballFan99",
    avatar: "🔵",
    replies: 156,
    views: 2340,
    lastActivity: "5 min ago",
    category: "Predictions",
    pinned: true,
    content: "Share your predictions for this weekend's Premier League fixtures! Who do you think will win the top of the table clash?",
  },
  {
    id: 2,
    title: "Manchester United vs Liverpool - Match Performance",
    author: "TacticsGuru",
    avatar: "🔴",
    replies: 89,
    views: 1567,
    lastActivity: "15 min ago",
    category: "Match Discussion",
    pinned: true,
    content: "Let's discuss the tactical breakdown of yesterday's match. What were the key moments that decided the outcome?",
  },
  {
    id: 3,
    title: "Best value bets for Champions League this week?",
    author: "SmartBettor",
    avatar: "⚽",
    replies: 45,
    views: 892,
    lastActivity: "32 min ago",
    category: "Tips & Strategies",
    pinned: false,
    content: "Looking for some good value bets in the upcoming CL matches. What are your picks?",
  },
  {
    id: 4,
    title: "How accurate are the AI predictions? My results after 30 days",
    author: "DataDriven",
    avatar: "📊",
    replies: 234,
    views: 4521,
    lastActivity: "1 hour ago",
    category: "General",
    pinned: false,
    content: "I've been tracking the AI predictions for 30 days. Here's my detailed analysis and ROI breakdown.",
  },
  {
    id: 5,
    title: "La Liga insights - Barcelona looking strong",
    author: "SpanishFootball",
    avatar: "🇪🇸",
    replies: 67,
    views: 1123,
    lastActivity: "2 hours ago",
    category: "League Discussion",
    pinned: false,
    content: "Barcelona's recent form has been impressive. Let's discuss their title chances and upcoming fixtures.",
  },
  {
    id: 6,
    title: "New to OddsFlow - Any tips for beginners?",
    author: "NewUser2024",
    avatar: "🆕",
    replies: 28,
    views: 456,
    lastActivity: "3 hours ago",
    category: "General",
    pinned: false,
    content: "Just joined OddsFlow! Would love some tips from experienced users on how to get started.",
  },
];

const mockTopContributors = [
  { name: "TacticsGuru", points: 12450, avatar: "🔴", badge: "Expert" },
  { name: "FootballFan99", points: 9820, avatar: "🔵", badge: "Pro" },
  { name: "DataDriven", points: 8540, avatar: "📊", badge: "Pro" },
  { name: "SmartBettor", points: 7230, avatar: "⚽", badge: "Rising Star" },
  { name: "SpanishFootball", points: 5670, avatar: "🇪🇸", badge: "Rising Star" },
];

const categories = [
  { name: "All", count: 1234 },
  { name: "Predictions", count: 456 },
  { name: "Match Discussion", count: 321 },
  { name: "Tips & Strategies", count: 234 },
  { name: "League Discussion", count: 156 },
  { name: "General", count: 67 },
];

export default function CommunityPage() {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<typeof mockDiscussions[0] | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  // Check auth session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setSelectedLang(savedLang);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('oddsflow_lang', langCode);
    setLangDropdownOpen(false);
  };

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
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
              <Link href="/community" className="text-emerald-400 text-sm font-medium">{t('community')}</Link>
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
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                      {LANGUAGES.map((l) => (
                        <button key={l.code} onClick={() => handleLanguageChange(l.code)} className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${selectedLang === l.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'}`}>
                          <span className="text-lg">{l.flag}</span>
                          <span className="font-medium">{l.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
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
                  <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t('community')}
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('communitySubtitle')}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t('members'), value: "12,450" },
              { label: t('discussions'), value: "1,234" },
              { label: t('comments'), value: "45.6K" },
              { label: t('onlineNow'), value: "342" },
            ].map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Categories */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 p-5">
                <h3 className="font-semibold text-white mb-4">{t('categories')}</h3>
                <ul className="space-y-2">
                  {categories.map((cat, index) => (
                    <li key={index}>
                      <button className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${index === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-gray-400'}`}>
                        <span>{cat.name}</span>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{cat.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top Contributors */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 p-5">
                <h3 className="font-semibold text-white mb-4">{t('topContributors')}</h3>
                <ul className="space-y-3">
                  {mockTopContributors.map((user, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="text-xl">{user.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.points.toLocaleString()} pts</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.badge === 'Expert' ? 'bg-yellow-500/20 text-yellow-400' :
                        user.badge === 'Pro' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.badge}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Discussions List */}
            <div className="lg:col-span-3">
              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium cursor-pointer">{t('latest')}</button>
                  <button className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-400 text-sm font-medium cursor-pointer">{t('popular')}</button>
                  <button className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-400 text-sm font-medium cursor-pointer">{t('unanswered')}</button>
                </div>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-semibold cursor-pointer">
                  {t('newDiscussion')}
                </button>
              </div>

              {/* Discussions */}
              <div className="space-y-3">
                {mockDiscussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    onClick={() => setSelectedDiscussion(discussion)}
                    className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-5 hover:border-emerald-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{discussion.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {discussion.pinned && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">{t('pinned')}</span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{discussion.category}</span>
                        </div>
                        <h4 className="font-semibold text-white mb-1 hover:text-emerald-400 transition-colors">{discussion.title}</h4>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{discussion.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{t('by')} <span className="text-gray-400">{discussion.author}</span></span>
                          <span>{discussion.replies} {t('replies')}</span>
                          <span>{discussion.views} {t('views')}</span>
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-6">
                <button className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
                  {t('loadMore')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Discussion Modal */}
      {selectedDiscussion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setSelectedDiscussion(null);
              setReplyingTo(null);
              setCommentText('');
            }}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{selectedDiscussion.avatar}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {selectedDiscussion.pinned && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">{t('pinned')}</span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{selectedDiscussion.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedDiscussion.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>{t('by')} <span className="text-emerald-400">{selectedDiscussion.author}</span></span>
                    <span>{selectedDiscussion.lastActivity}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedDiscussion(null);
                  setReplyingTo(null);
                  setCommentText('');
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Discussion Content */}
            <div className="p-6 border-b border-white/10 bg-white/5">
              <p className="text-gray-300 leading-relaxed">{selectedDiscussion.content}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>{selectedDiscussion.views} {t('views')}</span>
                <span>{selectedDiscussion.replies} {t('replies')}</span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(mockComments[selectedDiscussion.id] || []).map((comment) => (
                <div key={comment.id} className="group">
                  {/* Main Comment */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-xl border border-white/10">
                        {comment.avatar}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-white">{comment.author}</span>
                          {comment.badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              comment.badge === 'Expert' ? 'bg-yellow-500/20 text-yellow-400' :
                              comment.badge === 'Pro' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {comment.badge}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 ml-2">
                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span>{comment.likes}</span>
                        </button>
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          <span>Reply</span>
                        </button>
                      </div>

                      {/* Reply Input */}
                      {replyingTo === comment.id && (
                        <div className="mt-3 ml-2 flex gap-2">
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={`Reply to ${comment.author}...`}
                            className="flex-1 bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                          />
                          <button className="px-4 py-2 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 transition-colors cursor-pointer">
                            Send
                          </button>
                        </div>
                      )}

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-4 space-y-3 border-l-2 border-white/10 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-lg border border-white/10">
                                  {reply.avatar}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-3 border border-white/5">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-white text-sm">{reply.author}</span>
                                    <span className="text-xs text-gray-500">{reply.time}</span>
                                  </div>
                                  <p className="text-gray-400 text-sm">{reply.content}</p>
                                </div>
                                <div className="flex items-center gap-3 mt-1 ml-2">
                                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 transition-colors cursor-pointer">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    <span>{reply.likes}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {(!mockComments[selectedDiscussion.id] || mockComments[selectedDiscussion.id].length === 0) && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No comments yet. Be the first to reply!</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-white/10 bg-gray-900/50">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                  U
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={replyingTo ? '' : commentText}
                    onChange={(e) => !replyingTo && setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    disabled={replyingTo !== null}
                  />
                  <button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={replyingTo !== null}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>{t('footer')}</p>
        <p className="mt-2">{t('allRights')}</p>
      </footer>
    </div>
  );
}
