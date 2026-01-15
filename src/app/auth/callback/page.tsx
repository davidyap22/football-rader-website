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
        // Handle the OAuth callback - exchange code/hash for session
        // This handles both PKCE (code in query) and implicit (hash fragment) flows
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);

        // Check if we have an access token in hash (implicit flow)
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        // Check if we have a code in query (PKCE flow)
        const code = queryParams.get('code');

        // IMMEDIATELY clear sensitive data from URL after reading
        // This must happen BEFORE any async operations
        if (accessToken || code) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        let session = null;
        let error = null;

        if (accessToken) {
          // Implicit flow - set session from hash
          const { data, error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          session = data?.session;
          error = setError;
        } else if (code) {
          // PKCE flow - exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          session = data?.session;
          error = exchangeError;
        } else {
          // Try getting existing session
          const { data, error: getError } = await supabase.auth.getSession();
          session = data?.session;
          error = getError;
        }

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
