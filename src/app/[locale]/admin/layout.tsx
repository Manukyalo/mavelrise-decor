import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin";
import { AdminShell } from "@/components/admin/AdminShell";

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

  return (
    <AdminShell
      userEmail={session.user.email}
      role={session.role}
      locale={locale}
    >
      {children}
    </AdminShell>
  );
}

