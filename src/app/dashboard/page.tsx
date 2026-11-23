import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  Gamepad2,
  Sparkles,
  Heart,
  Clock,
  ArrowRight,
} from "lucide-react";
import { requireTeacher } from "@/lib/auth";
import { db } from "@/db";
import {
  lessons,
  quizzes,
  quizAttempts,
  materials,
  materialFavorites,
  activityLogs,
} from "@/db/schema";
import { eq, count, avg, desc } from "drizzle-orm";
import { getLocale, getMessages } from "@/lib/i18n/server";

export default async function DashboardOverviewPage() {
  const [user, locale, m] = await Promise.all([
    requireTeacher(),
    getLocale(),
    getMessages(),
  ]);
  const isRu = locale === "ru";

  const [
    [lessonCount],
    [quizCount],
    [attemptCount],
    [avgScore],
    recentLessons,
    recentQuizzes,
    savedMaterials,
    recentAttempts,
    recentActivities,
  ] = await Promise.all([
    db.select({ v: count() }).from(lessons).where(eq(lessons.teacherId, user.id)),
    db.select({ v: count() }).from(quizzes).where(eq(quizzes.teacherId, user.id)),
    db
      .select({ v: count() })
      .from(quizAttempts)
      .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .where(eq(quizzes.teacherId, user.id)),
    db
      .select({ v: avg(quizAttempts.score) })
      .from(quizAttempts)
      .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .where(eq(quizzes.teacherId, user.id)),
    db
      .select()
      .from(lessons)
      .where(eq(lessons.teacherId, user.id))
      .orderBy(desc(lessons.updatedAt))
      .limit(4),
    db
      .select()
      .from(quizzes)
      .where(eq(quizzes.teacherId, user.id))
      .orderBy(desc(quizzes.updatedAt))
      .limit(4),
    db
      .select({
        id: materials.id,
        title: materials.title,
        category: materials.category,
        grade: materials.grade,
      })
      .from(materialFavorites)
      .innerJoin(materials, eq(materialFavorites.materialId, materials.id))
      .where(eq(materialFavorites.userId, user.id))
      .limit(4),
    db
      .select({
        id: quizAttempts.id,
        guest: quizAttempts.guestIdentifier,
        score: quizAttempts.score,
        maxScore: quizAttempts.maxScore,
        quizTitle: quizzes.title,
        submittedAt: quizAttempts.submittedAt,
      })
      .from(quizAttempts)
      .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .where(eq(quizzes.teacherId, user.id))
      .orderBy(desc(quizAttempts.submittedAt))
      .limit(5),
    db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, user.id))
      .orderBy(desc(activityLogs.createdAt))
      .limit(5),
  ]);

  const stats = [
    { value: lessonCount.v, label: m.dashboard.lessons, href: "/dashboard/lessons" },
    { value: quizCount.v, label: m.dashboard.quizzes, href: "/dashboard/quizzes" },
    { value: attemptCount.v, label: isRu ? "Попыток тестов" : "Тест әрекеті", href: "/dashboard/results" },
    {
      value: avgScore.v ? Math.round(Number(avgScore.v)) : 0,
      label: isRu ? "Средний балл" : "Орташа ұпай",
      href: "/dashboard/analytics",
    },
  ];

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">{m.dashboard.greeting}</div>
          <h1 className="text-3xl m-0">{user.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link className="btn" href="/dashboard/lessons/new">
            <BookOpen size={17} />
            {m.dashboard.newLesson}
          </Link>
          <Link className="btn secondary" href="/dashboard/quizzes/new">
            <ClipboardCheck size={17} />
            {m.dashboard.newQuiz}
          </Link>
          <Link className="btn secondary" href="/dashboard/assistant">
            <Sparkles size={17} />
            {m.dashboard.assistant}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}
      >
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card no-underline text-inherit grid gap-1 hover:border-[var(--primary)]"
          >
            <div className="stat">{s.value}</div>
            <span className="text-sm muted">{s.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Lessons & Quizzes */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        <section className="card grid gap-4 content-start">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg m-0">{m.dashboard.recentLessons}</h2>
            <Link
              href="/dashboard/lessons"
              className="text-xs font-semibold text-[var(--primary)] no-underline flex items-center gap-1"
            >
              {m.common.all} <ArrowRight size={14} />
            </Link>
          </div>
          {recentLessons.length ? (
            <div className="grid gap-2.5">
              {recentLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/dashboard/lessons/${lesson.id}`}
                  className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] no-underline text-inherit flex items-center justify-between gap-3 hover:border-[var(--primary)]"
                >
                  <div className="grid gap-0.5 min-w-0">
                    <span className="font-semibold text-sm truncate">{lesson.title}</span>
                    <span className="text-xs muted">
                      {lesson.grade}-{isRu ? "класс" : "сынып"} · {lesson.subject}
                    </span>
                  </div>
                  <span className="pill shrink-0">{lesson.duration} {isRu ? "мин" : "мин"}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted text-sm m-0">{m.common.empty}</p>
          )}
        </section>

        <section className="card grid gap-4 content-start">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg m-0">{m.dashboard.recentQuizzes}</h2>
            <Link
              href="/dashboard/quizzes"
              className="text-xs font-semibold text-[var(--primary)] no-underline flex items-center gap-1"
            >
              {m.common.all} <ArrowRight size={14} />
            </Link>
          </div>
          {recentQuizzes.length ? (
            <div className="grid gap-2.5">
              {recentQuizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/dashboard/quizzes/${quiz.id}`}
                  className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] no-underline text-inherit flex items-center justify-between gap-3 hover:border-[var(--primary)]"
                >
                  <div className="grid gap-0.5 min-w-0">
                    <span className="font-semibold text-sm truncate">{quiz.title}</span>
                    <span className="text-xs muted">
                      {quiz.grade}-{isRu ? "класс" : "сынып"} · {quiz.subject}
                    </span>
                  </div>
                  <span className={quiz.status === "PUBLISHED" ? "pill success shrink-0" : "pill shrink-0"}>
                    {quiz.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted text-sm m-0">{m.common.empty}</p>
          )}
        </section>
      </div>

      {/* Student Performance, Saved Materials & Activity */}
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        <section className="card grid gap-4 content-start">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg m-0">{m.dashboard.studentPerformance}</h2>
            <Link
              href="/dashboard/results"
              className="text-xs font-semibold text-[var(--primary)] no-underline"
            >
              {m.dashboard.results} →
            </Link>
          </div>
          {recentAttempts.length ? (
            <div className="grid gap-2">
              {recentAttempts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-2 py-2 border-b border-[var(--border)] last:border-b-0 text-sm"
                >
                  <div className="grid">
                    <span className="font-semibold">{a.guest || (isRu ? "Гость" : "Қонақ")}</span>
                    <span className="text-xs muted truncate max-w-[180px]">{a.quizTitle}</span>
                  </div>
                  <span className="pill success">
                    {a.score} / {a.maxScore}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted text-sm m-0">{m.common.empty}</p>
          )}
        </section>

        <section className="card grid gap-4 content-start">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg m-0 flex items-center gap-2">
              <Heart size={18} className="text-[var(--error)]" />
              {m.dashboard.savedMaterials}
            </h2>
            <Link
              href="/dashboard/materials"
              className="text-xs font-semibold text-[var(--primary)] no-underline"
            >
              {m.common.all} →
            </Link>
          </div>
          {savedMaterials.length ? (
            <div className="grid gap-2">
              {savedMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-sm"
                >
                  <div className="font-semibold">{mat.title}</div>
                  <div className="text-xs muted">{mat.category}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted text-sm m-0">{m.common.empty}</p>
          )}
        </section>

        <section className="card grid gap-4 content-start">
          <h2 className="text-lg m-0 flex items-center gap-2">
            <Clock size={18} className="text-[var(--primary)]" />
            {m.dashboard.recentActivity}
          </h2>
          {recentActivities.length ? (
            <div className="grid gap-2">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between gap-2 py-2 border-b border-[var(--border)] last:border-b-0 text-sm"
                >
                  <span className="font-medium">{act.action}</span>
                  <span className="text-xs muted">
                    {new Date(act.createdAt).toLocaleDateString(isRu ? "ru-RU" : "kk-KZ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-2">
              <p className="muted text-sm m-0">{m.common.empty}</p>
              <Link href="/games" className="btn secondary sm w-max">
                <Gamepad2 size={16} />
                {m.dashboard.openGames}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
