'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, Prematch } from '@/lib/supabase';

// Betting personality types
const PERSONALITIES = [
  {
    id: 'aggressive',
    name: 'Aggressive',
    nameZh: '攻击型',
    icon: '🔥',
    description: 'High risk, high reward. Favors home wins and over goals.',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
  },
  {
    id: 'conservative',
    name: 'Conservative',
    nameZh: '保守型',
    icon: '🛡️',
    description: 'Low risk approach. Prefers draws and under goals.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    nameZh: '平衡型',
    icon: '⚖️',
    description: 'Moderate risk with balanced predictions.',
    color: 'from-emerald-500 to-cyan-500',
    bgColor: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
  },
  {
    id: 'value',
    name: 'Value Hunter',
    nameZh: '价值型',
    icon: '💎',
    description: 'Seeks undervalued odds and value bets.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
  },
  {
    id: 'safe',
    name: 'Safe Play',
    nameZh: '稳健型',
    icon: '🏦',
    description: 'Very safe picks with high confidence.',
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
  },
];

// Mock odds data generator
function generateMockOdds() {
  return {
    '1x2': {
      home: (1.5 + Math.random() * 2).toFixed(2),
      draw: (2.5 + Math.random() * 1.5).toFixed(2),
      away: (2 + Math.random() * 3).toFixed(2),
    },
    'overUnder': {
      over: (1.7 + Math.random() * 0.5).toFixed(2),
      under: (1.9 + Math.random() * 0.5).toFixed(2),
      line: '2.5',
    },
    'handicap': {
      home: (1.8 + Math.random() * 0.4).toFixed(2),
      away: (1.9 + Math.random() * 0.4).toFixed(2),
      line: '-0.5',
    },
  };
}

// Generate predictions based on personality type
function generatePredictionsByPersonality(personalityId: string) {
  // Base values that will be modified by personality
  let homeBase = 45;
  let drawBase = 28;
  let overBase = 52;
  let homeHdpBase = 55;

  switch (personalityId) {
    case 'aggressive':
      // Aggressive: Favors home wins and overs
      homeBase = 65 + Math.floor(Math.random() * 10);
      drawBase = 15 + Math.floor(Math.random() * 8);
      overBase = 70 + Math.floor(Math.random() * 10);
      homeHdpBase = 68 + Math.floor(Math.random() * 10);
      break;
    case 'conservative':
      // Conservative: Favors draws and unders
      homeBase = 35 + Math.floor(Math.random() * 10);
      drawBase = 38 + Math.floor(Math.random() * 10);
      overBase = 32 + Math.floor(Math.random() * 10);
      homeHdpBase = 45 + Math.floor(Math.random() * 8);
      break;
    case 'balanced':
      // Balanced: Moderate predictions
      homeBase = 48 + Math.floor(Math.random() * 12);
      drawBase = 26 + Math.floor(Math.random() * 8);
      overBase = 50 + Math.floor(Math.random() * 10);
      homeHdpBase = 52 + Math.floor(Math.random() * 10);
      break;
    case 'value':
      // Value: Seeks underdog value
      homeBase = 40 + Math.floor(Math.random() * 15);
      drawBase = 30 + Math.floor(Math.random() * 12);
      overBase = 45 + Math.floor(Math.random() * 15);
      homeHdpBase = 48 + Math.floor(Math.random() * 12);
      break;
    case 'safe':
      // Safe: High confidence picks only
      homeBase = 72 + Math.floor(Math.random() * 8);
      drawBase = 12 + Math.floor(Math.random() * 6);
      overBase = 65 + Math.floor(Math.random() * 10);
      homeHdpBase = 70 + Math.floor(Math.random() * 10);
      break;
    default:
      homeBase = 50 + Math.floor(Math.random() * 10);
      drawBase = 25 + Math.floor(Math.random() * 8);
      overBase = 52 + Math.floor(Math.random() * 10);
      homeHdpBase = 55 + Math.floor(Math.random() * 10);
  }

  const awayBase = 100 - homeBase - drawBase;
  const underBase = 100 - overBase;
  const awayHdpBase = 100 - homeHdpBase;

  return {
    '1x2': {
      home: homeBase,
      draw: drawBase,
      away: awayBase,
      prediction: homeBase > awayBase ? (homeBase > drawBase ? '1' : 'X') : (awayBase > drawBase ? '2' : 'X'),
      confidence: Math.max(homeBase, drawBase, awayBase),
    },
    'overUnder': {
      over: overBase,
      under: underBase,
      prediction: overBase > underBase ? 'Over 2.5' : 'Under 2.5',
      confidence: Math.max(overBase, underBase),
    },
    'handicap': {
      home: homeHdpBase,
      away: awayHdpBase,
      prediction: homeHdpBase > awayHdpBase ? 'Home -0.5' : 'Away +0.5',
      confidence: Math.max(homeHdpBase, awayHdpBase),
    },
  };
}

