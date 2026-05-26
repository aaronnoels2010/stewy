import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { ThemedFormCard } from "@/components/ThemedFormCard";
import {
  ThemedBottomNav,
  type BottomNavItem,
} from "@/components/ThemedBottomNav";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useDesignTokens } from "@/hooks/useDesignTokens";
import { useSession } from "@/contexts/auth.context";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/services/api";
import { useTranslation } from "react-i18next";
import { registerSchema } from "@/lib/registerSchema";
import { apiErrorMapper, mapZodErrors } from "@/lib/apiErrorMapper";
import { phoneNormalizer } from "@/lib/phoneNormalizer";
import { ThemedTopAppBar } from "@/components/ThemedTopAppBar";

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

export default function Register() {
  const { signIn } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark, colors } = useDesignTokens();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    const result = registerSchema.safeParse({
      address,
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      termsAgreed,
    });
    if (!result.success) {
      setFieldErrors(mapZodErrors(result.error, t));
      return;
    }

    setFieldErrors({});
    setError("");
    setLoading(true);

    const normalizedPhone = phone ? phoneNormalizer(phone) : "";

    try {
      await authService.register({
        firstName,
        lastName,
        email,
        password,
        phone: normalizedPhone || "",
        address,
      });

      await signIn(email, password);
      router.replace("/(app)");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setFieldErrors(apiErrorMapper({ errors: err.errors }));
        } else {
          setError(err.message);
        }
      } else {
        setError(t("register.error.generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = () => {
    setFieldErrors({});
    setError("");
  };

  return (
    <ThemedView className="flex-1">
      <StatusBar style={isDark ? "light" : "dark"} />

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
          contentContainerClassName="flex-grow justify-center px-4 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-md mx-auto">
            <ThemedFormCard noPadding>
              <View
                style={{ backgroundColor: colors.accent }}
                className="px-6 py-5"
              >
                <ThemedText
                  type="h2"
                  inverse
                  uppercase
                  className="tracking-tight"
                >
                  {t("register.hero")}
                </ThemedText>
                <ThemedText type="caption" inverse className="opacity-90 mt-1">
                  {t("register.heroSubtitle")}
                </ThemedText>
              </View>

              <View className="p-6 gap-5">
                <ThemedInput
                  label={t("register.firstName")}
                  placeholder="John"
                  value={firstName}
                  onChangeText={(v) => {
                    setFirstName(v);
                    clearFieldError();
                  }}
                  autoCapitalize="words"
                  uppercaseLabel
                  labelSize="sm"
                  error={fieldErrors.firstName}
                />

                <ThemedInput
                  label={t("register.lastName")}
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={(v) => {
                    setLastName(v);
                    clearFieldError();
                  }}
                  autoCapitalize="words"
                  uppercaseLabel
                  labelSize="sm"
                  error={fieldErrors.lastName}
                />

                <ThemedInput
                  label={t("register.email")}
                  placeholder="john@example.com"
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    clearFieldError();
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
                  label={t("register.phone")}
                  placeholder="+32 4 123 45 67"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  uppercaseLabel
                  labelSize="sm"
                  error={fieldErrors.phone}
                />

                <ThemedInput
                  label={t("register.address")}
                  placeholder="Street 123, City"
                  value={address}
                  onChangeText={setAddress}
                  uppercaseLabel
                  labelSize="sm"
                  error={fieldErrors.address}
                />

                <ThemedInput
                  label={t("register.password")}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    clearFieldError();
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

                <ThemedInput
                  label={t("register.confirmPassword")}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={(v) => {
                    setConfirmPassword(v);
                    clearFieldError();
                  }}
                  secureTextEntry={!showConfirmPassword}
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
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <IconSymbol
                        name={showConfirmPassword ? "eye.slash" : "eye"}
                        size={18}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>
                  }
                  error={fieldErrors.confirmPassword || undefined}
                />

                <TouchableOpacity
                  onPress={() => setTermsAgreed(!termsAgreed)}
                  activeOpacity={0.7}
                  className="flex-row items-start gap-3 py-2"
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 1.5,
                      borderColor: termsAgreed ? colors.accent : colors.border,
                      backgroundColor: termsAgreed
                        ? colors.accent
                        : "transparent",
                      marginTop: 2,
                    }}
                    className="items-center justify-center shrink-0"
                  >
                    {termsAgreed && (
                      <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </View>
                  <ThemedText type="bodySmall" muted className="flex-1">
                    <ThemedText type="bodySmall" muted>
                      {
                        t("register.terms", {
                          termsOfService: "",
                          clubRegulations: "",
                        }).split("{{termsOfService}}")[0]
                      }
                    </ThemedText>
                    <ThemedText type="bodySmall" accent>
                      {t("register.termsOfService")}
                    </ThemedText>
                    <ThemedText type="bodySmall" muted>
                      {
                        t("register.terms", {
                          termsOfService: "",
                          clubRegulations: "",
                        })
                          .split("{{termsOfService}}")[1]
                          ?.split("{{clubRegulations}}")[0]
                      }
                    </ThemedText>
                    <ThemedText type="bodySmall" accent>
                      {t("register.clubRegulations")}
                    </ThemedText>
                    <ThemedText type="bodySmall" muted>
                      {
                        t("register.terms", {
                          termsOfService: "",
                          clubRegulations: "",
                        }).split("{{clubRegulations}}")[1]
                      }
                    </ThemedText>
                  </ThemedText>
                </TouchableOpacity>
                {fieldErrors.termsAgreed && (
                  <ThemedText
                    type="caption"
                    style={{ color: colors.danger }}
                    className="-mt-3 ml-1"
                  >
                    {fieldErrors.termsAgreed}
                  </ThemedText>
                )}

                <ThemedButton
                  label={t("register.createAccount")}
                  variant="pitch"
                  size="lg"
                  loading={loading}
                  showArrow
                  uppercase
                  onPress={handleRegister}
                  className="w-full"
                />
              </View>
            </ThemedFormCard>

            <View className="mt-6 flex-row justify-center items-center">
              <ThemedText type="body" muted>
                {t("register.alreadyMember")}{" "}
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push("/sign-in")}
                activeOpacity={0.7}
              >
                <ThemedText type="bodySemiBold" accent uppercase>
                  {t("register.signIn")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === "ios" ||
        (Platform.OS === "android" && (
          <ThemedBottomNav items={bottomNavItems} activeKey="register" />
        ))}
    </ThemedView>
  );
}
