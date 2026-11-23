# UstazLab 3.0 — Database Schema & Migrations

Database: **Neon PostgreSQL** via Drizzle ORM (`src/db/schema.ts`).

## Tables

### Identity & Profiles
- `users` — `id`, `name`, `email` (unique), `password_hash`, `role` (`ADMIN` | `TEACHER` | `STUDENT`), `status` (`ACTIVE` | `DISABLED`).
- `teacher_profiles` — `user_id` (unique FK), `school`, `bio`.
- `student_profiles` — `user_id` (unique FK), `display_name`, `grade`.

### Teaching Content
- `lessons` & `lesson_stages` — Owner-scoped lesson plans (`teacher_id` indexed) and ordered stages (`position`).
- `quizzes`, `quiz_questions`, `quiz_options`, `quiz_attempts`, `quiz_answers` — Full quiz authoring and server-scored attempt persistence.
- `materials` & `material_favorites` — Published educational materials and per-user favorites.

### Classrooms & Assignments
- `classes` — `teacher_id`, `name`, `grade`, `join_code` (unique).
- `class_memberships` — Unique `(class_id, student_id)`.
- `assignments` & `assignment_submissions` — Class assignments linked optionally to a lesson or quiz, plus per-student submission status.

### Games, Inclusive & Operations
- `game_content` & `game_results` — Game items and persisted play scores/accuracy/duration.
- `inclusive_activities` — Bilingual (`title_kk`/`title_ru`) adaptive activities.
- `accessibility_preferences` — Per-user `font_scale`, `high_contrast`, `reduced_motion`, `text_to_speech`.
- `learning_progress` & `achievements` — User progress across lessons, quizzes, games, and inclusive activities.
- `activity_logs` & `platform_settings` — Audit trail and global configuration.

## Safe Migration Workflow

```bash
npm run db:generate
npm run db:migrate
```

Never run destructive resets against production data.
