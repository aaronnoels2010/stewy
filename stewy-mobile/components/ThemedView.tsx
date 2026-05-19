/**
 * Stewy Design System — ThemedView
 *
 * A View that automatically applies the correct background for the active
 * color scheme. Use the `variant` prop to select a surface level.
 *
 * @example
 * <ThemedView variant="surface" className="p-4 rounded-3xl">...</ThemedView>
 */
import { View, type ViewProps } from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export type ThemedViewVariant = 'default' | 'surface' | 'surfaceAlt' | 'transparent' | 'accentSubtle';

export type ThemedViewProps = ViewProps & {
  /** Which surface layer to render */
  variant?: ThemedViewVariant;
};

export function ThemedView({
  variant = 'default',
  className = '',
  ...props
}: ThemedViewProps) {
  const { classes } = useDesignTokens();

  const bgClass: Record<ThemedViewVariant, string> = {
    default:      classes.background,
    surface:      classes.surface,
    surfaceAlt:   classes.surfaceAlt,
    transparent:  'bg-transparent',
    accentSubtle: classes.accentSubtle,
  };

  return (
    <View
      {...props}
      className={`${bgClass[variant]} ${className}`.trim()}
    />
  );
}
