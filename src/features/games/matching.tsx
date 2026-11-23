"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RotateCcw, Play, CheckCircle2 } from "lucide-react";
import { saveGameResultAction } from "@/lib/actions";

const ITEMS = [
  { id: "water", left: "💧 Су", right: "Тіршілік көзі" },
  { id: "forest", left: "🌲 Орман", right: "Ауаны тазартады" },
  { id: "paper", left: "📄 Қағаз", right: "Қайта өңделеді" },
  { id: "bird", left: "🦅 Бүркіт", right: "Қазақстан символы" },
];

export function MatchingGame() {
  const [started, setStarted] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [saved, setSaved] = useState(false);
  const startedAtRef = useRef<number>(0);

  const rightList = [...ITEMS].reverse();
  const completed = started && matched.length === ITEMS.length;

  function start() {
    startedAtRef.current = Date.now();
    setSelectedLeft(null);
    setMatched([]);
    setMistakes(0);
    setSaved(false);
    setStarted(true);
  }

  function pickRight(id: string) {
    if (!selectedLeft || matched.includes(id)) return;
    if (selectedLeft === id) {
      setMatched((prev) => [...prev, id]);
      setSelectedLeft(null);
    } else {
      setMistakes((m) => m + 1);
      setSelectedLeft(null);
    }
  }

  useEffect(() => {
    if (!completed || saved) return;
    const duration = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    const score = Math.max(1, ITEMS.length - mistakes);
    saveGameResultAction({
      gameType: "matching",
      score,
      maxScore: ITEMS.length,
      duration,
    })
      .then(() => setSaved(true))
      .catch(() => {});
  }, [completed, saved, mistakes]);

  if (!started) {
    return (
      <div className="card text-center grid gap-4 justify-items-center py-10">
        <span className="pill">{ITEMS.length} сәйкестік</span>
        <h2 className="m-0">Сәйкестендіру ойыны</h2>
        <p className="muted max-w-md m-0">
          Сол жақтан ұғымды таңдап, оң жақтан оның дұрыс мағынасын табыңыз.
        </p>
        <button type="button" className="btn lg" onClick={start}>
          <Play size={18} />
          Ойынды бастау
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="card text-center grid gap-4 justify-items-center py-10">
        <CheckCircle2 size={48} className="text-[var(--success)]" />
        <h2 className="m-0">Тамаша нәтиже!</h2>
        <p className="muted m-0">Қателер саны: {mistakes}</p>
        {saved && <span className="pill success">Нәтиже сақталды</span>}
        <div className="flex flex-wrap gap-3 justify-center">
          <button type="button" className="btn" onClick={start}>
            <RotateCcw size={16} /> Қайта ойнау
          </button>
          <Link href="/games" className="btn secondary">
            Барлық ойындар
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card grid gap-5">
      <div className="flex items-center justify-between gap-2">
        <b>Сәйкестендіру</b>
        <span className="pill">
          {matched.length} / {ITEMS.length}
        </span>
      </div>
      <div className="progress">
        <div style={{ width: `${(matched.length / ITEMS.length) * 100}%` }} />
      </div>
      <div className="form-row">
        <div className="grid gap-2.5">
          {ITEMS.map((item) => {
            const done = matched.includes(item.id);
            const active = selectedLeft === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={done}
                aria-pressed={active}
                onClick={() => setSelectedLeft(item.id)}
                className="game-option"
                style={{
                  borderColor: done
                    ? "var(--success)"
                    : active
                    ? "var(--primary)"
                    : undefined,
                }}
              >
                {item.left}
              </button>
            );
          })}
        </div>
        <div className="grid gap-2.5">
          {rightList.map((item) => {
            const done = matched.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                disabled={done || !selectedLeft}
                onClick={() => pickRight(item.id)}
                className="game-option"
                style={{
                  borderColor: done ? "var(--success)" : undefined,
                }}
              >
                {item.right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
