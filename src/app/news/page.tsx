'use client';

import Link from 'next/link';

// Mock data for news
const mockFeaturedNews = {
  id: 1,
  title: "Champions League Quarter-Finals: What the AI Predicts for This Week's Matches",
  excerpt: "Our AI model has analyzed the upcoming Champions League quarter-final ties, and the predictions might surprise you. With historical data and current form taken into account, here's what to expect.",
  image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=400&fit=crop",
  category: "Champions League",
  author: "OddsFlow AI Team",
  date: "Dec 26, 2024",
  readTime: "5 min read",
};

const mockNews = [
  {
    id: 2,
    title: "Premier League Title Race: City vs Arsenal - A Statistical Breakdown",
    excerpt: "The Premier League title race is heating up. We dive deep into the numbers to see who has the edge.",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=250&fit=crop",
    category: "Premier League",
    author: "James Wilson",
    date: "Dec 25, 2024",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "New AI Model Update: Improved Accuracy for Live Match Predictions",
    excerpt: "We've updated our prediction algorithm with new features that improve live match accuracy by 15%.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop",
    category: "Product Update",
    author: "Tech Team",
    date: "Dec 24, 2024",
    readTime: "3 min read",
  },
  {
    id: 4,
    title: "La Liga Mid-Season Review: Barcelona's Resurgence Under New Tactics",
    excerpt: "Barcelona has transformed under their new tactical approach. Here's how it affects betting odds.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=250&fit=crop",
    category: "La Liga",
    author: "Carlos Martinez",
    date: "Dec 23, 2024",
    readTime: "6 min read",
  },
  {
    id: 5,
    title: "Understanding Expected Goals (xG): A Bettor's Guide",
    excerpt: "Learn how to use xG statistics to make more informed betting decisions.",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=250&fit=crop",
    category: "Education",
    author: "Data Analytics",
    date: "Dec 22, 2024",
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "Serie A Betting Trends: What's Working in Italian Football",
    excerpt: "Italian football presents unique betting opportunities. Discover the trends our AI has identified.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop",
    category: "Serie A",
    author: "Marco Rossi",
    date: "Dec 21, 2024",
    readTime: "4 min read",
  },
  {
    id: 7,
    title: "Bundesliga's Young Stars: Impact on Match Predictions",
    excerpt: "Young talents are shaking up the Bundesliga. How does this affect prediction models?",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=250&fit=crop",
    category: "Bundesliga",
    author: "Hans Mueller",
    date: "Dec 20, 2024",
    readTime: "5 min read",
  },
];

const categories = ["All", "Premier League", "Champions League", "La Liga", "Serie A", "Bundesliga", "Education", "Product Update"];

export default function NewsPage() {
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
              <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Community</Link>
              <Link href="/news" className="text-emerald-400 text-sm font-medium">News</Link>
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
                News & Insights
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stay updated with the latest football news, betting insights, and AI predictions
            </p>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  index === 0
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Article */}
          <div className="mb-10">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-all cursor-pointer group">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-video md:aspect-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20" />
                  <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 flex items-center justify-center">
                    <svg className="w-20 h-20 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      {mockFeaturedNews.category}
                    </span>
                    <span className="text-gray-500 text-xs">{mockFeaturedNews.date}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {mockFeaturedNews.title}
                  </h2>
                  <p className="text-gray-400 mb-4 line-clamp-3">{mockFeaturedNews.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {mockFeaturedNews.author}</span>
                    <span>{mockFeaturedNews.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNews.map((news) => (
              <article key={news.id} className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 rounded-2xl border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 text-xs font-medium">
                      {news.category}
                    </span>
                    <span className="text-gray-600 text-xs">{news.date}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{news.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{news.author}</span>
                    <span>{news.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-10">
            <button className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer">
              Load More Articles
            </button>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 rounded-2xl border border-emerald-500/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Stay in the Loop</h3>
            <p className="text-gray-400 mb-6">Get the latest news and predictions delivered to your inbox</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
              />
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">
                Subscribe
              </button>
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
