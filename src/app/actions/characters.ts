"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import {
  getCharacterOwner,
  optionalCharacterText,
  textToJsonb,
} from "@/lib/db/characters";
import { getCampaignRoleForCurrentUser } from "@/lib/db/campaigns";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CharacterFormState = {
  error: string | null;
  success: string | null;
};

const initialCharacterFormState: CharacterFormState = {
  error: null,
  success: null,
};

function readCharacterPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return {
      ok: false,
      error: "Character name is required.",
    } as const;
  }

  return {
    ok: true,
    name,
    occupation: optionalCharacterText(formData.get("occupation")),
    background: optionalCharacterText(formData.get("background")),
    personality: optionalCharacterText(formData.get("personality")),
    stats: textToJsonb(formData.get("stats")),
    inventory: textToJsonb(formData.get("inventory")),
    notes: optionalCharacterText(formData.get("notes")),
  } as const;
}

export async function createCharacterAction(
  previousState: CharacterFormState = initialCharacterFormState,
  formData: FormData,
): Promise<CharacterFormState> {
  void previousState;

  const { user } = await requireUser();
  const campaignId = String(formData.get("campaign_id") ?? "");
  const payload = readCharacterPayload(formData);

  if (!campaignId) {
    return { error: "Missing Campaign id.", success: null };
  }

  if (!payload.ok) {
    return { error: payload.error, success: null };
  }

  const { role, error: roleError } = await getCampaignRoleForCurrentUser(
    campaignId,
    user.id,
  );

  if (roleError || !role) {
    return { error: roleError, success: null };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("characters").insert({
    campaign_id: campaignId,
    user_id: user.id,
    name: payload.name,
    occupation: payload.occupation,
    background: payload.background,
    personality: payload.personality,
    stats: payload.stats,
    inventory: payload.inventory,
    notes: payload.notes,
  });

  if (error) {
    return { error: error.message, success: null };
  }

  revalidatePath(`/campaigns/${campaignId}/characters`);
  return { error: null, success: "Character created." };
}

export async function updateCharacterAction(
  previousState: CharacterFormState = initialCharacterFormState,
  formData: FormData,
): Promise<CharacterFormState> {
  void previousState;

  const { user } = await requireUser();
  const characterId = String(formData.get("character_id") ?? "");
  const payload = readCharacterPayload(formData);

  if (!characterId) {
    return { error: "Missing Character id.", success: null };
  }

  if (!payload.ok) {
    return { error: payload.error, success: null };
  }

  const { character, error: ownerError } = await getCharacterOwner(characterId);

  if (ownerError || !character) {
    return { error: ownerError, success: null };
  }

  if (character.user_id !== user.id) {
    return {
      error: "You can only edit your own Character in the MVP.",
      success: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("characters")
    .update({
      name: payload.name,
      occupation: payload.occupation,
      background: payload.background,
      personality: payload.personality,
      stats: payload.stats,
      inventory: payload.inventory,
      notes: payload.notes,
    })
    .eq("id", characterId);

  if (error) {
    return { error: error.message, success: null };
  }

  revalidatePath(`/campaigns/${character.campaign_id}/characters`);
  return { error: null, success: "Character updated." };
}
