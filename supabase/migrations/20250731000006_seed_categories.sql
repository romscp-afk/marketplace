-- Marketplace: development seed data
-- Milestone 3 — run after migrations on a fresh Supabase project

-- Note: profiles for seed users must be created via Supabase Auth first,
-- or use service role to insert. This seed covers catalog data only.

-- ─── Categories ──────────────────────────────────────────────────────────────

INSERT INTO public.categories (id, name, slug, description, image_url, sort_order) VALUES
  ('a1000000-0000-4000-8000-000000000001', 'Fashion', 'fashion', 'Curated apparel and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop', 1),
  ('a1000000-0000-4000-8000-000000000002', 'Home & Living', 'home-living', 'Elevate your living space', 'https://images.unsplash.com/photo-1616046220565-338952a68964?w=400&h=400&fit=crop', 2),
  ('a1000000-0000-4000-8000-000000000003', 'Beauty', 'beauty', 'Premium skincare and cosmetics', 'https://images.unsplash.com/photo-1596462502278-27bfd4033486?w=400&h=400&fit=crop', 3),
  ('a1000000-0000-4000-8000-000000000004', 'Electronics', 'electronics', 'Modern tech essentials', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop', 4),
  ('a1000000-0000-4000-8000-000000000005', 'Food & Gourmet', 'food-gourmet', 'Artisan foods and beverages', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop', 5),
  ('a1000000-0000-4000-8000-000000000006', 'Jewelry', 'jewelry', 'Handcrafted fine jewelry', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop', 6)
ON CONFLICT (slug) DO NOTHING;

-- Catalog seed (sellers/products) requires auth users — use supabase/seed.sql
-- via service role after creating test accounts. See docs/SETUP.md.
