import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/firebase';
import { verifyPassword } from '@/lib/auth';

export const authOptions: NextAuthOptions = {
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
      profile: async (profile) => {
        try {
          //console.log('Google profile:', profile);
          const userRef = await db.collection('users').where('email', '==', profile.email).get();
          if (!userRef.empty) {
            const user = userRef.docs[0].data();
            //console.log("HELLO WORLD" + user.userid);
            return {
              id: user.userid,
              email: user.email,
              username: user.username,
              bio: user.bio,
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
            };
          } else {
            console.log("User not found in database");
            throw new Error('User not found in database');
          }
        } catch (error) {
          console.error('Error in Google profile callback:', error);
          throw error;
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error('No credentials provided');
          }
          let userRef = await db.collection('users').where('email', '==', credentials.email).get();
          if (userRef.empty) {
            userRef = await db.collection('users').where('username', '==', credentials.email).get();
            if (userRef.empty) {
              throw new Error('No user found with the provided email/username');
            }
          }
          const user = userRef.docs[0].data();
          if (!user.password) {
            throw new Error('This account was registered with Google. Please use Google to sign in.');
          }
          const isValid = await verifyPassword(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Incorrect password');
          }
          //console.log('Authorized user:', user);
          return {
            id: user.userid,
            email: user.email,
            username: user.username,
            bio: user.bio,
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
          };
        } catch (error) {
          console.error('Error in CredentialsProvider authorize callback:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async session({ session, token }) {
      //console.log('Session callback:', { session, token });
      session.user.id = token.id as string;
      //console.log("WSP" + token.id);
      //session.user.userid = token.id as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.profile = token.profile as string;
      session.user.division = token.division as string;
      session.user.specialties = token.specialties as string[];
      session.user.skill = token.skill as number[];
      session.user.coins = token.coins as number;
      session.user.level = token.level as number;
      session.user.xp = token.xp as number;
      session.user.lessons = token.lessons as string[];
      session.user.characters = token.characters as string[];
      session.user.team = token.team as string[];
      session.user.bio = token.bio as string;
      return session;
    },
    async jwt({ token, user }) {
      //console.log("JWT callback:", { token, user });
      if (user) {
       // console.log("pls?");
        //console.log('JWT callback:', { token, user });
        token.id = user.id; // || user.userid;
        //console.log("HEY" + user.id || user.userid);
        token.email = user.email;
        token.username = user.username;
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

export default authOptions;
