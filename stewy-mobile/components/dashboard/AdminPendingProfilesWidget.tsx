import { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedButton } from '@/components/ThemedButton';
import { BaseWidget } from '@/components/dashboard/BaseWidget';
import { adminService } from '@/services/admin.service';
import { api } from '@/services/api';
import { useTranslation } from 'react-i18next';

interface ProfileEntry {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  kbvbId: string;
  club: { id: string; clubName: string } | null;
}

export function AdminPendingProfilesWidget() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState<ProfileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = () => {
    setLoading(true);
    setError(null);
    api.get<{ pending: ProfileEntry[] }>('/volunteers/profiles')
      .then((data) => setProfiles(data.pending))
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProfiles(); }, []);

  const handleApprove = async (volunteerId: string) => {
    try {
      await adminService.approveProfile(volunteerId);
      setProfiles((prev) => prev.filter((p) => p.id !== volunteerId));
    } catch {}
  };

  const handleReject = (volunteerId: string) => {
    Alert.alert(t('admin.rejectTitle'), t('admin.rejectMessage'), [
      { text: t('admin.cancel'), style: 'cancel' },
      {
        text: t('admin.reject'), style: 'destructive',
        onPress: async () => {
          try {
            await adminService.rejectProfile(volunteerId);
            setProfiles((prev) => prev.filter((p) => p.id !== volunteerId));
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
      {displayed.map((profile) => (
        <ThemedCard key={profile.id} className="mb-2 p-4">
          <ThemedText type="bodySemiBold">{profile.firstName} {profile.lastName}</ThemedText>
          <ThemedText type="bodySmall" variant="muted">{profile.role}</ThemedText>
          {profile.kbvbId && <ThemedText type="bodySmall" variant="muted">KBVB: {profile.kbvbId}</ThemedText>}
          {profile.club && <ThemedText type="bodySmall" variant="muted">{profile.club.clubName}</ThemedText>}
          <View className="flex-row gap-2 mt-3">
            <ThemedButton label={t('admin.approve')} variant="primary" size="sm" onPress={() => handleApprove(profile.id)} />
            <ThemedButton label={t('admin.reject')} variant="outline" size="sm" onPress={() => handleReject(profile.id)} />
          </View>
        </ThemedCard>
      ))}
    </BaseWidget>
  );
}
