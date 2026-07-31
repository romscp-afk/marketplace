import { notFound } from "next/navigation";
import { requireApprovedSeller } from "@/lib/seller/session";
import { getSellerOrderDetail } from "@/lib/seller/data";
import { OrderDetailView } from "@/components/seller/order-detail";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SellerOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const { context } = await requireApprovedSeller();
  const order = await getSellerOrderDetail(context.seller.id, id);

  if (!order) notFound();

  return <OrderDetailView order={order} />;
}
