import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedBadge } from '@/components/ThemedBadge';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { participationService } from '@/services/participation.service';
import type { VolunteerGameEntry } from '@/types/api';

export default function InvitationsScreen() {
  const { colors } = useDesignTokens();
  const [invitations, setInvitations] = useState<VolunteerGameEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await participationService.getMyInvitations();
      setInvitations(data);
    } catch {
      setInvitations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (gameId: string) => {
    setActionLoading(gameId);
    try {
      await participationService.acceptInvitation(gameId);
      setInvitations((prev) => prev.filter((i) => i.volunteerId !== gameId));
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (gameId: string) => {
    setActionLoading(gameId);
    try {
      await participationService.declineInvitation(gameId);
      setInvitations((prev) => prev.filter((i) => i.volunteerId !== gameId));
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <View className="px-6 pt-4 pb-2">
        <ThemedText type="h1">Invitations</ThemedText>
        <ThemedText type="body" muted className="mt-1">
          Review your game invitations
        </ThemedText>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {isLoading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : invitations.length === 0 ? (
          <View className="items-center justify-center py-20 gap-3">
            <IconSymbol name="envelope" size={48} color={colors.border} />
            <ThemedText type="body" muted className="text-center">
              No pending invitations
            </ThemedText>
          </View>
        ) : (
          invitations.map((invite) => (
            <ThemedCard key={invite.volunteerId} className="mb-4 p-4">
              <View className="flex-row items-center justify-between mb-3">
                <ThemedText type="bodySemiBold">{invite.volunteerName}</ThemedText>
                <ThemedBadge variant="warning" label="INVITED" dot />
              </View>
              <View className="flex-row gap-2">
                <ThemedButton
                  label="Decline"
                  variant="muted"
                  size="sm"
                  className="flex-1"
                  loading={actionLoading === invite.volunteerId}
                  onPress={() => handleDecline(invite.volunteerId)}
                />
                <ThemedButton
                  label="Accept"
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  loading={actionLoading === invite.volunteerId}
                  onPress={() => handleAccept(invite.volunteerId)}
                />
              </View>
            </ThemedCard>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
