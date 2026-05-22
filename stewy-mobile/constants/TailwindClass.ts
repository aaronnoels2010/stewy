/**
 * Stewy Design System — Tailwind Class Map
 *
 * Maps semantic design tokens to NativeWind (Tailwind) utility class strings.
 * Consumed by `useTailwindThemeClass` and `useDesignTokens`.
 */

export const TailwindClasses = {
  light: {
    // ── Backgrounds ──────────────────────────────────────────────────────────
    background: 'bg-[#F8FAFC]',
    surface: 'bg-white',
    surfaceAlt: 'bg-[#F1F5F9]',

    // ── Borders ───────────────────────────────────────────────────────────────
    border: 'border-[#E2E8F0]',
    borderStrong: 'border-[#CBD5E1]',

    // ── Text ──────────────────────────────────────────────────────────────────
    text: 'text-[#0F172A]',
    textMuted: 'text-[#64748B]',
    textSubtle: 'text-[#94A3B8]',
    textInverse: 'text-white',
    textAccent: 'text-[#059669]',

    // ── Accent ────────────────────────────────────────────────────────────────
    accentBg: 'bg-[#10B981]',
    accentSubtle: 'bg-[#ECFDF5]',

    // ── Tabs ──────────────────────────────────────────────────────────────────
    tint: 'text-[#10B981]',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#10B981',
    icon: '#64748B',

    // ── Status ────────────────────────────────────────────────────────────────
    successBg: 'bg-[#ECFDF5]',
    successText: 'text-[#047857]',
    warningBg: 'bg-[#FFFBEB]',
    warningText: 'text-[#B45309]',
    dangerBg: 'bg-[#FEF2F2]',
    dangerText: 'text-[#B91C1C]',
    infoBg: 'bg-[#EFF6FF]',
    infoText: 'text-[#1D4ED8]',
  },

  dark: {
    // ── Backgrounds ──────────────────────────────────────────────────────────
    background: 'bg-[#09090B]',
    surface: 'bg-[#18181B]',
    surfaceAlt: 'bg-[#27272A]',

    // ── Borders ───────────────────────────────────────────────────────────────
    border: 'border-[#27272A]',
    borderStrong: 'border-[#3F3F46]',

    // ── Text ──────────────────────────────────────────────────────────────────
    text: 'text-[#FAFAFA]',
    textMuted: 'text-[#A1A1AA]',
    textSubtle: 'text-[#71717A]',
    textInverse: 'text-[#09090B]',
    textAccent: 'text-[#34D399]',

    // ── Accent ────────────────────────────────────────────────────────────────
    accentBg: 'bg-[#10B981]',
    accentSubtle: 'bg-[#064E3B]',

    // ── Tabs ──────────────────────────────────────────────────────────────────
    tint: 'text-[#10B981]',
    tabIconDefault: '#71717A',
    tabIconSelected: '#10B981',
    icon: '#A1A1AA',

    // ── Status ────────────────────────────────────────────────────────────────
    successBg: 'bg-[#064E3B]',
    successText: 'text-[#34D399]',
    warningBg: 'bg-[#451A03]',
    warningText: 'text-[#FBBF24]',
    dangerBg: 'bg-[#450A0A]',
    dangerText: 'text-[#FCA5A5]',
    infoBg: 'bg-[#172554]',
    infoText: 'text-[#93C5FD]',
  },
} as const;

export type TailwindColorKey = keyof typeof TailwindClasses.light;
