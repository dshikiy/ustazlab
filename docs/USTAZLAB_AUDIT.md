# UstazLab 2.0 — Comprehensive Repository Audit

**Audit date:** 2026-11-23  
**Branch:** `feat/ustazlab-2-platform`  
**Stack:** Next.js 16.0.3 (App Router) · React 19.2 · TypeScript 5.9 · Tailwind CSS v4 · Drizzle ORM 0.44 + Neon PostgreSQL · Radix UI · Lucide Icons · Recharts · Vitest · Playwright

---

## 1. Repository & Route Inventory

### Public Routes
- `/` — `src/app/page.tsx`: Minimal 3-section landing page (hero, 6 feature cards, gradient CTA). Lacks interactive previews, workflow demo, inclusive section, FAQ, and tagline reveal.
- `/about` — `src/app/about/page.tsx`: Basic informational page.
- `/materials` — `src/app/materials/page.tsx`: Public materials library + communication cards tab.
- `/games` — `src/app/games/page.tsx` plus `/games/animals`, `/games/nature`, `/games/recycling`, `/games/true-false`: 4 playable games.
- `/login`, `/register` — `src/app/login/page.tsx`, `src/app/register/page.tsx`: Credential auth pages.
- `/play/[quizId]` & `/play/[quizId]/result` — Public quiz play and server-scored result screens.
- `/inclusive` + `/inclusive/lessons`, `/inclusive/activities`, `/inclusive/communication`, `/inclusive/accessibility`, `/inclusive/progress`: Initial 1-line stubs for inclusive education.

### Protected Teacher Routes (`/dashboard/*`)
- `/dashboard` — Overview (currently 4 stat cards + 3 quick links; missing recent lessons, quizzes, materials, activity history, search).
- `/dashboard/lessons`, `/dashboard/lessons/new`, `/dashboard/lessons/[id]` — Missing `/dashboard/lessons/[id]/edit`.
- `/dashboard/quizzes`, `/dashboard/quizzes/new`, `/dashboard/quizzes/[id]` — Missing `/dashboard/quizzes/[id]/edit`.
- `/dashboard/materials`, `/dashboard/results`, `/dashboard/analytics`, `/dashboard/assistant`, `/dashboard/profile`, `/dashboard/settings`.

### Protected Student Routes (`/student/*`)
- `/student`, `/student/assignments`, `/student/games`, `/student/progress`, `/student/achievements` — Initial 1-line stubs; missing logout, locale switcher, and interactive assignment/progress flows.

### Protected Admin Routes (`/admin/*`)
- `/admin`, `/admin/[section]` — Protected by `requireAdmin()`.

### API Routes
- `/api/lessons/[id]/pdf` — Authenticated PDF export (`pdf-lib`).
- `/api/lessons/[id]/docx` — Authenticated DOCX export (`docx`).
- `/api/ai` — Server-side AI assistant endpoint with rate limiting and Zod validation.

---

## 2. Database Schema (`src/db/schema.ts`)

Verified existing tables:
- Core: `users`, `teacher_profiles`, `lessons`, `lesson_stages`, `quizzes`, `quiz_questions`, `quiz_options`, `quiz_attempts`, `quiz_answers`, `game_content`, `game_results`, `materials`, `material_favorites`, `activity_logs`, `platform_settings`.
- 2.0 additions already defined in schema: `student_profiles`, `classes`, `class_memberships`, `assignments`, `assignment_submissions`, `inclusive_activities`, `accessibility_preferences`, `learning_progress`, `achievements`.

Gaps identified:
- `lessons` lacks `status` (`DRAFT` / `PUBLISHED`) and `teachingMethods` columns (safe additive columns needed for full lesson builder workflow).
- `accessibility_preferences` exists in schema but is not yet synced from the UI via server actions.
- `game_results` exists in schema but live games do not persist completed scores to the database.

---

## 3. Security & Authorization Findings

