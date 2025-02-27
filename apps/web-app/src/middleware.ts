import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { UserDto } from '@dto';

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

    const user: UserDto = token?.user as UserDto;

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

        if (user?.id !== requestedUserId) {
            console.log('Unauthorized profile access attempt:', {
                requestedUserId,
                actualUserId: token?.id,
            });
            return NextResponse.redirect(new URL('/home', req.url));
        }

        if (user?.id_image_url) {
            console.log('You have already submitted your ID, redirecting to home');
            return NextResponse.redirect(new URL('/home', req.url));
        }
    }

    if (pathname === '/admin/dashboard' || (pathname === '/admin/activity-logs' && user.role !== 'admin')) {
        console.log('GRANTING ACCESS TO ADMIN', user.role);

        return NextResponse.redirect(new URL('/home', req.url));
    }

    return NextResponse.next();
}
