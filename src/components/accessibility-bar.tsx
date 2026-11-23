"use client";

import { useEffect, useState } from "react";
import {
  Accessibility,
  Minus,
  Plus,
  Contrast,
  Volume2,
  Square,
  Activity,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { kk } from "@/lib/i18n/kk";
import { ru } from "@/lib/i18n/ru";

export interface A11yState {
  scale: number;
  contrast: boolean;
  reduced: boolean;
}

const STORAGE_KEY = "ustazlab_a11y";

function applyA11y(state: A11yState) {
  document.documentElement.style.setProperty("--font-scale", String(1 + state.scale * 0.08));
  document.documentElement.classList.toggle("high-contrast", state.contrast);
  document.documentElement.classList.toggle("reduce-motion", state.reduced);
}

export function useAccessibilityPrefs() {
  const [state, setState] = useState<A11yState>({
    scale: 0,
    contrast: false,
    reduced: false,
  });
  const [speaking, setSpeaking] = useState(false);
  const [lang, setLang] = useState<"kk" | "ru">("kk");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Partial<A11yState>;
        const next: A11yState = {
          scale: typeof saved.scale === "number" ? saved.scale : 0,
          contrast: !!saved.contrast,
          reduced: !!saved.reduced,
        };
        setState(next);
        applyA11y(next);
      } catch {
        // ignore storage errors
      }
      setLang(document.documentElement.lang === "ru" ? "ru" : "kk");
    });
  }, []);

  function update(patch: Partial<A11yState>) {
    setState((prev) => {
      const next = { ...prev, ...patch };
      applyA11y(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function reset() {
    update({ scale: 0, contrast: false, reduced: false });
  }

  function toggleSpeak() {
    const t = lang === "ru" ? ru.a11y : kk.a11y;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error(t.ttsUnavailable);
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.querySelector("main")?.textContent?.replace(/\s+/g, " ").trim();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ru" ? "ru-RU" : "kk-KZ";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  const labels = lang === "ru" ? ru.a11y : kk.a11y;

  return { state, update, reset, speaking, toggleSpeak, labels };
}

export function AccessibilityControls({
  onPersist,
}: {
  onPersist?: (state: A11yState) => Promise<unknown> | void;
}) {
  const { state, update, reset, speaking, toggleSpeak, labels } = useAccessibilityPrefs();

  function handleUpdate(patch: Partial<A11yState>) {
    const next = { ...state, ...patch };
    update(patch);
    onPersist?.(next);
  }

  function handleReset() {
    const next = { scale: 0, contrast: false, reduced: false };
    reset();
    onPersist?.(next);
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn secondary"
          aria-label={labels.decreaseFont}
          onClick={() => handleUpdate({ scale: Math.max(-1, state.scale - 1) })}
        >
          <Minus size={18} /> A−
        </button>
        <button
          type="button"
          className="btn secondary"
          aria-label={labels.increaseFont}
          onClick={() => handleUpdate({ scale: Math.min(3, state.scale + 1) })}
        >
          <Plus size={18} /> A+
        </button>
        <button
          type="button"
          className={state.contrast ? "btn" : "btn secondary"}
          aria-pressed={state.contrast}
          onClick={() => handleUpdate({ contrast: !state.contrast })}
        >
          <Contrast size={18} /> {labels.highContrast}
        </button>
        <button
          type="button"
          className={state.reduced ? "btn" : "btn secondary"}
          aria-pressed={state.reduced}
          onClick={() => handleUpdate({ reduced: !state.reduced })}
        >
          <Activity size={18} /> {labels.reducedMotion}
        </button>
        <button
          type="button"
          className={speaking ? "btn" : "btn secondary"}
          aria-pressed={speaking}
          onClick={toggleSpeak}
        >
          {speaking ? <Square size={18} /> : <Volume2 size={18} />}
          {speaking ? labels.stopSpeak : labels.speak}
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={handleReset}
        >
          <RotateCcw size={18} /> {labels.reset}
        </button>
      </div>
    </div>
  );
}

export function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const { state, update, reset, speaking, toggleSpeak, labels } = useAccessibilityPrefs();

  return (
    <aside className="a11y-bar" aria-label={labels.label}>
      <button
        type="button"
        className="a11y-trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Accessibility size={18} />
        <span>{labels.label}</span>
      </button>
      {open && (
        <div className="a11y-tools" role="region" aria-label={labels.label}>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-label={labels.decreaseFont}
              onClick={() => update({ scale: Math.max(-1, state.scale - 1) })}
            >
              <Minus size={16} /> A−
            </button>
            <button
              type="button"
              aria-label={labels.increaseFont}
              onClick={() => update({ scale: Math.min(3, state.scale + 1) })}
            >
              <Plus size={16} /> A+
            </button>
          </div>
          <button
            type="button"
            aria-pressed={state.contrast}
            onClick={() => update({ contrast: !state.contrast })}
          >
            <Contrast size={16} /> {labels.highContrast}
          </button>
          <button
            type="button"
            aria-pressed={state.reduced}
            onClick={() => update({ reduced: !state.reduced })}
          >
            <Activity size={16} /> {labels.reducedMotion}
          </button>
          <button type="button" aria-pressed={speaking} onClick={toggleSpeak}>
            {speaking ? <Square size={16} /> : <Volume2 size={16} />}
            {speaking ? labels.stopSpeak : labels.speak}
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw size={16} /> {labels.reset}
          </button>
        </div>
      )}
    </aside>
  );
}
