import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, required, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <div className="space-y-1.5">
        <label htmlFor={textareaId} className="block text-sm font-medium text-foreground">
          {label}
          {required ? (
            <span className="text-error ml-0.5" aria-hidden="true">*</span>
          ) : null}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          aria-invalid={error ? "true" : undefined}
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border bg-surface px-3 py-2 text-sm",
            "placeholder:text-muted focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-primary focus-visible:ring-offset-1",
            error ? "border-error" : "border-border",
            className,
          )}
          {...props}
        />
        {hint && !error ? (
          <p className="text-muted text-xs">{hint}</p>
        ) : null}
        {error ? (
          <p className="text-error text-xs" role="alert">{error}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
