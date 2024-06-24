import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(req: NextRequest, { params }: { params: { division: string, category: string, lesson: string } }) {
  let { division, category, lesson } = params;

  if (!division || !category || !lesson) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  division = division.toUpperCase();
  category = category.toLowerCase();

  const filePath = path.join(process.cwd(), `lessons/${division}/${category}/${lesson}.md`);
  console.log(filePath);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return NextResponse.json({ ...data, content });
}
