import { createBrowserClient } from "@supabase/ssr";

function getPublicSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing public Supabase environment variables.");
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseEnv();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
