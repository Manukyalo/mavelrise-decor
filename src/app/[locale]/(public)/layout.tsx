import React from "react";
import { headers } from "next/headers";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { BrandedLoader } from "@/components/motion/BrandedLoader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyWhatsApp } from "@/components/layout/StickyWhatsApp";
import { PageTransition } from "@/components/motion/PageTransition";
import { CustomCursor } from "@/components/ui/CustomCursor";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname =
    headersList.get("x-pathname") ??
    headersList.get("x-next-intl-pathname") ??
    "";
  const isPlanner = pathname.includes("/planner");

  return (
    <SmoothScrollProvider>
      {/* Custom Interactive Desktop Cursor */}
      <CustomCursor />

      {/* Branded Loader with MRD Animated Mark */}
      <BrandedLoader />

      {/* Navigation Header for Public Site */}
      <Header />

      {/* Page Route Transitions */}
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Sticky Showroom WhatsApp Concierge */}
      <StickyWhatsApp />

      {/* Showroom Footer — hidden on planner (full-viewport app page) */}
      {!isPlanner && <Footer />}
    </SmoothScrollProvider>
  );
}

