import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import RealBetResultsClient from './RealBetResultsClient';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

// SEO translations for all locales
const SEO_TEMPLATES: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Real Bet Results | Verified Betting Records | OddsFlow',
    description: 'View verified real betting results with PDF proof. Track actual wagers placed by OddsFlow AI with complete transparency and downloadable bet slips.',
  },
  es: {
    title: 'Resultados Reales | Registros de Apuestas Verificados | OddsFlow',
    description: 'Ver resultados reales de apuestas verificados con prueba PDF. Rastrea las apuestas reales realizadas por OddsFlow AI con total transparencia.',
  },
  pt: {
    title: 'Resultados Reais | Registros de Apostas Verificados | OddsFlow',
    description: 'Veja resultados reais de apostas verificados com prova em PDF. Acompanhe as apostas reais feitas pela OddsFlow AI com total transparência.',
  },
  de: {
    title: 'Echte Wettergebnisse | Verifizierte Wettaufzeichnungen | OddsFlow',
    description: 'Sehen Sie verifizierte echte Wettergebnisse mit PDF-Nachweis. Verfolgen Sie tatsächliche Wetten von OddsFlow AI mit vollständiger Transparenz.',
  },
  fr: {
    title: 'Résultats Réels | Paris Vérifiés | OddsFlow',
    description: 'Consultez les résultats de paris réels vérifiés avec preuve PDF. Suivez les paris réels placés par OddsFlow AI en toute transparence.',
  },
  ja: {
    title: '実際の賭け結果 | 検証済みベッティング記録 | OddsFlow',
    description: 'PDF証明付きの検証済み実際のベッティング結果を確認。OddsFlow AIが実際に行った賭けを完全な透明性でトラッキング。',
  },
  ko: {
    title: '실제 베팅 결과 | 검증된 베팅 기록 | OddsFlow',
    description: 'PDF 증명이 포함된 검증된 실제 베팅 결과를 확인하세요. OddsFlow AI가 실제로 배팅한 내역을 완전한 투명성으로 추적합니다.',
  },
  zh: {
    title: '真实投注结果 | 已验证投注记录 | OddsFlow',
    description: '查看带PDF证明的已验证真实投注结果。完全透明地追踪OddsFlow AI实际下注情况。',
  },
  tw: {
    title: '真實投注結果 | 已驗證投注記錄 | OddsFlow',
    description: '查看帶PDF證明的已驗證真實投注結果。完全透明地追蹤OddsFlow AI實際下注情況。',
  },
  id: {
    title: 'Hasil Taruhan Nyata | Catatan Taruhan Terverifikasi | OddsFlow',
    description: 'Lihat hasil taruhan nyata terverifikasi dengan bukti PDF. Lacak taruhan aktual yang ditempatkan oleh OddsFlow AI dengan transparansi penuh.',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const template = SEO_TEMPLATES[locale] || SEO_TEMPLATES.en;

  return {
    title: template.title,
    description: template.description,
    openGraph: {
      title: template.title,
      description: template.description,
      type: 'website',
      siteName: 'OddsFlow',
      url: `https://oddsflow.ai/${locale}/performance/real-bet-results`,
    },
    twitter: {
      card: 'summary_large_image',
      title: template.title,
      description: template.description,
    },
    alternates: {
      canonical: `https://oddsflow.ai/${locale}/performance/real-bet-results`,
    },
  };
}

export default async function RealBetResultsPage({ params }: PageProps) {
  const { locale } = await params;

  // Fetch all real bet results with match info
  let realBetResults: any[] = [];

  try {
    const { data, error } = await supabase
      .from('real_bet_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      realBetResults = data;
    }
  } catch (error) {
    console.error('Error fetching real bet results:', error);
  }

  // Get unique fixture_ids to fetch match info
  const fixtureIds = [...new Set(realBetResults.map(r => r.fixture_id))];

  // Fetch match info for all fixtures
  let matchesInfo: Record<number, any> = {};
  if (fixtureIds.length > 0) {
    const { data: matchData } = await supabase
      .from('prematches')
      .select('fixture_id, home_name, away_name, league_name, goals_home, goals_away, start_date_msia')
      .in('fixture_id', fixtureIds);

    if (matchData) {
      matchData.forEach((match: any) => {
        matchesInfo[match.fixture_id] = match;
      });
    }
  }

  // Merge match info with bet results
  const enrichedResults = realBetResults.map(result => ({
    ...result,
    match: matchesInfo[result.fixture_id] || null,
  }));

  // Calculate totals
  const totalBets = enrichedResults.reduce((sum, r) => sum + (r.total_bets || 0), 0);
  const totalProfit = enrichedResults.reduce((sum, r) => sum + (r.profit_or_loss || 0), 0);
  const totalMatches = new Set(enrichedResults.map(r => r.fixture_id)).size;

  return (
    <RealBetResultsClient
      locale={locale}
      results={enrichedResults}
      totalBets={totalBets}
      totalProfit={totalProfit}
      totalMatches={totalMatches}
    />
  );
}
