const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/TailwindClass.ts",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── Stewy Accent — Premium Emerald ─────────────────────────────────
        accent: {
          DEFAULT: "#10B981",
          50:  "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          950: "#022C22",
        },

        // ── Semantic Surface Tokens ────────────────────────────────────────
        "pitch": {
          bg:        "#F8FAFC",
          surface:   "#FFFFFF",
          alt:       "#F1F5F9",
          border:    "#E2E8F0",
          text:      "#0F172A",
          muted:     "#64748B",
          subtle:    "#94A3B8",
        },
        "night": {
          bg:        "#09090B",
          surface:   "#18181B",
          alt:       "#27272A",
          border:    "#27272A",
          text:      "#FAFAFA",
          muted:     "#A1A1AA",
          subtle:    "#71717A",
        },
      },

      fontFamily: {
        sans: ["System"],
      },

      borderRadius: {
        "4xl": "2.5rem", // Slightly larger for more premium feel
        "3xl": "1.75rem",
      },

      boxShadow: {
        "accent-sm": "0 2px 8px rgba(16, 185, 129, 0.2)",
        "accent-md": "0 4px 16px rgba(16, 185, 129, 0.3)",
        "accent-lg": "0 8px 32px rgba(16, 185, 129, 0.35)",
        "premium-sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "premium-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "premium-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
