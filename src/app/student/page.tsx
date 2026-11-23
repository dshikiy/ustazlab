import Link from "next/link";
import { requireStudent } from "@/lib/auth";
import { db } from "@/db";
import {
  assignments,
  classMemberships,
  assignmentSubmissions,
  achievements,
} from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { getLocale } from "@/lib/i18n/server";

export default async function StudentDashboardPage() {
  const [student, locale] = await Promise.all([requireStudent(), getLocale()]);
  const isRu = locale === "ru";

  const [[assigned], [done], [earned]] = await Promise.all([
    db
      .select({ value: count() })
      .from(assignments)
      .innerJoin(classMemberships, eq(assignments.classId, classMemberships.classId))
      .where(eq(classMemberships.studentId, student.id)),
    db
      .select({ value: count() })
      .from(assignmentSubmissions)
      .where(eq(assignmentSubmissions.studentId, student.id)),
    db
      .select({ value: count() })
      .from(achievements)
      .where(eq(achievements.userId, student.id)),
  ]);

  const cards = [
    ["📚", assigned.value, isRu ? "Заданий" : "Тапсырма"],
    ["✅", done.value, isRu ? "Выполнено" : "Орындалды"],
    ["🏆", earned.value, isRu ? "Достижений" : "Жетістік"],
  ] as const;

  return (
    <div className="grid gap-6">
      <div>
        <div className="eyebrow">{isRu ? "Моё учебное пространство" : "Менің оқу кеңістігім"}</div>
        <h1 className="text-3xl m-0">
          {isRu ? "Учимся вместе сегодня!" : "Бүгін бірге үйренеміз!"}
        </h1>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
      >
        {cards.map(([icon, value, label]) => (
          <div className="card grid gap-1" key={label}>
            <div className="text-3xl" aria-hidden="true">{icon}</div>
            <div className="stat">{value}</div>
            <span className="muted text-sm">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link className="btn" href="/student/assignments">
          {isRu ? "Открыть задания" : "Тапсырмаларды ашу"}
        </Link>
        <Link className="btn secondary" href="/student/games">
          {isRu ? "Играть в игры" : "Ойын ойнау"}
        </Link>
        <Link className="btn secondary" href="/inclusive">
          {isRu ? "Инклюзивные карточки" : "Инклюзивті құралдар"}
        </Link>
      </div>
    </div>
  );
}
