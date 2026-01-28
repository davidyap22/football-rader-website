import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyCallbackSignature, X1PAGCallbackData, PLAN_PRICING } from '@/lib/x1pag';

// Create Supabase admin client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * X1PAG Payment Callback Handler
 * This endpoint receives payment notifications from X1PAG
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const callbackData: X1PAGCallbackData = body;

    console.log('X1PAG callback received:', {
      transactionId: callbackData.transactionId,
      orderReference: callbackData.orderReference,
      status: callbackData.status,
    });

    // Verify signature to ensure request is from X1PAG
    if (!verifyCallbackSignature(callbackData)) {
      console.error('Invalid callback signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse order reference to extract plan and user info
    // Format: ODDSFLOW-{PLAN}-{USER_ID}-{TIMESTAMP}
    const orderParts = callbackData.orderReference.split('-');
    if (orderParts.length < 4 || orderParts[0] !== 'ODDSFLOW') {
      console.error('Invalid order reference format:', callbackData.orderReference);
      return NextResponse.json(
        { error: 'Invalid order reference' },
        { status: 400 }
      );
    }

    const planType = orderParts[1].toLowerCase();
    const userId = orderParts[2];

    // Log payment transaction
    await supabase.from('payment_transactions').insert({
      user_id: userId,
      transaction_id: callbackData.transactionId,
      order_reference: callbackData.orderReference,
      amount: callbackData.amount,
      currency: callbackData.currency,
      status: callbackData.status,
      payment_method: callbackData.paymentMethod,
      plan_type: planType,
      callback_data: callbackData,
      created_at: new Date().toISOString(),
    });

    // Handle payment status
    if (callbackData.status === 'approved') {
      // Payment successful - activate subscription
      const plan = PLAN_PRICING[planType as keyof typeof PLAN_PRICING];

      if (!plan) {
        console.error('Invalid plan type:', planType);
        return NextResponse.json(
          { error: 'Invalid plan type' },
          { status: 400 }
        );
      }

      // Calculate expiry date based on billing cycle
      const expiryDate = new Date();
      if (plan.billingCycle === 'weekly') {
        expiryDate.setDate(expiryDate.getDate() + 7);
      } else if (plan.billingCycle === 'monthly') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      }

      // Update user subscription
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          package_type: planType,
          expiry_date: expiryDate.toISOString(),
          status: 'active',
          payment_transaction_id: callbackData.transactionId,
          updated_at: new Date().toISOString(),
        });

      if (subscriptionError) {
        console.error('Subscription activation error:', subscriptionError);
        return NextResponse.json(
          { error: 'Failed to activate subscription' },
          { status: 500 }
        );
      }

      console.log('Subscription activated:', {
        userId,
        planType,
        expiryDate: expiryDate.toISOString(),
      });

      // Send success email (optional - implement later)
      // await sendSubscriptionEmail(userId, planType);

      return NextResponse.json({
        success: true,
        message: 'Subscription activated',
      });
    } else if (callbackData.status === 'pending') {
      // Payment is pending - update status but don't activate yet
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          package_type: planType,
          status: 'pending',
          payment_transaction_id: callbackData.transactionId,
          updated_at: new Date().toISOString(),
        });

      return NextResponse.json({
        success: true,
        message: 'Payment pending',
      });
    } else {
      // Payment rejected or cancelled
      console.log('Payment not approved:', callbackData.status);

      return NextResponse.json({
        success: true,
        message: 'Payment status recorded',
      });
    }
  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also handle GET for verification (some payment gateways send GET for verification)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'X1PAG callback endpoint',
  });
}
