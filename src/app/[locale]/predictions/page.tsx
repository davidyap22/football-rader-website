import { Metadata } from 'next';
import PredictionsClient from './PredictionsClient';

// Helper to check if a date is in the past (before today)
function isDateInPast(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00Z');
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return date < todayUTC;
}

// Helper to check if a date is today
function isDateToday(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00Z');
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return date.getTime() === todayUTC.getTime();
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { date } = await searchParams;
  const baseUrl = 'https://www.oddsflow.ai';
  const canonicalPath = locale === 'en' ? '/predictions' : `/${locale}/predictions`;

  // Check if the date parameter is for a past date
  const isPastDate = date ? isDateInPast(date) : false;
  const isTodayDate = date ? isDateToday(date) : true; // No date param means today

  // For past dates, add noindex to prevent indexing of historical pages
  // Also set canonical to the main predictions page (without date param)
  const robots = isPastDate
    ? { index: false, follow: true } // noindex for past dates
    : { index: true, follow: true };

  return {
    // Canonical always points to the main predictions page (without date param)
    // This consolidates SEO authority to the main page
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
    },
    // Add noindex for past dates to prevent Google from indexing old prediction pages
    robots,
  };
}

export default function PredictionsPage() {
  return <PredictionsClient />;
}
