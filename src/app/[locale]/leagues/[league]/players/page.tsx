import { getLeaguePlayersData, LEAGUES_CONFIG, LeaguePlayerData } from '@/lib/team-data';
import PlayersClient from './PlayersClient';

interface PageProps {
  params: Promise<{
    locale: string;
    league: string;
  }>;
}

export default async function PlayersPage({ params }: PageProps) {
  const { locale, league } = await params;
  const leagueConfig = LEAGUES_CONFIG[league];

  let players: LeaguePlayerData[] = [];
  let topScorers: LeaguePlayerData[] = [];
  let topAssists: LeaguePlayerData[] = [];
  let highestRated: LeaguePlayerData[] = [];

  if (leagueConfig) {
    const data = await getLeaguePlayersData(leagueConfig.dbName);
    players = data.players;
    topScorers = data.topScorers;
    topAssists = data.topAssists;
    highestRated = data.highestRated;
  }

  const leagueName = leagueConfig?.name || league.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <PlayersClient
      initialPlayers={players}
      topScorers={topScorers}
      topAssists={topAssists}
      highestRated={highestRated}
      leagueName={leagueName}
      leagueSlug={league}
    />
  );
}
