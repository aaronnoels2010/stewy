import { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedBadge } from '@/components/ThemedBadge';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/contexts/auth.context';
import { adminService } from '@/services/admin.service';
import type { UserDto } from '@/types/api';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { api } from '@/services/api';

interface ProfileEntry {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  kbvbId: string;
  club: { id: string; clubName: string } | null;
  profileStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  clubStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
}

export default function VolonteersOverviewScreen() {
  const { t } = useTranslation();
  const { isAdmin } = useSession();
  const { colors } = useDesignTokens();
  const [pendingUsers, setPendingUsers] = useState<UserDto[]>([]);
  const [pendingProfiles, setPendingProfiles] = useState<ProfileEntry[]>([]);
  const [activeVolunteers, setActiveVolunteers] = useState<ProfileEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        const [users, profiles] = await Promise.all([
          adminService.getPendingUsers(),
          api.get<{ pending: ProfileEntry[]; approved: ProfileEntry[] }>('/volunteers/profiles'),
        ]);
        setPendingUsers(users);
        setPendingProfiles(profiles.pending);
        setActiveVolunteers(profiles.approved);
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [isAdmin]);

  const handleActivate = async (userId: string) => {
    setActivatingId(userId);
    try {
      await adminService.activateUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      // Handle error
    } finally {
      setActivatingId(null);
    }
  };

  const handleApprove = async (volunteerId: string) => {
    try {
      await adminService.approveProfile(volunteerId);
      setPendingProfiles((prev) => prev.filter((p) => p.id !== volunteerId));
    } catch {
      // Handle error
    }
  };

  const handleReject = (volunteerId: string) => {
    Alert.alert(t('admin.rejectTitle'), t('admin.rejectMessage'), [
      { text: t('admin.cancel'), style: 'cancel' },
      {
        text: t('admin.reject'),
        style: 'destructive',
        onPress: async () => {
          try {
            await adminService.rejectProfile(volunteerId);
            setPendingProfiles((prev) => prev.filter((p) => p.id !== volunteerId));
          } catch {
            // Handle error
          }
        },
      },
    ]);
  };

  if (!isAdmin) {
    return (
      <SafeAreaView className="flex-1" edges={['top']}>
        <ThemedView className="flex-1 items-center justify-center p-8">
          <ThemedText type="h1" className="mb-4">{t('volonteers')}</ThemedText>
          <ThemedText type="body" variant="muted" className="text-center">
            Volunteers section coming soon
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView className="flex-1 px-6 pt-4">
        <ThemedText type="h1" className="mb-6">{t('volonteers')}</ThemedText>

        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <>
            {/* Pending Activations */}
            <ThemedText type="h3" className="mb-4">{t('admin.pendingActivations')}</ThemedText>
            {pendingUsers.length === 0 ? (
              <ThemedCard className="mb-4 p-6">
                <ThemedText type="body" variant="muted" className="text-center">
                  {t('admin.noPendingActivations')}
                </ThemedText>
              </ThemedCard>
            ) : (
              pendingUsers.map((user) => (
                <ThemedCard key={user.id} className="mb-3 p-4">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 mr-4">
                      <ThemedText type="bodySemiBold">
                        {user.firstName} {user.lastName}
                      </ThemedText>
                      <ThemedText type="bodySmall" variant="muted">{user.email}</ThemedText>
                    </View>
                    <ThemedButton
                      label={activatingId === user.id ? '...' : t('admin.activate')}
                      variant="primary"
                      size="sm"
                      loading={activatingId === user.id}
                      onPress={() => handleActivate(user.id)}
                    />
                  </View>
                </ThemedCard>
              ))
            )}

            {/* Pending Profiles */}
            <ThemedText type="h3" className="mb-4 mt-6">{t('admin.pendingProfiles')}</ThemedText>
            {pendingProfiles.length === 0 ? (
              <ThemedCard className="mb-4 p-6">
                <ThemedText type="body" variant="muted" className="text-center">
                  {t('admin.noPendingProfiles')}
                </ThemedText>
              </ThemedCard>
            ) : (
              pendingProfiles.map((profile) => (
                <ThemedCard key={profile.id} className="mb-3 p-4">
                  <ThemedText type="bodySemiBold">
                    {profile.firstName} {profile.lastName}
                  </ThemedText>
                  <ThemedText type="bodySmall" variant="muted">{profile.role}</ThemedText>
                  <ThemedText type="bodySmall" variant="muted">KBVB: {profile.kbvbId}</ThemedText>
                  {profile.club && (
                    <ThemedText type="bodySmall" variant="muted">{profile.club.clubName}</ThemedText>
                  )}
                  <View className="flex-row gap-2 mt-3">
                    <ThemedButton
                      label={t('admin.approve')}
                      variant="primary"
                      size="sm"
                      onPress={() => handleApprove(profile.id)}
                    />
                    <ThemedButton
                      label={t('admin.reject')}
                      variant="outline"
                      size="sm"
                      onPress={() => handleReject(profile.id)}
                    />
                  </View>
                </ThemedCard>
              ))
            )}

            {/* Active Volunteers */}
            <ThemedText type="h3" className="mb-4 mt-6">{t('admin.activeVolunteers')}</ThemedText>
            {activeVolunteers.length === 0 ? (
              <ThemedCard className="mb-6 p-6">
                <ThemedText type="body" variant="muted" className="text-center">
                  {t('admin.noActiveVolunteers')}
                </ThemedText>
              </ThemedCard>
            ) : (
              activeVolunteers.map((profile) => (
                <ThemedCard key={profile.id} className="mb-3 p-4">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <ThemedText type="bodySemiBold">
                        {profile.firstName} {profile.lastName}
                      </ThemedText>
                      <ThemedText type="bodySmall" variant="muted">{profile.role}</ThemedText>
                      {profile.club && (
                        <ThemedText type="bodySmall" variant="muted">{profile.club.clubName}</ThemedText>
                      )}
                    </View>
                    <ThemedBadge variant="success" label={t('admin.approved')} dot />
                  </View>
                </ThemedCard>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
