'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Cookie consent translations
const cookieTranslations: Record<string, Record<string, string>> = {
  EN: {
    title: 'We use cookies',
    description: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    customize: 'Customize',
    privacyPolicy: 'Privacy Policy',
    necessary: 'Necessary',
    necessaryDesc: 'Required for the website to function properly',
    analytics: 'Analytics',
    analyticsDesc: 'Help us understand how visitors interact with our website',
    marketing: 'Marketing',
    marketingDesc: 'Used to deliver personalized advertisements',
    savePreferences: 'Save Preferences',
  },
  '中文': {
    title: '我们使用 Cookies',
    description: '我们使用 cookies 来增强您的浏览体验、分析网站流量和个性化内容。点击"全部接受"即表示您同意我们使用 cookies。',
    acceptAll: '全部接受',
    rejectAll: '全部拒绝',
    customize: '自定义',
    privacyPolicy: '隐私政策',
    necessary: '必要',
    necessaryDesc: '网站正常运行所必需的',
    analytics: '分析',
    analyticsDesc: '帮助我们了解访客如何与网站互动',
    marketing: '营销',
    marketingDesc: '用于投放个性化广告',
    savePreferences: '保存偏好',
  },
  '繁體': {
    title: '我們使用 Cookies',
    description: '我們使用 cookies 來增強您的瀏覽體驗、分析網站流量和個性化內容。點擊「全部接受」即表示您同意我們使用 cookies。',
    acceptAll: '全部接受',
    rejectAll: '全部拒絕',
    customize: '自訂',
    privacyPolicy: '隱私政策',
    necessary: '必要',
    necessaryDesc: '網站正常運行所必需的',
    analytics: '分析',
    analyticsDesc: '幫助我們了解訪客如何與網站互動',
    marketing: '行銷',
    marketingDesc: '用於投放個性化廣告',
    savePreferences: '儲存偏好',
  },
  ES: {
    title: 'Usamos cookies',
    description: 'Usamos cookies para mejorar tu experiencia de navegacion, analizar el trafico del sitio y personalizar el contenido. Al hacer clic en "Aceptar todo", consientes el uso de cookies.',
    acceptAll: 'Aceptar todo',
    rejectAll: 'Rechazar todo',
    customize: 'Personalizar',
    privacyPolicy: 'Politica de privacidad',
    necessary: 'Necesarias',
    necessaryDesc: 'Requeridas para el funcionamiento del sitio',
    analytics: 'Analiticas',
    analyticsDesc: 'Nos ayudan a entender como interactuan los visitantes',
    marketing: 'Marketing',
    marketingDesc: 'Usadas para mostrar anuncios personalizados',
    savePreferences: 'Guardar preferencias',
  },
  PT: {
    title: 'Usamos cookies',
    description: 'Usamos cookies para melhorar sua experiencia de navegacao, analisar o trafego do site e personalizar o conteudo. Ao clicar em "Aceitar tudo", voce consente o uso de cookies.',
    acceptAll: 'Aceitar tudo',
    rejectAll: 'Rejeitar tudo',
    customize: 'Personalizar',
    privacyPolicy: 'Politica de privacidade',
    necessary: 'Necessarios',
    necessaryDesc: 'Necessarios para o funcionamento do site',
    analytics: 'Analiticos',
    analyticsDesc: 'Nos ajudam a entender como os visitantes interagem',
    marketing: 'Marketing',
    marketingDesc: 'Usados para exibir anuncios personalizados',
    savePreferences: 'Salvar preferencias',
  },
  JA: {
    title: 'Cookieを使用しています',
    description: '当サイトでは、ブラウジング体験の向上、サイトトラフィックの分析、コンテンツのパーソナライズのためにCookieを使用しています。「すべて受け入れる」をクリックすると、Cookieの使用に同意したことになります。',
    acceptAll: 'すべて受け入れる',
    rejectAll: 'すべて拒否',
    customize: 'カスタマイズ',
    privacyPolicy: 'プライバシーポリシー',
    necessary: '必須',
    necessaryDesc: 'ウェブサイトの正常な動作に必要',
    analytics: '分析',
    analyticsDesc: '訪問者がどのように利用しているかを理解するのに役立ちます',
    marketing: 'マーケティング',
    marketingDesc: 'パーソナライズされた広告の配信に使用',
    savePreferences: '設定を保存',
  },
  KO: {
    title: '쿠키를 사용합니다',
    description: '당사는 쿠키를 사용하여 브라우징 경험을 향상시키고, 사이트 트래픽을 분석하며, 콘텐츠를 개인화합니다. "모두 수락"을 클릭하면 쿠키 사용에 동의하게 됩니다.',
    acceptAll: '모두 수락',
    rejectAll: '모두 거부',
    customize: '맞춤 설정',
    privacyPolicy: '개인정보 처리방침',
    necessary: '필수',
    necessaryDesc: '웹사이트가 제대로 작동하는 데 필요',
    analytics: '분석',
    analyticsDesc: '방문자가 웹사이트와 어떻게 상호 작용하는지 이해하는 데 도움',
    marketing: '마케팅',
    marketingDesc: '개인화된 광고를 제공하는 데 사용',
    savePreferences: '설정 저장',
  },
  DE: {
    title: 'Wir verwenden Cookies',
    description: 'Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, den Website-Traffic zu analysieren und Inhalte zu personalisieren. Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung von Cookies zu.',
    acceptAll: 'Alle akzeptieren',
    rejectAll: 'Alle ablehnen',
    customize: 'Anpassen',
    privacyPolicy: 'Datenschutz',
    necessary: 'Notwendig',
    necessaryDesc: 'Erforderlich fur die ordnungsgemasze Funktion der Website',
    analytics: 'Analyse',
    analyticsDesc: 'Helfen uns zu verstehen, wie Besucher unsere Website nutzen',
    marketing: 'Marketing',
    marketingDesc: 'Werden verwendet, um personalisierte Werbung anzuzeigen',
    savePreferences: 'Einstellungen speichern',
  },
  FR: {
    title: 'Nous utilisons des cookies',
    description: 'Nous utilisons des cookies pour ameliorer votre experience de navigation, analyser le trafic du site et personnaliser le contenu. En cliquant sur "Tout accepter", vous consentez a notre utilisation des cookies.',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    customize: 'Personnaliser',
    privacyPolicy: 'Politique de confidentialite',
    necessary: 'Necessaires',
    necessaryDesc: 'Requis pour le bon fonctionnement du site',
    analytics: 'Analytiques',
    analyticsDesc: 'Nous aident a comprendre comment les visiteurs interagissent',
    marketing: 'Marketing',
    marketingDesc: 'Utilises pour diffuser des publicites personnalisees',
    savePreferences: 'Enregistrer les preferences',
  },
  ID: {
    title: 'Kami menggunakan cookie',
    description: 'Kami menggunakan cookie untuk meningkatkan pengalaman browsing Anda, menganalisis traffic situs, dan mempersonalisasi konten. Dengan mengklik "Terima Semua", Anda menyetujui penggunaan cookie kami.',
    acceptAll: 'Terima Semua',
    rejectAll: 'Tolak Semua',
    customize: 'Kustomisasi',
    privacyPolicy: 'Kebijakan Privasi',
    necessary: 'Diperlukan',
    necessaryDesc: 'Diperlukan agar website berfungsi dengan baik',
    analytics: 'Analitik',
    analyticsDesc: 'Membantu kami memahami bagaimana pengunjung berinteraksi dengan website',
    marketing: 'Pemasaran',
    marketingDesc: 'Digunakan untuk menampilkan iklan yang dipersonalisasi',
    savePreferences: 'Simpan Preferensi',
  },
};

