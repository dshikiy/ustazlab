import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tooltip({
  content,
  children,
  className,
}: {
  content: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex group", className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg bg-[var(--text)] px-2.5 py-1 text-xs font-semibold text-[var(--surface)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 z-50"
      >
        {content}
      </span>
    </span>
  );
}

