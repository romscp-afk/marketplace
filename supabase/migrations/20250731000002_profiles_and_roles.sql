-- Marketplace: profiles, roles, permissions, addresses
-- Milestone 3

-- ─── Profiles ────────────────────────────────────────────────────────────────

CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  first_name  TEXT,
  last_name   TEXT,
  full_name   TEXT GENERATED ALWAYS AS (
    NULLIF(TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')), '')
  ) STORED,
  avatar_url  TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ─── User roles ──────────────────────────────────────────────────────────────

CREATE TABLE public.user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        public.user_role NOT NULL,
  seller_id   UUID, -- populated for seller_owner / seller_staff
  granted_by  UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role, seller_id)
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_seller_id ON public.user_roles(seller_id);

-- ─── Permissions (reference table) ──────────────────────────────────────────

CREATE TABLE public.permissions (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role      public.user_role NOT NULL,
  resource  TEXT NOT NULL,
  action    TEXT NOT NULL,
  UNIQUE (role, resource, action)
);

-- ─── Customer addresses ──────────────────────────────────────────────────────

CREATE TABLE public.customer_addresses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label        TEXT,
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  line1        TEXT NOT NULL,
  line2        TEXT,
  city         TEXT NOT NULL,
  state        TEXT NOT NULL,
  postal_code  TEXT NOT NULL,
  country      TEXT NOT NULL DEFAULT 'US',
  phone        TEXT,
  is_default   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER customer_addresses_updated_at
  BEFORE UPDATE ON public.customer_addresses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_customer_addresses_user_id ON public.customer_addresses(user_id);

-- ─── Auto-create profile on signup ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Default permissions seed ──────────────────────────────────────────────

INSERT INTO public.permissions (role, resource, action) VALUES
  ('customer', 'profile', 'read'),
  ('customer', 'profile', 'update'),
  ('customer', 'orders', 'read'),
  ('customer', 'cart', 'manage'),
  ('customer', 'wishlist', 'manage'),
  ('seller_owner', 'products', 'create'),
  ('seller_owner', 'products', 'update'),
  ('seller_owner', 'products', 'delete'),
  ('seller_owner', 'orders', 'read'),
  ('seller_owner', 'orders', 'fulfil'),
  ('seller_staff', 'products', 'read'),
  ('seller_staff', 'products', 'update'),
  ('seller_staff', 'orders', 'read'),
  ('seller_staff', 'orders', 'fulfil'),
  ('marketplace_admin', 'sellers', 'approve'),
  ('marketplace_admin', 'products', 'moderate'),
  ('marketplace_admin', 'orders', 'read'),
  ('marketplace_admin', 'settings', 'read'),
  ('super_admin', 'users', 'manage'),
  ('super_admin', 'settings', 'update'),
  ('super_admin', 'audit_logs', 'read'),
  ('support_agent', 'orders', 'read'),
  ('support_agent', 'tickets', 'manage');
