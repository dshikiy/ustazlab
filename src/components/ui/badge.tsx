import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "primary" | "success" | "warning" | "error" | "teal";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "primary", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn("pill", tone !== "primary" && tone, className)}
      {...props}
    />
  );
}
