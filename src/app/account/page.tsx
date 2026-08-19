import Link from "next/link";
import { navigation } from "@/config/navigation";
import { getUser, isAdmin, isSeller } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { MobileAccountView } from "@/components/marketplace/mobile-account-view";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Star,
  Bell,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Star,
  Bell,
  Shield,
  User,
};

interface AccountPageProps {
  searchParams: Promise<{ registered?: string }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { registered } = await searchParams;
  const user = await getUser();

  return (
    <>
      <MobileAccountView
        userName={user ? (user.firstName ?? user.email) : null}
        userEmail={user?.email ?? null}
      />

      <div className="mx-auto hidden max-w-7xl px-4 py-8 md:block">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">My account</h1>
        {user ? <SignOutButton /> : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <nav aria-label="Account navigation" className="space-y-1">
          {navigation.account.map((item) => {
            const Icon = iconMap[item.icon] ?? User;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-background flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              >
                <Icon className="text-muted h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="lg:col-span-3">
          {registered === "true" ? (
            <div className="bg-success/10 mb-6 rounded-xl p-4 text-sm" role="status">
              Account created! Check your email to confirm your address.
            </div>
          ) : null}

          <div className="bg-surface rounded-xl border border-border p-6">
            {user ? (
              <>
                <h2 className="text-lg font-semibold">
                  Welcome, {user.firstName ?? user.email}
                </h2>
                <p className="text-muted mt-2 text-sm">{user.email}</p>
                <p className="text-muted mt-1 text-xs capitalize">
                  Role: {user.roles.join(", ").replace(/_/g, " ")}
                </p>
                {(isAdmin(user) || isSeller(user)) ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isAdmin(user) ? (
                      <Link
                        href="/admin/dashboard"
                        className="bg-primary text-primary-foreground hover:bg-primary-dark inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium"
                      >
                        Admin portal
                      </Link>
                    ) : null}
                    {isSeller(user) ? (
                      <Link
                        href="/seller/dashboard"
                        className="border-border hover:bg-background inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium"
                      >
                        Seller portal
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Welcome</h2>
                <p className="text-muted mt-2 text-sm">
                  Sign in to access your orders, wishlist, saved addresses, and account settings.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/account/login"
                    className="bg-primary text-primary-foreground hover:bg-primary-dark inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/account/register"
                    className="border-border hover:bg-background inline-flex h-11 items-center justify-center rounded-lg border px-5 text-sm font-medium"
                  >
                    Create account
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Orders", desc: "Track and manage your orders", href: "/account/orders" },
              { title: "Wishlist", desc: "Items you've saved for later", href: "/account/wishlist" },
              { title: "Addresses", desc: "Manage delivery addresses", href: "/account/addresses" },
              { title: "Security", desc: "Password and session settings", href: "/account/security" },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="bg-surface hover:border-primary/30 rounded-xl border border-border p-4 transition-colors"
              >
                <p className="font-medium">{card.title}</p>
                <p className="text-muted mt-1 text-sm">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
