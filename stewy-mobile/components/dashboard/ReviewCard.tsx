import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedButton } from '@/components/ThemedButton';
import { useDesignTokens } from '@/hooks/useDesignTokens';

interface ReviewCardProps {
  initials: string;
  name: string;
  timeAgo: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
}

export function ReviewCard({ initials, name, timeAgo, subtitle, actionLabel, onAction }: ReviewCardProps) {
  const { colors } = useDesignTokens();

  return (
    <ThemedCard className="p-4">
      <View className="flex-row items-center gap-4">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.accentSubtle }}
        >
          <ThemedText
            type="bodySemiBold"
            style={{ color: colors.accent, fontSize: 14 }}
          >
            {initials}
          </ThemedText>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <ThemedText type="bodySemiBold">{name}</ThemedText>
            <ThemedText type="caption" variant="muted">{timeAgo}</ThemedText>
          </View>
          <ThemedText type="bodySmall" variant="muted">{subtitle}</ThemedText>
        </View>
        <ThemedButton label={actionLabel} variant="primary" size="sm" onPress={onAction} />
      </View>
    </ThemedCard>
  );
}
