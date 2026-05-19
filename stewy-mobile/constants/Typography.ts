/**
 * Stewy Design System — Typography Scale
 *
 * Maps semantic type roles to Tailwind utility class strings.
 * Use these via ThemedText's `type` prop.
 */

export const Typography = {
  /** Hero titles — 36px / 800 */
  display: {
    fontSize: 'text-4xl',
    fontWeight: 'font-extrabold',
    lineHeight: 'leading-tight',
    letterSpacing: 'tracking-tight',
  },
  /** Screen / section heading — 28px / 700 */
  h1: {
    fontSize: 'text-3xl',
    fontWeight: 'font-bold',
    lineHeight: 'leading-tight',
    letterSpacing: 'tracking-tight',
  },
  /** Card / modal heading — 22px / 700 */
  h2: {
    fontSize: 'text-2xl',
    fontWeight: 'font-bold',
    lineHeight: 'leading-snug',
    letterSpacing: '',
  },
  /** Sub-section heading — 18px / 600 */
  h3: {
    fontSize: 'text-lg',
    fontWeight: 'font-semibold',
    lineHeight: 'leading-snug',
    letterSpacing: '',
  },
  /** Body text — 16px / 400 */
  body: {
    fontSize: 'text-base',
    fontWeight: 'font-normal',
    lineHeight: 'leading-relaxed',
    letterSpacing: '',
  },
  /** Body semibold — 16px / 600 */
  bodySemiBold: {
    fontSize: 'text-base',
    fontWeight: 'font-semibold',
    lineHeight: 'leading-relaxed',
    letterSpacing: '',
  },
  /** Small body — 14px / 400 */
  bodySmall: {
    fontSize: 'text-sm',
    fontWeight: 'font-normal',
    lineHeight: 'leading-normal',
    letterSpacing: '',
  },
  /** Caption — 12px / 500 */
  caption: {
    fontSize: 'text-xs',
    fontWeight: 'font-medium',
    lineHeight: 'leading-normal',
    letterSpacing: '',
  },
  /** Label / tag — 11px / 700 / uppercase / tracked */
  label: {
    fontSize: 'text-xs',
    fontWeight: 'font-bold',
    lineHeight: 'leading-none',
    letterSpacing: 'tracking-widest',
  },
  /** Hyperlink — 16px / 400 */
  link: {
    fontSize: 'text-base',
    fontWeight: 'font-normal',
    lineHeight: 'leading-relaxed',
    letterSpacing: '',
  },
} as const;

// ─── Backward-compat aliases ──────────────────────────────────────────────────
// These map the old ThemedText type names to equivalent new scale entries so
// existing screens (index.tsx, etc.) compile without modification.
export const TypographyAliases = {
  /** @deprecated Use 'h1' instead */
  title:           'h1',
  /** @deprecated Use 'h3' instead */
  subtitle:        'h3',
  /** @deprecated Use 'body' instead */
  default:         'body',
  /** @deprecated Use 'bodySemiBold' instead */
  defaultSemiBold: 'bodySemiBold',
  /** @deprecated Use 'link' directly */
  link:            'link',
} as const satisfies Partial<Record<string, keyof typeof Typography>>;

export type TypographyAlias = keyof typeof TypographyAliases;
export type TypographyVariant = keyof typeof Typography | TypographyAlias;
