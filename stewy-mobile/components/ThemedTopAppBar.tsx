import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol, type IconSymbolName } from '@/components/ui/IconSymbol';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export type ThemedTopAppBarProps = {
  /** Brand wordmark text (default: "STEWY") */
  title?: string;
  /** Icon name for the right side */
  iconName?: IconSymbolName;
  /** Custom right element (overrides iconName) */
  rightElement?: React.ReactNode;
  /** Custom left element (overrides logo) */
  leftElement?: React.ReactNode;
  className?: string;
};

export function ThemedTopAppBar({
  title = 'STEWY',
  iconName = 'soccerball',
  rightElement,
  leftElement,
  className = '',
}: ThemedTopAppBarProps) {
  const { colors } = useDesignTokens();

  return (
    <ThemedView
      variant="surface"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}
      className={`
        flex-row items-center justify-between
        h-16 px-4
        shadow-pitch-sm
        ${className}
      `.trim()}
    >
      {leftElement ?? (
        <View className="flex-row items-center gap-2">
          <IconSymbol name={iconName} size={24} color={colors.accent} />
          <ThemedText type="h3" accent uppercase className="tracking-tighter">
            {title}
          </ThemedText>
        </View>
      )}

      {rightElement}
    </ThemedView>
  );
}
