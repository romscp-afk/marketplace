import { requireApprovedSeller } from "@/lib/seller/session";
import { StoreProfileForm } from "@/components/seller/store-profile-form";
import { Badge } from "@/components/ui/badge";

export default async function SellerStorePage() {
  const { context } = await requireApprovedSeller();
  const { seller } = context;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Store profile</h1>
          <p className="text-muted mt-1 text-sm">Manage how customers see your store</p>
        </div>
        {seller.isVerified ? (
          <Badge variant="accent">Verified seller</Badge>
        ) : null}
      </div>

      <StoreProfileForm seller={seller} />
    </div>
  );
}
