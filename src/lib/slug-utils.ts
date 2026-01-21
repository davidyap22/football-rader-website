/**
 * Utility functions for generating SEO-friendly URL slugs
 */

/**
 * Convert a string to a URL-friendly slug
 * Example: "Manchester City" → "manchester-city"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a match slug from team names
 * Example: "Manchester City", "Arsenal" → "manchester-city-vs-arsenal-prediction"
 */
export function generateMatchSlug(homeName: string, awayName: string): string {
  const homeSlug = slugify(homeName);
  const awaySlug = slugify(awayName);
  return `${homeSlug}-vs-${awaySlug}-prediction`;
}

/**
 * Generate the full SEO-friendly URL for a match prediction
 * Example: "/predictions/2026-01-21/manchester-city-vs-arsenal-prediction"
 *
 * @param locale - The locale (e.g., 'en', 'es')
 * @param date - Date in YYYY-MM-DD format
 * @param homeName - Home team name
 * @param awayName - Away team name
 * @param fixtureId - The fixture ID (included at end for reliable data lookup)
 */
export function generateMatchUrl(
  locale: string,
  date: string,
  homeName: string,
  awayName: string,
  fixtureId: number | string
): string {
  const slug = generateMatchSlug(homeName, awayName);
  const basePath = locale === 'en' ? '' : `/${locale}`;
  // Include fixture ID at end of slug for reliable data lookup, but still SEO-friendly
  return `${basePath}/predictions/${date}/${slug}-${fixtureId}`;
}

/**
 * Parse the fixture ID from a match slug
 * Example: "manchester-city-vs-arsenal-prediction-484" → 484
 */
export function parseFixtureIdFromSlug(slug: string): number | null {
  // The fixture ID is the last segment after the final hyphen
  const match = slug.match(/-(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

/**
 * Format a date for URL (YYYY-MM-DD)
 */
export function formatDateForUrl(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
