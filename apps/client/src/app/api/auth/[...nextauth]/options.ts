import { authenticationService } from 'apps/client/src/services/authentication-service';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },
            async authorize(credentials) {
                console.log('Received credentials:', credentials);

                if (!credentials?.email || !credentials?.password) return null;

                const response = await authenticationService.verify(credentials.email, credentials.password);

                return response;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user = token.user as { 
                id?: string;
                name?: string; 
                email?: string; 
                image?: string;
                given_name?: string;
                family_name?: string;
                office?: string;
                position?: string;
                role?: string;
            };
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
    },
    // pages: {
    //     signIn: '/dashboard',
    //     signOut: '/auth/login',
    // },
};
