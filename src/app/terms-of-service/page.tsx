'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    title: "Terms of Service",
    lastUpdated: "Last Updated: January 2025",
    section1Title: "1. Acceptance of Terms",
    section1Text: "By accessing and using OddsFlow, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.",
    section2Title: "2. Use License",
    section2Text: "Permission is granted to temporarily access the materials on OddsFlow for personal, non-commercial use only. This license does not include modifying, copying, or using the materials for commercial purposes.",
    section3Title: "3. Disclaimer",
    section3Text: "The materials on OddsFlow are provided on an 'as is' basis. OddsFlow makes no warranties, expressed or implied, and hereby disclaims all other warranties including implied warranties of merchantability or fitness for a particular purpose.",
    section4Title: "4. Gambling Disclaimer",
    section4Text: "OddsFlow provides predictions and analytics for informational purposes only. We do not encourage gambling, and users should be aware that gambling involves financial risk. Always gamble responsibly and within your means. Users must be of legal gambling age in their jurisdiction.",
    section5Title: "5. Accuracy of Information",
    section5Text: "While we strive to provide accurate predictions and data, OddsFlow does not guarantee the accuracy, completeness, or reliability of any information provided. Users should not rely solely on our predictions for betting decisions.",
    section6Title: "6. User Accounts",
    section6Text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to notify us immediately of any unauthorized use.",
    section7Title: "7. Modifications",
    section7Text: "OddsFlow may revise these terms of service at any time without notice. By using this website, you agree to be bound by the current version of these Terms of Service.",
    section8Title: "8. Contact",
    section8Text: "If you have any questions about these Terms of Service, please contact us at support@oddsflow.com.",
    footer: "© 2025 OddsFlow. All rights reserved.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Análisis",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Comenzar",
    title: "Términos de Servicio",
    lastUpdated: "Última actualización: Enero 2025",
    section1Title: "1. Aceptación de Términos",
    section1Text: "Al acceder y utilizar OddsFlow, acepta estar sujeto a estos Términos de Servicio y todas las leyes y regulaciones aplicables.",
    section2Title: "2. Licencia de Uso",
    section2Text: "Se otorga permiso para acceder temporalmente a los materiales en OddsFlow solo para uso personal y no comercial.",
    section3Title: "3. Descargo de Responsabilidad",
    section3Text: "Los materiales en OddsFlow se proporcionan 'tal cual'. OddsFlow no ofrece garantías expresas o implícitas.",
    section4Title: "4. Descargo sobre Apuestas",
    section4Text: "OddsFlow proporciona predicciones y análisis solo con fines informativos. No fomentamos las apuestas. Los usuarios deben tener la edad legal para apostar.",
    section5Title: "5. Precisión de la Información",
    section5Text: "Aunque nos esforzamos por proporcionar predicciones precisas, OddsFlow no garantiza la exactitud de la información proporcionada.",
    section6Title: "6. Cuentas de Usuario",
    section6Text: "Usted es responsable de mantener la confidencialidad de las credenciales de su cuenta.",
    section7Title: "7. Modificaciones",
    section7Text: "OddsFlow puede revisar estos términos de servicio en cualquier momento sin previo aviso.",
    section8Title: "8. Contacto",
    section8Text: "Si tiene preguntas sobre estos Términos de Servicio, contáctenos en support@oddsflow.com.",
    footer: "© 2025 OddsFlow. Todos los derechos reservados.",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Análise",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    title: "Termos de Serviço",
    lastUpdated: "Última atualização: Janeiro 2025",
    section1Title: "1. Aceitação dos Termos",
    section1Text: "Ao acessar e usar o OddsFlow, você concorda em estar vinculado a estes Termos de Serviço e todas as leis aplicáveis.",
    section2Title: "2. Licença de Uso",
    section2Text: "É concedida permissão para acessar temporariamente os materiais no OddsFlow apenas para uso pessoal e não comercial.",
    section3Title: "3. Isenção de Responsabilidade",
    section3Text: "Os materiais no OddsFlow são fornecidos 'como estão'. OddsFlow não oferece garantias expressas ou implícitas.",
    section4Title: "4. Aviso sobre Apostas",
    section4Text: "OddsFlow fornece previsões e análises apenas para fins informativos. Não incentivamos apostas.",
    section5Title: "5. Precisão das Informações",
    section5Text: "Embora nos esforcemos para fornecer previsões precisas, OddsFlow não garante a exatidão das informações.",
    section6Title: "6. Contas de Usuário",
    section6Text: "Você é responsável por manter a confidencialidade das credenciais da sua conta.",
    section7Title: "7. Modificações",
    section7Text: "OddsFlow pode revisar estes termos de serviço a qualquer momento sem aviso prévio.",
    section8Title: "8. Contato",
    section8Text: "Se tiver dúvidas sobre estes Termos de Serviço, entre em contato em support@oddsflow.com.",
    footer: "© 2025 OddsFlow. Todos os direitos reservados.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    title: "Nutzungsbedingungen",
    lastUpdated: "Letzte Aktualisierung: Januar 2025",
    section1Title: "1. Annahme der Bedingungen",
    section1Text: "Durch den Zugriff auf OddsFlow erklären Sie sich mit diesen Nutzungsbedingungen einverstanden.",
    section2Title: "2. Nutzungslizenz",
    section2Text: "Es wird die Erlaubnis erteilt, vorübergehend auf die Materialien auf OddsFlow nur für den persönlichen, nicht-kommerziellen Gebrauch zuzugreifen.",
    section3Title: "3. Haftungsausschluss",
    section3Text: "Die Materialien auf OddsFlow werden 'wie besehen' bereitgestellt. OddsFlow gibt keine ausdrücklichen oder stillschweigenden Garantien.",
    section4Title: "4. Glücksspiel-Haftungsausschluss",
    section4Text: "OddsFlow bietet Vorhersagen und Analysen nur zu Informationszwecken. Wir ermutigen nicht zum Glücksspiel.",
    section5Title: "5. Genauigkeit der Informationen",
    section5Text: "Obwohl wir uns bemühen, genaue Vorhersagen zu liefern, garantiert OddsFlow nicht die Richtigkeit der bereitgestellten Informationen.",
    section6Title: "6. Benutzerkonten",
    section6Text: "Sie sind für die Wahrung der Vertraulichkeit Ihrer Kontodaten verantwortlich.",
    section7Title: "7. Änderungen",
    section7Text: "OddsFlow kann diese Nutzungsbedingungen jederzeit ohne Vorankündigung überarbeiten.",
    section8Title: "8. Kontakt",
    section8Text: "Bei Fragen zu diesen Nutzungsbedingungen kontaktieren Sie uns unter support@oddsflow.com.",
    footer: "© 2025 OddsFlow. Alle Rechte vorbehalten.",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Analyse",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    title: "Conditions d'Utilisation",
    lastUpdated: "Dernière mise à jour: Janvier 2025",
    section1Title: "1. Acceptation des Conditions",
    section1Text: "En accédant à OddsFlow, vous acceptez d'être lié par ces Conditions d'Utilisation.",
    section2Title: "2. Licence d'Utilisation",
    section2Text: "La permission est accordée d'accéder temporairement aux matériaux sur OddsFlow uniquement pour un usage personnel et non commercial.",
    section3Title: "3. Clause de Non-Responsabilité",
    section3Text: "Les matériaux sur OddsFlow sont fournis 'tels quels'. OddsFlow ne donne aucune garantie expresse ou implicite.",
    section4Title: "4. Avertissement sur les Jeux d'Argent",
    section4Text: "OddsFlow fournit des prédictions et des analyses à titre informatif uniquement. Nous n'encourageons pas les jeux d'argent.",
    section5Title: "5. Exactitude des Informations",
    section5Text: "Bien que nous nous efforcions de fournir des prédictions précises, OddsFlow ne garantit pas l'exactitude des informations.",
    section6Title: "6. Comptes Utilisateurs",
    section6Text: "Vous êtes responsable du maintien de la confidentialité de vos identifiants de compte.",
    section7Title: "7. Modifications",
    section7Text: "OddsFlow peut réviser ces conditions d'utilisation à tout moment sans préavis.",
    section8Title: "8. Contact",
    section8Text: "Pour toute question concernant ces Conditions d'Utilisation, contactez-nous à support@oddsflow.com.",
    footer: "© 2025 OddsFlow. Tous droits réservés.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "分析",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    title: "利用規約",
    lastUpdated: "最終更新：2025年1月",
    section1Title: "1. 規約への同意",
    section1Text: "OddsFlowにアクセスし使用することにより、これらの利用規約に拘束されることに同意するものとします。",
    section2Title: "2. 使用許諾",
    section2Text: "OddsFlowの資料に一時的にアクセスする許可は、個人的かつ非商業的な使用のみに付与されます。",
    section3Title: "3. 免責事項",
    section3Text: "OddsFlowの資料は「現状のまま」提供されます。OddsFlowは明示または黙示の保証を行いません。",
    section4Title: "4. ギャンブルに関する免責事項",
    section4Text: "OddsFlowは情報提供のみを目的として予測と分析を提供します。ギャンブルを奨励するものではありません。",
    section5Title: "5. 情報の正確性",
    section5Text: "正確な予測を提供するよう努めていますが、OddsFlowは提供される情報の正確性を保証しません。",
    section6Title: "6. ユーザーアカウント",
    section6Text: "アカウント認証情報の機密性を維持する責任はお客様にあります。",
    section7Title: "7. 変更",
    section7Text: "OddsFlowは予告なしにいつでもこれらの利用規約を改訂することがあります。",
    section8Title: "8. お問い合わせ",
    section8Text: "これらの利用規約についてご質問がある場合は、support@oddsflow.comまでお問い合わせください。",
    footer: "© 2025 OddsFlow. 全著作権所有。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "분석",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기",
    title: "이용약관",
    lastUpdated: "최종 업데이트: 2025년 1월",
    section1Title: "1. 약관 동의",
    section1Text: "OddsFlow에 접속하고 사용함으로써 귀하는 이 이용약관에 구속되는 것에 동의합니다.",
    section2Title: "2. 사용 라이선스",
    section2Text: "OddsFlow의 자료에 일시적으로 접근하는 권한은 개인적, 비상업적 용도로만 부여됩니다.",
    section3Title: "3. 면책조항",
    section3Text: "OddsFlow의 자료는 '있는 그대로' 제공됩니다. OddsFlow는 명시적이거나 묵시적인 어떤 보증도 하지 않습니다.",
    section4Title: "4. 도박 면책조항",
    section4Text: "OddsFlow는 정보 제공 목적으로만 예측과 분석을 제공합니다. 도박을 권장하지 않습니다.",
    section5Title: "5. 정보의 정확성",
    section5Text: "정확한 예측을 제공하기 위해 노력하지만, OddsFlow는 제공된 정보의 정확성을 보장하지 않습니다.",
    section6Title: "6. 사용자 계정",
    section6Text: "계정 자격 증명의 기밀성을 유지할 책임은 귀하에게 있습니다.",
    section7Title: "7. 수정",
    section7Text: "OddsFlow는 사전 통지 없이 언제든지 이 이용약관을 개정할 수 있습니다.",
    section8Title: "8. 연락처",
    section8Text: "이 이용약관에 대한 질문이 있으시면 support@oddsflow.com으로 문의하세요.",
    footer: "© 2025 OddsFlow. 모든 권리 보유.",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "分析",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始",
    title: "服务条款",
    lastUpdated: "最后更新：2025年1月",
    section1Title: "1. 条款接受",
    section1Text: "访问和使用 OddsFlow，即表示您同意受这些服务条款约束。",
    section2Title: "2. 使用许可",
    section2Text: "允许您临时访问 OddsFlow 上的材料，仅供个人和非商业用途。",
    section3Title: "3. 免责声明",
    section3Text: "OddsFlow 上的材料按「原样」提供。OddsFlow 不作任何明示或暗示的保证。",
    section4Title: "4. 博彩免责声明",
    section4Text: "OddsFlow 仅出于信息目的提供预测和分析。我们不鼓励博彩。用户必须达到其所在地区的合法博彩年龄。",
    section5Title: "5. 信息准确性",
    section5Text: "虽然我们努力提供准确的预测，但 OddsFlow 不保证所提供信息的准确性。",
    section6Title: "6. 用户账户",
    section6Text: "您有责任维护账户凭据的保密性。",
    section7Title: "7. 修改",
    section7Text: "OddsFlow 可以随时修改这些服务条款，恕不另行通知。",
    section8Title: "8. 联系方式",
    section8Text: "如果您对这些服务条款有任何疑问，请通过 support@oddsflow.com 联系我们。",
    footer: "© 2025 OddsFlow. 版权所有。",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "分析",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始",
    title: "服務條款",
    lastUpdated: "最後更新：2025年1月",
    section1Title: "1. 條款接受",
    section1Text: "訪問和使用 OddsFlow，即表示您同意受這些服務條款約束。",
    section2Title: "2. 使用許可",
    section2Text: "允許您臨時訪問 OddsFlow 上的材料，僅供個人和非商業用途。",
    section3Title: "3. 免責聲明",
    section3Text: "OddsFlow 上的材料按「原樣」提供。OddsFlow 不作任何明示或暗示的保證。",
    section4Title: "4. 博彩免責聲明",
    section4Text: "OddsFlow 僅出於信息目的提供預測和分析。我們不鼓勵博彩。用戶必須達到其所在地區的合法博彩年齡。",
    section5Title: "5. 信息準確性",
    section5Text: "雖然我們努力提供準確的預測，但 OddsFlow 不保證所提供信息的準確性。",
    section6Title: "6. 用戶帳戶",
    section6Text: "您有責任維護帳戶憑據的保密性。",
    section7Title: "7. 修改",
    section7Text: "OddsFlow 可以隨時修改這些服務條款，恕不另行通知。",
    section8Title: "8. 聯繫方式",
    section8Text: "如果您對這些服務條款有任何疑問，請通過 support@oddsflow.com 聯繫我們。",
    footer: "© 2025 OddsFlow. 版權所有。",
  },
};

