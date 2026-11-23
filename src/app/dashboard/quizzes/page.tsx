import Link from "next/link";
import { Plus, ClipboardCheck } from "lucide-react";
import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { requireTeacher } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { getLocale } from "@/lib/i18n/server";
import { EmptyState } from "@/components/ui/empty-state";

export default async function QuizzesListPage() {
  const [user, locale] = await Promise.all([requireTeacher(), getLocale()]);
  const isRu = locale === "ru";

  const data = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.teacherId, user.id))
    .orderBy(desc(quizzes.updatedAt));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">{isRu ? "Конструктор тестов" : "Тест конструкторы"}</div>
          <h1 className="text-3xl m-0">{isRu ? "Мои тесты" : "Менің тесттерім"}</h1>
        </div>
        <Link className="btn" href="/dashboard/quizzes/new">
          <Plus size={17} />
          {isRu ? "Создать тест" : "Жаңа тест"}
        </Link>
      </div>

      {data.length ? (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {data.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/dashboard/quizzes/${quiz.id}`}
              className="card no-underline text-inherit grid gap-3 content-start hover:border-[var(--primary)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={quiz.status === "PUBLISHED" ? "pill success" : "pill"}>
                  {quiz.status}
                </span>
                <span className="text-xs muted">
                  {quiz.grade}-{isRu ? "класс" : "сынып"} · {quiz.subject}
                </span>
              </div>
              <h2 className="text-lg m-0">{quiz.title}</h2>
              {quiz.description && (
                <p className="muted text-sm m-0 line-clamp-2">{quiz.description}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ClipboardCheck size={24} />}
          title={isRu ? "Тестов пока нет" : "Әзірге тест жоқ"}
          description={
            isRu
              ? "Создайте интерактивный тест с серверной проверкой и безопасной ссылкой."
              : "Серверлік бағаланатын интерактивті тест құрастырыңыз."
          }
          href="/dashboard/quizzes/new"
          label={isRu ? "Создать тест" : "Тест құрастыру"}
        />
      )}
    </div>
  );
}
