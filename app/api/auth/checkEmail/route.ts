import { db } from '@/lib/firebase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;


  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const userRef = await db.collection('users').where('email', '==', email).get();

    if (!userRef.empty) {
      return NextResponse.json({ exists: true }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
  /*const emailRef = await db.collection('users').where('email', '==', email).get();
  const exists = !emailRef.empty;

  return NextResponse.json({ exists });*/
}
