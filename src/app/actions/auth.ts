"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
};

const initialAuthFormState: AuthFormState = {
  error: null,
};

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      ok: false,
      error: "Please enter both email and password.",
    } as const;
  }

  return { ok: true, email, password } as const;
}

export async function signInAction(
  previousState: AuthFormState = initialAuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  const credentials = readCredentials(formData);

  if (!credentials.ok) {
    return { error: credentials.error };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(
  previousState: AuthFormState = initialAuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  const credentials = readCredentials(formData);

  if (!credentials.ok) {
    return { error: credentials.error };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (signInError) {
      return {
        error:
          "Sign up succeeded, but no active session was created. Please confirm your email, then sign in.",
      };
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
