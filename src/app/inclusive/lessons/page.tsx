import { getLocale } from "@/lib/i18n/server";
import { InclusiveLessonViewer } from "@/components/inclusive-module";

export default async function InclusiveLessonsPage() {
  const locale = await getLocale();
  const isRu = locale === "ru";

  return (
    <div className="grid gap-6">
      <div>
        <div className="eyebrow">{isRu ? "Пошаговый формат" : "Қадамдық формат"}</div>
        <h1 className="text-3xl m-0">
          {isRu ? "Инклюзивный урок" : "Инклюзивті сабақ"}
        </h1>
      </div>
      <InclusiveLessonViewer locale={locale} />
    </div>
  );
}
