/**
 * X1PAG Payment Gateway Integration - Client-Safe Exports
 * These exports can be safely used in both client and server components
 */

// Supported currencies
export type SupportedCurrency = 'BRL' | 'USD';

// Multi-currency pricing configuration
export const PLAN_PRICING_MULTI_CURRENCY = {
  BRL: {
    free_trial: {
      amount: 0,
      currency: 'BRL',
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
  },
  USD: {
    free_trial: {
      amount: 0,
      currency: 'USD',
      name: 'Free Trial',
      duration: '7 days',
      billingCycle: 'one-time',
    },
    starter: {
      amount: 5.99, // Weekly price in USD (~5.0 BRL/USD rate)
      currency: 'USD',
      name: 'Starter Plan',
      duration: '1 week',
      billingCycle: 'weekly',
    },
    pro: {
      amount: 17.99, // Monthly price in USD
      currency: 'USD',
      name: 'Pro Plan',
      duration: '1 month',
      billingCycle: 'monthly',
    },
    ultimate: {
      amount: 39.99, // Monthly price in USD
      currency: 'USD',
      name: 'Ultimate Plan',
      duration: '1 month',
      billingCycle: 'monthly',
    },
  },
};

// Default pricing (BRL for backward compatibility)
export const PLAN_PRICING = PLAN_PRICING_MULTI_CURRENCY.BRL;

// Currency display information
export const CURRENCY_INFO = {
  BRL: {
    symbol: 'R$',
    locale: 'pt-BR',
    name: 'Brazilian Real',
    flag: '🇧🇷',
  },
  USD: {
    symbol: '$',
    locale: 'en-US',
    name: 'US Dollar',
    flag: '🇺🇸',
  },
};

/**
 * Format amount for display based on currency
 */
export function formatCurrency(amount: number, currency: SupportedCurrency = 'BRL'): string {
  const info = CURRENCY_INFO[currency];
  return new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Get plan details by type and currency
 */
export function getPlanDetails(planType: string, currency: SupportedCurrency = 'BRL') {
  const pricing = PLAN_PRICING_MULTI_CURRENCY[currency];
  return pricing[planType as keyof typeof pricing] || null;
}

/**
 * Get all available currencies
 */
export function getSupportedCurrencies(): SupportedCurrency[] {
  return Object.keys(PLAN_PRICING_MULTI_CURRENCY) as SupportedCurrency[];
}

/**
 * Detect user's preferred currency based on location (optional)
 * This is a simple implementation - you might want to use a geolocation service
 */
export function detectPreferredCurrency(): SupportedCurrency {
  // Check browser language
  const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en-US';

  if (browserLang.startsWith('pt') || browserLang.includes('BR')) {
    return 'BRL';
  }

  // Default to USD for international users
  return 'USD';
}

/**
 * Convert amount between currencies (approximate)
 * Note: X1PAG will handle actual conversion with real-time rates
 */
export function convertCurrency(amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency): number {
  if (fromCurrency === toCurrency) return amount;

  // Approximate conversion rates (BRL to USD ~5.0)
  const rates: Record<string, number> = {
    'BRL_USD': 0.20,  // 1 BRL = 0.20 USD
    'USD_BRL': 5.00,  // 1 USD = 5.00 BRL
  };

  const rate = rates[`${fromCurrency}_${toCurrency}`] || 1;
  return Number((amount * rate).toFixed(2));
}
