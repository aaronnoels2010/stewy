import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { useSession } from '@/contexts/auth.context';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/services/api';
import { useTranslation } from 'react-i18next';
import { registerSchema } from '@/lib/registerSchema';
import { apiErrorMapper, mapZodErrors } from '@/lib/apiErrorMapper';
import { phoneNormalizer } from '@/lib/phoneNormalizer';

export default function Register() {
  const { signIn } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useDesignTokens();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const handleRegister = async () => {
    const result = registerSchema.safeParse({ firstName, lastName, email, password });
    if (!result.success) {
      setFieldErrors(mapZodErrors(result.error, t));
      return;
    }

    setFieldErrors({});
    setError('');
    setLoading(true);

    // Normalize phone before sending
    const normalizedPhone = phone ? phoneNormalizer(phone) : '';
    if (phone && !normalizedPhone) {
      setFieldErrors({ phone: t('validation.phone.invalid') });
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        firstName,
        lastName,
        email,
        password,
        phone: normalizedPhone || '',
        address,
      });

      await signIn(email, password);
      router.replace('/(app)');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(apiErrorMapper({ errors: err.errors }));
        } else {
          setError(err.message);
        }
      } else {
        setError(t('register.error.generic'));
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = () => { setFieldErrors({}); setError(''); };

  return (
    <ThemedView className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-16">
          <ThemedText type="h2" className="mb-2">
            {t('register.title')}
          </ThemedText>
          <ThemedText type="body" variant="muted" className="mb-8">
            {t('register.subtitle')}
          </ThemedText>

          <View className="gap-4 mb-8">
            <ThemedInput
              label={t('register.firstName')}
              placeholder="John"
              value={firstName}
              onChangeText={(v) => { setFirstName(v); clearFieldError(); }}
              autoCapitalize="words"
              error={fieldErrors.firstName}
            />
            <ThemedInput
              label={t('register.lastName')}
              placeholder="Doe"
              value={lastName}
              onChangeText={(v) => { setLastName(v); clearFieldError(); }}
              autoCapitalize="words"
              error={fieldErrors.lastName}
            />
            <ThemedInput
              label={t('register.email')}
              placeholder="john@example.com"
              value={email}
              onChangeText={(v) => { setEmail(v); clearFieldError(); }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={fieldErrors.email}
            />
            <ThemedInput
              label={t('register.phone')}
              placeholder="+32 4 123 45 67"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <ThemedInput
              label={t('register.address')}
              placeholder="Street 123, City"
              value={address}
              onChangeText={setAddress}
            />
            <ThemedInput
              label={t('register.password')}
              placeholder="••••••••"
              value={password}
              onChangeText={(v) => { setPassword(v); clearFieldError(); }}
              secureTextEntry
              error={fieldErrors.password || error || undefined}
            />
          </View>

          <ThemedButton
            label={t('register.submit')}
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleRegister}
            className="w-full mb-4"
          />

          <ThemedButton
            label={t('register.backToSignIn')}
            variant="ghost"
            onPress={() => router.back()}
            className="w-full mb-8"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
