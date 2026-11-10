import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProposalDocumentView } from "@/components/quote/ProposalDocumentView";
import { DetailedQuoteProposal, calculateQuoteProposal } from "@/lib/planner/quoteEngine";
import { TEMPLATES } from "@/lib/planner/templates";
import type { Metadata } from "next";

export const revalidate = 0; // Dynamic proposal rendering

interface QuotePageProps {
  params: {
    locale: string;
    quoteNumber: string;
  };
}

export async function generateMetadata({
  params,
}: QuotePageProps): Promise<Metadata> {
  return {
    title: `Proposal ${params.quoteNumber} | MarvelRise Decor Nairobi`,
    description: `Official architectural finishes tender and quote proposal ${params.quoteNumber}.`,
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
  let proposal: DetailedQuoteProposal | null = null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("quote_number", params.quoteNumber)
      .single();

    if (data && data.quote_data) {
      proposal = data.quote_data as DetailedQuoteProposal;
    }
  } catch (err) {
    console.error("[QuotePage] Exception fetching quote:", err);
  }

  // Fallback: If quote number is fresh or direct simulation, construct standard proposal
  if (!proposal) {
    const defaultRooms = TEMPLATES["2bed"].map((r, i) => ({
      ...r,
      id: `room-${i}`,
      wallFinishType: i === 0 ? ("wpc" as const) : undefined,
      wallFinishCode: i === 0 ? "J300H1A8" : undefined,
      lampCode: i === 0 ? "MRDP003" : undefined,
      lampLightOn: true,
      decorCode: i === 0 ? "DECOR-VASE-001" : undefined,
    }));

    proposal = calculateQuoteProposal(
      defaultRooms,
      "supply_only",
      10,
      params.quoteNumber
    );
  }

  return (
    <div className="min-h-screen bg-[#02050c] text-white pt-24 sm:pt-28 pb-32">
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        <ProposalDocumentView
          initialProposal={proposal}
          locale={params.locale}
        />
      </main>
    </div>
  );
}

