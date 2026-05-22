import { useSession } from "@/contexts/auth.context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemedText }   from "@/components/ThemedText";
import { ThemedInput }  from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { IconSymbol }   from "@/components/ui/IconSymbol";
import { ThemedView }   from "@/components/ThemedView";
import { useDesignTokens } from "@/hooks/useDesignTokens";
import { ApiError } from "@/services/api";
import { useTranslation } from "react-i18next";
import { signInSchema } from "@/lib/signInSchema";
import { apiErrorMapper, mapZodErrors } from "@/lib/apiErrorMapper";

export default function SignIn() {
  const { signIn } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error,    setError]    = useState("");
  const { isDark, colors } = useDesignTokens();

  const handleSignIn = async () => {
    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      setFieldErrors(mapZodErrors(result.error, t));
      return;
    }

    setFieldErrors({});
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.replace("/(app)/(tabs)");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(apiErrorMapper({ errors: err.errors }));
        } else {
          setError(err.message);
        }
      } else {
        setError(t("signIn.error.generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Decorative elements for premium feel */}
        <View 
          className="absolute top-[-50] right-[-50] w-[300] h-[300] rounded-full opacity-20" 
          style={{ backgroundColor: colors.accent }}
        />
        <View 
          className="absolute bottom-[-100] left-[-100] w-[400] h-[400] rounded-full opacity-10" 
          style={{ backgroundColor: colors.accentDark }}
        />

        <View className="flex-1 justify-center px-8 z-10">
          {/* Wordmark */}
          <View className="mb-12">
            <View className="flex-row items-center gap-4 mb-4">
              <View 
                className="w-12 h-12 rounded-2xl items-center justify-center shadow-accent-lg"
                style={{ backgroundColor: colors.accent }}
              >
                <IconSymbol name="soccerball" size={28} color="#fff" />
              </View>
              <ThemedText type="display">
                Stewy
              </ThemedText>
            </View>
            <ThemedText type="h2" className="mb-2">
              {t("signIn.welcomeBack")}
            </ThemedText>
            <ThemedText type="body" variant="muted">
              {t("signIn.subtitle")}
            </ThemedText>
          </View>

          {/* Form */}
          <View className="gap-5 bg-white/50 dark:bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/20 dark:border-zinc-800/50 shadow-premium-lg">
            <ThemedInput
              label={t("signIn.emailLabel")}
              placeholder="admin@stewy.com"
              value={email}
              onChangeText={(v) => { setEmail(v); setFieldErrors({}); setError(""); }}
              keyboardType="email-address"
              autoCapitalize="none"
              leadingIcon={<IconSymbol name="envelope" size={18} color={colors.textMuted} />}
              error={fieldErrors.email}
            />

            <ThemedInput
              label={t("signIn.passwordLabel")}
              placeholder="••••••••"
              value={password}
              onChangeText={(v) => { setPassword(v); setFieldErrors({}); setError(""); }}
              secureTextEntry
              leadingIcon={<IconSymbol name="lock" size={18} color={colors.textMuted} />}
              error={fieldErrors.password || error || undefined}
            />

            <View className="pt-2">
              <ThemedButton
                label={t("signIn.submit")}
                variant="primary"
                size="lg"
                loading={loading}
                onPress={handleSignIn}
                className="w-full shadow-accent-md"
              />
            </View>

            <View className="flex-row justify-center mt-2">
              <ThemedText type="bodySmall" variant="muted">
                {t("signIn.noAccount")}{" "}
              </ThemedText>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <ThemedText type="bodySmall" className="font-bold" accent>
                  {t("signIn.signUp")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
