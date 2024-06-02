import { NextResponse } from 'next/server';
import { hashPassword } from '../../../../lib/auth';
import { db } from '../../../../lib/firebase';

export async function POST(req) {
  const body = await req.json();
  const { email, password, name, level, studyPreferences } = body;

  const userRef = await db.collection('users').where('email', '==', email).get();
  if (!userRef.empty) {
    return NextResponse.json({ message: "User already exists" }, { status: 422 });
  }

  const hashedPassword = await hashPassword(password);

  await db.collection('users').add({
    email,
    password: hashedPassword,
    name,
    level,
    studyPreferences,
  });

  return NextResponse.json({ message: "User created" }, { status: 201 });
}
