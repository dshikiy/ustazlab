import Link from "next/link";
import {
  BookOpen,
  Gamepad2,
  ChartNoAxesCombined,
  HeartHandshake,
  FileText,
  ShieldCheck,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Accordion } from "@/components/ui/accordion";
import { InteractiveProductPreview, TaglineReveal } from "@/components/home-interactive";
import { getLocale, getMessages } from "@/lib/i18n/server";

export default async function Home() {
  const [locale, m] = await Promise.all([getLocale(), getMessages()]);
  const isRu = locale === "ru";

  const advantages = [
    {
      icon: BookOpen,
      title: isRu ? "Конструктор КСП за 15 минут" : "15 минутта дайын ҚМЖ",
      description: isRu
        ? "Добавляйте, меняйте и переставляйте этапы урока. Скачивайте готовый документ в PDF и DOCX."
        : "Сабақ кезеңдерін қосыңыз, өңдеңіз және реттеңіз. Дайын жоспарды PDF және DOCX форматында жүктеңіз.",
    },
    {
      icon: ClipboardCheck,
      title: isRu ? "Безопасные тесты с проверкой" : "Серверлік бағаланатын тесттер",
      description: isRu
        ? "Один ответ, несколько ответов, верно или неверно и короткий ответ. Проверка всегда идёт на сервере."
        : "Бір жауап, бірнеше жауап, дұрыс немесе бұрыс және қысқа жауап. Бағалау тек серверде жүргізіледі.",
    },
    {
      icon: Gamepad2,
      title: isRu ? "Интерактивные учебные игры" : "Интерактивті оқу ойындары",
      description: isRu
        ? "Игры для начальной школы с озвучкой, управлением с клавиатуры и сохранением результатов."
        : "Бастауыш сыныпқа арналған дыбыстық, пернетақтамен басқарылатын және нәтиже сақтайтын ойындар.",
    },
    {
      icon: HeartHandshake,
      title: isRu ? "Инклюзивный модуль" : "Инклюзивті білім модулі",
      description: isRu
        ? "Адаптированные уроки, карточки общения AAC, крупный шрифт, высокий контраст и озвучивание."
        : "Бейімделген сабақтар, AAC қарым-қатынас карточкалары, үлкен қаріп, контраст және мәтінді дыбыстау.",
    },
    {
      icon: ChartNoAxesCombined,
      title: isRu ? "Аналитика по реальным попыткам" : "Нақты деректерге негізделген аналитика",
      description: isRu
        ? "Отслеживайте средний балл, точность и прогресс учеников без ручного подсчёта."
        : "Орташа ұпай, дәлдік және оқушылардың ілгерілеуін қолмен есептемей бақылаңыз.",
    },
    {
      icon: ShieldCheck,
      title: isRu ? "Защита данных и ролевой доступ" : "Деректер қауіпсіздігі және рөлдік қолжетімділік",
      description: isRu
        ? "Личные планы учителей изолированы. Ученики видят только свои задания и игры."
        : "Мұғалімдердің жеке жоспарлары қорғалған. Оқушылар тек өз тапсырмалары мен ойындарын көреді.",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: isRu ? "Соберите урок и тест" : "Сабақ пен тестті құрастырыңыз",
      description: isRu
        ? "Заполните цели обучения, этапы урока и вопросы теста или используйте AI помощник для черновика."
        : "Оқу мақсаттарын, сабақ кезеңдерін және тест сұрақтарын толтырыңыз немесе AI көмекшімен нобай жасаңыз.",
    },
    {
      step: "02",
      title: isRu ? "Проведите занятие в классе" : "Сыныпта сабақты өткізіңіз",
      description: isRu
        ? "Поделитесь безопасной ссылкой на тест, запустите учебные игры и откройте инклюзивные карточки."
        : "Тестке қауіпсіз сілтеме жіберіңіз, оқу ойындарын іске қосыңыз және инклюзивті карточкаларды пайдаланыңыз.",
    },
    {
      step: "03",
      title: isRu ? "Получите аналитику и документы" : "Аналитика мен құжаттарды алыңыз",
      description: isRu
        ? "Скачайте КСП в PDF или DOCX и просмотрите статистику ответов учеников в кабинете."
        : "ҚМЖ құжатын PDF немесе DOCX форматында жүктеп, кабинетте оқушылардың нәтижесін талдаңыз.",
    },
  ];

  const gamesPreview = [
    {
      emoji: "🐺",
      title: isRu ? "Угадай животное" : "Жануарды тап",
      desc: isRu ? "Звуки и факты о животных Казахстана" : "Қазақстан жануарларының дыбысы мен ерекшелігі",
      href: "/games/animals",
    },
    {
      emoji: "♻️",
      title: isRu ? "Сортировка отходов" : "Қоқысты сұрыптау",
      desc: isRu ? "Перетаскивание и сортировка по контейнерам" : "Қалдықтарды контейнерлерге дұрыс бөлу",
      href: "/games/recycling",
    },
    {
      emoji: "🌿",
      title: isRu ? "Эко выбор" : "Табиғатты қорға",
      desc: isRu ? "Выбор правильных экологических действий" : "Дұрыс экологиялық әрекетті таңдау",
      href: "/games/nature",
    },
    {
      emoji: "🧠",
      title: isRu ? "Карточки памяти" : "Жад карточкалары",
      desc: isRu ? "Поиск парных карточек по теме природы" : "Табиғат тақырыбындағы жұптарды табу",
      href: "/games/memory",
    },
  ];

  const faqs = [
    {
      q: isRu ? "Сколько стоит использование UstazLab?" : "UstazLab платформасын пайдалану тегін бе?",
      a: isRu
        ? "Основные инструменты конструктора уроков, тестов, игр, материалов и инклюзивного модуля полностью бесплатны для учителей и учеников."
        : "ҚМЖ конструкторы, тесттер, оқу ойындары, материалдар және инклюзивті білім модулінің барлық негізгі құралдары тегін қолжетімді.",
    },
    {
      q: isRu ? "На каких языках работает платформа?" : "Платформа қай тілдерде жұмыс істейді?",
      a: isRu
        ? "Казахский язык установлен по умолчанию, русский язык полностью поддерживается с переключением в один клик."
        : "Қазақ тілі әдепкі тіл ретінде орнатылған, орыс тілі де бір батырмамен толық ауыстырылады.",
    },
    {
      q: isRu ? "Можно ли скачать план урока для печати?" : "Сабақ жоспарын басып шығаруға немесе жүктеуге бола ма?",
      a: isRu
        ? "Да, каждый план урока экспортируется в форматы PDF и DOCX, а также имеет чистую версию для печати."
        : "Иә, әрбір сабақ жоспары PDF және DOCX форматтарына экспортталады және басып шығаруға бейімделген.",
    },
    {
      q: isRu ? "Нужна ли регистрация ученикам для прохождения теста?" : "Оқушылар тест тапсыру үшін тіркелуі міндетті ме?",
      a: isRu
        ? "Нет, учитель может отправить прямую ссылку на опубликованный тест, либо ученик может войти в свой личный кабинет."
        : "Жоқ, мұғалім жарияланған тесттің сілтемесін жібере алады немесе оқушы өз жеке кабинеті арқылы кіре алады.",
    },
    {
      q: isRu ? "Подходит ли платформа для инклюзивного образования?" : "Платформа инклюзивті білім беруге жарамды ма?",
      a: isRu
        ? "Да. Встроен отдельный инклюзивный модуль с карточками общения AAC, адаптивными заданиями, крупным шрифтом, высоким контрастом и озвучиванием."
        : "Иә. Арнайы инклюзивті бөлімде AAC қарым-қатынас карточкалары, бейімделген тапсырмалар, үлкен қаріп, жоғары контраст және дыбыстау бар.",
    },
    {
      q: isRu ? "Работает ли сайт на телефонах и планшетах?" : "Платформа телефон мен планшетте дұрыс ашыла ма?",
      a: isRu
        ? "Да, интерфейс полностью адаптирован от 320px до широких мониторов и поддерживает сенсорное и клавиатурное управление."
        : "Иә, интерфейс 320px смартфоннан бастап кең экранды мониторларға дейін толық бейімделген.",
    },
  ];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div
            className="container hero-grid grid gap-10 items-center"
            style={{ gridTemplateColumns: "1.1fr 0.9fr" }}
          >
            <div className="grid gap-5">
              <div className="eyebrow">
                <Sparkles size={16} />
                {m.home.eyebrow}
              </div>
              <h1 className="hero-heading max-w-[680px] m-0">
                {m.home.title}
              </h1>
              <p className="muted text-lg max-w-[680px] m-0 leading-relaxed">
                {m.home.lead}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link className="btn lg" href="/register">
                  {m.home.primaryCta}
                  <ArrowRight size={18} />
                </Link>
                <Link className="btn secondary lg" href="#features">
                  {m.home.secondaryCta}
                </Link>
              </div>
              <p className="text-xs font-semibold muted m-0 pt-1">
                {m.home.proofLine}
              </p>
            </div>

            <InteractiveProductPreview locale={locale} />
          </div>
        </section>

        {/* Asymmetric Bento Feature Showcase */}
        <section id="features" className="section">
          <div className="container">
            <div className="mb-10 max-w-[680px]">
              <div className="eyebrow">{m.home.advantagesEyebrow}</div>
              <h2>{m.home.advantagesTitle}</h2>
            </div>

            <div className="bento-grid">
              {/* 1. Lesson Builder — Wide Card */}
              <article className="card bento-span-7 grid gap-4 content-between">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <span className="pill">
                      <BookOpen size={14} /> {isRu ? "Конструктор КСП" : "ҚМЖ конструкторы"}
                    </span>
                  </div>
                  <h3 className="text-xl m-0">{advantages[0].title}</h3>
                  <p className="muted text-sm m-0">{advantages[0].description}</p>
                </div>
                <div className="grid gap-2 p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)]">
                  {[
                    [isRu ? "01 · Начало урока" : "01 · Сабақтың басы", "5 мин"],
                    [isRu ? "02 · Основная часть" : "02 · Сабақтың ортасы", "25 мин"],
                    [isRu ? "03 · Рефлексия" : "03 · Сабақтың соңы", "10 мин"],
                  ].map(([label, time]) => (
                    <div key={label} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold">
                      <span>{label}</span>
                      <span className="pill teal">{time}</span>
                    </div>
                  ))}
                </div>
              </article>

              {/* 2. Quiz Builder — Compact Card */}
              <article className="card bento-span-5 grid gap-4 content-between">
                <div className="grid gap-2">
                  <span className="pill teal w-max">
                    <ClipboardCheck size={14} /> {isRu ? "Тесты" : "Тесттер"}
                  </span>
                  <h3 className="text-xl m-0">{advantages[1].title}</h3>
                  <p className="muted text-sm m-0">{advantages[1].description}</p>
                </div>
                <div className="grid gap-2 p-3.5 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)]">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>SINGLE · MULTIPLE · SHORT</span>
                    <span className="pill success">Server Scored</span>
                  </div>
                  <div className="progress"><div style={{ width: "86%" }} /></div>
                </div>
              </article>

              {/* 3. Inclusive Education */}
              <article className="card bento-span-5 grid gap-4 content-between">
                <div className="grid gap-2">
                  <span className="pill w-max">
                    <HeartHandshake size={14} /> WCAG 2.2 AA
                  </span>
                  <h3 className="text-xl m-0">{advantages[3].title}</h3>
                  <p className="muted text-sm m-0">{advantages[3].description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["A+", "A−", "TTS", "AAC", isRu ? "Контраст" : "Контраст"].map((chip) => (
                    <span key={chip} className="pill">{chip}</span>
                  ))}
                </div>
              </article>

              {/* 4. Educational Games & Analytics */}
              <article className="card bento-span-7 grid gap-4 content-between">
                <div className="grid gap-2">
                  <span className="pill warning w-max">
                    <Gamepad2 size={14} /> {isRu ? "Игры и аналитика" : "Ойындар және аналитика"}
                  </span>
                  <h3 className="text-xl m-0">{advantages[2].title}</h3>
                  <p className="muted text-sm m-0">{advantages[4].description}</p>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    ["🐺", isRu ? "Животные" : "Жануарлар"],
                    ["♻️", isRu ? "Сортировка" : "Сұрыптау"],
                    ["🧠", isRu ? "Память" : "Жад ойыны"],
                  ].map(([emoji, title]) => (
                    <div key={title} className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-center grid gap-1">
                      <span className="text-2xl" aria-hidden="true">{emoji}</span>
                      <span className="text-xs font-semibold">{title}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Mandatory Tagline Reveal */}
        <TaglineReveal text={m.home.tagline} />

        {/* Teacher Workflow */}
        <section className="section">
          <div className="container">
            <div className="mb-10 max-w-[680px]">
              <div className="eyebrow">{m.home.workflowEyebrow}</div>
              <h2>{m.home.workflowTitle}</h2>
            </div>
            <div className="grid feature-grid">
              {workflowSteps.map((s) => (
                <article className="card grid gap-3 content-start" key={s.step}>
                  <span className="pill w-max">{s.step}</span>
                  <h3 className="m-0">{s.title}</h3>
                  <p className="muted text-sm m-0 leading-relaxed">{s.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Games Showcase */}
        <section className="section border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div className="max-w-[680px]">
                <div className="eyebrow">{m.home.gamesEyebrow}</div>
                <h2 className="m-0">{m.home.gamesTitle}</h2>
              </div>
              <Link href="/games" className="btn secondary">
                {m.common.allGames}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}
            >
              {gamesPreview.map((game) => (
                <Link
                  key={game.href}
                  href={game.href}
                  className="card no-underline text-inherit grid gap-3 hover:border-[var(--primary)]"
                >
                  <div className="text-4xl" aria-hidden="true">
                    {game.emoji}
                  </div>
                  <h3 className="m-0">{game.title}</h3>
                  <p className="muted text-sm m-0">{game.desc}</p>
                  <span className="text-sm font-semibold text-[var(--primary)] mt-auto pt-2">
                    {m.games.play} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Inclusive Education Highlight */}
        <section className="section border-t border-[var(--border)]">
          <div className="container">
            <div
              className="card grid gap-8 items-center p-8"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
            >
              <div className="grid gap-4">
                <div className="eyebrow">{m.home.inclusiveEyebrow}</div>
                <h2 className="m-0">{m.home.inclusiveTitle}</h2>
                <p className="muted text-base m-0">
                  {isRu
                    ? "Инклюзивный модуль помогает учителям адаптировать темп урока, использовать карточки общения AAC и настраивать интерфейс под зрительные и моторные потребности ученика."
                    : "Инклюзивті модуль мұғалімдерге сабақ қарқынын бейімдеуге, AAC қарым-қатынас карточкаларын қолдануға және интерфейсті оқушының қажеттілігіне сай баптауға мүмкіндік береді."}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/inclusive" className="btn">
                    {m.inclusive.navOverview}
                    <ArrowRight size={16} />
                  </Link>
                  <Link href="/inclusive/communication" className="btn secondary">
                    {m.inclusive.navCommunication}
                  </Link>
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  isRu ? "Пошаговый инклюзивный урок и тест из 4 вопросов" : "Қадамдық инклюзивті сабақ және 4 сұрақтық тест",
                  isRu ? "Карточки общения AAC с озвучиванием в браузере" : "Браузерде дыбысталатын AAC қарым-қатынас карточкалары",
                  isRu ? "Масштаб шрифта, высокий контраст и уменьшение анимаций" : "Қаріп өлшемі, жоғары контраст және қозғалысты азайту",
                  isRu ? "Без сбора медицинских диагнозов и лишних данных" : "Медициналық диагноз бен артық дербес дерек жиналмайды",
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-sm font-semibold"
                  >
                    <CheckCircle2 size={18} className="text-[var(--secondary)] shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="container max-w-3xl">
            <div className="mb-8">
              <div className="eyebrow">{m.home.faqEyebrow}</div>
              <h2>{m.home.faqTitle}</h2>
            </div>
            <Accordion
              items={faqs.map((item, idx) => ({
                id: `faq-${idx}`,
                question: item.q,
                answer: item.a,
              }))}
            />
          </div>
        </section>

        {/* Final Registration CTA */}
        <section className="section border-t border-[var(--border)]">
          <div className="container">
            <div className="card text-center py-12 px-6 grid gap-4 justify-items-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] grid place-items-center">
                <FileText size={24} />
              </div>
              <h2 className="max-w-[640px] m-0">{m.home.ctaTitle}</h2>
              <p className="muted max-w-[540px] m-0">{m.home.ctaLead}</p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <Link className="btn lg" href="/register">
                  {m.home.register}
                  <ArrowRight size={18} />
                </Link>
                <Link className="btn secondary lg" href="/materials">
                  {m.nav.materials}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
