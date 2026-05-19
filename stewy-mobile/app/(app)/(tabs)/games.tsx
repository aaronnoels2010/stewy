import React, { useState } from 'react';
import { View, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol }   from '@/components/ui/IconSymbol';
import { GameCard, Game } from '@/components/GameCard';
import { AddGameForm }   from '@/components/AddGameForm';
import { ThemedText }    from '@/components/ThemedText';
import { ThemedButton }  from '@/components/ThemedButton';
import { ThemedView }    from '@/components/ThemedView';
import { useDesignTokens } from '@/hooks/useDesignTokens';

// ─── Initial dummy data ───────────────────────────────────────────────────────
const INITIAL_GAMES: Game[] = [
  {
    id: '1',
    opponent: 'FC Barcelona',
    date: '10/24/2026',
    time: '20:00',
    location: 'Camp Nou',
    status: 'upcoming',
  },
  {
    id: '2',
    opponent: 'Manchester City',
    date: '10/30/2026',
    time: '18:30',
    location: 'Etihad Stadium',
    status: 'upcoming',
  },
];

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { isDark, colors } = useDesignTokens();

  const handleAddGame = (
    newGameData: { opponent: string; date: string; time: string; location: string }
  ) => {
    const newGame: Game = {
      id: Math.random().toString(),
      ...newGameData,
      status: 'upcoming',
    };
    setGames([newGame, ...games]);
    setIsAddModalVisible(false);
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
        <View>
          <ThemedText type="h1">Game Planner</ThemedText>
          <ThemedText type="body" muted className="mt-1">
            Manage your team's matches
          </ThemedText>
        </View>

        {/* FAB */}
        <ThemedButton
          label=""
          variant="primary"
          size="md"
          onPress={() => setIsAddModalVisible(true)}
          leadingIcon={<IconSymbol name="plus" size={22} color="#fff" />}
          className="w-12 h-12 rounded-full p-0"
        />
      </View>

      {/* Game list */}
      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ThemedText type="h3" className="mb-4">
          Upcoming Games
        </ThemedText>

        {games.length === 0 ? (
          <View className="items-center justify-center py-20 gap-3">
            <IconSymbol name="calendar" size={48} color={colors.border} />
            <ThemedText type="body" muted className="text-center">
              No games planned yet.{'\n'}Tap the + button to add one.
            </ThemedText>
          </View>
        ) : (
          games.map((game) => <GameCard key={game.id} game={game} />)
        )}
      </ScrollView>

      {/* Add Game Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <AddGameForm
          onSubmit={handleAddGame}
          onCancel={() => setIsAddModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}