export default function MatchDetailsPage() {
  const params = useParams();
  const [match, setMatch] = useState<Prematch | null>(null);
  const [loading, setLoading] = useState(true);
  const [odds] = useState(generateMockOdds);
  const [selectedPersonality, setSelectedPersonality] = useState('balanced');
  const [predictions, setPredictions] = useState(() => generatePredictionsByPersonality('balanced'));

  // Update predictions when personality changes
  const handlePersonalityChange = (personalityId: string) => {
    setSelectedPersonality(personalityId);
    setPredictions(generatePredictionsByPersonality(personalityId));
  };

  const currentPersonality = PERSONALITIES.find(p => p.id === selectedPersonality) || PERSONALITIES[2];

  useEffect(() => {
    async function fetchMatch() {
      try {
        const { data, error } = await supabase
          .from('prematches')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setMatch(data);
      } catch (error) {
        console.error('Error fetching match:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchMatch();
    }
  }, [params.id]);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getUTCMonth()];
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${day} ${month} ${date.getUTCFullYear()} • ${hours}:${minutes} UTC`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Match not found</h1>
        <Link href="/predictions" className="text-emerald-400 hover:underline">
          ← Back to Predictions
        </Link>
      </div>
    );
  }

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

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/predictions" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Predictions
          </Link>

          {/* Match Header */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 p-6 mb-6">
            {/* League */}
            <div className="flex items-center gap-3 mb-6">
              {match.league_logo && (
                <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center">
                  <img src={match.league_logo} alt={match.league_name} className="w-6 h-6 object-contain" />
                </div>
              )}
              <span className="text-gray-400 font-medium">{match.league_name}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500 text-sm">{formatDateTime(match.start_date_msia)}</span>
            </div>

            {/* Teams */}
            <div className="flex items-center justify-center gap-8 py-6">
              {/* Home Team */}
              <div className="flex flex-col items-center gap-3 flex-1">
                {match.home_logo && (
                  <div className="w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center shadow-lg">
                    <img src={match.home_logo} alt={match.home_name} className="w-full h-full object-contain" />
                  </div>
                )}
                <span className="text-white font-semibold text-lg text-center">{match.home_name}</span>
                <span className="text-xs text-gray-500">HOME</span>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-gray-600">VS</span>
                <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  match.status_short === 'NS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {match.status_short === 'NS' ? 'Not Started' : match.status_short}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center gap-3 flex-1">
                {match.away_logo && (
                  <div className="w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center shadow-lg">
                    <img src={match.away_logo} alt={match.away_name} className="w-full h-full object-contain" />
                  </div>
                )}
                <span className="text-white font-semibold text-lg text-center">{match.away_name}</span>
                <span className="text-xs text-gray-500">AWAY</span>
              </div>
            </div>

            {/* Venue */}
            {match.venue_name && (
              <div className="text-center text-gray-500 text-sm mt-4">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {match.venue_name}, {match.venue_city}
              </div>
            )}
          </div>

          {/* Live Odds Section */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xl font-bold text-white">Live Odds</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1X2 Odds */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-gray-400 text-sm font-medium mb-3">1X2</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-500 mb-1">Home</div>
                    <div className="text-lg font-bold text-white">{odds['1x2'].home}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-500 mb-1">Draw</div>
                    <div className="text-lg font-bold text-white">{odds['1x2'].draw}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-500 mb-1">Away</div>
                    <div className="text-lg font-bold text-white">{odds['1x2'].away}</div>
                  </div>
                </div>
              </div>

              {/* Over/Under Odds */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-gray-400 text-sm font-medium mb-3">Over/Under {odds.overUnder.line}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-500 mb-1">Over</div>
                    <div className="text-lg font-bold text-white">{odds.overUnder.over}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-500 mb-1">Under</div>
                    <div className="text-lg font-bold text-white">{odds.overUnder.under}</div>
                  </div>
                </div>
              </div>

              {/* Handicap Odds */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-gray-400 text-sm font-medium mb-3">Asian Handicap {odds.handicap.line}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-500 mb-1">Home</div>
                    <div className="text-lg font-bold text-white">{odds.handicap.home}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center hover:bg-emerald-500/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-500 mb-1">Away</div>
                    <div className="text-lg font-bold text-white">{odds.handicap.away}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Predictions Section */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h2 className="text-xl font-bold text-white">AI Predictions</h2>
              <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                Powered by AI
              </span>
            </div>

            {/* Personality Selector */}
            <div className="mb-6">
              <h3 className="text-gray-400 text-sm font-medium mb-3">Select Your Betting Style</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {PERSONALITIES.map((personality) => (
                  <button
                    key={personality.id}
                    onClick={() => handlePersonalityChange(personality.id)}
                    className={`relative p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedPersonality === personality.id
                        ? `${personality.bgColor} border-current ${personality.textColor}`
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{personality.icon}</div>
                    <div className={`text-xs font-semibold ${selectedPersonality === personality.id ? personality.textColor : 'text-white'}`}>
                      {personality.name}
                    </div>
                    <div className="text-[10px] text-gray-500">{personality.nameZh}</div>
                    {selectedPersonality === personality.id && (
                      <div className={`absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-r ${personality.color}`} />
                    )}
                  </button>
                ))}
              </div>
              {/* Current Personality Description */}
              <div className={`mt-3 p-3 rounded-lg ${currentPersonality.bgColor} border border-current/20`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{currentPersonality.icon}</span>
                  <span className={`font-semibold ${currentPersonality.textColor}`}>
                    {currentPersonality.name} Mode
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1">{currentPersonality.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* 1X2 Prediction */}
              <div className="bg-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Match Result (1X2)</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-bold">
                      {predictions['1x2'].prediction}
                    </span>
                    <span className="text-emerald-400 font-bold">{predictions['1x2'].confidence}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-16">Home</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${predictions['1x2'].home}%` }} />
                    </div>
                    <span className="text-white font-medium w-12 text-right">{predictions['1x2'].home}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-16">Draw</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-500 rounded-full" style={{ width: `${predictions['1x2'].draw}%` }} />
                    </div>
                    <span className="text-white font-medium w-12 text-right">{predictions['1x2'].draw}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-16">Away</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${predictions['1x2'].away}%` }} />
                    </div>
                    <span className="text-white font-medium w-12 text-right">{predictions['1x2'].away}%</span>
                  </div>
                </div>
              </div>

              {/* Over/Under Prediction */}
              <div className="bg-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Over/Under 2.5 Goals</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-bold">
                      {predictions.overUnder.prediction}
                    </span>
                    <span className="text-emerald-400 font-bold">{predictions.overUnder.confidence}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-16">Over</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${predictions.overUnder.over}%` }} />
                    </div>
                    <span className="text-white font-medium w-12 text-right">{predictions.overUnder.over}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-16">Under</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${predictions.overUnder.under}%` }} />
                    </div>
                    <span className="text-white font-medium w-12 text-right">{predictions.overUnder.under}%</span>
                  </div>
                </div>
              </div>

              {/* Handicap Prediction */}
              <div className="bg-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Asian Handicap -0.5</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-bold">
                      {predictions.handicap.prediction}
                    </span>
                    <span className="text-emerald-400 font-bold">{predictions.handicap.confidence}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-16">Home</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${predictions.handicap.home}%` }} />
                    </div>
                    <span className="text-white font-medium w-12 text-right">{predictions.handicap.home}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-16">Away</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${predictions.handicap.away}%` }} />
                    </div>
                    <span className="text-white font-medium w-12 text-right">{predictions.handicap.away}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-400/80 text-xs">
                ⚠️ These predictions are generated by AI and should be used for informational purposes only.
                Please gamble responsibly. 18+
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>18+ | Gambling involves risk. Please gamble responsibly.</p>
        <p className="mt-2">© 2025 OddsFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
