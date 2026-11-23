import Link from "next/link";
import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon,
  action,
  href,
  label,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  href?: string;
  label?: string;
}) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-12 px-6 gap-3">
      <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-2xl">
        {icon || <Inbox size={24} />}
      </div>
      <h3 className="m-0">{title}</h3>
      <p className="muted max-w-md m-0 text-sm">{description}</p>
      {action ? (
        <div className="mt-2">{action}</div>
      ) : href && label ? (
        <Link href={href} className="btn mt-2">
          {label}
        </Link>
      ) : null}
    </div>
  );
}
