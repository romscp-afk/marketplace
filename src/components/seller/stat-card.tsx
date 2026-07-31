import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  variant?: "default" | "warning" | "success";
}

export function StatCard({ label, value, hint, variant = "default" }: StatCardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <p className="text-muted text-xs font-medium">{label}</p>
      <p
        className={cn(
          "mt-1 text-2xl font-semibold",
          variant === "warning" && "text-warning",
          variant === "success" && "text-success",
        )}
      >
        {value}
      </p>
      {hint ? <p className="text-muted mt-1 text-xs">{hint}</p> : null}
    </div>
  );
}
