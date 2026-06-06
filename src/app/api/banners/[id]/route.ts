import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, subtitle, image_url, order, active } = await req.json();
    const sql = getDb();
    const rows = await sql`
      UPDATE banners
      SET title = ${title || null},
          subtitle = ${subtitle || null},
          image_url = ${image_url},
          "order" = ${order ?? 0},
          active = ${active ?? true}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sql = getDb();
    await sql`DELETE FROM banners WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
