// api/user/[id]/progress/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Assuming you are using Firebase for data storage
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;
  const division = req.nextUrl.searchParams.get('division');
  const category = req.nextUrl.searchParams.get('category');
  const lesson = req.nextUrl.searchParams.get('lesson');

  try {
    // Fetch the user document
    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    // Find the lesson's progress based on division, category, and lesson number
    const lessonStatus = userData?.lessons?.find(
      (l: any) => l.division === division && l.category === category && l.lesson === lesson
    );

    return NextResponse.json({ status: lessonStatus || 'unstarted' }, { status: 200 });
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;  // User ID
  const body = await req.json();
  const { division, category, lesson, status } = body;  // Extract the division, category, lesson, and status

  if (!division || !category || !lesson || !status) {
    return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
  }

  try {
    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const lessons = userData?.lessons || [];

    // Update the lesson progress in the user's lessons array
    const updatedLessons = lessons.map((l: string) => {
      const lessonPath = `${division}/${category}/${lesson}`;
      if (l.startsWith(lessonPath)) {
        return `${lessonPath}-${status}`;
      }
      return l;
    });

    // If the lesson doesn't exist, we need to add it
    if (!lessons.some((l: string) => l.startsWith(`${division}/${category}/${lesson}`))) {
      updatedLessons.push(`${division}/${category}/${lesson}-${status}`);
    }

    // Update the user's lessons in the database
    await db.collection('users').doc(id).update({
      lessons: updatedLessons,
    });

    return NextResponse.json({ message: 'Lesson progress updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
