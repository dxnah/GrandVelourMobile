import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants/Colors';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validation';
import VelourInput from '../../components/ui/VelourInput';
import GoldButton from '../../components/ui/GoldButton';
import OutlineButton from '../../components/ui/OutlineButton';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    const emailErr = validateEmail(email);
    const passErr  = validatePassword(password);
    if (emailErr) e.email = emailErr;
    if (passErr)  e.password = passErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data.access) {
        login(data.user, data.access);
        Toast.show({ type: 'success', text1: 'Welcome back!', text2: `Hello, ${data.user.first_name}` });
        if (data.user.is_staff) {
          router.replace('/(admin)/dashboard');
        } else {
          router.replace('/(tabs)/home');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials. Please try again.';
      if (err.response?.status === 403 && err.response?.data?.not_activated) {
        Toast.show({ type: 'error', text1: 'Account not activated', text2: 'Check your email for the activation link.' });
      } else {
        Toast.show({ type: 'error', text1: 'Login failed', text2: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.logo}>GRAND<Text style={styles.logoAccent}> VELOUR</Text></Text>
        <Text style={styles.tagline}>LUXURY REDEFINED</Text>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Welcome back. Please enter your credentials.</Text>

        <VelourInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <VelourInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />

        <GoldButton title={loading ? 'Signing in...' : 'Sign In'} onPress={handleLogin} disabled={loading} />
        <OutlineButton title="Create Account" onPress={() => router.push('/(auth)/register')} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.footerLink}>Register here</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.background },
  content:    { padding: 32, paddingTop: 80 },
  logo:       { fontFamily: 'CormorantGaramond_300Light', fontSize: 28, letterSpacing: 8, color: Colors.textPrimary, textAlign: 'center' },
  logoAccent: { color: Colors.gold },
  tagline:    { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 5, color: Colors.textMuted, textAlign: 'center', marginTop: 4, marginBottom: 48 },
  title:      { fontFamily: 'CormorantGaramond_400Regular', fontSize: 36, color: Colors.textPrimary, marginBottom: 8 },
  subtitle:   { fontFamily: 'Jost_300Light', fontSize: 13, color: Colors.textSecondary, marginBottom: 32, lineHeight: 20 },
  divider:    { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine:{ flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText:{ fontFamily: 'Jost_400Regular', fontSize: 12, color: Colors.textMuted, marginHorizontal: 12 },
  footerText: { fontFamily: 'Jost_400Regular', fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginTop: 8 },
  footerLink: { color: Colors.gold },
});