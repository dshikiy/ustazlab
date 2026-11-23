import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { logoutAction } from "@/lib/actions";
import { requireTeacher } from "@/lib/auth";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { LocaleSwitcher } from "@/lib/i18n/client";
import { ThemeToggle } from "./theme-toggle";
import { DashboardNav } from "./dashboard-nav";
import { SidebarLinks } from "./sidebar-links";
import { Avatar } from "@/components/ui/controls";

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

  const extraLinks: (readonly [string, string])[] = [
    ...(user.role === "ADMIN" ? ([["/admin", m.dashboard.admin]] as const) : []),
    ["/dashboard/profile", m.dashboard.profile] as const,
  ];

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <BrandLogo href="/" />
          <div className="flex items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <ThemeToggle />
            <Link
              href="/dashboard/profile"
              className="desktop-only flex items-center gap-2 no-underline text-inherit"
            >
              <Avatar name={user.name} size="sm" />
              <span className="text-sm font-semibold">{user.name}</span>
            </Link>
            <DashboardNav links={links} admin={user.role === "ADMIN"} />
          </div>
        </div>
      </header>

      <div className="dashboard">
        <aside className="sidebar" aria-label={m.dashboard.overview}>
          <SidebarLinks links={links} />
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <SidebarLinks links={extraLinks} />
          </div>
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
