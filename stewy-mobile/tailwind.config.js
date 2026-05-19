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
        // ── Stewy Accent — Soccer Green ────────────────────────────────────
        accent: {
          DEFAULT: "#2ECC71",
          50:  "#E8F8F0",
          100: "#D1F1E1",
          200: "#A3E4C3",
          300: "#75D6A5",
          400: "#58D68D",
          500: "#2ECC71",
          600: "#27AE60",
          700: "#1E8449",
          800: "#145A32",
          900: "#0A2D19",
          950: "#041209",
        },

        // ── Semantic Surface Tokens ────────────────────────────────────────
        // These map to the exact hex values in Colors.ts for use in
        // arbitrary value classes like bg-[#...] — the values here allow
        // using named classes like bg-pitch-bg, text-pitch-text, etc.
        "pitch": {
          bg:        "#F4F6F0",
          surface:   "#FFFFFF",
          alt:       "#EAEDE4",
          border:    "#D0D8C8",
          text:      "#1A2010",
          muted:     "#5A6B4A",
          subtle:    "#8A9A7A",
        },
        "night": {
          bg:        "#0D1117",
          surface:   "#161B22",
          alt:       "#1C2128",
          border:    "#2D3748",
          text:      "#E8F0E1",
          muted:     "#6B8060",
          subtle:    "#495E40",
        },
      },

      fontFamily: {
        sans: ["System"],
      },

      borderRadius: {
        "4xl": "2rem",
      },

      boxShadow: {
        "accent-sm": "0 2px 8px rgba(46, 204, 113, 0.25)",
        "accent-md": "0 4px 16px rgba(46, 204, 113, 0.35)",
        "accent-lg": "0 8px 32px rgba(46, 204, 113, 0.40)",
      },
    },
  },
  plugins: [],
};
