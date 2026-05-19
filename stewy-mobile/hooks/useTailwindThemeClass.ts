/**
 * Stewy Design System — useTailwindThemeClass
 *
 * Returns a single Tailwind utility class string for a given semantic token,
 * automatically resolved for the current color scheme (light / dark).
 */
import { TailwindClasses, TailwindColorKey } from '@/constants/TailwindClass';
import { useColorScheme } from 'nativewind';

export function useTailwindThemeClass(colorName: TailwindColorKey): string {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme ?? 'light';
  return TailwindClasses[theme][colorName] as string;
}
