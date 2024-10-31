import { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

// Middleware applies to routes defined in the matcher
export const config = {
    matcher: ['/api/:path*', '/map/:path*', '/'],
};
