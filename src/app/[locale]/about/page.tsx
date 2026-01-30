'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import FlagIcon, { LANGUAGES } from "@/components/FlagIcon";
import { locales, localeToTranslationCode, type Locale } from '@/i18n/config';
import Footer from '@/components/Footer';

const translations: Record<string, Record<string, string>> = {
  EN: {
    home: "Home", predictions: "Predictions", leagues: "Leagues", performance: "AI Performance",
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started", solution: "Solution",
    aboutTitle: "About OddsFlow: The AI Engine Decoding Football Market Intent",
    aboutSubtitle: "Most people watch the game. A few watch the market.",
    aboutIntro: "OddsFlow exists for the latter. We noticed a massive gap between \"public stats\" (possession, shots on target) and \"market reality\" (money flow, line movements, and smart money). We built this platform to bridge that gap. We don't deal in hype, intuition, or \"guaranteed wins.\" We deal in data, logic, and market transparency.",
    ourStory: "Our Story",
    storyText: "OddsFlow didn't start as a business; it started as a necessity. We were a group of football enthusiasts and traders who were frustrated by the lack of professional-grade tools for the everyday user. The \"pros\" had advanced algorithms and real-time data feeds; we had spreadsheets and gut feelings. That didn't seem fair. So, we built our own engine to track how Asian Handicaps move, how lines shift, and where the market expectations are actually heading. What began as a private tool for our own analysis has evolved into OddsFlow.",
    whatWeDo: "What We Actually Do",
    whatWeDoIntro: "We strip away the noise to find the Signal. Instead of overwhelming you with useless trivia, we focus on the metrics that actually move the needle:",
    feature1Title: "Decoding Market Intent",
    feature1Text: "Understanding why odds are dropping, not just that they are dropping.",
    feature2Title: "Contextual Analysis",
    feature2Text: "Is the market reacting to team news, or is it a \"trap\"?",
    feature3Title: "Pattern Recognition",
    feature3Text: "How have similar handicaps performed historically under these specific conditions?",
    philosophy: "Our Philosophy: Tools, Not Crystal Balls",
    philosophyText: "We respect the game too much to promise you a fortune. OddsFlow is a weapon for your arsenal, not a replacement for your brain. We provide the structured data, the visualizations, and the \"why\"—so you can make decisions based on facts, not feelings. Technology supports our work, but human judgment drives the decision.",
    whoWeAreFor: "Who We Are For",
    audience1Title: "The Analyst",
    audience1Text: "You care about the details behind the result.",
    audience2Title: "The Data-Driven",
    audience2Text: "You trust numbers more than narratives.",
    audience3Title: "The Curious",
    audience3Text: "You want to understand football as a market system, not just a sport.",
    realityNote: "A Note on Reality",
    realityText: "OddsFlow is a data analytics platform. We are not a bookmaker, and we are not a \"tipping service.\" We give you the map; you have to drive the car. Please use our data responsibly, do your own research, and remember that in football, nothing is ever 100% certain.",
    meetTheTeam: "Meet The Team",
    teamIntro: "The minds behind OddsFlow's data-driven approach",
    davidTitle: "Head of Data Science",
    davidBio: "With a specialized background in AI and Machine Learning, David applies Wall Street algorithms to the sports betting market. Previously an analyst in Forex and Equity markets, he built the core OddsFlow engine to strip away human emotion and focus strictly on statistical significance.",
    danielTitle: "Co-Founder & Senior Actuary",
    danielBio: "Daniel brings the precision of an Actuary and the structural thinking of an Engineer to sports analytics. A seasoned entrepreneur, he focuses on long-term risk assessment and probability modeling, treating sports betting as a disciplined investment class rather than a gamble.",
    footer: "© 2026 OddsFlow. All rights reserved.",
    footerDesc: "AI-powered football odds analysis for smarter predictions. Make data-driven decisions with real-time insights.",
    product: "Product", liveOdds: "AI Performance", popularLeagues: "Popular Leagues",
    communityFooter: "Community", globalChat: "Global Chat", userPredictions: "User Predictions", todayMatches: "Today Matches",
    company: "Company", aboutUs: "About Us", contact: "Contact", blog: "Blog",
    legal: "Legal", termsOfService: "Terms of Service", privacyPolicy: "Privacy Policy", responsibleGaming: "Responsible Gaming",
    allRightsReserved: "All rights reserved.", gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
  },
  ES: {
    home: "Inicio", predictions: "Pronósticos", leagues: "Ligas", performance: "Análisis",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesión", getStarted: "Comenzar", solution: "Solución",
    aboutTitle: "Sobre OddsFlow: El Motor de IA que Decodifica el Mercado de Apuestas Deportivas",
    aboutSubtitle: "La mayoría ve el partido. Unos pocos observan el mercado de apuestas.",
    aboutIntro: "OddsFlow existe para estos últimos. Notamos una brecha enorme entre las \"estadísticas públicas\" (posesión, tiros a puerta) y la \"realidad del mercado de apuestas deportivas\" (flujo de dinero, movimientos de líneas y dinero inteligente). Construimos esta plataforma de pronósticos de fútbol para cerrar esa brecha. No tratamos con exageraciones, intuición o \"ganancias garantizadas\". Tratamos con datos, lógica y transparencia del mercado.",
    ourStory: "Nuestra Historia",
    storyText: "OddsFlow no comenzó como un negocio; comenzó como una necesidad. Éramos un grupo de entusiastas del fútbol y traders frustrados por la falta de herramientas profesionales para el usuario común. Los \"profesionales\" tenían algoritmos avanzados y feeds de datos en tiempo real; nosotros teníamos hojas de cálculo e intuición. Eso no parecía justo. Así que construimos nuestro propio motor para rastrear cómo se mueven los Handicaps Asiáticos, cómo cambian las líneas y hacia dónde se dirigen realmente las expectativas del mercado.",
    whatWeDo: "Lo Que Realmente Hacemos",
    whatWeDoIntro: "Eliminamos el ruido para encontrar la Señal. En lugar de abrumarte con trivialidades inútiles, nos enfocamos en las métricas que realmente importan:",
    feature1Title: "Decodificando la Intención del Mercado",
    feature1Text: "Entender por qué las cuotas están bajando, no solo que están bajando.",
    feature2Title: "Análisis Contextual",
    feature2Text: "¿El mercado está reaccionando a noticias del equipo, o es una \"trampa\"?",
    feature3Title: "Reconocimiento de Patrones",
    feature3Text: "¿Cómo se han comportado handicaps similares históricamente bajo estas condiciones específicas?",
    philosophy: "Nuestra Filosofía: Herramientas, No Bolas de Cristal",
    philosophyText: "Respetamos el juego demasiado como para prometerte una fortuna. OddsFlow es un arma para tu arsenal, no un reemplazo para tu cerebro. Proporcionamos los datos estructurados, las visualizaciones y el \"por qué\", para que puedas tomar decisiones basadas en hechos, no en sentimientos. La tecnología apoya nuestro trabajo, pero el juicio humano impulsa la decisión.",
    whoWeAreFor: "Para Quién Somos",
    audience1Title: "El Analista",
    audience1Text: "Te importan los detalles detrás del resultado.",
    audience2Title: "El Orientado a Datos",
    audience2Text: "Confías más en los números que en las narrativas.",
    audience3Title: "El Curioso",
    audience3Text: "Quieres entender el fútbol como un sistema de mercado, no solo como un deporte.",
    realityNote: "Una Nota sobre la Realidad",
    realityText: "OddsFlow es una plataforma de análisis de datos. No somos una casa de apuestas y no somos un \"servicio de tips\". Te damos el mapa; tú tienes que conducir el coche. Por favor usa nuestros datos responsablemente, haz tu propia investigación y recuerda que en el fútbol, nada es 100% seguro.",
    meetTheTeam: "Conoce al Equipo",
    teamIntro: "Las mentes detrás del enfoque basado en datos de OddsFlow",
    davidTitle: "Jefe de Ciencia de Datos",
    davidBio: "Con experiencia especializada en IA y Machine Learning, David aplica algoritmos de Wall Street al mercado de apuestas deportivas. Anteriormente analista en mercados de Forex y Renta Variable, construyó el motor central de OddsFlow para eliminar la emoción humana y enfocarse estrictamente en la significancia estadística.",
    danielTitle: "Cofundador y Actuario Senior",
    danielBio: "Daniel aporta la precisión de un Actuario y el pensamiento estructural de un Ingeniero al análisis deportivo. Un emprendedor experimentado, se enfoca en la evaluación de riesgos a largo plazo y modelado de probabilidades, tratando las apuestas deportivas como una clase de inversión disciplinada en lugar de un juego de azar.",
    footer: "© 2026 OddsFlow. Todos los derechos reservados.",
    footerDesc: "Análisis de cuotas de fútbol impulsado por IA para predicciones más inteligentes. Tome decisiones basadas en datos con información en tiempo real.",
    product: "Producto", liveOdds: "Rendimiento IA", popularLeagues: "Ligas Populares",
    communityFooter: "Comunidad", globalChat: "Chat Global", userPredictions: "Predicciones de Usuarios", todayMatches: "Partidos de Hoy",
    company: "Empresa", aboutUs: "Sobre Nosotros", contact: "Contacto", blog: "Blog",
    legal: "Legal", termsOfService: "Términos de Servicio", privacyPolicy: "Política de Privacidad", responsibleGaming: "Juego Responsable",
    allRightsReserved: "Todos los derechos reservados.", gamblingWarning: "El juego implica riesgo. Por favor juegue responsablemente.",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precisión de las predicciones y no somos responsables de ninguna pérdida financiera.",
  },
  PT: {
    home: "Início", predictions: "Palpites", leagues: "Ligas", performance: "Análise",
    community: "Comunidade", news: "Notícias", pricing: "Preços", login: "Entrar", getStarted: "Começar", solution: "Solução",
    aboutTitle: "Sobre OddsFlow: A Inteligência Artificial para Palpites de Futebol e Apostas Esportivas",
    aboutSubtitle: "A maioria assiste ao jogo. Poucos observam o mercado de apostas.",
    aboutIntro: "OddsFlow existe para os últimos. Notamos uma lacuna enorme entre \"estatísticas públicas\" (posse de bola, chutes ao gol) e \"realidade do mercado de apostas esportivas\" (fluxo de dinheiro, movimentos de odds e dinheiro inteligente). Construímos esta plataforma de palpites de futebol para preencher essa lacuna. Não lidamos com exageros, intuição ou \"vitórias garantidas\". Lidamos com dados, lógica e transparência de mercado.",
    ourStory: "Nossa História",
    storyText: "OddsFlow não começou como um negócio; começou como uma necessidade. Éramos um grupo de entusiastas de futebol e traders frustrados pela falta de ferramentas profissionais para o apostador comum. Os \"profissionais\" tinham algoritmos avançados e feeds de dados em tempo real; nós tínhamos planilhas e intuição. Isso não parecia justo. Então, construímos nosso próprio motor para rastrear como os Handicaps Asiáticos se movem, como as cotações mudam, e para onde as expectativas do mercado estão indo — seja na Premier League, La Liga, ou qualquer liga europeia.",
    whatWeDo: "O Que Realmente Fazemos",
    whatWeDoIntro: "Eliminamos o ruído para encontrar o Sinal. Em vez de sobrecarregá-lo com trivialidades inúteis, focamos nas métricas que realmente importam para suas apostas esportivas:",
    feature1Title: "Decodificando a Intenção do Mercado",
    feature1Text: "Entender por que as odds estão caindo, não apenas que estão caindo.",
    feature2Title: "Análise Contextual",
    feature2Text: "O mercado está reagindo a notícias da equipe, ou é uma \"armadilha\"?",
    feature3Title: "Reconhecimento de Padrões",
    feature3Text: "Como handicaps similares se comportaram historicamente sob essas condições específicas?",
    philosophy: "Nossa Filosofia: Ferramentas, Não Bolas de Cristal",
    philosophyText: "Respeitamos o jogo demais para prometer uma fortuna. OddsFlow é uma arma para seu arsenal de apostas esportivas, não um substituto para seu cérebro. Fornecemos os dados estruturados, as visualizações e o \"porquê\" — para que você possa tomar decisões de palpites baseadas em fatos, não em sentimentos. A tecnologia apoia nosso trabalho, mas o julgamento humano impulsiona a decisão.",
    whoWeAreFor: "Para Quem Somos",
    audience1Title: "O Analista",
    audience1Text: "Você se importa com os detalhes por trás do resultado.",
    audience2Title: "O Orientado a Dados",
    audience2Text: "Você confia mais em números do que em narrativas.",
    audience3Title: "O Curioso",
    audience3Text: "Você quer entender o futebol como um sistema de mercado, não apenas como um esporte.",
    realityNote: "Uma Nota sobre a Realidade",
    realityText: "OddsFlow é uma plataforma de análise de dados para apostas esportivas. Não somos uma casa de apostas e não somos um \"serviço de palpites garantidos\". Damos o mapa; você tem que dirigir o carro. Por favor, use nossos dados com responsabilidade, faça sua própria pesquisa, e lembre-se que no futebol, nada é 100% certo.",
    meetTheTeam: "Conheça a Equipe", teamIntro: "As mentes por trás da abordagem baseada em dados da OddsFlow",
    davidTitle: "Chefe de Ciência de Dados", davidBio: "Com experiência especializada em IA e Machine Learning, David aplica algoritmos de Wall Street ao mercado de apostas esportivas. Anteriormente analista em mercados de Forex e Ações, ele construiu o motor central do OddsFlow para eliminar a emoção humana e focar estritamente na significância estatística.",
    danielTitle: "Cofundador e Atuário Sênior", danielBio: "Daniel traz a precisão de um Atuário e o pensamento estrutural de um Engenheiro para análises esportivas. Um empreendedor experiente, ele foca na avaliação de riscos de longo prazo e modelagem de probabilidades, tratando apostas esportivas como uma classe de investimento disciplinada em vez de um jogo de azar.",
    footer: "© 2026 OddsFlow. Todos os direitos reservados.",
    footerDesc: "Análise de odds de futebol com IA para palpites mais inteligentes. Tome decisões de apostas esportivas baseadas em dados com insights em tempo real.",
    product: "Produto", liveOdds: "Desempenho IA", popularLeagues: "Ligas Populares",
    communityFooter: "Comunidade", globalChat: "Chat Global", userPredictions: "Palpites de Usuários", todayMatches: "Jogos de Hoje",
    company: "Empresa", aboutUs: "Sobre Nós", contact: "Contato", blog: "Blog",
    legal: "Legal", termsOfService: "Termos de Serviço", privacyPolicy: "Política de Privacidade", responsibleGaming: "Jogo Responsável",
    allRightsReserved: "Todos os direitos reservados.", gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    disclaimer: "Aviso: OddsFlow fornece palpites de futebol baseados em IA apenas para fins informativos e de entretenimento. Não garantimos a precisão dos palpites e não somos responsáveis por perdas financeiras. Apostas envolvem risco. Por favor aposte com responsabilidade.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "Analyse",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen", solution: "Lösung",
    aboutTitle: "Über OddsFlow: KI-Fußball Vorhersagen & Wett-Tipps für Sportwetten",
    aboutSubtitle: "Die meisten schauen das Spiel. Wenige beobachten den Sportwetten-Markt.",
    aboutIntro: "OddsFlow existiert für Letztere. Wir haben eine massive Lücke zwischen \"öffentlichen Statistiken\" (Ballbesitz, Schüsse aufs Tor) und \"Marktrealität\" (Geldfluss, Quotenbewegungen und kluges Geld) bemerkt. Wir haben diese Plattform für Fußball Vorhersagen gebaut, um diese Lücke zu schließen. Wir handeln nicht mit Hype, Intuition oder \"garantierten Gewinnen\". Wir handeln mit Daten, Logik und Markttransparenz.",
    ourStory: "Unsere Geschichte",
    storyText: "OddsFlow begann nicht als Geschäft; es begann als Notwendigkeit. Wir waren eine Gruppe von Fußballbegeisterten und Händlern, die von dem Mangel an professionellen Tools für den alltäglichen Wetter frustriert waren. Die \"Profis\" hatten fortgeschrittene Algorithmen und Echtzeit-Datenfeeds; wir hatten Tabellenkalkulationen und Bauchgefühl. Das schien nicht fair. Also bauten wir unsere eigene Engine, um Asiatische Handicaps zu verfolgen, Quotenbewegungen zu analysieren, und zu verstehen, wohin die Markterwartungen gehen — ob Bundesliga, Premier League oder Champions League.",
    whatWeDo: "Was Wir Wirklich Tun",
    whatWeDoIntro: "Wir entfernen das Rauschen, um das Signal zu finden. Anstatt Sie mit nutzlosen Trivialitäten zu überwältigen, konzentrieren wir uns auf die Metriken, die für Ihre Sportwetten wirklich zählen:",
    feature1Title: "Marktabsicht Entschlüsseln",
    feature1Text: "Verstehen, warum Quoten fallen, nicht nur, dass sie fallen.",
    feature2Title: "Kontextanalyse",
    feature2Text: "Reagiert der Markt auf Teamnachrichten, oder ist es eine \"Falle\"?",
    feature3Title: "Mustererkennung",
    feature3Text: "Wie haben sich ähnliche Handicaps historisch unter diesen spezifischen Bedingungen verhalten?",
    philosophy: "Unsere Philosophie: Werkzeuge, Keine Kristallkugeln",
    philosophyText: "Wir respektieren das Spiel zu sehr, um Ihnen ein Vermögen zu versprechen. OddsFlow ist eine Waffe für Ihr Sportwetten-Arsenal, kein Ersatz für Ihr Gehirn. Wir liefern die strukturierten Daten, die Visualisierungen und das \"Warum\" — damit Sie Wett-Entscheidungen auf Fakten basieren können, nicht auf Gefühlen. Technologie unterstützt unsere Arbeit, aber menschliches Urteilsvermögen treibt die Entscheidung.",
    whoWeAreFor: "Für Wen Wir Da Sind",
    audience1Title: "Der Analyst",
    audience1Text: "Sie interessieren sich für die Details hinter dem Ergebnis.",
    audience2Title: "Der Datengetriebene",
    audience2Text: "Sie vertrauen Zahlen mehr als Narrativen.",
    audience3Title: "Der Neugierige",
    audience3Text: "Sie wollen Fußball als Marktsystem verstehen, nicht nur als Sport.",
    realityNote: "Ein Hinweis zur Realität",
    realityText: "OddsFlow ist eine Datenanalyseplattform für Sportwetten. Wir sind kein Buchmacher und kein \"Tipp-Service mit Garantie\". Wir geben Ihnen die Karte; Sie müssen das Auto fahren. Bitte nutzen Sie unsere Daten verantwortungsvoll, machen Sie Ihre eigene Recherche, und denken Sie daran, dass im Fußball nichts 100% sicher ist.",
    meetTheTeam: "Das Team", teamIntro: "Die Köpfe hinter dem datengesteuerten Ansatz von OddsFlow",
    davidTitle: "Leiter Data Science", davidBio: "Mit spezialisiertem Hintergrund in KI und Machine Learning wendet David Wall-Street-Algorithmen auf den Sportwettenmarkt an. Als ehemaliger Analyst in Forex- und Aktienmärkten entwickelte er die Kern-Engine von OddsFlow, um menschliche Emotionen auszuschalten und sich strikt auf statistische Signifikanz zu konzentrieren.",
    danielTitle: "Mitgründer & Senior Aktuar", danielBio: "Daniel bringt die Präzision eines Aktuars und das strukturelle Denken eines Ingenieurs in die Sportanalyse ein. Als erfahrener Unternehmer konzentriert er sich auf langfristige Risikobewertung und Wahrscheinlichkeitsmodellierung und behandelt Sportwetten als disziplinierte Anlageklasse statt als Glücksspiel.",
    footer: "© 2026 OddsFlow. Alle Rechte vorbehalten.",
    footerDesc: "KI-gestützte Fußball Vorhersagen und Wett-Tipps für klügere Sportwetten. Treffen Sie datengestützte Entscheidungen mit Echtzeit-Einblicken.",
    product: "Produkt", liveOdds: "KI-Leistung", popularLeagues: "Beliebte Ligen",
    communityFooter: "Community", globalChat: "Globaler Chat", userPredictions: "Benutzer-Vorhersagen", todayMatches: "Heutige Spiele",
    company: "Unternehmen", aboutUs: "Über uns", contact: "Kontakt", blog: "Blog",
    legal: "Rechtliches", termsOfService: "Nutzungsbedingungen", privacyPolicy: "Datenschutz", responsibleGaming: "Verantwortungsvolles Spielen",
    allRightsReserved: "Alle Rechte vorbehalten.", gamblingWarning: "Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestützte Fußball Vorhersagen und Wett-Tipps nur zu Informations- und Unterhaltungszwecken. Wir garantieren nicht die Genauigkeit der Vorhersagen und sind nicht verantwortlich für finanzielle Verluste. Glücksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
  },
  FR: {
    home: "Accueil", predictions: "Pronostics", leagues: "Ligues", performance: "Analyse",
    community: "Communauté", news: "Actualités", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer", solution: "Solution",
    aboutTitle: "À Propos d'OddsFlow: Pronostics Foot & Paris Sportifs Propulsés par l'IA",
    aboutSubtitle: "La plupart regardent le match. Quelques-uns observent le marché des paris sportifs.",
    aboutIntro: "OddsFlow existe pour ces derniers. Nous avons remarqué un écart massif entre les \"statistiques publiques\" (possession, tirs cadrés) et la \"réalité du marché des paris sportifs\" (flux d'argent, mouvements de cotes et argent intelligent). Nous avons construit cette plateforme de pronostics foot pour combler cet écart. Nous ne traitons pas avec le battage médiatique, l'intuition ou les \"gains garantis\". Nous traitons avec les données, la logique et la transparence du marché.",
    ourStory: "Notre Histoire",
    storyText: "OddsFlow n'a pas commencé comme une entreprise; c'était une nécessité. Nous étions un groupe de passionnés de football et de traders frustrés par le manque d'outils professionnels pour le parieur quotidien. Les \"pros\" avaient des algorithmes avancés et des flux de données en temps réel; nous avions des feuilles de calcul et notre intuition. Cela ne semblait pas juste. Alors, nous avons construit notre propre moteur pour suivre les handicaps asiatiques, analyser les mouvements de cotes, et comprendre où vont les attentes du marché — que ce soit la Ligue 1, la Premier League ou la Champions League.",
    whatWeDo: "Ce Que Nous Faisons Vraiment",
    whatWeDoIntro: "Nous éliminons le bruit pour trouver le Signal. Au lieu de vous submerger de trivialités inutiles, nous nous concentrons sur les métriques qui comptent vraiment pour vos paris sportifs:",
    feature1Title: "Décoder l'Intention du Marché",
    feature1Text: "Comprendre pourquoi les cotes baissent, pas seulement qu'elles baissent.",
    feature2Title: "Analyse Contextuelle",
    feature2Text: "Le marché réagit-il aux nouvelles de l'équipe, ou est-ce un \"piège\"?",
    feature3Title: "Reconnaissance de Motifs",
    feature3Text: "Comment des handicaps similaires se sont-ils comportés historiquement dans ces conditions spécifiques?",
    philosophy: "Notre Philosophie: Des Outils, Pas des Boules de Cristal",
    philosophyText: "Nous respectons trop le jeu pour vous promettre une fortune. OddsFlow est une arme pour votre arsenal de paris sportifs, pas un remplacement pour votre cerveau. Nous fournissons les données structurées, les visualisations et le \"pourquoi\" — pour que vous puissiez prendre des décisions de pronostics basées sur des faits, pas sur des sentiments. La technologie soutient notre travail, mais le jugement humain guide la décision.",
    whoWeAreFor: "Pour Qui Nous Sommes",
    audience1Title: "L'Analyste",
    audience1Text: "Vous vous souciez des détails derrière le résultat.",
    audience2Title: "L'Orienté Données",
    audience2Text: "Vous faites plus confiance aux chiffres qu'aux narratifs.",
    audience3Title: "Le Curieux",
    audience3Text: "Vous voulez comprendre le football comme un système de marché, pas seulement comme un sport.",
    realityNote: "Une Note sur la Réalité",
    realityText: "OddsFlow est une plateforme d'analyse de données pour les paris sportifs. Nous ne sommes pas un bookmaker et nous ne sommes pas un \"service de pronostics garantis\". Nous vous donnons la carte; vous devez conduire la voiture. Veuillez utiliser nos données de manière responsable, faites vos propres recherches, et n'oubliez pas que dans le football, rien n'est jamais certain à 100%.",
    meetTheTeam: "L'Équipe", teamIntro: "Les esprits derrière l'approche data-driven d'OddsFlow",
    davidTitle: "Directeur Data Science", davidBio: "Avec une expertise en IA et Machine Learning, David applique les algorithmes de Wall Street au marché des paris sportifs. Ancien analyste sur les marchés Forex et Actions, il a construit le moteur central d'OddsFlow pour éliminer l'émotion humaine et se concentrer strictement sur la signification statistique.",
    danielTitle: "Co-fondateur & Actuaire Senior", danielBio: "Daniel apporte la précision d'un Actuaire et la pensée structurelle d'un Ingénieur à l'analyse sportive. Entrepreneur chevronné, il se concentre sur l'évaluation des risques à long terme et la modélisation des probabilités, traitant les paris sportifs comme une classe d'investissement disciplinée plutôt qu'un jeu de hasard.",
    footer: "© 2026 OddsFlow. Tous droits réservés.",
    footerDesc: "Pronostics foot et analyse de cotes propulsés par l'IA pour des paris sportifs plus intelligents. Prenez des décisions basées sur les données avec des informations en temps réel.",
    product: "Produit", liveOdds: "Performance IA", popularLeagues: "Ligues Populaires",
    communityFooter: "Communauté", globalChat: "Chat Global", userPredictions: "Pronostics Utilisateurs", todayMatches: "Matchs du Jour",
    company: "Entreprise", aboutUs: "À Propos", contact: "Contact", blog: "Blog",
    legal: "Mentions Légales", termsOfService: "Conditions d'Utilisation", privacyPolicy: "Politique de Confidentialité", responsibleGaming: "Jeu Responsable",
    allRightsReserved: "Tous droits réservés.", gamblingWarning: "Le jeu comporte des risques. Veuillez jouer de manière responsable.",
    disclaimer: "Avertissement: OddsFlow fournit des pronostics foot basés sur l'IA à des fins d'information et de divertissement uniquement. Nous ne garantissons pas l'exactitude des pronostics et ne sommes pas responsables des pertes financières. Le jeu comporte des risques. Veuillez jouer de manière responsable.",
  },
  JA: {
    home: "ホーム", predictions: "予想", leagues: "リーグ", performance: "的中率",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める", solution: "ソリューション",
    aboutTitle: "OddsFlowについて：AIサッカー勝敗予想 & ブックメーカー攻略プラットフォーム",
    aboutSubtitle: "ほとんどの人は試合を見る。少数の人はブックメーカー市場を見る。",
    aboutIntro: "OddsFlowは後者のために存在します。私たちは「公開統計」（ポゼッション、枠内シュート）と「市場の現実」（資金の流れ、オッズ変動、スマートマネー）の間に大きなギャップがあることに気づきました。このサッカー予想プラットフォームはそのギャップを埋めるために構築しました。私たちは誇大宣伝、直感、「保証された勝利」を扱いません。データ、論理、市場の透明性を扱います。",
    ourStory: "私たちのストーリー",
    storyText: "OddsFlowはビジネスとして始まったのではなく、必要性から始まりました。私たちはサッカー愛好家とトレーダーのグループでしたが、一般ベッター向けのプロフェッショナルグレードのツールがないことに不満を感じていました。「プロ」は高度なアルゴリズムとリアルタイムデータフィードを持っていましたが、私たちにはスプレッドシートと直感しかありませんでした。それは公平ではないと思いました。そこで私たちは、アジアンハンディキャップの動き、オッズの変動、市場の期待がどこに向かっているかを追跡する独自のエンジンを構築しました。プレミアリーグ、ラ・リーガ、チャンピオンズリーグなど、あらゆるリーグに対応しています。",
    whatWeDo: "私たちが実際にやっていること",
    whatWeDoIntro: "ノイズを取り除いてシグナルを見つけます。無駄なトリビアで圧倒するのではなく、ブックメーカー投資で本当に重要なメトリクスに焦点を当てています：",
    feature1Title: "市場の意図を解読",
    feature1Text: "オッズがなぜ下がっているのかを理解し、単に下がっているということだけではなく。",
    feature2Title: "コンテキスト分析",
    feature2Text: "市場はチームニュースに反応しているのか、それとも「罠」なのか？",
    feature3Title: "パターン認識",
    feature3Text: "これらの特定の条件下で、類似のハンディキャップは歴史的にどのようなパフォーマンスを示したか？",
    philosophy: "私たちの哲学：クリスタルボールではなくツール",
    philosophyText: "私たちはゲームを尊重しすぎて、あなたに財産を約束することはできません。OddsFlowはあなたのブックメーカー攻略のための武器であり、あなたの脳の代わりではありません。構造化されたデータ、可視化、そして「なぜ」を提供します。事実に基づいた買い目の意思決定ができるように、感情ではなく。テクノロジーが私たちの仕事をサポートしますが、人間の判断が決定を導きます。",
    whoWeAreFor: "誰のためのものか",
    audience1Title: "アナリスト",
    audience1Text: "結果の背後にある詳細を気にする方。",
    audience2Title: "データドリブン",
    audience2Text: "ナラティブよりも数字を信頼する方。",
    audience3Title: "好奇心旺盛な方",
    audience3Text: "サッカーをスポーツとしてだけでなく、市場システムとして理解したい方。",
    realityNote: "現実についての注意",
    realityText: "OddsFlowはブックメーカー投資のためのデータ分析プラットフォームです。私たちはブックメーカーでもなく、「保証付き予想サービス」でもありません。地図を渡しますが、運転はあなたがしなければなりません。責任を持ってデータを使用し、ご自身で調査を行い、サッカーでは何も100%確実ではないことを忘れないでください。",
    meetTheTeam: "チームのご紹介", teamIntro: "OddsFlowのデータドリブンアプローチを支える頭脳",
    davidTitle: "データサイエンス責任者", davidBio: "AIと機械学習の専門的なバックグラウンドを持つDavidは、ウォール街のアルゴリズムをブックメーカー市場に応用しています。以前はFXと株式市場のアナリストとして活躍し、人間の感情を排除し統計的有意性に厳密に焦点を当てるOddsFlowのコアエンジンを構築しました。",
    danielTitle: "共同創設者＆シニアアクチュアリー", danielBio: "Danielはアクチュアリーの精密さとエンジニアの構造的思考をスポーツ分析に活かしています。経験豊富な起業家として、長期的なリスク評価と確率モデリングに注力し、ブックメーカー投資をギャンブルではなく規律ある投資クラスとして捉えています。",
    footer: "© 2026 OddsFlow. 全著作権所有。",
    footerDesc: "よりスマートなサッカー予想のためのAI駆動オッズ分析。ブックメーカー投資をリアルタイムの洞察とデータ駆動の意思決定で。",
    product: "製品", liveOdds: "的中率", popularLeagues: "人気リーグ",
    communityFooter: "コミュニティ", globalChat: "グローバルチャット", userPredictions: "ユーザー予想", todayMatches: "今日の試合",
    company: "会社", aboutUs: "会社概要", contact: "お問い合わせ", blog: "ブログ",
    legal: "法的情報", termsOfService: "利用規約", privacyPolicy: "プライバシーポリシー", responsibleGaming: "責任あるギャンブル",
    allRightsReserved: "全著作権所有。", gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
    disclaimer: "免責事項：OddsFlowはAI駆動のサッカー予想を情報および娯楽目的のみで提供しています。予想の精度は保証されず、財務損失について責任を負いません。ギャンブルにはリスクが伴います。責任を持ってお楽しみください。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "분석",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기", solution: "솔루션",
    aboutTitle: "OddsFlow 소개: AI 기반 축구 승무패 예측 & 해외축구 분석 플랫폼",
    aboutSubtitle: "대부분의 사람들은 경기를 본다. 소수는 베팅 시장을 본다.",
    aboutIntro: "OddsFlow는 후자를 위해 존재합니다. 우리는 \"공개 통계\" (점유율, 유효 슈팅)와 \"베팅 시장 현실\" (자금 흐름, 배당률 변동, 스마트 머니) 사이에 큰 격차가 있음을 발견했습니다. 이 축구 예측 플랫폼은 그 격차를 해소하기 위해 구축되었습니다. 우리는 과대광고, 직감 또는 \"보장된 승리\"를 다루지 않습니다. 데이터, 논리, 시장 투명성을 다룹니다.",
    ourStory: "우리의 이야기",
    storyText: "OddsFlow는 사업으로 시작된 것이 아니라 필요에 의해 시작되었습니다. 우리는 일반 베터를 위한 전문적인 도구의 부족에 좌절한 축구 열광자와 트레이더 그룹이었습니다. \"프로\"들은 고급 알고리즘과 실시간 데이터 피드를 가지고 있었고, 우리는 스프레드시트와 직감만 가지고 있었습니다. 그것은 공정해 보이지 않았습니다. 그래서 우리는 아시안 핸디캡 변동, 배당률 움직임, 시장 기대치가 어디로 향하는지 추적하는 자체 엔진을 구축했습니다 — 프리미어리그, 라리가, 챔피언스리그 등 해외축구를 모두 분석합니다.",
    whatWeDo: "우리가 실제로 하는 일",
    whatWeDoIntro: "노이즈를 제거하여 신호를 찾습니다. 쓸모없는 정보로 압도하는 대신, 스포츠 베팅에서 실제로 중요한 지표에 집중합니다:",
    feature1Title: "시장 의도 해독",
    feature1Text: "배당이 떨어지고 있다는 것뿐만 아니라 왜 떨어지는지 이해합니다.",
    feature2Title: "맥락 분석",
    feature2Text: "시장이 팀 뉴스에 반응하는 것인가, 아니면 \"함정\"인가?",
    feature3Title: "패턴 인식",
    feature3Text: "이러한 특정 조건에서 유사한 핸디캡이 역사적으로 어떻게 수행되었는가?",
    philosophy: "우리의 철학: 크리스탈 볼이 아닌 도구",
    philosophyText: "우리는 게임을 너무 존중하기 때문에 당신에게 재산을 약속하지 않습니다. OddsFlow는 당신의 스포츠 베팅 무기고를 위한 무기이지, 당신의 두뇌를 대체하는 것이 아닙니다. 구조화된 데이터, 시각화 및 \"왜\"를 제공하여 감정이 아닌 사실에 기반한 예측 결정을 내릴 수 있도록 합니다. 기술은 우리의 작업을 지원하지만, 인간의 판단이 결정을 이끕니다.",
    whoWeAreFor: "우리는 누구를 위한 것인가",
    audience1Title: "분석가",
    audience1Text: "결과 뒤에 있는 세부 사항에 관심이 있는 분.",
    audience2Title: "데이터 중심",
    audience2Text: "내러티브보다 숫자를 더 신뢰하는 분.",
    audience3Title: "호기심 많은 분",
    audience3Text: "축구를 단순한 스포츠가 아닌 시장 시스템으로 이해하고 싶은 분.",
    realityNote: "현실에 대한 참고",
    realityText: "OddsFlow는 스포츠 베팅을 위한 데이터 분석 플랫폼입니다. 우리는 북메이커도 아니고 \"보장된 팁 서비스\"도 아닙니다. 지도를 드립니다; 운전은 당신이 해야 합니다. 데이터를 책임감 있게 사용하시고, 직접 조사하시고, 축구에서는 아무것도 100% 확실하지 않다는 것을 기억하세요.",
    meetTheTeam: "팀 소개", teamIntro: "OddsFlow의 데이터 기반 접근 방식을 이끄는 두뇌들",
    davidTitle: "데이터 사이언스 책임자", davidBio: "AI와 머신러닝에 전문화된 배경을 가진 David는 월스트리트 알고리즘을 스포츠 베팅 시장에 적용합니다. 이전에 외환 및 주식 시장 애널리스트로 활동했으며, 인간의 감정을 배제하고 통계적 유의성에만 집중하는 OddsFlow 핵심 엔진을 구축했습니다.",
    danielTitle: "공동 창업자 & 시니어 계리사", danielBio: "Daniel은 계리사의 정밀함과 엔지니어의 구조적 사고를 스포츠 분석에 적용합니다. 노련한 기업가로서 장기적인 위험 평가와 확률 모델링에 집중하며, 스포츠 베팅을 도박이 아닌 규율 있는 투자 자산 클래스로 다룹니다.",
    footer: "© 2026 OddsFlow. 모든 권리 보유.",
    footerDesc: "더 스마트한 축구 예측을 위한 AI 기반 배당률 분석. 해외축구 분석과 실시간 인사이트로 데이터 기반 스포츠 베팅 결정을 내리세요.",
    product: "제품", liveOdds: "AI 분석", popularLeagues: "인기 리그",
    communityFooter: "커뮤니티", globalChat: "글로벌 채팅", userPredictions: "사용자 예측", todayMatches: "오늘의 경기",
    company: "회사", aboutUs: "회사 소개", contact: "연락처", blog: "블로그",
    legal: "법적 정보", termsOfService: "서비스 약관", privacyPolicy: "개인정보 처리방침", responsibleGaming: "책임감 있는 게임",
    allRightsReserved: "모든 권리 보유.", gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
    disclaimer: "면책조항: OddsFlow는 정보 및 엔터테인먼트 목적으로만 AI 기반 축구 예측을 제공합니다. 예측의 정확성을 보장하지 않으며 재정적 손실에 대해 책임지지 않습니다. 도박에는 위험이 따릅니다. 책임감 있게 즐기세요.",
  },
  '中文': {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "分析",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始", solution: "解决方案",
    aboutTitle: "关于 OddsFlow：用大数据解读足球盘口的真相",
    aboutSubtitle: "大多数人看比赛。少数人看博彩市场。",
    aboutIntro: "OddsFlow为后者而存在。我们注意到\"公开统计数据\"（控球率、射正次数）与\"市场现实\"（资金流向、亚盘变动、聪明钱）之间存在巨大差距。我们构建这个足球预测平台来弥合这一差距。我们不做炒作、直觉或\"保证赢\"的生意。我们处理的是数据、逻辑和市场透明度。",
    ourStory: "我们的故事",
    storyText: "OddsFlow 不是作为生意开始的；它始于必需。我们是一群足球爱好者和交易者，对普通玩家缺乏专业级工具感到沮丧。\"专业人士\"有先进的算法和实时数据源；我们只有电子表格和直觉。这似乎不公平。所以，我们建立了自己的引擎来追踪亚盘如何变动、赔率如何变化，以及市场预期的真正走向——无论是英超、西甲还是欧冠，我们都能分析。",
    whatWeDo: "我们实际做什么",
    whatWeDoIntro: "我们剥离噪音寻找信号。我们不会用无用的琐事淹没你，而是专注于博彩中真正重要的指标：",
    feature1Title: "解读市场意图",
    feature1Text: "理解为什么赔率在下降，而不仅仅是它们在下降。",
    feature2Title: "背景分析",
    feature2Text: "市场是在对球队新闻做出反应，还是这是一个\"陷阱\"？",
    feature3Title: "模式识别",
    feature3Text: "在这些特定条件下，类似的亚盘历史表现如何？",
    philosophy: "我们的理念：工具，而非水晶球",
    philosophyText: "我们太尊重比赛了，不会承诺给你财富。OddsFlow 是你博彩武器库中的武器，而不是你大脑的替代品。我们提供结构化数据、可视化和\"为什么\"——这样你可以基于事实而非感觉做出投注决策。技术支持我们的工作，但人类判断驱动决策。",
    whoWeAreFor: "我们的目标用户",
    audience1Title: "分析师",
    audience1Text: "你关心结果背后的细节。",
    audience2Title: "数据驱动者",
    audience2Text: "你相信数字胜过叙事。",
    audience3Title: "好奇者",
    audience3Text: "你想将足球理解为一个市场系统，而不仅仅是一项运动。",
    realityNote: "关于现实的说明",
    realityText: "OddsFlow 是一个博彩数据分析平台。我们不是博彩公司，也不是\"卖料/推单服务\"。我们给你地图；你必须自己驾驶。请负责任地使用我们的数据，进行自己的研究，并记住在足球中，没有什么是100%确定的。",
    meetTheTeam: "团队介绍", teamIntro: "OddsFlow数据驱动方法背后的智囊团",
    davidTitle: "数据科学主管", davidBio: "David拥有AI和机器学习的专业背景，将华尔街算法应用于体育博彩市场。此前曾担任外汇和股票市场分析师，他构建了OddsFlow的核心引擎，旨在排除人为情绪干扰，严格聚焦于统计显著性。",
    danielTitle: "联合创始人 & 高级精算师", danielBio: "Daniel将精算师的精确性和工程师的结构化思维带入体育分析领域。作为一位经验丰富的企业家，他专注于长期风险评估和概率建模，将体育博彩视为一种有纪律的投资类别，而非单纯的赌博。",
    footer: "© 2026 OddsFlow. 版权所有。",
    footerDesc: "AI 驱动的足球预测与亚盘分析，助您做出更明智的投注决策。通过实时洞察和大数据做出数据驱动的决策。",
    product: "产品", liveOdds: "AI分析", popularLeagues: "热门联赛",
    communityFooter: "社区", globalChat: "全球聊天", userPredictions: "用户预测", todayMatches: "今日比赛",
    company: "公司", aboutUs: "关于我们", contact: "联系我们", blog: "博客",
    legal: "法律", termsOfService: "服务条款", privacyPolicy: "隐私政策", responsibleGaming: "负责任博彩",
    allRightsReserved: "版权所有。", gamblingWarning: "博彩有风险，请理性投注。",
    disclaimer: "免责声明：OddsFlow 提供的 AI 足球预测仅供参考和娱乐目的。我们不保证预测的准确性，也不对任何财务损失负责。博彩有风险，请理性投注。",
  },
  '繁體': {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "分析",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始", solution: "解決方案",
    aboutTitle: "關於 OddsFlow：用大數據解讀足球盤口與運彩分析",
    aboutSubtitle: "大多數人看比賽。少數人看投注市場。",
    aboutIntro: "OddsFlow為後者而存在。我們注意到\"公開統計數據\"（控球率、射正次數）與\"市場現實\"（資金流向、亞盤變動、聰明錢）之間存在巨大差距。我們構建這個足球預測平台來彌合這一差距。我們不做炒作、直覺或\"保證贏\"的生意。我們處理的是數據、邏輯和市場透明度。",
    ourStory: "我們的故事",
    storyText: "OddsFlow 不是作為生意開始的；它始於必需。我們是一群足球愛好者和交易者，對普通玩家缺乏專業級工具感到沮喪。\"專業人士\"有先進的演算法和即時數據源；我們只有電子表格和直覺。這似乎不公平。所以，我們建立了自己的引擎來追蹤亞盤如何變動、讓分盤和大小分如何變化，以及市場預期的真正走向——無論是英超、西甲還是歐冠，我們都能分析。",
    whatWeDo: "我們實際做什麼",
    whatWeDoIntro: "我們剝離噪音尋找訊號。我們不會用無用的瑣事淹沒你，而是專注於運彩投注中真正重要的指標：",
    feature1Title: "解讀市場意圖",
    feature1Text: "理解為什麼賠率在下降，而不僅僅是它們在下降。",
    feature2Title: "背景分析",
    feature2Text: "市場是在對球隊新聞做出反應，還是這是一個\"陷阱\"？",
    feature3Title: "模式識別",
    feature3Text: "在這些特定條件下，類似的亞盤歷史表現如何？",
    philosophy: "我們的理念：工具，而非水晶球",
    philosophyText: "我們太尊重比賽了，不會承諾給你財富。OddsFlow 是你運彩武器庫中的武器，而不是你大腦的替代品。我們提供結構化數據、可視化和\"為什麼\"——這樣你可以基於事實而非感覺做出投注決策。技術支持我們的工作，但人類判斷驅動決策。",
    whoWeAreFor: "我們的目標用戶",
    audience1Title: "分析師",
    audience1Text: "你關心結果背後的細節。",
    audience2Title: "數據驅動者",
    audience2Text: "你相信數字勝過敘事。",
    audience3Title: "好奇者",
    audience3Text: "你想將足球理解為一個市場系統，而不僅僅是一項運動。",
    realityNote: "關於現實的說明",
    realityText: "OddsFlow 是一個運彩數據分析平台。我們不是博彩公司，也不是\"賣牌服務\"。我們給你地圖；你必須自己駕駛。請負責任地使用我們的數據，進行自己的研究，並記住在足球中，沒有什麼是100%確定的。",
    meetTheTeam: "團隊介紹", teamIntro: "OddsFlow數據驅動方法背後的智囊團",
    davidTitle: "數據科學主管", davidBio: "David擁有AI和機器學習的專業背景，將華爾街演算法應用於體育博彩市場。此前曾擔任外匯和股票市場分析師，他構建了OddsFlow的核心引擎，旨在排除人為情緒干擾，嚴格聚焦於統計顯著性。",
    danielTitle: "聯合創始人 & 高級精算師", danielBio: "Daniel將精算師的精確性和工程師的結構化思維帶入體育分析領域。作為一位經驗豐富的企業家，他專注於長期風險評估和概率建模，將體育博彩視為一種有紀律的投資類別，而非單純的賭博。",
    footer: "© 2026 OddsFlow. 版權所有。",
    footerDesc: "AI 驅動的足球預測與亞盤分析，助您做出更明智的運彩投注決策。通過即時洞察和大數據做出數據驅動的決策。",
    product: "產品", liveOdds: "AI分析", popularLeagues: "熱門聯賽",
    communityFooter: "社區", globalChat: "全球聊天", userPredictions: "用戶預測", todayMatches: "今日比賽",
    company: "公司", aboutUs: "關於我們", contact: "聯繫我們", blog: "部落格",
    legal: "法律", termsOfService: "服務條款", privacyPolicy: "隱私政策", responsibleGaming: "負責任博彩",
    allRightsReserved: "版權所有。", gamblingWarning: "博彩有風險，請理性投注。",
    disclaimer: "免責聲明：OddsFlow 提供的 AI 足球預測僅供參考和娛樂目的。我們不保證預測的準確性，也不對任何財務損失負責。博彩有風險，請理性投注。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai", solution: "Solusi",
    aboutTitle: "Tentang OddsFlow: Platform AI untuk Prediksi Bola & Analisa Pasaran",
    aboutSubtitle: "Kebanyakan orang menonton pertandingan. Sedikit yang mengamati pasar.",
    aboutIntro: "OddsFlow ada untuk yang terakhir. Kami melihat kesenjangan besar antara \"statistik publik\" (penguasaan bola, tembakan tepat sasaran) dan \"realitas pasaran\" (aliran uang, pergerakan odds, dan uang pintar). Kami membangun platform ini untuk menjembatani kesenjangan itu dan menganalisa pergerakan Pasaran Bola secara real-time. Kami tidak berurusan dengan hype, intuisi, atau \"kemenangan terjamin\". Kami berurusan dengan data, logika, dan transparansi pasar.",
    ourStory: "Cerita Kami",
    storyText: "OddsFlow tidak dimulai sebagai bisnis; itu dimulai sebagai kebutuhan. Kami adalah sekelompok penggemar sepak bola dan pedagang yang frustrasi dengan kurangnya alat profesional untuk pengguna sehari-hari. \"Para profesional\" memiliki algoritma canggih dan umpan data real-time; kami hanya punya spreadsheet dan firasat. Itu tidak adil. Jadi, kami membangun mesin sendiri untuk melacak bagaimana Pasaran Bola bergerak — Asian Handicaps, Over/Under, pergerakan Kei, semuanya. Baik itu Premier League, La Liga, atau Liga Champions, kami menganalisa semuanya.",
    whatWeDo: "Apa yang Sebenarnya Kami Lakukan",
    whatWeDoIntro: "Kami menghilangkan kebisingan untuk menemukan Sinyal. Alih-alih membanjiri Anda dengan trivia yang tidak berguna, kami fokus pada metrik yang benar-benar penting:",
    feature1Title: "Mendekode Niat Pasar",
    feature1Text: "Memahami mengapa odds turun, bukan hanya bahwa mereka turun.",
    feature2Title: "Analisis Kontekstual",
    feature2Text: "Apakah pasar bereaksi terhadap berita tim, atau ini \"jebakan\"?",
    feature3Title: "Pengenalan Pola",
    feature3Text: "Bagaimana handicap serupa tampil secara historis dalam kondisi spesifik ini?",
    philosophy: "Filosofi Kami: Alat, Bukan Bola Kristal",
    philosophyText: "Kami terlalu menghormati permainan untuk menjanjikan kekayaan. OddsFlow adalah senjata untuk gudang senjata Anda, bukan pengganti otak Anda. Kami menyediakan data terstruktur, visualisasi, dan \"mengapa\" — sehingga Anda dapat membuat keputusan berdasarkan fakta, bukan perasaan.",
    whoWeAreFor: "Untuk Siapa Kami",
    audience1Title: "Analis",
    audience1Text: "Anda peduli dengan detail di balik hasil.",
    audience2Title: "Berbasis Data",
    audience2Text: "Anda lebih percaya angka daripada narasi.",
    audience3Title: "Yang Penasaran",
    audience3Text: "Anda ingin memahami sepak bola sebagai sistem pasar, bukan hanya olahraga.",
    realityNote: "Catatan tentang Realitas",
    realityText: "OddsFlow adalah platform analitik data. Kami bukan bandar taruhan, dan kami bukan penjual \"bocoran\" atau \"prediksi jitu\". Kami memberikan data nyata, bukan janji kosong. Kami memberikan peta; Anda harus mengemudi. Apakah Anda bermain single bet atau Mix Parlay, gunakan data kami secara bertanggung jawab, lakukan riset Anda sendiri, dan ingat bahwa dalam sepak bola, tidak ada yang 100% pasti.",
    meetTheTeam: "Tim Kami", teamIntro: "Otak di balik pendekatan berbasis data OddsFlow",
    davidTitle: "Kepala Data Science", davidBio: "Dengan latar belakang khusus di AI dan Machine Learning, David menerapkan algoritma Wall Street ke pasar taruhan olahraga. Sebelumnya seorang analis di pasar Forex dan Ekuitas, ia membangun mesin inti OddsFlow untuk menghilangkan emosi manusia dan fokus secara ketat pada signifikansi statistik.",
    danielTitle: "Co-Founder & Aktuaris Senior", danielBio: "Daniel membawa presisi seorang Aktuaris dan pemikiran struktural seorang Insinyur ke analitik olahraga. Seorang pengusaha berpengalaman, ia fokus pada penilaian risiko jangka panjang dan pemodelan probabilitas, memperlakukan taruhan olahraga sebagai kelas investasi yang disiplin daripada perjudian.",
    footer: "© 2026 OddsFlow. Hak cipta dilindungi.",
    footerDesc: "Analisis odds sepak bola bertenaga AI untuk prediksi yang lebih cerdas. Buat keputusan berbasis data dengan wawasan real-time.",
    product: "Produk", liveOdds: "Performa AI", popularLeagues: "Liga Populer",
    communityFooter: "Komunitas", globalChat: "Obrolan Global", userPredictions: "Prediksi Pengguna", todayMatches: "Pertandingan Hari Ini",
    company: "Perusahaan", aboutUs: "Tentang Kami", contact: "Kontak", blog: "Blog",
    legal: "Hukum", termsOfService: "Ketentuan Layanan", privacyPolicy: "Kebijakan Privasi", responsibleGaming: "Perjudian Bertanggung Jawab",
    allRightsReserved: "Hak cipta dilindungi.", gamblingWarning: "Perjudian melibatkan risiko. Harap bertaruh dengan bijak.",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi bertenaga AI hanya untuk tujuan informasi dan hiburan.",
  },
};

