"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getCampaignRoleForCurrentUser } from "@/lib/db/campaigns";
import {
  getSessionDetail,
  optionalSessionDate,
  sessionText,
} from "@/lib/db/sessions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SessionFormState = {
  error: string | null;
  success: string | null;
};

const initialSessionFormState: SessionFormState = {
  error: null,
  success: null,
};

function readSessionPayload(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return {
      ok: false,
      error: "Session title is required.",
    } as const;
  }

  return {
    ok: true,
    title,
    session_date: optionalSessionDate(formData.get("session_date")),
    gm_notes: sessionText(formData.get("gm_notes")) || null,
    transcript: sessionText(formData.get("transcript")) || null,
  } as const;
}

async function requireCampaignGm(campaignId: string, userId: string) {
  const { role, error } = await getCampaignRoleForCurrentUser(campaignId, userId);

  if (error || role !== "gm") {
    return {
      ok: false,
      error: error || "Only GMs can manage Sessions.",
    } as const;
  }

  return { ok: true } as const;
}

export async function createSessionAction(
  previousState: SessionFormState = initialSessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  void previousState;

  const { user } = await requireUser();
  const campaignId = String(formData.get("campaign_id") ?? "");
  const payload = readSessionPayload(formData);

  if (!campaignId) {
    return { error: "Missing Campaign id.", success: null };
  }

  if (!payload.ok) {
    return { error: payload.error, success: null };
  }

  const gmCheck = await requireCampaignGm(campaignId, user.id);

  if (!gmCheck.ok) {
    return { error: gmCheck.error, success: null };
  }

  const sessionId = crypto.randomUUID();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("sessions").insert({
    id: sessionId,
    campaign_id: campaignId,
    title: payload.title,
    session_date: payload.session_date,
    gm_notes: payload.gm_notes,
    transcript: payload.transcript,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message, success: null };
  }

  revalidatePath(`/campaigns/${campaignId}/sessions`);
  redirect(`/campaigns/${campaignId}/sessions/${sessionId}`);
}

export async function updateSessionAction(
  previousState: SessionFormState = initialSessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  void previousState;

  const { user } = await requireUser();
  const campaignId = String(formData.get("campaign_id") ?? "");
  const sessionId = String(formData.get("session_id") ?? "");
  const payload = readSessionPayload(formData);

  if (!campaignId || !sessionId) {
    return { error: "Missing Session context.", success: null };
  }

  if (!payload.ok) {
    return { error: payload.error, success: null };
  }

  const gmCheck = await requireCampaignGm(campaignId, user.id);

  if (!gmCheck.ok) {
    return { error: gmCheck.error, success: null };
  }

  const { session, error: sessionError } = await getSessionDetail(
    campaignId,
    sessionId,
    { includePrivateFields: true },
  );

  if (sessionError || !session) {
    return { error: sessionError || "Session not found.", success: null };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("sessions")
    .update({
      title: payload.title,
      session_date: payload.session_date,
      gm_notes: payload.gm_notes,
      transcript: payload.transcript,
    })
    .eq("id", sessionId)
    .eq("campaign_id", campaignId);

  if (error) {
    return { error: error.message, success: null };
  }

  revalidatePath(`/campaigns/${campaignId}/sessions`);
  revalidatePath(`/campaigns/${campaignId}/sessions/${sessionId}`);
  return { error: null, success: "Session updated." };
}
