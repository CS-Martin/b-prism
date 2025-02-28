import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '../../../../services/authentication.service';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { NextAuthOptions } from 'next-auth';

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

                const response = await authService.verify(credentials.email, credentials.password);

                if (!response || !response.user || !response.accessToken) {
                    throw new Error('Invalid email or password.');
                }

                return {
                    id: response.user.id,
                    given_name: response.user.given_name,
                    family_name: response.user.family_name,
                    email: response.user.email,
                    office: response.user.office ?? undefined,
                    position: response.user.position ?? undefined,
                    role: response.user.role,
                    id_image_url: response.user.id_image_url ?? undefined,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Add user data on initial sign-in
            if (user) {
                token.id = user.id;
                token.given_name = user.given_name;
                token.family_name = user.family_name;
                token.email = user.email;
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
            }
            return token;
        },

        async session({ session, token }) {
            // Pass token properties to session
            session.user = {
                id: token.id,
                given_name: token.given_name,
                family_name: token.family_name,
                email: token.email,
                role: token.role,
                accessToken: token.accessToken ?? '',
                refreshToken: token.refreshToken ?? '',
            };

            return session;
        },
    },

    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24, // 1 day session expiration
    },
    pages: {
        signIn: '/auth/login',
    },
};
