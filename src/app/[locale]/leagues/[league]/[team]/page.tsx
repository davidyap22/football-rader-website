import { getTeamData, LEAGUES_CONFIG, slugToDisplayName, TeamStatisticsData, PlayerStatsData } from '@/lib/team-data';
import TeamClient from './TeamClient';
import { TeamStatistics, PlayerStats } from '@/lib/supabase';

// Convert server data types to client types (they should match, but ensure compatibility)
function convertTeamData(data: TeamStatisticsData | null): TeamStatistics | null {
  if (!data) return null;
  return data as unknown as TeamStatistics;
}

function convertPlayerData(data: PlayerStatsData[]): PlayerStats[] {
  return data as unknown as PlayerStats[];
}

interface PageProps {
  params: Promise<{
    locale: string;
    league: string;
    team: string;
  }>;
}

export default async function TeamPage({ params }: PageProps) {
  const { league, team } = await params;

  const leagueConfig = LEAGUES_CONFIG[league];

  // Fetch initial data server-side
  let initialTeam: TeamStatistics | null = null;
  let initialPlayers: PlayerStats[] = [];

  if (leagueConfig) {
    const { teamStats, players } = await getTeamData(team, leagueConfig.dbName);
    initialTeam = convertTeamData(teamStats);
    initialPlayers = convertPlayerData(players);
  }

  return (
    <TeamClient
      initialTeam={initialTeam}
      initialPlayers={initialPlayers}
    />
  );
}
