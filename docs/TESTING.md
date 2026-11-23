# UstazLab 3.0 — Testing Guide

## Test Suites

- **Unit & Logic Tests (Vitest)**:
  - `tests/scoring.test.ts` — Core scoring checks.
  - `tests/quiz-scoring.test.ts` — Single choice, multiple choice, true/false, and Kazakh/Russian short-answer normalization.
  - `tests/platform.test.ts` — Rate limiting, AI request Zod validation, unconfigured AI provider behavior, and KZ/RU localization key parity.
- **E2E Specs (Playwright)**:
  - `e2e/public-design-a11y.spec.ts`
  - `e2e/public-i18n.spec.ts`
  - `e2e/games.spec.ts`
  - `e2e/teacher-flow.spec.ts`
  - `e2e/admin-crud.spec.ts`

## Commands

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

