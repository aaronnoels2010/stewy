import { Slot, Tabs } from 'expo-router';
import React from 'react';
import { ColorSchemeName, Platform, StyleSheet, TouchableOpacity, Text } from 'react-native';

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
    <ThemedView className='min-h-screen'>
      <header className='flex flex-row content-center items-center justify-between px-4'>
        <ThemedView className={headerContainerClasses}>
          <ThemedText type='h3'>Stewy</ThemedText>
          <ThemedLink className={headerItemClasses} to={Navigation.Root.href}>Home</ThemedLink>
          <ThemedLink className={headerItemClasses} to={Navigation.Explore.href}>Explore</ThemedLink>
          <ThemedLink className={headerItemClasses} to={Navigation.Volonteers.href}>Volonteers</ThemedLink>
          <ThemedLink className={headerItemClasses} to={Navigation.Games.href}>Games</ThemedLink>
        </ThemedView>
        <TouchableOpacity onPress={signOut} className="bg-slate-800 px-4 py-2 rounded-xl">
          <Text className="text-slate-300 font-bold">Sign Out</Text>
        </TouchableOpacity>
      </header>
      <main className='flex grow'>
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
      <Tabs.Screen
        name={Navigation.Volonteers.name}
        options={{
          title: 'Volonteers',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name={Navigation.Games.name}
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
    </Tabs>
  )
}
