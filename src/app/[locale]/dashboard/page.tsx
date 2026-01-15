'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, signOut, getUserSubscription, UserSubscription } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeToTranslationCode, type Locale } from '@/i18n/config';

type MenuSection = 'profile' | 'subscription' | 'calculator' | 'settings';

// Translations for dashboard
const translations: Record<string, Record<string, string>> = {
  EN: {
    // Navbar
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", solution: "Solution", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    // Dashboard
    profile: "Profile", subscription: "Subscription", profitCalculator: "Profit Calculator", settings: "Settings", signOut: "Sign Out",
    quickActions: "Quick Actions", todaysPicks: "Today's picks", browseAll: "Browse all", trackStats: "Track stats", viewPlans: "View plans",
    daysLeft: "Days Left", joined: "Joined", freeUser: "Free User", leaguesAllowed: "Leagues",
    // Subscription
    active: "Active", expired: "Expired", timeRemaining: "Time Remaining", days: "days",
    managePlan: "Manage Plan", upgradePlan: "Upgrade Plan", cancel: "Cancel",
    noActiveSubscription: "No Active Subscription", subscribeToUnlock: "Subscribe to unlock premium features", subscribeNow: "Subscribe Now",
    aiPredictions: "AI Predictions", premiumPicks: "Premium picks", liveOdds: "Live Odds", realtime: "Real-time", support: "Support", help247: "24/7 help",
    // Calculator
    oddsFormat: "Odds Format", decimal: "Decimal", american: "American", fractional: "Fractional",
    betAmount: "Bet Amount", odds: "Odds", ifYouWin: "If you win, you profit", stake: "Stake", return: "Return",
    // Settings
    account: "Account", email: "Email", password: "Password", change: "Change",
    notifications: "Notifications", emailNotifications: "Email Notifications", receiveAlerts: "Receive prediction alerts via email",
    pushNotifications: "Push Notifications", browserNotifications: "Browser push notifications",
    dangerZone: "Danger Zone", deleteAccount: "Delete Account", deleteAccountDesc: "Permanently delete your account and all data", delete: "Delete",
    // Common
    start: "Start", end: "End", styles: "Styles",
  },
  '中文': {
    // Navbar
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", solution: "解决方案", pricing: "价格", login: "登录", getStarted: "开始",
    // Dashboard
    profile: "个人资料", subscription: "订阅", profitCalculator: "利润计算器", settings: "设置", signOut: "退出登录",
    quickActions: "快捷操作", todaysPicks: "今日精选", browseAll: "浏览全部", trackStats: "追踪数据", viewPlans: "查看方案",
    daysLeft: "剩余天数", joined: "加入于", freeUser: "免费用户",
    // Subscription
    active: "活跃", expired: "已过期", timeRemaining: "剩余时间", days: "天",
    managePlan: "管理方案", upgradePlan: "升级方案", cancel: "取消",
    noActiveSubscription: "无活跃订阅", subscribeToUnlock: "订阅以解锁高级功能", subscribeNow: "立即订阅",
    aiPredictions: "AI预测", premiumPicks: "高级精选", liveOdds: "实时赔率", realtime: "实时", support: "支持", help247: "24/7帮助",
    // Calculator
    oddsFormat: "赔率格式", decimal: "小数", american: "美式", fractional: "分数",
    betAmount: "投注金额", odds: "赔率", ifYouWin: "如果赢了，利润", stake: "本金", return: "回报",
    // Settings
    account: "账户", email: "邮箱", password: "密码", change: "修改",
    notifications: "通知", emailNotifications: "邮件通知", receiveAlerts: "通过邮件接收预测提醒",
    pushNotifications: "推送通知", browserNotifications: "浏览器推送通知",
    dangerZone: "危险区域", deleteAccount: "删除账户", deleteAccountDesc: "永久删除您的账户和所有数据", delete: "删除",
    // Common
    start: "开始", end: "结束", leaguesAllowed: "联赛", styles: "风格",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社區", news: "新聞", solution: "解決方案", pricing: "價格", login: "登入", getStarted: "開始",
    profile: "個人資料", subscription: "訂閱", profitCalculator: "利潤計算器", settings: "設定", signOut: "登出",
    quickActions: "快捷操作", todaysPicks: "今日精選", browseAll: "瀏覽全部", trackStats: "追蹤數據", viewPlans: "查看方案",
    daysLeft: "剩餘天數", joined: "加入於", freeUser: "免費用戶",
    active: "活躍", expired: "已過期", timeRemaining: "剩餘時間", days: "天",
    managePlan: "管理方案", upgradePlan: "升級方案", cancel: "取消",
    noActiveSubscription: "無活躍訂閱", subscribeToUnlock: "訂閱以解鎖高級功能", subscribeNow: "立即訂閱",
    aiPredictions: "AI預測", premiumPicks: "高級精選", liveOdds: "實時賠率", realtime: "實時", support: "支援", help247: "24/7幫助",
    oddsFormat: "賠率格式", decimal: "小數", american: "美式", fractional: "分數",
    betAmount: "投注金額", odds: "賠率", ifYouWin: "如果贏了，利潤", stake: "本金", return: "回報",
    account: "帳戶", email: "郵箱", password: "密碼", change: "修改",
    notifications: "通知", emailNotifications: "郵件通知", receiveAlerts: "通過郵件接收預測提醒",
    pushNotifications: "推送通知", browserNotifications: "瀏覽器推送通知",
    dangerZone: "危險區域", deleteAccount: "刪除帳戶", deleteAccountDesc: "永久刪除您的帳戶和所有數據", delete: "刪除",
    start: "開始", end: "結束", leaguesAllowed: "聯賽", styles: "風格",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", solution: "Solusi", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    profile: "Profil", subscription: "Langganan", profitCalculator: "Kalkulator Keuntungan", settings: "Pengaturan", signOut: "Keluar",
    quickActions: "Aksi Cepat", todaysPicks: "Pilihan hari ini", browseAll: "Telusuri semua", trackStats: "Lacak statistik", viewPlans: "Lihat paket",
    daysLeft: "Hari tersisa", joined: "Bergabung", freeUser: "Pengguna Gratis",
    active: "Aktif", expired: "Kedaluwarsa", timeRemaining: "Waktu Tersisa", days: "hari",
    managePlan: "Kelola Paket", upgradePlan: "Upgrade Paket", cancel: "Batal",
    noActiveSubscription: "Tidak Ada Langganan Aktif", subscribeToUnlock: "Berlangganan untuk membuka fitur premium", subscribeNow: "Berlangganan",
    aiPredictions: "Prediksi AI", premiumPicks: "Pilihan premium", liveOdds: "Odds Live", realtime: "Real-time", support: "Dukungan", help247: "Bantuan 24/7",
    oddsFormat: "Format Odds", decimal: "Desimal", american: "Amerika", fractional: "Pecahan",
    betAmount: "Jumlah Taruhan", odds: "Odds", ifYouWin: "Jika menang, keuntungan", stake: "Modal", return: "Kembali",
    account: "Akun", email: "Email", password: "Kata Sandi", change: "Ubah",
    notifications: "Notifikasi", emailNotifications: "Notifikasi Email", receiveAlerts: "Terima peringatan prediksi via email",
    pushNotifications: "Notifikasi Push", browserNotifications: "Notifikasi push browser",
    dangerZone: "Zona Berbahaya", deleteAccount: "Hapus Akun", deleteAccountDesc: "Hapus akun dan semua data secara permanen", delete: "Hapus",
    start: "Mulai", end: "Selesai", leaguesAllowed: "Liga", styles: "Gaya",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", solution: "Solución", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Empezar",
    profile: "Perfil", subscription: "Suscripción", profitCalculator: "Calculadora de Ganancias", settings: "Configuración", signOut: "Cerrar Sesión",
    quickActions: "Acciones Rápidas", todaysPicks: "Picks de hoy", browseAll: "Ver todo", trackStats: "Ver estadísticas", viewPlans: "Ver planes",
    daysLeft: "Días restantes", joined: "Unido", freeUser: "Usuario Gratis",
    active: "Activo", expired: "Expirado", timeRemaining: "Tiempo Restante", days: "días",
    managePlan: "Gestionar Plan", upgradePlan: "Mejorar Plan", cancel: "Cancelar",
    noActiveSubscription: "Sin Suscripción Activa", subscribeToUnlock: "Suscríbete para desbloquear funciones premium", subscribeNow: "Suscribirse",
    aiPredictions: "Predicciones IA", premiumPicks: "Picks premium", liveOdds: "Cuotas en Vivo", realtime: "Tiempo real", support: "Soporte", help247: "Ayuda 24/7",
    oddsFormat: "Formato de Cuotas", decimal: "Decimal", american: "Americano", fractional: "Fraccionario",
    betAmount: "Cantidad de Apuesta", odds: "Cuotas", ifYouWin: "Si ganas, ganancias", stake: "Inversión", return: "Retorno",
    account: "Cuenta", email: "Correo", password: "Contraseña", change: "Cambiar",
    notifications: "Notificaciones", emailNotifications: "Notificaciones por Email", receiveAlerts: "Recibir alertas de predicción por email",
    pushNotifications: "Notificaciones Push", browserNotifications: "Notificaciones push del navegador",
    dangerZone: "Zona de Peligro", deleteAccount: "Eliminar Cuenta", deleteAccountDesc: "Eliminar permanentemente tu cuenta y datos", delete: "Eliminar",
    start: "Inicio", end: "Fin", leaguesAllowed: "Ligas", styles: "Estilos",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Notícias", solution: "Solução", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    profile: "Perfil", subscription: "Assinatura", profitCalculator: "Calculadora de Lucro", settings: "Configurações", signOut: "Sair",
    quickActions: "Ações Rápidas", todaysPicks: "Picks de hoje", browseAll: "Ver tudo", trackStats: "Ver estatísticas", viewPlans: "Ver planos",
    daysLeft: "Dias restantes", joined: "Entrou em", freeUser: "Usuário Grátis",
    active: "Ativo", expired: "Expirado", timeRemaining: "Tempo Restante", days: "dias",
    managePlan: "Gerenciar Plano", upgradePlan: "Atualizar Plano", cancel: "Cancelar",
    noActiveSubscription: "Sem Assinatura Ativa", subscribeToUnlock: "Assine para desbloquear recursos premium", subscribeNow: "Assinar",
    aiPredictions: "Previsões IA", premiumPicks: "Picks premium", liveOdds: "Odds ao Vivo", realtime: "Tempo real", support: "Suporte", help247: "Ajuda 24/7",
    oddsFormat: "Formato de Odds", decimal: "Decimal", american: "Americano", fractional: "Fracionário",
    betAmount: "Valor da Aposta", odds: "Odds", ifYouWin: "Se ganhar, lucro", stake: "Investimento", return: "Retorno",
    account: "Conta", email: "Email", password: "Senha", change: "Alterar",
    notifications: "Notificações", emailNotifications: "Notificações por Email", receiveAlerts: "Receber alertas de previsão por email",
    pushNotifications: "Notificações Push", browserNotifications: "Notificações push do navegador",
    dangerZone: "Zona de Perigo", deleteAccount: "Excluir Conta", deleteAccountDesc: "Excluir permanentemente sua conta e dados", delete: "Excluir",
    start: "Início", end: "Fim", leaguesAllowed: "Ligas", styles: "Estilos",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", solution: "Lösung", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    profile: "Profil", subscription: "Abonnement", profitCalculator: "Gewinnrechner", settings: "Einstellungen", signOut: "Abmelden",
    quickActions: "Schnellaktionen", todaysPicks: "Heutige Picks", browseAll: "Alle durchsuchen", trackStats: "Statistiken verfolgen", viewPlans: "Pläne ansehen",
    daysLeft: "Tage übrig", joined: "Beigetreten", freeUser: "Kostenloser Benutzer",
    active: "Aktiv", expired: "Abgelaufen", timeRemaining: "Verbleibende Zeit", days: "Tage",
    managePlan: "Plan verwalten", upgradePlan: "Plan upgraden", cancel: "Abbrechen",
    noActiveSubscription: "Kein aktives Abonnement", subscribeToUnlock: "Abonnieren für Premium-Funktionen", subscribeNow: "Jetzt abonnieren",
    aiPredictions: "KI-Vorhersagen", premiumPicks: "Premium Picks", liveOdds: "Live-Quoten", realtime: "Echtzeit", support: "Support", help247: "24/7 Hilfe",
    oddsFormat: "Quotenformat", decimal: "Dezimal", american: "Amerikanisch", fractional: "Bruch",
    betAmount: "Einsatzbetrag", odds: "Quoten", ifYouWin: "Bei Gewinn, Profit", stake: "Einsatz", return: "Rückgabe",
    account: "Konto", email: "E-Mail", password: "Passwort", change: "Ändern",
    notifications: "Benachrichtigungen", emailNotifications: "E-Mail-Benachrichtigungen", receiveAlerts: "Vorhersage-Alerts per E-Mail erhalten",
    pushNotifications: "Push-Benachrichtigungen", browserNotifications: "Browser-Push-Benachrichtigungen",
    dangerZone: "Gefahrenzone", deleteAccount: "Konto löschen", deleteAccountDesc: "Konto und alle Daten dauerhaft löschen", delete: "Löschen",
    start: "Start", end: "Ende", leaguesAllowed: "Ligen", styles: "Stile",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communauté", news: "Actualités", solution: "Solution", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    profile: "Profil", subscription: "Abonnement", profitCalculator: "Calculateur de Profit", settings: "Paramètres", signOut: "Déconnexion",
    quickActions: "Actions Rapides", todaysPicks: "Picks du jour", browseAll: "Tout parcourir", trackStats: "Suivre les stats", viewPlans: "Voir les plans",
    daysLeft: "Jours restants", joined: "Inscrit le", freeUser: "Utilisateur Gratuit",
    active: "Actif", expired: "Expiré", timeRemaining: "Temps Restant", days: "jours",
    managePlan: "Gérer le Plan", upgradePlan: "Améliorer le Plan", cancel: "Annuler",
    noActiveSubscription: "Pas d'Abonnement Actif", subscribeToUnlock: "Abonnez-vous pour débloquer les fonctionnalités premium", subscribeNow: "S'abonner",
    aiPredictions: "Prédictions IA", premiumPicks: "Picks premium", liveOdds: "Cotes en Direct", realtime: "Temps réel", support: "Support", help247: "Aide 24/7",
    oddsFormat: "Format des Cotes", decimal: "Décimal", american: "Américain", fractional: "Fractionnaire",
    betAmount: "Montant du Pari", odds: "Cotes", ifYouWin: "Si vous gagnez, profit", stake: "Mise", return: "Retour",
    account: "Compte", email: "Email", password: "Mot de passe", change: "Modifier",
    notifications: "Notifications", emailNotifications: "Notifications Email", receiveAlerts: "Recevoir les alertes de prédiction par email",
    pushNotifications: "Notifications Push", browserNotifications: "Notifications push du navigateur",
    dangerZone: "Zone Dangereuse", deleteAccount: "Supprimer le Compte", deleteAccountDesc: "Supprimer définitivement votre compte et données", delete: "Supprimer",
    start: "Début", end: "Fin", leaguesAllowed: "Ligues", styles: "Styles",
  },
  JA: {
    home: "ホーム", predictions: "予想", leagues: "リーグ", performance: "AI性能",
    community: "コミュニティ", news: "ニュース", solution: "ソリューション", pricing: "料金", login: "ログイン", getStarted: "始める",
    profile: "プロフィール", subscription: "サブスクリプション", profitCalculator: "利益計算機", settings: "設定", signOut: "ログアウト",
    quickActions: "クイックアクション", todaysPicks: "本日のピック", browseAll: "すべて見る", trackStats: "統計を追跡", viewPlans: "プランを見る",
    daysLeft: "残り日数", joined: "登録日", freeUser: "無料ユーザー",
    active: "アクティブ", expired: "期限切れ", timeRemaining: "残り時間", days: "日",
    managePlan: "プラン管理", upgradePlan: "プランをアップグレード", cancel: "キャンセル",
    noActiveSubscription: "アクティブなサブスクリプションなし", subscribeToUnlock: "プレミアム機能を解除するには購読", subscribeNow: "今すぐ購読",
    aiPredictions: "AI予想", premiumPicks: "プレミアムピック", liveOdds: "ライブオッズ", realtime: "リアルタイム", support: "サポート", help247: "24時間対応",
    oddsFormat: "オッズ形式", decimal: "小数", american: "アメリカ式", fractional: "分数",
    betAmount: "ベット額", odds: "オッズ", ifYouWin: "勝った場合の利益", stake: "賭け金", return: "リターン",
    account: "アカウント", email: "メール", password: "パスワード", change: "変更",
    notifications: "通知", emailNotifications: "メール通知", receiveAlerts: "メールで予想アラートを受信",
    pushNotifications: "プッシュ通知", browserNotifications: "ブラウザプッシュ通知",
    dangerZone: "危険ゾーン", deleteAccount: "アカウント削除", deleteAccountDesc: "アカウントとすべてのデータを完全に削除", delete: "削除",
    start: "開始", end: "終了", leaguesAllowed: "リーグ", styles: "スタイル",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성능",
    community: "커뮤니티", news: "뉴스", solution: "솔루션", pricing: "요금", login: "로그인", getStarted: "시작하기",
    profile: "프로필", subscription: "구독", profitCalculator: "수익 계산기", settings: "설정", signOut: "로그아웃",
    quickActions: "빠른 작업", todaysPicks: "오늘의 픽", browseAll: "모두 보기", trackStats: "통계 추적", viewPlans: "플랜 보기",
    daysLeft: "남은 일수", joined: "가입일", freeUser: "무료 사용자",
    active: "활성", expired: "만료됨", timeRemaining: "남은 시간", days: "일",
    managePlan: "플랜 관리", upgradePlan: "플랜 업그레이드", cancel: "취소",
    noActiveSubscription: "활성 구독 없음", subscribeToUnlock: "프리미엄 기능을 잠금 해제하려면 구독", subscribeNow: "지금 구독",
    aiPredictions: "AI 예측", premiumPicks: "프리미엄 픽", liveOdds: "라이브 배당", realtime: "실시간", support: "지원", help247: "24시간 지원",
    oddsFormat: "배당 형식", decimal: "소수", american: "미국식", fractional: "분수",
    betAmount: "베팅 금액", odds: "배당", ifYouWin: "이기면 수익", stake: "판돈", return: "반환",
    account: "계정", email: "이메일", password: "비밀번호", change: "변경",
    notifications: "알림", emailNotifications: "이메일 알림", receiveAlerts: "이메일로 예측 알림 받기",
    pushNotifications: "푸시 알림", browserNotifications: "브라우저 푸시 알림",
    dangerZone: "위험 구역", deleteAccount: "계정 삭제", deleteAccountDesc: "계정과 모든 데이터를 영구적으로 삭제", delete: "삭제",
    start: "시작", end: "종료", leaguesAllowed: "리그", styles: "스타일",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const urlLocale = (params?.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';

  // Initialize language from URL locale
  const initialLang = localeToTranslationCode[locale as Locale] || 'EN';
  const [language, setLanguage] = useState(initialLang);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const t = (key: string) => translations[language]?.[key] || translations['EN'][key] || key;

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  // Map translation code to URL locale
  const translationCodeToLocale: Record<string, string> = {
    'EN': 'en', 'ES': 'es', 'PT': 'pt', 'DE': 'de', 'FR': 'fr',
    'JA': 'ja', 'KO': 'ko', '中文': 'zh', '繁體': 'tw', 'ID': 'id',
  };

  const handleSetLang = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem('oddsflow_language', newLang);
    setLangDropdownOpen(false);

    // Navigate to the new locale URL
    const newLocale = translationCodeToLocale[newLang] || 'en';
    const currentPath = window.location.pathname;
    // Remove current locale from path
    const pathWithoutLocale = currentPath.replace(/^\/(en|es|pt|de|fr|ja|ko|zh|tw|id)(\/|$)/, '/');
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    router.push(newPath);
  };

  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<MenuSection>('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profit Calculator States
  const [betAmount, setBetAmount] = useState<string>('100');
  const [odds, setOdds] = useState<string>('1.85');
  const [oddsFormat, setOddsFormat] = useState<'decimal' | 'american' | 'fractional'>('decimal');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push(localePath('/login'));
        return;
      }

      setUser(session.user);

      // Get subscription
      const { data: sub } = await getUserSubscription(session.user.id);
      setSubscription(sub);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (event === 'SIGNED_OUT') {
          router.push(localePath('/login'));
        } else if (session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      authSub.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push(localePath('/'));
  };

  const getDaysRemaining = () => {
    if (!subscription?.end_date) return 0;
    const end = new Date(subscription.end_date);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get user avatar URL (from Google or generate default)
  const getAvatarUrl = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    if (user?.user_metadata?.picture) {
      return user.user_metadata.picture;
    }
    return null;
  };

  // Profit Calculator Functions
  const calculateProfit = () => {
    const stake = parseFloat(betAmount) || 0;
    let decimalOdds = parseFloat(odds) || 0;

    // Convert to decimal odds if needed
    if (oddsFormat === 'american') {
      if (decimalOdds > 0) {
        decimalOdds = (decimalOdds / 100) + 1;
      } else {
        decimalOdds = (100 / Math.abs(decimalOdds)) + 1;
      }
    } else if (oddsFormat === 'fractional') {
      const parts = odds.split('/');
      if (parts.length === 2) {
        decimalOdds = (parseFloat(parts[0]) / parseFloat(parts[1])) + 1;
      }
    }

    const potentialReturn = stake * decimalOdds;
    const profit = potentialReturn - stake;

    return {
      stake,
      potentialReturn: potentialReturn.toFixed(2),
      profit: profit.toFixed(2),
      decimalOdds: decimalOdds.toFixed(2),
    };
  };

  const profitData = calculateProfit();

  // Sync language from URL locale
  useEffect(() => {
    const langKey = localeToTranslationCode[locale as Locale];
    if (langKey && LANGUAGES.some(l => l.code === langKey)) {
      setLanguage(langKey);
      localStorage.setItem('oddsflow_language', langKey);
    }
  }, [locale]);

  const menuItems = [
    { id: 'profile' as MenuSection, label: t('profile'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'subscription' as MenuSection, label: t('subscription'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { id: 'calculator' as MenuSection, label: t('profitCalculator'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'settings' as MenuSection, label: t('settings'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
      </div>

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

              <Link href={localePath('/dashboard')} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-emerald-500/30 hover:bg-white/10 transition-all cursor-pointer">
                {getAvatarUrl() ? (
                  <img src={getAvatarUrl()!} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-emerald-400 hidden sm:block">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
              </Link>

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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
              {/* World Cup Special Entry */}
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
                { href: localePath('/dashboard'), label: t('profile'), active: true },
              ].map((link) => (
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
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-24 md:pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-6">
            {/* Left Sidebar Menu - Hidden on mobile */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 rounded-2xl border border-white/10 p-4 sticky top-24">
                {/* User Mini Profile */}
                <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-white/5">
                  {getAvatarUrl() ? (
                    <img src={getAvatarUrl()!} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                      {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                        activeSection === item.id
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Sign Out Button */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">{t('signOut')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 min-w-0">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">{t('profile')}</h1>

                  <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 rounded-2xl border border-white/10 p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Avatar */}
                      <div className="relative">
                        {getAvatarUrl() ? (
                          <img
                            src={getAvatarUrl()!}
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500/30"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-black">
                            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#0d1117]" />
                      </div>

                      {/* User Info */}
                      <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-bold mb-1">
                          {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                        </h2>
                        <p className="text-gray-400 mb-3">{user?.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                            {subscription?.package_name || 'Free User'}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
                            Joined {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 rounded-xl bg-white/5 min-w-[100px]">
                          <p className="text-2xl font-bold text-emerald-400">{subscription?.leagues_allowed || 0}</p>
                          <p className="text-xs text-gray-400">{t('leaguesAllowed')}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/5 min-w-[100px]">
                          <p className="text-2xl font-bold text-cyan-400">{getDaysRemaining()}</p>
                          <p className="text-xs text-gray-400">{t('daysLeft')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-semibold mb-4">{t('quickActions')}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Link href={localePath('/predictions')} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold">{t('predictions')}</p>
                          <p className="text-gray-400 text-sm">{t('todaysPicks')}</p>
                        </div>
                      </Link>

                      <Link href={localePath('/leagues')} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold">{t('leagues')}</p>
                          <p className="text-gray-400 text-sm">{t('browseAll')}</p>
                        </div>
                      </Link>

                      <Link href={localePath('/performance')} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold">{t('performance')}</p>
                          <p className="text-gray-400 text-sm">{t('trackStats')}</p>
                        </div>
                      </Link>

                      <Link href={localePath('/pricing')} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-yellow-500/10 border border-transparent hover:border-yellow-500/20 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold">{t('pricing')}</p>
                          <p className="text-gray-400 text-sm">{t('viewPlans')}</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Section */}
              {activeSection === 'subscription' && (
                <div className="space-y-4">
                  <h1 className="text-xl font-bold">{t('subscription')}</h1>

                  {subscription ? (
                    <div className="space-y-4">
                      {/* Premium Plan Card - Compact */}
                      <div className={`group relative rounded-2xl overflow-hidden p-[1px]`}>
                        {/* Animated Border Gradient */}
                        <div className={`absolute inset-0 rounded-2xl ${
                          subscription.package_type === 'ultimate'
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 via-yellow-400 to-purple-500 animate-gradient bg-[length:400%_400%]'
                            : subscription.package_type === 'pro'
                            ? 'bg-gradient-to-r from-blue-500 via-cyan-400 via-blue-400 to-blue-500 animate-gradient bg-[length:400%_400%]'
                            : subscription.package_type === 'starter'
                            ? 'bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 animate-gradient bg-[length:400%_400%]'
                            : 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600'
                        }`} />

                        {/* Card Content */}
                        <div className="relative bg-[#0d1117] rounded-2xl p-5 overflow-hidden">
                          {/* Subtle Background Glow */}
                          <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-20 ${
                            subscription.package_type === 'ultimate' ? 'bg-purple-500' :
                            subscription.package_type === 'pro' ? 'bg-blue-500' :
                            subscription.package_type === 'starter' ? 'bg-cyan-500' : 'bg-gray-500'
                          }`} />

                          {/* Plan Header - Compact */}
                          <div className="relative flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                              {/* Plan Icon - Smaller */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                                subscription.package_type === 'ultimate'
                                  ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30'
                                  : subscription.package_type === 'pro'
                                  ? 'bg-gradient-to-br from-blue-500/30 to-cyan-500/30'
                                  : subscription.package_type === 'starter'
                                  ? 'bg-gradient-to-br from-cyan-500/30 to-teal-500/30'
                                  : 'bg-gradient-to-br from-gray-500/30 to-gray-600/30'
                              }`}>
                                {subscription.package_type === 'ultimate' ? '👑' :
                                 subscription.package_type === 'pro' ? '⚡' :
                                 subscription.package_type === 'starter' ? '🚀' : '🎯'}
                              </div>
                              <div>
                                <h2 className={`text-xl font-bold ${
                                  subscription.package_type === 'ultimate'
                                    ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent'
                                    : subscription.package_type === 'pro'
                                    ? 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'
                                    : subscription.package_type === 'starter'
                                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent'
                                    : 'text-gray-300'
                                }`}>
                                  {subscription.package_name}
                                </h2>
                                <div className="flex items-baseline gap-1">
                                  <span className={`text-lg font-bold ${
                                    subscription.package_type === 'ultimate' ? 'text-purple-400' :
                                    subscription.package_type === 'pro' ? 'text-blue-400' :
                                    subscription.package_type === 'starter' ? 'text-cyan-400' : 'text-gray-400'
                                  }`}>
                                    ${subscription.price}
                                  </span>
                                  <span className="text-gray-500 text-sm">/month</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge - Smaller */}
                            <div className={`relative px-3 py-1 rounded-full font-medium text-xs overflow-hidden ${
                              subscription.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              <span className="relative flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  subscription.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                                }`} />
                                {subscription.status === 'active' ? 'Active' : 'Expired'}
                              </span>
                            </div>
                          </div>

                          {/* Features Grid - Compact */}
                          <div className="relative grid grid-cols-4 gap-3 mb-5">
                            <div className={`p-3 rounded-xl ${
                              subscription.package_type === 'ultimate' ? 'bg-purple-500/10 border border-purple-500/20' :
                              subscription.package_type === 'pro' ? 'bg-blue-500/10 border border-blue-500/20' :
                              'bg-white/5 border border-white/10'
                            }`}>
                              <p className="text-gray-400 text-xs mb-1">Leagues</p>
                              <p className={`text-2xl font-bold ${
                                subscription.package_type === 'ultimate' ? 'text-purple-400' :
                                subscription.package_type === 'pro' ? 'text-blue-400' :
                                subscription.package_type === 'starter' ? 'text-cyan-400' : 'text-white'
                              }`}>{subscription.leagues_allowed}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${
                              subscription.package_type === 'ultimate' ? 'bg-pink-500/10 border border-pink-500/20' :
                              subscription.package_type === 'pro' ? 'bg-cyan-500/10 border border-cyan-500/20' :
                              'bg-white/5 border border-white/10'
                            }`}>
                              <p className="text-gray-400 text-xs mb-1">Styles</p>
                              <p className={`text-2xl font-bold ${
                                subscription.package_type === 'ultimate' ? 'text-pink-400' :
                                subscription.package_type === 'pro' ? 'text-cyan-400' : 'text-white'
                              }`}>{subscription.betting_styles_allowed}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <p className="text-gray-400 text-xs mb-1">Start</p>
                              <p className="text-sm font-medium text-white">{new Date(subscription.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                              <p className="text-gray-400 text-xs mb-1">End</p>
                              <p className="text-sm font-medium text-white">{new Date(subscription.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                            </div>
                          </div>

                          {/* Time Remaining Progress - Compact */}
                          <div className="relative p-3 rounded-xl bg-white/5 border border-white/10 mb-5">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-400 text-xs">Time Remaining</span>
                              <span className={`text-sm font-bold ${
                                getDaysRemaining() > 14
                                  ? subscription.package_type === 'ultimate' ? 'text-purple-400' :
                                    subscription.package_type === 'pro' ? 'text-blue-400' : 'text-emerald-400'
                                  : getDaysRemaining() > 7 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {getDaysRemaining()} days
                              </span>
                            </div>
                            <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${
                                  subscription.package_type === 'ultimate'
                                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400'
                                    : subscription.package_type === 'pro'
                                    ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400'
                                    : subscription.package_type === 'starter'
                                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400'
                                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                                }`}
                                style={{ width: `${Math.min(100, (getDaysRemaining() / 30) * 100)}%` }}
                              >
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons - Smaller */}
                          <div className="relative flex gap-3">
                            <Link
                              href={localePath('/pricing')}
                              className={`group/btn flex-1 relative py-2.5 rounded-xl font-semibold text-center text-sm overflow-hidden transition-all hover:shadow-lg ${
                                subscription.package_type === 'ultimate'
                                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-black hover:shadow-purple-500/20'
                                  : subscription.package_type === 'pro'
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-black hover:shadow-blue-500/20'
                                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:shadow-emerald-500/20'
                              }`}
                            >
                              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                              <span className="relative">
                                {subscription.package_type === 'ultimate' ? 'Manage Plan' : 'Upgrade Plan'}
                              </span>
                            </Link>
                            <button
                              onClick={() => alert('Cancel subscription feature coming soon!')}
                              className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Benefits Section - Compact */}
                      {subscription.package_type !== 'free_trial' && (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-semibold">AI Predictions</p>
                                <p className="text-gray-500 text-[10px]">Premium picks</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-semibold">Live Odds</p>
                                <p className="text-gray-500 text-[10px]">Real-time</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-semibold">Support</p>
                                <p className="text-gray-500 text-[10px]">24/7 help</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 rounded-xl border border-white/10 p-6">
                      <div className="text-center py-8">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                          <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to unlock premium features</p>
                        <Link
                          href={localePath('/pricing')}
                          className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                        >
                          Subscribe Now
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profit Calculator Section */}
              {activeSection === 'calculator' && (
                <div className="space-y-4">
                  <h1 className="text-xl font-bold">{t('profitCalculator')}</h1>

                  {/* Calculator Card with Animated Border */}
                  <div className="group relative rounded-2xl overflow-hidden p-[1px]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 animate-gradient bg-[length:400%_400%]" />

                    <div className="relative bg-[#0d1117] rounded-2xl p-5 overflow-hidden">
                      {/* Background Glow */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-20 bg-emerald-500" />
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[80px] opacity-15 bg-cyan-500" />

                      <div className="relative space-y-5">
                        {/* Odds Format Selector */}
                        <div>
                          <label className="text-gray-400 text-xs mb-2 block font-medium">Odds Format</label>
                          <div className="flex gap-2">
                            {(['decimal', 'american', 'fractional'] as const).map((format) => (
                              <button
                                key={format}
                                onClick={() => setOddsFormat(format)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                  oddsFormat === format
                                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                }`}
                              >
                                {format.charAt(0).toUpperCase() + format.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Inputs Row */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Bet Amount Input */}
                          <div>
                            <label className="text-gray-400 text-xs mb-2 block font-medium">Bet Amount ($)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">$</span>
                              <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 text-white text-lg font-semibold transition-all"
                                placeholder="100"
                              />
                            </div>
                          </div>

                          {/* Odds Input */}
                          <div>
                            <label className="text-gray-400 text-xs mb-2 block font-medium">
                              Odds ({oddsFormat === 'decimal' ? '1.85' : oddsFormat === 'american' ? '+150' : '5/4'})
                            </label>
                            <input
                              type="text"
                              value={odds}
                              onChange={(e) => setOdds(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-white text-lg font-semibold transition-all"
                              placeholder="1.85"
                            />
                          </div>
                        </div>

                        {/* Results - Premium Style */}
                        <div className="relative p-[1px] rounded-2xl overflow-hidden">
                          <div className={`absolute inset-0 rounded-2xl ${
                            parseFloat(profitData.profit) >= 0
                              ? 'bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-emerald-500/50'
                              : 'bg-gradient-to-r from-red-500/50 via-orange-500/50 to-red-500/50'
                          }`} />

                          <div className="relative bg-[#0a0a0f] rounded-2xl p-5">
                            {/* Profit Highlight */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                              <div>
                                <p className="text-gray-400 text-xs mb-1">If you win, you profit</p>
                                <p className={`text-4xl font-black ${
                                  parseFloat(profitData.profit) >= 0
                                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'
                                    : 'text-red-400'
                                }`}>
                                  {parseFloat(profitData.profit) >= 0 ? '+' : ''}${profitData.profit}
                                </p>
                              </div>
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                                parseFloat(profitData.profit) >= 0
                                  ? 'bg-emerald-500/20'
                                  : 'bg-red-500/20'
                              }`}>
                                {parseFloat(profitData.profit) >= 0 ? (
                                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                ) : (
                                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                  </svg>
                                )}
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-3 rounded-xl bg-white/5">
                                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Stake</p>
                                <p className="text-lg font-bold text-white">${profitData.stake.toFixed(2)}</p>
                              </div>
                              <div className="text-center p-3 rounded-xl bg-white/5">
                                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Odds</p>
                                <p className="text-lg font-bold text-white">{profitData.decimalOdds}</p>
                              </div>
                              <div className="text-center p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Return</p>
                                <p className="text-lg font-bold text-cyan-400">${profitData.potentialReturn}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ROI Info */}
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>ROI: {((parseFloat(profitData.profit) / profitData.stake) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Section */}
              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">{t('settings')}</h1>

                  <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 rounded-2xl border border-white/10 p-6">
                    <div className="space-y-6">
                      {/* Account Settings */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">{t('account')}</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                              <p className="font-medium">{t('email')}</p>
                              <p className="text-gray-400 text-sm">{user?.email}</p>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium hover:bg-white/20 transition-all cursor-pointer">
                              {t('change')}
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                              <p className="font-medium">{t('password')}</p>
                              <p className="text-gray-400 text-sm">••••••••</p>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium hover:bg-white/20 transition-all cursor-pointer">
                              {t('change')}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Notifications */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">{t('notifications')}</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                              <p className="font-medium">{t('emailNotifications')}</p>
                              <p className="text-gray-400 text-sm">{t('receiveAlerts')}</p>
                            </div>
                            <button className="w-12 h-6 rounded-full bg-emerald-500 relative cursor-pointer">
                              <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-all" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div>
                              <p className="font-medium">{t('pushNotifications')}</p>
                              <p className="text-gray-400 text-sm">{t('browserNotifications')}</p>
                            </div>
                            <button className="w-12 h-6 rounded-full bg-gray-600 relative cursor-pointer">
                              <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-red-400">{t('dangerZone')}</h3>
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-red-400">{t('deleteAccount')}</p>
                              <p className="text-gray-400 text-sm">{t('deleteAccountDesc')}</p>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all cursor-pointer">
                              {t('delete')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around py-2 px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                activeSection === item.id
                  ? 'text-emerald-400'
                  : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </button>
          ))}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-red-400 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-[10px] font-medium">{t('signOut')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
