import type { ReactNode } from 'react';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/context/ThemeContext';
import '../globals.css';

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/Poké_Ball_icon.svg.png" />
        <title>Pokémon</title>
      </head>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <div id="root">{children}</div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
