import Link from "next/link";
import { UpdatePasswordForm } from "@/components/common/password-reset-forms";
import { getCurrentUser } from "@/lib/auth/session";

export default async function UpdatePasswordPage() {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Update password</h1>
          <p className="text-sm text-zinc-600">
            Choose a new password for your account.
          </p>
        </div>

        {currentUser ? (
          <UpdatePasswordForm />
        ) : (
          <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            <p>
              No valid recovery session was found. Please request a new password
              reset link.
            </p>
            <Link
              className="inline-block rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              href="/reset-password"
            >
              Request reset link
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
