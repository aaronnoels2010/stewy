/**
 * Stewy Design System — Color Tokens
 *
 * Premium Slate/Zinc palette with a vibrant Emerald Green accent.
 * High-end feel with deep blacks in dark mode and clean slates in light mode.
 *
 * Accent: #10B981 (Emerald 500)
 */

// ─── Accent ───────────────────────────────────────────────────────────────────
const accent = '#10B981';      // Emerald 500
const accentDark = '#059669';  // Emerald 600
const accentDeep = '#047857';  // Emerald 700
const accentLight = '#34D399'; // Emerald 400

// ─── Palette ──────────────────────────────────────────────────────────────────
export const Colors = {
  light: {
    // Backgrounds
    background: '#F8FAFC',       // Slate 50
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',       // Slate 100
    surfaceHover: '#E2E8F0',     // Slate 200

    // Borders
    border: '#E2E8F0',           // Slate 200
    borderStrong: '#CBD5E1',     // Slate 300

    // Text
    text: '#0F172A',             // Slate 900
    textMuted: '#64748B',        // Slate 500
    textSubtle: '#94A3B8',       // Slate 400
    textInverse: '#FFFFFF',

    // Accent
    tint: accent,
    accent,
    accentDark,
    accentDeep,
    accentLight,
    accentSubtle: '#ECFDF5',     // Emerald 50
    accentText: accentDark,

    // Tabs
    tabIconDefault: '#94A3B8',
    tabIconSelected: accent,

    // Status
    success: '#10B981',
    successSubtle: '#ECFDF5',
    successText: '#047857',
    warning: '#F59E0B',
    warningSubtle: '#FFFBEB',
    warningText: '#B45309',
    danger: '#EF4444',
    dangerSubtle: '#FEF2F2',
    dangerText: '#B91C1C',
    info: '#3B82F6',
    infoSubtle: '#EFF6FF',
    infoText: '#1D4ED8',

    // Icon
    icon: '#64748B',
  },

  dark: {
    // Backgrounds
    background: '#09090B',       // Zinc 950 (True deep black)
    surface: '#18181B',          // Zinc 900
    surfaceAlt: '#27272A',       // Zinc 800
    surfaceHover: '#3F3F46',     // Zinc 700

    // Borders
    border: '#27272A',           // Zinc 800
    borderStrong: '#3F3F46',     // Zinc 700

    // Text
    text: '#FAFAFA',             // Zinc 50
    textMuted: '#A1A1AA',        // Zinc 400
    textSubtle: '#71717A',       // Zinc 500
    textInverse: '#09090B',

    // Accent
    tint: accent,
    accent,
    accentDark,
    accentDeep,
    accentLight,
    accentSubtle: '#064E3B',     // Emerald 900
    accentText: accentLight,

    // Tabs
    tabIconDefault: '#71717A',
    tabIconSelected: accent,

    // Status
    success: '#10B981',
    successSubtle: '#064E3B',
    successText: '#34D399',
    warning: '#F59E0B',
    warningSubtle: '#451A03',
    warningText: '#FBBF24',
    danger: '#EF4444',
    dangerSubtle: '#450A0A',
    dangerText: '#FCA5A5',
    info: '#3B82F6',
    infoSubtle: '#172554',
    infoText: '#93C5FD',

    // Icon
    icon: '#A1A1AA',
  },
};
