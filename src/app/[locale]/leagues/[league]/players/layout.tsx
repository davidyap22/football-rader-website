import { Metadata } from 'next';
import { LEAGUES_CONFIG } from '@/lib/team-data';

const currentYear = new Date().getFullYear();

// Localized league names
const LEAGUE_NAMES_LOCALIZED: Record<string, Record<string, string>> = {
  'premier-league': {
    en: 'Premier League', es: 'Premier League', pt: 'Premier League', de: 'Premier League',
    fr: 'Premier League', ja: 'プレミアリーグ', ko: '프리미어리그', zh: '英超', tw: '英超', id: 'Liga Inggris',
  },
  'la-liga': {
    en: 'La Liga', es: 'La Liga', pt: 'La Liga', de: 'La Liga',
    fr: 'La Liga', ja: 'ラ・リーガ', ko: '라리가', zh: '西甲', tw: '西甲', id: 'La Liga',
  },
  'bundesliga': {
    en: 'Bundesliga', es: 'Bundesliga', pt: 'Bundesliga', de: 'Bundesliga',
    fr: 'Bundesliga', ja: 'ブンデスリーガ', ko: '분데스리가', zh: '德甲', tw: '德甲', id: 'Bundesliga',
  },
  'serie-a': {
    en: 'Serie A', es: 'Serie A', pt: 'Serie A', de: 'Serie A',
    fr: 'Serie A', ja: 'セリエA', ko: '세리에 A', zh: '意甲', tw: '義甲', id: 'Serie A',
  },
  'ligue-1': {
    en: 'Ligue 1', es: 'Ligue 1', pt: 'Ligue 1', de: 'Ligue 1',
    fr: 'Ligue 1', ja: 'リーグ・アン', ko: '리그 1', zh: '法甲', tw: '法甲', id: 'Ligue 1',
  },
  'champions-league': {
    en: 'Champions League', es: 'Liga de Campeones', pt: 'Liga dos Campeões', de: 'Champions League',
    fr: 'Ligue des Champions', ja: 'チャンピオンズリーグ', ko: '챔피언스리그', zh: '欧冠', tw: '歐冠', id: 'Liga Champions',
  },
  'europa-league': {
    en: 'Europa League', es: 'Liga Europa', pt: 'Liga Europa', de: 'Europa League',
    fr: 'Ligue Europa', ja: 'ヨーロッパリーグ', ko: '유로파리그', zh: '欧联', tw: '歐聯', id: 'Liga Europa',
  },
};

