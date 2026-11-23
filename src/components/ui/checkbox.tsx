import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 cursor-pointer font-medium text-sm select-none",
        className
      )}
    >
      <input
        type="checkbox"
        className="w-5 h-5 mt-0.5 rounded accent-[var(--primary)] cursor-pointer shrink-0"
        {...props}
      />
      <span className="grid gap-0.5">
        <span className="font-semibold text-[var(--text)]">{label}</span>
        {description && <span className="text-xs muted">{description}</span>}
      </span>
    </label>
  );
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export function Radio({ label, description, className, ...props }: RadioProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 cursor-pointer font-medium text-sm select-none",
        className
      )}
    >
      <input
        type="radio"
        className="w-5 h-5 mt-0.5 accent-[var(--primary)] cursor-pointer shrink-0"
        {...props}
      />
      <span className="grid gap-0.5">
        <span className="font-semibold text-[var(--text)]">{label}</span>
        {description && <span className="text-xs muted">{description}</span>}
      </span>
    </label>
  );
}

