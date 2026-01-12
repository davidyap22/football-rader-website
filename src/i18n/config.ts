export const locales = ['en', 'es', 'pt', 'de', 'fr', 'ja', 'ko', 'zh', 'tw', 'id'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
  ko: '한국어',
  zh: '简体中文',
  tw: '繁體中文',
  id: 'Bahasa Indonesia',
};

export const localeFlags: Record<Locale, string> = {
  en: 'gb',
  es: 'es',
  pt: 'br',
  de: 'de',
  fr: 'fr',
  ja: 'jp',
  ko: 'kr',
  zh: 'cn',
  tw: 'tw',
  id: 'id',
};

// Map URL locale to old translation codes (for backwards compatibility)
export const localeToTranslationCode: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  pt: 'PT',
  de: 'DE',
  fr: 'FR',
  ja: 'JA',
  ko: 'KO',
  zh: '中文',
  tw: '繁體',
  id: 'ID',
};
