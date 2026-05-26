import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { useDesignTokens } from '@/hooks/useDesignTokens';

interface StatCardProps {
  icon: string;
  count: number;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function StatCard({ icon, count, title, description, actionLabel, onAction }: StatCardProps) {
  const { colors } = useDesignTokens();

  return (
    <ThemedCard className="p-5 flex-1">
      <View className="flex-row items-start gap-4">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center"
          style={{ backgroundColor: colors.accentSubtle }}
        >
          <ThemedText style={{ color: colors.accent, fontSize: 24 }}>{icon}</ThemedText>
        </View>
        <View className="flex-1">
          <ThemedText type="display" className="mb-1">{count}</ThemedText>
          <ThemedText type="h3" className="mb-1">{title}</ThemedText>
          <ThemedText type="bodySmall" variant="muted" className="mb-3">{description}</ThemedText>
          <TouchableOpacity onPress={onAction}>
            <ThemedText
              type="bodySemiBold"
              style={{ color: colors.accent }}
            >
              {actionLabel} →
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedCard>
  );
}
