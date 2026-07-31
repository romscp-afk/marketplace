-- Marketplace: catalog — categories, sellers, stores, products
-- Milestone 3

-- ─── Categories ─────────────────────────────────────────────────────────────

CREATE TABLE public.categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  image_url    TEXT,
  parent_id    UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order   INT NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- ─── Sellers ─────────────────────────────────────────────────────────────────

CREATE TABLE public.seller_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status          public.seller_application_status NOT NULL DEFAULT 'draft',
  store_name      TEXT NOT NULL,
  store_description TEXT,
  business_name   TEXT,
  business_registration TEXT,
  document_urls   JSONB DEFAULT '[]',
  payout_info     JSONB DEFAULT '{}',
  categories      TEXT[] DEFAULT '{}',
  admin_notes     TEXT,
  submitted_at    TIMESTAMPTZ,
  reviewed_at     TIMESTAMPTZ,
  reviewed_by     UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER seller_applications_updated_at
  BEFORE UPDATE ON public.seller_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_seller_applications_user_id ON public.seller_applications(user_id);
CREATE INDEX idx_seller_applications_status ON public.seller_applications(status);

CREATE TABLE public.sellers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  application_id   UUID REFERENCES public.seller_applications(id),
  status           public.seller_status NOT NULL DEFAULT 'pending',
  commission_rate  NUMERIC(5,4) NOT NULL DEFAULT 0.1000,
  is_verified      BOOLEAN NOT NULL DEFAULT FALSE,
  rating           NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count     INT NOT NULL DEFAULT 0,
  product_count    INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at       TIMESTAMPTZ
);

CREATE TRIGGER sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_sellers_owner_id ON public.sellers(owner_id);
CREATE INDEX idx_sellers_status ON public.sellers(status);

-- ─── Stores ──────────────────────────────────────────────────────────────────

CREATE TABLE public.stores (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id    UUID NOT NULL UNIQUE REFERENCES public.sellers(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  logo_url     TEXT,
  banner_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_stores_slug ON public.stores(slug);

-- ─── Seller staff ────────────────────────────────────────────────────────────

CREATE TABLE public.seller_staff (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id   UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        public.user_role NOT NULL DEFAULT 'seller_staff',
  invited_by  UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (seller_id, user_id)
);

CREATE INDEX idx_seller_staff_seller_id ON public.seller_staff(seller_id);
CREATE INDEX idx_seller_staff_user_id ON public.seller_staff(user_id);

-- ─── Products ────────────────────────────────────────────────────────────────

CREATE TABLE public.products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id           UUID NOT NULL REFERENCES public.sellers(id) ON DELETE RESTRICT,
  category_id         UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title               TEXT NOT NULL,
  slug                TEXT NOT NULL,
  description         TEXT,
  short_description   TEXT,
  price               NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price    NUMERIC(12,2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  cost_price          NUMERIC(12,2) CHECK (cost_price IS NULL OR cost_price >= 0),
  currency            TEXT NOT NULL DEFAULT 'USD',
  sku                 TEXT,
  barcode             TEXT,
  status              public.product_status NOT NULL DEFAULT 'draft',
  stock               INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  weight              NUMERIC(10,3),
  is_return_eligible  BOOLEAN NOT NULL DEFAULT TRUE,
  delivery_estimate_min INT NOT NULL DEFAULT 3,
  delivery_estimate_max INT NOT NULL DEFAULT 7,
  delivery_fee        NUMERIC(10,2),
  attributes          JSONB DEFAULT '{}',
  specifications      JSONB DEFAULT '{}',
  search_keywords     TEXT[] DEFAULT '{}',
  rating              NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count        INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ,
  UNIQUE (seller_id, slug)
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_products_seller_id ON public.products(seller_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_price ON public.products(price);

-- ─── Product images ──────────────────────────────────────────────────────────

CREATE TABLE public.product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);

-- ─── Product variants ────────────────────────────────────────────────────────

CREATE TABLE public.product_variants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  sku              TEXT NOT NULL,
  price            NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(12,2),
  stock            INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  attributes       JSONB NOT NULL DEFAULT '{}',
  image_url        TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, sku)
);

CREATE TRIGGER product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);

-- ─── Reviews ─────────────────────────────────────────────────────────────────

CREATE TABLE public.reviews (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id            UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating                SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title                 TEXT,
  comment               TEXT NOT NULL,
  is_verified_purchase  BOOLEAN NOT NULL DEFAULT FALSE,
  is_published          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, user_id)
);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
