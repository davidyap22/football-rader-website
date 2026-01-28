import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createPaymentRequest } from '@/lib/x1pag';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { planType } = body;

    if (!planType) {
      return NextResponse.json(
        { error: 'Missing plan type' },
        { status: 400 }
      );
    }

    const user = session.user;

    // Create payment request with X1PAG
    const paymentResult = await createPaymentRequest({
      planType,
      userId: user.id,
      userEmail: user.email || '',
      userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      userPhone: user.user_metadata?.phone || undefined,
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

      await supabase.from('user_subscriptions').upsert({
        user_id: user.id,
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
