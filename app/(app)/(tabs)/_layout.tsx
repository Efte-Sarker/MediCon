import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Layout, FontSize, FontFamily } from '../../../src/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 109, // 53dp content + 56dp bottom padding
          paddingBottom: 56,
          paddingTop: 5,
          backgroundColor: Colors.surface,
          borderTopColor: Colors.tertiary,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarPressColor: 'transparent',
        tabBarActiveBackgroundColor: 'transparent',
        tabBarItemStyle: {
          backgroundColor: 'transparent',
        },
        tabBarLabelStyle: {
          fontSize: FontSize.sm,
          fontFamily: FontFamily.medium,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" size={size + 3} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{
          title: 'Doctors',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="stethoscope" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prescriptions"
        options={{
          title: 'Prescription',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-pulse-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ask-doctor"
        options={{
          title: 'Ask Doctor',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat-question-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden from tab bar */}
      <Tabs.Screen name="reports" options={{ href: null }} />
      <Tabs.Screen name="hospitals" options={{ href: null }} />
      <Tabs.Screen name="ai-chat" options={{ href: null }} />
    </Tabs>
  );
}
