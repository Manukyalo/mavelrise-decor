import { createClient } from "@/lib/supabase/client";
import { Project, ProjectCategory } from "@/types/database";

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "proj-01",
    slug: "karen-monolithic-villa",
    title: "The Karen Monolithic Villa",
    category: "Full Spatial Suite",
    location: "Karen, Nairobi",
    client_type: "Private Residence",
    area_sqm: 420,
    completion_year: 2024,
    cover_image_url:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    ],
    systems_installed: [
      "SPC French Oak Flooring (6.0mm)",
      "Acoustic Fluted Walnut Slat Panels",
      "Calacatta Gold UV Marble Slabs",
      "Floating Gypsum Ceiling Rafts with Indirect LED",
    ],
    description:
      "A complete architectural finishes fit-out featuring 6mm waterproof SPC French Oak flooring throughout living areas, paired with acoustic fluted walnut slats in the private screening room and book-matched Calacatta Gold UV marble behind the display monolith.",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-02",
    slug: "westlands-executive-penthouse",
    title: "Westlands Executive Penthouse",
    category: "Acoustic Wall Panels",
    location: "Westlands, Nairobi",
    client_type: "Penthouse Residence",
    area_sqm: 280,
    completion_year: 2024,
    cover_image_url:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
    ],
    systems_installed: [
      "Fluted American Walnut Slats (NRC 0.85)",
      "Recessed 48V Low-Voltage Magnetic Lighting",
      "SPC Smoked Oak Flooring",
    ],
    description:
      "Engineered sound dampening acoustic wood slats framing high-altitude panoramic city vistas. Integrated warm 3000K diurnal lighting wash eliminates nighttime glass reflection.",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-03",
    slug: "gigiri-diplomatic-boardroom",
    title: "Gigiri Diplomatic Boardroom",
    category: "Full Spatial Suite",
    location: "Gigiri, Nairobi",
    client_type: "Diplomatic Mission",
    area_sqm: 160,
    completion_year: 2024,
    cover_image_url:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    ],
    systems_installed: [
      "Acoustic PET Slat Walls",
      "Anti-Static 0.55mm Wear-Layer SPC Flooring",
      "Level 5 Acoustic Gypsum Coffered Ceiling",
    ],
    description:
      "Ultra-low reverberation acoustic spatial fit-out designed for international teleconferencing clarity, featuring anti-static 0.55mm wear-layer SPC planks and bespoke coffered gypsum ceilings with micro-prism troffers.",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-04",
    slug: "muthaiga-sanctuary-residence",
    title: "Muthaiga Sanctuary Residence",
    category: "UV Marble",
    location: "Muthaiga, Nairobi",
    client_type: "Private Residence",
    area_sqm: 340,
    completion_year: 2023,
    cover_image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    ],
    systems_installed: [
      "UV Nero Marquina Marble (2800x1220mm)",
      "Hand-Spun Brushed Brass Pendants",
      "SPC Nordic Ash Flooring",
    ],
    description:
      "Monolithic 2800x1220mm mirror-gloss Nero Marquina feature walls seamlessly integrated with hand-spun brushed brass architectural lampshades and Nordic Ash SPC flooring.",
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-05",
    slug: "runda-estate-grand-salon",
    title: "Runda Estate Grand Salon",
    category: "Gypsum Ceilings",
    location: "Runda, Nairobi",
    client_type: "Private Residence",
    area_sqm: 510,
    completion_year: 2023,
    cover_image_url:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1600&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1600&q=80",
    ],
    systems_installed: [
      "Multi-Tier Suspended Gypsum Bulkheads",
      "15mm Negative Perimeter Shadowline Reglets",
      "SPC Natural Oak Herringbone",
    ],
    description:
      "A grand double-volume formal reception hall sculpted with negative shadowline reglets and multi-tiered floating bulkheads, creating dramatic weightless ceiling planes.",
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-06",
    slug: "lavington-contemporary-duplex",
    title: "Lavington Contemporary Duplex",
    category: "SPC Flooring",
    location: "Lavington, Nairobi",
    client_type: "Luxury Duplex",
    area_sqm: 230,
    completion_year: 2024,
    cover_image_url:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
    ],
    systems_installed: [
      "SPC Smoked Walnut Unilin Click-Lock (6.0mm)",
      "IXPE Sound Dampening Sub-Layer",
      "Flush Brushed Aluminum Transition Trims",
    ],
    description:
      "High-traffic residential duplex finished with heavy commercial grade 0.55mm wear-layer SPC Smoked Walnut planks, delivering absolute moisture immunity across kitchen and bath adjacencies.",
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getProjects(category?: ProjectCategory | "All"): Promise<Project[]> {
  try {
    const supabase = createClient();
    let query = supabase.from("projects").select("*").order("completion_year", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (category && category !== "All") {
        return FALLBACK_PROJECTS.filter((p) => p.category === category);
      }
      return FALLBACK_PROJECTS;
    }

    return data as Project[];
  } catch {
    if (category && category !== "All") {
      return FALLBACK_PROJECTS.filter((p) => p.category === category);
    }
    return FALLBACK_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single();

    if (error || !data) {
      return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
    }

    return data as Project;
  } catch {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
  }
}

