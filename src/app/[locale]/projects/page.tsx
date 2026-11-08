"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FALLBACK_PROJECTS } from "@/services/projects";
import { ProjectCategory, Project } from "@/types/database";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  Sparkles,
  ArrowUpRight,
  MapPin,
  Maximize2,
  Calendar,
  Layers,
  CheckCircle2,
  X,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES: (ProjectCategory | "All")[] = [
  "All",
  "Full Spatial Suite",
  "SPC Flooring",
  "Acoustic Wall Panels",
  "UV Marble",
  "Gypsum Ceilings",
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    selectedCategory === "All"
      ? FALLBACK_PROJECTS
      : FALLBACK_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-brand-navy text-brand-ivory pt-28 pb-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full bg-brand-gold/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-brand-navy-light/30 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-14">
        {/* Page Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Architectural Portfolio</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl uppercase font-light text-brand-ivory leading-[0.98]">
            Architectural Finishes <br />
            <span className="italic text-brand-gold">Commissioned Across Nairobi</span>
          </h1>

          <p className="text-xs sm:text-base font-sans text-brand-ivory/70 max-w-2xl leading-relaxed">
            Inspect our completed interior finishing projects across Karen, Westlands, Runda, Gigiri, and Muthaiga. From diplomatic boardrooms to private luxury penthouses.
          </p>
        </div>

        {/* Filter Strip */}
        <div className="flex flex-wrap items-center gap-2 border-b border-brand-gold/15 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xs text-xs font-mono uppercase tracking-wider transition-all duration-200 border",
                selectedCategory === cat
                  ? "bg-brand-gold border-brand-gold text-brand-navy font-bold shadow-lg shadow-brand-gold/25"
                  : "bg-brand-navy-card border-brand-gold/20 text-brand-ivory/70 hover:border-brand-gold/50 hover:text-brand-ivory"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <Reveal
              key={project.id}
              direction="up"
              distance={30}
              delay={idx * 0.08}
              className="h-full"
            >
              <article
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-sm bg-brand-navy-card border border-brand-gold/20 hover:border-brand-gold/60 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer h-full shadow-xl"
              >
                {/* Image Canvas with 16:10 Aspect */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-navy-deep">
                  <Image
                    src={project.cover_image_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-card via-brand-navy-card/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-brand-navy-deep/85 backdrop-blur-md border border-brand-gold/30 text-brand-gold font-bold">
                      {project.category}
                    </span>
                  </div>

                  {/* Year Tag */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono text-brand-ivory/80 bg-brand-navy-deep/75 backdrop-blur-md border border-brand-gold/20">
                    <Calendar className="w-3 h-3 text-brand-gold" />
                    <span>{project.completion_year}</span>
                  </div>

                  {/* Location Overlay */}
                  <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 text-xs font-mono text-brand-ivory">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{project.location}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-brand-gold/70">
                      {project.client_type} {project.area_sqm && `• ${project.area_sqm} m²`}
                    </div>
                    <h2 className="font-display text-2xl uppercase text-brand-ivory group-hover:text-brand-gold transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-xs font-sans text-brand-ivory/70 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Systems installed tags */}
                  <div className="pt-3 border-t border-brand-gold/15 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {project.systems_installed.slice(0, 2).map((sys, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-xs bg-brand-navy text-[10px] font-mono text-brand-ivory/80 border border-brand-gold/20"
                        >
                          {sys}
                        </span>
                      ))}
                      {project.systems_installed.length > 2 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono text-brand-gold">
                          +{project.systems_installed.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-brand-gold/80 pt-2 group-hover:text-brand-gold transition-colors">
                      <span>Inspect Project Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-brand-gold" />
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Technical Drawings Submission Banner */}
        <div className="p-8 sm:p-12 rounded-sm bg-brand-navy-card border border-brand-gold/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold block font-bold">
              Architects & Developers
            </span>
            <h3 className="font-display text-3xl sm:text-4xl uppercase text-brand-ivory">
              Have Architectural Drawings or Site Dimensions?
            </h3>
            <p className="text-xs sm:text-sm font-sans text-brand-ivory/70 leading-relaxed">
              Upload your AutoCAD, PDF drawings, or volumetric schedules to our Nairobi engineering atelier for a line-item bill of quantities within 48 hours.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton strength={0.4}>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent("Hello MarvelRise Decor, I have architectural drawings and would like a 48-hour itemized estimate.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-xl shadow-brand-gold/25"
              >
                <span>Submit Plans on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </MagneticButton>

            <a
              href="tel:+254712345678"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-sm bg-brand-navy hover:bg-brand-navy-light text-brand-ivory border border-brand-gold/30 text-xs font-mono uppercase tracking-widest transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              <span>Call Lead Estimator</span>
            </a>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm bg-brand-navy-card border border-brand-gold/35 shadow-2xl p-6 sm:p-10 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-brand-ivory transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-10">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
                <span>{selectedProject.category}</span>
                <span>•</span>
                <span>{selectedProject.location}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl uppercase text-brand-ivory">
                {selectedProject.title}
              </h2>
            </div>

            {/* Hero Image */}
            <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-brand-gold/20">
              <Image
                src={selectedProject.cover_image_url}
                alt={selectedProject.title}
                fill
                sizes="(max-width: 1200px) 100vw, 900px"
                className="object-cover"
              />
            </div>

            {/* Specifications Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xs bg-brand-navy border border-brand-gold/20 text-xs font-mono">
              <div>
                <span className="text-brand-gold block uppercase text-[10px] font-bold">Environment</span>
                <span className="text-brand-ivory font-semibold">{selectedProject.client_type}</span>
              </div>
              <div>
                <span className="text-brand-gold block uppercase text-[10px] font-bold">Surface Area</span>
                <span className="text-brand-ivory font-semibold">
                  {selectedProject.area_sqm ? `${selectedProject.area_sqm} m²` : "Custom Fit"}
                </span>
              </div>
              <div>
                <span className="text-brand-gold block uppercase text-[10px] font-bold">Completed</span>
                <span className="text-brand-ivory font-semibold">{selectedProject.completion_year}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
                Architectural Scope of Works
              </h3>
              <p className="text-sm font-sans text-brand-ivory/80 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Systems Installed */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
                Installed Architectural Systems
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProject.systems_installed.map((sys, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xs bg-brand-navy border border-brand-gold/20 text-xs font-mono text-brand-ivory/90"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>{sys}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-brand-gold/15 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono text-brand-gold/70">
                Project Code: {selectedProject.slug}
              </span>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "254712345678"}?text=${encodeURIComponent(`Hello MarvelRise Decor, I am interested in finishing a space similar to ${selectedProject.title} (${selectedProject.location}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-lg shadow-brand-gold/20"
              >
                <span>Commission Similar Fit-Out</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