export default function TermsOfServicePage() {
  const [lang, setLang] = useState('EN');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('oddsflow_lang');
    if (savedLang) setLang(savedLang);
  }, []);

  const handleSetLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('oddsflow_lang', newLang);
    setLangDropdownOpen(false);
  };

  const t = (key: string) => translations[lang]?.[key] || translations['EN'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
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
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    {LANGUAGES.map((language) => (
                      <button key={language.code} onClick={() => handleSetLang(language.code)} className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${lang === language.code ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300'}`}>
                        <span className="text-lg">{language.flag}</span>
                        <span className="font-medium">{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
              <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-gray-500 mb-12">{t('lastUpdated')}</p>

          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div key={num} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold mb-3 text-emerald-400">{t(`section${num}Title`)}</h2>
                <p className="text-gray-300 leading-relaxed">{t(`section${num}Text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
                <span className="text-xl font-bold">OddsFlow</span>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.</p>
              <div className="flex gap-4">
                {/* Facebook */}
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                {/* Telegram */}
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-white">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/predictions" className="hover:text-emerald-400 transition-colors">Predictions</Link></li>
                <li><Link href="/leagues" className="hover:text-emerald-400 transition-colors">Leagues</Link></li>
                <li><Link href="/performance" className="hover:text-emerald-400 transition-colors">AI Performance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-5 text-white">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/terms-of-service" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">{t('footer')}</p>
            <p className="text-gray-600 text-xs">Gambling involves risk. Please gamble responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
