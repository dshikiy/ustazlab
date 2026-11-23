"use server";

import { db } from "@/db";
import {
  users,
  lessons,
  lessonStages,
  quizzes,
  quizQuestions,
  quizOptions,
  quizAttempts,
  quizAnswers,
  activityLogs,
  gameResults,
  accessibilityPreferences,
  learningProgress,
} from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession, getSession, requireTeacher } from "./auth";
import { checkRateLimit } from "./rate-limit";
import { gradeQuestion } from "./quiz-scoring";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

const authSchema = z.object({
  email: z.email().transform((x) => x.trim().toLowerCase()),
  password: z.string().min(8).max(128),
});

const lessonSchema = z.object({
  title: z.string().trim().min(3).max(160),
  grade: z.coerce.number().int().min(1).max(11),
  subject: z.string().trim().min(2).max(80),
  topic: z.string().trim().min(3).max(240),
  objectives: z.string().trim().min(10).max(4000),
  duration: z.coerce.number().int().min(10).max(240),
});

const stageInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  duration: z.coerce.number().int().min(1).max(180).default(10),
  teacherActivities: z.string().trim().max(2000).default(""),
  studentActivities: z.string().trim().max(2000).default(""),
  assessment: z.string().trim().max(500).default(""),
  resources: z.string().trim().max(500).default(""),
});

const questionInputSchema = z.object({
  text: z.string().trim().min(2).max(500),
  type: z.enum(["SINGLE", "MULTIPLE", "TRUE_FALSE", "SHORT"]).default("SINGLE"),
  points: z.coerce.number().int().min(1).max(20).default(1),
  explanation: z.string().trim().max(1000).default(""),
  options: z
    .array(
      z.object({
        text: z.string().trim().min(1).max(300),
        isCorrect: z.boolean(),
      })
    )
    .min(1),
});

async function logActivity(userId: string, action: string, metadata?: Record<string, unknown>) {
  try {
    await db.insert(activityLogs).values({ userId, action, metadata: metadata || {} });
  } catch {
    // non-blocking
  }
}

export async function registerAction(fd: FormData) {
  const emailRaw = String(fd.get("email") || "").trim().toLowerCase();
  const limit = checkRateLimit(`register:${emailRaw || "anon"}`, 8, 60_000);
  if (!limit.allowed) redirect("/register?error=rate_limit");

  const parsed = authSchema
    .extend({
      name: z.string().trim().min(2).max(120),
      passwordConfirm: z.string(),
    })
    .safeParse(Object.fromEntries(fd));

  if (!parsed.success || parsed.data.password !== parsed.data.passwordConfirm) {
    redirect("/register?error=invalid");
  }

  const { name, email, password } = parsed.data;
  const exists = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Never reveal whether the email already exists
  if (exists.length) {
    redirect("/register?error=invalid");
  }

  // Server always assigns TEACHER for public registration; never trust client-provided role
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "TEACHER",
    })
    .returning();

  await logActivity(user.id, "ACCOUNT_REGISTERED", { role: "TEACHER" });
  await createSession({ id: user.id, name: user.name, email: user.email, role: "TEACHER" });
  redirect("/dashboard");
}

export async function loginAction(fd: FormData) {
  const emailRaw = String(fd.get("email") || "").trim().toLowerCase();
  const limit = checkRateLimit(`login:${emailRaw || "anon"}`, 10, 60_000);
  if (!limit.allowed) redirect("/login?error=rate_limit");

  const parsed = authSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) redirect("/login?error=credentials");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  if (
    !user ||
    user.status !== "ACTIVE" ||
    !(await bcrypt.compare(parsed.data.password, user.passwordHash))
  ) {
    redirect("/login?error=credentials");
  }

  const role = user.role as "ADMIN" | "TEACHER" | "STUDENT";
  await createSession({ id: user.id, name: user.name, email: user.email, role });
  redirect(role === "ADMIN" ? "/admin" : role === "STUDENT" ? "/student" : "/dashboard");
}

export async function logoutAction() {
  (await cookies()).delete("ustaz_session");
  redirect("/");
}

