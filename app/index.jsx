import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../constants/Colors';

export default function Index() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Guard: if context isn't ready yet, do nothing
    if (!auth || auth.loading) return;

    if (auth.user) {
      if (auth.user.is_staff) {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(tabs)/home');
      }
    } else {
      router.replace('/(auth)/login');
    }
  }, [auth?.user, auth?.loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        GRAND<Text style={styles.logoAccent}> VELOUR</Text>
      </Text>
      <ActivityIndicator color={Colors.gold} style={{ marginTop: 32 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  logo:       { fontFamily: 'CormorantGaramond_300Light', fontSize: 32, letterSpacing: 10, color: Colors.textPrimary },
  logoAccent: { color: Colors.gold },
});