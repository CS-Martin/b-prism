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
            id_image_url?: string;
            accessToken: string;
            refreshToken?: string;
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
        id_image_url?: string;
        accessToken?: string;
        refreshToken?: string;
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
        id_image_url?: string;
        accessToken?: string;
        refreshToken?: string;
    }
}
