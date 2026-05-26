import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedButton } from '@/components/ThemedButton';

interface AssignmentCardProps {
  role: string;
  game: string;
  date: string;
  time: string;
  actionLabel: string;
  onAction: () => void;
}

export function AssignmentCard({ role, game, date, time, actionLabel, onAction }: AssignmentCardProps) {

  return (
    <ThemedCard className="p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <ThemedText type="bodySemiBold" className="mb-1">{role}</ThemedText>
          <ThemedText type="bodySmall" variant="muted" className="mb-1">{game}</ThemedText>
          <View className="flex-row items-center gap-2">
            <ThemedText type="caption" variant="muted">{date}</ThemedText>
            <ThemedText type="caption" variant="muted">•</ThemedText>
            <ThemedText type="caption" variant="muted">{time}</ThemedText>
          </View>
        </View>
        <ThemedButton
          label={actionLabel}
          variant="primary"
          size="sm"
          onPress={onAction}
        />
      </View>
    </ThemedCard>
  );
}
