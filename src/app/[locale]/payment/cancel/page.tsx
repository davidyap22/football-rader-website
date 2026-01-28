'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { locales, type Locale } from '@/i18n/config';

export default function PaymentCancelPage() {
  const params = useParams();
  const urlLocale = (params?.locale as string) || 'en';
  const locale = locales.includes(urlLocale as Locale) ? urlLocale : 'en';

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  return (
    <div className="min-h-screen bg-[#05080d] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-400 mb-8">
          Your payment was cancelled. No charges have been made to your account.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Link
            href={localePath('/pricing')}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </Link>
          <Link
            href={localePath('/')}
            className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
          >
            Back to Home
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-sm text-gray-500">
          Need help with payment?{' '}
          <Link href={localePath('/contact')} className="text-emerald-400 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
