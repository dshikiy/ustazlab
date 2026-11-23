import Link from "next/link";
import { BrandLogo } from "./brand-logo";
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
        <BrandLogo href="/" />

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
