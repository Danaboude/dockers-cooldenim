import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, category_id, description, tags, featured, active, sizes, images } = await req.json();
    const sql = getDb();

    const [product] = await sql`
      UPDATE products
      SET name = ${name}, category_id = ${category_id || null},
          description = ${description || null}, tags = ${tags || []},
          featured = ${featured ?? false}, active = ${active ?? true}
      WHERE id = ${id}
      RETURNING *
    `;

    // Replace sizes
    await sql`DELETE FROM product_sizes WHERE product_id = ${id}`;
    if (sizes && sizes.length > 0) {
      for (const s of sizes) {
        if (!s.size) continue;
        await sql`
          INSERT INTO product_sizes (product_id, size, quantity)
          VALUES (${product.id}, ${s.size}, ${s.quantity ?? 0})
        `;
      }
    }

    // Replace images
    await sql`DELETE FROM product_images WHERE product_id = ${id}`;
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await sql`
          INSERT INTO product_images (product_id, image_url, display_url, thumb_url, "order")
          VALUES (${product.id}, ${img.url}, ${img.display || img.url}, ${img.thumb || img.url}, ${i})
        `;
      }
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sql = getDb();
    await sql`DELETE FROM products WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
