import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
  countryCodeName: string;
  countryCodeValue: string;
  onCountryCodeChange: (value: string) => void;
  countryCodeOptions: { value: string; label: string }[];
  countryCodeError?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      id,
      required,
      countryCodeName,
      countryCodeValue,
      onCountryCodeChange,
      countryCodeOptions,
      countryCodeError,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? props.name;
    const hasError = Boolean(error || countryCodeError);

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required ? (
            <span className="text-error ml-0.5" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        <div className="flex gap-2">
          <div className="relative w-[min(100%,11rem)] shrink-0">
            <label htmlFor={`${inputId}-country-code`} className="sr-only">
              Country code
            </label>
            <select
              id={`${inputId}-country-code`}
              name={countryCodeName}
              value={countryCodeValue}
              onChange={(e) => onCountryCodeChange(e.target.value)}
              aria-invalid={countryCodeError ? "true" : undefined}
              className={cn(
                "flex h-11 w-full appearance-none rounded-lg border bg-surface px-3 py-2 pr-8 text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                hasError ? "border-error" : "border-border",
              )}
            >
              {countryCodeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="text-muted pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
          </div>
          <input
            ref={ref}
            id={inputId}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required={required}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              "flex h-11 min-w-0 flex-1 rounded-lg border bg-surface px-3 py-2 text-sm",
              "placeholder:text-muted transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              hasError ? "border-error" : "border-border",
              className,
            )}
            {...props}
          />
        </div>
        {hint && !hasError ? (
          <p id={`${inputId}-hint`} className="text-muted text-xs">
            {hint}
          </p>
        ) : null}
        {error || countryCodeError ? (
          <p id={`${inputId}-error`} className="text-error text-xs" role="alert">
            {error ?? countryCodeError}
          </p>
        ) : null}
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
