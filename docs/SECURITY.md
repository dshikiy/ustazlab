# UstazLab 3.0 — Security Architecture

## Authentication & Sessions (`src/lib/auth.ts`)
- Passwords hashed with `bcryptjs` (cost factor 12).
- Signed HS256 JWT stored in an `httpOnly`, `sameSite: "lax"`, `secure` (in production) cookie (`ustaz_session`).
- Fails closed in production if `AUTH_SECRET` is missing or shorter than 32 characters.
- `getSession()` re-queries PostgreSQL to verify the user still exists and has `status === "ACTIVE"`.
- Public registration (`registerAction`) always assigns `role = "TEACHER"` server-side; client-provided role fields are never trusted.
- Non-enumeration: Registration returns a generic error if an email already exists; login returns a generic credential error.

## Rate Limiting (`src/lib/rate-limit.ts`)
- Login (`10/min` per email), registration (`8/min` per email), and AI API (`10/min` per user) are rate-limited.

## Authorization & Ownership
- Server-side guards: `requireUser()`, `requireTeacher()`, `requireStudent()`, `requireAdmin()`.
- Lessons, quizzes, classes, assignments, and PDF/DOCX exports verify `teacherId === session.id` on every read/write/delete.
- Quiz play routes never select `isCorrect` fields; scoring runs strictly on the server in `submitQuizAction`.

## Secrets & AI
- AI credentials (`AI_API_URL`, `AI_API_KEY`, `AI_MODEL`) are read exclusively on the server (`src/lib/ai/provider.ts`). Never exposed to client bundles.
