import { Metadata } from 'next';

// League configuration
const LEAGUES_CONFIG: Record<string, { name: string; country: string; dbName: string }> = {
  'premier-league': { name: 'Premier League', country: 'England', dbName: 'Premier League' },
  'bundesliga': { name: 'Bundesliga', country: 'Germany', dbName: 'Bundesliga' },
  'serie-a': { name: 'Serie A', country: 'Italy', dbName: 'Serie A' },
  'la-liga': { name: 'La Liga', country: 'Spain', dbName: 'La Liga' },
  'ligue-1': { name: 'Ligue 1', country: 'France', dbName: 'Ligue 1' },
  'champions-league': { name: 'Champions League', country: 'UEFA', dbName: 'UEFA Champions League' },
};

// Convert slug to display name (e.g., "manchester-city" -> "Manchester City")
function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Multi-language title templates (SEO optimized with betting keywords)
const TITLE_TEMPLATES: Record<string, (teamName: string, leagueName: string, year: number) => string> = {
  en: (team, league, year) => `${team} Betting Stats, Form & AI Predictions ${year} - ${league} | OddsFlow`,
  es: (team, league, year) => `${team} Estadisticas de Apuestas, Forma y Predicciones IA ${year} - ${league} | OddsFlow`,
  pt: (team, league, year) => `${team} Estatisticas de Apostas, Forma e Previsoes IA ${year} - ${league} | OddsFlow`,
  de: (team, league, year) => `${team} Wett-Statistiken, Form & KI-Vorhersagen ${year} - ${league} | OddsFlow`,
  fr: (team, league, year) => `${team} Stats de Paris, Forme & Predictions IA ${year} - ${league} | OddsFlow`,
  ja: (team, league, year) => `${team} ベッティング統計・フォーム・AI予測 ${year} - ${league} | OddsFlow`,
  ko: (team, league, year) => `${team} 베팅 통계, 폼 & AI 예측 ${year} - ${league} | OddsFlow`,
  zh: (team, league, year) => `${team} 投注统计、状态与AI预测 ${year} - ${league} | OddsFlow`,
  tw: (team, league, year) => `${team} 投注統計、狀態與AI預測 ${year} - ${league} | OddsFlow`,
  id: (team, league, year) => `${team} Statistik Taruhan, Form & Prediksi AI ${year} - ${league} | OddsFlow`,
};

// Multi-language description templates
const DESC_TEMPLATES: Record<string, (teamName: string, leagueName: string, year: number) => string> = {
  en: (team, league, year) => `${team} ${year} season stats, squad, form analysis and AI betting predictions. Get ${league} insights for ${team} matches with OddsFlow.`,
  es: (team, league, year) => `Estadisticas de ${team} temporada ${year}, plantilla, analisis de forma y predicciones de apuestas IA. Obten informacion de ${league} para partidos de ${team}.`,
  pt: (team, league, year) => `Estatisticas de ${team} temporada ${year}, elenco, analise de forma e previsoes de apostas IA. Obtenha insights da ${league} para jogos do ${team}.`,
  de: (team, league, year) => `${team} ${year} Saison-Statistiken, Kader, Formanalyse und KI-Wettvorhersagen. Erhalten Sie ${league} Einblicke fur ${team} Spiele.`,
  fr: (team, league, year) => `Stats de ${team} saison ${year}, effectif, analyse de forme et predictions de paris IA. Obtenez des insights ${league} pour les matchs de ${team}.`,
  ja: (team, league, year) => `${team} ${year}シーズンの統計、選手、フォーム分析、AIベッティング予測。${league}の${team}試合情報を取得。`,
  ko: (team, league, year) => `${team} ${year} 시즌 통계, 스쿼드, 폼 분석 및 AI 베팅 예측. ${league} ${team} 경기 인사이트를 확인하세요.`,
  zh: (team, league, year) => `${team} ${year}赛季统计数据、阵容、状态分析和AI投注预测。获取${league} ${team}比赛洞察。`,
  tw: (team, league, year) => `${team} ${year}賽季統計數據、陣容、狀態分析和AI投注預測。獲取${league} ${team}比賽洞察。`,
  id: (team, league, year) => `Statistik ${team} musim ${year}, skuad, analisis performa dan prediksi taruhan AI. Dapatkan wawasan ${league} untuk pertandingan ${team}.`,
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; league: string; team: string }>
}): Promise<Metadata> {
  const { locale, league, team } = await params;
  const currentYear = new Date().getFullYear();

  const leagueInfo = LEAGUES_CONFIG[league];
  const teamName = slugToDisplayName(team);
  const leagueName = leagueInfo?.name || 'Football';

  const titleFn = TITLE_TEMPLATES[locale] || TITLE_TEMPLATES['en'];
  const descFn = DESC_TEMPLATES[locale] || DESC_TEMPLATES['en'];

  const title = titleFn(teamName, leagueName, currentYear);
  const description = descFn(teamName, leagueName, currentYear);

  return {
    title,
    description,
    keywords: [
      teamName,
      `${teamName} predictions`,
      `${teamName} stats`,
      `${teamName} betting`,
      leagueName,
      `${leagueName} predictions`,
      'AI predictions',
      'football betting',
      'soccer predictions',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
