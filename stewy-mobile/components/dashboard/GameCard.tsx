import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedBadge } from '@/components/ThemedBadge';
import { useTranslation } from 'react-i18next';

interface GameCardProps {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  status: 'confirmed' | 'pending' | 'staffNeeded';
  onPress?: () => void;
}

export function GameCard({ homeTeam, awayTeam, date, time, venue, status, onPress }: GameCardProps) {
  const { t } = useTranslation();

  const statusConfig = {
    confirmed: { label: t('dashboard.gameCard.confirmed'), variant: 'success' as const },
    pending: { label: t('dashboard.gameCard.pending'), variant: 'warning' as const },
    staffNeeded: { label: t('dashboard.gameCard.staffNeeded'), variant: 'danger' as const },
  };

  const config = statusConfig[status];

  const content = (
    <ThemedCard className="p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-2">
            <ThemedText type="bodySemiBold" className="text-base">{homeTeam}</ThemedText>
            <ThemedText type="bodySmall" variant="muted">vs</ThemedText>
            <ThemedText type="bodySemiBold" className="text-base">{awayTeam}</ThemedText>
          </View>
          <View className="flex-row items-center gap-3">
            <ThemedText type="bodySmall" variant="muted">{date}</ThemedText>
            <ThemedText type="bodySmall" variant="muted">•</ThemedText>
            <ThemedText type="bodySmall" variant="muted">{time}</ThemedText>
          </View>
          <ThemedText type="bodySmall" variant="muted">{venue}</ThemedText>
        </View>
        <ThemedBadge variant={config.variant} label={config.label} dot />
      </View>
    </ThemedCard>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
}
