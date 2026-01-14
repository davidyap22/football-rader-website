'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { supabase, chatSupabase, Prematch, ChatMessage, ChatReaction, getChatMessages, sendChatMessage, subscribeToChatMessages, getMessageReactions, toggleMessageReaction, getCommentStats } from '@/lib/supabase';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeToTranslationCode, type Locale } from '@/i18n/config';

const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    globalChat: "Global Chat", totalComments: "Total Comments", todayComments: "Today",
    activeUsers: "Active Users", typeMessage: "Type a message...", loginToChat: "Login to chat",
    send: "Send", backToCommunity: "Back to Community",
    userPredictions: "User Predictions", todaysMatches: "Today's Matches",
    solution: "Solution",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始",
    globalChat: "全球聊天", totalComments: "总评论", todayComments: "今日",
    activeUsers: "活跃用户", typeMessage: "输入消息...", loginToChat: "登录后聊天",
    send: "发送", backToCommunity: "返回社区",
    userPredictions: "用户预测", todaysMatches: "今日比赛",
    solution: "解决方案",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始",
    globalChat: "全球聊天", totalComments: "總評論", todayComments: "今日",
    activeUsers: "活躍用戶", typeMessage: "輸入訊息...", loginToChat: "登入後聊天",
    send: "發送", backToCommunity: "返回社區",
    userPredictions: "用戶預測", todaysMatches: "今日比賽",
    solution: "解決方案",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    globalChat: "Chat Global", totalComments: "Total Komentar", todayComments: "Hari Ini",
    activeUsers: "Pengguna Aktif", typeMessage: "Ketik pesan...", loginToChat: "Login untuk chat",
    send: "Kirim", backToCommunity: "Kembali ke Komunitas",
    userPredictions: "Prediksi Pengguna", todaysMatches: "Pertandingan Hari Ini",
    solution: "Solusi",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Empezar",
    globalChat: "Chat Global", totalComments: "Total Comentarios", todayComments: "Hoy",
    activeUsers: "Usuarios Activos", typeMessage: "Escribe un mensaje...", loginToChat: "Inicia sesión para chatear",
    send: "Enviar", backToCommunity: "Volver a Comunidad",
    userPredictions: "Predicciones de Usuarios", todaysMatches: "Partidos de Hoy",
    solution: "Solución",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    globalChat: "Chat Global", totalComments: "Total de Comentários", todayComments: "Hoje",
    activeUsers: "Usuários Ativos", typeMessage: "Digite uma mensagem...", loginToChat: "Faça login para conversar",
    send: "Enviar", backToCommunity: "Voltar para Comunidade",
    userPredictions: "Previsões dos Usuários", todaysMatches: "Jogos de Hoje",
    solution: "Solução",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    globalChat: "Globaler Chat", totalComments: "Gesamte Kommentare", todayComments: "Heute",
    activeUsers: "Aktive Benutzer", typeMessage: "Nachricht eingeben...", loginToChat: "Anmelden zum Chatten",
    send: "Senden", backToCommunity: "Zurück zur Community",
    userPredictions: "Benutzer-Vorhersagen", todaysMatches: "Heutige Spiele",
    solution: "Lösung",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    globalChat: "Chat Global", totalComments: "Total Commentaires", todayComments: "Aujourd'hui",
    activeUsers: "Utilisateurs Actifs", typeMessage: "Tapez un message...", loginToChat: "Connectez-vous pour discuter",
    send: "Envoyer", backToCommunity: "Retour à la Communauté",
    userPredictions: "Prédictions des Utilisateurs", todaysMatches: "Matchs du Jour",
    solution: "Solution",
  },
  JA: {
    home: "ホーム", predictions: "予想", leagues: "リーグ", performance: "AI性能",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    globalChat: "グローバルチャット", totalComments: "総コメント数", todayComments: "今日",
    activeUsers: "アクティブユーザー", typeMessage: "メッセージを入力...", loginToChat: "ログインしてチャット",
    send: "送信", backToCommunity: "コミュニティに戻る",
    userPredictions: "ユーザー予想", todaysMatches: "今日の試合",
    solution: "ソリューション",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성능",
    community: "커뮤니티", news: "뉴스", pricing: "요금", login: "로그인", getStarted: "시작하기",
    globalChat: "전체 채팅", totalComments: "총 댓글", todayComments: "오늘",
    activeUsers: "활성 사용자", typeMessage: "메시지 입력...", loginToChat: "로그인하여 채팅",
    send: "보내기", backToCommunity: "커뮤니티로 돌아가기",
    userPredictions: "사용자 예측", todaysMatches: "오늘의 경기",
    solution: "솔루션",
  },
};

