import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '../../../../services/authentication.service';

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Password',
                },
            },
            async authorize(credentials) {
                console.log('Received credentials:', credentials);

                if (!credentials?.email || !credentials?.password) return null;

                const response = await authService.verify(
                    credentials.email,
                    credentials.password
                );

                return response;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user = token.user as {
                    id?: string;
                    given_name?: string;
                    family_name?: string;
                    email?: string;
                    image?: string;
                    office?: string;
                    position?: string;
                    role?: string;
                };
            }

            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
                token.role = (user as { role?: string }).role;
            }

            return token;
        },
    },
};
