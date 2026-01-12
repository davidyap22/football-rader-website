'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  supabase,
  FootballNews,
  NewsComment,
  NewsCommentReaction,
  getNewsComments,
  addNewsComment,
  deleteNewsComment,
  toggleNewsCommentReaction,
  sanitizeInput,
  checkRateLimit,
} from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Helper function to format relative time for comments (3 days threshold)
function getCommentTime(dateString: string | undefined): string {
  if (!dateString) return '';

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 3) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    allComments: "All Comments",
    backToNews: "Back to News",
    comments: "Comments",
    noComments: "No comments yet. Be the first to comment!",
    writeComment: "Write a comment...",
    reply: "Reply",
    delete: "Delete",
    loginToComment: "Log in to comment",
    replying: "Replying to",
    cancel: "Cancel",
    submit: "Submit",
    login: "Log In",
    getStarted: "Get Started",
  },
  ES: {
    allComments: "Todos los Comentarios",
    backToNews: "Volver a Noticias",
    comments: "Comentarios",
    noComments: "Aún no hay comentarios. ¡Sé el primero en comentar!",
    writeComment: "Escribe un comentario...",
    reply: "Responder",
    delete: "Eliminar",
    loginToComment: "Inicia sesión para comentar",
    replying: "Respondiendo a",
    cancel: "Cancelar",
    submit: "Enviar",
    login: "Iniciar Sesión",
    getStarted: "Comenzar",
  },
  PT: {
    allComments: "Todos os Comentários",
    backToNews: "Voltar às Notícias",
    comments: "Comentários",
    noComments: "Ainda não há comentários. Seja o primeiro a comentar!",
    writeComment: "Escreva um comentário...",
    reply: "Responder",
    delete: "Excluir",
    loginToComment: "Faça login para comentar",
    replying: "Respondendo a",
    cancel: "Cancelar",
    submit: "Enviar",
    login: "Entrar",
    getStarted: "Começar",
  },
  DE: {
    allComments: "Alle Kommentare",
    backToNews: "Zurück zu Nachrichten",
    comments: "Kommentare",
    noComments: "Noch keine Kommentare. Sei der Erste!",
    writeComment: "Schreibe einen Kommentar...",
    reply: "Antworten",
    delete: "Löschen",
    loginToComment: "Anmelden zum Kommentieren",
    replying: "Antwort auf",
    cancel: "Abbrechen",
    submit: "Absenden",
    login: "Anmelden",
    getStarted: "Loslegen",
  },
  FR: {
    allComments: "Tous les commentaires",
    backToNews: "Retour aux Actualités",
    comments: "Commentaires",
    noComments: "Pas encore de commentaires. Soyez le premier !",
    writeComment: "Écrivez un commentaire...",
    reply: "Répondre",
    delete: "Supprimer",
    loginToComment: "Connectez-vous pour commenter",
    replying: "Réponse à",
    cancel: "Annuler",
    submit: "Envoyer",
    login: "Connexion",
    getStarted: "Commencer",
  },
  JA: {
    allComments: "すべてのコメント",
    backToNews: "ニュースに戻る",
    comments: "コメント",
    noComments: "コメントはまだありません。最初のコメントを！",
    writeComment: "コメントを書く...",
    reply: "返信",
    delete: "削除",
    loginToComment: "コメントするにはログイン",
    replying: "返信先",
    cancel: "キャンセル",
    submit: "送信",
    login: "ログイン",
    getStarted: "始める",
  },
  KO: {
    allComments: "모든 댓글",
    backToNews: "뉴스로 돌아가기",
    comments: "댓글",
    noComments: "아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!",
    writeComment: "댓글을 작성하세요...",
    reply: "답글",
    delete: "삭제",
    loginToComment: "댓글을 달려면 로그인하세요",
    replying: "답글 대상",
    cancel: "취소",
    submit: "제출",
    login: "로그인",
    getStarted: "시작하기",
  },
  '中文': {
    allComments: "所有评论",
    backToNews: "返回新闻",
    comments: "评论",
    noComments: "还没有评论。成为第一个评论者！",
    writeComment: "写评论...",
    reply: "回复",
    delete: "删除",
    loginToComment: "登录后评论",
    replying: "回复给",
    cancel: "取消",
    submit: "提交",
    login: "登录",
    getStarted: "开始使用",
  },
  '繁體': {
    allComments: "所有評論",
    backToNews: "返回新聞",
    comments: "評論",
    noComments: "還沒有評論。成為第一個評論者！",
    writeComment: "寫評論...",
    reply: "回覆",
    delete: "刪除",
    loginToComment: "登入後評論",
    replying: "回覆給",
    cancel: "取消",
    submit: "提交",
    login: "登入",
    getStarted: "開始使用",
  },
  ID: {
    allComments: "Semua Komentar",
    backToNews: "Kembali ke Berita",
    comments: "Komentar",
    noComments: "Belum ada komentar. Jadilah yang pertama berkomentar!",
    writeComment: "Tulis komentar...",
    reply: "Balas",
    delete: "Hapus",
    loginToComment: "Masuk untuk berkomentar",
    replying: "Membalas ke",
    cancel: "Batal",
    submit: "Kirim",
    login: "Masuk",
    getStarted: "Mulai",
  },
};

