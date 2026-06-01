"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, signUpAction } from "@/app/actions/auth";

const initialState = {
  error: null,
};

export default function LoginPage() {
  const [signInState, signInFormAction, signInPending] = useActionState(
    signInAction,
    initialState,
  );
  const [signUpState, signUpFormAction, signUpPending] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">AI-TRPG Login</h1>
          <p className="text-sm text-zinc-600">
            Sign in or create an account to continue to your dashboard.
          </p>
        </div>

        <form
          action={signInFormAction}
          className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">Sign in</h2>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          {signInState.error ? (
            <p className="text-sm text-red-600">{signInState.error}</p>
          ) : null}
          <button
            className="w-full rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={signInPending}
            type="submit"
          >
            {signInPending ? "Signing in..." : "Sign in"}
          </button>
          <Link
            className="block text-center text-sm text-zinc-600 hover:text-zinc-950"
            href="/reset-password"
          >
            Forgot password?
          </Link>
        </form>

        <form
          action={signUpFormAction}
          className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">Create account</h2>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
          {signUpState.error ? (
            <p className="text-sm text-red-600">{signUpState.error}</p>
          ) : null}
          <button
            className="w-full rounded-md border border-zinc-950 px-4 py-2 text-sm font-medium text-zinc-950 disabled:cursor-not-allowed disabled:border-zinc-400 disabled:text-zinc-400"
            disabled={signUpPending}
            type="submit"
          >
            {signUpPending ? "Creating account..." : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}
