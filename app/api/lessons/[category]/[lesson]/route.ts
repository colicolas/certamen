import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(req: NextRequest, { params }: { params: { category: string, lesson: string } }) {
  let { category, lesson } = params;

  if (!category || !lesson) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  category = category.toLowerCase();

  const filePath = path.join(process.cwd(), `public/lessons/${category}/${lesson}.md`);
  console.log(filePath);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return NextResponse.json({ ...data, content });
}
