"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "./modal";

export function IconButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn("icon-btn", className)} {...props} />;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  id,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  id?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-3 cursor-pointer select-none"
    >
      <span className="text-sm font-semibold text-[var(--text)]">{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-[var(--border)] transition-colors cursor-pointer p-0.5",
          checked ? "bg-[var(--primary)]" : "bg-[var(--surface-subtle)]"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
}

export function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
  const sizeClass =
    size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-12 h-12 text-base" : "w-10 h-10 text-sm";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid place-items-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)] font-bold border border-[var(--border)] shrink-0",
        sizeClass
      )}
    >
      {initials || "U"}
    </span>
  );
}

export function ErrorState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="card flex flex-col items-center justify-center text-center py-10 px-6 gap-3 border-[var(--error)]"
    >
      <div className="w-12 h-12 rounded-xl bg-[var(--error-soft)] text-[var(--error)] grid place-items-center">
        <AlertTriangle size={24} />
      </div>
      <h3 className="m-0">{title}</h3>
      <p className="muted text-sm max-w-md m-0">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  danger = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="flex justify-end gap-2.5 pt-2">
        <button
          type="button"
          className="btn secondary"
          onClick={() => onOpenChange(false)}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={danger ? "btn danger" : "btn"}
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
