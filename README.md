# UstazLab 3.0 — Digital Educational Platform for Kazakhstan

UstazLab is a modern, accessible, bilingual (Kazakh default, Russian secondary) educational SaaS platform for teachers, students, and school administrators in Kazakhstan.

## Core Features

- **UstazLab Signature 3.0 Design System**: Accessible light and dark themes, Manrope typography with Kazakh Cyrillic support, WCAG 2.2 AA focus indicators, and reusable Radix-powered primitives (`src/components/ui`).
- **Teacher Workspace (`/dashboard`)**: Overview with real DB metrics, recent lessons, recent quizzes, saved materials, student performance, and activity history.
- **Lesson Builder (`/dashboard/lessons`)**: Dynamic stage editor (add, edit, delete, reorder stages), inclusive adaptations, duplicate/delete, print layout, and owner-checked PDF/DOCX exports (`/api/lessons/[id]/pdf`, `/api/lessons/[id]/docx`).
- **Quiz Platform (`/dashboard/quizzes`, `/play/[quizId]`)**: Supports Single Choice, Multiple Choice, True/False, and Short Answer questions. Answers are scored strictly on the server; correct options are never sent to the browser before submission.
- **Classroom Management (`/dashboard/classes`, `/dashboard/assignments`)**: Create classes with unique join codes, assign lessons and quizzes, and track student submissions.
- **Educational Games (`/games`)**: Six playable games (`animals`, `nature`, `recycling`, `true-false`, `memory`, `matching`) with instructions, keyboard controls (`1–4`, `Enter`), audio feedback, and DB score persistence.
- **Inclusive Education Module (`/inclusive`)**: Step-by-step inclusive lesson, 4-question inclusive quiz, adaptive activities, categorized AAC communication cards with sentence builder and browser Text-to-Speech, accessibility controls (font scale, high contrast, reduced motion), and learning progress tracking.
- **Student Portal (`/student`)**: Simplified interface with class join-by-code, assigned lessons/quizzes, games, progress, and achievements.
- **Materials Library (`/materials`, `/dashboard/materials`)**: Search, grade/category/subject filters, preview modal, favorites, print, and download.
- **Optional AI Assistant (`/dashboard/assistant`, `/api/ai`)**: Server-only OpenAI-compatible provider with Zod validation, rate limiting, and teacher-review workflow. Never fabricates answers when unconfigured.

## Getting Started

```bash
npm install
cp .env.example .env.local
# Configure DATABASE_URL and AUTH_SECRET (>= 32 chars)
npm run db:push
npm run db:seed
npm run dev
```

## Verification Commands

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```
