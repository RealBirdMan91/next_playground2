import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/') ||
    pathname.startsWith('/signup')
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/', request.url));
}
