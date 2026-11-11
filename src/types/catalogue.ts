export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "order_only";

export interface Category {
  id: string;
  slug: string;
  name: string;
  name_sw?: string | null;
  tagline: string | null;
  tagline_sw?: string | null;
  description: string | null;
  description_sw?: string | null;
  cover_image_url: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface ProductVariant {
  label: string;
  sku: string;
  thickness?: string;
  price_kes?: number;
}

export interface ProductSpecs {
  wear_layer?: string;
  AC_rating?: string;
  click_system?: string;
  waterproof?: boolean;
  installation?: string;
  underlay?: string;
  panel_width?: string;
  panel_height?: string;
  fire_rating?: string;
  moisture_proof?: boolean;
  type?: string;
  roll_width?: string;
  roll_length?: string;
  panel_size?: string;
  application?: string;
  resistance?: string;
  bulb_base?: string;
  max_wattage?: string;
  suspension?: string;
  diameter?: string;
  dimensions?: string;
  material?: string;
  style?: string;
  note?: string;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  code: string;
  slug: string;
  name: string;
  name_sw?: string | null;
  category_id: string;
  thickness: string | null;
  size: string | null;
  colour: string | null;
  finish: string | null;
  price_kes: number | null;
  unit: string;
  stock_status: StockStatus;
  images: string[];
  texture_url: string | null;
  description: string | null;
  description_sw?: string | null;
  specs: ProductSpecs;
  variants: ProductVariant[];
  is_placeholder: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CatalogueFilterState {
  categorySlug?: string;
  colour?: string;
  thickness?: string;
  stockStatus?: string;
  searchQuery?: string;
}

