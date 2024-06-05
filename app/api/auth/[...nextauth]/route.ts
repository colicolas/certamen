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
      authorization: {
        params: {
          prompt: "select_account",
          scope: "openid profile email",
        },
      },
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
          profile: user.profile,
          division: user.division,
          specialties: user.specialties,
          skill: user.skill,
          coins: user.coins,
          level: user.level,
          xp: user.xp,
          lessons: user.lessons,
          characters: user.characters,
          team: user.team,
          bio: user.bio,
          id: user.id,
        });

        return {
          email: user.email,
          name: user.name,
          profile: user.profile,
          division: user.division,
          specialties: user.specialties,
          skill: user.skill,
          coins: user.coins,
          level: user.level,
          xp: user.xp,
          lessons: user.lessons,
          characters: user.characters,
          team: user.team,
          bio: user.bio,
          id: user.id
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.profile = token.profile;
      session.user.division = token.division;
      session.user.specialties = token.specialties;
      session.user.skill = token.skill;
      session.user.coins = token.coins;
      session.user.level = token.level;
      session.user.xp = token.xp;
      session.user.lessons = token.lessons;
      session.user.characters = token.characters;
      session.user.team = token.team;
      session.user.bio = token.bio;
      return session;
    },
    async jwt({ token, user }: {token: any, user: any}) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.profile = user.profile;
        token.division = user.division;
        token.specialties = user.specialties;
        token.skill = user.skill;
        token.coins = user.coins;
        token.level = user.level;
        token.xp = user.xp;
        token.lessons = user.lessons;
        token.characters = user.characters;
        token.team = user.team;
        token.bio = user.bio;
      } 
      return token;
    },
  },
};

const handler = (req: NextRequest, res: NextResponse) => {
  const nextAuthHandler = NextAuth(authOptions);
  return nextAuthHandler(req as any, res as any);
};

export const GET = handler;
export const POST = handler;
