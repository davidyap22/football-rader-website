'use client';

import Link from 'next/link';

interface WorldCupFooterProps {
  lang?: string;
}

const footerTranslations: Record<string, Record<string, string>> = {
  EN: {
    tagline: 'AI-powered football odds analysis for smarter predictions. Get accurate betting tips for World Cup 2026 and beyond.',
    product: 'Product',
    predictions: 'Predictions',
    leagues: 'Leagues',
    aiPerformance: 'AI Performance',
    company: 'Company',
    aboutUs: 'About Us',
    contact: 'Contact',
    blog: 'Blog',
    legal: 'Legal',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    allRights: '2026 OddsFlow. All rights reserved.',
    disclaimer: 'Gambling involves risk. Please gamble responsibly.',
  },
  '中文': {
    tagline: 'AI驱动的足球赔率分析，助您做出更明智的预测。获取2026世界杯及更多比赛的精准投注建议。',
    product: '产品',
    predictions: '预测',
    leagues: '联赛',
    aiPerformance: 'AI表现',
    company: '公司',
    aboutUs: '关于我们',
    contact: '联系我们',
    blog: '博客',
    legal: '法律',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    allRights: '2026 OddsFlow. 保留所有权利。',
    disclaimer: '博彩有风险，请理性投注。',
  },
  '繁體': {
    tagline: 'AI驅動的足球賠率分析，助您做出更明智的預測。獲取2026世界盃及更多比賽的精準投注建議。',
    product: '產品',
    predictions: '預測',
    leagues: '聯賽',
    aiPerformance: 'AI表現',
    company: '公司',
    aboutUs: '關於我們',
    contact: '聯繫我們',
    blog: '部落格',
    legal: '法律',
    termsOfService: '服務條款',
    privacyPolicy: '隱私政策',
    allRights: '2026 OddsFlow. 保留所有權利。',
    disclaimer: '博彩有風險，請理性投注。',
  },
};

export default function WorldCupFooter({ lang = 'EN' }: WorldCupFooterProps) {
  const t = (key: string): string => {
    return footerTranslations[lang]?.[key] || footerTranslations['EN']?.[key] || key;
  };

  return (
    <footer className="relative z-10 bg-[#0a0a0f] border-t border-amber-500/10">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img
                src="/homepage/OddsFlow Logo2.png"
                alt="OddsFlow Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold text-white">OddsFlow</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('tagline')}
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('product')}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/worldcup/predictions"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {t('predictions')}
                </Link>
              </li>
              <li>
                <Link
                  href="/worldcup/leagues"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {t('leagues')}
                </Link>
              </li>
              <li>
                <Link
                  href="/worldcup/ai_performance"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {t('aiPerformance')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('company')}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {t('blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {t('allRights')}
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span className="text-amber-500 font-semibold">18+</span>
              <span className="text-gray-600">|</span>
              {t('disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
