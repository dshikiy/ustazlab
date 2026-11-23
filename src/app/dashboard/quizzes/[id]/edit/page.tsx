import { notFound } from "next/navigation";
import { db } from "@/db";
import { quizzes, quizQuestions, quizOptions } from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { requireTeacher } from "@/lib/auth";
import { QuizForm } from "@/components/quiz-form";
import { Breadcrumbs } from "@/components/ui/navigation";

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, requireTeacher()]);

  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.id, id), eq(quizzes.teacherId, user.id)));

  if (!quiz) notFound();

  const questionRows = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, id))
    .orderBy(asc(quizQuestions.position));

  const questionsWithOptions = await Promise.all(
    questionRows.map(async (q) => {
      const opts = await db
        .select()
        .from(quizOptions)
        .where(eq(quizOptions.questionId, q.id))
        .orderBy(asc(quizOptions.position));
      return {
        key: q.id,
        text: q.text,
        type: q.type as "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "SHORT",
        points: q.points,
        explanation: q.explanation || "",
        options: opts.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
      };
    })
  );

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        items={[
          { label: "Басты бет", href: "/dashboard" },
          { label: "Тесттер", href: "/dashboard/quizzes" },
          { label: quiz.title, href: `/dashboard/quizzes/${id}` },
          { label: "Өңдеу" },
        ]}
      />
      <QuizForm
        initial={{
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          grade: quiz.grade,
          subject: quiz.subject,
          status: quiz.status,
          timeLimit: quiz.timeLimit,
          questions: questionsWithOptions,
        }}
      />
    </div>
  );
}

