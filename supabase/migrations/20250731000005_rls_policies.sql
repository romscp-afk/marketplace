-- Marketplace: Row Level Security policies
-- Milestone 3

-- ─── Auth helper functions (used by RLS) ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('marketplace_admin', 'super_admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.has_role(check_role public.user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = check_role
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_seller_member(check_seller_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.seller_id = check_seller_id
      AND ur.role IN ('seller_owner', 'seller_staff')
  )
  OR EXISTS (
    SELECT 1 FROM public.sellers s
    WHERE s.id = check_seller_id
      AND s.owner_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- ─── Enable RLS on all tables ────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_sub_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- ─── Profiles ────────────────────────────────────────────────────────────────

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (public.is_admin());

-- ─── User roles ──────────────────────────────────────────────────────────────

CREATE POLICY "user_roles_select_own" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_roles_admin_manage" ON public.user_roles
  FOR ALL USING (public.is_super_admin());

-- ─── Permissions (read-only for authenticated) ─────────────────────────────

CREATE POLICY "permissions_select_authenticated" ON public.permissions
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "permissions_admin_manage" ON public.permissions
  FOR ALL USING (public.is_super_admin());

-- ─── Customer addresses ──────────────────────────────────────────────────────

CREATE POLICY "addresses_own" ON public.customer_addresses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "addresses_admin_read" ON public.customer_addresses
  FOR SELECT USING (public.is_admin());

-- ─── Seller applications ─────────────────────────────────────────────────────

CREATE POLICY "seller_applications_own" ON public.seller_applications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "seller_applications_admin" ON public.seller_applications
  FOR ALL USING (public.is_admin());

-- ─── Sellers ─────────────────────────────────────────────────────────────────

CREATE POLICY "sellers_public_read" ON public.sellers
  FOR SELECT USING (status = 'active' AND deleted_at IS NULL);

CREATE POLICY "sellers_owner_manage" ON public.sellers
  FOR ALL USING (auth.uid() = owner_id OR public.is_seller_member(id));

CREATE POLICY "sellers_admin_manage" ON public.sellers
  FOR ALL USING (public.is_admin());

-- ─── Stores ──────────────────────────────────────────────────────────────────

CREATE POLICY "stores_public_read" ON public.stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sellers s
      WHERE s.id = seller_id AND s.status = 'active' AND s.deleted_at IS NULL
    )
  );

CREATE POLICY "stores_seller_manage" ON public.stores
  FOR ALL USING (public.is_seller_member(seller_id));

CREATE POLICY "stores_admin_manage" ON public.stores
  FOR ALL USING (public.is_admin());

-- ─── Categories ──────────────────────────────────────────────────────────────

CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "categories_admin_manage" ON public.categories
  FOR ALL USING (public.is_admin());

-- ─── Products ────────────────────────────────────────────────────────────────

CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (
    status = 'active' AND deleted_at IS NULL
    OR public.is_seller_member(seller_id)
    OR public.is_admin()
  );

CREATE POLICY "products_seller_manage" ON public.products
  FOR ALL USING (public.is_seller_member(seller_id));

CREATE POLICY "products_admin_manage" ON public.products
  FOR ALL USING (public.is_admin());

-- ─── Product images ──────────────────────────────────────────────────────────

CREATE POLICY "product_images_public_read" ON public.product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
        AND (p.status = 'active' OR public.is_seller_member(p.seller_id) OR public.is_admin())
    )
  );

CREATE POLICY "product_images_seller_manage" ON public.product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND public.is_seller_member(p.seller_id)
    )
  );

-- ─── Product variants ────────────────────────────────────────────────────────

CREATE POLICY "product_variants_public_read" ON public.product_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id
        AND (p.status = 'active' OR public.is_seller_member(p.seller_id) OR public.is_admin())
    )
  );

CREATE POLICY "product_variants_seller_manage" ON public.product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND public.is_seller_member(p.seller_id)
    )
  );

-- ─── Reviews ─────────────────────────────────────────────────────────────────

CREATE POLICY "reviews_public_read" ON public.reviews
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "reviews_own_manage" ON public.reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "reviews_admin_manage" ON public.reviews
  FOR ALL USING (public.is_admin());

-- ─── Carts ───────────────────────────────────────────────────────────────────

CREATE POLICY "carts_own" ON public.carts
  FOR ALL USING (auth.uid() = user_id);

-- ─── Cart items ──────────────────────────────────────────────────────────────

CREATE POLICY "cart_items_own" ON public.cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_id AND c.user_id = auth.uid()
    )
  );

-- ─── Wishlists ───────────────────────────────────────────────────────────────

CREATE POLICY "wishlists_own" ON public.wishlists
  FOR ALL USING (auth.uid() = user_id);

-- ─── Orders ──────────────────────────────────────────────────────────────────

CREATE POLICY "orders_own_read" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_admin_read" ON public.orders
  FOR SELECT USING (public.is_admin());

CREATE POLICY "orders_seller_read" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seller_sub_orders sso
      JOIN public.sellers s ON s.id = sso.seller_id
      WHERE sso.order_id = orders.id
        AND (s.owner_id = auth.uid() OR public.is_seller_member(s.id))
    )
  );

-- ─── Seller sub-orders ───────────────────────────────────────────────────────

CREATE POLICY "seller_sub_orders_seller" ON public.seller_sub_orders
  FOR SELECT USING (public.is_seller_member(seller_id) OR public.is_admin());

-- ─── Order items ─────────────────────────────────────────────────────────────

CREATE POLICY "order_items_via_sub_order" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seller_sub_orders sso
      WHERE sso.id = seller_sub_order_id
        AND (public.is_seller_member(sso.seller_id) OR public.is_admin())
    )
    OR EXISTS (
      SELECT 1 FROM public.seller_sub_orders sso
      JOIN public.orders o ON o.id = sso.order_id
      WHERE sso.id = seller_sub_order_id AND o.user_id = auth.uid()
    )
  );

-- ─── Audit logs ──────────────────────────────────────────────────────────────

CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (public.is_admin());

-- ─── Platform settings ───────────────────────────────────────────────────────

CREATE POLICY "platform_settings_public_read" ON public.platform_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "platform_settings_admin_manage" ON public.platform_settings
  FOR ALL USING (public.is_super_admin());

-- ─── Seller staff ────────────────────────────────────────────────────────────

CREATE POLICY "seller_staff_seller_manage" ON public.seller_staff
  FOR ALL USING (public.is_seller_member(seller_id));

CREATE POLICY "seller_staff_admin" ON public.seller_staff
  FOR ALL USING (public.is_admin());
