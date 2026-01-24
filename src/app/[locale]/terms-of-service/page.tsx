import TermsClient from './TermsClient';
import { localeToTranslationCode, type Locale } from '@/i18n/config';

// Terms of Service content translations - rendered server-side for SEO
const termsContent: Record<string, {
  title: string;
  lastUpdated: string;
  sections: { title: string; text: string }[];
}> = {
  EN: {
    title: "OddsFlow Terms of Service",
    lastUpdated: "Last Updated: January 2026",
    sections: [
      { title: "1. Acceptance of Terms", text: "Welcome to OddsFlow. By accessing our platform, you agree to these Terms of Service. OddsFlow provides AI-driven football analytics, historical data processing, and market trend visualization tools (the \"Service\"). If you do not agree to these terms, please discontinue the use of our Service immediately." },
      { title: "2. Nature of Service", text: "OddsFlow is strictly a SaaS (Software as a Service) platform dedicated to sports data analysis. We are NOT a gambling operator: We do not accept wagers, bets, or facilitate any monetary transaction related to the outcome of sports events. We are NOT a financial advisor: Our proprietary AI models and charts are for informational and educational purposes only. Access Only: Your subscription fee is strictly for access to our software dashboard and historical database, not for any promised financial returns." },
      { title: "3. Use License & Intellectual Property", text: "OddsFlow grants you a limited, non-exclusive, non-transferable license to access our sports analytics software for personal use. All proprietary algorithms, football prediction models, and code remain the intellectual property of OddsFlow. You agree not to: Reverse engineer our data scraping or analysis logic. Resell or redistribute our market insights without explicit permission." },
      { title: "4. Data Accuracy and AI Limitations", text: "Our football analysis engine utilizes historical statistics and machine learning to generate probabilities. However, sports events are subject to inherent variance. OddsFlow does not guarantee the accuracy of its match projections or market trend signals. The data is provided \"as is,\" and we assume no liability for decisions made based on our visualized data sets." },
      { title: "5. Responsible Use & Risk Disclosure", text: "While OddsFlow provides high-level market intelligence, users acknowledge that sports analysis involves risk. You agree that OddsFlow is a tool for research, not a directive for action. You are solely responsible for how you interpret and utilize the statistical data provided. We explicitly disclaim liability for any financial losses associated with the use of our analytics tools." },
      { title: "6. User Accounts & Security", text: "To access premium live odds analysis, you must create an account. You are responsible for maintaining the security of your credentials. Any breach of security should be reported to our support team immediately." },
      { title: "7. Subscription & Payments", text: "Payments are processed securely via third-party gateways (e.g., Stripe). Subscriptions grant access to our data infrastructure for the specified period. We do not offer refunds based on the performance of teams or match outcomes, as the service provided is the access to the software itself." },
      { title: "8. Modifications", text: "We reserve the right to update these terms to reflect changes in our algorithm updates or business practices. Continued use of the OddsFlow analytics platform constitutes acceptance of the new terms." },
      { title: "9. Contact", text: "For questions regarding our technology or these terms, please contact us at support@oddsflow.com." },
    ],
  },
  ES: {
    title: "Términos de Servicio de OddsFlow",
    lastUpdated: "Última actualización: Enero 2026",
    sections: [
      { title: "1. Aceptación de Términos", text: "Bienvenido a OddsFlow. Al acceder a nuestra plataforma, acepta estos Términos de Servicio. OddsFlow proporciona análisis de fútbol impulsado por IA, procesamiento de datos históricos y herramientas de visualización de tendencias del mercado (el \"Servicio\"). Si no está de acuerdo con estos términos, deje de usar nuestro Servicio inmediatamente." },
      { title: "2. Naturaleza del Servicio", text: "OddsFlow es estrictamente una plataforma SaaS (Software como Servicio) dedicada al análisis de datos deportivos. NO somos un operador de apuestas: No aceptamos apuestas ni facilitamos transacciones monetarias relacionadas con resultados de eventos deportivos. NO somos asesores financieros: Nuestros modelos de IA y gráficos son solo para fines informativos y educativos. Solo Acceso: Su tarifa de suscripción es estrictamente para acceder a nuestro panel de software y base de datos histórica, no para retornos financieros prometidos." },
      { title: "3. Licencia de Uso y Propiedad Intelectual", text: "OddsFlow le otorga una licencia limitada, no exclusiva e intransferible para acceder a nuestro software de análisis deportivo para uso personal. Todos los algoritmos propietarios, modelos de predicción de fútbol y código siguen siendo propiedad intelectual de OddsFlow. Usted acepta no: Realizar ingeniería inversa de nuestra lógica de análisis. Revender o redistribuir nuestros conocimientos del mercado sin permiso explícito." },
      { title: "4. Precisión de Datos y Limitaciones de IA", text: "Nuestro motor de análisis de fútbol utiliza estadísticas históricas y aprendizaje automático para generar probabilidades. Sin embargo, los eventos deportivos están sujetos a varianza inherente. OddsFlow no garantiza la precisión de sus proyecciones de partidos o señales de tendencias del mercado. Los datos se proporcionan \"tal cual\" y no asumimos responsabilidad por decisiones tomadas basadas en nuestros conjuntos de datos visualizados." },
      { title: "5. Uso Responsable y Divulgación de Riesgos", text: "Si bien OddsFlow proporciona inteligencia de mercado de alto nivel, los usuarios reconocen que el análisis deportivo implica riesgo. Usted acepta que OddsFlow es una herramienta de investigación, no una directiva para la acción. Usted es el único responsable de cómo interpreta y utiliza los datos estadísticos proporcionados. Rechazamos explícitamente la responsabilidad por cualquier pérdida financiera asociada con el uso de nuestras herramientas de análisis." },
      { title: "6. Cuentas de Usuario y Seguridad", text: "Para acceder al análisis de cuotas en vivo premium, debe crear una cuenta. Usted es responsable de mantener la seguridad de sus credenciales. Cualquier violación de seguridad debe informarse a nuestro equipo de soporte inmediatamente." },
      { title: "7. Suscripción y Pagos", text: "Los pagos se procesan de forma segura a través de pasarelas de terceros (ej. Stripe). Las suscripciones otorgan acceso a nuestra infraestructura de datos por el período especificado. No ofrecemos reembolsos basados en el rendimiento de equipos o resultados de partidos, ya que el servicio proporcionado es el acceso al software en sí." },
      { title: "8. Modificaciones", text: "Nos reservamos el derecho de actualizar estos términos para reflejar cambios en nuestras actualizaciones de algoritmos o prácticas comerciales. El uso continuado de la plataforma de análisis OddsFlow constituye la aceptación de los nuevos términos." },
      { title: "9. Contacto", text: "Para preguntas sobre nuestra tecnología o estos términos, contáctenos en support@oddsflow.com." },
    ],
  },
  PT: {
    title: "Termos de Serviço do OddsFlow",
    lastUpdated: "Última atualização: Janeiro 2026",
    sections: [
      { title: "1. Aceitação dos Termos", text: "Bem-vindo ao OddsFlow. Ao acessar nossa plataforma, você concorda com estes Termos de Serviço. OddsFlow fornece análises de futebol baseadas em IA, processamento de dados históricos e ferramentas de visualização de tendências de mercado (o \"Serviço\"). Se você não concordar com estes termos, por favor interrompa o uso do nosso Serviço imediatamente." },
      { title: "2. Natureza do Serviço", text: "OddsFlow é estritamente uma plataforma SaaS (Software como Serviço) dedicada à análise de dados esportivos. NÃO somos um operador de apostas: Não aceitamos apostas nem facilitamos transações monetárias relacionadas a resultados de eventos esportivos. NÃO somos consultores financeiros: Nossos modelos de IA e gráficos são apenas para fins informativos e educacionais. Apenas Acesso: Sua taxa de assinatura é estritamente para acesso ao nosso painel de software e banco de dados histórico, não para retornos financeiros prometidos." },
      { title: "3. Licença de Uso e Propriedade Intelectual", text: "OddsFlow concede a você uma licença limitada, não exclusiva e intransferível para acessar nosso software de análise esportiva para uso pessoal. Todos os algoritmos proprietários, modelos de previsão de futebol e código permanecem propriedade intelectual da OddsFlow. Você concorda em não: Fazer engenharia reversa de nossa lógica de análise. Revender ou redistribuir nossos insights de mercado sem permissão explícita." },
      { title: "4. Precisão de Dados e Limitações da IA", text: "Nosso motor de análise de futebol utiliza estatísticas históricas e aprendizado de máquina para gerar probabilidades. No entanto, eventos esportivos estão sujeitos a variância inerente. OddsFlow não garante a precisão de suas projeções de partidas ou sinais de tendências de mercado. Os dados são fornecidos \"como estão\" e não assumimos responsabilidade por decisões tomadas com base em nossos conjuntos de dados visualizados." },
      { title: "5. Uso Responsável e Divulgação de Riscos", text: "Embora OddsFlow forneça inteligência de mercado de alto nível, os usuários reconhecem que a análise esportiva envolve risco. Você concorda que OddsFlow é uma ferramenta de pesquisa, não uma diretiva para ação. Você é o único responsável por como interpreta e utiliza os dados estatísticos fornecidos. Rejeitamos explicitamente a responsabilidade por quaisquer perdas financeiras associadas ao uso de nossas ferramentas de análise." },
      { title: "6. Contas de Usuário e Segurança", text: "Para acessar a análise de odds ao vivo premium, você deve criar uma conta. Você é responsável por manter a segurança de suas credenciais. Qualquer violação de segurança deve ser relatada à nossa equipe de suporte imediatamente." },
      { title: "7. Assinatura e Pagamentos", text: "Os pagamentos são processados de forma segura através de gateways de terceiros (ex. Stripe). As assinaturas concedem acesso à nossa infraestrutura de dados pelo período especificado. Não oferecemos reembolsos baseados no desempenho de equipes ou resultados de partidas, pois o serviço fornecido é o acesso ao software em si." },
      { title: "8. Modificações", text: "Reservamo-nos o direito de atualizar estes termos para refletir mudanças em nossas atualizações de algoritmos ou práticas comerciais. O uso continuado da plataforma de análise OddsFlow constitui aceitação dos novos termos." },
      { title: "9. Contato", text: "Para dúvidas sobre nossa tecnologia ou estes termos, entre em contato em support@oddsflow.com." },
    ],
  },
  DE: {
    title: "OddsFlow Nutzungsbedingungen",
    lastUpdated: "Letzte Aktualisierung: Januar 2026",
    sections: [
      { title: "1. Annahme der Bedingungen", text: "Willkommen bei OddsFlow. Durch den Zugriff auf unsere Plattform stimmen Sie diesen Nutzungsbedingungen zu. OddsFlow bietet KI-gesteuerte Fußballanalysen, historische Datenverarbeitung und Markttrend-Visualisierungstools (der \"Service\"). Wenn Sie diesen Bedingungen nicht zustimmen, stellen Sie die Nutzung unseres Services bitte sofort ein." },
      { title: "2. Art des Services", text: "OddsFlow ist strikt eine SaaS-Plattform (Software as a Service) für Sportdatenanalyse. Wir sind KEIN Wettanbieter: Wir akzeptieren keine Wetten und vermitteln keine Geldtransaktionen im Zusammenhang mit Sportergebnissen. Wir sind KEINE Finanzberater: Unsere KI-Modelle und Diagramme dienen nur zu Informations- und Bildungszwecken. Nur Zugang: Ihre Abonnementgebühr gilt ausschließlich für den Zugang zu unserem Software-Dashboard und der historischen Datenbank, nicht für versprochene finanzielle Renditen." },
      { title: "3. Nutzungslizenz und geistiges Eigentum", text: "OddsFlow gewährt Ihnen eine begrenzte, nicht-exklusive, nicht übertragbare Lizenz für den Zugriff auf unsere Sportanalyse-Software für den persönlichen Gebrauch. Alle proprietären Algorithmen, Fußballvorhersagemodelle und Code bleiben geistiges Eigentum von OddsFlow. Sie erklären sich damit einverstanden, nicht: Unsere Analyselogik zurückzuentwickeln. Unsere Markteinblicke ohne ausdrückliche Genehmigung weiterzuverkaufen oder weiterzuverbreiten." },
      { title: "4. Datengenauigkeit und KI-Einschränkungen", text: "Unsere Fußballanalyse-Engine nutzt historische Statistiken und maschinelles Lernen zur Generierung von Wahrscheinlichkeiten. Sportereignisse unterliegen jedoch inhärenter Varianz. OddsFlow garantiert nicht die Genauigkeit seiner Spielprognosen oder Markttrendsignale. Die Daten werden \"wie besehen\" bereitgestellt, und wir übernehmen keine Haftung für Entscheidungen, die auf unseren visualisierten Datensätzen basieren." },
      { title: "5. Verantwortungsvolle Nutzung und Risikohinweis", text: "Obwohl OddsFlow hochwertige Marktintelligenz bietet, erkennen Benutzer an, dass Sportanalysen Risiken bergen. Sie stimmen zu, dass OddsFlow ein Forschungswerkzeug ist, keine Handlungsanweisung. Sie sind allein verantwortlich dafür, wie Sie die bereitgestellten statistischen Daten interpretieren und nutzen. Wir lehnen ausdrücklich jede Haftung für finanzielle Verluste ab, die mit der Nutzung unserer Analysetools verbunden sind." },
      { title: "6. Benutzerkonten und Sicherheit", text: "Um auf die Premium-Live-Quotenanalyse zuzugreifen, müssen Sie ein Konto erstellen. Sie sind für die Sicherheit Ihrer Anmeldedaten verantwortlich. Jede Sicherheitsverletzung sollte sofort unserem Support-Team gemeldet werden." },
      { title: "7. Abonnement und Zahlungen", text: "Zahlungen werden sicher über Drittanbieter-Gateways (z.B. Stripe) abgewickelt. Abonnements gewähren Zugang zu unserer Dateninfrastruktur für den angegebenen Zeitraum. Wir bieten keine Rückerstattungen basierend auf der Leistung von Teams oder Spielergebnissen an, da der erbrachte Service der Zugang zur Software selbst ist." },
      { title: "8. Änderungen", text: "Wir behalten uns das Recht vor, diese Bedingungen zu aktualisieren, um Änderungen in unseren Algorithmus-Updates oder Geschäftspraktiken widerzuspiegeln. Die fortgesetzte Nutzung der OddsFlow-Analyseplattform gilt als Akzeptanz der neuen Bedingungen." },
      { title: "9. Kontakt", text: "Bei Fragen zu unserer Technologie oder diesen Bedingungen kontaktieren Sie uns unter support@oddsflow.com." },
    ],
  },
  FR: {
    title: "Conditions d'Utilisation OddsFlow",
    lastUpdated: "Dernière mise à jour: Janvier 2026",
    sections: [
      { title: "1. Acceptation des Conditions", text: "Bienvenue sur OddsFlow. En accédant à notre plateforme, vous acceptez ces Conditions d'Utilisation. OddsFlow fournit des analyses de football basées sur l'IA, le traitement de données historiques et des outils de visualisation des tendances du marché (le \"Service\"). Si vous n'acceptez pas ces conditions, veuillez cesser immédiatement d'utiliser notre Service." },
      { title: "2. Nature du Service", text: "OddsFlow est strictement une plateforme SaaS (Software as a Service) dédiée à l'analyse de données sportives. Nous ne sommes PAS un opérateur de paris: Nous n'acceptons pas de paris et ne facilitons aucune transaction monétaire liée aux résultats d'événements sportifs. Nous ne sommes PAS des conseillers financiers: Nos modèles IA et graphiques sont uniquement à des fins d'information et d'éducation. Accès uniquement: Vos frais d'abonnement sont strictement pour l'accès à notre tableau de bord logiciel et à notre base de données historique, pas pour des rendements financiers promis." },
      { title: "3. Licence d'Utilisation et Propriété Intellectuelle", text: "OddsFlow vous accorde une licence limitée, non exclusive et non transférable pour accéder à notre logiciel d'analyse sportive pour un usage personnel. Tous les algorithmes propriétaires, modèles de prédiction de football et code restent la propriété intellectuelle d'OddsFlow. Vous acceptez de ne pas: Faire de l'ingénierie inverse sur notre logique d'analyse. Revendre ou redistribuer nos informations de marché sans autorisation explicite." },
      { title: "4. Précision des Données et Limitations de l'IA", text: "Notre moteur d'analyse de football utilise des statistiques historiques et l'apprentissage automatique pour générer des probabilités. Cependant, les événements sportifs sont soumis à une variance inhérente. OddsFlow ne garantit pas l'exactitude de ses projections de matchs ou signaux de tendances du marché. Les données sont fournies \"telles quelles\" et nous n'assumons aucune responsabilité pour les décisions prises sur la base de nos ensembles de données visualisés." },
      { title: "5. Utilisation Responsable et Divulgation des Risques", text: "Bien qu'OddsFlow fournisse une intelligence de marché de haut niveau, les utilisateurs reconnaissent que l'analyse sportive comporte des risques. Vous acceptez qu'OddsFlow est un outil de recherche, pas une directive d'action. Vous êtes seul responsable de la façon dont vous interprétez et utilisez les données statistiques fournies. Nous déclinons explicitement toute responsabilité pour les pertes financières associées à l'utilisation de nos outils d'analyse." },
      { title: "6. Comptes Utilisateurs et Sécurité", text: "Pour accéder à l'analyse des cotes en direct premium, vous devez créer un compte. Vous êtes responsable du maintien de la sécurité de vos identifiants. Toute violation de sécurité doit être signalée immédiatement à notre équipe de support." },
      { title: "7. Abonnement et Paiements", text: "Les paiements sont traités de manière sécurisée via des passerelles tierces (ex. Stripe). Les abonnements donnent accès à notre infrastructure de données pour la période spécifiée. Nous n'offrons pas de remboursements basés sur la performance des équipes ou les résultats des matchs, car le service fourni est l'accès au logiciel lui-même." },
      { title: "8. Modifications", text: "Nous nous réservons le droit de mettre à jour ces conditions pour refléter les changements dans nos mises à jour d'algorithmes ou nos pratiques commerciales. L'utilisation continue de la plateforme d'analyse OddsFlow constitue l'acceptation des nouvelles conditions." },
      { title: "9. Contact", text: "Pour toute question concernant notre technologie ou ces conditions, contactez-nous à support@oddsflow.com." },
    ],
  },
  JA: {
    title: "OddsFlow 利用規約",
    lastUpdated: "最終更新：2026年1月",
    sections: [
      { title: "1. 規約への同意", text: "OddsFlowへようこそ。当プラットフォームにアクセスすることにより、これらの利用規約に同意したものとみなされます。OddsFlowは、AI駆動のサッカー分析、履歴データ処理、市場トレンド可視化ツール（「サービス」）を提供します。これらの規約に同意しない場合は、直ちにサービスの使用を中止してください。" },
      { title: "2. サービスの性質", text: "OddsFlowは、スポーツデータ分析に特化したSaaS（Software as a Service）プラットフォームです。当社はギャンブル事業者ではありません：賭けを受け付けたり、スポーツイベントの結果に関連する金銭取引を促進したりしません。当社は財務アドバイザーではありません：当社のAIモデルとチャートは情報提供および教育目的のみです。アクセスのみ：サブスクリプション料金は、ソフトウェアダッシュボードと履歴データベースへのアクセスのためであり、約束された財務リターンのためではありません。" },
      { title: "3. 使用許諾と知的財産", text: "OddsFlowは、個人使用のためのスポーツ分析ソフトウェアへのアクセスに対して、限定的、非独占的、譲渡不可のライセンスを付与します。すべての独自アルゴリズム、サッカー予測モデル、コードはOddsFlowの知的財産として保持されます。以下に同意するものとします：分析ロジックのリバースエンジニアリングを行わないこと。明示的な許可なく市場インサイトを転売または再配布しないこと。" },
      { title: "4. データの正確性とAIの制限", text: "当社のサッカー分析エンジンは、履歴統計と機械学習を使用して確率を生成します。ただし、スポーツイベントには固有の変動性があります。OddsFlowは、試合予測や市場トレンドシグナルの正確性を保証しません。データは「現状のまま」提供され、当社の可視化データセットに基づいて行われた決定に対する責任は負いません。" },
      { title: "5. 責任ある使用とリスク開示", text: "OddsFlowは高レベルの市場インテリジェンスを提供しますが、ユーザーはスポーツ分析にはリスクが伴うことを認識します。OddsFlowは研究ツールであり、行動の指示ではないことに同意します。提供された統計データをどのように解釈し利用するかは、お客様の責任です。当社の分析ツールの使用に関連する財務的損失について、当社は明示的に責任を負いません。" },
      { title: "6. ユーザーアカウントとセキュリティ", text: "プレミアムライブオッズ分析にアクセスするには、アカウントを作成する必要があります。認証情報のセキュリティを維持する責任はお客様にあります。セキュリティ違反は、直ちにサポートチームに報告してください。" },
      { title: "7. サブスクリプションと支払い", text: "支払いは、サードパーティゲートウェイ（例：Stripe）を通じて安全に処理されます。サブスクリプションは、指定された期間のデータインフラストラクチャへのアクセスを付与します。提供されるサービスはソフトウェアへのアクセス自体であるため、チームのパフォーマンスや試合結果に基づく返金は行いません。" },
      { title: "8. 変更", text: "当社は、アルゴリズムの更新またはビジネス慣行の変更を反映するために、これらの条件を更新する権利を留保します。OddsFlow分析プラットフォームの継続的な使用は、新しい条件の承諾を意味します。" },
      { title: "9. お問い合わせ", text: "当社の技術またはこれらの条件に関するご質問は、support@oddsflow.comまでお問い合わせください。" },
    ],
  },
  KO: {
    title: "OddsFlow 이용약관",
    lastUpdated: "최종 업데이트: 2026년 1월",
    sections: [
      { title: "1. 약관 동의", text: "OddsFlow에 오신 것을 환영합니다. 당사 플랫폼에 접속함으로써 귀하는 이 이용약관에 동의합니다. OddsFlow는 AI 기반 축구 분석, 과거 데이터 처리 및 시장 트렌드 시각화 도구(\"서비스\")를 제공합니다. 이 약관에 동의하지 않는 경우 서비스 사용을 즉시 중단해 주세요." },
      { title: "2. 서비스 성격", text: "OddsFlow는 스포츠 데이터 분석에 특화된 SaaS(Software as a Service) 플랫폼입니다. 당사는 도박 운영자가 아닙니다: 베팅을 받거나 스포츠 이벤트 결과와 관련된 금전 거래를 촉진하지 않습니다. 당사는 재정 고문이 아닙니다: 당사의 AI 모델과 차트는 정보 및 교육 목적으로만 제공됩니다. 접근만: 구독료는 소프트웨어 대시보드 및 과거 데이터베이스에 대한 접근을 위한 것이며, 약속된 재정적 수익을 위한 것이 아닙니다." },
      { title: "3. 사용 라이선스 및 지적 재산권", text: "OddsFlow는 개인 사용을 위해 스포츠 분석 소프트웨어에 접근할 수 있는 제한적이고 비독점적이며 양도 불가능한 라이선스를 부여합니다. 모든 독점 알고리즘, 축구 예측 모델 및 코드는 OddsFlow의 지적 재산으로 유지됩니다. 귀하는 다음에 동의합니다: 당사의 분석 로직을 역설계하지 않을 것. 명시적 허가 없이 시장 인사이트를 재판매하거나 재배포하지 않을 것." },
      { title: "4. 데이터 정확성 및 AI 한계", text: "당사의 축구 분석 엔진은 과거 통계와 머신러닝을 사용하여 확률을 생성합니다. 그러나 스포츠 이벤트는 고유한 변동성이 있습니다. OddsFlow는 경기 예측이나 시장 트렌드 신호의 정확성을 보장하지 않습니다. 데이터는 \"있는 그대로\" 제공되며, 당사의 시각화된 데이터 세트를 기반으로 내린 결정에 대해 책임을 지지 않습니다." },
      { title: "5. 책임 있는 사용 및 위험 공개", text: "OddsFlow가 고수준의 시장 인텔리전스를 제공하지만, 사용자는 스포츠 분석에 위험이 수반된다는 것을 인정합니다. 귀하는 OddsFlow가 연구 도구이며 행동 지침이 아님에 동의합니다. 제공된 통계 데이터를 어떻게 해석하고 활용할지는 전적으로 귀하의 책임입니다. 당사는 분석 도구 사용과 관련된 재정적 손실에 대한 책임을 명시적으로 부인합니다." },
      { title: "6. 사용자 계정 및 보안", text: "프리미엄 실시간 배당률 분석에 접근하려면 계정을 만들어야 합니다. 자격 증명의 보안을 유지할 책임은 귀하에게 있습니다. 보안 위반은 즉시 지원팀에 보고해야 합니다." },
      { title: "7. 구독 및 결제", text: "결제는 제3자 게이트웨이(예: Stripe)를 통해 안전하게 처리됩니다. 구독은 지정된 기간 동안 데이터 인프라에 대한 접근 권한을 부여합니다. 제공되는 서비스는 소프트웨어 자체에 대한 접근이므로, 팀 성과나 경기 결과에 따른 환불을 제공하지 않습니다." },
      { title: "8. 수정", text: "당사는 알고리즘 업데이트 또는 비즈니스 관행의 변경을 반영하기 위해 이 약관을 업데이트할 권리를 보유합니다. OddsFlow 분석 플랫폼의 지속적인 사용은 새로운 약관의 수락을 의미합니다." },
      { title: "9. 연락처", text: "당사 기술 또는 이 약관에 대한 질문은 support@oddsflow.com으로 문의하세요." },
    ],
  },
  '中文': {
    title: "OddsFlow 服务条款",
    lastUpdated: "最后更新：2026年1月",
    sections: [
      { title: "1. 条款接受", text: "欢迎使用 OddsFlow。访问我们的平台即表示您同意这些服务条款。OddsFlow 提供 AI 驱动的足球分析、历史数据处理和市场趋势可视化工具（「服务」）。如果您不同意这些条款，请立即停止使用我们的服务。" },
      { title: "2. 服务性质", text: "OddsFlow 是一个专注于体育数据分析的 SaaS（软件即服务）平台。我们不是博彩运营商：我们不接受投注或促进与体育赛事结果相关的任何金钱交易。我们不是财务顾问：我们的 AI 模型和图表仅供信息和教育目的。仅限访问：您的订阅费仅用于访问我们的软件仪表板和历史数据库，而非承诺的财务回报。" },
      { title: "3. 使用许可与知识产权", text: "OddsFlow 授予您有限的、非独占的、不可转让的许可，以供个人使用访问我们的体育分析软件。所有专有算法、足球预测模型和代码仍为 OddsFlow 的知识产权。您同意不：对我们的分析逻辑进行逆向工程。未经明确许可转售或重新分发我们的市场洞察。" },
      { title: "4. 数据准确性与 AI 局限性", text: "我们的足球分析引擎利用历史统计数据和机器学习来生成概率。然而，体育赛事具有固有的不确定性。OddsFlow 不保证其比赛预测或市场趋势信号的准确性。数据按「原样」提供，我们不对基于可视化数据集做出的决策承担责任。" },
      { title: "5. 负责任使用与风险披露", text: "虽然 OddsFlow 提供高水平的市场情报，但用户承认体育分析涉及风险。您同意 OddsFlow 是研究工具，而非行动指令。您对如何解释和利用所提供的统计数据负全部责任。我们明确否认与使用我们分析工具相关的任何财务损失责任。" },
      { title: "6. 用户账户与安全", text: "要访问高级实时赔率分析，您必须创建账户。您有责任维护凭据的安全性。任何安全违规应立即向我们的支持团队报告。" },
      { title: "7. 订阅与付款", text: "付款通过第三方网关（如 Stripe）安全处理。订阅授予在指定期间内访问我们数据基础设施的权限。我们不根据球队表现或比赛结果提供退款，因为提供的服务是软件访问本身。" },
      { title: "8. 条款修改", text: "我们保留更新这些条款的权利，以反映算法更新或商业实践的变化。继续使用 OddsFlow 分析平台即表示接受新条款。" },
      { title: "9. 联系方式", text: "如有关于我们技术或这些条款的问题，请通过 support@oddsflow.com 联系我们。" },
    ],
  },
  '繁體': {
    title: "OddsFlow 服務條款",
    lastUpdated: "最後更新：2026年1月",
    sections: [
      { title: "1. 條款接受", text: "歡迎使用 OddsFlow。存取我們的平台即表示您同意這些服務條款。OddsFlow 提供 AI 驅動的足球分析、歷史數據處理和市場趨勢視覺化工具（「服務」）。如果您不同意這些條款，請立即停止使用我們的服務。" },
      { title: "2. 服務性質", text: "OddsFlow 是一個專注於體育數據分析的 SaaS（軟體即服務）平台。我們不是博彩營運商：我們不接受投注或促進與體育賽事結果相關的任何金錢交易。我們不是財務顧問：我們的 AI 模型和圖表僅供資訊和教育目的。僅限存取：您的訂閱費僅用於存取我們的軟體儀表板和歷史資料庫，而非承諾的財務回報。" },
      { title: "3. 使用許可與智慧財產權", text: "OddsFlow 授予您有限的、非獨占的、不可轉讓的許可，以供個人使用存取我們的體育分析軟體。所有專有演算法、足球預測模型和程式碼仍為 OddsFlow 的智慧財產權。您同意不：對我們的分析邏輯進行逆向工程。未經明確許可轉售或重新分發我們的市場洞察。" },
      { title: "4. 數據準確性與 AI 局限性", text: "我們的足球分析引擎利用歷史統計數據和機器學習來生成機率。然而，體育賽事具有固有的不確定性。OddsFlow 不保證其比賽預測或市場趨勢訊號的準確性。數據按「原樣」提供，我們不對基於視覺化數據集做出的決策承擔責任。" },
      { title: "5. 負責任使用與風險披露", text: "雖然 OddsFlow 提供高水準的市場情報，但用戶承認體育分析涉及風險。您同意 OddsFlow 是研究工具，而非行動指令。您對如何解釋和利用所提供的統計數據負全部責任。我們明確否認與使用我們分析工具相關的任何財務損失責任。" },
      { title: "6. 用戶帳戶與安全", text: "要存取高級即時賠率分析，您必須建立帳戶。您有責任維護憑據的安全性。任何安全違規應立即向我們的支援團隊報告。" },
      { title: "7. 訂閱與付款", text: "付款透過第三方閘道（如 Stripe）安全處理。訂閱授予在指定期間內存取我們數據基礎設施的權限。我們不根據球隊表現或比賽結果提供退款，因為提供的服務是軟體存取本身。" },
      { title: "8. 條款修改", text: "我們保留更新這些條款的權利，以反映演算法更新或商業實務的變化。繼續使用 OddsFlow 分析平台即表示接受新條款。" },
      { title: "9. 聯繫方式", text: "如有關於我們技術或這些條款的問題，請透過 support@oddsflow.com 聯繫我們。" },
    ],
  },
  ID: {
    title: "Syarat Layanan OddsFlow",
    lastUpdated: "Terakhir Diperbarui: Januari 2026",
    sections: [
      { title: "1. Penerimaan Syarat", text: "Selamat datang di OddsFlow. Dengan mengakses platform kami, Anda menyetujui Syarat Layanan ini. OddsFlow menyediakan analisis sepak bola berbasis AI, pemrosesan data historis, dan alat visualisasi tren pasar (\"Layanan\"). Jika Anda tidak menyetujui syarat ini, harap segera hentikan penggunaan Layanan kami." },
      { title: "2. Sifat Layanan", text: "OddsFlow adalah platform SaaS (Software as a Service) yang didedikasikan untuk analisis data olahraga. Kami BUKAN operator perjudian: Kami tidak menerima taruhan atau memfasilitasi transaksi uang terkait hasil acara olahraga. Kami BUKAN penasihat keuangan: Model AI dan grafik kami hanya untuk tujuan informasi dan edukasi. Akses Saja: Biaya langganan Anda semata-mata untuk akses ke dasbor perangkat lunak dan database historis kami, bukan untuk pengembalian finansial yang dijanjikan." },
      { title: "3. Lisensi Penggunaan & Kekayaan Intelektual", text: "OddsFlow memberikan lisensi terbatas, non-eksklusif, dan tidak dapat dipindahtangankan untuk mengakses perangkat lunak analisis olahraga kami untuk penggunaan pribadi. Semua algoritma kepemilikan, model prediksi sepak bola, dan kode tetap menjadi kekayaan intelektual OddsFlow. Anda setuju untuk tidak: Merekayasa balik logika analisis kami. Menjual kembali atau mendistribusikan ulang wawasan pasar kami tanpa izin eksplisit." },
      { title: "4. Akurasi Data dan Keterbatasan AI", text: "Mesin analisis sepak bola kami menggunakan statistik historis dan pembelajaran mesin untuk menghasilkan probabilitas. Namun, acara olahraga memiliki variasi yang melekat. OddsFlow tidak menjamin akurasi proyeksi pertandingan atau sinyal tren pasar. Data disediakan \"apa adanya,\" dan kami tidak bertanggung jawab atas keputusan yang dibuat berdasarkan kumpulan data yang divisualisasikan." },
      { title: "5. Penggunaan Bertanggung Jawab & Pengungkapan Risiko", text: "Meskipun OddsFlow menyediakan intelijen pasar tingkat tinggi, pengguna mengakui bahwa analisis olahraga melibatkan risiko. Anda setuju bahwa OddsFlow adalah alat penelitian, bukan arahan untuk bertindak. Anda bertanggung jawab penuh atas cara Anda menafsirkan dan menggunakan data statistik yang disediakan. Kami secara eksplisit menolak tanggung jawab atas kerugian finansial yang terkait dengan penggunaan alat analisis kami." },
      { title: "6. Akun Pengguna & Keamanan", text: "Untuk mengakses analisis odds langsung premium, Anda harus membuat akun. Anda bertanggung jawab untuk menjaga keamanan kredensial Anda. Setiap pelanggaran keamanan harus segera dilaporkan ke tim dukungan kami." },
      { title: "7. Langganan & Pembayaran", text: "Pembayaran diproses dengan aman melalui gateway pihak ketiga (mis. Stripe). Langganan memberikan akses ke infrastruktur data kami untuk periode yang ditentukan. Kami tidak menawarkan pengembalian dana berdasarkan kinerja tim atau hasil pertandingan, karena layanan yang disediakan adalah akses ke perangkat lunak itu sendiri." },
      { title: "8. Modifikasi", text: "Kami berhak memperbarui ketentuan ini untuk mencerminkan perubahan dalam pembaruan algoritma atau praktik bisnis kami. Penggunaan berkelanjutan platform analisis OddsFlow merupakan penerimaan ketentuan baru." },
      { title: "9. Kontak", text: "Untuk pertanyaan mengenai teknologi kami atau ketentuan ini, silakan hubungi kami di support@oddsflow.com." },
    ],
  },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsOfServicePage({ params }: PageProps) {
  const { locale } = await params;
  const langCode = localeToTranslationCode[locale as Locale] || 'EN';
  const content = termsContent[langCode] || termsContent.EN;

  // WebPage Schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": content.title,
    "description": "OddsFlow Terms of Service and User Agreement. Read our terms and conditions for using our AI-powered football analytics and odds prediction platform.",
    "url": `https://www.oddsflow.ai${locale === 'en' ? '' : `/${locale}`}/terms-of-service`,
    "inLanguage": locale,
    "isPartOf": {
      "@type": "WebSite",
      "name": "OddsFlow",
      "url": "https://www.oddsflow.ai"
    },
    "about": {
      "@type": "Thing",
      "name": "Terms of Service",
      "description": "Legal agreement between OddsFlow and users of the AI football analytics platform"
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
      {/* Schema for SEO - outside client component for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Hidden SEO content for crawlers that don't execute JavaScript */}
      <div className="sr-only" aria-hidden="true">
        <h1>{content.title}</h1>
        <p>{content.lastUpdated}</p>
        <article>
          {content.sections.map((section, index) => (
            <section key={index}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </article>
      </div>

      <TermsClient locale={locale}>
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
      </TermsClient>
    </>
  );
}
