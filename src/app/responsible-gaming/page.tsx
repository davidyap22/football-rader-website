import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Responsible Gaming - OddsFlow',
  description: 'OddsFlow is committed to responsible gaming. Learn about our responsible gambling policies, self-exclusion tools, and resources for problem gambling help.',
  keywords: ['responsible gaming', 'responsible gambling', 'gambling help', 'self exclusion', 'problem gambling resources'],
};

export default function ResponsibleGamingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
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
              <Link href="/performance" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">AI Performance</Link>
            </div>
            <Link href="/get-started" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-amber-400 text-sm font-medium">18+ Only</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Responsible Gaming
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            At OddsFlow, we are committed to promoting responsible gambling and providing resources to help you stay in control.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Our Commitment */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Our Commitment</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              OddsFlow provides AI-powered sports predictions for informational and entertainment purposes only. We are committed to promoting responsible gambling practices and ensuring our users can enjoy our platform safely.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Gambling should be fun and entertaining, not a way to make money or solve financial problems. We encourage all our users to gamble responsibly and within their means.
            </p>
          </div>

          {/* Age Verification */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Age Verification</h2>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-red-400">18+</span>
              </div>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  You must be at least 18 years old (or the legal gambling age in your jurisdiction) to use OddsFlow. We strictly prohibit underage gambling and take measures to prevent minors from accessing our services.
                </p>
              </div>
            </div>
          </div>

          {/* Warning Signs */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-6 text-amber-400">Warning Signs of Problem Gambling</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              If you or someone you know exhibits any of these signs, it may indicate a gambling problem:
            </p>
            <ul className="space-y-3">
              {[
                'Spending more money or time gambling than you can afford',
                'Chasing losses or gambling to try to win back money',
                'Neglecting work, family, or other responsibilities due to gambling',
                'Borrowing money or selling possessions to gamble',
                'Feeling anxious, depressed, or irritable when not gambling',
                'Lying to family or friends about gambling habits',
                'Being unable to stop or reduce gambling despite wanting to',
                'Gambling to escape problems or relieve negative feelings',
              ].map((sign, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-gray-300">{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips for Responsible Gambling */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-6 text-emerald-400">Tips for Responsible Gambling</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Set a Budget', text: 'Only gamble with money you can afford to lose. Set a budget before you start and stick to it.' },
                { title: 'Set Time Limits', text: 'Decide how much time you will spend gambling and stick to it. Take regular breaks.' },
                { title: 'Never Chase Losses', text: 'Accept that losing is part of gambling. Never try to win back money you have lost.' },
                { title: 'Balance Your Life', text: 'Gambling should be just one of many leisure activities, not your only source of entertainment.' },
                { title: 'Avoid Alcohol', text: 'Avoid gambling when under the influence of alcohol or drugs, as it impairs judgment.' },
                { title: 'Know the Odds', text: 'Understand that the odds are always in favor of the house. Gambling is not a reliable way to make money.' },
              ].map((tip, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h3 className="font-semibold text-white mb-2">{tip.title}</h3>
                  <p className="text-gray-400 text-sm">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Help Resources */}
          <div className="bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-2xl border border-red-500/20 p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Get Help</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              If you or someone you know has a gambling problem, please reach out to these resources for help:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'National Council on Problem Gambling (US)', phone: '1-800-522-4700', url: 'https://www.ncpgambling.org' },
                { name: 'GamCare (UK)', phone: '0808 8020 133', url: 'https://www.gamcare.org.uk' },
                { name: 'Gamblers Anonymous', phone: 'Find local meetings', url: 'https://www.gamblersanonymous.org' },
                { name: 'BeGambleAware (UK)', phone: '0808 8020 133', url: 'https://www.begambleaware.org' },
              ].map((resource, i) => (
                <a 
                  key={i} 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 transition-all"
                >
                  <h3 className="font-semibold text-white mb-1">{resource.name}</h3>
                  <p className="text-emerald-400 text-sm font-medium">{resource.phone}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Self-Exclusion */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Self-Exclusion</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you need to take a break from gambling, you can request self-exclusion from your account. Contact us at{' '}
              <a href="mailto:support@oddsflow.ai" className="text-emerald-400 hover:underline">support@oddsflow.ai</a>{' '}
              to request self-exclusion for a period of your choosing.
            </p>
            <p className="text-gray-300 leading-relaxed">
              During the self-exclusion period, you will not be able to access your account or use our prediction services.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow Logo" className="w-10 h-10 object-contain" />
              <span className="font-bold">OddsFlow</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm">
              Gambling involves risk. Please gamble responsibly. 18+ only.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              &copy; 2026 OddsFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
