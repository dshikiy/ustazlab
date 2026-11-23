import Link from "next/link";
import {
  HeartHandshake,
  MessageCircle,
  Accessibility,
  ChartNoAxesCombined,
  Gamepad2,
  ClipboardCheck,
} from "lucide-react";
import { getLocale, getMessages } from "@/lib/i18n/server";

export default async function InclusiveOverviewPage() {
  const [locale, m] = await Promise.all([getLocale(), getMessages()]);
  const isRu = locale === "ru";

  const cards = [
    {
      icon: HeartHandshake,
      title: isRu ? "Инклюзивные уроки" : "Инклюзивті сабақтар",
      desc: isRu
        ? "Пошаговый визуальный урок с озвучиванием и спокойным темпом."
        : "Дыбыстау және түсінікті қадамдары бар көрнекі сабақ.",
      href: "/inclusive/lessons",
    },
    {
      icon: Gamepad2,
      title: isRu ? "Адаптивные игры" : "Бейімделген ойындар",
      desc: isRu
        ? "Выбор эмоций, распорядок дня и доступные учебные игры."
        : "Эмоцияны таңдау, күн тәртібі және қолжетімді оқу ойындары.",
      href: "/inclusive/games",
    },
    {
      icon: ClipboardCheck,
      title: isRu ? "Мини-тест из 4 вопросов" : "4 сұрақтық шағын тест",
      desc: isRu
        ? "Короткий тест с крупными кнопками и голосовым сопровождением."
        : "Үлкен батырмалар мен дыбыстауы бар түсінікті шағын тест.",
      href: "/inclusive/quizzes",
    },
    {
      icon: MessageCircle,
      title: isRu ? "Карточки общения AAC" : "AAC қарым-қатынас карточкалары",
      desc: isRu
        ? "Быстрое выражение просьб и состояния с помощью карточек и озвучки."
        : "Өтініш пен қажеттілікті карточка және дыбыс арқылы білдіру.",
      href: "/inclusive/communication",
    },
    {
      icon: Accessibility,
      title: isRu ? "Настройки доступности" : "Қолжетімділік баптаулары",
      desc: isRu
        ? "Размер шрифта, высокий контраст, уменьшение движения и озвучивание."
        : "Қаріп өлшемі, жоғары контраст, қозғалысты азайту және TTS.",
      href: "/inclusive/settings",
    },
    {
      icon: ChartNoAxesCombined,
      title: isRu ? "Учебный прогресс" : "Оқу ілгерілеуі",
      desc: isRu
        ? "Отслеживание выполненных шагов без сбора медицинских данных."
        : "Медициналық дерек жинамай, жеке оқу ілгерілеуін бақылау.",
      href: "/inclusive/progress",
    },
  ];

  return (
    <div className="grid gap-6">
      <div className="max-w-2xl">
        <div className="eyebrow">{isRu ? "Каждый ребёнок важен" : "Әр бала маңызды"}</div>
        <h1 className="m-0">{m.inclusive.title}</h1>
        <p className="muted text-lg mt-2 mb-0">{m.inclusive.subtitle}</p>
      </div>

      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.href} className="card grid gap-3 content-start">
              <div className="w-11 h-11 rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)] grid place-items-center">
                <Icon size={22} />
              </div>
              <h2 className="text-xl m-0">{item.title}</h2>
              <p className="muted text-sm m-0">{item.desc}</p>
              <Link href={item.href} className="btn secondary sm w-max mt-2">
                {m.common.open} →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
