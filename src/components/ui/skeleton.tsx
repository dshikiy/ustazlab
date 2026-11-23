import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-lg bg-[var(--surface-subtle)] border border-[var(--border)]",
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card grid gap-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-full mt-2" />
    </div>
  );
}
