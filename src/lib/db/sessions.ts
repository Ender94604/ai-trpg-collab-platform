import { createSupabaseServerClient } from "@/lib/supabase/server";

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
