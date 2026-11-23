"use client";

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function AiAssistant() {
  const [prompt, setPrompt] = useState("");
  const [task, setTask] = useState("lesson");
  const [grade, setGrade] = useState(3);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submit() {
    if (prompt.trim().length < 10) return;
    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ task, prompt, grade }),
      });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok) {
        toast.error(data.error || "Қызмет қолжетімсіз");
        return;
      }
      setResult(data.text || "");
    } finally {
      setLoading(false);
    }
  }

  async function copyDraft() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Нобай көшірілді");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
    >
      <section className="card form">
        <div className="grid gap-1">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <Sparkles size={20} />
            <h2 className="text-xl m-0">Педагогикалық AI көмекші</h2>
          </div>
          <p className="muted text-sm m-0">
            Ұсынылған нобайды міндетті түрде тексеріп, оқу мақсатына бейімдеңіз. AI материалды өздігінен жарияламайды.
          </p>
        </div>

        <div className="form-row">
          <label>
            Тапсырма түрі
            <select value={task} onChange={(e) => setTask(e.target.value)}>
              <option value="lesson">Сабақ нобайы</option>
              <option value="quiz">Тест сұрақтары</option>
              <option value="simplify">Мәтінді жеңілдету</option>
              <option value="differentiate">Деңгейге бейімдеу</option>
              <option value="activities">Сынып әрекеттері</option>
            </select>
          </label>
          <label>
            Сынып
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((g) => (
                <option key={g} value={g}>
                  {g}-сынып
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Сұрауыңыз (кемінде 10 таңба)
          <textarea
            rows={7}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="3-сыныпқа суды үнемдеу тақырыбында сабақ нобайын және 3 тапсырма ұсын..."
          />
        </label>

        <button
          type="button"
          disabled={loading || prompt.trim().length < 10}
          className="btn"
          onClick={submit}
        >
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? "Дайындалып жатыр..." : "Ұсыныс алу"}
        </button>
      </section>

      <section className="card grid gap-4 content-start">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl m-0">Мұғалім тексеретін нобай</h2>
          {result && (
            <button type="button" className="btn secondary sm" onClick={copyDraft}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Көшірілді" : "Көшіру"}
            </button>
          )}
        </div>
        {result ? (
          <div className="whitespace-pre-wrap text-sm leading-relaxed p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
            {result}
          </div>
        ) : (
          <p className="muted text-sm m-0">
            AI провайдері бапталмаған болса (<code>AI_API_URL</code>,{" "}
            <code>AI_API_KEY</code>, <code>AI_MODEL</code>), жүйе жалған жауап
            шығармайды және негізгі платформа толық жұмыс істей береді.
          </p>
        )}
      </section>
    </div>
  );
}
