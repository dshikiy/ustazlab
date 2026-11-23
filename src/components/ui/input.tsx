import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <div className="grid gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        className={cn(error && "border-[var(--error)]", className)}
        {...props}
      />
      {hint && !error && <span className="text-xs muted">{hint}</span>}
      {error && (
        <span role="alert" className="text-xs font-semibold text-[var(--error)]">
          {error}
        </span>
      )}
    </div>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const inputId = id || props.name;
  return (
    <div className="grid gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        aria-invalid={!!error}
        className={cn(error && "border-[var(--error)]", className)}
        {...props}
      />
      {hint && !error && <span className="text-xs muted">{hint}</span>}
      {error && (
        <span role="alert" className="text-xs font-semibold text-[var(--error)]">
          {error}
        </span>
      )}
    </div>
  );
}

export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error && (
        <span role="alert" className="text-xs font-semibold text-[var(--error)]">
          {error}
        </span>
      )}
    </div>
  );
}

