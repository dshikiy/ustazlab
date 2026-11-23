import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0 text-sm muted">
        {items.map((item, idx) => (
          <li key={item.label} className="inline-flex items-center gap-1.5">
            {idx > 0 && <ChevronRight size={14} aria-hidden="true" />}
            {item.href && idx < items.length - 1 ? (
              <Link href={item.href} className="hover:text-[var(--text)] no-underline text-inherit">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-[var(--text)]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  prevLabel = "Артқа",
  nextLabel = "Келесі",
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevLabel?: string;
  nextLabel?: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-6">
      <button
        type="button"
        className="btn secondary sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} />
        {prevLabel}
      </button>
      <span className="text-sm font-semibold px-3">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        className="btn secondary sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {nextLabel}
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export function Sidebar({
  children,
  label = "Navigation",
  className,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <aside className={cn("sidebar", className)} aria-label={label}>
      {children}
    </aside>
  );
}

export function Navbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("site-header", className)}>
      <div className="container nav">{children}</div>
    </header>
  );
}

