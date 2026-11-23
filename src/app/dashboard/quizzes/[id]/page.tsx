import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { quizzes, quizQuestions, quizAttempts } from "@/db/schema";
import { eq, count, avg, and, asc } from "drizzle-orm";
import { requireTeacher } from "@/lib/auth";
import {
  deleteQuizAction,
  duplicateQuizAction,
  toggleQuizPublishAction,
} from "@/lib/actions";
import { CopyLinkButton } from "@/components/copy-link-button";
import { Breadcrumbs } from "@/components/ui/navigation";
import { Pencil, Eye, Copy, Trash2, Globe, Lock } from "lucide-react";

export default async function QuizDetailPage({
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

  const [questions, [stats]] = await Promise.all([
    db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, id))
      .orderBy(asc(quizQuestions.position)),
    db
      .select({ attempts: count(), average: avg(quizAttempts.score) })
      .from(quizAttempts)
      .where(eq(quizAttempts.quizId, id)),
  ]);

  const isPublished = quiz.status === "PUBLISHED";

  return (
    <div className="grid gap-6">
      <Breadcrumbs
        items={[
          { label: "Басты бет", href: "/dashboard" },
          { label: "Тесттер", href: "/dashboard/quizzes" },
          { label: quiz.title },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <span className={isPublished ? "pill success" : "pill"}>
              {quiz.status}
            </span>
            <span className="text-sm muted">
              {quiz.grade}-сынып · {quiz.subject}
            </span>
          </div>
          <h1 className="text-3xl m-0">{quiz.title}</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link className="btn" href={`/dashboard/quizzes/${id}/edit`}>
            <Pencil size={16} />
            Өңдеу
          </Link>
          <form action={toggleQuizPublishAction.bind(null, id)}>
            <button type="submit" className="btn secondary">
              {isPublished ? <Lock size={16} /> : <Globe size={16} />}
              {isPublished ? "Жобаға қайтару" : "Жариялау"}
            </button>
          </form>
        </div>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
      >
        <div className="card">
          <div className="stat">{questions.length}</div>
          <span className="muted text-sm">Сұрақ</span>
        </div>
        <div className="card">
          <div className="stat">{stats.attempts}</div>
          <span className="muted text-sm">Оқушы әрекеті</span>
        </div>
        <div className="card">
          <div className="stat">{Math.round(Number(stats.average || 0))}</div>
          <span className="muted text-sm">Орташа ұпай</span>
        </div>
      </div>

      <div className="card grid gap-3">
        {quiz.description && <p className="m-0">{quiz.description}</p>}
        {isPublished ? (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
            <div className="grid gap-0.5">
              <span className="text-xs muted font-semibold">
                Оқушыға арналған қауіпсіз сілтеме
              </span>
              <Link
                href={`/play/${quiz.id}`}
                className="text-sm font-semibold text-[var(--primary)] no-underline"
              >
                /play/{quiz.id}
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyLinkButton path={`/play/${quiz.id}`} />
              <Link className="btn sm" href={`/play/${quiz.id}`}>
                <Eye size={16} />
                Алдын ала көру
              </Link>
            </div>
          </div>
        ) : (
          <p className="muted text-sm m-0">
            Тест әлі жарияланбаған. Оқушыларға сілтеме ашу үшін «Жариялау» батырмасын басыңыз.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <form action={duplicateQuizAction.bind(null, id)}>
          <button type="submit" className="btn secondary">
            <Copy size={16} />
            Көшірме жасау
          </button>
        </form>
        <form action={deleteQuizAction.bind(null, id)}>
          <button type="submit" className="btn danger">
            <Trash2 size={16} />
            Жою
          </button>
        </form>
      </div>
    </div>
  );
}
