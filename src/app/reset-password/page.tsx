import Link from "next/link";
import { ResetPasswordRequestForm } from "@/components/common/password-reset-forms";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Reset password</h1>
          <p className="text-sm text-zinc-600">
            Enter your email and we will send a password reset link if the
            account can receive one.
          </p>
        </div>

        <ResetPasswordRequestForm />

        <div className="text-center">
          <Link className="text-sm text-zinc-600 hover:text-zinc-950" href="/login">
            Back to login
          </Link>
        </div>
      </section>
    </main>
  );
}
