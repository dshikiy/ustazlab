"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import {
  users,
  teacherProfiles,
  classes,
  classMemberships,
  assignments,
  assignmentSubmissions,
  activityLogs,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireUser, requireTeacher, requireStudent } from "./auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const classSchema = z.object({
  name: z.string().trim().min(2).max(80),
  grade: z.coerce.number().int().min(1).max(11),
});

const assignmentSchema = z.object({
  classId: z.string().uuid(),
  title: z.string().trim().min(3).max(160),
  lessonId: z.string().uuid().optional().or(z.literal("")),
  quizId: z.string().uuid().optional().or(z.literal("")),
  dueAt: z.string().optional(),
});

function generateJoinCode(): string {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

export async function createClassAction(fd: FormData) {
  const teacher = await requireTeacher();
  const parsed = classSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) redirect("/dashboard/classes?error=invalid");

  const joinCode = generateJoinCode();
  const [created] = await db
    .insert(classes)
    .values({
      teacherId: teacher.id,
      name: parsed.data.name,
      grade: parsed.data.grade,
      joinCode,
    })
    .returning();

  await db.insert(activityLogs).values({
    userId: teacher.id,
    action: "CLASS_CREATED",
    metadata: { classId: created.id, name: created.name },
  });

  revalidatePath("/dashboard/classes");
  redirect("/dashboard/classes");
}

export async function deleteClassAction(classId: string) {
  const teacher = await requireTeacher();
  await db
    .delete(classes)
    .where(and(eq(classes.id, classId), eq(classes.teacherId, teacher.id)));
  revalidatePath("/dashboard/classes");
}

export async function createAssignmentAction(fd: FormData) {
  const teacher = await requireTeacher();
  const parsed = assignmentSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) redirect("/dashboard/assignments?error=invalid");

  const [ownedClass] = await db
    .select({ id: classes.id })
    .from(classes)
    .where(and(eq(classes.id, parsed.data.classId), eq(classes.teacherId, teacher.id)))
    .limit(1);

  if (!ownedClass) redirect("/dashboard/assignments?error=forbidden");

  const dueAt = parsed.data.dueAt ? new Date(parsed.data.dueAt) : null;
  await db.insert(assignments).values({
    classId: ownedClass.id,
    teacherId: teacher.id,
    title: parsed.data.title,
    lessonId: parsed.data.lessonId || null,
    quizId: parsed.data.quizId || null,
    dueAt: dueAt && !Number.isNaN(dueAt.getTime()) ? dueAt : null,
  });

  await db.insert(activityLogs).values({
    userId: teacher.id,
    action: "ASSIGNMENT_CREATED",
    metadata: { classId: ownedClass.id, title: parsed.data.title },
  });

  revalidatePath("/dashboard/assignments");
  redirect("/dashboard/assignments");
}

export async function deleteAssignmentAction(assignmentId: string) {
  const teacher = await requireTeacher();
  await db
    .delete(assignments)
    .where(and(eq(assignments.id, assignmentId), eq(assignments.teacherId, teacher.id)));
  revalidatePath("/dashboard/assignments");
}

export async function joinClassAction(fd: FormData) {
  const student = await requireStudent();
  const code = String(fd.get("joinCode") || "").trim().toUpperCase();
  if (code.length < 4 || code.length > 12) {
    redirect("/student/assignments?error=invalid_code");
  }

  const [classroom] = await db
    .select({ id: classes.id })
    .from(classes)
    .where(eq(classes.joinCode, code))
    .limit(1);

  if (!classroom) {
    redirect("/student/assignments?error=not_found");
  }

  await db
    .insert(classMemberships)
    .values({ classId: classroom.id, studentId: student.id })
    .onConflictDoNothing();

  revalidatePath("/student/assignments");
  revalidatePath("/student");
  redirect("/student/assignments?joined=1");
}

export async function completeAssignmentAction(assignmentId: string) {
  const student = await requireStudent();
  const [assignment] = await db
    .select({ id: assignments.id, classId: assignments.classId })
    .from(assignments)
    .where(eq(assignments.id, assignmentId))
    .limit(1);

  if (!assignment) redirect("/student/assignments");

  const [membership] = await db
    .select({ id: classMemberships.id })
    .from(classMemberships)
    .where(
      and(
        eq(classMemberships.classId, assignment.classId),
        eq(classMemberships.studentId, student.id)
      )
    )
    .limit(1);

  if (!membership) redirect("/student/assignments");

  await db
    .insert(assignmentSubmissions)
    .values({
      assignmentId: assignment.id,
      studentId: student.id,
      status: "SUBMITTED",
      score: 100,
      submittedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [assignmentSubmissions.assignmentId, assignmentSubmissions.studentId],
      set: { status: "SUBMITTED", submittedAt: new Date() },
    });

  revalidatePath("/student/assignments");
  revalidatePath("/student");
}

export async function updateProfileAction(fd: FormData) {
  const user = await requireUser();
  const name = z.string().trim().min(2).max(120).safeParse(fd.get("name"));
  if (!name.success) redirect("/dashboard/profile?error=invalid");

  await db
    .update(users)
    .set({ name: name.data, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  const school = String(fd.get("school") || "").trim().slice(0, 160);
  const bio = String(fd.get("bio") || "").trim().slice(0, 500);

  await db
    .insert(teacherProfiles)
    .values({ userId: user.id, school, bio })
    .onConflictDoUpdate({
      target: teacherProfiles.userId,
      set: { school, bio },
    });

  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?saved=1");
}

export async function changePasswordAction(fd: FormData) {
  const user = await requireUser();
  const currentPassword = String(fd.get("currentPassword") || "");
  const newPassword = String(fd.get("newPassword") || "");
  const confirmPassword = String(fd.get("confirmPassword") || "");

  if (newPassword.length < 8 || newPassword !== confirmPassword) {
    redirect("/dashboard/settings?error=password");
  }

  const [record] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!record || !(await bcrypt.compare(currentPassword, record.passwordHash))) {
    redirect("/dashboard/settings?error=current_password");
  }

  await db
    .update(users)
    .set({ passwordHash: await bcrypt.hash(newPassword, 12), updatedAt: new Date() })
    .where(eq(users.id, user.id));

  await db.insert(activityLogs).values({
    userId: user.id,
    action: "PASSWORD_CHANGED",
    metadata: {},
  });

  redirect("/dashboard/settings?saved=password");
}

export async function deleteAccountAction(fd: FormData) {
  const user = await requireUser();
  const confirmation = String(fd.get("confirmEmail") || "").trim().toLowerCase();
  if (confirmation !== user.email.toLowerCase()) {
    redirect("/dashboard/settings?error=confirm_delete");
  }

  await db.delete(users).where(eq(users.id, user.id));
  (await cookies()).delete("ustaz_session");
  redirect("/");
}

