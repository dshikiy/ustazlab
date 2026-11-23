import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { lessons, lessonStages } from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { requireTeacher } from "@/lib/auth";
import { deleteLessonAction, duplicateLessonAction } from "@/lib/actions";
import { PrintButton } from "@/components/print-button";
import { Breadcrumbs } from "@/components/ui/navigation";
import { Pencil, FileDown, Copy, Trash2 } from "lucide-react";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, requireTeacher()]);

  const [lesson] = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.id, id), eq(lessons.teacherId, user.id)));

  if (!lesson) notFound();

  const stages = await db
    .select()
    .from(lessonStages)
    .where(eq(lessonStages.lessonId, id))
    .orderBy(asc(lessonStages.position));

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        items={[
          { label: "Басты бет", href: "/dashboard" },
          { label: "Сабақтар", href: "/dashboard/lessons" },
          { label: lesson.title },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">
            {lesson.grade}-сынып · {lesson.subject} · {lesson.duration} минут
          </div>
          <h1 className="text-3xl m-0">{lesson.title}</h1>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Link className="btn" href={`/dashboard/lessons/${id}/edit`}>
            <Pencil size={16} />
            Өңдеу
          </Link>
          <Link className="btn secondary" href={`/api/lessons/${id}/pdf`}>
            <FileDown size={16} />
            PDF
          </Link>
          <Link className="btn secondary" href={`/api/lessons/${id}/docx`}>
            <FileDown size={16} />
            DOCX
          </Link>
          <PrintButton />
        </div>
      </div>

      <section className="card grid gap-2.5">
        <p className="m-0">
          <b>Тақырып:</b> {lesson.topic}
        </p>
        <p className="m-0">
          <b>Оқу мақсаттары:</b> {lesson.objectives}
        </p>
        {lesson.assessment && (
          <p className="m-0">
            <b>Бағалау критерийлері:</b> {lesson.assessment}
          </p>
        )}
        {lesson.resources && (
          <p className="m-0">
            <b>Әдістер мен ресурстар:</b> {lesson.resources}
          </p>
        )}
        {lesson.school && (
          <p className="m-0 muted text-sm">
            <b>Мектеп:</b> {lesson.school}
          </p>
        )}
      </section>

      <div className="grid gap-4">
        <h2 className="text-xl m-0">Сабақ барысы ({stages.length} кезең)</h2>
        {stages.map((stage) => (
          <article className="card grid gap-2.5" key={stage.id}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0">{stage.title}</h3>
              <span className="pill">{stage.duration} минут</span>
            </div>
            <p className="m-0 text-sm">
              <b>Мұғалім әрекеті:</b> {stage.teacherActivities}
            </p>
            <p className="m-0 text-sm">
              <b>Оқушы әрекеті:</b> {stage.studentActivities}
            </p>
            {(stage.assessment || stage.resources) && (
              <div className="flex flex-wrap gap-4 pt-2 border-t border-[var(--border)] text-xs muted">
                {stage.assessment && (
                  <span>
                    <b>Бағалау:</b> {stage.assessment}
                  </span>
                )}
                {stage.resources && (
                  <span>
                    <b>Ресурстар:</b> {stage.resources}
                  </span>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="no-print flex flex-wrap gap-2.5 pt-2">
        <form action={duplicateLessonAction.bind(null, id)}>
          <button type="submit" className="btn secondary">
            <Copy size={16} />
            Көшірме жасау
          </button>
        </form>
        <form action={deleteLessonAction.bind(null, id)}>
          <button type="submit" className="btn danger">
            <Trash2 size={16} />
            Жою
          </button>
        </form>
      </div>
    </div>
  );
}
