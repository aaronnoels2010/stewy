import React from 'react';
import { View } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { ThemedCard } from './ThemedCard';
import { ThemedText } from './ThemedText';
import { ThemedBadge, gameStatusToBadge } from './ThemedBadge';
import { ThemedDivider } from './ThemedDivider';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { Game } from '@/contexts/games.context';
import { useRouter } from 'expo-router';

interface GameCardProps {
  game: Game;
}

function formatAppointment(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function GameCard({ game }: GameCardProps) {
  const { colors } = useDesignTokens();
  const router = useRouter();
  const displayName = `${game.homeTeam.clubName} vs ${game.awayTeam.clubName}`;

  return (
    <ThemedCard pressable className="mb-4" onPress={() => router.push(`/game/${game.id}`)}>
      {/* Header row — badge + menu */}
      <View className="flex-row justify-between items-center mb-4">
        <ThemedBadge
          variant={gameStatusToBadge(game.status)}
          label={game.status}
          dot
        />
        <View className="p-2 -mr-2">
          <IconSymbol name="ellipsis" size={20} color={colors.textMuted} />
        </View>
      </View>

      {/* Teams row */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1 items-center">
          <View
            style={{ borderColor: colors.accent }}
            className="w-16 h-16 rounded-full items-center justify-center mb-2 border-2"
          >
            <ThemedText type="h2" accent>
              {game.homeTeam.clubName.charAt(0)}
            </ThemedText>
          </View>
          <ThemedText type="bodySemiBold" numberOfLines={1}>
            {game.homeTeam.clubName}
          </ThemedText>
        </View>

        <View className="px-4">
          <ThemedText type="bodySemiBold" muted>VS</ThemedText>
        </View>

        <View className="flex-1 items-center">
          <View
            style={{ borderColor: colors.border }}
            className="w-16 h-16 rounded-full items-center justify-center mb-2 border-2"
          >
            <ThemedText type="h2" muted>
              {game.awayTeam.clubName.charAt(0)}
            </ThemedText>
          </View>
          <ThemedText type="bodySemiBold" numberOfLines={1}>
            {game.awayTeam.clubName}
          </ThemedText>
        </View>
      </View>

      {/* Footer row — date & location */}
      <ThemedDivider className="mb-4" />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <IconSymbol name="calendar" size={16} color={colors.textMuted} />
          <ThemedText type="bodySmall" muted>
            {formatAppointment(game.appointment)}
          </ThemedText>
        </View>
        <View className="flex-row items-center gap-2">
          <IconSymbol name="mappin" size={16} color={colors.textMuted} />
          <ThemedText type="bodySmall" muted numberOfLines={1} className="max-w-[100px]">
            {game.location}
          </ThemedText>
        </View>
      </View>

      {game.accessibility && (
        <View className="flex-row items-center gap-2 mt-2">
          <IconSymbol name="accessibility" size={14} color={colors.textSubtle} />
          <ThemedText type="bodySmall" variant="muted">
            {game.accessibility}
          </ThemedText>
        </View>
      )}
    </ThemedCard>
  );
}