interface CookieConsentProps {
  lang?: string;
}

export default function CookieConsent({ lang = 'EN' }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  // Translation helper
  const t = (key: string): string => {
    return cookieTranslations[lang]?.[key] || cookieTranslations['EN']?.[key] || key;
  };

  // Check if user has already made a choice
  useEffect(() => {
    const consent = localStorage.getItem('oddsflow_cookie_consent');
    if (!consent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentData = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('oddsflow_cookie_consent', JSON.stringify(consentData));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consentData = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('oddsflow_cookie_consent', JSON.stringify(consentData));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('oddsflow_cookie_consent', JSON.stringify(consentData));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />

      {/* Cookie Consent Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">{t('title')}</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Customize Section */}
          {showCustomize && (
            <div className="px-6 pb-4 space-y-3">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{t('necessary')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">Required</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{t('necessaryDesc')}</p>
                </div>
                <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-not-allowed opacity-70">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-1">
                  <span className="text-white font-medium text-sm">{t('analytics')}</span>
                  <p className="text-gray-500 text-xs mt-1">{t('analyticsDesc')}</p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                  className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${
                    preferences.analytics ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    preferences.analytics ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex-1">
                  <span className="text-white font-medium text-sm">{t('marketing')}</span>
                  <p className="text-gray-500 text-xs mt-1">{t('marketingDesc')}</p>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                  className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${
                    preferences.marketing ? 'bg-emerald-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    preferences.marketing ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 pt-2 space-y-3">
            {showCustomize ? (
              <button
                onClick={handleSavePreferences}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer"
              >
                {t('savePreferences')}
              </button>
            ) : (
              <>
                <div className="flex gap-3">
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 py-3 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-all cursor-pointer"
                  >
                    {t('rejectAll')}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    {t('acceptAll')}
                  </button>
                </div>
                <button
                  onClick={() => setShowCustomize(true)}
                  className="w-full py-2 text-gray-400 text-sm hover:text-white transition-colors cursor-pointer"
                >
                  {t('customize')}
                </button>
              </>
            )}

            {/* Privacy Policy Link */}
            <div className="text-center pt-2">
              <Link
                href="/privacy-policy"
                className="text-emerald-400 text-xs hover:underline"
              >
                {t('privacyPolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
