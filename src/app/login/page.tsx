import Link from "next/link";
import { Header } from "@/components/header";
import { AuthForm } from "@/components/auth-form";
import { loginAction } from "@/lib/actions";
import { getMessages } from "@/lib/i18n/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, m] = await Promise.all([searchParams, getMessages()]);

  const errorMessage =
    error === "rate_limit"
      ? m.auth.rateLimited
      : error
      ? m.auth.badCredentials
      : null;

  return (
    <>
      <Header />
      <main id="main-content" className="auth-page flex items-center justify-center py-12 px-4">
        <div className="card w-full max-w-md grid gap-5">
          <div className="grid gap-1">
            <h1 className="text-2xl m-0">{m.auth.welcome}</h1>
            <p className="muted text-sm m-0">{m.auth.loginLead}</p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl border border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)] text-sm font-semibold"
            >
              {errorMessage}
            </div>
          )}

          <AuthForm kind="login" action={loginAction} messages={m.auth} />

          <p className="text-sm muted text-center m-0">
            {m.auth.noAccount}{" "}
            <Link href="/register" className="font-semibold text-[var(--primary)] no-underline">
              {m.auth.register}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
