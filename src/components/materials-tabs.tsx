"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Volume2, Printer, Download, Heart, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { toggleMaterialFavorite } from "@/lib/material-actions";
import { Modal } from "@/components/ui/modal";

interface Material {
  id: string;
  title: string;
  description: string | null;
  category: string;
  grade: number | null;
  subject?: string | null;
  url: string;
}

const COMMUNICATION_CARDS = [
  ["🆘", "Маған көмектесіңіз", "Помогите мне"],
  ["⏳", "Маған уақыт керек", "Мне нужно время"],
  ["💧", "Су ішкім келеді", "Я хочу пить"],
  ["🔁", "Қайталап беріңіз", "Повторите, пожалуйста"],
  ["✅", "Мен дайынмын", "Я готов(а)"],
  ["🌿", "Маған үзіліс керек", "Мне нужен перерыв"],
  ["🤫", "Тыныштық керек", "Мне нужна тишина"],
  ["🚻", "Дәретханаға барғым келеді", "Мне нужно в туалет"],
] as const;

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    toast.error("Дыбыстау қолжетімсіз");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.documentElement.lang === "ru" ? "ru-RU" : "kk-KZ";
  window.speechSynthesis.speak(utterance);
}

export function MaterialsTabs({
  materials,
  favorites = [],
  canFavorite = false,
}: {
  materials: Material[];
  favorites?: string[];
  canFavorite?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [category, setCategory] = useState("all");
  const [subject, setSubject] = useState("all");
  const [previewItem, setPreviewItem] = useState<Material | null>(null);

  const categories = [...new Set(materials.map((item) => item.category))];
  const subjects = [
    ...new Set(materials.map((item) => item.subject).filter((s): s is string => !!s)),
  ];

  const filtered = useMemo(
    () =>
      materials.filter(
        (item) =>
          (!query ||
            `${item.title} ${item.description || ""}`
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase())) &&
          (grade === "all" || item.grade === Number(grade)) &&
          (category === "all" || item.category === category) &&
          (subject === "all" || item.subject === subject)
      ),
    [materials, query, grade, category, subject]
  );

  return (
    <>
      <Tabs.Root defaultValue="materials">
        <Tabs.List className="card flex flex-wrap gap-2 mb-6 p-2">
          <Tabs.Trigger
            className="btn secondary sm data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white"
            value="materials"
          >
            Дидактикалық материалдар
          </Tabs.Trigger>
          <Tabs.Trigger
            className="btn secondary sm data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white"
            value="communication"
          >
            Қарым-қатынас карточкалары
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="materials">
          <div
            className="card grid gap-3 mb-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}
          >
            <label>
              <span className="muted">Іздеу</span>
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-3 text-[var(--muted)]"
                  aria-hidden="true"
                />
                <input
                  style={{ paddingLeft: 38 }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Материал атауы..."
                />
              </div>
            </label>
            <label>
              Сынып
              <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                <option value="all">Барлығы</option>
                {[1, 2, 3, 4].map((x) => (
                  <option value={x} key={x}>
                    {x}-сынып
                  </option>
                ))}
              </select>
            </label>
            <label>
              Санат
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">Барлығы</option>
                {categories.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            {subjects.length > 0 && (
              <label>
                Пән
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option value="all">Барлығы</option>
                  {subjects.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {filtered.length ? (
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
            >
              {filtered.map((material) => (
                <article className="card grid gap-3 content-start" key={material.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="pill">
                      {material.grade ? `${material.grade}-сынып · ` : ""}
                      {material.category}
                    </span>
                    {canFavorite && (
                      <form action={toggleMaterialFavorite.bind(null, material.id)}>
                        <button
                          type="submit"
                          className="icon-btn"
                          aria-label="Таңдаулыға қосу"
                        >
                          <Heart
                            size={18}
                            fill={favorites.includes(material.id) ? "#EF4444" : "none"}
                            color={
                              favorites.includes(material.id)
                                ? "#EF4444"
                                : "currentColor"
                            }
                          />
                        </button>
                      </form>
                    )}
                  </div>
                  <h3 className="m-0">{material.title}</h3>
                  <p className="muted text-sm m-0">{material.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2 mt-auto">
                    <button
                      type="button"
                      className="btn secondary sm"
                      onClick={() => setPreviewItem(material)}
                    >
                      <Eye size={16} />
                      Көру
                    </button>
                    <a className="btn secondary sm" href={material.url}>
                      <Download size={16} />
                      Жүктеу
                    </a>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label="Басып шығару"
                      onClick={() => window.print()}
                    >
                      <Printer size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card text-center py-10">
              <h3>Материал табылмады</h3>
              <p className="muted m-0">Іздеу сөзін немесе сүзгіні өзгертіп көріңіз.</p>
            </div>
          )}
        </Tabs.Content>

        <Tabs.Content value="communication">
          <p className="muted mb-5">
            Сөйлеу немесе қарым-қатынас қиындығы бар балаларға ойын, өтініш пен қажеттілікті білдіруге көмектеседі.
          </p>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
          >
            {COMMUNICATION_CARDS.map(([emoji, kkText, ruText]) => (
              <article
                className="card text-center grid gap-2 justify-items-center"
                key={kkText}
              >
                <div className="text-5xl" aria-hidden="true">
                  {emoji}
                </div>
                <h3 className="m-0">{kkText}</h3>
                <p className="muted text-sm m-0">{ruText}</p>
                <button
                  type="button"
                  className="btn sm mt-1"
                  onClick={() => speak(kkText)}
                >
                  <Volume2 size={16} />
                  Тыңдау
                </button>
              </article>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <Modal
        open={!!previewItem}
        onOpenChange={(open) => !open && setPreviewItem(null)}
        title={previewItem?.title || ""}
        description={previewItem?.category}
      >
        {previewItem && (
          <div className="grid gap-4">
            <p className="m-0 text-sm leading-relaxed">
              {previewItem.description || "Бастауыш сыныпқа арналған оқу материалы."}
            </p>
            <div className="flex flex-wrap gap-2 text-xs muted">
              {previewItem.grade && <span className="pill">{previewItem.grade}-сынып</span>}
              {previewItem.subject && <span className="pill teal">{previewItem.subject}</span>}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <a className="btn" href={previewItem.url}>
                <Download size={16} /> Жүктеу
              </a>
              <button
                type="button"
                className="btn secondary"
                onClick={() => window.print()}
              >
                <Printer size={16} /> Басып шығару
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
