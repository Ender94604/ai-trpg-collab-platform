import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getCampaignOverviewForCurrentUser } from "@/lib/db/campaigns";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await requireUser();
  const { id } = await params;
  const { campaign, error } = await getCampaignOverviewForCurrentUser(
    id,
    user.id,
  );

  if (!campaign) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
        <section className="w-full max-w-xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Campaign unavailable</h1>
          <p className="mt-2 text-sm text-red-700">
            {error || "You do not have access to this Campaign."}
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

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <Link className="text-sm text-zinc-600 hover:text-zinc-950" href="/dashboard">
            Back to Dashboard
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Campaign Overview
              </p>
              <h1 className="text-3xl font-semibold">{campaign.title}</h1>
            </div>
            <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium uppercase text-zinc-700">
              {campaign.role}
            </span>
          </div>
        </div>

        <div className="grid gap-5 text-sm">
          <section>
            <h2 className="font-semibold">Description</h2>
            <p className="mt-1 text-zinc-700">
              {campaign.description || "No description yet."}
            </p>
          </section>

          <section>
            <h2 className="font-semibold">System Type</h2>
            <p className="mt-1 text-zinc-700">
              {campaign.system_type || "Not specified."}
            </p>
          </section>

          <section>
            <h2 className="font-semibold">World Setting</h2>
            <p className="mt-1 whitespace-pre-wrap text-zinc-700">
              {campaign.world_setting || "No world setting yet."}
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
