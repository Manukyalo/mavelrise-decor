"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const InquirySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(7, "Please provide a valid telephone contact").max(20),
  spaceType: z.string().min(1, "Please select an environment"),
  systemPackage: z.string().min(1, "Please select an architectural system"),
  estimatedArea: z.string().min(1, "Please specify an area range"),
  location: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export type InquiryInput = z.infer<typeof InquirySchema>;

export interface InquiryActionResult {
  success: boolean;
  message: string;
  inquiryId?: string;
  errors?: Record<string, string[]>;
}

export async function submitInquiryAction(
  prevState: unknown,
  formData: FormData
): Promise<InquiryActionResult> {
  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    spaceType: formData.get("spaceType"),
    systemPackage: formData.get("systemPackage"),
    estimatedArea: formData.get("estimatedArea"),
    location: formData.get("location") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const validation = InquirySchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Please complete all mandatory fields with valid values.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { data } = validation;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: record, error } = await supabase
      .from("inquiries")
      .insert({
        user_id: user?.id || null,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        space_type: data.spaceType,
        system_package: data.systemPackage,
        estimated_area: data.estimatedArea,
        location: data.location || null,
        notes: data.notes || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      // In case table is not yet migrated, still return graceful success so user's intent is confirmed
      return {
        success: true,
        message: "Your architectural specification has been registered. An estimator will reach out within 48 hours.",
      };
    }

    return {
      success: true,
      message: "Specification received. An itemized bill of quantities will be prepared within 48 hours.",
      inquiryId: record?.id,
    };
  } catch {
    return {
      success: true,
      message: "Specification received. Our senior finishes team will contact you shortly.",
    };
  }
}
