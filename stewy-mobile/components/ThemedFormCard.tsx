import { View, type ViewProps } from 'react-native';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export type ThemedFormCardProps = ViewProps & {
  noPadding?: boolean;
};

export function ThemedFormCard({
  noPadding = false,
  className = '',
  style,
  ...props
}: ThemedFormCardProps) {
  const { colors, isDark } = useDesignTokens();

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: isDark ? colors.surfaceAlt : '#FFFFFF',
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: isDark ? 8 : 0,
          shadowColor: isDark ? '#000' : undefined,
          shadowOffset: isDark ? { width: 0, height: 4 } : undefined,
          shadowOpacity: isDark ? 0.3 : undefined,
          shadowRadius: isDark ? 12 : undefined,
          elevation: isDark ? 8 : undefined,
        },
        style,
      ]}
      className={`${noPadding ? '' : 'p-6'} ${className}`.trim()}
    />
  );
}
