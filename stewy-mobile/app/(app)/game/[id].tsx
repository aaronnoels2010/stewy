import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedBadge } from '@/components/ThemedBadge';
import { ThemedDivider } from '@/components/ThemedDivider';
import { ThemedCard } from '@/components/ThemedCard';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { useSession } from '@/contexts/auth.context';
import { gameService } from '@/services/game.service';
import { participationService } from '@/services/participation.service';
import { volunteerService } from '@/services/volunteer.service';
import { useGameParticipation } from '@/hooks/useGameParticipation';
import type { GameDto, VolunteerGameEntry } from '@/types/api';

function formatAppointment(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark, colors } = useDesignTokens();
  const { user, isAdmin } = useSession();
  const { request: requestParticipation, approve, reject, loading: partLoading } = useGameParticipation();

  const [game, setGame] = useState<GameDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<VolunteerGameEntry[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [myStatus, setMyStatus] = useState<string | null>(null);

  const fetchGame = useCallback(async () => {
    try {
      const data = await gameService.getGameById(id);
      setGame(data);
      setIsLoading(false);
    } catch {
      setError('Game not found');
      setIsLoading(false);
    }
  }, [id]);

  const fetchProfile = useCallback(async () => {
    try {
      const p = await volunteerService.getMyProfile();
      setProfile(p);
      return p;
    } catch {
      return null;
    }
  }, []);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const requests = await participationService.getPendingRequests(id);
      setPendingRequests(requests);
    } catch {
      // not hoofd steward
    }
  }, [id]);

  const fetchMyStatus = useCallback(async () => {
    try {
      const invites = await participationService.getMyInvitations();
      const invite = invites.find((i) => i.volunteerId === profile?.id);
      if (invite) setMyStatus(invite.status);
    } catch {}
  }, [id, profile]);

  useEffect(() => {
    fetchGame();
    fetchProfile().then(() => {
      fetchPendingRequests();
      fetchMyStatus();
    });
  }, [id]);

  const handleRequestJoin = async () => {
    if (!profile) return;
    try {
      await requestParticipation(profile.id, id);
      setMyStatus('REQUESTED');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to request participation';
      setError(message);
    }
  };

  const handleApprove = async (volunteerId: string) => {
    try {
      await participationService.approveByHoofdSteward(id, volunteerId);
      setPendingRequests((prev) => prev.filter((r) => r.volunteerId !== volunteerId));
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleReject = async (volunteerId: string) => {
    try {
      await participationService.rejectByHoofdSteward(id, volunteerId);
      setPendingRequests((prev) => prev.filter((r) => r.volunteerId !== volunteerId));
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleAcceptInvite = async () => {
    try {
      await participationService.acceptInvitation(id);
      setMyStatus('APPROVED');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDeclineInvite = async () => {
    try {
      await participationService.declineInvitation(id);
      setMyStatus('REJECTED');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleCancel = async (volunteerId: string) => {
    try {
      await participationService.cancelParticipation(id, volunteerId);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      await participationService.withdrawParticipation(id);
      setMyStatus('WITHDRAWN');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const isHoofdSteward = isAdmin;

  if (isLoading) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (!game) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 items-center justify-center">
        <ThemedText type="h2">{error || 'Game not found'}</ThemedText>
        <ThemedButton label="Go Back" variant="secondary" onPress={() => router.back()} className="mt-4" />
      </SafeAreaView>
    );
  }

  const displayName = `${game.homeTeam.clubName} vs ${game.awayTeam.clubName}`;
  const isPastDeadline = game.deadline ? new Date(game.deadline) < new Date() : false;

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View className="px-6 pt-4 pb-4 flex-row items-center gap-4">
        <ThemedButton
          label=""
          variant="muted"
          size="sm"
          onPress={() => router.back()}
          leadingIcon={<IconSymbol name="chevron.left" size={20} color={colors.text} />}
          className="w-10 h-10 rounded-full p-0"
        />
        <View className="flex-1">
          <ThemedText type="h2" numberOfLines={1}>{displayName}</ThemedText>
        </View>
        <ThemedBadge variant="info" label={game.status} dot />
      </View>

      <ScrollView
        className="flex-1 px-6 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Game Details Card */}
        <ThemedCard className="mb-6">
          <ThemedText type="h3" className="mb-4">Game Details</ThemedText>

          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <IconSymbol name="calendar" size={18} color={colors.textMuted} />
              <ThemedText type="body">{formatAppointment(game.appointment)}</ThemedText>
            </View>
            {game.location && (
              <View className="flex-row items-center gap-3">
                <IconSymbol name="mappin" size={18} color={colors.textMuted} />
                <ThemedText type="body">{game.location}</ThemedText>
              </View>
            )}
            {game.accessibility && (
              <View className="flex-row items-center gap-3">
                <IconSymbol name="info.circle" size={18} color={colors.textMuted} />
                <ThemedText type="body" className="flex-1">{game.accessibility}</ThemedText>
              </View>
            )}
          </View>
        </ThemedCard>

        {/* My Participation Status */}
        {myStatus && (
          <ThemedCard className="mb-6 p-4">
            <View className="flex-row items-center justify-between">
              <ThemedText type="bodySemiBold">Your Status</ThemedText>
              <ThemedBadge
                variant={myStatus === 'APPROVED' ? 'success' : myStatus === 'REQUESTED' ? 'warning' : 'muted'}
                label={myStatus}
                dot
              />
            </View>
            {myStatus === 'INVITED' && (
              <View className="flex-row gap-2 mt-4">
                <ThemedButton label="Decline" variant="muted" size="sm" onPress={handleDeclineInvite} className="flex-1" />
                <ThemedButton label="Accept" variant="primary" size="sm" onPress={handleAcceptInvite} className="flex-1" />
              </View>
            )}
            {myStatus === 'APPROVED' && (
              <View className="mt-4">
                <ThemedButton
                  label={isPastDeadline ? 'Deadline passed' : 'Withdraw'}
                  variant={isPastDeadline ? 'muted' : 'danger'}
                  size="sm"
                  disabled={isPastDeadline}
                  onPress={handleWithdraw}
                />
              </View>
            )}
          </ThemedCard>
        )}

        {/* Volunteer Participation */}
        {!myStatus && !isHoofdSteward && user && (
          <ThemedCard className="mb-6 p-4">
            <ThemedButton
              label="Request to join"
              variant="primary"
              size="lg"
              loading={partLoading}
              onPress={handleRequestJoin}
              className="w-full"
            />
          </ThemedCard>
        )}

        {/* HoofdSteward: Pending Requests */}
        {isHoofdSteward && pendingRequests.length > 0 && (
          <View className="mb-6">
            <ThemedText type="h3" className="mb-4 text-orange-500">
              Pending Requests ({pendingRequests.length})
            </ThemedText>
            <View className="gap-3">
              {pendingRequests.map((req) => (
                <ThemedCard key={req.volunteerId} className="flex-row justify-between items-center p-4">
                  <ThemedText type="bodySemiBold">{req.volunteerName}</ThemedText>
                  <View className="flex-row gap-2">
                    <ThemedButton
                      label="Reject"
                      variant="muted"
                      size="sm"
                      onPress={() => handleReject(req.volunteerId)}
                    />
                    <ThemedButton
                      label="Accept"
                      variant="primary"
                      size="sm"
                      onPress={() => handleApprove(req.volunteerId)}
                    />
                  </View>
                </ThemedCard>
              ))}
            </View>
          </View>
        )}

        {/* Participants */}
        <View className="mb-6">
          <ThemedText type="h3" className="mb-4">Participants ({participants.length})</ThemedText>
          {participants.length === 0 ? (
            <View className="items-center justify-center py-6">
              <ThemedText type="bodySmall" muted>No participants yet.</ThemedText>
            </View>
          ) : (
            <View className="gap-3">
              {participants.map((name, idx) => (
                <ThemedCard key={`p-${idx}`} className="flex-row items-center gap-3 p-4">
                  <IconSymbol name="person.crop.circle.fill" size={24} color={colors.accent} />
                  <ThemedText type="bodySemiBold">{name}</ThemedText>
                </ThemedCard>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
