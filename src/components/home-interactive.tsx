"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  HeartHandshake,
  CheckCircle2,
  FileDown,
  Share2,
  Volume2,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/types";

export function InteractiveProductPreview({ locale }: { locale: Locale }) {
  const [tab, setTab] = useState<"lesson" | "quiz" | "inclusive">("lesson");
  const isRu = locale === "ru";

  return (
    <div className="card p-5 grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={isRu ? "Предпросмотр модулей" : "Модульдерді көру"}>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "lesson"}
            className={tab === "lesson" ? "btn sm" : "btn secondary sm"}
            onClick={() => setTab("lesson")}
          >
            <BookOpen size={15} />
            {isRu ? "КСП" : "ҚМЖ"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "quiz"}
            className={tab === "quiz" ? "btn sm" : "btn secondary sm"}
            onClick={() => setTab("quiz")}
          >
            <ClipboardCheck size={15} />
            {isRu ? "Тест" : "Тест"}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "inclusive"}
            className={tab === "inclusive" ? "btn sm" : "btn secondary sm"}
            onClick={() => setTab("inclusive")}
          >
            <HeartHandshake size={15} />
            {isRu ? "Инклюзия" : "Инклюзия"}
          </button>
        </div>
        <span className="pill teal">
          {isRu ? "3 класс · 40 мин" : "3-сынып · 40 мин"}
        </span>
      </div>

      {tab === "lesson" && (
        <div className="grid gap-3">
          <div>
            <div className="text-xs font-semibold muted mb-1">
              {isRu ? "Познание мира · Черновик готов к экспорту" : "Дүниетану · Экспортқа дайын жоспар"}
            </div>
            <h3 className="m-0">
              {isRu ? "Бережём воду и природу вместе" : "Суды және табиғатты бірге қорғайық"}
            </h3>
          </div>
          <div className="grid gap-2">
            {[
              [isRu ? "Начало урока · 5 мин" : "Сабақтың басы · 5 мин", isRu ? "Мотивационный вопрос и постановка цели" : "Ой қозғау және сабақ мақсатын анықтау"],
              [isRu ? "Основная часть · 25 мин" : "Сабақтың ортасы · 25 мин", isRu ? "Работа в парах с карточками и сортировка" : "Карточкалармен жұптық жұмыс және сұрыптау"],
              [isRu ? "Рефлексия · 10 мин" : "Сабақтың соңы · 10 мин", isRu ? "Самооценка и короткий тест" : "Өзін-өзі бағалау және шағын тест"],
            ].map(([stage, desc]) => (
              <div
                key={stage}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]"
              >
                <CheckCircle2 size={18} className="text-[var(--success)] shrink-0 mt-0.5" />
                <div className="grid gap-0.5">
                  <span className="text-sm font-semibold">{stage}</span>
                  <span className="text-xs muted">{desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs muted flex items-center gap-1.5">
              <FileDown size={14} /> PDF · DOCX · Print
            </span>
            <Link href="/dashboard/lessons/new" className="text-sm font-semibold text-[var(--primary)] no-underline">
              {isRu ? "Открыть конструктор →" : "Конструкторды ашу →"}
            </Link>
          </div>
        </div>
      )}

      {tab === "quiz" && (
        <div className="grid gap-3">
          <div>
            <div className="text-xs font-semibold muted mb-1">
              {isRu ? "Серверная проверка · Безопасная ссылка" : "Серверлік бағалау · Қауіпсіз сілтеме"}
            </div>
            <h3 className="m-0">
              {isRu ? "Какое действие помогает сберечь лес?" : "Орманды сақтауға қай әрекет көмектеседі?"}
            </h3>
          </div>
          <div className="grid gap-2">
            {[
              isRu ? "Сдавать бумагу в переработку" : "Қағазды қайта өңдеуге тапсыру",
              isRu ? "Оставлять костёр без присмотра" : "Отты қараусыз қалдыру",
              isRu ? "Ломать ветки молодых деревьев" : "Жас ағаштардың бұтағын сындыру",
            ].map((opt, idx) => (
              <div
                key={opt}
                className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] flex items-center justify-between text-sm font-medium"
              >
                <span>{opt}</span>
                {idx === 0 && <span className="pill success">{isRu ? "1 балл" : "1 ұпай"}</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs muted flex items-center gap-1.5">
              <Share2 size={14} /> {isRu ? "Ответы скрыты от клиента" : "Дұрыс жауаптар серверде сақталады"}
            </span>
            <Link href="/dashboard/quizzes/new" className="text-sm font-semibold text-[var(--primary)] no-underline">
              {isRu ? "Создать тест →" : "Тест құрастыру →"}
            </Link>
          </div>
        </div>
      )}

      {tab === "inclusive" && (
        <div className="grid gap-3">
          <div>
            <div className="text-xs font-semibold muted mb-1">
              {isRu ? "AAC карточки общения · Озвучивание" : "AAC қарым-қатынас карточкалары · Дыбыстау"}
            </div>
            <h3 className="m-0">
              {isRu ? "Быстрое выражение потребностей на уроке" : "Сабақ үстінде қажеттілікті оңай жеткізу"}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              ["🆘", isRu ? "Помогите мне" : "Маған көмектесіңіз"],
              ["⏳", isRu ? "Мне нужно время" : "Маған уақыт керек"],
              ["✅", isRu ? "Я готов" : "Мен дайынмын"],
              ["🌿", isRu ? "Нужен перерыв" : "Үзіліс керек"],
            ].map(([emoji, label]) => (
              <div
                key={label}
                className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] flex items-center gap-2.5"
              >
                <span className="text-2xl" aria-hidden="true">{emoji}</span>
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs muted flex items-center gap-1.5">
              <Volume2 size={14} /> {isRu ? "Крупный шрифт · Контраст · TTS" : "Үлкен қаріп · Контраст · TTS"}
            </span>
            <Link href="/inclusive" className="text-sm font-semibold text-[var(--primary)] no-underline">
              {isRu ? "Открыть модуль →" : "Модульді ашу →"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function TaglineReveal({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setVisibleCount(words.length));
      return;
    }

    let timer: ReturnType<typeof setInterval> | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          let current = 0;
          timer = setInterval(() => {
            current += 1;
            setVisibleCount(current);
            if (current >= words.length && timer) {
              clearInterval(timer);
            }
          }, 70);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [words.length]);

  return (
    <section className="section border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="container" ref={containerRef}>
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight max-w-[780px] m-0">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="inline-block mr-[0.3em] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                opacity: index < visibleCount ? 1 : 0.25,
                transform: index < visibleCount ? "translateY(0)" : "translateY(6px)",
              }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

