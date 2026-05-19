import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { activateAccount } from '../../services/authService';
import GoldButton from '../../components/ui/GoldButton';

export default function ActivateScreen() {
  const { uid, token } = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    const activate = async () => {
      try {
        await activateAccount(uid, token);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };
    if (uid && token) activate();
    else setStatus('error');
  }, [uid, token]);

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.gold} size="large" />
        <Text style={styles.loadingText}>Activating your account...</Text>
      </View>
    );
  }

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>Account Activated!</Text>
        <Text style={styles.subtitle}>Your Grand Velour account is now active. You can now sign in.</Text>
        <GoldButton title="Sign In" onPress={() => router.replace('/(auth)/login')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>❌</Text>
      <Text style={styles.title}>Activation Failed</Text>
      <Text style={styles.subtitle}>This link may have expired or already been used.</Text>
      <GoldButton title="Back to Login" onPress={() => router.replace('/(auth)/login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 },
  icon:        { fontSize: 56, marginBottom: 24 },
  title:       { fontFamily: 'CormorantGaramond_400Regular', fontSize: 32, color: Colors.textPrimary, marginBottom: 16, textAlign: 'center' },
  subtitle:    { fontFamily: 'Jost_300Light', fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  loadingText: { fontFamily: 'Jost_300Light', fontSize: 14, color: Colors.textSecondary, marginTop: 20 },
});