import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '../../../../services/authentication.service';
import { jwtDecode } from 'jwt-decode';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { CreateUserDto } from '@dto';
import { useFindByEmailAndProvider } from 'apps/web-app/src/hooks/authentication.hook';

export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const response = await authService.validateCredentialLogin('credentials', credentials.email, credentials.password);

                if (!response || !response.user || !response.access_token) {
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
                    access_token: response.access_token,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === 'google' && profile) {
                if (!profile.email) {
                    return false;
                }

                try {
                    const createUserDto: CreateUserDto = new CreateUserDto();

                    createUserDto.provider = 'google';
                    createUserDto.given_name = (profile as any).given_name;
                    createUserDto.family_name = (profile as any).family_name;
                    createUserDto.email = profile.email;
                    createUserDto.role = 'unverified';

                    const { user, access_token } = await authService.validateGoogleLogin(createUserDto);

                    if (!user || !access_token) {
                        throw new Error('Failed to validate Google login.');
                    }

                    (profile as any).id = user.id;
                    (profile as any).role = user.role;
                    (profile as any).access_token = access_token;

                    return true;
                } catch (error) {
                    console.error('Error signing in with Google:', error);
                    return false;
                }
            }

            return true;
        },
        async jwt({ token, user, account, profile }) {
            if (account?.provider === 'google' && user) {
                // Handle Google OAuth login
                console.info('🔐 Google OAuth login:', user);
                console.info('🔐 Google OAuth profile:', profile);

                token.id = (profile as any).id;
                token.given_name = (profile as any)?.given_name;
                token.family_name = (profile as any)?.family_name;
                token.email = user.email;
                token.role = (profile as any).role;
                token.id_image_url = user.id_image_url;
                token.access_token = (profile as any).access_token;

                const decodedToken = jwtDecode<{ exp?: number }>(token.access_token!);
                token.accessTokenExpires = decodedToken?.exp ? decodedToken.exp * 1000 : Date.now() + 1000 * 60 * 15;
            } else if (user) {
                token.id = user.id;
                token.given_name = user.given_name;
                token.family_name = user.family_name;
                token.email = user.email;
                token.role = user.role;
                token.access_token = user.access_token;
                token.refresh_token = user.refresh_token;
                token.id_image_url = user.id_image_url;

                const decodedToken = jwtDecode<{ exp?: number }>(token.access_token!);
                token.accessTokenExpires = decodedToken?.exp ? decodedToken.exp * 1000 : Date.now() + 1000 * 60 * 15;
            }

            // Check if the access token is still valid
            if (typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
                console.log('✅ Token is still valid until:', new Date(token.accessTokenExpires));
                return token;
            }

            console.log('🔄 Access token expired, refreshing token...');

            try {
                // Refresh the access token
                const newAccessToken = await authService.refreshAccessToken(token.refresh_token);

                if (!newAccessToken) {
                    console.error('❌ Failed to refresh access token');
                    return token;
                }

                console.log('✅ Successfully refreshed access token:', newAccessToken);
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
                id_image_url: token.id_image_url,
                access_token: token.access_token ?? '',
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
