# UstazLab 3.0 — Inclusive Education Module

## Missing Reference Notice

The file `UstazLab_inclusive-1.html` was not present in the repository workspace. No claim is made that that external HTML file was converted verbatim; instead, all requested functional requirements were implemented as native, accessible React + TypeScript components in `src/components/inclusive-module.tsx` and `src/app/inclusive/*`. Once `UstazLab_inclusive-1.html` is added to the repository, any remaining specific copy or illustrations can be reconciled cleanly.

## Implemented Routes

- `/inclusive` — Inclusive module hub.
- `/inclusive/lessons` — Step-by-step visual inclusive lesson with Text-to-Speech and progress persistence.
- `/inclusive/games` & `/inclusive/activities` — Database-backed adaptive activities (`inclusive_activities`).
- `/inclusive/quizzes` — 4-question inclusive quiz with large touch targets, audio playback, and score persistence.
- `/inclusive/communication` — Categorized AAC communication cards with sentence builder bar and browser TTS (`kk-KZ` / `ru-RU`).
- `/inclusive/settings` & `/inclusive/accessibility` — Font scaling (`A-` / `A+`), high-contrast mode, reduced motion, and TTS persisted to `localStorage` and `accessibility_preferences` (for authenticated users).
- `/inclusive/progress` — Learning progress tracker without collecting medical diagnoses or sensitive student data.

