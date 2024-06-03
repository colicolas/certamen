import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase";
import { verifyPassword } from "@/lib/auth";

// Define authentication options for NextAuth
const authOptions = {
  //adapter: FirestoreAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const userRef = await db.collection('users').where('email', '==', credentials.email).get();
        if (userRef.empty) {
          throw new Error("No user found with the email");
        }

        const user = userRef.docs[0].data();
        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return { email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.level = user.level;
      session.user.studyPreferences = user.studyPreferences;
      return session;
    },
  },
};

export const GET = async (req, res) => NextAuth(req, res, authOptions); // Correctly handle GET requests
export const POST = async (req, res) => NextAuth(req, res, authOptions); // Correctly handle POST requests
