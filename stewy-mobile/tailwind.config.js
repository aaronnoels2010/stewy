/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.ts",
  ],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        pitch: {
          DEFAULT: "#006B22",
          dark: "#005318",
          deep: "#003D12",
          light: "#178632",
          bright: "#2D963F",
          fixed: "#91FA95",
          fixedDim: "#75DC7C",
          subtle: "#E7F5E8",
          darkSurface: "#111C2D",
          darkAlt: "#1E293B",
        },
      },

      fontFamily: {
        display: ["ArchivoNarrow_700Bold"],
        headline: ["ArchivoNarrow_600SemiBold"],
        body: ["HankenGrotesk_400Regular"],
        bodySemibold: ["HankenGrotesk_600SemiBold"],
        label: ["JetBrainsMono_500Medium"],
      },

      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", fontWeight: "700" }],
        "display-mobile": ["36px", { lineHeight: "42px", fontWeight: "700" }],
      },

      borderRadius: {
        pitch: "0",
        "pitch-sm": "2px",
        "pitch-md": "4px",
        "pitch-lg": "8px",
        "pitch-xl": "12px",
      },

      boxShadow: {
        "pitch-sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "pitch-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "pitch-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "pitch-btn": "0 4px 12px rgba(0, 107, 34, 0.3)",
        "pitch-btn-dark": "0 4px 12px rgba(45, 150, 63, 0.3)",
      },
    },
  },
  plugins: [],
};
