/**
 * X1PAG Payment Gateway Integration
 * Documentation: https://docs.x1pag.com/docs/guides/checkout_integration/
 */

import crypto from 'crypto';

// X1PAG Configuration
export const X1PAG_CONFIG = {
  merchantName: process.env.X1PAG_MERCHANT_NAME || 'OddsFlow',
  merchantKey: process.env.X1PAG_MERCHANT_KEY || '',
  password: process.env.X1PAG_PASSWORD || '',
  host: process.env.X1PAG_HOST || 'https://pay.x1pag.com',
  callbackUrl: process.env.X1PAG_CALLBACK_URL || '',
  returnUrl: process.env.X1PAG_RETURN_URL || '',
  cancelUrl: process.env.X1PAG_CANCEL_URL || '',
};

// Plan pricing configuration
export const PLAN_PRICING = {
  free_trial: {
    amount: 0,
    currency: 'BRL', // Brazilian Real
    name: 'Free Trial',
    duration: '7 days',
  },
  starter: {
    amount: 29.90, // Weekly price in BRL
    currency: 'BRL',
    name: 'Starter Plan',
    duration: '1 week',
    billingCycle: 'weekly',
  },
  pro: {
    amount: 89.90, // Monthly price in BRL
    currency: 'BRL',
    name: 'Pro Plan',
    duration: '1 month',
    billingCycle: 'monthly',
  },
  ultimate: {
    amount: 199.90, // Monthly price in BRL
    currency: 'BRL',
    name: 'Ultimate Plan',
    duration: '1 month',
    billingCycle: 'monthly',
  },
};

export interface X1PAGPaymentRequest {
  merchantKey: string;
  merchantName: string;
  amount: number;
  currency: string;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  callbackUrl: string;
  returnUrl: string;
  cancelUrl: string;
  description: string;
  signature: string;
}

export interface X1PAGPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
  message?: string;
}

export interface X1PAGCallbackData {
  transactionId: string;
  orderReference: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  amount: number;
  currency: string;
  paymentMethod: string;
  timestamp: string;
  signature: string;
}

/**
 * Generate HMAC signature for X1PAG request
 */
export function generateSignature(data: Record<string, any>): string {
  // Sort keys alphabetically
  const sortedKeys = Object.keys(data).sort();

  // Create string with sorted key=value pairs
  const signatureString = sortedKeys
    .map(key => `${key}=${data[key]}`)
    .join('&');

  // Generate HMAC-SHA256 signature
  const hmac = crypto.createHmac('sha256', X1PAG_CONFIG.password);
  hmac.update(signatureString);
  return hmac.digest('hex');
}

/**
 * Verify X1PAG callback signature
 */
export function verifyCallbackSignature(data: X1PAGCallbackData): boolean {
  const receivedSignature = data.signature;

  // Create signature without the signature field
  const dataWithoutSignature = { ...data };
  delete (dataWithoutSignature as any).signature;

  const calculatedSignature = generateSignature(dataWithoutSignature);

  return receivedSignature === calculatedSignature;
}

/**
 * Create a payment request with X1PAG
 */
export async function createPaymentRequest(params: {
  planType: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
}): Promise<X1PAGPaymentResponse> {
  const { planType, userId, userEmail, userName, userPhone } = params;

  // Validate plan type
  if (!PLAN_PRICING[planType as keyof typeof PLAN_PRICING]) {
    return {
      success: false,
      error: 'INVALID_PLAN',
      message: 'Invalid plan type',
    };
  }

  const plan = PLAN_PRICING[planType as keyof typeof PLAN_PRICING];

  // Free trial doesn't require payment
  if (planType === 'free_trial') {
    return {
      success: true,
      message: 'Free trial activated',
    };
  }

  // Generate unique order reference
  const orderReference = `ODDSFLOW-${planType.toUpperCase()}-${userId}-${Date.now()}`;

  // Prepare payment data
  const paymentData = {
    merchantKey: X1PAG_CONFIG.merchantKey,
    merchantName: X1PAG_CONFIG.merchantName,
    amount: plan.amount,
    currency: plan.currency,
    orderReference,
    customerName: userName,
    customerEmail: userEmail,
    customerPhone: userPhone || '',
    callbackUrl: X1PAG_CONFIG.callbackUrl,
    returnUrl: X1PAG_CONFIG.returnUrl,
    cancelUrl: X1PAG_CONFIG.cancelUrl,
    description: `${plan.name} - ${plan.duration}`,
  };

  // Generate signature
  const signature = generateSignature(paymentData);

  const requestData: X1PAGPaymentRequest = {
    ...paymentData,
    signature,
  };

  try {
    // Send request to X1PAG
    const response = await fetch(`${X1PAG_CONFIG.host}/api/v1/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: 'PAYMENT_API_ERROR',
        message: errorData.message || 'Payment gateway error',
      };
    }

    const result = await response.json();

    if (result.success && result.paymentUrl) {
      return {
        success: true,
        paymentUrl: result.paymentUrl,
        transactionId: result.transactionId,
      };
    } else {
      return {
        success: false,
        error: 'PAYMENT_CREATION_FAILED',
        message: result.message || 'Failed to create payment',
      };
    }
  } catch (error) {
    console.error('X1PAG payment creation error:', error);
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Failed to connect to payment gateway',
    };
  }
}

/**
 * Format amount for display
 */
export function formatCurrency(amount: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Get plan details by type
 */
export function getPlanDetails(planType: string) {
  return PLAN_PRICING[planType as keyof typeof PLAN_PRICING] || null;
}
