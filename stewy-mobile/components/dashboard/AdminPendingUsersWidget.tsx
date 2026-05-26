import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedButton } from '@/components/ThemedButton';
import { BaseWidget } from '@/components/dashboard/BaseWidget';
import { adminService } from '@/services/admin.service';
import { useTranslation } from 'react-i18next';
import type { UserDto } from '@/types/api';

export function AdminPendingUsersWidget() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    adminService.getPendingUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleActivate = async (userId: string) => {
    setActivatingId(userId);
    try {
      await adminService.activateUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {}
    setActivatingId(null);
  };

  const displayed = users.slice(0, 5);

  return (
    <BaseWidget
      title={t('dashboard.widget.pendingUsers')}
      count={users.length}
      emptyState={t('dashboard.empty.pendingUsers')}
      loading={loading}
      error={error ?? undefined}
    >
      {displayed.map((user) => (
        <ThemedCard key={user.id} className="mb-2 p-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <ThemedText type="bodySemiBold">{user.firstName} {user.lastName}</ThemedText>
              <ThemedText type="bodySmall" variant="muted">{user.email}</ThemedText>
            </View>
            <ThemedButton
              label={t('admin.activate')}
              variant="primary"
              size="sm"
              loading={activatingId === user.id}
              onPress={() => handleActivate(user.id)}
            />
          </View>
        </ThemedCard>
      ))}
    </BaseWidget>
  );
}
