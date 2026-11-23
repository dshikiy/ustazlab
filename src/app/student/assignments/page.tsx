import Link from "next/link";
import { db } from "@/db";
import {
  assignments,
  classMemberships,
  assignmentSubmissions,
  classes,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireStudent } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";
import {
  joinClassAction,
  completeAssignmentAction,
} from "@/lib/classroom-actions";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckCircle2 } from "lucide-react";

export default async function StudentAssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ joined?: string; error?: string }>;
}) {
  const [student, locale, sp] = await Promise.all([
    requireStudent(),
    getLocale(),
    searchParams,
  ]);
  const isRu = locale === "ru";

  const [items, submissions] = await Promise.all([
    db
      .select({
        id: assignments.id,
        title: assignments.title,
        quizId: assignments.quizId,
        dueAt: assignments.dueAt,
        className: classes.name,
      })
      .from(assignments)
      .innerJoin(classes, eq(assignments.classId, classes.id))
      .innerJoin(classMemberships, eq(assignments.classId, classMemberships.classId))
      .where(eq(classMemberships.studentId, student.id))
      .orderBy(desc(assignments.createdAt)),
    db
      .select({ assignmentId: assignmentSubmissions.assignmentId })
      .from(assignmentSubmissions)
      .where(eq(assignmentSubmissions.studentId, student.id)),
  ]);

  const doneSet = new Set(submissions.map((s) => s.assignmentId));

  return (
    <div className="grid gap-6">
      <div>
        <div className="eyebrow">{isRu ? "Мои классы и задания" : "Менің сыныптарым мен тапсырмаларым"}</div>
        <h1 className="text-3xl m-0">{isRu ? "Задания" : "Тапсырмалар"}</h1>
      </div>

      {sp.joined && (
        <div className="p-3 rounded-xl border border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)] text-sm font-semibold">
          {isRu ? "Вы успешно присоединились к классу!" : "Сыныпқа сәтті қосылдыңыз!"}
        </div>
      )}
      {sp.error && (
        <div
          role="alert"
          className="p-3 rounded-xl border border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)] text-sm font-semibold"
        >
          {isRu ? "Код класса не найден." : "Сынып коды табылмады."}
        </div>
      )}

      <form action={joinClassAction} className="card flex flex-wrap items-end gap-3 max-w-xl">
        <label className="flex-1 min-w-[200px]">
          {isRu ? "Код приглашения в класс" : "Сыныпқа қосылу коды"}
          <input name="joinCode" required placeholder="ECO3A" maxLength={12} />
        </label>
        <button type="submit" className="btn">
          {isRu ? "Присоединиться" : "Қосылу"}
        </button>
      </form>

      {items.length ? (
        <div className="grid gap-4">
          {items.map((item) => {
            const isDone = doneSet.has(item.id);
            return (
              <article
                key={item.id}
                className="card flex flex-wrap items-center justify-between gap-4"
              >
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="pill">{item.className}</span>
                    {isDone && (
                      <span className="pill success">
                        <CheckCircle2 size={14} /> {isRu ? "Выполнено" : "Орындалды"}
                      </span>
                    )}
                  </div>
                  <h3 className="m-0">{item.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.quizId && (
                    <Link href={`/play/${item.quizId}`} className="btn sm">
                      {isRu ? "Пройти тест" : "Тест тапсыру"}
                    </Link>
                  )}
                  {!isDone && (
                    <form action={completeAssignmentAction.bind(null, item.id)}>
                      <button type="submit" className="btn secondary sm">
                        {isRu ? "Отметить выполненным" : "Орындалды деп белгілеу"}
                      </button>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={isRu ? "Пока нет назначенных заданий" : "Әзірге тапсырмалар жоқ"}
          description={
            isRu
              ? "Введите код класса от учителя, чтобы увидеть задания."
              : "Тапсырмаларды көру үшін мұғалім берген сынып кодын енгізіңіз."
          }
        />
      )}
    </div>
  );
}
