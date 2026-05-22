import { Slot, Tabs } from 'expo-router';
import React from 'react';
import { ColorSchemeName, Platform, StyleSheet, TouchableOpacity, Text, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLink } from '@/components/ThemedLink';
import { Navigation } from '@/constants/Navigation';
import { useColorScheme } from 'nativewind';
import { usePlatform } from '@/hooks/usePlatform';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { isMobile } = usePlatform();
  return isMobile ? MobileLayout(colorScheme) : OtherLayout();
}

const headerContainerClasses = 'flex flex-row content-center items-end py-2';
const headerItemClasses = 'self-center m-2 hover:underline hover:underline-offset-4';

import { useSession } from '@/contexts/auth.context';

const OtherLayout = () => {
  const { signOut } = useSession();

  return (
    <ThemedView className='flex-1 h-screen flex-col'>
      <header className='flex flex-row content-center items-center justify-between px-6 py-4 border-b border-pitch-border dark:border-night-border shrink-0'>
        <ThemedView variant="transparent" className={headerContainerClasses}>
          <ThemedText className="mr-6" type='display' style={{ fontSize: 24 }}>Stewy</ThemedText>
          <ThemedLink className={headerItemClasses} to={Navigation.Root.href}>Home</ThemedLink>
          <ThemedLink className={headerItemClasses} to={Navigation.Explore.href}>Explore</ThemedLink>
          <ThemedLink className={headerItemClasses} to={Navigation.Volonteers.href}>Volunteers</ThemedLink>
          <ThemedLink className={headerItemClasses} to={Navigation.Games.href}>Games</ThemedLink>
          <ThemedLink className={headerItemClasses} to={Navigation.Invitations.href}>Invitations</ThemedLink>
          <ThemedLink className={headerItemClasses} to={Navigation.Profile.href}>Profile</ThemedLink>
        </ThemedView>
        <TouchableOpacity
          onPress={signOut}
          className="bg-zinc-100 dark:bg-zinc-800 px-5 py-2.5 rounded-2xl active:opacity-80"
        >
          <Text className="text-zinc-900 dark:text-zinc-100 font-bold">Sign Out</Text>
        </TouchableOpacity>
      </header>
      <View className='flex-1 overflow-hidden'>
        <Slot/>
      </View>
      <footer className="shrink-0">

      </footer>
    </ThemedView>
  );
}

const MobileLayout = (colorScheme: ColorSchemeName) => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name={Navigation.Root.name}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name={Navigation.Explore.name}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name={Navigation.Volonteers.name}
        options={{
          title: 'Volonteers',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name={Navigation.Games.name}
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name={Navigation.Invitations.name}
        options={{
          title: 'Invitations',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="envelope.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name={Navigation.Profile.name}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  )
}
