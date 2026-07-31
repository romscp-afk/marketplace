-- Marketplace: extensions, enums, and shared functions
-- Milestone 3 — initial schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE public.user_role AS ENUM (
  'customer',
  'seller_applicant',
  'seller_owner',
  'seller_staff',
  'marketplace_admin',
  'super_admin',
  'support_agent'
);

CREATE TYPE public.product_status AS ENUM (
  'draft',
  'review',
  'active',
  'rejected',
  'archived',
  'out_of_stock'
);

CREATE TYPE public.seller_application_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'more_info_required',
  'approved',
  'rejected',
  'suspended'
);

CREATE TYPE public.seller_status AS ENUM (
  'pending',
  'active',
  'suspended',
  'closed'
);

CREATE TYPE public.order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'partially_shipped',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
  'partially_refunded'
);

CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled',
  'refunded',
  'partially_refunded'
);

CREATE TYPE public.seller_sub_order_status AS ENUM (
  'pending',
  'accepted',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
);

-- ─── Shared trigger function ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
