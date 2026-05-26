import { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedBadge } from "@/components/ThemedBadge";
import { ThemedButton } from "@/components/ThemedButton";
import { VolunteerProfileForm } from "@/components/VolunteerProfileForm";
import { useSession } from "@/contexts/auth.context";
import {
  volunteerService,
  type VolunteerProfileResponse,
} from "@/services/volunteer.service";
import { useTranslation } from "react-i18next";

export default function ProfileScreen() {
  const { user, signOut } = useSession();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<VolunteerProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const result = await volunteerService.getMyProfile();
      setProfile(result);
      setShowForm(false);
    } catch {
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const profileBadgeVariant =
    profile?.profileStatus === "APPROVED" ? "success" : "warning";

  const clubStatusBadge = (status: string | null | undefined) => {
    switch (status) {
      case "APPROVED":
        return "success" as const;
      case "PENDING":
        return "warning" as const;
      case "REJECTED":
        return "danger" as const;
      default:
        return "muted" as const;
    }
  };

  const steps = [
    { key: "account", label: t("pendingGate.steps.account"), done: true },
    { key: "profile", label: t("pendingGate.steps.profile"), done: !!profile },
    {
      key: "approved",
      label: t("pendingGate.steps.approved"),
      done: profile?.profileStatus === "APPROVED",
    },
    { key: "game", label: t("pendingGate.steps.game"), done: false },
  ];

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <ScrollView className="flex-1 px-6 pt-4">
        <ThemedText type="h1" className="mb-6">
          {t("profile.title")}
        </ThemedText>

        {/* Stepper */}
        <ThemedCard className="mb-6 p-4">
          {steps.map((step, index) => (
            <View key={step.key} className="flex-row items-center mb-2">
              <View
                className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                  step.done ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                }`}
              >
                {step.done && (
                  <ThemedText type="bodySmall" className="text-white font-bold">
                    ✓
                  </ThemedText>
                )}
              </View>
              <ThemedText
                type="bodySmall"
                className={step.done ? "" : "text-zinc-400 dark:text-zinc-600"}
              >
                {step.label}
              </ThemedText>
            </View>
          ))}
        </ThemedCard>

        {/* User info */}
        {user && (
          <ThemedCard className="mb-6 p-4">
            <ThemedText type="h3" className="mb-4">
              {t("profile.userInfo")}
            </ThemedText>
            <ThemedText type="bodySemiBold">
              {user.firstName} {user.lastName}
            </ThemedText>
            <ThemedText type="bodySmall" variant="muted">
              {user.email}
            </ThemedText>
            {user.phone && (
              <ThemedText type="bodySmall" variant="muted">
                {user.phone}
              </ThemedText>
            )}
            {user.address && (
              <ThemedText type="bodySmall" variant="muted">
                {user.address}
              </ThemedText>
            )}
          </ThemedCard>
        )}

        {/* Volunteer profile section */}
        {isLoading ? (
          <ActivityIndicator />
        ) : !profile && !showForm ? (
          <View>
            <ThemedText type="body" variant="muted" className="mb-4">
              {t("profile.noProfile")}
            </ThemedText>
            <ThemedButton
              label={t("profile.createButton")}
              variant="primary"
              onPress={() => setShowForm(true)}
            />
          </View>
        ) : showForm ? (
          <VolunteerProfileForm onSuccess={fetchProfile} />
        ) : profile ? (
          <ThemedCard className="mb-6 p-4">
            <View className="flex-row justify-between items-center mb-4">
              <ThemedText type="h3">{t("profile.volunteerProfile")}</ThemedText>
              <ThemedBadge
                variant={profileBadgeVariant}
                label={profile.profileStatus}
                dot
              />
            </View>
            <ThemedText type="bodySemiBold">
              {profile.firstName} {profile.lastName}
            </ThemedText>
            <ThemedText type="bodySmall" variant="muted">
              {profile.role}
            </ThemedText>
            {profile.club && (
              <View className="flex-row items-center gap-2 mt-1">
                <ThemedText type="bodySmall" variant="muted">
                  {profile.club.clubName}
                </ThemedText>
                {profile.clubStatus && (
                  <ThemedBadge
                    variant={clubStatusBadge(profile.clubStatus)}
                    label={profile.clubStatus}
                    dot
                  />
                )}
              </View>
            )}
            <ThemedText type="bodySmall" variant="muted">
              KBVB: {profile.kbvbId}
            </ThemedText>
          </ThemedCard>
        ) : null}

        {/* Sign out */}
        <ThemedButton
          label={t("profile.signOut")}
          variant="outline"
          onPress={signOut}
          className="w-full mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
