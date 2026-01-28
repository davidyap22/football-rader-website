import { NextResponse } from 'next/server';
import { X1PAG_CONFIG } from '@/lib/x1pag';

/**
 * Verification endpoint to check X1PAG configuration
 * DO NOT expose in production - for debugging only
 */
export async function GET() {
  const config = {
    merchantKey: X1PAG_CONFIG.merchantKey ? `SET (${X1PAG_CONFIG.merchantKey.slice(0, 8)}...)` : 'NOT_SET',
    password: X1PAG_CONFIG.password ? `SET (${X1PAG_CONFIG.password.slice(0, 8)}...)` : 'NOT_SET',
    host: X1PAG_CONFIG.host || 'NOT_SET',
    successUrl: X1PAG_CONFIG.successUrl || 'NOT_SET',
    cancelUrl: X1PAG_CONFIG.cancelUrl || 'NOT_SET',
    callbackUrl: X1PAG_CONFIG.callbackUrl || 'NOT_SET',
  };

  return NextResponse.json({
    status: 'Configuration Check',
    config,
    warnings: [
      !X1PAG_CONFIG.merchantKey && 'X1PAG_MERCHANT_KEY is not set',
      !X1PAG_CONFIG.password && 'X1PAG_PASSWORD is not set',
      !X1PAG_CONFIG.successUrl && 'X1PAG_RETURN_URL is not set (required field!)',
      !X1PAG_CONFIG.cancelUrl && 'X1PAG_CANCEL_URL is not set',
      !X1PAG_CONFIG.callbackUrl && 'X1PAG_CALLBACK_URL is not set',
    ].filter(Boolean),
  });
}
