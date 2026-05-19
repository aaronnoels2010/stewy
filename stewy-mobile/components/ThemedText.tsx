/**
 * Stewy Design System — ThemedText
 *
 * Type-scaled text component. Use the `type` prop to apply a semantic
 * role from the design system Typography scale.
 *
 * @example
 * <ThemedText type="h1">Game Planner</ThemedText>
 * <ThemedText type="bodySmall" muted>Match at 20:00</ThemedText>
 * <ThemedText type="label" accent>Upcoming</ThemedText>
 */
import { Text, type TextProps } from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { Typography, TypographyAliases, TypographyVariant } from '@/constants/Typography';

export type ThemedTextProps = TextProps & {
  /** Semantic type scale variant */
  type?: TypographyVariant;
  /** Render in muted text color */
  muted?: boolean;
  /** Render in subtle text color */
  subtle?: boolean;
  /** Render in accent green color */
  accent?: boolean;
  /** Render in inverse color (for use on colored backgrounds) */
  inverse?: boolean;
};

export function ThemedText({
  style,
  type = 'body',
  muted = false,
  subtle = false,
  accent = false,
  inverse = false,
  className = '',
  ...rest
}: ThemedTextProps) {
  const { classes } = useDesignTokens();

  // Resolve backward-compat aliases (e.g. 'title' → 'h1')
  const resolvedType =
    type in TypographyAliases
      ? TypographyAliases[type as keyof typeof TypographyAliases]
      : (type as keyof typeof Typography);

  // Pick the correct text color class
  let colorClass = classes.text;
  if (muted) colorClass = classes.textMuted;
  if (subtle) colorClass = classes.textSubtle;
  if (accent) colorClass = classes.textAccent;
  if (inverse) colorClass = classes.textInverse;

  const scale = Typography[resolvedType];
  const typographyClasses = [
    scale.fontSize,
    scale.fontWeight,
    scale.lineHeight,
    scale.letterSpacing,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Text
      {...rest}
      className={`${colorClass} ${typographyClasses} ${className}`.trim()}
    />
  );
}
