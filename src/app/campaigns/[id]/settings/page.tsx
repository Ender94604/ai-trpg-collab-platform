import Link from "next/link";
import { headers } from "next/headers";
import { CampaignNav } from "@/components/campaign/campaign-nav";
import { CampaignInviteSection } from "@/components/campaign/invite-section";
import { requireUser } from "@/lib/auth/session";
import { getCampaignOverviewForCurrentUser } from "@/lib/db/campaigns";
import { getCampaignInvitesForCurrentUser } from "@/lib/db/invites";

function getRequestOrigin(headersList: Headers) {
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  if (!host) {
    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}

export default async function CampaignSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await requireUser();
  const { id } = await params;
  const { campaign, error } = await getCampaignOverviewForCurrentUser(id, user.id);

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

  const headersList = await headers();
  const inviteBaseUrl = getRequestOrigin(headersList);
  const { invites, error: invitesError } =
    campaign.role === "gm"
      ? await getCampaignInvitesForCurrentUser(campaign.id)
      : { invites: [], error: null };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <CampaignNav campaignId={campaign.id} />
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Campaign</p>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage private access for {campaign.title}.
          </p>
          <p className="mt-3 w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium uppercase text-zinc-700">
            {campaign.role}
          </p>
        </div>

        {campaign.role === "gm" ? (
          <>
            {invitesError ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Failed to load invite links: {invitesError}
              </div>
            ) : null}
            <CampaignInviteSection
              campaignId={campaign.id}
              inviteBaseUrl={inviteBaseUrl}
              invites={invites}
            />
          </>
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
            Only GMs can create invite links for this Campaign.
          </div>
        )}
      </section>
    </main>
  );
}