// ChatRoom Component
function ChatRoom({ user, t, localePath }: { user: User | null; t: (key: string) => string; localePath: (path: string) => string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [reactions, setReactions] = useState<Record<string, ChatReaction[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadMessages();
    const channel = subscribeToChatMessages(null, (newMsg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === newMsg.id);
        if (exists) return prev;
        return [...prev, newMsg];
      });
      setTimeout(scrollToBottom, 100);
    });
    return () => { channel?.unsubscribe(); };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    const result = await getChatMessages(null);
    const messages = result.data || [];
    setMessages(messages);
    if (messages.length > 0) {
      const msgIds = messages.map((m: { id: string }) => m.id);
      const reactionsResult = await getMessageReactions(msgIds);
      setReactions(reactionsResult.data || {});
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim() || sending) return;
    setSending(true);
    try {
      await sendChatMessage(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous', newMessage.trim(), null);
      setNewMessage('');
    } catch {
      console.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    await toggleMessageReaction(messageId, user.id, emoji);
    const result = await getMessageReactions([messageId]);
    const data = result.data as Record<string, ChatReaction[]> | undefined;
    const updated = data?.[messageId] || [];
    setReactions((prev) => ({ ...prev, [messageId]: updated }));
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const reactionEmojis = ['👍', '❤️', '😂', '😮', '🔥'];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const currentUserName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
          const isOwnMessage = msg.sender_name === currentUserName;
          return (
          <div key={msg.id} className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
              {msg.sender_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-emerald-400">{msg.sender_name}</span>
                <span className="text-[10px] text-gray-500">{formatTime(msg.created_at)}</span>
              </div>
              <div className={`rounded-2xl px-4 py-2 ${isOwnMessage ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30' : 'bg-white/5 border border-white/10'}`}>
                <p className="text-sm text-white">{msg.content}</p>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {reactionEmojis.map((emoji) => {
                  const msgReactions = reactions[msg.id] || [];
                  const count = msgReactions.filter((r) => r.reaction_type === emoji).length;
                  const hasReacted = msgReactions.some((r) => r.reaction_type === emoji && r.user_id === user?.id);
                  return count > 0 || user ? (
                    <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className={`text-xs px-1.5 py-0.5 rounded-full transition-all cursor-pointer ${hasReacted ? 'bg-emerald-500/30 border border-emerald-500/50' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                      {emoji} {count > 0 && <span className="ml-0.5">{count}</span>}
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10">
        {user ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('typeMessage')}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
            />
            <button onClick={handleSendMessage} disabled={sending || !newMessage.trim()} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-medium text-sm disabled:opacity-50 cursor-pointer">
              {t('send')}
            </button>
          </div>
        ) : (
          <Link href={localePath('/login')} className="block text-center py-3 bg-white/5 rounded-xl text-gray-400 hover:bg-white/10 transition-all">
            {t('loginToChat')}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function GlobalChatPage() {
  const params = useParams();
  const urlLocale = (params?.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';

  // Initialize language from URL locale
  const initialLang = localeToTranslationCode[locale as Locale] || 'EN';
  const [language, setLanguage] = useState(initialLang);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ totalComments: 0, todayComments: 0, activeUsers: 0 });
  const [matches, setMatches] = useState<Prematch[]>([]);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const t = (key: string) => translations[language]?.[key] || translations['EN'][key] || key;

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const handleSetLang = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem('oddsflow_language', newLang);
    setLangDropdownOpen(false);
  };

  // Sync language from URL locale
  useEffect(() => {
    const langKey = localeToTranslationCode[locale as Locale];
    if (langKey && LANGUAGES.some(l => l.code === langKey)) {
      setLanguage(langKey);
      localStorage.setItem('oddsflow_language', langKey);
    }
  }, [locale]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: unknown, session: { user: User | null } | null) => {
      setUser(session?.user || null);
    });
    loadStats();
    loadMatches();
    return () => subscription.unsubscribe();
  }, []);

  const loadStats = async () => {
    const result = await getCommentStats();
    if (result.data) {
      setStats(result.data);
    }
  };

  const loadMatches = async () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const { data } = await supabase
      .from('prematch')
      .select('*')
      .gte('start_date_msia', `${dateStr}T00:00:00`)
      .lte('start_date_msia', `${dateStr}T23:59:59`)
      .order('start_date_msia', { ascending: true });
    setMatches(data || []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={localePath('/')} className="flex items-center gap-3 flex-shrink-0">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href={localePath('/')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{t('home')}</Link>
              <Link href={localePath('/predictions')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{t('predictions')}</Link>
              <Link href={localePath('/leagues')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{t('leagues')}</Link>
              <Link href={localePath('/performance')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{t('performance')}</Link>
              <Link href={localePath('/community')} className="text-sm font-medium text-emerald-400 transition-colors">{t('community')}</Link>
              <Link href={localePath('/news')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{t('news')}</Link>
              <Link href={localePath('/solution')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{t('solution')}</Link>
              <Link href={localePath('/pricing')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{t('pricing')}</Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer">
                  <FlagIcon code={currentLang.code} size={20} />
                  <span className="font-medium hidden sm:inline">{currentLang.code}</span>
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                      {LANGUAGES.map((lang) => (
                        <button key={lang.code} onClick={() => handleSetLang(lang.code)} className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${language === lang.code ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300'}`}>
                          <FlagIcon code={lang.code} size={20} />
                          <span className="font-medium">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Auth buttons */}
              {user ? (
                <Link href={localePath('/dashboard')} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-black">
                      {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href={localePath('/login')} className="hidden sm:block px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium">{t('login')}</Link>
                  <Link href={localePath('/get-started')} className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm">{t('getStarted')}</Link>
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
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
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
              <Link href={localePath('/worldcup')} onClick={() => setMobileMenuOpen(false)} className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-8 w-auto object-contain relative z-10" />
                <span className="text-black font-extrabold relative z-10">FIFA 2026</span>
              </Link>

              {[{ href: '/', label: t('home') }, { href: '/predictions', label: t('predictions') }, { href: '/leagues', label: t('leagues') }, { href: '/performance', label: t('performance') }, { href: '/community', label: t('community') }, { href: '/news', label: t('news') }, { href: '/pricing', label: t('pricing') }].map((link) => (
                <Link key={link.href} href={localePath(link.href)} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5">
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <Link href={localePath('/login')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium">{t('login')}</Link>
                  <Link href={localePath('/get-started')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold">{t('getStarted')}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="px-4 pb-16 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <Link
              href={localePath('/community')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backToCommunity')}
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href={localePath('/community/global-chat')}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-medium"
              >
                {t('globalChat')}
              </Link>
              <Link
                href={localePath('/community/user-predictions')}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm"
              >
                {t('userPredictions')}
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {t('globalChat')}
            </h1>
          </div>

          {/* Chat Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Global Chat */}
            <div className="md:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 overflow-hidden h-[600px]">
              <ChatRoom user={user} t={t} localePath={localePath} />
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-4">
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
                <h3 className="text-sm font-medium text-gray-400 mb-3">Today&apos;s Matches</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {matches.slice(0, 5).map((match) => (
                    <div key={match.id} className="p-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                        {match.league_logo && <img src={match.league_logo} alt="" className="w-3 h-3" />}
                        <span className="truncate">{match.league_name}</span>
                      </div>
                      <div className="text-sm text-white truncate">{match.home_name} vs {match.away_name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
