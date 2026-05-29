import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CampaignListItem = {
  id: string;
  title: string;
  description: string | null;
  system_type: string | null;
  role: "gm" | "player";
  created_at: string;
};

export type CampaignOverview = {
  id: string;
  title: string;
  description: string | null;
  system_type: string | null;
  world_setting: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
  role: "gm" | "player";
};

type CampaignRecord = {
  id: string;
  title: string;
  description: string | null;
  system_type: string | null;
  created_at: string;
};

type CampaignRelation = CampaignRecord | CampaignRecord[] | null;

type CampaignMemberRow = {
  role: "gm" | "player";
  campaigns: CampaignRelation;
};

function firstCampaign(campaign: CampaignRelation): CampaignRecord | null {
  if (!campaign) {
    return null;
  }

  if (Array.isArray(campaign)) {
    return campaign[0] ?? null;
  }

  return campaign;
}

export async function getCampaignsForCurrentUser(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("campaign_members")
    .select(
      "role,campaigns(id,title,description,system_type,created_at)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { campaigns: [], error: error.message };
  }

  const rows = (data ?? []) as CampaignMemberRow[];
  const campaigns = rows.flatMap((row): CampaignListItem[] => {
    const campaign = firstCampaign(row.campaigns);

    if (!campaign) {
      return [];
    }

    return [
      {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        system_type: campaign.system_type,
        role: row.role,
        created_at: campaign.created_at,
      },
    ];
  });

  return { campaigns, error: null };
}

export async function getCampaignOverviewForCurrentUser(
  campaignId: string,
  userId: string,
) {
  const supabase = await createSupabaseServerClient();

  const { data: member, error: memberError } = await supabase
    .from("campaign_members")
    .select("role")
    .eq("campaign_id", campaignId)
    .eq("user_id", userId)
    .single<{ role: "gm" | "player" }>();

  if (memberError) {
    return {
      campaign: null,
      error: "You do not have access to this Campaign.",
    };
  }

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select(
      "id,title,description,system_type,world_setting,owner_id,created_at,updated_at",
    )
    .eq("id", campaignId)
    .single<Omit<CampaignOverview, "role">>();

  if (campaignError) {
    return { campaign: null, error: campaignError.message };
  }

  return {
    campaign: {
      ...campaign,
      role: member.role,
    },
    error: null,
  };
}
