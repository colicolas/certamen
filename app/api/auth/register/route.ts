import { NextRequest, NextResponse } from 'next/server';
import { verifyGoogleToken, hashPassword } from '@/lib/auth';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name, division, specialties, skill, coins, level, xp, lessons, characters, team, bio, idToken } = body;

  if (idToken) {
    const decodedToken = await verifyGoogleToken(idToken);
    if (!decodedToken) {
      return NextResponse.json({ message: 'Invalid Google token' }, { status: 400 });
    }
  }

  const userRef = await db.collection('users').where('email', '==', email).get();
  if (!userRef.empty) {
    return NextResponse.json({ message: "Email already in use" }, { status: 422 });
  }

  const usernameRef = await db.collection('users').where('name', '==', name).get();
  if (!usernameRef.empty) {
    return NextResponse.json({ message: "Username already exists" }, { status: 422 });
  }

  let hashedPassword = password;
  if (!idToken && password) {
    hashedPassword = await hashPassword(password);
  }

  const userData = {
    email,
    name,
    division,
    specialties,
    skill,
    coins,
    level,
    xp,
    lessons,
    characters,
    team,
    bio,
  };

  if (!idToken) {
    userData.password = hashedPassword;
  }

  await db.collection('users').add(userData);

  return NextResponse.json({ message: "User created" }, { status: 201 });
}
