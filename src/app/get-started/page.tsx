'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, signUpWithEmail, signInWithGoogle, createFreeTrialSubscription, validatePassword, getSafeErrorMessage } from '@/lib/supabase';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'tw', label: '繁體', flag: '🇹🇼' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    predictions: 'Predictions',
    leagues: 'Leagues',
    aiPerformance: 'AI Performance',
    community: 'Community',
    news: 'News',
    pricing: 'Pricing',
    solution: 'Solution',
    fifa2026: 'FIFA 2026',
    login: 'Log In',
    getStarted: 'Get Started',
    createAccount: 'Create your free account today',
    freeTrialIncluded: '7-day Free Trial included',
    fullName: 'Full Name',
    enterName: 'Enter your name',
    email: 'Email',
    enterEmail: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Min 8 chars, uppercase, lowercase, number',
    agreeTo: 'I agree to the',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    createAccountBtn: 'Create Account',
    creatingAccount: 'Creating Account...',
    orContinueWith: 'or continue with',
    continueWithGoogle: 'Continue with Google',
    signingIn: 'Signing in...',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign in',
    freeTrialIncludes: 'Your Free Trial includes:',
    accessToLeague: 'Access to 1 league of your choice',
    oneBettingStyle: '1 betting style (Moneyline, Handicap, or Over/Under)',
    sevenDaysAccess: '7 days of full access',
    noCreditCard: 'No credit card required',
    accountCreated: 'Account created successfully! Please check your email to verify your account.',
    unexpectedError: 'An unexpected error occurred. Please try again.',
    googleError: 'Failed to sign in with Google. Please try again.',
  },
  es: {
    home: 'Inicio',
    predictions: 'Predicciones',
    leagues: 'Ligas',
    aiPerformance: 'Rendimiento IA',
    community: 'Comunidad',
    news: 'Noticias',
    pricing: 'Precios',
    solution: 'Solución',
    fifa2026: 'FIFA 2026',
    login: 'Iniciar sesión',
    getStarted: 'Comenzar',
    createAccount: 'Crea tu cuenta gratis hoy',
    freeTrialIncluded: 'Prueba gratuita de 7 días incluida',
    fullName: 'Nombre completo',
    enterName: 'Ingresa tu nombre',
    email: 'Correo electrónico',
    enterEmail: 'Ingresa tu correo electrónico',
    password: 'Contraseña',
    passwordPlaceholder: 'Mín 8 caracteres, mayúscula, minúscula, número',
    agreeTo: 'Acepto los',
    termsOfService: 'Términos de servicio',
    and: 'y',
    privacyPolicy: 'Política de privacidad',
    createAccountBtn: 'Crear cuenta',
    creatingAccount: 'Creando cuenta...',
    orContinueWith: 'o continuar con',
    continueWithGoogle: 'Continuar con Google',
    signingIn: 'Iniciando sesión...',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    signIn: 'Iniciar sesión',
    freeTrialIncludes: 'Tu prueba gratuita incluye:',
    accessToLeague: 'Acceso a 1 liga de tu elección',
    oneBettingStyle: '1 estilo de apuesta (Moneyline, Handicap, o Over/Under)',
    sevenDaysAccess: '7 días de acceso completo',
    noCreditCard: 'No se requiere tarjeta de crédito',
    accountCreated: '¡Cuenta creada! Por favor revisa tu correo para verificar tu cuenta.',
    unexpectedError: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
    googleError: 'Error al iniciar sesión con Google. Por favor intenta de nuevo.',
  },
  pt: {
    home: 'Início',
    predictions: 'Previsões',
    leagues: 'Ligas',
    aiPerformance: 'Desempenho IA',
    community: 'Comunidade',
    news: 'Notícias',
    pricing: 'Preços',
    solution: 'Solução',
    fifa2026: 'FIFA 2026',
    login: 'Entrar',
    getStarted: 'Começar',
    createAccount: 'Crie sua conta grátis hoje',
    freeTrialIncluded: 'Teste gratuito de 7 dias incluído',
    fullName: 'Nome completo',
    enterName: 'Digite seu nome',
    email: 'E-mail',
    enterEmail: 'Digite seu e-mail',
    password: 'Senha',
    passwordPlaceholder: 'Mín 8 caracteres, maiúscula, minúscula, número',
    agreeTo: 'Eu concordo com os',
    termsOfService: 'Termos de Serviço',
    and: 'e',
    privacyPolicy: 'Política de Privacidade',
    createAccountBtn: 'Criar Conta',
    creatingAccount: 'Criando conta...',
    orContinueWith: 'ou continuar com',
    continueWithGoogle: 'Continuar com Google',
    signingIn: 'Entrando...',
    alreadyHaveAccount: 'Já tem uma conta?',
    signIn: 'Entrar',
    freeTrialIncludes: 'Seu teste gratuito inclui:',
    accessToLeague: 'Acesso a 1 liga de sua escolha',
    oneBettingStyle: '1 estilo de aposta (Moneyline, Handicap ou Over/Under)',
    sevenDaysAccess: '7 dias de acesso completo',
    noCreditCard: 'Não requer cartão de crédito',
    accountCreated: 'Conta criada! Por favor verifique seu e-mail para confirmar sua conta.',
    unexpectedError: 'Ocorreu um erro inesperado. Por favor tente novamente.',
    googleError: 'Falha ao entrar com Google. Por favor tente novamente.',
  },
  de: {
    home: 'Startseite',
    predictions: 'Vorhersagen',
    leagues: 'Ligen',
    aiPerformance: 'KI-Leistung',
    community: 'Gemeinschaft',
    news: 'Nachrichten',
    pricing: 'Preise',
    solution: 'Lösung',
    fifa2026: 'FIFA 2026',
    login: 'Anmelden',
    getStarted: 'Loslegen',
    createAccount: 'Erstellen Sie noch heute Ihr kostenloses Konto',
    freeTrialIncluded: '7-tägige kostenlose Testversion inklusive',
    fullName: 'Vollständiger Name',
    enterName: 'Geben Sie Ihren Namen ein',
    email: 'E-Mail',
    enterEmail: 'Geben Sie Ihre E-Mail ein',
    password: 'Passwort',
    passwordPlaceholder: 'Min 8 Zeichen, Großbuchstabe, Kleinbuchstabe, Zahl',
    agreeTo: 'Ich stimme den',
    termsOfService: 'Nutzungsbedingungen',
    and: 'und',
    privacyPolicy: 'Datenschutzrichtlinie',
    createAccountBtn: 'Konto erstellen',
    creatingAccount: 'Konto wird erstellt...',
    orContinueWith: 'oder weiter mit',
    continueWithGoogle: 'Mit Google fortfahren',
    signingIn: 'Anmeldung läuft...',
    alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
    signIn: 'Anmelden',
    freeTrialIncludes: 'Ihre kostenlose Testversion beinhaltet:',
    accessToLeague: 'Zugang zu 1 Liga Ihrer Wahl',
    oneBettingStyle: '1 Wettstil (Moneyline, Handicap oder Over/Under)',
    sevenDaysAccess: '7 Tage voller Zugang',
    noCreditCard: 'Keine Kreditkarte erforderlich',
    accountCreated: 'Konto erstellt! Bitte überprüfen Sie Ihre E-Mail zur Verifizierung.',
    unexpectedError: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    googleError: 'Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
  },
  fr: {
    home: 'Accueil',
    predictions: 'Prédictions',
    leagues: 'Ligues',
    aiPerformance: 'Performance IA',
    community: 'Communauté',
    news: 'Actualités',
    pricing: 'Tarifs',
    solution: 'Solution',
    fifa2026: 'FIFA 2026',
    login: 'Connexion',
    getStarted: 'Commencer',
    createAccount: 'Créez votre compte gratuit aujourd\'hui',
    freeTrialIncluded: 'Essai gratuit de 7 jours inclus',
    fullName: 'Nom complet',
    enterName: 'Entrez votre nom',
    email: 'E-mail',
    enterEmail: 'Entrez votre e-mail',
    password: 'Mot de passe',
    passwordPlaceholder: 'Min 8 caractères, majuscule, minuscule, chiffre',
    agreeTo: 'J\'accepte les',
    termsOfService: 'Conditions d\'utilisation',
    and: 'et',
    privacyPolicy: 'Politique de confidentialité',
    createAccountBtn: 'Créer un compte',
    creatingAccount: 'Création du compte...',
    orContinueWith: 'ou continuer avec',
    continueWithGoogle: 'Continuer avec Google',
    signingIn: 'Connexion en cours...',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    signIn: 'Se connecter',
    freeTrialIncludes: 'Votre essai gratuit comprend:',
    accessToLeague: 'Accès à 1 ligue de votre choix',
    oneBettingStyle: '1 style de pari (Moneyline, Handicap ou Over/Under)',
    sevenDaysAccess: '7 jours d\'accès complet',
    noCreditCard: 'Pas de carte de crédit requise',
    accountCreated: 'Compte créé! Veuillez vérifier votre e-mail pour confirmer votre compte.',
    unexpectedError: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    googleError: 'Échec de la connexion Google. Veuillez réessayer.',
  },
  ja: {
    home: 'ホーム',
    predictions: '予測',
    leagues: 'リーグ',
    aiPerformance: 'AI性能',
    community: 'コミュニティ',
    news: 'ニュース',
    pricing: '料金',
    solution: 'ソリューション',
    fifa2026: 'FIFA 2026',
    login: 'ログイン',
    getStarted: '始める',
    createAccount: '今すぐ無料アカウントを作成',
    freeTrialIncluded: '7日間無料トライアル付き',
    fullName: 'フルネーム',
    enterName: 'お名前を入力',
    email: 'メール',
    enterEmail: 'メールアドレスを入力',
    password: 'パスワード',
    passwordPlaceholder: '8文字以上、大文字、小文字、数字を含む',
    agreeTo: '同意します：',
    termsOfService: '利用規約',
    and: 'と',
    privacyPolicy: 'プライバシーポリシー',
    createAccountBtn: 'アカウント作成',
    creatingAccount: 'アカウント作成中...',
    orContinueWith: 'または以下で続行',
    continueWithGoogle: 'Googleで続行',
    signingIn: 'サインイン中...',
    alreadyHaveAccount: 'すでにアカウントをお持ちですか？',
    signIn: 'サインイン',
    freeTrialIncludes: '無料トライアルには以下が含まれます：',
    accessToLeague: 'お好みの1リーグへのアクセス',
    oneBettingStyle: '1つのベッティングスタイル（Moneyline、Handicap、またはOver/Under）',
    sevenDaysAccess: '7日間のフルアクセス',
    noCreditCard: 'クレジットカード不要',
    accountCreated: 'アカウントが作成されました！メールを確認して認証してください。',
    unexpectedError: '予期しないエラーが発生しました。もう一度お試しください。',
    googleError: 'Googleサインインに失敗しました。もう一度お試しください。',
  },
  ko: {
    home: '홈',
    predictions: '예측',
    leagues: '리그',
    aiPerformance: 'AI 성능',
    community: '커뮤니티',
    news: '뉴스',
    pricing: '가격',
    solution: '솔루션',
    fifa2026: 'FIFA 2026',
    login: '로그인',
    getStarted: '시작하기',
    createAccount: '오늘 무료 계정을 만드세요',
    freeTrialIncluded: '7일 무료 체험 포함',
    fullName: '이름',
    enterName: '이름을 입력하세요',
    email: '이메일',
    enterEmail: '이메일을 입력하세요',
    password: '비밀번호',
    passwordPlaceholder: '최소 8자, 대문자, 소문자, 숫자 포함',
    agreeTo: '동의합니다:',
    termsOfService: '서비스 약관',
    and: '및',
    privacyPolicy: '개인정보 처리방침',
    createAccountBtn: '계정 만들기',
    creatingAccount: '계정 생성 중...',
    orContinueWith: '또는 계속하기',
    continueWithGoogle: 'Google로 계속하기',
    signingIn: '로그인 중...',
    alreadyHaveAccount: '이미 계정이 있으신가요?',
    signIn: '로그인',
    freeTrialIncludes: '무료 체험에 포함된 내용:',
    accessToLeague: '원하는 리그 1개 접근',
    oneBettingStyle: '1가지 베팅 스타일 (Moneyline, Handicap 또는 Over/Under)',
    sevenDaysAccess: '7일간 전체 접근',
    noCreditCard: '신용카드 필요 없음',
    accountCreated: '계정이 생성되었습니다! 이메일을 확인하여 인증해주세요.',
    unexpectedError: '예기치 않은 오류가 발생했습니다. 다시 시도해주세요.',
    googleError: 'Google 로그인에 실패했습니다. 다시 시도해주세요.',
  },
  zh: {
    home: '首页',
    predictions: '预测',
    leagues: '联赛',
    aiPerformance: 'AI表现',
    community: '社区',
    news: '新闻',
    pricing: '价格',
    solution: '解决方案',
    fifa2026: 'FIFA 2026',
    login: '登录',
    getStarted: '开始',
    createAccount: '今天创建您的免费账户',
    freeTrialIncluded: '包含7天免费试用',
    fullName: '全名',
    enterName: '输入您的姓名',
    email: '电子邮件',
    enterEmail: '输入您的电子邮件',
    password: '密码',
    passwordPlaceholder: '至少8个字符，包含大写、小写和数字',
    agreeTo: '我同意',
    termsOfService: '服务条款',
    and: '和',
    privacyPolicy: '隐私政策',
    createAccountBtn: '创建账户',
    creatingAccount: '正在创建账户...',
    orContinueWith: '或使用以下方式继续',
    continueWithGoogle: '使用Google继续',
    signingIn: '正在登录...',
    alreadyHaveAccount: '已有账户？',
    signIn: '登录',
    freeTrialIncludes: '您的免费试用包括：',
    accessToLeague: '访问1个您选择的联赛',
    oneBettingStyle: '1种投注风格（Moneyline、Handicap或Over/Under）',
    sevenDaysAccess: '7天完整访问',
    noCreditCard: '无需信用卡',
    accountCreated: '账户创建成功！请检查您的邮箱验证账户。',
    unexpectedError: '发生意外错误。请重试。',
    googleError: 'Google登录失败。请重试。',
  },
  tw: {
    home: '首頁',
    predictions: '預測',
    leagues: '聯賽',
    aiPerformance: 'AI表現',
    community: '社區',
    news: '新聞',
    pricing: '價格',
    solution: '解決方案',
    fifa2026: 'FIFA 2026',
    login: '登入',
    getStarted: '開始',
    createAccount: '今天創建您的免費帳戶',
    freeTrialIncluded: '包含7天免費試用',
    fullName: '全名',
    enterName: '輸入您的姓名',
    email: '電子郵件',
    enterEmail: '輸入您的電子郵件',
    password: '密碼',
    passwordPlaceholder: '至少8個字符，包含大寫、小寫和數字',
    agreeTo: '我同意',
    termsOfService: '服務條款',
    and: '和',
    privacyPolicy: '隱私政策',
    createAccountBtn: '創建帳戶',
    creatingAccount: '正在創建帳戶...',
    orContinueWith: '或使用以下方式繼續',
    continueWithGoogle: '使用Google繼續',
    signingIn: '正在登入...',
    alreadyHaveAccount: '已有帳戶？',
    signIn: '登入',
    freeTrialIncludes: '您的免費試用包括：',
    accessToLeague: '訪問1個您選擇的聯賽',
    oneBettingStyle: '1種投注風格（Moneyline、Handicap或Over/Under）',
    sevenDaysAccess: '7天完整訪問',
    noCreditCard: '無需信用卡',
    accountCreated: '帳戶創建成功！請檢查您的郵箱驗證帳戶。',
    unexpectedError: '發生意外錯誤。請重試。',
    googleError: 'Google登入失敗。請重試。',
  },
  id: {
    home: 'Beranda',
    predictions: 'Prediksi',
    leagues: 'Liga',
    aiPerformance: 'Performa AI',
    community: 'Komunitas',
    news: 'Berita',
    pricing: 'Harga',
    solution: 'Solusi',
    fifa2026: 'FIFA 2026',
    login: 'Masuk',
    getStarted: 'Mulai',
    createAccount: 'Buat akun gratis Anda hari ini',
    freeTrialIncluded: 'Termasuk uji coba gratis 7 hari',
    fullName: 'Nama Lengkap',
    enterName: 'Masukkan nama Anda',
    email: 'Email',
    enterEmail: 'Masukkan email Anda',
    password: 'Kata Sandi',
    passwordPlaceholder: 'Min 8 karakter, huruf besar, huruf kecil, angka',
    agreeTo: 'Saya setuju dengan',
    termsOfService: 'Ketentuan Layanan',
    and: 'dan',
    privacyPolicy: 'Kebijakan Privasi',
    createAccountBtn: 'Buat Akun',
    creatingAccount: 'Membuat akun...',
    orContinueWith: 'atau lanjutkan dengan',
    continueWithGoogle: 'Lanjutkan dengan Google',
    signingIn: 'Masuk...',
    alreadyHaveAccount: 'Sudah punya akun?',
    signIn: 'Masuk',
    freeTrialIncludes: 'Uji coba gratis Anda termasuk:',
    accessToLeague: 'Akses ke 1 liga pilihan Anda',
    oneBettingStyle: '1 gaya taruhan (Moneyline, Handicap, atau Over/Under)',
    sevenDaysAccess: '7 hari akses penuh',
    noCreditCard: 'Tidak perlu kartu kredit',
    accountCreated: 'Akun berhasil dibuat! Silakan periksa email untuk verifikasi akun Anda.',
    unexpectedError: 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
    googleError: 'Gagal masuk dengan Google. Silakan coba lagi.',
  },
};

