import { db } from "@/db";
import { classes, classMemberships } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { requireTeacher } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";
import { createClassAction, deleteClassAction } from "@/lib/classroom-actions";
import { EmptyState } from "@/components/ui/empty-state";
import { Users, Trash2 } from "lucide-react";

export default async function ClassesPage() {
  const [teacher, locale] = await Promise.all([requireTeacher(), getLocale()]);
  const isRu = locale === "ru";

  const teacherClasses = await db
    .select()
    .from(classes)
    .where(eq(classes.teacherId, teacher.id))
    .orderBy(desc(classes.createdAt));

  const memberCounts = await Promise.all(
    teacherClasses.map(async (cls) => {
      const [row] = await db
        .select({ total: count() })
        .from(classMemberships)
        .where(eq(classMemberships.classId, cls.id));
      return [cls.id, row?.total ?? 0] as const;
    })
  );
  const countMap = new Map(memberCounts);

  return (
    <div className="grid gap-8">
      <div>
        <div className="eyebrow">{isRu ? "Управление классами" : "Сыныптарды басқару"}</div>
        <h1 className="text-3xl m-0">{isRu ? "Мои классы" : "Менің сыныптарым"}</h1>
      </div>

      <form action={createClassAction} className="card form max-w-2xl">
        <h2 className="text-lg m-0">{isRu ? "Создать новый класс" : "Жаңа сынып құру"}</h2>
        <div className="form-row">
          <label>
            {isRu ? "Название класса" : "Сынып атауы"}
            <input
              name="name"
              required
              minLength={2}
              maxLength={80}
              placeholder={isRu ? "3А · Юные экологи" : "3А · Жас экологтар"}
            />
          </label>
          <label>
            {isRu ? "Класс" : "Сынып деңгейі"}
            <select name="grade" defaultValue="3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                <option key={g} value={g}>
                  {g}-{isRu ? "класс" : "сынып"}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="btn w-max">
          {isRu ? "Создать класс" : "Сынып құру"}
        </button>
      </form>

      {teacherClasses.length ? (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {teacherClasses.map((cls) => (
            <article key={cls.id} className="card grid gap-3 content-start">
              <div className="flex items-center justify-between gap-2">
                <span className="pill">{cls.grade}-{isRu ? "класс" : "сынып"}</span>
                <span className="pill teal">
                  {isRu ? "Код:" : "Код:"} {cls.joinCode}
                </span>
              </div>
              <h3 className="m-0">{cls.name}</h3>
              <p className="muted text-sm m-0 flex items-center gap-1.5">
                <Users size={15} />
                {countMap.get(cls.id) ?? 0} {isRu ? "учеников" : "оқушы"}
              </p>
              <form action={deleteClassAction.bind(null, cls.id)} className="pt-2">
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
          title={isRu ? "Классов пока нет" : "Әзірге сынып жоқ"}
          description={
            isRu
              ? "Создайте первый класс и передайте код приглашения ученикам."
              : "Алғашқы сыныпты құрып, қосылу кодын оқушыларға беріңіз."
          }
        />
      )}
    </div>
  );
}
