import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants/Colors';
import { registerUser } from '../../services/authService';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';
import VelourInput from '../../components/ui/VelourInput';
import GoldButton from '../../components/ui/GoldButton';

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [registered, setRegistered] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    const e = {};
    const fn  = validateRequired(form.first_name, 'First name');
    const ln  = validateRequired(form.last_name, 'Last name');
    const em  = validateEmail(form.email);
    const pw  = validatePassword(form.password);
    if (fn) e.first_name = fn;
    if (ln) e.last_name  = ln;
    if (em) e.email      = em;
    if (pw) e.password   = pw;
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser({ first_name: form.first_name, last_name: form.last_name, email: form.email, password: form.password });
      setRegistered(true);
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      Toast.show({ type: 'error', text1: 'Registration failed', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✉️</Text>
        <Text style={styles.successTitle}>Check Your Email</Text>
        <Text style={styles.successText}>
          We sent an activation link to{'\n'}<Text style={{ color: Colors.gold }}>{form.email}</Text>{'\n\n'}
          Click the link in the email to activate your account before logging in.
        </Text>
        <GoldButton title="Back to Login" onPress={() => router.replace('/(auth)/login')} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Grand Velour for an exclusive experience.</Text>

        <VelourInput label="First Name" value={form.first_name} onChangeText={v => update('first_name', v)} error={errors.first_name} />
        <VelourInput label="Last Name"  value={form.last_name}  onChangeText={v => update('last_name', v)}  error={errors.last_name} />
        <VelourInput label="Email Address" value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
        <VelourInput label="Password" value={form.password} onChangeText={v => update('password', v)} secureTextEntry error={errors.password} />
        <VelourInput label="Confirm Password" value={form.confirmPassword} onChangeText={v => update('confirmPassword', v)} secureTextEntry error={errors.confirmPassword} />

        <GoldButton title={loading ? 'Creating Account...' : 'Create Account'} onPress={handleRegister} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.background },
  content:          { padding: 32, paddingTop: 60 },
  backBtn:          { marginBottom: 24 },
  backText:         { fontFamily: 'Jost_400Regular', fontSize: 13, color: Colors.gold, letterSpacing: 1 },
  title:            { fontFamily: 'CormorantGaramond_400Regular', fontSize: 36, color: Colors.textPrimary, marginBottom: 8 },
  subtitle:         { fontFamily: 'Jost_300Light', fontSize: 13, color: Colors.textSecondary, marginBottom: 32, lineHeight: 20 },
  successContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 40 },
  successIcon:      { fontSize: 56, marginBottom: 24 },
  successTitle:     { fontFamily: 'CormorantGaramond_400Regular', fontSize: 32, color: Colors.textPrimary, marginBottom: 16 },
  successText:      { fontFamily: 'Jost_300Light', fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
});