import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired(
    
);

// Middleware applies to routes defined in the matcher
export const config = {
    matcher: ['/api/:path*', '/map/:path*'],
};
