import { redirect } from 'next/navigation';

// Redirect from old /player URL to new /players URL (plural)
export default async function PlayerRedirectPage({
  params
}: {
  params: Promise<{ locale: string; league: string }>
}) {
  const { locale, league } = await params;
  const newPath = locale === 'en'
    ? `/leagues/${league}/players`
    : `/${locale}/leagues/${league}/players`;
  redirect(newPath);
}
