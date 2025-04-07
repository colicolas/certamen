import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  const category = params.category;
  const dir = path.join(process.cwd(), 'public', 'questions', category);

  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  const years = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''));

  return NextResponse.json({ years });
}
