/**
 * Stewy Design System — useDesignTokens
 *
 * Convenience hook that returns both the raw Colors object and the
 * Tailwind class map for the current color scheme in a single call.
 * Useful for components that need multiple tokens simultaneously.
 *
 * @example
 * const { colors, classes, isDark } = useDesignTokens();
 * <View style={{ backgroundColor: colors.surface }}>
 *   <Text className={classes.text}>Hello</Text>
 * </View>
 */
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/Colors';
import { TailwindClasses } from '@/constants/TailwindClass';

export function useDesignTokens() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'light';
  const isDark = scheme === 'dark';

  return {
    /** Raw hex color values for the active scheme */
    colors: Colors[scheme],
    /** Tailwind utility class strings for the active scheme */
    classes: TailwindClasses[scheme],
    /** Whether the current scheme is dark */
    isDark,
    /** The active scheme string */
    scheme,
  };
}
