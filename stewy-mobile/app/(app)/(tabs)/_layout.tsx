import { Slot, Tabs } from "expo-router";
import React from "react";
import {
  ColorSchemeName,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedLink } from "@/components/ThemedLink";
import { Navigation } from "@/constants/Navigation";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "nativewind";
import { usePlatform } from "@/hooks/usePlatform";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { isMobile } = usePlatform();
  return isMobile ? (
    <MobileLayout colorScheme={colorScheme} />
  ) : (
    <OtherLayout />
  );
}

const headerContainerClasses = "flex flex-row content-center items-end py-2";
const headerItemClasses =
  "self-center m-2 hover:underline hover:underline-offset-4";

import { useSession } from "@/contexts/auth.context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const OtherLayout = () => {
  const { signOut, isAdmin, user, isProfileApproved, isHoofdSteward } =
    useSession();
  const { t } = useTranslation();

  return (
    <ThemedView className="flex-1 h-screen flex-col">
      <header className="flex flex-row content-center items-center justify-between px-6 py-4 border-b border-pitch-border dark:border-night-border shrink-0">
        <ThemedView variant="transparent" className={headerContainerClasses}>
          <ThemedText
            className="mr-6"
            type="display"
            accent
            uppercase
            style={{ fontSize: 24 }}
          >
            Stewy
          </ThemedText>
          <ThemedLink
            className={headerItemClasses}
            to={Navigation.Dashboard.href}
          >
            Dashboard
          </ThemedLink>
          {isProfileApproved && (
            <ThemedLink
              className={headerItemClasses}
              to={Navigation.Games.href}
            >
              Games
            </ThemedLink>
          )}
          {isProfileApproved && (
            <ThemedLink
              className={headerItemClasses}
              to={Navigation.Invitations.href}
            >
              Invitations
            </ThemedLink>
          )}
          <ThemedLink
            className={headerItemClasses}
            to={Navigation.Profile.href}
          >
            Profile
          </ThemedLink>
          {isHoofdSteward && (
            <ThemedLink
              className={headerItemClasses}
              to={Navigation.ClubManagement.href}
            >
              {t("navigation.clubManagement")}
            </ThemedLink>
          )}
          {isAdmin && (
            <ThemedLink
              className={headerItemClasses}
              to={Navigation.Volonteers.href}
            >
              Volunteers
            </ThemedLink>
          )}
        </ThemedView>
        <View className="flex flex-row items-center gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <TouchableOpacity
            onPress={signOut}
            className="bg-zinc-100 dark:bg-zinc-800 px-5 py-2.5 rounded-2xl active:opacity-80"
          >
            <Text className="text-zinc-900 dark:text-zinc-100 font-bold">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </header>
      <View className="flex-1 overflow-hidden">
        <SafeAreaView className="flex-1" edges={["top"]}>
          <Slot />
        </SafeAreaView>
      </View>
      <footer className="shrink-0"></footer>
    </ThemedView>
  );
};

const MobileLayout = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  const { isAdmin, isProfileApproved, isHoofdSteward } = useSession();
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name={Navigation.Dashboard.name}
        options={{
          title: t("navigation.dashboard"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={Navigation.Games.name}
        options={{
          title: t("navigation.games"),
          href: isProfileApproved ? Navigation.Games.href : null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={Navigation.Invitations.name}
        options={{
          title: t("navigation.invitations"),
          href: isProfileApproved ? Navigation.Invitations.href : null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="envelope.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={Navigation.Volonteers.name}
        options={{
          title: t("navigation.volunteers"),
          href: isAdmin ? Navigation.Volonteers.href : null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={Navigation.Profile.name}
        options={{
          title: t("navigation.profile"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name={Navigation.ClubManagement.name}
        options={{
          title: t("navigation.clubManagement"),
          href: isHoofdSteward ? Navigation.ClubManagement.href : null,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
