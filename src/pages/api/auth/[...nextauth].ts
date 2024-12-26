import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import LineProvider from 'next-auth/providers/line';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import clientPromise from '@/utils/mongodb';
import { UserModel } from '@/types/users';

export default NextAuth({
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
        const username = credentials?.username ?? '';
        const password = credentials?.password ?? '';

        const user = await UserModel.findOne({ username });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (user && isPasswordValid) {
          return { id: user._id.toString(), name: user.username };
        }

        throw new Error('Invalid credentials');
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        const existingUser = await UserModel.findOne({ username: user.name });

        if (existingUser) {
          console.log('Existing user (credentials):', existingUser);
          return true;
        } else {
          console.log('User not found (credentials)');
          return false;
        }
      } else {
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
            email: user.email,
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
      }

      if (account?.accessToken) {
        token.accessToken = String(account.accessToken);
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id && session?.user) {
        session.user.id = token.id;
      }
      if (token?.accessToken && session?.user) {
        session.user.accessToken = token.accessToken as string;
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
