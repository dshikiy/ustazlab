# UstazLab

Kazakh-first educational platform built with Next.js 16, React 19, Neon PostgreSQL and Drizzle.

## Local setup

1. Copy `.env.example` to `.env.local` and fill the values.
2. Run `npm install`.
3. Run `npm run db:push` to apply the schema.
4. Optionally set `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then run `npm run db:seed` once.
5. Run `npm run dev`.

## Production deployment

Create one Vercel project and add `DATABASE_URL`, a unique 32+ character `AUTH_SECRET`, `APP_URL`, and optional admin bootstrap variables. Run `npm run db:migrate` as a controlled deployment step. Never run seed automatically in production. The app uses no separate backend.

## Verification

`npm test` runs unit tests; `npm run build` performs the production compilation.
# ustazlab
