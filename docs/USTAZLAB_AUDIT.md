# UstazLab 2.0 — repository audit

Audit date: 2026-11-23. Branch: `feat/ustazlab-2-platform`.

## Current architecture

- Next.js 16 App Router with React 19 and strict TypeScript (`src/app`, `tsconfig.json`).
- Neon PostgreSQL through Drizzle's Neon HTTP adapter (`src/db/index.ts`).
- Credential authentication uses bcrypt and signed, HTTP-only, same-site JWT cookies (`src/lib/auth.ts`, `src/lib/actions.ts`).
- Production is connected to Vercel and GitHub; `.env.local` and `.vercel` are ignored.
- Kazakh is the default locale. An SSR cookie switcher and partial Russian dictionary exist under `src/lib/i18n`.

## Route inventory

Public routes: `/`, `/about`, `/materials`, `/games` and four game routes, `/login`, `/register`, `/play/[quizId]`, and quiz results.

Teacher routes: dashboard overview, lessons list/create/detail, quizzes list/create/detail, materials, results, analytics, profile, and settings.

Admin routes: `/admin` and the generic `/admin/[section]` management page.

API routes: authenticated PDF and DOCX lesson export.

Missing from the requested 2.0 information architecture: inclusive module routes, student workspace, lesson edit route, quiz edit/preview routes, and an optional AI route.

## Working functionality verified from code

- Every dashboard route is protected before child rendering by `src/app/dashboard/layout.tsx` → `DashboardShell` → `requireUser()`.
- Admin layouts and admin mutations call `requireAdmin()` (`src/app/admin/layout.tsx`, `src/lib/admin-actions.ts`).
- Lesson reads, deletes, PDF exports, and DOCX exports compare the authenticated user with `teacherId`.
- Quiz submissions calculate scores on the server and do not select correct-option fields on the guest play page.
- Lesson creation, quiz creation, guest attempts, materials, analytics, theme preferences, locale preferences, and accessibility preferences persist.
- Four games are playable. Recycling supports pointer/keyboard drag-and-drop plus tap selection.
- `npm run lint`, `npm test`, and `npm run build` passed before this audit.

## Security findings

1. `src/lib/auth.ts` falls back to a known development secret when `AUTH_SECRET` is missing. Production should fail closed instead.
2. JWT role/status is trusted for seven days without re-reading the user record. A disabled account can retain an existing session until expiry.
3. Login and registration have no rate limiter.
4. Registration reveals whether an email already exists (`?error=exists`). This is acceptable for low-risk onboarding only if explicitly chosen, but conflicts with the 2.0 non-enumeration requirement.
5. Lesson exports correctly enforce ownership. Quiz edit/delete actions do not exist yet, so their ownership checks are also missing.
6. Admin user toggling prevents self-disable but does not yet prevent disabling the final active admin.
7. No file upload endpoint exists, so there is currently no upload attack surface.

## Data-model findings

Existing relational tables cover users, teacher profiles, lessons/stages, quizzes/questions/options/attempts/answers, game content/results, materials/favorites, activity logs, and settings (`src/db/schema.ts`).

Missing requested entities: student profiles, classes, memberships, assignments, submissions, inclusive activities, per-user accessibility preferences, learning progress, and achievements.

`game_content.content` is flexible JSON. This avoids migrations but does not enforce a bilingual content contract. Materials are DB-backed, while communication cards currently live in a client constant.

## UX and accessibility findings

- The global accessibility toolbar provides font scaling, high contrast, reduced motion, and browser text-to-speech (`src/components/accessibility-bar.tsx`).
- Focus styling and minimum button heights are present in `src/app/globals.css`.
- The dashboard sidebar is hidden on mobile and replaced by a drawer.
- Several pages and forms remain compressed into one-line components, which hurts maintainability.
- Admin tables are not responsive at 320–390 px.
- Many dashboard, game, admin, validation, and accessibility strings remain hardcoded in Kazakh, so Russian parity is incomplete.
- The visual system is mostly global CSS rather than typed reusable primitives; Button/Card/Badge/EmptyState/DataTable abstractions are incomplete.

## Feature completeness findings

- Lessons: create/detail/export/print/delete work. Edit, duplicate, arbitrary stage add/delete/reorder, and explicit draft status are missing.
- Quizzes: create/detail/publish-at-create/play/results work. Edit, delete, duplicate, preview, dynamic question count, multiple choice, true/false, and short answer are missing.
- Materials: DB listing and communication-card tabs work. Search/filter/favorite mutations and real preview are incomplete.
- Games: core loops work, but DB-admin changes are not consumed consistently by every live game.
- Analytics uses real quiz-attempt aggregates and Recharts.
- Admin has basic create/delete for materials and game content and status toggling for users. Edit dialogs, question-bank CRUD, filters, and last-admin protection are incomplete.
- Optional AI provider abstraction is absent.

## Testing findings

- Vitest currently has one scoring suite with three tests (`tests/scoring.test.ts`).
- Playwright specs cover portions of public accessibility, games, registration/lesson creation, and admin access.
- The current execution environment cannot install Playwright Chromium for `ubuntu20.04-x64`; E2E files therefore exist but have not been executed here.
- Integration tests for permissions, database transactions, quiz grading variants, and session invalidation are missing.

## Missing supplied reference

`UstazLab_inclusive-1.html` was not found in the repository or supplied attachments. Exact conversion cannot be verified until that file is added. The 2.0 inclusive module will use the written requirements and existing accessibility/communication-card implementation as a safe interim reference; the HTML must be reconciled later.

## Prioritized implementation plan

1. Fail-closed authentication and session status validation.
2. Reusable UI primitives and coherent responsive shell.
3. Inclusive module and additive student/class/progress schema.
4. Lesson edit/duplicate and richer stages.
5. Quiz ownership-aware management and additional question types.
6. DB-backed inclusive activities, communication cards, and game content.
7. Optional server-only AI provider with disabled state when unconfigured.
8. Localization completion and expanded automated tests.
