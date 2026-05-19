import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { Feather } from '@expo/vector-icons';

const adminCards = [
  { icon: 'grid',     title: 'Manage Rooms',    subtitle: 'Add, edit, delete rooms',    route: '/(admin)/manage-rooms' },
  { icon: 'calendar', title: 'All Bookings',     subtitle: 'View and manage reservations', route: '/(admin)/manage-bookings' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Panel</Text>
          <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Feather name="log-out" size={18} color={Colors.gold} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MANAGEMENT</Text>
        {adminCards.map((card, i) => (
          <TouchableOpacity key={i} style={styles.card} onPress={() => router.push(card.route)}>
            <View style={styles.cardIcon}>
              <Feather name={card.icon} size={22} color={Colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>
            <Text style={styles.cardArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  header:       { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting:     { fontFamily: 'Jost_300Light', fontSize: 11, letterSpacing: 4, color: Colors.gold, marginBottom: 6 },
  name:         { fontFamily: 'CormorantGaramond_400Regular', fontSize: 28, color: Colors.textPrimary },
  email:        { fontFamily: 'Jost_300Light', fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  logoutBtn:    { padding: 8, borderWidth: 1, borderColor: Colors.border },
  divider:      { height: 1, backgroundColor: Colors.border, marginHorizontal: 24 },
  section:      { padding: 24 },
  sectionLabel: { fontFamily: 'Jost_400Regular', fontSize: 10, letterSpacing: 3, color: Colors.textMuted, marginBottom: 16 },
  card:         { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: Colors.border, gap: 16 },
  cardIcon:     { width: 44, height: 44, borderWidth: 1, borderColor: Colors.borderGold, justifyContent: 'center', alignItems: 'center' },
  cardTitle:    { fontFamily: 'CormorantGaramond_400Regular', fontSize: 20, color: Colors.textPrimary, marginBottom: 2 },
  cardSubtitle: { fontFamily: 'Jost_300Light', fontSize: 11, color: Colors.textMuted },
  cardArrow:    { color: Colors.gold, fontSize: 18 },
});