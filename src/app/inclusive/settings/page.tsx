import { getLocale } from "@/lib/i18n/server";
import { InclusiveAccessibilityPanel } from "@/components/inclusive-module";

export default async function InclusiveSettingsPage() {
  const locale = await getLocale();
  const isRu = locale === "ru";

  return (
    <div className="grid gap-6">
      <div>
        <div className="eyebrow">WCAG 2.2 AA</div>
        <h1 className="text-3xl m-0">
          {isRu ? "Настройки доступности" : "Қолжетімділік баптаулары"}
        </h1>
      </div>
      <InclusiveAccessibilityPanel locale={locale} />
    </div>
  );
}
