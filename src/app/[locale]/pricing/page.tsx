'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, getUserSubscription, UserSubscription } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeNames, localeToTranslationCode, type Locale } from '@/i18n/config';
import Footer from '@/components/Footer';

const translations: Record<string, Record<string, string>> = {
  EN: {
    pricing: "Pricing",
    pricingSubtitle: "Choose the plan that fits your needs",
    comingSoon: "Coming Soon",
    comingSoonDesc: "Flexible pricing plans will be available soon",
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance", community: "Community", news: "News",
    login: "Log In", getStarted: "Get Started",
    footer: "18+ | Gambling involves risk. Please gamble responsibly.",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    footerDesc: "AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.",
    product: "Product",
    company: "Company",
    legal: "Legal",
    aboutUs: "About Us",
    contact: "Contact",
    blog: "Blog",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    responsibleGaming: "Responsible Gaming",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    // Pricing cards
    freeTrial: "Free Trial", starter: "Starter", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/week", perMonth: "/month",
    choose1League: "Choose", oneLeague: "1 League",
    daysAccess: "access", sevenDays: "7 days",
    choose1Style: "Choose", oneBettingStyle: "1 Betting Style",
    aiPredictions: "AI Predictions & Signals",
    fromTop5: "from Top 5 + UEFA",
    all5Leagues: "All 5 Major Leagues", unlocked: "unlocked",
    uefaFifa: "UEFA CL + FIFA 2026", included: "included",
    all5LeaguesUefa: "All 5 Leagues + UEFA",
    all5Styles: "All 5 Betting Styles",
    prioritySupport: "Priority support",
    choose1LeagueLabel: "Choose 1 league:",
    choose1StyleLabel: "Choose 1 betting style:",
    everythingIncluded: "Everything included:",
    sixLeagues: "6 Leagues", fiveStyles: "5 Styles",
    startFreeTrial: "Start Free Trial",
    trialNote: "7-day free trial • No credit card",
    popular: "POPULAR",
    bettingStylesTitle: "Betting Styles Explained",
    availableLeaguesTitle: "Available Leagues",
    aggressive: "Aggressive", aggressiveDesc: "High risk, high reward picks",
    conservative: "Conservative", conservativeDesc: "Low risk, steady returns",
    balanced: "Balanced", balancedDesc: "Optimal risk-reward ratio",
    valueHunter: "Value Hunter", valueHunterDesc: "Best odds value picks",
    safePlay: "Safe Play", safePlayDesc: "Highest confidence picks",
    subscribe: "Subscribe", currentPlan: "Current Plan", managePlan: "Manage Plan", upgrade: "Upgrade",
    popularLeagues: "Popular Leagues",
    aiPredictionsFooter: "AI Predictions",
    aiFootballPredictions: "AI Football Predictions",
    onextwoPredictions: "1x2 Predictions",
    overUnderTips: "Over/Under Tips",
    handicapBetting: "Handicap Betting",
    aiBettingPerformance: "AI Betting Performance",
    footballTipsToday: "Football Tips Today",
    solution: "Solution",
    liveOdds: "AI Performance",
    communityFooter: "Community",
    globalChat: "Global Chat",
    userPredictions: "User Predictions",
    todayMatches: "Today Matches",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
    // Trust Signals
    trustedBy: "Trusted by",
    activeBettors: "active bettors",
    avgROI: "Average ROI in 2025",
    // Why Upgrade Section
    whyUpgrade: "Why Upgrade to OddsFlow Pro?",
    whyUpgradeDesc: "Unlike free tipster sites, OddsFlow uses real-time AI analysis to track Asian Handicap movements, 1x2 odds shifts, and over/under trends. Our machine learning models analyze thousands of matches to deliver data-driven football predictions with proven accuracy.",
    feature1Title: "Real-Time AI Analysis",
    feature1Desc: "Our AI monitors live odds movements from top bookmakers to identify value bets before the market adjusts.",
    feature2Title: "Multiple Betting Styles",
    feature2Desc: "Choose from Conservative, Balanced, Aggressive, Value Hunter, or Safe Play strategies tailored to your risk tolerance.",
    feature3Title: "Proven Track Record",
    feature3Desc: "Transparent performance history with verified results. Check our AI Performance page for detailed ROI stats.",
    // FAQ Section
    faqTitle: "Frequently Asked Questions",
    faq1Q: "Can I cancel my OddsFlow subscription anytime?",
    faq1A: "Yes! You can cancel your subscription at any time from your dashboard. There are no cancellation fees, and you'll continue to have access until the end of your billing period.",
    faq2Q: "How accurate are the Pro plan predictions?",
    faq2A: "Our AI predictions have maintained an average ROI of 12-18% over the past year. You can view our complete track record on the AI Performance page, where we publish verified results for full transparency.",
    faq3Q: "Do you offer refunds?",
    faq3A: "We offer a 7-day free trial so you can test our predictions before committing. If you're not satisfied within the first 7 days of a paid subscription, contact our support team for a full refund.",
    faq4Q: "What leagues are covered in the Pro plan?",
    faq4A: "The Pro plan covers all 5 major European leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) plus UEFA Champions League. The Ultimate plan also includes FIFA World Cup qualifiers.",
    faq5Q: "How do the betting styles work?",
    faq5A: "Each betting style uses different AI models optimized for specific risk-reward profiles. Conservative focuses on high-probability bets, while Aggressive targets higher odds with greater potential returns. Value Hunter specifically identifies odds that are mispriced by bookmakers.",
  },
  ES: {
    pricing: "Precios",
    pricingSubtitle: "Elige el plan que se adapte a tus necesidades",
    comingSoon: "Próximamente",
    comingSoonDesc: "Planes de precios flexibles estarán disponibles pronto",
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA", community: "Comunidad", news: "Noticias",
    login: "Iniciar Sesión", getStarted: "Comenzar",
    footer: "18+ | El juego implica riesgo. Por favor juega responsablemente.",
    allRights: "© 2026 OddsFlow. Todos los derechos reservados.",
    footerDesc: "Analisis de cuotas de futbol impulsado por IA para predicciones mas inteligentes.",
    product: "Producto",
    company: "Empresa",
    legal: "Legal",
    aboutUs: "Sobre Nosotros",
    contact: "Contacto",
    blog: "Blog",
    termsOfService: "Terminos de Servicio",
    privacyPolicy: "Politica de Privacidad",
    responsibleGaming: "Juego Responsable",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juega responsablemente.",
    freeTrial: "Prueba Gratis", starter: "Básico", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/semana", perMonth: "/mes",
    choose1League: "Elige", oneLeague: "1 Liga",
    daysAccess: "acceso", sevenDays: "7 días",
    choose1Style: "Elige", oneBettingStyle: "1 Estilo de Apuesta",
    aiPredictions: "Predicciones IA y Señales",
    fromTop5: "de las Top 5 + UEFA",
    all5Leagues: "Las 5 Ligas Principales", unlocked: "desbloqueadas",
    uefaFifa: "UEFA CL + FIFA 2026", included: "incluidos",
    all5LeaguesUefa: "5 Ligas + UEFA",
    all5Styles: "5 Estilos de Apuesta",
    prioritySupport: "Soporte prioritario",
    choose1LeagueLabel: "Elige 1 liga:",
    choose1StyleLabel: "Elige 1 estilo:",
    everythingIncluded: "Todo incluido:",
    sixLeagues: "6 Ligas", fiveStyles: "5 Estilos",
    startFreeTrial: "Comenzar Prueba",
    trialNote: "7 días gratis • Sin tarjeta",
    popular: "POPULAR",
    bettingStylesTitle: "Estilos de Apuesta",
    availableLeaguesTitle: "Ligas Disponibles",
    aggressive: "Agresivo", aggressiveDesc: "Alto riesgo, alta recompensa",
    conservative: "Conservador", conservativeDesc: "Bajo riesgo, retornos estables",
    balanced: "Equilibrado", balancedDesc: "Ratio riesgo-recompensa óptimo",
    valueHunter: "Cazador de Valor", valueHunterDesc: "Mejores cuotas de valor",
    safePlay: "Juego Seguro", safePlayDesc: "Picks de mayor confianza",
    subscribe: "Suscribir", currentPlan: "Plan Actual", managePlan: "Gestionar Plan", upgrade: "Mejorar",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Predicciones IA",
    aiFootballPredictions: "Predicciones de Futbol IA",
    onextwoPredictions: "Predicciones 1x2",
    overUnderTips: "Consejos Over/Under",
    handicapBetting: "Apuestas Handicap",
    aiBettingPerformance: "Rendimiento de Apuestas IA",
    footballTipsToday: "Tips de Futbol Hoy",
    solution: "Solucion",
    liveOdds: "Rendimiento IA",
    communityFooter: "Comunidad",
    globalChat: "Chat Global",
    userPredictions: "Predicciones de Usuarios",
    todayMatches: "Partidos de Hoy",
    disclaimer: "Aviso legal: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precision de las predicciones y no somos responsables de ninguna perdida financiera. El juego implica riesgo. Por favor juega responsablemente. Si usted o alguien que conoce tiene un problema con el juego, busque ayuda. Los usuarios deben tener 18+ años.",
    trustedBy: "Confiado por", activeBettors: "apostadores activos", avgROI: "ROI promedio en 2025",
    whyUpgrade: "¿Por qué actualizar a OddsFlow Pro?",
    whyUpgradeDesc: "A diferencia de los sitios de pronósticos gratuitos, OddsFlow utiliza análisis de IA en tiempo real para rastrear movimientos de Handicap Asiático y tendencias de over/under.",
    feature1Title: "Análisis IA en Tiempo Real", feature1Desc: "Nuestra IA monitorea movimientos de cuotas en vivo para identificar apuestas de valor.",
    feature2Title: "Múltiples Estilos de Apuesta", feature2Desc: "Elige entre estrategias Conservadora, Equilibrada, Agresiva, Cazador de Valor o Juego Seguro.",
    feature3Title: "Historial Probado", feature3Desc: "Historial de rendimiento transparente con resultados verificados.",
    faqTitle: "Preguntas Frecuentes",
    faq1Q: "¿Puedo cancelar mi suscripción en cualquier momento?", faq1A: "¡Sí! Puedes cancelar tu suscripción en cualquier momento desde tu panel. No hay tarifas de cancelación.",
    faq2Q: "¿Qué tan precisas son las predicciones Pro?", faq2A: "Nuestras predicciones de IA han mantenido un ROI promedio de 12-18% durante el último año.",
    faq3Q: "¿Ofrecen reembolsos?", faq3A: "Ofrecemos una prueba gratuita de 7 días. Si no estás satisfecho, contacta a nuestro equipo de soporte.",
    faq4Q: "¿Qué ligas cubre el plan Pro?", faq4A: "El plan Pro cubre las 5 principales ligas europeas más la UEFA Champions League.",
    faq5Q: "¿Cómo funcionan los estilos de apuesta?", faq5A: "Cada estilo utiliza diferentes modelos de IA optimizados para perfiles específicos de riesgo-recompensa.",
  },
  PT: {
    pricing: "Preços",
    pricingSubtitle: "Escolha o plano que atende às suas necessidades",
    comingSoon: "Em Breve",
    comingSoonDesc: "Planos de preços flexíveis estarão disponíveis em breve",
    home: "Início", predictions: "Previsões", leagues: "Ligas", performance: "Desempenho IA", community: "Comunidade", news: "Notícias",
    login: "Entrar", getStarted: "Começar",
    footer: "18+ | O jogo envolve risco. Por favor, jogue com responsabilidade.",
    allRights: "© 2026 OddsFlow. Todos os direitos reservados.",
    footerDesc: "Analise de odds de futebol com IA para previsoes mais inteligentes.",
    product: "Produto",
    company: "Empresa",
    legal: "Legal",
    aboutUs: "Sobre Nos",
    contact: "Contato",
    blog: "Blog",
    termsOfService: "Termos de Servico",
    privacyPolicy: "Politica de Privacidade",
    responsibleGaming: "Jogo Responsavel",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    freeTrial: "Teste Grátis", starter: "Iniciante", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/semana", perMonth: "/mês",
    choose1League: "Escolha", oneLeague: "1 Liga",
    daysAccess: "acesso", sevenDays: "7 dias",
    choose1Style: "Escolha", oneBettingStyle: "1 Estilo de Aposta",
    aiPredictions: "Previsões IA e Sinais",
    fromTop5: "das Top 5 + UEFA",
    all5Leagues: "As 5 Ligas Principais", unlocked: "desbloqueadas",
    uefaFifa: "UEFA CL + FIFA 2026", included: "incluídos",
    all5LeaguesUefa: "5 Ligas + UEFA",
    all5Styles: "5 Estilos de Aposta",
    prioritySupport: "Suporte prioritário",
    choose1LeagueLabel: "Escolha 1 liga:",
    choose1StyleLabel: "Escolha 1 estilo:",
    everythingIncluded: "Tudo incluído:",
    sixLeagues: "6 Ligas", fiveStyles: "5 Estilos",
    startFreeTrial: "Começar Teste",
    trialNote: "7 dias grátis • Sem cartão",
    popular: "POPULAR",
    bettingStylesTitle: "Estilos de Aposta",
    availableLeaguesTitle: "Ligas Disponíveis",
    aggressive: "Agressivo", aggressiveDesc: "Alto risco, alta recompensa",
    conservative: "Conservador", conservativeDesc: "Baixo risco, retornos estáveis",
    balanced: "Equilibrado", balancedDesc: "Proporção risco-recompensa ideal",
    valueHunter: "Caçador de Valor", valueHunterDesc: "Melhores odds de valor",
    safePlay: "Jogo Seguro", safePlayDesc: "Picks de maior confiança",
    subscribe: "Assinar", currentPlan: "Plano Atual", managePlan: "Gerenciar Plano", upgrade: "Atualizar",
    popularLeagues: "Ligas Populares",
    aiPredictionsFooter: "Previsões IA",
    aiFootballPredictions: "Previsões de Futebol IA",
    onextwoPredictions: "Previsões 1x2",
    overUnderTips: "Dicas Over/Under",
    handicapBetting: "Apostas Handicap",
    aiBettingPerformance: "Desempenho de Apostas IA",
    footballTipsToday: "Dicas de Futebol Hoje",
    solution: "Solucao",
    liveOdds: "Desempenho IA",
    communityFooter: "Comunidade",
    globalChat: "Chat Global",
    userPredictions: "Previsoes de Usuarios",
    todayMatches: "Jogos de Hoje",
    disclaimer: "Aviso legal: OddsFlow fornece previsoes baseadas em IA apenas para fins informativos e de entretenimento. Nao garantimos a precisao das previsoes e nao somos responsaveis por quaisquer perdas financeiras. Apostas envolvem risco. Por favor aposte com responsabilidade. Se voce ou alguem que conhece tem um problema com jogos, procure ajuda. Usuarios devem ter 18+ anos.",
    trustedBy: "Confiado por", activeBettors: "apostadores ativos", avgROI: "ROI médio em 2025",
    whyUpgrade: "Por que atualizar para OddsFlow Pro?",
    whyUpgradeDesc: "Diferente dos sites de dicas gratuitos, OddsFlow usa análise de IA em tempo real para rastrear movimentos de Handicap Asiático e tendências over/under.",
    feature1Title: "Análise IA em Tempo Real", feature1Desc: "Nossa IA monitora movimentos de odds ao vivo para identificar apostas de valor.",
    feature2Title: "Múltiplos Estilos de Aposta", feature2Desc: "Escolha entre estratégias Conservadora, Equilibrada, Agressiva, Caçador de Valor ou Jogo Seguro.",
    feature3Title: "Histórico Comprovado", feature3Desc: "Histórico de desempenho transparente com resultados verificados.",
    faqTitle: "Perguntas Frequentes",
    faq1Q: "Posso cancelar minha assinatura a qualquer momento?", faq1A: "Sim! Você pode cancelar sua assinatura a qualquer momento pelo painel. Não há taxas de cancelamento.",
    faq2Q: "Quão precisas são as previsões Pro?", faq2A: "Nossas previsões de IA mantiveram um ROI médio de 12-18% no último ano.",
    faq3Q: "Vocês oferecem reembolso?", faq3A: "Oferecemos um teste gratuito de 7 dias. Se não estiver satisfeito, entre em contato com nossa equipe de suporte.",
    faq4Q: "Quais ligas o plano Pro cobre?", faq4A: "O plano Pro cobre as 5 principais ligas europeias mais a UEFA Champions League.",
    faq5Q: "Como funcionam os estilos de aposta?", faq5A: "Cada estilo usa diferentes modelos de IA otimizados para perfis específicos de risco-recompensa.",
  },
  DE: {
    pricing: "Preise",
    pricingSubtitle: "Wählen Sie den Plan, der Ihren Bedürfnissen entspricht",
    comingSoon: "Demnächst",
    comingSoonDesc: "Flexible Preispläne werden bald verfügbar sein",
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung", community: "Community", news: "Nachrichten",
    login: "Anmelden", getStarted: "Loslegen",
    footer: "18+ | Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    allRights: "© 2026 OddsFlow. Alle Rechte vorbehalten.",
    footerDesc: "KI-gestutzte Fussball-Quotenanalyse fur intelligentere Vorhersagen.",
    product: "Produkt",
    company: "Unternehmen",
    legal: "Rechtliches",
    aboutUs: "Uber Uns",
    contact: "Kontakt",
    blog: "Blog",
    termsOfService: "Nutzungsbedingungen",
    privacyPolicy: "Datenschutz",
    responsibleGaming: "Verantwortungsvolles Spielen",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glucksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    freeTrial: "Kostenlos Testen", starter: "Starter", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/Woche", perMonth: "/Monat",
    choose1League: "Wähle", oneLeague: "1 Liga",
    daysAccess: "Zugang", sevenDays: "7 Tage",
    choose1Style: "Wähle", oneBettingStyle: "1 Wettstil",
    aiPredictions: "KI-Vorhersagen & Signale",
    fromTop5: "aus Top 5 + UEFA",
    all5Leagues: "Alle 5 Hauptligen", unlocked: "freigeschaltet",
    uefaFifa: "UEFA CL + FIFA 2026", included: "inklusive",
    all5LeaguesUefa: "5 Ligen + UEFA",
    all5Styles: "5 Wettstile",
    prioritySupport: "Prioritäts-Support",
    choose1LeagueLabel: "Wähle 1 Liga:",
    choose1StyleLabel: "Wähle 1 Stil:",
    everythingIncluded: "Alles inklusive:",
    sixLeagues: "6 Ligen", fiveStyles: "5 Stile",
    startFreeTrial: "Kostenlos Starten",
    trialNote: "7 Tage kostenlos • Keine Karte",
    popular: "BELIEBT",
    bettingStylesTitle: "Wettstile Erklärt",
    availableLeaguesTitle: "Verfügbare Ligen",
    aggressive: "Aggressiv", aggressiveDesc: "Hohes Risiko, hohe Belohnung",
    conservative: "Konservativ", conservativeDesc: "Niedriges Risiko, stabile Erträge",
    balanced: "Ausgewogen", balancedDesc: "Optimales Risiko-Ertrags-Verhältnis",
    valueHunter: "Wertjäger", valueHunterDesc: "Beste Quotenwert-Picks",
    safePlay: "Sicheres Spiel", safePlayDesc: "Picks mit höchster Zuversicht",
    subscribe: "Abonnieren", currentPlan: "Aktueller Plan", managePlan: "Plan Verwalten", upgrade: "Upgrade",
    popularLeagues: "Beliebte Ligen",
    aiPredictionsFooter: "KI-Vorhersagen",
    aiFootballPredictions: "KI-Fussballvorhersagen",
    onextwoPredictions: "1x2 Vorhersagen",
    overUnderTips: "Über/Unter Tipps",
    handicapBetting: "Handicap-Wetten",
    aiBettingPerformance: "KI-Wettleistung",
    footballTipsToday: "Fussballtipps Heute",
    solution: "Losung",
    liveOdds: "KI-Leistung",
    communityFooter: "Community",
    globalChat: "Globaler Chat",
    userPredictions: "Benutzervorhersagen",
    todayMatches: "Heutige Spiele",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestutzte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Wir garantieren nicht die Genauigkeit der Vorhersagen und sind nicht verantwortlich fur finanzielle Verluste. Glucksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll. Wenn Sie oder jemand den Sie kennen ein Glucksspielproblem hat, suchen Sie Hilfe. Benutzer mussen 18+ Jahre alt sein.",
    trustedBy: "Vertraut von", activeBettors: "aktiven Wettenden", avgROI: "Durchschnittlicher ROI 2025",
    whyUpgrade: "Warum auf OddsFlow Pro upgraden?", whyUpgradeDesc: "Im Gegensatz zu kostenlosen Tippseiten verwendet OddsFlow KI-Echtzeitanalysen.",
    feature1Title: "KI-Echtzeitanalyse", feature1Desc: "Unsere KI überwacht Live-Quotenbewegungen.", feature2Title: "Mehrere Wettstile", feature2Desc: "Wählen Sie zwischen verschiedenen Strategien.", feature3Title: "Bewährte Erfolgsgeschichte", feature3Desc: "Transparente Leistungshistorie.",
    faqTitle: "Häufig gestellte Fragen", faq1Q: "Kann ich mein Abo jederzeit kündigen?", faq1A: "Ja! Sie können Ihr Abonnement jederzeit kündigen.", faq2Q: "Wie genau sind die Pro-Vorhersagen?", faq2A: "Unsere KI-Vorhersagen haben einen durchschnittlichen ROI von 12-18%.", faq3Q: "Bieten Sie Rückerstattungen an?", faq3A: "Wir bieten eine 7-tägige kostenlose Testversion an.", faq4Q: "Welche Ligen deckt der Pro-Plan ab?", faq4A: "Der Pro-Plan deckt alle 5 großen europäischen Ligen ab.", faq5Q: "Wie funktionieren die Wettstile?", faq5A: "Jeder Stil verwendet verschiedene KI-Modelle.",
  },
  FR: {
    pricing: "Tarifs",
    pricingSubtitle: "Choisissez le plan qui correspond à vos besoins",
    comingSoon: "Bientôt Disponible",
    comingSoonDesc: "Des plans tarifaires flexibles seront bientôt disponibles",
    home: "Accueil", predictions: "Prédictions", leagues: "Ligues", performance: "Performance IA", community: "Communauté", news: "Actualités",
    login: "Connexion", getStarted: "Commencer",
    footer: "18+ | Les jeux d'argent comportent des risques. Jouez de manière responsable.",
    allRights: "© 2026 OddsFlow. Tous droits réservés.",
    footerDesc: "Analyse de cotes de football propulsee par l'IA pour des predictions plus intelligentes.",
    product: "Produit",
    company: "Entreprise",
    legal: "Mentions Legales",
    aboutUs: "A Propos",
    contact: "Contact",
    blog: "Blog",
    termsOfService: "Conditions d'Utilisation",
    privacyPolicy: "Politique de Confidentialite",
    responsibleGaming: "Jeu Responsable",
    allRightsReserved: "Tous droits reserves.",
    gamblingWarning: "Le jeu comporte des risques. Veuillez jouer de maniere responsable.",
    freeTrial: "Essai Gratuit", starter: "Débutant", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/semaine", perMonth: "/mois",
    choose1League: "Choisir", oneLeague: "1 Ligue",
    daysAccess: "accès", sevenDays: "7 jours",
    choose1Style: "Choisir", oneBettingStyle: "1 Style de Pari",
    aiPredictions: "Prédictions IA & Signaux",
    fromTop5: "du Top 5 + UEFA",
    all5Leagues: "Les 5 Ligues Majeures", unlocked: "débloquées",
    uefaFifa: "UEFA CL + FIFA 2026", included: "inclus",
    all5LeaguesUefa: "5 Ligues + UEFA",
    all5Styles: "5 Styles de Pari",
    prioritySupport: "Support prioritaire",
    choose1LeagueLabel: "Choisir 1 ligue:",
    choose1StyleLabel: "Choisir 1 style:",
    everythingIncluded: "Tout inclus:",
    sixLeagues: "6 Ligues", fiveStyles: "5 Styles",
    startFreeTrial: "Essai Gratuit",
    trialNote: "7 jours gratuits • Sans carte",
    popular: "POPULAIRE",
    bettingStylesTitle: "Styles de Pari",
    availableLeaguesTitle: "Ligues Disponibles",
    aggressive: "Agressif", aggressiveDesc: "Risque élevé, récompense élevée",
    conservative: "Conservateur", conservativeDesc: "Faible risque, rendements stables",
    balanced: "Équilibré", balancedDesc: "Ratio risque-récompense optimal",
    valueHunter: "Chasseur de Valeur", valueHunterDesc: "Meilleures cotes de valeur",
    safePlay: "Jeu Sûr", safePlayDesc: "Picks de haute confiance",
    subscribe: "S'abonner", currentPlan: "Plan Actuel", managePlan: "Gérer le Plan", upgrade: "Mettre à niveau",
    popularLeagues: "Ligues Populaires",
    aiPredictionsFooter: "Prédictions IA",
    aiFootballPredictions: "Prédictions Football IA",
    onextwoPredictions: "Prédictions 1x2",
    overUnderTips: "Conseils Over/Under",
    handicapBetting: "Paris Handicap",
    aiBettingPerformance: "Performance Paris IA",
    footballTipsToday: "Pronostics Foot Aujourd'hui",
    solution: "Solution",
    liveOdds: "Performance IA",
    communityFooter: "Communaute",
    globalChat: "Chat Global",
    userPredictions: "Predictions Utilisateurs",
    todayMatches: "Matchs du Jour",
    disclaimer: "Avertissement: OddsFlow fournit des predictions basees sur l'IA a des fins d'information et de divertissement uniquement. Nous ne garantissons pas l'exactitude des predictions et ne sommes pas responsables des pertes financieres. Le jeu comporte des risques. Veuillez jouer de maniere responsable. Si vous ou quelqu'un que vous connaissez a un probleme de jeu, veuillez chercher de l'aide. Les utilisateurs doivent avoir 18+ ans.",
    trustedBy: "Approuvé par", activeBettors: "parieurs actifs", avgROI: "ROI moyen en 2025",
    whyUpgrade: "Pourquoi passer à OddsFlow Pro?", whyUpgradeDesc: "Contrairement aux sites de pronostics gratuits, OddsFlow utilise l'analyse IA en temps réel.",
    feature1Title: "Analyse IA en Temps Réel", feature1Desc: "Notre IA surveille les mouvements de cotes en direct.", feature2Title: "Styles de Paris Multiples", feature2Desc: "Choisissez entre différentes stratégies.", feature3Title: "Historique Prouvé", feature3Desc: "Historique de performance transparent.",
    faqTitle: "Questions Fréquentes", faq1Q: "Puis-je annuler mon abonnement à tout moment?", faq1A: "Oui! Vous pouvez annuler votre abonnement à tout moment.", faq2Q: "Quelle est la précision des prédictions Pro?", faq2A: "Nos prédictions IA ont maintenu un ROI moyen de 12-18%.", faq3Q: "Offrez-vous des remboursements?", faq3A: "Nous offrons un essai gratuit de 7 jours.", faq4Q: "Quelles ligues le plan Pro couvre-t-il?", faq4A: "Le plan Pro couvre les 5 grandes ligues européennes.", faq5Q: "Comment fonctionnent les styles de paris?", faq5A: "Chaque style utilise différents modèles IA.",
  },
  JA: {
    pricing: "料金",
    pricingSubtitle: "ニーズに合ったプランをお選びください",
    comingSoon: "近日公開",
    comingSoonDesc: "柔軟な料金プランを準備中です",
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "AIパフォーマンス", community: "コミュニティ", news: "ニュース",
    login: "ログイン", getStarted: "始める",
    footer: "18+ | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    footerDesc: "よりスマートな予測のためのAI駆動フットボールオッズ分析。",
    product: "製品",
    company: "会社",
    legal: "法的情報",
    aboutUs: "私たちについて",
    contact: "お問い合わせ",
    blog: "ブログ",
    termsOfService: "利用規約",
    privacyPolicy: "プライバシーポリシー",
    responsibleGaming: "責任あるギャンブル",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
    freeTrial: "無料トライアル", starter: "スターター", pro: "プロ", ultimate: "アルティメット",
    perWeek: "/週", perMonth: "/月",
    choose1League: "選択", oneLeague: "1リーグ",
    daysAccess: "アクセス", sevenDays: "7日間",
    choose1Style: "選択", oneBettingStyle: "1ベッティングスタイル",
    aiPredictions: "AI予測＆シグナル",
    fromTop5: "トップ5 + UEFAから",
    all5Leagues: "5大リーグすべて", unlocked: "解放",
    uefaFifa: "UEFA CL + FIFA 2026", included: "含む",
    all5LeaguesUefa: "5リーグ + UEFA",
    all5Styles: "5つのベッティングスタイル",
    prioritySupport: "優先サポート",
    choose1LeagueLabel: "1リーグを選択:",
    choose1StyleLabel: "1スタイルを選択:",
    everythingIncluded: "すべて含む:",
    sixLeagues: "6リーグ", fiveStyles: "5スタイル",
    startFreeTrial: "無料で始める",
    trialNote: "7日間無料 • カード不要",
    popular: "人気",
    bettingStylesTitle: "ベッティングスタイル説明",
    availableLeaguesTitle: "利用可能なリーグ",
    aggressive: "アグレッシブ", aggressiveDesc: "ハイリスク、ハイリターン",
    conservative: "コンサバティブ", conservativeDesc: "低リスク、安定リターン",
    balanced: "バランス", balancedDesc: "最適なリスクリターン比",
    valueHunter: "バリューハンター", valueHunterDesc: "最高価値のオッズ",
    safePlay: "セーフプレイ", safePlayDesc: "最高信頼度のピック",
    subscribe: "購読する", currentPlan: "現在のプラン", managePlan: "プラン管理", upgrade: "アップグレード",
    popularLeagues: "人気リーグ",
    aiPredictionsFooter: "AI予測",
    aiFootballPredictions: "AIサッカー予測",
    onextwoPredictions: "1x2予測",
    overUnderTips: "オーバー/アンダー予想",
    handicapBetting: "ハンディキャップベット",
    aiBettingPerformance: "AIベッティング実績",
    footballTipsToday: "今日のサッカー予想",
    solution: "ソリューション",
    liveOdds: "AIパフォーマンス",
    communityFooter: "コミュニティ",
    globalChat: "グローバルチャット",
    userPredictions: "ユーザー予測",
    todayMatches: "今日の試合",
    disclaimer: "免責事項: OddsFlowは情報および娯楽目的のみでAI駆動の予測を提供しています。予測の正確性を保証せず、いかなる財務損失についても責任を負いません。ギャンブルにはリスクが伴います。責任を持ってお楽しみください。あなたまたはあなたの知人がギャンブル問題を抱えている場合は、助けを求めてください。ユーザーは18歳以上である必要があります。",
    trustedBy: "信頼", activeBettors: "人以上のアクティブベッター", avgROI: "2025年平均ROI",
    whyUpgrade: "OddsFlow Proにアップグレードする理由", whyUpgradeDesc: "無料の予想サイトとは異なり、OddsFlowはリアルタイムAI分析を使用してアジアンハンディキャップの動きを追跡します。",
    feature1Title: "リアルタイムAI分析", feature1Desc: "AIがライブオッズの動きを監視します。", feature2Title: "複数のベッティングスタイル", feature2Desc: "様々な戦略から選択できます。", feature3Title: "実績のある履歴", feature3Desc: "透明性のあるパフォーマンス履歴。",
    faqTitle: "よくある質問", faq1Q: "いつでもサブスクリプションをキャンセルできますか？", faq1A: "はい！いつでもキャンセル可能です。", faq2Q: "Pro予測の精度は？", faq2A: "AI予測は平均12-18%のROIを維持しています。", faq3Q: "返金はありますか？", faq3A: "7日間の無料トライアルを提供しています。", faq4Q: "Proプランはどのリーグをカバー？", faq4A: "5大欧州リーグとUEFAチャンピオンズリーグをカバー。", faq5Q: "ベッティングスタイルの仕組みは？", faq5A: "各スタイルは異なるAIモデルを使用します。",
  },
  KO: {
    pricing: "가격",
    pricingSubtitle: "필요에 맞는 플랜을 선택하세요",
    comingSoon: "곧 출시 예정",
    comingSoonDesc: "유연한 가격 플랜이 곧 제공될 예정입니다",
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성능", community: "커뮤니티", news: "뉴스",
    login: "로그인", getStarted: "시작하기",
    footer: "18+ | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.",
    allRights: "© 2026 OddsFlow. All rights reserved.",
    footerDesc: "더 스마트한 예측을 위한 AI 기반 축구 배당률 분석.",
    product: "제품",
    company: "회사",
    legal: "법적 정보",
    aboutUs: "회사 소개",
    contact: "문의하기",
    blog: "블로그",
    termsOfService: "서비스 약관",
    privacyPolicy: "개인정보 처리방침",
    responsibleGaming: "책임감 있는 게임",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
    freeTrial: "무료 체험", starter: "스타터", pro: "프로", ultimate: "얼티밋",
    perWeek: "/주", perMonth: "/월",
    choose1League: "선택", oneLeague: "1개 리그",
    daysAccess: "이용", sevenDays: "7일",
    choose1Style: "선택", oneBettingStyle: "1개 베팅 스타일",
    aiPredictions: "AI 예측 & 시그널",
    fromTop5: "Top 5 + UEFA 중",
    all5Leagues: "5대 리그 전체", unlocked: "해제",
    uefaFifa: "UEFA CL + FIFA 2026", included: "포함",
    all5LeaguesUefa: "5개 리그 + UEFA",
    all5Styles: "5개 베팅 스타일",
    prioritySupport: "우선 지원",
    choose1LeagueLabel: "1개 리그 선택:",
    choose1StyleLabel: "1개 스타일 선택:",
    everythingIncluded: "모두 포함:",
    sixLeagues: "6개 리그", fiveStyles: "5개 스타일",
    startFreeTrial: "무료 시작",
    trialNote: "7일 무료 • 카드 불필요",
    popular: "인기",
    bettingStylesTitle: "베팅 스타일 설명",
    availableLeaguesTitle: "이용 가능한 리그",
    aggressive: "공격적", aggressiveDesc: "고위험, 고수익",
    conservative: "보수적", conservativeDesc: "저위험, 안정 수익",
    balanced: "균형", balancedDesc: "최적의 위험-수익 비율",
    valueHunter: "가치 헌터", valueHunterDesc: "최고 가치 배당",
    safePlay: "안전 플레이", safePlayDesc: "최고 신뢰도 픽",
    subscribe: "구독하기", currentPlan: "현재 플랜", managePlan: "플랜 관리", upgrade: "업그레이드",
    popularLeagues: "인기 리그",
    aiPredictionsFooter: "AI 예측",
    aiFootballPredictions: "AI 축구 예측",
    onextwoPredictions: "1x2 예측",
    overUnderTips: "오버/언더 팁",
    handicapBetting: "핸디캡 베팅",
    aiBettingPerformance: "AI 베팅 성과",
    footballTipsToday: "오늘의 축구 팁",
    solution: "솔루션",
    liveOdds: "AI 성능",
    communityFooter: "커뮤니티",
    globalChat: "글로벌 채팅",
    userPredictions: "사용자 예측",
    todayMatches: "오늘 경기",
    disclaimer: "면책조항: OddsFlow는 정보 및 오락 목적으로만 AI 기반 예측을 제공합니다. 예측의 정확성을 보장하지 않으며 어떠한 재정적 손실에 대해서도 책임지지 않습니다. 도박에는 위험이 따릅니다. 책임감 있게 즐기세요. 본인 또는 아는 사람이 도박 문제가 있다면 도움을 구하세요. 사용자는 18세 이상이어야 합니다.",
    trustedBy: "신뢰받는", activeBettors: "명 이상의 활성 베터", avgROI: "2025년 평균 ROI",
    whyUpgrade: "OddsFlow Pro로 업그레이드해야 하는 이유", whyUpgradeDesc: "무료 팁 사이트와 달리 OddsFlow는 실시간 AI 분석을 사용합니다.",
    feature1Title: "실시간 AI 분석", feature1Desc: "AI가 실시간 배당률 변동을 모니터링합니다.", feature2Title: "다양한 베팅 스타일", feature2Desc: "여러 전략 중 선택할 수 있습니다.", feature3Title: "검증된 실적", feature3Desc: "투명한 성과 기록.",
    faqTitle: "자주 묻는 질문", faq1Q: "언제든지 구독을 취소할 수 있나요?", faq1A: "네! 언제든지 취소할 수 있습니다.", faq2Q: "Pro 예측의 정확도는?", faq2A: "AI 예측은 평균 12-18% ROI를 유지합니다.", faq3Q: "환불이 가능한가요?", faq3A: "7일 무료 체험을 제공합니다.", faq4Q: "Pro 플랜은 어떤 리그를 포함하나요?", faq4A: "유럽 5대 리그와 UEFA 챔피언스 리그를 포함합니다.", faq5Q: "베팅 스타일은 어떻게 작동하나요?", faq5A: "각 스타일은 다른 AI 모델을 사용합니다.",
  },
  '中文': {
    pricing: "价格",
    pricingSubtitle: "选择适合您需求的计划",
    comingSoon: "即将推出",
    comingSoonDesc: "灵活的定价计划即将上线",
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现", community: "社区", news: "新闻",
    login: "登录", getStarted: "开始使用",
    footer: "18+ | 赌博有风险，请理性参与。",
    allRights: "© 2026 OddsFlow. 保留所有权利。",
    footerDesc: "AI 驱动的足球赔率分析，助您做出更明智的预测。",
    product: "产品",
    company: "公司",
    legal: "法律",
    aboutUs: "关于我们",
    contact: "联系我们",
    blog: "博客",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
    responsibleGaming: "负责任博彩",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩有风险，请理性投注。",
    freeTrial: "免费试用", starter: "入门版", pro: "专业版", ultimate: "旗舰版",
    perWeek: "/周", perMonth: "/月",
    choose1League: "选择", oneLeague: "1个联赛",
    daysAccess: "使用权限", sevenDays: "7天",
    choose1Style: "选择", oneBettingStyle: "1种投注风格",
    aiPredictions: "AI预测和信号",
    fromTop5: "从五大联赛 + UEFA中",
    all5Leagues: "全部5大联赛", unlocked: "已解锁",
    uefaFifa: "UEFA CL + FIFA 2026", included: "包含",
    all5LeaguesUefa: "5大联赛 + UEFA",
    all5Styles: "5种投注风格",
    prioritySupport: "优先支持",
    choose1LeagueLabel: "选择1个联赛:",
    choose1StyleLabel: "选择1种风格:",
    everythingIncluded: "全部包含:",
    sixLeagues: "6个联赛", fiveStyles: "5种风格",
    startFreeTrial: "开始免费试用",
    trialNote: "7天免费 • 无需信用卡",
    popular: "热门",
    bettingStylesTitle: "投注风格说明",
    availableLeaguesTitle: "可用联赛",
    aggressive: "激进型", aggressiveDesc: "高风险，高回报",
    conservative: "保守型", conservativeDesc: "低风险，稳定回报",
    balanced: "平衡型", balancedDesc: "最佳风险回报比",
    valueHunter: "价值猎手", valueHunterDesc: "最佳赔率价值",
    safePlay: "稳妥型", safePlayDesc: "最高置信度选择",
    subscribe: "订阅", currentPlan: "当前套餐", managePlan: "管理套餐", upgrade: "升级",
    popularLeagues: "热门联赛",
    aiPredictionsFooter: "AI 预测",
    aiFootballPredictions: "AI 足球预测",
    onextwoPredictions: "1x2 预测",
    overUnderTips: "大小球建议",
    handicapBetting: "让球盘投注",
    aiBettingPerformance: "AI 投注表现",
    footballTipsToday: "今日足球贴士",
    solution: "解决方案",
    liveOdds: "AI表现",
    communityFooter: "社区",
    globalChat: "全球聊天",
    userPredictions: "用户预测",
    todayMatches: "今日比赛",
    disclaimer: "免责声明：OddsFlow 提供的 AI 预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。如果您或您认识的人有赌博问题，请寻求帮助。用户必须年满 18 岁。",
    trustedBy: "受", activeBettors: "名活跃投注者信赖", avgROI: "2025年平均投资回报率",
    whyUpgrade: "为什么升级到 OddsFlow Pro？", whyUpgradeDesc: "与免费预测网站不同，OddsFlow 使用实时 AI 分析来追踪亚洲盘口变化、1x2 赔率变动和大小球趋势。",
    feature1Title: "实时AI分析", feature1Desc: "我们的AI监控实时赔率变动以识别价值投注。", feature2Title: "多种投注风格", feature2Desc: "可选择保守型、平衡型、激进型、价值猎手或稳妥型策略。", feature3Title: "经验证的记录", feature3Desc: "透明的业绩历史和经验证的结果。",
    faqTitle: "常见问题", faq1Q: "可以随时取消订阅吗？", faq1A: "可以！您可以随时从仪表板取消订阅，没有取消费用。", faq2Q: "Pro计划预测准确度如何？", faq2A: "我们的AI预测在过去一年保持了12-18%的平均投资回报率。", faq3Q: "提供退款吗？", faq3A: "我们提供7天免费试用，让您在付费前测试我们的预测。", faq4Q: "Pro计划覆盖哪些联赛？", faq4A: "Pro计划覆盖欧洲五大联赛（英超、西甲、意甲、德甲、法甲）和欧冠。", faq5Q: "投注风格如何运作？", faq5A: "每种风格使用针对特定风险回报配置优化的不同AI模型。",
  },
  '繁體': {
    pricing: "價格",
    pricingSubtitle: "選擇適合您需求的計劃",
    comingSoon: "即將推出",
    comingSoonDesc: "靈活的定價計劃即將上線",
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現", community: "社區", news: "新聞",
    login: "登入", getStarted: "開始使用",
    footer: "18+ | 賭博有風險，請理性參與。",
    allRights: "© 2026 OddsFlow. 保留所有權利。",
    footerDesc: "AI 驅動的足球賠率分析，助您做出更明智的預測。",
    product: "產品",
    company: "公司",
    legal: "法律",
    aboutUs: "關於我們",
    contact: "聯繫我們",
    blog: "博客",
    termsOfService: "服務條款",
    privacyPolicy: "隱私政策",
    responsibleGaming: "負責任博彩",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩有風險，請理性投注。",
    freeTrial: "免費試用", starter: "入門版", pro: "專業版", ultimate: "旗艦版",
    perWeek: "/週", perMonth: "/月",
    choose1League: "選擇", oneLeague: "1個聯賽",
    daysAccess: "使用權限", sevenDays: "7天",
    choose1Style: "選擇", oneBettingStyle: "1種投注風格",
    aiPredictions: "AI預測和信號",
    fromTop5: "從五大聯賽 + UEFA中",
    all5Leagues: "全部5大聯賽", unlocked: "已解鎖",
    uefaFifa: "UEFA CL + FIFA 2026", included: "包含",
    all5LeaguesUefa: "5大聯賽 + UEFA",
    all5Styles: "5種投注風格",
    prioritySupport: "優先支援",
    choose1LeagueLabel: "選擇1個聯賽:",
    choose1StyleLabel: "選擇1種風格:",
    everythingIncluded: "全部包含:",
    sixLeagues: "6個聯賽", fiveStyles: "5種風格",
    startFreeTrial: "開始免費試用",
    trialNote: "7天免費 • 無需信用卡",
    popular: "熱門",
    bettingStylesTitle: "投注風格說明",
    availableLeaguesTitle: "可用聯賽",
    aggressive: "激進型", aggressiveDesc: "高風險，高回報",
    conservative: "保守型", conservativeDesc: "低風險，穩定回報",
    balanced: "平衡型", balancedDesc: "最佳風險回報比",
    valueHunter: "價值獵手", valueHunterDesc: "最佳賠率價值",
    safePlay: "穩妥型", safePlayDesc: "最高置信度選擇",
    subscribe: "訂閱", currentPlan: "當前套餐", managePlan: "管理套餐", upgrade: "升級",
    popularLeagues: "熱門聯賽",
    aiPredictionsFooter: "AI 預測",
    aiFootballPredictions: "AI 足球預測",
    onextwoPredictions: "1x2 預測",
    overUnderTips: "大小球建議",
    handicapBetting: "讓球盤投注",
    aiBettingPerformance: "AI 投注表現",
    footballTipsToday: "今日足球貼士",
    solution: "解決方案",
    liveOdds: "AI表現",
    communityFooter: "社區",
    globalChat: "全球聊天",
    userPredictions: "用戶預測",
    todayMatches: "今日比賽",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。如果您或您認識的人有賭博問題，請尋求幫助。用戶必須年滿 18 歲。",
    trustedBy: "受", activeBettors: "名活躍投注者信賴", avgROI: "2025年平均投資回報率",
    whyUpgrade: "為什麼升級到 OddsFlow Pro？", whyUpgradeDesc: "與免費預測網站不同，OddsFlow 使用實時 AI 分析來追蹤亞洲盤口變化、1x2 賠率變動和大小球趨勢。",
    feature1Title: "實時AI分析", feature1Desc: "我們的AI監控實時賠率變動以識別價值投注。", feature2Title: "多種投注風格", feature2Desc: "可選擇保守型、平衡型、激進型、價值獵手或穩妥型策略。", feature3Title: "經驗證的記錄", feature3Desc: "透明的業績歷史和經驗證的結果。",
    faqTitle: "常見問題", faq1Q: "可以隨時取消訂閱嗎？", faq1A: "可以！您可以隨時從儀表板取消訂閱，沒有取消費用。", faq2Q: "Pro計劃預測準確度如何？", faq2A: "我們的AI預測在過去一年保持了12-18%的平均投資回報率。", faq3Q: "提供退款嗎？", faq3A: "我們提供7天免費試用，讓您在付費前測試我們的預測。", faq4Q: "Pro計劃覆蓋哪些聯賽？", faq4A: "Pro計劃覆蓋歐洲五大聯賽（英超、西甲、意甲、德甲、法甲）和歐冠。", faq5Q: "投注風格如何運作？", faq5A: "每種風格使用針對特定風險回報配置優化的不同AI模型。",
  },
  ID: {
    pricing: "Harga",
    pricingSubtitle: "Pilih paket yang sesuai untuk Anda",
    comingSoon: "Segera Hadir",
    comingSoonDesc: "Paket harga fleksibel akan segera tersedia",
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI", community: "Komunitas", news: "Berita",
    login: "Masuk", getStarted: "Mulai",
    footer: "18+ | Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    allRights: "© 2026 OddsFlow. Hak cipta dilindungi.",
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi yang lebih cerdas.",
    product: "Produk",
    company: "Perusahaan",
    legal: "Legal",
    aboutUs: "Tentang Kami",
    contact: "Kontak",
    blog: "Blog",
    termsOfService: "Ketentuan Layanan",
    privacyPolicy: "Kebijakan Privasi",
    responsibleGaming: "Perjudian Bertanggung Jawab",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    freeTrial: "Uji Coba Gratis", starter: "Pemula", pro: "Pro", ultimate: "Ultimate",
    perWeek: "/minggu", perMonth: "/bulan",
    choose1League: "Pilih", oneLeague: "1 Liga",
    daysAccess: "akses", sevenDays: "7 hari",
    choose1Style: "Pilih", oneBettingStyle: "1 Gaya Taruhan",
    aiPredictions: "Prediksi AI & Sinyal",
    fromTop5: "dari Top 5 + UEFA",
    all5Leagues: "Semua 5 Liga Utama", unlocked: "terbuka",
    uefaFifa: "UEFA CL + FIFA 2026", included: "termasuk",
    all5LeaguesUefa: "5 Liga + UEFA",
    all5Styles: "5 Gaya Taruhan",
    prioritySupport: "Dukungan prioritas",
    choose1LeagueLabel: "Pilih 1 liga:",
    choose1StyleLabel: "Pilih 1 gaya:",
    everythingIncluded: "Semua termasuk:",
    sixLeagues: "6 Liga", fiveStyles: "5 Gaya",
    startFreeTrial: "Mulai Uji Coba Gratis",
    trialNote: "7 hari gratis • Tanpa kartu kredit",
    popular: "POPULER",
    bettingStylesTitle: "Penjelasan Gaya Taruhan",
    availableLeaguesTitle: "Liga Tersedia",
    aggressive: "Agresif", aggressiveDesc: "Risiko tinggi, hasil tinggi",
    conservative: "Konservatif", conservativeDesc: "Risiko rendah, hasil stabil",
    balanced: "Seimbang", balancedDesc: "Rasio risiko-hasil optimal",
    valueHunter: "Pemburu Nilai", valueHunterDesc: "Pilihan odds terbaik",
    safePlay: "Aman", safePlayDesc: "Pilihan kepercayaan tertinggi",
    subscribe: "Berlangganan", currentPlan: "Paket Saat Ini", managePlan: "Kelola Paket", upgrade: "Tingkatkan",
    popularLeagues: "Liga Populer",
    aiPredictionsFooter: "Prediksi AI",
    aiFootballPredictions: "Prediksi Sepak Bola AI",
    onextwoPredictions: "Prediksi 1x2",
    overUnderTips: "Tips Over/Under",
    handicapBetting: "Taruhan Handicap",
    aiBettingPerformance: "Performa Taruhan AI",
    footballTipsToday: "Tips Sepak Bola Hari Ini",
    solution: "Solusi",
    liveOdds: "Performa AI",
    communityFooter: "Komunitas",
    globalChat: "Obrolan Global",
    userPredictions: "Prediksi Pengguna",
    todayMatches: "Pertandingan Hari Ini",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi berbasis AI hanya untuk tujuan informasi dan hiburan. Kami tidak menjamin keakuratan prediksi dan tidak bertanggung jawab atas kerugian finansial apa pun. Perjudian melibatkan risiko. Harap bertaruh dengan bijak. Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, silakan cari bantuan. Pengguna harus berusia 18+ tahun.",
    trustedBy: "Dipercaya oleh", activeBettors: "petaruh aktif", avgROI: "ROI rata-rata 2025",
    whyUpgrade: "Mengapa Upgrade ke OddsFlow Pro?", whyUpgradeDesc: "Berbeda dengan situs tips gratis, OddsFlow menggunakan analisis AI real-time untuk melacak pergerakan Asian Handicap.",
    feature1Title: "Analisis AI Real-Time", feature1Desc: "AI kami memantau pergerakan odds langsung.", feature2Title: "Berbagai Gaya Taruhan", feature2Desc: "Pilih dari berbagai strategi.", feature3Title: "Rekam Jejak Terbukti", feature3Desc: "Riwayat kinerja transparan.",
    faqTitle: "Pertanyaan yang Sering Diajukan", faq1Q: "Bisakah saya membatalkan langganan kapan saja?", faq1A: "Ya! Anda dapat membatalkan langganan kapan saja.", faq2Q: "Seberapa akurat prediksi Pro?", faq2A: "Prediksi AI kami mempertahankan ROI rata-rata 12-18%.", faq3Q: "Apakah ada pengembalian dana?", faq3A: "Kami menawarkan uji coba gratis 7 hari.", faq4Q: "Liga apa saja yang dicakup paket Pro?", faq4A: "Paket Pro mencakup 5 liga utama Eropa dan UEFA Champions League.", faq5Q: "Bagaimana cara kerja gaya taruhan?", faq5A: "Setiap gaya menggunakan model AI berbeda.",
  },
};

