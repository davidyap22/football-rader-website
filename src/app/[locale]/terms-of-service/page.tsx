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
    title: "Terms of Service",
    lastUpdated: "Last Updated: January 2025",
    section1Title: "1. Acceptance of Terms",
    section1Text: "Welcome to OddsFlow. By accessing our platform, you agree to these Terms of Service. OddsFlow provides AI-driven football analytics, historical data processing, and market trend visualization tools (the \"Service\"). If you do not agree to these terms, please discontinue the use of our Service immediately.",
    section2Title: "2. Nature of Service",
    section2Text: "OddsFlow is strictly a SaaS (Software as a Service) platform dedicated to sports data analysis. We are NOT a gambling operator: We do not accept wagers, bets, or facilitate any monetary transaction related to the outcome of sports events. We are NOT a financial advisor: Our proprietary AI models and charts are for informational and educational purposes only. Access Only: Your subscription fee is strictly for access to our software dashboard and historical database, not for any promised financial returns.",
    section3Title: "3. Use License & Intellectual Property",
    section3Text: "OddsFlow grants you a limited, non-exclusive, non-transferable license to access our sports analytics software for personal use. All proprietary algorithms, football prediction models, and code remain the intellectual property of OddsFlow. You agree not to: Reverse engineer our data scraping or analysis logic. Resell or redistribute our market insights without explicit permission.",
    section4Title: "4. Data Accuracy and AI Limitations",
    section4Text: "Our football analysis engine utilizes historical statistics and machine learning to generate probabilities. However, sports events are subject to inherent variance. OddsFlow does not guarantee the accuracy of its match projections or market trend signals. The data is provided \"as is,\" and we assume no liability for decisions made based on our visualized data sets.",
    section5Title: "5. Responsible Use & Risk Disclosure",
    section5Text: "While OddsFlow provides high-level market intelligence, users acknowledge that sports analysis involves risk. You agree that OddsFlow is a tool for research, not a directive for action. You are solely responsible for how you interpret and utilize the statistical data provided. We explicitly disclaim liability for any financial losses associated with the use of our analytics tools.",
    section6Title: "6. User Accounts & Security",
    section6Text: "To access premium live odds analysis, you must create an account. You are responsible for maintaining the security of your credentials. Any breach of security should be reported to our support team immediately.",
    section7Title: "7. Subscription & Payments",
    section7Text: "Payments are processed securely via third-party gateways (e.g., Stripe). Subscriptions grant access to our data infrastructure for the specified period. We do not offer refunds based on the performance of teams or match outcomes, as the service provided is the access to the software itself.",
    section8Title: "8. Modifications",
    section8Text: "We reserve the right to update these terms to reflect changes in our algorithm updates or business practices. Continued use of the OddsFlow analytics platform constitutes acceptance of the new terms.",
    section9Title: "9. Contact",
    section9Text: "For questions regarding our technology or these terms, please contact us at support@oddsflow.com.",
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
    title: "Términos de Servicio",
    lastUpdated: "Última actualización: Enero 2025",
    section1Title: "1. Aceptación de Términos",
    section1Text: "Bienvenido a OddsFlow. Al acceder a nuestra plataforma, acepta estos Términos de Servicio. OddsFlow proporciona análisis de fútbol impulsado por IA, procesamiento de datos históricos y herramientas de visualización de tendencias del mercado (el \"Servicio\"). Si no está de acuerdo con estos términos, deje de usar nuestro Servicio inmediatamente.",
    section2Title: "2. Naturaleza del Servicio",
    section2Text: "OddsFlow es estrictamente una plataforma SaaS (Software como Servicio) dedicada al análisis de datos deportivos. NO somos un operador de apuestas: No aceptamos apuestas ni facilitamos transacciones monetarias relacionadas con resultados de eventos deportivos. NO somos asesores financieros: Nuestros modelos de IA y gráficos son solo para fines informativos y educativos. Solo Acceso: Su tarifa de suscripción es estrictamente para acceder a nuestro panel de software y base de datos histórica, no para retornos financieros prometidos.",
    section3Title: "3. Licencia de Uso y Propiedad Intelectual",
    section3Text: "OddsFlow le otorga una licencia limitada, no exclusiva e intransferible para acceder a nuestro software de análisis deportivo para uso personal. Todos los algoritmos propietarios, modelos de predicción de fútbol y código siguen siendo propiedad intelectual de OddsFlow. Usted acepta no: Realizar ingeniería inversa de nuestra lógica de análisis. Revender o redistribuir nuestros conocimientos del mercado sin permiso explícito.",
    section4Title: "4. Precisión de Datos y Limitaciones de IA",
    section4Text: "Nuestro motor de análisis de fútbol utiliza estadísticas históricas y aprendizaje automático para generar probabilidades. Sin embargo, los eventos deportivos están sujetos a varianza inherente. OddsFlow no garantiza la precisión de sus proyecciones de partidos o señales de tendencias del mercado. Los datos se proporcionan \"tal cual\" y no asumimos responsabilidad por decisiones tomadas basadas en nuestros conjuntos de datos visualizados.",
    section5Title: "5. Uso Responsable y Divulgación de Riesgos",
    section5Text: "Si bien OddsFlow proporciona inteligencia de mercado de alto nivel, los usuarios reconocen que el análisis deportivo implica riesgo. Usted acepta que OddsFlow es una herramienta de investigación, no una directiva para la acción. Usted es el único responsable de cómo interpreta y utiliza los datos estadísticos proporcionados. Rechazamos explícitamente la responsabilidad por cualquier pérdida financiera asociada con el uso de nuestras herramientas de análisis.",
    section6Title: "6. Cuentas de Usuario y Seguridad",
    section6Text: "Para acceder al análisis de cuotas en vivo premium, debe crear una cuenta. Usted es responsable de mantener la seguridad de sus credenciales. Cualquier violación de seguridad debe informarse a nuestro equipo de soporte inmediatamente.",
    section7Title: "7. Suscripción y Pagos",
    section7Text: "Los pagos se procesan de forma segura a través de pasarelas de terceros (ej. Stripe). Las suscripciones otorgan acceso a nuestra infraestructura de datos por el período especificado. No ofrecemos reembolsos basados en el rendimiento de equipos o resultados de partidos, ya que el servicio proporcionado es el acceso al software en sí.",
    section8Title: "8. Modificaciones",
    section8Text: "Nos reservamos el derecho de actualizar estos términos para reflejar cambios en nuestras actualizaciones de algoritmos o prácticas comerciales. El uso continuado de la plataforma de análisis OddsFlow constituye la aceptación de los nuevos términos.",
    section9Title: "9. Contacto",
    section9Text: "Para preguntas sobre nuestra tecnología o estos términos, contáctenos en support@oddsflow.com.",
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
    title: "Termos de Serviço",
    lastUpdated: "Última atualização: Janeiro 2025",
    section1Title: "1. Aceitação dos Termos",
    section1Text: "Bem-vindo ao OddsFlow. Ao acessar nossa plataforma, você concorda com estes Termos de Serviço. OddsFlow fornece análises de futebol baseadas em IA, processamento de dados históricos e ferramentas de visualização de tendências de mercado (o \"Serviço\"). Se você não concordar com estes termos, por favor interrompa o uso do nosso Serviço imediatamente.",
    section2Title: "2. Natureza do Serviço",
    section2Text: "OddsFlow é estritamente uma plataforma SaaS (Software como Serviço) dedicada à análise de dados esportivos. NÃO somos um operador de apostas: Não aceitamos apostas nem facilitamos transações monetárias relacionadas a resultados de eventos esportivos. NÃO somos consultores financeiros: Nossos modelos de IA e gráficos são apenas para fins informativos e educacionais. Apenas Acesso: Sua taxa de assinatura é estritamente para acesso ao nosso painel de software e banco de dados histórico, não para retornos financeiros prometidos.",
    section3Title: "3. Licença de Uso e Propriedade Intelectual",
    section3Text: "OddsFlow concede a você uma licença limitada, não exclusiva e intransferível para acessar nosso software de análise esportiva para uso pessoal. Todos os algoritmos proprietários, modelos de previsão de futebol e código permanecem propriedade intelectual da OddsFlow. Você concorda em não: Fazer engenharia reversa de nossa lógica de análise. Revender ou redistribuir nossos insights de mercado sem permissão explícita.",
    section4Title: "4. Precisão de Dados e Limitações da IA",
    section4Text: "Nosso motor de análise de futebol utiliza estatísticas históricas e aprendizado de máquina para gerar probabilidades. No entanto, eventos esportivos estão sujeitos a variância inerente. OddsFlow não garante a precisão de suas projeções de partidas ou sinais de tendências de mercado. Os dados são fornecidos \"como estão\" e não assumimos responsabilidade por decisões tomadas com base em nossos conjuntos de dados visualizados.",
    section5Title: "5. Uso Responsável e Divulgação de Riscos",
    section5Text: "Embora OddsFlow forneça inteligência de mercado de alto nível, os usuários reconhecem que a análise esportiva envolve risco. Você concorda que OddsFlow é uma ferramenta de pesquisa, não uma diretiva para ação. Você é o único responsável por como interpreta e utiliza os dados estatísticos fornecidos. Rejeitamos explicitamente a responsabilidade por quaisquer perdas financeiras associadas ao uso de nossas ferramentas de análise.",
    section6Title: "6. Contas de Usuário e Segurança",
    section6Text: "Para acessar a análise de odds ao vivo premium, você deve criar uma conta. Você é responsável por manter a segurança de suas credenciais. Qualquer violação de segurança deve ser relatada à nossa equipe de suporte imediatamente.",
    section7Title: "7. Assinatura e Pagamentos",
    section7Text: "Os pagamentos são processados de forma segura através de gateways de terceiros (ex. Stripe). As assinaturas concedem acesso à nossa infraestrutura de dados pelo período especificado. Não oferecemos reembolsos baseados no desempenho de equipes ou resultados de partidas, pois o serviço fornecido é o acesso ao software em si.",
    section8Title: "8. Modificações",
    section8Text: "Reservamo-nos o direito de atualizar estes termos para refletir mudanças em nossas atualizações de algoritmos ou práticas comerciais. O uso continuado da plataforma de análise OddsFlow constitui aceitação dos novos termos.",
    section9Title: "9. Contato",
    section9Text: "Para dúvidas sobre nossa tecnologia ou estes termos, entre em contato em support@oddsflow.com.",
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
    title: "Nutzungsbedingungen",
    lastUpdated: "Letzte Aktualisierung: Januar 2025",
    section1Title: "1. Annahme der Bedingungen",
    section1Text: "Willkommen bei OddsFlow. Durch den Zugriff auf unsere Plattform stimmen Sie diesen Nutzungsbedingungen zu. OddsFlow bietet KI-gesteuerte Fußballanalysen, historische Datenverarbeitung und Markttrend-Visualisierungstools (der \"Service\"). Wenn Sie diesen Bedingungen nicht zustimmen, stellen Sie die Nutzung unseres Services bitte sofort ein.",
    section2Title: "2. Art des Services",
    section2Text: "OddsFlow ist strikt eine SaaS-Plattform (Software as a Service) für Sportdatenanalyse. Wir sind KEIN Wettanbieter: Wir akzeptieren keine Wetten und vermitteln keine Geldtransaktionen im Zusammenhang mit Sportergebnissen. Wir sind KEINE Finanzberater: Unsere KI-Modelle und Diagramme dienen nur zu Informations- und Bildungszwecken. Nur Zugang: Ihre Abonnementgebühr gilt ausschließlich für den Zugang zu unserem Software-Dashboard und der historischen Datenbank, nicht für versprochene finanzielle Renditen.",
    section3Title: "3. Nutzungslizenz und geistiges Eigentum",
    section3Text: "OddsFlow gewährt Ihnen eine begrenzte, nicht-exklusive, nicht übertragbare Lizenz für den Zugriff auf unsere Sportanalyse-Software für den persönlichen Gebrauch. Alle proprietären Algorithmen, Fußballvorhersagemodelle und Code bleiben geistiges Eigentum von OddsFlow. Sie erklären sich damit einverstanden, nicht: Unsere Analyselogik zurückzuentwickeln. Unsere Markteinblicke ohne ausdrückliche Genehmigung weiterzuverkaufen oder weiterzuverbreiten.",
    section4Title: "4. Datengenauigkeit und KI-Einschränkungen",
    section4Text: "Unsere Fußballanalyse-Engine nutzt historische Statistiken und maschinelles Lernen zur Generierung von Wahrscheinlichkeiten. Sportereignisse unterliegen jedoch inhärenter Varianz. OddsFlow garantiert nicht die Genauigkeit seiner Spielprognosen oder Markttrendsignale. Die Daten werden \"wie besehen\" bereitgestellt, und wir übernehmen keine Haftung für Entscheidungen, die auf unseren visualisierten Datensätzen basieren.",
    section5Title: "5. Verantwortungsvolle Nutzung und Risikohinweis",
    section5Text: "Obwohl OddsFlow hochwertige Marktintelligenz bietet, erkennen Benutzer an, dass Sportanalysen Risiken bergen. Sie stimmen zu, dass OddsFlow ein Forschungswerkzeug ist, keine Handlungsanweisung. Sie sind allein verantwortlich dafür, wie Sie die bereitgestellten statistischen Daten interpretieren und nutzen. Wir lehnen ausdrücklich jede Haftung für finanzielle Verluste ab, die mit der Nutzung unserer Analysetools verbunden sind.",
    section6Title: "6. Benutzerkonten und Sicherheit",
    section6Text: "Um auf die Premium-Live-Quotenanalyse zuzugreifen, müssen Sie ein Konto erstellen. Sie sind für die Sicherheit Ihrer Anmeldedaten verantwortlich. Jede Sicherheitsverletzung sollte sofort unserem Support-Team gemeldet werden.",
    section7Title: "7. Abonnement und Zahlungen",
    section7Text: "Zahlungen werden sicher über Drittanbieter-Gateways (z.B. Stripe) abgewickelt. Abonnements gewähren Zugang zu unserer Dateninfrastruktur für den angegebenen Zeitraum. Wir bieten keine Rückerstattungen basierend auf der Leistung von Teams oder Spielergebnissen an, da der erbrachte Service der Zugang zur Software selbst ist.",
    section8Title: "8. Änderungen",
    section8Text: "Wir behalten uns das Recht vor, diese Bedingungen zu aktualisieren, um Änderungen in unseren Algorithmus-Updates oder Geschäftspraktiken widerzuspiegeln. Die fortgesetzte Nutzung der OddsFlow-Analyseplattform gilt als Akzeptanz der neuen Bedingungen.",
    section9Title: "9. Kontakt",
    section9Text: "Bei Fragen zu unserer Technologie oder diesen Bedingungen kontaktieren Sie uns unter support@oddsflow.com.",
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
    title: "Conditions d'Utilisation",
    lastUpdated: "Dernière mise à jour: Janvier 2025",
    section1Title: "1. Acceptation des Conditions",
    section1Text: "Bienvenue sur OddsFlow. En accédant à notre plateforme, vous acceptez ces Conditions d'Utilisation. OddsFlow fournit des analyses de football basées sur l'IA, le traitement de données historiques et des outils de visualisation des tendances du marché (le \"Service\"). Si vous n'acceptez pas ces conditions, veuillez cesser immédiatement d'utiliser notre Service.",
    section2Title: "2. Nature du Service",
    section2Text: "OddsFlow est strictement une plateforme SaaS (Software as a Service) dédiée à l'analyse de données sportives. Nous ne sommes PAS un opérateur de paris: Nous n'acceptons pas de paris et ne facilitons aucune transaction monétaire liée aux résultats d'événements sportifs. Nous ne sommes PAS des conseillers financiers: Nos modèles IA et graphiques sont uniquement à des fins d'information et d'éducation. Accès uniquement: Vos frais d'abonnement sont strictement pour l'accès à notre tableau de bord logiciel et à notre base de données historique, pas pour des rendements financiers promis.",
    section3Title: "3. Licence d'Utilisation et Propriété Intellectuelle",
    section3Text: "OddsFlow vous accorde une licence limitée, non exclusive et non transférable pour accéder à notre logiciel d'analyse sportive pour un usage personnel. Tous les algorithmes propriétaires, modèles de prédiction de football et code restent la propriété intellectuelle d'OddsFlow. Vous acceptez de ne pas: Faire de l'ingénierie inverse sur notre logique d'analyse. Revendre ou redistribuer nos informations de marché sans autorisation explicite.",
    section4Title: "4. Précision des Données et Limitations de l'IA",
    section4Text: "Notre moteur d'analyse de football utilise des statistiques historiques et l'apprentissage automatique pour générer des probabilités. Cependant, les événements sportifs sont soumis à une variance inhérente. OddsFlow ne garantit pas l'exactitude de ses projections de matchs ou signaux de tendances du marché. Les données sont fournies \"telles quelles\" et nous n'assumons aucune responsabilité pour les décisions prises sur la base de nos ensembles de données visualisés.",
    section5Title: "5. Utilisation Responsable et Divulgation des Risques",
    section5Text: "Bien qu'OddsFlow fournisse une intelligence de marché de haut niveau, les utilisateurs reconnaissent que l'analyse sportive comporte des risques. Vous acceptez qu'OddsFlow est un outil de recherche, pas une directive d'action. Vous êtes seul responsable de la façon dont vous interprétez et utilisez les données statistiques fournies. Nous déclinons explicitement toute responsabilité pour les pertes financières associées à l'utilisation de nos outils d'analyse.",
    section6Title: "6. Comptes Utilisateurs et Sécurité",
    section6Text: "Pour accéder à l'analyse des cotes en direct premium, vous devez créer un compte. Vous êtes responsable du maintien de la sécurité de vos identifiants. Toute violation de sécurité doit être signalée immédiatement à notre équipe de support.",
    section7Title: "7. Abonnement et Paiements",
    section7Text: "Les paiements sont traités de manière sécurisée via des passerelles tierces (ex. Stripe). Les abonnements donnent accès à notre infrastructure de données pour la période spécifiée. Nous n'offrons pas de remboursements basés sur la performance des équipes ou les résultats des matchs, car le service fourni est l'accès au logiciel lui-même.",
    section8Title: "8. Modifications",
    section8Text: "Nous nous réservons le droit de mettre à jour ces conditions pour refléter les changements dans nos mises à jour d'algorithmes ou nos pratiques commerciales. L'utilisation continue de la plateforme d'analyse OddsFlow constitue l'acceptation des nouvelles conditions.",
    section9Title: "9. Contact",
    section9Text: "Pour toute question concernant notre technologie ou ces conditions, contactez-nous à support@oddsflow.com.",
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
    title: "利用規約",
    lastUpdated: "最終更新：2025年1月",
    section1Title: "1. 規約への同意",
    section1Text: "OddsFlowへようこそ。当プラットフォームにアクセスすることにより、これらの利用規約に同意したものとみなされます。OddsFlowは、AI駆動のサッカー分析、履歴データ処理、市場トレンド可視化ツール（「サービス」）を提供します。これらの規約に同意しない場合は、直ちにサービスの使用を中止してください。",
    section2Title: "2. サービスの性質",
    section2Text: "OddsFlowは、スポーツデータ分析に特化したSaaS（Software as a Service）プラットフォームです。当社はギャンブル事業者ではありません：賭けを受け付けたり、スポーツイベントの結果に関連する金銭取引を促進したりしません。当社は財務アドバイザーではありません：当社のAIモデルとチャートは情報提供および教育目的のみです。アクセスのみ：サブスクリプション料金は、ソフトウェアダッシュボードと履歴データベースへのアクセスのためであり、約束された財務リターンのためではありません。",
    section3Title: "3. 使用許諾と知的財産",
    section3Text: "OddsFlowは、個人使用のためのスポーツ分析ソフトウェアへのアクセスに対して、限定的、非独占的、譲渡不可のライセンスを付与します。すべての独自アルゴリズム、サッカー予測モデル、コードはOddsFlowの知的財産として保持されます。以下に同意するものとします：分析ロジックのリバースエンジニアリングを行わないこと。明示的な許可なく市場インサイトを転売または再配布しないこと。",
    section4Title: "4. データの正確性とAIの制限",
    section4Text: "当社のサッカー分析エンジンは、履歴統計と機械学習を使用して確率を生成します。ただし、スポーツイベントには固有の変動性があります。OddsFlowは、試合予測や市場トレンドシグナルの正確性を保証しません。データは「現状のまま」提供され、当社の可視化データセットに基づいて行われた決定に対する責任は負いません。",
    section5Title: "5. 責任ある使用とリスク開示",
    section5Text: "OddsFlowは高レベルの市場インテリジェンスを提供しますが、ユーザーはスポーツ分析にはリスクが伴うことを認識します。OddsFlowは研究ツールであり、行動の指示ではないことに同意します。提供された統計データをどのように解釈し利用するかは、お客様の責任です。当社の分析ツールの使用に関連する財務的損失について、当社は明示的に責任を負いません。",
    section6Title: "6. ユーザーアカウントとセキュリティ",
    section6Text: "プレミアムライブオッズ分析にアクセスするには、アカウントを作成する必要があります。認証情報のセキュリティを維持する責任はお客様にあります。セキュリティ違反は、直ちにサポートチームに報告してください。",
    section7Title: "7. サブスクリプションと支払い",
    section7Text: "支払いは、サードパーティゲートウェイ（例：Stripe）を通じて安全に処理されます。サブスクリプションは、指定された期間のデータインフラストラクチャへのアクセスを付与します。提供されるサービスはソフトウェアへのアクセス自体であるため、チームのパフォーマンスや試合結果に基づく返金は行いません。",
    section8Title: "8. 変更",
    section8Text: "当社は、アルゴリズムの更新またはビジネス慣行の変更を反映するために、これらの条件を更新する権利を留保します。OddsFlow分析プラットフォームの継続的な使用は、新しい条件の承諾を意味します。",
    section9Title: "9. お問い合わせ",
    section9Text: "当社の技術またはこれらの条件に関するご質問は、support@oddsflow.comまでお問い合わせください。",
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
    title: "이용약관",
    lastUpdated: "최종 업데이트: 2025년 1월",
    section1Title: "1. 약관 동의",
    section1Text: "OddsFlow에 오신 것을 환영합니다. 당사 플랫폼에 접속함으로써 귀하는 이 이용약관에 동의합니다. OddsFlow는 AI 기반 축구 분석, 과거 데이터 처리 및 시장 트렌드 시각화 도구(\"서비스\")를 제공합니다. 이 약관에 동의하지 않는 경우 서비스 사용을 즉시 중단해 주세요.",
    section2Title: "2. 서비스 성격",
    section2Text: "OddsFlow는 스포츠 데이터 분석에 특화된 SaaS(Software as a Service) 플랫폼입니다. 당사는 도박 운영자가 아닙니다: 베팅을 받거나 스포츠 이벤트 결과와 관련된 금전 거래를 촉진하지 않습니다. 당사는 재정 고문이 아닙니다: 당사의 AI 모델과 차트는 정보 및 교육 목적으로만 제공됩니다. 접근만: 구독료는 소프트웨어 대시보드 및 과거 데이터베이스에 대한 접근을 위한 것이며, 약속된 재정적 수익을 위한 것이 아닙니다.",
    section3Title: "3. 사용 라이선스 및 지적 재산권",
    section3Text: "OddsFlow는 개인 사용을 위해 스포츠 분석 소프트웨어에 접근할 수 있는 제한적이고 비독점적이며 양도 불가능한 라이선스를 부여합니다. 모든 독점 알고리즘, 축구 예측 모델 및 코드는 OddsFlow의 지적 재산으로 유지됩니다. 귀하는 다음에 동의합니다: 당사의 분석 로직을 역설계하지 않을 것. 명시적 허가 없이 시장 인사이트를 재판매하거나 재배포하지 않을 것.",
    section4Title: "4. 데이터 정확성 및 AI 한계",
    section4Text: "당사의 축구 분석 엔진은 과거 통계와 머신러닝을 사용하여 확률을 생성합니다. 그러나 스포츠 이벤트는 고유한 변동성이 있습니다. OddsFlow는 경기 예측이나 시장 트렌드 신호의 정확성을 보장하지 않습니다. 데이터는 \"있는 그대로\" 제공되며, 당사의 시각화된 데이터 세트를 기반으로 내린 결정에 대해 책임을 지지 않습니다.",
    section5Title: "5. 책임 있는 사용 및 위험 공개",
    section5Text: "OddsFlow가 고수준의 시장 인텔리전스를 제공하지만, 사용자는 스포츠 분석에 위험이 수반된다는 것을 인정합니다. 귀하는 OddsFlow가 연구 도구이며 행동 지침이 아님에 동의합니다. 제공된 통계 데이터를 어떻게 해석하고 활용할지는 전적으로 귀하의 책임입니다. 당사는 분석 도구 사용과 관련된 재정적 손실에 대한 책임을 명시적으로 부인합니다.",
    section6Title: "6. 사용자 계정 및 보안",
    section6Text: "프리미엄 실시간 배당률 분석에 접근하려면 계정을 만들어야 합니다. 자격 증명의 보안을 유지할 책임은 귀하에게 있습니다. 보안 위반은 즉시 지원팀에 보고해야 합니다.",
    section7Title: "7. 구독 및 결제",
    section7Text: "결제는 제3자 게이트웨이(예: Stripe)를 통해 안전하게 처리됩니다. 구독은 지정된 기간 동안 데이터 인프라에 대한 접근 권한을 부여합니다. 제공되는 서비스는 소프트웨어 자체에 대한 접근이므로, 팀 성과나 경기 결과에 따른 환불을 제공하지 않습니다.",
    section8Title: "8. 수정",
    section8Text: "당사는 알고리즘 업데이트 또는 비즈니스 관행의 변경을 반영하기 위해 이 약관을 업데이트할 권리를 보유합니다. OddsFlow 분석 플랫폼의 지속적인 사용은 새로운 약관의 수락을 의미합니다.",
    section9Title: "9. 연락처",
    section9Text: "당사 기술 또는 이 약관에 대한 질문은 support@oddsflow.com으로 문의하세요.",
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
    title: "服务条款",
    lastUpdated: "最后更新：2025年1月",
    section1Title: "1. 条款接受",
    section1Text: "欢迎使用 OddsFlow。访问我们的平台即表示您同意这些服务条款。OddsFlow 提供 AI 驱动的足球分析、历史数据处理和市场趋势可视化工具（"服务"）。如果您不同意这些条款，请立即停止使用我们的服务。",
    section2Title: "2. 服务性质",
    section2Text: "OddsFlow 是一个专注于体育数据分析的 SaaS（软件即服务）平台。我们不是博彩运营商：我们不接受投注或促进与体育赛事结果相关的任何金钱交易。我们不是财务顾问：我们的 AI 模型和图表仅供信息和教育目的。仅限访问：您的订阅费仅用于访问我们的软件仪表板和历史数据库，而非承诺的财务回报。",
    section3Title: "3. 使用许可与知识产权",
    section3Text: "OddsFlow 授予您有限的、非独占的、不可转让的许可，以供个人使用访问我们的体育分析软件。所有专有算法、足球预测模型和代码仍为 OddsFlow 的知识产权。您同意不：对我们的分析逻辑进行逆向工程。未经明确许可转售或重新分发我们的市场洞察。",
    section4Title: "4. 数据准确性与 AI 局限性",
    section4Text: "我们的足球分析引擎利用历史统计数据和机器学习来生成概率。然而，体育赛事具有固有的不确定性。OddsFlow 不保证其比赛预测或市场趋势信号的准确性。数据按"原样"提供，我们不对基于可视化数据集做出的决策承担责任。",
    section5Title: "5. 负责任使用与风险披露",
    section5Text: "虽然 OddsFlow 提供高水平的市场情报，但用户承认体育分析涉及风险。您同意 OddsFlow 是研究工具，而非行动指令。您对如何解释和利用所提供的统计数据负全部责任。我们明确否认与使用我们分析工具相关的任何财务损失责任。",
    section6Title: "6. 用户账户与安全",
    section6Text: "要访问高级实时赔率分析，您必须创建账户。您有责任维护凭据的安全性。任何安全违规应立即向我们的支持团队报告。",
    section7Title: "7. 订阅与付款",
    section7Text: "付款通过第三方网关（如 Stripe）安全处理。订阅授予在指定期间内访问我们数据基础设施的权限。我们不根据球队表现或比赛结果提供退款，因为提供的服务是软件访问本身。",
    section8Title: "8. 条款修改",
    section8Text: "我们保留更新这些条款的权利，以反映算法更新或商业实践的变化。继续使用 OddsFlow 分析平台即表示接受新条款。",
    section9Title: "9. 联系方式",
    section9Text: "如有关于我们技术或这些条款的问题，请通过 support@oddsflow.com 联系我们。",
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
    title: "服務條款",
    lastUpdated: "最後更新：2025年1月",
    section1Title: "1. 條款接受",
    section1Text: "歡迎使用 OddsFlow。存取我們的平台即表示您同意這些服務條款。OddsFlow 提供 AI 驅動的足球分析、歷史數據處理和市場趨勢視覺化工具（「服務」）。如果您不同意這些條款，請立即停止使用我們的服務。",
    section2Title: "2. 服務性質",
    section2Text: "OddsFlow 是一個專注於體育數據分析的 SaaS（軟體即服務）平台。我們不是博彩營運商：我們不接受投注或促進與體育賽事結果相關的任何金錢交易。我們不是財務顧問：我們的 AI 模型和圖表僅供資訊和教育目的。僅限存取：您的訂閱費僅用於存取我們的軟體儀表板和歷史資料庫，而非承諾的財務回報。",
    section3Title: "3. 使用許可與智慧財產權",
    section3Text: "OddsFlow 授予您有限的、非獨占的、不可轉讓的許可，以供個人使用存取我們的體育分析軟體。所有專有演算法、足球預測模型和程式碼仍為 OddsFlow 的智慧財產權。您同意不：對我們的分析邏輯進行逆向工程。未經明確許可轉售或重新分發我們的市場洞察。",
    section4Title: "4. 數據準確性與 AI 局限性",
    section4Text: "我們的足球分析引擎利用歷史統計數據和機器學習來生成機率。然而，體育賽事具有固有的不確定性。OddsFlow 不保證其比賽預測或市場趨勢訊號的準確性。數據按「原樣」提供，我們不對基於視覺化數據集做出的決策承擔責任。",
    section5Title: "5. 負責任使用與風險披露",
    section5Text: "雖然 OddsFlow 提供高水準的市場情報，但用戶承認體育分析涉及風險。您同意 OddsFlow 是研究工具，而非行動指令。您對如何解釋和利用所提供的統計數據負全部責任。我們明確否認與使用我們分析工具相關的任何財務損失責任。",
    section6Title: "6. 用戶帳戶與安全",
    section6Text: "要存取高級即時賠率分析，您必須建立帳戶。您有責任維護憑據的安全性。任何安全違規應立即向我們的支援團隊報告。",
    section7Title: "7. 訂閱與付款",
    section7Text: "付款透過第三方閘道（如 Stripe）安全處理。訂閱授予在指定期間內存取我們數據基礎設施的權限。我們不根據球隊表現或比賽結果提供退款，因為提供的服務是軟體存取本身。",
    section8Title: "8. 條款修改",
    section8Text: "我們保留更新這些條款的權利，以反映演算法更新或商業實務的變化。繼續使用 OddsFlow 分析平台即表示接受新條款。",
    section9Title: "9. 聯繫方式",
    section9Text: "如有關於我們技術或這些條款的問題，請透過 support@oddsflow.com 聯繫我們。",
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
    title: "Syarat Layanan",
    lastUpdated: "Terakhir Diperbarui: Januari 2025",
    section1Title: "1. Penerimaan Syarat",
    section1Text: "Selamat datang di OddsFlow. Dengan mengakses platform kami, Anda menyetujui Syarat Layanan ini. OddsFlow menyediakan analisis sepak bola berbasis AI, pemrosesan data historis, dan alat visualisasi tren pasar (\"Layanan\"). Jika Anda tidak menyetujui syarat ini, harap segera hentikan penggunaan Layanan kami.",
    section2Title: "2. Sifat Layanan",
    section2Text: "OddsFlow adalah platform SaaS (Software as a Service) yang didedikasikan untuk analisis data olahraga. Kami BUKAN operator perjudian: Kami tidak menerima taruhan atau memfasilitasi transaksi uang terkait hasil acara olahraga. Kami BUKAN penasihat keuangan: Model AI dan grafik kami hanya untuk tujuan informasi dan edukasi. Akses Saja: Biaya langganan Anda semata-mata untuk akses ke dasbor perangkat lunak dan database historis kami, bukan untuk pengembalian finansial yang dijanjikan.",
    section3Title: "3. Lisensi Penggunaan & Kekayaan Intelektual",
    section3Text: "OddsFlow memberikan lisensi terbatas, non-eksklusif, dan tidak dapat dipindahtangankan untuk mengakses perangkat lunak analisis olahraga kami untuk penggunaan pribadi. Semua algoritma kepemilikan, model prediksi sepak bola, dan kode tetap menjadi kekayaan intelektual OddsFlow. Anda setuju untuk tidak: Merekayasa balik logika analisis kami. Menjual kembali atau mendistribusikan ulang wawasan pasar kami tanpa izin eksplisit.",
    section4Title: "4. Akurasi Data dan Keterbatasan AI",
    section4Text: "Mesin analisis sepak bola kami menggunakan statistik historis dan pembelajaran mesin untuk menghasilkan probabilitas. Namun, acara olahraga memiliki variasi yang melekat. OddsFlow tidak menjamin akurasi proyeksi pertandingan atau sinyal tren pasar. Data disediakan \"apa adanya,\" dan kami tidak bertanggung jawab atas keputusan yang dibuat berdasarkan kumpulan data yang divisualisasikan.",
    section5Title: "5. Penggunaan Bertanggung Jawab & Pengungkapan Risiko",
    section5Text: "Meskipun OddsFlow menyediakan intelijen pasar tingkat tinggi, pengguna mengakui bahwa analisis olahraga melibatkan risiko. Anda setuju bahwa OddsFlow adalah alat penelitian, bukan arahan untuk bertindak. Anda bertanggung jawab penuh atas cara Anda menafsirkan dan menggunakan data statistik yang disediakan. Kami secara eksplisit menolak tanggung jawab atas kerugian finansial yang terkait dengan penggunaan alat analisis kami.",
    section6Title: "6. Akun Pengguna & Keamanan",
    section6Text: "Untuk mengakses analisis odds langsung premium, Anda harus membuat akun. Anda bertanggung jawab untuk menjaga keamanan kredensial Anda. Setiap pelanggaran keamanan harus segera dilaporkan ke tim dukungan kami.",
    section7Title: "7. Langganan & Pembayaran",
    section7Text: "Pembayaran diproses dengan aman melalui gateway pihak ketiga (mis. Stripe). Langganan memberikan akses ke infrastruktur data kami untuk periode yang ditentukan. Kami tidak menawarkan pengembalian dana berdasarkan kinerja tim atau hasil pertandingan, karena layanan yang disediakan adalah akses ke perangkat lunak itu sendiri.",
    section8Title: "8. Modifikasi",
    section8Text: "Kami berhak memperbarui ketentuan ini untuk mencerminkan perubahan dalam pembaruan algoritma atau praktik bisnis kami. Penggunaan berkelanjutan platform analisis OddsFlow merupakan penerimaan ketentuan baru.",
    section9Title: "9. Kontak",
    section9Text: "Untuk pertanyaan mengenai teknologi kami atau ketentuan ini, silakan hubungi kami di support@oddsflow.com.",
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

export default function TermsOfServicePage() {
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
    const currentPath = '/terms-of-service';
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
