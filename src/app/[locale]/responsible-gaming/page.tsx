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
    community: "Community", news: "News", pricing: "Pricing", login: "Log In", getStarted: "Get Started", solution: "Solution",
    pageTitle: "Responsible Use & Risk Awareness",
    pageSubtitle: "At OddsFlow, we believe in informed decision-making and sustainable analytics practices.",
    ageWarning: "18+ Only",
    // Section 1: Our Position: Data, Not Bets
    section1Title: "Our Position: Data, Not Bets",
    section1Text: "OddsFlow is a sports analytics platform, not a gambling operator. We do not accept, place, or facilitate bets. Our role is to provide data-driven insights - what users choose to do with those insights is their own responsibility. Think of us as your analytics engine, not your bookie.",
    // Section 2: The Philosophy of Risk Management
    section2Title: "The Philosophy of Risk Management",
    section2Text: "If you use our data for sports trading or betting through third-party platforms, treat it like any other financial activity: never risk more than you can comfortably lose, diversify your approach, and remember that even the best data cannot predict the future with certainty. Markets are inherently volatile - our analytics improve your edge, but they do not eliminate risk.",
    // Section 3: Age & Legal Compliance
    section3Title: "Age & Legal Compliance",
    section3Subtitle: "18+ Only",
    section3Text: "Access to OddsFlow's premium analytics tools is restricted to users aged 18 and above. It is your responsibility to ensure that any use of sports betting or trading platforms in conjunction with our data complies with your local laws. We operate globally, but legal compliance is a local matter.",
    // Section 4: Principles of Sustainable Usage
    section4Title: "Principles of Sustainable Usage",
    section4Intro: "We encourage all users to approach our platform with discipline:",
    section4Item1Title: "Define Your Limits",
    section4Item1Text: "Set personal boundaries on time and capital before engaging with any external betting or trading activity.",
    section4Item2Title: "Avoid Chasing",
    section4Item2Text: "Losses are part of any probabilistic endeavor. Chasing losses leads to compounding mistakes.",
    section4Item3Title: "Clear Mindset",
    section4Item3Text: "Never trade or bet when emotionally compromised, fatigued, or under the influence of substances.",
    section4Item4Title: "Balance",
    section4Item4Text: "Ensure that sports analytics or trading remains a hobby or secondary activity - not a replacement for stable income or healthy lifestyle habits.",
    // Section 5: Recognizing the Red Flags
    section5Title: "Recognizing the Red Flags",
    section5Intro: "Market speculation can become addictive. Warning signs include:",
    section5Item1: "Spending beyond your means",
    section5Item2: "Neglecting personal or professional responsibilities",
    section5Item3: "Using borrowed money to place bets",
    section5Item4: "Feeling anxious, irritable, or depressed when not trading",
    section5Item5: "Hiding your activity from friends or family",
    section5Outro: "If any of these apply to you - stop. Reassess. Seek support.",
    // Section 6: Getting Help
    section6Title: "Getting Help",
    section6GlobalTitle: "Global Support",
    section6GlobalText: "If you or someone you know is struggling with gambling-related issues, we encourage reaching out to local support organizations. Many countries offer confidential helplines and free counseling services.",
    section6SelfExclusionTitle: "Self-Exclusion",
    section6SelfExclusionText: "If you need a break, you may contact us at support@oddsflow.ai to request a temporary suspension of your account. We support your choice to step back when needed.",
    // Footer
    product: "Product", liveOdds: "AI Performance", popularLeagues: "Popular Leagues",
    communityFooter: "Community", globalChat: "Global Chat", userPredictions: "User Predictions",
    company: "Company", aboutUs: "About Us", contact: "Contact", blog: "Blog",
    legal: "Legal", termsOfService: "Terms of Service", privacyPolicy: "Privacy Policy", responsibleGaming: "Responsible Use",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesion", getStarted: "Comenzar", solution: "Solucion",
    pageTitle: "Uso Responsable y Conciencia del Riesgo",
    pageSubtitle: "En OddsFlow, creemos en la toma de decisiones informadas y practicas de analitica sostenibles.",
    ageWarning: "Solo mayores de 18",
    section1Title: "Nuestra Posicion: Datos, No Apuestas",
    section1Text: "OddsFlow es una plataforma de analitica deportiva, no un operador de apuestas. No aceptamos, realizamos ni facilitamos apuestas. Nuestro rol es proporcionar insights basados en datos - lo que los usuarios elijan hacer con esos insights es su propia responsabilidad. Piense en nosotros como su motor de analitica, no como su corredor de apuestas.",
    section2Title: "La Filosofia de la Gestion del Riesgo",
    section2Text: "Si utiliza nuestros datos para trading deportivo o apuestas a traves de plataformas de terceros, tratelo como cualquier otra actividad financiera: nunca arriesgue mas de lo que pueda perder comodamente, diversifique su enfoque y recuerde que incluso los mejores datos no pueden predecir el futuro con certeza. Los mercados son inherentemente volatiles - nuestra analitica mejora su ventaja, pero no elimina el riesgo.",
    section3Title: "Cumplimiento Legal y de Edad",
    section3Subtitle: "Solo mayores de 18",
    section3Text: "El acceso a las herramientas de analitica premium de OddsFlow esta restringido a usuarios mayores de 18 anos. Es su responsabilidad asegurar que cualquier uso de plataformas de apuestas deportivas o trading en conjunto con nuestros datos cumpla con sus leyes locales. Operamos globalmente, pero el cumplimiento legal es un asunto local.",
    section4Title: "Principios de Uso Sostenible",
    section4Intro: "Animamos a todos los usuarios a abordar nuestra plataforma con disciplina:",
    section4Item1Title: "Defina Sus Limites",
    section4Item1Text: "Establezca limites personales de tiempo y capital antes de participar en cualquier actividad de apuestas o trading externo.",
    section4Item2Title: "Evite Perseguir Perdidas",
    section4Item2Text: "Las perdidas son parte de cualquier actividad probabilistica. Perseguir perdidas lleva a errores acumulados.",
    section4Item3Title: "Mentalidad Clara",
    section4Item3Text: "Nunca opere o apueste cuando este emocionalmente comprometido, fatigado o bajo la influencia de sustancias.",
    section4Item4Title: "Equilibrio",
    section4Item4Text: "Asegurese de que la analitica deportiva o el trading siga siendo un hobby o actividad secundaria - no un reemplazo de ingresos estables o habitos de vida saludables.",
    section5Title: "Reconociendo las Senales de Alerta",
    section5Intro: "La especulacion de mercado puede volverse adictiva. Las senales de advertencia incluyen:",
    section5Item1: "Gastar mas alla de sus posibilidades",
    section5Item2: "Descuidar responsabilidades personales o profesionales",
    section5Item3: "Usar dinero prestado para apostar",
    section5Item4: "Sentirse ansioso, irritable o deprimido cuando no esta operando",
    section5Item5: "Ocultar su actividad de amigos o familiares",
    section5Outro: "Si alguna de estas situaciones le aplica - detenga. Reevalue. Busque apoyo.",
    section6Title: "Obtener Ayuda",
    section6GlobalTitle: "Apoyo Global",
    section6GlobalText: "Si usted o alguien que conoce esta luchando con problemas relacionados con el juego, le animamos a contactar organizaciones de apoyo locales. Muchos paises ofrecen lineas de ayuda confidenciales y servicios de asesoramiento gratuitos.",
    section6SelfExclusionTitle: "Autoexclusion",
    section6SelfExclusionText: "Si necesita un descanso, puede contactarnos en support@oddsflow.ai para solicitar una suspension temporal de su cuenta. Apoyamos su decision de dar un paso atras cuando sea necesario.",
    product: "Producto", liveOdds: "Rendimiento IA", popularLeagues: "Ligas Populares",
    communityFooter: "Comunidad", globalChat: "Chat Global", userPredictions: "Predicciones de Usuarios",
    company: "Empresa", aboutUs: "Sobre Nosotros", contact: "Contacto", blog: "Blog",
    legal: "Legal", termsOfService: "Terminos de Servicio", privacyPolicy: "Politica de Privacidad", responsibleGaming: "Uso Responsable",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juegue responsablemente.",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precision de las predicciones. El juego implica riesgo. Los usuarios deben tener mas de 18 anos.",
  },
  PT: {
    home: "Inicio", predictions: "Previsoes", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Noticias", pricing: "Precos", login: "Entrar", getStarted: "Comecar", solution: "Solucao",
    pageTitle: "Uso Responsavel e Consciencia de Risco",
    pageSubtitle: "Na OddsFlow, acreditamos na tomada de decisoes informadas e praticas de analitica sustentaveis.",
    ageWarning: "Apenas maiores de 18",
    section1Title: "Nossa Posicao: Dados, Nao Apostas",
    section1Text: "OddsFlow e uma plataforma de analitica esportiva, nao uma operadora de apostas. Nao aceitamos, realizamos ou facilitamos apostas. Nosso papel e fornecer insights baseados em dados - o que os usuarios escolhem fazer com esses insights e sua propria responsabilidade. Pense em nos como seu motor de analitica, nao como seu apostador.",
    section2Title: "A Filosofia da Gestao de Risco",
    section2Text: "Se voce usa nossos dados para trading esportivo ou apostas atraves de plataformas de terceiros, trate como qualquer outra atividade financeira: nunca arrisque mais do que pode perder confortavelmente, diversifique sua abordagem e lembre-se de que mesmo os melhores dados nao podem prever o futuro com certeza. Os mercados sao inerentemente volateis - nossa analitica melhora sua vantagem, mas nao elimina o risco.",
    section3Title: "Conformidade Legal e de Idade",
    section3Subtitle: "Apenas maiores de 18",
    section3Text: "O acesso as ferramentas de analitica premium da OddsFlow e restrito a usuarios com 18 anos ou mais. E sua responsabilidade garantir que qualquer uso de plataformas de apostas esportivas ou trading em conjunto com nossos dados esteja em conformidade com suas leis locais. Operamos globalmente, mas a conformidade legal e uma questao local.",
    section4Title: "Principios de Uso Sustentavel",
    section4Intro: "Encorajamos todos os usuarios a abordar nossa plataforma com disciplina:",
    section4Item1Title: "Defina Seus Limites",
    section4Item1Text: "Estabeleca limites pessoais de tempo e capital antes de se envolver em qualquer atividade de apostas ou trading externo.",
    section4Item2Title: "Evite Perseguir Perdas",
    section4Item2Text: "Perdas fazem parte de qualquer atividade probabilistica. Perseguir perdas leva a erros acumulados.",
    section4Item3Title: "Mentalidade Clara",
    section4Item3Text: "Nunca opere ou aposte quando estiver emocionalmente comprometido, fatigado ou sob influencia de substancias.",
    section4Item4Title: "Equilibrio",
    section4Item4Text: "Garanta que a analitica esportiva ou trading permaneca como hobby ou atividade secundaria - nao como substituto de renda estavel ou habitos de vida saudaveis.",
    section5Title: "Reconhecendo os Sinais de Alerta",
    section5Intro: "A especulacao de mercado pode se tornar viciante. Os sinais de alerta incluem:",
    section5Item1: "Gastar alem das suas possibilidades",
    section5Item2: "Negligenciar responsabilidades pessoais ou profissionais",
    section5Item3: "Usar dinheiro emprestado para apostar",
    section5Item4: "Sentir-se ansioso, irritado ou deprimido quando nao esta operando",
    section5Item5: "Esconder sua atividade de amigos ou familiares",
    section5Outro: "Se alguma dessas situacoes se aplica a voce - pare. Reavalie. Busque apoio.",
    section6Title: "Obtendo Ajuda",
    section6GlobalTitle: "Suporte Global",
    section6GlobalText: "Se voce ou alguem que conhece esta enfrentando problemas relacionados a jogos de azar, encorajamos contatar organizacoes de apoio locais. Muitos paises oferecem linhas de ajuda confidenciais e servicos de aconselhamento gratuitos.",
    section6SelfExclusionTitle: "Autoexclusao",
    section6SelfExclusionText: "Se precisar de uma pausa, pode nos contatar em support@oddsflow.ai para solicitar uma suspensao temporaria da sua conta. Apoiamos sua escolha de dar um passo atras quando necessario.",
    product: "Produto", liveOdds: "Desempenho IA", popularLeagues: "Ligas Populares",
    communityFooter: "Comunidade", globalChat: "Chat Global", userPredictions: "Previsoes de Usuarios",
    company: "Empresa", aboutUs: "Sobre Nos", contact: "Contato", blog: "Blog",
    legal: "Legal", termsOfService: "Termos de Servico", privacyPolicy: "Politica de Privacidade", responsibleGaming: "Uso Responsavel",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    disclaimer: "Aviso: OddsFlow fornece previsoes baseadas em IA apenas para fins informativos. Nao garantimos a precisao das previsoes. Usuarios devem ter mais de 18 anos.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen", solution: "Losung",
    pageTitle: "Verantwortungsvolle Nutzung & Risikobewusstsein",
    pageSubtitle: "Bei OddsFlow glauben wir an informierte Entscheidungsfindung und nachhaltige Analysepraktiken.",
    ageWarning: "Nur ab 18",
    section1Title: "Unsere Position: Daten, Keine Wetten",
    section1Text: "OddsFlow ist eine Sportanalyseplattform, kein Wettanbieter. Wir nehmen keine Wetten an, platzieren oder vermitteln sie. Unsere Rolle ist es, datengesteuerte Erkenntnisse zu liefern - was Benutzer mit diesen Erkenntnissen tun, liegt in ihrer eigenen Verantwortung. Betrachten Sie uns als Ihren Analyse-Motor, nicht als Ihren Buchmacher.",
    section2Title: "Die Philosophie des Risikomanagements",
    section2Text: "Wenn Sie unsere Daten fur Sporthandel oder Wetten uber Drittanbieterplattformen nutzen, behandeln Sie es wie jede andere finanzielle Aktivitat: Riskieren Sie nie mehr, als Sie bequem verlieren konnen, diversifizieren Sie Ihren Ansatz und denken Sie daran, dass selbst die besten Daten die Zukunft nicht mit Sicherheit vorhersagen konnen. Markte sind von Natur aus volatil - unsere Analysen verbessern Ihren Vorteil, eliminieren aber nicht das Risiko.",
    section3Title: "Alters- und Rechtskonformitat",
    section3Subtitle: "Nur ab 18",
    section3Text: "Der Zugang zu OddsFlows Premium-Analysetools ist auf Benutzer ab 18 Jahren beschrankt. Es liegt in Ihrer Verantwortung sicherzustellen, dass jede Nutzung von Sportwett- oder Handelsplattformen in Verbindung mit unseren Daten Ihren lokalen Gesetzen entspricht. Wir operieren global, aber die rechtliche Konformitat ist eine lokale Angelegenheit.",
    section4Title: "Prinzipien nachhaltiger Nutzung",
    section4Intro: "Wir ermutigen alle Benutzer, unsere Plattform mit Disziplin zu nutzen:",
    section4Item1Title: "Definieren Sie Ihre Grenzen",
    section4Item1Text: "Setzen Sie personliche Grenzen fur Zeit und Kapital, bevor Sie sich an externen Wett- oder Handelsaktivitaten beteiligen.",
    section4Item2Title: "Vermeiden Sie das Nachjagen",
    section4Item2Text: "Verluste sind Teil jeder probabilistischen Aktivitat. Verlusten nachzujagen fuhrt zu kumulativen Fehlern.",
    section4Item3Title: "Klare Denkweise",
    section4Item3Text: "Handeln oder wetten Sie nie, wenn Sie emotional beeintrachtigt, erschopft oder unter Einfluss von Substanzen sind.",
    section4Item4Title: "Gleichgewicht",
    section4Item4Text: "Stellen Sie sicher, dass Sportanalysen oder Trading ein Hobby oder eine Nebentatigkeit bleiben - kein Ersatz fur stabiles Einkommen oder gesunde Lebensgewohnheiten.",
    section5Title: "Warnsignale Erkennen",
    section5Intro: "Marktspekulation kann suchtig machen. Warnzeichen umfassen:",
    section5Item1: "Uber Ihre Verhaltnisse ausgeben",
    section5Item2: "Personliche oder berufliche Verantwortlichkeiten vernachlassigen",
    section5Item3: "Geliehenes Geld zum Wetten verwenden",
    section5Item4: "Sich angstlich, gereizt oder deprimiert fuhlen, wenn Sie nicht handeln",
    section5Item5: "Ihre Aktivitaten vor Freunden oder Familie verbergen",
    section5Outro: "Wenn etwas davon auf Sie zutrifft - stoppen Sie. Bewerten Sie neu. Suchen Sie Unterstutzung.",
    section6Title: "Hilfe Bekommen",
    section6GlobalTitle: "Globale Unterstutzung",
    section6GlobalText: "Wenn Sie oder jemand, den Sie kennen, mit glucksspielbezogenen Problemen kampft, ermutigen wir Sie, lokale Hilfsorganisationen zu kontaktieren. Viele Lander bieten vertrauliche Hotlines und kostenlose Beratungsdienste an.",
    section6SelfExclusionTitle: "Selbstausschluss",
    section6SelfExclusionText: "Wenn Sie eine Pause benotigen, konnen Sie uns unter support@oddsflow.ai kontaktieren, um eine vorubergehende Sperrung Ihres Kontos zu beantragen. Wir unterstutzen Ihre Entscheidung, einen Schritt zuruckzutreten, wenn notig.",
    product: "Produkt", liveOdds: "KI-Leistung", popularLeagues: "Beliebte Ligen",
    communityFooter: "Community", globalChat: "Globaler Chat", userPredictions: "Benutzer-Vorhersagen",
    company: "Unternehmen", aboutUs: "Uber uns", contact: "Kontakt", blog: "Blog",
    legal: "Rechtliches", termsOfService: "Nutzungsbedingungen", privacyPolicy: "Datenschutz", responsibleGaming: "Verantwortungsvolle Nutzung",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glucksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestutzte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Benutzer mussen 18+ Jahre alt sein.",
  },
  FR: {
    home: "Accueil", predictions: "Predictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communaute", news: "Actualites", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer", solution: "Solution",
    pageTitle: "Utilisation Responsable & Conscience du Risque",
    pageSubtitle: "Chez OddsFlow, nous croyons en la prise de decisions eclairees et en des pratiques d'analyse durables.",
    ageWarning: "18+ uniquement",
    section1Title: "Notre Position: Donnees, Pas de Paris",
    section1Text: "OddsFlow est une plateforme d'analyse sportive, pas un operateur de paris. Nous n'acceptons, ne placons ni ne facilitons les paris. Notre role est de fournir des insights bases sur les donnees - ce que les utilisateurs choisissent de faire avec ces insights releve de leur propre responsabilite. Considerez-nous comme votre moteur d'analyse, pas comme votre bookmaker.",
    section2Title: "La Philosophie de la Gestion du Risque",
    section2Text: "Si vous utilisez nos donnees pour le trading sportif ou les paris via des plateformes tierces, traitez-le comme toute autre activite financiere: ne risquez jamais plus que ce que vous pouvez confortablement perdre, diversifiez votre approche et rappelez-vous que meme les meilleures donnees ne peuvent pas predire l'avenir avec certitude. Les marches sont inheremment volatils - nos analyses ameliorent votre avantage, mais n'eliminent pas le risque.",
    section3Title: "Conformite Legale et d'Age",
    section3Subtitle: "18+ uniquement",
    section3Text: "L'acces aux outils d'analyse premium d'OddsFlow est reserve aux utilisateurs ages de 18 ans et plus. Il vous incombe de vous assurer que toute utilisation de plateformes de paris sportifs ou de trading en conjonction avec nos donnees est conforme a vos lois locales. Nous operons a l'echelle mondiale, mais la conformite legale est une question locale.",
    section4Title: "Principes d'Utilisation Durable",
    section4Intro: "Nous encourageons tous les utilisateurs a aborder notre plateforme avec discipline:",
    section4Item1Title: "Definissez Vos Limites",
    section4Item1Text: "Fixez des limites personnelles de temps et de capital avant de vous engager dans toute activite de paris ou de trading externe.",
    section4Item2Title: "Evitez de Poursuivre les Pertes",
    section4Item2Text: "Les pertes font partie de toute activite probabiliste. Poursuivre les pertes mene a des erreurs cumulees.",
    section4Item3Title: "Etat d'Esprit Clair",
    section4Item3Text: "Ne tradez ou ne pariez jamais lorsque vous etes emotionnellement compromis, fatigue ou sous l'influence de substances.",
    section4Item4Title: "Equilibre",
    section4Item4Text: "Assurez-vous que l'analyse sportive ou le trading reste un hobby ou une activite secondaire - pas un remplacement de revenus stables ou d'habitudes de vie saines.",
    section5Title: "Reconnaitre les Signaux d'Alerte",
    section5Intro: "La speculation de marche peut devenir addictive. Les signes d'alerte incluent:",
    section5Item1: "Depenser au-dela de vos moyens",
    section5Item2: "Negliger les responsabilites personnelles ou professionnelles",
    section5Item3: "Utiliser de l'argent emprunte pour parier",
    section5Item4: "Se sentir anxieux, irritable ou deprime quand on ne trade pas",
    section5Item5: "Cacher votre activite a vos amis ou votre famille",
    section5Outro: "Si l'un de ces points vous concerne - arretez. Reevaluez. Cherchez du soutien.",
    section6Title: "Obtenir de l'Aide",
    section6GlobalTitle: "Support Global",
    section6GlobalText: "Si vous ou quelqu'un que vous connaissez lutte contre des problemes lies aux jeux d'argent, nous vous encourageons a contacter les organisations de soutien locales. De nombreux pays proposent des lignes d'assistance confidentielles et des services de conseil gratuits.",
    section6SelfExclusionTitle: "Auto-exclusion",
    section6SelfExclusionText: "Si vous avez besoin d'une pause, vous pouvez nous contacter a support@oddsflow.ai pour demander une suspension temporaire de votre compte. Nous soutenons votre choix de prendre du recul quand c'est necessaire.",
    product: "Produit", liveOdds: "Performance IA", popularLeagues: "Ligues Populaires",
    communityFooter: "Communaute", globalChat: "Chat Global", userPredictions: "Predictions Utilisateurs",
    company: "Entreprise", aboutUs: "A Propos", contact: "Contact", blog: "Blog",
    legal: "Legal", termsOfService: "Conditions d'Utilisation", privacyPolicy: "Politique de Confidentialite", responsibleGaming: "Utilisation Responsable",
    allRightsReserved: "Tous droits reserves.",
    gamblingWarning: "Les jeux d'argent comportent des risques. Jouez de maniere responsable.",
    disclaimer: "Avertissement: OddsFlow fournit des predictions basees sur l'IA uniquement a des fins d'information et de divertissement. Les utilisateurs doivent avoir 18+ ans.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "AIパフォーマンス",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める", solution: "ソリューション",
    pageTitle: "責任ある利用とリスク意識",
    pageSubtitle: "OddsFlowでは、情報に基づいた意思決定と持続可能な分析実践を信じています。",
    ageWarning: "18歳以上限定",
    section1Title: "私たちの立場：データであり、賭けではない",
    section1Text: "OddsFlowはスポーツ分析プラットフォームであり、ギャンブル運営者ではありません。私たちは賭けを受け付けたり、行ったり、仲介したりしません。私たちの役割はデータ駆動型のインサイトを提供することです - ユーザーがそれらのインサイトで何をするかは、ユーザー自身の責任です。私たちをあなたの分析エンジンとして考えてください、ブックメーカーではありません。",
    section2Title: "リスク管理の哲学",
    section2Text: "サードパーティのプラットフォームを通じてスポーツトレーディングやベッティングに私たちのデータを使用する場合、他の金融活動と同様に扱ってください：快適に失える以上のリスクを取らない、アプローチを多様化する、そして最高のデータでさえ将来を確実に予測することはできないことを覚えておいてください。市場は本質的に不安定です - 私たちの分析はあなたの優位性を向上させますが、リスクを排除するものではありません。",
    section3Title: "年齢と法的コンプライアンス",
    section3Subtitle: "18歳以上限定",
    section3Text: "OddsFlowのプレミアム分析ツールへのアクセスは18歳以上のユーザーに制限されています。私たちのデータと連携してスポーツベッティングやトレーディングプラットフォームを使用する際は、お住まいの地域の法律に準拠していることを確認する責任はユーザーにあります。私たちはグローバルに運営していますが、法的コンプライアンスは地域の問題です。",
    section4Title: "持続可能な利用の原則",
    section4Intro: "すべてのユーザーに規律を持って私たちのプラットフォームにアプローチすることをお勧めします：",
    section4Item1Title: "限度を定義する",
    section4Item1Text: "外部のベッティングやトレーディング活動に参加する前に、時間と資本の個人的な制限を設定してください。",
    section4Item2Title: "損失を追いかけない",
    section4Item2Text: "損失は確率的な活動の一部です。損失を追いかけることは複合的な間違いにつながります。",
    section4Item3Title: "クリアな心理状態",
    section4Item3Text: "感情的に不安定な状態、疲労している状態、または物質の影響下にある状態でトレードやベットをしないでください。",
    section4Item4Title: "バランス",
    section4Item4Text: "スポーツ分析やトレーディングが趣味または副次的な活動にとどまるようにしてください - 安定した収入や健康的な生活習慣の代わりではありません。",
    section5Title: "警告サインを認識する",
    section5Intro: "市場投機は中毒性になる可能性があります。警告サインには以下が含まれます：",
    section5Item1: "収入を超えて支出する",
    section5Item2: "個人的または職業的責任を怠る",
    section5Item3: "借りたお金を賭けに使う",
    section5Item4: "トレードしていないときに不安、イライラ、または落ち込みを感じる",
    section5Item5: "友人や家族から活動を隠す",
    section5Outro: "これらのいずれかが当てはまる場合 - 停止してください。再評価してください。サポートを求めてください。",
    section6Title: "助けを得る",
    section6GlobalTitle: "グローバルサポート",
    section6GlobalText: "あなたや知り合いがギャンブル関連の問題に苦しんでいる場合、地元のサポート組織に連絡することをお勧めします。多くの国では、秘密厳守のヘルプラインと無料のカウンセリングサービスを提供しています。",
    section6SelfExclusionTitle: "自己排除",
    section6SelfExclusionText: "休憩が必要な場合は、support@oddsflow.ai に連絡して、アカウントの一時停止をリクエストできます。必要なときに一歩引くというあなたの選択をサポートします。",
    product: "製品", liveOdds: "AIパフォーマンス", popularLeagues: "人気リーグ",
    communityFooter: "コミュニティ", globalChat: "グローバルチャット", userPredictions: "ユーザー予測",
    company: "会社", aboutUs: "会社概要", contact: "お問い合わせ", blog: "ブログ",
    legal: "法的情報", termsOfService: "利用規約", privacyPolicy: "プライバシーポリシー", responsibleGaming: "責任ある利用",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってギャンブルしてください。",
    disclaimer: "免責事項：OddsFlowは情報および娯楽目的でのみAI予測を提供しています。ユーザーは18歳以上である必要があります。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성과",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기", solution: "솔루션",
    pageTitle: "책임감 있는 사용 및 위험 인식",
    pageSubtitle: "OddsFlow에서는 정보에 기반한 의사결정과 지속 가능한 분석 관행을 믿습니다.",
    ageWarning: "18세 이상만",
    section1Title: "우리의 입장: 데이터, 베팅 아님",
    section1Text: "OddsFlow는 스포츠 분석 플랫폼이지, 도박 운영자가 아닙니다. 우리는 베팅을 수락하거나, 배치하거나, 촉진하지 않습니다. 우리의 역할은 데이터 기반 인사이트를 제공하는 것입니다 - 사용자가 이러한 인사이트로 무엇을 하는지는 그들 자신의 책임입니다. 우리를 분석 엔진으로 생각하세요, 북메이커가 아닙니다.",
    section2Title: "위험 관리 철학",
    section2Text: "제3자 플랫폼을 통해 스포츠 트레이딩이나 베팅에 우리 데이터를 사용한다면, 다른 금융 활동처럼 다루세요: 편하게 잃을 수 있는 것 이상을 절대 위험에 빠뜨리지 마세요, 접근 방식을 다양화하고, 최고의 데이터도 미래를 확실하게 예측할 수 없다는 것을 기억하세요. 시장은 본질적으로 변동성이 있습니다 - 우리의 분석은 여러분의 우위를 향상시키지만, 위험을 제거하지는 않습니다.",
    section3Title: "연령 및 법적 준수",
    section3Subtitle: "18세 이상만",
    section3Text: "OddsFlow의 프리미엄 분석 도구에 대한 접근은 18세 이상의 사용자로 제한됩니다. 우리 데이터와 함께 스포츠 베팅 또는 트레이딩 플랫폼을 사용하는 것이 현지 법률을 준수하는지 확인하는 것은 귀하의 책임입니다. 우리는 글로벌하게 운영하지만, 법적 준수는 지역 문제입니다.",
    section4Title: "지속 가능한 사용 원칙",
    section4Intro: "모든 사용자가 규율을 가지고 우리 플랫폼에 접근하도록 권장합니다:",
    section4Item1Title: "한계 정의하기",
    section4Item1Text: "외부 베팅이나 트레이딩 활동에 참여하기 전에 시간과 자본에 대한 개인적인 한계를 설정하세요.",
    section4Item2Title: "손실 쫓지 않기",
    section4Item2Text: "손실은 모든 확률적 활동의 일부입니다. 손실을 쫓는 것은 복합적인 실수로 이어집니다.",
    section4Item3Title: "명확한 마음가짐",
    section4Item3Text: "감정적으로 손상되었거나, 피곤하거나, 물질의 영향을 받은 상태에서 트레이딩하거나 베팅하지 마세요.",
    section4Item4Title: "균형",
    section4Item4Text: "스포츠 분석이나 트레이딩이 취미 또는 부차적인 활동으로 남도록 하세요 - 안정적인 수입이나 건강한 생활 습관의 대체물이 아닙니다.",
    section5Title: "경고 신호 인식하기",
    section5Intro: "시장 투기는 중독성이 될 수 있습니다. 경고 신호에는 다음이 포함됩니다:",
    section5Item1: "수입을 초과하여 지출",
    section5Item2: "개인적 또는 직업적 책임 소홀",
    section5Item3: "빌린 돈으로 베팅",
    section5Item4: "트레이딩하지 않을 때 불안하거나, 짜증나거나, 우울함을 느낌",
    section5Item5: "친구나 가족에게 활동 숨기기",
    section5Outro: "이 중 하나라도 해당된다면 - 멈추세요. 재평가하세요. 지원을 구하세요.",
    section6Title: "도움 받기",
    section6GlobalTitle: "글로벌 지원",
    section6GlobalText: "귀하 또는 아는 사람이 도박 관련 문제로 어려움을 겪고 있다면, 지역 지원 조직에 연락하시기를 권장합니다. 많은 국가에서 비밀 핫라인과 무료 상담 서비스를 제공합니다.",
    section6SelfExclusionTitle: "자기 배제",
    section6SelfExclusionText: "휴식이 필요하면 support@oddsflow.ai로 연락하여 계정의 임시 정지를 요청할 수 있습니다. 필요할 때 한 걸음 물러서려는 선택을 지지합니다.",
    product: "제품", liveOdds: "AI 성과", popularLeagues: "인기 리그",
    communityFooter: "커뮤니티", globalChat: "글로벌 채팅", userPredictions: "사용자 예측",
    company: "회사", aboutUs: "회사 소개", contact: "연락처", blog: "블로그",
    legal: "법적 정보", termsOfService: "서비스 약관", privacyPolicy: "개인정보 보호정책", responsibleGaming: "책임감 있는 사용",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 도박하세요.",
    disclaimer: "면책 조항: OddsFlow는 정보 및 오락 목적으로만 AI 예측을 제공합니다. 사용자는 18세 이상이어야 합니다.",
  },
  "中文": {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始使用", solution: "解决方案",
    pageTitle: "负责任使用与风险意识",
    pageSubtitle: "在OddsFlow，我们相信知情决策和可持续的分析实践。",
    ageWarning: "仅限18岁以上",
    section1Title: "我们的立场：数据，而非博彩",
    section1Text: "OddsFlow是一个体育分析平台，而非博彩运营商。我们不接受、下注或促进博彩。我们的角色是提供数据驱动的洞察 - 用户选择如何使用这些洞察是他们自己的责任。把我们当作您的分析引擎，而非您的博彩公司。",
    section2Title: "风险管理哲学",
    section2Text: "如果您通过第三方平台将我们的数据用于体育交易或博彩，请像对待任何其他金融活动一样：永远不要冒超出您舒适承受范围的风险，多元化您的方法，并记住即使是最好的数据也无法确定地预测未来。市场本质上是波动的 - 我们的分析提高您的优势，但不能消除风险。",
    section3Title: "年龄与法律合规",
    section3Subtitle: "仅限18岁以上",
    section3Text: "OddsFlow高级分析工具的访问权限仅限于18岁及以上的用户。确保您与我们的数据一起使用的任何体育博彩或交易平台符合您当地法律是您的责任。我们在全球运营，但法律合规是当地事务。",
    section4Title: "可持续使用原则",
    section4Intro: "我们鼓励所有用户以纪律性的方式使用我们的平台：",
    section4Item1Title: "定义您的限制",
    section4Item1Text: "在参与任何外部博彩或交易活动之前，设定时间和资金的个人限制。",
    section4Item2Title: "避免追逐损失",
    section4Item2Text: "损失是任何概率性活动的一部分。追逐损失会导致复合错误。",
    section4Item3Title: "清晰的心态",
    section4Item3Text: "在情绪受损、疲劳或受物质影响时，切勿交易或下注。",
    section4Item4Title: "平衡",
    section4Item4Text: "确保体育分析或交易保持为爱好或次要活动 - 而非稳定收入或健康生活习惯的替代品。",
    section5Title: "识别警告信号",
    section5Intro: "市场投机可能会上瘾。警告信号包括：",
    section5Item1: "超出您的能力范围消费",
    section5Item2: "忽视个人或职业责任",
    section5Item3: "使用借来的钱下注",
    section5Item4: "不交易时感到焦虑、烦躁或沮丧",
    section5Item5: "向朋友或家人隐瞒您的活动",
    section5Outro: "如果其中任何一项适用于您 - 停止。重新评估。寻求支持。",
    section6Title: "获取帮助",
    section6GlobalTitle: "全球支持",
    section6GlobalText: "如果您或您认识的人正在与博彩相关问题作斗争，我们鼓励联系当地支持组织。许多国家提供保密热线和免费咨询服务。",
    section6SelfExclusionTitle: "自我排除",
    section6SelfExclusionText: "如果您需要休息，可以通过 support@oddsflow.ai 联系我们，申请临时暂停您的账户。我们支持您在需要时选择退后一步。",
    product: "产品", liveOdds: "AI表现", popularLeagues: "热门联赛",
    communityFooter: "社区", globalChat: "全球聊天", userPredictions: "用户预测",
    company: "公司", aboutUs: "关于我们", contact: "联系我们", blog: "博客",
    legal: "法律", termsOfService: "服务条款", privacyPolicy: "隐私政策", responsibleGaming: "负责任使用",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩涉及风险。请负责任地博彩。",
    disclaimer: "免责声明：OddsFlow仅为信息和娱乐目的提供AI预测。用户必须年满18岁。",
  },
  "繁體": {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始使用", solution: "解決方案",
    pageTitle: "負責任使用與風險意識",
    pageSubtitle: "在OddsFlow，我們相信知情決策和可持續的分析實踐。",
    ageWarning: "僅限18歲以上",
    section1Title: "我們的立場：數據，而非博彩",
    section1Text: "OddsFlow是一個體育分析平台，而非博彩運營商。我們不接受、下注或促進博彩。我們的角色是提供數據驅動的洞察 - 用戶選擇如何使用這些洞察是他們自己的責任。把我們當作您的分析引擎，而非您的博彩公司。",
    section2Title: "風險管理哲學",
    section2Text: "如果您通過第三方平台將我們的數據用於體育交易或博彩，請像對待任何其他金融活動一樣：永遠不要冒超出您舒適承受範圍的風險，多元化您的方法，並記住即使是最好的數據也無法確定地預測未來。市場本質上是波動的 - 我們的分析提高您的優勢，但不能消除風險。",
    section3Title: "年齡與法律合規",
    section3Subtitle: "僅限18歲以上",
    section3Text: "OddsFlow高級分析工具的訪問權限僅限於18歲及以上的用戶。確保您與我們的數據一起使用的任何體育博彩或交易平台符合您當地法律是您的責任。我們在全球運營，但法律合規是當地事務。",
    section4Title: "可持續使用原則",
    section4Intro: "我們鼓勵所有用戶以紀律性的方式使用我們的平台：",
    section4Item1Title: "定義您的限制",
    section4Item1Text: "在參與任何外部博彩或交易活動之前，設定時間和資金的個人限制。",
    section4Item2Title: "避免追逐損失",
    section4Item2Text: "損失是任何概率性活動的一部分。追逐損失會導致複合錯誤。",
    section4Item3Title: "清晰的心態",
    section4Item3Text: "在情緒受損、疲勞或受物質影響時，切勿交易或下注。",
    section4Item4Title: "平衡",
    section4Item4Text: "確保體育分析或交易保持為愛好或次要活動 - 而非穩定收入或健康生活習慣的替代品。",
    section5Title: "識別警告信號",
    section5Intro: "市場投機可能會上癮。警告信號包括：",
    section5Item1: "超出您的能力範圍消費",
    section5Item2: "忽視個人或職業責任",
    section5Item3: "使用借來的錢下注",
    section5Item4: "不交易時感到焦慮、煩躁或沮喪",
    section5Item5: "向朋友或家人隱瞞您的活動",
    section5Outro: "如果其中任何一項適用於您 - 停止。重新評估。尋求支持。",
    section6Title: "獲取幫助",
    section6GlobalTitle: "全球支持",
    section6GlobalText: "如果您或您認識的人正在與博彩相關問題作鬥爭，我們鼓勵聯繫當地支持組織。許多國家提供保密熱線和免費諮詢服務。",
    section6SelfExclusionTitle: "自我排除",
    section6SelfExclusionText: "如果您需要休息，可以通過 support@oddsflow.ai 聯繫我們，申請臨時暫停您的帳戶。我們支持您在需要時選擇退後一步。",
    product: "產品", liveOdds: "AI表現", popularLeagues: "熱門聯賽",
    communityFooter: "社區", globalChat: "全球聊天", userPredictions: "用戶預測",
    company: "公司", aboutUs: "關於我們", contact: "聯繫我們", blog: "部落格",
    legal: "法律", termsOfService: "服務條款", privacyPolicy: "隱私政策", responsibleGaming: "負責任使用",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩涉及風險。請負責任地博彩。",
    disclaimer: "免責聲明：OddsFlow僅為資訊和娛樂目的提供AI預測。用戶必須年滿18歲。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai", solution: "Solusi",
    pageTitle: "Penggunaan Bertanggung Jawab & Kesadaran Risiko",
    pageSubtitle: "Di OddsFlow, kami percaya pada pengambilan keputusan yang terinformasi dan praktik analitik yang berkelanjutan.",
    ageWarning: "Hanya 18+",
    section1Title: "Posisi Kami: Data, Bukan Taruhan",
    section1Text: "OddsFlow adalah platform analitik olahraga, bukan operator perjudian. Kami tidak menerima, menempatkan, atau memfasilitasi taruhan. Peran kami adalah menyediakan wawasan berbasis data - apa yang pengguna pilih untuk dilakukan dengan wawasan tersebut adalah tanggung jawab mereka sendiri. Anggap kami sebagai mesin analitik Anda, bukan bandar Anda.",
    section2Title: "Filosofi Manajemen Risiko",
    section2Text: "Jika Anda menggunakan data kami untuk perdagangan olahraga atau taruhan melalui platform pihak ketiga, perlakukan seperti aktivitas keuangan lainnya: jangan pernah mengambil risiko lebih dari yang dapat Anda tanggung dengan nyaman, diversifikasi pendekatan Anda, dan ingat bahwa bahkan data terbaik tidak dapat memprediksi masa depan dengan pasti. Pasar secara inheren volatil - analitik kami meningkatkan keunggulan Anda, tetapi tidak menghilangkan risiko.",
    section3Title: "Kepatuhan Usia & Hukum",
    section3Subtitle: "Hanya 18+",
    section3Text: "Akses ke alat analitik premium OddsFlow dibatasi untuk pengguna berusia 18 tahun ke atas. Adalah tanggung jawab Anda untuk memastikan bahwa penggunaan platform taruhan olahraga atau perdagangan bersama dengan data kami mematuhi hukum setempat Anda. Kami beroperasi secara global, tetapi kepatuhan hukum adalah masalah lokal.",
    section4Title: "Prinsip Penggunaan Berkelanjutan",
    section4Intro: "Kami mendorong semua pengguna untuk mendekati platform kami dengan disiplin:",
    section4Item1Title: "Tentukan Batas Anda",
    section4Item1Text: "Tetapkan batasan pribadi untuk waktu dan modal sebelum terlibat dalam aktivitas taruhan atau perdagangan eksternal.",
    section4Item2Title: "Hindari Mengejar Kerugian",
    section4Item2Text: "Kerugian adalah bagian dari setiap aktivitas probabilistik. Mengejar kerugian mengarah pada kesalahan yang bertumpuk.",
    section4Item3Title: "Pikiran Jernih",
    section4Item3Text: "Jangan pernah berdagang atau bertaruh saat emosional terganggu, lelah, atau di bawah pengaruh zat.",
    section4Item4Title: "Keseimbangan",
    section4Item4Text: "Pastikan analitik olahraga atau perdagangan tetap menjadi hobi atau aktivitas sekunder - bukan pengganti pendapatan stabil atau kebiasaan gaya hidup sehat.",
    section5Title: "Mengenali Tanda Bahaya",
    section5Intro: "Spekulasi pasar dapat menjadi adiktif. Tanda-tanda peringatan meliputi:",
    section5Item1: "Menghabiskan di luar kemampuan Anda",
    section5Item2: "Mengabaikan tanggung jawab pribadi atau profesional",
    section5Item3: "Menggunakan uang pinjaman untuk bertaruh",
    section5Item4: "Merasa cemas, mudah marah, atau tertekan saat tidak berdagang",
    section5Item5: "Menyembunyikan aktivitas Anda dari teman atau keluarga",
    section5Outro: "Jika salah satu dari ini berlaku untuk Anda - berhenti. Evaluasi ulang. Cari dukungan.",
    section6Title: "Mendapatkan Bantuan",
    section6GlobalTitle: "Dukungan Global",
    section6GlobalText: "Jika Anda atau seseorang yang Anda kenal berjuang dengan masalah terkait perjudian, kami mendorong untuk menghubungi organisasi dukungan lokal. Banyak negara menawarkan saluran bantuan rahasia dan layanan konseling gratis.",
    section6SelfExclusionTitle: "Pengecualian Diri",
    section6SelfExclusionText: "Jika Anda perlu istirahat, Anda dapat menghubungi kami di support@oddsflow.ai untuk meminta penangguhan sementara akun Anda. Kami mendukung pilihan Anda untuk mundur saat diperlukan.",
    product: "Produk", liveOdds: "Performa AI", popularLeagues: "Liga Populer",
    communityFooter: "Komunitas", globalChat: "Chat Global", userPredictions: "Prediksi Pengguna",
    company: "Perusahaan", aboutUs: "Tentang Kami", contact: "Kontak", blog: "Blog",
    legal: "Legal", termsOfService: "Ketentuan Layanan", privacyPolicy: "Kebijakan Privasi", responsibleGaming: "Penggunaan Bertanggung Jawab",
    allRightsReserved: "Hak cipta dilindungi.",
    gamblingWarning: "Perjudian melibatkan risiko. Silakan berjudi secara bertanggung jawab.",
    disclaimer: "Penafian: OddsFlow menyediakan prediksi berbasis AI hanya untuk tujuan informasi dan hiburan. Pengguna harus berusia 18+ tahun.",
  },
};

