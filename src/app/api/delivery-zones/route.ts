import { NextResponse } from "next/server";
import { getDeliveryZones } from "@/lib/supabase/delivery";

// Cache this response for 1 hour — delivery zones change infrequently.
export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
  try {
    const zones = await getDeliveryZones();
    return NextResponse.json(zones);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load delivery zones";
    return NextResponse.json(
      { error: message, code: "DELIVERY_ZONES_FETCH_ERROR", status: 500 },
      { status: 500 }
    );
  }
}
