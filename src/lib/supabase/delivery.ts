import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface DeliveryZone {
  id: string;
  town: string;
  rate_kes: number;
  zone_label: string;
  notes: string | null;
  is_confirmed: boolean;
  active: boolean;
  created_at: string;
}

/**
 * Returns all active delivery zones ordered by rate ascending.
 * Server-only — do NOT import in "use client" components.
 */
export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("delivery_zones")
    .select("id, town, rate_kes, zone_label, notes, is_confirmed, active, created_at")
    .eq("active", true)
    .order("rate_kes", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch delivery zones: ${error.message}`);
  }

  return (data as DeliveryZone[]) ?? [];
}

/**
 * Returns a single active delivery zone matched by town name (case-insensitive).
 * Server-only — do NOT import in "use client" components.
 */
export async function getDeliveryZoneByTown(
  town: string
): Promise<DeliveryZone | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("delivery_zones")
    .select("id, town, rate_kes, zone_label, notes, is_confirmed, active, created_at")
    .eq("active", true)
    .ilike("town", town)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch delivery zone for "${town}": ${error.message}`);
  }

  return (data as DeliveryZone | null) ?? null;
}
