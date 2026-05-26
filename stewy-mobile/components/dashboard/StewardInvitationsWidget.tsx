import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { BaseWidget } from '@/components/dashboard/BaseWidget';
import { participationService } from '@/services/participation.service';
import { useTranslation } from 'react-i18next';
import type { VolunteerGameEntry } from '@/types/api';

export function StewardInvitationsWidget() {
  const { t } = useTranslation();
  const router = useRouter();
  const [invitations, setInvitations] = useState<VolunteerGameEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    participationService.getMyInvitations()
      .then(setInvitations)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const displayed = invitations.slice(0, 5);

  return (
    <BaseWidget
      title={t('dashboard.widget.invitations')}
      count={invitations.length}
      emptyState={t('dashboard.empty.invitations')}
      loading={loading}
      error={error ?? undefined}
      viewAllLink="/(app)/(tabs)/invitations"
      viewAllLabel={t('dashboard.viewAll', { count: invitations.length, type: t('dashboard.widget.invitations').toLowerCase() })}
    >
      {displayed.map((inv) => (
        <TouchableOpacity key={inv.volunteerId} onPress={() => router.push('/(app)/(tabs)/invitations')}>
          <ThemedCard className="mb-2 p-4">
            <ThemedText type="bodySemiBold">{inv.volunteerName}</ThemedText>
            <ThemedText type="bodySmall" variant="muted">{inv.status}</ThemedText>
          </ThemedCard>
        </TouchableOpacity>
      ))}
    </BaseWidget>
  );
}
