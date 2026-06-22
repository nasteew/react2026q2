import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { type NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isRoot = /^\/[a-z]{2}\/?$/.test(pathname);

  if (isRoot && !searchParams.get('page')) {
    const url = request.nextUrl.clone();
    url.searchParams.set('page', '1');
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
