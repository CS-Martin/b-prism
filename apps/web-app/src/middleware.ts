import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/login',
    },
});

export const config = {
    matcher: ['/', '/map', '/auth/register', '/auth/login', '/api/:path*',  '/api/auth/:path*'],
};

export async function middleware(req: NextRequest) {

    const { pathname } = req.nextUrl;

    const token = await getToken({ req });
    const isAuthenticated = !!token;

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirect logged-in users away from login and register pages
    if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}