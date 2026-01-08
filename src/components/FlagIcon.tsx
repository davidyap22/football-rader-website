'use client';

// Flag icon component that works across all platforms (Windows, Mac, Linux)
// Uses flagcdn.com for reliable flag images

const FLAG_CODES: Record<string, string> = {
  'EN': 'gb',
  'ES': 'es',
  'PT': 'br',
  'DE': 'de',
  'FR': 'fr',
  'JA': 'jp',
  'KO': 'kr',
  '中文': 'cn',
  '繁體': 'hk',
  'ID': 'id',
  // Lowercase variants for get-started page
  'en': 'gb',
  'es': 'es',
  'pt': 'br',
  'de': 'de',
  'fr': 'fr',
  'ja': 'jp',
  'ko': 'kr',
  'zh': 'cn',
  'tw': 'tw',
  'id': 'id',
};

interface FlagIconProps {
  code: string;
  size?: number;
  className?: string;
}

export default function FlagIcon({ code, size = 20, className = '' }: FlagIconProps) {
  const countryCode = FLAG_CODES[code] || 'gb';

  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={`${code} flag`}
      className={`inline-block rounded-sm ${className}`}
      style={{ objectFit: 'cover' }}
    />
  );
}

// Language data with country codes for flags
export const LANGUAGES = [
  { code: 'EN', name: 'English', countryCode: 'gb' },
  { code: 'ES', name: 'Español', countryCode: 'es' },
  { code: 'PT', name: 'Português', countryCode: 'br' },
  { code: 'DE', name: 'Deutsch', countryCode: 'de' },
  { code: 'FR', name: 'Français', countryCode: 'fr' },
  { code: 'JA', name: '日本語', countryCode: 'jp' },
  { code: 'KO', name: '한국어', countryCode: 'kr' },
  { code: '中文', name: '简体中文', countryCode: 'cn' },
  { code: '繁體', name: '繁體中文', countryCode: 'hk' },
  { code: 'ID', name: 'Bahasa Indonesia', countryCode: 'id' },
];
