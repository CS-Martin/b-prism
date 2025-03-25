import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            given_name?: string;
            family_name?: string;
            email: string;
            office?: string;
            position?: string;
            role?: string;
            permissions: string[];
            id_image_url?: string;
            access_token: string;
            refresh_token?: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        given_name?: string;
        family_name?: string;
        email: string;
        office?: string;
        position?: string;
        role?: string;
        permissions: string[];
        id_image_url?: string;
        access_token?: string;
        refresh_token?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        given_name?: string;
        family_name?: string;
        email: string;
        office?: string;
        position?: string;
        role?: string;
        permissions: string[];
        id_image_url?: string;
        access_token?: string;
        refresh_token?: string;
    }
}
