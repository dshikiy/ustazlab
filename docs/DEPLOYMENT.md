# UstazLab 3.0 — Deployment Guide

## Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string (SSL enabled) |
| `AUTH_SECRET` | Yes (prod) | Cryptographically random secret (>= 32 characters) |
| `AI_API_URL` | Optional | OpenAI-compatible chat completions endpoint |
| `AI_API_KEY` | Optional | Server-side API key |
| `AI_MODEL` | Optional | Model identifier |

## Production Build & Migration Steps

1. Run safe schema migrations against Neon:
   ```bash
   npm run db:migrate
   ```
2. Verify build locally:
   ```bash
   npm run lint
   npm test
   npm run build
   ```
3. Deploy via Vercel (or Node.js server with `npm run start`).
4. Verify `/api/health` returns HTTP `200` with `{"status":"ok"}`.
5. Backups: Use Neon point-in-time restore (PITR) and automated daily snapshots before applying schema migrations.
