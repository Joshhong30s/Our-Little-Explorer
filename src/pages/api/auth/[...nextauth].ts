import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import LineProvider from 'next-auth/providers/line';
import CredentialsProvider from 'next-auth/providers/credentials';

import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcrypt';

import clientPromise from '@/utils/mongodb';
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
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'profile openid email',
          response_type: 'code',
        },
      },
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
      } else {
        // OAuth
        const existingUser = await UserModel.findOne({ email: user.email });
        if (existingUser) {
          console.log('Existing user (OAuth):', existingUser);

          if (!existingUser.providers.includes(account?.provider)) {
            existingUser.providers.push(account?.provider);
            await existingUser.save();
          }
          return true;
        } else {
          const newUser = new UserModel({
            email: user.email || '',
            username: user.name || '',
            image: user.image || '',
            providers: [account?.provider],
          });
          await newUser.save();
          console.log('New user created:', newUser);
          return true;
        }
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }

      if (token.id) {
        const dbUser = await UserModel.findById(token.id).lean();
        if (dbUser) {
          const userDoc = dbUser as { createdAt?: Date };
          token.createdAt = userDoc.createdAt;
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
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
