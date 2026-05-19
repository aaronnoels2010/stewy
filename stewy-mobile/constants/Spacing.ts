/**
 * Stewy Design System — Spacing & Radius Tokens
 *
 * 4px base grid. Use these for consistent padding, margin, and border radius
 * across all components and screens.
 */

export const Spacing = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 24px */
  xl: 24,
  /** 32px */
  xxl: 32,
  /** 48px */
  xxxl: 48,
} as const;

export const Radius = {
  /** 6px — small chips/tags */
  xs: 6,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 24px — cards */
  xl: 24,
  /** 9999px — pills / FABs */
  full: 9999,
} as const;

export type SpacingKey = keyof typeof Spacing;
export type RadiusKey = keyof typeof Radius;
