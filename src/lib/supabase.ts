import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client even if env vars are missing (for development without Supabase)
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null as any;

// Auth helper functions
export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Create free trial subscription for new user
export const createFreeTrialSubscription = async (userId: string, email: string) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7 days free trial

  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      email: email,
      package_type: 'free_trial',
      package_name: 'Free Trial',
      price: 0,
      leagues_allowed: 1,
      betting_styles_allowed: 1,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: 'active',
    })
    .select()
    .single();

  return { data, error };
};

// Get user subscription
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};

// User subscription interface
export interface UserSubscription {
  id: number;
  user_id: string;
  email: string;
  package_type: string;
  package_name: string;
  price: number;
  leagues_allowed: number;
  betting_styles_allowed: number;
  selected_leagues: string[] | null;
  selected_betting_styles: string[] | null;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

export interface Prematch {
  id: number;
  fixture_id: number;
  start_date_msia: string;
  venue_name: string;
  venue_city: string;
  status_short: string;
  status_elapsed: number | null;
  league_name: string;
  league_logo: string;
  home_name: string;
  home_logo: string;
  away_name: string;
  away_logo: string;
  type: string;
  goals_home: number | null;
  goals_away: number | null;
}

export interface League {
  league_name: string;
  league_logo: string;
  count: number;
}

export interface OddsHistory {
  id: number;
  fixture_id: number;
  created_at: string;
  bookmaker: string | null;
  league_name: string | null;
  home_name: string | null;
  away_name: string | null;
  moneyline_1x2_home: number | null;
  moneyline_1x2_draw: number | null;
  moneyline_1x2_away: number | null;
  handicap_main_line: number | null;
  handicap_home: number | null;
  handicap_away: number | null;
  totalpoints_main_line: number | null;
  totalpoints_over: number | null;
  totalpoints_under: number | null;
  type: string | null;
}

// AI Prediction tables
export interface Moneyline1x2Prediction {
  id: number;
  fixture_id: number;
  bookmaker: string | null;
  league_name: string | null;
  home_name: string | null;
  away_name: string | null;
  moneyline_1x2_home: number | null;
  moneyline_1x2_draw: number | null;
  moneyline_1x2_away: number | null;
  signal: string | null;
  ai_model: string | null;
  clock: number | null;
  created_at: string;
  stacking_quantity: string | null;
  stacking_plan_description: string | null;
  result_status: boolean | null;
  score_home: number | null;
  score_away: number | null;
  selection: string | null;
  market_analysis_trend_direction: string | null;
  market_analysis_odds_check: string | null;
  market_analysis_vig_status: string | null;
  commentary_malaysia: string | null;
  market_game: string | null;
}

export interface OverUnderPrediction {
  id: number;
  fixture_id: number;
  bookmaker: string | null;
  league_name: string | null;
  home_name: string | null;
  away_name: string | null;
  line: number | null;
  over: number | null;
  under: number | null;
  signal: string | null;
  ai_model: string | null;
  clock: number | null;
  created_at: string;
  stacking_quantity: string | null;
  stacking_plan_description: string | null;
  selection: string | null;
  market_analysis_trend_direction: string | null;
  market_analysis_odds_check: string | null;
  market_analysis_vig_status: string | null;
  commentary_malaysia: string | null;
  score_home: number | null;
  score_away: number | null;
  result_status: boolean | null;
  market_game: string | null;
}

export interface HandicapPrediction {
  id: number;
  fixture_id: number;
  bookmaker: string | null;
  league_name: string | null;
  home_name: string | null;
  away_name: string | null;
  line: number | null;
  home_odds: number | null;
  away_odds: number | null;
  signal: string | null;
  ai_model: string | null;
  clock: number | null;
  created_at: string;
  stacking_quantity: string | null;
  stacking_plan_description: string | null;
  result_status: boolean | null;
  score_home: number | null;
  score_away: number | null;
  selection: string | null;
  market_analysis_trend_direction: string | null;
  market_analysis_odds_check: string | null;
  market_analysis_vig_status: string | null;
  commentary_malaysia: string | null;
  market_game: string | null;
}

export interface ProfitSummary {
  id: number;
  fixture_id: number;
  total_profit: number | null;
  total_invested: number | null;
  roi_percentage: number | null;
  total_bets: number | null;
  profit_moneyline: number | null;
  profit_handicap: number | null;
  profit_ou: number | null;
  created_at: string;
}

export interface FootballNews {
  id: number;
  title: string;
  summary: string;
  content: string;
  source: string;
  source_url: string;
  image_url?: string;
  published_at?: string;
}

// Contact message interface
export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

// Submit contact form message
export const submitContactMessage = async (contactData: Omit<ContactMessage, 'id' | 'created_at'>) => {
  // Check if supabase client is available
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
      })
      .select();

    if (error) {
      return { data: null, error };
    }

    return { data: data?.[0] || null, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to submit message' } };
  }
};