function parseStagesFromForm(fd: FormData) {
  const rawJson = fd.get("stagesJson");
  if (typeof rawJson === "string" && rawJson.trim()) {
    try {
      const parsed = z.array(stageInputSchema).min(1).max(12).parse(JSON.parse(rawJson));
      return parsed;
    } catch {
      // fall through to default 3-stage parsing
    }
  }
  const names = ["Сабақтың басы", "Сабақтың ортасы", "Сабақтың соңы"];
  return names.map((title, index) => ({
    title,
    duration: [5, 25, 10][index],
    teacherActivities: String(
      fd.get(`teacher${index}`) || "Оқу мақсатын таныстырады және тапсырманы түсіндіреді."
    ),
    studentActivities: String(
      fd.get(`student${index}`) || "Тапсырманы орындайды, ой бөліседі."
    ),
    assessment: String(fd.get(`stageAssessment${index}`) || "Қалыптастырушы бағалау"),
    resources: String(fd.get(`stageResources${index}`) || "Оқу құралдары"),
  }));
}

export async function createLessonAction(fd: FormData) {
  const user = await requireTeacher();
  const parsed = lessonSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) redirect("/dashboard/lessons/new?error=invalid");

  const [lesson] = await db
    .insert(lessons)
    .values({
      ...parsed.data,
      teacherId: user.id,
      school: String(fd.get("school") || ""),
      lessonDate: String(fd.get("date") || ""),
      resources: String(fd.get("resources") || ""),
      assessment: String(fd.get("assessment") || ""),
    })
    .returning();

  const stages = parseStagesFromForm(fd);
  await db.insert(lessonStages).values(
    stages.map((stage, position) => ({
      lessonId: lesson.id,
      title: stage.title,
      duration: stage.duration,
      teacherActivities: stage.teacherActivities || "—",
      studentActivities: stage.studentActivities || "—",
      assessment: stage.assessment,
      resources: stage.resources,
      position,
    }))
  );

  await logActivity(user.id, "LESSON_CREATED", { lessonId: lesson.id, title: lesson.title });
  revalidatePath("/dashboard/lessons");
  revalidatePath("/dashboard");
  redirect(`/dashboard/lessons/${lesson.id}`);
}

export async function updateLessonAction(id: string, fd: FormData) {
  const user = await requireTeacher();
  const [existing] = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(and(eq(lessons.id, id), eq(lessons.teacherId, user.id)))
    .limit(1);

  if (!existing) redirect("/dashboard/lessons");

  const parsed = lessonSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) redirect(`/dashboard/lessons/${id}/edit?error=invalid`);

  await db
    .update(lessons)
    .set({
      ...parsed.data,
      school: String(fd.get("school") || ""),
      lessonDate: String(fd.get("date") || ""),
      resources: String(fd.get("resources") || ""),
      assessment: String(fd.get("assessment") || ""),
      updatedAt: new Date(),
    })
    .where(and(eq(lessons.id, id), eq(lessons.teacherId, user.id)));

  const stages = parseStagesFromForm(fd);
  await db.delete(lessonStages).where(eq(lessonStages.lessonId, id));
  await db.insert(lessonStages).values(
    stages.map((stage, position) => ({
      lessonId: id,
      title: stage.title,
      duration: stage.duration,
      teacherActivities: stage.teacherActivities || "—",
      studentActivities: stage.studentActivities || "—",
      assessment: stage.assessment,
      resources: stage.resources,
      position,
    }))
  );

  await logActivity(user.id, "LESSON_UPDATED", { lessonId: id, title: parsed.data.title });
  revalidatePath(`/dashboard/lessons/${id}`);
  revalidatePath("/dashboard/lessons");
  redirect(`/dashboard/lessons/${id}`);
}

export async function deleteLessonAction(id: string) {
  const user = await requireTeacher();
  await db
    .delete(lessons)
    .where(and(eq(lessons.id, id), eq(lessons.teacherId, user.id)));
  revalidatePath("/dashboard/lessons");
  revalidatePath("/dashboard");
  redirect("/dashboard/lessons");
}

