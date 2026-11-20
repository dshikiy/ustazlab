import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import { db } from "@/db";
import { lessons, lessonStages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
  if (!lesson || lesson.teacherId !== session.id) return new Response("Not found", { status: 404 });
  const stages = await db.select().from(lessonStages).where(eq(lessonStages.lessonId, id)).orderBy(asc(lessonStages.position));
  const doc = new Document({ sections: [{ children: [new Paragraph({ text: lesson.title, heading: HeadingLevel.TITLE }), new Paragraph(`${lesson.grade}-сынып · ${lesson.subject}`), new Paragraph(`Тақырып: ${lesson.topic}`), new Paragraph(`Мақсаттар: ${lesson.objectives}`), ...stages.flatMap(stage => [new Paragraph({ text: stage.title, heading: HeadingLevel.HEADING_1 }), new Paragraph(`Мұғалім әрекеті: ${stage.teacherActivities}`), new Paragraph(`Оқушы әрекеті: ${stage.studentActivities}`)])] }] });
  const bytes = await Packer.toBuffer(doc);
  return new Response(new Uint8Array(bytes), { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Content-Disposition": `attachment; filename="lesson-${id}.docx"` } });
}
