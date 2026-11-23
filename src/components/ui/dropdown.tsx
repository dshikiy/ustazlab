"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Dropdown({
  trigger,
  children,
  align = "end",
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "center" | "end";
}) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={8}
          className="z-50 min-w-[200px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-lg"
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

export function DropdownItem({
  children,
  onSelect,
  danger = false,
  className,
}: {
  children: ReactNode;
  onSelect?: () => void;
  danger?: boolean;
  className?: string;
}) {
  return (
    <DropdownMenuPrimitive.Item
      onSelect={onSelect}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer outline-none select-none",
        danger
          ? "text-[var(--error)] hover:bg-[var(--error-soft)] focus:bg-[var(--error-soft)]"
          : "text-[var(--text)] hover:bg-[var(--surface-subtle)] focus:bg-[var(--surface-subtle)]",
        className
      )}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

