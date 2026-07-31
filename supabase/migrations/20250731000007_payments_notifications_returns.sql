-- Marketplace: payments, notifications, returns, refunds
-- Milestone 6

CREATE TYPE public.return_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'refunded'
);

-- ─── Payments ────────────────────────────────────────────────────────────────

CREATE TABLE public.payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  provider            TEXT NOT NULL DEFAULT 'mock',
  provider_payment_id TEXT NOT NULL,
  amount              NUMERIC(12,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'USD',
  status              public.payment_status NOT NULL DEFAULT 'pending',
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE UNIQUE INDEX idx_payments_provider_payment_id ON public.payments(provider_payment_id);

-- ─── Notifications ─────────────────────────────────────────────────────────

CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email       TEXT,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  href        TEXT,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ─── Returns ─────────────────────────────────────────────────────────────────

CREATE TABLE public.returns (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  seller_sub_order_id UUID NOT NULL REFERENCES public.seller_sub_orders(id) ON DELETE RESTRICT,
  customer_email      TEXT NOT NULL,
  reason              TEXT NOT NULL,
  status              public.return_status NOT NULL DEFAULT 'pending',
  refund_amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER returns_updated_at
  BEFORE UPDATE ON public.returns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_returns_order_id ON public.returns(order_id);
CREATE INDEX idx_returns_status ON public.returns(status);

-- ─── Refunds ─────────────────────────────────────────────────────────────────

CREATE TABLE public.refunds (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id           UUID NOT NULL REFERENCES public.returns(id) ON DELETE RESTRICT,
  provider_refund_id  TEXT NOT NULL,
  amount              NUMERIC(12,2) NOT NULL,
  status              public.payment_status NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refunds_return_id ON public.refunds(return_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_admin_read" ON public.payments
  FOR SELECT USING (public.is_admin());

CREATE POLICY "payments_own_read" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = payments.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "notifications_own" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "returns_own_read" ON public.returns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = returns.order_id
        AND (o.user_id = auth.uid() OR o.guest_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    )
  );

CREATE POLICY "returns_admin" ON public.returns
  FOR ALL USING (public.is_admin());

CREATE POLICY "refunds_admin_read" ON public.refunds
  FOR SELECT USING (public.is_admin());
