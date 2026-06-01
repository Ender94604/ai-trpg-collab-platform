import Link from "next/link";
import { ResetPasswordRequestForm } from "@/components/common/password-reset-forms";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { error } = await searchParams;
  const initialError = getResetPasswordErrorMessage(error);

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

        <ResetPasswordRequestForm initialError={initialError} />

        <div className="text-center">
          <Link className="text-sm text-zinc-600 hover:text-zinc-950" href="/login">
            Back to login
          </Link>
        </div>
      </section>
    </main>
  );
}

function getResetPasswordErrorMessage(error?: string) {
  if (
    error === "callback_failed" ||
    error === "missing_token" ||
    error === "invalid_type" ||
    error === "verify_failed"
  ) {
    return "Password reset link is invalid or expired. Please request a new reset link.";
  }

  return null;
}
