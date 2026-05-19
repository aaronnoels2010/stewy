/**
 * Stewy Design System — Tailwind Class Map
 *
 * Maps semantic design tokens to NativeWind (Tailwind) utility class strings.
 * Consumed by `useTailwindThemeClass` and `useDesignTokens`.
 */

export const TailwindClasses = {
  light: {
    // ── Backgrounds ──────────────────────────────────────────────────────────
    background: 'bg-[#F4F6F0]',
    surface: 'bg-white',
    surfaceAlt: 'bg-[#EAEDE4]',

    // ── Borders ───────────────────────────────────────────────────────────────
    border: 'border-[#D0D8C8]',
    borderStrong: 'border-[#B0BCA4]',

    // ── Text ──────────────────────────────────────────────────────────────────
    text: 'text-[#1A2010]',
    textMuted: 'text-[#5A6B4A]',
    textSubtle: 'text-[#8A9A7A]',
    textInverse: 'text-white',
    textAccent: 'text-[#1E8449]',

    // ── Accent ────────────────────────────────────────────────────────────────
    accentBg: 'bg-[#2ECC71]',
    accentSubtle: 'bg-[#E8F8F0]',

    // ── Tabs ──────────────────────────────────────────────────────────────────
    tint: 'text-[#2ECC71]',
    tabIconDefault: '#8A9A7A',
    tabIconSelected: '#2ECC71',
    icon: '#5A6B4A',

    // ── Status ────────────────────────────────────────────────────────────────
    successBg: 'bg-[#E8F8F0]',
    successText: 'text-[#1E8449]',
    warningBg: 'bg-[#FEF5E4]',
    warningText: 'text-[#9A6109]',
    dangerBg: 'bg-[#FDEDEC]',
    dangerText: 'text-[#922B21]',
    infoBg: 'bg-[#EBF5FB]',
    infoText: 'text-[#1A5276]',
  },

  dark: {
    // ── Backgrounds ──────────────────────────────────────────────────────────
    background: 'bg-[#0D1117]',
    surface: 'bg-[#161B22]',
    surfaceAlt: 'bg-[#1C2128]',

    // ── Borders ───────────────────────────────────────────────────────────────
    border: 'border-[#2D3748]',
    borderStrong: 'border-[#404B5A]',

    // ── Text ──────────────────────────────────────────────────────────────────
    text: 'text-[#E8F0E1]',
    textMuted: 'text-[#6B8060]',
    textSubtle: 'text-[#495E40]',
    textInverse: 'text-[#0D1117]',
    textAccent: 'text-[#58D68D]',

    // ── Accent ────────────────────────────────────────────────────────────────
    accentBg: 'bg-[#2ECC71]',
    accentSubtle: 'bg-[#162A1F]',

    // ── Tabs ──────────────────────────────────────────────────────────────────
    tint: 'text-[#2ECC71]',
    tabIconDefault: '#6B8060',
    tabIconSelected: '#2ECC71',
    icon: '#6B8060',

    // ── Status ────────────────────────────────────────────────────────────────
    successBg: 'bg-[#162A1F]',
    successText: 'text-[#58D68D]',
    warningBg: 'bg-[#2A1F05]',
    warningText: 'text-[#FFC107]',
    dangerBg: 'bg-[#2A0F0F]',
    dangerText: 'text-[#FF6B6B]',
    infoBg: 'bg-[#0A1929]',
    infoText: 'text-[#5DADE2]',
  },
} as const;

export type TailwindColorKey = keyof typeof TailwindClasses.light;
