import { requireTeacher } from "@/lib/auth";
import { getLocale } from "@/lib/i18n/server";
import {
  changePasswordAction,
  deleteAccountAction,
} from "@/lib/classroom-actions";
import { AccessibilityControls } from "@/components/accessibility-bar";
import { saveAccessibilityPrefsAction } from "@/lib/actions";

export default async function SettingsPage({
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

  return (
    <div className="grid gap-8 max-w-2xl">
      <div>
        <div className="eyebrow">{isRu ? "Настройки аккаунта" : "Аккаунт баптаулары"}</div>
        <h1 className="text-3xl m-0">{isRu ? "Настройки" : "Баптаулар"}</h1>
      </div>

      {sp.saved === "password" && (
        <div className="p-3 rounded-xl border border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)] text-sm font-semibold">
          {isRu ? "Пароль успешно изменён." : "Құпиясөз сәтті өзгертілді."}
        </div>
      )}
      {sp.error && (
        <div
          role="alert"
          className="p-3 rounded-xl border border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)] text-sm font-semibold"
        >
          {isRu
            ? "Проверьте введённые данные и повторите попытку."
            : "Енгізілген деректерді тексеріп, қайталаңыз."}
        </div>
      )}

      <section className="card grid gap-4">
        <h2 className="text-lg m-0">
          {isRu ? "Параметры доступности" : "Қолжетімділік параметрлері"}
        </h2>
        <AccessibilityControls onPersist={saveAccessibilityPrefsAction} />
      </section>

      <form action={changePasswordAction} className="card form">
        <h2 className="text-lg m-0">{isRu ? "Смена пароля" : "Құпиясөзді өзгерту"}</h2>
        <label>
          {isRu ? "Текущий пароль" : "Қазіргі құпиясөз"}
          <input name="currentPassword" type="password" required minLength={8} />
        </label>
        <label>
          {isRu ? "Новый пароль" : "Жаңа құпиясөз"}
          <input name="newPassword" type="password" required minLength={8} />
        </label>
        <label>
          {isRu ? "Подтвердите новый пароль" : "Жаңа құпиясөзді растаңыз"}
          <input name="confirmPassword" type="password" required minLength={8} />
        </label>
        <button type="submit" className="btn w-max">
          {isRu ? "Обновить пароль" : "Құпиясөзді жаңарту"}
        </button>
      </form>

      <form action={deleteAccountAction} className="card form border-[var(--error)]">
        <h2 className="text-lg m-0 text-[var(--error)]">
          {isRu ? "Удаление аккаунта" : "Аккаунтты жою"}
        </h2>
        <p className="muted text-sm m-0">
          {isRu
            ? `Для подтверждения введите ваш email (${user.email}). Это действие необратимо.`
            : `Растау үшін email мекенжайыңызды (${user.email}) енгізіңіз. Бұл әрекетті қайтару мүмкін емес.`}
        </p>
        <label>
          Email
          <input name="confirmEmail" type="email" required placeholder={user.email} />
        </label>
        <button type="submit" className="btn danger w-max">
          {isRu ? "Удалить аккаунт" : "Аккаунтты жою"}
        </button>
      </form>
    </div>
  );
}
