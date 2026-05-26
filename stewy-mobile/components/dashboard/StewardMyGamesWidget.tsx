import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { BaseWidget } from '@/components/dashboard/BaseWidget';
import { volunteerService } from '@/services/volunteer.service';
import { useTranslation } from 'react-i18next';
import type { VolunteerProfileResponse } from '@/types/api';

interface Props {
  profile: VolunteerProfileResponse;
}

export function StewardMyGamesWidget({ profile }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [games, setGames] = useState<{ id: string; game: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    volunteerService.getMyProfile()
      .then((myProfile) => {
        return fetch(`/volunteers/${myProfile.id}/games/participation`)
          .then((res) => res.json());
      })
      .then((data: { id: string; game: string; participated: boolean; status?: string }[]) => {
        const approved = data.filter((g) => g.participated);
        setGames(approved.map((g) => ({ id: g.id, game: g.game })));
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const displayed = games.slice(0, 5);

  return (
    <BaseWidget
      title={t('dashboard.widget.myGames')}
      count={games.length}
      emptyState={t('dashboard.empty.myGames')}
      loading={loading}
      error={error ?? undefined}
      viewAllLink="/(app)/(tabs)/games"
    >
      {displayed.map((g) => (
        <TouchableOpacity key={g.id} onPress={() => router.push(`/game/${g.id}`)}>
          <ThemedCard className="mb-2 p-4">
            <ThemedText type="bodySemiBold">{g.game}</ThemedText>
          </ThemedCard>
        </TouchableOpacity>
      ))}
    </BaseWidget>
  );
}
