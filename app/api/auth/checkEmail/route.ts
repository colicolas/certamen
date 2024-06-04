import { db } from '@/lib/firebase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  const emailRef = await db.collection('users').where('email', '==', email).get();
  const exists = !emailRef.empty;

  return NextResponse.json({ exists });
}
