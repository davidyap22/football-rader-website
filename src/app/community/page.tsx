'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { supabase, chatSupabase, Prematch, MatchComment, ChatMessage, ChatReaction, CommentReaction, getMatchComments, addComment, toggleCommentLike, deleteComment, getCommentStats, getChatMessages, sendChatMessage, subscribeToChatMessages, getMessageReactions, toggleMessageReaction, getCommentReactions, toggleCommentReaction } from '@/lib/supabase';

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
  const [activeTab, setActiveTab] = useState<'chat' | 'matches'>('chat');
  const [matchChatOpen, setMatchChatOpen] = useState<number | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReaction[]>>({});
  const [activeReactionPicker, setActiveReactionPicker] = useState<string | null>(null);

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
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
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

      {/* Header */}
      <section className="pt-24 pb-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            {t('communityTitle')}
          </h1>
          <p className="text-gray-400 text-lg">{t('communitySubtitle')}</p>
        </div>
      </section>

      {/* Tab Selector */}
      <section className="px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t('globalChat')}
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'matches'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t('today')}&apos;s Matches
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-16">
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

      {/* Footer */}
      <footer className="py-8 px-4 bg-black border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm">© 2025 OddsFlow. All rights reserved.</p>
          <p className="text-gray-600 text-xs mt-2">Gambling involves risk. Please gamble responsibly.</p>
        </div>
      </footer>
    </div>
  );
}
