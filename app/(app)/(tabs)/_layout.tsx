import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Layout } from '../../../src/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Layout.tabBarHeight + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
          backgroundColor: Colors.surface,
          borderTopColor: Colors.tertiary,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="doctors" options={{ title: 'Doctors' }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
      <Tabs.Screen name="hospitals" options={{ title: 'Hospitals' }} />
      <Tabs.Screen name="ai-chat" options={{ title: 'AI Chat' }} />
    </Tabs>
  );
}
