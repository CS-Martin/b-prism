import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req });
    const isAuthenticated = !!token;

    // Redirect to /home if trying to access the root URL
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    // Protect all authenticated routes
    if (!isAuthenticated && !pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Redirect logged-in users away from login and register pages
    if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    // Ensure users can only access their own complete-profile page
    const completeProfileMatch = pathname.match(/^\/auth\/([^/]+)\/complete-profile$/);
    if (completeProfileMatch) {
        const requestedUserId = completeProfileMatch[1];

        if (token?.id !== requestedUserId) {
            console.log('Unauthorized profile access attempt:', {
                requestedUserId,
                actualUserId: token?.id,
            });
            return NextResponse.redirect(new URL('/home', req.url));
        }

        if (token?.id_image_url) {
            console.log('You have already submitted your ID, redirecting to home');
            return NextResponse.redirect(new URL('/home', req.url));
        }
    }

    // Restrict access to admin pages
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
        console.log('GRANTING ACCESS TO ADMIN', token?.role);
        return NextResponse.redirect(new URL('/home', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/home', '/map', '/auth/:path*', '/admin/:path*', '/api/:path*'],
};
