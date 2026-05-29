import Link from "next/link";
import { CharacterList } from "@/components/character/character-list";
import { CreateCharacterForm } from "@/components/character/character-form";
import { requireUser } from "@/lib/auth/session";
import { getCampaignOverviewForCurrentUser } from "@/lib/db/campaigns";
import { getCharactersForCampaign } from "@/lib/db/characters";

export default async function CampaignCharactersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await requireUser();
  const { id } = await params;
  const { campaign, error: campaignError } =
    await getCampaignOverviewForCurrentUser(id, user.id);

  if (!campaign) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
        <section className="w-full max-w-xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Characters unavailable</h1>
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

  const { characters, error: charactersError } =
    await getCharactersForCampaign(id);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="space-y-2">
          <Link
            className="text-sm text-zinc-600 hover:text-zinc-950"
            href={`/campaigns/${campaign.id}`}
          >
            Back to Campaign Overview
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                {campaign.title}
              </p>
              <h1 className="text-3xl font-semibold">Characters</h1>
            </div>
            <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium uppercase text-zinc-700">
              {campaign.role}
            </span>
          </div>
        </div>

        <CreateCharacterForm campaignId={campaign.id} />

        {charactersError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load Characters: {charactersError}
          </div>
        ) : (
          <CharacterList characters={characters} currentUserId={user.id} />
        )}
      </section>
    </main>
  );
}
