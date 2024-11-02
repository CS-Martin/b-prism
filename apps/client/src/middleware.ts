import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
// export default withAuth({
//     callbacks: {
//         authorized: ({ token }) => !!token,
//     },
//     pages: {
//         signIn: '/auth/login',
//         signOut: '/auth/login',
//     },
// });

export const config = {
    matcher: ['/map', '/auth/register', '/auth/login', '/api/:path*',  '/api/auth/:path*'],
};

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isAuthenticated = !!token;
    
    if (isAuthenticated && (req.nextUrl.pathname === '/auth/login' || req.nextUrl.pathname === '/auth/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const authMiddleware = withAuth({
        // callbacks: {
        //     authorized: ({ token }) => isAuthenticated,
        // },
        pages: {
            signIn: '/auth/login',
            signOut: '/auth/login',
        },
    });

    // @ts-ignore
    return authMiddleware(req);
    // return authMiddleware(req);

    // const { pathname } = req.nextUrl;
    // const token = req.cookies.get('next-auth.session-token');


    // return NextResponse.next();
}