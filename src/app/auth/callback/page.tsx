'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, createFreeTrialSubscription, getUserSubscription } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setStatus('Authentication failed. Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        if (session?.user) {
          setStatus('Setting up your account...');

          // Check if user already has a subscription
          const { data: existingSub } = await getUserSubscription(session.user.id);

          if (!existingSub) {
            // Create free trial subscription for new OAuth users
            const { error: subError } = await createFreeTrialSubscription(
              session.user.id,
              session.user.email || ''
            );

            if (subError) {
              console.error('Subscription creation error:', subError);
              // Don't block login if subscription creation fails
            }
          }

          setStatus('Success! Redirecting to dashboard...');
          setTimeout(() => router.push('/dashboard'), 1000);
        } else {
          setStatus('No session found. Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setStatus('An error occurred. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          {status}
        </h1>
        <p className="text-gray-400">Please wait while we set up your account</p>
      </div>
    </div>
  );
}
