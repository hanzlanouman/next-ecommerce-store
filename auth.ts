import NextAuth, { NextAuthConfig, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SignInCredentials } from './app/types';
import { SessionUserProfile } from './app/types';
declare module 'next-auth' {
  interface Session {
    user: SessionUserProfile;
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as SignInCredentials;

        //send request to api to sign in user and send respose or error back to client
        const { user, error } = await fetch(process.env.API_SIGN_IN_ENDPOINT!, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }).then(async (res) => await res.json());

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
        params.token = {
          ...params.token,
          ...params.user,
        };
      }
      return params.token;
    },
    async session(params) {
      const user = params.token as typeof params.token & SessionUserProfile;

      if (user) {
        params.session.user = {
          ...params.session.user,
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          verified: user.verified,
          role: user.role,
        };
      }
      return params.session;
    },
  },
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
