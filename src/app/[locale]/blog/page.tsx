import BlogClient from './BlogClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;

  return <BlogClient locale={locale} />;
}
