"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPlayerStatsByLeague, PlayerStats } from "@/lib/supabase";

// League name mapping
const leagueNameMap: Record<string, string> = {
  "premier-league": "Premier League",
  "la-liga": "La Liga",
  "bundesliga": "Bundesliga",
  "serie-a": "Serie A",
  "ligue-1": "Ligue 1",
  "eredivisie": "Eredivisie",
  "primeira-liga": "Primeira Liga",
  "super-lig": "Super Lig",
};

export default function AllPlayersPage() {
  const params = useParams();
  const leagueSlug = params.league as string;
  const leagueName = leagueNameMap[leagueSlug] || leagueSlug;

  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const { data, error } = await getPlayerStatsByLeague(leagueName);
      if (data && !error) {
        setPlayers(data);
      }
      setLoading(false);
    };

    fetchPlayers();
  }, [leagueName]);

  // Filter and sort players
  const filteredPlayers = players
    .filter((player) => {
      const matchesSearch = player.player_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPosition =
        positionFilter === "all" ||
        player.position?.toLowerCase() === positionFilter.toLowerCase();
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "goals":
          return (b.goals_total || 0) - (a.goals_total || 0);
        case "assists":
          return (b.assists || 0) - (a.assists || 0);
        case "appearances":
          return (b.appearances || 0) - (a.appearances || 0);
        case "name":
          return (a.player_name || "").localeCompare(b.player_name || "");
        default:
          return 0;
      }
    });

  // Get unique positions for filter
  const positions = [...new Set(players.map((p) => p.position).filter(Boolean))];

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/leagues" className="hover:text-white transition-colors">
            Leagues
          </Link>
          <span>/</span>
          <Link
            href={`/leagues/${leagueSlug}`}
            className="hover:text-white transition-colors"
          >
            {leagueName}
          </Link>
          <span>/</span>
          <span className="text-white">All Players</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {leagueName}
            </span>{" "}
            Players
          </h1>
          <p className="text-gray-400">
            {players.length} players in the league
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>

          {/* Position Filter */}
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-gray-900/50 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Positions</option>
            {positions.map((pos) => (
              <option key={pos} value={pos?.toLowerCase()}>
                {pos}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-gray-900/50 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
          >
            <option value="rating">Sort by Rating</option>
            <option value="goals">Sort by Goals</option>
            <option value="assists">Sort by Assists</option>
            <option value="appearances">Sort by Appearances</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No players found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlayers.map((player) => (
              <Link
                key={player.id}
                href={`/leagues/${leagueSlug}/player/${player.id}`}
                className="group p-4 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-white/10 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="flex items-start gap-4">
                  {/* Player Photo */}
                  <div className="relative flex-shrink-0">
                    {player.photo ? (
                      <img
                        src={player.photo}
                        alt={player.player_name || ""}
                        className="w-16 h-16 rounded-xl object-cover bg-gray-700"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-2xl text-gray-400">
                        {player.player_name?.charAt(0) || "?"}
                      </div>
                    )}
                    {/* Rating Badge */}
                    {player.rating && (
                      <div
                        className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                          player.rating >= 7.5
                            ? "bg-emerald-500 text-white"
                            : player.rating >= 7
                            ? "bg-green-500 text-white"
                            : player.rating >= 6.5
                            ? "bg-yellow-500 text-black"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {Number(player.rating).toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate group-hover:text-emerald-400 transition-colors">
                      {player.player_name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {player.team_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          player.position === "Goalkeeper"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : player.position === "Defender"
                            ? "bg-blue-500/20 text-blue-400"
                            : player.position === "Midfielder"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {player.position?.substring(0, 3).toUpperCase() || "-"}
                      </span>
                      {player.nationality && (
                        <span className="text-gray-500 text-xs">
                          {player.nationality}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-emerald-400 font-bold text-lg">
                      {player.goals_total || 0}
                    </p>
                    <p className="text-gray-500 text-[10px] uppercase">Goals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-cyan-400 font-bold text-lg">
                      {player.assists || 0}
                    </p>
                    <p className="text-gray-500 text-[10px] uppercase">Assists</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-400 font-bold text-lg">
                      {player.appearances || 0}
                    </p>
                    <p className="text-gray-500 text-[10px] uppercase">Apps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 font-bold text-lg">
                      {player.minutes || 0}
                    </p>
                    <p className="text-gray-500 text-[10px] uppercase">Mins</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href={`/leagues/${leagueSlug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to {leagueName}
          </Link>
        </div>
      </div>
    </main>
  );
}
