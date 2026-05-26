import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { GameCard } from '@/components/GameCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedBadge } from '@/components/ThemedBadge';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { useGames } from '@/contexts/games.context';
import { useSession } from '@/contexts/auth.context';
import { gameService } from '@/services/game.service';
import type { GameDto } from '@/types/api';

export default function GamesScreen() {
  const { games, isLoading, error } = useGames();
  const { isDark, colors } = useDesignTokens();
  const { isHoofdSteward, isProfileApproved } = useSession();
  const [myGames, setMyGames] = useState<GameDto[]>([]);
  const [myGamesLoading, setMyGamesLoading] = useState(false);

  useEffect(() => {
    if (isHoofdSteward && isProfileApproved) {
      setMyGamesLoading(true);
      gameService.getMyClubGames()
        .then((res) => setMyGames(res.items as GameDto[]))
        .catch(() => {})
        .finally(() => setMyGamesLoading(false));
    }
  }, [isHoofdSteward, isProfileApproved]);

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <ThemedText type="h1">Game Planner</ThemedText>
          <ThemedText type="body" muted className="mt-1">
            Manage your team's matches
          </ThemedText>
        </View>
        {isProfileApproved && isHoofdSteward && (
          <ThemedButton
            label="Create"
            variant="primary"
            size="sm"
            onPress={() => router.push('/(app)/create-game' as any)}
            className="ml-4"
          />
        )}
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* My Club Games (HoofdSteward only) */}
        {isProfileApproved && isHoofdSteward && (
          <View className="mb-6">
            <ThemedText type="h3" className="mb-4">
              My Club Games
            </ThemedText>
            {myGamesLoading ? (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color={colors.accent} />
              </View>
            ) : myGames.length === 0 ? (
              <ThemedCard className="p-4">
                <ThemedText type="body" muted className="text-center">
                  No club games yet.
                </ThemedText>
              </ThemedCard>
            ) : (
              myGames.map((game) => (
                <View key={game.id} className="mb-3">
                  <GameCard game={game as any} />
                  {game.status === 'CREATE' && (
                    <View className="flex-row justify-end mt-1 mr-2">
                      <ThemedBadge variant="warning" label="Draft" dot />
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* Upcoming Games */}
        <ThemedText type="h3" className="mb-4">
          Upcoming Games
        </ThemedText>

        {isLoading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : error ? (
          <View className="items-center justify-center py-20 gap-3">
            <IconSymbol name="exclamationmark" size={48} color={colors.danger} />
            <ThemedText type="body" muted className="text-center">
              {error}
            </ThemedText>
          </View>
        ) : games.length === 0 ? (
          <View className="items-center justify-center py-20 gap-3">
            <IconSymbol name="calendar" size={48} color={colors.border} />
            <ThemedText type="body" muted className="text-center">
              No games available.
            </ThemedText>
          </View>
        ) : (
          games.map((game) => <GameCard key={game.id} game={game} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
