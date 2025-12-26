'use client';

import Link from 'next/link';

// Mock data for community
const mockDiscussions = [
  {
    id: 1,
    title: "Premier League Weekend Predictions Thread",
    author: "FootballFan99",
    avatar: "🔵",
    replies: 156,
    views: 2340,
    lastActivity: "5 min ago",
    category: "Predictions",
    pinned: true,
  },
  {
    id: 2,
    title: "Manchester United vs Liverpool - Match Analysis",
    author: "TacticsGuru",
    avatar: "🔴",
    replies: 89,
    views: 1567,
    lastActivity: "15 min ago",
    category: "Match Discussion",
    pinned: true,
  },
  {
    id: 3,
    title: "Best value bets for Champions League this week?",
    author: "SmartBettor",
    avatar: "⚽",
    replies: 45,
    views: 892,
    lastActivity: "32 min ago",
    category: "Tips & Strategies",
    pinned: false,
  },
  {
    id: 4,
    title: "How accurate are the AI predictions? My results after 30 days",
    author: "DataDriven",
    avatar: "📊",
    replies: 234,
    views: 4521,
    lastActivity: "1 hour ago",
    category: "General",
    pinned: false,
  },
  {
    id: 5,
    title: "La Liga insights - Barcelona looking strong",
    author: "SpanishFootball",
    avatar: "🇪🇸",
    replies: 67,
    views: 1123,
    lastActivity: "2 hours ago",
    category: "League Discussion",
    pinned: false,
  },
  {
    id: 6,
    title: "New to OddsFlow - Any tips for beginners?",
    author: "NewUser2024",
    avatar: "🆕",
    replies: 28,
    views: 456,
    lastActivity: "3 hours ago",
    category: "General",
    pinned: false,
  },
];

const mockTopContributors = [
  { name: "TacticsGuru", points: 12450, avatar: "🔴", badge: "Expert" },
  { name: "FootballFan99", points: 9820, avatar: "🔵", badge: "Pro" },
  { name: "DataDriven", points: 8540, avatar: "📊", badge: "Pro" },
  { name: "SmartBettor", points: 7230, avatar: "⚽", badge: "Rising Star" },
  { name: "SpanishFootball", points: 5670, avatar: "🇪🇸", badge: "Rising Star" },
];

const categories = [
  { name: "All", count: 1234 },
  { name: "Predictions", count: 456 },
  { name: "Match Discussion", count: 321 },
  { name: "Tips & Strategies", count: 234 },
  { name: "League Discussion", count: 156 },
  { name: "General", count: 67 },
];

export default function CommunityPage() {
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
              <Link href="/predictions" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Predictions</Link>
              <Link href="/leagues" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Leagues</Link>
              <Link href="/analysis" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Analysis</Link>
              <Link href="/community" className="text-emerald-400 text-sm font-medium">Community</Link>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join the discussion with thousands of football enthusiasts
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Members", value: "12,450" },
              { label: "Discussions", value: "1,234" },
              { label: "Comments", value: "45.6K" },
              { label: "Online Now", value: "342" },
            ].map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Categories */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 p-5">
                <h3 className="font-semibold text-white mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((cat, index) => (
                    <li key={index}>
                      <button className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${index === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-gray-400'}`}>
                        <span>{cat.name}</span>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{cat.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top Contributors */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 p-5">
                <h3 className="font-semibold text-white mb-4">Top Contributors</h3>
                <ul className="space-y-3">
                  {mockTopContributors.map((user, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="text-xl">{user.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.points.toLocaleString()} pts</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.badge === 'Expert' ? 'bg-yellow-500/20 text-yellow-400' :
                        user.badge === 'Pro' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.badge}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Discussions List */}
            <div className="lg:col-span-3">
              {/* Actions Bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium cursor-pointer">Latest</button>
                  <button className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-400 text-sm font-medium cursor-pointer">Popular</button>
                  <button className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-400 text-sm font-medium cursor-pointer">Unanswered</button>
                </div>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-semibold cursor-pointer">
                  New Discussion
                </button>
              </div>

              {/* Discussions */}
              <div className="space-y-3">
                {mockDiscussions.map((discussion) => (
                  <div key={discussion.id} className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-xl border border-white/5 p-5 hover:border-emerald-500/30 transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{discussion.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {discussion.pinned && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">Pinned</span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{discussion.category}</span>
                        </div>
                        <h4 className="font-semibold text-white mb-1 hover:text-emerald-400 transition-colors">{discussion.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>by <span className="text-gray-400">{discussion.author}</span></span>
                          <span>{discussion.replies} replies</span>
                          <span>{discussion.views} views</span>
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-6">
                <button className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
                  Load More Discussions
                </button>
              </div>
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
