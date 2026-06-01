"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getCampaignRoleForCurrentUser } from "@/lib/db/campaigns";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type InviteFormState = {
  error: string | null;
  success: string | null;
};

const initialInviteFormState: InviteFormState = {
  error: null,
  success: null,
};

function createInviteToken() {
  return `${crypto.randomUUID().replaceAll("-", "")}${crypto
    .randomUUID()
    .replaceAll("-", "")}`;
}

export async function createCampaignInviteAction(
  previousState: InviteFormState = initialInviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  void previousState;

  const { user } = await requireUser();
  const campaignId = String(formData.get("campaign_id") ?? "").trim();

  if (!campaignId) {
    return { error: "Campaign is required.", success: null };
  }

  const { role, error: roleError } = await getCampaignRoleForCurrentUser(
    campaignId,
    user.id,
  );

  if (roleError || role !== "gm") {
    return { error: "Only GMs can create invite links.", success: null };
  }

  const supabase = await createSupabaseServerClient();
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { error } = await supabase.from("campaign_invites").insert({
      campaign_id: campaignId,
      token: createInviteToken(),
      created_by: user.id,
      expires_at: null,
    });

    if (!error) {
      revalidatePath(`/campaigns/${campaignId}/settings`);
      return { error: null, success: "Invite link created." };
    }

    lastError = error.message;
  }

  return {
    error: lastError ?? "Unable to create invite link.",
    success: null,
  };
}

export async function joinCampaignByInviteAction(
  previousState: InviteFormState = initialInviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  void previousState;

  await requireUser();
  const inviteToken = String(formData.get("invite_token") ?? "").trim();

  if (!inviteToken) {
    return { error: "Invite token is required.", success: null };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("join_campaign_by_invite", {
    invite_token: inviteToken,
  });

  if (error || !data) {
    return {
      error: error?.message ?? "Invite link is invalid or expired.",
      success: null,
    };
  }

  const campaignId = String(data);

  revalidatePath("/dashboard");
  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}
