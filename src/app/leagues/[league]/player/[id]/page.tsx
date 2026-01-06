'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PlayerStats, getPlayerStatsById } from '@/lib/supabase';

// League configuration
const LEAGUES_CONFIG: Record<string, { name: string; country: string; logo: string; dbName: string }> = {
  'premier-league': { name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', dbName: 'Premier League' },
  'bundesliga': { name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', dbName: 'Bundesliga' },
  'serie-a': { name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', dbName: 'Serie A' },
  'la-liga': { name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', dbName: 'La Liga' },
  'ligue-1': { name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', dbName: 'Ligue 1' },
  'champions-league': { name: 'Champions League', country: 'UEFA', logo: 'https://media.api-sports.io/football/leagues/2.png', dbName: 'UEFA Champions League' },
};

export default function PlayerDetailPage() {
  const params = useParams();
  const leagueSlug = params.league as string;
  const playerId = params.id as string;
  const leagueConfig = LEAGUES_CONFIG[leagueSlug];

  const [player, setPlayer] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayer() {
      if (!playerId) return;

      setLoading(true);
      const { data, error } = await getPlayerStatsById(parseInt(playerId));

      if (data && !error) {
        setPlayer(data);
      }
      setLoading(false);
    }

    fetchPlayer();
  }, [playerId]);

  if (!leagueConfig) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <p className="text-gray-400">League not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
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
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href={`/leagues/${leagueSlug}`} className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {leagueConfig.name}
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : !player ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Player not found</p>
            </div>
          ) : (
            <>
              {/* Player Header */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Player Photo */}
                  <div className="relative">
                    {player.photo ? (
                      <img src={player.photo} alt={player.player_name || ''} className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover bg-gray-700" />
                    ) : (
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gray-700 flex items-center justify-center text-gray-400 text-4xl">
                        {player.player_name?.charAt(0) || '?'}
                      </div>
                    )}
                    {player.captain && (
                      <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold bg-amber-500 text-black rounded-lg">CAPTAIN</span>
                    )}
                    {player.injured && (
                      <span className="absolute -bottom-2 -right-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-lg">INJURED</span>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-white">{player.player_name}</h1>
                      {player.number && (
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xl font-bold">
                          #{player.number}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                      {/* Team */}
                      {player.team_logo && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                          <img src={player.team_logo} alt={player.team_name || ''} className="w-5 h-5 object-contain" />
                          <span className="text-white text-sm">{player.team_name}</span>
                        </div>
                      )}

                      {/* Position */}
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        player.position === 'Goalkeeper' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        player.position === 'Defender' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        player.position === 'Midfielder' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {player.position || 'Unknown'}
                      </span>

                      {/* Nationality */}
                      <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm">
                        {player.nationality}
                      </span>
                    </div>

                    {/* Personal Info */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                      {player.age && <span>Age: <span className="text-white">{player.age}</span></span>}
                      {player.height && <span>Height: <span className="text-white">{player.height}</span></span>}
                      {player.weight && <span>Weight: <span className="text-white">{player.weight}</span></span>}
                      {player.birth_country && <span>Born: <span className="text-white">{player.birth_country}</span></span>}
                    </div>
                  </div>

                  {/* Rating */}
                  {player.rating && (
                    <div className="text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Rating</p>
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold ${
                        player.rating >= 7.5 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        player.rating >= 7 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        player.rating >= 6.5 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {Number(player.rating).toFixed(1)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Appearances */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Appearances</p>
                  <p className="text-3xl font-bold text-white">{player.appearances || 0}</p>
                  <p className="text-gray-500 text-xs mt-1">Lineups: {player.lineups || 0}</p>
                </div>

                {/* Minutes */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Minutes Played</p>
                  <p className="text-3xl font-bold text-cyan-400">{player.minutes || 0}</p>
                  <p className="text-gray-500 text-xs mt-1">Avg: {player.appearances ? Math.round((player.minutes || 0) / player.appearances) : 0} min/game</p>
                </div>

                {/* Goals */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Goals</p>
                  <p className="text-3xl font-bold text-emerald-400">{player.goals_total || 0}</p>
                  {player.position === 'Goalkeeper' && (
                    <p className="text-gray-500 text-xs mt-1">Conceded: {player.conceded || 0}</p>
                  )}
                </div>

                {/* Assists */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Assists</p>
                  <p className="text-3xl font-bold text-purple-400">{player.assists || 0}</p>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shooting */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Shooting
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Shots</span>
                      <span className="text-white font-semibold">{player.shots_total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Shots on Target</span>
                      <span className="text-white font-semibold">{player.shots_on || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Shot Accuracy</span>
                      <span className="text-emerald-400 font-semibold">
                        {player.shots_total ? Math.round((player.shots_on || 0) / player.shots_total * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Penalties Scored</span>
                      <span className="text-white font-semibold">{player.penalty_scored || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Penalties Missed</span>
                      <span className="text-red-400 font-semibold">{player.penalty_missed || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Passing */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Passing
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Passes</span>
                      <span className="text-white font-semibold">{player.passes_total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Key Passes</span>
                      <span className="text-cyan-400 font-semibold">{player.passes_key || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Assists</span>
                      <span className="text-purple-400 font-semibold">{player.assists || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Defending */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Defending
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tackles</span>
                      <span className="text-white font-semibold">{player.tackles_total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Interceptions</span>
                      <span className="text-white font-semibold">{player.interceptions || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Duels Total</span>
                      <span className="text-white font-semibold">{player.duels_total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Duels Won</span>
                      <span className="text-emerald-400 font-semibold">{player.duels_won || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Duel Win Rate</span>
                      <span className="text-emerald-400 font-semibold">
                        {player.duels_total ? Math.round((player.duels_won || 0) / player.duels_total * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Discipline */}
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Discipline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Yellow Cards</span>
                      <span className="text-yellow-400 font-semibold">{player.cards_yellow || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Red Cards</span>
                      <span className="text-red-400 font-semibold">{player.cards_red || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Fouls Committed</span>
                      <span className="text-white font-semibold">{player.fouls_committed || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Fouls Drawn</span>
                      <span className="text-white font-semibold">{player.fouls_drawn || 0}</span>
                    </div>
                  </div>
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
