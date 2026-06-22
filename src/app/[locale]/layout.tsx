import type { ReactNode } from 'react';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata() {
  return {
    title: 'Pokémon Explorer | Search & Discover',
    description:
      'Search for your favorite Pokémon, explore their stats, abilities, types and moves. Built with Next.js and React.',
    keywords: [
      'Pokémon',
      'Pokedex',
      'Pokemon search',
      'Pokemon stats',
      'Next.js',
    ],
    authors: [{ name: 'RS School Student' }],
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/Poké_Ball_icon.svg.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <div id="root">{children}</div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
