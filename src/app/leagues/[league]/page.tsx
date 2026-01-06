'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, TeamStatistics, getTeamStatisticsByLeague, PlayerStats, getPlayerStatsByTeam } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Extended team type with calculated fields
interface TeamWithStats extends TeamStatistics {
  points: number;
  goal_difference: number;
}

// League configuration
const LEAGUES_CONFIG: Record<string, { name: string; country: string; logo: string; dbName: string }> = {
  'premier-league': { name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', dbName: 'Premier League' },
  'bundesliga': { name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', dbName: 'Bundesliga' },
  'serie-a': { name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', dbName: 'Serie A' },
  'la-liga': { name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', dbName: 'La Liga' },
  'ligue-1': { name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', dbName: 'Ligue 1' },
  'champions-league': { name: 'Champions League', country: 'UEFA', logo: 'https://media.api-sports.io/football/leagues/2.png', dbName: 'UEFA Champions League' },
};

export default function LeagueDetailPage() {
  const params = useParams();
  const leagueSlug = params.league as string;
  const leagueConfig = LEAGUES_CONFIG[leagueSlug];

  const [teamStats, setTeamStats] = useState<TeamWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
  const [selectedFormations, setSelectedFormations] = useState<Record<number, string>>({});
  const [playerStats, setPlayerStats] = useState<Record<number, PlayerStats[]>>({});
  const [loadingPlayers, setLoadingPlayers] = useState<number | null>(null);

  // Check auth session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  // Fetch team statistics
  useEffect(() => {
    async function fetchStats() {
      if (!leagueConfig) return;

      setLoading(true);
      const { data, error } = await getTeamStatisticsByLeague(leagueConfig.dbName);

      if (data && !error) {
        setTeamStats(data as TeamWithStats[]);
      }
      setLoading(false);
    }

    fetchStats();
  }, [leagueConfig]);

  // Handle team expansion and fetch player stats
  const handleTeamClick = async (team: TeamWithStats) => {
    console.log('Team clicked:', team.team_name, 'team_id:', team.team_id);

    if (expandedTeamId === team.id) {
      setExpandedTeamId(null);
      return;
    }

    setExpandedTeamId(team.id);

    // Fetch player stats if not already loaded
    if (team.team_id && !playerStats[team.team_id]) {
      console.log('Fetching players for team_id:', team.team_id);
      setLoadingPlayers(team.team_id);
      const { data, error } = await getPlayerStatsByTeam(team.team_id);
      console.log('Player stats result:', { data, error, count: data?.length });
      if (data && !error) {
        setPlayerStats(prev => ({ ...prev, [team.team_id!]: data }));
      }
      setLoadingPlayers(null);
    } else {
      console.log('No team_id or already loaded:', { team_id: team.team_id, hasData: team.team_id ? !!playerStats[team.team_id] : false });
    }
  };

  // Render football pitch with formation
  const renderFormationPitch = (formation: string | null) => {
    if (!formation) return null;

    // Parse formation (e.g., "4-3-3" → [4, 3, 3])
    const lines = formation.split('-').map(n => parseInt(n)).filter(n => !isNaN(n));
    if (lines.length === 0) return null;

    // Calculate player positions
    const getPlayerPositions = () => {
      const positions: { x: number; y: number; isGoalkeeper?: boolean }[] = [];

      // Goalkeeper
      positions.push({ x: 50, y: 90, isGoalkeeper: true });

      // Field players - distribute across the pitch
      const totalLines = lines.length;
      lines.forEach((playersInLine, lineIndex) => {
        // Y position: from defense (80%) to attack (15%)
        const y = 80 - (lineIndex * (65 / totalLines));

        // X positions: evenly distribute players
        for (let i = 0; i < playersInLine; i++) {
          const x = ((i + 1) * 100) / (playersInLine + 1);
          positions.push({ x, y });
        }
      });

      return positions;
    };

    const positions = getPlayerPositions();

    return (
      <div className="relative w-full aspect-[3/4] max-w-[200px] bg-emerald-900/30 rounded-xl overflow-hidden border border-emerald-500/20">
        {/* Pitch markings */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="xMidYMid meet">
          {/* Pitch background */}
          <rect x="0" y="0" width="100" height="130" fill="transparent" />

          {/* Pitch outline */}
          <rect x="5" y="5" width="90" height="120" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

          {/* Center line */}
          <line x1="5" y1="65" x2="95" y2="65" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

          {/* Center circle */}
          <circle cx="50" cy="65" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <circle cx="50" cy="65" r="1" fill="rgba(255,255,255,0.3)" />

          {/* Penalty area - bottom */}
          <rect x="20" y="95" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <rect x="32" y="110" width="36" height="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <circle cx="50" cy="105" r="1" fill="rgba(255,255,255,0.3)" />

          {/* Penalty area - top */}
          <rect x="20" y="5" width="60" height="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <rect x="32" y="5" width="36" height="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <circle cx="50" cy="17" r="1" fill="rgba(255,255,255,0.3)" />

          {/* Players */}
          {positions.map((pos, idx) => (
            <g key={idx}>
              <circle
                cx={pos.x}
                cy={pos.y + 5}
                r={pos.isGoalkeeper ? 4 : 3.5}
                fill={pos.isGoalkeeper ? '#fbbf24' : '#10b981'}
                stroke="white"
                strokeWidth="0.8"
              />
            </g>
          ))}
        </svg>

        {/* Formation label */}
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-xs font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded">{formation}</span>
        </div>
      </div>
    );
  };

  // Render form badges (W/D/L)
  const renderForm = (form: string | null) => {
    if (!form) return null;
    return form.split('').slice(-5).map((result, index) => {
      let bgColor = 'bg-gray-600';
      if (result === 'W') bgColor = 'bg-emerald-500';
      else if (result === 'D') bgColor = 'bg-yellow-500';
      else if (result === 'L') bgColor = 'bg-red-500';
      return (
        <span key={index} className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-white ${bgColor}`}>
          {result}
        </span>
      );
    });
  };

  // 404 for unknown leagues
  if (!leagueConfig) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">League Not Found</h1>
          <Link href="/leagues" className="text-emerald-400 hover:underline">
            Back to Leagues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0a0a0f] to-[#1a1a2e]" />
      </div>

      {/* Ambient Effects */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
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
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Community</Link>
              <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">News</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {user ? (
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-bold text-sm">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">Log In</Link>
                  <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer hidden sm:block">Get Started</Link>
                </>
              )}

              {/* World Cup Button */}
              <Link
                href="/worldcup"
                className="relative hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.7)] transition-all cursor-pointer group overflow-hidden hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                <img src="/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png" alt="FIFA World Cup 2026" className="h-5 w-auto object-contain relative z-10" />
                <span className="text-black font-semibold text-sm relative z-10">FIFA 2026</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/leagues" className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Leagues
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between gap-4 md:gap-6 mb-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center p-3">
                <img src={leagueConfig.logo} alt={leagueConfig.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{leagueConfig.name}</h1>
                <p className="text-emerald-400 text-lg">{leagueConfig.country} {teamStats.length > 0 ? `• ${teamStats[0]?.season || 2024} Season` : ''}</p>
              </div>
            </div>
            <Link
              href={`/leagues/${leagueSlug}/player`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 font-medium hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all border border-emerald-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              View All Players
            </Link>
          </div>

          {/* Stats Summary */}
          {!loading && teamStats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Teams</p>
                <p className="text-2xl font-bold text-white">{teamStats.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Total Goals</p>
                <p className="text-2xl font-bold text-emerald-400">{teamStats.reduce((sum, t) => sum + (t.goals_for_total || 0), 0)}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Avg Goals/Match</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {(teamStats.reduce((sum, t) => sum + (t.goals_for_average || 0), 0) / teamStats.length).toFixed(2)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Clean Sheets</p>
                <p className="text-2xl font-bold text-purple-400">{teamStats.reduce((sum, t) => sum + (t.clean_sheets || 0), 0)}</p>
              </div>
            </div>
          )}

          {/* Standings Table */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : teamStats.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No statistics available for this league</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-900/95">
                    <tr className="text-xs text-gray-400 uppercase tracking-wider">
                      <th className="text-left py-4 px-4 font-semibold">#</th>
                      <th className="text-left py-4 px-4 font-semibold">Team</th>
                      <th className="text-center py-4 px-2 font-semibold">P</th>
                      <th className="text-center py-4 px-2 font-semibold">W</th>
                      <th className="text-center py-4 px-2 font-semibold">D</th>
                      <th className="text-center py-4 px-2 font-semibold">L</th>
                      <th className="text-center py-4 px-2 font-semibold">GF</th>
                      <th className="text-center py-4 px-2 font-semibold">GA</th>
                      <th className="text-center py-4 px-2 font-semibold">GD</th>
                      <th className="text-center py-4 px-2 font-semibold">Pts</th>
                      <th className="text-center py-4 px-4 font-semibold hidden md:table-cell">Form</th>
                      <th className="text-center py-4 px-4 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teamStats.map((team, index) => (
                      <React.Fragment key={team.id}>
                        <tr
                          onClick={() => handleTeamClick(team)}
                          className={`hover:bg-white/5 transition-colors cursor-pointer ${
                            index < 4 ? 'border-l-2 border-l-emerald-500' :
                            index >= teamStats.length - 3 ? 'border-l-2 border-l-red-500' : ''
                          } ${expandedTeamId === team.id ? 'bg-white/5' : ''}`}
                        >
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              index < 4 ? 'bg-emerald-500/20 text-emerald-400' :
                              index >= teamStats.length - 3 ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-700/50 text-gray-400'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {team.logo && (
                                <img src={team.logo} alt={team.team_name || ''} className="w-8 h-8 object-contain" />
                              )}
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{team.team_name}</span>
                                <svg className={`w-4 h-4 text-gray-500 transition-transform ${expandedTeamId === team.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-2 text-gray-300">{team.total_played || 0}</td>
                          <td className="text-center py-4 px-2 text-emerald-400 font-medium">{team.total_wins || 0}</td>
                          <td className="text-center py-4 px-2 text-yellow-400">{team.total_draws || 0}</td>
                          <td className="text-center py-4 px-2 text-red-400">{team.total_loses || 0}</td>
                          <td className="text-center py-4 px-2 text-gray-300">{team.goals_for_total || 0}</td>
                          <td className="text-center py-4 px-2 text-gray-300">{team.goals_against_total || 0}</td>
                          <td className={`text-center py-4 px-2 font-medium ${
                            team.goal_difference > 0 ? 'text-emerald-400' :
                            team.goal_difference < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                          </td>
                          <td className="text-center py-4 px-2">
                            <span className="inline-flex items-center justify-center min-w-[36px] px-2 py-1.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                              {team.points}
                            </span>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              {renderForm(team.form)}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Link
                              href={`/leagues/${leagueSlug}/${team.team_name?.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
                            >
                              Profile
                            </Link>
                          </td>
                        </tr>
                        {/* Expanded Team Details */}
                        {expandedTeamId === team.id && (
                          <tr key={`${team.id}-details`} className="bg-gradient-to-r from-emerald-500/5 to-cyan-500/5">
                            <td colSpan={12} className="py-6 px-4">
                              <div className="flex flex-col lg:flex-row gap-6">
                                {/* Formation Pitch */}
                                <div className="flex-shrink-0">
                                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Formation</p>
                                  {renderFormationPitch(selectedFormations[team.id] || team.most_used_formation)}
                                </div>

                                {/* Stats Grid */}
                                <div className="flex-1">
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {/* All Formations */}
                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10 col-span-2 md:col-span-3 lg:col-span-4">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">All Formations Used <span className="text-gray-500 normal-case">(click to view)</span></p>
                                      <div className="flex flex-wrap gap-2">
                                        {team.all_formations ? (
                                          team.all_formations.split(',').map((formation, idx) => {
                                            const formationTrimmed = formation.trim();
                                            const isSelected = (selectedFormations[team.id] || team.most_used_formation) === formationTrimmed;
                                            const isMostUsed = formationTrimmed === team.most_used_formation;
                                            return (
                                              <button
                                                key={idx}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedFormations(prev => ({ ...prev, [team.id]: formationTrimmed }));
                                                }}
                                                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                                                  isSelected
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ring-2 ring-emerald-500/50'
                                                    : 'bg-gray-800 text-gray-300 border border-white/10 hover:bg-gray-700 hover:text-white'
                                                }`}
                                              >
                                                {formationTrimmed}
                                                {isMostUsed && (
                                                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-black rounded-full">
                                                    TOP
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          })
                                        ) : (
                                          <span className="text-gray-500">No formation data available</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Additional Stats */}
                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Clean Sheets</p>
                                      <p className="text-2xl font-bold text-cyan-400">{team.clean_sheets || 0}</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Failed to Score</p>
                                      <p className="text-2xl font-bold text-red-400">{team.failed_to_score || 0}</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Goals/Match Avg</p>
                                      <p className="text-2xl font-bold text-purple-400">{team.goals_for_average?.toFixed(2) || '0.00'}</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-900/50 border border-white/10">
                                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Cards (Y/R)</p>
                                      <p className="text-2xl font-bold">
                                        <span className="text-yellow-400">{team.yellow_cards_total || 0}</span>
                                        <span className="text-gray-500 mx-1">/</span>
                                        <span className="text-red-400">{team.red_cards_total || 0}</span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Player Stats Section */}
                                  <div className="mt-6">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Squad Players</p>
                                    {loadingPlayers === team.team_id ? (
                                      <div className="flex items-center justify-center py-8">
                                        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                      </div>
                                    ) : team.team_id && playerStats[team.team_id] && playerStats[team.team_id].length > 0 ? (
                                      <div className="overflow-x-auto rounded-xl border border-white/10">
                                        <table className="w-full min-w-[700px]">
                                          <thead className="bg-gray-900/80">
                                            <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
                                              <th className="text-left py-2.5 px-3 font-semibold">Player</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">Pos</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">Age</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">Apps</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">Mins</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">Goals</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">Assists</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">Rating</th>
                                              <th className="text-center py-2.5 px-2 font-semibold">Y/R</th>
                                              <th className="text-center py-2.5 px-2 font-semibold"></th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-white/5">
                                            {playerStats[team.team_id].map((player) => (
                                              <tr key={player.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-2.5 px-3">
                                                  <div className="flex items-center gap-2">
                                                    {player.photo ? (
                                                      <img src={player.photo} alt={player.player_name || ''} className="w-8 h-8 rounded-full object-cover bg-gray-700" />
                                                    ) : (
                                                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                                                        {player.player_name?.charAt(0) || '?'}
                                                      </div>
                                                    )}
                                                    <div>
                                                      <div className="flex items-center gap-1.5">
                                                        <span className="text-white text-sm font-medium">{player.player_name}</span>
                                                        {player.captain && (
                                                          <span className="px-1 py-0.5 text-[9px] font-bold bg-amber-500 text-black rounded">C</span>
                                                        )}
                                                        {player.injured && (
                                                          <span className="px-1 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded">INJ</span>
                                                        )}
                                                      </div>
                                                      <span className="text-gray-500 text-[10px]">{player.nationality}</span>
                                                    </div>
                                                  </div>
                                                </td>
                                                <td className="text-center py-2.5 px-2">
                                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                                    player.position === 'Goalkeeper' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    player.position === 'Defender' ? 'bg-blue-500/20 text-blue-400' :
                                                    player.position === 'Midfielder' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-red-500/20 text-red-400'
                                                  }`}>
                                                    {player.position?.substring(0, 3).toUpperCase() || '-'}
                                                  </span>
                                                </td>
                                                <td className="text-center py-2.5 px-2 text-gray-300 text-sm">{player.age || '-'}</td>
                                                <td className="text-center py-2.5 px-2 text-gray-300 text-sm">{player.appearances || 0}</td>
                                                <td className="text-center py-2.5 px-2 text-gray-400 text-sm">{player.minutes || 0}</td>
                                                <td className="text-center py-2.5 px-2 text-emerald-400 font-semibold text-sm">{player.goals_total || 0}</td>
                                                <td className="text-center py-2.5 px-2 text-cyan-400 font-semibold text-sm">{player.assists || 0}</td>
                                                <td className="text-center py-2.5 px-2">
                                                  {player.rating ? (
                                                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                                                      player.rating >= 7.5 ? 'bg-emerald-500/20 text-emerald-400' :
                                                      player.rating >= 7 ? 'bg-green-500/20 text-green-400' :
                                                      player.rating >= 6.5 ? 'bg-yellow-500/20 text-yellow-400' :
                                                      'bg-red-500/20 text-red-400'
                                                    }`}>
                                                      {Number(player.rating).toFixed(1)}
                                                    </span>
                                                  ) : (
                                                    <span className="text-gray-500 text-sm">-</span>
                                                  )}
                                                </td>
                                                <td className="text-center py-2.5 px-2">
                                                  <span className="text-yellow-400 text-sm">{player.cards_yellow || 0}</span>
                                                  <span className="text-gray-600 mx-0.5">/</span>
                                                  <span className="text-red-400 text-sm">{player.cards_red || 0}</span>
                                                </td>
                                                <td className="text-center py-2.5 px-2">
                                                  <Link
                                                    href={`/leagues/${leagueSlug}/player/${player.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
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
                                      <p className="text-gray-500 text-sm py-4">No player data available</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legend */}
            {teamStats.length > 0 && !loading && (
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-900/50 border-t border-white/5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Champions League / Promotion</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Relegation</span>
                </div>
                <div className="flex items-center gap-2 ml-auto hidden md:flex">
                  <span>P=Played, W=Won, D=Draw, L=Lost, GF=Goals For, GA=Goals Against, GD=Goal Diff</span>
                </div>
              </div>
            )}
          </div>
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
