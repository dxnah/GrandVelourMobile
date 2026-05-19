import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, CormorantGaramond_400Regular, CormorantGaramond_300Light, CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond';
import { Jost_400Regular, Jost_300Light, Jost_500Medium } from '@expo-google-fonts/jost';
import { View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../context/AuthContext';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_300Light,
    CormorantGaramond_600SemiBold,
    Jost_400Regular,
    Jost_300Light,
    Jost_500Medium,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.gold} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(admin)" />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}