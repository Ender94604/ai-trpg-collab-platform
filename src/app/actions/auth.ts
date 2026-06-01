"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
  success?: string | null;
};

const initialAuthFormState: AuthFormState = {
  error: null,
  success: null,
};

function getPasswordResetOrigin(headersList: Headers) {
  const origin = headersList.get("origin");

  if (origin) {
    return origin;
  }

  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  if (!host) {
    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}

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

export async function requestPasswordResetAction(
  previousState: AuthFormState = initialAuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Please enter your email address.", success: null };
  }

  const headersList = await headers();
  const origin = getPasswordResetOrigin(headersList);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: error.message, success: null };
  }

  return {
    error: null,
    success: "Check your email for the password reset link.",
  };
}

export async function updatePasswordAction(
  previousState: AuthFormState = initialAuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void previousState;

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!password || !confirmPassword) {
    return { error: "Please enter and confirm your new password.", success: null };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters.", success: null };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", success: null };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      error:
        error.message || "No valid recovery session. Please request a new reset link.",
      success: null,
    };
  }

  revalidatePath("/", "layout");
  return {
    error: null,
    success: "Password updated. You can now return to login.",
  };
}
