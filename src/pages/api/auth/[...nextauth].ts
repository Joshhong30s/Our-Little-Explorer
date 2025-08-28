import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';

import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcrypt';

import clientPromise from '@/utils/mongodb';
import dbConnect from '@/utils/dbConnect';
import { UserModel } from '@/types/users';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'consent',
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          throw new Error('Missing username or password');
        }
        const user = await UserModel.findOne({
          username: credentials.username,
        });
        if (!user) {
          throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          name: user.username,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      try {
        await dbConnect();
        
        const existingUser = await UserModel.findOne({ email: user.email }).lean();

        if (existingUser) {
          console.log('Existing user (OAuth):', existingUser);

          const userDoc = existingUser as any;
          if (!userDoc.providers?.includes(account?.provider)) {
            await UserModel.updateOne(
              { _id: userDoc._id },
              { $addToSet: { providers: account?.provider } }
            );
          }

          return true;
        } else {
          const newUser = await UserModel.create({
            email: user.email || '',
            username: user.name || '',
            image: user.image || '',
            providers: [account?.provider],
          });

          console.log('New user created:', newUser._id);
          return true;
        }
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }

      // Only fetch user data on first sign in, not on every JWT refresh
      if (user && token.id) {
        try {
          await dbConnect();
          const dbUser = await UserModel.findById(token.id).select('createdAt').lean();
          if (dbUser) {
            const userDoc = dbUser as any;
            token.createdAt = userDoc.createdAt;
          }
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }

      if (account?.accessToken) {
        token.accessToken = String(account.accessToken);
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.image = (token.image as string) || '';
        session.user.createdAt = (token.createdAt as string) || '';
        if (token?.accessToken) {
          session.user.accessToken = token.accessToken as string;
        }
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  cookies: {
    sessionToken: {
      name: `${
        process.env.NODE_ENV === 'production' ? '__Secure-' : ''
      }next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `${
        process.env.NODE_ENV === 'production' ? '__Secure-' : ''
      }next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `${
        process.env.NODE_ENV === 'production' ? '__Host-' : ''
      }next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