const getLocalizedLeagueName = (leagueSlug: string, locale: string): string => {
  const localeKey = locale === 'zh-CN' ? 'zh' : locale === 'zh-TW' ? 'tw' : locale;
  return LEAGUE_NAMES_LOCALIZED[leagueSlug]?.[localeKey] ||
    leagueSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// Multi-language title templates with SEO-optimized keywords
const titleTemplates: Record<string, (league: string, year: number) => string> = {
  en: (league, year) => `${league} Player Stats & Ratings ${year} - Top Scorers, Assists & Form | OddsFlow`,
  'zh-CN': (league, year) => `${league}球员数据统计 ${year} - 射手榜助攻榜评分 | AI足球预测 OddsFlow`,
  'zh-TW': (league, year) => `${league}球員數據統計 ${year} - 射手榜助攻榜評分 | 運彩分析 OddsFlow`,
  id: (league, year) => `Statistik Pemain ${league} ${year} - Top Skor & Rating | Prediksi Bola OddsFlow`,
  es: (league, year) => `Estadísticas Jugadores ${league} ${year} - Goleadores y Asistencias | OddsFlow`,
  pt: (league, year) => `Estatísticas Jogadores ${league} ${year} - Artilheiros e Assistências | OddsFlow`,
  ja: (league, year) => `${league}選手データ ${year} - 得点王・アシスト・評価 | ブックメーカー予想 OddsFlow`,
  ko: (league, year) => `${league} 선수 통계 ${year} - 득점왕 & 어시스트 순위 | 스포츠토토 OddsFlow`,
  de: (league, year) => `${league} Spielerstatistiken ${year} - Torjäger & Vorlagen | OddsFlow`,
  fr: (league, year) => `Statistiques Joueurs ${league} ${year} - Buteurs & Passes | Paris Sportifs OddsFlow`,
};

// Multi-language descriptions with market-specific keywords
const descriptionTemplates: Record<string, (league: string, year: number) => string> = {
  en: (league, year) => `Complete ${league} player statistics ${year}/${year + 1}. View top scorers, assists leaders, player ratings and form. AI-powered analysis for betting insights. Compare players across all ${league} teams.`,

  'zh-CN': (league, year) => `${year}/${year + 1}赛季${league}完整球员数据分析。射手榜、助攻榜、球员评分、比赛状态一目了然。五大联赛大数据AI预测，盘口分析，足球预测专家推荐。`,

  'zh-TW': (league, year) => `${year}/${year + 1}賽季${league}完整球員數據。射手榜、助攻榜、球員評分與狀態。運彩分析、讓分盤預測、AI足球預測推薦。`,

  id: (league, year) => `Statistik pemain ${league} lengkap ${year}/${year + 1}. Top skor, assist, rating dan form pemain. Prediksi bola AI akurat untuk Mix Parlay. Analisis pola gacor dan tips taruhan.`,

  es: (league, year) => `Estadísticas completas de jugadores ${league} ${year}/${year + 1}. Goleadores, asistencias, valoraciones y forma. Pronósticos de fútbol con IA para apuestas deportivas.`,

  pt: (league, year) => `Estatísticas completas dos jogadores ${league} ${year}/${year + 1}. Artilheiros, assistências, avaliações e forma. Previsões de futebol com IA para apostas esportivas.`,

  ja: (league, year) => `${year}/${year + 1}シーズン${league}全選手データ。得点王、アシスト、評価、フォームを詳細分析。ブックメーカー投資・サッカー予想に最適なAI予測。`,

  ko: (league, year) => `${year}/${year + 1}시즌 ${league} 전체 선수 통계. 득점왕, 어시스트, 평점, 폼 분석. 프로토・스포츠토토 예측을 위한 빅데이터 AI 분석.`,

  de: (league, year) => `Vollständige ${league} Spielerstatistiken ${year}/${year + 1}. Torjäger, Vorlagen, Bewertungen und Spielerform. KI-gestützte Fußballvorhersagen für Sportwetten.`,

  fr: (league, year) => `Statistiques complètes des joueurs ${league} ${year}/${year + 1}. Buteurs, passes décisives, notes et forme. Pronostics football IA pour paris sportifs.`,
};

// Multi-language keywords
const keywordsTemplates: Record<string, (league: string, year: number) => string> = {
  en: (league, year) => `${league} players, ${league} top scorers ${year}, ${league} assists, player ratings, ${league} statistics, football betting, soccer predictions`,

  'zh-CN': (league, year) => `${league}球员,${league}射手榜 ${year},${league}助攻榜,球员评分,足球预测,盘口分析,大数据预测,五大联赛,AI预测`,

  'zh-TW': (league, year) => `${league}球員,${league}射手榜 ${year},${league}助攻榜,球員評分,運彩分析,讓分盤,足球預測,AI預測`,

  id: (league, year) => `pemain ${league},top skor ${league} ${year},statistik pemain,prediksi bola,mix parlay,pola gacor,tips taruhan`,

  es: (league, year) => `jugadores ${league},goleadores ${league} ${year},estadísticas,pronósticos fútbol,apuestas deportivas`,

  pt: (league, year) => `jogadores ${league},artilheiros ${league} ${year},estatísticas,previsões futebol,apostas esportivas`,

  ja: (league, year) => `${league}選手,${league}得点王 ${year},選手統計,サッカー予想,ブックメーカー,AI予測`,

  ko: (league, year) => `${league} 선수,${league} 득점왕 ${year},선수 통계,축구 예측,스포츠토토,프로토,빅데이터`,

  de: (league, year) => `${league} Spieler,${league} Torjäger ${year},Spielerstatistiken,Fußball Vorhersagen,Sportwetten`,

  fr: (league, year) => `joueurs ${league},buteurs ${league} ${year},statistiques joueurs,pronostics football,paris sportifs`,
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; league: string }>
}): Promise<Metadata> {
  const { locale, league } = await params;
  const leagueConfig = LEAGUES_CONFIG[league];

  // Get localized league name
  const leagueName = getLocalizedLeagueName(league, locale);
  const englishLeagueName = leagueConfig?.name || league.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const titleFn = titleTemplates[locale] || titleTemplates['en'];
  const descFn = descriptionTemplates[locale] || descriptionTemplates['en'];
  const keywordsFn = keywordsTemplates[locale] || keywordsTemplates['en'];

  const title = titleFn(leagueName, currentYear);
  const description = descFn(leagueName, currentYear);
  const keywords = keywordsFn(leagueName, currentYear);

  // Build canonical and alternate URLs
  const baseUrl = 'https://www.oddsflow.ai';
  const pathWithoutLocale = `/leagues/${league}/players`;
  const canonicalUrl = locale === 'en' ? `${baseUrl}${pathWithoutLocale}` : `${baseUrl}/${locale}${pathWithoutLocale}`;

  const alternateLanguages: Record<string, string> = {
    'en': `${baseUrl}${pathWithoutLocale}`,
    'es': `${baseUrl}/es${pathWithoutLocale}`,
    'pt': `${baseUrl}/pt${pathWithoutLocale}`,
    'de': `${baseUrl}/de${pathWithoutLocale}`,
    'fr': `${baseUrl}/fr${pathWithoutLocale}`,
    'ja': `${baseUrl}/ja${pathWithoutLocale}`,
    'ko': `${baseUrl}/ko${pathWithoutLocale}`,
    'zh-CN': `${baseUrl}/zh${pathWithoutLocale}`,
    'zh-TW': `${baseUrl}/tw${pathWithoutLocale}`,
    'id': `${baseUrl}/id${pathWithoutLocale}`,
    'x-default': `${baseUrl}${pathWithoutLocale}`,
  };

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'OddsFlow',
      url: canonicalUrl,
      locale: locale === 'zh-CN' ? 'zh_CN' : locale === 'zh-TW' ? 'zh_TW' : locale,
      images: [
        {
          url: `${baseUrl}/og-image-players.png`,
          width: 1200,
          height: 630,
          alt: `${englishLeagueName} Player Statistics`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image-players.png`],
    },
  };
}

export default function PlayersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
