"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPlayerStatsByLeague, PlayerStats } from "@/lib/supabase";

// Custom Premium Dropdown Component
function PremiumDropdown({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 min-w-[180px] backdrop-blur-xl shadow-lg hover:shadow-emerald-500/10"
      >
        {icon && (
          <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors">
            {icon}
          </span>
        )}
        <span className="flex-1 text-left text-white font-medium">
          {selectedOption?.label}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-all duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 border border-white/10 shadow-2xl shadow-black/50 z-50 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-5 py-2.5 text-left transition-all duration-200 ${
                value === option.value
                  ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-400 border-l-2 border-emerald-500"
                  : "text-gray-300 hover:bg-white/5 hover:text-white hover:pl-6"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/30 backdrop-blur-xl shadow-lg transition-all duration-300"
              />
            </div>
          </div>

          {/* Position Filter */}
          <PremiumDropdown
            value={positionFilter}
            onChange={setPositionFilter}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            options={[
              { value: "all", label: "All Positions" },
              ...positions.map((pos) => ({
                value: pos?.toLowerCase() || "",
                label: pos || "",
              })),
            ]}
          />

          {/* Sort By */}
          <PremiumDropdown
            value={sortBy}
            onChange={setSortBy}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            }
            options={[
              { value: "rating", label: "Sort by Rating" },
              { value: "goals", label: "Sort by Goals" },
              { value: "assists", label: "Sort by Assists" },
              { value: "appearances", label: "Sort by Apps" },
              { value: "name", label: "Sort by Name" },
            ]}
          />
        </div>

        {/* Players Grid */}
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No players found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlayers.map((player, index) => {
              // Calculate top 5 by rating (from all players, not filtered)
              const top5PlayerIds = new Set(
                [...players]
                  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                  .slice(0, 5)
                  .map((p) => p.id)
              );
              const isTop5 = top5PlayerIds.has(player.id);
              const top5Rank = isTop5
                ? [...players]
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .findIndex((p) => p.id === player.id) + 1
                : null;

              return (
                <Link
                  key={player.id}
                  href={`/leagues/${leagueSlug}/player/${player.id}`}
                  className={`group relative p-4 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 border transition-all hover:shadow-lg overflow-hidden ${
                    isTop5
                      ? "border-amber-500/50 hover:border-amber-400/70 hover:shadow-amber-500/20"
                      : "border-white/10 hover:border-emerald-500/30 hover:shadow-emerald-500/10"
                  }`}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                  {/* TOP Badge */}
                  {isTop5 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-[10px] font-bold text-white">TOP {top5Rank}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-4 relative z-10">
                    {/* Player Photo */}
                    <div className="relative flex-shrink-0">
                      {player.photo ? (
                        <img
                          src={player.photo}
                          alt={player.player_name || ""}
                          className={`w-16 h-16 rounded-xl object-cover bg-gray-700 ${
                            isTop5 ? "ring-2 ring-amber-500/50" : ""
                          }`}
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-xl bg-gray-700 flex items-center justify-center text-2xl text-gray-400 ${
                          isTop5 ? "ring-2 ring-amber-500/50" : ""
                        }`}>
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
                      <h3 className={`font-semibold truncate transition-colors ${
                        isTop5
                          ? "text-amber-100 group-hover:text-amber-300"
                          : "text-white group-hover:text-emerald-400"
                      }`}>
                        {player.player_name}
                      </h3>
                      <p className="text-gray-400 text-sm truncate flex items-center gap-1">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
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
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 relative z-10">
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
              );
            })}
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
