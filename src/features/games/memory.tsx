"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RotateCcw, Play } from "lucide-react";
import { saveGameResultAction } from "@/lib/actions";

interface MemoryCard {
  id: string;
  pairId: string;
  emoji: string;
  label: string;
}

const PAIRS = [
  { pairId: "tree", emoji: "🌳", label: "Ағаш" },
  { pairId: "water", emoji: "💧", label: "Су" },
  { pairId: "sun", emoji: "☀️", label: "Күн" },
  { pairId: "recycle", emoji: "♻️", label: "Қайта өңдеу" },
  { pairId: "fox", emoji: "🦊", label: "Түлкі" },
  { pairId: "flower", emoji: "🌷", label: "Қызғалдақ" },
];

function createDeck(): MemoryCard[] {
  const cards: MemoryCard[] = [];
  for (const p of PAIRS) {
    cards.push({ id: `${p.pairId}-a`, ...p });
    cards.push({ id: `${p.pairId}-b`, ...p });
  }
  return cards.sort((a, b) => a.id.localeCompare(b.id)).reverse();
}

export function MemoryGame() {
  const [started, setStarted] = useState(false);
  const [deck, setDeck] = useState<MemoryCard[]>(() => createDeck());
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [saved, setSaved] = useState(false);
  const startedAtRef = useRef<number>(0);

  const completed = started && matched.length === PAIRS.length;

  function start() {
    startedAtRef.current = Date.now();
    setDeck([...createDeck()].sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSaved(false);
    setStarted(true);
  }

  function flip(card: MemoryCard) {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.pairId)) {
      return;
    }
    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const first = deck.find((c) => c.id === firstId);
      const second = deck.find((c) => c.id === secondId);
      if (first && second && first.pairId === second.pairId) {
        setMatched((prev) => [...prev, first.pairId]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 750);
      }
    }
  }

  useEffect(() => {
    if (!completed || saved) return;
    const duration = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    const score = Math.max(1, PAIRS.length - Math.max(0, moves - PAIRS.length));
    saveGameResultAction({
      gameType: "memory",
      score,
      maxScore: PAIRS.length,
      duration,
    })
      .then(() => setSaved(true))
      .catch(() => {});
  }, [completed, saved, moves]);

  if (!started) {
    return (
      <div className="card text-center grid gap-4 justify-items-center py-10">
        <span className="pill">6 жұп</span>
        <h2 className="m-0">Жад карточкалары</h2>
        <p className="muted max-w-md m-0">
          Карточкаларды ашып, табиғатқа байланысты бірдей жұптарды табыңыз.
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
        <div className="text-5xl" aria-hidden="true">🎉</div>
        <h2 className="m-0">Барлық жұп табылды!</h2>
        <p className="muted m-0">Жалпы жүріс саны: {moves}</p>
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
      <div className="flex items-center justify-between gap-3">
        <b>Жад карточкалары</b>
        <div className="flex items-center gap-2">
          <span className="pill">Жұп: {matched.length}/{PAIRS.length}</span>
          <span className="pill teal">Жүріс: {moves}</span>
        </div>
      </div>

      <div className="progress">
        <div style={{ width: `${(matched.length / PAIRS.length) * 100}%` }} />
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}
      >
        {deck.map((card) => {
          const revealed = flipped.includes(card.id) || matched.includes(card.pairId);
          return (
            <button
              key={card.id}
              type="button"
              aria-label={revealed ? card.label : "Жабық карточка"}
              aria-pressed={revealed}
              onClick={() => flip(card)}
              className="card p-4 grid place-items-center gap-1 min-h-[110px] cursor-pointer"
              style={{
                borderColor: matched.includes(card.pairId)
                  ? "var(--success)"
                  : revealed
                  ? "var(--primary)"
                  : undefined,
              }}
            >
              {revealed ? (
                <>
                  <span className="text-3xl" aria-hidden="true">{card.emoji}</span>
                  <span className="text-xs font-semibold">{card.label}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[var(--primary)]">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
