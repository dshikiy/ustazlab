import { db } from "@/db";
import { teacherProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireTeacher } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";
import { updateProfileAction } from "@/lib/classroom-actions";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [user, locale, sp] = await Promise.all([
    requireTeacher(),
    getLocale(),
    searchParams,
  ]);
  const isRu = locale === "ru";

  const [profile] = await db
    .select()
    .from(teacherProfiles)
    .where(eq(teacherProfiles.userId, user.id))
    .limit(1);

  return (
    <div className="grid gap-6 max-w-2xl">
      <div>
        <div className="eyebrow">{isRu ? "Личные данные" : "Жеке деректер"}</div>
        <h1 className="text-3xl m-0">{isRu ? "Профиль учителя" : "Мұғалім профилі"}</h1>
      </div>

      {sp.saved && (
        <div className="p-3 rounded-xl border border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)] text-sm font-semibold">
          {isRu ? "Профиль обновлён." : "Профиль сәтті сақталды."}
        </div>
      )}

      <form action={updateProfileAction} className="card form">
        <label>
          {isRu ? "Имя и фамилия" : "Аты-жөні"}
          <input name="name" required minLength={2} defaultValue={user.name} />
        </label>
        <label>
          Email
          <input value={user.email} readOnly />
        </label>
        <label>
          {isRu ? "Школа / организация" : "Мектеп / ұйым"}
          <input
            name="school"
            defaultValue={profile?.school || ""}
            placeholder={isRu ? "Школа-лицей №1" : "№1 мектеп-лицей"}
          />
        </label>
        <label>
          {isRu ? "О себе и предметах" : "Өзім және пәндерім туралы"}
          <textarea
            name="bio"
            rows={4}
            defaultValue={profile?.bio || ""}
            placeholder={isRu ? "Учитель начальных классов..." : "Бастауыш сынып мұғалімі..."}
          />
        </label>
        <button type="submit" className="btn w-max">
          {isRu ? "Сохранить изменения" : "Өзгерістерді сақтау"}
        </button>
      </form>
    </div>
  );
}
