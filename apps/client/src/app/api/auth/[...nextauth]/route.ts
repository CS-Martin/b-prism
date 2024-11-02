import { authenticationService } from 'apps/client/src/services/authentication-service';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
    session: {
        strategy: 'jwt' as 'jwt',
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('No credentials provided');
                }

                try {
                    const user = await authenticationService.findByEmail(credentials.email);

                    if (!user) {
                        throw new Error('User not found');
                    }

                    const isMatch = user.password === credentials.password;

                    if (!isMatch) {
                        throw new Error('Invalid credentials');
                    }

                    return user;
                } catch (error) {
                    console.error('Authorization error:', error);
                    throw new Error('Authorization failed');
                }
            }
        })
    ],
};

export default NextAuth(authOptions);
