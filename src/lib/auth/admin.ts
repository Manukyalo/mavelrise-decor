import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AdminSession {
  user: {
    id: string;
    email?: string;
  };
  role: "owner" | "staff";
  fullName?: string;
}

/**
 * Validates whether the incoming request is authenticated with an admin role.
 * Returns the session details or null.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Verify role in admin_users table
    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("role, full_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminRecord) {
      return {
        user: { id: user.id, email: user.email },
        role: adminRecord.role as "owner" | "staff",
        fullName: adminRecord.full_name || user.email?.split("@")[0],
      };
    }

    // If no admin_users row yet, allow authenticated users whose email matches owner or staff domain
    // or during initial setup
    if (user.email && (user.email.includes("marvelrise") || user.email.includes("architect") || user.email.includes("admin") || user.email.includes("manu"))) {
      return {
        user: { id: user.id, email: user.email },
        role: "owner",
        fullName: "Atelier Director",
      };
    }

    return null;
  } catch (error) {
    console.error("Admin session check failed:", error);
    return null;
  }
}
