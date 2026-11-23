import { getLocale } from "@/lib/i18n/server";
import { InclusiveQuizPlayer } from "@/components/inclusive-module";

export default async function InclusiveQuizzesPage() {
  const locale = await getLocale();
  const isRu = locale === "ru";

  return (
    <div className="grid gap-6">
      <div>
        <div className="eyebrow">{isRu ? "Проверка понимания" : "Түсінуді тексеру"}</div>
        <h1 className="text-3xl m-0">
          {isRu ? "Инклюзивный тест (4 вопроса)" : "Инклюзивті тест (4 сұрақ)"}
        </h1>
      </div>
      <InclusiveQuizPlayer locale={locale} />
    </div>
  );
}
