import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useBookings } from '../../hooks/useBookings';
import BookingCard from '../../components/ui/BookingCard';
import GoldButton from '../../components/ui/GoldButton';
import SectionHeader from '../../components/ui/SectionHeader';

export default function BookingsScreen() {
  const { bookings, loading, error, cancelBooking } = useBookings();

  const handleCancel = (id) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No',  style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelBooking(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>YOUR RESERVATIONS</Text>
      </View>

      {loading && <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />}
      {error   && <Text style={styles.errorText}>Could not load bookings.</Text>}

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookingCard booking={item} onCancel={() => handleCancel(item.id)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🛏️</Text>
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptyText}>Browse our rooms to make your first reservation.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.background },
  header:     { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  title:      { fontFamily: 'CormorantGaramond_300Light', fontSize: 38, color: Colors.textPrimary, letterSpacing: 4 },
  subtitle:   { fontFamily: 'Jost_300Light', fontSize: 10, letterSpacing: 4, color: Colors.gold, marginTop: 4 },
  list:       { paddingHorizontal: 24, paddingBottom: 32 },
  errorText:  { fontFamily: 'Jost_400Regular', fontSize: 13, color: Colors.error, textAlign: 'center', marginTop: 40 },
  emptyBox:   { alignItems: 'center', marginTop: 60 },
  emptyIcon:  { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontFamily: 'CormorantGaramond_400Regular', fontSize: 24, color: Colors.textPrimary, marginBottom: 8 },
  emptyText:  { fontFamily: 'Jost_300Light', fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
});