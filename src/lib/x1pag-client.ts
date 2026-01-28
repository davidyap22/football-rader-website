/**
 * X1PAG Payment Gateway Integration - Client-Safe Exports
 * These exports can be safely used in both client and server components
 */

// Plan pricing configuration (safe to use in client)
export const PLAN_PRICING = {
  free_trial: {
    amount: 0,
    currency: 'BRL', // Brazilian Real
    name: 'Free Trial',
    duration: '7 days',
    billingCycle: 'one-time',
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
