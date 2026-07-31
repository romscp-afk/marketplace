import { SellerSidebar } from "@/components/seller/sidebar";
import { requireApprovedSeller } from "@/lib/seller/session";

export default async function SellerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { context } = await requireApprovedSeller();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <SellerSidebar storeName={context.seller.store.name} />
        <div>{children}</div>
      </div>
    </div>
  );
}
