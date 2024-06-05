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

console.log("who askedbro");
    if (!userRef.empty) {
    console.log("?????");
      const user = userRef.docs[0].data();
      if (user.password) {
      console.log("errororor");
        // Throw an error if the email is already registered with a password
        return NextResponse.json({ exists: true, error: "This email is already registered with a password. Please use the credentials option to log in." }, { status: 400 });
      }
      console.log("here?");
      return NextResponse.json({ exists: true, hasPassword: false }, { status: 200 });
    } else {
    console.log("bro what");
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  /*
    const userRef = await db.collection('users').where('email', '==', email).get();

    console.log("hello world");
    if (!userRef.empty) {
      const user = userRef.docs[0].data();
      return NextResponse.json({ exists: true }, { status: 200 });
    } else {
    console.log("good morning uSAD LOL");
      return NextResponse.json({ exists: false }, { status: 200 });
    }*/
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
