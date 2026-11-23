import Link from "next/link";
import { db } from "@/db";
import { users, lessons, quizzes, quizAttempts, materials } from "@/db/schema";
import { count } from "drizzle-orm";
import { getLocale } from "@/lib/i18n/server";

export default async function AdminOverviewPage() {
  const [locale, vals] = await Promise.all([
    getLocale(),
    Promise.all(
      [users, lessons, quizzes, quizAttempts, materials].map((table) =>
        db.select({ v: count() }).from(table)
      )
    ),
  ]);
  const isRu = locale === "ru";

  const stats = [
    { label: isRu ? "Пользователи" : "Пайдаланушылар", value: vals[0][0].v },
    { label: isRu ? "Уроки" : "Сабақтар", value: vals[1][0].v },
    { label: isRu ? "Тесты" : "Тесттер", value: vals[2][0].v },
    { label: isRu ? "Попытки" : "Нәтижелер", value: vals[3][0].v },
    { label: isRu ? "Материалы" : "Материалдар", value: vals[4][0].v },
  ];

  const sections = [
    ["users", isRu ? "Управление пользователями" : "Пайдаланушыларды басқару"],
    ["lessons", isRu ? "Модерация уроков" : "Сабақтар"],
    ["quizzes", isRu ? "Модерация тестов" : "Тесттер"],
    ["games", isRu ? "Контент игр" : "Ойын контенті"],
    ["materials", isRu ? "Библиотека материалов" : "Материалдар"],
    ["results", isRu ? "Результаты тестов" : "Тест нәтижелері"],
    ["settings", isRu ? "Настройки платформы" : "Платформа баптаулары"],
  ];

  return (
    <div className="grid gap-8">
      <div>
        <div className="eyebrow">{isRu ? "Безопасное управление" : "Қауіпсіз басқару"}</div>
        <h1 className="text-3xl m-0">{isRu ? "Панель администратора" : "Әкімші панелі"}</h1>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}
      >
        {stats.map((s) => (
          <div className="card grid gap-1" key={s.label}>
            <div className="stat">{s.value}</div>
            <span className="muted text-sm">{s.label}</span>
          </div>
        ))}
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {sections.map(([slug, label]) => (
          <Link
            key={slug}
            href={`/admin/${slug}`}
            className="card no-underline text-inherit flex items-center justify-between hover:border-[var(--primary)]"
          >
            <span className="font-semibold">{label}</span>
            <span className="text-[var(--primary)] font-bold">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
