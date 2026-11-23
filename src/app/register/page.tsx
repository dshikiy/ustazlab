import Link from "next/link";
import { Header } from "@/components/header";
import { AuthForm } from "@/components/auth-form";
import { registerAction } from "@/lib/actions";
import { getMessages } from "@/lib/i18n/server";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, m] = await Promise.all([searchParams, getMessages()]);

  const errorMessage =
    error === "rate_limit"
      ? m.auth.rateLimited
      : error
      ? m.auth.invalidForm
      : null;

  return (
    <>
      <Header />
      <main id="main-content" className="auth-page flex items-center justify-center py-12 px-4">
        <div className="card w-full max-w-md grid gap-5">
          <div className="grid gap-1">
            <h1 className="text-2xl m-0">{m.auth.registerTitle}</h1>
            <p className="muted text-sm m-0">{m.auth.registerLead}</p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl border border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)] text-sm font-semibold"
            >
              {errorMessage}
            </div>
          )}

          <AuthForm kind="register" action={registerAction} messages={m.auth} />

          <p className="text-sm muted text-center m-0">
            {m.auth.hasAccount}{" "}
            <Link href="/login" className="font-semibold text-[var(--primary)] no-underline">
              {m.auth.login}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
