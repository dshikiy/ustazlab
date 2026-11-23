import { notFound } from "next/navigation";
import { db } from "@/db";
import { lessons, lessonStages } from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { requireTeacher } from "@/lib/auth";
import { LessonForm } from "@/components/lesson-form";
import { Breadcrumbs } from "@/components/ui/navigation";

export default async function EditLessonPage({
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
          { label: lesson.title, href: `/dashboard/lessons/${id}` },
          { label: "Өңдеу" },
        ]}
      />
      <LessonForm
        teacher={user.name}
        initial={{
          id: lesson.id,
          title: lesson.title,
          grade: lesson.grade,
          subject: lesson.subject,
          topic: lesson.topic,
          objectives: lesson.objectives,
          duration: lesson.duration,
          school: lesson.school,
          lessonDate: lesson.lessonDate,
          resources: lesson.resources,
          assessment: lesson.assessment,
          stages: stages.map((s) => ({
            id: s.id,
            title: s.title,
            duration: s.duration,
            teacherActivities: s.teacherActivities,
            studentActivities: s.studentActivities,
            assessment: s.assessment || "",
            resources: s.resources || "",
          })),
        }}
      />
    </div>
  );
}
