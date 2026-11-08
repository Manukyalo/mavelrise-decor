"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, resetPasswordSchema } from "./schemas";

export interface AuthActionResult {
  success?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Signs in an existing client/consultant with email and password
 */
export async function signInAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
      error: "Please correct the highlighted fields.",
    };
  }

  const { email, password } = validation.data;
  const locale = (formData.get("locale") as string) || "en";
  const nextUrl = (formData.get("next") as string) || `/${locale}/portal`;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed";
    return { error: message };
  }

  revalidatePath("/", "layout");
  redirect(nextUrl);
}

/**
 * Registers a new architectural client or consultant account
 */
export async function signUpAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = registerSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
      error: "Please correct the highlighted fields.",
    };
  }

  const { fullName, email, password } = validation.data;
  const locale = (formData.get("locale") as string) || "en";

  try {
    const supabase = await createServerSupabaseClient();
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    // If confirmation is required
    if (data.user && !data.session) {
      return {
        success: true,
        error: "Confirmation link sent to your email. Please verify before signing in.",
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return { error: message };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/portal`);
}

/**
 * Signs out the current session
 */
export async function signOutAction(locale: string = "en") {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error);
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/auth/login`);
}