// ============================================
// Match Comments (Community Forum)
// ============================================

export interface MatchComment {
  id: string;
  fixture_id: number;
  user_id: string;
  content: string;
  parent_id: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_email?: string;
  user_name?: string;
  user_avatar?: string;
  replies?: MatchComment[];
  user_liked?: boolean;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

// Get comments for a match
export const getMatchComments = async (fixtureId: number, userId?: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Get all comments for this fixture
    const { data: comments, error } = await supabase
      .from('match_comments')
      .select('*')
      .eq('fixture_id', fixtureId)
      .order('created_at', { ascending: true });

    if (error) {
      return { data: null, error };
    }

    // Get user likes if logged in
    let userLikes: string[] = [];
    if (userId && comments && comments.length > 0) {
      const commentIds = comments.map((c: MatchComment) => c.id);
      const { data: likes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', userId)
        .in('comment_id', commentIds);

      userLikes = likes?.map((l: { comment_id: string }) => l.comment_id) || [];
    }

    // Mark which comments are liked by current user
    const commentsWithLikes = comments?.map((comment: MatchComment) => ({
      ...comment,
      user_liked: userLikes.includes(comment.id),
    })) || [];

    // Organize into tree structure (parent comments with replies)
    const parentComments = commentsWithLikes.filter((c: MatchComment) => !c.parent_id);
    const replies = commentsWithLikes.filter((c: MatchComment) => c.parent_id);

    const organizedComments = parentComments.map((parent: MatchComment) => ({
      ...parent,
      replies: replies.filter((r: MatchComment) => r.parent_id === parent.id),
    }));

    return { data: organizedComments, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch comments' } };
  }
};

// Add a new comment
export const addComment = async (
  fixtureId: number,
  userId: string,
  content: string,
  parentId?: string
) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { data, error } = await supabase
      .from('match_comments')
      .insert({
        fixture_id: fixtureId,
        user_id: userId,
        content: content,
        parent_id: parentId || null,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to add comment' } };
  }
};

// Toggle like on a comment
export const toggleCommentLike = async (commentId: string, userId: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike - remove the like
      await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existingLike.id);

      // Decrement likes_count
      await supabase.rpc('decrement_likes', { comment_uuid: commentId });

      return { data: { liked: false }, error: null };
    } else {
      // Like - add new like
      await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId,
        });

      // Increment likes_count
      await supabase.rpc('increment_likes', { comment_uuid: commentId });

      return { data: { liked: true }, error: null };
    }
  } catch (err) {
    return { data: null, error: { message: 'Failed to toggle like' } };
  }
};

// Delete a comment
export const deleteComment = async (commentId: string, userId: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { error } = await supabase
      .from('match_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) {
      return { data: null, error };
    }

    return { data: { deleted: true }, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to delete comment' } };
  }
};

// Get comment stats for community page
export const getCommentStats = async () => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Total comments
    const { count: totalComments } = await supabase
      .from('match_comments')
      .select('*', { count: 'exact', head: true });

    // Today's comments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayComments } = await supabase
      .from('match_comments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Active users (unique users who commented in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: activeUsers } = await supabase
      .from('match_comments')
      .select('user_id')
      .gte('created_at', weekAgo.toISOString());

    const uniqueActiveUsers = new Set(activeUsers?.map((u: { user_id: string }) => u.user_id)).size;

    return {
      data: {
        totalComments: totalComments || 0,
        todayComments: todayComments || 0,
        activeUsers: uniqueActiveUsers,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch stats' } };
  }
};

// ============================================
// Chat Messages (Real-time Chatroom)
// ============================================

export interface ChatMessage {
  id: string;
  fixture_id: number | null; // null = global chat, number = match-specific chat
  user_id: string;
  content: string;
  created_at: string;
}

// Get chat messages (global or match-specific)
export const getChatMessages = async (fixtureId?: number | null, limit: number = 50) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    let query = supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (fixtureId === null || fixtureId === undefined) {
      query = query.is('fixture_id', null); // Global chat
    } else {
      query = query.eq('fixture_id', fixtureId); // Match-specific chat
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch chat messages' } };
  }
};

// Send chat message
export const sendChatMessage = async (userId: string, content: string, fixtureId?: number | null) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        content: content,
        fixture_id: fixtureId ?? null,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to send message' } };
  }
};

