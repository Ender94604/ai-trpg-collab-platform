import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SessionSummary } from "@/lib/ai/summary-types";

export type SessionListItem = {
  id: string;
  campaign_id: string;
  title: string;
  session_date: string | null;
  created_at: string;
};

export type SessionDetail = {
  id: string;
  campaign_id: string;
  title: string;
  session_date: string | null;
  raw_log: string;
  summary: unknown | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export function optionalSessionDate(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

export function sessionText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function getSessionsForCampaign(campaignId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("id,campaign_id,title,session_date,created_at")
    .eq("campaign_id", campaignId)
    .order("session_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return { sessions: [], error: error.message };
  }

  return {
    sessions: (data ?? []) as SessionListItem[],
    error: null,
  };
}

export async function getSessionDetail(
  campaignId: string,
  sessionId: string,
) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("sessions")
    .select(
      "id,campaign_id,title,session_date,raw_log,summary,created_by,created_at,updated_at",
    )
    .eq("id", sessionId)
    .eq("campaign_id", campaignId)
    .single<SessionDetail>();

  if (error) {
    return { session: null, error: error.message };
  }

  return { session: data, error: null };
}

export async function saveSessionSummary({
  campaignId,
  createdBy,
  prompt,
  sessionId,
  summary,
}: {
  campaignId: string;
  createdBy: string;
  prompt: string;
  sessionId: string;
  summary: SessionSummary;
}) {
  const supabase = await createSupabaseServerClient();

  const { error: sessionError } = await supabase
    .from("sessions")
    .update({ summary })
    .eq("id", sessionId)
    .eq("campaign_id", campaignId);

  if (sessionError) {
    return { error: sessionError.message };
  }

  const { error: outputError } = await supabase.from("ai_outputs").insert({
    campaign_id: campaignId,
    session_id: sessionId,
    type: "session_summary",
    prompt,
    output: summary,
    created_by: createdBy,
  });

  if (outputError) {
    return { error: outputError.message };
  }

  return { error: null };
}
