import Link from "next/link";
import { JoinCampaignForm } from "@/components/campaign/invite-section";
import { getCurrentUser } from "@/lib/auth/session";
import { getCampaignInviteByToken } from "@/lib/db/invites";

export default async function JoinCampaignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
        <section className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Join Campaign</p>
          <h1 className="mt-1 text-2xl font-semibold">Login required</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Please login or register before joining this Campaign. After login,
            open the invite link again.
          </p>
          <Link
            className="mt-6 inline-block rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
            href="/login"
          >
            Go to Login
          </Link>
        </section>
      </main>
    );
  }

  const { invite, error } = await getCampaignInviteByToken(token);

  if (!invite) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
        <section className="w-full max-w-xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Join Campaign</p>
          <h1 className="mt-1 text-2xl font-semibold">Invalid invite</h1>
          <p className="mt-2 text-sm text-red-700">
            {error || "This invite link is invalid or expired."}
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <section className="w-full max-w-xl space-y-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-500">Join Campaign</p>
          <h1 className="mt-1 text-2xl font-semibold">{invite.title}</h1>
          <p className="mt-2 text-sm text-zinc-600">
            You are signed in as {currentUser.user.email}.
          </p>
        </div>

        {invite.is_member ? (
          <div className="space-y-4 rounded-md bg-zinc-100 p-4 text-sm text-zinc-700">
            <p>Already a member of this Campaign.</p>
            <Link
              className="inline-block rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              href={`/campaigns/${invite.campaign_id}`}
            >
              Enter Campaign
            </Link>
          </div>
        ) : (
          <JoinCampaignForm inviteToken={token} />
        )}
      </section>
    </main>
  );
}
