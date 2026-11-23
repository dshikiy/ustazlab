"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { createQuizAction, updateQuizAction } from "@/lib/actions";

export interface QuizQuestionDraft {
  key: string;
  text: string;
  type: "SINGLE" | "MULTIPLE" | "TRUE_FALSE" | "SHORT";
  points: number;
  explanation: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface InitialQuizData {
  id: string;
  title: string;
  description: string | null;
  grade: number;
  subject: string;
  status: string;
  timeLimit: number | null;
  questions: QuizQuestionDraft[];
}

function makeEmptyQuestion(idx: number): QuizQuestionDraft {
  return {
    key: `q-${Date.now()}-${idx}`,
    text: "",
    type: "SINGLE",
    points: 1,
    explanation: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  };
}

export function QuizForm({ initial }: { initial?: InitialQuizData }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [grade, setGrade] = useState(initial?.grade || 3);
  const [subject, setSubject] = useState(initial?.subject || "Дүниетану");
  const [timeLimit, setTimeLimit] = useState(initial?.timeLimit || 0);
  const [publish, setPublish] = useState(initial?.status === "PUBLISHED");
  const [questions, setQuestions] = useState<QuizQuestionDraft[]>(
    initial?.questions?.length ? initial.questions : [makeEmptyQuestion(1)]
  );

  function addQuestion() {
    if (questions.length >= 25) return;
    setQuestions((prev) => [...prev, makeEmptyQuestion(prev.length + 1)]);
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    setQuestions((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  function updateQuestion(index: number, patch: Partial<QuizQuestionDraft>) {
    setQuestions((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    );
  }

  function changeType(index: number, nextType: QuizQuestionDraft["type"]) {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== index) return q;
        if (nextType === "TRUE_FALSE") {
          return {
            ...q,
            type: nextType,
            options: [
              { text: "Дұрыс", isCorrect: true },
              { text: "Бұрыс", isCorrect: false },
            ],
          };
        }
        if (nextType === "SHORT") {
          return {
            ...q,
            type: nextType,
            options: [{ text: q.options[0]?.text || "", isCorrect: true }],
          };
        }
        return {
          ...q,
          type: nextType,
          options:
            q.options.length >= 2
              ? q.options
              : [
                  { text: "", isCorrect: true },
                  { text: "", isCorrect: false },
                ],
        };
      })
    );
  }

  function updateOption(
    qIdx: number,
    oIdx: number,
    patch: Partial<{ text: string; isCorrect: boolean }>
  ) {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIdx) return q;
        const options = q.options.map((opt, i) => {
          if (q.type === "SINGLE" || q.type === "TRUE_FALSE") {
            if (patch.isCorrect) {
              return { ...opt, isCorrect: i === oIdx };
            }
          }
          return i === oIdx ? { ...opt, ...patch } : opt;
        });
        return { ...q, options };
      })
    );
  }

  function addOption(qIdx: number) {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === qIdx && q.options.length < 6
          ? { ...q, options: [...q.options, { text: "", isCorrect: false }] }
          : q
      )
    );
  }

  function removeOption(qIdx: number, oIdx: number) {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === qIdx && q.options.length > 2
          ? { ...q, options: q.options.filter((_, i) => i !== oIdx) }
          : q
      )
    );
  }

  const formAction = initial
    ? updateQuizAction.bind(null, initial.id)
    : createQuizAction;

  return (
    <form action={formAction} className="form card">
      <h2 className="text-xl m-0">
        {initial ? "Тестті өңдеу" : "Жаңа тест құрастыру"}
      </h2>

      <label>
        Тест атауы
        <input
          name="title"
          required
          minLength={3}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Табиғатты қорғау тесті"
        />
      </label>

      <label>
        Сипаттамасы
        <textarea
          name="description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Тест мақсаты мен нұсқаулығы..."
        />
      </label>

      <div className="form-row">
        <label>
          Сынып
          <select
            name="grade"
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
              <option key={g} value={g}>
                {g}-сынып
              </option>
            ))}
          </select>
        </label>
        <label>
          Пән
          <input
            name="subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
      </div>

      <label>
        Уақыт шегі (минут, 0 — шектеусіз)
        <input
          name="timeLimit"
          type="number"
          min={0}
          max={120}
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h3 className="m-0">Сұрақтар ({questions.length})</h3>
        <button type="button" className="btn secondary sm" onClick={addQuestion}>
          <Plus size={16} />
          Сұрақ қосу
        </button>
      </div>

      <input
        type="hidden"
        name="questionsJson"
        value={JSON.stringify(
          questions.map((q) => ({
            text: q.text,
            type: q.type,
            points: q.points,
            explanation: q.explanation,
            options: q.options.filter((o) => o.text.trim().length > 0),
          }))
        )}
      />

      <div className="grid gap-4">
        {questions.map((q, qIdx) => (
          <fieldset className="card p-4 grid gap-3" key={q.key}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="pill">{qIdx + 1}-сұрақ</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Жоғары"
                  disabled={qIdx === 0}
                  onClick={() => moveQuestion(qIdx, -1)}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Төмен"
                  disabled={qIdx === questions.length - 1}
                  onClick={() => moveQuestion(qIdx, 1)}
                >
                  <ArrowDown size={16} />
                </button>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Сұрақты жою"
                    onClick={() => removeQuestion(qIdx)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <label>
              Сұрақ мәтіні
              <input
                required
                value={q.text}
                onChange={(e) => updateQuestion(qIdx, { text: e.target.value })}
                placeholder="Сұрақты енгізіңіз..."
              />
            </label>

            <div className="form-row">
              <label>
                Сұрақ түрі
                <select
                  value={q.type}
                  onChange={(e) =>
                    changeType(qIdx, e.target.value as QuizQuestionDraft["type"])
                  }
                >
                  <option value="SINGLE">Бір дұрыс жауап</option>
                  <option value="MULTIPLE">Бірнеше дұрыс жауап</option>
                  <option value="TRUE_FALSE">Дұрыс / Бұрыс</option>
                  <option value="SHORT">Қысқа жауап</option>
                </select>
              </label>
              <label>
                Ұпай
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={q.points}
                  onChange={(e) =>
                    updateQuestion(qIdx, { points: Number(e.target.value) || 1 })
                  }
                />
              </label>
            </div>

            {q.type === "SHORT" ? (
              <label>
                Дұрыс қысқа жауап
                <input
                  required
                  value={q.options[0]?.text || ""}
                  onChange={(e) =>
                    updateOption(qIdx, 0, { text: e.target.value, isCorrect: true })
                  }
                  placeholder="Нақты жауап сөзі..."
                />
              </label>
            ) : (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    Жауап нұсқалары (дұрысын белгілеңіз)
                  </span>
                  {q.type !== "TRUE_FALSE" && q.options.length < 6 && (
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => addOption(qIdx)}
                    >
                      <Plus size={14} /> Нұсқа қосу
                    </button>
                  )}
                </div>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      style={{ width: "auto" }}
                      type={q.type === "MULTIPLE" ? "checkbox" : "radio"}
                      name={`correct-radio-${q.key}`}
                      checked={opt.isCorrect}
                      aria-label={`Дұрыс жауап ${oIdx + 1}`}
                      onChange={(e) =>
                        updateOption(qIdx, oIdx, { isCorrect: e.target.checked })
                      }
                    />
                    <input
                      required
                      value={opt.text}
                      readOnly={q.type === "TRUE_FALSE"}
                      onChange={(e) =>
                        updateOption(qIdx, oIdx, { text: e.target.value })
                      }
                      placeholder={`${oIdx + 1}-нұсқа`}
                    />
                    {q.type !== "TRUE_FALSE" && q.options.length > 2 && (
                      <button
                        type="button"
                        className="icon-btn shrink-0"
                        aria-label="Нұсқаны жою"
                        onClick={() => removeOption(qIdx, oIdx)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <label>
              Түсіндірме (нәтиже экранында көрсетіледі)
              <input
                value={q.explanation}
                onChange={(e) =>
                  updateQuestion(qIdx, { explanation: e.target.value })
                }
                placeholder="Неліктен бұл жауап дұрыс екенін қысқаша түсіндіріңіз..."
              />
            </label>
          </fieldset>
        ))}
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          style={{ width: "auto" }}
          type="checkbox"
          name="publish"
          value="yes"
          checked={publish}
          onChange={(e) => setPublish(e.target.checked)}
        />
        <span>Бірден жариялау (оқушыларға сілтеме ашық болады)</span>
      </label>

      <button type="submit" className="btn">
        {initial ? "Өзгерістерді сақтау" : "Тестті сақтау"}
      </button>
    </form>
  );
}
