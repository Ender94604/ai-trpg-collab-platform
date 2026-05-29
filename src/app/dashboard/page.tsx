import { signOutAction } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const { user, profile, profileError } = await requireUser();
  const displayName = profile?.display_name || profile?.email || user.email;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-500">Dashboard</p>
            <h1 className="text-3xl font-semibold">Welcome, {displayName}</h1>
            <p className="text-sm text-zinc-600">Signed in as {user.email}</p>
          </div>
          <form action={signOutAction}>
            <button
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:border-zinc-950"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>

        {profile ? (
          <div className="rounded-md bg-zinc-100 p-4 text-sm text-zinc-700">
            Profile loaded from Supabase.
          </div>
        ) : (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Profile was not found for this user. Check the Supabase auth
            profile trigger and RLS policies.
            {profileError ? ` Details: ${profileError}` : null}
          </div>
        )}
      </section>
    </main>
  );
}
