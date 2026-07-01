import { Tabs } from 'expo-router';
import React from 'react';
import { Colors, Layout } from '../../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Layout.tabBarHeight,
          paddingBottom: 8,
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