export default function GetStartedPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Language and UI state
  const [language, setLanguage] = useState('en');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const t = translations[language] || translations.en;
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSetLang = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem('oddsflow_language', newLang);
    setLangDropdownOpen(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) {
      const validation = validatePassword(newPassword);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate password before submission
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.errors[0]);
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await signUpWithEmail(email, password, name);

      if (signUpError) {
        setError(getSafeErrorMessage(signUpError));
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Create free trial subscription
        const { error: subError } = await createFreeTrialSubscription(data.user.id, email);

        if (subError) {
          console.error('Subscription error:', subError);
          // Don't block signup if subscription creation fails
        }

        setSuccess(t.accountCreated);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError(t.unexpectedError);
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
      setError(t.googleError);
      console.error(err);
    }

    setLoading(false);
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.home}</Link>
              <Link href="/predictions" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.predictions}</Link>
              <Link href="/leagues" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.leagues}</Link>
              <Link href="/performance" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.aiPerformance}</Link>
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.community}</Link>
              <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.news}</Link>
              <Link href="/solution" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.solution}</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.pricing}</Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium cursor-pointer"
                >
                  <span>{currentLang.flag}</span>
                  <span className="hidden sm:inline">{currentLang.label}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSetLang(lang.code)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer ${language === lang.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'}`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* FIFA 2026 Button */}
              <Link
                href="/worldcup"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-all text-sm font-medium"
              >
                <span>⚽</span>
                <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent font-bold">{t.fifa2026}</span>
              </Link>

              <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t.login}</Link>
              <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer hidden sm:block">{t.getStarted}</Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.home}</Link>
                <Link href="/predictions" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.predictions}</Link>
                <Link href="/leagues" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.leagues}</Link>
                <Link href="/performance" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.aiPerformance}</Link>
                <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.community}</Link>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.news}</Link>
                <Link href="/solution" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.solution}</Link>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t.pricing}</Link>
                <Link
                  href="/worldcup"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-sm font-medium w-fit"
                >
                  <span>⚽</span>
                  <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent font-bold">{t.fifa2026}</span>
                </Link>
                <div className="flex gap-3 pt-2">
                  <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium cursor-pointer">{t.login}</Link>
                  <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm cursor-pointer">{t.getStarted}</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t.getStarted}
              </span>
            </h1>
            <p className="text-gray-400">{t.createAccount}</p>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 text-sm font-medium">{t.freeTrialIncluded}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 p-8">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                  placeholder={t.enterName}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  {t.email}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                  placeholder={t.enterEmail}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  {t.password}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                  placeholder={t.passwordPlaceholder}
                  required
                  minLength={8}
                  disabled={loading}
                />
                {passwordErrors.length > 0 && (
                  <div className="mt-2 text-xs text-amber-400">
                    {passwordErrors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 mt-1 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer" required />
                  <span className="text-sm text-gray-400">
                    {t.agreeTo}{' '}
                    <Link href="/terms-of-service" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                      {t.termsOfService}
                    </Link>
                    {' '}{t.and}{' '}
                    <Link href="/privacy-policy" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                      {t.privacyPolicy}
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.creatingAccount : t.createAccountBtn}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">{t.orContinueWith}</span>
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
              {loading ? t.signingIn : t.continueWithGoogle}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {t.alreadyHaveAccount}{' '}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  {t.signIn}
                </Link>
              </p>
            </div>
          </div>

          {/* Free Trial Info */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <h3 className="text-white font-semibold mb-2">{t.freeTrialIncludes}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t.accessToLeague}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t.oneBettingStyle}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t.sevenDaysAccess}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t.noCreditCard}
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
