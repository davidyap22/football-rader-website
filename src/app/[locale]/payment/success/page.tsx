'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { locales, type Locale } from '@/i18n/config';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const urlLocale = (params?.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  useEffect(() => {
    // Auto-redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push(localePath('/dashboard'));
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, locale]);

  return (
    <div className="min-h-screen bg-[#05080d] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-400 mb-8">
          Your subscription has been activated. You now have access to all premium features.
        </p>

        {/* Loading Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 animate-[load_5s_linear]" />
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Redirecting to dashboard in 5 seconds...
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href={localePath('/dashboard')}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg transition-all"
          >
            Go to Dashboard
          </Link>
          <Link
            href={localePath('/predictions')}
            className="flex-1 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
          >
            View Predictions
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-sm text-gray-500">
          Need help?{' '}
          <Link href={localePath('/contact')} className="text-emerald-400 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>

      {/* Loading animation styles */}
      <style jsx>{`
        @keyframes load {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
