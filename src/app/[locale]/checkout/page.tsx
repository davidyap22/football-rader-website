'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

const PLAN_DETAILS: Record<string, { name: string; price: number; period: string }> = {
  starter: { name: 'Starter', price: 3, period: '/month' },
  pro: { name: 'Pro', price: 5, period: '/month' },
  ultimate: { name: 'Ultimate', price: 10, period: '/month' },
};

export default function CheckoutPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') || 'starter';
  const planInfo = PLAN_DETAILS[plan] || PLAN_DETAILS.starter;

  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return path === '/' ? `/${locale}` : `/${locale}${path}`;
  };

  const [user, setUser] = useState<User | null>(null);
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<'success' | 'failed' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push(localePath('/login'));
        return;
      }
      setUser(session.user);
    };
    checkUser();
  }, [router]);

  const handlePayment = async () => {
    setError('');
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (code === '1234') {
      // Payment successful - update subscription in database
      if (user) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

        // First, delete any existing subscription for this user
        await supabase
          .from('user_subscriptions')
          .delete()
          .eq('user_id', user.id);

        // Then insert the new subscription
        await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            email: user.email,
            package_type: plan,
            package_name: planInfo.name,
            price: planInfo.price,
            leagues_allowed: plan === 'ultimate' ? 6 : plan === 'pro' ? 5 : 1,
            betting_styles_allowed: plan === 'ultimate' ? 5 : 1,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: 'active',
          });
      }
      setResult('success');
    } else {
      setResult('failed');
      setError('Invalid payment code. Please try again.');
    }

    setIsProcessing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f]" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link href={localePath('/pricing')} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Pricing
          </Link>

          {/* Success State */}
          {result === 'success' && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-500/30 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-2">Payment Successful!</h2>
              <p className="text-gray-400 mb-6">
                Your {planInfo.name} plan is now active. Enjoy your premium features!
              </p>
              <Link
                href={localePath('/pricing')}
                className="inline-block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                Back to Pricing
              </Link>
            </div>
          )}

          {/* Failed State */}
          {result === 'failed' && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-red-500/30 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Payment Failed</h2>
              <p className="text-gray-400 mb-6">
                {error || 'Something went wrong. Please try again.'}
              </p>
              <button
                onClick={() => {
                  setResult(null);
                  setCode('');
                }}
                className="w-full py-3 px-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all mb-3"
              >
                Try Again
              </button>
              <Link
                href={localePath('/pricing')}
                className="inline-block w-full py-3 px-4 rounded-xl border border-white/20 text-white font-semibold text-center hover:bg-white/10 transition-all"
              >
                Back to Pricing
              </Link>
            </div>
          )}

          {/* Payment Form */}
          {!result && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">Complete Your Purchase</h1>
                <p className="text-gray-400">Demo Payment Gateway</p>
              </div>

              {/* Plan Summary */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">{planInfo.name} Plan</h3>
                    <p className="text-sm text-gray-400">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-emerald-400">${planInfo.price}</span>
                    <span className="text-gray-400">{planInfo.period}</span>
                  </div>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">Demo Mode</p>
                    <p className="text-yellow-400/70 text-xs mt-1">Enter code <span className="font-mono bg-yellow-500/20 px-1 rounded">1234</span> for successful payment</p>
                  </div>
                </div>
              </div>

              {/* Payment Code Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter payment code"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-center text-2xl tracking-widest font-mono"
                />
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || code.length !== 4}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isProcessing || code.length !== 4
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay $${planInfo.price}`
                )}
              </button>

              {/* Security Note */}
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure demo payment</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
