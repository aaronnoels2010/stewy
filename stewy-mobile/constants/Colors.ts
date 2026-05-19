/**
 * Stewy Design System — Color Tokens
 *
 * Soccer-themed palette with a green accent and full dark/light mode support.
 * All raw hex values live here; TailwindClass.ts maps them to Tailwind utilities.
 *
 * Accent: #2ECC71 (Emerald Green)
 */

// ─── Accent ───────────────────────────────────────────────────────────────────
const accent = '#2ECC71';
const accentDark = '#27AE60';
const accentDeep = '#1E8449';
const accentLight = '#58D68D';

// ─── Palette ──────────────────────────────────────────────────────────────────
export const Colors = {
  light: {
    // Backgrounds
    background: '#F4F6F0',       // Off-white pitch
    surface: '#FFFFFF',
    surfaceAlt: '#EAEDE4',       // Slightly tinted card surface
    surfaceHover: '#DDE3D4',

    // Borders
    border: '#D0D8C8',
    borderStrong: '#B0BCA4',

    // Text
    text: '#1A2010',             // Deep forest
    textMuted: '#5A6B4A',        // Pitch-green muted
    textSubtle: '#8A9A7A',
    textInverse: '#FFFFFF',

    // Accent
    tint: accent,
    accent,
    accentDark,
    accentDeep,
    accentLight,
    accentSubtle: '#E8F8F0',     // Faint green tint for backgrounds
    accentText: accentDeep,      // Dark enough for readability on light bg

    // Tabs
    tabIconDefault: '#8A9A7A',
    tabIconSelected: accent,

    // Status
    success: '#2ECC71',
    successSubtle: '#E8F8F0',
    successText: '#1E8449',
    warning: '#F39C12',
    warningSubtle: '#FEF5E4',
    warningText: '#9A6109',
    danger: '#E74C3C',
    dangerSubtle: '#FDEDEC',
    dangerText: '#922B21',
    info: '#3498DB',
    infoSubtle: '#EBF5FB',
    infoText: '#1A5276',

    // Icon
    icon: '#5A6B4A',
  },

  dark: {
    // Backgrounds
    background: '#0D1117',       // Deep night pitch
    surface: '#161B22',          // Card surface
    surfaceAlt: '#1C2128',       // Elevated surface
    surfaceHover: '#2D333B',

    // Borders
    border: '#2D3748',
    borderStrong: '#404B5A',

    // Text
    text: '#E8F0E1',             // Soft pitch white
    textMuted: '#6B8060',        // Muted green
    textSubtle: '#495E40',
    textInverse: '#0D1117',

    // Accent
    tint: accent,
    accent,
    accentDark,
    accentDeep,
    accentLight,
    accentSubtle: '#162A1F',     // Dark green tint for dark surfaces
    accentText: accentLight,     // Light enough for readability on dark bg

    // Tabs
    tabIconDefault: '#6B8060',
    tabIconSelected: accent,

    // Status
    success: '#2ECC71',
    successSubtle: '#162A1F',
    successText: '#58D68D',
    warning: '#FFC107',
    warningSubtle: '#2A1F05',
    warningText: '#FFC107',
    danger: '#FF6B6B',
    dangerSubtle: '#2A0F0F',
    dangerText: '#FF6B6B',
    info: '#5DADE2',
    infoSubtle: '#0A1929',
    infoText: '#5DADE2',

    // Icon
    icon: '#6B8060',
  },
};
