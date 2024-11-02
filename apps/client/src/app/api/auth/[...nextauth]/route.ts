import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import NextAuth, { SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

export const authOptions = {

    adapter: PrismaAdapter(prisma),

    session: {
        strategy: 'jwt' as SessionStrategy,
    },

    secret: process.env.NEXTAUTH_SECRET,



    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                
            }
        })
    ],

    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
