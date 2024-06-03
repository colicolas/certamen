import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(req) {
  const body = await req.json();
  const { email } = body;

  const emailRef = await db.collection('users').where('email', '==', email).get();
  const exists = !emailRef.empty;

  return NextResponse.json({ exists });
}
