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
  { code: 'ID', name: 'Bahasa Indonesia', flag: '🇮🇩' },
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
    title: "Syarat Layanan",
    lastUpdated: "Terakhir Diperbarui: Januari 2025",
    section1Title: "1. Penerimaan Syarat",
    section1Text: "Dengan mengakses dan menggunakan OddsFlow, Anda setuju untuk terikat oleh Syarat Layanan ini dan semua hukum dan peraturan yang berlaku.",
    section2Title: "2. Lisensi Penggunaan",
    section2Text: "Izin diberikan untuk mengakses sementara materi di OddsFlow hanya untuk penggunaan pribadi dan non-komersial.",
    section3Title: "3. Penafian",
    section3Text: "Materi di OddsFlow disediakan apa adanya. OddsFlow tidak memberikan jaminan tersurat maupun tersirat.",
    section4Title: "4. Penafian Perjudian",
    section4Text: "OddsFlow menyediakan prediksi dan analitik hanya untuk tujuan informasi. Kami tidak mendorong perjudian. Pengguna harus berusia legal untuk berjudi di yurisdiksi mereka.",
    section5Title: "5. Keakuratan Informasi",
    section5Text: "Meskipun kami berusaha memberikan prediksi yang akurat, OddsFlow tidak menjamin keakuratan informasi yang diberikan.",
    section6Title: "6. Akun Pengguna",
    section6Text: "Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda.",
    section7Title: "7. Modifikasi",
    section7Text: "OddsFlow dapat merevisi syarat layanan ini kapan saja tanpa pemberitahuan.",
    section8Title: "8. Kontak",
    section8Text: "Jika Anda memiliki pertanyaan tentang Syarat Layanan ini, silakan hubungi kami di support@oddsflow.com.",
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
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('community')}</Link>
              <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('news')}</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
      <footer className="relative z-10 py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
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
                <li><Link href="/predictions" className="hover:text-emerald-400 transition-colors">{t('predictions')}</Link></li>
                <li><Link href="/leagues" className="hover:text-emerald-400 transition-colors">{t('leagues')}</Link></li>
                <li><Link href="/performance" className="hover:text-emerald-400 transition-colors">{t('liveOdds')}</Link></li>
                <li><Link href="/solution" className="hover:text-emerald-400 transition-colors">{t('solution')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('popularLeagues')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/leagues/premier-league" className="hover:text-emerald-400 transition-colors">Premier League</Link></li>
                <li><Link href="/leagues/la-liga" className="hover:text-emerald-400 transition-colors">La Liga</Link></li>
                <li><Link href="/leagues/serie-a" className="hover:text-emerald-400 transition-colors">Serie A</Link></li>
                <li><Link href="/leagues/bundesliga" className="hover:text-emerald-400 transition-colors">Bundesliga</Link></li>
                <li><Link href="/leagues/ligue-1" className="hover:text-emerald-400 transition-colors">Ligue 1</Link></li>
                <li><Link href="/leagues/champions-league" className="hover:text-emerald-400 transition-colors">Champions League</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-5 text-white">{t('communityFooter')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/community" className="hover:text-emerald-400 transition-colors">{t('community')}</Link></li>
                <li><Link href="/community/global-chat" className="hover:text-emerald-400 transition-colors">{t('globalChat')}</Link></li>
                <li><Link href="/community/user-predictions" className="hover:text-emerald-400 transition-colors">{t('userPredictions')}</Link></li>
              </ul>
            </div>

            <div className="relative z-10">
              <h4 className="font-semibold mb-5 text-white">{t('company')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors inline-block">{t('aboutUs')}</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition-colors inline-block">{t('contact')}</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-400 transition-colors inline-block">{t('blog')}</Link></li>
              </ul>
            </div>

            <div className="relative z-10">
              <h4 className="font-semibold mb-5 text-white">{t('legal')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/terms-of-service" className="hover:text-emerald-400 transition-colors inline-block">{t('termsOfService')}</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors inline-block">{t('privacyPolicy')}</Link></li>
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
