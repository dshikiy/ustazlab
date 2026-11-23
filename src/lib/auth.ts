import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface Session {
  id: string;
  name: string;
  email: string;
  role: Role;
}

function getSigningKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET is required in production");
    }
    return new TextEncoder().encode("development-only-secret-change-me-32chars");
  }
  if (secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(user: Session) {
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSigningKey());

  (await cookies()).set("ustaz_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get("ustaz_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSigningKey());
    const userId = typeof payload.id === "string" ? payload.id : null;
    if (!userId) return null;

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || user.status !== "ACTIVE") return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
    };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireTeacher(): Promise<Session> {
  const session = await requireUser();
  if (session.role !== "TEACHER" && session.role !== "ADMIN") {
    redirect("/student");
  }
  return session;
}

export async function requireStudent(): Promise<Session> {
  const session = await requireUser();
  if (session.role !== "STUDENT") {
    redirect("/dashboard");
  }
  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireUser();
  if (session.role !== "ADMIN") {
    redirect(session.role === "STUDENT" ? "/student" : "/dashboard");
  }
  return session;
}
