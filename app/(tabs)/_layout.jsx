import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111009',
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
        },
        tabBarActiveTintColor:   Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'Jost_400Regular',
          fontSize: 10,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen name="home"     options={{ title: 'Home',     tabBarIcon: ({ color }) => <Feather name="home"        size={20} color={color} /> }} />
      <Tabs.Screen name="rooms"    options={{ title: 'Rooms',    tabBarIcon: ({ color }) => <Feather name="grid"        size={20} color={color} /> }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings', tabBarIcon: ({ color }) => <Feather name="calendar"    size={20} color={color} /> }} />
      <Tabs.Screen name="chatbot"  options={{ title: 'Concierge',tabBarIcon: ({ color }) => <Feather name="message-circle" size={20} color={color} /> }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profile',  tabBarIcon: ({ color }) => <Feather name="user"        size={20} color={color} /> }} />
    </Tabs>
  );
}