// app/api/lessons/[division]/[category]/msg/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(req: NextRequest, { params }: { params: { division: string, category: string } }) {
  const { division, category } = params;

  if (!division || !category) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), `lessons/${division}/${category}/msg.txt`);
  console.log(filePath);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return NextResponse.json({ ...data, content });
}
