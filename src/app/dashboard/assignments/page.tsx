import { db } from "@/db";
import {
  assignments,
  assignmentSubmissions,
  classes,
  lessons,
  quizzes,
} from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { requireTeacher } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";
import {
  createAssignmentAction,
  deleteAssignmentAction,
} from "@/lib/classroom-actions";
import { EmptyState } from "@/components/ui/empty-state";
import { Trash2, ClipboardList } from "lucide-react";

export default async function AssignmentsPage() {
  const [teacher, locale] = await Promise.all([requireTeacher(), getLocale()]);
  const isRu = locale === "ru";

  const [teacherClasses, teacherLessons, teacherQuizzes, list] = await Promise.all([
    db.select().from(classes).where(eq(classes.teacherId, teacher.id)),
    db.select().from(lessons).where(eq(lessons.teacherId, teacher.id)).orderBy(desc(lessons.updatedAt)),
    db.select().from(quizzes).where(eq(quizzes.teacherId, teacher.id)).orderBy(desc(quizzes.updatedAt)),
    db
      .select({
        id: assignments.id,
        title: assignments.title,
        dueAt: assignments.dueAt,
        className: classes.name,
      })
      .from(assignments)
      .innerJoin(classes, eq(assignments.classId, classes.id))
      .where(eq(assignments.teacherId, teacher.id))
      .orderBy(desc(assignments.createdAt)),
  ]);

  const submissionCounts = await Promise.all(
    list.map(async (item) => {
      const [row] = await db
        .select({ total: count() })
        .from(assignmentSubmissions)
        .where(eq(assignmentSubmissions.assignmentId, item.id));
      return [item.id, row?.total ?? 0] as const;
    })
  );
  const subMap = new Map(submissionCounts);

  return (
    <div className="grid gap-8">
      <div>
        <div className="eyebrow">{isRu ? "Домашние и классные работы" : "Сынып және үй тапсырмалары"}</div>
        <h1 className="text-3xl m-0">{isRu ? "Тапсырмалар / Задания" : "Тапсырмалар"}</h1>
      </div>

      {teacherClasses.length ? (
        <form action={createAssignmentAction} className="card form max-w-2xl">
          <h2 className="text-lg m-0">{isRu ? "Назначить задание" : "Тапсырма беру"}</h2>
          <label>
            {isRu ? "Название задания" : "Тапсырма атауы"}
            <input
              name="title"
              required
              minLength={3}
              placeholder={isRu ? "Повторить тему «Вода» и пройти тест" : "«Су» тақырыбын қайталау және тест тапсыру"}
            />
          </label>
          <div className="form-row">
            <label>
              {isRu ? "Класс" : "Сынып"}
              <select name="classId" required>
                {teacherClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {isRu ? "Срок сдачи" : "Тапсыру мерзімі"}
              <input name="dueAt" type="date" />
            </label>
          </div>
          <div className="form-row">
            <label>
              {isRu ? "Привязать урок (необязательно)" : "Сабақты тіркеу (міндетті емес)"}
              <select name="lessonId" defaultValue="">
                <option value="">{isRu ? "Не выбрано" : "Таңдалмаған"}</option>
                {teacherLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {isRu ? "Привязать тест (необязательно)" : "Тестті тіркеу (міндетті емес)"}
              <select name="quizId" defaultValue="">
                <option value="">{isRu ? "Не выбрано" : "Таңдалмаған"}</option>
                {teacherQuizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="btn w-max">
            {isRu ? "Назначить" : "Тапсырма беру"}
          </button>
        </form>
      ) : (
        <div className="card">
          <p className="muted m-0">
            {isRu
              ? "Сначала создайте класс в разделе «Классы», чтобы назначать задания."
              : "Тапсырма беру үшін алдымен «Сыныптар» бөлімінде сынып құрыңыз."}
          </p>
        </div>
      )}

      {list.length ? (
        <div className="grid gap-3">
          {list.map((item) => (
            <article
              key={item.id}
              className="card flex flex-wrap items-center justify-between gap-4"
            >
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <span className="pill">{item.className}</span>
                  <span className="pill success">
                    {subMap.get(item.id) ?? 0} {isRu ? "сдано" : "тапсырды"}
                  </span>
                </div>
                <h3 className="m-0">{item.title}</h3>
                {item.dueAt && (
                  <span className="text-xs muted">
                    {isRu ? "Срок:" : "Мерзімі:"}{" "}
                    {new Date(item.dueAt).toLocaleDateString(isRu ? "ru-RU" : "kk-KZ")}
                  </span>
                )}
              </div>
              <form action={deleteAssignmentAction.bind(null, item.id)}>
                <button type="submit" className="btn secondary sm">
                  <Trash2 size={15} />
                  {isRu ? "Удалить" : "Жою"}
                </button>
              </form>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ClipboardList size={24} />}
          title={isRu ? "Заданий пока нет" : "Әзірге тапсырма жоқ"}
          description={
            isRu
              ? "Назначьте урок или тест классу, чтобы отслеживать выполнение."
              : "Орындалуын бақылау үшін сыныпқа сабақ немесе тест тағайындаңыз."
          }
        />
      )}
    </div>
  );
}