// Subscribe to chat messages (real-time)
export const subscribeToChatMessages = (
  fixtureId: number | null,
  onMessage: (message: ChatMessage) => void
) => {
  if (!supabase) {
    return null;
  }

  const channel = supabase
    .channel(`chat-${fixtureId ?? 'global'}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: fixtureId === null ? 'fixture_id=is.null' : `fixture_id=eq.${fixtureId}`,
      },
      (payload: { new: ChatMessage }) => {
        onMessage(payload.new);
      }
    )
    .subscribe();

  return channel;
};

// Get online users count (approximate based on recent chat activity)
export const getOnlineUsersCount = async () => {
  if (!supabase) {
    return { data: 0, error: null };
  }

  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const { data } = await supabase
      .from('chat_messages')
      .select('user_id')
      .gte('created_at', fiveMinutesAgo.toISOString());

    const uniqueUsers = new Set(data?.map((m: { user_id: string }) => m.user_id)).size;
    return { data: uniqueUsers, error: null };
  } catch (err) {
    return { data: 0, error: null };
  }
};

// ============================================
// Chat Reactions
// ============================================

export interface ChatReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface ReactionCount {
  type: string;
  count: number;
  users: string[];
}

// Get reactions for messages
export const getMessageReactions = async (messageIds: string[]) => {
  if (!supabase || messageIds.length === 0) {
    return { data: {}, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('chat_reactions')
      .select('*')
      .in('message_id', messageIds);

    if (error) {
      return { data: {}, error };
    }

    // Group reactions by message_id
    const grouped: Record<string, ChatReaction[]> = {};
    data?.forEach((reaction: ChatReaction) => {
      if (!grouped[reaction.message_id]) {
        grouped[reaction.message_id] = [];
      }
      grouped[reaction.message_id].push(reaction);
    });

    return { data: grouped, error: null };
  } catch (err) {
    return { data: {}, error: { message: 'Failed to fetch reactions' } };
  }
};

// Toggle reaction on a message
export const toggleMessageReaction = async (messageId: string, userId: string, reactionType: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Check if user already reacted
    const { data: existing } = await supabase
      .from('chat_reactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      if (existing.reaction_type === reactionType) {
        // Same reaction - remove it
        await supabase
          .from('chat_reactions')
          .delete()
          .eq('id', existing.id);
        return { data: { action: 'removed' }, error: null };
      } else {
        // Different reaction - update it
        await supabase
          .from('chat_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id);
        return { data: { action: 'updated', type: reactionType }, error: null };
      }
    } else {
      // No existing reaction - add new one
      await supabase
        .from('chat_reactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          reaction_type: reactionType,
        });
      return { data: { action: 'added', type: reactionType }, error: null };
    }
  } catch (err) {
    return { data: null, error: { message: 'Failed to toggle reaction' } };
  }
};

// Comment Reactions
export interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

// Get reactions for multiple comments
export const getCommentReactions = async (commentIds: string[]) => {
  if (!supabase || commentIds.length === 0) {
    return { data: {}, error: null };
  }

  const { data, error } = await supabase
    .from('comment_reactions')
    .select('*')
    .in('comment_id', commentIds);

  if (error) {
    return { data: {}, error };
  }

  // Group reactions by comment_id
  const grouped: Record<string, CommentReaction[]> = {};
  data?.forEach((reaction: CommentReaction) => {
    if (!grouped[reaction.comment_id]) {
      grouped[reaction.comment_id] = [];
    }
    grouped[reaction.comment_id].push(reaction);
  });

  return { data: grouped, error: null };
};

// Toggle comment reaction (add/update/remove)
export const toggleCommentReaction = async (commentId: string, userId: string, reactionType: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Check if user already reacted
    const { data: existing } = await supabase
      .from('comment_reactions')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      if (existing.reaction_type === reactionType) {
        // Same reaction - remove it
        await supabase
          .from('comment_reactions')
          .delete()
          .eq('id', existing.id);
        return { data: { action: 'removed' }, error: null };
      } else {
        // Different reaction - update it
        await supabase
          .from('comment_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id);
        return { data: { action: 'updated', type: reactionType }, error: null };
      }
    } else {
      // No existing reaction - add new one
      await supabase
        .from('comment_reactions')
        .insert({
          comment_id: commentId,
          user_id: userId,
          reaction_type: reactionType,
        });
      return { data: { action: 'added', type: reactionType }, error: null };
    }
  } catch (err) {
    return { data: null, error: { message: 'Failed to toggle comment reaction' } };
  }
};
