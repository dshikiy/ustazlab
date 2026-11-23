"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LocaleSwitcher } from "@/lib/i18n/client";
import { ThemeToggle } from "./theme-toggle";
import type { Locale, Messages } from "@/lib/i18n/types";

export function MobileNav({
  labels,
  portalHref,
  portalLabel,
  locale,
}: {
  labels: Messages["nav"];
  portalHref: string;
  portalLabel: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          className="icon-btn"
          aria-expanded={open}
          aria-label={labels.menu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="mobile-panel" role="dialog" aria-label={labels.menu}>
          <Link href="/" onClick={() => setOpen(false)}>
            {labels.home}
          </Link>
          <Link href="/games" onClick={() => setOpen(false)}>
            {labels.games}
          </Link>
          <Link href="/materials" onClick={() => setOpen(false)}>
            {labels.materials}
          </Link>
          <Link href="/inclusive" onClick={() => setOpen(false)}>
            {labels.inclusive}
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            {labels.about}
          </Link>
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
            <LocaleSwitcher locale={locale} />
          </div>
          <Link
            className="btn w-full mt-1"
            href={portalHref}
            onClick={() => setOpen(false)}
          >
            {portalLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
