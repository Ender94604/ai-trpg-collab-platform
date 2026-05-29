import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CharacterTextJson = {
  text?: string;
};

export type CharacterRecord = {
  id: string;
  campaign_id: string;
  user_id: string;
  name: string;
  occupation: string | null;
  background: string | null;
  personality: string | null;
  stats: CharacterTextJson | null;
  inventory: CharacterTextJson | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export function textToJsonb(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? { text } : {};
}

export function optionalCharacterText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export function jsonbText(value: CharacterTextJson | null) {
  return value?.text ?? "";
}

export async function getCharactersForCampaign(campaignId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("characters")
    .select(
      "id,campaign_id,user_id,name,occupation,background,personality,stats,inventory,notes,created_at,updated_at",
    )
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: true });

  if (error) {
    return { characters: [], error: error.message };
  }

  return {
    characters: (data ?? []) as CharacterRecord[],
    error: null,
  };
}

export async function getCharacterOwner(characterId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("characters")
    .select("campaign_id,user_id")
    .eq("id", characterId)
    .single<{ campaign_id: string; user_id: string }>();

  if (error) {
    return { character: null, error: error.message };
  }

  return { character: data, error: null };
}
