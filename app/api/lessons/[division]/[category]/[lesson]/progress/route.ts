import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Firebase Firestore instance
import { getToken } from 'next-auth/jwt';
import { encode } from 'next-auth/jwt';

export async function PUT(req: NextRequest, { params }: { params: { division: string; category: string; lesson: string } }) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { division, category, lesson } = params;
  const body = await req.json();
  const { status } = body; // The new status (e.g., 'completed', 'progress', 'unstarted')

  const userId = token.sub; // Get the user ID from the token

  if (!userId) {
    return NextResponse.json({ message: 'User ID not found' }, { status: 400 });
  }

  try {
    console.log(`Updating progress for user ${userId}, lesson ${lesson} in ${division}/${category}`);

    // Fetch the user's document
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const currentLessons = userData?.lessons || [];

    // Create the path for the specific lesson
    const lessonPath = `${division}/${category}/${lesson}`;

    // Remove the existing lesson status for this lesson
    const updatedLessons = currentLessons.filter((lessonItem: string) => !lessonItem.startsWith(lessonPath));

    // Add the new status if it's not "unstarted"
    if (status !== 'unstarted') {
      updatedLessons.push(`${lessonPath}-${status}`);
    }

    // Update the user's lessons in Firestore
    await db.collection('users').doc(userId).update({
      lessons: updatedLessons,
    });

    // Fetch the updated user data
    const updatedDoc = await db.collection('users').doc(userId).get();
    const updatedUserData = updatedDoc.data();

    console.log(`Updated lesson data: ${JSON.stringify(updatedUserData?.lessons)}`);

    // Update the JWT token with the new lessons data
    const newToken = await encode({
      token: {
        ...token,
        lessons: updatedUserData?.lessons,
      },
      secret: process.env.NEXTAUTH_SECRET as string,
    });

    return NextResponse.json({ lessons: updatedUserData?.lessons }, { status: 200 });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
