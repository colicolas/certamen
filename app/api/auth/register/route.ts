import { NextRequest, NextResponse } from 'next/server';
import { verifyGoogleToken, hashPassword } from '@/lib/auth';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, username, profile, division, specialties, skill, coins, level, xp, lessons, characters, team, bio, idToken } = body;

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

  const usernameRef = await db.collection('users').where('username', '==', username).get();
  if (!usernameRef.empty) {
    return NextResponse.json({ message: "Username already exists" }, { status: 422 });
  }

  let hashedPassword = password;
  if (!idToken) {
    hashedPassword = password ? await hashPassword(password) : undefined;
  //  hashedPassword = await hashPassword(password);
  }

  const userData: {
    email: string;
    password?: string;
    username: string;
    profile: string;
    division: string;
    specialties: string[];
    skill: number[];
    coins: number;
    level: number;
    xp: number;
    lessons: number[];
    characters: string[];
    team: string[];
    bio: string;
    idToken?: string;
  } = {
    email,
    username,
    profile,
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
    //idToken
  };

  if (hashedPassword) userData.password = hashedPassword;
  if (idToken) userData.idToken = idToken;

  const newUserRef = await db.collection('users').add(userData);
  await newUserRef.update({ userid: newUserRef.id });

  return NextResponse.json({ message: "User created" }, { status: 201 });
}
