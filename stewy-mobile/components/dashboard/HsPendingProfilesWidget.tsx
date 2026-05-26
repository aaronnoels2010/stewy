import { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedButton } from '@/components/ThemedButton';
import { BaseWidget } from '@/components/dashboard/BaseWidget';
import { volunteerService } from '@/services/volunteer.service';
import { adminService } from '@/services/admin.service';
import { useTranslation } from 'react-i18next';
import type { VolunteerProfileResponse } from '@/types/api';

export function HsPendingProfilesWidget() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState<VolunteerProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    volunteerService.getPendingProfilesByClub()
      .then(setProfiles)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveProfile(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  const handleReject = (id: string) => {
    Alert.alert(t('admin.rejectTitle'), t('admin.rejectMessage'), [
      { text: t('admin.cancel'), style: 'cancel' },
      {
        text: t('admin.reject'), style: 'destructive',
        onPress: async () => {
          try {
            await adminService.rejectProfile(id);
            setProfiles((prev) => prev.filter((p) => p.id !== id));
          } catch {}
        },
      },
    ]);
  };

  const displayed = profiles.slice(0, 5);

  return (
    <BaseWidget
      title={t('dashboard.widget.pendingProfiles')}
      count={profiles.length}
      emptyState={t('dashboard.empty.pendingProfiles')}
      loading={loading}
      error={error ?? undefined}
    >
      {displayed.map((p) => (
        <ThemedCard key={p.id} className="mb-2 p-4">
          <ThemedText type="bodySemiBold">{p.firstName} {p.lastName}</ThemedText>
          <ThemedText type="bodySmall" variant="muted">{p.role}</ThemedText>
          {p.club && <ThemedText type="bodySmall" variant="muted">{p.club.clubName}</ThemedText>}
          <View className="flex-row gap-2 mt-3">
            <ThemedButton label={t('admin.approve')} variant="primary" size="sm" onPress={() => handleApprove(p.id)} />
            <ThemedButton label={t('admin.reject')} variant="outline" size="sm" onPress={() => handleReject(p.id)} />
          </View>
        </ThemedCard>
      ))}
    </BaseWidget>
  );
}
