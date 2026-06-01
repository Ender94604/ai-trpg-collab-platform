import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CampaignInvite = {
  id: string;
  campaign_id: string;
  token: string;
  created_by: string;
  expires_at: string | null;
  created_at: string;
};

export type CampaignInvitePreview = {
  campaign_id: string;
  title: string;
  expires_at: string | null;
  is_member: boolean;
};

export async function getCampaignInvitesForCurrentUser(campaignId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("campaign_invites")
    .select("id,campaign_id,token,created_by,expires_at,created_at")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (error) {
    return { invites: [], error: error.message };
  }

  return { invites: (data ?? []) as CampaignInvite[], error: null };
}

export async function getCampaignInviteByToken(inviteToken: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_campaign_invite", {
    invite_token: inviteToken,
  });

  if (error) {
    return { invite: null, error: error.message };
  }

  const invites = (data ?? []) as CampaignInvitePreview[];

  return {
    invite: invites[0] ?? null,
    error: null,
  };
}
