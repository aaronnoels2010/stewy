import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { BaseWidget } from '@/components/dashboard/BaseWidget';
import { participationService } from '@/services/participation.service';
import { useTranslation } from 'react-i18next';
import type { VolunteerGameEntry } from '@/types/api';

export function HsPendingRequestsWidget() {
  const { t } = useTranslation();
  const router = useRouter();
  const [requests, setRequests] = useState<VolunteerGameEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    participationService.getPendingRequestsForClub()
      .then(setRequests)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const displayed = requests.slice(0, 5);

  return (
    <BaseWidget
      title={t('dashboard.widget.pendingRequests')}
      count={requests.length}
      emptyState={t('dashboard.empty.pendingRequests')}
      loading={loading}
      error={error ?? undefined}
      viewAllLink="/(app)/(tabs)/games"
      viewAllLabel={t('dashboard.viewAll', { count: requests.length, type: t('dashboard.widget.pendingRequests').toLowerCase() })}
    >
      {displayed.map((r) => (
        <TouchableOpacity key={r.volunteerId} onPress={() => router.push('/(app)/(tabs)/games')}>
          <ThemedCard className="mb-2 p-4">
            <ThemedText type="bodySemiBold">{r.volunteerName}</ThemedText>
            <ThemedText type="bodySmall" variant="muted">{r.status}</ThemedText>
          </ThemedCard>
        </TouchableOpacity>
      ))}
    </BaseWidget>
  );
}