export default function PricingPage() {
  const params = useParams();
  const urlLocale = (params?.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  // Helper function to get locale URL for language dropdown
  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/pricing';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check auth session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });
    return () => authSub.unsubscribe();
  }, []);

  // Load user subscription
  useEffect(() => {
    const loadSubscription = async () => {
      if (user) {
        const { data } = await getUserSubscription(user.id);
        setSubscription(data);
      } else {
        setSubscription(null);
      }
    };
    loadSubscription();
  }, [user]);

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  // Helper to get button text and style based on subscription status
  const getButtonConfig = (planType: string) => {
    if (!user) {
      // Not logged in - show Get Started
      return { text: t('getStarted'), href: localePath('/get-started'), style: 'default', disabled: false };
    }

    if (!subscription) {
      // Logged in but no subscription - show Subscribe
      return { text: t('subscribe'), href: localePath(`/checkout?plan=${planType}`), style: 'default', disabled: false };
    }

    const currentPlan = subscription.package_type;
    const planOrder = ['free_trial', 'starter', 'pro', 'ultimate'];
    const currentIndex = planOrder.indexOf(currentPlan);
    const targetIndex = planOrder.indexOf(planType);

    if (currentPlan === planType) {
      // This is the user's current plan
      return { text: t('currentPlan'), href: localePath('/dashboard'), style: 'current', disabled: true };
    } else if (targetIndex > currentIndex) {
      // This is an upgrade
      return { text: t('upgrade'), href: localePath(`/checkout?plan=${planType}`), style: 'upgrade', disabled: false };
    } else {
      // This is a downgrade or different plan
      return { text: t('subscribe'), href: localePath(`/checkout?plan=${planType}`), style: 'default', disabled: false };
    }
  };

  return (
    <div className="min-h-screen text-white relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/pricing/wp2603379.jpg')" }}
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/80" />
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
              <Link href={localePath('/pricing')} className="text-emerald-400 text-sm font-medium">{t('pricing')}</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative">
                <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm cursor-pointer">
                  <FlagIcon code={locale} size={20} />
                  <span className="font-medium">{selectedLang}</span>
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {langDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                      {locales.map((loc) => (
                        <Link key={loc} href={getLocaleUrl(loc)} className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer ${locale === loc ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300'}`}>
                          <FlagIcon code={loc} size={20} />
                          <span className="font-medium">{localeNames[loc]}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {user ? (
                <Link href={localePath('/dashboard')} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
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
                  <Link href={localePath('/get-started')} className="hidden sm:block px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">{t('getStarted')}</Link>
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
                { href: localePath('/pricing'), label: t('pricing'), active: true },
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

              {/* Mobile Login/Signup */}
              {!user && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <Link
                    href={localePath('/login')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg border border-white/20 text-white text-center font-medium hover:bg-white/10 transition-all"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href={localePath('/get-started')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-center font-semibold hover:shadow-lg transition-all"
                  >
                    {t('getStarted')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t('pricing')}
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('pricingSubtitle')}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-4 gap-5 max-w-6xl mx-auto pt-4">
            {/* Package - Free Trial */}
            <div className="group relative bg-black rounded-2xl border border-white/10 p-5 hover:border-gray-500/50 transition-all overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-gray-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              {/* White shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              <div className="relative mb-5">
                <h3 className="text-lg font-bold text-white mb-2">{t('freeTrial')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-gray-400 text-sm">{t('perWeek')}</span>
                </div>
              </div>

              <div className="relative space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1League')} <span className="text-gray-300 font-semibold">{t('oneLeague')}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-yellow-400 font-semibold">{t('sevenDays')}</span> {t('daysAccess')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1Style')} <span className="text-gray-300 font-semibold">{t('oneBettingStyle')}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('aiPredictions')}</span>
                </div>
              </div>

              {/* Trial Note */}
              <div className="relative mb-5">
                <p className="text-xs text-yellow-500/80 mb-2">{t('trialNote')}</p>
              </div>

              {(() => {
                const config = getButtonConfig('free_trial');
                return config.disabled ? (
                  <div className="relative w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold text-sm text-center border border-emerald-500/30">
                    {config.text}
                  </div>
                ) : (
                  <Link href={config.href} className="relative block w-full py-2.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all cursor-pointer text-sm text-center">
                    {user ? config.text : t('startFreeTrial')}
                  </Link>
                );
              })()}
            </div>

            {/* Package A - Starter */}
            <div className="group relative bg-black rounded-2xl border border-white/10 p-6 hover:border-cyan-500/50 transition-all overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              {/* White shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              <div className="relative mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{t('starter')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$3</span>
                  <span className="text-gray-400">{t('perMonth')}</span>
                </div>
              </div>

              <div className="relative space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1League')} <span className="text-emerald-400 font-semibold">{t('oneLeague')}</span> {t('fromTop5')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1Style')} <span className="text-cyan-400 font-semibold">{t('oneBettingStyle')}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('aiPredictions')}</span>
                </div>
              </div>

              {/* Available Leagues */}
              <div className="relative mb-6">
                <p className="text-xs text-gray-500 mb-2">{t('choose1LeagueLabel')}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">EPL</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">Bundesliga</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">Serie A</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">La Liga</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">Ligue 1</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">UEFA</span>
                </div>
              </div>

              {(() => {
                const config = getButtonConfig('starter');
                return config.disabled ? (
                  <div className="relative w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold text-center border border-emerald-500/30">
                    {config.text}
                  </div>
                ) : (
                  <Link href={config.href} className={`relative block w-full py-3 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                    config.style === 'upgrade'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-lg hover:shadow-cyan-500/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}>
                    {config.text}
                  </Link>
                );
              })()}
            </div>

            {/* Package B - Pro (Popular) */}
            <div className="group relative scale-105 mt-4">
              {/* Popular Badge - outside overflow container */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-black text-xs font-bold shadow-lg shadow-blue-500/30 whitespace-nowrap">{t('popular')}</span>
              </div>
              {/* Card container */}
              <div className="relative bg-black rounded-2xl border-2 border-blue-500/50 p-6 pt-6 shadow-xl shadow-blue-500/20 overflow-hidden">
                {/* Animated glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                {/* White shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 z-10" />

              <div className="relative mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{t('pro')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-blue-400">$5</span>
                  <span className="text-gray-400">{t('perMonth')}</span>
                </div>
              </div>

              <div className="relative space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-blue-400 font-semibold">{t('all5Leagues')}</span> {t('unlocked')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('choose1Style')} <span className="text-cyan-400 font-semibold">{t('oneBettingStyle')}</span></span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('aiPredictions')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-yellow-400 font-semibold">{t('uefaFifa')}</span> {t('included')}</span>
                </div>
              </div>

              {/* Betting Styles */}
              <div className="relative mb-6">
                <p className="text-xs text-gray-500 mb-2">{t('choose1StyleLabel')}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">🔥 {t('aggressive')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">🥦 {t('conservative')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">⚖️ {t('balanced')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">💎 {t('valueHunter')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">🏛️ {t('safePlay')}</span>
                </div>
              </div>

              {(() => {
                const config = getButtonConfig('pro');
                return config.disabled ? (
                  <div className="relative w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-center border border-emerald-500/30">
                    {config.text}
                  </div>
                ) : (
                  <Link href={config.href} className={`relative block w-full py-3 rounded-xl font-bold transition-all cursor-pointer text-center ${
                    config.style === 'upgrade'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-blue-500/25'
                  }`}>
                    {config.text}
                  </Link>
                );
              })()}
              </div>
            </div>

            {/* Package C - Ultimate */}
            <div className="group relative bg-black rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              {/* White shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              <div className="relative mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{t('ultimate')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$10</span>
                  <span className="text-gray-400">{t('perMonth')}</span>
                </div>
              </div>

              <div className="relative space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-emerald-400 font-semibold">{t('all5LeaguesUefa')}</span> {t('unlocked')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm"><span className="text-purple-400 font-semibold">{t('all5Styles')}</span> {t('unlocked')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('aiPredictions')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('prioritySupport')}</span>
                </div>
              </div>

              {/* All Included */}
              <div className="relative mb-6">
                <p className="text-xs text-gray-500 mb-2">{t('everythingIncluded')}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-center">{t('sixLeagues')}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-center">{t('fiveStyles')}</span>
                </div>
              </div>

              {(() => {
                const config = getButtonConfig('ultimate');
                return config.disabled ? (
                  <div className="relative w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold text-center border border-emerald-500/30">
                    {config.text}
                  </div>
                ) : (
                  <Link href={config.href} className={`relative block w-full py-3 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                    config.style === 'upgrade'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}>
                    {config.text}
                  </Link>
                );
              })()}
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 rounded-2xl border border-emerald-500/20 p-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400 mb-1">40,000+</div>
                  <div className="text-gray-400 text-sm">{t('trustedBy')} {t('activeBettors')}</div>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-1">15%+</div>
                  <div className="text-gray-400 text-sm">{t('avgROI')}</div>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/10"></div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-gray-400 text-sm">4.8/5 Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Upgrade Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">{t('whyUpgrade')}</h2>
            <p className="text-gray-400 text-center mb-10 leading-relaxed">{t('whyUpgradeDesc')}</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20 p-6">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('feature1Title')}</h3>
                <p className="text-gray-400 text-sm">{t('feature1Desc')}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('feature2Title')}</h3>
                <p className="text-gray-400 text-sm">{t('feature2Desc')}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 p-6">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('feature3Title')}</h3>
                <p className="text-gray-400 text-sm">{t('feature3Desc')}</p>
              </div>
            </div>
          </div>

          {/* Betting Styles Explanation */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">{t('bettingStylesTitle')}</h2>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="bg-black rounded-xl border border-orange-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">🔥</span>
                <h4 className="font-semibold text-orange-400 mb-1">{t('aggressive')}</h4>
                <p className="text-xs text-gray-400">{t('aggressiveDesc')}</p>
              </div>
              <div className="bg-black rounded-xl border border-green-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">🥦</span>
                <h4 className="font-semibold text-green-400 mb-1">{t('conservative')}</h4>
                <p className="text-xs text-gray-400">{t('conservativeDesc')}</p>
              </div>
              <div className="bg-black rounded-xl border border-blue-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">⚖️</span>
                <h4 className="font-semibold text-blue-400 mb-1">{t('balanced')}</h4>
                <p className="text-xs text-gray-400">{t('balancedDesc')}</p>
              </div>
              <div className="bg-black rounded-xl border border-emerald-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">💎</span>
                <h4 className="font-semibold text-emerald-400 mb-1">{t('valueHunter')}</h4>
                <p className="text-xs text-gray-400">{t('valueHunterDesc')}</p>
              </div>
              <div className="bg-black rounded-xl border border-yellow-500/20 p-4 text-center">
                <span className="text-2xl mb-2 block">🏛️</span>
                <h4 className="font-semibold text-yellow-400 mb-1">{t('safePlay')}</h4>
                <p className="text-xs text-gray-400">{t('safePlayDesc')}</p>
              </div>
            </div>
          </div>

          {/* Leagues Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">{t('availableLeaguesTitle')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="group relative bg-black rounded-xl border border-purple-500/20 p-4 text-center hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-purple-500/20">
                  <img src="https://media.api-sports.io/football/leagues/39.png" alt="Premier League" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-purple-300 font-medium">Premier League</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-red-500/20 p-4 text-center hover:border-red-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-red-500/20">
                  <img src="https://media.api-sports.io/football/leagues/78.png" alt="Bundesliga" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-red-300 font-medium">Bundesliga</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-blue-500/20 p-4 text-center hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-blue-500/20">
                  <img src="https://media.api-sports.io/football/leagues/135.png" alt="Serie A" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-blue-300 font-medium">Serie A</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-orange-500/20 p-4 text-center hover:border-orange-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-orange-500/20">
                  <img src="https://media.api-sports.io/football/leagues/140.png" alt="La Liga" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-orange-300 font-medium">La Liga</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-green-500/20 p-4 text-center hover:border-green-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-green-500/20">
                  <img src="https://media.api-sports.io/football/leagues/61.png" alt="Ligue 1" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-green-300 font-medium">Ligue 1</p>
              </div>
              <div className="group relative bg-black rounded-xl border border-cyan-500/20 p-4 text-center hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-12 h-12 mx-auto mb-2 bg-white rounded-lg p-1.5 shadow-lg shadow-cyan-500/20">
                  <img src="https://media.api-sports.io/football/leagues/2.png" alt="UEFA Champions League" className="w-full h-full object-contain" />
                </div>
                <p className="relative text-sm text-cyan-300 font-medium">UEFA CL</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">{t('faqTitle')}</h2>
            <div className="space-y-4">
              <details className="group bg-black rounded-xl border border-white/10 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="font-medium text-white">{t('faq1Q')}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-400">{t('faq1A')}</div>
              </details>
              <details className="group bg-black rounded-xl border border-white/10 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="font-medium text-white">{t('faq2Q')}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-400">{t('faq2A')}</div>
              </details>
              <details className="group bg-black rounded-xl border border-white/10 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="font-medium text-white">{t('faq3Q')}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-400">{t('faq3A')}</div>
              </details>
              <details className="group bg-black rounded-xl border border-white/10 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="font-medium text-white">{t('faq4Q')}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-400">{t('faq4A')}</div>
              </details>
              <details className="group bg-black rounded-xl border border-white/10 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="font-medium text-white">{t('faq5Q')}</span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-400">{t('faq5A')}</div>
              </details>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": t('faq1Q'), "acceptedAnswer": { "@type": "Answer", "text": t('faq1A') } },
              { "@type": "Question", "name": t('faq2Q'), "acceptedAnswer": { "@type": "Answer", "text": t('faq2A') } },
              { "@type": "Question", "name": t('faq3Q'), "acceptedAnswer": { "@type": "Answer", "text": t('faq3A') } },
              { "@type": "Question", "name": t('faq4Q'), "acceptedAnswer": { "@type": "Answer", "text": t('faq4A') } },
              { "@type": "Question", "name": t('faq5Q'), "acceptedAnswer": { "@type": "Answer", "text": t('faq5A') } },
            ]
          })
        }}
      />

      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "OddsFlow Pro Plan",
            "description": "AI-powered football predictions for Premier League, La Liga, Serie A, Bundesliga, Ligue 1 and Champions League.",
            "brand": { "@type": "Brand", "name": "OddsFlow" },
            "offers": {
              "@type": "Offer",
              "price": "5.00",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "2847"
            }
          })
        }}
      />

<Footer localePath={localePath} t={t} />
    </div>
  );
}
