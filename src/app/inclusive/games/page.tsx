import { db } from "@/db";
import { inclusiveActivities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getLocale } from "@/lib/i18n/server";
import { InclusiveActivities } from "@/components/inclusive-activities";
import Link from "next/link";

export default async function InclusiveGamesPage() {
  const [locale, rows] = await Promise.all([
    getLocale(),
    db
      .select()
      .from(inclusiveActivities)
      .where(eq(inclusiveActivities.active, true)),
  ]);
  const isRu = locale === "ru";

  const activities = rows.map((row) => ({
    id: row.id,
    title: isRu ? row.titleRu : row.titleKk,
    description: isRu ? row.descriptionRu : row.descriptionKk,
    content: row.content,
  }));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">{isRu ? "Адаптивные задания" : "Бейімделген тапсырмалар"}</div>
          <h1 className="text-3xl m-0">
            {isRu ? "Инклюзивные игры и активности" : "Инклюзивті ойындар мен белсенділіктер"}
          </h1>
        </div>
        <Link href="/games" className="btn secondary sm">
          {isRu ? "Все учебные игры →" : "Барлық оқу ойындары →"}
        </Link>
      </div>
      <InclusiveActivities activities={activities} />
    </div>
  );
}

