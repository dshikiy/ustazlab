import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { requireStudent } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";
import { LocaleSwitcher } from "@/lib/i18n/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/lib/actions";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [student, locale] = await Promise.all([requireStudent(), getLocale()]);
  const isRu = locale === "ru";

  const nav = [
    ["/student", isRu ? "Главная" : "Басты бет"],
    ["/student/assignments", isRu ? "Мои задания" : "Тапсырмалар"],
    ["/student/games", isRu ? "Игры" : "Ойындар"],
    ["/student/progress", isRu ? "Прогресс" : "Ілгерілеу"],
    ["/student/achievements", isRu ? "Достижения" : "Жетістіктер"],
    ["/inclusive/settings", isRu ? "Доступность" : "Қолжетімділік"],
  ];

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="logo flex items-center gap-2" href="/student">
            <span
              className="grid place-items-center w-9 h-9 rounded-xl bg-[var(--secondary)] text-white"
              aria-hidden="true"
            >
              <GraduationCap size={20} />
            </span>
            <span>
              Ustaz<span>Lab</span> Kids
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="desktop-only text-sm font-semibold">
              {isRu ? `Привет, ${student.name}!` : `Сәлем, ${student.name}!`}
            </span>
            <LocaleSwitcher locale={locale} />
            <ThemeToggle />
            <form action={logoutAction}>
              <button type="submit" className="btn secondary sm">
                {isRu ? "Выйти" : "Шығу"}
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="container section grid gap-6">
        <nav
          aria-label={isRu ? "Меню ученика" : "Оқушы мәзірі"}
          className="flex flex-wrap gap-2 pb-2 border-b border-[var(--border)]"
        >
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="pill no-underline">
              {label}
            </Link>
          ))}
        </nav>
        <main id="main-content">{children}</main>
      </div>
    </>
  );
}
