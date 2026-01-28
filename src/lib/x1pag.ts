/**
 * X1PAG Payment Gateway Integration - Server-Side Only
 * Documentation: https://docs.x1pag.com/docs/guides/checkout_integration/
 *
 * IMPORTANT: This file uses Node.js crypto module and is SERVER-SIDE ONLY.
 * Only import this in API routes or server components (NOT in client components).
 * For client-safe exports, use @/lib/x1pag-client instead.
 */

import crypto from 'crypto';
import { PLAN_PRICING_MULTI_CURRENCY, type SupportedCurrency } from './x1pag-client';

// X1PAG Configuration (server-side only - contains sensitive data)
export const X1PAG_CONFIG = {
  merchantName: process.env.X1PAG_MERCHANT_NAME || 'OddsFlow',
  merchantKey: process.env.X1PAG_MERCHANT_KEY || '',
  password: process.env.X1PAG_PASSWORD || '',
  host: process.env.X1PAG_HOST || 'https://pay.x1pag.com',
  callbackUrl: process.env.X1PAG_CALLBACK_URL || '',
  returnUrl: process.env.X1PAG_RETURN_URL || '',
  cancelUrl: process.env.X1PAG_CANCEL_URL || '',
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
  currency?: SupportedCurrency;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
}): Promise<X1PAGPaymentResponse> {
  const { planType, currency = 'USD', userId, userEmail, userName, userPhone } = params;

  // Get pricing for the selected currency
  const pricing = PLAN_PRICING_MULTI_CURRENCY[currency];

  // Validate plan type
  if (!pricing || !pricing[planType as keyof typeof pricing]) {
    return {
      success: false,
      error: 'INVALID_PLAN',
      message: 'Invalid plan type or currency',
    };
  }

  const plan = pricing[planType as keyof typeof pricing];

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
    // Log request for debugging
    console.log('X1PAG Request:', {
      url: `${X1PAG_CONFIG.host}/api/v1/checkout`,
      currency: plan.currency,
      amount: plan.amount,
      merchantKey: X1PAG_CONFIG.merchantKey ? '***' + X1PAG_CONFIG.merchantKey.slice(-4) : 'NOT_SET',
    });

    // Send request to X1PAG
    const response = await fetch(`${X1PAG_CONFIG.host}/api/v1/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('X1PAG Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('X1PAG API Error:', errorData);
      return {
        success: false,
        error: 'PAYMENT_API_ERROR',
        message: errorData.message || `Payment gateway error (${response.status}: ${response.statusText})`,
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
