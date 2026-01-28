import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyCallbackHash, X1PAGCallbackData } from '@/lib/x1pag';
import { PLAN_PRICING_MULTI_CURRENCY } from '@/lib/x1pag-client';

// Create Supabase admin client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * X1PAG Payment Callback Handler
 * This endpoint receives payment notifications from X1PAG
 * Format: URL-encoded form data or JSON
 */
export async function POST(request: NextRequest) {
  try {
    // Parse callback data (can be JSON or form-encoded)
    let callbackData: X1PAGCallbackData;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      callbackData = await request.json();
    } else {
      // Parse URL-encoded form data
      const formData = await request.formData();
      callbackData = Object.fromEntries(formData.entries()) as any;
    }

    console.log('X1PAG callback received:', {
      id: callbackData.id,
      order_number: callbackData.order_number,
      order_status: callbackData.order_status,
      status: callbackData.status,
      type: callbackData.type,
    });

    // Verify hash to ensure request is from X1PAG
    if (!verifyCallbackHash(callbackData)) {
      console.error('Invalid callback hash');
      return NextResponse.json(
        { error: 'Invalid hash' },
        { status: 401 }
      );
    }

    // Parse order number to extract plan and user info
    // Format: ODDSFLOW-{PLAN}-{USER_ID_PREFIX}-{TIMESTAMP}
    const orderParts = callbackData.order_number.split('-');
    if (orderParts.length < 4 || orderParts[0] !== 'ODDSFLOW') {
      console.error('Invalid order number format:', callbackData.order_number);
      return NextResponse.json(
        { error: 'Invalid order number' },
        { status: 400 }
      );
    }

    const planType = orderParts[1].toLowerCase();
    // Note: We stored only first 8 chars of userId in order number, need to get full userId from order details
    // For now, we'll need to look up the user by the partial ID or use custom_data if available
    const userIdPrefix = orderParts[2];

    // Get currency from order
    const currency = callbackData.order_currency;

    // Get plan details
    const pricing = PLAN_PRICING_MULTI_CURRENCY[currency as keyof typeof PLAN_PRICING_MULTI_CURRENCY];
    const plan = pricing?.[planType as keyof typeof pricing];

    if (!plan) {
      console.error('Invalid plan type or currency:', { planType, currency });
      return NextResponse.json(
        { error: 'Invalid plan type or currency' },
        { status: 400 }
      );
    }

    // Find user by matching order_number pattern
    // In a real implementation, you should store the full user ID in custom_data
    const { data: existingTransaction } = await supabase
      .from('payment_transactions')
      .select('user_id')
      .eq('order_reference', callbackData.order_number)
      .single();

    let userId: string;

    if (existingTransaction) {
      userId = existingTransaction.user_id;
    } else {
      // If not found, we need the full user ID
      // This is a limitation - should use custom_data in future
      console.error('Cannot find user ID for order:', callbackData.order_number);

      // For now, try to find user with matching ID prefix
      const { data: users } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .ilike('user_id', `${userIdPrefix}%`)
        .limit(1);

      if (!users || users.length === 0) {
        console.error('Cannot find user with ID prefix:', userIdPrefix);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      userId = users[0].user_id;
    }

    // Convert order_amount to number
    const amount = parseFloat(callbackData.order_amount);

    // Log payment transaction (upsert to avoid duplicates)
    await supabase.from('payment_transactions').upsert({
      user_id: userId,
      transaction_id: callbackData.id,
      order_reference: callbackData.order_number,
      amount: amount,
      currency: currency,
      status: callbackData.order_status,
      payment_method: callbackData.card || callbackData.type,
      plan_type: planType,
      callback_data: callbackData,
      created_at: new Date().toISOString(),
    }, {
      onConflict: 'transaction_id'
    });

    // Handle payment status
    // X1PAG statuses: settled = successful, prepare = pending, decline = failed
    if (callbackData.order_status === 'settled' && callbackData.status === 'success') {
      // Payment successful - activate subscription

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
          payment_transaction_id: callbackData.id,
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

      return NextResponse.json({
        success: true,
        message: 'Subscription activated',
      });

    } else if (callbackData.order_status === 'prepare' || callbackData.order_status === 'pending') {
      // Payment is pending
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          package_type: planType,
          status: 'pending',
          payment_transaction_id: callbackData.id,
          updated_at: new Date().toISOString(),
        });

      return NextResponse.json({
        success: true,
        message: 'Payment pending',
      });

    } else {
      // Payment declined, cancelled, or other status
      console.log('Payment not successful:', {
        order_status: callbackData.order_status,
        status: callbackData.status,
      });

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

// Handle GET for verification
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'X1PAG callback endpoint',
  });
}
