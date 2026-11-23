import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const locale = await getLocale();
  const isRu = locale === "ru";

  return (
    <>
      <Header />
      <main id="main-content" className="container section flex flex-col items-center text-center gap-4 py-20">
        <span className="pill">404</span>
        <h1 className="max-w-xl">
          {isRu ? "Страница не найдена" : "Бет табылмады"}
        </h1>
        <p className="muted max-w-md">
          {isRu
            ? "Возможно, ссылка устарела или страница была перемещена. Вернитесь на главную или откройте раздел игр."
            : "Сілтеме ескірген немесе бет басқа мекенжайға көшірілген болуы мүмкін. Басты бетке немесе ойындар бөліміне өтіңіз."}
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <Link href="/" className="btn">
            {isRu ? "На главную" : "Басты бетке оралу"}
          </Link>
          <Link href="/games" className="btn secondary">
            {isRu ? "Обучающие игры" : "Оқу ойындары"}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

