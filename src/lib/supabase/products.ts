import { createServerSupabaseClient } from "./server";
import { Category, Product } from "@/types/catalogue";

// High-resolution architectural texture & showroom context imagery mapping
const CATEGORY_DEFAULT_IMAGES: Record<string, { textures: string[]; roomContext: string }> = {
  "spc-flooring": {
    textures: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80",
    ],
    roomContext: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
  "wpc-wall-panels": {
    textures: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    ],
    roomContext: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
  },
  "marble-sheets": {
    textures: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80",
    ],
    roomContext: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
  },
  "lampshades": {
    textures: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
    ],
    roomContext: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=1600&q=80",
  },
  "decor-accessories": {
    textures: [
      "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
    ],
    roomContext: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  },
};

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[getCategories] Supabase error:", error);
      return [];
    }

    return (data as Category[]) || [];
  } catch (err) {
    console.error("[getCategories] Unexpected exception:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (error) {
      console.error(`[getCategoryBySlug] slug=${slug}:`, error);
      return null;
    }

    return data as Category;
  } catch (err) {
    console.error(`[getCategoryBySlug] slug=${slug} exception:`, err);
    return null;
  }
}

export async function getProducts(options?: {
  categorySlug?: string;
  colour?: string;
  thickness?: string;
  stockStatus?: string;
  limit?: number;
}): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (options?.categorySlug) {
      // Find category ID first for strict index use
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", options.categorySlug)
        .single();

      if (cat?.id) {
        query = query.eq("category_id", cat.id);
      }
    }

    if (options?.thickness) {
      query = query.eq("thickness", options.thickness);
    }

    if (options?.stockStatus) {
      query = query.eq("stock_status", options.stockStatus);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getProducts] query error:", error);
      return [];
    }

    // Attach high-fidelity imagery fallback if empty
    return (data || []).map((prod: Product) => {
      const catSlug = prod.category?.slug || "spc-flooring";
      const defaults = CATEGORY_DEFAULT_IMAGES[catSlug] || CATEGORY_DEFAULT_IMAGES["spc-flooring"];
      return {
        ...prod,
        images: prod.images && prod.images.length > 0 ? prod.images : defaults.textures,
        texture_url: prod.texture_url || defaults.textures[0],
      };
    });
  } catch (err) {
    console.error("[getProducts] exception:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (error || !data) {
      console.error(`[getProductBySlug] slug=${slug}:`, error);
      return null;
    }

    const catSlug = data.category?.slug || "spc-flooring";
    const defaults = CATEGORY_DEFAULT_IMAGES[catSlug] || CATEGORY_DEFAULT_IMAGES["spc-flooring"];

    return {
      ...data,
      images: data.images && data.images.length > 0 ? data.images : [defaults.textures[0], defaults.roomContext, defaults.textures[1]],
      texture_url: data.texture_url || defaults.textures[0],
    } as Product;
  } catch (err) {
    console.error(`[getProductBySlug] slug=${slug} exception:`, err);
    return null;
  }
}

export async function getProductByCode(code: string): Promise<Product | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("code", code)
      .eq("active", true)
      .single();

    if (error || !data) {
      console.error(`[getProductByCode] code=${code}:`, error);
      return null;
    }

    const catSlug = data.category?.slug || "spc-flooring";
    const defaults = CATEGORY_DEFAULT_IMAGES[catSlug] || CATEGORY_DEFAULT_IMAGES["spc-flooring"];

    return {
      ...data,
      images: data.images && data.images.length > 0 ? data.images : [defaults.textures[0], defaults.roomContext],
      texture_url: data.texture_url || defaults.textures[0],
    } as Product;
  } catch (err) {
    console.error(`[getProductByCode] code=${code} exception:`, err);
    return null;
  }
}
