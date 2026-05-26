import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedBadge } from "@/components/ThemedBadge";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useDesignTokens } from "@/hooks/useDesignTokens";
import { useSession } from "@/contexts/auth.context";
import { api } from "@/services/api";
import {
  volunteerService,
  type VolunteerProfileResponse,
} from "@/services/volunteer.service";
import { clubService } from "@/services/club.service";
import type { ClubDto } from "@/types/api";

export default function ClubManagementScreen() {
  const { colors } = useDesignTokens();
  const { isAdmin } = useSession();
  const [profile, setProfile] = useState<VolunteerProfileResponse | null>(null);
  const [clubInfo, setClubInfo] = useState<ClubDto | null>(null);
  const [members, setMembers] = useState<VolunteerProfileResponse[]>([]);
  const [pendingMembers, setPendingMembers] = useState<
    VolunteerProfileResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clubName, setClubName] = useState("");
  const [parkingInstructions, setParkingInstructions] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const p = await volunteerService.getMyProfile();
      setProfile(p);
      if (p.club) {
        setClubName(p.club.clubName);
        const [membersData, pendingData] = await Promise.all([
          api.get<VolunteerProfileResponse[]>(`/clubs/${p.club.id}/members`),
          api.get<VolunteerProfileResponse[]>(
            `/clubs/${p.club.id}/members/pending`,
          ),
        ]);
        setMembers(membersData);
        setPendingMembers(pendingData);
      }
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveClub = async () => {
    if (!profile?.club) return;
    try {
      await api.put(`/clubs/${profile.club.id}`, {
        id: profile.club.id,
        clubName,
        parkingInstructions,
      });
      Alert.alert("Success", "Club info updated");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleApproveMember = async (volunteerId: string) => {
    if (!profile?.club) return;
    try {
      await api.post(
        `/clubs/${profile.club.id}/members/${volunteerId}/approve`,
        {},
      );
      setPendingMembers((prev) => prev.filter((m) => m.id !== volunteerId));
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleRejectMember = async (volunteerId: string) => {
    if (!profile?.club) return;
    try {
      await api.post(
        `/clubs/${profile.club.id}/members/${volunteerId}/reject`,
        {},
      );
      setPendingMembers((prev) => prev.filter((m) => m.id !== volunteerId));
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
        <ThemedText type="h1">Club Management</ThemedText>
        <ThemedButton
          label="Back"
          variant="muted"
          size="sm"
          onPress={() => router.back()}
        />
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Club Info Editor */}
        {profile?.club && (
          <ThemedCard className="mb-6 p-4">
            <ThemedText type="h3" className="mb-4">
              Club Info
            </ThemedText>
            <ThemedInput
              label="Club Name"
              value={clubName}
              onChangeText={setClubName}
            />
            <ThemedInput
              className="mt-4"
              label="Parking Instructions"
              value={parkingInstructions}
              onChangeText={setParkingInstructions}
              multiline
            />
            <ThemedButton
              label="Save"
              variant="primary"
              size="sm"
              onPress={handleSaveClub}
              className="mt-4"
            />
          </ThemedCard>
        )}

        {/* Member Roster */}
        <ThemedCard className="mb-6 p-4">
          <ThemedText type="h3" className="mb-4">
            Member Roster ({members.length})
          </ThemedText>
          {members.length === 0 ? (
            <ThemedText type="bodySmall" muted className="text-center py-4">
              No approved members yet.
            </ThemedText>
          ) : (
            members.map((member) => (
              <View
                key={member.id}
                className="flex-row items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800"
              >
                <View>
                  <ThemedText type="bodySemiBold">
                    {member.firstName} {member.lastName}
                  </ThemedText>
                  <ThemedText type="caption" muted>
                    {member.role}
                  </ThemedText>
                </View>
                <ThemedBadge variant="success" label="Approved" dot />
              </View>
            ))
          )}
        </ThemedCard>

        {/* Pending Requests */}
        <ThemedCard className="mb-6 p-4">
          <ThemedText type="h3" className="mb-4">
            Pending Requests ({pendingMembers.length})
          </ThemedText>
          {pendingMembers.length === 0 ? (
            <ThemedText type="bodySmall" muted className="text-center py-4">
              No pending requests.
            </ThemedText>
          ) : (
            pendingMembers.map((member) => (
              <View
                key={member.id}
                className="py-3 border-b border-gray-100 dark:border-gray-800"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View>
                    <ThemedText type="bodySemiBold">
                      {member.firstName} {member.lastName}
                    </ThemedText>
                    <ThemedText type="caption" muted>
                      {member.role}
                    </ThemedText>
                  </View>
                  <ThemedBadge variant="warning" label="PENDING" dot />
                </View>
                <View className="flex-row gap-2">
                  <ThemedButton
                    label="Reject"
                    variant="muted"
                    size="sm"
                    className="flex-1"
                    onPress={() => handleRejectMember(member.id)}
                  />
                  <ThemedButton
                    label="Approve"
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onPress={() => handleApproveMember(member.id)}
                  />
                </View>
              </View>
            ))
          )}
        </ThemedCard>
      </ScrollView>
    </SafeAreaView>
  );
}