1. **Auth secret & session validation (`src/lib/auth.ts`)**: Production fails closed when `AUTH_SECRET` is missing/short, and `getSession()` re-validates user existence and `status === "ACTIVE"` from PostgreSQL. Cookies are `httpOnly`, `sameSite: "lax"`, `secure` in production.
2. **Missing auth rate limiting (`src/lib/actions.ts`)**: `loginAction` and `registerAction` do not have rate limiting against brute-force attempts.
3. **Account enumeration**: `registerAction` already redirects with generic `?error=invalid` rather than `?error=exists`, avoiding enumeration. `loginAction` returns generic `?error=credentials`.
4. **Ownership enforcement**: Lesson reads/deletes/duplicates/exports and quiz reads/deletes/duplicates check `eq(table.teacherId, user.id)`. New edit actions for lessons and quizzes must enforce the exact same ownership check.
5. **Quiz answer security (`src/app/play/[quizId]/page.tsx`, `src/lib/actions.ts`)**: Public play page queries only `{ id, text }` from `quiz_options` (never `isCorrect`). Scoring runs strictly server-side in `submitQuizAction`.
6. **AI key protection (`src/lib/ai/provider.ts`, `src/app/api/ai/route.ts`)**: Runs strictly on the server; returns `503` when unconfigured without fabricating responses.

---

## 4. Design System, Maintainability & UX Findings

1. **Code formatting & maintainability**: Nearly all source files (`src/app/globals.css`, `src/lib/actions.ts`, `src/app/page.tsx`, `src/components/*`) are compressed onto single minified lines, making maintenance error-prone.
2. **CSS conflicts (`src/app/globals.css`)**: Multiple `:root` blocks fight using `!important` (green `#16885c` overriding `#2563eb`), uses `Inter, Arial, sans-serif`, and applies background gradients.
3. **Missing reusable design system**: `src/components/ui/` contains only 6 minimal 1-line components (`badge`, `button`, `card`, `empty-state`, `progress`, `skeleton`). Missing: `Input`, `Select`, `Checkbox`, `Radio`, `Modal`/`Dialog`, `Dropdown`, `Tooltip`, `Tabs`, `Sidebar`, `Navbar`, `Breadcrumbs`, `Pagination`, `DataTable`, `Toast`, `Search`, `Filter`, `FileUpload`, `AccessibilityControls`.
4. **Missing 404 page**: No custom `src/app/not-found.tsx`.
5. **Accessibility**: Floating `AccessibilityBar` works locally, but needs full KZ/RU localization, skip-to-content link in root layout, proper ARIA landmarks, keyboard navigation in games, and DB preference persistence for authenticated users.

---

## 5. Feature Completeness Findings

1. **Lesson Builder (`src/components/lesson-form.tsx`)**: Hardcoded to 3 stages; cannot add, edit, delete, or reorder stages. No `/dashboard/lessons/[id]/edit` route. No draft/published status toggle or teaching methods field.
2. **Quiz Builder (`src/components/quiz-form.tsx`)**: No `/dashboard/quizzes/[id]/edit` route. `MULTIPLE` choice questions only allow selecting a single numeric index as correct (`correct${index}`), breaking multi-select grading. No publish/unpublish toggle on detail page.
3. **Educational Games (`src/features/games/*`)**: 4 existing games work, but lack an instruction screen, keyboard controls, full RU localization, DB result persistence, and additional game types (Memory Cards, Matching Pairs).
4. **Inclusive Education (`src/app/inclusive/*`)**: `UstazLab_inclusive-1.html` is not present in the repository. Existing pages are minimal stubs; need full interactive inclusive lesson, 4-question inclusive quiz, adaptive games, categorized AAC communication cards with sentence builder + TTS, accessibility controls, and progress tracking.
5. **Localization (`src/lib/i18n/*`)**: `kk.ts` and `ru.ts` cover only ~35 keys; most dashboard, builder, game, inclusive, student, and materials UI strings are hardcoded in Kazakh.

---

## 6. Testing Status

- `npm run lint`: Passes (0 errors).
- `npm test` (Vitest): Passes (1 file, 3 tests in `tests/scoring.test.ts`).
- Missing tests: auth/rate-limit/permission tests, full quiz scoring tests (SINGLE, MULTIPLE, TRUE_FALSE, SHORT), AI provider tests, localization parity tests, UI component tests, and E2E verification.
