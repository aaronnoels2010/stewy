/**
 * GameCard — uses the Stewy design system.
 * ThemedCard, ThemedText, ThemedBadge, and ThemedDivider replace all
 * hardcoded slate-* color classes.
 */
import React from 'react';
import { View } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { ThemedCard } from './ThemedCard';
import { ThemedText } from './ThemedText';
import { ThemedBadge, gameStatusToBadge } from './ThemedBadge';
import { ThemedDivider } from './ThemedDivider';
import { useDesignTokens } from '@/hooks/useDesignTokens';

export type Game = {
  id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
};

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { colors } = useDesignTokens();

  return (
    <ThemedCard pressable className="mb-4">
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
        {/* Home team */}
        <View className="flex-1 items-center">
          <View
            style={{ borderColor: colors.accent }}
            className="w-16 h-16 rounded-full items-center justify-center mb-2 border-2"
          >
            <ThemedText type="h2" accent>S</ThemedText>
          </View>
          <ThemedText type="bodySemiBold">Stewy FC</ThemedText>
        </View>

        {/* VS separator */}
        <View className="px-4">
          <ThemedText type="bodySemiBold" muted>VS</ThemedText>
        </View>

        {/* Away team */}
        <View className="flex-1 items-center">
          <View
            style={{ borderColor: colors.border }}
            className="w-16 h-16 rounded-full items-center justify-center mb-2 border-2"
          >
            <ThemedText type="h2" muted>
              {game.opponent.charAt(0)}
            </ThemedText>
          </View>
          <ThemedText type="bodySemiBold" numberOfLines={1}>
            {game.opponent}
          </ThemedText>
        </View>
      </View>

      {/* Footer row — date & location */}
      <ThemedDivider className="mb-4" />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <IconSymbol name="calendar" size={16} color={colors.textMuted} />
          <ThemedText type="bodySmall" muted>
            {game.date} • {game.time}
          </ThemedText>
        </View>
        <View className="flex-row items-center gap-2">
          <IconSymbol name="mappin" size={16} color={colors.textMuted} />
          <ThemedText type="bodySmall" muted numberOfLines={1} className="max-w-[100px]">
            {game.location}
          </ThemedText>
        </View>
      </View>
    </ThemedCard>
  );
}
