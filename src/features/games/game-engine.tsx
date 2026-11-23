"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Star,
  Play,
  Keyboard,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { saveGameResultAction } from "@/lib/actions";

export interface Question {
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  emoji?: string;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

function playTone(ok: boolean) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = ok ? 660 : 180;
    osc.type = ok ? "sine" : "sawtooth";
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // AudioContext blocked or unsupported
  }
}

export function ChoiceGame({
  title,
  questions,
  gameType = "choice",
  instructions = "Әр сұрақты мұқият оқып, дұрыс жауапты таңдаңыз. Пернетақтада 1–4 сандарын және Enter батырмасын қолдануға болады.",
}: {
  title: string;
  questions: Question[];
  gameType?: string;
  instructions?: string;
}) {
  const list = useMemo(() => questions.slice(), [questions]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [saved, setSaved] = useState(false);
  const startedAtRef = useRef<number>(0);

  const completed = started && index >= list.length;
  const current = !completed && started ? list[index] : null;

  function start() {
    startedAtRef.current = Date.now();
    setStarted(true);
    setIndex(0);
    setScore(0);
    setChosen(null);
    setSaved(false);
  }

  function pick(optionIndex: number) {
    if (!current || chosen !== null) return;
    setChosen(optionIndex);
    const ok = optionIndex === current.correct;
    if (ok) setScore((s) => s + 1);
    if (!muted) playTone(ok);
  }

  function next() {
    if (chosen === null) return;
    setIndex((i) => i + 1);
    setChosen(null);
  }

  // Keyboard navigation (1-4 to pick, Enter/Space to advance)
  useEffect(() => {
    if (!started || completed || !current) return;
    function onKeyDown(e: KeyboardEvent) {
      const num = Number(e.key);
      if (num >= 1 && num <= current!.options.length && chosen === null) {
        e.preventDefault();
        pick(num - 1);
      } else if ((e.key === "Enter" || e.key === " ") && chosen !== null) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Persist score once on completion
  useEffect(() => {
    if (!completed || saved) return;
    const duration = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    saveGameResultAction({
      gameType,
      score,
      maxScore: list.length,
      duration,
    })
      .then(() => setSaved(true))
      .catch(() => {});
  }, [completed, saved, gameType, score, list.length]);

  if (!started) {
    return (
      <div className="card grid gap-4 text-center py-10 px-6 justify-items-center">
        <span className="pill">{list.length} сұрақ</span>
        <h2 className="m-0">{title}</h2>
        <p className="muted max-w-lg m-0">{instructions}</p>
        <div className="flex items-center gap-2 text-xs muted">
          <Keyboard size={15} />
          <span>1–4: жауап таңдау · Enter: келесі</span>
        </div>
        <button type="button" className="btn lg mt-2" onClick={start}>
          <Play size={18} />
          Ойынды бастау
        </button>
      </div>
    );
  }

  if (completed) {
    const accuracy = Math.round((score / Math.max(1, list.length)) * 100);
    return (
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card text-center grid gap-4 justify-items-center py-10"
      >
        <div className="text-5xl" aria-hidden="true">
          🏆
        </div>
        <h2 className="m-0">Жарайсың!</h2>
        <div className="flex justify-center gap-1.5 text-[var(--warning)]">
          {[1, 2, 3].map((x) => (
            <Star key={x} fill={accuracy >= x * 25 ? "currentColor" : "none"} />
          ))}
        </div>
        <div className="stat">
          {score} / {list.length}
        </div>
        <p className="muted m-0">
          Дәлдік: {accuracy}% ·{" "}
          {accuracy === 100
            ? "Эко батыр"
            : accuracy >= 70
            ? "Табиғат досы"
            : "Жас эколог"}
        </p>
        {saved && <span className="pill success">Нәтиже сақталды</span>}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button type="button" className="btn" onClick={start}>
            <RotateCcw size={17} />
            Қайта ойнау
          </button>
          <Link className="btn secondary" href="/games">
            Ойындарға оралу
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="card grid gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="grid">
          <b>{title}</b>
          <span className="text-xs muted">
            {index + 1} / {list.length}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="pill">⭐ {score}</span>
          <button
            type="button"
            className="icon-btn"
            aria-label={muted ? "Дыбысты қосу" : "Дыбысты өшіру"}
            onClick={() => setMuted((m) => !m)}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <div className="progress">
        <motion.div animate={{ width: `${(index / list.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="grid gap-4"
        >
          {current?.emoji && (
            <div className="text-7xl text-center" aria-hidden="true">
              {current.emoji}
            </div>
          )}
          <h2 className="m-0 text-xl">{current?.prompt}</h2>
          <div className="grid gap-2.5">
            {current?.options.map((opt, optIdx) => {
              const isSelected = chosen === optIdx;
              const isCorrectOption = optIdx === current.correct;
              let borderColor: string | undefined;
              if (chosen !== null) {
                if (isCorrectOption) borderColor = "var(--success)";
                else if (isSelected) borderColor = "var(--error)";
              }
              return (
                <button
                  type="button"
                  key={opt}
                  className="game-option flex items-center gap-3"
                  onClick={() => pick(optIdx)}
                  disabled={chosen !== null}
                  style={borderColor ? { borderColor } : undefined}
                >
                  <span className="pill shrink-0">{optIdx + 1}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {chosen !== null && current && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] grid gap-2"
            >
              <div
                className="flex items-center gap-2 font-bold"
                style={{
                  color:
                    chosen === current.correct ? "var(--success)" : "var(--error)",
                }}
              >
                {chosen === current.correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                <span>
                  {chosen === current.correct ? "Дұрыс жауап!" : "Тағы да ойланып көр."}
                </span>
              </div>
              <p className="muted text-sm m-0">{current.explanation}</p>
              <button type="button" className="btn w-max mt-1" onClick={next}>
                Келесі сұрақ
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
