import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { requireTeacher } from "@/lib/auth";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { LocaleSwitcher } from "@/lib/i18n/client";
import { ThemeToggle } from "./theme-toggle";
import { DashboardNav } from "./dashboard-nav";

export async function DashboardShell({ children }: { children: React.ReactNode }) {
  const [user, locale, m] = await Promise.all([
    requireTeacher(),
    getLocale(),
    getMessages(),
  ]);

  const isRu = locale === "ru";
  const links: readonly (readonly [string, string])[] = [
    ["/dashboard", m.dashboard.overview],
    ["/dashboard/lessons", m.dashboard.lessons],
    ["/dashboard/quizzes", m.dashboard.quizzes],
    ["/games", m.dashboard.games],
    ["/dashboard/classes", isRu ? "Классы" : "Сыныптар"],
    ["/dashboard/assignments", isRu ? "Задания" : "Тапсырмалар"],
    ["/dashboard/materials", m.dashboard.materials],
    ["/inclusive", m.dashboard.inclusive],
    ["/dashboard/results", m.dashboard.results],
    ["/dashboard/analytics", m.dashboard.analytics],
    ["/dashboard/assistant", m.dashboard.assistant],
    ["/dashboard/settings", m.dashboard.settings],
  ];

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="logo flex items-center gap-2.5" href="/">
            <span
              className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--primary)] text-white"
              aria-hidden="true"
            >
              <GraduationCap size={20} />
            </span>
            <span>
              Ustaz<span>Lab</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <ThemeToggle />
            <span className="desktop-only text-sm font-semibold">{user.name}</span>
            <DashboardNav links={links} admin={user.role === "ADMIN"} />
          </div>
        </div>
      </header>

      <div className="dashboard">
        <aside className="sidebar" aria-label={m.dashboard.overview}>
          {links.map(([href, label]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
          {user.role === "ADMIN" && <Link href="/admin">{m.dashboard.admin}</Link>}
          <Link href="/dashboard/profile">{m.dashboard.profile}</Link>
          <form action={logoutAction} className="mt-auto pt-4 border-t border-[var(--border)]">
            <button type="submit" className="btn secondary w-full">
              {m.nav.logout}
            </button>
          </form>
        </aside>
        <main id="main-content" className="main">
          {children}
        </main>
      </div>
    </>
  );
}
