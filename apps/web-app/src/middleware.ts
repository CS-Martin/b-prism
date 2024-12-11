import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

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
    matcher: ['/', '/map', '/auth/register', '/auth/login', '/admin/:path*', '/api/:path*', '/api/auth/:path*'],
};

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = await getToken({ req });
    const isAuthenticated = !!token;

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    if (pathname === '/admin/dashboard' && token?.role !== 'admin') {
        console.log('GRANTING ACCESS TO ADMIN', token?.role);

        return NextResponse.redirect(new URL('/home', req.url));
    }

    return NextResponse.next();
}
