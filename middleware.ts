import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname === '/zx9-hub/login') {
    if (req.auth) {
      return NextResponse.redirect(new URL('/zx9-hub', req.url));
    }
    return NextResponse.next();
  }

  if (!req.auth) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/zx9-hub/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/zx9-hub/:path*', '/api/admin/:path*'],
};
