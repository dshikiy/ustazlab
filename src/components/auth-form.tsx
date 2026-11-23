"use client";

import { useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import type { Messages } from "@/lib/i18n/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn w-full">
      {pending && <span className="spinner" aria-hidden="true" />}
      {label}
    </button>
  );
}

export function AuthForm({
  kind,
  action,
  messages,
}: {
  kind: "login" | "register";
  action: (fd: FormData) => void | Promise<void>;
  messages: Messages["auth"];
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setClientError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!email.includes("@") || password.length < 8) {
      e.preventDefault();
      setClientError(messages.invalidForm);
      return;
    }
    if (kind === "register") {
      const confirm = String(fd.get("passwordConfirm") || "");
      if (password !== confirm) {
        e.preventDefault();
        setClientError(messages.passwordMismatch);
      }
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="form" noValidate>
      {clientError && (
        <div
          role="alert"
          className="p-3 rounded-xl border border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)] text-sm font-semibold"
        >
          {clientError}
        </div>
      )}

      {kind === "register" && (
        <label>
          {messages.name}
          <input
            name="name"
            required
            minLength={2}
            maxLength={120}
            placeholder={messages.name}
            autoComplete="name"
          />
        </label>
      )}

      <label>
        {messages.email}
        <input
          name="email"
          type="email"
          required
          placeholder="teacher@school.kz"
          autoComplete="email"
        />
      </label>

      <label className="auth-password">
        {messages.password}
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          placeholder="••••••••"
          autoComplete={kind === "login" ? "current-password" : "new-password"}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? messages.hide : messages.show}
        </button>
      </label>

      {kind === "register" && (
        <label>
          {messages.passwordConfirm}
          <input
            name="passwordConfirm"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <span className="text-xs muted font-normal">{messages.passwordHint}</span>
        </label>
      )}

      <SubmitButton label={kind === "login" ? messages.login : messages.register} />
    </form>
  );
}
