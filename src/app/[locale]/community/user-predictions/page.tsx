'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { supabase, Prematch } from '@/lib/supabase';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";

interface UserPrediction {
  id: string;
  user_id: string;
  match_id: number;
  home_team: string;
  away_team: string;
  league?: string;
  match_date?: string;
  home_score_prediction?: number | null;
  away_score_prediction?: number | null;
  winner_prediction?: string | null;
  analysis?: string | null;
  user_name?: string | null;
  user_avatar?: string | null;
  created_at: string;
}

const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    userPredictions: "User Predictions", backToCommunity: "Back to Community",
    globalChat: "Global Chat", todaysMatches: "Today's Matches",
    makePrediction: "Make Prediction", loginToPredict: "Login to Predict",
    noPredictions: "No predictions yet", noMatches: "No matches today",
    communityPoll: "Community Poll", totalVotes: "votes", draw: "Draw",
    homeWin: "Home Win", awayWin: "Away Win", vs: "vs",
    yesterday: "Yesterday", today: "Today", tomorrow: "Tomorrow",
    recentPredictions: "Recent Predictions",
    submitPrediction: "Submit Prediction", cancel: "Cancel",
    scorePrediction: "Score Prediction", winnerPrediction: "Winner Prediction",
    yourAnalysis: "Your Analysis", optional: "optional",
    predictionSubmitted: "Prediction submitted!", close: "Close",
    solution: "Solution",
    communityForecast: "Community Forecast", yourPrediction: "Your Prediction",
    selectWinner: "Select Winner", predictScore: "Predict Score",
    updatePrediction: "Update Prediction", showPredictions: "Show Predictions",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始",
    userPredictions: "用户预测", backToCommunity: "返回社区",
    globalChat: "全球聊天", todaysMatches: "今日比赛",
    makePrediction: "提交预测", loginToPredict: "登录后预测",
    noPredictions: "暂无预测", noMatches: "今日无比赛",
    communityPoll: "社区投票", totalVotes: "票", draw: "平局",
    homeWin: "主胜", awayWin: "客胜", vs: "vs",
    yesterday: "昨天", today: "今天", tomorrow: "明天",
    recentPredictions: "最新预测",
    submitPrediction: "提交预测", cancel: "取消",
    scorePrediction: "比分预测", winnerPrediction: "胜负预测",
    yourAnalysis: "你的分析", optional: "选填",
    predictionSubmitted: "预测已提交!", close: "关闭",
    solution: "解决方案",
    communityForecast: "社区预测", yourPrediction: "你的预测",
    selectWinner: "选择胜者", predictScore: "预测比分",
    updatePrediction: "更新预测", showPredictions: "查看预测",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始",
    userPredictions: "用戶預測", backToCommunity: "返回社區",
    globalChat: "全球聊天", todaysMatches: "今日比賽",
    makePrediction: "提交預測", loginToPredict: "登入後預測",
    noPredictions: "暫無預測", noMatches: "今日無比賽",
    communityPoll: "社區投票", totalVotes: "票", draw: "平局",
    homeWin: "主勝", awayWin: "客勝", vs: "vs",
    yesterday: "昨天", today: "今天", tomorrow: "明天",
    recentPredictions: "最新預測",
    submitPrediction: "提交預測", cancel: "取消",
    scorePrediction: "比分預測", winnerPrediction: "勝負預測",
    yourAnalysis: "你的分析", optional: "選填",
    predictionSubmitted: "預測已提交!", close: "關閉",
    solution: "解決方案",
    communityForecast: "社區預測", yourPrediction: "你的預測",
    selectWinner: "選擇勝者", predictScore: "預測比分",
    updatePrediction: "更新預測", showPredictions: "查看預測",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    userPredictions: "Prediksi Pengguna", backToCommunity: "Kembali ke Komunitas",
    globalChat: "Chat Global", todaysMatches: "Pertandingan Hari Ini",
    makePrediction: "Buat Prediksi", loginToPredict: "Login untuk Prediksi",
    noPredictions: "Belum ada prediksi", noMatches: "Tidak ada pertandingan hari ini",
    communityPoll: "Polling Komunitas", totalVotes: "suara", draw: "Seri",
    homeWin: "Tuan Rumah Menang", awayWin: "Tamu Menang", vs: "vs",
    yesterday: "Kemarin", today: "Hari Ini", tomorrow: "Besok",
    recentPredictions: "Prediksi Terbaru",
    submitPrediction: "Kirim Prediksi", cancel: "Batal",
    scorePrediction: "Prediksi Skor", winnerPrediction: "Prediksi Pemenang",
    yourAnalysis: "Analisis Anda", optional: "opsional",
    predictionSubmitted: "Prediksi terkirim!", close: "Tutup",
    solution: "Solusi",
    communityForecast: "Ramalan Komunitas", yourPrediction: "Prediksi Anda",
    selectWinner: "Pilih Pemenang", predictScore: "Prediksi Skor",
    updatePrediction: "Perbarui Prediksi", showPredictions: "Lihat Prediksi",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Empezar",
    userPredictions: "Predicciones de Usuarios", backToCommunity: "Volver a Comunidad",
    globalChat: "Chat Global", todaysMatches: "Partidos de Hoy",
    makePrediction: "Hacer Predicción", loginToPredict: "Iniciar sesión para predecir",
    noPredictions: "Sin predicciones aún", noMatches: "No hay partidos hoy",
    communityPoll: "Encuesta Comunitaria", totalVotes: "votos", draw: "Empate",
    homeWin: "Victoria Local", awayWin: "Victoria Visitante", vs: "vs",
    yesterday: "Ayer", today: "Hoy", tomorrow: "Mañana",
    recentPredictions: "Predicciones Recientes",
    submitPrediction: "Enviar Predicción", cancel: "Cancelar",
    scorePrediction: "Predicción de Marcador", winnerPrediction: "Predicción de Ganador",
    yourAnalysis: "Tu Análisis", optional: "opcional",
    predictionSubmitted: "¡Predicción enviada!", close: "Cerrar",
    solution: "Solución",
    communityForecast: "Pronóstico Comunitario", yourPrediction: "Tu Predicción",
    selectWinner: "Seleccionar Ganador", predictScore: "Predecir Marcador",
    updatePrediction: "Actualizar Predicción", showPredictions: "Ver Predicciones",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    userPredictions: "Previsões dos Usuários", backToCommunity: "Voltar para Comunidade",
    globalChat: "Chat Global", todaysMatches: "Jogos de Hoje",
    makePrediction: "Fazer Previsão", loginToPredict: "Entre para prever",
    noPredictions: "Sem previsões ainda", noMatches: "Sem jogos hoje",
    communityPoll: "Enquete da Comunidade", totalVotes: "votos", draw: "Empate",
    homeWin: "Vitória da Casa", awayWin: "Vitória do Visitante", vs: "vs",
    yesterday: "Ontem", today: "Hoje", tomorrow: "Amanhã",
    recentPredictions: "Previsões Recentes",
    submitPrediction: "Enviar Previsão", cancel: "Cancelar",
    scorePrediction: "Previsão de Placar", winnerPrediction: "Previsão de Vencedor",
    yourAnalysis: "Sua Análise", optional: "opcional",
    predictionSubmitted: "Previsão enviada!", close: "Fechar",
    solution: "Solução",
    communityForecast: "Previsão da Comunidade", yourPrediction: "Sua Previsão",
    selectWinner: "Selecionar Vencedor", predictScore: "Prever Placar",
    updatePrediction: "Atualizar Previsão", showPredictions: "Ver Previsões",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    userPredictions: "Benutzer-Vorhersagen", backToCommunity: "Zurück zur Community",
    globalChat: "Globaler Chat", todaysMatches: "Heutige Spiele",
    makePrediction: "Vorhersage machen", loginToPredict: "Anmelden zum Vorhersagen",
    noPredictions: "Noch keine Vorhersagen", noMatches: "Heute keine Spiele",
    communityPoll: "Community-Umfrage", totalVotes: "Stimmen", draw: "Unentschieden",
    homeWin: "Heimsieg", awayWin: "Auswärtssieg", vs: "vs",
    yesterday: "Gestern", today: "Heute", tomorrow: "Morgen",
    recentPredictions: "Neueste Vorhersagen",
    submitPrediction: "Vorhersage senden", cancel: "Abbrechen",
    scorePrediction: "Ergebnis-Vorhersage", winnerPrediction: "Sieger-Vorhersage",
    yourAnalysis: "Ihre Analyse", optional: "optional",
    predictionSubmitted: "Vorhersage gesendet!", close: "Schließen",
    solution: "Lösung",
    communityForecast: "Community-Prognose", yourPrediction: "Ihre Vorhersage",
    selectWinner: "Sieger wählen", predictScore: "Ergebnis vorhersagen",
    updatePrediction: "Vorhersage aktualisieren", showPredictions: "Vorhersagen anzeigen",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    userPredictions: "Prédictions des Utilisateurs", backToCommunity: "Retour à la Communauté",
    makePrediction: "Faire une Prédiction", loginToPredict: "Connectez-vous pour prédire",
    noPredictions: "Pas encore de prédictions", noMatches: "Pas de matchs aujourd'hui",
    communityPoll: "Sondage Communautaire", totalVotes: "votes", draw: "Nul",
    homeWin: "Victoire Domicile", awayWin: "Victoire Extérieur", vs: "vs",
    yesterday: "Hier", today: "Aujourd'hui", tomorrow: "Demain",
    recentPredictions: "Prédictions Récentes",
    submitPrediction: "Soumettre la Prédiction", cancel: "Annuler",
    scorePrediction: "Prédiction du Score", winnerPrediction: "Prédiction du Gagnant",
    yourAnalysis: "Votre Analyse", optional: "optionnel",
    predictionSubmitted: "Prédiction soumise!", close: "Fermer",
    solution: "Solution",
    communityForecast: "Prévision Communautaire", yourPrediction: "Votre Prédiction",
    selectWinner: "Choisir le Gagnant", predictScore: "Prédire le Score",
    updatePrediction: "Mettre à jour", showPredictions: "Voir les Prédictions",
  },
  JA: {
    home: "ホーム", predictions: "予想", leagues: "リーグ", performance: "AI性能",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    userPredictions: "ユーザー予想", backToCommunity: "コミュニティに戻る",
    makePrediction: "予想する", loginToPredict: "ログインして予想",
    noPredictions: "まだ予想がありません", noMatches: "今日の試合はありません",
    communityPoll: "コミュニティ投票", totalVotes: "票", draw: "引き分け",
    homeWin: "ホーム勝利", awayWin: "アウェイ勝利", vs: "vs",
    yesterday: "昨日", today: "今日", tomorrow: "明日",
    recentPredictions: "最近の予想",
    submitPrediction: "予想を送信", cancel: "キャンセル",
    scorePrediction: "スコア予想", winnerPrediction: "勝者予想",
    yourAnalysis: "あなたの分析", optional: "任意",
    predictionSubmitted: "予想が送信されました!", close: "閉じる",
    solution: "ソリューション",
    communityForecast: "コミュニティ予想", yourPrediction: "あなたの予想",
    selectWinner: "勝者を選択", predictScore: "スコアを予想",
    updatePrediction: "予想を更新", showPredictions: "予想を見る",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성능",
    community: "커뮤니티", news: "뉴스", pricing: "요금", login: "로그인", getStarted: "시작하기",
    userPredictions: "사용자 예측", backToCommunity: "커뮤니티로 돌아가기",
    makePrediction: "예측하기", loginToPredict: "로그인하여 예측",
    noPredictions: "아직 예측이 없습니다", noMatches: "오늘 경기가 없습니다",
    communityPoll: "커뮤니티 투표", totalVotes: "표", draw: "무승부",
    homeWin: "홈 승리", awayWin: "원정 승리", vs: "vs",
    yesterday: "어제", today: "오늘", tomorrow: "내일",
    recentPredictions: "최근 예측",
    submitPrediction: "예측 제출", cancel: "취소",
    scorePrediction: "스코어 예측", winnerPrediction: "승자 예측",
    yourAnalysis: "분석", optional: "선택사항",
    predictionSubmitted: "예측이 제출되었습니다!", close: "닫기",
    solution: "솔루션",
    communityForecast: "커뮤니티 예측", yourPrediction: "내 예측",
    selectWinner: "승자 선택", predictScore: "점수 예측",
    updatePrediction: "예측 업데이트", showPredictions: "예측 보기",
  },
};

