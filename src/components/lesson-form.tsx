"use client";

import { useState } from "react";
import { Sparkles, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { createLessonAction, updateLessonAction } from "@/lib/actions";
import { toast } from "sonner";

export interface LessonStageItem {
  id: string;
  title: string;
  duration: number;
  teacherActivities: string;
  studentActivities: string;
  assessment: string;
  resources: string;
}

export interface InitialLessonData {
  id: string;
  title: string;
  grade: number;
  subject: string;
  topic: string;
  objectives: string;
  duration: number;
  school: string | null;
  lessonDate: string | null;
  resources: string | null;
  assessment: string | null;
  stages: LessonStageItem[];
}

const DEFAULT_STAGES: LessonStageItem[] = [
  {
    id: "stage-1",
    title: "Сабақтың басы",
    duration: 5,
    teacherActivities:
      "Амандасады, жағымды ахуал қалыптастырады. Сабақ мақсаты мен бағалау критерийлерін таныстырады.",
    studentActivities:
      "Шеңберде жылы лебіз білдіреді, сабақ мақсатын өз сөзімен айтады.",
    assessment: "Ауызша мадақтау",
    resources: "Слайд, оқу мақсаты карточкасы",
  },
  {
    id: "stage-2",
    title: "Сабақтың ортасы",
    duration: 25,
    teacherActivities:
      "Көрнекілік арқылы жаңа ұғымды түсіндіреді. Жұптық және топтық зерттеу тапсырмаларын ұйымдастырады.",
    studentActivities:
      "Бақылайды, салыстырады, топта талқылайды және дәлелді жауап ұсынады.",
    assessment: "Қалыптастырушы бағалау дескрипторлары",
    resources: "Жұмыс парағы, көрнекі суреттер",
  },
  {
    id: "stage-3",
    title: "Сабақтың соңы",
    duration: 10,
    teacherActivities:
      "Нәтижені қорытындылап, рефлексия және кері байланыс ұйымдастырады.",
    studentActivities:
      "Өзін бағалайды, бір пайдалы әрекетті атайды және рефлексия жасайды.",
    assessment: "Өзін-өзі бағалау",
    resources: "Рефлексия карточкалары",
  },
];

export function LessonForm({
  teacher,
  initial,
}: {
  teacher: string;
  initial?: InitialLessonData;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [school, setSchool] = useState(initial?.school || "");
  const [grade, setGrade] = useState(initial?.grade || 3);
  const [subject, setSubject] = useState(initial?.subject || "Дүниетану");
  const [topic, setTopic] = useState(initial?.topic || "");
  const [objectives, setObjectives] = useState(initial?.objectives || "");
  const [duration, setDuration] = useState(initial?.duration || 40);
  const [lessonDate, setLessonDate] = useState(initial?.lessonDate || "");
  const [assessment, setAssessment] = useState(initial?.assessment || "");
  const [methods, setMethods] = useState("Топтық жұмыс, сұрақ-жауап, визуалды қолдау");
  const [inclusive, setInclusive] = useState<string[]>([]);
  const [stages, setStages] = useState<LessonStageItem[]>(
    initial?.stages?.length ? initial.stages : DEFAULT_STAGES
  );

  function autoFill() {
    setTitle("Табиғатты бірге қорғайық");
    setTopic("Табиғатты қорғау жолдары");
    setObjectives(
      "Табиғатты қорғау әрекеттерін анықтау; күнделікті өмірде экологиялық жауапкершілік таныту; өз шешімін түсіндіру."
    );
    setAssessment(
      "Табиғатты қорғайтын кемінде үш әрекетті атайды; дұрыс және зиянды әрекетті ажыратады."
    );
    setStages(DEFAULT_STAGES);
    toast.success("ҚМЖ үлгісі толтырылды");
  }

  function toggleInclusive(item: string) {
    setInclusive((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  function addStage() {
    if (stages.length >= 12) return;
    setStages((prev) => [
      ...prev,
      {
        id: `stage-${Date.now()}`,
        title: `${prev.length + 1}-кезең`,
        duration: 10,
        teacherActivities: "",
        studentActivities: "",
        assessment: "",
        resources: "",
      },
    ]);
  }

  function updateStage(index: number, patch: Partial<LessonStageItem>) {
    setStages((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    );
  }

  function removeStage(index: number) {
    if (stages.length <= 1) return;
    setStages((prev) => prev.filter((_, idx) => idx !== index));
  }

  function moveStage(index: number, direction: -1 | 1) {
    setStages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  const formAction = initial
    ? updateLessonAction.bind(null, initial.id)
    : createLessonAction;

  const combinedResources = initial?.resources
    ? initial.resources
    : `Әдістер: ${methods}. Бейімдеу: ${inclusive.join(", ") || "жалпы"}`;

  return (
    <form action={formAction} className="form card">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <h2 className="text-xl m-0">
          {initial ? "Сабақ жоспарын өңдеу" : "Сабақ туралы ақпарат"}
        </h2>
        {!initial && (
          <button type="button" className="btn secondary sm" onClick={autoFill}>
            <Sparkles size={16} />
            ҚМЖ үлгісін авто-толтыру
          </button>
        )}
      </div>

      <div className="form-row">
        <label>
          Мұғалім
          <input value={teacher} readOnly />
        </label>
        <label>
          Мектеп
          <input
            name="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="№1 мектеп-гимназия"
          />
        </label>
      </div>

      <label>
        Жоспар атауы
        <input
          name="title"
          required
          minLength={3}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Табиғатты бірге қорғайық"
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
            placeholder="Дүниетану"
          />
        </label>
      </div>

      <label>
        Сабақ тақырыбы
        <input
          name="topic"
          required
          minLength={3}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Табиғатты қорғау жолдары"
        />
      </label>

      <label>
        Оқу мақсаттары
        <textarea
          name="objectives"
          required
          minLength={10}
          rows={3}
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          placeholder="Сабақтың нақты оқу мақсаттарын жазыңыз..."
        />
      </label>

      <div className="form-row">
        <label>
          Ұзақтығы (минут)
          <input
            name="duration"
            type="number"
            min={10}
            max={240}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>
        <label>
          Күні
          <input
            name="date"
            type="date"
            value={lessonDate}
            onChange={(e) => setLessonDate(e.target.value)}
          />
        </label>
      </div>

      <label>
        Оқыту әдістері мен ресурстар
        <input
          value={methods}
          onChange={(e) => setMethods(e.target.value)}
          placeholder="Топтық жұмыс, ойын әдісі, көрнекі карточкалар"
        />
      </label>

      <fieldset className="card p-4">
        <legend className="font-semibold text-sm px-2">Инклюзивті бейімдеу</legend>
        <div className="flex flex-wrap gap-4 pt-1">
          {["Үлкен қаріп", "Көрнекілік", "Қосымша уақыт", "Қарым-қатынас карточкалары"].map(
            (item) => (
              <label key={item} className="flex items-center gap-2 font-medium cursor-pointer">
                <input
                  style={{ width: "auto" }}
                  type="checkbox"
                  checked={inclusive.includes(item)}
                  onChange={() => toggleInclusive(item)}
                />
                {item}
              </label>
            )
          )}
        </div>
        <input type="hidden" name="resources" value={combinedResources} />
      </fieldset>

      <label>
        Бағалау критерийлері
        <textarea
          name="assessment"
          rows={2}
          value={assessment}
          onChange={(e) => setAssessment(e.target.value)}
          placeholder="Қалыптастырушы бағалау критерийлері..."
        />
      </label>

      {/* Dynamic Stages Builder */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h3 className="m-0">Сабақ кезеңдері ({stages.length})</h3>
        <button type="button" className="btn secondary sm" onClick={addStage}>
          <Plus size={16} />
          Кезең қосу
        </button>
      </div>

      <input type="hidden" name="stagesJson" value={JSON.stringify(stages)} />

      <div className="grid gap-4">
        {stages.map((stage, index) => (
          <fieldset className="card p-4 grid gap-3" key={stage.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="pill">{index + 1}-кезең</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Жоғары жылжыту"
                  disabled={index === 0}
                  onClick={() => moveStage(index, -1)}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Төмен жылжыту"
                  disabled={index === stages.length - 1}
                  onClick={() => moveStage(index, 1)}
                >
                  <ArrowDown size={16} />
                </button>
                {stages.length > 1 && (
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Кезеңді жою"
                    onClick={() => removeStage(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="form-row">
              <label>
                Кезең атауы
                <input
                  value={stage.title}
                  required
                  onChange={(e) => updateStage(index, { title: e.target.value })}
                />
              </label>
              <label>
                Уақыты (мин)
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={stage.duration}
                  onChange={(e) =>
                    updateStage(index, { duration: Number(e.target.value) || 5 })
                  }
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Мұғалім әрекеті
                <textarea
                  rows={3}
                  value={stage.teacherActivities}
                  onChange={(e) =>
                    updateStage(index, { teacherActivities: e.target.value })
                  }
                />
              </label>
              <label>
                Оқушы әрекеті
                <textarea
                  rows={3}
                  value={stage.studentActivities}
                  onChange={(e) =>
                    updateStage(index, { studentActivities: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Бағалау
                <input
                  value={stage.assessment}
                  onChange={(e) => updateStage(index, { assessment: e.target.value })}
                />
              </label>
              <label>
                Ресурстар
                <input
                  value={stage.resources}
                  onChange={(e) => updateStage(index, { resources: e.target.value })}
                />
              </label>
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" className="btn">
          {initial ? "Өзгерістерді сақтау" : "Жоспарды сақтау"}
        </button>
      </div>
    </form>
  );
}
