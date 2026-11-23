import Link from "next/link";
import { Shield } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";
import { LocaleSwitcher } from "@/lib/i18n/client";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [admin, locale] = await Promise.all([requireAdmin(), getLocale()]);
  const isRu = locale === "ru";

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="logo flex items-center gap-2" href="/admin">
            <span
              className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--primary)] text-white"
              aria-hidden="true"
            >
              <Shield size={19} />
            </span>
            <span>
              Ustaz<span>Lab</span> Admin
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <ThemeToggle />
            <span className="desktop-only text-sm font-semibold">{admin.name}</span>
            <Link href="/dashboard" className="btn secondary sm">
              {isRu ? "← Кабинет" : "← Кабинет"}
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content" className="container section">
        {children}
      </main>
    </>
  );
}
