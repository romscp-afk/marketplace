import { Badge } from "@/components/ui/badge";
import {
  sellerApplicationStatuses,
  sellerProductStatuses,
  sellerOrderStatuses,
} from "@/config/seller-navigation";

type StatusConfig = {
  label: string;
  color: "default" | "success" | "warning" | "error" | "accent" | "promotional";
};

type StatusMap = Record<string, StatusConfig>;

export function StatusBadge({
  status,
  map,
}: {
  status: string;
  map: StatusMap;
}) {
  const config: StatusConfig = map[status] ?? {
    label: status.replace(/_/g, " "),
    color: "default",
  };

  return <Badge variant={config.color}>{config.label}</Badge>;
}

export function ApplicationStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} map={sellerApplicationStatuses} />;
}

export function ProductStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} map={sellerProductStatuses} />;
}

export function OrderStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} map={sellerOrderStatuses} />;
}
