import NextAuth, { NextAuthConfig, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SignInCredentials } from './app/types';
import { JWT } from 'next-auth/jwt';

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as SignInCredentials;

        //send request to api to sign in user and send respose or error back to client
        const { user, error } = await fetch(
          'http://localhost:3000/api/users/signin',
          {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          }
        ).then(async (res) => await res.json());

        if (error) return null;

        return {
          id: user.id,
          ...user,
        };
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      if (params.user) {
        params.token.user = params.user;
      }
      return params.token;
    },
    async session(params) {
      // Type assertion for params
      const sessionParams = params as { session: Session; token?: JWT };

      if (sessionParams.token && sessionParams.token.user) {
        sessionParams.session.user = {
          ...sessionParams.session.user,
          ...sessionParams.token.user,
        };
      }
      return sessionParams.session;
    },
  },
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
