export const locales = ['en', 'zh', 'id', 'ms'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  id: '🇮🇩',
  ms: '🇲🇾',
};
