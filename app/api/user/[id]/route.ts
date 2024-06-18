import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;

  try {
    console.log(`Fetching user with ID: ${userid}`); // Log the ID being fetched
    const userDoc = await db.collection('users').doc(userid).get();

    if (!userDoc.exists) {
      console.log(`User with ID ${userid} not found`); // Log if the user is not found
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = userDoc.data();
    console.log(`User data: ${JSON.stringify(user)}`); // Log the user data being returned
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();
  const { username, bio } = body;

  try {
    console.log(`Updating user with ID: ${id}`); // Log the ID being updated
    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      console.log(`User with ID ${id} not found`); // Log if the user is not found
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = { username, bio };

    await db.collection('users').doc(id).update(updatedUser);

    const updatedDoc = await db.collection('users').doc(id).get(); // Fetch updated data
    const updatedUserData = updatedDoc.data();
    console.log(`Updated user data: ${JSON.stringify(updatedUserData)}`); // Log updated user data

    // Get the updated session data
    const session = await getSession({ req });

    return NextResponse.json({
      ...updatedUserData,
      session
    }, { status: 200 });
    //return NextResponse.json(updatedUserData, { status: 200 });
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
