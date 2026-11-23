import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLocale } from "@/lib/i18n/server";

export default async function AboutPage() {
  const locale = await getLocale();
  const isRu = locale === "ru";

  return (
    <>
      <Header />
      <main id="main-content" className="container section grid gap-8 max-w-4xl">
        <div className="grid gap-3">
          <div className="eyebrow">UstazLab 2.0</div>
          <h1 className="m-0">
            {isRu
              ? "Образовательная платформа для школ Казахстана"
              : "Қазақстан мектептеріне арналған білім платформасы"}
          </h1>
          <p className="muted text-lg m-0">
            {isRu
              ? "UstazLab объединяет конструктор уроков КСП, тесты с серверной проверкой, интерактивные игры, библиотеку материалов и инструменты инклюзивного обучения."
              : "UstazLab ҚМЖ конструкторын, серверлік бағаланатын тесттерді, интерактивті ойындарды, материалдар кітапханасын және инклюзивті оқыту құралдарын біріктіреді."}
          </p>
        </div>

        <section id="privacy" className="card grid gap-3">
          <h2 className="text-xl m-0">
            {isRu ? "Политика конфиденциальности" : "Құпиялылық саясаты"}
          </h2>
          <p className="muted text-sm m-0 leading-relaxed">
            {isRu
              ? "Платформа собирает только минимально необходимые данные для входа и сохранения учебных материалов. Мы не собираем медицинские диагнозы или чувствительные данные о детях."
              : "Платформа тек жүйеге кіру және оқу материалдарын сақтау үшін қажетті ең аз деректерді өңдейді. Біз балалардың медициналық диагноздарын немесе артық дербес деректерін жинамаймыз."}
          </p>
        </section>

        <section id="terms" className="card grid gap-3">
          <h2 className="text-xl m-0">
            {isRu ? "Условия использования" : "Пайдалану шарттары"}
          </h2>
          <p className="muted text-sm m-0 leading-relaxed">
            {isRu
              ? "Учителя сохраняют полные права на созданные ими планы уроков и тесты. Сгенерированные AI черновики предназначены исключительно для проверки и редактирования педагогом."
              : "Мұғалімдер өздері жасаған сабақ жоспарлары мен тесттерге толық құқықты сақтайды. AI арқылы ұсынылған нобайлар міндетті түрде мұғалімнің тексеруіне арналған."}
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="btn">
            {isRu ? "Создать аккаунт" : "Аккаунт құру"}
          </Link>
          <Link href="/" className="btn secondary">
            {isRu ? "Вернуться на главную" : "Басты бетке оралу"}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
