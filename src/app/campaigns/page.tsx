import Link from "next/link";
import { CampaignList } from "@/components/campaign/campaign-list";
import { requireUser } from "@/lib/auth/session";
import { getCampaignsForCurrentUser } from "@/lib/db/campaigns";

export default async function CampaignsPage() {
  const { user } = await requireUser();
  const { campaigns, error } = await getCampaignsForCurrentUser(user.id);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Campaigns</p>
            <h1 className="text-3xl font-semibold">Your Campaigns</h1>
          </div>
          <Link
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
            href="/campaigns/new"
          >
            Create Campaign
          </Link>
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load Campaigns: {error}
          </div>
        ) : (
          <CampaignList campaigns={campaigns} />
        )}
      </section>
    </main>
  );
}
