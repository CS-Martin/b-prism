import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '../../../../services/authentication.service';
import { jwtDecode } from 'jwt-decode';
import { NextAuthOptions } from 'next-auth';
import { useRouter } from 'next/navigation';

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },
            async authorize(credentials) {
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
            // Handle new user sign-in
            if (user) {
                token.id = user.id;
                token.given_name = user.given_name;
                token.family_name = user.family_name;
                token.email = user.email;
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;

                const decodedToken = jwtDecode<{ exp?: number }>(token.accessToken!);
                token.accessTokenExpires = decodedToken?.exp ? decodedToken.exp * 1000 : Date.now() + 1000 * 60 * 15;
            }

            // Check if the access token is still valid
            if (typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
                console.log('✅ Token is still valid until:', new Date(token.accessTokenExpires));
                console.log('Access token:', token.accessToken);
                return token;
            }

            console.log('🔄 Access token expired, refreshing token...');

            try {
                // This only returns the new accessToken
                const newAccessToken = await authService.refreshAccessToken(token.refreshToken);
                console.log(newAccessToken);

                console.log(newAccessToken);

                if (!newAccessToken) {
                    console.error('❌ Failed to refresh access token');
                    return token;
                }

                console.log('✅ Successfully refreshed access token:', newAccessToken);
                // Decode the new access token to update expiration time
                const decodedNewToken = jwtDecode<{ exp?: number }>(newAccessToken);
                const newExpiry = decodedNewToken?.exp ? decodedNewToken.exp * 1000 : Date.now() + 1000 * 60 * 15;

                return {
                    ...token,
                    accessToken: newAccessToken,
                    accessTokenExpires: newExpiry,
                };
            } catch (error) {
                console.error('❌ Error refreshing token:', error);
                return token;
            }
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
