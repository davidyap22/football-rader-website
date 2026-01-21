import { Metadata } from 'next';

// League configuration for metadata
const LEAGUES_SEO: Record<string, {
  name: string;
  country: string;
  keywords: string[];
  countryAdj: string;
}> = {
  'premier-league': {
    name: 'Premier League',
    country: 'England',
    countryAdj: 'English',
    keywords: ['EPL', 'English Premier League', 'Premier League predictions', 'EPL betting tips', 'Arsenal', 'Manchester United', 'Liverpool', 'Chelsea']
  },
  'bundesliga': {
    name: 'Bundesliga',
    country: 'Germany',
    countryAdj: 'German',
    keywords: ['German Bundesliga', 'Bundesliga predictions', 'Bundesliga betting tips', 'Bayern Munich', 'Borussia Dortmund', 'Leverkusen']
  },
  'serie-a': {
    name: 'Serie A',
    country: 'Italy',
    countryAdj: 'Italian',
    keywords: ['Italian Serie A', 'Serie A predictions', 'Serie A betting tips', 'Inter Milan', 'AC Milan', 'Juventus', 'Napoli']
  },
  'la-liga': {
    name: 'La Liga',
    country: 'Spain',
    countryAdj: 'Spanish',
    keywords: ['Spanish La Liga', 'La Liga predictions', 'La Liga betting tips', 'Real Madrid', 'Barcelona', 'Atletico Madrid']
  },
  'ligue-1': {
    name: 'Ligue 1',
    country: 'France',
    countryAdj: 'French',
    keywords: ['French Ligue 1', 'Ligue 1 predictions', 'Ligue 1 betting tips', 'PSG', 'Paris Saint-Germain', 'Marseille', 'Monaco']
  },
  'champions-league': {
    name: 'Champions League',
    country: 'UEFA',
    countryAdj: 'European',
    keywords: ['UEFA Champions League', 'UCL predictions', 'Champions League betting tips', 'European football']
  },
};

// Localized titles
const getTitleTemplate = (leagueName: string, year: number, locale: string): string => {
  const templates: Record<string, string> = {
    en: `${leagueName} Predictions ${year} - AI Betting Tips, Stats & Standings`,
    es: `Predicciones ${leagueName} ${year} - Consejos IA, Estadisticas y Clasificacion`,
    pt: `Previsoes ${leagueName} ${year} - Dicas IA, Estatisticas e Classificacao`,
    de: `${leagueName} Vorhersagen ${year} - KI Tipps, Statistiken & Tabelle`,
    fr: `Predictions ${leagueName} ${year} - Conseils IA, Stats & Classement`,
    ja: `${leagueName}予測 ${year} - AIベッティングヒント、統計＆順位表`,
    ko: `${leagueName} 예측 ${year} - AI 베팅 팁, 통계 및 순위표`,
    zh: `${leagueName}预测 ${year} - AI投注技巧、统计和积分榜`,
    'zh-tw': `${leagueName}預測 ${year} - AI投注技巧、統計和積分榜`,
    id: `Prediksi ${leagueName} ${year} - Tips AI, Statistik & Klasemen`,
  };
  return templates[locale] || templates.en;
};

const getDescriptionTemplate = (leagueName: string, countryAdj: string, locale: string): string => {
  const templates: Record<string, string> = {
    en: `Get accurate ${leagueName} predictions from our AI. View live standings, team stats, upcoming matches, and AI-powered betting tips for ${countryAdj} football. Make smarter bets with OddsFlow.`,
    es: `Obtén predicciones precisas de ${leagueName} de nuestra IA. Ve la clasificación en vivo, estadísticas de equipos y consejos de apuestas IA para el fútbol ${countryAdj.toLowerCase()}.`,
    pt: `Obtenha previsões precisas da ${leagueName} da nossa IA. Veja a classificação ao vivo, estatísticas de times e dicas de apostas IA para o futebol ${countryAdj.toLowerCase()}.`,
    de: `Erhalten Sie genaue ${leagueName} Vorhersagen von unserer KI. Sehen Sie Live-Tabellen, Teamstatistiken und KI-gestützte Wetttipps für ${countryAdj.toLowerCase()}en Fußball.`,
    fr: `Obtenez des prédictions précises de ${leagueName} de notre IA. Consultez le classement en direct, les stats d'équipes et les conseils de paris IA pour le football ${countryAdj.toLowerCase()}.`,
    ja: `AIから正確な${leagueName}予測を入手。ライブ順位表、チーム統計、${countryAdj}サッカーのAIベッティングヒントをご覧ください。`,
    ko: `AI로부터 정확한 ${leagueName} 예측을 받으세요. 실시간 순위표, 팀 통계, ${countryAdj} 축구 AI 베팅 팁을 확인하세요.`,
    zh: `从我们的AI获取准确的${leagueName}预测。查看实时积分榜、球队统计和${countryAdj}足球AI投注技巧。`,
    'zh-tw': `從我們的AI獲取準確的${leagueName}預測。查看實時積分榜、球隊統計和${countryAdj}足球AI投注技巧。`,
    id: `Dapatkan prediksi ${leagueName} yang akurat dari AI kami. Lihat klasemen langsung, statistik tim, dan tips taruhan AI untuk sepak bola ${countryAdj}.`,
  };
  return templates[locale] || templates.en;
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; league: string }>
}): Promise<Metadata> {
  const { locale, league } = await params;
  const leagueInfo = LEAGUES_SEO[league];
  const currentYear = new Date().getFullYear();
  const baseUrl = 'https://www.oddsflow.ai';

  // Default fallback if league not found
  if (!leagueInfo) {
    return {
      title: 'League Not Found',
    };
  }

  const title = getTitleTemplate(leagueInfo.name, currentYear, locale);
  const description = getDescriptionTemplate(leagueInfo.name, leagueInfo.countryAdj, locale);
  const canonicalPath = locale === 'en'
    ? `/leagues/${league}`
    : `/${locale}/leagues/${league}`;

  return {
    title,
    description,
    keywords: [
      ...leagueInfo.keywords,
      `${leagueInfo.name} AI predictions`,
      `${leagueInfo.name} standings`,
      `${leagueInfo.name} stats`,
      `${leagueInfo.name} betting tips`,
      'AI football predictions',
      'football betting analysis',
    ],
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${canonicalPath}`,
    },
  };
}

export default function LeagueDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
