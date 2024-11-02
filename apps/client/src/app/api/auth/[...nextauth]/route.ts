import NextAuth from "next-auth";
import { options } from "./options";

const handler = NextAuth(options);

export { handler as GET, handler as POST };



// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import { PrismaClient } from '@prisma/client';
// import { authenticationService } from 'apps/client/src/services/authentication-service';
// import NextAuth, { SessionStrategy } from 'next-auth';
// import { JWT } from 'next-auth/jwt';
// import CredentialsProvider from 'next-auth/providers/credentials';

// const prisma = new PrismaClient();

// export const authOptions = {

//     adapter: PrismaAdapter(prisma),

//     session: {
//         strategy: 'jwt' as SessionStrategy,
//     },

//     secret: process.env.NEXTAUTH_SECRET,

//     providers: [
//         CredentialsProvider({
//             credentials: {
//                 email: { label: 'Email', type: 'email' },
//                 password: { label: 'Password', type: 'password' },
//             },
//             async authorize(credentials) {
//                 console.log('ROUTE', credentials);
//                 if (!credentials?.email || !credentials?.password) return null;

//                 console.log('ROUTE 2');

//                 const user = await authenticationService.verify(
//                     credentials.email,
//                     credentials.password
//                 );

//                 return user;
//             },
//         }),
//     ],
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
