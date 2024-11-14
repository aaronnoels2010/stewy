import { Slot, Tabs } from 'expo-router';
import React from 'react';
import { ColorSchemeName, Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLink } from '@/components/ThemedLink';
import { Navigation } from '@/constants/Navigation';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isMobilePlatform = Platform.OS === 'ios' || Platform.OS === 'android';
  return isMobilePlatform ? MobileLayout(colorScheme) : OtherLayout();
}

const headerContainerClasses = 'flex flex-row content-center items-center';
const headerItemClasses = 'self-center m-2 hover:underline hover:underline-offset-4';

const OtherLayout = () => {
  return (
    <ThemedView className='min-h-screen'>
      <header className='flex flex-row content-center items-center'>
        <ThemedView className={headerContainerClasses}>
          <ThemedText className='text-2xl bold m-2'>Stewy</ThemedText>
          <ThemedLink className={headerItemClasses} to={Navigation.Root.href}>Home</ThemedLink>
          <ThemedLink className={headerItemClasses} to={Navigation.Explore.href}>Explore</ThemedLink>
        </ThemedView>
      </header>
      <main>
        <Slot/>
      </main>
      <footer>
        
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
            // Use a transparent background on iOS to show the blur effect
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
    </Tabs>
  )
}
