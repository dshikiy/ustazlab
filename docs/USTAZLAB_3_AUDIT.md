# UstazLab 3.0 — Complete Repository Audit

**Audit date:** 2026-11-23  
**Branch:** `feature/ustazlab-3-complete`  
**Framework:** Next.js 16.0.3 (App Router) · React 19.2 · TypeScript 5.9 · Tailwind CSS v4 · Drizzle ORM + Neon PostgreSQL

---

## 1. Current Architecture

- **Frontend / App Router (`src/app`)**: Server Components by default, Client Components for interactive forms, games, charts, and accessibility tools.
- **Database (`src/db/schema.ts`, `src/db/index.ts`)**: Neon PostgreSQL via `@neondatabase/serverless` and Drizzle ORM. Contains 23 relational tables covering users, teacher/student profiles, lessons/stages, quizzes/questions/options/attempts/answers, games, materials/favorites, classes/memberships/assignments/submissions, inclusive activities, accessibility preferences, learning progress, achievements, activity logs, and platform settings.
- **Auth (`src/lib/auth.ts`, `src/lib/actions.ts`)**: Signed HS256 JWT in `httpOnly`, `sameSite: "lax"` cookie (`ustaz_session`) with bcrypt (12 rounds) password hashing and DB re-verification of user `status === "ACTIVE"`.
- **Localization (`src/lib/i18n/*`)**: Kazakh (`kk`, default) and Russian (`ru`) cookie-based SSR localization.
- **Exports (`src/app/api/lessons/[id]/pdf`, `docx`)**: Authenticated owner-checked PDF (`pdf-lib`) and DOCX (`docx`) generators.
- **AI (`src/lib/ai/provider.ts`, `src/app/api/ai/route.ts`)**: Server-only OpenAI-compatible provider abstraction with Zod validation, rate limiting, timeout handling, and clean `503` unconfigured behavior.

---

## 2. Problems Discovered & Severity

| # | Area | Finding | Severity | File Reference |
|---|------|---------|----------|----------------|
| 1 | Auth / Security | Public registration must not trust client-supplied `role` values; student onboarding should use class join codes instead of self-selecting arbitrary roles. | High | `src/lib/actions.ts`, `src/components/auth-form.tsx` |
| 2 | Auth / Account | Missing password change and account deletion workflows in settings/profile. | Medium | `src/app/dashboard/settings/page.tsx` |
| 3 | Classroom / Student | `classes`, `class_memberships`, `assignments`, `assignment_submissions` tables exist in DB schema, but teacher UI routes (`/dashboard/classes`, `/dashboard/assignments`) and student join-class flow are missing. | High | `src/db/schema.ts`, `src/app/dashboard/`, `src/app/student/` |
| 4 | Lesson & Quiz Builders | Edit pages (`/dashboard/lessons/[id]/edit`, `/dashboard/quizzes/[id]/edit`) and quiz publish toggle / copy share link were missing. | High | `src/app/dashboard/lessons/`, `src/app/dashboard/quizzes/` |
| 5 | Inclusive Module | `UstazLab_inclusive-1.html` is not present in the repository workspace. Existing `/inclusive/*` routes are minimal 1-line stubs without interactive 4-question quiz, categorized AAC cards, or `/inclusive/games`, `/inclusive/quizzes`, `/inclusive/settings` routes. | High | `src/app/inclusive/*` |
| 6 | Games Engine | Games lacked instructions screen, keyboard shortcuts, DB result persistence, and Memory/Matching game types. | Medium | `src/features/games/*` |
| 7 | SEO / Ops | `robots.ts` should disallow private routes (`/dashboard`, `/student`, `/admin`, `/api`); no `/api/health` endpoint exists. | Medium | `src/app/robots.ts` |
| 8 | Testing | Only 3 unit tests exist (`tests/scoring.test.ts`). Missing tests for rate limiting, quiz scoring variants, AI schema validation, i18n parity, and UI primitives. | High | `tests/` |
| 9 | Code Quality | Legacy files across `src/app/` and `src/components/` were minified onto single lines with hardcoded Kazakh strings. | Medium | `src/app/student/*`, `src/app/inclusive/*`, `src/components/materials-tabs.tsx` |

---

## 3. Implementation Priorities

1. **P0 — Security & Core Workflows**: Enforce server-side `TEACHER` role on public registration, add student class-join workflow, add lesson/quiz edit & publish routes, add classroom & assignment management.
2. **P0 — Design System 3.0 & Public Website**: Complete missing UI primitives (`Accordion`, `Switch`, `Avatar`, `ConfirmationDialog`, `ErrorState`, `IconButton`), wire interactive FAQ accordion on homepage.
3. **P1 — Games, Inclusive Module & Student Portal**: Build reusable game engine with keyboard + DB persistence + Memory & Matching games; build complete `/inclusive/*` routes (noting missing HTML reference honestly); upgrade `/student/*` portal.
4. **P1 — Materials, AI, SEO & Health**: Upgrade Materials library with preview modal & filters, polish AI assistant, add `/api/health`, update `robots.ts`.
5. **P1 — Testing, Verification & Documentation**: Expand Vitest suite, run `lint`, `test`, `build`, Playwright checks/screenshots, and complete `docs/*`.
