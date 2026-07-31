import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-16 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="text-muted mb-4" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h2 className="font-display text-xl font-semibold text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="text-muted mt-2 max-w-sm text-sm">{description}</p>
      ) : null}
      {action ? (
        <div className="mt-6">
          {action.href ? (
            <a
              href={action.href}
              className="bg-primary text-primary-foreground hover:bg-primary-dark inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors"
            >
              {action.label}
            </a>
          ) : (
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
