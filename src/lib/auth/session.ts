import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export type CurrentUser = {
  user: User;
  profile: Profile | null;
  profileError: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email,display_name,avatar_url")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return {
    user,
    profile,
    profileError: profileError?.message ?? null,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return currentUser;
}
