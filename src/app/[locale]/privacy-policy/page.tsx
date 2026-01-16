'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeToTranslationCode, type Locale } from '@/i18n/config';

const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started",
    title: "Privacy Policy",
    lastUpdated: "Last Updated: January 2025",
    section1Title: "1. Introduction",
    section1Text: "Welcome to OddsFlow. We are committed to protecting your privacy while you use our AI-driven sports analytics platform. This policy outlines how we handle your data to provide you with high-quality market intelligence and match forecasting insights.",
    section2Title: "2. Information We Collect",
    section2Text: "We collect data to strictly optimize your experience on our SaaS dashboard: Account Information: Name, email, and login credentials necessary to access our premium data tools. Usage Data & Analytics: We track how you interact with our football analysis engine, including which leagues, teams, or market trends you search for most. This helps us refine our predictive algorithms. Transaction Data: Payment history for your subscription to our software. Note: We utilize secure third-party processors (e.g., Stripe) for billing. We do not store your full credit card details or bank information on our servers.",
    section3Title: "3. How We Use Your Information",
    section3Text: "Your data fuels the OddsFlow ecosystem in the following ways: Service Delivery: To grant access to real-time odds monitoring and historical databases based on your subscription tier. Algorithm Improvement: We analyze aggregate user behavior to train our AI models and improve the accuracy of our data visualizations. Communication: To send you technical updates, new feature releases, or alerts regarding market anomalies (if opted in).",
    section4Title: "4. Data Sharing & Third Parties",
    section4Text: "We operate as a data technology provider, not a data broker. We do not sell your personal information. We share data only with: Infrastructure Providers: Hosting services and cloud computing platforms that power our big data processing. Payment Processors: To facilitate secure subscription billing. Legal Compliance: If required by law to protect the integrity of our service.",
    section5Title: "5. Cookies and Tracking Technologies",
    section5Text: "We use cookies to analyze traffic on our sports data platform. These help us understand user demand for specific football statistics and optimize site performance. You can manage your cookie preferences in your browser settings.",
    section6Title: "6. Data Security",
    section6Text: "We employ enterprise-grade security protocols, including SSL encryption, to protect your account and proprietary analysis preferences. While we strive to protect your digital footprint, no online analytics service is 100% immune to external threats.",
    section7Title: "7. Your Data Rights",
    section7Text: "You retain full control over your personal profile. You may request to access, correct, or delete your account data. Please note that deleting your account will terminate access to our historical data archives and live analysis tools.",
    section8Title: "8. Third-Party Links",
    section8Text: "Our platform may contain links to external sites. OddsFlow is not responsible for the privacy practices of other websites. We encourage users to read the privacy statements of any site that collects data.",
    section9Title: "9. Changes to This Policy",
    section9Text: "As our AI technology evolves, we may update this policy. We will notify you of significant changes via email or a prominent notice on our dashboard.",
    section10Title: "10. Contact Us",
    section10Text: "For inquiries regarding your data privacy or our analytics practices, please contact us at privacy@oddsflow.com.",
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
    responsibleGaming: "Responsible Gaming",
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
    section1Title: "1. Introducción",
    section1Text: "Bienvenido a OddsFlow. Estamos comprometidos a proteger su privacidad mientras utiliza nuestra plataforma de análisis deportivo impulsada por IA. Esta política describe cómo manejamos sus datos para proporcionarle inteligencia de mercado de alta calidad e información de pronósticos de partidos.",
    section2Title: "2. Información que Recopilamos",
    section2Text: "Recopilamos datos para optimizar estrictamente su experiencia en nuestro panel SaaS: Información de Cuenta: Nombre, correo electrónico y credenciales de inicio de sesión necesarias para acceder a nuestras herramientas de datos premium. Datos de Uso y Análisis: Rastreamos cómo interactúa con nuestro motor de análisis de fútbol, incluidas las ligas, equipos o tendencias de mercado que más busca. Esto nos ayuda a refinar nuestros algoritmos predictivos. Datos de Transacción: Historial de pagos de su suscripción a nuestro software. Nota: Utilizamos procesadores de terceros seguros (ej. Stripe) para la facturación. No almacenamos los detalles completos de su tarjeta de crédito o información bancaria en nuestros servidores.",
    section3Title: "3. Cómo Usamos su Información",
    section3Text: "Sus datos impulsan el ecosistema de OddsFlow de las siguientes maneras: Entrega de Servicio: Para otorgar acceso al monitoreo de cuotas en tiempo real y bases de datos históricas según su nivel de suscripción. Mejora de Algoritmos: Analizamos el comportamiento agregado del usuario para entrenar nuestros modelos de IA y mejorar la precisión de nuestras visualizaciones de datos. Comunicación: Para enviarle actualizaciones técnicas, lanzamientos de nuevas funciones o alertas sobre anomalías del mercado (si optó por recibirlas).",
    section4Title: "4. Compartir Datos y Terceros",
    section4Text: "Operamos como un proveedor de tecnología de datos, no como un intermediario de datos. No vendemos su información personal. Compartimos datos solo con: Proveedores de Infraestructura: Servicios de alojamiento y plataformas de computación en la nube que impulsan nuestro procesamiento de big data. Procesadores de Pago: Para facilitar la facturación segura de suscripciones. Cumplimiento Legal: Si lo requiere la ley para proteger la integridad de nuestro servicio.",
    section5Title: "5. Cookies y Tecnologías de Seguimiento",
    section5Text: "Utilizamos cookies para analizar el tráfico en nuestra plataforma de datos deportivos. Estas nos ayudan a comprender la demanda de los usuarios de estadísticas de fútbol específicas y optimizar el rendimiento del sitio. Puede administrar sus preferencias de cookies en la configuración de su navegador.",
    section6Title: "6. Seguridad de Datos",
    section6Text: "Empleamos protocolos de seguridad de nivel empresarial, incluido el cifrado SSL, para proteger su cuenta y preferencias de análisis propietario. Aunque nos esforzamos por proteger su huella digital, ningún servicio de análisis en línea es 100% inmune a amenazas externas.",
    section7Title: "7. Sus Derechos de Datos",
    section7Text: "Usted conserva el control total sobre su perfil personal. Puede solicitar acceder, corregir o eliminar los datos de su cuenta. Tenga en cuenta que eliminar su cuenta terminará el acceso a nuestros archivos de datos históricos y herramientas de análisis en vivo.",
    section8Title: "8. Enlaces de Terceros",
    section8Text: "Nuestra plataforma puede contener enlaces a sitios externos. OddsFlow no es responsable de las prácticas de privacidad de otros sitios web. Animamos a los usuarios a leer las declaraciones de privacidad de cualquier sitio que recopile datos.",
    section9Title: "9. Cambios a Esta Política",
    section9Text: "A medida que nuestra tecnología de IA evoluciona, podemos actualizar esta política. Le notificaremos sobre cambios significativos por correo electrónico o mediante un aviso destacado en nuestro panel.",
    section10Title: "10. Contáctenos",
    section10Text: "Para consultas sobre la privacidad de sus datos o nuestras prácticas de análisis, contáctenos en privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Todos los derechos reservados.",
    footerDesc: "Análisis de cuotas de fútbol impulsado por IA para predicciones más inteligentes.",
    product: "Producto", liveOdds: "Rendimiento IA", solution: "Solución",
    company: "Empresa", aboutUs: "Sobre Nosotros", blog: "Blog", contact: "Contacto",
    legal: "Legal", privacyPolicy: "Política de Privacidad", termsOfService: "Términos de Servicio",
    responsibleGaming: "Juego Responsable",
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
    section1Title: "1. Introdução",
    section1Text: "Bem-vindo ao OddsFlow. Estamos comprometidos em proteger sua privacidade enquanto você usa nossa plataforma de análise esportiva baseada em IA. Esta política descreve como tratamos seus dados para fornecer inteligência de mercado de alta qualidade e insights de previsão de partidas.",
    section2Title: "2. Informações que Coletamos",
    section2Text: "Coletamos dados para otimizar estritamente sua experiência em nosso painel SaaS: Informações da Conta: Nome, e-mail e credenciais de login necessárias para acessar nossas ferramentas de dados premium. Dados de Uso e Análise: Rastreamos como você interage com nosso mecanismo de análise de futebol, incluindo quais ligas, times ou tendências de mercado você mais pesquisa. Isso nos ajuda a refinar nossos algoritmos preditivos. Dados de Transação: Histórico de pagamentos de sua assinatura do nosso software. Nota: Utilizamos processadores terceirizados seguros (ex. Stripe) para faturamento. Não armazenamos os detalhes completos do seu cartão de crédito ou informações bancárias em nossos servidores.",
    section3Title: "3. Como Usamos suas Informações",
    section3Text: "Seus dados alimentam o ecossistema OddsFlow das seguintes maneiras: Entrega de Serviço: Para conceder acesso ao monitoramento de odds em tempo real e bancos de dados históricos com base no seu nível de assinatura. Melhoria de Algoritmos: Analisamos o comportamento agregado do usuário para treinar nossos modelos de IA e melhorar a precisão de nossas visualizações de dados. Comunicação: Para enviar atualizações técnicas, lançamentos de novos recursos ou alertas sobre anomalias de mercado (se você optou por receber).",
    section4Title: "4. Compartilhamento de Dados e Terceiros",
    section4Text: "Operamos como um provedor de tecnologia de dados, não como um corretor de dados. Não vendemos suas informações pessoais. Compartilhamos dados apenas com: Provedores de Infraestrutura: Serviços de hospedagem e plataformas de computação em nuvem que alimentam nosso processamento de big data. Processadores de Pagamento: Para facilitar o faturamento seguro de assinaturas. Conformidade Legal: Se exigido por lei para proteger a integridade do nosso serviço.",
    section5Title: "5. Cookies e Tecnologias de Rastreamento",
    section5Text: "Usamos cookies para analisar o tráfego em nossa plataforma de dados esportivos. Eles nos ajudam a entender a demanda dos usuários por estatísticas específicas de futebol e otimizar o desempenho do site. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.",
    section6Title: "6. Segurança de Dados",
    section6Text: "Empregamos protocolos de segurança de nível empresarial, incluindo criptografia SSL, para proteger sua conta e preferências de análise proprietárias. Embora nos esforcemos para proteger sua pegada digital, nenhum serviço de análise online é 100% imune a ameaças externas.",
    section7Title: "7. Seus Direitos de Dados",
    section7Text: "Você mantém controle total sobre seu perfil pessoal. Você pode solicitar acesso, correção ou exclusão dos dados da sua conta. Por favor, note que excluir sua conta encerrará o acesso aos nossos arquivos de dados históricos e ferramentas de análise ao vivo.",
    section8Title: "8. Links de Terceiros",
    section8Text: "Nossa plataforma pode conter links para sites externos. OddsFlow não é responsável pelas práticas de privacidade de outros sites. Encorajamos os usuários a ler as declarações de privacidade de qualquer site que colete dados.",
    section9Title: "9. Alterações nesta Política",
    section9Text: "À medida que nossa tecnologia de IA evolui, podemos atualizar esta política. Notificaremos você sobre mudanças significativas por e-mail ou um aviso destacado em nosso painel.",
    section10Title: "10. Entre em Contato",
    section10Text: "Para dúvidas sobre a privacidade dos seus dados ou nossas práticas de análise, entre em contato em privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Todos os direitos reservados.",
    footerDesc: "Análise de odds de futebol com IA para previsões mais inteligentes.",
    product: "Produto", liveOdds: "Desempenho IA", solution: "Solução",
    company: "Empresa", aboutUs: "Sobre Nós", blog: "Blog", contact: "Contato",
    legal: "Legal", privacyPolicy: "Política de Privacidade", termsOfService: "Termos de Serviço",
    responsibleGaming: "Jogo Responsavel",
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
    section1Title: "1. Einführung",
    section1Text: "Willkommen bei OddsFlow. Wir sind dem Schutz Ihrer Privatsphäre verpflichtet, während Sie unsere KI-gesteuerte Sportanalyseplattform nutzen. Diese Richtlinie beschreibt, wie wir Ihre Daten behandeln, um Ihnen hochwertige Marktintelligenz und Spielprognose-Einblicke zu bieten.",
    section2Title: "2. Informationen, die wir sammeln",
    section2Text: "Wir sammeln Daten, um Ihre Erfahrung auf unserem SaaS-Dashboard strikt zu optimieren: Kontoinformationen: Name, E-Mail und Anmeldedaten, die für den Zugriff auf unsere Premium-Datentools erforderlich sind. Nutzungsdaten und Analysen: Wir verfolgen, wie Sie mit unserer Fußballanalyse-Engine interagieren, einschließlich der Ligen, Teams oder Markttrends, nach denen Sie am häufigsten suchen. Dies hilft uns, unsere prädiktiven Algorithmen zu verfeinern. Transaktionsdaten: Zahlungsverlauf für Ihr Software-Abonnement. Hinweis: Wir nutzen sichere Drittanbieter-Prozessoren (z.B. Stripe) für die Abrechnung. Wir speichern keine vollständigen Kreditkartendaten oder Bankinformationen auf unseren Servern.",
    section3Title: "3. Wie wir Ihre Informationen verwenden",
    section3Text: "Ihre Daten treiben das OddsFlow-Ökosystem folgendermaßen an: Servicebereitstellung: Um Zugang zur Echtzeit-Quotenüberwachung und historischen Datenbanken basierend auf Ihrer Abonnementstufe zu gewähren. Algorithmusverbesserung: Wir analysieren aggregiertes Nutzerverhalten, um unsere KI-Modelle zu trainieren und die Genauigkeit unserer Datenvisualisierungen zu verbessern. Kommunikation: Um Ihnen technische Updates, neue Feature-Releases oder Warnungen zu Marktanomalien zu senden (falls eingewilligt).",
    section4Title: "4. Datenweitergabe und Dritte",
    section4Text: "Wir agieren als Datentechnologie-Anbieter, nicht als Datenbroker. Wir verkaufen Ihre persönlichen Daten nicht. Wir teilen Daten nur mit: Infrastrukturanbietern: Hosting-Dienste und Cloud-Computing-Plattformen, die unsere Big-Data-Verarbeitung antreiben. Zahlungsabwicklern: Um eine sichere Abonnement-Abrechnung zu ermöglichen. Rechtliche Compliance: Falls gesetzlich erforderlich, um die Integrität unseres Dienstes zu schützen.",
    section5Title: "5. Cookies und Tracking-Technologien",
    section5Text: "Wir verwenden Cookies zur Analyse des Traffics auf unserer Sportdatenplattform. Diese helfen uns, die Nutzernachfrage nach spezifischen Fußballstatistiken zu verstehen und die Website-Performance zu optimieren. Sie können Ihre Cookie-Einstellungen in Ihren Browsereinstellungen verwalten.",
    section6Title: "6. Datensicherheit",
    section6Text: "Wir setzen Sicherheitsprotokolle auf Unternehmensniveau ein, einschließlich SSL-Verschlüsselung, um Ihr Konto und Ihre proprietären Analyseeinstellungen zu schützen. Obwohl wir bestrebt sind, Ihren digitalen Fußabdruck zu schützen, ist kein Online-Analysedienst zu 100% immun gegen externe Bedrohungen.",
    section7Title: "7. Ihre Datenrechte",
    section7Text: "Sie behalten die volle Kontrolle über Ihr persönliches Profil. Sie können den Zugriff auf, die Korrektur oder Löschung Ihrer Kontodaten beantragen. Bitte beachten Sie, dass das Löschen Ihres Kontos den Zugang zu unseren historischen Datenarchiven und Live-Analysetools beendet.",
    section8Title: "8. Links zu Dritten",
    section8Text: "Unsere Plattform kann Links zu externen Seiten enthalten. OddsFlow ist nicht verantwortlich für die Datenschutzpraktiken anderer Websites. Wir ermutigen Nutzer, die Datenschutzerklärungen jeder Seite zu lesen, die Daten sammelt.",
    section9Title: "9. Änderungen dieser Richtlinie",
    section9Text: "Da sich unsere KI-Technologie weiterentwickelt, können wir diese Richtlinie aktualisieren. Wir werden Sie über wesentliche Änderungen per E-Mail oder durch einen auffälligen Hinweis auf unserem Dashboard informieren.",
    section10Title: "10. Kontaktieren Sie uns",
    section10Text: "Bei Fragen zu Ihrer Datenprivatsphäre oder unseren Analysepraktiken kontaktieren Sie uns unter privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Alle Rechte vorbehalten.",
    footerDesc: "KI-gestützte Fußball-Quotenanalyse für intelligentere Vorhersagen.",
    product: "Produkt", liveOdds: "KI-Leistung", solution: "Lösung",
    company: "Unternehmen", aboutUs: "Über Uns", blog: "Blog", contact: "Kontakt",
    legal: "Rechtliches", privacyPolicy: "Datenschutzrichtlinie", termsOfService: "Nutzungsbedingungen",
    responsibleGaming: "Verantwortungsvolles Spielen",
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
    section1Title: "1. Introduction",
    section1Text: "Bienvenue chez OddsFlow. Nous nous engageons à protéger votre vie privée lorsque vous utilisez notre plateforme d'analyse sportive basée sur l'IA. Cette politique décrit comment nous traitons vos données pour vous fournir une intelligence de marché de haute qualité et des informations de prévision de matchs.",
    section2Title: "2. Informations que nous collectons",
    section2Text: "Nous collectons des données pour optimiser strictement votre expérience sur notre tableau de bord SaaS : Informations de compte : Nom, e-mail et identifiants de connexion nécessaires pour accéder à nos outils de données premium. Données d'utilisation et d'analyse : Nous suivons la façon dont vous interagissez avec notre moteur d'analyse de football, y compris les ligues, équipes ou tendances du marché que vous recherchez le plus. Cela nous aide à affiner nos algorithmes prédictifs. Données de transaction : Historique des paiements pour votre abonnement à notre logiciel. Remarque : Nous utilisons des processeurs tiers sécurisés (ex. Stripe) pour la facturation. Nous ne stockons pas vos informations complètes de carte de crédit ou bancaires sur nos serveurs.",
    section3Title: "3. Comment nous utilisons vos informations",
    section3Text: "Vos données alimentent l'écosystème OddsFlow de plusieurs façons : Fourniture de service : Pour accorder l'accès à la surveillance des cotes en temps réel et aux bases de données historiques selon votre niveau d'abonnement. Amélioration des algorithmes : Nous analysons le comportement agrégé des utilisateurs pour entraîner nos modèles d'IA et améliorer la précision de nos visualisations de données. Communication : Pour vous envoyer des mises à jour techniques, des lancements de nouvelles fonctionnalités ou des alertes concernant les anomalies du marché (si vous avez opté pour les recevoir).",
    section4Title: "4. Partage de données et tiers",
    section4Text: "Nous opérons en tant que fournisseur de technologie de données, pas en tant que courtier en données. Nous ne vendons pas vos informations personnelles. Nous partageons des données uniquement avec : Fournisseurs d'infrastructure : Services d'hébergement et plateformes de cloud computing qui alimentent notre traitement de big data. Processeurs de paiement : Pour faciliter la facturation sécurisée des abonnements. Conformité légale : Si la loi l'exige pour protéger l'intégrité de notre service.",
    section5Title: "5. Cookies et technologies de suivi",
    section5Text: "Nous utilisons des cookies pour analyser le trafic sur notre plateforme de données sportives. Ceux-ci nous aident à comprendre la demande des utilisateurs pour des statistiques de football spécifiques et à optimiser les performances du site. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.",
    section6Title: "6. Sécurité des données",
    section6Text: "Nous employons des protocoles de sécurité de niveau entreprise, y compris le cryptage SSL, pour protéger votre compte et vos préférences d'analyse propriétaires. Bien que nous nous efforcions de protéger votre empreinte numérique, aucun service d'analyse en ligne n'est 100% immunisé contre les menaces externes.",
    section7Title: "7. Vos droits sur les données",
    section7Text: "Vous conservez le contrôle total de votre profil personnel. Vous pouvez demander l'accès, la correction ou la suppression de vos données de compte. Veuillez noter que la suppression de votre compte mettra fin à l'accès à nos archives de données historiques et outils d'analyse en direct.",
    section8Title: "8. Liens vers des tiers",
    section8Text: "Notre plateforme peut contenir des liens vers des sites externes. OddsFlow n'est pas responsable des pratiques de confidentialité d'autres sites web. Nous encourageons les utilisateurs à lire les déclarations de confidentialité de tout site qui collecte des données.",
    section9Title: "9. Modifications de cette politique",
    section9Text: "À mesure que notre technologie d'IA évolue, nous pouvons mettre à jour cette politique. Nous vous informerons des changements significatifs par e-mail ou par un avis visible sur notre tableau de bord.",
    section10Title: "10. Contactez-nous",
    section10Text: "Pour toute question concernant la confidentialité de vos données ou nos pratiques d'analyse, contactez-nous à privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Tous droits réservés.",
    footerDesc: "Analyse des cotes de football alimentée par l'IA pour des prédictions plus intelligentes.",
    product: "Produit", liveOdds: "Performance IA", solution: "Solution",
    company: "Entreprise", aboutUs: "À Propos", blog: "Blog", contact: "Contact",
    legal: "Mentions Légales", privacyPolicy: "Politique de Confidentialité", termsOfService: "Conditions d'Utilisation",
    responsibleGaming: "Jeu Responsable",
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
    section1Title: "1. はじめに",
    section1Text: "OddsFlowへようこそ。AI駆動のスポーツ分析プラットフォームをご利用いただく際、お客様のプライバシー保護に努めています。本ポリシーでは、高品質な市場インテリジェンスと試合予測インサイトを提供するために、お客様のデータをどのように取り扱うかについて説明します。",
    section2Title: "2. 収集する情報",
    section2Text: "SaaSダッシュボードでの体験を最適化するためにデータを収集します：アカウント情報：プレミアムデータツールにアクセスするために必要な名前、メール、ログイン資格情報。利用データと分析：どのリーグ、チーム、市場トレンドを最も検索しているかなど、サッカー分析エンジンとのインタラクションを追跡します。これにより予測アルゴリズムを改良します。取引データ：ソフトウェアサブスクリプションの支払い履歴。注：請求には安全なサードパーティプロセッサ（例：Stripe）を使用しています。クレジットカードの完全な詳細や銀行情報はサーバーに保存しません。",
    section3Title: "3. 情報の使用方法",
    section3Text: "お客様のデータは以下の方法でOddsFlowエコシステムを支えています：サービス提供：サブスクリプションティアに基づいてリアルタイムオッズモニタリングと履歴データベースへのアクセスを付与。アルゴリズム改善：集計されたユーザー行動を分析してAIモデルをトレーニングし、データ可視化の精度を向上。コミュニケーション：技術更新、新機能リリース、市場異常に関するアラートの送信（オプトインの場合）。",
    section4Title: "4. データ共有とサードパーティ",
    section4Text: "当社はデータテクノロジープロバイダーとして運営しており、データブローカーではありません。個人情報を販売することはありません。データは以下とのみ共有します：インフラプロバイダー：ビッグデータ処理を支えるホスティングサービスとクラウドコンピューティングプラットフォーム。決済プロセッサ：安全なサブスクリプション請求を促進。法的コンプライアンス：サービスの整合性を保護するために法律で要求された場合。",
    section5Title: "5. Cookieとトラッキング技術",
    section5Text: "スポーツデータプラットフォームのトラフィックを分析するためにCookieを使用します。これにより、特定のサッカー統計に対するユーザー需要を理解し、サイトパフォーマンスを最適化します。ブラウザ設定でCookieの設定を管理できます。",
    section6Title: "6. データセキュリティ",
    section6Text: "SSL暗号化を含むエンタープライズグレードのセキュリティプロトコルを採用し、アカウントと独自の分析設定を保護しています。デジタルフットプリントの保護に努めていますが、オンライン分析サービスで外部の脅威から100%免れるものはありません。",
    section7Title: "7. お客様のデータ権利",
    section7Text: "個人プロフィールに対する完全な管理権を保持しています。アカウントデータへのアクセス、修正、削除をリクエストできます。アカウントを削除すると、履歴データアーカイブとライブ分析ツールへのアクセスが終了することにご注意ください。",
    section8Title: "8. サードパーティリンク",
    section8Text: "当プラットフォームには外部サイトへのリンクが含まれる場合があります。OddsFlowは他のウェブサイトのプライバシー慣行について責任を負いません。データを収集するサイトのプライバシーステートメントを読むことをお勧めします。",
    section9Title: "9. ポリシーの変更",
    section9Text: "AI技術の進化に伴い、本ポリシーを更新する場合があります。重要な変更についてはメールまたはダッシュボード上の目立つ通知でお知らせします。",
    section10Title: "10. お問い合わせ",
    section10Text: "データプライバシーや分析慣行に関するお問い合わせは、privacy@oddsflow.comまでご連絡ください。",
    footer: "© 2026 OddsFlow. 全著作権所有。",
    footerDesc: "AI搭載のサッカーオッズ分析でよりスマートな予測を。",
    product: "製品", liveOdds: "AIパフォーマンス", solution: "ソリューション",
    company: "会社", aboutUs: "会社概要", blog: "ブログ", contact: "お問い合わせ",
    legal: "法的情報", privacyPolicy: "プライバシーポリシー", termsOfService: "利用規約",
    responsibleGaming: "責任あるギャンブル",
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
    section1Title: "1. 소개",
    section1Text: "OddsFlow에 오신 것을 환영합니다. AI 기반 스포츠 분석 플랫폼을 이용하시는 동안 귀하의 개인정보 보호를 위해 최선을 다하고 있습니다. 이 정책은 고품질 시장 인텔리전스와 경기 예측 인사이트를 제공하기 위해 귀하의 데이터를 어떻게 처리하는지 설명합니다.",
    section2Title: "2. 수집하는 정보",
    section2Text: "SaaS 대시보드에서의 경험을 최적화하기 위해 데이터를 수집합니다: 계정 정보: 프리미엄 데이터 도구에 접근하는 데 필요한 이름, 이메일, 로그인 자격 증명. 사용 데이터 및 분석: 어떤 리그, 팀, 시장 트렌드를 가장 많이 검색하는지 등 축구 분석 엔진과의 상호작용을 추적합니다. 이를 통해 예측 알고리즘을 개선합니다. 거래 데이터: 소프트웨어 구독 결제 내역. 참고: 청구에는 안전한 제3자 프로세서(예: Stripe)를 사용합니다. 전체 신용카드 정보나 은행 정보를 서버에 저장하지 않습니다.",
    section3Title: "3. 정보 사용 방법",
    section3Text: "귀하의 데이터는 다음과 같은 방식으로 OddsFlow 생태계를 지원합니다: 서비스 제공: 구독 등급에 따라 실시간 배당률 모니터링 및 과거 데이터베이스에 대한 접근 권한 부여. 알고리즘 개선: 집계된 사용자 행동을 분석하여 AI 모델을 훈련하고 데이터 시각화의 정확도를 향상. 커뮤니케이션: 기술 업데이트, 새 기능 출시, 시장 이상에 대한 알림 전송(옵트인한 경우).",
    section4Title: "4. 데이터 공유 및 제3자",
    section4Text: "당사는 데이터 기술 제공업체로 운영되며 데이터 브로커가 아닙니다. 개인 정보를 판매하지 않습니다. 다음과만 데이터를 공유합니다: 인프라 제공업체: 빅데이터 처리를 지원하는 호스팅 서비스 및 클라우드 컴퓨팅 플랫폼. 결제 처리업체: 안전한 구독 청구를 촉진. 법적 준수: 서비스의 무결성을 보호하기 위해 법률에서 요구하는 경우.",
    section5Title: "5. 쿠키 및 추적 기술",
    section5Text: "스포츠 데이터 플랫폼의 트래픽을 분석하기 위해 쿠키를 사용합니다. 이를 통해 특정 축구 통계에 대한 사용자 수요를 이해하고 사이트 성능을 최적화합니다. 브라우저 설정에서 쿠키 기본 설정을 관리할 수 있습니다.",
    section6Title: "6. 데이터 보안",
    section6Text: "SSL 암호화를 포함한 기업급 보안 프로토콜을 사용하여 계정과 독점 분석 기본 설정을 보호합니다. 디지털 발자국을 보호하기 위해 노력하지만 온라인 분석 서비스 중 외부 위협에 100% 면역인 것은 없습니다.",
    section7Title: "7. 귀하의 데이터 권리",
    section7Text: "개인 프로필에 대한 완전한 통제권을 유지합니다. 계정 데이터에 대한 접근, 수정 또는 삭제를 요청할 수 있습니다. 계정을 삭제하면 과거 데이터 아카이브 및 실시간 분석 도구에 대한 접근이 종료됩니다.",
    section8Title: "8. 제3자 링크",
    section8Text: "당사 플랫폼에는 외부 사이트로의 링크가 포함될 수 있습니다. OddsFlow는 다른 웹사이트의 개인정보 보호 관행에 대해 책임지지 않습니다. 데이터를 수집하는 모든 사이트의 개인정보 보호 정책을 읽으시기 바랍니다.",
    section9Title: "9. 정책 변경",
    section9Text: "AI 기술이 발전함에 따라 이 정책을 업데이트할 수 있습니다. 중요한 변경 사항은 이메일 또는 대시보드의 눈에 띄는 공지를 통해 알려드립니다.",
    section10Title: "10. 문의하기",
    section10Text: "데이터 개인정보 보호 또는 분석 관행에 대한 문의는 privacy@oddsflow.com으로 연락하세요.",
    footer: "© 2026 OddsFlow. 모든 권리 보유.",
    footerDesc: "AI 기반 축구 배당률 분석으로 더 스마트한 예측을.",
    product: "제품", liveOdds: "AI 성능", solution: "솔루션",
    company: "회사", aboutUs: "회사 소개", blog: "블로그", contact: "연락처",
    legal: "법적 정보", privacyPolicy: "개인정보 처리방침", termsOfService: "이용약관",
    responsibleGaming: "책임감 있는 게임",
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
    section1Title: "1. 简介",
    section1Text: "欢迎使用 OddsFlow。我们致力于在您使用我们的 AI 驱动体育分析平台时保护您的隐私。本政策概述了我们如何处理您的数据，以便为您提供高质量的市场情报和比赛预测洞察。",
    section2Title: "2. 我们收集的信息",
    section2Text: "我们收集数据以严格优化您在 SaaS 仪表板上的体验：账户信息：访问我们高级数据工具所需的姓名、电子邮件和登录凭据。使用数据和分析：我们跟踪您与足球分析引擎的互动方式，包括您最常搜索的联赛、球队或市场趋势。这有助于我们改进预测算法。交易数据：软件订阅的付款历史。注意：我们使用安全的第三方处理器（如 Stripe）进行计费。我们不会在服务器上存储您的完整信用卡详细信息或银行信息。",
    section3Title: "3. 我们如何使用您的信息",
    section3Text: "您的数据以以下方式推动 OddsFlow 生态系统：服务交付：根据您的订阅级别授予实时赔率监控和历史数据库的访问权限。算法改进：我们分析汇总的用户行为以训练我们的 AI 模型并提高数据可视化的准确性。通信：向您发送技术更新、新功能发布或市场异常警报（如果您选择接收）。",
    section4Title: "4. 数据共享和第三方",
    section4Text: "我们作为数据技术提供商运营，而非数据经纪人。我们不会出售您的个人信息。我们仅与以下方共享数据：基础设施提供商：为我们的大数据处理提供支持的托管服务和云计算平台。支付处理商：促进安全的订阅计费。法律合规：如果法律要求以保护我们服务的完整性。",
    section5Title: "5. Cookie 和跟踪技术",
    section5Text: "我们使用 Cookie 来分析体育数据平台上的流量。这些帮助我们了解用户对特定足球统计数据的需求并优化网站性能。您可以在浏览器设置中管理 Cookie 偏好。",
    section6Title: "6. 数据安全",
    section6Text: "我们采用企业级安全协议，包括 SSL 加密，以保护您的账户和专有分析偏好。虽然我们努力保护您的数字足迹，但没有任何在线分析服务能100%免受外部威胁。",
    section7Title: "7. 您的数据权利",
    section7Text: "您对个人资料保持完全控制权。您可以请求访问、更正或删除您的账户数据。请注意，删除账户将终止对我们历史数据档案和实时分析工具的访问。",
    section8Title: "8. 第三方链接",
    section8Text: "我们的平台可能包含外部网站的链接。OddsFlow 不对其他网站的隐私做法负责。我们鼓励用户阅读收集数据的任何网站的隐私声明。",
    section9Title: "9. 政策变更",
    section9Text: "随着我们 AI 技术的发展，我们可能会更新此政策。我们将通过电子邮件或仪表板上的醒目通知告知您重大变更。",
    section10Title: "10. 联系我们",
    section10Text: "如有关于数据隐私或我们分析实践的疑问，请通过 privacy@oddsflow.com 联系我们。",
    footer: "© 2026 OddsFlow. 版权所有。",
    footerDesc: "AI 驱动的足球赔率分析，助您做出更明智的预测。",
    product: "产品", liveOdds: "AI 性能", solution: "解决方案",
    company: "公司", aboutUs: "关于我们", blog: "博客", contact: "联系我们",
    legal: "法律", privacyPolicy: "隐私政策", termsOfService: "服务条款",
    responsibleGaming: "负责任博彩",
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
    section1Title: "1. 簡介",
    section1Text: "歡迎使用 OddsFlow。我們致力於在您使用我們的 AI 驅動體育分析平台時保護您的隱私。本政策概述了我們如何處理您的資料，以便為您提供高品質的市場情報和比賽預測洞察。",
    section2Title: "2. 我們收集的資訊",
    section2Text: "我們收集資料以嚴格優化您在 SaaS 儀表板上的體驗：帳戶資訊：存取我們進階資料工具所需的姓名、電子郵件和登入憑據。使用資料和分析：我們追蹤您與足球分析引擎的互動方式，包括您最常搜尋的聯賽、球隊或市場趨勢。這有助於我們改進預測演算法。交易資料：軟體訂閱的付款歷史。注意：我們使用安全的第三方處理器（如 Stripe）進行計費。我們不會在伺服器上儲存您的完整信用卡詳細資訊或銀行資訊。",
    section3Title: "3. 我們如何使用您的資訊",
    section3Text: "您的資料以以下方式推動 OddsFlow 生態系統：服務交付：根據您的訂閱級別授予即時賠率監控和歷史資料庫的存取權限。演算法改進：我們分析彙總的用戶行為以訓練我們的 AI 模型並提高資料視覺化的準確性。通訊：向您發送技術更新、新功能發布或市場異常警報（如果您選擇接收）。",
    section4Title: "4. 資料共享和第三方",
    section4Text: "我們作為資料技術提供商營運，而非資料經紀人。我們不會出售您的個人資訊。我們僅與以下方共享資料：基礎設施提供商：為我們的大資料處理提供支援的託管服務和雲端運算平台。支付處理商：促進安全的訂閱計費。法律合規：如果法律要求以保護我們服務的完整性。",
    section5Title: "5. Cookie 和追蹤技術",
    section5Text: "我們使用 Cookie 來分析體育資料平台上的流量。這些幫助我們了解用戶對特定足球統計資料的需求並優化網站效能。您可以在瀏覽器設定中管理 Cookie 偏好。",
    section6Title: "6. 資料安全",
    section6Text: "我們採用企業級安全協議，包括 SSL 加密，以保護您的帳戶和專有分析偏好。雖然我們努力保護您的數位足跡，但沒有任何線上分析服務能100%免受外部威脅。",
    section7Title: "7. 您的資料權利",
    section7Text: "您對個人資料保持完全控制權。您可以請求存取、更正或刪除您的帳戶資料。請注意，刪除帳戶將終止對我們歷史資料檔案和即時分析工具的存取。",
    section8Title: "8. 第三方連結",
    section8Text: "我們的平台可能包含外部網站的連結。OddsFlow 不對其他網站的隱私做法負責。我們鼓勵用戶閱讀收集資料的任何網站的隱私聲明。",
    section9Title: "9. 政策變更",
    section9Text: "隨著我們 AI 技術的發展，我們可能會更新此政策。我們將透過電子郵件或儀表板上的醒目通知告知您重大變更。",
    section10Title: "10. 聯繫我們",
    section10Text: "如有關於資料隱私或我們分析實務的疑問，請透過 privacy@oddsflow.com 聯繫我們。",
    footer: "© 2026 OddsFlow. 版權所有。",
    footerDesc: "AI 驅動的足球賠率分析，助您做出更明智的預測。",
    product: "產品", liveOdds: "AI 性能", solution: "解決方案",
    company: "公司", aboutUs: "關於我們", blog: "部落格", contact: "聯繫我們",
    legal: "法律", privacyPolicy: "隱私政策", termsOfService: "服務條款",
    responsibleGaming: "負責任博彩",
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
    section1Title: "1. Pendahuluan",
    section1Text: "Selamat datang di OddsFlow. Kami berkomitmen untuk melindungi privasi Anda saat menggunakan platform analisis olahraga berbasis AI kami. Kebijakan ini menguraikan bagaimana kami menangani data Anda untuk memberikan intelijen pasar berkualitas tinggi dan wawasan perkiraan pertandingan.",
    section2Title: "2. Informasi yang Kami Kumpulkan",
    section2Text: "Kami mengumpulkan data untuk mengoptimalkan pengalaman Anda di dasbor SaaS kami: Informasi Akun: Nama, email, dan kredensial login yang diperlukan untuk mengakses alat data premium kami. Data Penggunaan & Analitik: Kami melacak bagaimana Anda berinteraksi dengan mesin analisis sepak bola kami, termasuk liga, tim, atau tren pasar yang paling sering Anda cari. Ini membantu kami menyempurnakan algoritma prediktif kami. Data Transaksi: Riwayat pembayaran untuk langganan perangkat lunak Anda. Catatan: Kami menggunakan pemroses pihak ketiga yang aman (mis. Stripe) untuk penagihan. Kami tidak menyimpan detail kartu kredit lengkap atau informasi bank Anda di server kami.",
    section3Title: "3. Bagaimana Kami Menggunakan Informasi Anda",
    section3Text: "Data Anda mendukung ekosistem OddsFlow dengan cara berikut: Pengiriman Layanan: Untuk memberikan akses ke pemantauan odds real-time dan database historis berdasarkan tingkat langganan Anda. Peningkatan Algoritma: Kami menganalisis perilaku pengguna agregat untuk melatih model AI kami dan meningkatkan akurasi visualisasi data kami. Komunikasi: Untuk mengirimkan pembaruan teknis, rilis fitur baru, atau peringatan tentang anomali pasar (jika Anda memilih untuk menerima).",
    section4Title: "4. Berbagi Data & Pihak Ketiga",
    section4Text: "Kami beroperasi sebagai penyedia teknologi data, bukan broker data. Kami tidak menjual informasi pribadi Anda. Kami hanya berbagi data dengan: Penyedia Infrastruktur: Layanan hosting dan platform cloud computing yang mendukung pemrosesan big data kami. Pemroses Pembayaran: Untuk memfasilitasi penagihan langganan yang aman. Kepatuhan Hukum: Jika diwajibkan oleh hukum untuk melindungi integritas layanan kami.",
    section5Title: "5. Cookie dan Teknologi Pelacakan",
    section5Text: "Kami menggunakan cookie untuk menganalisis lalu lintas di platform data olahraga kami. Ini membantu kami memahami permintaan pengguna untuk statistik sepak bola tertentu dan mengoptimalkan kinerja situs. Anda dapat mengelola preferensi cookie di pengaturan browser Anda.",
    section6Title: "6. Keamanan Data",
    section6Text: "Kami menggunakan protokol keamanan tingkat enterprise, termasuk enkripsi SSL, untuk melindungi akun dan preferensi analisis proprietary Anda. Meskipun kami berusaha melindungi jejak digital Anda, tidak ada layanan analitik online yang 100% kebal terhadap ancaman eksternal.",
    section7Title: "7. Hak Data Anda",
    section7Text: "Anda mempertahankan kontrol penuh atas profil pribadi Anda. Anda dapat meminta untuk mengakses, memperbaiki, atau menghapus data akun Anda. Harap dicatat bahwa menghapus akun Anda akan mengakhiri akses ke arsip data historis dan alat analisis langsung kami.",
    section8Title: "8. Tautan Pihak Ketiga",
    section8Text: "Platform kami mungkin berisi tautan ke situs eksternal. OddsFlow tidak bertanggung jawab atas praktik privasi situs web lain. Kami mendorong pengguna untuk membaca pernyataan privasi dari situs mana pun yang mengumpulkan data.",
    section9Title: "9. Perubahan Kebijakan Ini",
    section9Text: "Seiring berkembangnya teknologi AI kami, kami mungkin memperbarui kebijakan ini. Kami akan memberi tahu Anda tentang perubahan signifikan melalui email atau pemberitahuan yang menonjol di dasbor kami.",
    section10Title: "10. Hubungi Kami",
    section10Text: "Untuk pertanyaan mengenai privasi data Anda atau praktik analitik kami, silakan hubungi kami di privacy@oddsflow.com.",
    footer: "© 2026 OddsFlow. Hak cipta dilindungi.",
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi yang lebih cerdas.",
    product: "Produk", liveOdds: "Performa AI", solution: "Solusi",
    company: "Perusahaan", aboutUs: "Tentang Kami", blog: "Blog", contact: "Kontak",
    legal: "Hukum", privacyPolicy: "Kebijakan Privasi", termsOfService: "Syarat Layanan",
    responsibleGaming: "Perjudian Bertanggung Jawab",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check auth state
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
              <Link href={localePath('/solution')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">{t('solution')}</Link>
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
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
              {user ? (
                <Link href={localePath('/dashboard')} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href={localePath('/login')} className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">{t('login')}</Link>
                  <Link href={localePath('/get-started')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer hidden sm:block">{t('getStarted')}</Link>
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="px-4 py-4 space-y-1">
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
              ].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                {user ? (
                  <Link
                    href={localePath('/dashboard')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-white font-medium">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                  </Link>
                ) : (
                  <>
                    <Link href={localePath('/login')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all">{t('login')}</Link>
                    <Link href={localePath('/get-started')} onClick={() => setMobileMenuOpen(false)} className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold hover:shadow-lg transition-all">{t('getStarted')}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-gray-500 mb-12">{t('lastUpdated')}</p>

          <div className="space-y-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
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
                <li><Link href={localePath('/responsible-gaming')} className="hover:text-emerald-400 transition-colors inline-block">{t('responsibleGaming')}</Link></li>
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
