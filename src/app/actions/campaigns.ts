"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CampaignFormState = {
  error: string | null;
};

const initialCampaignFormState: CampaignFormState = {
  error: null,
};

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export async function createCampaignAction(
  previousState: CampaignFormState = initialCampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  void previousState;

  const { user } = await requireUser();
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return { error: "Campaign title is required." };
  }

  if (title.length > 80) {
    return { error: "Campaign title must be 80 characters or fewer." };
  }

  const campaignId = crypto.randomUUID();
  const supabase = await createSupabaseServerClient();

  const { error: campaignError } = await supabase.from("campaigns").insert({
    id: campaignId,
    title,
    description: optionalText(formData.get("description")),
    system_type: optionalText(formData.get("system_type")),
    world_setting: optionalText(formData.get("world_setting")),
    visibility: "private",
    owner_id: user.id,
  });

  if (campaignError) {
    return { error: campaignError.message };
  }

  const { error: memberError } = await supabase
    .from("campaign_members")
    .insert({
      campaign_id: campaignId,
      user_id: user.id,
      role: "gm",
    });

  if (memberError) {
    return {
      error: `Campaign was created, but GM membership failed: ${memberError.message}`,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
  redirect(`/campaigns/${campaignId}`);
}
