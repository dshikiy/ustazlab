import { getLocale } from "@/lib/i18n/server";
import { CommunicationBoard } from "@/components/inclusive-module";

export default async function InclusiveCommunicationPage() {
  const locale = await getLocale();
  const isRu = locale === "ru";

  return (
    <div className="grid gap-6">
      <div>
        <div className="eyebrow">AAC · Text-to-Speech</div>
        <h1 className="text-3xl m-0">
          {isRu ? "Карточки общения" : "Қарым-қатынас карточкалары"}
        </h1>
      </div>
      <CommunicationBoard locale={locale} />
    </div>
  );
}
