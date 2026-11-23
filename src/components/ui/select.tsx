import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export function Select({
  label,
  error,
  options,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id || props.name;
  return (
    <div className="grid gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-semibold">
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={!!error}
        className={cn(error && "border-[var(--error)]", className)}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error && (
        <span role="alert" className="text-xs font-semibold text-[var(--error)]">
          {error}
        </span>
      )}
    </div>
  );
}

