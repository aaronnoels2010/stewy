import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { ThemedCard } from '@/components/ThemedCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useDesignTokens } from '@/hooks/useDesignTokens';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useDesignTokens();
  const insets = useSafeAreaInsets();
  
  // Use regular ScrollView for now to eliminate animation issues
  // Re-enable animations once scrolling is confirmed
  
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HERO SECTION --- */}
        <View style={{ height: 800, width: '100%' }}>
          <View style={StyleSheet.absoluteFill}>
            <Image
              source={require('@/assets/images/soccer_hero.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={isDark ? ['rgba(9,9,11,0.2)', 'rgba(9,9,11,0.8)', '#09090B'] : ['rgba(248,250,252,0.1)', 'rgba(248,250,252,0.7)', '#F8FAFC']}
              style={StyleSheet.absoluteFill}
            />
          </View>

          {/* Hero Content */}
          <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'flex-end', paddingBottom: 96, paddingTop: insets.top }}>
            <View className="flex-row items-center mb-8">
              <View className="px-5 py-2 rounded-full border border-accent-500/40 bg-accent-500/10">
                <ThemedText type="label" accent>EDITION 2026</ThemedText>
              </View>
              <View className="h-[1px] flex-1 bg-accent-500/20 ml-6" />
            </View>

            <ThemedText 
              type="display" 
              className="text-[80px] leading-[72px] mb-4 tracking-tighter italic"
              style={{ color: isDark ? '#FFF' : '#0F172A', fontWeight: '900' }}
            >
              UNLEASH{'\n'}
              THE PITCH.
            </ThemedText>

            <View className="flex-row items-start gap-5 mb-12">
              <View className="w-1.5 h-24 bg-accent-500 rounded-full" />
              <ThemedText 
                type="h2" 
                variant="muted" 
                className="flex-1 text-2xl leading-8"
                style={{ opacity: 0.9 }}
              >
                Premium match management for the modern athlete. 
                Every game, every volunteer, every stat—curated.
              </ThemedText>
            </View>

            <View className="flex-row gap-5">
              <ThemedButton
                label="Get Started"
                variant="primary"
                size="lg"
                onPress={() => router.push('/games')}
                className="flex-1 py-6 rounded-[32px] shadow-accent-lg"
              />
              <TouchableOpacity 
                activeOpacity={0.8}
                className="w-20 h-20 items-center justify-center rounded-[32px] bg-white/10 dark:bg-zinc-800/60 border border-white/20 dark:border-zinc-700/60"
              >
                <IconSymbol name="play.fill" size={28} color={isDark ? '#FFF' : colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- BOLD STATS OVERLAY --- */}
        <View className="px-8 -mt-12 z-20">
          <ThemedCard className="flex-row justify-between py-10 px-6 bg-zinc-950 dark:bg-white border-none shadow-premium-lg rounded-[40px]">
            <View className="items-center flex-1 border-r border-zinc-800 dark:border-zinc-100">
              <ThemedText type="display" style={{ color: isDark ? '#FFF' : '#000', fontSize: 36 }}>12K+</ThemedText>
              <ThemedText type="caption" variant="muted" className="mt-1">MATCHES</ThemedText>
            </View>
            <View className="items-center flex-1 border-r border-zinc-800 dark:border-zinc-100">
              <ThemedText type="display" style={{ color: colors.accent, fontSize: 36 }}>98%</ThemedText>
              <ThemedText type="caption" variant="muted" className="mt-1">SUCCESS</ThemedText>
            </View>
            <View className="items-center flex-1">
              <ThemedText type="display" style={{ color: isDark ? '#FFF' : '#000', fontSize: 36 }}>250</ThemedText>
              <ThemedText type="caption" variant="muted" className="mt-1">REFS</ThemedText>
            </View>
          </ThemedCard>
        </View>

        {/* --- THE STEWY EDGE --- */}
        <View className="px-8 pt-32">
          <View className="mb-16">
            <ThemedText type="label" accent className="mb-4">THE STEWY EDGE</ThemedText>
            <ThemedText type="h1" className="text-5xl leading-tight">Engineered for{'\n'}High Performance.</ThemedText>
          </View>

          <View className="gap-16">
            <View className="flex-row gap-8">
              <View className="flex-1 pt-10">
                <View className="w-16 h-16 rounded-3xl bg-accent-500 items-center justify-center mb-8 shadow-accent-md">
                  <IconSymbol name="calendar" size={32} color="#FFF" />
                </View>
                <ThemedText type="h1" style={{ fontSize: 28 }} className="mb-4">Dynamic Planner</ThemedText>
                <ThemedText type="body" variant="muted" className="text-lg leading-7">
                  Adaptive scheduling that learns your team's rhythm. Real-time pitch availability at your fingertips.
                </ThemedText>
              </View>
              <View className="w-2/5 bg-zinc-100 dark:bg-zinc-900 rounded-[50px] h-[320] overflow-hidden justify-center items-center">
                <View className="absolute top-10 right-[-30] w-48 h-48 bg-accent-500/20 rounded-full" />
                <IconSymbol name="calendar.badge.plus" size={100} color={isDark ? '#27272A' : '#E2E8F0'} />
              </View>
            </View>

            <View className="flex-row gap-8">
              <View className="w-2/5 bg-zinc-100 dark:bg-zinc-900 rounded-[50px] h-[320] overflow-hidden justify-center items-center">
                <View className="absolute bottom-10 left-[-30] w-48 h-48 bg-blue-500/20 rounded-full" />
                <IconSymbol name="person.3.fill" size={120} color={isDark ? '#27272A' : '#E2E8F0'} />
              </View>
              <View className="flex-1 pt-10">
                <View className="w-16 h-16 rounded-3xl bg-blue-500 items-center justify-center mb-8 shadow-lg shadow-blue-500/30">
                  <IconSymbol name="person.3" size={32} color="#FFF" />
                </View>
                <ThemedText type="h1" style={{ fontSize: 28 }} className="mb-4">Elite Network</ThemedText>
                <ThemedText type="body" variant="muted" className="text-lg leading-7">
                  Instant access to verified referees and certified coaches. Professional standards, every match day.
                </ThemedText>
              </View>
            </View>

            <ThemedCard className="bg-accent-500 p-12 border-none overflow-hidden h-[450px] justify-end rounded-[60px] shadow-accent-lg">
              <View className="absolute top-[-80] right-[-80] w-[400] h-[400] bg-white/10 rounded-full" />
              <IconSymbol name="chart.bar.fill" size={180} color="rgba(255,255,255,0.12)" className="absolute top-12 left-12" />
              
              <ThemedText type="display" className="text-white text-6xl mb-6 italic" style={{ fontWeight: '900' }}>STATS OVER{'\n'}EVERYTHING.</ThemedText>
              <ThemedText type="body" className="text-white/80 text-xl mb-10 leading-8">
                Pro-level insights for amateur leagues. Track goals, assists, and performance metrics in real-time.
              </ThemedText>
              <View className="flex-row">
                <TouchableOpacity className="bg-white px-10 py-5 rounded-full shadow-lg">
                  <ThemedText type="bodySemiBold" style={{ color: colors.accent }}>View Analytics</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedCard>
          </View>
        </View>

        <View className="px-8 py-40 items-center bg-zinc-50 dark:bg-zinc-950 mt-32 rounded-t-[80px]">
          <ThemedText type="display" className="text-center text-5xl mb-8 tracking-tighter">READY TO{'\n'}DOMINATE?</ThemedText>
          <ThemedText type="h2" variant="muted" className="text-center mb-12 max-w-[280px] leading-7">
            Join 5,000+ teams who have leveled up their match day with Stewy.
          </ThemedText>
          <ThemedButton 
            label="Create My Team" 
            variant="primary" 
            size="lg" 
            className="w-full max-w-sm py-7 rounded-[36px] shadow-accent-lg" 
            onPress={() => router.push('/sign-in')}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: '100%',
  },
});
