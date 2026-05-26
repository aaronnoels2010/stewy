import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedCard } from '@/components/ThemedCard';
import { ThemedView } from '@/components/ThemedView';
import { ThemedLink } from '@/components/ThemedLink';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { Href } from 'expo-router';

interface BaseWidgetProps {
  title: string;
  count: number;
  viewAllLink?: Href;
  viewAllLabel?: string;
  children: React.ReactNode;
  emptyState?: string;
  loading?: boolean;
  error?: string;
}

export function BaseWidget({ title, count, viewAllLink, viewAllLabel, children, emptyState, loading, error }: BaseWidgetProps) {
  const { colors } = useDesignTokens();

  if (loading) {
    return (
      <ThemedCard className="p-6">
        <ThemedText type="body" variant="muted" className="text-center">Loading...</ThemedText>
      </ThemedCard>
    );
  }

  if (error) {
    return (
      <ThemedCard className="p-6">
        <ThemedText type="body" variant="muted" className="text-center">{error}</ThemedText>
      </ThemedCard>
    );
  }

  return (
    <ThemedView className="mb-6">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <ThemedText type="h3">{title}</ThemedText>
          {count > 0 && (
            <View className="bg-accent-500 rounded-full px-2.5 py-0.5" style={{ minWidth: 24 }}>
              <ThemedText type="caption" style={{ color: '#FFFFFF', textAlign: 'center' }}>{count}</ThemedText>
            </View>
          )}
        </View>
      </View>

      {emptyState && count === 0 ? (
        <ThemedCard className="p-6">
          <ThemedText type="body" variant="muted" className="text-center">{emptyState}</ThemedText>
        </ThemedCard>
      ) : (
        <>
          {children}
          {viewAllLink && count > 0 && (
            <ThemedLink to={viewAllLink} className="mt-2">
              {viewAllLabel || 'Bekijk alles'}
            </ThemedLink>
          )}
        </>
      )}
    </ThemedView>
  );
}