export default function ResponsibleGamingPage() {
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
    const currentPath = '/responsible-gaming';
    return targetLocale === 'en' ? currentPath : `/${targetLocale}${currentPath}`;
  };

  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  const helpResources = [
    { name: 'National Council on Problem Gambling (US)', phone: '1-800-522-4700', url: 'https://www.ncpgambling.org' },
    { name: 'GamCare (UK)', phone: '0808 8020 133', url: 'https://www.gamcare.org.uk' },
    { name: 'Gamblers Anonymous', phone: 'Find local meetings', url: 'https://www.gamblersanonymous.org' },
    { name: 'BeGambleAware (UK)', phone: '0808 8020 133', url: 'https://www.begambleaware.org' },
  ];

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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-amber-400 text-sm font-medium">{t('ageWarning')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {t('pageTitle')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('pageSubtitle')}
          </p>
        </div>
      </section>

      {/* Main Content - 6 Sections */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section 1: Our Position: Data, Not Bets */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-emerald-400">{t('section1Title')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{t('section1Text')}</p>
          </div>

          {/* Section 2: The Philosophy of Risk Management */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-cyan-400">{t('section2Title')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{t('section2Text')}</p>
          </div>

          {/* Section 3: Age & Legal Compliance */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <span className="text-sm font-bold text-red-400">18+</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('section3Title')}</h2>
            </div>
            <div className="flex items-start gap-4">
              <p className="text-gray-300 leading-relaxed">{t('section3Text')}</p>
            </div>
          </div>

          {/* Section 4: Principles of Sustainable Usage */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-purple-400">{t('section4Title')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">{t('section4Intro')}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h3 className="font-semibold text-white mb-2">{t('section4Item1Title')}</h3>
                <p className="text-gray-400 text-sm">{t('section4Item1Text')}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h3 className="font-semibold text-white mb-2">{t('section4Item2Title')}</h3>
                <p className="text-gray-400 text-sm">{t('section4Item2Text')}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h3 className="font-semibold text-white mb-2">{t('section4Item3Title')}</h3>
                <p className="text-gray-400 text-sm">{t('section4Item3Text')}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h3 className="font-semibold text-white mb-2">{t('section4Item4Title')}</h3>
                <p className="text-gray-400 text-sm">{t('section4Item4Text')}</p>
              </div>
            </div>
          </div>

          {/* Section 5: Recognizing the Red Flags */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-400">{t('section5Title')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">{t('section5Intro')}</p>
            <ul className="space-y-3 mb-6">
              {[t('section5Item1'), t('section5Item2'), t('section5Item3'), t('section5Item4'), t('section5Item5')].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-amber-400 font-semibold">{t('section5Outro')}</p>
          </div>

          {/* Section 6: Getting Help */}
          <div className="bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-2xl border border-red-500/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('section6Title')}</h2>
            </div>

            {/* Global Support */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">{t('section6GlobalTitle')}</h3>
              <p className="text-gray-300 leading-relaxed mb-6">{t('section6GlobalText')}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {helpResources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 transition-all"
                  >
                    <h4 className="font-semibold text-white mb-1">{resource.name}</h4>
                    <p className="text-emerald-400 text-sm font-medium">{resource.phone}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Self-Exclusion */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">{t('section6SelfExclusionTitle')}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t('section6SelfExclusionText').replace('support@oddsflow.ai', '')}{' '}
                <a href="mailto:support@oddsflow.ai" className="text-emerald-400 hover:underline">support@oddsflow.ai</a>
                {t('section6SelfExclusionText').includes('support@oddsflow.ai') ? '' : '.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2">
              <Link href={localePath('/')} className="flex items-center gap-3 mb-6">
                <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
                <span className="text-xl font-bold">OddsFlow</span>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">{t('disclaimer').substring(0, 150)}...</p>
              <div className="flex items-center gap-4">
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
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
