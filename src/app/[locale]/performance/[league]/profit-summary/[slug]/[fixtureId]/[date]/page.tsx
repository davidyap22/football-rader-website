import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProfitSummaryClient from './ProfitSummaryClient';

interface PageProps {
  params: Promise<{
    locale: string;
    league: string;
    slug: string;
    fixtureId: string;
    date: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, league, slug, fixtureId, date } = await params;

  // Convert slug to readable team names
  const teams = slug.replace(/-vs-/g, ' vs ').replace(/-/g, ' ');
  const leagueName = league.replace(/-/g, ' ');

  const title = `${teams} Profit Summary | ${leagueName} | OddsFlow`;
  const description = `AI betting performance and profit analysis for ${teams}. View detailed bet records, ROI, and market breakdown for this ${leagueName} match.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'OddsFlow',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function ProfitSummaryPage({ params }: PageProps) {
  const { locale, league, slug, fixtureId, date } = await params;

  // Fetch match data
  let matchData = null;
  let betRecords: any[] = [];

  try {
    // Fetch fixture info from prematch table
    const { data: fixtureData } = await supabase
      .from('prematch')
      .select('fixture_id, league_name, league_logo, home_name, home_logo, away_name, away_logo, home_score, away_score, match_date')
      .eq('fixture_id', parseInt(fixtureId))
      .single();

    if (fixtureData) {
      matchData = fixtureData;
    }

    // Fetch all bet records for this fixture
    const { data: profitData } = await supabase
      .from('profit_summary')
      .select('*')
      .eq('fixture_id', fixtureId)
      .order('clock', { ascending: true });

    if (profitData && profitData.length > 0) {
      betRecords = profitData;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Calculate summary stats from records
  const totalProfit = betRecords.reduce((sum, r) => sum + (r.profit ?? 0), 0);
  const totalInvested = betRecords.reduce((sum, r) => sum + (r.stake_money ?? 0), 0);
  const totalBets = betRecords.length;
  const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Helper to determine bet type
  const getBetType = (selection: string | null): 'moneyline' | 'handicap' | 'ou' => {
    if (!selection) return 'ou';
    const sel = selection.toLowerCase();
    if (sel.includes('hdp') || sel.includes('handicap')) return 'handicap';
    if (sel.includes('over') || sel.includes('under')) return 'ou';
    if (/^(home|away)\s*[+-]?\d/.test(sel)) return 'handicap';
    if (sel === 'home' || sel === 'draw' || sel === 'away') return 'moneyline';
    return 'ou';
  };

  const profitMoneyline = betRecords.filter(r => getBetType(r.selection) === 'moneyline').reduce((sum, r) => sum + (r.profit ?? 0), 0);
  const profitHandicap = betRecords.filter(r => getBetType(r.selection) === 'handicap').reduce((sum, r) => sum + (r.profit ?? 0), 0);
  const profitOU = betRecords.filter(r => getBetType(r.selection) === 'ou').reduce((sum, r) => sum + (r.profit ?? 0), 0);

  // Convert slug to team names for display
  const teamNames = slug.replace(/-vs-/g, ' vs ').split(' vs ').map(name =>
    name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  );
  const homeTeam = matchData?.home_name || teamNames[0] || 'Home';
  const awayTeam = matchData?.away_name || teamNames[1] || 'Away';

  return (
    <ProfitSummaryClient
      locale={locale}
      league={league}
      fixtureId={fixtureId}
      date={date}
      homeTeam={homeTeam}
      awayTeam={awayTeam}
      homeLogo={matchData?.home_logo}
      awayLogo={matchData?.away_logo}
      homeScore={matchData?.home_score}
      awayScore={matchData?.away_score}
      leagueName={matchData?.league_name || league.replace(/-/g, ' ')}
      leagueLogo={matchData?.league_logo}
      totalProfit={totalProfit}
      totalInvested={totalInvested}
      totalBets={totalBets}
      roi={roi}
      profitMoneyline={profitMoneyline}
      profitHandicap={profitHandicap}
      profitOU={profitOU}
      betRecords={betRecords}
    />
  );
}
