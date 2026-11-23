import Link from "next/link";
import { Plus, BookOpen, Clock } from "lucide-react";
import { recentLessons } from "@/lib/actions";
import { getLocale } from "@/lib/i18n/server";
import { EmptyState } from "@/components/ui/empty-state";

export default async function LessonsListPage() {
  const [data, locale] = await Promise.all([recentLessons(), getLocale()]);
  const isRu = locale === "ru";

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">{isRu ? "Конструктор КСП" : "ҚМЖ конструкторы"}</div>
          <h1 className="text-3xl m-0">
            {isRu ? "Мои планы уроков" : "Менің сабақ жоспарларым"}
          </h1>
        </div>
        <Link className="btn" href="/dashboard/lessons/new">
          <Plus size={17} />
          {isRu ? "Новый план урока" : "Жаңа ҚМЖ"}
        </Link>
      </div>

      {data.length ? (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {data.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/dashboard/lessons/${lesson.id}`}
              className="card no-underline text-inherit grid gap-3 content-start hover:border-[var(--primary)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="pill">
                  {lesson.grade}-{isRu ? "класс" : "сынып"} · {lesson.subject}
                </span>
                <span className="text-xs muted flex items-center gap-1">
                  <Clock size={13} /> {lesson.duration} {isRu ? "мин" : "мин"}
                </span>
              </div>
              <h2 className="text-lg m-0">{lesson.title}</h2>
              <p className="muted text-sm m-0 line-clamp-2">{lesson.topic}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen size={24} />}
          title={isRu ? "Планов уроков пока нет" : "Әзірге сабақ жоспары жоқ"}
          description={
            isRu
              ? "Создайте первый план урока с этапами и экспортом в PDF и DOCX."
              : "Сабақ кезеңдері мен PDF/DOCX экспорты бар алғашқы жоспарыңызды жасаңыз."
          }
          href="/dashboard/lessons/new"
          label={isRu ? "Создать план урока" : "ҚМЖ жасау"}
        />
      )}
    </div>
  );
}
