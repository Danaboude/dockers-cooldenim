import { neon } from '@neondatabase/serverless';
import type { Product, Banner, Category } from '@/types';

export function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS banners (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      subtitle VARCHAR(500),
      image_url TEXT NOT NULL,
      "order" INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      image_url TEXT,
      "order" INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      description TEXT,
      tags TEXT[] DEFAULT '{}',
      featured BOOLEAN DEFAULT false,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS product_sizes (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      size VARCHAR(50) NOT NULL,
      quantity INTEGER DEFAULT 0,
      UNIQUE(product_id, size)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      display_url TEXT,
      thumb_url TEXT,
      "order" INTEGER DEFAULT 0
    )
  `;
}

export async function getBanners(): Promise<Banner[]> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM banners WHERE active = true ORDER BY "order" ASC`;
  return rows as Banner[];
}

export async function getAllBanners(): Promise<Banner[]> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM banners ORDER BY "order" ASC`;
  return rows as Banner[];
}

export async function getCategories(): Promise<Category[]> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM categories WHERE active = true ORDER BY "order" ASC`;
  return rows as Category[];
}

export async function getAllCategories(): Promise<Category[]> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM categories ORDER BY "order" ASC`;
  return rows as Category[];
}

export async function getProducts(): Promise<Product[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      COALESCE(
        (SELECT json_agg(json_build_object('size', ps.size, 'quantity', ps.quantity) ORDER BY ps.size)
         FROM product_sizes ps WHERE ps.product_id = p.id),
        '[]'::json
      ) as sizes,
      COALESCE(
        (SELECT json_agg(json_build_object('url', pi.image_url, 'display', pi.display_url, 'thumb', pi.thumb_url) ORDER BY pi."order")
         FROM product_images pi WHERE pi.product_id = p.id),
        '[]'::json
      ) as images
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.active = true
      AND EXISTS (
        SELECT 1 FROM product_sizes ps
        WHERE ps.product_id = p.id AND ps.quantity > 0
      )
    ORDER BY p.created_at DESC
  `;
  return rows as Product[];
}

export async function getAllProducts(): Promise<Product[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      COALESCE(
        (SELECT json_agg(json_build_object('size', ps.size, 'quantity', ps.quantity) ORDER BY ps.size)
         FROM product_sizes ps WHERE ps.product_id = p.id),
        '[]'::json
      ) as sizes,
      COALESCE(
        (SELECT json_agg(json_build_object('url', pi.image_url, 'display', pi.display_url, 'thumb', pi.thumb_url) ORDER BY pi."order")
         FROM product_images pi WHERE pi.product_id = p.id),
        '[]'::json
      ) as images
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
  return rows as Product[];
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      COALESCE(
        (SELECT json_agg(json_build_object('size', ps.size, 'quantity', ps.quantity) ORDER BY ps.size)
         FROM product_sizes ps WHERE ps.product_id = p.id),
        '[]'::json
      ) as sizes,
      COALESCE(
        (SELECT json_agg(json_build_object('url', pi.image_url, 'display', pi.display_url, 'thumb', pi.thumb_url) ORDER BY pi."order")
         FROM product_images pi WHERE pi.product_id = p.id),
        '[]'::json
      ) as images
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.active = true AND c.slug = ${slug}
      AND EXISTS (
        SELECT 1 FROM product_sizes ps
        WHERE ps.product_id = p.id AND ps.quantity > 0
      )
    ORDER BY p.created_at DESC
  `;
  return rows as Product[];
}
