import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM categories ORDER BY "order" ASC`;
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, image_url, order, active, slug: customSlug } = await req.json();
    if (!name) return NextResponse.json({ success: false, error: 'name required' }, { status: 400 });
    const slug = customSlug || toSlug(name);
    const sql = getDb();
    const rows = await sql`
      INSERT INTO categories (name, slug, image_url, "order", active)
      VALUES (${name}, ${slug}, ${image_url || null}, ${order ?? 0}, ${active ?? true})
      RETURNING *
    `;
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
