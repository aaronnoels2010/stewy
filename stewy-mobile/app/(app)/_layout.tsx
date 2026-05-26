import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/contexts/auth.context';
import { GameProvider } from '@/contexts/games.context';
import PendingActivationGate from '@/components/PendingActivationGate';
import React from 'react';

export default function AppLayout() {
  const { session, isLoading, user } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (user?.status === 'PENDING') {
    return <PendingActivationGate />;
  }

  return (
    <React.Fragment>
      <GameProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="game/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="create-game" options={{ headerShown: false }} />
        </Stack>
      </GameProvider>
    </React.Fragment>
  );
}
