export const Typography = {
  display: {
    fontFamily: 'font-display',
    fontSize: 'text-4xl',
    lineHeight: 'leading-tight',
    letterSpacing: 'tracking-tighter',
  },
  h1: {
    fontFamily: 'font-display',
    fontSize: 'text-3xl',
    lineHeight: 'leading-tight',
    letterSpacing: 'tracking-tight',
  },
  h2: {
    fontFamily: 'font-headline',
    fontSize: 'text-2xl',
    lineHeight: 'leading-snug',
    letterSpacing: 'tracking-tight',
  },
  h3: {
    fontFamily: 'font-headline',
    fontSize: 'text-lg',
    lineHeight: 'leading-snug',
    letterSpacing: 'tracking-tight',
  },
  body: {
    fontFamily: 'font-body',
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed',
    letterSpacing: '',
  },
  bodySemiBold: {
    fontFamily: 'font-bodySemibold',
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed',
    letterSpacing: '',
  },
  bodySmall: {
    fontFamily: 'font-body',
    fontSize: 'text-sm',
    lineHeight: 'leading-normal',
    letterSpacing: '',
  },
  caption: {
    fontFamily: 'font-body',
    fontSize: 'text-xs',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-wide',
  },
  label: {
    fontFamily: 'font-label',
    fontSize: 'text-[10px]',
    lineHeight: 'leading-none',
    letterSpacing: 'tracking-[0.2em]',
  },
  link: {
    fontFamily: 'font-bodySemibold',
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed',
    letterSpacing: '',
  },
} as const;

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
