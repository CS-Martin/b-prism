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
    matcher: ['/', '/home', '/map', '/auth/:path*', '/admin/:path*', '/api/:path*', '/api/auth/:path*'],
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

    // Ensure users can only access their own complete-profile page
    const completeProfileMatch = pathname.match(/^\/auth\/([^/]+)\/complete-profile$/);
    if (completeProfileMatch) {
        const requestedUserId = completeProfileMatch[1];

        if (token?.id !== requestedUserId) {
            console.info('Unauthorized profile access attempt:', {
                requestedUserId,
                actualUserId: token?.id,
            });
            return NextResponse.redirect(new URL('/home', req.url));
        }

        if (token?.id_image_url) {
            console.info('You have already submitted your ID, redirecting to home');
            return NextResponse.redirect(new URL('/home', req.url));
        }
    }

    if (pathname === '/admin/roles' && !token?.permissions.includes('ROLE_PERMISSION')) {
        console.warn('Unauthorized access attempt to admin area by user with role:', token?.role);

        return NextResponse.redirect(new URL('/home', req.url));
    }

    if (pathname === '/admin/dashboard' && !token?.permissions.includes('USER_PERMISSION')) {
        console.warn('Unauthorized access attempt to admin area by user with role:', token?.role);

        return NextResponse.redirect(new URL('/home', req.url));
    }

    if (pathname === '/admin/activity-logs' && !token?.permissions.includes('ACTIVITY_LOG_PERMISSION')) {
        console.warn('Unauthorized access attempt to admin area by user with role:', token?.role);

        return NextResponse.redirect(new URL('/home', req.url));
    }

    return NextResponse.next();
}
