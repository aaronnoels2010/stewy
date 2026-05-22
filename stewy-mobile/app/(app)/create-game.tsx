import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedCard } from '@/components/ThemedCard';
import { useSession } from '@/contexts/auth.context';
import { gameService } from '@/services/game.service';
import { volunteerService } from '@/services/volunteer.service';
import { clubService } from '@/services/club.service';
import type { ClubDto } from '@/types/api';

export default function CreateGameScreen() {
  const { user } = useSession();
  const [awayTeamId, setAwayTeamId] = useState('');
  const [appointment, setAppointment] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [clubs, setClubs] = useState<ClubDto[]>([]);
  const [homeClubName, setHomeClubName] = useState('Loading...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clubService.getClubs().then((res) => {
      setClubs(res.items);
      volunteerService.getMyProfile().then((profile) => {
        if (profile.club) {
          setHomeClubName(profile.club.clubName);
        }
      });
    }).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!awayTeamId || !appointment || !deadline) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await gameService.createGame({
        homeTeam: '',
        awayTeam: awayTeamId,
        appointment,
        deadline,
        location,
        accessibility,
      });
      Alert.alert('Success', 'Game created successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 px-6 pt-4">
        <View className="flex-row items-center justify-between mb-6">
          <ThemedText type="h1">Create Game</ThemedText>
          <ThemedButton
            label="Back"
            variant="muted"
            size="sm"
            onPress={() => router.back()}
          />
        </View>

        <ThemedCard className="mb-6 p-4">
          <ThemedText type="bodySemiBold" className="mb-2">Home Team</ThemedText>
          <ThemedText type="body">{homeClubName}</ThemedText>
        </ThemedCard>

        <ThemedInput
          label="Away Team"
          placeholder="Select away team club ID"
          value={awayTeamId}
          onChangeText={setAwayTeamId}
        />

        <ThemedInput
          label="Appointment (yyyy-MM-dd HH:mm)"
          placeholder="2025-01-15 14:00"
          value={appointment}
          onChangeText={setAppointment}
        />

        <ThemedInput
          label="Deadline (yyyy-MM-dd HH:mm)"
          placeholder="2025-01-14 12:00"
          value={deadline}
          onChangeText={setDeadline}
        />

        <ThemedInput
          label="Location"
          placeholder="Stadium name"
          value={location}
          onChangeText={setLocation}
        />

        <ThemedInput
          label="Accessibility Notes"
          placeholder="Wheelchair accessible, etc."
          value={accessibility}
          onChangeText={setAccessibility}
        />

        <ThemedButton
          label="Create Game"
          variant="primary"
          size="lg"
          loading={loading}
          onPress={handleSubmit}
          className="w-full mt-6 mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
