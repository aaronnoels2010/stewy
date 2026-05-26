import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedButton } from '@/components/ThemedButton';
import { BaseWidget } from '@/components/dashboard/BaseWidget';
import { gameService } from '@/services/game.service';
import { participationService } from '@/services/participation.service';
import { useSession } from '@/contexts/auth.context';
import { useTranslation } from 'react-i18next';
import type { GameDto } from '@/types/api';
import type { VolunteerProfileResponse } from '@/types/api';

interface Props {
  profile: VolunteerProfileResponse;
}

export function StewardUpcomingGamesWidget({ profile }: Props) {
  const { t } = useTranslation();
  const [games, setGames] = useState<GameDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingUp, setSigningUp] = useState<string | null>(null);

  useEffect(() => {
    gameService.getUpcomingGames()
      .then(setGames)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleSignUp = async (gameId: string) => {
    setSigningUp(gameId);
    try {
      await participationService.request(profile.id, gameId);
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch {}
    setSigningUp(null);
  };

  const displayed = games.slice(0, 5);

  return (
    <BaseWidget
      title={t('dashboard.widget.upcomingGames')}
      count={games.length}
      emptyState={t('dashboard.empty.upcomingGames')}
      loading={loading}
      error={error ?? undefined}
      viewAllLink="/(app)/(tabs)/games"
    >
      {displayed.map((game) => (
        <ThemedCard key={game.id} className="mb-2 p-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <ThemedText type="bodySemiBold">{game.game}</ThemedText>
              <ThemedText type="bodySmall" variant="muted">{game.appointment}</ThemedText>
            </View>
            <ThemedButton
              label="Inschrijven"
              variant="primary"
              size="sm"
              loading={signingUp === game.id}
              onPress={() => handleSignUp(game.id)}
            />
          </View>
        </ThemedCard>
      ))}
    </BaseWidget>
  );
}
