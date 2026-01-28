import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPaymentRequest } from '@/lib/x1pag';

export async function POST(request: NextRequest) {
  try {
    // Get request body - client will send user info from their session
    const body = await request.json();
    const { planType, currency = 'USD', userId, userEmail, userName } = body;

    console.log('Payment Create API Called:', { planType, currency, userId: userId ? '***' : 'MISSING' });

    // Validate required fields
    if (!planType) {
      console.error('Missing plan type');
      return NextResponse.json(
        { error: 'Missing plan type' },
        { status: 400 }
      );
    }

    if (!userId || !userEmail) {
      console.error('Missing user information:', { userId: !!userId, userEmail: !!userEmail });
      return NextResponse.json(
        { error: 'Missing user information' },
        { status: 400 }
      );
    }

    // Create payment request with X1PAG
    const paymentResult = await createPaymentRequest({
      planType,
      currency,
      userId,
      userEmail,
      userName: userName || userEmail.split('@')[0] || 'User',
      userPhone: undefined,
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        {
          error: paymentResult.error,
          message: paymentResult.message,
        },
        { status: 400 }
      );
    }

    // For free trial, activate immediately
    if (planType === 'free_trial') {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);

      // Use service role key for admin operations
      const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      await adminSupabase.from('user_subscriptions').upsert({
        user_id: userId,
        package_type: 'free_trial',
        expiry_date: expiryDate.toISOString(),
        status: 'active',
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Free trial activated',
        redirectUrl: '/dashboard',
      });
    }

    // Return payment URL for paid plans
    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.paymentUrl,
      transactionId: paymentResult.transactionId,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
