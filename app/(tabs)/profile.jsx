import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { getToken } from '../../utils/storage';
import api from '../../services/api';
import VelourInput from '../../components/ui/VelourInput';
import GoldButton from '../../components/ui/GoldButton';
import OutlineButton from '../../components/ui/OutlineButton';
import SectionHeader from '../../components/ui/SectionHeader';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  const [avatar,    setAvatar]    = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);

  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    phone:      user?.phone      || '',
    address:    user?.address    || '',
  });

  // ── Avatar ──────────────────────────────────────────────────────────────────
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      uploadAvatar(result.assets[0]);
    }
  };

  const uploadAvatar = async (asset) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', { uri: asset.uri, name: 'avatar.jpg', type: 'image/jpeg' });
      await api.patch('/api/v1/user/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Toast.show({ type: 'success', text1: 'Photo updated!' });
    } catch {
      Toast.show({ type: 'error', text1: 'Upload failed', text2: 'Could not update profile photo.' });
    } finally {
      setUploading(false);
    }
  };

  // ── Save profile ────────────────────────────────────────────────────────────
  const handleSave = async () => {
  setSaving(true);
  try {
    const res = await api.put('/api/v1/user/profile/', form);
    updateUser(res.data);  // ← updates context so display rows refresh
    Toast.show({ type: 'success', text1: 'Profile updated!' });
    setEditing(false);
  } catch (e) {
    console.log('Save error:', e.response?.status, e.response?.data);
    Toast.show({ type: 'error', text1: 'Could not save changes.' });
  } finally {
    setSaving(false);
  }
};

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await logout();
        router.replace('/(auth)/login');
      }},
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>YOUR ACCOUNT</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {(user?.first_name?.[0] || '') + (user?.last_name?.[0] || '')}
              </Text>
            </View>
          )}
          {uploading && <ActivityIndicator style={styles.avatarLoading} color={Colors.gold} />}
          <View style={styles.avatarEdit}><Text style={styles.avatarEditText}>📷</Text></View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.first_name} {user?.last_name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        {user?.is_staff && (
          <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>ADMIN</Text></View>
        )}
      </View>

      {/* Personal Details */}
      <View style={styles.section}>
        <SectionHeader title="Personal Details" />

        <TouchableOpacity onPress={() => setEditing(e => !e)} style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontFamily: 'Jost_400Regular', fontSize: 11, color: Colors.gold, letterSpacing: 1 }}>
            {editing ? 'Cancel' : 'Edit ✎'}
          </Text>
        </TouchableOpacity>

        {editing ? (
          <>
            <VelourInput label="First Name" value={form.first_name} onChangeText={v => setForm(f => ({ ...f, first_name: v }))} />
            <VelourInput label="Last Name"  value={form.last_name}  onChangeText={v => setForm(f => ({ ...f, last_name: v }))} />
            <VelourInput label="Phone"      value={form.phone}      onChangeText={v => setForm(f => ({ ...f, phone: v }))} keyboardType="phone-pad" />
            <VelourInput label="Address"    value={form.address}    onChangeText={v => setForm(f => ({ ...f, address: v }))} />
            <GoldButton title={saving ? 'Saving...' : 'Save Changes'} onPress={handleSave} disabled={saving} />
          </>
        ) : (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>EMAIL</Text>
              <Text style={styles.detailValue}>{user?.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>FIRST NAME</Text>
              <Text style={styles.detailValue}>{user?.first_name || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>LAST NAME</Text>
              <Text style={styles.detailValue}>{user?.last_name || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PHONE</Text>
              <Text style={styles.detailValue}>{user?.phone || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ADDRESS</Text>
              <Text style={styles.detailValue}>{user?.address || '—'}</Text>
            </View>
          </>
        )}
      </View>

      <View style={[styles.section, { marginBottom: 40 }]}>
        <OutlineButton title="Sign Out" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: Colors.background },
  header:            { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  title:             { fontFamily: 'CormorantGaramond_300Light', fontSize: 38, color: Colors.textPrimary, letterSpacing: 4 },
  subtitle:          { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 4, color: Colors.gold, marginTop: 4 },
  avatarSection:     { alignItems: 'center', paddingVertical: 32, borderBottomWidth: 1, borderBottomColor: Colors.border },
  avatarWrapper:     { position: 'relative', marginBottom: 16 },
  avatar:            { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: Colors.gold },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  avatarInitials:    { fontFamily: 'CormorantGaramond_400Regular', fontSize: 32, color: Colors.gold },
  avatarEdit:        { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.gold, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  avatarEditText:    { fontSize: 14 },
  avatarLoading:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  userName:          { fontFamily: 'CormorantGaramond_400Regular', fontSize: 24, color: Colors.textPrimary, marginBottom: 4 },
  userEmail:         { fontFamily: 'Jost_300Light', fontSize: 12, color: Colors.textMuted },
  adminBadge:        { marginTop: 12, paddingVertical: 4, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.gold },
  adminBadgeText:    { fontFamily: 'Jost_500Medium', fontSize: 10, color: Colors.gold, letterSpacing: 3 },
  section:           { paddingHorizontal: 24, paddingTop: 32 },
  detailRow:         { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel:       { fontFamily: 'Jost_400Regular', fontSize: 10, color: Colors.textMuted, letterSpacing: 2 },
  detailValue:       { fontFamily: 'Jost_400Regular', fontSize: 13, color: Colors.textPrimary, maxWidth: '60%', textAlign: 'right' },
});