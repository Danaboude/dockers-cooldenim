import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, image_url, order, active, slug: customSlug } = await req.json();
    const slug = customSlug || toSlug(name);
    const sql = getDb();
    const rows = await sql`
      UPDATE categories
      SET name = ${name}, slug = ${slug}, image_url = ${image_url || null},
          "order" = ${order ?? 0}, active = ${active ?? true}
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
    await sql`DELETE FROM categories WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
