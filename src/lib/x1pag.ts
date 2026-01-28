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
  merchantKey: process.env.X1PAG_MERCHANT_KEY || '',
  password: process.env.X1PAG_PASSWORD || '',
  host: process.env.X1PAG_HOST || 'https://pay.x1pag.com',
  successUrl: process.env.X1PAG_RETURN_URL || '',
  cancelUrl: process.env.X1PAG_CANCEL_URL || '',
  callbackUrl: process.env.X1PAG_CALLBACK_URL || '',
};

export interface X1PAGSessionRequest {
  merchant_key: string;
  operation: 'purchase' | 'debit' | 'transfer' | 'credit';
  order: {
    number: string;
    amount: string;
    currency: string;
    description: string;
  };
  success_url: string;
  cancel_url?: string;
  hash: string;
  customer?: {
    name: string;
    email: string;
  };
}

export interface X1PAGPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  sessionId?: string;
  error?: string;
  message?: string;
}

export interface X1PAGCallbackData {
  id: string;
  order_number: string;
  order_amount: string;
  order_currency: string;
  order_status: string;
  order_description?: string;
  type: string;
  status: 'success' | 'fail' | 'waiting' | 'undefined';
  hash: string;
  [key: string]: any;
}

/**
 * Generate hash for X1PAG request
 * Formula: SHA1(MD5(UPPERCASE(order_number + amount + currency + description + password)))
 */
export function generateHash(
  orderNumber: string,
  amount: string,
  currency: string,
  description: string
): string {
  // Concatenate values and uppercase
  const data = (orderNumber + amount + currency + description + X1PAG_CONFIG.password).toUpperCase();

  // MD5 hash
  const md5Hash = crypto.createHash('md5').update(data).digest('hex');

  // SHA1 of MD5
  const sha1Hash = crypto.createHash('sha1').update(md5Hash).digest('hex');

  return sha1Hash;
}

/**
 * Verify X1PAG callback hash
 * Formula: SHA1(MD5(UPPERCASE(payment_id + order_number + amount + currency + description + password)))
 */
export function verifyCallbackHash(data: X1PAGCallbackData): boolean {
  const receivedHash = data.hash;

  // Build string for validation
  const validationString = (
    data.id +
    data.order_number +
    data.order_amount +
    data.order_currency +
    (data.order_description || '') +
    X1PAG_CONFIG.password
  ).toUpperCase();

  // MD5 hash
  const md5Hash = crypto.createHash('md5').update(validationString).digest('hex');

  // SHA1 of MD5
  const calculatedHash = crypto.createHash('sha1').update(md5Hash).digest('hex');

  return receivedHash === calculatedHash;
}

/**
 * Create a payment session with X1PAG
 */
export async function createPaymentRequest(params: {
  planType: string;
  currency?: SupportedCurrency;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
}): Promise<X1PAGPaymentResponse> {
  const { planType, currency = 'USD', userId, userEmail, userName } = params;

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

  // Generate unique order number
  const orderNumber = `ODDSFLOW-${planType.toUpperCase()}-${userId.slice(0, 8)}-${Date.now()}`;

  // Format amount as string with 2 decimals
  const amountString = plan.amount.toFixed(2);

  // Description
  const description = `${plan.name} - ${plan.duration}`;

  // Generate hash
  const hash = generateHash(orderNumber, amountString, plan.currency, description);

  // Prepare session request (field order matches X1PAG documentation example)
  const sessionRequest: X1PAGSessionRequest = {
    merchant_key: X1PAG_CONFIG.merchantKey,
    operation: 'purchase',
    order: {
      number: orderNumber,
      amount: amountString,
      currency: plan.currency,
      description: description,
    },
    success_url: X1PAG_CONFIG.successUrl,
    cancel_url: X1PAG_CONFIG.cancelUrl,
    customer: {
      name: userName,
      email: userEmail,
    },
    hash: hash,
  };

  // Log request for debugging
  console.log('X1PAG Session Request:', {
    url: `${X1PAG_CONFIG.host}/api/v1/session`,
    order_number: orderNumber,
    currency: plan.currency,
    amount: amountString,
    merchantKey: X1PAG_CONFIG.merchantKey ? '***' + X1PAG_CONFIG.merchantKey.slice(-4) : 'NOT_SET',
    hash: hash.slice(0, 10) + '...',
  });

  // Log full request body for debugging (hide sensitive data)
  const debugRequest = {
    ...sessionRequest,
    merchant_key: sessionRequest.merchant_key ? '***' + sessionRequest.merchant_key.slice(-4) : 'NOT_SET',
    hash: sessionRequest.hash.slice(0, 16) + '...',
  };
  console.log('Full Request Body:', JSON.stringify(debugRequest, null, 2));

  // Log hash generation details
  console.log('Hash Generation:', {
    input: `${orderNumber}${amountString}${plan.currency}${description}[PASSWORD]`,
    uppercased_length: (orderNumber + amountString + plan.currency + description + X1PAG_CONFIG.password).length,
    hash_result: hash,
  });

  try {
    // Send request to X1PAG
    const response = await fetch(`${X1PAG_CONFIG.host}/api/v1/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(sessionRequest),
    });

    console.log('X1PAG Response Status:', response.status, response.statusText);

    const responseText = await response.text();
    console.log('X1PAG Response Body:', responseText);

    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse X1PAG response:', responseText);
      return {
        success: false,
        error: 'INVALID_RESPONSE',
        message: 'Invalid response from payment gateway',
      };
    }

    if (!response.ok) {
      console.error('X1PAG API Error:', result);

      // Handle specific X1PAG error codes
      let errorMessage = result.error_message || result.message || result.error || `Payment gateway error (${response.status}: ${response.statusText})`;

      // Check for detailed validation errors
      if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
        const firstError = result.errors[0];

        // Error 100000: Protocol mapping not found
        if (firstError.error_code === 100000) {
          errorMessage = 'Payment gateway configuration error. Please contact support with error code: 100000 (Protocol mapping not found)';
          console.error('X1PAG Configuration Error: Protocol mapping not found. This usually means:');
          console.error('1. Merchant account is not fully activated');
          console.error('2. Currency (USD) is not enabled for this merchant');
          console.error('3. Payment protocol/method configuration is missing');
          console.error('4. Merchant needs to contact X1PAG support to verify account setup');
        } else {
          errorMessage = `${errorMessage} - ${firstError.error_message} (code: ${firstError.error_code})`;
        }
      }

      return {
        success: false,
        error: 'PAYMENT_API_ERROR',
        message: errorMessage,
      };
    }

    // Check for redirect_url in response
    if (result.redirect_url) {
      console.log('X1PAG Success - Redirect URL received');
      return {
        success: true,
        paymentUrl: result.redirect_url,
        sessionId: result.session_id || result.id,
      };
    } else {
      console.error('X1PAG Response missing redirect_url:', result);
      return {
        success: false,
        error: 'NO_REDIRECT_URL',
        message: 'Payment gateway did not return a payment URL',
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
