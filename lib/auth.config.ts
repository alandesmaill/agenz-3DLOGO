import type { NextAuthConfig } from 'next-auth';

// Edge-safe auth config — no Node.js / DB imports here.
export const authConfig = {
  pages: {
    signIn: '/zx9-hub/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [], // providers are added in auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
