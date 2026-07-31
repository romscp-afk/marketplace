-- Marketplace: commerce — carts, wishlists, orders (structure)
-- Milestone 3

-- ─── Carts ───────────────────────────────────────────────────────────────────

CREATE TABLE public.carts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id  TEXT,
  coupon_code TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT carts_owner_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TRIGGER carts_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_carts_user_id ON public.carts(user_id);
CREATE INDEX idx_carts_session_id ON public.carts(session_id);

CREATE TABLE public.cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id     UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id  UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity    INT NOT NULL CHECK (quantity > 0),
  saved_for_later BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, product_id, variant_id)
);

CREATE TRIGGER cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_cart_items_cart_id ON public.cart_items(cart_id);

-- ─── Wishlists ───────────────────────────────────────────────────────────────

CREATE TABLE public.wishlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);

-- ─── Orders (parent marketplace order) ───────────────────────────────────────

CREATE TABLE public.orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT NOT NULL UNIQUE,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_email     TEXT,
  status          public.order_status NOT NULL DEFAULT 'pending',
  payment_status  public.payment_status NOT NULL DEFAULT 'pending',
  subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount        NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_fee    NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax             NUMERIC(12,2) NOT NULL DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency        TEXT NOT NULL DEFAULT 'USD',
  shipping_address JSONB,
  billing_address  JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);

-- ─── Seller sub-orders ───────────────────────────────────────────────────────

CREATE TABLE public.seller_sub_orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  seller_id    UUID NOT NULL REFERENCES public.sellers(id) ON DELETE RESTRICT,
  status       public.seller_sub_order_status NOT NULL DEFAULT 'pending',
  subtotal     NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  commission   NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER seller_sub_orders_updated_at
  BEFORE UPDATE ON public.seller_sub_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_seller_sub_orders_order_id ON public.seller_sub_orders(order_id);
CREATE INDEX idx_seller_sub_orders_seller_id ON public.seller_sub_orders(seller_id);

-- ─── Order items ─────────────────────────────────────────────────────────────

CREATE TABLE public.order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_sub_order_id UUID NOT NULL REFERENCES public.seller_sub_orders(id) ON DELETE RESTRICT,
  product_id        UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id        UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  variant_name      TEXT,
  quantity          INT NOT NULL CHECK (quantity > 0),
  unit_price        NUMERIC(12,2) NOT NULL,
  total_price       NUMERIC(12,2) NOT NULL,
  image_url         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_sub_order_id ON public.order_items(seller_sub_order_id);

-- ─── Audit logs ────────────────────────────────────────────────────────────────

CREATE TABLE public.audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action       TEXT NOT NULL,
  resource     TEXT NOT NULL,
  resource_id  UUID,
  old_value    JSONB,
  new_value    JSONB,
  ip_address   INET,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource, resource_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ─── Platform settings ─────────────────────────────────────────────────────────

CREATE TABLE public.platform_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL DEFAULT '{}',
  updated_by  UUID REFERENCES public.profiles(id),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.platform_settings (key, value) VALUES
  ('commission', '{"default_rate": 0.10, "minimum_payout": 25}'),
  ('delivery', '{"free_shipping_threshold": 50, "default_fee": 5.99}');
