import { View, type ViewProps } from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export type ThemedViewVariant = 'default' | 'surface' | 'surfaceAlt' | 'transparent' | 'accentSubtle' | 'accentContainer';

export type ThemedViewProps = ViewProps & {
  variant?: ThemedViewVariant;
};

export function ThemedView({
  variant = 'default',
  className = '',
  ...props
}: ThemedViewProps) {
  const { classes } = useDesignTokens();

  const bgClass: Record<ThemedViewVariant, string> = {
    default:         classes.background,
    surface:         classes.surface,
    surfaceAlt:      classes.surfaceAlt,
    transparent:     'bg-transparent',
    accentSubtle:    classes.accentSubtle,
    accentContainer: 'bg-pitch-light',
  };

  return (
    <View
      {...props}
      className={`${bgClass[variant]} ${className}`.trim()}
    />
  );
}
