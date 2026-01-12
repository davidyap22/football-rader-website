'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    // Get the path without the locale prefix
    let pathWithoutLocale = pathname;

    // Remove current locale prefix if present
    for (const locale of locales) {
      if (pathname.startsWith(`/${locale}/`)) {
        pathWithoutLocale = pathname.substring(locale.length + 1);
        break;
      } else if (pathname === `/${locale}`) {
        pathWithoutLocale = '/';
        break;
      }
    }

    // Build new path with new locale
    const newPath = newLocale === 'en'
      ? pathWithoutLocale
      : `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    router.push(newPath);
    setIsOpen(false);
  };

  const currentFlag = localeFlags[currentLocale as Locale] || 'gb';
  const currentName = localeNames[currentLocale as Locale] || 'English';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700/50"
      >
        <Image
          src={`https://flagcdn.com/w40/${currentFlag}.png`}
          width={24}
          height={16}
          alt={`${currentName} flag`}
          className="rounded-sm"
        />
        <span className="text-sm font-medium text-gray-200 uppercase">
          {currentLocale === 'zh' ? '中文' : currentLocale.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-800 transition-colors ${
                locale === currentLocale ? 'bg-emerald-900/30 text-emerald-400' : 'text-gray-200'
              }`}
            >
              <Image
                src={`https://flagcdn.com/w40/${localeFlags[locale]}.png`}
                width={24}
                height={16}
                alt={`${localeNames[locale]} flag`}
                className="rounded-sm"
              />
              <span className="font-medium">{localeNames[locale]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
