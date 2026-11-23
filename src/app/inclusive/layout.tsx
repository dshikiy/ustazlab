import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLocale } from "@/lib/i18n/server";

export default async function InclusiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isRu = locale === "ru";

  const links = [
    ["/inclusive", isRu ? "Обзор" : "Шолу"],
    ["/inclusive/lessons", isRu ? "Уроки" : "Инклюзивті сабақтар"],
    ["/inclusive/games", isRu ? "Игры" : "Ойындар"],
    ["/inclusive/quizzes", isRu ? "Тест (4 вопроса)" : "Тест (4 сұрақ)"],
    ["/inclusive/communication", isRu ? "Карточки общения" : "Қарым-қатынас карточкалары"],
    ["/inclusive/settings", isRu ? "Доступность" : "Қолжетімділік"],
    ["/inclusive/progress", isRu ? "Прогресс" : "Ілгерілеу"],
  ];

  return (
    <>
      <Header />
      <div className="container section grid gap-6">
        <nav
          aria-label={isRu ? "Разделы инклюзивного обучения" : "Инклюзивті білім бөлімдері"}
          className="flex flex-wrap gap-2 pb-2 border-b border-[var(--border)]"
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="pill no-underline hover:border-[var(--primary)]"
            >
              {label}
            </Link>
          ))}
        </nav>
        <main id="main-content">{children}</main>
      </div>
      <Footer />
    </>
  );
}
