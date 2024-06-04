import NextAuth from "next-auth";
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from 'next/server';
//import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "@/lib/firebase";
import { verifyPassword } from "@/lib/auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        let userRef = await db.collection('users').where('email', '==', credentials.email).get();
        if (userRef.empty) {
          userRef = await db.collection('users').where('name', '==', credentials.email).get();
          if (userRef.empty) {
            throw new Error('No user found with the provided email/username');
          }
        }

        const user = userRef.docs[0].data();
        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        console.log('User logged in:', {
          email: user.email,
          name: user.name,
          id: user.id,
          level: user.level,
          studyPreferences: user.studyPreferences,
        });

        return { email: user.email, name: user.name, id: user.id, level: user.level, studyPreferences: user.studyPreferences };

      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      session.user.id = token.id;
      session.user.level = token.level;
      session.user.studyPreferences = token.studyPreferences;
      return session;
    },
    async jwt({ token, user }: {token: any, user: any}) {
      if (user) {
        token.id = user.id;
        token.level = user.level;
        token.studyPreferences = user.studyPreferences;
      }
      return token;
    },
  },
};


export const GET = async (req: NextRequest, res: NextResponse) => NextAuth(req, res, authOptions);
export const POST = async (req: NextRequest, res: NextResponse) => NextAuth(req, res, authOptions);
