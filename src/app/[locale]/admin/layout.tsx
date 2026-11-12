import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { createClient } from "@supabase/supabase-js";

export const metadata = {
  title: "Atelier Command | MarvelRise Decor",
  description: "Executive operations dashboard, lead pipeline and catalog control.",
};

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getAdminSession();

  // Route security: strictly require admin privileges
  if (!session) {
    redirect(`/${locale}/auth/login?next=/${locale}/admin`);
  }

  let hotCount = 2;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { count } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .or("score_tag.eq.hot,score.gte.70");
    if (typeof count === "number") {
      hotCount = count;
    }
  } catch {
    // fallback
  }

  return (
    <AdminShell
      userEmail={session.user.email}
      role={session.role}
      locale={locale}
      hotLeadsCount={hotCount}
    >
      {children}
    </AdminShell>
  );
}
