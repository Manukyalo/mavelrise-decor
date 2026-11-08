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
        brand: {
          orange: {
            DEFAULT: "#F25C05", // Vibrant architectural burnt orange
            hover: "#D84F00",
            light: "#FFF0E6",
            subtle: "#F97316",
            glow: "rgba(242, 92, 5, 0.25)",
          },
          green: {
            DEFAULT: "#0F4C3A", // Rich Kenyan emerald / heritage green
            dark: "#08291F",
            deep: "#051A14",
            light: "#E8F5EE",
            subtle: "#166534",
            glow: "rgba(15, 76, 58, 0.25)",
          },
          black: {
            DEFAULT: "#0A0B0D", // Obsidian black
            elevated: "#121417",
            card: "#171A1E",
            border: "#23272E",
            muted: "#666D77",
          },
          white: "#FFFFFF",
          sand: {
            50: "#FAF9F5",
            100: "#F4F1EA",
            200: "#E8E3D7",
            300: "#D3CBBA",
            400: "#B8AC97",
            500: "#9C8F79",
          },
          brass: {
            DEFAULT: "#C5A059",
            light: "#E1C68E",
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

