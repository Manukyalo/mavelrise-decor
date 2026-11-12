import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        admin: {
          bg: "var(--admin-bg)",
          surface: "var(--admin-surface)",
          "surface-raised": "var(--admin-surface-raised)",
          "surface-hover": "var(--admin-surface-hover)",
          border: "var(--admin-border)",
          "border-subtle": "var(--admin-border-subtle)",
          "border-gold": "var(--admin-border-gold)",
          text: "var(--admin-text)",
          "text-muted": "var(--admin-text-muted)",
          gold: "var(--admin-gold)",
          "gold-hover": "var(--admin-gold-hover)",
          "gold-muted": "var(--admin-gold-muted)",
          success: "var(--admin-success)",
          "success-surface": "var(--admin-success-surface)",
          warning: "var(--admin-warning)",
          "warning-surface": "var(--admin-warning-surface)",
          danger: "var(--admin-danger)",
          "danger-surface": "var(--admin-danger-surface)",
          info: "var(--admin-info)",
          "info-surface": "var(--admin-info-surface)",
        },
        brand: {
          // =========================================================================
          // LUXURY IDENTITY TOKENS (Navy & Champagne Gold System)
          // =========================================================================
          navy: {
            DEFAULT: "#0B1B33", // Primary deep luxury navy canvas
            elevated: "#10223E", // Elevated navy surface
            card: "#14284B", // Rich navy component cards
            light: "#1C3765", // Interactive hover navy
            deep: "#071224", // Deepest navy for footer & heavy contrast
            border: "rgba(200, 161, 90, 0.2)",
          },
          gold: {
            DEFAULT: "#C8A15A", // Champagne gold - primary accent, rules, key actions
            hover: "#B68E46", // Burnished gold
            light: "#E5CCA0", // Delicate champagne highlight
            subtle: "#D4AF67", // Mid-tone gold
            glow: "rgba(200, 161, 90, 0.25)",
            border: "rgba(200, 161, 90, 0.35)",
          },
          ivory: {
            DEFAULT: "#F6F1E7", // Warm ivory - primary display & body text
            100: "#FAF7F2",
            200: "#F6F1E7",
            300: "#E8DFC9",
            400: "#D2C4A7",
            500: "#B5A584",
          },
          oak: {
            DEFAULT: "#7D5537", // Warm French oak architectural accent
            dark: "#4A301D",
            light: "#A67C52",
          },
          charcoal: {
            DEFAULT: "#091424", // Deep charcoal navy
            card: "#0E1B30",
            muted: "#6A7B95",
          },

          // Official MRD Logo Mark Colors (Preserved strictly within the logo as requested)
          orange: {
            DEFAULT: "#F25C05", // Burnt orange mark dot
            hover: "#D84F00",
            light: "#FFF0E6",
            subtle: "#F97316",
            glow: "rgba(242, 92, 5, 0.25)",
          },
          green: {
            DEFAULT: "#0F4C3A", // Heritage green mark dot
            dark: "#08291F",
            deep: "#051A14",
            light: "#E8F5EE",
            subtle: "#166534",
            glow: "rgba(15, 76, 58, 0.25)",
          },

          // Backward Compatibility Aliases Mapped to the Luxury Navy & Ivory System
          black: {
            DEFAULT: "#0B1B33", // Maps to Deep Navy
            elevated: "#10223E", // Maps to Elevated Navy
            card: "#14284B", // Maps to Rich Navy
            border: "rgba(200, 161, 90, 0.2)",
            muted: "#6A7B95",
          },
          white: "#FFFFFF",
          sand: {
            50: "#FAF7F2",
            100: "#F6F1E7",
            200: "#E8DFC9",
            300: "#D2C4A7",
            400: "#B5A584",
            500: "#948464",
          },
          brass: {
            DEFAULT: "#C8A15A", // Maps to Champagne Gold
            light: "#E5CCA0",
            dark: "#8F6E32",
          },
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest: ".25em",
        extrawide: ".35em",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.08)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "luxury": "cubic-bezier(0.16, 1, 0.3, 1)",
        "luxury-out": "cubic-bezier(0.33, 1, 0.68, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
