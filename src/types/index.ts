export interface Banner {
  id: number;
  title?: string;
  subtitle?: string;
  image_url: string;
  order: number;
  active: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  order: number;
  active: boolean;
  created_at: string;
}

export interface ProductSize {
  size: string;
  quantity: number;
}

export interface ProductImage {
  url: string;
  display?: string;
  thumb?: string;
}

export interface Product {
  id: number;
  name: string;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  description?: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  sizes: ProductSize[];
  images: ProductImage[];
  created_at: string;
}