export default function AboutPage() {
  const params = useParams();
  const urlLocale = (params.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';
  const selectedLang = localeToTranslationCode[locale as Locale] || 'EN';
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const getLocaleUrl = (targetLocale: Locale): string => {
    const currentPath = '/about';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  // Internal linking terms mapping (term -> link path)
  const internalLinkTerms: Record<string, { terms: string[], path: string }> = {
    predictions: {
      terms: ['Asian Handicaps', 'Handicaps Asiáticos', 'Handicaps Asiáticos', 'Asiatische Handicaps', 'handicaps asiatiques', 'アジアンハンディキャップ', '아시아 핸디캡', '亚洲盘口', '亞洲盤口', 'Asian Handicaps', 'AI predictions', 'predicciones de IA', 'previsões de IA', 'KI-Vorhersagen', 'prédictions IA', 'AI予測', 'AI 예측', 'AI预测', 'AI預測', 'prediksi AI'],
      path: '/predictions'
    },
    performance: {
      terms: ['Market Intent', 'intención del mercado', 'intenção do mercado', 'Marktabsicht', 'intention du marché', '市場の意図', '시장 의도', '市场意图', '市場意圖', 'niat pasar'],
      path: '/performance'
    }
  };

  // Function to add internal links to text
  const addInternalLinks = (text: string): React.ReactNode => {
    let result: React.ReactNode[] = [text];

    Object.entries(internalLinkTerms).forEach(([, config]) => {
      const newResult: React.ReactNode[] = [];
      result.forEach((part, partIndex) => {
        if (typeof part !== 'string') {
          newResult.push(part);
          return;
        }

        let remainingText = part;
        let lastIndex = 0;
        const segments: React.ReactNode[] = [];

        config.terms.forEach((term) => {
          const index = remainingText.toLowerCase().indexOf(term.toLowerCase());
          if (index !== -1) {
            const actualTerm = remainingText.substring(index, index + term.length);
            if (index > 0) {
              segments.push(remainingText.substring(0, index));
            }
            segments.push(
              <Link
                key={`${partIndex}-${term}-${index}`}
                href={localePath(config.path)}
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                {actualTerm}
              </Link>
            );
            remainingText = remainingText.substring(index + term.length);
            lastIndex = index + term.length;
          }
        });

        if (remainingText) {
          segments.push(remainingText);
        }

        if (segments.length > 0) {
          newResult.push(...segments);
        } else {
          newResult.push(part);
        }
      });
      result = newResult;
    });

    return result;
  };

  // Organization Schema with Team Members
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OddsFlow",
    "url": "https://www.oddsflow.ai",
    "logo": "https://www.oddsflow.ai/homepage/OddsFlow Logo2.png",
    "description": "AI-powered football odds analysis platform for smarter predictions",
    "foundingDate": "2024",
    "sameAs": [
      "https://www.facebook.com/oddsflow",
      "https://www.instagram.com/oddsflow",
      "https://t.me/oddsflow"
    ],
    "employee": [
      {
        "@type": "Person",
        "name": "David",
        "jobTitle": "Head of Data Science",
        "image": "https://www.oddsflow.ai/about/David.png",
        "description": "Specialized background in AI and Machine Learning. Applies Wall Street algorithms to the sports betting market."
      },
      {
        "@type": "Person",
        "name": "Daniel",
        "jobTitle": "Co-Founder & Senior Actuary",
        "image": "https://www.oddsflow.ai/about/Daniel.png",
        "description": "Expert in risk assessment and probability modeling. Brings the precision of an Actuary to sports analytics."
      }
    ]
  };

  // Video Schema for OddsFlow Trailer
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "OddsFlow Trailer - AI Football Odds Analysis Platform",
    "description": "Discover how OddsFlow uses AI and machine learning to decode football market intent, analyze Asian Handicaps, and provide data-driven betting predictions.",
    "thumbnailUrl": "https://www.oddsflow.ai/about/about-us.png",
    "uploadDate": "2024-01-01",
    "contentUrl": "https://www.oddsflow.ai/about/Oddsflow video.mp4",
    "embedUrl": "https://www.oddsflow.ai/about/Oddsflow video.mp4",
    "duration": "PT2M30S",
    "publisher": {
      "@type": "Organization",
      "name": "OddsFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.oddsflow.ai/homepage/OddsFlow Logo2.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Video Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(/about/about-us.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />

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

              <Link
                href={localePath('/worldcup')}
                className="relative hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all cursor-pointer group overflow-hidden hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-5 w-auto object-contain relative z-10" />
                <span className="text-black font-semibold text-sm relative z-10">FIFA 2026</span>
              </Link>

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
                  <Link href={localePath('/dashboard')} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all">
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-emerald-400 font-medium mb-8 italic">
            {t('aboutSubtitle')}
          </p>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            {t('aboutIntro')}
          </p>
        </div>
      </section>

      {/* Video Trailer Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/10">
            <video
              className="w-full aspect-video"
              controls
              poster="/about/about-us.png"
              preload="metadata"
            >
              <source src="/about/Oddsflow video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Video glow effect */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10" />
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">OddsFlow Trailer</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-emerald-400">{t('ourStory')}</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{addInternalLinks(t('storyText'))}</p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{t('whatWeDo')}</h2>
          <p className="text-gray-400 text-lg text-center mb-12">{t('whatWeDoIntro')}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: t('feature1Title'), text: t('feature1Text'), icon: '🔍', link: '/performance' },
              { title: t('feature2Title'), text: t('feature2Text'), icon: '🎯', link: '/predictions' },
              { title: t('feature3Title'), text: t('feature3Text'), icon: '📊', link: '/predictions' },
            ].map((feature, i) => (
              <Link key={i} href={localePath(feature.link)} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-6 hover:border-emerald-500/30 transition-all backdrop-blur-sm group">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-400 group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400">{feature.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-2xl border border-cyan-500/20 p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">{t('philosophy')}</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{t('philosophyText')}</p>
          </div>
        </div>
      </section>

      {/* Who We Are For Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">{t('whoWeAreFor')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: t('audience1Title'), text: t('audience1Text'), icon: '📈' },
              { title: t('audience2Title'), text: t('audience2Text'), icon: '🔢' },
              { title: t('audience3Title'), text: t('audience3Text'), icon: '🧠' },
            ].map((audience, i) => (
              <div key={i} className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-6 text-center hover:border-emerald-500/30 transition-all backdrop-blur-sm">
                <div className="text-4xl mb-4">{audience.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{audience.title}</h3>
                <p className="text-gray-400">{audience.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{t('meetTheTeam')}</h2>
          <p className="text-gray-400 text-lg text-center mb-16">{t('teamIntro')}</p>
          <div className="space-y-12">
            {/* David - Image Left, Text Right */}
            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5 aspect-video relative overflow-hidden">
                  <img src="/about/David.png" alt="David - Head of Data Science at OddsFlow" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                  <div className="w-16 h-0.5 bg-emerald-500 mb-6" />
                  <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white">David</h3>
                  <p className="text-emerald-400 font-semibold text-xl mb-6">{t('davidTitle')}</p>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">{t('davidBio')}</p>
                </div>
              </div>
            </div>
            {/* Daniel - Text Left, Image Right */}
            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row-reverse">
                <div className="md:w-3/5 aspect-video relative overflow-hidden">
                  <img src="/about/Daniel.png" alt="Daniel - Senior Actuary at OddsFlow" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-center">
                  <div className="w-16 h-0.5 bg-cyan-500 mb-6" />
                  <h3 className="text-3xl md:text-4xl font-bold mb-3 text-white">Daniel</h3>
                  <p className="text-cyan-400 font-semibold text-xl mb-6">{t('danielTitle')}</p>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">{t('danielBio')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reality Note Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20 p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-amber-400">{t('realityNote')}</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{t('realityText')}</p>
          </div>
        </div>
      </section>

      <Footer localePath={localePath} t={t} locale={locale} />
    </div>
  );
}
