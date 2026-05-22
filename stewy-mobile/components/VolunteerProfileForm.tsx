import { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { RolePicker } from '@/components/RolePicker';
import { SearchableCombobox } from '@/components/SearchableCombobox';
import { volunteerService } from '@/services/volunteer.service';
import { clubService } from '@/services/club.service';
import { ApiError } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { profileSchema } from '@/lib/profileSchema';
import { apiErrorMapper, mapZodErrors } from '@/lib/apiErrorMapper';
import type { ClubDto } from '@/types/api';

interface VolunteerProfileFormProps {
  onSuccess: () => void;
}

export function VolunteerProfileForm({ onSuccess }: VolunteerProfileFormProps) {
  const { t } = useTranslation();
  const [role, setRole] = useState('');
  const [kbvbId, setKbvbId] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('');
  const [manualClubName, setManualClubName] = useState('');
  const [clubs, setClubs] = useState<ClubDto[]>([]);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [clubsError, setClubsError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isHoofdSteward = role === 'HOOFD_STEWARD';
  const showClubSection = role !== '';

  useEffect(() => {
    if (!role) {
      setClubs([]);
      setClubsLoading(false);
      setClubsError('');
      return;
    }

    setClubsLoading(true);
    setClubsError('');
    setSelectedClubId('');
    setManualClubName('');

    clubService.getClubs(!isHoofdSteward)
      .then((res) => {
        setClubs(res.items);
        if (res.items.length === 0) {
          setClubsError(t('profile.club.noClubs'));
        }
      })
      .catch(() => {
        setClubsError(t('profile.club.loadError'));
      })
      .finally(() => setClubsLoading(false));
  }, [role]);

  const handleSubmit = async () => {
    const result = profileSchema.safeParse({
      role,
      kbvbId,
      clubId: selectedClubId,
      clubName: manualClubName,
    });

    if (!result.success) {
      setFieldErrors(mapZodErrors(result.error, t));
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await volunteerService.createProfile({
        role,
        kbvbId,
        clubId: selectedClubId || undefined,
        clubName: manualClubName.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(apiErrorMapper({ errors: err.errors }));
        } else {
          setFieldErrors({ role: err.message });
        }
      } else {
        setFieldErrors({ role: t('profile.error.generic') });
      }
    } finally {
      setLoading(false);
    }
  };

  const error = fieldErrors.role || fieldErrors.kbvbId || fieldErrors.clubId || '';

  return (
    <ScrollView className="gap-4">
      <ThemedText type="h3">{t('profile.createTitle')}</ThemedText>

      <ThemedInput
        label={t('profile.kbvbId')}
        placeholder="KBVB-12345"
        value={kbvbId}
        onChangeText={(v) => { setKbvbId(v); setFieldErrors({}); }}
        error={fieldErrors.kbvbId}
      />

      <RolePicker
        roles={[
          { value: 'HOOFD_STEWARD', label: t('profile.role.hoofdSteward') },
          { value: 'DEVISIE_CHEF', label: t('profile.role.devisieChef') },
          { value: 'STEWARD', label: t('profile.role.steward') },
        ]}
        value={role}
        onChange={(v) => { setRole(v); setFieldErrors({}); }}
        error={fieldErrors.role}
      />

      {showClubSection && (
        <View>
          <ThemedText type="bodySmall" className="mb-2 font-semibold">
            {t('profile.club')}
          </ThemedText>

          <SearchableCombobox
            options={clubs}
            value={selectedClubId}
            onSelect={(option, createNewName) => {
              if (option) {
                setSelectedClubId(option.id);
                setManualClubName('');
              } else if (createNewName) {
                setManualClubName(createNewName);
                setSelectedClubId('');
              }
              setFieldErrors({});
            }}
            placeholder={t('profile.club.placeholder')}
            loading={clubsLoading}
            emptyMessage={t('profile.club.noClubs')}
            error={fieldErrors.clubId || (clubsError && !clubsLoading ? clubsError : '')}
            allowCreate={isHoofdSteward}
            createNewLabel={manualClubName ? t('profile.club.createNew', { name: manualClubName }) : undefined}
          />
        </View>
      )}

      {error && (
        <ThemedText type="bodySmall" className="text-red-500">
          {error}
        </ThemedText>
      )}

      <ThemedButton
        label={t('profile.submit')}
        variant="primary"
        size="lg"
        loading={loading}
        onPress={handleSubmit}
        className="w-full mt-4"
      />
    </ScrollView>
  );
}
