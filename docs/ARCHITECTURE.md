# UstazLab 3.0 — Architecture

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript 5.9 (strict mode), React 19
- **Styling**: Tailwind CSS v4 + UstazLab Signature CSS custom properties (`src/app/globals.css`)
- **Database**: Neon PostgreSQL + Drizzle ORM (`src/db/schema.ts`, `src/db/index.ts`)
- **Auth**: HS256 JWT (`jose`) in `httpOnly` `sameSite=lax` cookies + `bcryptjs` (12 rounds) + DB status verification (`src/lib/auth.ts`)
- **Validation**: Zod v4
- **Testing**: Vitest + Playwright

## Layer Structure

- `src/app/` — App Router pages, layouts, metadata, and API routes (`/api/health`, `/api/ai`, `/api/lessons/[id]/pdf`, `/api/lessons/[id]/docx`).
- `src/components/ui/` — Reusable Design System 3.0 primitives.
- `src/components/` — Feature components (builders, navigation, inclusive module, materials, AI assistant, accessibility bar).
- `src/features/games/` — Reusable educational game engine (`ChoiceGame`, `MemoryGame`, `MatchingGame`, `Recycling`).
- `src/lib/` — Server Actions (`actions.ts`, `classroom-actions.ts`, `material-actions.ts`, `admin-actions.ts`), auth guards, rate limiter, quiz scoring, AI provider, and KZ/RU i18n dictionaries.
- `src/db/` — Drizzle schema, Neon client, and idempotent seed script.
