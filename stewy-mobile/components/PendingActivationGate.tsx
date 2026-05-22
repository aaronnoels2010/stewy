import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSession } from '@/contexts/auth.context';
import { useTranslation } from 'react-i18next';

const STEPS = [
  { key: 'account', label: 'pendingGate.steps.account' },
  { key: 'profile', label: 'pendingGate.steps.profile' },
  { key: 'approved', label: 'pendingGate.steps.approved' },
  { key: 'game', label: 'pendingGate.steps.game' },
];

export default function PendingActivationGate() {
  const { signOut } = useSession();
  const { t } = useTranslation();

  const getStepStatus = (index: number) => {
    if (index === 0) return 'completed';
    if (index === 1) return 'current';
    return 'upcoming';
  };

  return (
    <ThemedView className="flex-1 justify-center px-6">
      <View className="items-center mb-8">
        <View className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 items-center justify-center mb-4">
          <IconSymbol name="clock" size={32} color="#10B981" />
        </View>
        <ThemedText type="h2" className="text-center mb-2">
          {t('pendingGate.title')}
        </ThemedText>
        <ThemedText type="body" variant="muted" className="text-center">
          {t('pendingGate.description')}
        </ThemedText>
      </View>

      <View className="bg-white/50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-white/20 dark:border-zinc-800/50 mb-8">
        {STEPS.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === STEPS.length - 1;

          return (
            <View key={step.key} className="flex-row">
              <View className="items-center mr-4">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    status === 'completed'
                      ? 'bg-emerald-500'
                      : status === 'current'
                        ? 'bg-emerald-200 dark:bg-emerald-800 border-2 border-emerald-500'
                        : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                >
                  {status === 'completed' ? (
                    <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                  ) : status === 'current' ? (
                    <View className="w-3 h-3 rounded-full bg-emerald-500" />
                  ) : (
                    <View className="w-3 h-3 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  )}
                </View>
                {!isLast && (
                  <View className="w-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700 my-1" />
                )}
              </View>
              <View className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                <ThemedText
                  type="bodySmall"
                  className={`font-semibold ${
                    status === 'completed'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : status === 'current'
                        ? ''
                        : 'text-zinc-400 dark:text-zinc-600'
                  }`}
                >
                  {t(step.label)}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>

      <ThemedButton
        label={t('pendingGate.signOut')}
        variant="outline"
        onPress={signOut}
        className="w-full"
      />
    </ThemedView>
  );
}
