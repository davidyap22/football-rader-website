'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeToTranslationCode, type Locale } from '@/i18n/config';

const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    title: "Privacy Policy",
    lastUpdated: "Last Updated: January 2025",
    section1Title: "1. Information We Collect",
    section1Text: "We collect information you provide directly, such as your name, email address, and account credentials when you register. We also collect usage data, including pages visited, features used, and interaction patterns to improve our services.",
    section2Title: "2. How We Use Your Information",
    section2Text: "We use your information to provide and improve our services, personalize your experience, send you updates and marketing communications (with your consent), and ensure the security of our platform.",
    section3Title: "3. Information Sharing",
    section3Text: "We do not sell your personal information. We may share data with service providers who help operate our platform, or when required by law. Any third parties we work with are bound by strict confidentiality agreements.",
    section4Title: "4. Data Security",
    section4Text: "We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.",
    section5Title: "5. Cookies and Tracking",
    section5Text: "We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences.",
    section6Title: "6. Your Rights",
    section6Text: "You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time. Contact us at privacy@oddsflow.com to exercise these rights.",
    section7Title: "7. Data Retention",
    section7Text: "We retain your data for as long as your account is active or as needed to provide services. We may retain certain information as required by law or for legitimate business purposes.",
    section8Title: "8. Changes to This Policy",
    section8Text: "We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on our website or sending you an email.",
    section9Title: "9. Contact Us",
    section9Text: "If you have questions about this Privacy Policy or our data practices, please contact us at privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. All rights reserved.",
    // Footer
    footerDesc: "AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.",
    product: "Product",
    liveOdds: "AI Performance",
    solution: "Solution",
    company: "Company",
    aboutUs: "About Us",
    blog: "Blog",
    contact: "Contact",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    popularLeagues: "Popular Leagues",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
    todayMatches: "Today Matches",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Análisis",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Comenzar",
    title: "Política de Privacidad",
    lastUpdated: "Última actualización: Enero 2025",
    section1Title: "1. Información que Recopilamos",
    section1Text: "Recopilamos información que usted proporciona directamente, como su nombre, dirección de correo electrónico y credenciales de cuenta.",
    section2Title: "2. Cómo Usamos su Información",
    section2Text: "Utilizamos su información para proporcionar y mejorar nuestros servicios, personalizar su experiencia y garantizar la seguridad de nuestra plataforma.",
    section3Title: "3. Compartir Información",
    section3Text: "No vendemos su información personal. Podemos compartir datos con proveedores de servicios que ayudan a operar nuestra plataforma.",
    section4Title: "4. Seguridad de Datos",
    section4Text: "Implementamos medidas de seguridad estándar de la industria para proteger sus datos, incluido el cifrado y servidores seguros.",
    section5Title: "5. Cookies y Seguimiento",
    section5Text: "Utilizamos cookies y tecnologías similares para mejorar su experiencia y recordar sus preferencias.",
    section6Title: "6. Sus Derechos",
    section6Text: "Tiene derecho a acceder, corregir o eliminar su información personal. Contáctenos en privacy@oddsflow.com.",
    section7Title: "7. Retención de Datos",
    section7Text: "Conservamos sus datos mientras su cuenta esté activa o según sea necesario para proporcionar servicios.",
    section8Title: "8. Cambios a Esta Política",
    section8Text: "Podemos actualizar esta política de privacidad de vez en cuando. Le notificaremos sobre cambios significativos.",
    section9Title: "9. Contáctenos",
    section9Text: "Si tiene preguntas sobre esta Política de Privacidad, contáctenos en privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Todos los derechos reservados.",
    footerDesc: "Análisis de cuotas de fútbol impulsado por IA para predicciones más inteligentes.",
    product: "Producto", liveOdds: "Rendimiento IA", solution: "Solución",
    company: "Empresa", aboutUs: "Sobre Nosotros", blog: "Blog", contact: "Contacto",
    legal: "Legal", privacyPolicy: "Política de Privacidad", termsOfService: "Términos de Servicio",
    allRightsReserved: "Todos los derechos reservados.", gamblingWarning: "Las apuestas implican riesgo. Por favor, apueste responsablemente.",
    popularLeagues: "Ligas Populares", communityFooter: "Comunidad", globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios", todayMatches: "Partidos de Hoy",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precisión de las predicciones y no somos responsables de ninguna pérdida financiera. Las apuestas implican riesgo. Por favor, apueste responsablemente. Si usted o alguien que conoce tiene un problema con el juego, busque ayuda. Los usuarios deben tener 18+ años.",
  },
  PT: {
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Análise",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar",
    title: "Política de Privacidade",
    lastUpdated: "Última atualização: Janeiro 2025",
    section1Title: "1. Informações que Coletamos",
    section1Text: "Coletamos informações que você fornece diretamente, como nome, endereço de e-mail e credenciais de conta.",
    section2Title: "2. Como Usamos suas Informações",
    section2Text: "Usamos suas informações para fornecer e melhorar nossos serviços, personalizar sua experiência e garantir a segurança.",
    section3Title: "3. Compartilhamento de Informações",
    section3Text: "Não vendemos suas informações pessoais. Podemos compartilhar dados com provedores de serviços que ajudam a operar nossa plataforma.",
    section4Title: "4. Segurança de Dados",
    section4Text: "Implementamos medidas de segurança padrão da indústria para proteger seus dados.",
    section5Title: "5. Cookies e Rastreamento",
    section5Text: "Usamos cookies e tecnologias similares para melhorar sua experiência e lembrar suas preferências.",
    section6Title: "6. Seus Direitos",
    section6Text: "Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Entre em contato em privacy@oddsflow.com.",
    section7Title: "7. Retenção de Dados",
    section7Text: "Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para fornecer serviços.",
    section8Title: "8. Alterações nesta Política",
    section8Text: "Podemos atualizar esta política de privacidade periodicamente. Notificaremos você sobre mudanças significativas.",
    section9Title: "9. Entre em Contato",
    section9Text: "Se tiver dúvidas sobre esta Política de Privacidade, entre em contato em privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Todos os direitos reservados.",
    footerDesc: "Análise de odds de futebol com IA para previsões mais inteligentes.",
    product: "Produto", liveOdds: "Desempenho IA", solution: "Solução",
    company: "Empresa", aboutUs: "Sobre Nós", blog: "Blog", contact: "Contato",
    legal: "Legal", privacyPolicy: "Política de Privacidade", termsOfService: "Termos de Serviço",
    allRightsReserved: "Todos os direitos reservados.", gamblingWarning: "Apostas envolvem risco. Por favor, aposte com responsabilidade.",
    popularLeagues: "Ligas Populares", communityFooter: "Comunidade", globalChat: "Chat Global",
    userPredictions: "Previsões de Usuários", todayMatches: "Jogos de Hoje",
    disclaimer: "Aviso: OddsFlow fornece previsões com IA apenas para fins informativos e de entretenimento. Não garantimos a precisão das previsões e não somos responsáveis por quaisquer perdas financeiras. Apostas envolvem risco. Por favor, aposte com responsabilidade. Se você ou alguém que você conhece tem um problema com jogos, procure ajuda. Usuários devem ter 18+ anos.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen",
    title: "Datenschutzrichtlinie",
    lastUpdated: "Letzte Aktualisierung: Januar 2025",
    section1Title: "1. Informationen, die wir sammeln",
    section1Text: "Wir sammeln Informationen, die Sie direkt bereitstellen, wie Name, E-Mail-Adresse und Kontodaten.",
    section2Title: "2. Wie wir Ihre Informationen verwenden",
    section2Text: "Wir verwenden Ihre Informationen, um unsere Dienste bereitzustellen und zu verbessern.",
    section3Title: "3. Informationsweitergabe",
    section3Text: "Wir verkaufen Ihre persönlichen Daten nicht. Wir können Daten mit Dienstleistern teilen, die unsere Plattform betreiben.",
    section4Title: "4. Datensicherheit",
    section4Text: "Wir implementieren branchenübliche Sicherheitsmaßnahmen zum Schutz Ihrer Daten.",
    section5Title: "5. Cookies und Tracking",
    section5Text: "Wir verwenden Cookies und ähnliche Technologien, um Ihre Erfahrung zu verbessern.",
    section6Title: "6. Ihre Rechte",
    section6Text: "Sie haben das Recht, auf Ihre persönlichen Daten zuzugreifen, sie zu korrigieren oder zu löschen.",
    section7Title: "7. Datenspeicherung",
    section7Text: "Wir bewahren Ihre Daten auf, solange Ihr Konto aktiv ist.",
    section8Title: "8. Änderungen dieser Richtlinie",
    section8Text: "Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren.",
    section9Title: "9. Kontaktieren Sie uns",
    section9Text: "Bei Fragen zu dieser Datenschutzrichtlinie kontaktieren Sie uns unter privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Alle Rechte vorbehalten.",
    footerDesc: "KI-gestützte Fußball-Quotenanalyse für intelligentere Vorhersagen.",
    product: "Produkt", liveOdds: "KI-Leistung", solution: "Lösung",
    company: "Unternehmen", aboutUs: "Über Uns", blog: "Blog", contact: "Kontakt",
    legal: "Rechtliches", privacyPolicy: "Datenschutzrichtlinie", termsOfService: "Nutzungsbedingungen",
    allRightsReserved: "Alle Rechte vorbehalten.", gamblingWarning: "Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    popularLeagues: "Beliebte Ligen", communityFooter: "Community", globalChat: "Globaler Chat",
    userPredictions: "Benutzervorhersagen", todayMatches: "Heutige Spiele",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestützte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Wir garantieren nicht die Genauigkeit der Vorhersagen und sind nicht für finanzielle Verluste verantwortlich. Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll. Wenn Sie oder jemand, den Sie kennen, ein Glücksspielproblem hat, suchen Sie bitte Hilfe. Benutzer müssen 18+ Jahre alt sein.",
  },
  FR: {
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Analyse",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer",
    title: "Politique de Confidentialité",
    lastUpdated: "Dernière mise à jour: Janvier 2025",
    section1Title: "1. Informations que nous collectons",
    section1Text: "Nous collectons les informations que vous fournissez directement, comme votre nom, adresse e-mail et identifiants de compte.",
    section2Title: "2. Comment nous utilisons vos informations",
    section2Text: "Nous utilisons vos informations pour fournir et améliorer nos services, personnaliser votre expérience.",
    section3Title: "3. Partage d'informations",
    section3Text: "Nous ne vendons pas vos informations personnelles. Nous pouvons partager des données avec des prestataires de services.",
    section4Title: "4. Sécurité des données",
    section4Text: "Nous mettons en œuvre des mesures de sécurité standard pour protéger vos données.",
    section5Title: "5. Cookies et suivi",
    section5Text: "Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience.",
    section6Title: "6. Vos droits",
    section6Text: "Vous avez le droit d'accéder, de corriger ou de supprimer vos informations personnelles.",
    section7Title: "7. Conservation des données",
    section7Text: "Nous conservons vos données tant que votre compte est actif.",
    section8Title: "8. Modifications de cette politique",
    section8Text: "Nous pouvons mettre à jour cette politique de confidentialité de temps en temps.",
    section9Title: "9. Contactez-nous",
    section9Text: "Pour toute question concernant cette Politique de Confidentialité, contactez-nous à privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Tous droits réservés.",
    footerDesc: "Analyse des cotes de football alimentée par l'IA pour des prédictions plus intelligentes.",
    product: "Produit", liveOdds: "Performance IA", solution: "Solution",
    company: "Entreprise", aboutUs: "À Propos", blog: "Blog", contact: "Contact",
    legal: "Mentions Légales", privacyPolicy: "Politique de Confidentialité", termsOfService: "Conditions d'Utilisation",
    allRightsReserved: "Tous droits réservés.", gamblingWarning: "Les jeux d'argent comportent des risques. Veuillez jouer de manière responsable.",
    popularLeagues: "Ligues Populaires", communityFooter: "Communauté", globalChat: "Chat Global",
    userPredictions: "Prédictions des Utilisateurs", todayMatches: "Matchs du Jour",
    disclaimer: "Avertissement: OddsFlow fournit des prédictions alimentées par l'IA uniquement à des fins d'information et de divertissement. Nous ne garantissons pas l'exactitude des prédictions et ne sommes pas responsables des pertes financières. Les jeux d'argent comportent des risques. Veuillez jouer de manière responsable. Si vous ou quelqu'un que vous connaissez a un problème de jeu, veuillez demander de l'aide. Les utilisateurs doivent avoir 18+ ans.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "分析",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める",
    title: "プライバシーポリシー",
    lastUpdated: "最終更新：2025年1月",
    section1Title: "1. 収集する情報",
    section1Text: "お名前、メールアドレス、アカウント認証情報など、直接提供される情報を収集します。",
    section2Title: "2. 情報の使用方法",
    section2Text: "サービスの提供と改善、体験のパーソナライズのために情報を使用します。",
    section3Title: "3. 情報の共有",
    section3Text: "個人情報を販売することはありません。プラットフォームの運営を支援するサービスプロバイダーとデータを共有する場合があります。",
    section4Title: "4. データセキュリティ",
    section4Text: "データを保護するために、業界標準のセキュリティ対策を実施しています。",
    section5Title: "5. Cookieとトラッキング",
    section5Text: "Cookieや類似の技術を使用して、体験を向上させ、設定を記憶します。",
    section6Title: "6. お客様の権利",
    section6Text: "個人情報へのアクセス、修正、削除の権利があります。",
    section7Title: "7. データの保持",
    section7Text: "アカウントがアクティブな間、またはサービス提供に必要な限りデータを保持します。",
    section8Title: "8. ポリシーの変更",
    section8Text: "このプライバシーポリシーは随時更新される場合があります。",
    section9Title: "9. お問い合わせ",
    section9Text: "このプライバシーポリシーについてご質問がある場合は、privacy@oddsflow.comまでお問い合わせください。",
    footer: "© 2026 OddsFlow. 全著作権所有。",
    footerDesc: "AI搭載のサッカーオッズ分析でよりスマートな予測を。",
    product: "製品", liveOdds: "AIパフォーマンス", solution: "ソリューション",
    company: "会社", aboutUs: "会社概要", blog: "ブログ", contact: "お問い合わせ",
    legal: "法的情報", privacyPolicy: "プライバシーポリシー", termsOfService: "利用規約",
    allRightsReserved: "全著作権所有。", gamblingWarning: "ギャンブルにはリスクが伴います。責任を持って賭けてください。",
    popularLeagues: "人気リーグ", communityFooter: "コミュニティ", globalChat: "グローバルチャット",
    userPredictions: "ユーザー予測", todayMatches: "今日の試合",
    disclaimer: "免責事項：OddsFlowは情報および娯楽目的でのみAI予測を提供しています。予測の正確性を保証するものではなく、いかなる金銭的損失についても責任を負いません。ギャンブルにはリスクが伴います。責任を持って賭けてください。あなたまたはあなたの知人にギャンブルの問題がある場合は、助けを求めてください。ユーザーは18歳以上である必要があります。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "분석",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기",
    title: "개인정보 처리방침",
    lastUpdated: "최종 업데이트: 2025년 1월",
    section1Title: "1. 수집하는 정보",
    section1Text: "이름, 이메일 주소, 계정 자격 증명 등 직접 제공하는 정보를 수집합니다.",
    section2Title: "2. 정보 사용 방법",
    section2Text: "서비스 제공 및 개선, 경험 개인화를 위해 정보를 사용합니다.",
    section3Title: "3. 정보 공유",
    section3Text: "개인 정보를 판매하지 않습니다. 플랫폼 운영을 돕는 서비스 제공업체와 데이터를 공유할 수 있습니다.",
    section4Title: "4. 데이터 보안",
    section4Text: "데이터를 보호하기 위해 업계 표준 보안 조치를 구현합니다.",
    section5Title: "5. 쿠키 및 추적",
    section5Text: "쿠키 및 유사한 기술을 사용하여 경험을 향상시키고 설정을 기억합니다.",
    section6Title: "6. 귀하의 권리",
    section6Text: "개인 정보에 대한 접근, 수정 또는 삭제 권리가 있습니다.",
    section7Title: "7. 데이터 보존",
    section7Text: "계정이 활성 상태인 동안 또는 서비스 제공에 필요한 기간 동안 데이터를 보존합니다.",
    section8Title: "8. 정책 변경",
    section8Text: "이 개인정보 처리방침은 수시로 업데이트될 수 있습니다.",
    section9Title: "9. 문의하기",
    section9Text: "이 개인정보 처리방침에 대한 질문이 있으시면 privacy@oddsflow.com으로 문의하세요.",
    footer: "© 2026 OddsFlow. 모든 권리 보유.",
    footerDesc: "AI 기반 축구 배당률 분석으로 더 스마트한 예측을.",
    product: "제품", liveOdds: "AI 성능", solution: "솔루션",
    company: "회사", aboutUs: "회사 소개", blog: "블로그", contact: "연락처",
    legal: "법적 정보", privacyPolicy: "개인정보 처리방침", termsOfService: "이용약관",
    allRightsReserved: "모든 권리 보유.", gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 베팅하세요.",
    popularLeagues: "인기 리그", communityFooter: "커뮤니티", globalChat: "글로벌 채팅",
    userPredictions: "사용자 예측", todayMatches: "오늘의 경기",
    disclaimer: "면책조항: OddsFlow는 정보 및 오락 목적으로만 AI 예측을 제공합니다. 예측의 정확성을 보장하지 않으며 어떠한 금전적 손실에 대해서도 책임지지 않습니다. 도박에는 위험이 따릅니다. 책임감 있게 베팅하세요. 귀하 또는 아는 사람에게 도박 문제가 있다면 도움을 구하세요. 사용자는 18세 이상이어야 합니다.",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "分析",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始",
    title: "隐私政策",
    lastUpdated: "最后更新：2025年1月",
    section1Title: "1. 我们收集的信息",
    section1Text: "我们收集您直接提供的信息，例如您的姓名、电子邮件地址和账户凭据。",
    section2Title: "2. 我们如何使用您的信息",
    section2Text: "我们使用您的信息来提供和改进我们的服务，个性化您的体验，并确保平台安全。",
    section3Title: "3. 信息共享",
    section3Text: "我们不会出售您的个人信息。我们可能会与帮助运营平台的服务提供商共享数据。",
    section4Title: "4. 数据安全",
    section4Text: "我们实施行业标准的安全措施来保护您的数据，包括加密和安全服务器。",
    section5Title: "5. Cookie 和跟踪",
    section5Text: "我们使用 Cookie 和类似技术来增强您的体验并记住您的偏好。",
    section6Title: "6. 您的权利",
    section6Text: "您有权访问、更正或删除您的个人信息。请通过 privacy@oddsflow.com 联系我们。",
    section7Title: "7. 数据保留",
    section7Text: "只要您的账户处于活跃状态或需要提供服务，我们就会保留您的数据。",
    section8Title: "8. 政策变更",
    section8Text: "我们可能会不时更新此隐私政策。我们会通知您重大变更。",
    section9Title: "9. 联系我们",
    section9Text: "如果您对本隐私政策有任何疑问，请通过 privacy@oddsflow.com 联系我们。",
    footer: "© 2026 OddsFlow. 版权所有。",
    footerDesc: "AI 驱动的足球赔率分析，助您做出更明智的预测。",
    product: "产品", liveOdds: "AI 性能", solution: "解决方案",
    company: "公司", aboutUs: "关于我们", blog: "博客", contact: "联系我们",
    legal: "法律", privacyPolicy: "隐私政策", termsOfService: "服务条款",
    allRightsReserved: "版权所有。", gamblingWarning: "博彩有风险，请理性投注。",
    popularLeagues: "热门联赛", communityFooter: "社区", globalChat: "全球聊天",
    userPredictions: "用户预测", todayMatches: "今日比赛",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "分析",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始",
    title: "隱私政策",
    lastUpdated: "最後更新：2025年1月",
    section1Title: "1. 我們收集的資訊",
    section1Text: "我們收集您直接提供的資訊，例如您的姓名、電子郵件地址和帳戶憑據。",
    section2Title: "2. 我們如何使用您的資訊",
    section2Text: "我們使用您的資訊來提供和改進我們的服務，個性化您的體驗，並確保平台安全。",
    section3Title: "3. 資訊共享",
    section3Text: "我們不會出售您的個人資訊。我們可能會與幫助營運平台的服務提供商共享資料。",
    section4Title: "4. 資料安全",
    section4Text: "我們實施行業標準的安全措施來保護您的資料，包括加密和安全伺服器。",
    section5Title: "5. Cookie 和追蹤",
    section5Text: "我們使用 Cookie 和類似技術來增強您的體驗並記住您的偏好。",
    section6Title: "6. 您的權利",
    section6Text: "您有權存取、更正或刪除您的個人資訊。請透過 privacy@oddsflow.com 聯繫我們。",
    section7Title: "7. 資料保留",
    section7Text: "只要您的帳戶處於活躍狀態或需要提供服務，我們就會保留您的資料。",
    section8Title: "8. 政策變更",
    section8Text: "我們可能會不時更新此隱私政策。我們會通知您重大變更。",
    section9Title: "9. 聯繫我們",
    section9Text: "如果您對本隱私政策有任何疑問，請透過 privacy@oddsflow.com 聯繫我們。",
    footer: "© 2026 OddsFlow. 版權所有。",
    footerDesc: "AI 驅動的足球賠率分析，助您做出更明智的預測。",
    product: "產品", liveOdds: "AI 性能", solution: "解決方案",
    company: "公司", aboutUs: "關於我們", blog: "部落格", contact: "聯繫我們",
    legal: "法律", privacyPolicy: "隱私政策", termsOfService: "服務條款",
    allRightsReserved: "版權所有。", gamblingWarning: "博彩有風險，請理性投注。",
    popularLeagues: "熱門聯賽", communityFooter: "社區", globalChat: "全球聊天",
    userPredictions: "用戶預測", todayMatches: "今日比賽",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai",
    title: "Kebijakan Privasi",
    lastUpdated: "Terakhir Diperbarui: Januari 2025",
    section1Title: "1. Informasi yang Kami Kumpulkan",
    section1Text: "Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, dan kredensial akun Anda saat mendaftar. Kami juga mengumpulkan data penggunaan untuk meningkatkan layanan kami.",
    section2Title: "2. Bagaimana Kami Menggunakan Informasi Anda",
    section2Text: "Kami menggunakan informasi Anda untuk menyediakan dan meningkatkan layanan kami, mempersonalisasi pengalaman Anda, dan memastikan keamanan platform kami.",
    section3Title: "3. Berbagi Informasi",
    section3Text: "Kami tidak menjual informasi pribadi Anda. Kami dapat berbagi data dengan penyedia layanan yang membantu mengoperasikan platform kami.",
    section4Title: "4. Keamanan Data",
    section4Text: "Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi data Anda, termasuk enkripsi dan server yang aman.",
    section5Title: "5. Cookie dan Pelacakan",
    section5Text: "Kami menggunakan cookie dan teknologi serupa untuk meningkatkan pengalaman Anda dan mengingat preferensi Anda.",
    section6Title: "6. Hak Anda",
    section6Text: "Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus informasi pribadi Anda. Hubungi kami di privacy@oddsflow.com.",
    section7Title: "7. Penyimpanan Data",
    section7Text: "Kami menyimpan data Anda selama akun Anda aktif atau sesuai kebutuhan untuk menyediakan layanan.",
    section8Title: "8. Perubahan Kebijakan Ini",
    section8Text: "Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan signifikan.",
    section9Title: "9. Hubungi Kami",
    section9Text: "Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Hak cipta dilindungi.",
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi yang lebih cerdas.",
    product: "Produk", liveOdds: "Performa AI", solution: "Solusi",
    company: "Perusahaan", aboutUs: "Tentang Kami", blog: "Blog", contact: "Kontak",
    legal: "Hukum", privacyPolicy: "Kebijakan Privasi", termsOfService: "Syarat Layanan",
    allRightsReserved: "Hak cipta dilindungi.", gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    popularLeagues: "Liga Populer", communityFooter: "Komunitas", globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna", todayMatches: "Pertandingan Hari Ini",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
  },
};

