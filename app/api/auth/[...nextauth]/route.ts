import NextAuth from "next-auth";
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from 'next/server';
//import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "@/lib/firebase";
import { verifyPassword } from "@/lib/auth";
import { authOptions } from "@/lib/authOptions";

const handler = (req: NextRequest, res: NextResponse) => {
  const nextAuthHandler = NextAuth(authOptions);
  return nextAuthHandler(req as any, res as any);
};

export const GET = handler;
export const POST = handler;

