"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordResetAction,
  updatePasswordAction,
  type AuthFormState,
} from "@/app/actions/auth";

const initialState: AuthFormState = {
  error: null,
  success: null,
};

export function ResetPasswordRequestForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

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
        disabled={pending}
        type="submit"
      >
        {pending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
    initialState,
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

function FormMessage({ state }: { state: AuthFormState }) {
  if (state.error) {
    return <p className="text-sm text-red-600">{state.error}</p>;
  }

  if (state.success) {
    return <p className="text-sm text-emerald-700">{state.success}</p>;
  }

  return null;
}
