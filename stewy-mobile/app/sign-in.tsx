import { useSession } from "@/contexts/auth.context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTopAppBar } from "@/components/ThemedTopAppBar";
import {
  ThemedBottomNav,
  type BottomNavItem,
} from "@/components/ThemedBottomNav";
import { ThemedFormCard } from "@/components/ThemedFormCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useDesignTokens } from "@/hooks/useDesignTokens";
import { ApiError } from "@/services/api";
import { useTranslation } from "react-i18next";
import { signInSchema } from "@/lib/signInSchema";
import { apiErrorMapper, mapZodErrors } from "@/lib/apiErrorMapper";

const bottomNavItems: BottomNavItem[] = [
  {
    key: "sign-in",
    label: "Sign In",
    icon: "arrow.right.to.line",
    href: "/sign-in",
  },
  {
    key: "register",
    label: "Register",
    icon: "person.badge.plus",
    href: "/register",
  },
];

export default function SignIn() {
  const { signIn } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      console.error(err);
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

      {/* Pitch gradient blobs */}
      <View
        className="absolute top-[-80] right-[-80] w-[300] h-[300] rounded-full"
        style={{
          backgroundColor: colors.accent,
          opacity: isDark ? 0.08 : 0.05,
        }}
      />
      <View
        className="absolute bottom-[-120] left-[-120] w-[400] h-[400] rounded-full"
        style={{
          backgroundColor: colors.accent,
          opacity: isDark ? 0.04 : 0.03,
        }}
      />

      <ThemedTopAppBar title="STEWY" iconName="soccerball" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-4"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-md mx-auto">
            {/* Form */}
            <ThemedFormCard>
              <View className="gap-6">
                <ThemedInput
                  label={t("signIn.emailLabel")}
                  placeholder="COACH@THEPITCH.APP"
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    setFieldErrors({});
                    setError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  uppercaseLabel
                  labelSize="sm"
                  leadingIcon={
                    <IconSymbol
                      name="envelope"
                      size={16}
                      color={colors.textMuted}
                    />
                  }
                  error={fieldErrors.email}
                />

                <ThemedInput
                  label={t("signIn.passwordLabel")}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    setFieldErrors({});
                    setError("");
                  }}
                  secureTextEntry={!showPassword}
                  uppercaseLabel
                  labelSize="sm"
                  leadingIcon={
                    <IconSymbol
                      name="lock"
                      size={16}
                      color={colors.textMuted}
                    />
                  }
                  trailingIcon={
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <IconSymbol
                        name={showPassword ? "eye.slash" : "eye"}
                        size={18}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>
                  }
                  error={fieldErrors.password || error || undefined}
                />

                {/* Forgot password */}
                <View className="flex-row justify-end">
                  <TouchableOpacity activeOpacity={0.7}>
                    <ThemedText
                      type="caption"
                      accent
                      uppercase
                      className="tracking-wider"
                    >
                      {t("signIn.forgotPassword")}
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                {/* Submit button */}
                <ThemedButton
                  label={t("signIn.submit")}
                  variant="pitch"
                  size="lg"
                  loading={loading}
                  showArrow
                  uppercase
                  onPress={handleSignIn}
                  className="w-full"
                />
              </View>
            </ThemedFormCard>

            {/* Bottom action */}
            <View className="mt-6 flex-row justify-center items-center">
              <ThemedText type="body" muted>
                {t("signIn.noAccountPitch")}{" "}
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push("/register")}
                activeOpacity={0.7}
              >
                <ThemedText type="bodySemiBold" accent uppercase>
                  {t("signIn.signUp")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === "ios" ||
        (Platform.OS === "android" && (
          <ThemedBottomNav items={bottomNavItems} activeKey="sign-in" />
        ))}
    </ThemedView>
  );
}
