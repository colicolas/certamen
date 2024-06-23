// next-auth.d.ts
import NextAuth, { DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      bio: string;
      profile: string;
      division: string;
      specialties: string[];
      skill: number[];
      coins: number;
      level: number;
      xp: number;
      lessons: string[];
      characters: string[];
      team: string[];
    };
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    username: string;
    bio: string;
    profile: string;
    division: string;
    specialties: string[];
    skill: number[];
    coins: number;
    level: number;
    xp: number;
    lessons: string[];
    characters: string[];
    team: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    username: string;
    bio: string;
    profile: string;
    division: string;
    specialties: string[];
    skill: number[];
    coins: number;
    level: number;
    xp: number;
    lessons: string[];
    characters: string[];
    team: string[];
  }
}

