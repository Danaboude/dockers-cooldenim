import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM banners ORDER BY "order" ASC`;
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, subtitle, image_url, order, active } = await req.json();
    if (!image_url) return NextResponse.json({ success: false, error: 'image_url required' }, { status: 400 });
    const sql = getDb();
    const rows = await sql`
      INSERT INTO banners (title, subtitle, image_url, "order", active)
      VALUES (${title || null}, ${subtitle || null}, ${image_url}, ${order ?? 0}, ${active ?? true})
      RETURNING *
    `;
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
