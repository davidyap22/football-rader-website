import PrivacyPolicyClient from './PrivacyPolicyClient';
import { localeToTranslationCode, type Locale } from '@/i18n/config';

// Privacy Policy content translations - rendered server-side for SEO
const privacyContent: Record<string, {
  title: string;
  lastUpdated: string;
  sections: { title: string; text: string }[];
}> = {
  EN: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: January 2026",
    sections: [
      { title: "1. Introduction", text: "Welcome to OddsFlow. We are committed to protecting your privacy while you use our AI-driven sports analytics platform. This policy outlines how we handle your data to provide you with high-quality market intelligence and match forecasting insights." },
      { title: "2. Information We Collect", text: "We collect data to strictly optimize your experience on our SaaS dashboard: Account Information: Name, email, and login credentials necessary to access our premium data tools. Usage Data & Analytics: We track how you interact with our football analysis engine, including which leagues, teams, or market trends you search for most. This helps us refine our predictive algorithms. Transaction Data: Payment history for your subscription to our software. Note: We utilize secure third-party processors (e.g., Stripe) for billing. We do not store your full credit card details or bank information on our servers." },
      { title: "3. How We Use Your Information", text: "Your data fuels the OddsFlow ecosystem in the following ways: Service Delivery: To grant access to real-time odds monitoring and historical databases based on your subscription tier. Algorithm Improvement: We analyze aggregate user behavior to train our AI models and improve the accuracy of our data visualizations. Communication: To send you technical updates, new feature releases, or alerts regarding market anomalies (if opted in)." },
      { title: "4. Data Sharing & Third Parties", text: "We operate as a data technology provider, not a data broker. We do not sell your personal information. We share data only with: Infrastructure Providers: Hosting services and cloud computing platforms that power our big data processing. Payment Processors: To facilitate secure subscription billing. Legal Compliance: If required by law to protect the integrity of our service." },
      { title: "5. Cookies and Tracking Technologies", text: "We use cookies to analyze traffic on our sports data platform. These help us understand user demand for specific football statistics and optimize site performance. You can manage your cookie preferences in your browser settings." },
      { title: "6. Data Security", text: "We employ enterprise-grade security protocols, including SSL encryption, to protect your account and proprietary analysis preferences. While we strive to protect your digital footprint, no online analytics service is 100% immune to external threats." },
      { title: "7. Your Data Rights", text: "You retain full control over your personal profile. You may request to access, correct, or delete your account data. Please note that deleting your account will terminate access to our historical data archives and live analysis tools." },
      { title: "8. Third-Party Links", text: "Our platform may contain links to external sites. OddsFlow is not responsible for the privacy practices of other websites. We encourage users to read the privacy statements of any site that collects data." },
      { title: "9. Changes to This Policy", text: "As our AI technology evolves, we may update this policy. We will notify you of significant changes via email or a prominent notice on our dashboard." },
      { title: "10. Contact Us", text: "For inquiries regarding your data privacy or our analytics practices, please contact us at privacy@oddsflow.com." },
    ],
  },
  ES: {
    title: "Política de Privacidad",
    lastUpdated: "Última actualización: Enero 2026",
    sections: [
      { title: "1. Introducción", text: "Bienvenido a OddsFlow. Estamos comprometidos a proteger su privacidad mientras utiliza nuestra plataforma de análisis deportivo impulsada por IA. Esta política describe cómo manejamos sus datos para proporcionarle inteligencia de mercado de alta calidad e información de pronósticos de partidos." },
      { title: "2. Información que Recopilamos", text: "Recopilamos datos para optimizar estrictamente su experiencia en nuestro panel SaaS: Información de Cuenta: Nombre, correo electrónico y credenciales de inicio de sesión necesarias para acceder a nuestras herramientas de datos premium. Datos de Uso y Análisis: Rastreamos cómo interactúa con nuestro motor de análisis de fútbol, incluidas las ligas, equipos o tendencias de mercado que más busca. Esto nos ayuda a refinar nuestros algoritmos predictivos. Datos de Transacción: Historial de pagos de su suscripción a nuestro software. Nota: Utilizamos procesadores de terceros seguros (ej. Stripe) para la facturación. No almacenamos los detalles completos de su tarjeta de crédito o información bancaria en nuestros servidores." },
      { title: "3. Cómo Usamos su Información", text: "Sus datos impulsan el ecosistema de OddsFlow de las siguientes maneras: Entrega de Servicio: Para otorgar acceso al monitoreo de cuotas en tiempo real y bases de datos históricas según su nivel de suscripción. Mejora de Algoritmos: Analizamos el comportamiento agregado del usuario para entrenar nuestros modelos de IA y mejorar la precisión de nuestras visualizaciones de datos. Comunicación: Para enviarle actualizaciones técnicas, lanzamientos de nuevas funciones o alertas sobre anomalías del mercado (si optó por recibirlas)." },
      { title: "4. Compartir Datos y Terceros", text: "Operamos como un proveedor de tecnología de datos, no como un intermediario de datos. No vendemos su información personal. Compartimos datos solo con: Proveedores de Infraestructura: Servicios de alojamiento y plataformas de computación en la nube que impulsan nuestro procesamiento de big data. Procesadores de Pago: Para facilitar la facturación segura de suscripciones. Cumplimiento Legal: Si lo requiere la ley para proteger la integridad de nuestro servicio." },
      { title: "5. Cookies y Tecnologías de Seguimiento", text: "Utilizamos cookies para analizar el tráfico en nuestra plataforma de datos deportivos. Estas nos ayudan a comprender la demanda de los usuarios de estadísticas de fútbol específicas y optimizar el rendimiento del sitio. Puede administrar sus preferencias de cookies en la configuración de su navegador." },
      { title: "6. Seguridad de Datos", text: "Empleamos protocolos de seguridad de nivel empresarial, incluido el cifrado SSL, para proteger su cuenta y preferencias de análisis propietario. Aunque nos esforzamos por proteger su huella digital, ningún servicio de análisis en línea es 100% inmune a amenazas externas." },
      { title: "7. Sus Derechos de Datos", text: "Usted conserva el control total sobre su perfil personal. Puede solicitar acceder, corregir o eliminar los datos de su cuenta. Tenga en cuenta que eliminar su cuenta terminará el acceso a nuestros archivos de datos históricos y herramientas de análisis en vivo." },
      { title: "8. Enlaces de Terceros", text: "Nuestra plataforma puede contener enlaces a sitios externos. OddsFlow no es responsable de las prácticas de privacidad de otros sitios web. Animamos a los usuarios a leer las declaraciones de privacidad de cualquier sitio que recopile datos." },
      { title: "9. Cambios a Esta Política", text: "A medida que nuestra tecnología de IA evoluciona, podemos actualizar esta política. Le notificaremos sobre cambios significativos por correo electrónico o mediante un aviso destacado en nuestro panel." },
      { title: "10. Contáctenos", text: "Para consultas sobre la privacidad de sus datos o nuestras prácticas de análisis, contáctenos en privacy@oddsflow.com." },
    ],
  },
  PT: {
    title: "Política de Privacidade",
    lastUpdated: "Última atualização: Janeiro 2026",
    sections: [
      { title: "1. Introdução", text: "Bem-vindo ao OddsFlow. Estamos comprometidos em proteger sua privacidade enquanto você usa nossa plataforma de análise esportiva baseada em IA. Esta política descreve como tratamos seus dados para fornecer inteligência de mercado de alta qualidade e insights de previsão de partidas." },
      { title: "2. Informações que Coletamos", text: "Coletamos dados para otimizar estritamente sua experiência em nosso painel SaaS: Informações da Conta: Nome, e-mail e credenciais de login necessárias para acessar nossas ferramentas de dados premium. Dados de Uso e Análise: Rastreamos como você interage com nosso mecanismo de análise de futebol, incluindo quais ligas, times ou tendências de mercado você mais pesquisa. Isso nos ajuda a refinar nossos algoritmos preditivos. Dados de Transação: Histórico de pagamentos de sua assinatura do nosso software. Nota: Utilizamos processadores terceirizados seguros (ex. Stripe) para faturamento. Não armazenamos os detalhes completos do seu cartão de crédito ou informações bancárias em nossos servidores." },
      { title: "3. Como Usamos suas Informações", text: "Seus dados alimentam o ecossistema OddsFlow das seguintes maneiras: Entrega de Serviço: Para conceder acesso ao monitoramento de odds em tempo real e bancos de dados históricos com base no seu nível de assinatura. Melhoria de Algoritmos: Analisamos o comportamento agregado do usuário para treinar nossos modelos de IA e melhorar a precisão de nossas visualizações de dados. Comunicação: Para enviar atualizações técnicas, lançamentos de novos recursos ou alertas sobre anomalias de mercado (se você optou por receber)." },
      { title: "4. Compartilhamento de Dados e Terceiros", text: "Operamos como um provedor de tecnologia de dados, não como um corretor de dados. Não vendemos suas informações pessoais. Compartilhamos dados apenas com: Provedores de Infraestrutura: Serviços de hospedagem e plataformas de computação em nuvem que alimentam nosso processamento de big data. Processadores de Pagamento: Para facilitar o faturamento seguro de assinaturas. Conformidade Legal: Se exigido por lei para proteger a integridade do nosso serviço." },
      { title: "5. Cookies e Tecnologias de Rastreamento", text: "Usamos cookies para analisar o tráfego em nossa plataforma de dados esportivos. Eles nos ajudam a entender a demanda dos usuários por estatísticas específicas de futebol e otimizar o desempenho do site. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador." },
      { title: "6. Segurança de Dados", text: "Empregamos protocolos de segurança de nível empresarial, incluindo criptografia SSL, para proteger sua conta e preferências de análise proprietárias. Embora nos esforcemos para proteger sua pegada digital, nenhum serviço de análise online é 100% imune a ameaças externas." },
      { title: "7. Seus Direitos de Dados", text: "Você mantém controle total sobre seu perfil pessoal. Você pode solicitar acesso, correção ou exclusão dos dados da sua conta. Por favor, note que excluir sua conta encerrará o acesso aos nossos arquivos de dados históricos e ferramentas de análise ao vivo." },
      { title: "8. Links de Terceiros", text: "Nossa plataforma pode conter links para sites externos. OddsFlow não é responsável pelas práticas de privacidade de outros sites. Encorajamos os usuários a ler as declarações de privacidade de qualquer site que colete dados." },
      { title: "9. Alterações nesta Política", text: "À medida que nossa tecnologia de IA evolui, podemos atualizar esta política. Notificaremos você sobre mudanças significativas por e-mail ou um aviso destacado em nosso painel." },
      { title: "10. Entre em Contato", text: "Para dúvidas sobre a privacidade dos seus dados ou nossas práticas de análise, entre em contato em privacy@oddsflow.com." },
    ],
  },
  DE: {
    title: "Datenschutzerklärung",
    lastUpdated: "Letzte Aktualisierung: Januar 2026",
    sections: [
      { title: "1. Einführung", text: "Willkommen bei OddsFlow. Diese Datenschutzerklärung informiert Sie gemäß DSGVO (Datenschutz-Grundverordnung) darüber, wie wir Ihre personenbezogenen Daten auf unserer KI-gesteuerten Sportanalyseplattform verarbeiten. Wir sind dem Schutz Ihrer Privatsphäre verpflichtet und behandeln Ihre Daten mit höchster Sorgfalt, um Ihnen hochwertige Marktintelligenz und Spielprognose-Einblicke zu bieten." },
      { title: "2. Informationen, die wir sammeln", text: "Wir sammeln Daten, um Ihre Erfahrung auf unserem SaaS-Dashboard strikt zu optimieren: Kontoinformationen: Name, E-Mail und Anmeldedaten, die für den Zugriff auf unsere Premium-Datentools erforderlich sind. Nutzungsdaten und Analysen: Wir verfolgen, wie Sie mit unserer Fußballanalyse-Engine interagieren, einschließlich der Ligen, Teams oder Markttrends, nach denen Sie am häufigsten suchen. Dies hilft uns, unsere prädiktiven Algorithmen zu verfeinern. Transaktionsdaten: Zahlungsverlauf für Ihr Software-Abonnement. Hinweis: Wir nutzen sichere Drittanbieter-Prozessoren (z.B. Stripe) für die Abrechnung. Wir speichern keine vollständigen Kreditkartendaten oder Bankinformationen auf unseren Servern." },
      { title: "3. Wie wir Ihre Informationen verwenden", text: "Ihre Daten treiben das OddsFlow-Ökosystem folgendermaßen an: Servicebereitstellung: Um Zugang zur Echtzeit-Quotenüberwachung und historischen Datenbanken basierend auf Ihrer Abonnementstufe zu gewähren. Algorithmusverbesserung: Wir analysieren aggregiertes Nutzerverhalten, um unsere KI-Modelle zu trainieren und die Genauigkeit unserer Datenvisualisierungen zu verbessern. Kommunikation: Um Ihnen technische Updates, neue Feature-Releases oder Warnungen zu Marktanomalien zu senden (falls eingewilligt)." },
      { title: "4. Datenweitergabe und Dritte", text: "Wir agieren als Datentechnologie-Anbieter, nicht als Datenbroker. Wir verkaufen Ihre persönlichen Daten nicht. Wir teilen Daten nur mit: Infrastrukturanbietern: Hosting-Dienste und Cloud-Computing-Plattformen, die unsere Big-Data-Verarbeitung antreiben. Zahlungsabwicklern: Um eine sichere Abonnement-Abrechnung zu ermöglichen. Rechtliche Compliance: Falls gesetzlich erforderlich, um die Integrität unseres Dienstes zu schützen." },
      { title: "5. Cookies und Tracking-Technologien", text: "Wir verwenden Cookies zur Analyse des Traffics auf unserer Sportdatenplattform. Diese helfen uns, die Nutzernachfrage nach spezifischen Fußballstatistiken zu verstehen und die Website-Performance zu optimieren. Sie können Ihre Cookie-Einstellungen in Ihren Browsereinstellungen verwalten." },
      { title: "6. Datensicherheit", text: "Wir setzen Sicherheitsprotokolle auf Unternehmensniveau ein, einschließlich SSL-Verschlüsselung, um Ihr Konto und Ihre proprietären Analyseeinstellungen zu schützen. Obwohl wir bestrebt sind, Ihren digitalen Fußabdruck zu schützen, ist kein Online-Analysedienst zu 100% immun gegen externe Bedrohungen." },
      { title: "7. Ihre Datenrechte", text: "Sie behalten die volle Kontrolle über Ihr persönliches Profil. Sie können den Zugriff auf, die Korrektur oder Löschung Ihrer Kontodaten beantragen. Bitte beachten Sie, dass das Löschen Ihres Kontos den Zugang zu unseren historischen Datenarchiven und Live-Analysetools beendet." },
      { title: "8. Links zu Dritten", text: "Unsere Plattform kann Links zu externen Seiten enthalten. OddsFlow ist nicht verantwortlich für die Datenschutzpraktiken anderer Websites. Wir ermutigen Nutzer, die Datenschutzerklärungen jeder Seite zu lesen, die Daten sammelt." },
      { title: "9. Änderungen dieser Richtlinie", text: "Da sich unsere KI-Technologie weiterentwickelt, können wir diese Richtlinie aktualisieren. Wir werden Sie über wesentliche Änderungen per E-Mail oder durch einen auffälligen Hinweis auf unserem Dashboard informieren." },
      { title: "10. Kontaktieren Sie uns", text: "Bei Fragen zu Ihrer Datenprivatsphäre oder unseren Analysepraktiken kontaktieren Sie uns unter privacy@oddsflow.com." },
    ],
  },
  FR: {
    title: "Politique de Confidentialité",
    lastUpdated: "Dernière mise à jour: Janvier 2026",
    sections: [
      { title: "1. Introduction", text: "Bienvenue chez OddsFlow. Nous nous engageons à protéger votre vie privée lorsque vous utilisez notre plateforme d'analyse sportive basée sur l'IA. Cette politique décrit comment nous traitons vos données pour vous fournir une intelligence de marché de haute qualité et des informations de prévision de matchs." },
      { title: "2. Informations que nous collectons", text: "Nous collectons des données pour optimiser strictement votre expérience sur notre tableau de bord SaaS : Informations de compte : Nom, e-mail et identifiants de connexion nécessaires pour accéder à nos outils de données premium. Données d'utilisation et d'analyse : Nous suivons la façon dont vous interagissez avec notre moteur d'analyse de football, y compris les ligues, équipes ou tendances du marché que vous recherchez le plus. Cela nous aide à affiner nos algorithmes prédictifs. Données de transaction : Historique des paiements pour votre abonnement à notre logiciel. Remarque : Nous utilisons des processeurs tiers sécurisés (ex. Stripe) pour la facturation. Nous ne stockons pas vos informations complètes de carte de crédit ou bancaires sur nos serveurs." },
      { title: "3. Comment nous utilisons vos informations", text: "Vos données alimentent l'écosystème OddsFlow de plusieurs façons : Fourniture de service : Pour accorder l'accès à la surveillance des cotes en temps réel et aux bases de données historiques selon votre niveau d'abonnement. Amélioration des algorithmes : Nous analysons le comportement agrégé des utilisateurs pour entraîner nos modèles d'IA et améliorer la précision de nos visualisations de données. Communication : Pour vous envoyer des mises à jour techniques, des lancements de nouvelles fonctionnalités ou des alertes concernant les anomalies du marché (si vous avez opté pour les recevoir)." },
      { title: "4. Partage de données et tiers", text: "Nous opérons en tant que fournisseur de technologie de données, pas en tant que courtier en données. Nous ne vendons pas vos informations personnelles. Nous partageons des données uniquement avec : Fournisseurs d'infrastructure : Services d'hébergement et plateformes de cloud computing qui alimentent notre traitement de big data. Processeurs de paiement : Pour faciliter la facturation sécurisée des abonnements. Conformité légale : Si la loi l'exige pour protéger l'intégrité de notre service." },
      { title: "5. Cookies et technologies de suivi", text: "Nous utilisons des cookies pour analyser le trafic sur notre plateforme de données sportives. Ceux-ci nous aident à comprendre la demande des utilisateurs pour des statistiques de football spécifiques et à optimiser les performances du site. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur." },
      { title: "6. Sécurité des données", text: "Nous employons des protocoles de sécurité de niveau entreprise, y compris le cryptage SSL, pour protéger votre compte et vos préférences d'analyse propriétaires. Bien que nous nous efforcions de protéger votre empreinte numérique, aucun service d'analyse en ligne n'est 100% immunisé contre les menaces externes." },
      { title: "7. Vos droits sur les données", text: "Vous conservez le contrôle total de votre profil personnel. Vous pouvez demander l'accès, la correction ou la suppression de vos données de compte. Veuillez noter que la suppression de votre compte mettra fin à l'accès à nos archives de données historiques et outils d'analyse en direct." },
      { title: "8. Liens vers des tiers", text: "Notre plateforme peut contenir des liens vers des sites externes. OddsFlow n'est pas responsable des pratiques de confidentialité d'autres sites web. Nous encourageons les utilisateurs à lire les déclarations de confidentialité de tout site qui collecte des données." },
      { title: "9. Modifications de cette politique", text: "À mesure que notre technologie d'IA évolue, nous pouvons mettre à jour cette politique. Nous vous informerons des changements significatifs par e-mail ou par un avis visible sur notre tableau de bord." },
      { title: "10. Contactez-nous", text: "Pour toute question concernant la confidentialité de vos données ou nos pratiques d'analyse, contactez-nous à privacy@oddsflow.com." },
    ],
  },
  JA: {
    title: "プライバシーポリシー",
    lastUpdated: "最終更新：2026年1月",
    sections: [
      { title: "1. はじめに", text: "OddsFlowへようこそ。当社のAI駆動スポーツ分析プラットフォームをご利用いただく際、お客様のプライバシー保護に努めております。本ポリシーでは、高品質な市場インテリジェンスと試合予測インサイトを提供するために、お客様のデータをどのように取り扱うかについて説明します。" },
      { title: "2. 収集する情報", text: "SaaSダッシュボードでのエクスペリエンスを最適化するためにデータを収集します：アカウント情報：プレミアムデータツールにアクセスするために必要な名前、メールアドレス、ログイン資格情報。利用データと分析：サッカー分析エンジンとのインタラクション、最も検索するリーグ、チーム、市場トレンドを追跡します。これにより予測アルゴリズムを改善できます。取引データ：ソフトウェアサブスクリプションの支払い履歴。注意：請求には安全なサードパーティプロセッサ（例：Stripe）を使用しています。クレジットカードの完全な詳細や銀行情報はサーバーに保存しません。" },
      { title: "3. 情報の利用方法", text: "お客様のデータは以下の方法でOddsFlowエコシステムを支えています：サービス提供：サブスクリプションレベルに基づいて、リアルタイムオッズモニタリングと履歴データベースへのアクセスを付与します。アルゴリズム改善：集約されたユーザー行動を分析してAIモデルをトレーニングし、データ可視化の精度を向上させます。コミュニケーション：技術更新、新機能リリース、市場異常に関するアラートをお送りします（オプトインの場合）。" },
      { title: "4. データ共有と第三者", text: "当社はデータテクノロジープロバイダーであり、データブローカーではありません。個人情報を販売することはありません。データは以下とのみ共有します：インフラストラクチャプロバイダー：ビッグデータ処理を支えるホスティングサービスとクラウドコンピューティングプラットフォーム。決済プロセッサ：安全なサブスクリプション請求を促進するため。法的遵守：サービスの完全性を保護するために法律で要求される場合。" },
      { title: "5. Cookieとトラッキング技術", text: "スポーツデータプラットフォームのトラフィックを分析するためにCookieを使用しています。これにより、特定のサッカー統計に対するユーザー需要を理解し、サイトパフォーマンスを最適化できます。ブラウザ設定でCookie設定を管理できます。" },
      { title: "6. データセキュリティ", text: "SSL暗号化を含むエンタープライズグレードのセキュリティプロトコルを採用し、アカウントと独自の分析設定を保護しています。デジタルフットプリントの保護に努めていますが、オンライン分析サービスは外部の脅威に100%免疫があるわけではありません。" },
      { title: "7. データに関する権利", text: "個人プロファイルの完全な管理権を保持しています。アカウントデータへのアクセス、修正、削除を要求できます。アカウントを削除すると、履歴データアーカイブとライブ分析ツールへのアクセスが終了することにご注意ください。" },
      { title: "8. 第三者リンク", text: "当社のプラットフォームには外部サイトへのリンクが含まれる場合があります。OddsFlowは他のウェブサイトのプライバシー慣行について責任を負いません。データを収集するサイトのプライバシーステートメントを読むことをお勧めします。" },
      { title: "9. 本ポリシーの変更", text: "AI技術の進化に伴い、本ポリシーを更新する場合があります。重要な変更についてはメールまたはダッシュボード上の目立つ通知でお知らせします。" },
      { title: "10. お問い合わせ", text: "データプライバシーまたは分析慣行に関するお問い合わせは、privacy@oddsflow.comまでご連絡ください。" },
    ],
  },
  KO: {
    title: "개인정보 처리방침",
    lastUpdated: "최종 업데이트: 2026년 1월",
    sections: [
      { title: "1. 소개", text: "OddsFlow에 오신 것을 환영합니다. AI 기반 스포츠 분석 플랫폼을 이용하시는 동안 고객님의 개인정보 보호에 최선을 다하고 있습니다. 본 정책은 고품질의 시장 인텔리전스와 경기 예측 인사이트를 제공하기 위해 고객님의 데이터를 어떻게 처리하는지 설명합니다." },
      { title: "2. 수집하는 정보", text: "SaaS 대시보드에서의 경험을 최적화하기 위해 데이터를 수집합니다: 계정 정보: 프리미엄 데이터 도구에 접근하는 데 필요한 이름, 이메일, 로그인 자격 증명. 이용 데이터 및 분석: 축구 분석 엔진과의 상호작용, 가장 많이 검색하는 리그, 팀 또는 시장 트렌드를 추적합니다. 이를 통해 예측 알고리즘을 개선합니다. 거래 데이터: 소프트웨어 구독 결제 내역. 참고: 청구를 위해 보안 제3자 처리업체(예: Stripe)를 이용합니다. 신용카드 전체 정보나 은행 정보는 서버에 저장하지 않습니다." },
      { title: "3. 정보 이용 방법", text: "고객님의 데이터는 다음과 같이 OddsFlow 생태계를 지원합니다: 서비스 제공: 구독 등급에 따라 실시간 배당률 모니터링 및 과거 데이터베이스에 대한 액세스 권한 부여. 알고리즘 개선: 집계된 사용자 행동을 분석하여 AI 모델을 훈련하고 데이터 시각화의 정확도를 향상시킵니다. 커뮤니케이션: 기술 업데이트, 새 기능 출시 또는 시장 이상에 관한 알림 전송(옵트인한 경우)." },
      { title: "4. 데이터 공유 및 제3자", text: "당사는 데이터 기술 제공업체이지 데이터 브로커가 아닙니다. 개인 정보를 판매하지 않습니다. 다음과만 데이터를 공유합니다: 인프라 제공업체: 빅 데이터 처리를 지원하는 호스팅 서비스 및 클라우드 컴퓨팅 플랫폼. 결제 처리업체: 안전한 구독 청구를 용이하게 하기 위해. 법적 준수: 서비스의 무결성을 보호하기 위해 법률에서 요구하는 경우." },
      { title: "5. 쿠키 및 추적 기술", text: "스포츠 데이터 플랫폼의 트래픽을 분석하기 위해 쿠키를 사용합니다. 이를 통해 특정 축구 통계에 대한 사용자 수요를 이해하고 사이트 성능을 최적화할 수 있습니다. 브라우저 설정에서 쿠키 기본 설정을 관리할 수 있습니다." },
      { title: "6. 데이터 보안", text: "SSL 암호화를 포함한 엔터프라이즈급 보안 프로토콜을 사용하여 계정과 독점 분석 기본 설정을 보호합니다. 디지털 발자국을 보호하기 위해 노력하지만, 어떤 온라인 분석 서비스도 외부 위협에 100% 면역이 있는 것은 아닙니다." },
      { title: "7. 데이터 권리", text: "개인 프로필에 대한 완전한 통제권을 유지합니다. 계정 데이터에 대한 액세스, 수정 또는 삭제를 요청할 수 있습니다. 계정을 삭제하면 과거 데이터 아카이브 및 라이브 분석 도구에 대한 액세스가 종료된다는 점에 유의하세요." },
      { title: "8. 제3자 링크", text: "당사 플랫폼에는 외부 사이트에 대한 링크가 포함될 수 있습니다. OddsFlow는 다른 웹사이트의 개인정보 보호 관행에 대해 책임지지 않습니다. 데이터를 수집하는 모든 사이트의 개인정보 보호 정책을 읽어보시기를 권장합니다." },
      { title: "9. 본 정책의 변경", text: "AI 기술이 발전함에 따라 본 정책을 업데이트할 수 있습니다. 중요한 변경 사항은 이메일 또는 대시보드의 눈에 띄는 공지를 통해 알려드립니다." },
      { title: "10. 문의하기", text: "데이터 개인정보 보호 또는 분석 관행에 관한 문의 사항은 privacy@oddsflow.com으로 연락해 주세요." },
    ],
  },
  '中文': {
    title: "隐私政策",
    lastUpdated: "最后更新：2026年1月",
    sections: [
      { title: "1. 介绍", text: "欢迎来到 OddsFlow。在您使用我们的 AI 驱动的体育分析平台时，我们致力于保护您的隐私。本政策概述了我们如何处理您的数据，以为您提供高质量的市场情报和比赛预测洞察。" },
      { title: "2. 我们收集的信息", text: "我们收集数据以严格优化您在 SaaS 仪表板上的体验：账户信息：访问我们高级数据工具所需的姓名、电子邮件和登录凭据。使用数据和分析：我们跟踪您如何与足球分析引擎互动，包括您最常搜索的联赛、球队或市场趋势。这有助于我们改进预测算法。交易数据：您订阅我们软件的付款历史。注意：我们使用安全的第三方处理器（如 Stripe）进行计费。我们不会在服务器上存储您的完整信用卡详情或银行信息。" },
      { title: "3. 我们如何使用您的信息", text: "您的数据以以下方式为 OddsFlow 生态系统提供动力：服务交付：根据您的订阅级别授予对实时赔率监控和历史数据库的访问权限。算法改进：我们分析聚合用户行为来训练我们的 AI 模型并提高数据可视化的准确性。通信：向您发送技术更新、新功能发布或市场异常警报（如果您选择接收）。" },
      { title: "4. 数据共享和第三方", text: "我们作为数据技术提供商运营，而非数据经纪人。我们不出售您的个人信息。我们仅与以下方共享数据：基础设施提供商：为我们的大数据处理提供支持的托管服务和云计算平台。支付处理商：为了促进安全的订阅计费。法律合规：如果法律要求保护我们服务的完整性。" },
      { title: "5. Cookie 和跟踪技术", text: "我们使用 Cookie 来分析体育数据平台上的流量。这些帮助我们了解用户对特定足球统计数据的需求，并优化网站性能。您可以在浏览器设置中管理您的 Cookie 偏好。" },
      { title: "6. 数据安全", text: "我们采用企业级安全协议（包括 SSL 加密）来保护您的帐户和专有分析偏好。虽然我们努力保护您的数字足迹，但没有任何在线分析服务能 100% 免受外部威胁。" },
      { title: "7. 您的数据权利", text: "您对个人资料保有完全控制权。您可以请求访问、更正或删除您的帐户数据。请注意，删除您的帐户将终止对我们历史数据档案和实时分析工具的访问。" },
      { title: "8. 第三方链接", text: "我们的平台可能包含指向外部网站的链接。OddsFlow 不对其他网站的隐私做法负责。我们鼓励用户阅读任何收集数据的网站的隐私声明。" },
      { title: "9. 本政策的变更", text: "随着我们的 AI 技术的发展，我们可能会更新本政策。我们将通过电子邮件或在仪表板上发布显著通知来通知您重大变更。" },
      { title: "10. 联系我们", text: "有关数据隐私或我们的分析实践的咨询，请通过 privacy@oddsflow.com 联系我们。" },
    ],
  },
  '繁體': {
    title: "隱私政策",
    lastUpdated: "最後更新：2026年1月",
    sections: [
      { title: "1. 介紹", text: "歡迎來到 OddsFlow。在您使用我們的 AI 驅動的體育分析平台時，我們致力於保護您的隱私。本政策概述了我們如何處理您的數據，以為您提供高品質的市場情報和比賽預測洞察。" },
      { title: "2. 我們收集的資訊", text: "我們收集數據以嚴格優化您在 SaaS 儀表板上的體驗：帳戶資訊：存取我們高級數據工具所需的姓名、電子郵件和登入憑據。使用數據和分析：我們追蹤您如何與足球分析引擎互動，包括您最常搜尋的聯賽、球隊或市場趨勢。這有助於我們改進預測演算法。交易數據：您訂閱我們軟體的付款歷史。注意：我們使用安全的第三方處理器（如 Stripe）進行計費。我們不會在伺服器上儲存您的完整信用卡詳情或銀行資訊。" },
      { title: "3. 我們如何使用您的資訊", text: "您的數據以以下方式為 OddsFlow 生態系統提供動力：服務交付：根據您的訂閱級別授予對即時賠率監控和歷史資料庫的存取權限。演算法改進：我們分析聚合用戶行為來訓練我們的 AI 模型並提高數據視覺化的準確性。通訊：向您發送技術更新、新功能發布或市場異常警報（如果您選擇接收）。" },
      { title: "4. 數據共享和第三方", text: "我們作為數據技術提供商運營，而非數據經紀人。我們不出售您的個人資訊。我們僅與以下方共享數據：基礎設施提供商：為我們的大數據處理提供支援的託管服務和雲端運算平台。支付處理商：為了促進安全的訂閱計費。法律合規：如果法律要求保護我們服務的完整性。" },
      { title: "5. Cookie 和追蹤技術", text: "我們使用 Cookie 來分析體育數據平台上的流量。這些幫助我們了解用戶對特定足球統計數據的需求，並優化網站效能。您可以在瀏覽器設定中管理您的 Cookie 偏好。" },
      { title: "6. 數據安全", text: "我們採用企業級安全協議（包括 SSL 加密）來保護您的帳戶和專有分析偏好。雖然我們努力保護您的數位足跡，但沒有任何線上分析服務能 100% 免受外部威脅。" },
      { title: "7. 您的數據權利", text: "您對個人資料保有完全控制權。您可以請求存取、更正或刪除您的帳戶數據。請注意，刪除您的帳戶將終止對我們歷史數據檔案和即時分析工具的存取。" },
      { title: "8. 第三方連結", text: "我們的平台可能包含指向外部網站的連結。OddsFlow 不對其他網站的隱私做法負責。我們鼓勵用戶閱讀任何收集數據的網站的隱私聲明。" },
      { title: "9. 本政策的變更", text: "隨著我們的 AI 技術的發展，我們可能會更新本政策。我們將通過電子郵件或在儀表板上發布顯著通知來通知您重大變更。" },
      { title: "10. 聯繫我們", text: "有關數據隱私或我們的分析實踐的諮詢，請透過 privacy@oddsflow.com 聯繫我們。" },
    ],
  },
  ID: {
    title: "Kebijakan Privasi",
    lastUpdated: "Terakhir Diperbarui: Januari 2026",
    sections: [
      { title: "1. Pendahuluan", text: "Selamat datang di OddsFlow. Kami berkomitmen untuk melindungi privasi Anda saat menggunakan platform analitik olahraga berbasis AI kami. Kebijakan ini menguraikan bagaimana kami menangani data Anda untuk memberikan intelijen pasar berkualitas tinggi dan wawasan perkiraan pertandingan." },
      { title: "2. Informasi yang Kami Kumpulkan", text: "Kami mengumpulkan data untuk mengoptimalkan pengalaman Anda secara ketat di dasbor SaaS kami: Informasi Akun: Nama, email, dan kredensial login yang diperlukan untuk mengakses alat data premium kami. Data Penggunaan & Analitik: Kami melacak bagaimana Anda berinteraksi dengan mesin analisis sepak bola kami, termasuk liga, tim, atau tren pasar yang paling sering Anda cari. Ini membantu kami memperbaiki algoritma prediktif kami. Data Transaksi: Riwayat pembayaran untuk langganan perangkat lunak Anda. Catatan: Kami menggunakan prosesor pihak ketiga yang aman (misalnya Stripe) untuk penagihan. Kami tidak menyimpan detail lengkap kartu kredit atau informasi bank Anda di server kami." },
      { title: "3. Bagaimana Kami Menggunakan Informasi Anda", text: "Data Anda mendukung ekosistem OddsFlow dengan cara berikut: Penyampaian Layanan: Untuk memberikan akses ke pemantauan odds real-time dan database historis berdasarkan tingkat langganan Anda. Peningkatan Algoritma: Kami menganalisis perilaku pengguna agregat untuk melatih model AI kami dan meningkatkan akurasi visualisasi data kami. Komunikasi: Untuk mengirimkan pembaruan teknis, rilis fitur baru, atau peringatan mengenai anomali pasar (jika Anda memilih)." },
      { title: "4. Berbagi Data & Pihak Ketiga", text: "Kami beroperasi sebagai penyedia teknologi data, bukan broker data. Kami tidak menjual informasi pribadi Anda. Kami hanya berbagi data dengan: Penyedia Infrastruktur: Layanan hosting dan platform komputasi awan yang mendukung pemrosesan big data kami. Pemroses Pembayaran: Untuk memfasilitasi penagihan langganan yang aman. Kepatuhan Hukum: Jika diwajibkan oleh hukum untuk melindungi integritas layanan kami." },
      { title: "5. Cookie dan Teknologi Pelacakan", text: "Kami menggunakan cookie untuk menganalisis lalu lintas di platform data olahraga kami. Ini membantu kami memahami permintaan pengguna untuk statistik sepak bola tertentu dan mengoptimalkan kinerja situs. Anda dapat mengelola preferensi cookie di pengaturan browser Anda." },
      { title: "6. Keamanan Data", text: "Kami menggunakan protokol keamanan tingkat enterprise, termasuk enkripsi SSL, untuk melindungi akun dan preferensi analisis kepemilikan Anda. Meskipun kami berusaha melindungi jejak digital Anda, tidak ada layanan analitik online yang 100% kebal terhadap ancaman eksternal." },
      { title: "7. Hak Data Anda", text: "Anda mempertahankan kontrol penuh atas profil pribadi Anda. Anda dapat meminta untuk mengakses, memperbaiki, atau menghapus data akun Anda. Harap dicatat bahwa menghapus akun Anda akan mengakhiri akses ke arsip data historis dan alat analisis langsung kami." },
      { title: "8. Tautan Pihak Ketiga", text: "Platform kami mungkin berisi tautan ke situs eksternal. OddsFlow tidak bertanggung jawab atas praktik privasi situs web lain. Kami mendorong pengguna untuk membaca pernyataan privasi dari situs mana pun yang mengumpulkan data." },
      { title: "9. Perubahan Kebijakan Ini", text: "Seiring perkembangan teknologi AI kami, kami mungkin memperbarui kebijakan ini. Kami akan memberi tahu Anda tentang perubahan signifikan melalui email atau pemberitahuan yang menonjol di dasbor kami." },
      { title: "10. Hubungi Kami", text: "Untuk pertanyaan mengenai privasi data Anda atau praktik analitik kami, silakan hubungi kami di privacy@oddsflow.com." },
    ],
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const langCode = localeToTranslationCode[locale as Locale] || 'EN';
  const content = privacyContent[langCode] || privacyContent.EN;

  // WebPage Schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": content.title,
    "description": "OddsFlow Privacy Policy. Learn how we collect, use, and protect your personal data on our AI-powered football analytics platform.",
    "url": `https://www.oddsflow.ai${locale === 'en' ? '' : `/${locale}`}/privacy-policy`,
    "inLanguage": locale,
    "isPartOf": {
      "@type": "WebSite",
      "name": "OddsFlow",
      "url": "https://www.oddsflow.ai"
    },
    "about": {
      "@type": "Thing",
      "name": "Privacy Policy",
      "description": "Data privacy and protection policy for OddsFlow users"
    },
    "dateModified": "2026-01-01",
    "publisher": {
      "@type": "Organization",
      "name": "OddsFlow",
      "url": "https://www.oddsflow.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.oddsflow.ai/homepage/OddsFlow Logo2.png"
      }
    }
  };

  return (
    <>
      {/* Schema for SEO - outside client component */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/*
        SEO Content Block - Visible semantic HTML for crawlers
        Uses CSS clip-rect which is more crawler-friendly than position:absolute
        This content is accessible to screen readers and crawlers
      */}
      <article
        id="privacy-policy-content"
        className="[clip:rect(0,0,0,0)] [clip-path:inset(50%)] h-px w-px overflow-hidden absolute whitespace-nowrap"
        aria-label={content.title}
      >
        <h1>{content.title}</h1>
        <p>{content.lastUpdated}</p>
        {content.sections.map((section, index) => (
          <section key={index}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </article>

      {/* Fallback for noscript environments */}
      <noscript>
        <style>{`#privacy-policy-content { clip: auto !important; clip-path: none !important; height: auto !important; width: auto !important; position: static !important; overflow: visible !important; white-space: normal !important; padding: 2rem; max-width: 800px; margin: 0 auto; }`}</style>
      </noscript>

      <PrivacyPolicyClient locale={locale}>
        {/* Main Content - Server Side Rendered */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {content.title}
            </h1>
            <p className="text-gray-500 mb-12">{content.lastUpdated}</p>

            <div className="space-y-8">
              {content.sections.map((section, index) => (
                <div key={index} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold mb-3 text-emerald-400">{section.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{section.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PrivacyPolicyClient>
    </>
  );
}
