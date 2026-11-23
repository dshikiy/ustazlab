import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLocale, getMessages } from "@/lib/i18n/server";

export default async function GamesPage() {
  const [locale, m] = await Promise.all([getLocale(), getMessages()]);
  const isRu = locale === "ru";

  const games = [
    {
      href: "/games/animals",
      emoji: "🐺",
      badge: isRu ? "Звуки и факты" : "Дыбыс пен фактілер",
      title: isRu ? "Угадай животное" : "Жануарды тап",
      description: isRu
        ? "Узнайте животных Казахстана по подсказкам и звукам."
        : "Қазақстан жануарларын сипаттамасы мен дыбысы арқылы табыңыз.",
    },
    {
      href: "/games/recycling",
      emoji: "♻️",
      badge: isRu ? "Сортировка" : "Сұрыптау",
      title: isRu ? "Сортировка отходов" : "Қоқысты сұрыптау",
      description: isRu
        ? "Распределите предметы по правильным контейнерам переработки."
        : "Заттарды пластик, қағаз, шыны және органика контейнерлеріне бөліңіз.",
    },
    {
      href: "/games/nature",
      emoji: "🌿",
      badge: isRu ? "Эко выбор" : "Эко таңдау",
      title: isRu ? "Береги природу" : "Табиғатты қорға",
      description: isRu
        ? "Выберите верное экологическое действие в каждой ситуации."
        : "Әр жағдаятта табиғатқа пайдалы дұрыс әрекетті таңдаңыз.",
    },
    {
      href: "/games/true-false",
      emoji: "✅",
      badge: isRu ? "Верно / Неверно" : "Дұрыс / Бұрыс",
      title: isRu ? "Правда или миф" : "Шындық па, әлде қате ме?",
      description: isRu
        ? "Быстрая проверка знаний об экологии и окружающем мире."
        : "Қоршаған орта туралы білімді жылдам тексеру ойыны.",
    },
    {
      href: "/games/memory",
      emoji: "🧠",
      badge: isRu ? "Память" : "Жад ойыны",
      title: isRu ? "Карточки памяти" : "Жад карточкалары",
      description: isRu
        ? "Откройте карточки и найдите все парные символы природы."
        : "Карточкаларды ашып, табиғатқа қатысты бірдей жұптарды табыңыз.",
    },
    {
      href: "/games/matching",
      emoji: "🔗",
      badge: isRu ? "Соответствия" : "Сәйкестендіру",
      title: isRu ? "Найди пару" : "Жұбын тап",
      description: isRu
        ? "Соедините природные понятия с их точным значением."
        : "Табиғат ұғымдарын олардың дұрыс мағынасымен сәйкестендіріңіз.",
    },
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="container section grid gap-8">
        <div className="max-w-2xl">
          <div className="eyebrow">UstazLab Games</div>
          <h1 className="m-0">{m.games.title}</h1>
          <p className="muted text-lg mt-2 mb-0">{m.games.subtitle}</p>
        </div>

        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {games.map((g) => (
            <article key={g.href} className="card grid gap-3 content-start">
              <div className="flex items-center justify-between gap-2">
                <span className="text-4xl" aria-hidden="true">{g.emoji}</span>
                <span className="pill">{g.badge}</span>
              </div>
              <h2 className="text-xl m-0">{g.title}</h2>
              <p className="muted text-sm m-0">{g.description}</p>
              <Link href={g.href} className="btn mt-2 w-max">
                {m.games.play}
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
