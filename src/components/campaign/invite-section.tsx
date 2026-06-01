"use client";

import { useActionState } from "react";
import {
  createCampaignInviteAction,
  joinCampaignByInviteAction,
  type InviteFormState,
} from "@/app/actions/invites";
import type { CampaignInvite } from "@/lib/db/invites";

const initialState: InviteFormState = {
  error: null,
  success: null,
};

type CampaignInviteSectionProps = {
  campaignId: string;
  invites: CampaignInvite[];
  inviteBaseUrl: string;
};

type JoinCampaignFormProps = {
  inviteToken: string;
};

function FormMessage({ state }: { state: InviteFormState }) {
  if (state.error) {
    return <p className="text-sm text-red-600">{state.error}</p>;
  }

  if (state.success) {
    return <p className="text-sm text-emerald-700">{state.success}</p>;
  }

  return null;
}

export function CampaignInviteSection({
  campaignId,
  invites,
  inviteBaseUrl,
}: CampaignInviteSectionProps) {
  const [state, formAction, pending] = useActionState(
    createCampaignInviteAction,
    initialState,
  );

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Invite Links</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Create a private join link for players. Anyone with the link can join
            this Campaign as a player.
          </p>
        </div>

        <form action={formAction}>
          <input name="campaign_id" type="hidden" value={campaignId} />
          <button
            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={pending}
            type="submit"
          >
            {pending ? "Creating..." : "Create Invite Link"}
          </button>
        </form>
      </div>

      <FormMessage state={state} />

      {invites.length > 0 ? (
        <div className="space-y-3">
          {invites.map((invite) => {
            const inviteUrl = `${inviteBaseUrl}/join/${invite.token}`;

            return (
              <div
                className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-4"
                key={invite.id}
              >
                <p className="text-xs font-medium uppercase text-zinc-500">
                  Created {new Date(invite.created_at).toLocaleString()}
                </p>
                <input
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700"
                  readOnly
                  value={inviteUrl}
                />
                <p className="text-xs text-zinc-500">
                  Revoke/delete is not implemented in the MVP.
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md bg-zinc-100 p-4 text-sm text-zinc-600">
          No invite links yet.
        </div>
      )}
    </section>
  );
}

export function JoinCampaignForm({ inviteToken }: JoinCampaignFormProps) {
  const [state, formAction, pending] = useActionState(
    joinCampaignByInviteAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input name="invite_token" type="hidden" value={inviteToken} />
      <FormMessage state={state} />
      <button
        className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={pending}
        type="submit"
      >
        {pending ? "Joining..." : "Join Campaign"}
      </button>
    </form>
  );
}
