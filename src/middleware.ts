import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't redirect default locale to /en prefix (cleaner URLs)
  localePrefix: 'as-needed',

  // Disable automatic locale detection so users can manually switch languages
  localeDetection: false,
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - Static files (images, fonts, etc.)
  // - Favicon and other special files
  matcher: [
    // Match all pathnames except for specific patterns
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match root
    '/',
  ],
};
