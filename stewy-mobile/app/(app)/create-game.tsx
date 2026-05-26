import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedTopAppBar } from '@/components/ThemedTopAppBar';
import { ClubCombobox } from '@/components/ClubCombobox';
import { ThemedDatePickerModal } from '@/components/ThemedDatePickerModal';
import { ThemedTimePickerModal } from '@/components/ThemedTimePickerModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSession } from '@/contexts/auth.context';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { gameService } from '@/services/game.service';
import { volunteerService } from '@/services/volunteer.service';
import { clubService } from '@/services/club.service';
import { createGameSchema } from '@/lib/createGameSchema';
import { formatDateForApi, formatDateForDisplay, formatTimeForDisplay } from '@/lib/dateUtils';
import type { ClubDto } from '@/types/api';

export default function CreateGameScreen() {
  const { t } = useTranslation();
  const { user } = useSession();
  const { colors } = useDesignTokens();

  const [awayTeamId, setAwayTeamId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [deadlineTime, setDeadlineTime] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [accessibility, setAccessibility] = useState('');
  const [clubs, setClubs] = useState<ClubDto[]>([]);
  const [homeClubName, setHomeClubName] = useState('Loading...');
  const [homeClubId, setHomeClubId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [showAppointmentDatePicker, setShowAppointmentDatePicker] = useState(false);
  const [showAppointmentTimePicker, setShowAppointmentTimePicker] = useState(false);
  const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState(false);
  const [showDeadlineTimePicker, setShowDeadlineTimePicker] = useState(false);

  const appointmentDisplay = appointmentDate && appointmentTime
    ? `${formatDateForDisplay(appointmentDate)} ${formatTimeForDisplay(appointmentTime)}`
    : '';
  const deadlineDisplay = deadlineDate && deadlineTime
    ? `${formatDateForDisplay(deadlineDate)} ${formatTimeForDisplay(deadlineTime)}`
    : '';

  useEffect(() => {
    clubService.getClubs().then((res) => {
      setClubs(res.items);
      volunteerService.getMyProfile().then((profile) => {
        if (profile.club) {
          setHomeClubName(profile.club.clubName);
          setHomeClubId(profile.club.id);
        }
      });
    }).catch(() => {});
  }, []);

  const validate = (): boolean => {
    const combinedAppointment = appointmentDate && appointmentTime
      ? new Date(appointmentDate)
      : null;
    if (combinedAppointment && appointmentTime) {
      combinedAppointment.setHours(appointmentTime.getHours(), appointmentTime.getMinutes(), 0, 0);
    }

    const combinedDeadline = deadlineDate && deadlineTime
      ? new Date(deadlineDate)
      : null;
    if (combinedDeadline && deadlineTime) {
      combinedDeadline.setHours(deadlineTime.getHours(), deadlineTime.getMinutes(), 0, 0);
    }

    const result = createGameSchema.safeParse({
      awayTeamId,
      appointment: combinedAppointment,
      deadline: combinedDeadline,
      location,
      accessibility,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) {
          errors[path] = t(issue.message);
        }
      }
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const combinedAppointment = new Date(appointmentDate!);
    combinedAppointment.setHours(appointmentTime!.getHours(), appointmentTime!.getMinutes(), 0, 0);

    const combinedDeadline = new Date(deadlineDate!);
    combinedDeadline.setHours(deadlineTime!.getHours(), deadlineTime!.getMinutes(), 0, 0);

    setLoading(true);
    try {
      await gameService.createGame({
        homeTeam: '',
        awayTeam: awayTeamId,
        appointment: formatDateForApi(combinedAppointment),
        deadline: formatDateForApi(combinedDeadline),
        location,
        accessibility,
      });
      Alert.alert(t('createGame.title'), 'Game created successfully', [
        { text: 'OK', onPress: () => router.replace('/(app)/(tabs)/games') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ThemedTopAppBar
        rightElement={
          <TouchableOpacity onPress={() => {}}>
            <IconSymbol name="bell" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-20">
          <ThemedText type="h1" className="mb-6">{t('createGame.title')}</ThemedText>

          <ThemedCard className="mb-6 p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <IconSymbol name="lock" size={16} color={colors.accent} />
              <ThemedText type="bodySemiBold">{t('createGame.homeTeam')}</ThemedText>
            </View>
            <ThemedText type="body">{homeClubName}</ThemedText>
          </ThemedCard>

          <View className="mb-5">
            <ThemedText type="bodySemiBold" className="mb-2">{t('createGame.awayTeam')}</ThemedText>
            <ClubCombobox
              clubs={clubs}
              selectedClubId={awayTeamId}
              onSelect={(id) => {
                setAwayTeamId(id);
                clearError('awayTeamId');
              }}
              userHomeClubId={homeClubId}
            />
            {fieldErrors.awayTeamId && (
              <ThemedText className="text-red-500 text-sm mt-1">{fieldErrors.awayTeamId}</ThemedText>
            )}
          </View>

          <View className="mb-5">
            <TouchableOpacity
              onPress={() => setShowAppointmentDatePicker(true)}
              activeOpacity={0.7}
              testID="pick-appointment"
            >
              <ThemedInput
                label={t('createGame.appointment')}
                placeholder="dd-MM-yyyy HH:mm"
                value={appointmentDisplay}
                onChangeText={() => {}}
                editable={false}
                error={fieldErrors.appointment}
                leadingIcon={
                  <IconSymbol name="calendar" size={20} color={colors.accent} />
                }
              />
            </TouchableOpacity>
          </View>

          <View className="mb-5">
            <TouchableOpacity
              onPress={() => setShowDeadlineDatePicker(true)}
              activeOpacity={0.7}
              testID="pick-deadline"
            >
              <ThemedInput
                label={t('createGame.deadline')}
                placeholder="dd-MM-yyyy HH:mm"
                value={deadlineDisplay}
                onChangeText={() => {}}
                editable={false}
                error={fieldErrors.deadline}
                leadingIcon={
                  <IconSymbol name="calendar" size={20} color={colors.accent} />
                }
              />
            </TouchableOpacity>
          </View>

          <ThemedInput
            label={t('createGame.location')}
            placeholder="Stadium name"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              clearError('location');
            }}
            error={fieldErrors.location}
            leadingIcon={
              <IconSymbol name="mappin" size={20} color={colors.accent} />
            }
          />

          <ThemedInput
            label={t('createGame.accessibility')}
            placeholder="Wheelchair accessible, etc."
            value={accessibility}
            onChangeText={setAccessibility}
            leadingIcon={
              <IconSymbol name="info.circle" size={20} color={colors.accent} />
            }
          />

          <ThemedButton
            label={t('createGame.submit')}
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleSubmit}
            className="w-full mt-6 mb-8"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <ThemedDatePickerModal
        visible={showAppointmentDatePicker}
        value={appointmentDate}
        onChange={(d) => {
          setAppointmentDate(d);
          clearError('appointment');
          setShowAppointmentDatePicker(false);
          setShowAppointmentTimePicker(true);
        }}
        onClose={() => setShowAppointmentDatePicker(false)}
      />
      <ThemedTimePickerModal
        visible={showAppointmentTimePicker}
        value={appointmentTime}
        onChange={(t) => {
          setAppointmentTime(t);
          clearError('appointment');
          setShowAppointmentTimePicker(false);
        }}
        onClose={() => setShowAppointmentTimePicker(false)}
      />
      <ThemedDatePickerModal
        visible={showDeadlineDatePicker}
        value={deadlineDate}
        onChange={(d) => {
          setDeadlineDate(d);
          clearError('deadline');
          setShowDeadlineDatePicker(false);
          setShowDeadlineTimePicker(true);
        }}
        onClose={() => setShowDeadlineDatePicker(false)}
      />
      <ThemedTimePickerModal
        visible={showDeadlineTimePicker}
        value={deadlineTime}
        onChange={(t) => {
          setDeadlineTime(t);
          clearError('deadline');
          setShowDeadlineTimePicker(false);
        }}
        onClose={() => setShowDeadlineTimePicker(false)}
      />
    </SafeAreaView>
  );
}
