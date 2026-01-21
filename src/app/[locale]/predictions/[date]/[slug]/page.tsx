import { Metadata } from 'next';
import { Suspense } from 'react';
import MatchDetailClient from './MatchDetailClient';
import { parseFixtureIdFromSlug } from '@/lib/slug-utils';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for metadata
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Helper to fetch match data for SEO
async function getMatchData(fixtureId: number) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('prematches')
      .select('home_name, away_name, league_name, start_date_msia')
      .eq('fixture_id', fixtureId)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// SEO-optimized titles for all 10 languages
const titleTemplates: Record<string, string> = {
  en: '{home} vs {away} Prediction & AI Betting Tips',
  es: '{home} vs {away} Predicción y Tips de Apuestas IA',
  pt: '{home} vs {away} Previsão e Dicas de Apostas IA',
  de: '{home} vs {away} Vorhersage & KI-Wetttipps',
  fr: '{home} vs {away} Pronostic & Conseils Paris IA',
  ja: '{home} vs {away} 予測とAIベッティングヒント',
  ko: '{home} vs {away} 예측 및 AI 베팅 팁',
  zh: '{home} vs {away} 预测与AI投注技巧',
  tw: '{home} vs {away} 預測與AI投注技巧',
  id: '{home} vs {away} Prediksi & Tips Taruhan AI',
};

// SEO-optimized descriptions for all 10 languages
const descriptionTemplates: Record<string, string> = {
  en: 'Get AI-powered predictions for {home} vs {away} in {league}. Expert 1x2 match result, over/under goals, and Asian handicap analysis with real-time odds comparison.',
  es: 'Obtén predicciones IA para {home} vs {away} en {league}. Análisis experto 1x2, over/under goles y hándicap asiático con comparación de cuotas en tiempo real.',
  pt: 'Obtenha previsões IA para {home} vs {away} na {league}. Análise especializada 1x2, over/under gols e handicap asiático com comparação de odds em tempo real.',
  de: 'Erhalten Sie KI-Vorhersagen für {home} vs {away} in {league}. Experten-1x2-Analyse, Over/Under Tore und Asian Handicap mit Echtzeit-Quotenvergleich.',
  fr: 'Obtenez les pronostics IA pour {home} vs {away} en {league}. Analyse experte 1x2, over/under buts et handicap asiatique avec comparaison des cotes en temps réel.',
  ja: '{league}の{home} vs {away}のAI予測を取得。専門家による1x2分析、オーバー/アンダーゴール、アジアンハンディキャップとリアルタイムオッズ比較。',
  ko: '{league}에서 {home} vs {away}의 AI 예측을 받으세요. 전문 1x2 분석, 오버/언더 골, 아시안 핸디캡 및 실시간 배당률 비교.',
  zh: '获取{league}{home} vs {away}的AI预测。专业1x2分析、大小球、亚洲盘口及实时赔率比较。',
  tw: '獲取{league}{home} vs {away}的AI預測。專業1x2分析、大小球、亞洲盤口及實時賠率比較。',
  id: 'Dapatkan prediksi AI untuk {home} vs {away} di {league}. Analisis ahli 1x2, over/under gol, dan Asian handicap dengan perbandingan odds real-time.',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; date: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, date, slug } = await params;
  const baseUrl = 'https://www.oddsflow.ai';

  // Parse fixture ID from slug
  const fixtureId = parseFixtureIdFromSlug(slug);

  // Default values if we can't fetch match data
  let homeName = 'Home Team';
  let awayName = 'Away Team';
  let leagueName = 'Football';

  // Try to fetch match data for SEO
  if (fixtureId) {
    const matchData = await getMatchData(fixtureId);
    if (matchData) {
      homeName = matchData.home_name || homeName;
      awayName = matchData.away_name || awayName;
      leagueName = matchData.league_name || leagueName;
    }
  }

  // Generate localized title and description
  const titleTemplate = titleTemplates[locale] || titleTemplates.en;
  const descTemplate = descriptionTemplates[locale] || descriptionTemplates.en;

  const title = titleTemplate
    .replace('{home}', homeName)
    .replace('{away}', awayName);

  const description = descTemplate
    .replace('{home}', homeName)
    .replace('{away}', awayName)
    .replace('{league}', leagueName);

  // Canonical URL
  const canonicalPath = locale === 'en'
    ? `/predictions/${date}/${slug}`
    : `/${locale}/predictions/${date}/${slug}`;

  return {
    title,
    description,
    keywords: [
      `${homeName} vs ${awayName} prediction`,
      `${homeName} ${awayName} betting tips`,
      `${leagueName} predictions`,
      'AI football predictions',
      '1x2 prediction',
      'over under prediction',
      'Asian handicap tips',
      'football betting analysis',
    ],
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}${canonicalPath}`,
      images: [
        {
          url: '/homepage/OddsFlow Logo2.png',
          width: 1200,
          height: 630,
          alt: `${homeName} vs ${awayName} Prediction`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/homepage/OddsFlow Logo2.png'],
    },
  };
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading match data...</p>
      </div>
    </div>
  );
}

export default function MatchDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MatchDetailClient />
    </Suspense>
  );
}
