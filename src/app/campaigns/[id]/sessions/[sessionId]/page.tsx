import Link from "next/link";
import { EditSessionForm } from "@/components/session/session-form";
import { requireUser } from "@/lib/auth/session";
import { getCampaignOverviewForCurrentUser } from "@/lib/db/campaigns";
import { getSessionDetail } from "@/lib/db/sessions";

export default async function CampaignSessionDetailPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const { user } = await requireUser();
  const { id, sessionId } = await params;
  const { campaign, error: campaignError } =
    await getCampaignOverviewForCurrentUser(id, user.id);

  if (!campaign) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
        <section className="w-full max-w-xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Session unavailable</h1>
          <p className="mt-2 text-sm text-red-700">
            {campaignError || "You do not have access to this Campaign."}
          </p>
          <Link
            className="mt-6 inline-block rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
            href="/dashboard"
          >
            Back to Dashboard
          </Link>
        </section>
      </main>
    );
  }

  const { session, error: sessionError } = await getSessionDetail(id, sessionId);

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
        <section className="w-full max-w-xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Session not found</h1>
          <p className="mt-2 text-sm text-red-700">
            {sessionError || "This Session could not be loaded."}
          </p>
          <Link
            className="mt-6 inline-block rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
            href={`/campaigns/${campaign.id}/sessions`}
          >
            Back to Sessions
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="space-y-2">
          <Link
            className="text-sm text-zinc-600 hover:text-zinc-950"
            href={`/campaigns/${campaign.id}/sessions`}
          >
            Back to Sessions
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                {campaign.title}
              </p>
              <h1 className="text-3xl font-semibold">{session.title}</h1>
            </div>
            <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium uppercase text-zinc-700">
              {campaign.role}
            </span>
          </div>
        </div>

        <article className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <section>
            <h2 className="font-semibold">Session date</h2>
            <p className="mt-1 text-sm text-zinc-700">
              {session.session_date || "Not set"}
            </p>
          </section>

          <section>
            <h2 className="font-semibold">Raw log</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">
              {session.raw_log || "No raw log yet."}
            </p>
          </section>

          <section>
            <h2 className="font-semibold">AI Summary</h2>
            <p className="mt-1 text-sm text-zinc-700">
              {session.summary
                ? JSON.stringify(session.summary, null, 2)
                : "AI summary has not been generated yet."}
            </p>
          </section>
        </article>

        {campaign.role === "gm" ? (
          <EditSessionForm session={session} />
        ) : (
          <div className="rounded-md bg-zinc-100 p-4 text-sm text-zinc-700">
            Players can view Sessions, but only GMs can edit Session logs.
          </div>
        )}
      </section>
    </main>
  );
}
