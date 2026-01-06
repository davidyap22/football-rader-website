'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TeamStatistics, PlayerStats, getTeamStatsByName, getPlayerStatsByTeam } from '@/lib/supabase';

// League configuration
const LEAGUES_CONFIG: Record<string, { name: string; country: string; logo: string; dbName: string }> = {
  'premier-league': { name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', dbName: 'Premier League' },
  'bundesliga': { name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', dbName: 'Bundesliga' },
  'serie-a': { name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', dbName: 'Serie A' },
  'la-liga': { name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', dbName: 'La Liga' },
  'ligue-1': { name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', dbName: 'Ligue 1' },
  'champions-league': { name: 'Champions League', country: 'UEFA', logo: 'https://media.api-sports.io/football/leagues/2.png', dbName: 'UEFA Champions League' },
};

// Formation positions mapping
const FORMATION_POSITIONS: Record<string, number[][]> = {
  '4-3-3': [[1], [2, 3, 4, 5], [6, 7, 8], [9, 10, 11]],
  '4-4-2': [[1], [2, 3, 4, 5], [6, 7, 8, 9], [10, 11]],
  '4-2-3-1': [[1], [2, 3, 4, 5], [6, 7], [8, 9, 10], [11]],
  '3-5-2': [[1], [2, 3, 4], [5, 6, 7, 8, 9], [10, 11]],
  '3-4-3': [[1], [2, 3, 4], [5, 6, 7, 8], [9, 10, 11]],
  '5-3-2': [[1], [2, 3, 4, 5, 6], [7, 8, 9], [10, 11]],
  '5-4-1': [[1], [2, 3, 4, 5, 6], [7, 8, 9, 10], [11]],
  '4-1-4-1': [[1], [2, 3, 4, 5], [6], [7, 8, 9, 10], [11]],
  '4-5-1': [[1], [2, 3, 4, 5], [6, 7, 8, 9, 10], [11]],
};

export default function TeamProfilePage() {
  const params = useParams();
  const leagueSlug = params.league as string;
  const teamSlug = params.team as string;
  const leagueConfig = LEAGUES_CONFIG[leagueSlug];

  const [team, setTeam] = useState<TeamStatistics | null>(null);
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<string>('');

  useEffect(() => {
    async function fetchTeam() {
      if (!teamSlug || !leagueConfig) return;

      setLoading(true);
      const { data, error } = await getTeamStatsByName(teamSlug, leagueConfig.dbName);

      if (data && !error) {
        setTeam(data);
        setSelectedFormation(data.most_used_formation || '4-3-3');

        // Fetch players for this team
        if (data.team_id) {
          setLoadingPlayers(true);
          const { data: playersData } = await getPlayerStatsByTeam(data.team_id);
          if (playersData) {
            setPlayers(playersData);
          }
          setLoadingPlayers(false);
        }
      }
      setLoading(false);
    }

    fetchTeam();
  }, [teamSlug, leagueConfig]);

  // Render formation pitch
  const renderFormationPitch = (formation: string) => {
    const positions = FORMATION_POSITIONS[formation] || FORMATION_POSITIONS['4-3-3'];

    return (
      <div className="relative w-32 h-48 rounded-xl overflow-hidden bg-gradient-to-b from-emerald-800 to-emerald-900 border-2 border-emerald-600/50 shadow-lg shadow-emerald-500/20">
        {/* Pitch markings */}
        <div className="absolute inset-0">
          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-white/30 rounded-full" />
          {/* Top penalty area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 border-b border-l border-r border-white/30" />
          {/* Bottom penalty area */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 border-t border-l border-r border-white/30" />
        </div>

        {/* Players */}
        <div className="relative h-full flex flex-col justify-around py-2 px-1">
          {positions.map((row, rowIdx) => (
            <div key={rowIdx} className="flex justify-around items-center">
              {row.map((_, playerIdx) => (
                <div
                  key={playerIdx}
                  className={`w-4 h-4 rounded-full ${
                    rowIdx === 0
                      ? 'bg-yellow-400 shadow-yellow-400/50'
                      : 'bg-cyan-400 shadow-cyan-400/50'
                  } shadow-lg ring-2 ring-white/30 transition-transform hover:scale-125`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Formation label */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/50 rounded text-[10px] text-white font-bold">
          {formation}
        </div>
      </div>
    );
  };

  if (!leagueConfig) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <p className="text-gray-400">League not found</p>
      </div>
    );
  }

  const goalDiff = (team?.goals_for_total || 0) - (team?.goals_against_total || 0);
  const points = ((team?.total_wins || 0) * 3) + (team?.total_draws || 0);
  const winRate = team?.total_played ? ((team.total_wins || 0) / team.total_played * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0f] to-[#1a1a2e]" />
      </div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-emerald-500/8 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-14 h-14 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Home</Link>
              <Link href="/predictions" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Predictions</Link>
              <Link href="/leagues" className="text-emerald-400 text-sm font-medium">Leagues</Link>
              <Link href="/performance" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">AI Performance</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href={`/leagues/${leagueSlug}`} className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors mb-6 group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {leagueConfig.name}
          </Link>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <p className="mt-4 text-gray-400">Loading team data...</p>
            </div>
          ) : !team ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">Team not found</p>
            </div>
          ) : (
            <>
              {/* Hero Header */}
              <div className="relative mb-8 rounded-3xl overflow-hidden">
                {/* Background gradient based on team */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-gray-900/80 to-cyan-900/30" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    {/* Team Logo with glow */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all opacity-60" />
                      <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-white/10 backdrop-blur-sm p-4 border border-white/20 shadow-2xl">
                        {team.logo ? (
                          <img src={team.logo} alt={team.team_name || ''} className="w-full h-full object-contain drop-shadow-2xl" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl font-bold">
                            {team.team_name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 text-center lg:text-left">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                        {team.team_name}
                      </h1>

                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                        <span className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 text-sm font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          {team.team_country}
                        </span>
                        {team.team_founded && (
                          <span className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 text-sm font-medium">
                            Est. {team.team_founded}
                          </span>
                        )}
                        <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                          {leagueConfig.name}
                        </span>
                      </div>

                      {/* Venue */}
                      {team.venue_name && (
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-lg">{team.venue_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Season Stats Card */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                      <div className="relative px-8 py-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 text-center">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Season {team.season}</p>
                        <div className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                          {points}
                        </div>
                        <p className="text-gray-400 text-sm">Points</p>
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-4 text-sm">
                          <span className="text-emerald-400 font-semibold">{winRate}%</span>
                          <span className="text-gray-500">Win Rate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                  { label: 'Played', value: team.total_played || 0, color: 'text-white' },
                  { label: 'Wins', value: team.total_wins || 0, color: 'text-emerald-400' },
                  { label: 'Draws', value: team.total_draws || 0, color: 'text-yellow-400' },
                  { label: 'Losses', value: team.total_loses || 0, color: 'text-red-400' },
                  { label: 'Goals For', value: team.goals_for_total || 0, color: 'text-cyan-400' },
                  { label: 'Goals Against', value: team.goals_against_total || 0, color: 'text-purple-400' },
                ].map((stat, idx) => (
                  <div key={idx} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl blur-sm group-hover:blur-md transition-all" />
                    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5 hover:border-white/10 transition-all">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Formation Section */}
                <div className="lg:col-span-1">
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-2xl" />
                    <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>
                        Team Formation
                      </h3>

                      {/* Formation Pitch Display */}
                      <div className="flex justify-center mb-6">
                        {renderFormationPitch(selectedFormation)}
                      </div>

                      {/* All Formations */}
                      {team.all_formations && (
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">All Formations Used</p>
                          <div className="flex flex-wrap gap-2">
                            {team.all_formations.split(',').map((formation, idx) => {
                              const formationTrimmed = formation.trim();
                              const isSelected = selectedFormation === formationTrimmed;
                              const isMostUsed = formationTrimmed === team.most_used_formation;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedFormation(formationTrimmed)}
                                  className={`relative px-3 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ring-2 ring-emerald-500/30'
                                      : 'bg-gray-800/50 text-gray-300 border border-white/5 hover:bg-gray-700/50 hover:text-white hover:border-white/10'
                                  }`}
                                >
                                  {formationTrimmed}
                                  {isMostUsed && (
                                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[8px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-full">
                                      TOP
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance & Discipline */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Stats */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl" />
                    <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        Performance
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Goal Difference', value: goalDiff > 0 ? `+${goalDiff}` : goalDiff, color: goalDiff > 0 ? 'text-emerald-400' : goalDiff < 0 ? 'text-red-400' : 'text-gray-400' },
                          { label: 'Goals/Match', value: team.goals_for_average?.toFixed(2) || '0.00', color: 'text-cyan-400' },
                          { label: 'Conceded/Match', value: team.goals_against_average?.toFixed(2) || '0.00', color: 'text-orange-400' },
                          { label: 'Clean Sheets', value: team.clean_sheets || 0, color: 'text-emerald-400' },
                          { label: 'Failed to Score', value: team.failed_to_score || 0, color: 'text-red-400' },
                        ].map((stat, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                            <span className="text-gray-400">{stat.label}</span>
                            <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Discipline Stats */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-red-500/5 rounded-2xl" />
                    <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        Discipline
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">Yellow Cards</span>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-5 rounded-sm bg-yellow-400" />
                            <span className="font-bold text-lg text-yellow-400">{team.yellow_cards_total || 0}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-400">Red Cards</span>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-5 rounded-sm bg-red-500" />
                            <span className="font-bold text-lg text-red-400">{team.red_cards_total || 0}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400">Cards/Match</span>
                          <span className="font-bold text-lg text-orange-400">
                            {team.total_played ? (((team.yellow_cards_total || 0) + (team.red_cards_total || 0)) / team.total_played).toFixed(1) : '0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Form */}
              {team.form && (
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-yellow-500/5 to-red-500/5 rounded-2xl" />
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      Recent Form
                      <span className="text-gray-500 text-sm font-normal ml-2">Last {team.form.length} matches</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {team.form.split('').map((result, idx) => (
                        <div
                          key={idx}
                          className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-transform hover:scale-110 ${
                            result === 'W'
                              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                              : result === 'D'
                              ? 'bg-gradient-to-br from-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/30'
                              : 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500" />
                        <span className="text-gray-400">Win: {team.form.split('').filter(r => r === 'W').length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-yellow-500" />
                        <span className="text-gray-400">Draw: {team.form.split('').filter(r => r === 'D').length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span className="text-gray-400">Loss: {team.form.split('').filter(r => r === 'L').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Squad Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 rounded-2xl" />
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      Squad
                    </h3>
                    <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20">
                      {players.length} Players
                    </span>
                  </div>

                  {loadingPlayers ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                  ) : players.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-900/95">
                          <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
                            <th className="text-left py-3 px-4 font-semibold">Player</th>
                            <th className="text-center py-3 px-3 font-semibold">Position</th>
                            <th className="text-center py-3 px-3 font-semibold">Age</th>
                            <th className="text-center py-3 px-3 font-semibold">Apps</th>
                            <th className="text-center py-3 px-3 font-semibold">Minutes</th>
                            <th className="text-center py-3 px-3 font-semibold">Goals</th>
                            <th className="text-center py-3 px-3 font-semibold">Assists</th>
                            <th className="text-center py-3 px-3 font-semibold">Rating</th>
                            <th className="text-center py-3 px-3 font-semibold"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {players.map((player) => (
                            <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    {player.photo ? (
                                      <img src={player.photo} alt={player.player_name || ''} className="w-10 h-10 rounded-xl object-cover bg-gray-700 ring-2 ring-white/10" />
                                    ) : (
                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400 text-sm font-medium ring-2 ring-white/10">
                                        {player.player_name?.charAt(0) || '?'}
                                      </div>
                                    )}
                                    {player.captain && (
                                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-black">
                                        C
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-white font-medium group-hover:text-emerald-400 transition-colors">{player.player_name}</span>
                                      {player.injured && (
                                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500/20 text-red-400 rounded">INJ</span>
                                      )}
                                    </div>
                                    <span className="text-gray-500 text-xs">{player.nationality}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-center py-3 px-3">
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                  player.position === 'Goalkeeper' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                                  player.position === 'Defender' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                                  player.position === 'Midfielder' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                  'bg-red-500/20 text-red-400 border border-red-500/20'
                                }`}>
                                  {player.position || '-'}
                                </span>
                              </td>
                              <td className="text-center py-3 px-3 text-gray-300">{player.age || '-'}</td>
                              <td className="text-center py-3 px-3 text-gray-300">{player.appearances || 0}</td>
                              <td className="text-center py-3 px-3 text-gray-400">{player.minutes || 0}</td>
                              <td className="text-center py-3 px-3">
                                <span className="text-emerald-400 font-semibold">{player.goals_total || 0}</span>
                              </td>
                              <td className="text-center py-3 px-3">
                                <span className="text-cyan-400 font-semibold">{player.assists || 0}</span>
                              </td>
                              <td className="text-center py-3 px-3">
                                {player.rating ? (
                                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                    player.rating >= 7.5 ? 'bg-emerald-500/20 text-emerald-400' :
                                    player.rating >= 7 ? 'bg-green-500/20 text-green-400' :
                                    player.rating >= 6.5 ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {Number(player.rating).toFixed(1)}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </td>
                              <td className="text-center py-3 px-3">
                                <Link
                                  href={`/leagues/${leagueSlug}/player/${player.id}`}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                                >
                                  View Profile
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No player data available</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>18+ | Gambling involves risk. Please gamble responsibly.</p>
        <p className="mt-2">© 2025 OddsFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
