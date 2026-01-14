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
    pageTitle: "Responsible Gaming",
    pageSubtitle: "At OddsFlow, we are committed to promoting responsible gambling and providing resources to help you stay in control.",
    ageWarning: "18+ Only",
    // Content sections
    ourCommitment: "Our Commitment",
    ourCommitmentText1: "OddsFlow provides AI-powered sports predictions for informational and entertainment purposes only. We are committed to promoting responsible gambling practices and ensuring our users can enjoy our platform safely.",
    ourCommitmentText2: "Gambling should be fun and entertaining, not a way to make money or solve financial problems. We encourage all our users to gamble responsibly and within their means.",
    ageVerification: "Age Verification",
    ageVerificationText: "You must be at least 18 years old (or the legal gambling age in your jurisdiction) to use OddsFlow. We strictly prohibit underage gambling and take measures to prevent minors from accessing our services.",
    warningSigns: "Warning Signs of Problem Gambling",
    warningSignsText: "If you or someone you know exhibits any of these signs, it may indicate a gambling problem:",
    warningSign1: "Spending more money or time gambling than you can afford",
    warningSign2: "Chasing losses or gambling to try to win back money",
    warningSign3: "Neglecting work, family, or other responsibilities due to gambling",
    warningSign4: "Borrowing money or selling possessions to gamble",
    warningSign5: "Feeling anxious, depressed, or irritable when not gambling",
    warningSign6: "Lying to family or friends about gambling habits",
    warningSign7: "Being unable to stop or reduce gambling despite wanting to",
    warningSign8: "Gambling to escape problems or relieve negative feelings",
    tipsTitle: "Tips for Responsible Gambling",
    tip1Title: "Set a Budget", tip1Text: "Only gamble with money you can afford to lose. Set a budget before you start and stick to it.",
    tip2Title: "Set Time Limits", tip2Text: "Decide how much time you will spend gambling and stick to it. Take regular breaks.",
    tip3Title: "Never Chase Losses", tip3Text: "Accept that losing is part of gambling. Never try to win back money you have lost.",
    tip4Title: "Balance Your Life", tip4Text: "Gambling should be just one of many leisure activities, not your only source of entertainment.",
    tip5Title: "Avoid Alcohol", tip5Text: "Avoid gambling when under the influence of alcohol or drugs, as it impairs judgment.",
    tip6Title: "Know the Odds", tip6Text: "Understand that the odds are always in favor of the house. Gambling is not a reliable way to make money.",
    getHelp: "Get Help",
    getHelpText: "If you or someone you know has a gambling problem, please reach out to these resources for help:",
    selfExclusion: "Self-Exclusion",
    selfExclusionText1: "If you need to take a break from gambling, you can request self-exclusion from your account. Contact us at",
    selfExclusionText2: "to request self-exclusion for a period of your choosing.",
    selfExclusionText3: "During the self-exclusion period, you will not be able to access your account or use our prediction services.",
    // Footer
    product: "Product", liveOdds: "AI Performance", popularLeagues: "Popular Leagues",
    communityFooter: "Community", globalChat: "Global Chat", userPredictions: "User Predictions",
    company: "Company", aboutUs: "About Us", contact: "Contact", blog: "Blog",
    legal: "Legal", termsOfService: "Terms of Service", privacyPolicy: "Privacy Policy", responsibleGaming: "Responsible Gaming",
    allRightsReserved: "All rights reserved.",
    gamblingWarning: "Gambling involves risk. Please gamble responsibly.",
    disclaimer: "Disclaimer: OddsFlow provides AI-powered predictions for informational and entertainment purposes only. We do not guarantee the accuracy of predictions and are not responsible for any financial losses. Gambling involves risk. Please gamble responsibly. If you or someone you know has a gambling problem, please seek help. Users must be 18+ years old.",
  },
  ES: {
    home: "Inicio", predictions: "Predicciones", leagues: "Ligas", performance: "Rendimiento IA",
    community: "Comunidad", news: "Noticias", pricing: "Precios", login: "Iniciar Sesion", getStarted: "Comenzar", solution: "Solucion",
    pageTitle: "Juego Responsable",
    pageSubtitle: "En OddsFlow, estamos comprometidos con promover el juego responsable y proporcionar recursos para ayudarle a mantener el control.",
    ageWarning: "Solo mayores de 18",
    ourCommitment: "Nuestro Compromiso",
    ourCommitmentText1: "OddsFlow proporciona predicciones deportivas impulsadas por IA solo con fines informativos y de entretenimiento. Estamos comprometidos con promover practicas de juego responsable.",
    ourCommitmentText2: "El juego debe ser divertido y entretenido, no una forma de ganar dinero o resolver problemas financieros. Animamos a todos nuestros usuarios a jugar responsablemente.",
    ageVerification: "Verificacion de Edad",
    ageVerificationText: "Debe tener al menos 18 anos para usar OddsFlow. Prohibimos estrictamente el juego de menores de edad.",
    warningSigns: "Senales de Advertencia del Juego Problematico",
    warningSignsText: "Si usted o alguien que conoce exhibe alguna de estas senales, puede indicar un problema de juego:",
    warningSign1: "Gastar mas dinero o tiempo jugando de lo que puede permitirse",
    warningSign2: "Perseguir perdidas o apostar para intentar recuperar dinero",
    warningSign3: "Descuidar el trabajo, la familia u otras responsabilidades debido al juego",
    warningSign4: "Pedir dinero prestado o vender posesiones para jugar",
    warningSign5: "Sentirse ansioso, deprimido o irritable cuando no esta jugando",
    warningSign6: "Mentir a familiares o amigos sobre habitos de juego",
    warningSign7: "No poder dejar o reducir el juego a pesar de querer hacerlo",
    warningSign8: "Jugar para escapar de problemas o aliviar sentimientos negativos",
    tipsTitle: "Consejos para el Juego Responsable",
    tip1Title: "Establezca un Presupuesto", tip1Text: "Solo juegue con dinero que pueda permitirse perder.",
    tip2Title: "Establezca Limites de Tiempo", tip2Text: "Decida cuanto tiempo pasara jugando y cumpla con ello.",
    tip3Title: "Nunca Persiga Perdidas", tip3Text: "Acepte que perder es parte del juego. Nunca intente recuperar dinero perdido.",
    tip4Title: "Equilibre su Vida", tip4Text: "El juego debe ser solo una de muchas actividades de ocio.",
    tip5Title: "Evite el Alcohol", tip5Text: "Evite jugar bajo la influencia del alcohol o drogas.",
    tip6Title: "Conozca las Probabilidades", tip6Text: "Entienda que las probabilidades siempre favorecen a la casa.",
    getHelp: "Obtenga Ayuda",
    getHelpText: "Si usted o alguien que conoce tiene un problema de juego, contacte estos recursos:",
    selfExclusion: "Autoexclusion",
    selfExclusionText1: "Si necesita tomar un descanso del juego, puede solicitar la autoexclusion de su cuenta. Contactenos en",
    selfExclusionText2: "para solicitar la autoexclusion por el periodo que elija.",
    selfExclusionText3: "Durante el periodo de autoexclusion, no podra acceder a su cuenta ni usar nuestros servicios.",
    product: "Producto", liveOdds: "Rendimiento IA", popularLeagues: "Ligas Populares",
    communityFooter: "Comunidad", globalChat: "Chat Global", userPredictions: "Predicciones de Usuarios",
    company: "Empresa", aboutUs: "Sobre Nosotros", contact: "Contacto", blog: "Blog",
    legal: "Legal", termsOfService: "Terminos de Servicio", privacyPolicy: "Politica de Privacidad", responsibleGaming: "Juego Responsable",
    allRightsReserved: "Todos los derechos reservados.",
    gamblingWarning: "El juego implica riesgo. Por favor juegue responsablemente.",
    disclaimer: "Aviso: OddsFlow proporciona predicciones impulsadas por IA solo con fines informativos y de entretenimiento. No garantizamos la precision de las predicciones. El juego implica riesgo. Los usuarios deben tener mas de 18 anos.",
  },
  PT: {
    home: "Inicio", predictions: "Previsoes", leagues: "Ligas", performance: "Desempenho IA",
    community: "Comunidade", news: "Noticias", pricing: "Precos", login: "Entrar", getStarted: "Comecar", solution: "Solucao",
    pageTitle: "Jogo Responsavel",
    pageSubtitle: "Na OddsFlow, estamos comprometidos em promover o jogo responsavel e fornecer recursos para ajuda-lo a manter o controle.",
    ageWarning: "Apenas maiores de 18",
    ourCommitment: "Nosso Compromisso",
    ourCommitmentText1: "A OddsFlow fornece previsoes esportivas baseadas em IA apenas para fins informativos e de entretenimento. Estamos comprometidos em promover praticas de jogo responsavel.",
    ourCommitmentText2: "Apostar deve ser divertido e entretenido, nao uma forma de ganhar dinheiro ou resolver problemas financeiros.",
    ageVerification: "Verificacao de Idade",
    ageVerificationText: "Voce deve ter pelo menos 18 anos para usar a OddsFlow. Proibimos estritamente jogos de azar para menores.",
    warningSigns: "Sinais de Alerta do Jogo Problematico",
    warningSignsText: "Se voce ou alguem que conhece exibe algum destes sinais, pode indicar um problema de jogo:",
    warningSign1: "Gastar mais dinheiro ou tempo jogando do que pode pagar",
    warningSign2: "Perseguir perdas ou apostar para tentar recuperar dinheiro",
    warningSign3: "Negligenciar trabalho, familia ou outras responsabilidades devido ao jogo",
    warningSign4: "Pedir dinheiro emprestado ou vender pertences para jogar",
    warningSign5: "Sentir-se ansioso, deprimido ou irritado quando nao esta jogando",
    warningSign6: "Mentir para familiares ou amigos sobre habitos de jogo",
    warningSign7: "Nao conseguir parar ou reduzir o jogo apesar de querer",
    warningSign8: "Jogar para escapar de problemas ou aliviar sentimentos negativos",
    tipsTitle: "Dicas para Jogo Responsavel",
    tip1Title: "Defina um Orcamento", tip1Text: "Aposte apenas com dinheiro que pode perder.",
    tip2Title: "Defina Limites de Tempo", tip2Text: "Decida quanto tempo passara jogando e cumpra.",
    tip3Title: "Nunca Persiga Perdas", tip3Text: "Aceite que perder faz parte do jogo.",
    tip4Title: "Equilibre sua Vida", tip4Text: "O jogo deve ser apenas uma das muitas atividades de lazer.",
    tip5Title: "Evite Alcool", tip5Text: "Evite jogar sob influencia de alcool ou drogas.",
    tip6Title: "Conheca as Probabilidades", tip6Text: "Entenda que as probabilidades sempre favorecem a casa.",
    getHelp: "Obtenha Ajuda",
    getHelpText: "Se voce ou alguem que conhece tem um problema de jogo, entre em contato com estes recursos:",
    selfExclusion: "Autoexclusao",
    selfExclusionText1: "Se precisar de uma pausa do jogo, pode solicitar autoexclusao. Entre em contato conosco em",
    selfExclusionText2: "para solicitar autoexclusao pelo periodo desejado.",
    selfExclusionText3: "Durante o periodo de autoexclusao, voce nao podera acessar sua conta.",
    product: "Produto", liveOdds: "Desempenho IA", popularLeagues: "Ligas Populares",
    communityFooter: "Comunidade", globalChat: "Chat Global", userPredictions: "Previsoes de Usuarios",
    company: "Empresa", aboutUs: "Sobre Nos", contact: "Contato", blog: "Blog",
    legal: "Legal", termsOfService: "Termos de Servico", privacyPolicy: "Politica de Privacidade", responsibleGaming: "Jogo Responsavel",
    allRightsReserved: "Todos os direitos reservados.",
    gamblingWarning: "Apostas envolvem risco. Por favor aposte com responsabilidade.",
    disclaimer: "Aviso: OddsFlow fornece previsoes baseadas em IA apenas para fins informativos. Nao garantimos a precisao das previsoes. Usuarios devem ter mais de 18 anos.",
  },
  DE: {
    home: "Startseite", predictions: "Vorhersagen", leagues: "Ligen", performance: "KI-Leistung",
    community: "Community", news: "Nachrichten", pricing: "Preise", login: "Anmelden", getStarted: "Loslegen", solution: "Losung",
    pageTitle: "Verantwortungsvolles Spielen",
    pageSubtitle: "Bei OddsFlow sind wir verpflichtet, verantwortungsvolles Spielen zu fordern und Ressourcen bereitzustellen.",
    ageWarning: "Nur ab 18",
    ourCommitment: "Unser Engagement",
    ourCommitmentText1: "OddsFlow bietet KI-gestutzte Sportvorhersagen nur zu Informations- und Unterhaltungszwecken.",
    ourCommitmentText2: "Glucksspiel sollte Spass machen, keine Moglichkeit Geld zu verdienen oder finanzielle Probleme zu losen.",
    ageVerification: "Altersverifikation",
    ageVerificationText: "Sie mussen mindestens 18 Jahre alt sein, um OddsFlow zu nutzen.",
    warningSigns: "Warnzeichen fur problematisches Spielen",
    warningSignsText: "Wenn Sie oder jemand, den Sie kennen, diese Anzeichen zeigt, kann dies auf ein Spielproblem hinweisen:",
    warningSign1: "Mehr Geld oder Zeit beim Spielen ausgeben als Sie sich leisten konnen",
    warningSign2: "Verlusten nachjagen oder spielen, um Geld zuruckzugewinnen",
    warningSign3: "Arbeit, Familie oder andere Verantwortlichkeiten vernachlassigen",
    warningSign4: "Geld leihen oder Besitz verkaufen, um zu spielen",
    warningSign5: "Angstlich, deprimiert oder gereizt sein, wenn nicht gespielt wird",
    warningSign6: "Familie oder Freunde uber Spielgewohnheiten belgen",
    warningSign7: "Nicht aufhoren oder reduzieren konnen, obwohl man es mochte",
    warningSign8: "Spielen, um Problemen zu entkommen oder negative Gefuhle zu lindern",
    tipsTitle: "Tipps fur verantwortungsvolles Spielen",
    tip1Title: "Budget festlegen", tip1Text: "Spielen Sie nur mit Geld, das Sie verlieren konnen.",
    tip2Title: "Zeitlimits setzen", tip2Text: "Entscheiden Sie, wie viel Zeit Sie spielen werden.",
    tip3Title: "Nie Verlusten nachjagen", tip3Text: "Akzeptieren Sie, dass Verlieren Teil des Spielens ist.",
    tip4Title: "Leben ausbalancieren", tip4Text: "Glucksspiel sollte nur eine von vielen Freizeitaktivitaten sein.",
    tip5Title: "Alkohol vermeiden", tip5Text: "Vermeiden Sie das Spielen unter Einfluss von Alkohol oder Drogen.",
    tip6Title: "Quoten kennen", tip6Text: "Verstehen Sie, dass die Quoten immer das Haus begunstigen.",
    getHelp: "Hilfe holen",
    getHelpText: "Wenn Sie oder jemand, den Sie kennen, ein Spielproblem hat, wenden Sie sich an diese Ressourcen:",
    selfExclusion: "Selbstausschluss",
    selfExclusionText1: "Wenn Sie eine Pause vom Spielen benotigen, konnen Sie einen Selbstausschluss beantragen. Kontaktieren Sie uns unter",
    selfExclusionText2: "um einen Selbstausschluss fur einen Zeitraum Ihrer Wahl zu beantragen.",
    selfExclusionText3: "Wahrend des Selbstausschlusszeitraums konnen Sie nicht auf Ihr Konto zugreifen.",
    product: "Produkt", liveOdds: "KI-Leistung", popularLeagues: "Beliebte Ligen",
    communityFooter: "Community", globalChat: "Globaler Chat", userPredictions: "Benutzer-Vorhersagen",
    company: "Unternehmen", aboutUs: "Uber uns", contact: "Kontakt", blog: "Blog",
    legal: "Rechtliches", termsOfService: "Nutzungsbedingungen", privacyPolicy: "Datenschutz", responsibleGaming: "Verantwortungsvolles Spielen",
    allRightsReserved: "Alle Rechte vorbehalten.",
    gamblingWarning: "Glucksspiel birgt Risiken. Bitte spielen Sie verantwortungsvoll.",
    disclaimer: "Haftungsausschluss: OddsFlow bietet KI-gestutzte Vorhersagen nur zu Informations- und Unterhaltungszwecken. Benutzer mussen 18+ Jahre alt sein.",
  },
  FR: {
    home: "Accueil", predictions: "Predictions", leagues: "Ligues", performance: "Performance IA",
    community: "Communaute", news: "Actualites", pricing: "Tarifs", login: "Connexion", getStarted: "Commencer", solution: "Solution",
    pageTitle: "Jeu Responsable",
    pageSubtitle: "Chez OddsFlow, nous nous engageons a promouvoir le jeu responsable et a fournir des ressources pour vous aider a garder le controle.",
    ageWarning: "18+ uniquement",
    ourCommitment: "Notre Engagement",
    ourCommitmentText1: "OddsFlow fournit des predictions sportives basees sur l'IA uniquement a des fins d'information et de divertissement.",
    ourCommitmentText2: "Les jeux d'argent doivent etre amusants et divertissants, pas un moyen de gagner de l'argent ou de resoudre des problemes financiers.",
    ageVerification: "Verification de l'Age",
    ageVerificationText: "Vous devez avoir au moins 18 ans pour utiliser OddsFlow.",
    warningSigns: "Signes d'Alerte du Jeu Problematique",
    warningSignsText: "Si vous ou quelqu'un que vous connaissez presente l'un de ces signes, cela peut indiquer un probleme de jeu:",
    warningSign1: "Depenser plus d'argent ou de temps a jouer que vous ne pouvez vous le permettre",
    warningSign2: "Poursuivre les pertes ou jouer pour tenter de recuperer de l'argent",
    warningSign3: "Negliger le travail, la famille ou d'autres responsabilites a cause du jeu",
    warningSign4: "Emprunter de l'argent ou vendre des biens pour jouer",
    warningSign5: "Se sentir anxieux, deprime ou irritable quand on ne joue pas",
    warningSign6: "Mentir a la famille ou aux amis sur les habitudes de jeu",
    warningSign7: "Etre incapable d'arreter ou de reduire le jeu malgre le desir",
    warningSign8: "Jouer pour echapper aux problemes ou soulager les sentiments negatifs",
    tipsTitle: "Conseils pour un Jeu Responsable",
    tip1Title: "Fixez un Budget", tip1Text: "Ne jouez qu'avec de l'argent que vous pouvez vous permettre de perdre.",
    tip2Title: "Fixez des Limites de Temps", tip2Text: "Decidez combien de temps vous passerez a jouer.",
    tip3Title: "Ne Poursuivez Jamais les Pertes", tip3Text: "Acceptez que perdre fait partie du jeu.",
    tip4Title: "Equilibrez Votre Vie", tip4Text: "Le jeu ne devrait etre qu'une activite de loisir parmi d'autres.",
    tip5Title: "Evitez l'Alcool", tip5Text: "Evitez de jouer sous l'influence de l'alcool ou de drogues.",
    tip6Title: "Connaissez les Cotes", tip6Text: "Comprenez que les cotes favorisent toujours la maison.",
    getHelp: "Obtenir de l'Aide",
    getHelpText: "Si vous ou quelqu'un que vous connaissez a un probleme de jeu, contactez ces ressources:",
    selfExclusion: "Auto-exclusion",
    selfExclusionText1: "Si vous avez besoin de faire une pause, vous pouvez demander une auto-exclusion. Contactez-nous a",
    selfExclusionText2: "pour demander une auto-exclusion pour la periode de votre choix.",
    selfExclusionText3: "Pendant la periode d'auto-exclusion, vous ne pourrez pas acceder a votre compte.",
    product: "Produit", liveOdds: "Performance IA", popularLeagues: "Ligues Populaires",
    communityFooter: "Communaute", globalChat: "Chat Global", userPredictions: "Predictions Utilisateurs",
    company: "Entreprise", aboutUs: "A Propos", contact: "Contact", blog: "Blog",
    legal: "Legal", termsOfService: "Conditions d'Utilisation", privacyPolicy: "Politique de Confidentialite", responsibleGaming: "Jeu Responsable",
    allRightsReserved: "Tous droits reserves.",
    gamblingWarning: "Les jeux d'argent comportent des risques. Jouez de maniere responsable.",
    disclaimer: "Avertissement: OddsFlow fournit des predictions basees sur l'IA uniquement a des fins d'information et de divertissement. Les utilisateurs doivent avoir 18+ ans.",
  },
  JA: {
    home: "ホーム", predictions: "予測", leagues: "リーグ", performance: "AIパフォーマンス",
    community: "コミュニティ", news: "ニュース", pricing: "料金", login: "ログイン", getStarted: "始める", solution: "ソリューション",
    pageTitle: "責任あるギャンブル",
    pageSubtitle: "OddsFlowでは、責任あるギャンブルを促進し、コントロールを維持するためのリソースを提供することに取り組んでいます。",
    ageWarning: "18歳以上限定",
    ourCommitment: "私たちの取り組み",
    ourCommitmentText1: "OddsFlowは、情報および娯楽目的でのみAIによるスポーツ予測を提供しています。",
    ourCommitmentText2: "ギャンブルは楽しく娯楽であるべきで、お金を稼いだり金銭的な問題を解決する方法ではありません。",
    ageVerification: "年齢確認",
    ageVerificationText: "OddsFlowを使用するには18歳以上である必要があります。",
    warningSigns: "問題ギャンブルの警告サイン",
    warningSignsText: "あなたや知り合いがこれらの兆候を示している場合、ギャンブル問題を示唆している可能性があります：",
    warningSign1: "余裕がある以上のお金や時間をギャンブルに費やす",
    warningSign2: "損失を追いかけたり、お金を取り戻そうとギャンブルする",
    warningSign3: "ギャンブルのために仕事、家族、その他の責任を怠る",
    warningSign4: "ギャンブルのためにお金を借りたり所持品を売る",
    warningSign5: "ギャンブルしていないときに不安、落ち込み、イライラを感じる",
    warningSign6: "ギャンブル習慣について家族や友人に嘘をつく",
    warningSign7: "やめたいと思っているのにギャンブルをやめられない",
    warningSign8: "問題から逃げたりネガティブな感情を和らげるためにギャンブルする",
    tipsTitle: "責任あるギャンブルのヒント",
    tip1Title: "予算を設定する", tip1Text: "失っても良いお金だけでギャンブルしてください。",
    tip2Title: "時間制限を設定する", tip2Text: "ギャンブルに費やす時間を決めて守りましょう。",
    tip3Title: "損失を追いかけない", tip3Text: "負けることはギャンブルの一部であることを受け入れましょう。",
    tip4Title: "生活のバランスを取る", tip4Text: "ギャンブルは多くのレジャー活動の一つであるべきです。",
    tip5Title: "アルコールを避ける", tip5Text: "アルコールや薬物の影響下でギャンブルしないでください。",
    tip6Title: "オッズを知る", tip6Text: "オッズは常にハウスに有利であることを理解してください。",
    getHelp: "助けを求める",
    getHelpText: "あなたや知り合いにギャンブル問題がある場合、これらのリソースに連絡してください：",
    selfExclusion: "自己排除",
    selfExclusionText1: "ギャンブルから休憩が必要な場合、自己排除をリクエストできます。",
    selfExclusionText2: "にご連絡いただき、ご希望の期間の自己排除をリクエストしてください。",
    selfExclusionText3: "自己排除期間中は、アカウントにアクセスできません。",
    product: "製品", liveOdds: "AIパフォーマンス", popularLeagues: "人気リーグ",
    communityFooter: "コミュニティ", globalChat: "グローバルチャット", userPredictions: "ユーザー予測",
    company: "会社", aboutUs: "会社概要", contact: "お問い合わせ", blog: "ブログ",
    legal: "法的情報", termsOfService: "利用規約", privacyPolicy: "プライバシーポリシー", responsibleGaming: "責任あるギャンブル",
    allRightsReserved: "全著作権所有。",
    gamblingWarning: "ギャンブルにはリスクが伴います。責任を持ってギャンブルしてください。",
    disclaimer: "免責事項：OddsFlowは情報および娯楽目的でのみAI予測を提供しています。ユーザーは18歳以上である必要があります。",
  },
  KO: {
    home: "홈", predictions: "예측", leagues: "리그", performance: "AI 성과",
    community: "커뮤니티", news: "뉴스", pricing: "가격", login: "로그인", getStarted: "시작하기", solution: "솔루션",
    pageTitle: "책임감 있는 게임",
    pageSubtitle: "OddsFlow에서는 책임감 있는 도박을 촉진하고 통제력을 유지하는 데 도움이 되는 리소스를 제공하기 위해 노력하고 있습니다.",
    ageWarning: "18세 이상만",
    ourCommitment: "우리의 약속",
    ourCommitmentText1: "OddsFlow는 정보 및 오락 목적으로만 AI 기반 스포츠 예측을 제공합니다.",
    ourCommitmentText2: "도박은 재미있고 오락적이어야 하며, 돈을 벌거나 재정 문제를 해결하는 방법이 아닙니다.",
    ageVerification: "연령 확인",
    ageVerificationText: "OddsFlow를 사용하려면 최소 18세 이상이어야 합니다.",
    warningSigns: "문제 도박의 경고 신호",
    warningSignsText: "귀하 또는 아는 사람이 이러한 징후를 보이면 도박 문제를 나타낼 수 있습니다:",
    warningSign1: "감당할 수 있는 것보다 더 많은 돈이나 시간을 도박에 소비",
    warningSign2: "손실을 쫓거나 돈을 되찾기 위해 도박",
    warningSign3: "도박으로 인해 일, 가족 또는 기타 책임을 소홀히 함",
    warningSign4: "도박을 위해 돈을 빌리거나 소지품을 판매",
    warningSign5: "도박하지 않을 때 불안하거나 우울하거나 짜증을 느낌",
    warningSign6: "도박 습관에 대해 가족이나 친구에게 거짓말",
    warningSign7: "그만두고 싶어도 도박을 중단하거나 줄일 수 없음",
    warningSign8: "문제를 피하거나 부정적인 감정을 해소하기 위해 도박",
    tipsTitle: "책임감 있는 도박을 위한 팁",
    tip1Title: "예산 설정", tip1Text: "잃어도 괜찮은 돈으로만 도박하세요.",
    tip2Title: "시간 제한 설정", tip2Text: "도박에 소요할 시간을 정하고 지키세요.",
    tip3Title: "손실을 쫓지 마세요", tip3Text: "지는 것이 도박의 일부임을 받아들이세요.",
    tip4Title: "삶의 균형 유지", tip4Text: "도박은 여러 여가 활동 중 하나일 뿐이어야 합니다.",
    tip5Title: "음주 피하기", tip5Text: "알코올이나 약물의 영향을 받은 상태에서 도박하지 마세요.",
    tip6Title: "확률 알기", tip6Text: "확률은 항상 하우스에 유리하다는 것을 이해하세요.",
    getHelp: "도움 받기",
    getHelpText: "귀하 또는 아는 사람에게 도박 문제가 있다면 다음 리소스에 연락하세요:",
    selfExclusion: "자기 배제",
    selfExclusionText1: "도박에서 휴식이 필요하면 자기 배제를 요청할 수 있습니다.",
    selfExclusionText2: "로 연락하여 원하는 기간 동안 자기 배제를 요청하세요.",
    selfExclusionText3: "자기 배제 기간 동안 계정에 액세스할 수 없습니다.",
    product: "제품", liveOdds: "AI 성과", popularLeagues: "인기 리그",
    communityFooter: "커뮤니티", globalChat: "글로벌 채팅", userPredictions: "사용자 예측",
    company: "회사", aboutUs: "회사 소개", contact: "연락처", blog: "블로그",
    legal: "법적 정보", termsOfService: "서비스 약관", privacyPolicy: "개인정보 보호정책", responsibleGaming: "책임감 있는 게임",
    allRightsReserved: "모든 권리 보유.",
    gamblingWarning: "도박에는 위험이 따릅니다. 책임감 있게 도박하세요.",
    disclaimer: "면책 조항: OddsFlow는 정보 및 오락 목적으로만 AI 예측을 제공합니다. 사용자는 18세 이상이어야 합니다.",
  },
  "中文": {
    home: "首页", predictions: "预测", leagues: "联赛", performance: "AI表现",
    community: "社区", news: "新闻", pricing: "价格", login: "登录", getStarted: "开始使用", solution: "解决方案",
    pageTitle: "负责任博彩",
    pageSubtitle: "在OddsFlow，我们致力于推广负责任的博彩行为，并提供资源帮助您保持控制。",
    ageWarning: "仅限18岁以上",
    ourCommitment: "我们的承诺",
    ourCommitmentText1: "OddsFlow仅为信息和娱乐目的提供AI驱动的体育预测。我们致力于推广负责任的博彩行为。",
    ourCommitmentText2: "博彩应该是有趣的娱乐活动，而不是赚钱或解决财务问题的方式。",
    ageVerification: "年龄验证",
    ageVerificationText: "您必须年满18岁才能使用OddsFlow。我们严禁未成年人博彩。",
    warningSigns: "问题博彩的警告信号",
    warningSignsText: "如果您或您认识的人表现出以下任何迹象，可能表明存在博彩问题：",
    warningSign1: "花费超出承受能力的金钱或时间进行博彩",
    warningSign2: "追逐损失或试图通过博彩赢回金钱",
    warningSign3: "因博彩而忽视工作、家庭或其他责任",
    warningSign4: "借钱或出售物品来进行博彩",
    warningSign5: "不博彩时感到焦虑、沮丧或烦躁",
    warningSign6: "对家人或朋友隐瞒博彩习惯",
    warningSign7: "尽管想停止但无法停止或减少博彩",
    warningSign8: "通过博彩来逃避问题或缓解负面情绪",
    tipsTitle: "负责任博彩的建议",
    tip1Title: "设定预算", tip1Text: "只用您能承受损失的钱进行博彩。",
    tip2Title: "设定时间限制", tip2Text: "决定您将花多少时间博彩并坚持执行。",
    tip3Title: "永不追逐损失", tip3Text: "接受输钱是博彩的一部分。",
    tip4Title: "平衡生活", tip4Text: "博彩应该只是众多休闲活动之一。",
    tip5Title: "避免饮酒", tip5Text: "在酒精或药物影响下避免博彩。",
    tip6Title: "了解赔率", tip6Text: "理解赔率总是有利于庄家的。",
    getHelp: "获取帮助",
    getHelpText: "如果您或您认识的人有博彩问题，请联系以下资源寻求帮助：",
    selfExclusion: "自我排除",
    selfExclusionText1: "如果您需要休息，可以申请自我排除。请通过以下方式联系我们",
    selfExclusionText2: "申请您选择的自我排除期限。",
    selfExclusionText3: "在自我排除期间，您将无法访问您的账户。",
    product: "产品", liveOdds: "AI表现", popularLeagues: "热门联赛",
    communityFooter: "社区", globalChat: "全球聊天", userPredictions: "用户预测",
    company: "公司", aboutUs: "关于我们", contact: "联系我们", blog: "博客",
    legal: "法律", termsOfService: "服务条款", privacyPolicy: "隐私政策", responsibleGaming: "负责任博彩",
    allRightsReserved: "版权所有。",
    gamblingWarning: "博彩涉及风险。请负责任地博彩。",
    disclaimer: "免责声明：OddsFlow仅为信息和娱乐目的提供AI预测。用户必须年满18岁。",
  },
  "繁體": {
    home: "首頁", predictions: "預測", leagues: "聯賽", performance: "AI表現",
    community: "社區", news: "新聞", pricing: "價格", login: "登入", getStarted: "開始使用", solution: "解決方案",
    pageTitle: "負責任博彩",
    pageSubtitle: "在OddsFlow，我們致力於推廣負責任的博彩行為，並提供資源幫助您保持控制。",
    ageWarning: "僅限18歲以上",
    ourCommitment: "我們的承諾",
    ourCommitmentText1: "OddsFlow僅為資訊和娛樂目的提供AI驅動的體育預測。我們致力於推廣負責任的博彩行為。",
    ourCommitmentText2: "博彩應該是有趣的娛樂活動，而不是賺錢或解決財務問題的方式。",
    ageVerification: "年齡驗證",
    ageVerificationText: "您必須年滿18歲才能使用OddsFlow。我們嚴禁未成年人博彩。",
    warningSigns: "問題博彩的警告信號",
    warningSignsText: "如果您或您認識的人表現出以下任何跡象，可能表明存在博彩問題：",
    warningSign1: "花費超出承受能力的金錢或時間進行博彩",
    warningSign2: "追逐損失或試圖通過博彩贏回金錢",
    warningSign3: "因博彩而忽視工作、家庭或其他責任",
    warningSign4: "借錢或出售物品來進行博彩",
    warningSign5: "不博彩時感到焦慮、沮喪或煩躁",
    warningSign6: "對家人或朋友隱瞞博彩習慣",
    warningSign7: "儘管想停止但無法停止或減少博彩",
    warningSign8: "通過博彩來逃避問題或緩解負面情緒",
    tipsTitle: "負責任博彩的建議",
    tip1Title: "設定預算", tip1Text: "只用您能承受損失的錢進行博彩。",
    tip2Title: "設定時間限制", tip2Text: "決定您將花多少時間博彩並堅持執行。",
    tip3Title: "永不追逐損失", tip3Text: "接受輸錢是博彩的一部分。",
    tip4Title: "平衡生活", tip4Text: "博彩應該只是眾多休閒活動之一。",
    tip5Title: "避免飲酒", tip5Text: "在酒精或藥物影響下避免博彩。",
    tip6Title: "了解賠率", tip6Text: "理解賠率總是有利於莊家的。",
    getHelp: "獲取幫助",
    getHelpText: "如果您或您認識的人有博彩問題，請聯繫以下資源尋求幫助：",
    selfExclusion: "自我排除",
    selfExclusionText1: "如果您需要休息，可以申請自我排除。請通過以下方式聯繫我們",
    selfExclusionText2: "申請您選擇的自我排除期限。",
    selfExclusionText3: "在自我排除期間，您將無法訪問您的帳戶。",
    product: "產品", liveOdds: "AI表現", popularLeagues: "熱門聯賽",
    communityFooter: "社區", globalChat: "全球聊天", userPredictions: "用戶預測",
    company: "公司", aboutUs: "關於我們", contact: "聯繫我們", blog: "部落格",
    legal: "法律", termsOfService: "服務條款", privacyPolicy: "隱私政策", responsibleGaming: "負責任博彩",
    allRightsReserved: "版權所有。",
    gamblingWarning: "博彩涉及風險。請負責任地博彩。",
    disclaimer: "免責聲明：OddsFlow僅為資訊和娛樂目的提供AI預測。用戶必須年滿18歲。",
  },
  ID: {
    home: "Beranda", predictions: "Prediksi", leagues: "Liga", performance: "Performa AI",
    community: "Komunitas", news: "Berita", pricing: "Harga", login: "Masuk", getStarted: "Mulai", solution: "Solusi",
    pageTitle: "Perjudian Bertanggung Jawab",
    pageSubtitle: "Di OddsFlow, kami berkomitmen untuk mempromosikan perjudian yang bertanggung jawab dan menyediakan sumber daya untuk membantu Anda tetap terkendali.",
    ageWarning: "Hanya 18+",
    ourCommitment: "Komitmen Kami",
    ourCommitmentText1: "OddsFlow menyediakan prediksi olahraga berbasis AI hanya untuk tujuan informasi dan hiburan.",
    ourCommitmentText2: "Perjudian harus menyenangkan dan menghibur, bukan cara untuk menghasilkan uang atau menyelesaikan masalah keuangan.",
    ageVerification: "Verifikasi Usia",
    ageVerificationText: "Anda harus berusia minimal 18 tahun untuk menggunakan OddsFlow.",
    warningSigns: "Tanda-tanda Peringatan Masalah Perjudian",
    warningSignsText: "Jika Anda atau seseorang yang Anda kenal menunjukkan tanda-tanda ini, mungkin menunjukkan masalah perjudian:",
    warningSign1: "Menghabiskan lebih banyak uang atau waktu untuk berjudi daripada yang mampu",
    warningSign2: "Mengejar kerugian atau berjudi untuk mencoba memenangkan kembali uang",
    warningSign3: "Mengabaikan pekerjaan, keluarga, atau tanggung jawab lain karena perjudian",
    warningSign4: "Meminjam uang atau menjual barang untuk berjudi",
    warningSign5: "Merasa cemas, tertekan, atau mudah marah saat tidak berjudi",
    warningSign6: "Berbohong kepada keluarga atau teman tentang kebiasaan berjudi",
    warningSign7: "Tidak dapat berhenti atau mengurangi perjudian meskipun ingin",
    warningSign8: "Berjudi untuk melarikan diri dari masalah atau meredakan perasaan negatif",
    tipsTitle: "Tips untuk Perjudian Bertanggung Jawab",
    tip1Title: "Tetapkan Anggaran", tip1Text: "Hanya berjudi dengan uang yang mampu Anda kehilangan.",
    tip2Title: "Tetapkan Batas Waktu", tip2Text: "Putuskan berapa lama Anda akan berjudi dan patuhi.",
    tip3Title: "Jangan Pernah Mengejar Kerugian", tip3Text: "Terima bahwa kalah adalah bagian dari perjudian.",
    tip4Title: "Seimbangkan Hidup Anda", tip4Text: "Perjudian harus menjadi salah satu dari banyak aktivitas rekreasi.",
    tip5Title: "Hindari Alkohol", tip5Text: "Hindari berjudi saat berada di bawah pengaruh alkohol atau obat-obatan.",
    tip6Title: "Ketahui Peluang", tip6Text: "Pahami bahwa peluang selalu menguntungkan rumah.",
    getHelp: "Dapatkan Bantuan",
    getHelpText: "Jika Anda atau seseorang yang Anda kenal memiliki masalah perjudian, hubungi sumber daya ini:",
    selfExclusion: "Pengecualian Diri",
    selfExclusionText1: "Jika Anda perlu istirahat dari perjudian, Anda dapat meminta pengecualian diri. Hubungi kami di",
    selfExclusionText2: "untuk meminta pengecualian diri untuk periode yang Anda pilih.",
    selfExclusionText3: "Selama periode pengecualian diri, Anda tidak akan dapat mengakses akun Anda.",
    product: "Produk", liveOdds: "Performa AI", popularLeagues: "Liga Populer",
    communityFooter: "Komunitas", globalChat: "Chat Global", userPredictions: "Prediksi Pengguna",
    company: "Perusahaan", aboutUs: "Tentang Kami", contact: "Kontak", blog: "Blog",
    legal: "Legal", termsOfService: "Ketentuan Layanan", privacyPolicy: "Kebijakan Privasi", responsibleGaming: "Perjudian Bertanggung Jawab",
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

  const warningSigns = [
    t('warningSign1'), t('warningSign2'), t('warningSign3'), t('warningSign4'),
    t('warningSign5'), t('warningSign6'), t('warningSign7'), t('warningSign8'),
  ];

  const tips = [
    { title: t('tip1Title'), text: t('tip1Text') },
    { title: t('tip2Title'), text: t('tip2Text') },
    { title: t('tip3Title'), text: t('tip3Text') },
    { title: t('tip4Title'), text: t('tip4Text') },
    { title: t('tip5Title'), text: t('tip5Text') },
    { title: t('tip6Title'), text: t('tip6Text') },
  ];

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

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Our Commitment */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">{t('ourCommitment')}</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{t('ourCommitmentText1')}</p>
            <p className="text-gray-300 leading-relaxed">{t('ourCommitmentText2')}</p>
          </div>

          {/* Age Verification */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">{t('ageVerification')}</h2>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-red-400">18+</span>
              </div>
              <p className="text-gray-300 leading-relaxed">{t('ageVerificationText')}</p>
            </div>
          </div>

          {/* Warning Signs */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">{t('warningSigns')}</h2>
            <p className="text-gray-300 leading-relaxed mb-6">{t('warningSignsText')}</p>
            <ul className="space-y-3">
              {warningSigns.map((sign, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-gray-300">{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips for Responsible Gambling */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">{t('tipsTitle')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="font-semibold text-white mb-2">{tip.title}</h3>
                  <p className="text-gray-400 text-sm">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Help Resources */}
          <div className="bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-2xl border border-red-500/20 p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">{t('getHelp')}</h2>
            <p className="text-gray-300 leading-relaxed mb-6">{t('getHelpText')}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {helpResources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 transition-all"
                >
                  <h3 className="font-semibold text-white mb-1">{resource.name}</h3>
                  <p className="text-emerald-400 text-sm font-medium">{resource.phone}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Self-Exclusion */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">{t('selfExclusion')}</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t('selfExclusionText1')}{' '}
              <a href="mailto:support@oddsflow.ai" className="text-emerald-400 hover:underline">support@oddsflow.ai</a>{' '}
              {t('selfExclusionText2')}
            </p>
            <p className="text-gray-300 leading-relaxed">{t('selfExclusionText3')}</p>
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
