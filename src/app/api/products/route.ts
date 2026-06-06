import { NextRequest, NextResponse } from 'next/server';
import { getDb, getAllProducts } from '@/lib/db';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, category_id, description, tags, featured, active, sizes, images } = await req.json();
    if (!name) return NextResponse.json({ success: false, error: 'name required' }, { status: 400 });
    const sql = getDb();

    const [product] = await sql`
      INSERT INTO products (name, category_id, description, tags, featured, active)
      VALUES (${name}, ${category_id || null}, ${description || null}, ${tags || []}, ${featured ?? false}, ${active ?? true})
      RETURNING *
    `;

    if (sizes && sizes.length > 0) {
      for (const s of sizes) {
        if (!s.size) continue;
        await sql`
          INSERT INTO product_sizes (product_id, size, quantity)
          VALUES (${product.id}, ${s.size}, ${s.quantity ?? 0})
          ON CONFLICT (product_id, size) DO UPDATE SET quantity = EXCLUDED.quantity
        `;
      }
    }

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