// Emoji reactions
const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

// Comment Item Component
interface CommentItemProps {
  comment: NewsComment;
  newsId: number;
  user: User | null;
  t: (key: string) => string;
  onReply: (commentId: string, userName: string) => void;
  onDelete: (commentId: string) => void;
  onReaction: (commentId: string, reactionType: string) => void;
  depth?: number;
}

function CommentItem({
  comment,
  newsId,
  user,
  t,
  onReply,
  onDelete,
  onReaction,
  depth = 0,
}: CommentItemProps) {
  const [showReactions, setShowReactions] = useState(false);

  const reactionCounts = comment.reactions?.reduce((acc, r) => {
    acc[r.reaction_type] = (acc[r.reaction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const userReaction = comment.reactions?.find(r => r.user_id === user?.id)?.reaction_type;

  const getUserDisplayName = () => {
    return comment.user_name || comment.user_email?.split('@')[0] || 'User';
  };

  const getUserInitial = () => {
    const name = comment.user_name || comment.user_email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l border-white/10' : ''}`}>
      <div className="flex gap-3">
        {comment.user_avatar ? (
          <img
            src={comment.user_avatar}
            alt=""
            className="w-10 h-10 rounded-full flex-shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
            {getUserInitial()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-white">{getUserDisplayName()}</span>
            <span className="text-xs text-gray-500">{getCommentTime(comment.created_at)}</span>
          </div>

          <p className="text-gray-300 mt-1 break-words">{comment.content}</p>

          <div className="flex items-center gap-3 mt-2">
            {Object.entries(reactionCounts).length > 0 && (
              <div className="flex items-center gap-1">
                {Object.entries(reactionCounts).map(([emoji, count]) => (
                  <span
                    key={emoji}
                    className={`text-xs px-2 py-1 rounded-full ${
                      userReaction === emoji ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {emoji} {count}
                  </span>
                ))}
              </div>
            )}

            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="text-sm text-gray-500 hover:text-white cursor-pointer"
                >
                  {userReaction || '😀'}
                </button>
                {showReactions && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowReactions(false)} />
                    <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-gray-900 border border-white/10 rounded-lg p-2 z-20">
                      {REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            onReaction(comment.id, emoji);
                            setShowReactions(false);
                          }}
                          className={`text-xl hover:scale-125 transition-transform cursor-pointer ${
                            userReaction === emoji ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {user && depth < 2 && (
              <button
                onClick={() => onReply(comment.id, getUserDisplayName())}
                className="text-sm text-gray-500 hover:text-emerald-400 cursor-pointer"
              >
                {t('reply')}
              </button>
            )}

            {user && user.id === comment.user_id && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-sm text-gray-500 hover:text-red-400 cursor-pointer"
              >
                {t('delete')}
              </button>
            )}
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              newsId={newsId}
              user={user}
              t={t}
              onReply={onReply}
              onDelete={onDelete}
              onReaction={onReaction}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewsCommentsPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = parseInt(params.id as string, 10);

  const [newsItem, setNewsItem] = useState<FootballNews | null>(null);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; userName: string } | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setSelectedLang(savedLang);
  }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      if (!newsId) return;

      // Fetch news item
      const { data: news } = await supabase
        .from('football_news')
        .select('*')
        .eq('id', newsId)
        .single();

      if (news) setNewsItem(news);

      // Fetch comments
      const result = await getNewsComments(newsId, user?.id);
      setComments(result.data || []);
      setLoading(false);
    };

    fetchData();
  }, [newsId, user?.id]);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('oddsflow_lang', langCode);
    setLangDropdownOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  const loadComments = async () => {
    const result = await getNewsComments(newsId, user?.id);
    setComments(result.data || []);
  };

  const handleSubmitComment = async () => {
    if (!user || !commentInput.trim() || submittingComment) return;

    if (!checkRateLimit(`news_comment_${user.id}`, 5)) {
      alert('Please wait before posting another comment.');
      return;
    }

    setSubmittingComment(true);
    const sanitizedContent = sanitizeInput(commentInput);
    const userInfo = {
      name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
      email: user.email || undefined,
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined,
    };
    await addNewsComment(
      newsId,
      user.id,
      sanitizedContent,
      replyingTo?.commentId || undefined,
      userInfo
    );

    setCommentInput('');
    setReplyingTo(null);
    await loadComments();
    setSubmittingComment(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    await deleteNewsComment(commentId, user.id);
    await loadComments();
  };

  const handleReaction = async (commentId: string, reactionType: string) => {
    if (!user) return;
    await toggleNewsCommentReaction(commentId, user.id, reactionType);
    await loadComments();
  };

  return (
    <div className="min-h-screen bg-[#05080d] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

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
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-[#0c1018] border border-white/10 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                      {LANGUAGES.map((l) => (
                        <button key={l.code} onClick={() => handleLanguageChange(l.code)} className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${selectedLang === l.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'}`}>
                          <FlagIcon code={l.code} size={20} />
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
                    <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href="/get-started" className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToNews')}
          </Link>

          {/* News Title */}
          {newsItem && (
            <div className="mb-8 p-6 rounded-xl bg-[#0a0e14] border border-white/5">
              <h1 className="text-xl font-bold text-white mb-2">{newsItem.title}</h1>
              <p className="text-gray-400 text-sm">{newsItem.summary}</p>
            </div>
          )}

          {/* Comments Section */}
          <div className="rounded-xl bg-[#0a0e14] border border-white/5 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t('allComments')} ({comments.length})
            </h2>

            {/* Comment Input */}
            {user ? (
              <div className="mb-6">
                {replyingTo && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                    <span>{t('replying')} {replyingTo.userName}</span>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-500 hover:text-white cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={t('writeComment')}
                    maxLength={1000}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitComment();
                      }
                    }}
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentInput.trim() || submittingComment}
                    className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    {submittingComment ? '...' : t('submit')}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="block mb-6 px-4 py-4 rounded-lg bg-white/5 border border-white/10 text-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
              >
                {t('loginToComment')}
              </Link>
            )}

            {/* Comments List */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    newsId={newsId}
                    user={user}
                    t={t}
                    onReply={(commentId, userName) => setReplyingTo({ commentId, userName })}
                    onDelete={handleDeleteComment}
                    onReaction={handleReaction}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">{t('noComments')}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
