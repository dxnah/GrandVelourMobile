import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'Jost_400Regular',
          fontSize: 10,
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'HOME', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="rooms" options={{ title: 'ROOMS', tabBarIcon: ({ color, size }) => <Ionicons name="bed-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="bookings" options={{ title: 'BOOKINGS', tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="chatbot" options={{ title: 'CONCIER...', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'PROFILE', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="amenity/[slug]" options={{ href: null }} />
    </Tabs>
  );
}