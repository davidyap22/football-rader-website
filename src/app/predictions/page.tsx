'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, Prematch } from '@/lib/supabase';

// Date helper functions - All using UTC
function getUTCToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function getDateRange() {
  const dates = [];
  const today = getUTCToday();

  // Get 7 days: 3 days before, today, 3 days after
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() + i);
    dates.push(date);
  }

  return dates;
}

function formatDateLabel(date: Date, today: Date) {
  // Compare UTC dates only (ignore time)
  const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const diffDays = Math.round((dateUTC - todayUTC) / (1000 * 60 * 60 * 24));

  if (diffDays === -1) return 'YESTERDAY';
  if (diffDays === 0) return 'TODAY';
  if (diffDays === 1) return 'TOMORROW';

  const day = date.getUTCDate();
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const month = months[date.getUTCMonth()];
  return `${day} ${month}`;
}

function formatDateForQuery(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameDay(date1: Date, date2: Date) {
  return date1.getUTCFullYear() === date2.getUTCFullYear() &&
         date1.getUTCMonth() === date2.getUTCMonth() &&
         date1.getUTCDate() === date2.getUTCDate();
}

export default function PredictionsPage() {
  const [selectedDate, setSelectedDate] = useState(getUTCToday);
  const [matches, setMatches] = useState<Prematch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dates] = useState(getDateRange);
  const today = getUTCToday();

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const dateStr = formatDateForQuery(selectedDate);
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateStr = formatDateForQuery(nextDate);

        const { data, error } = await supabase
          .from('prematches')
          .select('*')
          .gte('start_date_msia', dateStr)
          .lt('start_date_msia', nextDateStr)
          .order('start_date_msia', { ascending: true });

        if (error) throw error;
        setMatches(data || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [selectedDate]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    // Display UTC time
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getConfidence = (index: number) => {
    const confidences = [94, 91, 89, 87, 85, 83, 81, 79, 77, 75];
    return confidences[index % confidences.length];
  };

  const getPrediction = (index: number) => {
    const predictions = ['1', '2', '1X', 'X2', 'Over 2.5', 'Under 2.5', '1', '2', 'BTTS', 'X'];
    return predictions[index % predictions.length];
  };

  // Group matches by league
  const matchesByLeague = matches.reduce((acc, match) => {
    const league = match.league_name;
    if (!acc[league]) {
      acc[league] = {
        logo: match.league_logo,
        matches: []
      };
    }
    acc[league].matches.push(match);
    return acc;
  }, {} as Record<string, { logo: string; matches: Prematch[] }>);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <img src="/homepage/logo-removebg-preview.png" alt="OddsFlow Logo" className="w-11 h-11 object-contain" />
              <span className="text-xl font-bold tracking-tight">OddsFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Home</Link>
              <Link href="/predictions" className="text-emerald-400 text-sm font-medium">Predictions</Link>
              <Link href="/leagues" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Leagues</Link>
              <Link href="/analysis" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Analysis</Link>
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Community</Link>
              <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">News</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm cursor-pointer">
                  <span className="text-base">🇬🇧</span>
                  <span className="text-white font-medium">EN</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <Link href="/login" className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium hidden sm:block cursor-pointer">Log In</Link>
              <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Date Selector */}
      <div className="pt-16">
        <div className="relative bg-gradient-to-r from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f] border-b border-emerald-500/20 overflow-hidden">
          {/* Animated glow effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[100px] bg-emerald-500/20 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[120px] bg-cyan-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[100px] bg-teal-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          {/* Bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 py-5 relative z-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
              {dates.map((date, index) => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);
                const label = formatDateLabel(date, today);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      relative px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300
                      ${isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/30 scale-105'
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-emerald-500/20'
                      }
                      ${isToday && !isSelected ? 'text-emerald-400 border border-emerald-500/30' : ''}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 blur-xl opacity-50 -z-10" />
                    )}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              AI Predictions
            </span>
          </h1>
          <p className="text-gray-400">
            {formatDateLabel(selectedDate, today) === 'TODAY'
              ? "Today's matches with AI-powered predictions"
              : `Matches for ${formatDateLabel(selectedDate, today).toLowerCase()}`
            }
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}

        {/* No Matches */}
        {!loading && matches.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No matches found</h3>
            <p className="text-gray-500">There are no scheduled matches for this date.</p>
          </div>
        )}

        {/* Matches by League */}
        {!loading && Object.keys(matchesByLeague).length > 0 && (
          <div className="space-y-6">
            {Object.entries(matchesByLeague).map(([leagueName, { logo, matches: leagueMatches }]) => (
              <div key={leagueName} className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 overflow-hidden">
                {/* League Header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-white/5 border-b border-white/5">
                  {logo && (
                    <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center">
                      <img src={logo} alt={leagueName} className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  <h3 className="font-semibold text-white">{leagueName}</h3>
                  <span className="text-xs text-gray-500 ml-auto">{leagueMatches.length} matches</span>
                </div>

                {/* Matches */}
                <div className="divide-y divide-white/5">
                  {leagueMatches.map((match, index) => (
                    <div
                      key={match.id}
                      className="px-5 py-4 hover:bg-white/5 transition-colors group"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Time */}
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-emerald-400 font-mono text-sm font-medium">
                            {formatTime(match.start_date_msia)}
                          </span>
                        </div>

                        {/* Teams */}
                        <div className="col-span-6 sm:col-span-7">
                          <div className="flex items-center gap-3">
                            {/* Home Team */}
                            <div className="flex items-center gap-2 flex-1 justify-end">
                              <span className="text-white font-medium text-sm text-right truncate">{match.home_name}</span>
                              {match.home_logo && (
                                <div className="w-7 h-7 rounded-full bg-white p-0.5 flex-shrink-0">
                                  <img src={match.home_logo} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}
                            </div>

                            {/* VS */}
                            <span className="text-gray-600 text-xs font-medium px-2">vs</span>

                            {/* Away Team */}
                            <div className="flex items-center gap-2 flex-1">
                              {match.away_logo && (
                                <div className="w-7 h-7 rounded-full bg-white p-0.5 flex-shrink-0">
                                  <img src={match.away_logo} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}
                              <span className="text-white font-medium text-sm truncate">{match.away_name}</span>
                            </div>
                          </div>
                        </div>

                        {/* Prediction */}
                        <div className="col-span-2 sm:col-span-2 flex justify-center">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black">
                            {getPrediction(index)}
                          </span>
                        </div>

                        {/* Confidence */}
                        <div className="col-span-2 sm:col-span-2 text-right">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                                style={{ width: `${getConfidence(index)}%` }}
                              />
                            </div>
                            <span className="text-emerald-400 font-bold text-sm">{getConfidence(index)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>18+ | Gambling involves risk. Please gamble responsibly.</p>
        <p className="mt-2">2025 OddsFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
