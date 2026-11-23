"use client";

import { useState } from "react";
import { Volume2, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveLearningProgressAction, saveAccessibilityPrefsAction } from "@/lib/actions";
import { AccessibilityControls } from "@/components/accessibility-bar";
import type { Locale } from "@/lib/i18n/types";

function speakText(text: string, locale: Locale) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    toast.error(locale === "ru" ? "Озвучивание недоступно" : "Дыбыстау қолжетімсіз");
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = locale === "ru" ? "ru-RU" : "kk-KZ";
  window.speechSynthesis.speak(u);
}

const INCLUSIVE_LESSON_STEPS = [
  {
    id: "step-1",
    emoji: "💧",
    titleKk: "1-қадам: Суды үнемдеу",
    titleRu: "Шаг 1: Бережём воду",
    bodyKk: "Қолыңды сабындағанда кранды жауып қой. Бұл күн сайын көп су үнемдейді.",
    bodyRu: "Закрывай кран, пока намыливаешь руки. Это помогает беречь воду каждый день.",
  },
  {
    id: "step-2",
    emoji: "🌳",
    titleKk: "2-қадам: Ағаштарға қамқорлық",
    titleRu: "Шаг 2: Забота о деревьях",
    bodyKk: "Ағаштар ауаны тазартады. Жас бұтақтарды сындырмай, ағаш отырғызуға көмектес.",
    bodyRu: "Деревья очищают воздух. Не ломай ветки и помогай ухаживать за растениями.",
  },
  {
    id: "step-3",
    emoji: "♻️",
    titleKk: "3-қадам: Қоқысты бөлек жинау",
    titleRu: "Шаг 3: Раздельный сбор",
    bodyKk: "Қағаз, пластик және шыныны бөлек контейнерге салсақ, табиғат таза болады.",
    bodyRu: "Если складывать бумагу, пластик и стекло отдельно, природа остаётся чистой.",
  },
];