export default function UserPredictionsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [language, setLanguage] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Prematch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [matchPredictions, setMatchPredictions] = useState<Record<number, UserPrediction[]>>({});
  const [expandedPredictions, setExpandedPredictions] = useState<Set<number>>(new Set());

  // User's existing predictions per match
  const [userExistingPredictions, setUserExistingPredictions] = useState<Record<number, UserPrediction | null>>({});

  // Community prediction summary cache
  const [communitySummary, setCommunitySummary] = useState<Record<number, {
    homePercent: number;
    drawPercent: number;
    awayPercent: number;
    totalVotes: number;
  }>>({});

  // Modal state
  const [predictionModal, setPredictionModal] = useState<Prematch | null>(null);
  const [modalForm, setModalForm] = useState({
    homeScore: '',
    awayScore: '',
    winner: '' as '' | '1' | 'X' | '2',
  });
  const [submitting, setSubmitting] = useState(false);

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

  // Generate date options
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i - 1);
    return date;
  });

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return t('today');
    if (date.toDateString() === tomorrow.toDateString()) return t('tomorrow');
    if (date.toDateString() === yesterday.toDateString()) return t('yesterday');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_language');
    if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: unknown, session: { user: User | null } | null) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadMatches();
  }, [selectedDate]);

  const loadMatches = async () => {
    setLoading(true);
    // Use local date components directly
    // selectedDate represents the calendar date the user selected
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const { data } = await supabase
      .from('prematches')
      .select('*')
      .gte('start_date_msia', `${dateStr}T00:00:00`)
      .lte('start_date_msia', `${dateStr}T23:59:59`)
      .order('start_date_msia', { ascending: true });

    const matchesData = (data || []) as Prematch[];
    setMatches(matchesData);

    // Load predictions for all matches
    if (matchesData.length > 0) {
      const fixtureIds = matchesData.map((m: Prematch) => m.fixture_id);
      const { data: predictions } = await supabase
        .from('user_match_predictions')
        .select('*')
        .in('match_id', fixtureIds)
        .order('created_at', { ascending: false });

      const predByMatch: Record<number, UserPrediction[]> = {};
      for (const p of (predictions || []) as UserPrediction[]) {
        if (!predByMatch[p.match_id]) predByMatch[p.match_id] = [];
        predByMatch[p.match_id].push(p);
      }
      setMatchPredictions(predByMatch);
    }

    setLoading(false);
  };

  // Load user's existing predictions for all matches
  const loadUserPredictions = async () => {
    if (!user || matches.length === 0) return;

    const fixtureIds = matches.map(m => m.fixture_id);
    const { data } = await supabase
      .from('user_match_predictions')
      .select('*')
      .eq('user_id', user.id)
      .in('match_id', fixtureIds);

    const userPredMap: Record<number, UserPrediction | null> = {};
    for (const m of matches) {
      const pred = (data || []).find((p: UserPrediction) => p.match_id === m.fixture_id);
      userPredMap[m.fixture_id] = pred || null;
    }
    setUserExistingPredictions(userPredMap);
  };

  // Calculate community summaries when matchPredictions changes
  useEffect(() => {
    const summaries: Record<number, { homePercent: number; drawPercent: number; awayPercent: number; totalVotes: number }> = {};

    for (const [matchIdStr, predictions] of Object.entries(matchPredictions)) {
      const matchId = parseInt(matchIdStr);
      const winnerPredictions = predictions.filter(p => p.winner_prediction);
      const totalVotes = winnerPredictions.length;

      if (totalVotes > 0) {
        const homeWins = winnerPredictions.filter(p => p.winner_prediction === '1').length;
        const draws = winnerPredictions.filter(p => p.winner_prediction === 'X').length;
        const awayWins = winnerPredictions.filter(p => p.winner_prediction === '2').length;

        summaries[matchId] = {
          homePercent: Math.round((homeWins / totalVotes) * 100),
          drawPercent: Math.round((draws / totalVotes) * 100),
          awayPercent: Math.round((awayWins / totalVotes) * 100),
          totalVotes,
        };
      }
    }
    setCommunitySummary(summaries);
  }, [matchPredictions]);

  // Load user predictions when user or matches change
  useEffect(() => {
    loadUserPredictions();
  }, [user, matches]);

  const toggleExpandPredictions = (fixtureId: number) => {
    setExpandedPredictions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fixtureId)) {
        newSet.delete(fixtureId);
      } else {
        newSet.add(fixtureId);
      }
      return newSet;
    });
  };

  // Open prediction modal
  const openPredictionModal = (match: Prematch) => {
    const existingPred = userExistingPredictions[match.fixture_id];
    setPredictionModal(match);
    setModalForm({
      homeScore: existingPred?.home_score_prediction?.toString() || '',
      awayScore: existingPred?.away_score_prediction?.toString() || '',
      winner: (existingPred?.winner_prediction as '' | '1' | 'X' | '2') || '',
    });
  };

  // Close prediction modal
  const closePredictionModal = () => {
    setPredictionModal(null);
    setModalForm({ homeScore: '', awayScore: '', winner: '' });
  };

  // Submit prediction from modal
  const submitPrediction = async () => {
    if (!user || !predictionModal) return;

    setSubmitting(true);
    try {
      await supabase.from('user_match_predictions').upsert({
        user_id: user.id,
        match_id: predictionModal.fixture_id,
        home_team: predictionModal.home_name,
        away_team: predictionModal.away_name,
        league: predictionModal.league_name,
        match_date: predictionModal.start_date_msia,
        home_score_prediction: modalForm.homeScore !== '' ? parseInt(modalForm.homeScore) : null,
        away_score_prediction: modalForm.awayScore !== '' ? parseInt(modalForm.awayScore) : null,
        winner_prediction: modalForm.winner || null,
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        user_avatar: user.user_metadata?.avatar_url || null,
      }, { onConflict: 'user_id,match_id' });

      closePredictionModal();
      loadMatches();
    } catch (err) {
      console.error('Failed to submit prediction:', err);
    } finally {
      setSubmitting(false);
    }
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
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm"
              >
                {t('globalChat')}
              </Link>
              <Link
                href={localePath('/community/user-predictions')}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-medium"
              >
                {t('userPredictions')}
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {t('userPredictions')}
            </h1>
          </div>

          {/* Date Selector */}
          <div className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2">
            {dates.slice(1, 5).map((date) => {
              // Compare using local date parts instead of toISOString (which converts to UTC)
              const isSelected = selectedDate.getFullYear() === date.getFullYear() &&
                                 selectedDate.getMonth() === date.getMonth() &&
                                 selectedDate.getDate() === date.getDate();
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

          {/* Matches Table */}
          <div>
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
                <div className="bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent rounded-2xl border border-white/10 overflow-hidden">
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Match</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">{t('communityForecast')}</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('yourPrediction')}</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {matches.map((match) => {
                          const matchTime = new Date(match.start_date_msia).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                          const summary = communitySummary[match.fixture_id];
                          const existingPred = userExistingPredictions[match.fixture_id];
                          const predictions = matchPredictions[match.fixture_id] || [];

                          return (
                            <tr key={match.id} className="hover:bg-white/[0.02] transition-colors">
                              {/* Time */}
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span className="text-sm font-mono text-gray-300">{matchTime}</span>
                                </div>
                              </td>

                              {/* Match Info */}
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  {/* League Logo */}
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {match.league_logo ? (
                                      <img src={match.league_logo} alt="" className="w-6 h-6 object-contain" />
                                    ) : (
                                      <span className="text-xs text-gray-500">{match.league_name[0]}</span>
                                    )}
                                  </div>
                                  {/* Teams */}
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 text-sm">
                                      {match.home_logo && <img src={match.home_logo} alt="" className="w-5 h-5 object-contain" />}
                                      <span className="font-medium text-white truncate">{match.home_name}</span>
                                      <span className="text-gray-500">vs</span>
                                      <span className="font-medium text-white truncate">{match.away_name}</span>
                                      {match.away_logo && <img src={match.away_logo} alt="" className="w-5 h-5 object-contain" />}
                                    </div>
                                    <div className="text-xs text-emerald-400 mt-0.5">{match.league_name}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Community Forecast */}
                              <td className="px-4 py-4 hidden md:table-cell">
                                {summary && summary.totalVotes > 0 ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <div className="h-2 w-20 rounded-full overflow-hidden flex bg-white/10">
                                      {summary.homePercent > 0 && <div className="bg-blue-500 h-full" style={{ width: `${summary.homePercent}%` }} />}
                                      {summary.drawPercent > 0 && <div className="bg-amber-500 h-full" style={{ width: `${summary.drawPercent}%` }} />}
                                      {summary.awayPercent > 0 && <div className="bg-rose-500 h-full" style={{ width: `${summary.awayPercent}%` }} />}
                                    </div>
                                    <span className="text-[10px] text-gray-500">({predictions.length})</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-600">-</span>
                                )}
                              </td>

                              {/* Your Prediction */}
                              <td className="px-4 py-4 text-center">
                                {existingPred ? (
                                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                    {(existingPred.home_score_prediction !== null || existingPred.away_score_prediction !== null) && (
                                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-bold">
                                        {existingPred.home_score_prediction ?? '?'}-{existingPred.away_score_prediction ?? '?'}
                                      </span>
                                    )}
                                    {existingPred.winner_prediction && (
                                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                        existingPred.winner_prediction === '1' ? 'bg-blue-500/20 text-blue-300' :
                                        existingPred.winner_prediction === 'X' ? 'bg-amber-500/20 text-amber-300' :
                                        'bg-rose-500/20 text-rose-300'
                                      }`}>
                                        {existingPred.winner_prediction === '1' ? '1' : existingPred.winner_prediction === 'X' ? 'X' : '2'}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-600">-</span>
                                )}
                              </td>

                              {/* Predict Button */}
                              <td className="px-4 py-4 text-right">
                                {user ? (
                                  <button
                                    onClick={() => openPredictionModal(match)}
                                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/20 text-xs font-medium text-emerald-400 cursor-pointer border border-emerald-500/30 hover:border-emerald-500/50 transition-all"
                                  >
                                    {existingPred ? t('updatePrediction') : t('makePrediction')}
                                  </button>
                                ) : (
                                  <Link href={localePath('/login')} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-medium text-gray-400 border border-white/10 hover:bg-white/10 transition-all">
                                    {t('login')}
                                  </Link>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Prediction Modal */}
      {predictionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 rounded-2xl border border-white/10 w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-transparent">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{t('makePrediction')}</h3>
                <button onClick={closePredictionModal} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Match Info */}
              <div className="mt-3 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  {predictionModal.home_logo && <img src={predictionModal.home_logo} alt="" className="w-8 h-8 object-contain" />}
                  <span className="text-sm font-medium text-white">{predictionModal.home_name}</span>
                </div>
                <span className="text-gray-500 text-sm">{t('vs')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{predictionModal.away_name}</span>
                  {predictionModal.away_logo && <img src={predictionModal.away_logo} alt="" className="w-8 h-8 object-contain" />}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Winner Prediction */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">{t('winnerPrediction')}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setModalForm(prev => ({ ...prev, winner: prev.winner === '1' ? '' : '1' }))}
                    className={`py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                      modalForm.winner === '1'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {t('homeWin')}
                  </button>
                  <button
                    onClick={() => setModalForm(prev => ({ ...prev, winner: prev.winner === 'X' ? '' : 'X' }))}
                    className={`py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                      modalForm.winner === 'X'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {t('draw')}
                  </button>
                  <button
                    onClick={() => setModalForm(prev => ({ ...prev, winner: prev.winner === '2' ? '' : '2' }))}
                    className={`py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                      modalForm.winner === '2'
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {t('awayWin')}
                  </button>
                </div>
              </div>

              {/* Score Prediction */}
              {(() => {
                const homeScore = parseInt(modalForm.homeScore || '0') || 0;
                const awayScore = parseInt(modalForm.awayScore || '0') || 0;
                const hasScores = modalForm.homeScore || modalForm.awayScore;
                const negativeError = (modalForm.homeScore !== '' && homeScore < 0) || (modalForm.awayScore !== '' && awayScore < 0);
                const winnerScoreError = hasScores && modalForm.winner && !negativeError && (
                  (modalForm.winner === '1' && homeScore <= awayScore) ||
                  (modalForm.winner === '2' && awayScore <= homeScore) ||
                  (modalForm.winner === 'X' && homeScore !== awayScore)
                );
                const scoreError = negativeError || winnerScoreError;

                return (
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">{t('scorePrediction')} <span className="text-gray-600">({t('optional')})</span></label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={modalForm.homeScore}
                        onChange={(e) => setModalForm(prev => ({ ...prev, homeScore: e.target.value }))}
                        placeholder="0"
                        className={`flex-1 bg-white/5 rounded-xl px-4 py-3 text-white text-center text-lg font-bold focus:outline-none ${
                          scoreError ? 'border-2 border-red-500' : 'border border-white/10 focus:border-emerald-500/50'
                        }`}
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={modalForm.awayScore}
                        onChange={(e) => setModalForm(prev => ({ ...prev, awayScore: e.target.value }))}
                        placeholder="0"
                        className={`flex-1 bg-white/5 rounded-xl px-4 py-3 text-white text-center text-lg font-bold focus:outline-none ${
                          scoreError ? 'border-2 border-red-500' : 'border border-white/10 focus:border-emerald-500/50'
                        }`}
                      />
                    </div>
                    {negativeError && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Score must be 0 or higher
                      </p>
                    )}
                    {winnerScoreError && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {modalForm.winner === '1' && `${t('homeWin')}: ${predictionModal.home_name} > ${predictionModal.away_name}`}
                        {modalForm.winner === '2' && `${t('awayWin')}: ${predictionModal.away_name} > ${predictionModal.home_name}`}
                        {modalForm.winner === 'X' && `${t('draw')}: ${predictionModal.home_name} = ${predictionModal.away_name}`}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            {(() => {
              const homeScore = parseInt(modalForm.homeScore || '0') || 0;
              const awayScore = parseInt(modalForm.awayScore || '0') || 0;
              const hasScores = modalForm.homeScore || modalForm.awayScore;
              const negativeError = (modalForm.homeScore !== '' && homeScore < 0) || (modalForm.awayScore !== '' && awayScore < 0);
              const winnerScoreError = hasScores && modalForm.winner && !negativeError && (
                (modalForm.winner === '1' && homeScore <= awayScore) ||
                (modalForm.winner === '2' && awayScore <= homeScore) ||
                (modalForm.winner === 'X' && homeScore !== awayScore)
              );
              const scoreError = negativeError || winnerScoreError;

              return (
                <div className="p-4 border-t border-white/10 flex gap-3">
                  <button
                    onClick={closePredictionModal}
                    className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-medium hover:bg-white/10 transition-all cursor-pointer border border-white/10"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={submitPrediction}
                    disabled={submitting || scoreError || (!modalForm.homeScore && !modalForm.awayScore && !modalForm.winner)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? '...' : t('submitPrediction')}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
