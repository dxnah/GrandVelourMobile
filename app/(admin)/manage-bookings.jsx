import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useBookings } from '../../hooks/useBookings';
import { Feather } from '@expo/vector-icons';

export default function ManageBookingsScreen() {
  const router = useRouter();
  const { bookings, loading, cancelBooking } = useBookings(true); // true = fetch all bookings (admin)

  const handleCancel = (id) => {
    Alert.alert('Cancel Booking', 'Cancel this reservation?', [
      { text: 'No',  style: 'cancel' },
      { text: 'Cancel Booking', style: 'destructive', onPress: () => cancelBooking(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={Colors.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>All Bookings</Text>
      </View>

      {loading && <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />}

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.guestName}>{item.client?.name || 'Guest'}</Text>
              <Text style={styles.roomInfo}>Room {item.room?.room_number} · {item.room?.room_type}</Text>
              <Text style={styles.dates}>{item.check_in} → {item.check_out}</Text>
              <View style={[styles.statusBadge, { borderColor: item.status === 'confirmed' ? Colors.success : Colors.error }]}>
                <Text style={[styles.statusText, { color: item.status === 'confirmed' ? Colors.success : Colors.error }]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
            {item.status === 'confirmed' && (
              <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.actionBtn}>
                <Feather name="x-circle" size={18} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>No bookings found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  header:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24, gap: 16 },
  backBtn:     { padding: 4 },
  title:       { fontFamily: 'CormorantGaramond_400Regular', fontSize: 28, color: Colors.textPrimary },
  list:        { paddingHorizontal: 24, paddingBottom: 32 },
  card:        { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, padding: 20, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  guestName:   { fontFamily: 'CormorantGaramond_400Regular', fontSize: 20, color: Colors.textPrimary, marginBottom: 4 },
  roomInfo:    { fontFamily: 'Jost_400Regular', fontSize: 11, color: Colors.textMuted, letterSpacing: 1, marginBottom: 4 },
  dates:       { fontFamily: 'Jost_300Light', fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  statusBadge: { alignSelf: 'flex-start', borderWidth: 1, paddingVertical: 2, paddingHorizontal: 10 },
  statusText:  { fontFamily: 'Jost_500Medium', fontSize: 9, letterSpacing: 2 },
  actionBtn:   { padding: 8 },
  emptyText:   { fontFamily: 'Jost_300Light', fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginTop: 40 },
});