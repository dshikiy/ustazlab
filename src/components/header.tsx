import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { getSession } from "@/lib/auth";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { LocaleSwitcher } from "@/lib/i18n/client";
import { MobileNav } from "./mobile-nav";

export async function Header() {
  const [session, m, locale] = await Promise.all([
    getSession(),
    getMessages(),
    getLocale(),
  ]);

  const portalHref = session
    ? session.role === "STUDENT"
      ? "/student"
      : session.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/login";

  const portalLabel = session
    ? session.role === "STUDENT"
      ? m.nav.studentPortal
      : m.nav.dashboard
    : m.nav.login;

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="logo flex items-center gap-2.5" href="/">
          <span
            className="grid place-items-center w-10 h-10 rounded-xl bg-[var(--primary)] text-white shrink-0"
            aria-hidden="true"
          >
            <GraduationCap size={22} />
          </span>
          <span>
            Ustaz<span>Lab</span>
          </span>
        </Link>

        <nav className="navlinks" aria-label={m.nav.menu}>
          <Link href="/">{m.nav.home}</Link>
          <Link href="/games">{m.nav.games}</Link>
          <Link href="/materials">{m.nav.materials}</Link>
          <Link href="/inclusive">{m.nav.inclusive}</Link>
          <Link href="/about">{m.nav.about}</Link>
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
          <Link className="btn sm" href={portalHref}>
            {portalLabel}
          </Link>
        </nav>

        <MobileNav
          labels={m.nav}
          portalHref={portalHref}
          portalLabel={portalLabel}
          locale={locale}
        />
      </div>
    </header>
  );
}
