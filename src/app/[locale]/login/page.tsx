'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase, signInWithEmail, signInWithGoogle } from '@/lib/supabase';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";

const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", solution: "Solution",
    login: "Log In", getStarted: "Get Started",
    welcomeBack: "Welcome Back", signInAccount: "Sign in to your account",
    email: "Email", password: "Password", enterEmail: "Enter your email", enterPassword: "Enter your password",
    rememberMe: "Remember me", forgotPassword: "Forgot password?",
    signIn: "Sign In", signingIn: "Signing in...",
    orContinueWith: "or continue with", continueGoogle: "Continue with Google",
    noAccount: "Don't have an account?", signUp: "Sign up",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", pricing: "价格", solution: "解决方案",
    login: "登录", getStarted: "开始",
    welcomeBack: "欢迎回来", signInAccount: "登录您的账户",
    email: "邮箱", password: "密码", enterEmail: "输入您的邮箱", enterPassword: "输入您的密码",
    rememberMe: "记住我", forgotPassword: "忘记密码？",
    signIn: "登录", signingIn: "登录中...",
    orContinueWith: "或继续使用", continueGoogle: "使用 Google 登录",
    noAccount: "还没有账户？", signUp: "注册",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社區", news: "新聞", pricing: "價格", solution: "解決方案",
    login: "登入", getStarted: "開始",
    welcomeBack: "歡迎回來", signInAccount: "登入您的帳戶",
    email: "電郵", password: "密碼", enterEmail: "輸入您的電郵", enterPassword: "輸入您的密碼",
    rememberMe: "記住我", forgotPassword: "忘記密碼？",
    signIn: "登入", signingIn: "登入中...",
    orContinueWith: "或繼續使用", continueGoogle: "使用 Google 登入",
    noAccount: "還沒有帳戶？", signUp: "註冊",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", solution: "Solusi",
    login: "Masuk", getStarted: "Mulai",
    welcomeBack: "Selamat Datang Kembali", signInAccount: "Masuk ke akun Anda",
    email: "Email", password: "Kata Sandi", enterEmail: "Masukkan email Anda", enterPassword: "Masukkan kata sandi Anda",
    rememberMe: "Ingat saya", forgotPassword: "Lupa kata sandi?",
    signIn: "Masuk", signingIn: "Masuk...",
    orContinueWith: "atau lanjutkan dengan", continueGoogle: "Lanjutkan dengan Google",
    noAccount: "Belum punya akun?", signUp: "Daftar",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", pricing: "Precios", solution: "Solución",
    login: "Iniciar Sesión", getStarted: "Empezar",
    welcomeBack: "Bienvenido de Nuevo", signInAccount: "Inicia sesión en tu cuenta",
    email: "Correo", password: "Contraseña", enterEmail: "Ingresa tu correo", enterPassword: "Ingresa tu contraseña",
    rememberMe: "Recuérdame", forgotPassword: "¿Olvidaste tu contraseña?",
    signIn: "Iniciar Sesión", signingIn: "Iniciando sesión...",
    orContinueWith: "o continúa con", continueGoogle: "Continuar con Google",
    noAccount: "¿No tienes cuenta?", signUp: "Regístrate",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Notícias", pricing: "Preços", solution: "Solução",
    login: "Entrar", getStarted: "Começar",
    welcomeBack: "Bem-vindo de Volta", signInAccount: "Entre na sua conta",
    email: "Email", password: "Senha", enterEmail: "Digite seu email", enterPassword: "Digite sua senha",
    rememberMe: "Lembrar de mim", forgotPassword: "Esqueceu a senha?",
    signIn: "Entrar", signingIn: "Entrando...",
    orContinueWith: "ou continue com", continueGoogle: "Continuar com Google",
    noAccount: "Não tem uma conta?", signUp: "Cadastre-se",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", pricing: "Preise", solution: "Lösung",
    login: "Anmelden", getStarted: "Loslegen",
    welcomeBack: "Willkommen zurück", signInAccount: "Melden Sie sich bei Ihrem Konto an",
    email: "E-Mail", password: "Passwort", enterEmail: "E-Mail eingeben", enterPassword: "Passwort eingeben",
    rememberMe: "Angemeldet bleiben", forgotPassword: "Passwort vergessen?",
    signIn: "Anmelden", signingIn: "Anmeldung...",
    orContinueWith: "oder weiter mit", continueGoogle: "Mit Google fortfahren",
    noAccount: "Kein Konto?", signUp: "Registrieren",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", solution: "Solution",
    login: "Connexion", getStarted: "Commencer",
    welcomeBack: "Bon Retour", signInAccount: "Connectez-vous à votre compte",
    email: "Email", password: "Mot de passe", enterEmail: "Entrez votre email", enterPassword: "Entrez votre mot de passe",
    rememberMe: "Se souvenir de moi", forgotPassword: "Mot de passe oublié?",
    signIn: "Se connecter", signingIn: "Connexion...",
    orContinueWith: "ou continuer avec", continueGoogle: "Continuer avec Google",
    noAccount: "Pas de compte?", signUp: "S'inscrire",
  },
  JA: {
    home: "ホーム", predictions: "予想", leagues: "リーグ", performance: "AI性能",
    community: "コミュニティ", news: "ニュース", pricing: "料金", solution: "ソリューション",
    login: "ログイン", getStarted: "始める",
    welcomeBack: "おかえりなさい", signInAccount: "アカウントにログイン",
    email: "メール", password: "パスワード", enterEmail: "メールを入力", enterPassword: "パスワードを入力",
    rememberMe: "ログイン状態を保持", forgotPassword: "パスワードをお忘れですか？",
    signIn: "ログイン", signingIn: "ログイン中...",
    orContinueWith: "または", continueGoogle: "Googleで続ける",
    noAccount: "アカウントをお持ちでない方", signUp: "登録",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성능",
    community: "커뮤니티", news: "뉴스", pricing: "요금", solution: "솔루션",
    login: "로그인", getStarted: "시작하기",
    welcomeBack: "다시 오신 것을 환영합니다", signInAccount: "계정에 로그인",
    email: "이메일", password: "비밀번호", enterEmail: "이메일 입력", enterPassword: "비밀번호 입력",
    rememberMe: "로그인 유지", forgotPassword: "비밀번호 찾기",
    signIn: "로그인", signingIn: "로그인 중...",
    orContinueWith: "또는", continueGoogle: "Google로 계속",
    noAccount: "계정이 없으신가요?", signUp: "가입하기",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const [language, setLanguage] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const t = (key: string) => translations[language]?.[key] || translations['EN'][key] || key;

  const handleSetLang = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem('oddsflow_language', newLang);
    setLangDropdownOpen(false);
  };

  // Check if user is already logged in
  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_language');
    if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
      setLanguage(savedLang);
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push('/');
      } else {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await signInWithEmail(email, password);

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error: googleError } = await signInWithGoogle();

      if (googleError) {
        setError(googleError.message);
      }
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    }

    setLoading(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
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

              {/* Auth buttons */}
              <Link href={localePath('/login')} className="hidden sm:block px-4 py-2 rounded-lg border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-all text-sm font-medium">{t('login')}</Link>
              <Link href={localePath('/get-started')} className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm">{t('getStarted')}</Link>

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

              {[{ href: localePath('/'), label: t('home') }, { href: localePath('/predictions'), label: t('predictions') }, { href: localePath('/leagues'), label: t('leagues') }, { href: localePath('/performance'), label: t('performance') }, { href: localePath('/community'), label: t('community') }, { href: localePath('/news'), label: t('news') }, { href: localePath('/solution'), label: t('solution') }, { href: localePath('/pricing'), label: t('pricing') }].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5">
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                <Link href={localePath('/login')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium">{t('login')}</Link>
                <Link href={localePath('/get-started')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold">{t('getStarted')}</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t('welcomeBack')}
              </span>
            </h1>
            <p className="text-gray-400">{t('signInAccount')}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 p-8">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                  placeholder={t('enterEmail')}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('password')}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                  placeholder={t('enterPassword')}
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer" />
                  <span className="text-sm text-gray-400">{t('rememberMe')}</span>
                </label>
                <Link href={localePath('/forgot-password')} className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                  {t('forgotPassword')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('signingIn') : t('signIn')}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">{t('orContinueWith')}</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-white text-gray-900 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? t('signingIn') : t('continueGoogle')}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {t('noAccount')}{' '}
                <Link href={localePath('/get-started')} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  {t('signUp')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
