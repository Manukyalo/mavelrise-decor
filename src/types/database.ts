export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "client" | "architect" | "admin";

export type ProjectCategory =
  | "SPC Flooring"
  | "Acoustic Wall Panels"
  | "UV Marble"
  | "Gypsum Ceilings"
  | "Architectural Lighting"
  | "Full Spatial Suite";

export type InquiryStatus =
  | "new"
  | "contacted"
  | "survey_scheduled"
  | "quoted"
  | "completed"
  | "cancelled";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  client_type: string;
  area_sqm: number | null;
  completion_year: number;
  cover_image_url: string;
  gallery_images: string[];
  systems_installed: string[];
  description: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  phone: string;
  space_type: string;
  system_package: string;
  estimated_area: string;
  location?: string | null;
  notes?: string | null;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Project, "id">>;
      };
      inquiries: {
        Row: Inquiry;
        Insert: Omit<Inquiry, "id" | "created_at" | "updated_at" | "status"> & {
          status?: InquiryStatus;
        };
        Update: Partial<Omit<Inquiry, "id">>;
      };
    };
  };
}