export function InclusiveLessonViewer({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const current = INCLUSIVE_LESSON_STEPS[step];
  const title = isRu ? current.titleRu : current.titleKk;
  const body = isRu ? current.bodyRu : current.bodyKk;

  function finish() {
    setDone(true);
    saveLearningProgressAction({
      contentType: "INCLUSIVE_LESSON",
      contentId: "eco-basics-1",
      progress: 100,
      completed: true,
    }).catch(() => {});
  }

  return (
    <div className="card grid gap-5 max-w-2xl">
      <div className="flex items-center justify-between gap-2">
        <span className="pill">
          {step + 1} / {INCLUSIVE_LESSON_STEPS.length}
        </span>
        <button
          type="button"
          className="btn secondary sm"
          onClick={() => speakText(`${title}. ${body}`, locale)}
        >
          <Volume2 size={16} />
          {isRu ? "Озвучить шаг" : "Қадамды тыңдау"}
        </button>
      </div>

      <div className="progress">
        <div
          style={{
            width: `${((step + (done ? 1 : 0)) / INCLUSIVE_LESSON_STEPS.length) * 100}%`,
          }}
        />
      </div>

      <div className="text-center grid gap-3 py-4">
        <div className="text-6xl" aria-hidden="true">{current.emoji}</div>
        <h2 className="m-0">{title}</h2>
        <p className="text-lg m-0 leading-relaxed">{body}</p>
      </div>

      {done && (
        <div className="p-3 rounded-xl bg-[var(--success-soft)] border border-[var(--success)] text-[var(--success)] font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} />
          {isRu ? "Урок успешно пройден!" : "Сабақ сәтті аяқталды!"}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          className="btn secondary"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          <ArrowLeft size={16} />
          {isRu ? "Назад" : "Артқа"}
        </button>
        {step < INCLUSIVE_LESSON_STEPS.length - 1 ? (
          <button
            type="button"
            className="btn"
            onClick={() => setStep((s) => s + 1)}
          >
            {isRu ? "Следующий шаг" : "Келесі қадам"}
            <ArrowRight size={16} />
          </button>
        ) : (
          <button type="button" className="btn" onClick={finish}>
            <CheckCircle2 size={16} />
            {isRu ? "Завершить урок" : "Сабақты аяқтау"}
          </button>
        )}
      </div>
    </div>
  );
}

const FOUR_QUESTIONS = [
  {
    qKk: "Қол жуғанда суды қалай үнемдейміз?",
    qRu: "Как мы бережём воду при мытье рук?",
    optionsKk: ["Сабындағанда кранды жабу", "Кранды ашық қалдыру"],
    optionsRu: ["Закрывать кран при намыливании", "Оставлять кран открытым"],
    correct: 0,
  },
  {
    qKk: "Ағаштар бізге не береді?",
    qRu: "Что дают нам деревья?",
    optionsKk: ["Таза ауа", "Түтін"],
    optionsRu: ["Чистый воздух", "Дым"],
    correct: 0,
  },
  {
    qKk: "Пластик бөтелкені қайда тастаймыз?",
    qRu: "Куда лучше положить пластиковую бутылку?",
    optionsKk: ["Пластик контейнеріне", "Жол бойына"],
    optionsRu: ["В контейнер для пластика", "На дорогу"],
    correct: 0,
  },
  {
    qKk: "Сабақта көмек керек болса не істейміз?",
    qRu: "Что сделать, если на уроке нужна помощь?",
    optionsKk: ["Карточканы көрсету немесе қол көтеру", "Үндемей отыру"],
    optionsRu: ["Показать карточку или поднять руку", "Молча сидеть"],
    correct: 0,
  },
];

export function InclusiveQuizPlayer({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const finished = idx >= FOUR_QUESTIONS.length;
  const current = !finished ? FOUR_QUESTIONS[idx] : null;

  function choose(optionIndex: number) {
    if (!current || picked !== null) return;
    setPicked(optionIndex);
    if (optionIndex === current.correct) {
      setScore((s) => s + 1);
    }
  }

  function nextQuestion() {
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    setPicked(null);
    if (nextIdx >= FOUR_QUESTIONS.length) {
      const pct = Math.round((score / FOUR_QUESTIONS.length) * 100);
      saveLearningProgressAction({
        contentType: "INCLUSIVE_QUIZ",
        contentId: "inclusive-4q",
        progress: pct,
        completed: true,
      }).catch(() => {});
    }
  }

  if (finished) {
    return (
      <div className="card text-center grid gap-4 justify-items-center py-8 max-w-xl">
        <div className="text-5xl" aria-hidden="true">🌟</div>
        <h2 className="m-0">{isRu ? "Отличная работа!" : "Жарайсың!"}</h2>
        <div className="stat">
          {score} / {FOUR_QUESTIONS.length}
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setIdx(0);
            setScore(0);
            setPicked(null);
          }}
        >
          <RotateCcw size={16} />
          {isRu ? "Пройти ещё раз" : "Қайта өту"}
        </button>
      </div>
    );
  }

  const questionText = isRu ? current!.qRu : current!.qKk;
  const options = isRu ? current!.optionsRu : current!.optionsKk;

  return (
    <div className="card grid gap-4 max-w-xl">
      <div className="flex items-center justify-between gap-2">
        <span className="pill">
          {idx + 1} / {FOUR_QUESTIONS.length}
        </span>
        <button
          type="button"
          className="btn secondary sm"
          onClick={() => speakText(questionText, locale)}
        >
          <Volume2 size={16} />
          {isRu ? "Озвучить" : "Тыңдау"}
        </button>
      </div>

      <h2 className="m-0 text-xl">{questionText}</h2>

      <div className="grid gap-3">
        {options.map((opt, oIdx) => (
          <button
            key={opt}
            type="button"
            disabled={picked !== null}
            onClick={() => choose(oIdx)}
            className="game-option text-base"
            style={
              picked !== null
                ? {
                    borderColor:
                      oIdx === current!.correct
                        ? "var(--success)"
                        : oIdx === picked
                        ? "var(--error)"
                        : undefined,
                  }
                : undefined
            }
          >
            {opt}
          </button>
        ))}
      </div>

      {picked !== null && (
        <button type="button" className="btn w-max" onClick={nextQuestion}>
          {isRu ? "Далее" : "Келесі"}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

const AAC_CARDS = [
  { id: "help", cat: "needs", emoji: "🆘", kk: "Маған көмектесіңіз", ru: "Помогите мне" },
  { id: "time", cat: "needs", emoji: "⏳", kk: "Маған уақыт керек", ru: "Мне нужно время" },
  { id: "water", cat: "needs", emoji: "💧", kk: "Су ішкім келеді", ru: "Я хочу пить" },
  { id: "repeat", cat: "class", emoji: "🔁", kk: "Қайталап беріңіз", ru: "Повторите, пожалуйста" },
  { id: "ready", cat: "class", emoji: "✅", kk: "Мен дайынмын", ru: "Я готов" },
  { id: "break", cat: "needs", emoji: "🌿", kk: "Маған үзіліс керек", ru: "Мне нужен перерыв" },
  { id: "quiet", cat: "feelings", emoji: "🤫", kk: "Тыныштық керек", ru: "Мне нужна тишина" },
  { id: "happy", cat: "feelings", emoji: "😊", kk: "Көңіл-күйім жақсы", ru: "У меня хорошее настроение" },
];

export function CommunicationBoard({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  const [category, setCategory] = useState<"all" | "needs" | "class" | "feelings">("all");
  const [sentence, setSentence] = useState<string[]>([]);

  const visible = AAC_CARDS.filter((c) => category === "all" || c.cat === category);

  function pressCard(text: string) {
    setSentence((prev) => [...prev.slice(-5), text]);
    speakText(text, locale);
  }

  return (
    <div className="grid gap-5">
      {/* Sentence Builder Bar */}
      <div className="card flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 min-h-[36px]">
          {sentence.length ? (
            sentence.map((word, idx) => (
              <span key={`${word}-${idx}`} className="pill">
                {word}
              </span>
            ))
          ) : (
            <span className="muted text-sm">
              {isRu
                ? "Нажмите на карточку, чтобы озвучить и собрать фразу"
                : "Дыбыстау және сөйлем құрау үшін карточканы басыңыз"}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn sm"
            disabled={!sentence.length}
            onClick={() => speakText(sentence.join(". "), locale)}
          >
            <Volume2 size={16} />
            {isRu ? "Озвучить всё" : "Барлығын тыңдау"}
          </button>
          <button
            type="button"
            className="btn secondary sm"
            disabled={!sentence.length}
            onClick={() => setSentence([])}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", isRu ? "Все" : "Барлығы"],
            ["needs", isRu ? "Потребности" : "Қажеттіліктер"],
            ["class", isRu ? "Урок" : "Сабақ"],
            ["feelings", isRu ? "Состояние" : "Көңіл-күй"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={category === key ? "btn sm" : "btn secondary sm"}
            onClick={() => setCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}
      >
        {visible.map((card) => {
          const primary = isRu ? card.ru : card.kk;
          const secondary = isRu ? card.kk : card.ru;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => pressCard(primary)}
              className="card text-center grid gap-2 justify-items-center cursor-pointer hover:border-[var(--primary)]"
            >
              <span className="text-5xl" aria-hidden="true">{card.emoji}</span>
              <span className="font-bold text-base">{primary}</span>
              <span className="text-xs muted">{secondary}</span>
              <span className="pill mt-1">
                <Volume2 size={14} /> {isRu ? "Озвучить" : "Тыңдау"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InclusiveAccessibilityPanel({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  return (
    <div className="card grid gap-4 max-w-2xl">
      <h2 className="text-xl m-0">
        {isRu ? "Настройки интерфейса и озвучивания" : "Интерфейс және дыбыстау баптаулары"}
      </h2>
      <p className="muted text-sm m-0">
        {isRu
          ? "Настройки сохраняются в браузере и в вашем аккаунте при входе в систему."
          : "Баптаулар браузерде және жүйеге кірген кезде аккаунтыңызда сақталады."}
      </p>
      <AccessibilityControls onPersist={saveAccessibilityPrefsAction} />
    </div>
  );
}