export async function duplicateLessonAction(id: string) {
  const user = await requireTeacher();
  const [source] = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.id, id), eq(lessons.teacherId, user.id)))
    .limit(1);

  if (!source) redirect("/dashboard/lessons");

  const sourceStages = await db
    .select()
    .from(lessonStages)
    .where(eq(lessonStages.lessonId, id))
    .orderBy(asc(lessonStages.position));

  const [copy] = await db
    .insert(lessons)
    .values({
      teacherId: user.id,
      title: `${source.title} (көшірме)`,
      grade: source.grade,
      subject: source.subject,
      topic: source.topic,
      objectives: source.objectives,
      duration: source.duration,
      school: source.school,
      lessonDate: source.lessonDate,
      resources: source.resources,
      assessment: source.assessment,
    })
    .returning();

  if (sourceStages.length) {
    await db.insert(lessonStages).values(
      sourceStages.map((stage) => ({
        lessonId: copy.id,
        title: stage.title,
        duration: stage.duration,
        teacherActivities: stage.teacherActivities,
        studentActivities: stage.studentActivities,
        assessment: stage.assessment,
        resources: stage.resources,
        position: stage.position,
      }))
    );
  }

  revalidatePath("/dashboard/lessons");
  redirect(`/dashboard/lessons/${copy.id}`);
}

function parseQuestionsFromForm(fd: FormData) {
  const rawJson = fd.get("questionsJson");
  if (typeof rawJson === "string" && rawJson.trim()) {
    const parsed = z.array(questionInputSchema).min(1).max(30).safeParse(JSON.parse(rawJson));
    if (parsed.success) return parsed.data;
  }

  const list: z.infer<typeof questionInputSchema>[] = [];
  for (let index = 0; index < 20; index++) {
    const text = String(fd.get(`question${index}`) || "").trim();
    if (!text) continue;
    const type = (String(fd.get(`type${index}`) || "SINGLE") as "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "SHORT");
    const points = Math.max(1, Number(fd.get(`points${index}`) || 1));
    const explanation = String(fd.get(`explanation${index}`) || "");
    const rawOptions = String(fd.get(`options${index}`) || "")
      .split("|")
      .map((x) => x.trim())
      .filter(Boolean);
    const correctIdx = Number(fd.get(`correct${index}`) || 0);
    if (rawOptions.length) {
      list.push({
        text,
        type,
        points,
        explanation,
        options: rawOptions.map((opt, pos) => ({
          text: opt,
          isCorrect: type === "SHORT" ? true : pos === correctIdx,
        })),
      });
    }
  }
  return list;
}

export async function createQuizAction(fd: FormData) {
  const user = await requireTeacher();
  const title = z.string().trim().min(3).max(160).parse(fd.get("title"));
  const grade = z.coerce.number().int().min(1).max(11).parse(fd.get("grade"));
  const subject = z.string().trim().min(2).max(80).parse(fd.get("subject"));

  const [quiz] = await db
    .insert(quizzes)
    .values({
      teacherId: user.id,
      title,
      description: String(fd.get("description") || ""),
      grade,
      subject,
      status: fd.get("publish") === "yes" ? "PUBLISHED" : "DRAFT",
      timeLimit: Number(fd.get("timeLimit") || 0) || null,
    })
    .returning();

  const questions = parseQuestionsFromForm(fd);
  for (let index = 0; index < questions.length; index++) {
    const q = questions[index];
    const [question] = await db
      .insert(quizQuestions)
      .values({
        quizId: quiz.id,
        text: q.text,
        type: q.type,
        points: q.points,
        position: index,
        explanation: q.explanation,
      })
      .returning();

    if (q.options.length) {
      await db.insert(quizOptions).values(
        q.options.map((opt, position) => ({
          questionId: question.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          position,
        }))
      );
    }
  }

  await logActivity(user.id, "QUIZ_CREATED", { quizId: quiz.id, title: quiz.title });
  revalidatePath("/dashboard/quizzes");
  revalidatePath("/dashboard");
  redirect(`/dashboard/quizzes/${quiz.id}`);
}

export async function updateQuizAction(id: string, fd: FormData) {
  const user = await requireTeacher();
  const [existing] = await db
    .select({ id: quizzes.id })
    .from(quizzes)
    .where(and(eq(quizzes.id, id), eq(quizzes.teacherId, user.id)))
    .limit(1);

  if (!existing) redirect("/dashboard/quizzes");

  const title = z.string().trim().min(3).max(160).parse(fd.get("title"));
  const grade = z.coerce.number().int().min(1).max(11).parse(fd.get("grade"));
  const subject = z.string().trim().min(2).max(80).parse(fd.get("subject"));

  await db
    .update(quizzes)
    .set({
      title,
      description: String(fd.get("description") || ""),
      grade,
      subject,
      status: fd.get("publish") === "yes" ? "PUBLISHED" : "DRAFT",
      timeLimit: Number(fd.get("timeLimit") || 0) || null,
      updatedAt: new Date(),
    })
    .where(and(eq(quizzes.id, id), eq(quizzes.teacherId, user.id)));

  const questions = parseQuestionsFromForm(fd);
  await db.delete(quizQuestions).where(eq(quizQuestions.quizId, id));

  for (let index = 0; index < questions.length; index++) {
    const q = questions[index];
    const [question] = await db
      .insert(quizQuestions)
      .values({
        quizId: id,
        text: q.text,
        type: q.type,
        points: q.points,
        position: index,
        explanation: q.explanation,
      })
      .returning();

    if (q.options.length) {
      await db.insert(quizOptions).values(
        q.options.map((opt, position) => ({
          questionId: question.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          position,
        }))
      );
    }
  }

  await logActivity(user.id, "QUIZ_UPDATED", { quizId: id, title });
  revalidatePath(`/dashboard/quizzes/${id}`);
  revalidatePath("/dashboard/quizzes");
  redirect(`/dashboard/quizzes/${id}`);
}

export async function toggleQuizPublishAction(id: string) {
  const user = await requireTeacher();
  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.id, id), eq(quizzes.teacherId, user.id)))
    .limit(1);

  if (!quiz) redirect("/dashboard/quizzes");

  const nextStatus = quiz.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  await db
    .update(quizzes)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(and(eq(quizzes.id, id), eq(quizzes.teacherId, user.id)));

  revalidatePath(`/dashboard/quizzes/${id}`);
  revalidatePath("/dashboard/quizzes");
}