export default function PrivacyPolicyPage() {
  const params = useParams();
  const urlLocale = (params?.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/privacy-policy';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
              <Link href={localePath('/pricing')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    {locales.map((loc) => {
                      const langCode = localeToTranslationCode[loc];
                      const language = LANGUAGES.find(l => l.code === langCode);
                      if (!language) return null;
                      return (
                        <Link key={loc} href={getLocaleUrl(loc)} className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer ${selectedLang === langCode ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300'}`}>
                          <FlagIcon code={langCode} size={20} />
                          <span className="font-medium">{language.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
              <Link href={localePath('/login')} className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
              <Link href={localePath('/get-started')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <div key={num} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold mb-3 text-emerald-400">{t(`section${num}Title`)}</h2>
                <p className="text-gray-300 leading-relaxed">{t(`section${num}Text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2">
              <Link href={localePath('/')} className="flex items-center gap-3 mb-6">
                <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
                <span className="text-xl font-bold">OddsFlow</span>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">{t('footerDesc')}</p>
              <div className="flex items-center gap-4">
                {/* Facebook */}
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </Link>
                {/* Instagram */}
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
                {/* Telegram */}
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('product')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/predictions')} className="hover:text-emerald-400 transition-colors">{t('predictions')}</Link></li>
                <li><Link href={localePath('/leagues')} className="hover:text-emerald-400 transition-colors">{t('leagues')}</Link></li>
                <li><Link href={localePath('/performance')} className="hover:text-emerald-400 transition-colors">{t('liveOdds')}</Link></li>
                <li><Link href={localePath('/solution')} className="hover:text-emerald-400 transition-colors">{t('solution')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('popularLeagues')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/leagues/premier-league')} className="hover:text-emerald-400 transition-colors">Premier League</Link></li>
                <li><Link href={localePath('/leagues/la-liga')} className="hover:text-emerald-400 transition-colors">La Liga</Link></li>
                <li><Link href={localePath('/leagues/serie-a')} className="hover:text-emerald-400 transition-colors">Serie A</Link></li>
                <li><Link href={localePath('/leagues/bundesliga')} className="hover:text-emerald-400 transition-colors">Bundesliga</Link></li>
                <li><Link href={localePath('/leagues/ligue-1')} className="hover:text-emerald-400 transition-colors">Ligue 1</Link></li>
                <li><Link href={localePath('/leagues/champions-league')} className="hover:text-emerald-400 transition-colors">Champions League</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('communityFooter')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/community')} className="hover:text-emerald-400 transition-colors">{t('community')}</Link></li>
                <li><Link href={localePath('/community/global-chat')} className="hover:text-emerald-400 transition-colors">{t('globalChat')}</Link></li>
                <li><Link href={localePath('/community/user-predictions')} className="hover:text-emerald-400 transition-colors">{t('userPredictions')}</Link></li>
              </ul>
            </div>

            <div className="relative z-10">
              <h4 className="font-semibold mb-5 text-white">{t('company')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/about')} className="hover:text-emerald-400 transition-colors inline-block">{t('aboutUs')}</Link></li>
                <li><Link href={localePath('/contact')} className="hover:text-emerald-400 transition-colors inline-block">{t('contact')}</Link></li>
                <li><Link href={localePath('/blog')} className="hover:text-emerald-400 transition-colors inline-block">{t('blog')}</Link></li>
              </ul>
            </div>

            <div className="relative z-10">
              <h4 className="font-semibold mb-5 text-white">{t('legal')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href={localePath('/terms-of-service')} className="hover:text-emerald-400 transition-colors inline-block">{t('termsOfService')}</Link></li>
                <li><Link href={localePath('/privacy-policy')} className="hover:text-emerald-400 transition-colors inline-block">{t('privacyPolicy')}</Link></li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-gray-500 text-xs leading-relaxed">{t('disclaimer')}</p>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <p className="text-gray-500 text-sm">&copy; 2026 OddsFlow. {t('allRightsReserved')}</p>
            <p className="text-gray-600 text-xs">{t('gamblingWarning')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
