// Root layout - passes through to [locale]/layout.tsx which has the html/body tags
// This is needed for Next.js App Router with i18n routing
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