export async function deleteQuizAction(id: string) {
  const user = await requireTeacher();
  await db
    .delete(quizzes)
    .where(and(eq(quizzes.id, id), eq(quizzes.teacherId, user.id)));
  revalidatePath("/dashboard/quizzes");
  revalidatePath("/dashboard");
  redirect("/dashboard/quizzes");
}

export async function duplicateQuizAction(id: string) {
  const user = await requireTeacher();
  const [source] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.id, id), eq(quizzes.teacherId, user.id)))
    .limit(1);

  if (!source) redirect("/dashboard/quizzes");

  const [copy] = await db
    .insert(quizzes)
    .values({
      teacherId: user.id,
      title: `${source.title} (көшірме)`,
      description: source.description,
      grade: source.grade,
      subject: source.subject,
      status: "DRAFT",
      timeLimit: source.timeLimit,
    })
    .returning();

  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, id))
    .orderBy(asc(quizQuestions.position));

  for (const q of questions) {
    const [newQuestion] = await db
      .insert(quizQuestions)
      .values({
        quizId: copy.id,
        text: q.text,
        type: q.type,
        points: q.points,
        explanation: q.explanation,
        position: q.position,
      })
      .returning();

    const options = await db
      .select()
      .from(quizOptions)
      .where(eq(quizOptions.questionId, q.id))
      .orderBy(asc(quizOptions.position));

    if (options.length) {
      await db.insert(quizOptions).values(
        options.map((o) => ({
          questionId: newQuestion.id,
          text: o.text,
          isCorrect: o.isCorrect,
          position: o.position,
        }))
      );
    }
  }

  revalidatePath("/dashboard/quizzes");
  redirect(`/dashboard/quizzes/${copy.id}`);
}

