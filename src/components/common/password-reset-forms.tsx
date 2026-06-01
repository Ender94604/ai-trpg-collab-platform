"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import {
  requestPasswordResetAction,
  updatePasswordAction,
  type AuthFormState,
} from "@/app/actions/auth";

type FormState = {
  error: string | null;
  success: string | null;
};

const RESET_COOLDOWN_SECONDS = 45;
const RESET_COOLDOWN_KEY = "ai-trpg-password-reset-next-request-at";
const RATE_LIMIT_MESSAGE =
  "A reset link was requested recently. Please check your inbox or wait a few minutes before trying again.";

const initialUpdateState: AuthFormState = {
  error: null,
  success: null,
};

export function ResetPasswordRequestForm({
  initialError,
}: {
  initialError?: string | null;
}) {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, {
    error: initialError ?? null,
    success: null,
  });
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    updateCooldownFromStorage(setCooldownSeconds);

    const interval = window.setInterval(() => {
      updateCooldownFromStorage(setCooldownSeconds);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state.success || state.error === RATE_LIMIT_MESSAGE) {
      startResetCooldown(setCooldownSeconds);
    }
  }, [state.error, state.success]);

  const disabled = pending || cooldownSeconds > 0;

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <label className="block space-y-1">
        <span className="text-sm font-medium">Email</span>
        <input
          autoComplete="email"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          name="email"
          required
          type="email"
        />
      </label>

      <FormMessage state={state} />

      <button
        className="w-full rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={disabled}
        type="submit"
      >
        {getResetButtonLabel(pending, cooldownSeconds)}
      </button>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
    initialUpdateState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <label className="block space-y-1">
        <span className="text-sm font-medium">New password</span>
        <input
          autoComplete="new-password"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          disabled={pending || Boolean(state.success)}
          minLength={6}
          name="password"
          required
          type="password"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Confirm new password</span>
        <input
          autoComplete="new-password"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          disabled={pending || Boolean(state.success)}
          minLength={6}
          name="confirm_password"
          required
          type="password"
        />
      </label>

      <FormMessage state={state} />

      {state.success ? (
        <Link
          className="block rounded-md border border-zinc-950 px-4 py-2 text-center text-sm font-medium text-zinc-950"
          href="/login"
        >
          Back to login
        </Link>
      ) : (
        <button
          className="w-full rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          disabled={pending}
          type="submit"
        >
          {pending ? "Updating..." : "Update password"}
        </button>
      )}
    </form>
  );
}

function FormMessage({ state }: { state: FormState | AuthFormState }) {
  if (state.error) {
    return <p className="text-sm text-red-600">{state.error}</p>;
  }

  if (state.success) {
    return <p className="text-sm text-emerald-700">{state.success}</p>;
  }

  return null;
}

function getResetButtonLabel(pending: boolean, cooldownSeconds: number) {
  if (pending) {
    return "Sending...";
  }

  if (cooldownSeconds > 0) {
    return `Try again in ${cooldownSeconds}s`;
  }

  return "Send reset link";
}

function updateCooldownFromStorage(setCooldownSeconds: (seconds: number) => void) {
  const nextRequestAt = Number(window.localStorage.getItem(RESET_COOLDOWN_KEY) ?? 0);
  const remaining = Math.max(0, Math.ceil((nextRequestAt - Date.now()) / 1000));
  setCooldownSeconds(remaining);

  if (remaining === 0 && nextRequestAt) {
    window.localStorage.removeItem(RESET_COOLDOWN_KEY);
  }
}

function startResetCooldown(setCooldownSeconds: (seconds: number) => void) {
  const nextRequestAt = Date.now() + RESET_COOLDOWN_SECONDS * 1000;
  window.localStorage.setItem(RESET_COOLDOWN_KEY, String(nextRequestAt));
  setCooldownSeconds(RESET_COOLDOWN_SECONDS);
}