export async function submitQuizAction(quizId: string, fd: FormData) {
  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1);

  if (!quiz || quiz.status !== "PUBLISHED") redirect("/games");

  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.position));

  let score = 0;
  const summary: Record<string, { selected: string[]; correct: boolean }> = {};
  const answerRows: {
    questionId: string;
    answer: string[];
    isCorrect: boolean;
    points: number;
  }[] = [];

  for (const question of questions) {
    const correctOptions = await db
      .select()
      .from(quizOptions)
      .where(
        and(eq(quizOptions.questionId, question.id), eq(quizOptions.isCorrect, true))
      );

    const selected = fd.getAll(question.id).map(String);
    const isCorrect = gradeQuestion({
      type: question.type,
      selected,
      correctOptionIds: correctOptions.map((o) => o.id),
      correctOptionTexts: correctOptions.map((o) => o.text),
    });

    const earned = isCorrect ? question.points : 0;
    score += earned;
    summary[question.id] = { selected, correct: isCorrect };
    answerRows.push({
      questionId: question.id,
      answer: selected,
      isCorrect,
      points: earned,
    });
  }

  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
  const [attempt] = await db
    .insert(quizAttempts)
    .values({
      quizId,
      guestIdentifier: String(fd.get("nickname") || "Қонақ").slice(0, 40),
      score,
      maxScore,
      answerSummary: summary,
    })
    .returning();

  if (answerRows.length) {
    await db.insert(quizAnswers).values(
      answerRows.map((row) => ({
        attemptId: attempt.id,
        questionId: row.questionId,
        answer: row.answer,
        isCorrect: row.isCorrect,
        points: row.points,
      }))
    );
  }

  redirect(`/play/${quizId}/result?attempt=${attempt.id}`);
}

export async function saveGameResultAction(payload: {
  gameType: string;
  score: number;
  maxScore: number;
  duration: number;
}) {
  const session = await getSession();
  const maxScore = Math.max(1, Math.round(payload.maxScore));
  const score = Math.max(0, Math.min(maxScore, Math.round(payload.score)));
  const accuracy = Math.round((score / maxScore) * 100);

  await db.insert(gameResults).values({
    gameType: payload.gameType.slice(0, 40),
    userId: session?.id ?? null,
    guestIdentifier: session ? null : "guest",
    score,
    maxScore,
    accuracy,
    duration: Math.max(1, Math.round(payload.duration)),
  });

  if (session) {
    await db
      .insert(learningProgress)
      .values({
        userId: session.id,
        contentType: "GAME",
        contentId: payload.gameType.slice(0, 40),
        progress: accuracy,
        completed: accuracy >= 70,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          learningProgress.userId,
          learningProgress.contentType,
          learningProgress.contentId,
        ],
        set: {
          progress: accuracy,
          completed: accuracy >= 70,
          updatedAt: new Date(),
        },
      });
  }

  return { ok: true };
}

export async function saveAccessibilityPrefsAction(payload: {
  scale: number;
  contrast: boolean;
  reduced: boolean;
  textToSpeech?: boolean;
}) {
  const session = await getSession();
  if (!session) return { ok: false };

  await db
    .insert(accessibilityPreferences)
    .values({
      userId: session.id,
      fontScale: Math.max(-1, Math.min(3, payload.scale)),
      highContrast: !!payload.contrast,
      reducedMotion: !!payload.reduced,
      textToSpeech: !!payload.textToSpeech,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: accessibilityPreferences.userId,
      set: {
        fontScale: Math.max(-1, Math.min(3, payload.scale)),
        highContrast: !!payload.contrast,
        reducedMotion: !!payload.reduced,
        textToSpeech: !!payload.textToSpeech,
        updatedAt: new Date(),
      },
    });

  return { ok: true };
}

export async function saveLearningProgressAction(payload: {
  contentType: string;
  contentId: string;
  progress: number;
  completed: boolean;
}) {
  const session = await getSession();
  if (!session) return { ok: false };

  await db
    .insert(learningProgress)
    .values({
      userId: session.id,
      contentType: payload.contentType.slice(0, 40),
      contentId: payload.contentId.slice(0, 80),
      progress: Math.max(0, Math.min(100, Math.round(payload.progress))),
      completed: !!payload.completed,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        learningProgress.userId,
        learningProgress.contentType,
        learningProgress.contentId,
      ],
      set: {
        progress: Math.max(0, Math.min(100, Math.round(payload.progress))),
        completed: !!payload.completed,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/inclusive/progress");
  revalidatePath("/student/progress");
  return { ok: true };
}

export async function recentLessons() {
  const session = await getSession();
  if (!session || session.role === "STUDENT") return [];
  return db
    .select()
    .from(lessons)
    .where(eq(lessons.teacherId, session.id))
    .orderBy(desc(lessons.updatedAt));
}
